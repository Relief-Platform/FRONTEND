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

// ── Màu theo nhóm status (single source of truth cho MỌI view) ──
//  Quy ước design: đang xử lý = VÀNG, đã tiếp nhận = XANH DƯƠNG,
//  hoàn thành = XANH LÁ, hủy = XÁM
export interface StatusColor {
  bg: string     // nền badge/tag (nhạt)
  color: string  // chữ badge/tag (đậm)
  dot: string    // chấm tròn trạng thái
}

export const STATUS_GROUP_COLOR: Record<StatusGroup, StatusColor> = {
  processing: { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' }, // vàng
  received:   { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' }, // xanh dương
  completed:  { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' }, // xanh lá
  cancelled:  { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' }, // xám
}