// ============================================================
//  Assignments API — Admin + Volunteer
//  Theo API Reference mục 4 (api/assignments)
// ============================================================

import { http } from '@/lib/api/http'
import { unwrapItems, type PagedResult } from '@/lib/api/paging'

// ── Types ────────────────────────────────────────────────────

export type AssignmentStatus =
  | 'Assigned'
  | 'Accepted'
  | 'OnTheWay'
  | 'Completed'
  | 'Cancelled'

export interface Assignment {
  id: string
  reliefRequestId: string
  reliefRequestTitle: string
  volunteerProfileId: string
  volunteerFullName: string
  assignedByUserId: string
  assignedAt: string
  acceptedAt: string | null
  completedAt: string | null
  cancelledAt: string | null
  status: AssignmentStatus
  note: string | null
  cancellationRequested: boolean
  cancellationReason: string | null
  cancellationRequestedAt: string | null
}

export interface AssignmentActionResult {
  id: string
  message: string
}

// ── Admin — List all ─────────────────────────────────────────

/**
 * GET /api/assignments
 * Admin xem tất cả phân công (có phân trang).
 */
export async function getAssignments(
  pageNumber = 1,
  pageSize = 50,
): Promise<Assignment[]> {
  const { data } = await http.get<PagedResult<Assignment> | Assignment[]>(
    '/assignments',
    { params: { pageNumber, pageSize } },
  )
  return unwrapItems(data)
}

// ── Admin — Pending cancellations ────────────────────────────

/**
 * GET /api/assignments/pending-cancellations
 * Danh sách đơn xin huỷ đang chờ Admin duyệt.
 */
export async function getPendingCancellations(): Promise<Assignment[]> {
  const { data } = await http.get<PagedResult<Assignment> | Assignment[]>(
    '/assignments/pending-cancellations',
  )
  return unwrapItems(data)
}

// ── Detail ───────────────────────────────────────────────────

/**
 * GET /api/assignments/{id}
 */
export async function getAssignmentById(id: string): Promise<Assignment> {
  const { data } = await http.get<Assignment>(`/assignments/${id}`)
  return data
}

// ── Admin — Approve cancellation ────────────────────────────

/**
 * PUT /api/assignments/{id}/approve-cancellation
 * Duyệt đơn xin huỷ → Assignment thành Cancelled, request quay về Approved.
 */
export async function approveCancellation(id: string): Promise<AssignmentActionResult> {
  const { data } = await http.put<AssignmentActionResult>(
    `/assignments/${id}/approve-cancellation`,
  )
  return data
}

// ── Admin — Reject cancellation ──────────────────────────────

/**
 * PUT /api/assignments/{id}/reject-cancellation
 */
export async function rejectCancellation(id: string): Promise<AssignmentActionResult> {
  const { data } = await http.put<AssignmentActionResult>(
    `/assignments/${id}/reject-cancellation`,
  )
  return data
}

// ── Admin — Force cancel ─────────────────────────────────────

/**
 * PUT /api/assignments/{id}/cancel
 * Admin huỷ trực tiếp — bắt buộc truyền reason.
 */
export async function adminCancelAssignment(
  id: string,
  reason: string,
): Promise<AssignmentActionResult> {
  const { data } = await http.put<AssignmentActionResult>(
    `/assignments/${id}/cancel`,
    { reason },
  )
  return data
}

// ── Volunteer — Update status ────────────────────────────────

/**
 * PUT /api/assignments/{id}/status
 * Volunteer cập nhật tiến độ: Assigned→Accepted→OnTheWay→Completed
 */
export async function updateAssignmentStatus(
  id: string,
  status: AssignmentStatus,
): Promise<AssignmentActionResult> {
  const { data } = await http.put<AssignmentActionResult>(
    `/assignments/${id}/status`,
    { status },
  )
  return data
}

// ── Volunteer — Request cancellation ────────────────────────

/**
 * POST /api/assignments/{id}/request-cancellation
 * Volunteer gửi đơn xin huỷ (bắt buộc reason).
 */
export async function requestCancellation(
  id: string,
  reason: string,
): Promise<AssignmentActionResult> {
  const { data } = await http.post<AssignmentActionResult>(
    `/assignments/${id}/request-cancellation`,
    { reason },
  )
  return data
}
