<template>
  <div class="create-request-layout">
    <div class="container">
      <!-- Header Form -->
      <div class="form-header">
        <button class="btn-back" @click="$router.push('/requester')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Quay lại
        </button>
        <h2>Tạo yêu cầu cứu trợ khẩn cấp</h2>
        <p>Vui lòng cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ kịp thời và chính xác nhất.</p>
      </div>

      <!-- Khung Form -->
      <div class="form-card">
        <form @submit.prevent="submitRequest">
          
          <div class="form-group">
            <label>Tiêu đề yêu cầu <span class="required">*</span></label>
            <input v-model="formData.title" type="text" placeholder="VD: Cần hỗ trợ lương thực khẩn cấp tại..." required />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Mức độ khẩn cấp <span class="required">*</span></label>
              <select v-model="formData.priority">
                <option value="Khẩn cấp">Khẩn cấp (Nguy hiểm đến tính mạng)</option>
                <option value="Cao">Cao (Thiếu hụt nhu yếu phẩm trầm trọng)</option>
                <option value="Trung bình">Trung bình (Cần hỗ trợ trong vài ngày tới)</option>
              </select>
            </div>
            <div class="form-group half">
              <label>Địa điểm cụ thể <span class="required">*</span></label>
              <input v-model="formData.location" type="text" placeholder="Số nhà, thôn/xóm, phường/xã..." required />
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả tình trạng <span class="required">*</span></label>
            <textarea v-model="formData.description" rows="4" placeholder="Mô tả chi tiết tình hình hiện tại, số lượng người bị ảnh hưởng..." required></textarea>
          </div>

          <!-- Phần Thêm Vật Tư Động -->
          <div class="supplies-section">
            <div class="supplies-header">
              <label>Danh sách vật tư cần hỗ trợ</label>
              <button type="button" class="btn-add-supply" @click="addSupply">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                Thêm vật tư
              </button>
            </div>
            
            <div class="supplies-list">
              <div v-for="(item, index) in formData.supplies" :key="index" class="supply-item">
                <input v-model="item.name" type="text" placeholder="Tên vật tư (VD: Mì tôm, Nước sạch...)" required />
                <input v-model="item.quantity" type="number" min="1" placeholder="Số lượng" required class="qty-input" />
                <button type="button" class="btn-remove" @click="removeSupply(index)" v-if="formData.supplies.length > 1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Nút Submit -->
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="$router.push('/requester')">Hủy bỏ</button>
            <button type="submit" class="btn-submit">Gửi yêu cầu cứu trợ</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Khởi tạo state cho Form
const formData = ref({
  title: '',
  priority: 'Khẩn cấp',
  location: '',
  description: '',
  
  supplies: [
    { name: '', quantity: 1 }
  ]
})

// Logic thêm dòng vật tư
const addSupply = () => {
  formData.value.supplies.push({ name: '', quantity: 1 })
}

// Logic xóa dòng vật tư
const removeSupply = (index: number) => {
  formData.value.supplies.splice(index, 1)
}

// Logic gửi Form (Hiện tại Mock data, sau này ghép API ở đây)
const submitRequest = () => {
  console.log('Dữ liệu chuẩn bị gửi xuống Backend:', formData.value)
  alert('Gửi yêu cầu cứu trợ thành công! Hệ thống đang xử lý.')
  // Gửi xong thì tự động quay về trang chủ
  router.push('/requester')
}
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.create-request-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 24px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
}

.btn-back svg { width: 16px; height: 16px; }
.btn-back:hover { color: #0f172a; }

.form-header h2 {
  font-size: 24px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.form-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.form-group { margin-bottom: 24px; }
.form-row { display: flex; gap: 24px; margin-bottom: 24px; }
.form-row .half { margin-bottom: 0; flex: 1; }

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.required { color: #e11d48; }

input[type="text"], input[type="number"], select, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea { resize: vertical; }

/* Thêm vật tư */
.supplies-section {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
}

.supplies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.supplies-header label { margin: 0; }

.btn-add-supply {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-add-supply svg { width: 16px; height: 16px; }

.supply-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.supply-item:last-child { margin-bottom: 0; }

.qty-input { width: 120px !important; }

.btn-remove {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-remove:hover { background: #fca5a5; }
.btn-remove svg { width: 18px; height: 18px; }

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
}
.btn-cancel:hover { background: #f1f5f9; }

.btn-submit {
  padding: 12px 24px;
  background: #e11d48;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(225, 29, 72, 0.2);
}
.btn-submit:hover { background: #be123c; }
</style>