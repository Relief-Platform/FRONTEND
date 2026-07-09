// ============================================================
//  Auth – TypeScript interfaces & Role definitions
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
export interface LoginPayload {
  Identifier: string // Email hoặc số điện thoại
  Password: string
}

export interface RegisterPayload {
  FullName: string
  Email: string
  Phone: string
  Password: string
  ConfirmPassword: string
  Gender?: string
  DateOfBirth?: string
  Province?: string
  District?: string
  Address?: string
}

// ── Models ───────────────────────────────────────────────────
export interface AuthUser {
  id: string | number
  fullName: string
  email: string
  phone?: string
  role: UserRole        // bắt buộc có role (không còn optional)
  avatar?: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
