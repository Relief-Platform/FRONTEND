// ============================================================
//  Users API – CRUD skeleton
// ============================================================

import { http } from '@/lib/api/http'
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  PaginatedUsers,
} from './users.types'

export async function getUsers(
  page = 1,
  pageSize = 10,
): Promise<PaginatedUsers> {
  const { data } = await http.get<PaginatedUsers>('/users', {
    params: { page, pageSize },
  })
  return data
}

export async function getUserById(id: string | number): Promise<User> {
  const { data } = await http.get<User>(`/users/${id}`)
  return data
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await http.post<User>('/users', payload)
  return data
}

export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { id, ...body } = payload
  const { data } = await http.put<User>(`/users/${id}`, body)
  return data
}

export async function deleteUser(id: string | number): Promise<void> {
  await http.delete(`/users/${id}`)
}
