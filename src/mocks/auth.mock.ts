// ============================================================
//  Mock Auth Data – dùng để test trước khi connect backend
//  ĐỔI sang real API: xem src/features/auth/auth.api.ts
//  Format khớp BE spec: GUID id, phoneNumber, avatarUrl,
//  accessToken + refreshToken
// ============================================================

import type { AuthUser, AuthResponse, UserRole } from '@/features/auth/auth.types'

// ── Mock user database ───────────────────────────────────────
interface MockCredential {
  identifier: string   // email hoặc phone
  password: string
  user: AuthUser
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    identifier: 'admin@relief.vn',
    password: '123456',
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      fullName: 'Nguyễn Quản Trị',
      email: 'admin@relief.vn',
      phoneNumber: '0901000001',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=c53030&fontColor=fff',
      isActive: true,
      roleId: 'aaaa0000-0000-0000-0000-000000000001',
      role: 'admin',
    },
  },
  {
    identifier: 'coordinator@relief.vn',
    password: '123456',
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      fullName: 'Trần Điều Phối',
      email: 'coordinator@relief.vn',
      phoneNumber: '0902000002',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Coordinator&backgroundColor=2b6cb0&fontColor=fff',
      isActive: true,
      roleId: 'aaaa0000-0000-0000-0000-000000000002',
      role: 'coordinator',
    },
  },
  {
    identifier: 'volunteer@relief.vn',
    password: '123456',
    user: {
      id: '33333333-3333-3333-3333-333333333333',
      fullName: 'Lê Tình Nguyện',
      email: 'volunteer@relief.vn',
      phoneNumber: '0903000003',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Volunteer&backgroundColor=276749&fontColor=fff',
      isActive: true,
      roleId: 'aaaa0000-0000-0000-0000-000000000003',
      role: 'volunteer',
    },
  },
  {
    identifier: 'requester@relief.vn',
    password: '123456',
    user: {
      id: '44444444-4444-4444-4444-444444444444',
      fullName: 'Phạm Yêu Cầu',
      email: 'requester@relief.vn',
      phoneNumber: '0904000004',
      avatarUrl: null,
      isActive: true,
      roleId: 'aaaa0000-0000-0000-0000-000000000004',
      role: 'requester',
    },
  },
]

/** Delay giả lập network latency (ms) */
const MOCK_DELAY = 600

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Mock API functions ───────────────────────────────────────

/**
 * Mock login – tìm user theo identifier + password
 * Trả về đúng format AuthResponse: { accessToken, refreshToken, user }
 */
export async function mockLoginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  await delay(MOCK_DELAY)

  const found = MOCK_CREDENTIALS.find(
    (c) =>
      (c.identifier === identifier || c.user.phoneNumber === identifier) &&
      c.password === password,
  )

  if (!found) {
    throw new Error('Email/SĐT hoặc mật khẩu không đúng')
  }

  // Tạo fake JWT (base64) chứa role và id để debug
  const fakePayload = btoa(
    JSON.stringify({ sub: found.user.id, role: found.user.role, exp: Date.now() + 86_400_000 }),
  )
  const fakeAccessToken  = `mock.${fakePayload}.access`
  const fakeRefreshToken = `mock.${fakePayload}.refresh`

  return {
    accessToken:  fakeAccessToken,
    refreshToken: fakeRefreshToken,
    user: found.user,
  }
}

/**
 * Mock register – luôn thành công, trả về user mặc định requester
 */
export async function mockRegisterUser(): Promise<AuthResponse> {
  await delay(MOCK_DELAY)
  const newUser: AuthUser = {
    id: `mock-${Date.now()}-xxxx-xxxx-xxxxxxxxxxxx`,
    fullName: 'Người Dùng Mới',
    email: 'new@relief.vn',
    phoneNumber: undefined,
    avatarUrl: null,
    isActive: true,
    roleId: 'aaaa0000-0000-0000-0000-000000000004',
    role: 'requester',
  }
  const fakePayload      = btoa(JSON.stringify({ sub: newUser.id, role: newUser.role }))
  const fakeAccessToken  = `mock.${fakePayload}.access`
  const fakeRefreshToken = `mock.${fakePayload}.refresh`

  return { accessToken: fakeAccessToken, refreshToken: fakeRefreshToken, user: newUser }
}

// ── Test account summary (dùng trong LoginView hint) ─────────
export const MOCK_ACCOUNTS = MOCK_CREDENTIALS.map((c) => ({
  role: c.user.role as UserRole,
  email: c.identifier,
  password: c.password,
  name: c.user.fullName,
}))
