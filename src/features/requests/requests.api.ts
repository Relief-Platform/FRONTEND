// ============================================================
//  Relief Requests API — /api/relief-requests (Contract mục 4)
//  Ưu tiên gọi backend thật; fallback localStorage khi lỗi mạng
//
//  Endpoints theo contract:
//  - POST /relief-requests            → createReliefRequest
//  - GET  /relief-requests            → getReliefRequests
//  - GET  /relief-requests/{id}       → getReliefRequestById
//  - PUT  /relief-requests/{id}/status → updateReliefRequestStatus
//
//  NOTE: baseURL trong config/env PHẢI có /api ở cuối
//  (http://localhost:5001/api) vì path ở đây không có /api
// ============================================================

import { http } from '@/lib/api/http'
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
 * Lỗi KHÔNG fallback offline — đổi trạng thái phải chắc chắn server nhận,
 * throw ra để view hiện thông báo.
 */
export async function updateReliefRequestStatus(
  id: string,
  status: ReliefRequestStatus,
): Promise<ReliefRequestResponse> {
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