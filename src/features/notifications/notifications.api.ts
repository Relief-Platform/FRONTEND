// ============================================================
//  Notifications API — /api/notifications
//  Ưu tiên gọi backend thật; fallback localStorage khi lỗi mạng
// 
//
// ============================================================

import { http } from '@/lib/api/http'
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
      type: 'success',
      title: 'Yêu cầu cứu trợ đã được tiếp nhận',
      message:
        'Yêu cầu "Ngập lụt tại xã Tân Lập, Quảng Trị" của bạn đã được điều phối viên xác nhận và đang chờ phân công tình nguyện viên.',
      createdAt: new Date(now - 5 * 60_000).toISOString(),
      isRead: false,
    },
    {
      id: 'noti-0002',
      type: 'system',
      title: 'Cập nhật trạng thái tự động',
      message:
        'Thông báo khẩn cấp từ yêu cầu của bạn đã được gửi đến các đội Y tế khu vực lân cận.',
      createdAt: new Date(now - 2 * 3_600_000).toISOString(),
      isRead: false,
    },
    {
      id: 'noti-0003',
      type: 'alert',
      title: 'Cảnh báo thời tiết xấu',
      message:
        'Khu vực Quảng Trị dự báo sẽ có mưa lớn trong 12 giờ tới. Vui lòng giữ liên lạc và chuẩn bị phương án dự phòng.',
      createdAt: new Date(now - 24 * 3_600_000).toISOString(),
      isRead: true,
    },
  ]
  writeOffline(seeded)
  return seeded
}

// ── List ────────────────────────────────────────────────────
/**
 * Lấy danh sách thông báo của user hiện tại
 * GET /api/notifications
 */
export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const { data } = await http.get<NotificationItem[]>('/notifications')
    return data
  } catch (err) {
    console.warn('[notifications.api] Không lấy được từ server, dùng dữ liệu offline:', err)
    return seedOfflineIfEmpty()
  }
}

// ── Mark all as read ────────────────────────────────────────
/**
 * Đánh dấu tất cả thông báo đã đọc
 * PUT /api/notifications/read-all
 */
export async function markAllNotificationsRead(): Promise<void> {
  try {
    await http.put('/notifications/read-all')
  } catch (err) {
    console.warn('[notifications.api] Không gọi được server, cập nhật offline:', err)
    const list = readOffline().map((n) => ({ ...n, isRead: true }))
    writeOffline(list)
  }
}

// ── Mark one as read ────────────────────────────────────────
/**
 * Đánh dấu 1 thông báo đã đọc
 * PUT /api/notifications/{id}/read
 */
export async function markNotificationRead(id: string): Promise<void> {
  try {
    await http.put(`/notifications/${id}/read`)
  } catch (err) {
    console.warn('[notifications.api] Không gọi được server, cập nhật offline:', err)
    const list = readOffline().map((n) => (n.id === id ? { ...n, isRead: true } : n))
    writeOffline(list)
  }
}