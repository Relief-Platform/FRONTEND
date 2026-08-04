// ============================================================
//  Relief Request – Types (theo API Contract mục 4 & 7)
// ============================================================

export type ReliefRequestStatus =
  | 'Pending' | 'Approved' | 'Assigned' | 'InProgress' | 'Completed' | 'Cancelled'

export interface CreateReliefRequestPayload {
  title: string
  description: string
  address: string
  region?: string
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

// ── UI helper: nhóm status thành màu riêng rẽ ──
export type StatusGroup = 'pending' | 'approved' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'

export const STATUS_GROUP_MAP: Record<ReliefRequestStatus, StatusGroup> = {
  Pending:    'pending',
  Approved:   'approved',
  Assigned:   'assigned',
  InProgress: 'in_progress',
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

// ── Màu theo nhóm status (single source of truth cho MỌI view) ──
export interface StatusColor {
  bg: string     // nền badge/tag (nhạt)
  color: string  // chữ badge/tag (đậm)
  dot: string    // chấm tròn trạng thái
}

export const STATUS_GROUP_COLOR: Record<StatusGroup, StatusColor> = {
  pending:     { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' }, // vàng
  approved:    { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' }, // xanh ngọc
  assigned:    { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' }, // xanh dương
  in_progress: { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' }, // tím
  completed:   { bg: '#d1fae5', color: '#065f46', dot: '#10b981' }, // xanh lá
  cancelled:   { bg: '#f3f4f6', color: '#4b5563', dot: '#9ca3af' }, // xám
}