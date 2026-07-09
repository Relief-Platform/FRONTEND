<template>
  <div class="my-requests-layout">
    <div class="container">

      <div class="page-header">
        <div>
          <h2>Yêu cầu của tôi</h2>
          <p class="subtitle">Danh sách tất cả yêu cầu cứu trợ bạn đã gửi</p>
        </div>
        <button class="btn-primary" @click="router.push('/requester/create')">
          + Tạo yêu cầu mới
        </button>
      </div>

      <!-- Bộ lọc trạng thái -->
      <div class="filter-bar">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          :class="['filter-tab', { active: activeFilter === tab.value }]"
          @click="activeFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Danh sách -->
      <div class="card">
        <div v-if="filteredRequests.length === 0" class="empty-state">
          Không có yêu cầu nào phù hợp.
        </div>

        <div class="request-list" v-else>
          <div class="request-item" v-for="item in filteredRequests" :key="item.id">
            <div class="req-info">
              <div class="req-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <div>
                <h4>{{ item.title }}</h4>
                <span class="time">{{ item.time }}</span>
              </div>
            </div>
            <div class="req-actions">
              <span :class="['badge', badgeClass[item.status]]">{{ item.statusText }}</span>
              <button class="btn-outline" @click="goToDetail(item.id)">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const badgeClass: Record<string, string> = {
  processing: 'badge-processing',
  received: 'badge-received',
  completed: 'badge-completed',
}


const allRequests = [
  { id: 1, title: 'Ngập lụt tại xã Tân Lập, Quảng Trị', time: '10/06/2024 - 08:30', status: 'processing', statusText: 'Đang xử lý' },
  { id: 2, title: 'Sạt lở tại thôn Đông Hà', time: '08/06/2024 - 14:20', status: 'received', statusText: 'Đã tiếp nhận' },
  { id: 3, title: 'Thiếu nước sạch sinh hoạt', time: '05/06/2024 - 09:15', status: 'completed', statusText: 'Đã hoàn thành' },
]

const filterTabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Đã tiếp nhận', value: 'received' },
  { label: 'Đã hoàn thành', value: 'completed' },
]

const activeFilter = ref('all')

const filteredRequests = computed(() => {
  if (activeFilter.value === 'all') return allRequests
  return allRequests.filter(r => r.status === activeFilter.value)
})

const goToDetail = (id: number) => {
  router.push({ name: 'request-detail', params: { id } })
}
</script>

<style scoped>
.my-requests-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover { background-color: #1d4ed8; }

.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-tab {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.filter-tab.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-size: 14px;
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.request-item:last-child { border-bottom: none; padding-bottom: 0; }

.req-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.req-icon {
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.req-icon svg { width: 20px; height: 20px; color: #64748b; }

.req-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.req-info .time {
  font-size: 12px;
  color: #64748b;
}

.req-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.badge-processing { background: #fff7ed; color: #ea580c; }
.badge-received { background: #f0fdf4; color: #16a34a; }
.badge-completed { background: #f0fdfa; color: #0d9488; }

.btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.btn-outline:hover { background: #f8fafc; }
</style>