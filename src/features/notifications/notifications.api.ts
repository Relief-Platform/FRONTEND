// ============================================================
//  Notifications API — /api/notifications (ĐÃ LIVE trên Production)
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
    console.warn('[notifications.api] Không lấy được từ server:', err)
    return []
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
    return 0
  }
}

// ── Mark all as read ────────────────────────────────────────
/** PUT /api/notifications/read-all — Đánh dấu tất cả đã đọc */
export async function markAllNotificationsRead(): Promise<void> {
  try {
    await http.put('/notifications/read-all')
  } catch (err) {
    console.warn('[notifications.api] Không gọi được server:', err)
  }
}

// ── Mark one as read ────────────────────────────────────────
/** PUT /api/notifications/{id}/read — Đánh dấu 1 thông báo đã đọc */
export async function markNotificationRead(id: string): Promise<void> {
  try {
    await http.put(`/notifications/${id}/read`)
  } catch (err) {
    console.warn('[notifications.api] Không gọi được server:', err)
  }
}