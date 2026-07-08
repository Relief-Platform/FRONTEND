<template>
  <AppLayout>
    <!-- HomeView content goes here -->
    <div class="home-placeholder">
      <h1>Trang chủ</h1>
      <p>Chào mừng bạn đến với ReliefConnect!</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<style scoped>
.home-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  gap: 12px;
  color: #1a3b5c;
}
h1 { font-size: 28px; font-weight: 800; }
p  { font-size: 16px; color: #4a5568; }
</style>