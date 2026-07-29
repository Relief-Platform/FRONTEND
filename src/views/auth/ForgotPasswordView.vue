<template>
  <div class="forgot-wrapper">
    <!-- Logo Header -->
    <router-link to="/" class="header-logo">
      <h2 class="brand-name">
        <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
      </h2>
      <p class="slogan">Kết nối trái tim - Vẹn tròn cứu trợ</p>
    </router-link>

    <!-- Forgot Password Card -->
    <div class="forgot-card">
      <div v-if="!isEmailSent">
        <h2 class="form-title">KHÔI PHỤC MẬT KHẨU</h2>
        <p class="form-subtitle">Nhập email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu của bạn.</p>

        <!-- Thông báo lỗi -->
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email" class="form-label">Địa chỉ Email</label>
            <div class="input-with-icon">
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="example@email.com"
                required
                autocomplete="email"
                class="email-input"
              />
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span>{{ isLoading ? 'Đang gửi yêu cầu...' : 'Gửi liên kết khôi phục' }}</span>
          </button>
        </form>
      </div>

      <!-- Success State -->
      <div v-else class="success-state">
        <div class="success-icon-wrapper">
          <svg class="success-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="success-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <h2 class="form-title">ĐÃ GỬI EMAIL KHÔI PHỤC</h2>
        <p class="success-text">
          Chúng tôi đã gửi liên kết đặt lại mật khẩu đến địa chỉ email <strong>{{ email }}</strong>. 
          Vui lòng kiểm tra hộp thư đến (hoặc thư rác/spam).
        </p>

        <div class="resend-section">
          <span v-if="countdown > 0" class="countdown-text">
            Gửi lại email sau <strong>{{ countdown }}s</strong>
          </span>
          <button v-else type="button" class="resend-btn" @click="handleResend" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner loading-spinner-dark"></span>
            <span>Gửi lại email</span>
          </button>
        </div>
      </div>

      <div class="divider-row">
        <router-link to="/login" class="back-to-login">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Quay lại Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const email = ref('')
const isLoading = ref(false)
const isEmailSent = ref(false)
const errorMessage = ref('')
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// Hủy timer khi component bị destroy
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'Vui lòng nhập địa chỉ email hợp lệ.'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    // Giả lập cuộc gọi API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    isEmailSent.value = true
    startCountdown()
  } catch (error) {
    errorMessage.value = 'Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.'
    console.error('Lỗi khôi phục mật khẩu:', error)
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Giả lập cuộc gọi API gửi lại
    await new Promise((resolve) => setTimeout(resolve, 1200))
    startCountdown()
  } catch (error) {
    errorMessage.value = 'Không thể gửi lại email. Vui lòng thử lại sau.'
    console.error('Lỗi gửi lại email:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ===== Wrapper ===== */
.forgot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(rgba(15, 37, 64, 0.65), rgba(15, 37, 64, 0.8)), url('/BG.jpg') center/cover no-repeat fixed;
  padding: 40px 20px;
}

/* ===== Logo / Header ===== */
.header-logo {
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.brand-name {
  font-size: 36px;
  margin: 0 0 6px 0;
  font-weight: 900;
  letter-spacing: -0.5px;
  line-height: 1;
}

.text-navy {
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.text-orange {
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.slogan {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

/* ===== Card ===== */
.forgot-card {
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  padding: 36px 40px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* ===== Title & Subtitle ===== */
.form-title {
  text-align: center;
  font-size: 20px;
  color: #1a3b5c;
  margin: 0 0 12px 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.form-subtitle {
  text-align: center;
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 28px 0;
  line-height: 1.5;
}

/* ===== Error Banner ===== */
.error-banner {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 20px;
  text-align: center;
}

/* ===== Form Groups ===== */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.input-with-icon {
  position: relative;
}

.email-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  color: #2d3748;
}

.email-input::placeholder {
  color: #a0aec0;
}

.email-input:focus {
  border-color: #1a4f8d;
  box-shadow: 0 0 0 3px rgba(26, 79, 141, 0.1);
  background-color: #fff;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  display: flex;
  align-items: center;
}

/* ===== Submit Button ===== */
.submit-btn {
  width: 100%;
  padding: 13px;
  background-color: #1a4f8d;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s, transform 0.1s;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #123766;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.99);
}

.submit-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

/* ===== Loading Spinner ===== */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loading-spinner-dark {
  border: 2px solid rgba(26, 79, 141, 0.2);
  border-top-color: #1a4f8d;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Success State ===== */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px 0;
}

.success-text {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.resend-section {
  margin-bottom: 24px;
}

.countdown-text {
  font-size: 13px;
  color: #718096;
}

.resend-btn {
  background: none;
  border: none;
  color: #1a4f8d;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.resend-btn:hover {
  color: #e27d24;
}

.resend-btn:disabled {
  color: #a0aec0;
  cursor: not-allowed;
  text-decoration: none;
}

/* ===== Animated Success Checkmark SVG ===== */
.success-icon-wrapper {
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
}

.success-svg {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4caf50;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #4caf50;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.success-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4caf50;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 4px #4caf50;
  }
}

/* ===== Divider / Return Links ===== */
.divider-row {
  border-top: 1px solid #e2e8f0;
  margin-top: 24px;
  padding-top: 20px;
  text-align: center;
}

.back-to-login {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1a4f8d;
  text-decoration: none;
  transition: color 0.2s;
}

.back-to-login:hover {
  color: #e27d24;
}

.back-to-login svg {
  transition: transform 0.2s;
}

.back-to-login:hover svg {
  transform: translateX(-3px);
}
</style>
