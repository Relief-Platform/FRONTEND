// ============================================================
//  Auth Store – Pinia
//  Token + User + Role-based helpers
// ============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tokenStorage } from '@/lib/api/token-storage'
import { loginUser, logoutUser } from '@/features/auth/auth.api'
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
  const token = ref<string | null>(tokenStorage.get())
  const user  = ref<AuthUser | null>(readPersistedUser())

  // ── Getters ────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value && !!user.value)

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
  async function login(identifier: string, password: string): Promise<void> {
    const result = await loginUser(identifier, password)

    token.value = result.token
    user.value  = result.user

    tokenStorage.set(result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
  }

  async function logout(): Promise<void> {
    try { await logoutUser() } catch { /* ignore server error */ }

    token.value = null
    user.value  = null

    tokenStorage.remove()
    localStorage.removeItem(USER_KEY)
  }

  /** Cập nhật thông tin user (sau khi edit profile) */
  function updateUser(partial: Partial<AuthUser>): void {
    if (!user.value) return
    user.value = { ...user.value, ...partial }
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  return {
    // state
    token, user,
    // computed
    isLoggedIn, role,
    isAdmin, isCoordinator, isVolunteer, isRequester,
    // methods
    hasRole, isAtLeast, login, logout, updateUser,
  }
})
