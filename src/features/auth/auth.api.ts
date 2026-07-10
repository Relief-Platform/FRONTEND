// ============================================================
//  Auth API — /api/auth
//  Tự động dùng MOCK khi VITE_USE_MOCK_AUTH=true (.env.local)
//  Khi backend sẵn sàng: đặt VITE_USE_MOCK_AUTH=false
// ============================================================

import { http } from '@/lib/api/http'
import { mockLoginUser, mockRegisterUser } from '@/mocks/auth.mock'
import type {
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  RefreshTokenPayload,
  AuthResponse,
  AuthUser,
  RefreshTokenResponse,
} from './auth.types'

/** true → dùng mock data; false → gọi real backend */
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// ── POST /api/auth/login ──────────────────────────────────────
/**
 * Đăng nhập người dùng.
 * Body: { identifier, password }
 * Response: { accessToken, refreshToken, user }
 */
export async function loginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  if (USE_MOCK) return mockLoginUser(identifier, password)

  const payload: LoginPayload = { identifier, password }
  const { data } = await http.post<AuthResponse>('/auth/login', payload)
  return data
}

// ── POST /api/auth/register ───────────────────────────────────
/**
 * Đăng ký người dùng mới.
 * Body: RegisterPayload (camelCase, khớp BE)
 * Response: { accessToken, refreshToken, user }
 */
export async function registerUser(
  userData: RegisterPayload,
): Promise<AuthResponse> {
  if (USE_MOCK) return mockRegisterUser()

  const { data } = await http.post<AuthResponse>('/auth/register', userData)
  return data
}

// ── POST /api/auth/refresh-token ──────────────────────────────
/**
 * Làm mới access token bằng refresh token.
 * 🔒 Không cần Authorization header (dùng refreshToken trong body)
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const payload: RefreshTokenPayload = { refreshToken }
  const { data } = await http.post<RefreshTokenResponse>('/auth/refresh-token', payload)
  return data
}

// ── POST /api/auth/logout ─────────────────────────────────────
/**
 * Đăng xuất phía server (blacklist token).
 * 🔒 Yêu cầu Authorization: Bearer <accessToken>
 */
export async function logoutUser(): Promise<void> {
  if (USE_MOCK) return
  await http.post('/auth/logout')
}

// ── GET /api/auth/me ──────────────────────────────────────────
/**
 * Lấy thông tin user đang đăng nhập.
 * 🔒 Yêu cầu Authorization: Bearer <accessToken>
 * Response: AuthUser
 */
export async function getMe(): Promise<AuthUser> {
  const { data } = await http.get<AuthUser>('/auth/me')
  return data
}

// ── POST /api/auth/change-password ───────────────────────────
/**
 * Đổi mật khẩu.
 * 🔒 Yêu cầu Authorization: Bearer <accessToken>
 * Body: { currentPassword, newPassword, confirmNewPassword }
 */
export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await http.post('/auth/change-password', payload)
}

// ── Google OAuth (redirect) ───────────────────────────────────
/**
 * Đăng nhập bằng Google OAuth — redirect sang BE xử lý.
 */
export function loginWithGoogle(): void {
  if (USE_MOCK) {
    alert('[MOCK] Google OAuth chưa hỗ trợ trong chế độ mock')
    return
  }
  window.location.href = `${http.defaults.baseURL}/auth/google`
}
