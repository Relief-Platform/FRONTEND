<template>
  <VolunteerLayout>
    <div class="vol-dashboard">
      <!-- ── Header ──────────────────────────────────────── -->
      <div class="dash-header">
        <div>
          <div class="role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Tình nguyện viên
          </div>
          <h1 class="dash-title">Tổng quan hoạt động</h1>
          <p class="dash-sub">Theo dõi nhiệm vụ và đóng góp của bạn</p>
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

      <!-- ── Bottom section ──────────────────────────────── -->
      <div class="dash-bottom">
        <!-- Recent activity -->
        <div class="dash-panel">
          <div class="panel-header">
            <h2 class="panel-title">Hoạt động gần đây</h2>
            <router-link to="/volunteer/history" class="panel-link">Xem tất cả →</router-link>
          </div>
          <div class="activity-list">
            <div
              v-for="act in recentActivities"
              :key="act.id"
              class="activity-item"
            >
              <div class="activity-dot" :class="`dot--${act.type}`" />
              <div class="activity-content">
                <p class="activity-title">{{ act.title }}</p>
                <p class="activity-meta">{{ act.time }}</p>
              </div>
              <span class="activity-tag" :class="`tag--${act.type}`">{{ act.typeLabel }}</span>
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

          <!-- Progress ring section -->
          <div class="progress-section">
            <div class="progress-ring-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e9ecef" stroke-width="10"/>
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#ringGrad)"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="`${2 * Math.PI * 42}`"
                  :stroke-dashoffset="`${2 * Math.PI * 42 * (1 - 0.68)}`"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#276749"/>
                    <stop offset="100%" stop-color="#48bb78"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="ring-label">
                <span class="ring-pct">68%</span>
                <span class="ring-sub">hoàn thành</span>
              </div>
            </div>
            <div class="progress-info">
              <p class="progress-info-title">Tiến độ tháng này</p>
              <p class="progress-info-desc">Bạn đã hoàn thành 17 / 25 nhiệm vụ trong tháng 7</p>
              <div class="progress-legend">
                <span class="legend-dot" style="background: #276749"/> <span>Hoàn thành: 17</span>
                <span class="legend-dot" style="background: #e9ecef; border: 1px solid #d0d5dd"/> <span>Còn lại: 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </VolunteerLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VolunteerLayout from '@/components/layout/VolunteerLayout.vue'

const currentDate = computed(() => {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const statCards = [
  {
    label: 'Nhiệm vụ đang nhận',
    value: '5',
    unit: 'nhiệm vụ',
    trend: '+2 tuần này',
    trendUp: true,
    progress: 50,
    color: '#e27d24',
    bg: 'linear-gradient(135deg, #fef3e2 0%, #fde8c8 100%)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e27d24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  },
  {
    label: 'Đã hoàn thành',
    value: '23',
    unit: 'nhiệm vụ',
    trend: '+5 tháng này',
    trendUp: true,
    progress: 75,
    color: '#276749',
    bg: 'linear-gradient(135deg, #e8f5ee 0%, #c6f6d5 100%)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#276749" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>`,
  },
  {
    label: 'Tổng giờ hoạt động',
    value: '142',
    unit: 'giờ',
    trend: 'Tất cả thời gian',
    trendUp: false,
    progress: 62,
    color: '#3182ce',
    bg: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3182ce" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    label: 'Điểm đóng góp',
    value: '1,280',
    unit: 'điểm',
    trend: '+120 tháng này',
    trendUp: true,
    progress: 85,
    color: '#6b46c1',
    bg: 'linear-gradient(135deg, #f3eeff 0%, #e9d8fd 100%)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
]

const recentActivities = [
  { id: 1, title: 'Hoàn thành nhiệm vụ phát cơm từ thiện', time: '2 giờ trước', type: 'done', typeLabel: 'Hoàn thành' },
  { id: 2, title: 'Nhận nhiệm vụ hỗ trợ lũ lụt tại Đà Nẵng', time: 'Hôm qua, 14:30', type: 'assigned', typeLabel: 'Được giao' },
  { id: 3, title: 'Đăng ký kỹ năng Sơ cứu y tế', time: '3 ngày trước', type: 'skill', typeLabel: 'Kỹ năng' },
  { id: 4, title: 'Hoàn thành đào tạo ứng phó thiên tai', time: '5 ngày trước', type: 'done', typeLabel: 'Hoàn thành' },
  { id: 5, title: 'Tham gia chiến dịch bảo vệ môi trường', time: '1 tuần trước', type: 'assigned', typeLabel: 'Được giao' },
]

const quickActions = [
  {
    label: 'Xem nhiệm vụ',
    to: '/volunteer/my-tasks',
    color: '#e27d24',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  },
  {
    label: 'Lịch sử',
    to: '/volunteer/history',
    color: '#3182ce',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    label: 'Đăng ký kỹ năng',
    to: '/volunteer/skills',
    color: '#6b46c1',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    label: 'Hồ sơ cá nhân',
    to: '/volunteer/profile',
    color: '#276749',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  },
]
</script>

<style scoped>
.vol-dashboard { max-width: 1200px; }

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
  background: rgba(39,103,73,0.10);
  color: #276749;
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
.trend--up { color: #276749; }
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
.panel-link  { font-size: 12.5px; font-weight: 600; color: #276749; text-decoration: none; }
.panel-link:hover { text-decoration: underline; }

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
.dot--done     { background: #276749; }
.dot--assigned { background: #e27d24; }
.dot--skill    { background: #6b46c1; }
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
.tag--done     { background: rgba(39,103,73,0.10); color: #276749; }
.tag--assigned { background: rgba(226,125,36,0.10); color: #c46a18; }
.tag--skill    { background: rgba(107,70,193,0.10); color: #6b46c1; }

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

/* Progress ring */
.progress-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9f4, #e8f5ee);
  border-radius: 12px;
  border: 1px solid rgba(39,103,73,0.12);
}
.progress-ring-wrap {
  position: relative;
  flex-shrink: 0;
}
.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
}
.ring-pct {
  font-size: 20px;
  font-weight: 900;
  color: #1a3b5c;
  line-height: 1;
}
.ring-sub {
  font-size: 9px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.progress-info-title { font-size: 13.5px; font-weight: 700; color: #1a3b5c; margin-bottom: 6px; }
.progress-info-desc  { font-size: 12px; color: #718096; line-height: 1.5; margin-bottom: 10px; }
.progress-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #4a5568;
  font-weight: 500;
  flex-wrap: wrap;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
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
