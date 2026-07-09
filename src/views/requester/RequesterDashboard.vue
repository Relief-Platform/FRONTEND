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
        <a href="#" class="menu-item active">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Trang chủ
        </a>
        <a href="#" class="menu-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Yêu cầu của tôi
        </a>
        <a href="#" class="menu-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Theo dõi hỗ trợ
        </a>
        <a href="#" class="menu-item" @click.prevent="$router.push('/requester/notifications')">
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
  Thông báo
</a>
        <a href="#" class="menu-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          Hướng dẫn
        </a>
      </nav>

      <div class="profile-min">
        <div class="avatar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
        <div class="info">
          <strong>UBND xã Tân Lập</strong>
          <span>Đại diện điểm nóng</span>
        </div>
        <div class="chevron">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-header">
        <div class="header-right">
          <span class="greeting">Xin chào, <strong>UBND xã Tân Lập</strong></span>
          <svg class="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <svg class="chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </header>

      <div class="content-body">
        <!-- Banner -->
        <section class="banner-section">
          <div class="banner-content">
            <h3 class="highlight-text">KHI BẠN CẦN HỖ TRỢ,</h3>
            <h2 class="main-heading">Chúng tôi luôn sẵn sàng!</h2>
            <p class="sub-text">Tạo yêu cầu cứu trợ khẩn cấp để được hỗ trợ nhanh nhất.</p>
          </div>
          <button class="btn-emergency" @click="$router.push('/requester/create')">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            YÊU CẦU CỨU TRỢ KHẨN CẤP
          </button>
        </section>

        <!-- Grid 2 cột -->
        <div class="dashboard-grid">
          
          <!-- Cột trái: Yêu cầu gần đây -->
          <section class="card recent-requests">
            <h3 class="card-title">Yêu cầu gần đây</h3>
            <div class="request-list">
              
              <div class="request-item">
                <div class="req-info">
                  <div class="req-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div>
                    <h4>Ngập lụt tại xã Tân Lập, Quảng Trị</h4>
                    <span class="time">10/06/2024 - 08:30</span>
                  </div>
                </div>
                <div class="req-actions">
                  <span class="badge badge-processing">Đang xử lý</span>
                  <button class="btn-outline">Xem chi tiết</button>
                </div>
              </div>
              
              <div class="request-item">
                <div class="req-info">
                  <div class="req-icon">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div>
                    <h4>Sạt lở tại thôn Đông Hà</h4>
                    <span class="time">08/06/2024 - 14:20</span>
                  </div>
                </div>
                <div class="req-actions">
                  <span class="badge badge-received">Đã tiếp nhận</span>
                  <button class="btn-outline">Xem chi tiết</button>
                </div>
              </div>

              <div class="request-item">
                <div class="req-info">
                  <div class="req-icon">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <div>
                    <h4>Thiếu nước sạch sinh hoạt</h4>
                    <span class="time">05/06/2024 - 09:15</span>
                  </div>
                </div>
                <div class="req-actions">
                  <span class="badge badge-completed">Đã hoàn thành</span>
                  <button class="btn-outline">Xem chi tiết</button>
                </div>
              </div>
            </div>
            <a href="#" class="view-all">Xem tất cả yêu cầu →</a>
          </section>

          <!-- Cột phải: Hướng dẫn nhanh -->
          <section class="right-column">
            <div class="card quick-guides">
              <h3 class="card-title">Hướng dẫn nhanh</h3>
              <ul class="guide-list">
                <li>
                  <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Hướng dẫn tạo yêu cầu cứu trợ
                </li>
                <li>
                  <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  Các loại hỗ trợ có thể nhận
                </li>
                <li>
                  <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Quy trình hỗ trợ
                </li>
                <li>
                  <svg class="guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Liên hệ hỗ trợ
                </li>
              </ul>
            </div>

            <div class="card emergency-contact">
              <p class="contact-title">Thông tin liên hệ khẩn cấp</p>
              <p class="phone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                1900 1234
              </p>
              <p class="email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hotro@reliefconnect.vn
              </p>
            </div>
          </section>
          
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.requester-layout {
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
}

/* --- SIDEBAR --- */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding: 0 8px;
}

.logo-svg {
  width: 32px;
  height: 32px;
}

.brand-text h2 {
  font-size: 20px;
  color: #1e3a8a;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-relief { color: #1e3a8a; }
.brand-connect { color: #ea580c; }

.brand-text p {
  font-size: 11px;
  color: #64748b;
  margin: 2px 0 0 0;
  font-weight: 500;
}

.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.menu-item .icon {
  width: 20px;
  height: 20px;
  color: #94a3b8; /* Màu icon nhạt */
}

.menu-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.menu-item.active .icon {
  color: #2563eb;
}

.menu-item:hover:not(.active) {
  background-color: #f1f5f9;
}

.profile-min {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 8px 0;
  border-top: 1px solid #e2e8f0;
  cursor: pointer;
}

.avatar-icon {
  background: #f1f5f9;
  padding: 8px;
  border-radius: 50%;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon svg {
  width: 20px;
  height: 20px;
}

.profile-min .info strong {
  display: block;
  font-size: 13px;
  color: #0f172a;
}

.profile-min .info span {
  font-size: 11px;
  color: #64748b;
}

.chevron {
  margin-left: auto;
  color: #94a3b8;
}

/* --- MAIN CONTENT --- */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.top-header {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 32px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #475569;
}

.bell-icon, .chevron-down {
  width: 20px;
  height: 20px;
  color: #64748b;
  cursor: pointer;
}

.content-body {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* --- BANNER --- */
.banner-section {
  background: linear-gradient(135deg, #ffe4e6 0%, #ffedd5 100%);
  border-radius: 16px;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.highlight-text {
  color: #e11d48;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.main-heading {
  color: #be123c;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.sub-text {
  color: #881337;
  font-size: 14px;
  margin: 0;
}

.btn-emergency {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e11d48;
  color: white;
  border: none;
  padding: 16px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
  transition: background 0.2s;
}

.btn-emergency .alert-icon {
  width: 20px;
  height: 20px;
}

.btn-emergency:hover {
  background-color: #be123c;
}

/* --- GRID LAYOUT --- */
.dashboard-grid {
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

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 20px 0;
}

/* Danh sách yêu cầu */
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

.request-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

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

.req-icon svg {
  width: 20px;
  height: 20px;
  color: #64748b; 
}

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

.view-all {
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

/* Cột phải */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
}

.guide-icon {
  width: 20px;
  height: 20px;
  color: #64748b; /* Màu icon nhạt */
}

.guide-list li:hover {
  border-color: #e2e8f0;
  background: #ffffff;
}

.emergency-contact {
  background: #f8fafc;
}

.contact-title {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 12px 0;
}

.phone, .email {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
  margin: 0 0 8px 0;
}
</style>