// ============================================================
//  Users Store – Pinia
// ============================================================

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUsers, activateUser, deactivateUser, updateUserRole } from '@/features/users/users.api'
import type { User } from '@/features/users/users.types'

export const useUsersStore = defineStore('users', () => {
  // ── State ──────────────────────────────────────────────────
  const users = ref<User[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const isLoading = ref(false)
  const currentRoleFilter = ref<string | undefined>(undefined)

  // ── Actions ────────────────────────────────────────────────
  async function fetchUsers(): Promise<void> {
    isLoading.value = true
    try {
      const result = await getUsers(page.value, pageSize.value, currentRoleFilter.value)
      users.value = result.items
      total.value = result.totalCount // BE uses totalCount instead of total
      page.value = result.pageNumber
    } finally {
      isLoading.value = false
    }
  }

  async function activate(id: string): Promise<void> {
    await activateUser(id)
    const user = users.value.find((u) => u.id === id)
    if (user) user.isActive = true
  }

  async function deactivate(id: string): Promise<void> {
    await deactivateUser(id)
    const user = users.value.find((u) => u.id === id)
    if (user) user.isActive = false
  }

  async function changeRole(id: string, roleName: string): Promise<void> {
    await updateUserRole(id, roleName)
    const user = users.value.find((u) => u.id === id)
    if (user) user.role = roleName
  }

  return { users, total, page, pageSize, isLoading, currentRoleFilter, fetchUsers, activate, deactivate, changeRole }
})
