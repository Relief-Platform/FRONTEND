<template>
  <RequesterLayout>
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Tạo yêu cầu mới</h2>
          <p class="subtitle">Gửi thông tin chi tiết để nhận hỗ trợ nhanh nhất.</p>
        </div>
        <button class="btn-outline" @click="router.push('/requester/my-requests')">
          Quay lại danh sách
        </button>
      </div>

      <div class="card">
        <form class="form" @submit.prevent="submitRequest">
          <div class="form-group">
            <label>Tiêu đề yêu cầu</label>
            <input v-model="form.title" type="text" placeholder="VD: Cần hỗ trợ lương thực" required />
          </div>

          <div class="form-group">
            <label>Mô tả</label>
            <textarea v-model="form.description" rows="4" placeholder="Mô tả tình hình cần hỗ trợ" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Mức độ khẩn cấp</label>
              <select v-model="form.emergencyLevel">
                <option value="2">Trung bình</option>
                <option value="3">Cao</option>
                <option value="4">Khẩn cấp</option>
              </select>
            </div>
            <div class="form-group">
              <label>Số người bị ảnh hưởng</label>
              <input v-model.number="form.affectedPeople" type="number" min="1" required />
            </div>
          </div>

          <div class="form-group">
            <label>Địa chỉ</label>
            <input v-model="form.address" type="text" placeholder="Nhập địa chỉ cụ thể" required />
          </div>

          <div class="form-group">
            <label>Số điện thoại liên hệ</label>
            <input v-model="form.contactPhone" type="tel" required />
          </div>

          <div class="actions">
            <button type="button" class="btn-outline" @click="router.push('/requester/my-requests')">Hủy</button>
            <button type="submit" class="btn-primary">Gửi yêu cầu</button>
          </div>
        </form>
      </div>
    </div>
  </RequesterLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RequesterLayout from '@/components/layout/RequesterLayout.vue'

const router = useRouter()

const form = ref({
  title: '',
  description: '',
  emergencyLevel: 2,
  affectedPeople: 1,
  address: '',
  contactPhone: '',
})

const submitRequest = () => {
  router.push('/requester/my-requests')
}
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
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
input,
textarea,
select,
button {
  font: inherit;
}
input,
textarea,
select {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.7rem 0.8rem;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.25rem;
}
.btn-primary,
.btn-outline {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  cursor: pointer;
}
.btn-primary {
  background: #2563eb;
  color: white;
}
.btn-outline {
  background: #f3f4f6;
  color: #111827;
}
@media (max-width: 640px) {
  .page-header,
  .form-row {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
