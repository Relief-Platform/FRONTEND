<template>
  <AppLayout>
    <div class="contact-page">
      <!-- ══════════ HERO ══════════ -->
      <section class="contact-hero">
        <div class="hero-container">
          <span class="hero-badge">Hỗ trợ 24/7</span>
          <h1 class="hero-title">Liên hệ với ReliefConnect</h1>
          <p class="hero-subtitle">
            Chúng tôi luôn sẵn sàng lắng nghe, giải đáp thắc mắc và hỗ trợ kết nối cứu trợ nhanh nhất có thể.
          </p>
        </div>
      </section>

      <div class="page-container">
        <div class="contact-grid">
          <!-- ══════════ THÔNG TIN LIÊN HỆ ══════════ -->
          <div class="info-sidebar">
            <h2 class="sidebar-title">Kênh liên hệ khẩn cấp</h2>
            <p class="sidebar-desc">Nếu bạn cần trợ giúp cứu trợ gấp hoặc báo cáo tình huống thiên tai khẩn cấp:</p>

            <div class="contact-card bg-rose">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div class="card-info">
                <span class="info-label">Tổng đài Khẩn cấp 24/7</span>
                <a href="tel:19001234" class="info-value text-rose">1900 1234 (Miễn phí)</a>
              </div>
            </div>

            <div class="contact-card bg-blue">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div class="card-info">
                <span class="info-label">Email hỗ trợ chung</span>
                <a href="mailto:hotro@reliefconnect.vn" class="info-value text-blue">hotro@reliefconnect.vn</a>
              </div>
            </div>

            <div class="contact-card bg-orange">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div class="card-info">
                <span class="info-label">Văn phòng Trung tâm điều phối</span>
                <span class="info-text">Tầng 5, Tòa nhà Điều hành Cứu trợ Quốc gia, Q. Cầu Giấy, Hà Nội</span>
              </div>
            </div>

            <div class="social-links">
              <span class="social-title">Theo dõi chúng tôi:</span>
              <div class="social-icons">
                <a href="#" class="social-btn">Facebook</a>
                <a href="#" class="social-btn">Zalo OA</a>
                <a href="#" class="social-btn">YouTube</a>
              </div>
            </div>
          </div>

          <!-- ══════════ FORM GỬI TIN NHẮN ══════════ -->
          <div class="form-container">
            <h2 class="form-title">Gửi tin nhắn cho chúng tôi</h2>
            <p class="form-desc">Vui lòng điền thông tin bên dưới, Ban quản trị sẽ phản hồi trong thời gian sớm nhất.</p>

            <div v-if="submitted" class="alert alert--success mb-4">
              <strong>Cảm ơn bạn!</strong> Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
            </div>

            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label class="form-label">Họ và tên <span class="req">*</span></label>
                <input
                  v-model="form.fullName"
                  type="text"
                  class="form-input"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email <span class="req">*</span></label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Số điện thoại</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    placeholder="0912 345 678"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Chủ đề <span class="req">*</span></label>
                <select v-model="form.subject" class="form-select" required>
                  <option value="" disabled>-- Chọn chủ đề --</option>
                  <option value="hotro">Hỗ trợ sử dụng tài khoản</option>
                  <option value="tinhnguyen">Hỏi về Đăng ký Tình nguyện viên</option>
                  <option value="kho">Hợp tác Quyên góp / Quản lý Kho</option>
                  <option value="gop-y">Góp ý cải thiện hệ thống</option>
                  <option value="khac">Khác</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Nội dung tin nhắn <span class="req">*</span></label>
                <textarea
                  v-model="form.message"
                  class="form-textarea"
                  rows="5"
                  placeholder="Nhập nội dung thắc mắc hoặc câu hỏi của bạn..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn-submit" :disabled="loading">
                <span v-if="loading">Đang gửi...</span>
                <span v-else>Gửi tin nhắn ngay</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const loading = ref(false)
const submitted = ref(false)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

async function handleSubmit() {
  loading.value = true
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 800))
  loading.value = false
  submitted.value = true
  form.value = { fullName: '', email: '', phone: '', subject: '', message: '' }
}
</script>

<style scoped>
.contact-hero {
  background: linear-gradient(135deg, #1a3b5c 0%, #1a4f8d 60%, #e27d24 100%);
  color: #fff;
  padding: 64px 20px;
  text-align: center;
}
.hero-container {
  max-width: 760px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 16px;
}
.hero-subtitle {
  font-size: 15px;
  opacity: 0.9;
  line-height: 1.6;
}

/* Grid */
.contact-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 36px;
  margin-bottom: 48px;
}

/* Sidebar */
.info-sidebar {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-soft);
  height: fit-content;
}
.sidebar-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a3b5c;
  margin-bottom: 8px;
}
.sidebar-desc {
  font-size: 13.5px;
  color: #718096;
  margin-bottom: 24px;
}

.contact-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}
.bg-rose { background: #ffe4e6; }
.bg-blue { background: #ebf8ff; }
.bg-orange { background: #fff7ed; }

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}
.bg-rose .card-icon { color: #e11d48; }
.bg-blue .card-icon { color: #1a4f8d; }
.bg-orange .card-icon { color: #e27d24; }

.card-info {
  display: flex;
  flex-direction: column;
}
.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
}
.info-value {
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;
  margin-top: 2px;
}
.text-rose { color: #e11d48; }
.text-blue { color: #1a4f8d; }
.info-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.4;
  margin-top: 4px;
}

.social-links {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-soft);
}
.social-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a5568;
  display: block;
  margin-bottom: 10px;
}
.social-icons {
  display: flex;
  gap: 8px;
}
.social-btn {
  padding: 6px 14px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: #1a4f8d;
  text-decoration: none;
}
.social-btn:hover { background: #e2e8f0; }

/* Form */
.form-container {
  background: #fff;
  border-radius: 16px;
  padding: 36px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-soft);
}
.form-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a3b5c;
  margin-bottom: 8px;
}
.form-desc {
  font-size: 14px;
  color: #718096;
  margin-bottom: 28px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #2d3748;
}
.req { color: #e11d48; }

.form-input, .form-select, .form-textarea {
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #1a4f8d;
}

.btn-submit {
  padding: 12px 28px;
  background: #1a4f8d;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}
.btn-submit:hover { background: #123766; }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
