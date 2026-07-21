// ============================================================
//  Skills API — /api/skills
//  GET: public (không cần đăng nhập). POST/PUT/DELETE: AdminOnly.
//  Mock mode dùng chung fixture AVAILABLE_SKILLS với volunteers.api.ts
//  để tránh 2 danh sách kỹ năng lệch nhau khi test không có BE.
// ============================================================

import { http } from '@/lib/api/http'
import { AVAILABLE_SKILLS } from '@/features/volunteers/volunteers.api'
import type { Skill, SkillPayload, SkillMutationResult } from './skills.types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

/** GET /api/skills — danh sách toàn bộ kỹ năng (đã lọc kỹ năng xoá mềm) */
export async function getSkills(): Promise<Skill[]> {
  if (USE_MOCK) {
    await delay()
    return AVAILABLE_SKILLS.map((s) => ({ id: s.id, name: s.name, description: s.description ?? '' }))
  }

  const { data } = await http.get<Skill[]>('/skills')
  return data
}

/** POST /api/skills — tạo kỹ năng mới (Admin) */
export async function createSkill(payload: SkillPayload): Promise<SkillMutationResult> {
  if (USE_MOCK) {
    await delay()
    const id = `mock-skill-${Date.now()}`
    AVAILABLE_SKILLS.push({ id, name: payload.name, description: payload.description })
    return { id, message: 'Tạo kỹ năng thành công' }
  }

  const { data } = await http.post<SkillMutationResult>('/skills', payload)
  return data
}

/** PUT /api/skills/{id} — cập nhật tên/mô tả kỹ năng (Admin) */
export async function updateSkill(id: string, payload: SkillPayload): Promise<SkillMutationResult> {
  if (USE_MOCK) {
    await delay()
    const target = AVAILABLE_SKILLS.find((s) => s.id === id)
    if (target) {
      target.name = payload.name
      target.description = payload.description
    }
    return { id, message: 'Cập nhật kỹ năng thành công' }
  }

  const { data } = await http.put<SkillMutationResult>(`/skills/${id}`, payload)
  return data
}

/** DELETE /api/skills/{id} — xoá mềm kỹ năng khỏi danh mục (Admin) */
export async function deleteSkill(id: string): Promise<SkillMutationResult> {
  if (USE_MOCK) {
    await delay()
    const idx = AVAILABLE_SKILLS.findIndex((s) => s.id === id)
    if (idx !== -1) AVAILABLE_SKILLS.splice(idx, 1)
    return { id, message: 'Xoá kỹ năng thành công' }
  }

  const { data } = await http.delete<SkillMutationResult>(`/skills/${id}`)
  return data
}
