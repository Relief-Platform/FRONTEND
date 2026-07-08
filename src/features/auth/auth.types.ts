// ============================================================
//  Auth – TypeScript interfaces
// ============================================================

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

export interface AuthUser {
  id: string | number
  fullName: string
  email: string
  phone?: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
