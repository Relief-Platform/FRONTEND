// ============================================================
//  Single source of truth cho tất cả biến môi trường
//  Production BE: https://disasterrelief-api.runasp.net
// ============================================================

const env = import.meta.env

/**
 * URL gốc của backend API.
 * Production: https://disasterrelief-api.runasp.net
 * Local:      http://localhost:5092  (xem launchSettings.json của BE)
 */
export const API_BASE_URL: string =
  env.VITE_API_BASE_URL ?? 'https://disasterrelief-api.runasp.net/api'

/** Tiêu đề ứng dụng */
export const APP_TITLE: string = env.VITE_APP_TITLE ?? 'ReliefConnect'