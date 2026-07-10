// ============================================================
//  Relief Request – Types (theo API Contract mục 4 & 7)
// ============================================================

export type ReliefRequestStatus =
  | 'Pending' | 'Approved' | 'Assigned' | 'InProgress' | 'Completed' | 'Cancelled'

export interface CreateReliefRequestPayload {
  title: string
  description: string
  address: string
  latitude: number
  longitude: number
  emergencyLevel: 1 | 2 | 3 | 4 // Low, Medium, High, Critical
  affectedPeople: number
  needFood: boolean
  needWater: boolean
  needMedicine: boolean
  needBlanket: boolean
  needShelter: boolean
  contactPhone: string
}

export interface ReliefRequestResponse extends CreateReliefRequestPayload {
  id: string
  status: ReliefRequestStatus
  createdAt: string
}

// ── UI helper: nhóm status thành 3 nhóm màu theo yêu cầu design ──
export type StatusGroup = 'processing' | 'received' | 'completed' | 'cancelled'

export const STATUS_GROUP_MAP: Record<ReliefRequestStatus, StatusGroup> = {
  Pending:    'processing',
  Approved:   'processing',
  Assigned:   'received',
  InProgress: 'received',
  Completed:  'completed',
  Cancelled:  'cancelled',
}

export const STATUS_LABEL_VI: Record<ReliefRequestStatus, string> = {
  Pending:    'Đang xử lý',
  Approved:   'Đang xử lý',
  Assigned:   'Đã tiếp nhận',
  InProgress: 'Đã tiếp nhận',
  Completed:  'Đã hoàn thành',
  Cancelled:  'Đã hủy',
}