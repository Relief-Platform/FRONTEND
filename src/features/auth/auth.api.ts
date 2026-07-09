// ============================================================
//  Auth API
//  Tự động dùng MOCK khi VITE_USE_MOCK_AUTH=true (.env.local)
//  Khi backend sẵn sàng: đặt VITE_USE_MOCK_AUTH=false
// ============================================================

import { http } from '@/lib/api/http'
import { mockLoginUser, mockRegisterUser } from '@/mocks/auth.mock'
import type { LoginPayload, RegisterPayload, AuthResponse } from './auth.types'

/** true → dùng mock data; false → gọi real backend */
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// ── Login ─────────────────────────────────────────────────────
/**
 * Đăng nhập người dùng
 * POST /api/auth/login
 */
export async function loginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  if (USE_MOCK) return mockLoginUser(identifier, password)

  const payload: LoginPayload = { Identifier: identifier, Password: password }
  const { data } = await http.post<AuthResponse>('/auth/login', payload)
  return data
}

// ── Register ──────────────────────────────────────────────────
/**
 * Đăng ký người dùng mới
 * POST /api/auth/register
 */
export async function registerUser(
  userData: RegisterPayload,
): Promise<AuthResponse> {
  if (USE_MOCK) return mockRegisterUser()

  const { data } = await http.post<AuthResponse>('/auth/register', userData)
  return data
}

// ── Google OAuth ──────────────────────────────────────────────
/**
 * Đăng nhập bằng Google OAuth (redirect)
 * Backend C# sẽ xử lý OAuth và callback về frontend
 */
export function loginWithGoogle(): void {
  if (USE_MOCK) {
    alert('[MOCK] Google OAuth chưa hỗ trợ trong chế độ mock')
    return
  }
  window.location.href = `${http.defaults.baseURL}/auth/google`
}

// ── Refresh token (để sẵn khi backend cần) ───────────────────
/**
 * Refresh JWT token
 * POST /api/auth/refresh
 */
export async function refreshToken(token: string): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/refresh', { token })
  return data
}

// ── Logout (server-side invalidate nếu backend cần) ──────────
/**
 * Logout phía server (blacklist token)
 * POST /api/auth/logout
 */
export async function logoutUser(): Promise<void> {
  if (USE_MOCK) return
  await http.post('/auth/logout')
}
