<template>
  <RequesterLayout>
    <div class="tracking-page">
      <div class="empty-card">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h2>Theo dõi hỗ trợ</h2>
        <p class="subtitle">Trang này đang được xây dựng — sẽ hiển thị bản đồ và tiến độ hỗ trợ theo thời gian thực.</p>
      </div>
    </div>
  </RequesterLayout>
</template>

<script setup lang="ts">
import RequesterLayout from '@/components/layout/RequesterLayout.vue'
</script>

<style scoped>
.tracking-page {
  max-width: 1000px;
  margin: 0 auto;
}

.empty-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 56px 32px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff1eb, #ffe4d5);
  color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.empty-card h2 {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 13.5px;
  color: #718096;
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.6;
}
</style>