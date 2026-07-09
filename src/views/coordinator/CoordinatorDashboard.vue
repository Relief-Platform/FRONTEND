<template>
  <AppLayout>
    <div class="page-container">
      <div class="dashboard-header">
        <div>
          <p class="dashboard-role-badge role--coordinator">🗂️ Điều phối viên</p>
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

      <div class="two-col">
        <BaseCard>
          <template #header>Yêu cầu cần phân công</template>
          <p class="text-muted text-center" style="padding: 40px 0;">Chưa có yêu cầu nào chờ xử lý.</p>
        </BaseCard>
        <BaseCard>
          <template #header>Tình nguyện viên sẵn sàng</template>
          <p class="text-muted text-center" style="padding: 40px 0;">Chưa có TNV online.</p>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const stats = [
  { icon: '📋', value: '0', label: 'Yêu cầu đang xử lý' },
  { icon: '🙋', value: '0', label: 'TNV đang hoạt động' },
  { icon: '✅', value: '0', label: 'Đã hoàn thành hôm nay' },
  { icon: '⚠️', value: '0', label: 'Cần chú ý' },
]
</script>

<style scoped>
.dashboard-header { margin-bottom: var(--space-6); }
.dashboard-role-badge {
  display: inline-block; padding: 3px 12px;
  border-radius: 99px; font-size: 13px; font-weight: 700; margin-bottom: 8px;
}
.role--coordinator { background: rgba(43,108,176,0.12); color: #2b6cb0; }
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
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
@media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
</style>
