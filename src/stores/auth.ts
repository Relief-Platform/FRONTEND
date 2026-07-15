// ============================================================
//  Auth Store – Pinia
//  Sync với BE thực tế: LoginResult → AuthUser, role PascalCase
// ============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tokenStorage } from '@/lib/api/token-storage'
import { loginUser, logoutUser, getMe, toAuthUser } from '@/features/auth/auth.api'
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

  /** Role hiện tại (PascalCase khớp BE): "Admin" | "Volunteer" | ... */
  const role = computed<UserRole | null>(() => user.value?.role ?? null)

  /** Kiểm tra user có role cụ thể không */
  function hasRole(...roles: UserRole[]): boolean {
    return !!user.value && roles.includes(user.value.role)
  }

  /**
   * Kiểm tra user có quyền >= minRole theo hierarchy không.
   * VD: isAtLeast('Volunteer') → true nếu là Volunteer, Coordinator hoặc Admin
   */
  function isAtLeast(minRole: UserRole): boolean {
    if (!user.value) return false
    return ROLE_PRIORITY[user.value.role] >= ROLE_PRIORITY[minRole]
  }

  const isAdmin            = computed(() => hasRole('Admin'))
  const isVolunteer        = computed(() => hasRole('Volunteer'))
  const isRequester        = computed(() => hasRole('Requester'))
  const isCoordinator      = computed(() => hasRole('Coordinator'))
  const isOrganization     = computed(() => hasRole('Organization'))

  // ── Actions ────────────────────────────────────────────────

  /**
   * Đăng nhập.
   * loginUser() trả LoginResult, toAuthUser() map sang AuthUser để lưu store.
   * Lưu cả accessToken + refreshToken vào localStorage.
   */
  async function login(email: string, password: string): Promise<void> {
    const result = await loginUser(email, password)

    accessToken.value = result.accessToken
    user.value        = toAuthUser(result)

    tokenStorage.set(result.accessToken)
    tokenStorage.setRefresh(result.refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  /**
   * Đăng xuất.
   * Gửi refreshToken lên BE để blacklist, sau đó xoá local state.
   */
  async function logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefresh()
    try {
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    } catch {
      // Bỏ qua lỗi server — vẫn xoá local state
    }

    accessToken.value = null
    user.value        = null

    tokenStorage.clearAll()
    localStorage.removeItem(USER_KEY)
  }

  /**
   * Lấy thông tin user mới nhất từ /api/auth/me.
   * Gọi khi app khởi động (sau F5) để đảm bảo data đồng bộ với BE.
   */
  async function fetchMe(): Promise<void> {
    try {
      const me = await getMe()
      // Giữ lại expiresAt từ store cũ vì /me không trả expiresAt
      const current = user.value
      user.value = {
        userId:    me.userId,
        fullName:  me.fullName,
        email:     me.email,
        role:      me.role,
        expiresAt: current?.expiresAt ?? '',
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    } catch {
      // Token hết hạn → http interceptor tự redirect /login
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
    isAdmin, isVolunteer, isRequester, isCoordinator, isOrganization,
    // methods
    hasRole, isAtLeast, login, logout, fetchMe, updateUser,
  }
})
