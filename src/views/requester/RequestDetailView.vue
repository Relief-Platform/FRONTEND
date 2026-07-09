<template>
  <div class="detail-layout">
    <div class="container">

      <!-- Nút back về trang chủ -->
      <button class="btn-back" @click="router.push('/requester')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Quay lại danh sách
      </button>

      <!-- Không tìm thấy request -->
      <div v-if="!requestData" class="not-found">
        <p>Không tìm thấy yêu cầu này.</p>
      </div>

      <template v-else>
        <!-- Phần title với cái badge trạng thái -->
        <div class="header-section">
          <div>
            <h2>{{ requestData.title }}</h2>
            <p class="location-text">
              <svg class="icon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ requestData.location }}
            </p>
          </div>
          <span :class="['badge', getStatusClass(requestData.status)]">{{ requestData.status }}</span>
        </div>

        <!-- Chia layout 2 cột -->
        <div class="grid-content">

          <!-- Cột trái: Show info chi tiết với bảng vật tư -->
          <div class="left-col">
            <div class="card">
              <h3>Thông tin chi tiết</h3>
              <div class="info-row">
                <span class="label">Mức độ:</span>
                <span class="value priority">{{ requestData.priority }}</span>
              </div>
              <div class="info-row">
                <span class="label">Mô tả:</span>
                <span class="value">{{ requestData.description }}</span>
              </div>
            </div>

            <div class="card mt-4">
              <h3>Vật tư cần hỗ trợ</h3>
              <table class="supply-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên vật tư</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in requestData.supplies" :key="idx">
                   <td>{{ Number(idx) + 1 }}</td>
                    <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
</tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Cột phải: Cục timeline tracking -->
          <div class="right-col">
            <div class="card timeline-card">
              <h3>Trạng thái vòng đời</h3>

              <div class="timeline">
                <div
                  v-for="(step, index) in requestData.timeline"
                  :key="index"
                  :class="['timeline-item', { 'completed': step.completed }]"
                >
                  <div class="timeline-indicator">
                    <div class="dot">
                      <svg v-if="step.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div class="line" v-if="index !== requestData.timeline.length - 1"></div>
                  </div>

                  <div class="timeline-content">
                    <h4>{{ step.title }}</h4>
                    <p v-if="step.time" class="time">{{ step.time }}</p>
                    <p class="desc">{{ step.desc }}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Sau này có API thật thì thay bằng fetch(`/api/requests/${id}`) trong onMounted/watch
const mockRequests: Record<string, any> = {
  '1': {
    title: 'Ngập lụt tại xã Tân Lập, Quảng Trị',
    location: 'Xã Tân Lập, Huyện Hướng Hóa, Tỉnh Quảng Trị',
    priority: 'Khẩn cấp',
    description: 'Nước dâng cao 2m, hơn 50 hộ dân đang bị cô lập. Hệ thống điện đã bị cắt để đảm bảo an toàn. Rất cần lương thực và nước uống sạch ngay lập tức.',
    status: 'Đang xử lý',
    supplies: [
      { name: 'Mì tôm (Thùng)', quantity: 50 },
      { name: 'Nước lọc 1.5L (Chai)', quantity: 200 },
      { name: 'Áo phao', quantity: 100 },
    ],
    timeline: [
      { time: '10/06/2026 - 08:30', title: 'Gửi yêu cầu', desc: 'Hệ thống đã ghi nhận yêu cầu cứu trợ.', completed: true },
      { time: '10/06/2026 - 09:15', title: 'Đã tiếp nhận', desc: 'Tình nguyện viên đã check và đang gom vật tư.', completed: true },
      { time: '10/06/2026 - 10:30', title: 'Đang xử lý (Đang vận chuyển)', desc: 'Đội cứu hộ đang trên đường tới.', completed: true },
      { time: '', title: 'Hoàn thành', desc: 'Đã support xong.', completed: false },
    ],
  },
  '2': {
    title: 'Sạt lở tại thôn Đông Hà',
    location: 'Thôn Đông Hà, Huyện Hướng Hóa, Tỉnh Quảng Trị',
    priority: 'Cao',
    description: 'Sạt lở đất sau mưa lớn kéo dài, một số nhà dân bị ảnh hưởng kết cấu, đường vào thôn bị chia cắt một phần.',
    status: 'Đã tiếp nhận',
    supplies: [
      { name: 'Bạt che (Tấm)', quantity: 30 },
      { name: 'Đèn pin', quantity: 20 },
      { name: 'Thuốc y tế (Bộ)', quantity: 15 },
    ],
    timeline: [
      { time: '08/06/2024 - 14:20', title: 'Gửi yêu cầu', desc: 'Hệ thống đã ghi nhận yêu cầu cứu trợ.', completed: true },
      { time: '08/06/2024 - 15:00', title: 'Đã tiếp nhận', desc: 'Tình nguyện viên đã check và đang gom vật tư.', completed: true },
      { time: '', title: 'Đang xử lý (Đang vận chuyển)', desc: 'Đội cứu hộ chuẩn bị lên đường.', completed: false },
      { time: '', title: 'Hoàn thành', desc: 'Đã support xong.', completed: false },
    ],
  },
  '3': {
    title: 'Thiếu nước sạch sinh hoạt',
    location: 'Xã Tân Lập, Huyện Hướng Hóa, Tỉnh Quảng Trị',
    priority: 'Trung bình',
    description: 'Nguồn nước sinh hoạt bị ô nhiễm sau lũ, người dân cần nước sạch để sử dụng trong sinh hoạt hàng ngày.',
    status: 'Đã hoàn thành',
    supplies: [
      { name: 'Nước lọc 1.5L (Chai)', quantity: 300 },
      { name: 'Viên lọc nước', quantity: 100 },
    ],
    timeline: [
      { time: '05/06/2024 - 09:15', title: 'Gửi yêu cầu', desc: 'Hệ thống đã ghi nhận yêu cầu cứu trợ.', completed: true },
      { time: '05/06/2024 - 10:00', title: 'Đã tiếp nhận', desc: 'Tình nguyện viên đã check và đang gom vật tư.', completed: true },
      { time: '05/06/2024 - 13:30', title: 'Đang xử lý (Đang vận chuyển)', desc: 'Đội cứu hộ đã vận chuyển vật tư tới nơi.', completed: true },
      { time: '05/06/2024 - 16:00', title: 'Hoàn thành', desc: 'Đã support xong.', completed: true },
    ],
  },
}

