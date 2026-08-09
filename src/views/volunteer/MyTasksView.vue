<template>
  <VolunteerLayout>
    <div class="tasks-page">
      <div class="page-header">
        <div>
          <div class="role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            {{ $t('volunteer.role_title') }}
          </div>
          <h1 class="page-title">{{ $t('volunteer.tasks_title') }}</h1>
          <p class="page-sub">{{ $t('volunteer.tasks_sub') }}</p>
        </div>
        <div class="page-badge">
          <span class="page-badge__dot" />
          {{ activeFilterLabel }}
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card summary-card--active">
          <p class="summary-label">{{ $t('volunteer.tasks_filter_ongoing') }}</p>
          <strong class="summary-value">{{ activeCount }}</strong>
        </div>
        <div class="summary-card summary-card--upcoming">
          <p class="summary-label">{{ $t('volunteer.tasks_filter_upcoming') }}</p>
          <strong class="summary-value">{{ upcomingCount }}</strong>
        </div>
        <div class="summary-card summary-card--done">
          <p class="summary-label">{{ $t('volunteer.tasks_filter_completed') }}</p>
          <strong class="summary-value">{{ completedCount }}</strong>
        </div>
      </div>

      <div class="filter-row">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="filter-pill"
          :class="{ active: selectedFilter === filter.value }"
          @click="selectedFilter = filter.value"
        >
          {{ $t(filter.labelKey) }}
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">{{ $t('volunteer.tasks_loading') }}</div>
      <div v-else-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
 
      <div v-else-if="filteredTasks.length === 0" class="empty-state">
        <p>{{ $t('volunteer.tasks_empty') }}</p>
      </div>

      <div v-else class="task-list">
        <article v-for="task in filteredTasks" :key="task.id" class="task-card">
          <div class="task-card__header">
            <div>
              <h3 class="task-title">{{ task.title }}</h3>
              <p class="task-address">{{ task.address }}</p>
            </div>
            <span class="task-status" :class="`status--${task.status}`">{{ $t(`volunteer.tasks_status_${task.status}`) }}</span>
          </div>

          <div class="task-meta">
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{{ task.date }}</span>
            </div>
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{{ task.time }}</span>
            </div>
          </div>

          <div class="progress-block">
            <div class="progress-top">
              <span>{{ $t('volunteer.tasks_progress') }}</span>
              <strong>{{ task.progress }}%</strong>
            </div>
            <div class="progress-bar">
              <span :style="{ width: `${task.progress}%` }" />
            </div>
          </div>

          <div class="map-block">
            <div
              v-if="hasValidCoords(task)"
              :ref="(el) => setMapRef(String(task.id), el as HTMLElement | null)"
              class="task-map"
            ></div>
            <p v-else class="map-empty">{{ $t('volunteer.tasks_no_location') }}</p>
          </div>

          <div class="task-footer">
            <span class="task-note">{{ task.note }}</span>
            <button class="detail-btn">{{ $t('volunteer.tasks_btn_detail') }}</button>
          </div>
        </article>
      </div>
    </div>
  </VolunteerLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import VolunteerLayout from '@/components/layout/VolunteerLayout.vue'
import { getMyTasks } from '@/features/tasks/tasks.api'
import type { TaskItem, TaskStatus } from '@/features/tasks/tasks.types'

// Màu marker theo trạng thái nhiệm vụ — đồng bộ tinh thần với dotStyle bên
// requests.helpers.ts (Requester), nhưng TaskStatus của Volunteer là bộ giá
// trị khác (ongoing/upcoming/completed) nên định nghĩa riêng ở đây.
const TASK_STATUS_MARKER_COLOR: Record<TaskStatus, string> = {
  ongoing: '#e27d24',
  upcoming: '#3182ce',
  completed: '#276749',
}

const { t } = useI18n()
const selectedFilter = ref('all')
const isLoading = ref(false)
const errorMessage = ref('')

const filters = [
  { value: 'all', labelKey: 'volunteer.tasks_filter_all' },
  { value: 'ongoing', labelKey: 'volunteer.tasks_filter_ongoing' },
  { value: 'upcoming', labelKey: 'volunteer.tasks_filter_upcoming' },
  { value: 'completed', labelKey: 'volunteer.tasks_filter_completed' },
]

const tasks = ref<TaskItem[]>([])

async function loadTasks() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    tasks.value = await getMyTasks()
  } catch (err: any) {
    tasks.value = []
    errorMessage.value = err?.message || 'Không thể tải danh sách nhiệm vụ.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadTasks()
})

const filteredTasks = computed(() => {
  if (selectedFilter.value === 'all') return tasks.value
  return tasks.value.filter((task) => task.status === selectedFilter.value)
})

