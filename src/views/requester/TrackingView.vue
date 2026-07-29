<template>
  <RequesterLayout>
    <div class="tracking-page">
      <div class="page-header">
        <h2>Theo dõi hỗ trợ</h2>
        <p class="subtitle">Tiến độ các yêu cầu đang được xử lý của bạn.</p>
      </div>

      <div v-if="isLoading" class="empty-card">Đang tải...</div>

      <div v-else-if="activeRequests.length === 0" class="empty-card">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3>Chưa có yêu cầu nào đang xử lý</h3>
        <p class="subtitle">Các yêu cầu đã hoàn thành hoặc đã hủy sẽ không hiển thị ở đây.</p>
        <router-link to="/requester/my-requests" class="btn-primary">Xem tất cả yêu cầu</router-link>
      </div>

      <div v-else class="tracking-list">
        <div class="tracking-card" v-for="item in activeRequests" :key="item.id">
          <div class="tracking-card-header">
            <div>
              <h4>{{ item.title }}</h4>
              <span class="meta">{{ item.address }} · {{ formatDateTimeVI(item.createdAt) }}</span>
            </div>
            <span class="badge" :style="badgeStyle(item.status)">{{ STATUS_LABEL_VI[item.status] }}</span>
          </div>

          <div class="progress-track">
            <div
              class="progress-step"
              v-for="(step, i) in TRACKING_STEPS"
              :key="step.status"
              :class="{ done: i <= currentStepIndex(item), current: i === currentStepIndex(item) }"
            >
              <span class="progress-dot" />
              <span class="progress-label">{{ step.label }}</span>
              <span v-if="i < TRACKING_STEPS.length - 1" class="progress-line" :class="{ done: i < currentStepIndex(item) }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </RequesterLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import RequesterLayout from '@/components/layout/RequesterLayout.vue'
import { getReliefRequests } from '@/features/requests/requests.api'
import { STATUS_LABEL_VI, type ReliefRequestResponse, type ReliefRequestStatus } from '@/features/requests/requests.types'
import { badgeStyle, formatDateTimeVI } from '@/features/requests/requests.helpers'

const isLoading = ref(true)
const allRequests = ref<ReliefRequestResponse[]>([])

onMounted(async () => {
  allRequests.value = await getReliefRequests()
  isLoading.value = false
})

// Chỉ theo dõi yêu cầu chưa kết thúc (Completed/Cancelled coi như xong việc theo dõi)
const ACTIVE_STATUSES: ReliefRequestStatus[] = ['Pending', 'Approved', 'Assigned', 'InProgress']

const activeRequests = computed(() =>
  [...allRequests.value]
    .filter((r) => ACTIVE_STATUSES.includes(r.status))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

// Timeline hiển thị theo state machine BE: Pending → Approved → Assigned → InProgress → Completed
const TRACKING_STEPS: { status: ReliefRequestStatus; label: string }[] = [
  { status: 'Pending', label: 'Đã gửi' },
  { status: 'Approved', label: 'Đã duyệt' },
  { status: 'Assigned', label: 'Đã phân công TNV' },
  { status: 'InProgress', label: 'Đang hỗ trợ' },
  { status: 'Completed', label: 'Hoàn thành' },
]

function currentStepIndex(item: ReliefRequestResponse): number {
  const idx = TRACKING_STEPS.findIndex((s) => s.status === item.status)
  return idx === -1 ? 0 : idx
}
</script>

<style scoped>
.tracking-page { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

.page-header h2 { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; margin: 0 0 4px 0; }
.subtitle { font-size: 13.5px; color: #718096; margin: 0; }

.empty-card {
  background: #ffffff; border-radius: 16px; padding: 56px 32px;
  border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05); text-align: center;
}
.empty-icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: linear-gradient(135deg, #fff1eb, #ffe4d5); color: #ea580c;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
}
.empty-card h3 { font-size: 17px; font-weight: 800; color: #1a1a2e; margin: 0 0 8px 0; }
.empty-card .subtitle { max-width: 420px; margin: 0 auto 20px; line-height: 1.6; }
.btn-primary {
  display: inline-block; background: #e11d48; color: #fff; text-decoration: none;
  padding: 10px 20px; border-radius: 8px; font-size: 13.5px; font-weight: 600;
}
.btn-primary:hover { background: #be123c; }

.tracking-list { display: flex; flex-direction: column; gap: 16px; }
.tracking-card {
  background: #fff; border-radius: 16px; padding: 20px 24px;
  border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.tracking-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
.tracking-card-header h4 { margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #1e293b; }
.meta { font-size: 12px; color: #64748b; }
.badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; flex-shrink: 0; white-space: nowrap; }

.progress-track { display: flex; align-items: flex-start; }
.progress-step {
  position: relative; flex: 1; display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 8px;
}
.progress-dot {
  width: 16px; height: 16px; border-radius: 50%; background: #e2e8f0; border: 3px solid #fff;
  box-shadow: 0 0 0 2px #e2e8f0; z-index: 1;
}
.progress-step.done .progress-dot { background: #22c55e; box-shadow: 0 0 0 2px #22c55e; }
.progress-step.current .progress-dot { background: #ea580c; box-shadow: 0 0 0 2px #ea580c; }
.progress-label { font-size: 11.5px; font-weight: 600; color: #94a3b8; }
.progress-step.done .progress-label,
.progress-step.current .progress-label { color: #1e293b; }
.progress-line {
  position: absolute; top: 8px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0;
}
.progress-line.done { background: #22c55e; }

@media (max-width: 600px) {
  .progress-label { font-size: 10px; }
}
</style>
