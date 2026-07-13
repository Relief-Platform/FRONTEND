// ============================================================
//  Auth API — /api/auth
//  Base URL: https://disasterrelief-api.runasp.net
//  Mock mode: VITE_USE_MOCK_AUTH=true (.env.local)
//  Real mode: VITE_USE_MOCK_AUTH=false
// ============================================================

import { http } from '@/lib/api/http'
import { mockLoginUser, mockRegisterUser } from '@/mocks/auth.mock'
import type {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  RefreshTokenPayload,
  ChangePasswordPayload,
  LogoutPayload,
  LoginResult,
  AuthUser,
  RefreshResult,
  MeResult,
} from './auth.types'

/** true → dùng mock data; false → gọi real backend */
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// ── Helper: unwrap ApiResponse<T> ────────────────────────────
/**
 * Mọi response BE đều bọc trong ApiResponse<T>.
 * Hàm này kiểm tra isSuccess và trả về result, hoặc ném lỗi với errorMessages.
 */
function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.result === null) {
    const msg = response.errorMessages.length > 0
      ? response.errorMessages.join(' | ')
      : 'Đã có lỗi xảy ra'
    throw new Error(msg)
  }
  return response.result
}

// ── POST /api/auth/login ──────────────────────────────────────
/**
 * Đăng nhập — nhận accessToken + refreshToken.
 * accessToken hết hạn sau 60 phút.
 * Body: { email, password }
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  if (USE_MOCK) return mockLoginUser(email, password)

  const payload: LoginPayload = { email, password }
  const { data } = await http.post<ApiResponse<LoginResult>>('/auth/login', payload)
  return unwrap(data)
}

// ── POST /api/auth/register ───────────────────────────────────
/**
 * Đăng ký tài khoản mới — role mặc định là "Requester".
 * Body: { email, password, confirmPassword, fullName }
 */
export async function registerUser(
  userData: RegisterPayload,
): Promise<LoginResult> {
  if (USE_MOCK) return mockRegisterUser()

  const { data } = await http.post<ApiResponse<LoginResult>>('/auth/register', userData)
  return unwrap(data)
}

// ── POST /api/auth/refresh-token ──────────────────────────────
/**
 * Làm mới accessToken bằng refreshToken còn hạn (7 ngày).
 * Gọi khi nhận 401 do accessToken hết hạn (60 phút).
 * Không cần Authorization header.
 * Body: { refreshToken }
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResult> {
  const payload: RefreshTokenPayload = { refreshToken }
  const { data } = await http.post<ApiResponse<RefreshResult>>('/auth/refresh-token', payload)
  return unwrap(data)
}

// ── POST /api/auth/logout ─────────────────────────────────────
/**
 * Thu hồi 1 refreshToken phía server.
 * Theo spec BE: gửi refreshToken trong body để blacklist.
 * 🔒 Không cần đăng nhập (theo bảng endpoint trong API-Reference-FE.md).
 */
export async function logoutUser(refreshToken: string): Promise<void> {
  if (USE_MOCK) return
  const payload: LogoutPayload = { refreshToken }
  await http.post('/auth/logout', payload)
}

// ── GET /api/auth/me ──────────────────────────────────────────
/**
 * Lấy thông tin user hiện tại từ JWT claim.
 * 🔒 Yêu cầu Authorization: Bearer <accessToken>
 */
export async function getMe(): Promise<MeResult> {
  const { data } = await http.get<ApiResponse<MeResult>>('/auth/me')
  return unwrap(data)
}

// ── POST /api/auth/change-password ───────────────────────────
/**
 * Đổi mật khẩu tài khoản hiện tại.
 * 🔒 Yêu cầu Authorization: Bearer <accessToken>
 * Body: { currentPassword, newPassword, confirmNewPassword }
 */
export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  const { data } = await http.post<ApiResponse<null>>('/auth/change-password', payload)
  // Chỉ kiểm tra lỗi — result null là bình thường với action không trả data
  if (!data.isSuccess) {
    const msg = data.errorMessages.length > 0
      ? data.errorMessages.join(' | ')
      : 'Đổi mật khẩu thất bại'
    throw new Error(msg)
  }
}

// ── Alias: map LoginResult → AuthUser ────────────────────────
/**
 * Chuyển LoginResult (BE response) thành AuthUser (FE store format).
 * Dùng sau login/register/refresh để lưu vào store.
 */
export function toAuthUser(result: LoginResult): AuthUser {
  return {
    userId:    result.userId,
    fullName:  result.fullName,
    email:     result.email,
    role:      result.role,
    expiresAt: result.expiresAt,
  }
}
