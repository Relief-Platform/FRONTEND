// ============================================================
//  Relief Requests API — /api/relief-requests
//  Chuẩn theo API Reference (kiểm chứng Production 2026-07-13)
//  - USE_MOCK_AUTH=true  → dùng data mẫu trong localStorage
//  - USE_MOCK_AUTH=false → gọi backend thật
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
import { USE_MOCK_AUTH } from '@/config/env'
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
  if (USE_MOCK_AUTH) {
    const offlineItem = buildOfflineResponse(payload)
    const list = ensureOfflineRequests()
    list.unshift(offlineItem)
    writeOfflineRequests(list)
    return { id: offlineItem.id, message: 'Đã tạo yêu cầu (mock).' }
  }

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
  if (USE_MOCK_AUTH) {
    return ensureOfflineRequests()
  }

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
): Promise<ReliefRequestActionResult> {
  if (USE_MOCK_AUTH) {
    const list = ensureOfflineRequests()
    const idx = list.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Không tìm thấy yêu cầu')
    list[idx] = { ...list[idx], status }
    writeOfflineRequests(list)
    return { id, message: 'Đã cập nhật trạng thái (mock).' }
  }

  const { data } = await http.put<ReliefRequestActionResult>(
    `/relief-requests/${id}/status`,
    { status },
  )
  return data
}

/** Tiện ích: Requester hủy yêu cầu của mình */
export function cancelReliefRequest(id: string): Promise<ReliefRequestActionResult> {
  return updateReliefRequestStatus(id, 'Cancelled')
}