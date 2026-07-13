// ============================================================
//  Users – TypeScript interfaces
// ============================================================

export interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface PaginatedUsers {
  items: User[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
