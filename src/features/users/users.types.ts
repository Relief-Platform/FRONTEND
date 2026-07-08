// ============================================================
//  Users – TypeScript interfaces
// ============================================================

export interface User {
  id: string | number
  fullName: string
  email: string
  phone?: string
  role?: string
  province?: string
  district?: string
  createdAt?: string
}

export interface CreateUserPayload {
  fullName: string
  email: string
  phone: string
  password: string
  role?: string
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: string | number
}

export interface PaginatedUsers {
  items: User[]
  total: number
  page: number
  pageSize: number
}
