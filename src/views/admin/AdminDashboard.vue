<template>
  <AdminLayout>
    <div class="admin-dashboard">
      <!-- ── Header ──────────────────────────────────────── -->
      <div class="dash-header">
        <div>
          <div class="role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Quản trị viên hệ thống
          </div>
          <h1 class="dash-title">Tổng quan hệ thống</h1>
          <p class="dash-sub">Theo dõi dữ liệu và hoạt động toàn cầu</p>
        </div>
        <div class="dash-date">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {{ currentDate }}
        </div>
      </div>

      <!-- ── 4 Stat Cards ────────────────────────────────── -->
      <div class="stat-grid">
        <div
          v-for="(card, i) in statCards"
          :key="card.label"
          class="stat-card"
          :style="{ '--card-color': card.color, '--card-bg': card.bg, '--delay': `${i * 80}ms` }"
        >
          <div class="stat-card__header">
            <div class="stat-card__icon-wrap">
              <span v-html="card.icon" />
            </div>
            <div class="stat-card__trend" :class="card.trendUp ? 'trend--up' : 'trend--neutral'">
              <svg v-if="card.trendUp" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ card.trend }}
            </div>
          </div>
          <div class="stat-card__body">
            <div class="stat-card__value">{{ card.value }}</div>
            <div class="stat-card__unit">{{ card.unit }}</div>
          </div>
          <div class="stat-card__label">{{ card.label }}</div>
          <div class="stat-card__bar-wrap">
            <div class="stat-card__bar" :style="{ width: card.progress + '%' }" />
          </div>
        </div>
      </div>

      <!-- ── Charts: xu hướng theo thời gian + bản đồ ──────── -->
      <div class="dash-charts">
        <RequestsOverTimeChart />
        <DashboardMapPanel />
      </div>

      <!-- ── Bottom section ──────────────────────────────── -->
      <div class="dash-bottom">
        <!-- Recent activity -->
        <div class="dash-panel">
          <div class="panel-header">
            <h2 class="panel-title">Hoạt động hệ thống gần đây</h2>
            <span class="panel-badge">{{ auditLogs.length }} gần nhất</span>
          </div>
          <div v-if="isLoadingLogs" class="loading-state">
            <div class="loading-spinner" />
            Đang tải dữ liệu...
          </div>
          <div v-else-if="auditLogs.length === 0" class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Chưa có hoạt động nào.
          </div>
          <div v-else class="activity-list">
            <div
              v-for="act in auditLogs"
              :key="act.id"
              class="activity-item"
            >
              <div class="activity-dot" :class="getLogDotColor(act.action)" />
              <div class="activity-content">
                <p class="activity-title">
                  <span>{{ act.userEmail }}</span> {{ act.details || act.action }}
                </p>
                <p class="activity-meta">{{ new Date(act.timestamp).toLocaleString('vi-VN') }}</p>
              </div>
              <span class="activity-tag" :class="getLogTagColor(act.action)">{{ act.entityName }}</span>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="dash-panel">
          <div class="panel-header">
            <h2 class="panel-title">Hành động nhanh</h2>
          </div>
          <div class="quick-actions">
            <router-link
              v-for="qa in quickActions"
              :key="qa.label"
              :to="qa.to"
              class="quick-action-btn"
              :style="{ '--qa-color': qa.color }"
            >
              <div class="qa-icon" v-html="qa.icon" />
              <span>{{ qa.label }}</span>
            </router-link>
          </div>

          <!-- System overview mini chart -->
          <div class="overview-section">
            <div class="overview-bars">
              <div
                v-for="bar in overviewBars"
                :key="bar.label"
                class="overview-bar-wrap"
              >
                <div class="overview-bar-track">
                  <div
                    class="overview-bar-fill"
                    :style="{ height: bar.pct + '%', background: bar.color }"
                  />
                </div>
                <span class="overview-bar-val">{{ bar.value }}</span>
                <span class="overview-bar-label">{{ bar.label }}</span>
              </div>
            </div>
            <div class="overview-info">
              <p class="overview-title">Phân bổ hệ thống</p>
              <p class="overview-desc">Tổng quan phân bổ người dùng, yêu cầu và kho hàng trong hệ thống</p>
              <div class="overview-legend">
                <span v-for="bar in overviewBars" :key="bar.label" class="legend-item">
                  <span class="legend-dot" :style="{ background: bar.color }" />
                  <span>{{ bar.label }}: {{ bar.value }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import RequestsOverTimeChart from '@/components/dashboard/RequestsOverTimeChart.vue'
import DashboardMapPanel from '@/components/dashboard/DashboardMapPanel.vue'
import { getDashboardSummary, getAuditLogs, type DashboardSummary, type AuditLog } from '@/features/dashboard/dashboard.api'

const summary = ref<DashboardSummary | null>(null)
const auditLogs = ref<AuditLog[]>([])
const isLoadingLogs = ref(true)

const currentDate = computed(() => {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(async () => {
  try {
    const sum = await getDashboardSummary()
    summary.value = sum
  } catch (error) {
    console.error('Failed to load summary', error)
  }

  try {
    isLoadingLogs.value = true
    const logs = await getAuditLogs(1, 5)
    auditLogs.value = logs.items || []
  } catch (error) {
    console.error('Failed to load audit logs', error)
  } finally {
    isLoadingLogs.value = false
  }
})

const statCards = computed(() => {
  const sum = summary.value || {
    totalUsers: 0,
    totalReliefRequests: 0,
    totalVolunteers: 0,
    totalWarehouses: 0,
  }

  return [
    {
      label: 'Tổng người dùng',
      value: sum.totalUsers,
      unit: 'người dùng',
      trend: 'Tất cả thời gian',
      trendUp: false,
      progress: 60,
      color: '#3182ce',
      bg: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3182ce" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    },
    {
      label: 'Yêu cầu cứu trợ',
      value: sum.totalReliefRequests,
      unit: 'yêu cầu',
      trend: 'Tất cả thời gian',
      trendUp: false,
      progress: 75,
      color: '#e27d24',
      bg: 'linear-gradient(135deg, #fef3e2 0%, #fde8c8 100%)',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e27d24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    },
    {
      label: 'Tình nguyện viên',
      value: sum.totalVolunteers,
      unit: 'tình nguyện viên',
      trend: 'Tất cả thời gian',
      trendUp: false,
      progress: 50,
      color: '#276749',
      bg: 'linear-gradient(135deg, #e8f5ee 0%, #c6f6d5 100%)',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#276749" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    },
    {
      label: 'Kho hàng & Vật tư',
      value: sum.totalWarehouses,
      unit: 'kho hàng',
      trend: 'Tất cả thời gian',
      trendUp: false,
      progress: 40,
      color: '#6b46c1',
      bg: 'linear-gradient(135deg, #f3eeff 0%, #e9d8fd 100%)',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    },
  ]
})

const overviewBars = computed(() => {
  const sum = summary.value || {
    totalUsers: 0,
    totalReliefRequests: 0,
    totalVolunteers: 0,
    totalWarehouses: 0,
  }
  const max = Math.max(sum.totalUsers, sum.totalReliefRequests, sum.totalVolunteers, sum.totalWarehouses, 1)
  return [
    { label: 'Người dùng', value: sum.totalUsers,          pct: Math.round((sum.totalUsers          / max) * 100), color: '#3182ce' },
    { label: 'Yêu cầu',   value: sum.totalReliefRequests, pct: Math.round((sum.totalReliefRequests / max) * 100), color: '#e27d24' },
    { label: 'TNV',       value: sum.totalVolunteers,      pct: Math.round((sum.totalVolunteers      / max) * 100), color: '#276749' },
    { label: 'Kho',       value: sum.totalWarehouses,      pct: Math.round((sum.totalWarehouses      / max) * 100), color: '#6b46c1' },
  ]
})

function getLogDotColor(action: string) {
  if (action.includes('Create') || action.includes('Approve')) return 'dot--success'
  if (action.includes('Update') || action.includes('Activate')) return 'dot--info'
  if (action.includes('Delete') || action.includes('Deactivate') || action.includes('Reject')) return 'dot--danger'
  return 'dot--warning'
}

function getLogTagColor(action: string) {
  if (action.includes('Create') || action.includes('Approve')) return 'tag--success'
  if (action.includes('Update') || action.includes('Activate')) return 'tag--info'
  if (action.includes('Delete') || action.includes('Deactivate') || action.includes('Reject')) return 'tag--danger'
  return 'tag--warning'
}

const quickActions = [
  {
    label: 'Quản lý người dùng',
    to: '/users',
    color: '#3182ce',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    label: 'Danh sách Yêu cầu',
    to: '#', // placeholder cho tính năng tương lai
    color: '#e27d24',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  },
  {
    label: 'Duyệt tình nguyện viên',
    to: '#', // placeholder
    color: '#276749',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  },
  {
    label: 'Hệ thống kho hàng',
    to: '#', // placeholder
    color: '#6b46c1',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  },
]
</script>

<style scoped>
.admin-dashboard { max-width: 1200px; }

/* ── Header ─────────────────────────────────────────────── */
.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(197,48,48,0.1);
  color: #c53030;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}
.dash-title {
  font-size: 26px;
  font-weight: 800;
  color: #1a3b5c;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.dash-sub {
  font-size: 13.5px;
  color: #718096;
  margin-top: 4px;
}
.dash-date {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: #718096;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 8px 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Stat Grid ──────────────────────────────────────────── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  animation: fadeUp 0.4s ease both;
  animation-delay: var(--delay);
  cursor: default;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.stat-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}
.stat-card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 99px;
  background: rgba(255,255,255,0.65);
}
.trend--up      { color: #276749; }
.trend--neutral { color: #718096; }

.stat-card__body {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
}
.stat-card__value {
  font-size: 34px;
  font-weight: 900;
  color: #1a2d3d;
  line-height: 1;
  letter-spacing: -1px;
}
.stat-card__unit {
  font-size: 12px;
  font-weight: 600;
  color: var(--card-color);
}
.stat-card__label {
  font-size: 12.5px;
  color: #718096;
  font-weight: 500;
  margin-bottom: 12px;
}
.stat-card__bar-wrap {
  height: 4px;
  background: rgba(255,255,255,0.6);
  border-radius: 99px;
  overflow: hidden;
}
.stat-card__bar {
  height: 100%;
  background: var(--card-color);
  border-radius: 99px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Charts ─────────────────────────────────────────────── */
.dash-charts {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
  align-items: start;
}
@media (max-width: 1100px) {
  .dash-charts { grid-template-columns: 1fr; }
}

/* ── Bottom ─────────────────────────────────────────────── */
.dash-bottom {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 18px;
}
.dash-panel {
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.panel-title { font-size: 15px; font-weight: 700; color: #1a3b5c; }
.panel-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
  background: rgba(197,48,48,0.08);
  color: #c53030;
}

/* Loading / Empty */
.loading-state, .empty-state {
  padding: 30px;
  text-align: center;
  color: #a0aec0;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e9ecef;
  border-top-color: #c53030;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Activity list */
.activity-list { display: flex; flex-direction: column; gap: 4px; }
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  transition: background 0.15s ease;
}
.activity-item:hover { background: #f8fafc; }
.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot--success  { background: #276749; }
.dot--warning  { background: #e27d24; }
.dot--info     { background: #3182ce; }
.dot--danger   { background: #c53030; }

.activity-content { flex: 1; min-width: 0; }
.activity-title {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activity-meta { font-size: 11.5px; color: #a0aec0; margin-top: 2px; }
.activity-tag {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 99px;
  flex-shrink: 0;
}
.tag--success  { background: rgba(39,103,73,0.10); color: #276749; }
.tag--warning  { background: rgba(226,125,36,0.10); color: #c46a18; }
.tag--info     { background: rgba(49,130,206,0.10); color: #3182ce; }
.tag--danger   { background: rgba(197,48,48,0.10); color: #c53030; }



/* Quick actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 22px;
}
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  border-radius: 11px;
  background: #f8fafc;
  border: 1px solid #e9ecef;
  text-decoration: none;
  color: #2d3748;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.18s ease;
}
.quick-action-btn:hover {
  background: var(--qa-color);
  color: #fff;
  border-color: var(--qa-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.quick-action-btn:hover .qa-icon { filter: brightness(10); }
.qa-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--qa-color);
  flex-shrink: 0;
}

/* Overview bar chart */
.overview-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #fff5f5, #fee2e2);
  border-radius: 12px;
  border: 1px solid rgba(197,48,48,0.12);
}
.overview-bars {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 80px;
  flex-shrink: 0;
}
.overview-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.overview-bar-track {
  width: 18px;
  height: 60px;
  background: rgba(255,255,255,0.6);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.overview-bar-fill {
  width: 100%;
  border-radius: 6px;
  min-height: 4px;
  transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.overview-bar-val {
  font-size: 10px;
  font-weight: 700;
  color: #1a3b5c;
}
.overview-bar-label {
  font-size: 9px;
  color: #718096;
  font-weight: 600;
  white-space: nowrap;
}
.overview-info { flex: 1; min-width: 0; }
.overview-title { font-size: 13.5px; font-weight: 700; color: #1a3b5c; margin-bottom: 6px; }
.overview-desc  { font-size: 12px; color: #718096; line-height: 1.5; margin-bottom: 10px; }
.overview-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
  color: #4a5568;
  font-weight: 500;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 1200px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .dash-bottom { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-header { flex-direction: column; gap: 14px; }
}
@media (max-width: 500px) {
  .stat-grid { grid-template-columns: 1fr; }
}
</style>
