// ============================================================
//  Datetime helpers – luôn hiển thị theo giờ Việt Nam (UTC+7)
//  bất kể múi giờ hệ thống của máy đang chạy (dev, Vercel, máy
//  người dùng ở nước ngoài...), tránh lệch giờ khi deploy.
// ============================================================

const VN_TIME_ZONE = 'Asia/Ho_Chi_Minh'

export function formatDateVN(dateStr: string | Date, locale: 'vi' | 'en' = 'vi'): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return d.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { timeZone: VN_TIME_ZONE })
}

export function formatTimeVN(dateStr: string | Date, locale: 'vi' | 'en' = 'vi'): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return d.toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: VN_TIME_ZONE,
  })
}

export function formatDateTimeVN(dateStr: string | Date, locale: 'vi' | 'en' = 'vi'): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return d.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', { timeZone: VN_TIME_ZONE })
}

export function formatDateVNWithOptions(
  dateStr: string | Date,
  locale: 'vi' | 'en' = 'vi',
  options: Intl.DateTimeFormatOptions = {},
): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return d.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    ...options,
    timeZone: VN_TIME_ZONE,
  })
}
