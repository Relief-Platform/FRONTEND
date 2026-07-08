// ============================================================
//  Single source of truth cho tất cả biến môi trường
//  Sửa file .env.local để thay đổi URL backend
// ============================================================

const env = import.meta.env

/** URL gốc của backend API (VD: https://localhost:7000/api) */
export const API_BASE_URL: string =
  env.VITE_API_BASE_URL ?? 'https://localhost:7000/api'

/** Tiêu đề ứng dụng */
export const APP_TITLE: string = env.VITE_APP_TITLE ?? 'ReliefConnect'
