// ============================================================
//  Auth API – migrate từ src/api/auth.js + register.js
//  Dùng axios instance thay cho fetch trực tiếp
// ============================================================

import { http } from '@/lib/api/http'
import type { LoginPayload, RegisterPayload, AuthResponse } from './auth.types'

/**
 * Đăng nhập người dùng
 * POST /api/auth/login
 */
export async function loginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  const payload: LoginPayload = { Identifier: identifier, Password: password }
  const { data } = await http.post<AuthResponse>('/auth/login', payload)
  return data
}

/**
 * Đăng ký người dùng mới
 * POST /api/auth/register
 */
export async function registerUser(
  userData: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/register', userData)
  return data
}

/**
 * Đăng nhập bằng Google OAuth (redirect)
 * Backend C# sẽ xử lý OAuth và callback về frontend
 */
export function loginWithGoogle(): void {
  // http.defaults.baseURL đã được set từ env.ts
  window.location.href = `${http.defaults.baseURL}/auth/google`
}
