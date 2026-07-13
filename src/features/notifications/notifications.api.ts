// ============================================================
//  Notifications API — /api/notifications (ĐÃ LIVE trên Production)
//  Ưu tiên gọi backend thật; fallback localStorage khi lỗi mạng
//
//  Endpoints (API Reference mục 4):
//  - GET /notifications               → getNotifications (phân trang)
//  - GET /notifications/unread-count  → getUnreadCount
//  - PUT /notifications/{id}/read     → markNotificationRead
//  - PUT /notifications/read-all      → markAllNotificationsRead
// ============================================================

import { http } from '@/lib/api/http'
import { unwrapItems, type PagedResult } from '@/lib/api/paging'
import type { NotificationItem } from './notifications.types'

const STORAGE_KEY = 'relief_notifications_offline'

// ── Helpers cho localStorage fallback ──────────────────────
function readOffline(): NotificationItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeOffline(list: NotificationItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** Seed dữ liệu mẫu cho chế độ offline/demo (chỉ tạo 1 lần) */
function seedOfflineIfEmpty(): NotificationItem[] {
  const existing = readOffline()
  if (existing.length > 0) return existing

  const now = Date.now()
  const seeded: NotificationItem[] = [
    {
      id: 'noti-0001',
      type: 'RequestApproved',
      title: 'Yêu cầu cứu trợ đã được tiếp nhận',
      content:
        'Yêu cầu "Ngập lụt tại xã Tân Lập, Quảng Trị" của bạn đã được xác nhận và đang chờ phân công tình nguyện viên.',
      createdAt: new Date(now - 5 * 60_000).toISOString(),
      isRead: false,
      readAt: null,
    },
    {
      id: 'noti-0002',
      type: 'System',
      title: 'Cập nhật trạng thái tự động',
      content:
        'Thông báo khẩn cấp từ yêu cầu của bạn đã được gửi đến các đội Y tế khu vực lân cận.',
      createdAt: new Date(now - 2 * 3_600_000).toISOString(),
      isRead: false,
      readAt: null,
    },
    {
      id: 'noti-0003',
      type: 'WeatherAlert',
      title: 'Cảnh báo thời tiết xấu',
      content:
        'Khu vực Quảng Trị dự báo sẽ có mưa lớn trong 12 giờ tới. Vui lòng giữ liên lạc và chuẩn bị phương án dự phòng.',
      createdAt: new Date(now - 24 * 3_600_000).toISOString(),
      isRead: true,
      readAt: new Date(now - 20 * 3_600_000).toISOString(),
    },
  ]
  writeOffline(seeded)
  return seeded
}

// ── List ────────────────────────────────────────────────────
/**
 * GET /api/notifications — Thông báo của user hiện tại (PHÂN TRANG).
 * result thật: { items, pageNumber, pageSize, totalCount, totalPages }.
 */
export async function getNotifications(
  pageNumber = 1,
  pageSize = 50,
): Promise<NotificationItem[]> {
  try {
    const { data } = await http.get<PagedResult<NotificationItem> | NotificationItem[]>(
      '/notifications',
      { params: { pageNumber, pageSize } },
    )
    return unwrapItems(data)
  } catch (err) {
    console.warn('[notifications.api] Không lấy được từ server, dùng dữ liệu offline:', err)
    return seedOfflineIfEmpty()
  }
}

// ── Unread count ────────────────────────────────────────────
/** GET /api/notifications/unread-count — Số thông báo chưa đọc (cho badge chuông) */
export async function getUnreadCount(): Promise<number> {
  try {
    const { data } = await http.get<number | { count: number }>('/notifications/unread-count')
    return typeof data === 'number' ? data : (data?.count ?? 0)
  } catch (err) {
    console.warn('[notifications.api] Không lấy được unread-count:', err)
    return readOffline().filter((n) => !n.isRead).length
  }
}

// ── Mark all as read ────────────────────────────────────────
/** PUT /api/notifications/read-all — Đánh dấu tất cả đã đọc */
export async function markAllNotificationsRead(): Promise<void> {
  try {
    await http.put('/notifications/read-all')
  } catch (err) {
    console.warn('[notifications.api] Không gọi được server, cập nhật offline:', err)
    const now = new Date().toISOString()
    const list = readOffline().map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? now }))
    writeOffline(list)
  }
}

// ── Mark one as read ────────────────────────────────────────
/** PUT /api/notifications/{id}/read — Đánh dấu 1 thông báo đã đọc */
export async function markNotificationRead(id: string): Promise<void> {
  try {
    await http.put(`/notifications/${id}/read`)
  } catch (err) {
    console.warn('[notifications.api] Không gọi được server, cập nhật offline:', err)
    const now = new Date().toISOString()
    const list = readOffline().map((n) =>
      n.id === id ? { ...n, isRead: true, readAt: n.readAt ?? now } : n,
    )
    writeOffline(list)
  }
}