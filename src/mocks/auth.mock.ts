// ============================================================
//  Mock Auth Data – dùng để test trước khi connect backend
//  ĐỔI sang real API: xem src/features/auth/auth.api.ts
// ============================================================

import type { AuthUser, AuthResponse, UserRole } from '@/features/auth/auth.types'

// ── Mock user database ───────────────────────────────────────
interface MockCredential {
  id: string
  identifier: string   // email hoặc phone
  password: string
  user: AuthUser
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    id: '1',
    identifier: 'admin@relief.vn',
    password: '123456',
    user: {
      id: '1',
      fullName: 'Nguyễn Quản Trị',
      email: 'admin@relief.vn',
      phone: '0901000001',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=c53030&fontColor=fff',
    },
  },
  {
    id: '2',
    identifier: 'coordinator@relief.vn',
    password: '123456',
    user: {
      id: '2',
      fullName: 'Trần Điều Phối',
      email: 'coordinator@relief.vn',
      phone: '0902000002',
      role: 'coordinator',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Coordinator&backgroundColor=2b6cb0&fontColor=fff',
    },
  },
  {
    id: '3',
    identifier: 'volunteer@relief.vn',
    password: '123456',
    user: {
      id: '3',
      fullName: 'Lê Tình Nguyện',
      email: 'volunteer@relief.vn',
      phone: '0903000003',
      role: 'volunteer',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Volunteer&backgroundColor=276749&fontColor=fff',
    },
  },
  {
    id: '4',
    identifier: 'requester@relief.vn',
    password: '123456',
    user: {
      id: '4',
      fullName: 'Phạm Yêu Cầu',
      email: 'requester@relief.vn',
      phone: '0904000004',
      role: 'requester',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Requester&backgroundColor=975a16&fontColor=fff',
    },
  },
]

/** Delay giả lập network latency (ms) */
const MOCK_DELAY = 600

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Mock API functions ───────────────────────────────────────

/**
 * Mock login – tìm user theo identifier + password
 * Thay thế bằng real API khi backend sẵn sàng
 */
export async function mockLoginUser(
  identifier: string,
  password: string,
): Promise<AuthResponse> {
  await delay(MOCK_DELAY)

  const found = MOCK_CREDENTIALS.find(
    (c) =>
      (c.identifier === identifier || c.user.phone === identifier) &&
      c.password === password,
  )

  if (!found) {
    throw new Error('Email/SĐT hoặc mật khẩu không đúng')
  }

  // Tạo fake JWT token chứa role để dễ debug
  const fakeToken = btoa(
    JSON.stringify({ sub: found.id, role: found.user.role, exp: Date.now() + 86_400_000 }),
  )

  return { token: fakeToken, user: found.user }
}

/**
 * Mock register – luôn thành công
 */
export async function mockRegisterUser(): Promise<AuthResponse> {
  await delay(MOCK_DELAY)
  const newUser: AuthUser = {
    id: String(Date.now()),
    fullName: 'Người Dùng Mới',
    email: 'new@relief.vn',
    role: 'requester',
  }
  const fakeToken = btoa(JSON.stringify({ sub: newUser.id, role: newUser.role }))
  return { token: fakeToken, user: newUser }
}

// ── Helper: decode mock token ────────────────────────────────
export function decodeMockToken(token: string): { role: UserRole } | null {
  try {
    return JSON.parse(atob(token)) as { role: UserRole }
  } catch {
    return null
  }
}

// ── Test account summary (dùng trong LoginView hint) ─────────
export const MOCK_ACCOUNTS = MOCK_CREDENTIALS.map((c) => ({
  role: c.user.role as UserRole,
  email: c.identifier,
  password: c.password,
  name: c.user.fullName,
}))
