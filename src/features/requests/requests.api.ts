// ============================================================
//  Relief Requests API — /api/relief-requests (Contract mục 4)
//  - USE_MOCK_AUTH=true  → dùng data mẫu trong localStorage
//  - USE_MOCK_AUTH=false → gọi backend thật, lỗi mạng thì
//    fallback localStorage (offline mode)
//
//  Endpoints theo contract:
//  - POST /relief-requests             → createReliefRequest
//  - GET  /relief-requests             → getReliefRequests
//  - GET  /relief-requests/{id}        → getReliefRequestById
//  - PUT  /relief-requests/{id}/status → updateReliefRequestStatus
// ============================================================

import { http } from '@/lib/api/http'
import { USE_MOCK_AUTH } from '@/config/env'
import type {
  CreateReliefRequestPayload,
  ReliefRequestResponse,
  ReliefRequestStatus,
} from './requests.types'

const STORAGE_KEY = 'relief_requests_offline'

// ── Helpers cho localStorage fallback ──────────────────────
function readOfflineRequests(): ReliefRequestResponse[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeOfflineRequests(list: ReliefRequestResponse[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function ensureOfflineRequests(): ReliefRequestResponse[] {
  const existing = readOfflineRequests()
  if (existing.length > 0) return existing

  const seeded: ReliefRequestResponse[] = [
    {
      id: 'mock-1',
      title: 'Cần hỗ trợ lương thực khẩn cấp',
      description: 'Gia đình đang thiếu thực phẩm sau mưa lũ.',
      address: 'Thôn A, xã B',
      latitude: 16.4637,
      longitude: 107.5909,
      emergencyLevel: 4,
      affectedPeople: 8,
      contactPhone: '0909123456',
      status: 'Pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      needFood: true,
      needWater: true,
      needMedicine: false,
      needBlanket: false,
      needShelter: false,
    },
    {
      id: 'mock-2',
      title: 'Cần xe vận chuyển thuốc',
      description: 'Cần hỗ trợ vận chuyển thuốc đến điểm sơ cứu.',
      address: 'Phường C, thị xã D',
      latitude: 16.0544,
      longitude: 108.2022,
      emergencyLevel: 3,
      affectedPeople: 3,
      contactPhone: '0912345678',
      status: 'InProgress',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      needFood: false,
      needWater: false,
      needMedicine: true,
      needBlanket: false,
      needShelter: false,
    },
  ]

  writeOfflineRequests(seeded)
  return seeded
}

function buildOfflineResponse(payload: CreateReliefRequestPayload): ReliefRequestResponse {
  return {
    ...payload,
    id: `offline-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }
}

// ── Create ──────────────────────────────────────────────────
/** POST /api/relief-requests — Requester tạo yêu cầu cứu trợ */
export async function createReliefRequest(
  payload: CreateReliefRequestPayload,
): Promise<ReliefRequestResponse> {
  if (USE_MOCK_AUTH) {
    const offlineItem = buildOfflineResponse(payload)
    const list = ensureOfflineRequests()
    list.unshift(offlineItem)
    writeOfflineRequests(list)
    return offlineItem
  }

  try {
    const { data } = await http.post<ReliefRequestResponse>('/relief-requests', payload)
    return data
  } catch (err) {
    console.warn('[requests.api] Gọi API thất bại, lưu tạm vào localStorage:', err)
    const offlineItem = buildOfflineResponse(payload)
    const list = readOfflineRequests()
    list.unshift(offlineItem)
    writeOfflineRequests(list)
    return offlineItem
  }
}

// ── List ────────────────────────────────────────────────────
/** GET /api/relief-requests — Danh sách yêu cầu */
export async function getReliefRequests(): Promise<ReliefRequestResponse[]> {
  if (USE_MOCK_AUTH) {
    return ensureOfflineRequests()
  }

  try {
    const { data } = await http.get<ReliefRequestResponse[]>('/relief-requests')
    return data
  } catch (err) {
    console.warn('[requests.api] Không lấy được từ server, dùng dữ liệu offline:', err)
    return readOfflineRequests()
  }
}

// ── Detail ──────────────────────────────────────────────────
/** GET /api/relief-requests/{id} — Chi tiết 1 yêu cầu */
export async function getReliefRequestById(id: string): Promise<ReliefRequestResponse | null> {
  if (USE_MOCK_AUTH) {
    return ensureOfflineRequests().find((r) => r.id === id) ?? null
  }

  if (id.startsWith('offline-')) {
    return readOfflineRequests().find((r) => r.id === id) ?? null
  }
  try {
    const { data } = await http.get<ReliefRequestResponse>(`/relief-requests/${id}`)
    return data
  } catch (err) {
    console.warn('[requests.api] Không lấy được chi tiết:', err)
    return readOfflineRequests().find((r) => r.id === id) ?? null
  }
}

// ── Update status ───────────────────────────────────────────
/**
 * PUT /api/relief-requests/{id}/status — Cập nhật trạng thái
 *
 * ⚠️ Contract chưa ghi rõ body — đang gửi { status: "Cancelled" } (string,
 * vì mục 7 note "API trả status dạng string, FE so sánh theo string").
 * Nếu BE nhận dạng số (Pending=1 ... Cancelled=6) thì đổi lại ở ĐÂY,
 * view không phải sửa.
 *
 * Ở chế độ real: lỗi KHÔNG fallback offline — đổi trạng thái phải chắc
 * chắn server nhận, throw ra để view hiện thông báo.
 */
export async function updateReliefRequestStatus(
  id: string,
  status: ReliefRequestStatus,
): Promise<ReliefRequestResponse> {
  if (USE_MOCK_AUTH) {
    const list = ensureOfflineRequests()
    const idx = list.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Không tìm thấy yêu cầu')
    list[idx] = { ...list[idx], status }
    writeOfflineRequests(list)
    return list[idx]
  }

  const { data } = await http.put<ReliefRequestResponse>(
    `/relief-requests/${id}/status`,
    { status },
  )
  return data
}

/** Tiện ích: Requester hủy yêu cầu của mình */
export function cancelReliefRequest(id: string): Promise<ReliefRequestResponse> {
  return updateReliefRequestStatus(id, 'Cancelled')
}