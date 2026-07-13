// ============================================================
//  Relief Requests API
//  Ưu tiên gọi backend thật; fallback localStorage khi lỗi mạng
// ============================================================

import { http } from '@/lib/api/http'
import { USE_MOCK_AUTH } from '@/config/env'
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

function ensureOfflineRequests(): ReliefRequestResponse[] {
  const existing = readOfflineRequests()
  if (existing.length > 0) return existing

  const seeded: ReliefRequestResponse[] = [
    {
      id: 'mock-1',
      title: 'Cần hỗ trợ lương thực khẩn cấp',
      description: 'Gia đình đang thiếu thực phẩm sau mưa lũ.',
      address: 'Thôn A, xã B',
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