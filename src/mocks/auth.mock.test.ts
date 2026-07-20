// ============================================================
//  Unit tests — mockLoginUser() & mockRegisterUser()
//  Đây là code thực sự chạy khi VITE_USE_MOCK_AUTH=true.
// ============================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockLoginUser, mockRegisterUser, MOCK_CREDENTIALS } from './auth.mock'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

async function runMockLogin(email: string, password: string) {
  const promise = mockLoginUser(email, password)
  await vi.advanceTimersByTimeAsync(500)
  return promise
}

describe('mockLoginUser', () => {
  it.each(MOCK_CREDENTIALS)(
    'đăng nhập thành công với tài khoản seed $email',
    async (cred) => {
      const result = await runMockLogin(cred.email, cred.password)

      expect(result.email).toBe(cred.email)
      expect(result.role).toBe(cred.result.role)
      expect(result.fullName).toBe(cred.result.fullName)
      expect(result.accessToken).toBeTruthy()
      expect(result.refreshToken).toBeTruthy()
    },
  )

  it('reject khi sai mật khẩu', async () => {
    const assertion = expect(
      mockLoginUser('admin@relief.vn', 'sai-mat-khau'),
    ).rejects.toThrow('Email hoặc mật khẩu không đúng.')
    await vi.advanceTimersByTimeAsync(500)

    await assertion
  })

  it('reject khi email không tồn tại', async () => {
    const assertion = expect(
      mockLoginUser('khong-ton-tai@relief.vn', 'Pass@123'),
    ).rejects.toThrow('Email hoặc mật khẩu không đúng.')
    await vi.advanceTimersByTimeAsync(500)

    await assertion
  })

  it('làm mới expiresAt mỗi lần đăng nhập (khoảng 1 giờ kể từ hiện tại)', async () => {
    const before = Date.now()
    const result = await runMockLogin('admin@relief.vn', 'Admin@123')
    const expiresAt = new Date(result.expiresAt).getTime()

    expect(expiresAt).toBeGreaterThan(before)
    expect(expiresAt - before).toBeLessThanOrEqual(60 * 60 * 1000 + 1000)
  })
})

describe('mockRegisterUser', () => {
  it('luôn thành công và trả về role Requester', async () => {
    const promise = mockRegisterUser()
    await vi.advanceTimersByTimeAsync(500)
    const result = await promise

    expect(result.role).toBe('Requester')
    expect(result.userId).toMatch(/^mock-/)
    expect(result.accessToken).toBeTruthy()
    expect(result.refreshToken).toBeTruthy()
  })
})
