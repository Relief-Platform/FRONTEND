// ============================================================
//  Validation helpers dùng chung
// ============================================================

// Chỉ cho phép chữ cái (kể cả có dấu tiếng Việt) và khoảng trắng —
// không cho số và ký tự đặc biệt.
const NAME_REGEX = /^[\p{L}\s]+$/u

export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length > 0 && NAME_REGEX.test(trimmed)
}

/**
 * Regex kiểm tra số điện thoại Việt Nam hợp lệ:
 * - Chấp nhận đầu số 0, 84 hoặc +84 (VD: 0912345678, 84912345678, +84912345678)
 * - Theo sau là các đầu số nhà mạng 3, 5, 7, 8, 9 và 8 chữ số
 * - Cho phép khoảng trắng hoặc dấu gạch ngang giữa các cụm số
 */
export const PHONE_REGEX = /^(\+?84|0)[\s.-]?[35789](\d[\s.-]?){8}$/

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false
  const trimmed = phone.trim()
  return PHONE_REGEX.test(trimmed)
}

