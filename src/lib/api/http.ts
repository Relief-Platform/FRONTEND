// ============================================================
//  Axios instance – single HTTP client cho toàn bộ app
//  Interceptors: gắn Bearer token + BÓC ApiResponse envelope
//
//  BE bọc MỌI response trong envelope (API Reference mục 3):
//  { statusCode, isSuccess, errorMessages, result }
//  → Bóc tại đây 1 lần duy nhất, các file *.api.ts nhận thẳng
//    data thật trong `result`, không phải tự bóc.
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

// ── ApiResponse envelope của BE ─────────────────────────────
interface ApiEnvelope<T = unknown> {
  statusCode: number
  isSuccess: boolean
  errorMessages: string[] | null
  result: T
}

function isEnvelope(x: unknown): x is ApiEnvelope {
  return (
    typeof x === 'object' &&
    x !== null &&
    'isSuccess' in x &&
    'result' in x
  )
}

// ── Axios instance ───────────────────────────────────────────
export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // 30s: hosting free có cold start, request đầu tiên có thể rất chậm
  // (API Reference mục 8)
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

// ── Response interceptor ────────────────────────────────────
// BE có thể trả message qua nhiều field khác nhau
type BeErrorBody = {
  // Envelope chuẩn
  isSuccess?: boolean
  errorMessages?: string[] | null
  // Các format cũ / .NET mặc định (giữ lại phòng hờ)
  message?: string
  error?: string
  title?: string
  errors?: Record<string, string[]>
}

http.interceptors.response.use(
  (response) => {
    // Bóc envelope: response.data = envelope.result
    if (isEnvelope(response.data)) {
      const envelope = response.data

      // HTTP 200 nhưng isSuccess=false → vẫn coi là lỗi
      if (envelope.isSuccess === false) {
        const msg = envelope.errorMessages?.[0] ?? 'Yêu cầu thất bại'
        return Promise.reject(
          new ApiError(envelope.statusCode || response.status, msg, envelope),
        )
      }

      response.data = envelope.result
    }
    return response
  },
  (error: AxiosError<BeErrorBody>) => {
    const status = error.response?.status ?? 0
    const body = error.response?.data

    // Ưu tiên: errorMessages (envelope) > message > error > title
    // > validation errors > network error
    // Lưu ý: 401/403 chặn ở tầng Policy có thể KHÔNG có body (mục 3)
    let message: string
    if (body?.errorMessages && body.errorMessages.length > 0) {
      message = body.errorMessages.join(' | ')
    } else if (body?.message) {
      message = body.message
    } else if (body?.error) {
      message = body.error
    } else if (body?.title) {
      message = body.title
    } else if (body?.errors) {
      // .NET validation errors: { "Email": ["Email is invalid"] }
      const firstField = Object.values(body.errors)[0]
      message = Array.isArray(firstField) ? firstField[0] : 'Dữ liệu không hợp lệ'
    } else if (status === 401) {
      message = 'Phiên đăng nhập hết hạn hoặc chưa đăng nhập'
    } else if (status === 403) {
      message = 'Bạn không có quyền thực hiện thao tác này'
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