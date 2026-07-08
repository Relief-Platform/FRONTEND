// ============================================================
//  Auth Store – Pinia
//  Quản lý trạng thái đăng nhập toàn ứng dụng
// ============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tokenStorage } from '@/lib/api/token-storage'
import { loginUser } from '@/features/auth/auth.api'
import type { AuthUser } from '@/features/auth/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(tokenStorage.get())

  // ── Getters ────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value)

  // ── Actions ────────────────────────────────────────────────
  async function login(identifier: string, password: string): Promise<void> {
    const result = await loginUser(identifier, password)
    token.value = result.token
    user.value = result.user
    tokenStorage.set(result.token)
  }

  function logout(): void {
    token.value = null
    user.value = null
    tokenStorage.remove()
  }

  return { user, token, isLoggedIn, login, logout }
})
