<template>
  <VolunteerLayout>
    <div class="empty-page">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#276749" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      </div>
      <h1 class="empty-title">Nhiệm vụ của tôi</h1>
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
  background: linear-gradient(135deg, #e8f5ee, #c6f6d5);
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
  background: #276749;
  color: #fff;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  transition: background 0.18s ease;
}
.back-btn:hover { background: #1f5337; color: #fff; }
</style>
