// ============================================================
//  Admin – Relief Requests API extensions
//  Các endpoint chỉ Admin mới gọi được:
//    GET /api/relief-requests/{id}/suggested-volunteers
// ============================================================

import { http } from '@/lib/api/http'

// ── Types ────────────────────────────────────────────────────

export interface SuggestedVolunteer {
  volunteerProfileId: string
  userId: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  latitude: number
  longitude: number
  experienceYears: number
  bio: string | null
  isApproved: boolean
  skills: string[]
  /** Khoảng cách tính theo km từ điểm yêu cầu đến volunteer */
  distanceKm: number
}

// ── API calls ────────────────────────────────────────────────

/**
 * GET /api/relief-requests/{id}/suggested-volunteers
 * Admin only – chỉ hoạt động khi request đang ở trạng thái `Approved`.
 * Trả về danh sách volunteer gần nhất kèm khoảng cách (km).
 */
export async function getSuggestedVolunteers(
  reliefRequestId: string,
): Promise<SuggestedVolunteer[]> {
  const { data } = await http.get<SuggestedVolunteer[]>(
    `/relief-requests/${reliefRequestId}/suggested-volunteers`,
  )
  return Array.isArray(data) ? data : []
}

/**
 * POST /api/assignments
 * Admin phân công thủ công một volunteer cho một relief request đang Approved.
 */
export interface CreateAssignmentPayload {
  reliefRequestId: string
  volunteerProfileId: string
  note?: string
}

export interface AssignmentResult {
  id: string
  message: string
}

export async function createAssignment(
  payload: CreateAssignmentPayload,
): Promise<AssignmentResult> {
  const { data } = await http.post<AssignmentResult>('/assignments', payload)
  return data
}
