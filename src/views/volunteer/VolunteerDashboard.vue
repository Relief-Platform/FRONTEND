<template>
  <AppLayout>
    <div class="page-container">
      <div class="dashboard-header">
        <div>
          <p class="dashboard-role-badge role--volunteer">🙋 Tình nguyện viên</p>
          <h1 class="page-title">Xin chào, {{ auth.user?.fullName }}!</h1>
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

      <BaseCard>
        <template #header>Nhiệm vụ của tôi</template>
        <p class="text-muted text-center" style="padding: 40px 0;">
          Chưa có nhiệm vụ nào được giao.
        </p>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const stats = [
  { icon: '✅', value: '0', label: 'Nhiệm vụ hoàn thành' },
  { icon: '⏳', value: '0', label: 'Đang thực hiện' },
  { icon: '🗺️', value: '0', label: 'Khu vực hỗ trợ' },
]
</script>

<style scoped>
.dashboard-header { margin-bottom: var(--space-6); }
.dashboard-role-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}
.role--volunteer { background: rgba(39,103,73,0.12); color: #276749; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  box-shadow: var(--shadow-sm);
}
.stat-icon  { font-size: 32px; }
.stat-value { font-size: 24px; font-weight: 800; color: #1a3b5c; }
.stat-label { font-size: 13px; color: #718096; margin-top: 2px; }
</style>
