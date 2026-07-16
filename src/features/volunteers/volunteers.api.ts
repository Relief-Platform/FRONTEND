// ============================================================
//  Volunteers API — /api/volunteers
//  Tất cả real response đều bọc trong ApiResponse<T> → cần unwrap
//  Mock mode: VITE_USE_MOCK_AUTH=true
// ============================================================

import { http } from '@/lib/api/http'
import type { ApiResponse } from '@/features/auth/auth.types'
import type {
  VolunteerProfile,
  VolunteerProfilePayload,
  SkillItem,
  CreateVolunteerProfileResponse,
  UpdateVolunteerProfileResponse,
  AddVolunteerSkillsResponse,
  RemoveVolunteerSkillResponse,
  AddSkillsPayload,
} from './volunteers.types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// ── Helper: unwrap ApiResponse<T> ────────────────────────────
function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.result === null || response.result === undefined) {
    const msg = response.errorMessages?.length > 0
      ? response.errorMessages.join(' | ')
      : 'Đã có lỗi xảy ra'
    throw new Error(msg)
  }
  return response.result
}

// ── Mock Data ─────────────────────────────────────────────────

// Cache skills lấy từ /api/skills (public endpoint, không cần auth)
export let AVAILABLE_SKILLS: SkillItem[] = [
  { id: 'sk-0001-8f4b-4a5f-9e8c-123456789abc', name: 'Sơ cứu y tế',               description: 'Có chứng chỉ sơ cấp cứu, xử lý chấn thương cơ bản' },
  { id: 'sk-0002-8f4b-4a5f-9e8c-123456789abc', name: 'Lái xe cứu thương / xe tải', description: 'Bằng lái B2 trở lên, có kinh nghiệm lái đường đèo dốc' },
  { id: 'sk-0003-8f4b-4a5f-9e8c-123456789abc', name: 'Hậu cần và phân phát',       description: 'Sắp xếp kho bãi, kiểm kê hàng hóa, điều phối phân quà' },
  { id: 'sk-0004-8f4b-4a5f-9e8c-123456789abc', name: 'Tìm kiếm & Cứu hộ',         description: 'Đã qua đào tạo cứu hộ thiên tai, bơi lội tốt, sức khỏe tốt' },
  { id: 'sk-0005-8f4b-4a5f-9e8c-123456789abc', name: 'Hỗ trợ tâm lý / truyền thông', description: 'Động viên tinh thần người dân bị nạn, viết bài cập nhật thông tin' },
]

// Mock profile — skills là VolunteerSkill[] (có id)
let mockProfile: VolunteerProfile | null = {
  id:              'vol-3fa85f64-5717-4562-b3fc-2c963f66afa6',
  userId:          '33333333-3333-3333-3333-333333333333',
  fullName:        'Lê Tình Nguyện',
  email:           'volunteer@relief.vn',
  phoneNumber:     '0903000003',
  address:         'Bãi biển Cửa Ông, Quảng Ninh',
  latitude:        21.0285,
  longitude:       105.8542,
  experienceYears: 2,
  bio:             'Tôi đam mê thiện nguyện và mong muốn đóng góp cho cộng đồng.',
  status:          'Approved',
  skills: [
    { id: 'sk-0001-8f4b-4a5f-9e8c-123456789abc', name: 'Sơ cứu y tế' },
    { id: 'sk-0003-8f4b-4a5f-9e8c-123456789abc', name: 'Hậu cần và phân phát' },
  ],
}

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// ── Public: GET /api/skills (không cần auth) ─────────────────

/**
 * Lấy danh sách toàn bộ kỹ năng hệ thống.
 * Endpoint public — không cần token.
 * GET /api/skills
 */
export async function loadAvailableSkills(): Promise<SkillItem[]> {
  if (USE_MOCK) {
    return [...AVAILABLE_SKILLS]
  }

  try {
    const { data } = await http.get<ApiResponse<SkillItem[]>>('/skills')
    const fetched = unwrap(data)
    if (fetched.length > 0) {
      AVAILABLE_SKILLS = fetched
    }
    return [...AVAILABLE_SKILLS]
  } catch {
    // Fallback về danh sách local nếu endpoint không phản hồi
    return [...AVAILABLE_SKILLS]
  }
}

// ── GET /api/volunteers/me ────────────────────────────────────

/**
 * Lấy hồ sơ tình nguyện viên của user đang đăng nhập.
 * 🔒 Auth: RequesterOrVolunteer
 * Error 404: hồ sơ chưa được tạo
 */
export async function getVolunteerProfile(): Promise<VolunteerProfile> {
  if (USE_MOCK) {
    await delay()
    if (!mockProfile) {
      throw new Error('Hồ sơ chưa được tạo')
    }
    return { ...mockProfile, skills: [...mockProfile.skills] }
  }

  const { data } = await http.get<ApiResponse<VolunteerProfile>>('/volunteers/me')
  return unwrap(data)
}

// ── POST /api/volunteers/profile ─────────────────────────────

