<template>
  <VolunteerLayout>
    <div class="empty-page">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e27d24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <h1 class="empty-title">{{ $t('volunteer.notifications_title') }}</h1>
      <p class="empty-desc">{{ $t('volunteer.under_construction') }}</p>
      <router-link to="/volunteer" class="back-btn">{{ $t('volunteer.back_to_dashboard') }}</router-link>
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
  background: linear-gradient(135deg, #fef3e2, #fde8c8);
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
  background: #e27d24;
  color: #fff;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 8px;
  transition: background 0.18s ease;
}
.back-btn:hover { background: #c46a18; color: #fff; }
</style>
