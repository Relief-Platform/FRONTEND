// ============================================================
//  Mock Auth Data – test khi chưa connect backend
//  Format khớp BE thực tế: LoginResult (không phải AuthResponse cũ)
//  Seed account thật trên Production: admin@relief.vn / Admin@123
// ============================================================

import type { LoginResult, AuthUser, UserRole } from '@/features/auth/auth.types'

// ── Mock credentials ─────────────────────────────────────────
interface MockCredential {
  email: string
  password: string
  result: LoginResult  // khớp với response thật của BE
}

// Mật khẩu mock dùng "Pass@123" để đúng format yêu cầu độ phức tạp
export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    email:    'admin@relief.vn',
    password: 'Admin@123',   // đúng password seed thật trên BE
    result: {
      userId:       '2e2e12d0-eaf1-44a7-a8cf-08dedfe3aa11', // seed GUID thật từ BE
      fullName:     'System Administrator',
      email:        'admin@relief.vn',
      role:         'Admin',
      accessToken:  'mock.admin.access.token',
      refreshToken: 'mock.admin.refresh.token',
      expiresAt:    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  },
  {
    email:    'volunteer@relief.vn',
    password: 'Pass@123',
    result: {
      userId:       '33333333-3333-3333-3333-333333333333',
      fullName:     'Lê Tình Nguyện',
      email:        'volunteer@relief.vn',
      role:         'Volunteer',
      accessToken:  'mock.volunteer.access.token',
      refreshToken: 'mock.volunteer.refresh.token',
      expiresAt:    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  },
  {
    email:    'requester@relief.vn',
    password: 'Pass@123',
    result: {
      userId:       '44444444-4444-4444-4444-444444444444',
      fullName:     'Phạm Yêu Cầu',
      email:        'requester@relief.vn',
      role:         'Requester',
      accessToken:  'mock.requester.access.token',
      refreshToken: 'mock.requester.refresh.token',
      expiresAt:    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  },
  {
    email:    'warehouse@relief.vn',
    password: 'Pass@123',
    result: {
      userId:       '55555555-5555-5555-5555-555555555555',
      fullName:     'Nguyễn Quản Kho',
      email:        'warehouse@relief.vn',
      role:         'WarehouseManager',
      accessToken:  'mock.warehouse.access.token',
      refreshToken: 'mock.warehouse.refresh.token',
      expiresAt:    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  },
]

const MOCK_DELAY = 500
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Mock API functions ───────────────────────────────────────

/**
 * Mock login — tìm credential theo email + password.
 * Trả LoginResult khớp format BE thực tế.
 */
export async function mockLoginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  await delay(MOCK_DELAY)

  const found = MOCK_CREDENTIALS.find(
    (c) => c.email === email && c.password === password,
  )

  if (!found) {
    throw new Error('Email hoặc mật khẩu không đúng.')
  }

  // Làm mới expiresAt mỗi lần "login"
  return {
    ...found.result,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }
}

/**
 * Mock register — luôn thành công, trả về user Requester mới.
 */
export async function mockRegisterUser(): Promise<LoginResult> {
  await delay(MOCK_DELAY)
  return {
    userId:       `mock-${Date.now()}-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
    fullName:     'Người Dùng Mới',
    email:        'new@relief.vn',
    role:         'Requester',
    accessToken:  'mock.new.access.token',
    refreshToken: 'mock.new.refresh.token',
    expiresAt:    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }
}

// ── Test account list (dùng trong LoginView hint panel) ──────
export const MOCK_ACCOUNTS = MOCK_CREDENTIALS.map((c) => ({
  role:     c.result.role as UserRole,
  email:    c.email,
  password: c.password,
  name:     c.result.fullName,
}))

// ── Không cần export AuthUser riêng — dùng toAuthUser() trong auth.api.ts
