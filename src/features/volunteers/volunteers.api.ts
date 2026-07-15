// ============================================================
//  Volunteers API — /api/volunteers
//  Hỗ trợ đầy đủ Mock Mode để phát triển và Real API
// ============================================================

import { http, ApiError } from '@/lib/api/http'
import type { VolunteerProfile, VolunteerProfilePayload, SkillItem } from './volunteers.types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// ── Mock Data ────────────────────────────────────────────────

// Danh sách tất cả kỹ năng có sẵn trên hệ thống (dùng cho Mock & Chọn lựa ở UI)
export let AVAILABLE_SKILLS: SkillItem[] = [
  { id: 'sk-0001-8f4b-4a5f-9e8c-123456789abc', name: 'Sơ cứu y tế', description: 'Có chứng chỉ sơ cấp cứu, xử lý chấn thương cơ bản' },
  { id: 'sk-0002-8f4b-4a5f-9e8c-123456789abc', name: 'Lái xe cứu thương / xe tải', description: 'Bằng lái B2 trở lên, có kinh nghiệm lái đường đèo dốc' },
  { id: 'sk-0003-8f4b-4a5f-9e8c-123456789abc', name: 'Hậu cần và phân phát', description: 'Sắp xếp kho bãi, kiểm kê hàng hóa, điều phối phân quà' },
  { id: 'sk-0004-8f4b-4a5f-9e8c-123456789abc', name: 'Tìm kiếm & Cứu hộ', description: 'Đã qua đào tạo cứu hộ thiên tai, bơi lội tốt, sức khỏe tốt' },
  { id: 'sk-0005-8f4b-4a5f-9e8c-123456789abc', name: 'Hỗ trợ tâm lý / truyền thông', description: 'Động viên tinh thần người dân bị nạn, viết bài cập nhật thông tin' }
]

let mockProfile: VolunteerProfile | null = {
  id: 'vol-3fa85f64-5717-4562-b3fc-2c963f66afa6',
  userId: '33333333-3333-3333-3333-333333333333', // khớp với volunteer@relief.vn
  fullName: 'Lê Tình Nguyện',
  email: 'volunteer@relief.vn',
  phoneNumber: '0903000003',
  address: 'Bãi biển Cửa Ông, Quảng Ninh',
  latitude: 21.0285,
  longitude: 105.8542,
  experienceYears: 2,
  bio: 'Tôi đam mê thiện nguyện và mong muốn đóng góp cho cộng đồng.',
  isApproved: true,
  skills: ['Sơ cứu y tế', 'Hậu cần và phân phát']
}

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

function normalizeSkill(item: { id?: string; name?: string; description?: string | null }): SkillItem | null {
  if (!item?.id || !item?.name) return null
  return {
    id: item.id,
    name: item.name,
    description: item.description || undefined,
  }
}

export async function loadAvailableSkills(): Promise<SkillItem[]> {
  if (USE_MOCK) {
    return AVAILABLE_SKILLS
  }

  try {
    const { data } = await http.get<Array<{ id: string; name: string; description?: string | null }>>('/skills')
    const fetched = data
      .map(normalizeSkill)
      .filter((skill): skill is SkillItem => Boolean(skill))

    if (fetched.length > 0) {
      AVAILABLE_SKILLS = fetched
    }
  } catch {
    // Fallback to existing hardcoded skills if the real endpoint is unavailable.
  }

  return AVAILABLE_SKILLS
}

// ── API Functions ───────────────────────────────────────────

/**
 * Lấy hồ sơ tình nguyện viên của user đang đăng nhập
 * GET /api/volunteers/me
 */
export async function getVolunteerProfile(): Promise<VolunteerProfile> {
  if (USE_MOCK) {
    await delay()
    if (!mockProfile) {
      throw new Error('Hồ sơ chưa được tạo')
    }
    return { ...mockProfile }
  }

  try {
    const { data } = await http.get<VolunteerProfile>('/volunteers/me')
    return data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      try {
        const { data } = await http.get<VolunteerProfile>('/volunteers/profile')
        return data
      } catch (fallbackError) {
        if (fallbackError instanceof ApiError && fallbackError.status === 404) {
          throw new Error('Hồ sơ chưa được tạo')
        }
        throw fallbackError
      }
    }

    throw error
  }
}

/**
 * Tạo hồ sơ tình nguyện viên mới
 * POST /api/volunteers/profile
 */
export async function createVolunteerProfile(payload: VolunteerProfilePayload): Promise<VolunteerProfile> {
  if (USE_MOCK) {
    await delay()
    const resolvedSkills = payload.skillIds.map(id => AVAILABLE_SKILLS.find(s => s.id === id)?.name || id)
    mockProfile = {
      id: 'vol-new-guid-3456',
      userId: '33333333-3333-3333-3333-333333333333',
      fullName: 'Lê Tình Nguyện',
      email: 'volunteer@relief.vn',
      phoneNumber: '0903000003',
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      experienceYears: payload.experienceYears,
      bio: payload.bio,
      isApproved: true,
      skills: resolvedSkills
    }
    return { ...mockProfile }
  }

  const { data } = await http.post<VolunteerProfile>('/volunteers/profile', payload)
  return data
}

/**
 * Cập nhật hồ sơ tình nguyện viên
 * PUT /api/volunteers/profile
 */
export async function updateVolunteerProfile(payload: VolunteerProfilePayload): Promise<VolunteerProfile> {
  if (USE_MOCK) {
    await delay()
    if (!mockProfile) {
      throw new Error('Hồ sơ không tồn tại')
    }
    const resolvedSkills = payload.skillIds.map(id => AVAILABLE_SKILLS.find(s => s.id === id)?.name || id)
    mockProfile = {
      ...mockProfile,
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      experienceYears: payload.experienceYears,
      bio: payload.bio,
      skills: resolvedSkills
    }
    return { ...mockProfile }
  }

  const { data } = await http.put<VolunteerProfile>('/volunteers/profile', payload)
  return data
}

/**
 * Đăng ký thêm các kỹ năng mới
 * POST /api/volunteers/skills
 */
export async function registerSkills(skillIds: string[]): Promise<void> {
  if (USE_MOCK) {
    await delay()
    if (mockProfile) {
      const newNames = skillIds.map(id => AVAILABLE_SKILLS.find(s => s.id === id)?.name || id)
      const current = new Set(mockProfile.skills)
      newNames.forEach(name => current.add(name))
      mockProfile.skills = Array.from(current)
    }
    return
  }

  try {
    await http.post('/volunteers/skills', skillIds)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Không thể cập nhật kỹ năng'
    throw new Error(message)
  }
}

/**
 * Xóa một kỹ năng đã đăng ký
 * DELETE /api/volunteers/skills/{skillId}
 */
export async function deleteSkill(skillId: string): Promise<void> {
  if (USE_MOCK) {
    await delay()
    if (mockProfile) {
      const skillName = AVAILABLE_SKILLS.find(s => s.id === skillId)?.name || skillId
      mockProfile.skills = mockProfile.skills.filter(name => name !== skillName)
    }
    return
  }

  await http.delete(`/volunteers/skills/${skillId}`)
}