const activeFilterLabel = computed(() => {
  const item = filters.find((item) => item.value === selectedFilter.value)
  return item ? t(item.labelKey) : t('volunteer.tasks_filter_all')
})

const activeCount = computed(() => tasks.value.filter((task) => task.status === 'ongoing').length)
const upcomingCount = computed(() => tasks.value.filter((task) => task.status === 'upcoming').length)
const completedCount = computed(() => tasks.value.filter((task) => task.status === 'completed').length)

// ── Bản đồ mini theo từng card (Leaflet + OpenStreetMap) ───
// Cùng pattern đã dùng ở TrackingView.vue (Requester): circleMarker màu theo
// status, tắt tương tác vì chỉ để xem nhanh trong danh sách.
const mapEls = new Map<string, HTMLElement>()
const mapInstances = new Map<string, L.Map>()

function setMapRef(id: string, el: HTMLElement | null) {
  if (el) mapEls.set(id, el)
  else mapEls.delete(id)
}

function hasValidCoords(task: TaskItem): boolean {
  return typeof task.latitude === 'number' && typeof task.longitude === 'number'
}

function destroyMaps() {
  mapInstances.forEach((map) => map.remove())
  mapInstances.clear()
}

function renderMaps() {
  destroyMaps()

  for (const task of filteredTasks.value) {
    if (!hasValidCoords(task)) continue
    const el = mapEls.get(String(task.id))
    if (!el) continue

    const map = L.map(el, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      attributionControl: false,
    }).setView([task.latitude as number, task.longitude as number], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)

    L.circleMarker([task.latitude as number, task.longitude as number], {
      radius: 9,
      fillColor: TASK_STATUS_MARKER_COLOR[task.status],
      fillOpacity: 0.9,
      color: '#fff',
      weight: 2,
    }).addTo(map)

    mapInstances.set(String(task.id), map)
  }
}

watch(filteredTasks, async () => {
  await nextTick()
  renderMaps()
})

onBeforeUnmount(() => {
  destroyMaps()
})
</script>

<style scoped>
.tasks-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(39, 103, 73, 0.1);
  color: #276749;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  color: #1a3b5c;
  margin: 0;
}

.page-sub {
  margin-top: 4px;
  font-size: 13.5px;
  color: #718096;
}

.page-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 12.5px;
  color: #4a5568;
  white-space: nowrap;
}

.page-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #276749;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.summary-card {
  background: #fff;
  border: 1px solid #ecf2f7;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.summary-card--active {
  border-left: 4px solid #e27d24;
}

.summary-card--upcoming {
  border-left: 4px solid #3182ce;
}

.summary-card--done {
  border-left: 4px solid #276749;
}

.summary-label {
  margin: 0 0 6px;
  font-size: 12px;
  color: #718096;
}

.summary-value {
  font-size: 24px;
  font-weight: 800;
  color: #1a3b5c;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.filter-pill {
  border: 1px solid #dce7ef;
  background: #fff;
  color: #4a5568;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill.active {
  background: linear-gradient(135deg, #276749 0%, #48bb78 100%);
  color: #fff;
  border-color: transparent;
}

.task-list {
  display: grid;
  gap: 16px;
}

.loading-state,
.empty-state,
.error-banner {
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 18px;
  color: #4a5568;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.error-banner {
  border-color: #fed7d7;
  color: #c53030;
  background: #fff5f5;
}

.task-card {
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.05);
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.task-title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #1a3b5c;
}

.task-address {
  margin: 0;
  color: #718096;
  font-size: 13px;
}

.task-status {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}

.status--ongoing {
  background: #fef3e2;
  color: #b45309;
}

.status--upcoming {
  background: #ebf8ff;
  color: #2b6cb0;
}

.status--completed {
  background: #e8f5ee;
  color: #276749;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a5568;
  font-size: 13px;
}

.progress-block {
  margin-bottom: 14px;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #4a5568;
  font-size: 13px;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #edf2f7;
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #276749 0%, #48bb78 100%);
  transition: width 0.25s ease;
}

.map-block {
  margin-bottom: 14px;
}

.task-map {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #edf2f7;
  z-index: 0;
}

.map-empty {
  margin: 0;
  padding: 14px;
  text-align: center;
  font-size: 12.5px;
  color: #a0aec0;
  background: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 10px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.task-note {
  color: #718096;
  font-size: 13px;
}

.detail-btn {
  border: none;
  background: #276749;
  color: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.detail-btn:hover {
  background: #1f5337;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .task-card__header,
  .task-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-map {
    height: 160px;
  }
}
</style>
