// ============================================================
//  Tasks API – các hàm gọi API cho tính năng "Nhiệm vụ của tôi"
//  Endpoint chính: GET /volunteer/tasks
// ============================================================

import { http } from '@/lib/api/http'
import type { RawTask, TaskItem, TaskStatus } from './tasks.types'

// ── Helpers chuẩn hoá dữ liệu ────────────────────────────────

function normalizeStatus(rawStatus?: string): TaskStatus {
  const status = (rawStatus ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')

  if (['done', 'completed', 'complete', 'finished', 'finish', 'success'].includes(status))
    return 'completed'
  if (['inprogress', 'ongoing', 'active', 'in_progress', 'processing', 'working'].includes(status))
    return 'ongoing'
  return 'upcoming'
}

function statusLabel(status: TaskStatus): string {
  if (status === 'ongoing') return 'Đang thực hiện'
  if (status === 'completed') return 'Đã hoàn thành'
  return 'Sắp diễn ra'
}

export function normalizeTask(raw: RawTask, index: number): TaskItem {
  const title = String(raw.title ?? raw.name ?? raw.taskName ?? `Nhiệm vụ ${index + 1}`)
  const address = String(
    raw.address ?? raw.location ?? raw.locationName ?? 'Địa điểm chưa cập nhật',
  )
  const dateValue = raw.date ?? raw.startDate ?? raw.scheduleDate ?? raw.start_at
  const timeValue = raw.time ?? raw.startTime ?? raw.endTime ?? raw.timeRange ?? raw.slot
  const progress = Number(raw.progress ?? raw.percentage ?? raw.completedPercent ?? 0)
  const rawStatusStr = String(raw.status ?? raw.state ?? raw.taskStatus ?? '')
  const resolvedStatus = normalizeStatus(rawStatusStr)

  return {
    id: Number(raw.id ?? index + 1),
    title,
    address,
    date: dateValue
      ? new Date(String(dateValue)).toLocaleDateString('vi-VN')
      : 'Chưa cập nhật',
    time: String(timeValue ?? 'Chưa cập nhật'),
    progress: Number.isFinite(progress) ? progress : 0,
    status: resolvedStatus,
    statusLabel: statusLabel(resolvedStatus),
    note: String(raw.note ?? raw.description ?? raw.summary ?? 'Chưa có ghi chú'),
  }
}

function extractList(payload: unknown): RawTask[] {
  if (Array.isArray(payload)) return payload as RawTask[]
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>
    for (const key of ['items', 'data', 'tasks', 'result']) {
      if (Array.isArray(data[key])) return data[key] as RawTask[]
    }
  }
  return []
}

// ── API functions ─────────────────────────────────────────────

/**
 * Lấy danh sách nhiệm vụ của tình nguyện viên đang đăng nhập.
 * Endpoint: GET /volunteer/tasks
 */
export async function getMyTasks(): Promise<TaskItem[]> {
  const { data } = await http.get<unknown>('/volunteer/tasks')
  return extractList(data).map((item, i) => normalizeTask(item, i))
}

/**
 * Lấy nhiệm vụ theo trạng thái.
 * Endpoint: GET /volunteer/tasks?status=ongoing|upcoming|completed
 */
export async function getMyTasksByStatus(status: TaskStatus): Promise<TaskItem[]> {
  const { data } = await http.get<unknown>('/volunteer/tasks', { params: { status } })
  return extractList(data).map((item, i) => normalizeTask(item, i))
}

/**
 * Lấy chi tiết một nhiệm vụ.
 * Endpoint: GET /volunteer/tasks/:id
 */
export async function getTaskById(id: string | number): Promise<TaskItem> {
  const { data } = await http.get<RawTask>(`/volunteer/tasks/${id}`)
  return normalizeTask(data, 0)
}