/**
 * Tạo hồ sơ tình nguyện viên mới.
 * 🔒 Auth: RequesterOrVolunteer
 * Body: { address, latitude, longitude, experienceYears, bio? }
 * Response: 201 Created — { id, message }
 * Error 400: hồ sơ đã tồn tại
 */
export async function createVolunteerProfile(
  payload: VolunteerProfilePayload,
): Promise<CreateVolunteerProfileResponse> {
  if (USE_MOCK) {
    await delay()
    if (mockProfile) {
      throw new Error('Hồ sơ đã tồn tại. Vui lòng dùng chức năng cập nhật.')
    }
    mockProfile = {
      id:              'vol-new-' + Date.now(),
      userId:          '33333333-3333-3333-3333-333333333333',
      fullName:        'Lê Tình Nguyện',
      email:           'volunteer@relief.vn',
      phoneNumber:     '0903000003',
      address:         payload.address,
      latitude:        payload.latitude,
      longitude:       payload.longitude,
      experienceYears: payload.experienceYears,
      bio:             payload.bio ?? null,
      status:          'Pending',
      skills:          [],
    }
    return { id: mockProfile.id, message: 'Tạo hồ sơ thành công. Đang chờ Admin duyệt.' }
  }

  const { data } = await http.post<ApiResponse<CreateVolunteerProfileResponse>>(
    '/volunteers/profile',
    payload,
  )
  return unwrap(data)
}

// ── PUT /api/volunteers/profile ──────────────────────────────

/**
 * Cập nhật hồ sơ tình nguyện viên.
 * 🔒 Auth: RequesterOrVolunteer (chỉ chủ sở hữu)
 * Body: { address, latitude, longitude, experienceYears, bio? }
 * Response: { id, message }
 * Error 404: hồ sơ không tồn tại | 403: không phải chủ sở hữu
 */
export async function updateVolunteerProfile(
  payload: VolunteerProfilePayload,
): Promise<UpdateVolunteerProfileResponse> {
  if (USE_MOCK) {
    await delay()
    if (!mockProfile) {
      throw new Error('Hồ sơ không tồn tại')
    }
    mockProfile = {
      ...mockProfile,
      address:         payload.address,
      latitude:        payload.latitude,
      longitude:       payload.longitude,
      experienceYears: payload.experienceYears,
      bio:             payload.bio ?? null,
    }
    return { id: mockProfile.id, message: 'Cập nhật hồ sơ thành công.' }
  }

  const { data } = await http.put<ApiResponse<UpdateVolunteerProfileResponse>>(
    '/volunteers/profile',
    payload,
  )
  return unwrap(data)
}

// ── POST /api/volunteers/skills ──────────────────────────────

/**
 * Đăng ký thêm kỹ năng vào hồ sơ.
 * 🔒 Auth: RequesterOrVolunteer
 * Body: { skillIds: Guid[] }
 * Response: { addedCount, message }
 * Error 400: kỹ năng không hợp lệ hoặc đã có hết | 404: hồ sơ không tồn tại
 */
export async function registerSkills(
  skillIds: string[],
): Promise<AddVolunteerSkillsResponse> {
  if (USE_MOCK) {
    await delay()
    if (!mockProfile) {
      throw new Error('Hồ sơ không tồn tại')
    }
    const existing = new Set(mockProfile.skills.map(s => s.id))
    const toAdd = AVAILABLE_SKILLS
      .filter(s => skillIds.includes(s.id) && !existing.has(s.id))
      .map(s => ({ id: s.id, name: s.name }))

    if (toAdd.length === 0) {
      throw new Error('Tất cả kỹ năng đã được đăng ký từ trước.')
    }
    mockProfile.skills = [...mockProfile.skills, ...toAdd]
    return { addedCount: toAdd.length, message: `Đã thêm ${toAdd.length} kỹ năng thành công.` }
  }

  const payload: AddSkillsPayload = { skillIds }
  const { data } = await http.post<ApiResponse<AddVolunteerSkillsResponse>>(
    '/volunteers/skills',
    payload,
  )
  return unwrap(data)
}

// ── DELETE /api/volunteers/skills/{skillId} ──────────────────

/**
 * Xóa một kỹ năng khỏi hồ sơ.
 * 🔒 Auth: RequesterOrVolunteer
 * {skillId} là GUID của VolunteerSkill (id trong skills[])
 * Response: { message }
 * Error 404: hồ sơ không tồn tại | kỹ năng không tìm thấy
 */
export async function deleteSkill(
  skillId: string,
): Promise<RemoveVolunteerSkillResponse> {
  if (USE_MOCK) {
    await delay()
    if (!mockProfile) {
      throw new Error('Hồ sơ không tồn tại')
    }
    const before = mockProfile.skills.length
    mockProfile.skills = mockProfile.skills.filter(s => s.id !== skillId)
    if (mockProfile.skills.length === before) {
      throw new Error('Không tìm thấy kỹ năng này trong hồ sơ.')
    }
    return { message: 'Đã xóa kỹ năng thành công.' }
  }

  const { data } = await http.delete<ApiResponse<RemoveVolunteerSkillResponse>>(
    `/volunteers/skills/${skillId}`,
  )
  return unwrap(data)
}
