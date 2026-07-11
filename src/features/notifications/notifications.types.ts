// ============================================================
//  Notifications – Types
// ============================================================

export type NotificationType = 'system' | 'success' | 'alert'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string   // ISO string — view tự format
  isRead: boolean
}