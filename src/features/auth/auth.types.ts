// ============================================================
//  Auth – TypeScript interfaces & Role definitions
//  Sync với BE spec: tất cả ID là GUID string
// ============================================================

// ── Roles ────────────────────────────────────────────────────
export type UserRole = 'admin' | 'coordinator' | 'volunteer' | 'requester'

/** Tên hiển thị tiếng Việt */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin:       'Quản trị viên',
  coordinator: 'Điều phối viên',
  volunteer:   'Tình nguyện viên',
  requester:   'Người yêu cầu hỗ trợ',
}

/** Màu badge cho từng role */
export const ROLE_COLORS: Record<UserRole, string> = {
  admin:       '#c53030',  // đỏ
  coordinator: '#2b6cb0',  // xanh dương
  volunteer:   '#276749',  // xanh lá
  requester:   '#975a16',  // cam
}

/**
 * Thứ tự ưu tiên – role có số cao hơn có quyền hơn.
 * admin(4) > coordinator(3) > volunteer(2) > requester(1)
 */
export const ROLE_PRIORITY: Record<UserRole, number> = {
  admin:       4,
  coordinator: 3,
  volunteer:   2,
  requester:   1,
}

// ── Payloads ─────────────────────────────────────────────────

/** POST /api/auth/login */
export interface LoginPayload {
  identifier: string  // Email hoặc số điện thoại
  password: string
}

/** POST /api/auth/register */
export interface RegisterPayload {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  gender?: string
  dateOfBirth?: string  // ISO 8601: "1999-12-31"
  province?: string
  district?: string
  address?: string
}

/** POST /api/auth/change-password */
export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

/** POST /api/auth/refresh-token */
export interface RefreshTokenPayload {
  refreshToken: string
}

// ── Models ───────────────────────────────────────────────────

/**
 * Thông tin user trả về từ BE.
 * Field names khớp với JSON response của /api/auth/me và /api/auth/login
 */
export interface AuthUser {
  id: string          // GUID: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  fullName: string
  email: string
  phoneNumber?: string
  avatarUrl?: string | null  // nullable theo BE spec
  isActive?: boolean
  roleId: string      // GUID của role
  role: UserRole      // FE tự resolve từ roleId hoặc BE trả kèm
}

/**
 * Response từ /api/auth/login và /api/auth/register.
 * Gồm cả accessToken + refreshToken.
 */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

/** Response từ /api/auth/refresh-token */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}
