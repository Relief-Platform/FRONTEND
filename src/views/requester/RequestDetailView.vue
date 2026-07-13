<template>
  <RequesterLayout>
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Chi tiết yêu cầu</h2>
          <p class="subtitle">Xem thông tin và trạng thái yêu cầu của bạn.</p>
        </div>
        <button class="btn-outline" @click="router.push('/requester/my-requests')">
          Quay lại
        </button>
      </div>

      <div class="card">
        <div class="row"><strong>Mã yêu cầu:</strong> {{ route.params.id }}</div>
        <div class="row"><strong>Trạng thái:</strong> Đang được xử lý</div>
        <div class="row"><strong>Địa chỉ:</strong> Đang cập nhật từ hệ thống</div>
        <div class="row"><strong>Ghi chú:</strong> Đây là trang chi tiết tạm thời để giữ router hoạt động.</div>
      </div>
    </div>
  </RequesterLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import RequesterLayout from '@/components/layout/RequesterLayout.vue'

const route = useRoute()
const router = useRouter()
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.btn-outline {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  background: #f3f4f6;
  color: #111827;
}
</style>
