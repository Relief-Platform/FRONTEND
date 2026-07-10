// ============================================================
//  Tasks – TypeScript interfaces
// ============================================================

export type TaskStatus = 'ongoing' | 'upcoming' | 'completed'

export interface TaskItem {
  id: number | string
  title: string
  address: string
  date: string
  time: string
  progress: number
  status: TaskStatus
  statusLabel: string
  note: string
}

/** Raw shape trả về từ API (có thể thay đổi tuỳ backend) */
export interface RawTask {
  id?: number | string
  title?: string
  name?: string
  taskName?: string
  address?: string
  location?: string
  locationName?: string
  date?: string
  startDate?: string
  scheduleDate?: string
  startTime?: string
  start_at?: string
  time?: string
  endTime?: string
  timeRange?: string
  slot?: string
  progress?: number
  percentage?: number
  completedPercent?: number
  status?: string
  state?: string
  taskStatus?: string
  note?: string
  description?: string
  summary?: string
  [key: string]: unknown
}

export interface PaginatedTasks {
  items: RawTask[]
  total: number
  page: number
  pageSize: number
}
