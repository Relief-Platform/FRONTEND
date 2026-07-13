// ============================================================
//  Users API – Admin Only
// ============================================================

import { http } from '@/lib/api/http'
import type { User, PaginatedUsers } from './users.types'

export async function getUsers(
  pageNumber = 1,
  pageSize = 10,
  role?: string,
): Promise<PaginatedUsers> {
  const { data } = await http.get<PaginatedUsers>('/admin/users', {
    params: { pageNumber, pageSize, role },
  })
  return data
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await http.get<User>(`/admin/users/${id}`)
  return data
}

export async function activateUser(id: string): Promise<void> {
  await http.put(`/admin/users/${id}/activate`)
}

export async function deactivateUser(id: string): Promise<void> {
  await http.put(`/admin/users/${id}/deactivate`)
}

export async function updateUserRole(id: string, roleName: string): Promise<void> {
  await http.put(`/admin/users/${id}/role`, { roleName })
}
