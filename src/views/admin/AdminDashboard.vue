<template>
  <AppLayout>
    <div class="page-container">
      <div class="dashboard-header">
        <div>
          <p class="dashboard-role-badge role--admin">🛡️ Quản trị viên</p>
          <h1 class="page-title">Admin Dashboard</h1>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <span class="stat-icon">{{ s.icon }}</span>
          <div>
            <p class="stat-value">{{ s.value }}</p>
            <p class="stat-label">{{ s.label }}</p>
          </div>
        </div>
      </div>

      <div class="admin-quick-links">
        <router-link to="/users" class="quick-link">
          <span>👥</span>
          <span>Quản lý người dùng</span>
        </router-link>
        <router-link to="/coordinator" class="quick-link">
          <span>🗂️</span>
          <span>Xem Coordinator</span>
        </router-link>
        <router-link to="/requester" class="quick-link">
          <span>📋</span>
          <span>Xem Requester</span>
        </router-link>
        <router-link to="/volunteer" class="quick-link">
          <span>🙋</span>
          <span>Xem Volunteer</span>
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const stats = [
  { icon: '👥', value: '0', label: 'Tổng người dùng' },
  { icon: '📋', value: '0', label: 'Yêu cầu hỗ trợ' },
  { icon: '🙋', value: '0', label: 'Tình nguyện viên' },
  { icon: '🗺️', value: '0', label: 'Chiến dịch đang chạy' },
]
</script>

<style scoped>
.dashboard-header { margin-bottom: var(--space-6); }
.dashboard-role-badge {
  display: inline-block; padding: 3px 12px;
  border-radius: 99px; font-size: 13px; font-weight: 700; margin-bottom: 8px;
}
.role--admin { background: rgba(197,48,48,0.1); color: #c53030; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4); margin-bottom: var(--space-6);
}
.stat-card {
  background: #fff; border-radius: 12px; padding: var(--space-5);
  display: flex; align-items: center; gap: var(--space-4); box-shadow: var(--shadow-sm);
}
.stat-icon  { font-size: 32px; }
.stat-value { font-size: 24px; font-weight: 800; color: #1a3b5c; }
.stat-label { font-size: 13px; color: #718096; margin-top: 2px; }

.admin-quick-links {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-3);
}
.quick-link {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: var(--space-5);
  background: #fff; border-radius: 12px; box-shadow: var(--shadow-sm);
  text-decoration: none; color: #1a3b5c; font-size: 14px; font-weight: 600;
  transition: all 0.2s;
}
.quick-link span:first-child { font-size: 28px; }
.quick-link:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); color: #1a4f8d; }
</style>
