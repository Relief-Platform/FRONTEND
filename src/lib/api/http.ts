// ============================================================
//  Axios instance – single HTTP client cho toàn bộ app
//  Interceptors tự động gắn Bearer token + xử lý lỗi chuẩn
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
// BE có thể trả message qua nhiều field khác nhau
type BeErrorBody = {
  message?: string
  error?: string
  title?: string
  errors?: Record<string, string[]>
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BeErrorBody>) => {
    const status = error.response?.status ?? 0
    const body = error.response?.data

    // Ưu tiên: message > error > title > validation errors > network error
    let message: string
    if (body?.message) {
      message = body.message
    } else if (body?.error) {
      message = body.error
    } else if (body?.title) {
      message = body.title
    } else if (body?.errors) {
      // .NET validation errors: { "Email": ["Email is invalid"] }
      const firstField = Object.values(body.errors)[0]
      message = Array.isArray(firstField) ? firstField[0] : 'Dữ liệu không hợp lệ'
    } else {
      message = error.message ?? 'Không thể kết nối đến máy chủ'
    }

    // 401 → xoá token và redirect về trang login
    if (status === 401) {
      tokenStorage.clearAll()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(new ApiError(status, message, body))
  },
)
