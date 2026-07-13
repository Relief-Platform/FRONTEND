<template>
  <AdminLayout>
    <div class="rrm-page">
      <!-- ── Header ─────────────────────────────────────── -->
      <div class="page-header">
        <div>
          <div class="role-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Quản lý Yêu cầu cứu trợ
          </div>
          <h1 class="page-title">Danh sách Yêu cầu</h1>
          <p class="page-sub">Xem, duyệt và quản lý trạng thái tất cả yêu cầu trong hệ thống</p>
        </div>
        <div class="header-stats">
          <div class="hstat" v-for="s in headerStats" :key="s.label" :style="{ '--hs-color': s.color }">
            <span class="hstat__val">{{ s.val }}</span>
            <span class="hstat__label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- ── Filters ────────────────────────────────────── -->
      <div class="filter-bar">
        <div class="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            v-model="searchQuery"
            class="search-input"
            placeholder="Tìm theo tiêu đề, địa chỉ..."
          />
        </div>
        <div class="status-filters">
          <button
            v-for="f in statusFilters"
            :key="f.key"
            class="status-filter-btn"
            :class="{ active: activeFilter === f.key }"
            :style="activeFilter === f.key ? { '--af-bg': f.bg, '--af-color': f.color } : {}"
            @click="activeFilter = f.key"
          >
            <span class="filter-dot" :style="{ background: f.dot }" />
            {{ f.label }}
            <span class="filter-count">{{ f.count }}</span>
          </button>
        </div>
        <select v-model="sortBy" class="sort-select">
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="emergency-desc">Cấp độ ↓</option>
          <option value="emergency-asc">Cấp độ ↑</option>
        </select>
      </div>

      <!-- ── Table ──────────────────────────────────────── -->
      <div class="table-card">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner" />
          Đang tải dữ liệu...
        </div>
        <div v-else-if="displayedRows.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <p>Không có yêu cầu nào</p>
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Địa chỉ</th>
              <th class="th-center">Cấp độ</th>
              <th class="th-center">Nhu cầu</th>
              <th class="th-center">Trạng thái</th>
              <th>Ngày tạo</th>
              <th class="th-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="req in displayedRows"
              :key="req.id"
              class="data-row"
              @click="openDetail(req.id)"
            >
              <td class="td-title">
                <span class="title-text">{{ req.title }}</span>
                <span class="affect-info">{{ req.affectedPeople }} người</span>
              </td>
              <td class="td-address">{{ req.address }}</td>
              <td class="th-center">
                <span class="emergency-badge" :class="`elv-${req.emergencyLevel}`">
                  {{ EMERGENCY_LABELS[req.emergencyLevel] }}
                </span>
              </td>
              <td class="th-center">
                <div class="needs-icons">
                  <span v-if="req.needFood"     class="need-chip" title="Lương thực">🍚</span>
                  <span v-if="req.needWater"    class="need-chip" title="Nước sạch">💧</span>
                  <span v-if="req.needMedicine" class="need-chip" title="Thuốc men">💊</span>
                  <span v-if="req.needBlanket"  class="need-chip" title="Chăn màn">🛏</span>
                  <span v-if="req.needShelter"  class="need-chip" title="Nơi trú ẩn">🏠</span>
                </div>
              </td>
              <td class="th-center">
                <span class="status-badge" :style="badgeStyle(req.status)">
                  <span class="status-dot" :style="dotStyle(req.status)" />
                  {{ STATUS_LABEL_FULL[req.status] }}
                </span>
              </td>
              <td class="td-date">{{ formatDateTimeVI(req.createdAt) }}</td>
              <td class="th-center" @click.stop>
                <button class="btn-view" @click="openDetail(req.id)">Chi tiết</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Detail Drawer ──────────────────────────────── -->
      <Transition name="drawer">
        <div v-if="drawerOpen" class="drawer-overlay" @click.self="closeDrawer">
          <div class="drawer">
            <div class="drawer-header">
              <div>
                <p class="drawer-subtitle">Chi tiết yêu cầu cứu trợ</p>
                <h2 class="drawer-title">{{ detail?.title }}</h2>
              </div>
              <button class="drawer-close" @click="closeDrawer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div v-if="isDetailLoading" class="drawer-loading">
              <div class="spinner" />
              Đang tải...
            </div>

            <template v-else-if="detail">
              <!-- Info grid -->
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Trạng thái</span>
                  <span class="status-badge" :style="badgeStyle(detail.status)">
                    <span class="status-dot" :style="dotStyle(detail.status)" />
                    {{ STATUS_LABEL_FULL[detail.status] }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Cấp độ khẩn cấp</span>
                  <span class="emergency-badge" :class="`elv-${detail.emergencyLevel}`">
                    {{ EMERGENCY_LABELS[detail.emergencyLevel] }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Số người bị ảnh hưởng</span>
                  <span class="info-val">{{ detail.affectedPeople }} người</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Số điện thoại liên hệ</span>
                  <span class="info-val">{{ detail.contactPhone }}</span>
                </div>
                <div class="info-item info-item--full">
                  <span class="info-label">Địa chỉ</span>
                  <span class="info-val">{{ detail.address }}</span>
                </div>
                <div class="info-item info-item--full">
                  <span class="info-label">Mô tả</span>
                  <span class="info-val">{{ detail.description }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Ngày tạo</span>
                  <span class="info-val">{{ formatDateTimeVI(detail.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tọa độ</span>
                  <span class="info-val">{{ detail.latitude.toFixed(5) }}, {{ detail.longitude.toFixed(5) }}</span>
                </div>
              </div>

              <!-- Needs -->
              <div class="section-block">
                <p class="section-label">Nhu cầu cần hỗ trợ</p>
                <div class="needs-tags">
                  <span v-if="detail.needFood"     class="need-tag">🍚 Lương thực</span>
                  <span v-if="detail.needWater"    class="need-tag">💧 Nước sạch</span>
                  <span v-if="detail.needMedicine" class="need-tag">💊 Thuốc men</span>
                  <span v-if="detail.needBlanket"  class="need-tag">🛏 Chăn màn</span>
                  <span v-if="detail.needShelter"  class="need-tag">🏠 Nơi trú ẩn</span>
                  <span v-if="!detail.needFood && !detail.needWater && !detail.needMedicine && !detail.needBlanket && !detail.needShelter" class="need-tag need-tag--none">Không có nhu cầu cụ thể</span>
                </div>
              </div>

              <!-- Status change -->
              <div class="section-block">
                <p class="section-label">Đổi trạng thái</p>
                <div class="status-flow">
                  <button
                    v-for="s in STATUS_TRANSITIONS[detail.status] ?? []"
                    :key="s"
                    class="flow-btn"
                    :class="`flow-btn--${s.toLowerCase()}`"
                    :disabled="isUpdating"
                    @click="changeStatus(s)"
                  >
                    <svg v-if="isUpdating && pendingStatus === s" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                    → {{ STATUS_LABEL_FULL[s] }}
                  </button>
                  <span v-if="!STATUS_TRANSITIONS[detail.status]?.length" class="flow-none">
                    Không có bước chuyển tiếp
                  </span>
                </div>
                <p v-if="statusMsg" class="status-msg" :class="statusMsgType === 'error' ? 'msg--error' : 'msg--ok'">{{ statusMsg }}</p>
              </div>

              <!-- Suggested volunteers (only when Approved) -->
              <div v-if="detail.status === 'Approved'" class="section-block">
                <div class="suggested-header">
                  <p class="section-label">Tình nguyện viên gợi ý gần nhất</p>
                  <button class="btn-refresh" @click="loadSuggested" :disabled="isSuggestLoading">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" :class="{ 'spin-icon': isSuggestLoading }"><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9"/><path d="M21 3v4h-4"/></svg>
                    Làm mới
                  </button>
                </div>

                <div v-if="isSuggestLoading" class="suggest-loading">
                  <div class="spinner" />
                  Đang tìm tình nguyện viên...
                </div>
                <div v-else-if="suggestedVolunteers.length === 0" class="suggest-empty">
                  Không có tình nguyện viên phù hợp trong khu vực.
                </div>
                <div v-else class="volunteer-cards">
                  <div
                    v-for="vol in suggestedVolunteers"
                    :key="vol.volunteerProfileId"
                    class="vol-card"
                  >
                    <div class="vol-card__avatar">{{ vol.fullName.split(' ').at(-1)?.[0] ?? '?' }}</div>
                    <div class="vol-card__info">
                      <p class="vol-card__name">{{ vol.fullName }}</p>
                      <p class="vol-card__email">{{ vol.email }}</p>
                      <div class="vol-card__tags">
                        <span class="vol-tag vol-tag--dist">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {{ vol.distanceKm.toFixed(1) }} km
                        </span>
                        <span class="vol-tag">{{ vol.experienceYears }} năm KN</span>
                        <span v-for="sk in vol.skills.slice(0, 2)" :key="sk" class="vol-tag">{{ sk }}</span>
                        <span v-if="vol.skills.length > 2" class="vol-tag vol-tag--more">+{{ vol.skills.length - 2 }}</span>
                      </div>
                    </div>
                    <button
                      class="btn-assign"
                      :disabled="isAssigning && assigningId === vol.volunteerProfileId"
                      @click="assignVolunteer(vol)"
                    >
                      <svg v-if="isAssigning && assigningId === vol.volunteerProfileId" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Phân công
                    </button>
                  </div>
                </div>
                <p v-if="assignMsg" class="status-msg" :class="assignMsgType === 'error' ? 'msg--error' : 'msg--ok'">{{ assignMsg }}</p>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  getReliefRequests,
  getReliefRequestById,
  updateReliefRequestStatus,
} from '@/features/requests/requests.api'
import { getSuggestedVolunteers, createAssignment } from '@/features/requests/admin-requests.api'
import {
  badgeStyle,
  dotStyle,
  formatDateTimeVI,
} from '@/features/requests/requests.helpers'
import type { ReliefRequestResponse, ReliefRequestStatus } from '@/features/requests/requests.types'
import { STATUS_GROUP_MAP, STATUS_LABEL_VI } from '@/features/requests/requests.types'
import type { SuggestedVolunteer } from '@/features/requests/admin-requests.api'

// ── Const maps ───────────────────────────────────────────────
const EMERGENCY_LABELS: Record<number, string> = {
  1: 'Thấp',
  2: 'Trung bình',
  3: 'Cao',
  4: 'Nguy cấp',
}

const STATUS_LABEL_FULL: Record<ReliefRequestStatus, string> = {
  Pending:    'Đang chờ',
  Approved:   'Đã duyệt',
  Assigned:   'Đã giao',
  InProgress: 'Đang xử lý',
  Completed:  'Hoàn thành',
  Cancelled:  'Đã hủy',
}

// State machine: Admin có thể đổi theo đúng flow
const STATUS_TRANSITIONS: Partial<Record<ReliefRequestStatus, ReliefRequestStatus[]>> = {
  Pending:    ['Approved', 'Cancelled'],
  Approved:   ['Cancelled'],
  Assigned:   ['Cancelled'],
  InProgress: ['Completed', 'Cancelled'],
}

// ── State ────────────────────────────────────────────────────
const allRequests = ref<ReliefRequestResponse[]>([])
const isLoading   = ref(true)

const searchQuery  = ref('')
const activeFilter = ref<string>('all')
const sortBy       = ref<string>('newest')

const drawerOpen      = ref(false)
const detail          = ref<ReliefRequestResponse | null>(null)
const isDetailLoading = ref(false)

const isUpdating   = ref(false)
const pendingStatus = ref<ReliefRequestStatus | null>(null)
const statusMsg    = ref('')
const statusMsgType = ref<'ok' | 'error'>('ok')

const suggestedVolunteers = ref<SuggestedVolunteer[]>([])
const isSuggestLoading    = ref(false)

const isAssigning  = ref(false)
const assigningId  = ref<string | null>(null)
const assignMsg    = ref('')
const assignMsgType = ref<'ok' | 'error'>('ok')

// ── Computed ─────────────────────────────────────────────────
const statusFilters = computed(() => {
  const all = allRequests.value
  const countOf = (s: ReliefRequestStatus) => all.filter(r => r.status === s).length
  return [
    { key: 'all',        label: 'Tất cả',       dot: '#94a3b8', bg: '#f1f5f9', color: '#475569', count: all.length },
    { key: 'Pending',    label: 'Đang chờ',      dot: '#f59e0b', bg: '#fef3c7', color: '#b45309', count: countOf('Pending') },
    { key: 'Approved',   label: 'Đã duyệt',      dot: '#22c55e', bg: '#dcfce7', color: '#15803d', count: countOf('Approved') },
    { key: 'Assigned',   label: 'Đã giao',        dot: '#3b82f6', bg: '#dbeafe', color: '#1d4ed8', count: countOf('Assigned') },
    { key: 'InProgress', label: 'Đang xử lý',    dot: '#8b5cf6', bg: '#ede9fe', color: '#6d28d9', count: countOf('InProgress') },
    { key: 'Completed',  label: 'Hoàn thành',    dot: '#10b981', bg: '#d1fae5', color: '#065f46', count: countOf('Completed') },
    { key: 'Cancelled',  label: 'Đã hủy',        dot: '#9ca3af', bg: '#f3f4f6', color: '#4b5563', count: countOf('Cancelled') },
  ]
})

const headerStats = computed(() => [
  { label: 'Chờ duyệt',  val: allRequests.value.filter(r => r.status === 'Pending').length,    color: '#f59e0b' },
  { label: 'Đã duyệt',   val: allRequests.value.filter(r => r.status === 'Approved').length,   color: '#22c55e' },
  { label: 'Đang xử lý', val: allRequests.value.filter(r => r.status === 'InProgress').length, color: '#8b5cf6' },
  { label: 'Hoàn thành', val: allRequests.value.filter(r => r.status === 'Completed').length,  color: '#10b981' },
])

const filteredRequests = computed(() => {
  let list = allRequests.value
  if (activeFilter.value !== 'all') {
    list = list.filter(r => r.status === activeFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q),
    )
  }
  return list
})

const displayedRows = computed(() => {
  const list = [...filteredRequests.value]
  if (sortBy.value === 'newest')        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (sortBy.value === 'oldest')        list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  if (sortBy.value === 'emergency-desc') list.sort((a, b) => b.emergencyLevel - a.emergencyLevel)
  if (sortBy.value === 'emergency-asc')  list.sort((a, b) => a.emergencyLevel - b.emergencyLevel)
  return list
})

// ── Lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  try {
    allRequests.value = await getReliefRequests(1, 200)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// ── Methods ──────────────────────────────────────────────────
async function openDetail(id: string) {
  drawerOpen.value = true
  detail.value = null
  suggestedVolunteers.value = []
  statusMsg.value = ''
  assignMsg.value = ''
  isDetailLoading.value = true
  try {
    detail.value = await getReliefRequestById(id)
    if (detail.value?.status === 'Approved') {
      loadSuggested()
    }
  } catch (e) {
    console.error(e)
  } finally {
    isDetailLoading.value = false
  }
}

function closeDrawer() {
  drawerOpen.value = false
  detail.value = null
}

async function loadSuggested() {
  if (!detail.value) return
  isSuggestLoading.value = true
  suggestedVolunteers.value = []
  try {
    suggestedVolunteers.value = await getSuggestedVolunteers(detail.value.id)
  } catch (e) {
    console.error(e)
  } finally {
    isSuggestLoading.value = false
  }
}

async function changeStatus(newStatus: ReliefRequestStatus) {
  if (!detail.value) return
  isUpdating.value = true
  pendingStatus.value = newStatus
  statusMsg.value = ''
  try {
    await updateReliefRequestStatus(detail.value.id, newStatus)
    // cập nhật local
    const idx = allRequests.value.findIndex(r => r.id === detail.value!.id)
    if (idx !== -1) allRequests.value[idx] = { ...allRequests.value[idx], status: newStatus }
    detail.value = { ...detail.value, status: newStatus }
    statusMsg.value = `Đã chuyển sang "${STATUS_LABEL_FULL[newStatus]}" thành công.`
    statusMsgType.value = 'ok'
    // nếu vừa Approved → tải suggested volunteers
    if (newStatus === 'Approved') loadSuggested()
    else suggestedVolunteers.value = []
  } catch (e: unknown) {
    statusMsg.value = e instanceof Error ? e.message : 'Cập nhật thất bại.'
    statusMsgType.value = 'error'
  } finally {
    isUpdating.value = false
    pendingStatus.value = null
  }
}

async function assignVolunteer(vol: SuggestedVolunteer) {
  if (!detail.value) return
  isAssigning.value = true
  assigningId.value = vol.volunteerProfileId
  assignMsg.value = ''
  try {
    await createAssignment({
      reliefRequestId: detail.value.id,
      volunteerProfileId: vol.volunteerProfileId,
    })
    assignMsg.value = `Đã phân công ${vol.fullName} thành công!`
    assignMsgType.value = 'ok'
    // cập nhật trạng thái local (request sẽ chuyển sang Assigned sau khi phân công)
    const idx = allRequests.value.findIndex(r => r.id === detail.value!.id)
    if (idx !== -1) allRequests.value[idx] = { ...allRequests.value[idx], status: 'Assigned' }
    detail.value = { ...detail.value, status: 'Assigned' }
  } catch (e: unknown) {
    assignMsg.value = e instanceof Error ? e.message : 'Phân công thất bại.'
    assignMsgType.value = 'error'
  } finally {
    isAssigning.value = false
    assigningId.value = null
  }
}
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────────── */
.rrm-page { max-width: 1200px; }

/* ── Header ──────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 20px;
}
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(197,48,48,0.09);
  color: #c53030;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 10px;
}
.page-title {
  font-size: 26px;
  font-weight: 800;
  color: #1a3b5c;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.page-sub { font-size: 13.5px; color: #718096; margin-top: 4px; }

.header-stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}
.hstat {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 18px;
  text-align: center;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  border-top: 3px solid var(--hs-color);
  min-width: 80px;
}
.hstat__val   { display: block; font-size: 24px; font-weight: 900; color: #1a2d3d; }
.hstat__label { display: block; font-size: 10.5px; color: #718096; font-weight: 600; margin-top: 2px; }

/* ── Filters ─────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 8px 14px;
  min-width: 220px;
  color: #9ca3af;
}
.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  color: #2d3748;
  width: 100%;
  background: transparent;
}
.status-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}
.status-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1.5px solid #e9ecef;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.status-filter-btn.active {
  background: var(--af-bg);
  color: var(--af-color);
  border-color: transparent;
}
.status-filter-btn:hover:not(.active) { background: #f8fafc; }
.filter-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.filter-count {
  background: rgba(0,0,0,0.08);
  border-radius: 99px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 700;
}
.sort-select {
  padding: 8px 12px;
  border: 1.5px solid #e9ecef;
  border-radius: 10px;
  font-size: 13px;
  color: #2d3748;
  background: #fff;
  cursor: pointer;
  outline: none;
}

/* ── Table ───────────────────────────────────────────────── */
.table-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th {
  background: #f8fafc;
  padding: 13px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #e9ecef;
  text-align: left;
}
.th-center { text-align: center !important; }
.data-row {
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}
.data-row:hover { background: #f8fafc; }
.data-row td { padding: 13px 16px; font-size: 13px; color: #2d3748; vertical-align: middle; }

.td-title { max-width: 220px; }
.title-text { display: block; font-weight: 600; color: #1a3b5c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.affect-info { font-size: 11px; color: #a0aec0; margin-top: 2px; display: block; }

.td-address { max-width: 180px; font-size: 12.5px; color: #4a5568; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-date { font-size: 12px; color: #718096; white-space: nowrap; }

/* Emergency badge */
.emergency-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}
.elv-1 { background: #dcfce7; color: #15803d; }
.elv-2 { background: #fef9c3; color: #854d0e; }
.elv-3 { background: #ffedd5; color: #9a3412; }
.elv-4 { background: #fee2e2; color: #991b1b; }

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Needs */
.needs-icons { display: flex; gap: 3px; justify-content: center; flex-wrap: wrap; }
.need-chip { font-size: 16px; }

/* Buttons */
.btn-view {
  padding: 5px 14px;
  border-radius: 7px;
  border: 1.5px solid #c53030;
  background: transparent;
  color: #c53030;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.btn-view:hover { background: #c53030; color: #fff; }

/* Loading / Empty */
.loading-state, .empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e9ecef;
  border-top-color: #c53030;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Drawer ──────────────────────────────────────────────── */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,25,40,0.45);
  z-index: 500;
  display: flex;
  justify-content: flex-end;
}
.drawer {
  width: 560px;
  max-width: 95vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: -8px 0 40px rgba(0,0,0,0.18);
}
.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
  position: sticky;
  top: 0;
  z-index: 10;
}
.drawer-subtitle { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.drawer-title    { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.3; }
.drawer-close {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.drawer-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
.drawer-loading { padding: 60px 28px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #a0aec0; }

/* Info grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 20px 28px;
  border-bottom: 1px solid #f1f5f9;
}
.info-item {
  padding: 10px 0;
  border-bottom: 1px solid #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.info-item--full { grid-column: 1 / -1; }
.info-label { font-size: 11px; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.3px; }
.info-val   { font-size: 13.5px; color: #2d3748; font-weight: 500; }

/* Sections */
.section-block {
  padding: 20px 28px;
  border-bottom: 1px solid #f1f5f9;
}
.section-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 12px; }

/* Needs tags */
.needs-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.need-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 99px;
  background: #f0f9f4;
  border: 1px solid #c6f6d5;
  color: #276749;
  font-size: 12.5px;
  font-weight: 600;
}
.need-tag--none { background: #f8fafc; border-color: #e9ecef; color: #a0aec0; }

/* Status flow */
.status-flow { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.flow-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}
.flow-btn--approved   { background: #dcfce7; color: #15803d; }
.flow-btn--approved:hover   { background: #22c55e; color: #fff; }
.flow-btn--cancelled  { background: #fee2e2; color: #991b1b; }
.flow-btn--cancelled:hover  { background: #ef4444; color: #fff; }
.flow-btn--inprogress { background: #ede9fe; color: #6d28d9; }
.flow-btn--inprogress:hover { background: #8b5cf6; color: #fff; }
.flow-btn--completed  { background: #d1fae5; color: #065f46; }
.flow-btn--completed:hover  { background: #10b981; color: #fff; }
.flow-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.flow-none { font-size: 13px; color: #a0aec0; font-style: italic; }
.status-msg { font-size: 12.5px; padding: 8px 12px; border-radius: 8px; margin-top: 8px; }
.msg--ok    { background: #dcfce7; color: #15803d; }
.msg--error { background: #fee2e2; color: #991b1b; }

/* Suggested volunteers */
.suggested-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.suggested-header .section-label { margin-bottom: 0; }
.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1.5px solid #e9ecef;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-refresh:hover { background: #f8fafc; }
.btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

.suggest-loading, .suggest-empty {
  padding: 24px;
  text-align: center;
  color: #a0aec0;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.volunteer-cards { display: flex; flex-direction: column; gap: 10px; }
.vol-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e9ecef;
  transition: border-color 0.15s ease;
}
.vol-card:hover { border-color: #c53030; }
.vol-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c53030, #e53e3e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}
.vol-card__info { flex: 1; min-width: 0; }
.vol-card__name  { font-size: 13.5px; font-weight: 700; color: #1a3b5c; }
.vol-card__email { font-size: 11.5px; color: #a0aec0; margin-top: 1px; }
.vol-card__tags  { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
.vol-tag {
  padding: 2px 8px;
  border-radius: 99px;
  background: #e9ecef;
  color: #4a5568;
  font-size: 10.5px;
  font-weight: 600;
}
.vol-tag--dist  { background: rgba(197,48,48,0.1); color: #c53030; display: inline-flex; align-items: center; gap: 3px; }
.vol-tag--more  { background: #1a3b5c; color: #fff; }

.btn-assign {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 9px;
  background: #c53030;
  color: #fff;
  border: none;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;
}
.btn-assign:hover   { background: #9b1c1c; }
.btn-assign:disabled { opacity: 0.5; cursor: not-allowed; }

/* Spin icon */
.spin-icon { animation: spin 0.7s linear infinite; }

/* Transition */
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from .drawer { transform: translateX(100%); }
.drawer-leave-to .drawer   { transform: translateX(100%); }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .page-header { flex-direction: column; }
  .header-stats { flex-wrap: wrap; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .status-filters { overflow-x: auto; flex-wrap: nowrap; }
  .data-table th:nth-child(4), .data-table td:nth-child(4) { display: none; }
}
</style>
