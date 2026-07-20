// ============================================================
//  Unit tests — loginUser() & registerUser() (real-backend mode)
//  VITE_USE_MOCK_AUTH is unset under Vitest (mode "test" skips
//  .env.local), so auth.api.ts takes the http.post() branch by
//  default. http is mocked so no network call is ever made.
// ============================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { LoginResult, RegisterPayload } from './auth.types'

vi.mock('@/lib/api/http', () => ({
  http: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import { http } from '@/lib/api/http'
import { loginUser, registerUser } from './auth.api'

const mockedPost = http.post as unknown as ReturnType<typeof vi.fn>

const loginResult: LoginResult = {
  userId: '2e2e12d0-eaf1-44a7-a8cf-08dedfe3aa11',
  fullName: 'System Administrator',
  email: 'admin@relief.vn',
  role: 'Admin',
  accessToken: 'access.token',
  refreshToken: 'refresh.token',
  expiresAt: '2026-07-17T03:10:44.77Z',
}

beforeEach(() => {
  mockedPost.mockReset()
})

describe('loginUser', () => {
  it('gửi đúng endpoint + body và trả về result khi http.ts đã bóc envelope', async () => {
    mockedPost.mockResolvedValue({ data: loginResult })

    const result = await loginUser('admin@relief.vn', 'Admin@123')

    expect(mockedPost).toHaveBeenCalledWith('/auth/login', {
      email: 'admin@relief.vn',
      password: 'Admin@123',
    })
    expect(result).toEqual(loginResult)
  })

  it('bóc được result khi data vẫn còn nguyên envelope', async () => {
    mockedPost.mockResolvedValue({
      data: {
        statusCode: 200,
        isSuccess: true,
        errorMessages: [],
        result: loginResult,
      },
    })

    const result = await loginUser('admin@relief.vn', 'Admin@123')

    expect(result).toEqual(loginResult)
  })

  it('throw lỗi với message từ errorMessages khi envelope isSuccess=false', async () => {
    mockedPost.mockResolvedValue({
      data: {
        statusCode: 401,
        isSuccess: false,
        errorMessages: ['Email hoặc mật khẩu không đúng.'],
        result: null,
      },
    })

    await expect(loginUser('admin@relief.vn', 'wrong')).rejects.toThrow(
      'Email hoặc mật khẩu không đúng.',
    )
  })

  it('throw lỗi mặc định khi envelope thất bại nhưng không có errorMessages', async () => {
    mockedPost.mockResolvedValue({
      data: { statusCode: 400, isSuccess: false, errorMessages: [], result: null },
    })

    await expect(loginUser('admin@relief.vn', 'wrong')).rejects.toThrow(
      'Đã có lỗi xảy ra',
    )
  })
})

describe('registerUser', () => {
  const payload: RegisterPayload = {
    email: 'new@relief.vn',
    password: 'Pass@123',
    confirmPassword: 'Pass@123',
    fullName: 'Người Dùng Mới',
  }

  it('gửi đúng endpoint + payload và trả về result khi thành công', async () => {
    const registerResult: LoginResult = { ...loginResult, role: 'Requester', email: payload.email }
    mockedPost.mockResolvedValue({ data: registerResult })

    const result = await registerUser(payload)

    expect(mockedPost).toHaveBeenCalledWith('/auth/register', payload)
    expect(result).toEqual(registerResult)
  })

  it('throw lỗi với message từ errorMessages khi đăng ký thất bại', async () => {
    mockedPost.mockResolvedValue({
      data: {
        statusCode: 409,
        isSuccess: false,
        errorMessages: ['Email đã được sử dụng.'],
        result: null,
      },
    })

    await expect(registerUser(payload)).rejects.toThrow('Email đã được sử dụng.')
  })
})

describe('chế độ mock (VITE_USE_MOCK_AUTH=true)', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv('VITE_USE_MOCK_AUTH', 'true')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('loginUser gọi mockLoginUser thay vì http.post', async () => {
    vi.doMock('@/mocks/auth.mock', () => ({
      mockLoginUser: vi.fn().mockResolvedValue(loginResult),
      mockRegisterUser: vi.fn().mockResolvedValue(loginResult),
    }))

    const { loginUser: loginUserMockMode } = await import('./auth.api')
    const { mockLoginUser } = await import('@/mocks/auth.mock')

    const result = await loginUserMockMode('admin@relief.vn', 'Admin@123')

    expect(mockLoginUser).toHaveBeenCalledWith('admin@relief.vn', 'Admin@123')
    expect(result).toEqual(loginResult)
  })

  it('registerUser gọi mockRegisterUser thay vì http.post', async () => {
    vi.doMock('@/mocks/auth.mock', () => ({
      mockLoginUser: vi.fn().mockResolvedValue(loginResult),
      mockRegisterUser: vi.fn().mockResolvedValue(loginResult),
    }))

    const { registerUser: registerUserMockMode } = await import('./auth.api')
    const { mockRegisterUser } = await import('@/mocks/auth.mock')

    const result = await registerUserMockMode({
      email: 'new@relief.vn',
      password: 'Pass@123',
      confirmPassword: 'Pass@123',
      fullName: 'Người Dùng Mới',
    })

    expect(mockRegisterUser).toHaveBeenCalled()
    expect(result).toEqual(loginResult)
  })
})
