<template>
  <VolunteerLayout>
    <div class="empty-page">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <h1 class="empty-title">Đăng ký kỹ năng</h1>
      <p class="empty-desc">Trang này đang được xây dựng. Vui lòng quay lại sau.</p>
      <router-link to="/volunteer" class="back-btn">← Về Dashboard</router-link>
    </div>
  </VolunteerLayout>
</template>

<script setup lang="ts">
import VolunteerLayout from '@/components/layout/VolunteerLayout.vue'
</script>

<style scoped>
.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  text-align: center;
}
.empty-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3eeff, #e9d8fd);
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-title { font-size: 22px; font-weight: 800; color: #1a3b5c; }
.empty-desc  { font-size: 14px; color: #718096; max-width: 340px; line-height: 1.6; }
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  background: #6b46c1;
  color: #fff;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  transition: background 0.18s ease;
}
.back-btn:hover { background: #553c9a; color: #fff; }
</style>
