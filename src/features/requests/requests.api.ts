// ============================================================
//  Relief Requests API
//  Ưu tiên gọi backend thật; fallback localStorage khi lỗi mạng
// ============================================================

import { http } from '@/lib/api/http'
import type { CreateReliefRequestPayload, ReliefRequestResponse } from './requests.types'

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