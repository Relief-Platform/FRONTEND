<template>
  <div class="requester-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <svg class="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#1e3a8a"/>
          <path d="M12 15.5C12 15.5 15 13 15 10.5C15 9.11929 13.8807 8 12.5 8C12 8 11.5 8.5 11.5 8.5C11.5 8.5 11 8 10.5 8C9.11929 8 8 9.11929 8 10.5C8 13 11 15.5 12 15.5Z" fill="white"/>
        </svg>
        <div class="brand-text">
          <h2><span class="brand-relief">Relief</span><span class="brand-connect">Connect</span></h2>
          <p>Kết nối yêu thương</p>
        </div>
      </div>

<nav class="menu">
        <router-link to="/requester" class="menu-item" exact-active-class="active">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Trang chủ
        </router-link>

        <router-link to="/requester/my-requests" class="menu-item" active-class="active">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Yêu cầu của tôi
        </router-link>
        
        <router-link to="/requester/tracking" class="menu-item" active-class="active">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Theo dõi hỗ trợ
        </router-link>

        <router-link to="/requester/notifications" class="menu-item" active-class="active">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          Thông báo
        </router-link>

        <router-link to="/requester/guide" class="menu-item" active-class="active">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          Hướng dẫn
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-header">
        <div class="header-right">
          <span class="greeting">Xin chào, <strong>UBND xã Tân Lập</strong></span>
          <svg class="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
      </header>

      <div class="content-body">
        <div class="notifications-container">
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
              <div class="note-icon">
                <svg v-if="note.type === 'system'" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <svg v-else-if="note.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const notifications = ref<any[]>([])

// Chạy ngay khi mở trang
onMounted(() => {
  // Thử kéo dữ liệu từ LocalStorage ra trước
  const savedNotes = JSON.parse(localStorage.getItem('relief_notifications') || 'null')
  
  if (savedNotes) {
    // Nếu đã từng lưu, lấy ra xài (sẽ nhớ được trạng thái đã đọc)
    notifications.value = savedNotes
  } else {
    // Nếu lần đầu vào web, dùng dữ liệu mẫu
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
    // Lưu ngay cái mẫu này xuống LocalStorage
    localStorage.setItem('relief_notifications', JSON.stringify(initialNotes))
  }
})

// Hàm đánh dấu đã đọc
const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
  localStorage.setItem('relief_notifications', JSON.stringify(notifications.value))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { font-family: 'Inter', sans-serif; box-sizing: border-box; }
.requester-layout { display: flex; height: 100vh; background-color: #f8fafc; }
.sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 24px 16px; }
.brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding: 0 8px; }
.logo-svg { width: 32px; height: 32px; }
.brand-text h2 { font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px; }
.brand-relief { color: #1e3a8a; } .brand-connect { color: #ea580c; }
.brand-text p { font-size: 11px; color: #64748b; margin: 2px 0 0 0; font-weight: 500; }
.menu { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; text-decoration: none; color: #475569; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; }
.menu-item .icon { width: 20px; height: 20px; color: #94a3b8; }
.menu-item.active { background-color: #eff6ff; color: #2563eb; font-weight: 600; }
.menu-item.active .icon { color: #2563eb; }
.menu-item:hover:not(.active) { background-color: #f1f5f9; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
.top-header { height: 64px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: flex-end; align-items: center; padding: 0 32px; }
.header-right { display: flex; align-items: center; gap: 16px; font-size: 14px; color: #475569; }
.bell-icon { width: 20px; height: 20px; color: #64748b; cursor: pointer; }
.content-body { padding: 32px; max-width: 900px; margin: 0 auto; width: 100%; }

/* CSS riêng cho List Thông báo */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h2 { font-size: 24px; color: #0f172a; margin: 0; }
.btn-mark-read { background: none; border: none; color: #2563eb; font-size: 14px; font-weight: 500; cursor: pointer; padding: 8px; }
.btn-mark-read:hover { text-decoration: underline; }

.notifications-list { display: flex; flex-direction: column; gap: 16px; }
.notification-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; gap: 16px; transition: all 0.2s; }
.notification-item.unread { background: #f0fdf4; border-color: #bbf7d0; }
.note-icon { background: #f8fafc; padding: 12px; border-radius: 50%; height: fit-content; display: flex; align-items: center; justify-content: center; }
.note-icon svg { width: 24px; height: 24px; }
.note-content { flex: 1; }
.note-content h4 { margin: 0 0 6px 0; font-size: 15px; color: #1e293b; font-weight: 600; }
.note-content p { margin: 0 0 12px 0; font-size: 14px; color: #475569; line-height: 1.5; }
.note-time { font-size: 12px; color: #94a3b8; }
.note-status { display: flex; align-items: center; }
.dot { width: 10px; height: 10px; background-color: #22c55e; border-radius: 50%; display: inline-block; }
</style>