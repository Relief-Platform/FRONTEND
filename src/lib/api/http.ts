// ============================================================
//  Axios instance – single HTTP client cho toàn bộ app
//  Interceptors tự động gắn Bearer token + xử lý 401
// ============================================================

import axios, { type AxiosError } from 'axios'
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
export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
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
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ??
      error.message ??
      'Không thể kết nối đến máy chủ'

    // 401 → xoá token (hết hạn / không hợp lệ)
    if (status === 401) {
      tokenStorage.remove()
      // Redirect về login nếu cần:
      // window.location.href = '/login'
    }

    return Promise.reject(new ApiError(status, message, error.response?.data))
  },
)
