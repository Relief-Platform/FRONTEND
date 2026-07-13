// ============================================================
//  Axios instance – single HTTP client cho toàn bộ app
//  BE: https://disasterrelief-api.runasp.net
//  ⚠️ Cold start trên free tier có thể chậm, timeout 30s
// ============================================================

import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { API_BASE_URL } from '@/config/env'
import { tokenStorage } from './token-storage'

// ── Custom error class ───────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── Axios instance ───────────────────────────────────────────
export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // 30s để xử lý cold start của Render free tier
  // (request đầu tiên sau thời gian dài không gọi có thể mất 10-20s)
  timeout: 30_000,
})

// ── Request interceptor: gắn Authorization header ───────────
http.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: chuẩn hoá lỗi → ApiError ─────────
/**
 * BE trả lỗi theo 2 dạng:
 *  1. Có body ApiResponse: { statusCode, isSuccess, errorMessages[], result: null }
 *     → khi lỗi phát sinh BÊN TRONG Handler (validation, business logic)
 *  2. Body rỗng (không có JSON):
 *     → khi bị chặn tầng [Authorize]/Policy (401/403 trước khi vào Controller)
 * FE phải kiểm tra response.status trước khi parse JSON.
 */
type BeApiResponse = {
  statusCode?: number
  isSuccess?: boolean
  errorMessages?: string[]
  result?: null
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BeApiResponse>) => {
    const status = error.response?.status ?? 0
    const body = error.response?.data

    let message: string

    // Ưu tiên errorMessages[] từ ApiResponse wrapper (định dạng thực tế của BE)
    if (body?.errorMessages && body.errorMessages.length > 0) {
      message = body.errorMessages.join(' | ')
    } else if (status === 401) {
      message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
    } else if (status === 403) {
      message = 'Bạn không có quyền thực hiện thao tác này.'
    } else if (status === 404) {
      message = 'Không tìm thấy tài nguyên yêu cầu.'
    } else if (status === 409) {
      message = 'Dữ liệu xung đột. Vui lòng tải lại và thử lại.'
    } else if (status === 0 || !error.response) {
      // Network error hoặc timeout
      message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
    } else {
      message = error.message ?? 'Đã có lỗi xảy ra.'
    }

    // 401 → xoá token và redirect về login
    // (body có thể rỗng — chỉ check status code)
    if (status === 401) {
      tokenStorage.clearAll()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(new ApiError(status, message, body))
  },
)
