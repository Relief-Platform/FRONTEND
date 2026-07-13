// ============================================================
//  Dashboard API
// ============================================================

import { http } from '@/lib/api/http'

export interface DashboardSummary {
  totalUsers: number
  totalReliefRequests: number
  totalVolunteers: number
  totalWarehouses: number
  // Thêm các fields khác tuỳ theo BE trả về
  [key: string]: any
}

export interface AuditLog {
  id: string
  action: string
  entityName: string
  entityId: string
  userId: string
  userEmail: string
  timestamp: string
  details: string
}

export interface PaginatedAuditLogs {
  items: AuditLog[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await http.get<DashboardSummary>('/dashboard/summary')
  return data
}

export async function getAuditLogs(
  pageNumber = 1,
  pageSize = 10,
): Promise<PaginatedAuditLogs> {
  const { data } = await http.get<PaginatedAuditLogs>('/admin/audit-logs', {
    params: { pageNumber, pageSize },
  })
  return data
}
