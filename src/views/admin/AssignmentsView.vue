<template>
  <AdminLayout>
    <div class="asgn-page">
      <!-- ── Header ──────────────────────────────────────── -->
      <div class="page-header">
        <div>
          <div class="role-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Quản lý Phân công
          </div>
          <h1 class="page-title">Phân công Tình nguyện viên</h1>
          <p class="page-sub">Theo dõi, duyệt huỷ và quản lý trạng thái tất cả phân công</p>
        </div>
        <div class="header-stats">
          <div class="hstat" v-for="s in headerStats" :key="s.label" :style="{ '--hs-color': s.color }">
            <span class="hstat__val">{{ s.val }}</span>
            <span class="hstat__label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- ── Tabs ───────────────────────────────────────── -->
      <div class="tab-bar">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Tất cả phân công
          <span class="tab-count">{{ assignments.length }}</span>
        </button>
        <button
          class="tab-btn tab-btn--danger"
          :class="{ active: activeTab === 'pending' }"
          @click="switchToPending"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Đơn xin huỷ chờ duyệt
          <span class="tab-count tab-count--danger" v-if="pendingCancellations.length > 0">{{ pendingCancellations.length }}</span>
        </button>
      </div>

      <!-- ══════ TAB: TẤT CẢ PHÂN CÔNG ══════ -->
      <template v-if="activeTab === 'all'">
        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="searchQuery" class="search-input" placeholder="Tìm theo tên TNV, yêu cầu..." />
          </div>
          <div class="status-filters">
            <button
              v-for="f in statusFilters"
              :key="f.key"
              class="status-filter-btn"
              :class="{ active: activeStatusFilter === f.key }"
              :style="activeStatusFilter === f.key ? { '--af-bg': f.bg, '--af-color': f.color } : {}"
              @click="activeStatusFilter = f.key"
            >
              <span class="filter-dot" :style="{ background: f.dot }" />
              {{ f.label }}
              <span class="filter-count">{{ f.count }}</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-card">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner" /> Đang tải dữ liệu...
          </div>
          <div v-else-if="displayedRows.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p>Chưa có phân công nào</p>
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Tình nguyện viên</th>
                <th>Yêu cầu cứu trợ</th>
                <th class="th-center">Trạng thái</th>
                <th>Ngày phân công</th>
                <th>Ngày hoàn thành</th>
                <th class="th-center">Xin huỷ?</th>
                <th class="th-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in displayedRows"
                :key="row.id"
                class="data-row"
                @click="openDrawer(row)"
              >
                <td class="td-vol">
                  <div class="vol-mini">
                    <div class="vol-mini__avatar">{{ row.volunteerFullName.split(' ').at(-1)?.[0] ?? '?' }}</div>
                    <span class="vol-mini__name">{{ row.volunteerFullName }}</span>
                  </div>
                </td>
                <td class="td-req">{{ row.reliefRequestTitle }}</td>
                <td class="th-center">
                  <span class="status-badge" :style="asnBadgeStyle(row.status)">
                    <span class="status-dot" :style="asnDotStyle(row.status)" />
                    {{ ASN_STATUS_LABEL[row.status] }}
                  </span>
                </td>
                <td class="td-date">{{ fmtDate(row.assignedAt) }}</td>
                <td class="td-date">{{ row.completedAt ? fmtDate(row.completedAt) : '—' }}</td>
                <td class="th-center">
                  <span v-if="row.cancellationRequested" class="cancel-req-badge">Chờ duyệt</span>
                  <span v-else class="no-badge">—</span>
                </td>
                <td class="th-center" @click.stop>
                  <button class="btn-view" @click="openDrawer(row)">Chi tiết</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ══════ TAB: ĐƠN XIN HUỶ ══════ -->
      <template v-else>
        <div class="table-card" style="margin-top: 16px;">
          <div v-if="isPendingLoading" class="loading-state">
            <div class="spinner" /> Đang tải đơn xin huỷ...
          </div>
          <div v-else-if="pendingCancellations.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p>Không có đơn xin huỷ nào đang chờ</p>
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Tình nguyện viên</th>
                <th>Yêu cầu cứu trợ</th>
                <th>Lý do xin huỷ</th>
                <th>Thời gian gửi</th>
                <th class="th-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pendingCancellations" :key="row.id" class="data-row">
                <td class="td-vol">
                  <div class="vol-mini">
                    <div class="vol-mini__avatar">{{ row.volunteerFullName.split(' ').at(-1)?.[0] ?? '?' }}</div>
                    <span class="vol-mini__name">{{ row.volunteerFullName }}</span>
                  </div>
                </td>
                <td class="td-req">{{ row.reliefRequestTitle }}</td>
                <td class="td-reason">{{ row.cancellationReason ?? '—' }}</td>
                <td class="td-date">{{ row.cancellationRequestedAt ? fmtDate(row.cancellationRequestedAt) : '—' }}</td>
                <td class="th-center" style="white-space: nowrap;">
                  <div class="action-btns">
                    <button
                      class="btn-approve"
                      :disabled="processingId === row.id"
                      @click="handleApprove(row)"
                    >
                      <svg v-if="processingId === row.id && processingAction === 'approve'" class="spin-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                      <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Duyệt huỷ
                    </button>
                    <button
                      class="btn-reject"
                      :disabled="processingId === row.id"
                      @click="handleReject(row)"
                    >
                      <svg v-if="processingId === row.id && processingAction === 'reject'" class="spin-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                      <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="pendingMsg" class="global-msg" :class="pendingMsgType === 'error' ? 'msg--error' : 'msg--ok'">{{ pendingMsg }}</p>
      </template>

      <!-- ── Detail Drawer ──────────────────────────────── -->
      <Transition name="drawer">
        <div v-if="drawerOpen" class="drawer-overlay" @click.self="closeDrawer">
          <div class="drawer">
            <!-- Header -->
            <div class="drawer-header">
              <div>
                <p class="drawer-subtitle">Chi tiết phân công</p>
                <h2 class="drawer-title">{{ selected?.reliefRequestTitle }}</h2>
              </div>
              <button class="drawer-close" @click="closeDrawer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <template v-if="selected">
              <!-- Timeline status -->
              <div class="timeline-section">
                <div
                  v-for="(step, i) in statusTimeline"
                  :key="step.key"
                  class="timeline-step"
                  :class="{
                    'tl--done':    isStepDone(step.key),
                    'tl--current': isStepCurrent(step.key),
                    'tl--future':  isStepFuture(step.key),
                    'tl--last':    i === statusTimeline.length - 1,
                  }"
                >
                  <div class="tl-dot">
                    <svg v-if="isStepDone(step.key)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span v-else-if="isStepCurrent(step.key)" class="tl-pulse" />
                  </div>
                  <div class="tl-content">
                    <p class="tl-label">{{ step.label }}</p>
                    <p class="tl-time">{{ stepTime(step.key) ?? (isStepFuture(step.key) ? 'Chưa đến' : '') }}</p>
                  </div>
                </div>
              </div>

              <!-- Info grid -->
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Tình nguyện viên</span>
                  <span class="info-val info-val--bold">{{ selected.volunteerFullName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Trạng thái hiện tại</span>
                  <span class="status-badge" :style="asnBadgeStyle(selected.status)">
                    <span class="status-dot" :style="asnDotStyle(selected.status)" />
                    {{ ASN_STATUS_LABEL[selected.status] }}
                  </span>
                </div>
                <div class="info-item" v-if="selected.note">
                  <span class="info-label">Ghi chú</span>
                  <span class="info-val">{{ selected.note }}</span>
                </div>
                <div class="info-item info-item--full" v-if="selected.cancellationRequested">
                  <span class="info-label">Lý do xin huỷ</span>
                  <span class="info-val reason-text">{{ selected.cancellationReason }}</span>
                </div>
              </div>

              <!-- Admin actions -->
              <div class="section-block">
                <p class="section-label">Thao tác Admin</p>

                <!-- Duyệt/từ chối đơn xin huỷ nếu có -->
                <template v-if="selected.cancellationRequested && selected.status !== 'Cancelled'">
                  <div class="cancel-req-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Tình nguyện viên đã gửi đơn xin huỷ lúc <strong>{{ fmtDate(selected.cancellationRequestedAt!) }}</strong></span>
                  </div>
                  <div class="action-btns" style="margin-top: 12px;">
                    <button class="btn-approve btn-lg" :disabled="isActioning" @click="handleApprove(selected)">
                      <svg v-if="isActioning && actionType === 'approve'" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Duyệt huỷ phân công
                    </button>
                    <button class="btn-reject btn-lg" :disabled="isActioning" @click="handleReject(selected)">
                      <svg v-if="isActioning && actionType === 'reject'" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Từ chối đơn
                    </button>
                  </div>
                </template>

                <!-- Force cancel (chỉ khi chưa completed/cancelled) -->
                <template v-if="selected.status !== 'Completed' && selected.status !== 'Cancelled'">
                  <div class="force-cancel-block">
                    <p class="fc-title">Huỷ trực tiếp</p>
                    <div class="fc-row">
                      <input
                        v-model="forceCancelReason"
                        class="fc-input"
                        placeholder="Lý do huỷ bắt buộc..."
                        :disabled="isActioning"
                      />
                      <button
                        class="btn-force-cancel"
                        :disabled="isActioning || !forceCancelReason.trim()"
                        @click="handleForceCancel"
                      >
                        <svg v-if="isActioning && actionType === 'force'" class="spin-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                        Huỷ ngay
                      </button>
                    </div>
                  </div>
                </template>

                <p v-if="drawerMsg" class="status-msg" :class="drawerMsgType === 'error' ? 'msg--error' : 'msg--ok'">{{ drawerMsg }}</p>
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
  getAssignments,
  getPendingCancellations,
  approveCancellation,
  rejectCancellation,
  adminCancelAssignment,
  type Assignment,
  type AssignmentStatus,
} from '@/features/tasks/assignments.api'

// ── Status config ─────────────────────────────────────────────
const ASN_STATUS_LABEL: Record<AssignmentStatus, string> = {
  Assigned:  'Đã giao',
  Accepted:  'Đã nhận',
  OnTheWay:  'Đang đi',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ',
}

interface StatusStyle { bg: string; color: string; dot: string }
const ASN_STATUS_STYLE: Record<AssignmentStatus, StatusStyle> = {
  Assigned:  { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  Accepted:  { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
  OnTheWay:  { bg: '#ffedd5', color: '#9a3412', dot: '#f97316' },
  Completed: { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  Cancelled: { bg: '#f1f5f9', color: '#4b5563', dot: '#94a3b8' },
}

function asnBadgeStyle(s: AssignmentStatus) {
  const c = ASN_STATUS_STYLE[s]
  return { background: c.bg, color: c.color }
}
function asnDotStyle(s: AssignmentStatus) {
  return { background: ASN_STATUS_STYLE[s].dot }
}

// Timeline steps (volunteer flow)
const statusTimeline = [
  { key: 'Assigned',  label: 'Đã phân công' },
  { key: 'Accepted',  label: 'TNV đã nhận' },
  { key: 'OnTheWay',  label: 'Đang trên đường' },
  { key: 'Completed', label: 'Hoàn thành' },
]
const STATUS_ORDER: AssignmentStatus[] = ['Assigned', 'Accepted', 'OnTheWay', 'Completed', 'Cancelled']

// ── State ────────────────────────────────────────────────────
const assignments          = ref<Assignment[]>([])
const pendingCancellations = ref<Assignment[]>([])
const isLoading            = ref(true)
const isPendingLoading     = ref(false)

const activeTab          = ref<'all' | 'pending'>('all')
const searchQuery        = ref('')
const activeStatusFilter = ref<string>('all')

const drawerOpen      = ref(false)
const selected        = ref<Assignment | null>(null)
const drawerMsg       = ref('')
const drawerMsgType   = ref<'ok' | 'error'>('ok')
const forceCancelReason = ref('')

const isActioning  = ref(false)
const actionType   = ref<'approve' | 'reject' | 'force' | null>(null)

// For pending tab inline actions
const processingId     = ref<string | null>(null)
const processingAction = ref<'approve' | 'reject' | null>(null)
const pendingMsg       = ref('')
const pendingMsgType   = ref<'ok' | 'error'>('ok')

// ── Computed ─────────────────────────────────────────────────
const headerStats = computed(() => [
  { label: 'Đã giao',    val: assignments.value.filter(a => a.status === 'Assigned').length,  color: '#3b82f6' },
  { label: 'Đang đi',    val: assignments.value.filter(a => a.status === 'OnTheWay').length,  color: '#f97316' },
  { label: 'Hoàn thành', val: assignments.value.filter(a => a.status === 'Completed').length, color: '#10b981' },
  { label: 'Chờ duyệt',  val: pendingCancellations.value.length,                             color: '#ef4444' },
])

const statusFilters = computed(() => {
  const all = assignments.value
  const countOf = (s: AssignmentStatus) => all.filter(a => a.status === s).length
  return [
    { key: 'all',       label: 'Tất cả',     dot: '#94a3b8', bg: '#f1f5f9', color: '#475569', count: all.length },
    { key: 'Assigned',  label: 'Đã giao',    dot: '#3b82f6', bg: '#dbeafe', color: '#1d4ed8', count: countOf('Assigned') },
    { key: 'Accepted',  label: 'Đã nhận',    dot: '#8b5cf6', bg: '#ede9fe', color: '#6d28d9', count: countOf('Accepted') },
    { key: 'OnTheWay',  label: 'Đang đi',    dot: '#f97316', bg: '#ffedd5', color: '#9a3412', count: countOf('OnTheWay') },
    { key: 'Completed', label: 'Hoàn thành', dot: '#10b981', bg: '#d1fae5', color: '#065f46', count: countOf('Completed') },
    { key: 'Cancelled', label: 'Đã huỷ',     dot: '#94a3b8', bg: '#f3f4f6', color: '#4b5563', count: countOf('Cancelled') },
  ]
})

const displayedRows = computed(() => {
  let list = assignments.value
  if (activeStatusFilter.value !== 'all') {
    list = list.filter(a => a.status === activeStatusFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a =>
      a.volunteerFullName.toLowerCase().includes(q) ||
      a.reliefRequestTitle.toLowerCase().includes(q),
    )
  }
  return list
})

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  await loadAll()
})

async function loadAll() {
  isLoading.value = true
  try {
    assignments.value = await getAssignments(1, 200)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

async function switchToPending() {
  activeTab.value = 'pending'
  if (pendingCancellations.value.length > 0) return
  isPendingLoading.value = true
  pendingMsg.value = ''
  try {
    pendingCancellations.value = await getPendingCancellations()
  } catch (e) {
    console.error(e)
  } finally {
    isPendingLoading.value = false
  }
}

// ── Drawer ───────────────────────────────────────────────────
function openDrawer(row: Assignment) {
  selected.value = row
  drawerOpen.value = true
  drawerMsg.value = ''
  forceCancelReason.value = ''
}
function closeDrawer() {
  drawerOpen.value = false
  selected.value = null
}

// Timeline helpers
function isStepDone(key: string): boolean {
  if (!selected.value) return false
  const curIdx = STATUS_ORDER.indexOf(selected.value.status as AssignmentStatus)
  const stepIdx = STATUS_ORDER.indexOf(key as AssignmentStatus)
  return stepIdx < curIdx && selected.value.status !== 'Cancelled'
}
function isStepCurrent(key: string): boolean {
  return selected.value?.status === key
}
function isStepFuture(key: string): boolean {
  if (!selected.value) return false
  const curIdx = STATUS_ORDER.indexOf(selected.value.status as AssignmentStatus)
  const stepIdx = STATUS_ORDER.indexOf(key as AssignmentStatus)
  return stepIdx > curIdx
}
function stepTime(key: string): string | null {
  if (!selected.value) return null
  const a = selected.value
  const map: Partial<Record<string, string | null>> = {
    Assigned:  a.assignedAt,
    Accepted:  a.acceptedAt,
    OnTheWay:  null,
    Completed: a.completedAt,
  }
  const t = map[key]
  return t ? fmtDate(t) : null
}

// ── Actions (shared for drawer + pending tab) ─────────────────
async function handleApprove(row: Assignment) {
  const isInDrawer = drawerOpen.value && selected.value?.id === row.id
  if (isInDrawer) { isActioning.value = true; actionType.value = 'approve'; drawerMsg.value = '' }
  else { processingId.value = row.id; processingAction.value = 'approve' }

  try {
    await approveCancellation(row.id)
    // Cập nhật local
    updateLocalStatus(row.id, 'Cancelled')
    removePending(row.id)
    const msg = 'Đã duyệt huỷ phân công thành công.'
    if (isInDrawer) { drawerMsg.value = msg; drawerMsgType.value = 'ok' }
    else { pendingMsg.value = msg; pendingMsgType.value = 'ok' }
    if (isInDrawer) selected.value = { ...selected.value!, status: 'Cancelled', cancellationRequested: false }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Thao tác thất bại.'
    if (isInDrawer) { drawerMsg.value = msg; drawerMsgType.value = 'error' }
    else { pendingMsg.value = msg; pendingMsgType.value = 'error' }
  } finally {
    if (isInDrawer) { isActioning.value = false; actionType.value = null }
    else { processingId.value = null; processingAction.value = null }
  }
}

async function handleReject(row: Assignment) {
  const isInDrawer = drawerOpen.value && selected.value?.id === row.id
  if (isInDrawer) { isActioning.value = true; actionType.value = 'reject'; drawerMsg.value = '' }
  else { processingId.value = row.id; processingAction.value = 'reject' }

  try {
    await rejectCancellation(row.id)
    removePending(row.id)
    // Cập nhật cancellationRequested = false
    updateLocalCancelFlag(row.id, false)
    const msg = 'Đã từ chối đơn xin huỷ.'
    if (isInDrawer) { drawerMsg.value = msg; drawerMsgType.value = 'ok' }
    else { pendingMsg.value = msg; pendingMsgType.value = 'ok' }
    if (isInDrawer) selected.value = { ...selected.value!, cancellationRequested: false }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Thao tác thất bại.'
    if (isInDrawer) { drawerMsg.value = msg; drawerMsgType.value = 'error' }
    else { pendingMsg.value = msg; pendingMsgType.value = 'error' }
  } finally {
    if (isInDrawer) { isActioning.value = false; actionType.value = null }
    else { processingId.value = null; processingAction.value = null }
  }
}

async function handleForceCancel() {
  if (!selected.value || !forceCancelReason.value.trim()) return
  isActioning.value = true
  actionType.value = 'force'
  drawerMsg.value = ''
  try {
    await adminCancelAssignment(selected.value.id, forceCancelReason.value.trim())
    updateLocalStatus(selected.value.id, 'Cancelled')
    selected.value = { ...selected.value, status: 'Cancelled' }
    drawerMsg.value = 'Đã huỷ phân công thành công.'
    drawerMsgType.value = 'ok'
    forceCancelReason.value = ''
  } catch (e: unknown) {
    drawerMsg.value = e instanceof Error ? e.message : 'Huỷ thất bại.'
    drawerMsgType.value = 'error'
  } finally {
    isActioning.value = false
    actionType.value = null
  }
}

// Local state helpers
function updateLocalStatus(id: string, status: AssignmentStatus) {
  const idx = assignments.value.findIndex(a => a.id === id)
  if (idx !== -1) assignments.value[idx] = { ...assignments.value[idx], status }
}
function updateLocalCancelFlag(id: string, flag: boolean) {
  const idx = assignments.value.findIndex(a => a.id === id)
  if (idx !== -1) assignments.value[idx] = { ...assignments.value[idx], cancellationRequested: flag }
}
function removePending(id: string) {
  pendingCancellations.value = pendingCancellations.value.filter(a => a.id !== id)
}

// ── Utils ─────────────────────────────────────────────────────
function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────────── */
.asgn-page { max-width: 1200px; }

/* ── Header ──────────────────────────────────────────────── */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; gap: 20px; }
.role-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(197,48,48,0.09); color: #c53030; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 99px; margin-bottom: 10px; }
.page-title { font-size: 26px; font-weight: 800; color: #1a3b5c; letter-spacing: -0.5px; }
.page-sub   { font-size: 13.5px; color: #718096; margin-top: 4px; }
.header-stats { display: flex; gap: 12px; flex-shrink: 0; }
.hstat { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 12px 18px; text-align: center; box-shadow: 0 1px 6px rgba(0,0,0,0.05); border-top: 3px solid var(--hs-color); min-width: 80px; }
.hstat__val   { display: block; font-size: 24px; font-weight: 900; color: #1a2d3d; }
.hstat__label { display: block; font-size: 10.5px; color: #718096; font-weight: 600; margin-top: 2px; }

/* ── Tabs ─────────────────────────────────────────────────── */
.tab-bar { display: flex; gap: 8px; margin-bottom: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 0; }
.tab-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border: none; background: none;
  font-size: 13.5px; font-weight: 600; color: #64748b;
  cursor: pointer; border-bottom: 3px solid transparent;
  margin-bottom: -2px; transition: all 0.18s ease; border-radius: 8px 8px 0 0;
}
.tab-btn:hover { color: #1a3b5c; background: #f8fafc; }
.tab-btn.active { color: #c53030; border-bottom-color: #c53030; background: rgba(197,48,48,0.04); }
.tab-btn--danger.active { color: #c53030; }
.tab-count { background: #e9ecef; color: #4b5563; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 99px; }
.tab-count--danger { background: #fee2e2; color: #c53030; }

/* ── Filter bar ───────────────────────────────────────────── */
.filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e9ecef; border-radius: 10px; padding: 8px 14px; min-width: 220px; color: #9ca3af; }
.search-input { border: none; outline: none; font-size: 13px; color: #2d3748; width: 100%; background: transparent; }
.status-filters { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
.status-filter-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 99px; border: 1.5px solid #e9ecef; background: #fff; font-size: 12px; font-weight: 600; color: #4a5568; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
.status-filter-btn.active { background: var(--af-bg); color: var(--af-color); border-color: transparent; }
.status-filter-btn:hover:not(.active) { background: #f8fafc; }
.filter-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.filter-count { background: rgba(0,0,0,0.08); border-radius: 99px; padding: 0 6px; font-size: 10px; font-weight: 700; }

/* ── Table ─────────────────────────────────────────────────── */
.table-card { background: #fff; border-radius: 16px; border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background: #f8fafc; padding: 13px 16px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1px solid #e9ecef; text-align: left; }
.th-center { text-align: center !important; }
.data-row { cursor: pointer; border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease; }
.data-row:hover { background: #f8fafc; }
.data-row td { padding: 13px 16px; font-size: 13px; color: #2d3748; vertical-align: middle; }

.vol-mini { display: flex; align-items: center; gap: 10px; }
.vol-mini__avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #c53030, #e53e3e); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
.vol-mini__name { font-weight: 600; color: #1a3b5c; }

.td-req    { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-reason { max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12.5px; color: #718096; }
.td-date   { font-size: 12px; color: #718096; white-space: nowrap; }

.status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 99px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
.status-dot   { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.cancel-req-badge { background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px; }
.no-badge { color: #d1d5db; font-size: 13px; }

.btn-view { padding: 5px 14px; border-radius: 7px; border: 1.5px solid #c53030; background: transparent; color: #c53030; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
.btn-view:hover { background: #c53030; color: #fff; }

.action-btns { display: flex; gap: 8px; align-items: center; }
.btn-approve { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 8px; background: #dcfce7; color: #15803d; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
.btn-approve:hover { background: #22c55e; color: #fff; }
.btn-approve:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-reject  { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 8px; background: #fee2e2; color: #991b1b; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
.btn-reject:hover { background: #ef4444; color: #fff; }
.btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-lg { padding: 10px 20px; font-size: 13.5px; }

/* Loading / Empty */
.loading-state, .empty-state { padding: 60px 20px; text-align: center; color: #a0aec0; display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 14px; }
.spinner { width: 28px; height: 28px; border: 3px solid #e9ecef; border-top-color: #c53030; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

.global-msg { font-size: 13px; padding: 10px 16px; border-radius: 10px; margin-top: 12px; }
.msg--ok    { background: #dcfce7; color: #15803d; }
.msg--error { background: #fee2e2; color: #991b1b; }

/* ── Drawer ─────────────────────────────────────────────────── */
.drawer-overlay { position: fixed; inset: 0; background: rgba(15,25,40,0.45); z-index: 500; display: flex; justify-content: flex-end; }
.drawer { width: 540px; max-width: 95vw; height: 100vh; background: #fff; display: flex; flex-direction: column; overflow-y: auto; box-shadow: -8px 0 40px rgba(0,0,0,0.18); }
.drawer-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 28px 20px; border-bottom: 1px solid #e9ecef; background: linear-gradient(135deg, #1a1a2e, #0f3460); position: sticky; top: 0; z-index: 10; }
.drawer-subtitle { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.drawer-title    { font-size: 17px; font-weight: 800; color: #fff; line-height: 1.3; }
.drawer-close { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s ease; }
.drawer-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

/* Timeline */
.timeline-section { padding: 20px 28px; border-bottom: 1px solid #f1f5f9; display: flex; gap: 0; }
.timeline-step { display: flex; align-items: flex-start; gap: 10px; flex: 1; position: relative; }
.timeline-step:not(.tl--last)::after { content: ''; position: absolute; top: 14px; left: 28px; right: 0; height: 2px; background: #e9ecef; z-index: 0; }
.timeline-step.tl--done::after  { background: #10b981; }
.tl-dot { width: 28px; height: 28px; border-radius: 50%; background: #e9ecef; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1; transition: all 0.2s ease; }
.tl--done .tl-dot    { background: #10b981; color: #fff; }
.tl--current .tl-dot { background: #3b82f6; box-shadow: 0 0 0 5px rgba(59,130,246,0.2); }
.tl-pulse { width: 10px; height: 10px; border-radius: 50%; background: #fff; animation: pulse 1.2s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
.tl-content { flex: 1; padding-top: 2px; }
.tl-label { font-size: 11.5px; font-weight: 700; color: #64748b; }
.tl--done .tl-label    { color: #065f46; }
.tl--current .tl-label { color: #1d4ed8; }
.tl-time  { font-size: 10.5px; color: #a0aec0; margin-top: 2px; }

/* Info grid */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 20px 28px; border-bottom: 1px solid #f1f5f9; }
.info-item { padding: 10px 0; border-bottom: 1px solid #f8fafc; display: flex; flex-direction: column; gap: 5px; }
.info-item--full { grid-column: 1 / -1; }
.info-label { font-size: 11px; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.3px; }
.info-val   { font-size: 13.5px; color: #2d3748; font-weight: 500; }
.info-val--bold { font-weight: 700; color: #1a3b5c; }
.reason-text { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 8px 12px; font-size: 13px; color: #92400e; font-style: italic; }

/* Sections */
.section-block { padding: 20px 28px; border-bottom: 1px solid #f1f5f9; }
.section-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 14px; }

.cancel-req-banner { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; font-size: 13px; color: #92400e; }

.force-cancel-block { margin-top: 18px; padding-top: 16px; border-top: 1px dashed #e9ecef; }
.fc-title { font-size: 12px; font-weight: 700; color: #c53030; margin-bottom: 10px; }
.fc-row { display: flex; gap: 8px; }
.fc-input { flex: 1; padding: 9px 14px; border: 1.5px solid #e9ecef; border-radius: 9px; font-size: 13px; color: #2d3748; outline: none; transition: border-color 0.15s ease; }
.fc-input:focus { border-color: #c53030; }
.fc-input:disabled { background: #f8fafc; color: #a0aec0; }
.btn-force-cancel { display: inline-flex; align-items: center; gap: 5px; padding: 9px 16px; border-radius: 9px; background: #fee2e2; color: #991b1b; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
.btn-force-cancel:hover:not(:disabled) { background: #c53030; color: #fff; }
.btn-force-cancel:disabled { opacity: 0.45; cursor: not-allowed; }

.status-msg { font-size: 12.5px; padding: 8px 12px; border-radius: 8px; margin-top: 12px; }
.spin-icon  { animation: spin 0.7s linear infinite; }

/* Transition */
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-active .drawer { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from .drawer { transform: translateX(100%); }
.drawer-leave-to .drawer   { transform: translateX(100%); }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .page-header { flex-direction: column; }
  .header-stats { flex-wrap: wrap; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .status-filters { overflow-x: auto; flex-wrap: nowrap; }
}
</style>
