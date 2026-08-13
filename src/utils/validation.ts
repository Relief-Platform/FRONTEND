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
 * Regex số điện thoại Việt Nam (dạng nội địa):
 * - Đầu số 0 hoặc 84/+84 + nhà mạng 3,5,7,8,9 + 8 chữ số
 */
export const VN_PHONE_REGEX = /^(\+?84|0)[\s.-]?[35789](\d[\s.-]?){8}$/

/**
 * Regex số điện thoại quốc tế E.164:
 * - Bắt đầu bằng + và mã vùng (1-3 chữ số) rồi 6-12 chữ số
 * - VD: +18274612345, +44 20 7946 0958, +6591234567
 */
export const INTL_PHONE_REGEX = /^\+[1-9]\d{0,2}[\s.-]?\d[\s.-]?\d{5,13}$/

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false
  const trimmed = phone.trim()
  // Chấp nhận số VN nội địa (0xxx) hoặc bất kỳ số quốc tế hợp lệ (+xxx)
  return VN_PHONE_REGEX.test(trimmed) || INTL_PHONE_REGEX.test(trimmed)
}