// Lấy đúng data theo id trên URL, nếu không có thì null
const requestData = computed(() => {
  const id = route.params.id as string
  return mockRequests[id] ?? null
})

// Check trạng thái để đổi màu cái badge
const getStatusClass = (status: string) => {
  if (status === 'Đang xử lý') return 'badge-processing'
  if (status === 'Đã tiếp nhận') return 'badge-received'
  if (status === 'Đã hoàn thành') return 'badge-completed'
  return 'badge-processing'
}
</script>

<style scoped>
.detail-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 20px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
}
.btn-back svg { width: 18px; height: 18px; }
.btn-back:hover { color: #0f172a; }

.not-found {
  text-align: center;
  padding: 60px 0;
  color: #64748b;
  font-size: 15px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-section h2 {
  font-size: 24px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.location-text {
  display: flex;
  align-items: center;
  color: #475569;
  font-size: 15px;
  margin: 0;
}

.icon-location {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  color: #94a3b8;
}

.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}
.badge-processing { background: #fff7ed; color: #ea580c; }
.badge-received { background: #f0fdf4; color: #16a34a; }
.badge-completed { background: #f0fdfa; color: #0d9488; }

.grid-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.mt-4 { margin-top: 24px; }

h3 {
  font-size: 16px;
  color: #0f172a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.info-row {
  margin-bottom: 16px;
  line-height: 1.5;
}
.info-row .label {
  font-weight: 600;
  color: #475569;
  margin-right: 8px;
}
.info-row .value { color: #1e293b; }
.priority {
  color: #e11d48 !important;
  font-weight: 600;
}

.supply-table {
  width: 100%;
  border-collapse: collapse;
}
.supply-table th, .supply-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}
.supply-table th { color: #64748b; font-weight: 500; }
.supply-table td { color: #1e293b; }

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  min-height: 80px;
}

.timeline-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}

.dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.dot svg { width: 14px; height: 14px; color: white; }

.line {
  width: 2px;
  flex-grow: 1;
  background-color: #e2e8f0;
  margin-top: 4px;
  margin-bottom: 4px;
}

.timeline-content {
  padding-bottom: 24px;
  flex: 1;
}

.timeline-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

.timeline-content .time {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #94a3b8;
}

.timeline-content .desc {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.timeline-item.completed .dot { background-color: #10b981; }
.timeline-item.completed .line { background-color: #10b981; }
.timeline-item.completed .timeline-content h4 { color: #0f172a; }
.timeline-item.completed .timeline-content .time { color: #475569; }
.timeline-item.completed .timeline-content .desc { color: #334155; }
</style>