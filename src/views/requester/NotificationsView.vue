<template>
  <RequesterLayout>
    <div class="notifications-page">
      <div class="page-header">
        <h2>Thông báo của bạn</h2>
        <button class="btn-mark-read" @click="markAllAsRead">Đánh dấu tất cả đã đọc</button>
      </div>

      <div class="notifications-list">
        <div
          v-for="note in notifications"
          :key="note.id"
          :class="['notification-item', { unread: !note.isRead }]"
        >
          <div class="note-icon" :class="`icon--${note.type}`">
            <svg v-if="note.type === 'system'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <svg v-else-if="note.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>

          <div class="note-content">
            <h4>{{ note.title }}</h4>
            <p>{{ note.message }}</p>
            <span class="note-time">{{ note.time }}</span>
          </div>

          <div class="note-status" v-if="!note.isRead">
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
  </RequesterLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RequesterLayout from '@/components/layout/RequesterLayout.vue'

const notifications = ref<any[]>([])

onMounted(() => {
  const savedNotes = JSON.parse(localStorage.getItem('relief_notifications') || 'null')

  if (savedNotes) {
    notifications.value = savedNotes
  } else {
    const initialNotes = [
      {
        id: 1, type: 'success', title: 'Yêu cầu cứu trợ đã được tiếp nhận',
        message: 'Yêu cầu "Ngập lụt tại xã Tân Lập, Quảng Trị" của bạn đã được điều phối viên xác nhận và đang chờ phân công tình nguyện viên.',
        time: 'Vừa xong', isRead: false
      },
      {
        id: 2, type: 'system', title: 'Cập nhật trạng thái tự động',
        message: 'Thông báo khẩn cấp từ yêu cầu của bạn đã được gửi đến các đội Y tế khu vực lân cận.',
        time: '2 giờ trước', isRead: false
      },
      {
        id: 3, type: 'alert', title: 'Cảnh báo thời tiết xấu',
        message: 'Khu vực Quảng Trị dự báo sẽ có mưa lớn trong 12 giờ tới. Vui lòng giữ liên lạc và chuẩn bị phương án dự phòng.',
        time: '1 ngày trước', isRead: true
      }
    ]
    notifications.value = initialNotes
    localStorage.setItem('relief_notifications', JSON.stringify(initialNotes))
  }
})

const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
  localStorage.setItem('relief_notifications', JSON.stringify(notifications.value))
}
</script>

<style scoped>
.notifications-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
  margin: 0;
}
.btn-mark-read {
  background: none;
  border: none;
  color: #ea580c;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
}
.btn-mark-read:hover { text-decoration: underline; }

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.notification-item {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.notification-item.unread {
  background: #fff9f5;
  border-color: #fed7aa;
}

.note-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.note-icon svg { width: 22px; height: 22px; }
.icon--success { background: rgba(22,163,74,0.10); color: #16a34a; }
.icon--system  { background: rgba(37,99,235,0.10); color: #2563eb; }
.icon--alert   { background: rgba(234,88,12,0.10); color: #ea580c; }

.note-content { flex: 1; min-width: 0; }
.note-content h4 { margin: 0 0 6px 0; font-size: 14.5px; color: #1e293b; font-weight: 700; }
.note-content p { margin: 0 0 10px 0; font-size: 13.5px; color: #475569; line-height: 1.55; }
.note-time { font-size: 11.5px; color: #94a3b8; font-weight: 500; }

.note-status { display: flex; align-items: flex-start; padding-top: 4px; }
.dot { width: 9px; height: 9px; background-color: #ea580c; border-radius: 50%; display: inline-block; }

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .notification-item { flex-direction: column; }
}
</style>