// ============================================================
//  Relief Requests API — /api/relief-requests
//  Chuẩn theo API Reference (kiểm chứng Production 2026-07-13)
//      • Lỗi SERVER (400/401/403...) → ném ra cho form hiển thị
//      • MẤT MẠNG thật sự (status=0) → mới fallback localStorage
//
//  Endpoints:
//  - POST /relief-requests             → createReliefRequest   (result: {id, message})
//  - GET  /relief-requests             → getReliefRequests     (result: PagedResult)
//  - GET  /relief-requests/{id}        → getReliefRequestById
//  - PUT  /relief-requests/{id}/status → updateReliefRequestStatus
// ============================================================

import { http, ApiError } from '@/lib/api/http'
import { unwrapItems, type PagedResult } from '@/lib/api/paging'
import type {
  CreateReliefRequestPayload,
  ReliefRequestResponse,
  ReliefRequestStatus,
} from './requests.types'

/** Kết quả các action ghi (create / update status): result = { id, message } */
export interface ReliefRequestActionResult {
  id: string
  message: string
}

const STORAGE_KEY = 'relief_requests_offline'

/** Lỗi do server chủ động từ chối (validation, auth...) — khác với mất mạng */
function isServerRejection(err: unknown): boolean {
  return err instanceof ApiError && err.status > 0
}

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

  const seeded: ReliefRequestResponse[] = []

  writeOfflineRequests(seeded)
  return seeded
}

function buildOfflineResponse(payload: CreateReliefRequestPayload): ReliefRequestResponse {
  return {
    ...payload,
    id: `offline-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    targetHeadcount: null,
    suggestedHeadcountMin: null,
    suggestedHeadcountMax: null,
  }
}

// ── Create ──────────────────────────────────────────────────
/**
 * POST /api/relief-requests — Requester tạo yêu cầu (role Requester ONLY,
 * Admin gọi sẽ bị 403). result thật của BE: { id, message }.
 *
 * Lỗi server (400 validation, 401, 403...) → THROW để form hiện errorMessages.
 * Chỉ khi mất mạng thật (status=0) mới lưu tạm offline.
 */
export async function createReliefRequest(
  payload: CreateReliefRequestPayload,
): Promise<ReliefRequestActionResult> {
  try {
    const { data } = await http.post<ReliefRequestActionResult>('/relief-requests', payload)
    return data
  } catch (err) {
    // Server từ chối (400/401/403/...) → ném ra, KHÔNG giả vờ thành công
    if (isServerRejection(err)) throw err

    // Mất mạng thật sự → lưu tạm để không mất dữ liệu người dân đã nhập
    console.warn('[requests.api] Mất kết nối, lưu tạm vào localStorage:', err)
    const offlineItem = buildOfflineResponse(payload)
    const list = readOfflineRequests()
    list.unshift(offlineItem)
    writeOfflineRequests(list)
    return { id: offlineItem.id, message: 'Mất kết nối — đã lưu tạm trên máy.' }
  }
}

// ── List ────────────────────────────────────────────────────
/**
 * GET /api/relief-requests — Danh sách (PHÂN TRANG).
 * result thật: { items, pageNumber, pageSize, totalCount, totalPages }.
 * BE tự lọc: Requester chỉ thấy yêu cầu của mình, Admin thấy tất cả.
 * Hàm trả thẳng mảng items để các view hiện tại không phải đổi.
 */
export async function getReliefRequests(
  pageNumber = 1,
  pageSize = 50,
): Promise<ReliefRequestResponse[]> {
  try {
    const { data } = await http.get<PagedResult<ReliefRequestResponse> | ReliefRequestResponse[]>(
      '/relief-requests',
      { params: { pageNumber, pageSize } },
    )
    return unwrapItems(data)
  } catch (err) {
    console.warn('[requests.api] Không lấy được từ server, dùng dữ liệu offline:', err)
    return readOfflineRequests()
  }
}

// ── Detail ──────────────────────────────────────────────────
/** GET /api/relief-requests/{id} — Chi tiết (chủ sở hữu hoặc Admin) */
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
 * PUT /api/relief-requests/{id}/status
 * Quyền: chủ sở hữu chỉ được set 'Cancelled'; Admin được mọi bước.
 *
 * ⚠️ Body gửi { status: "Cancelled" } (string) — xác nhận schema chính xác
 * trong docs/swagger.json (mở bằng editor.swagger.io). Nếu BE nhận số
 * (Pending=1...Cancelled=6) thì đổi lại ở ĐÂY, view không phải sửa.
 *
 * Ở chế độ real: lỗi KHÔNG fallback offline — throw để view hiện thông báo.
 */
export async function updateReliefRequestStatus(
  id: string,
  status: ReliefRequestStatus,
  note?: string,
  targetHeadcount?: number,
): Promise<ReliefRequestActionResult> {
  const { data } = await http.put<ReliefRequestActionResult>(
    `/relief-requests/${id}/status`,
    { status, note: note || null, targetHeadcount: targetHeadcount ?? null },
  )
  return data
}

/** Tiện ích: Requester hủy yêu cầu của mình */
export function cancelReliefRequest(id: string): Promise<ReliefRequestActionResult> {
  return updateReliefRequestStatus(id, 'Cancelled')
}

/**
 * DELETE /api/relief-requests/{id}/team-lead
 * Gỡ hẳn nhóm trưởng hiện tại của yêu cầu này, không đặt ai thay thế.
 * Idempotent: không có ai đang là trưởng vẫn trả về 200.
 */
export async function removeTeamLead(reliefRequestId: string): Promise<ReliefRequestActionResult> {
  const { data } = await http.delete<ReliefRequestActionResult>(
    `/relief-requests/${reliefRequestId}/team-lead`,
  )
  return data
}