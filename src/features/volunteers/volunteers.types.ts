// ============================================================
//  Volunteers – TypeScript interfaces
//  Sync với BE spec: ID dạng GUID string
// ============================================================

export interface VolunteerProfile {
  id: string               // GUID: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  userId: string           // GUID: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  fullName: string
  email: string
  phoneNumber: string
  address: string
  latitude: number
  longitude: number
  experienceYears: number
  bio: string | null       // nullable
  isApproved: boolean
  skills: string[]         // Tên các kỹ năng đã đăng ký: ["Sơ cứu y tế", "Lái xe"]
}

export interface VolunteerProfilePayload {
  address: string
  latitude: number
  longitude: number
  experienceYears: number
  bio: string | null
  skillIds: string[]       // Danh sách GUID các kỹ năng đăng ký ban đầu
}

export interface SkillItem {
  id: string               // GUID
  name: string
  description?: string
}
