// ============================================================
//  Users Store – Pinia
// ============================================================

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUsers, deleteUser } from '@/features/users/users.api'
import type { User } from '@/features/users/users.types'

export const useUsersStore = defineStore('users', () => {
  // ── State ──────────────────────────────────────────────────
  const users = ref<User[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const isLoading = ref(false)

  // ── Actions ────────────────────────────────────────────────
  async function fetchUsers(): Promise<void> {
    isLoading.value = true
    try {
      const result = await getUsers(page.value, pageSize.value)
      users.value = result.items
      total.value = result.total
    } finally {
      isLoading.value = false
    }
  }

  async function removeUser(id: string | number): Promise<void> {
    await deleteUser(id)
    users.value = users.value.filter((u) => u.id !== id)
    total.value--
  }

  return { users, total, page, pageSize, isLoading, fetchUsers, removeUser }
})
