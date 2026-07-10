// ============================================================
//  Auth Store – Pinia
//  Token + User + Role-based helpers
//  Sync với BE spec: accessToken + refreshToken, GUID id
// ============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tokenStorage } from '@/lib/api/token-storage'
import { loginUser, logoutUser, getMe } from '@/features/auth/auth.api'
import type { AuthUser, UserRole } from '@/features/auth/auth.types'
import { ROLE_PRIORITY } from '@/features/auth/auth.types'

const USER_KEY = 'auth_user'

/** Đọc user đã lưu từ localStorage (persist qua F5) */
function readPersistedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────
  const accessToken = ref<string | null>(tokenStorage.get())
  const user        = ref<AuthUser | null>(readPersistedUser())

  // ── Getters ────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)

  /** Role hiện tại; null nếu chưa đăng nhập */
  const role = computed<UserRole | null>(() => user.value?.role ?? null)

  /** Kiểm tra user có role cụ thể không */
  function hasRole(...roles: UserRole[]): boolean {
    return !!user.value && roles.includes(user.value.role)
  }

  /**
   * Kiểm tra user có quyền >= minRole theo hierarchy không
   * VD: isAtLeast('coordinator') → true nếu là coordinator hoặc admin
   */
  function isAtLeast(minRole: UserRole): boolean {
    if (!user.value) return false
    return ROLE_PRIORITY[user.value.role] >= ROLE_PRIORITY[minRole]
  }

  const isAdmin       = computed(() => hasRole('admin'))
  const isCoordinator = computed(() => hasRole('coordinator'))
  const isVolunteer   = computed(() => hasRole('volunteer'))
  const isRequester   = computed(() => hasRole('requester'))

  // ── Actions ────────────────────────────────────────────────

  /**
   * Đăng nhập — lưu cả accessToken + refreshToken
   */
  async function login(identifier: string, password: string): Promise<void> {
    const result = await loginUser(identifier, password)

    accessToken.value = result.accessToken
    user.value        = result.user

    tokenStorage.set(result.accessToken)
    tokenStorage.setRefresh(result.refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
  }

  /**
   * Đăng xuất — gọi BE blacklist token, xoá local storage
   */
  async function logout(): Promise<void> {
    try { await logoutUser() } catch { /* ignore server error */ }

    accessToken.value = null
    user.value        = null

    tokenStorage.clearAll()
    localStorage.removeItem(USER_KEY)
  }

  /**
   * Lấy thông tin user mới nhất từ /api/auth/me
   * Dùng sau khi F5 để đảm bảo data luôn sync với BE
   */
  async function fetchMe(): Promise<void> {
    try {
      const freshUser = await getMe()
      user.value = freshUser
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
    } catch {
      // Token hết hạn → http interceptor sẽ redirect /login
    }
  }

  /** Cập nhật thông tin user cục bộ (sau khi edit profile) */
  function updateUser(partial: Partial<AuthUser>): void {
    if (!user.value) return
    user.value = { ...user.value, ...partial }
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  return {
    // state
    accessToken, user,
    // computed
    isLoggedIn, role,
    isAdmin, isCoordinator, isVolunteer, isRequester,
    // methods
    hasRole, isAtLeast, login, logout, fetchMe, updateUser,
  }
})
