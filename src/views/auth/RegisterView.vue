<template>
  <div class="register-wrapper">
    <div class="header-logo">
      <h2 class="brand-name">
        <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
      </h2>
      <p class="slogan">Kết nối trái tim - Vẹn tròn cứu trợ</p>
    </div>

    <div class="register-card">
      <h2 class="form-title">ĐĂNG KÝ NGƯỜI DÙNG</h2>

      <!-- Thông báo lỗi -->
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="step-section">
          <div class="form-group">
            <label>Họ và tên</label>
            <input type="text" v-model="formData.fullName" placeholder="Nguyễn Văn A" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="formData.email" placeholder="example@email.com" required />
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="tel" v-model="formData.phoneNumber" placeholder="0912245678" required />
          </div>

          <div class="form-group">
            <label>Mật khẩu</label>
            <div class="input-with-icon">
              <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" placeholder="••••••••••" required />
              <button type="button" class="icon-btn" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.53M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Xác nhận mật khẩu</label>
            <input type="password" v-model="formData.confirmPassword" placeholder="••••••••••" required />
            <span v-if="passwordMismatch" class="error-text">Mật khẩu xác nhận không khớp!</span>
          </div>

          <div class="form-group checkbox-group">
            <input type="checkbox" id="commitment" v-model="formData.isCommitted" required />
            <label for="commitment">
              Tôi đồng ý tạo tài khoản và có thể hoàn thiện hồ sơ sau khi đăng nhập.
            </label>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Đang xử lý...</span>
          <span v-else>Đăng ký</span>
        </button>


        <div class="login-redirect">
          Đã có tài khoản?
          <router-link to="/login" class="login-link">Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, toAuthUser } from '@/features/auth/auth.api'
import { tokenStorage } from '@/lib/api/token-storage'
import { useAuthStore } from '@/stores/auth'
import type { RegisterPayload } from '@/features/auth/auth.types'

const router    = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const isLoading    = ref(false)
const errorMessage = ref('')

// Field BE register nhận: email, password, confirmPassword, fullName, phoneNumber
// (BE thật validate "The PhoneNumber field is required" — kiểm chứng 2026-07-13)
const formData = reactive({
  fullName:        '',
  email:           '',
  phoneNumber:     '',
  password:        '',
  confirmPassword: '',
  isCommitted:     false,
})

const passwordMismatch = computed(() => {
  return formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
})

const handleRegister = async () => {
  if (passwordMismatch.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp!'
    return
  }

  errorMessage.value = ''
  isLoading.value    = true

  // Gửi đủ field BE yêu cầu (kèm phoneNumber — bắt buộc)
  // Dùng intersection type để không phải sửa auth.types.ts;
  // khi nào owner phần auth thêm phoneNumber vào RegisterPayload thì bỏ phần `& {...}` đi.
  const payload: RegisterPayload & { phoneNumber: string } = {
    fullName:        formData.fullName,
    email:           formData.email,
    phoneNumber:     formData.phoneNumber,
    password:        formData.password,
    confirmPassword: formData.confirmPassword,
  }

  try {
    const result = await registerUser(payload)
    // BE trả LoginResult sau register → auto-login luôn
    tokenStorage.set(result.accessToken)
    tokenStorage.setRefresh(result.refreshToken)
    authStore.accessToken = result.accessToken
    authStore.user        = toAuthUser(result)
    localStorage.setItem('auth_user', JSON.stringify(authStore.user))
    // Mặc định Requester → redirect về /requester
    await router.push('/requester')
  } catch (error) {
    errorMessage.value = (error as Error).message || 'Đăng ký thất bại. Vui lòng thử lại!'
    console.error('Lỗi đăng ký:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

.register-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
}

.header-logo {
  text-align: center;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.logo-img {
  height: 50px;
  margin-bottom: 5px;
}


.brand-name {
  font-size: 32px;
  margin: 0 0 5px 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1;
}

.text-navy {
  color: #1a3b5c;
}

.text-orange {
  color: #e27d24;
}


.slogan {
  font-size: 13px;
  color: #4a5568;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.register-card {
  background-color: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px 40px;
}

.form-title {
  text-align: center;
  font-size: 20px;
  color: #1a3b5c;
  margin-bottom: 25px;
  font-weight: 700;
}

/* ===== Error Banner ===== */
.error-banner {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
}


.step-section {
  margin-bottom: 25px;
}
.step-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2d3748;
}


.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #4a5568;
}
.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="password"],
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fcfcfc;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #3182ce;
}


.input-with-icon {
  position: relative;
}
.input-with-icon input {
  padding-right: 40px;
}
.icon-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  line-height: 0;
}
.icon-btn:hover {
  color: #4a5568;
}


.checkbox-group {
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
}
.checkbox-group input[type="checkbox"] {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.checkbox-group label {
  font-size: 13px;
  line-height: 1.5;
  color: #4a5568;
  cursor: pointer;
}


.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #1a4f8d;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}
.submit-btn:hover {
  background-color: #123766;
}


.error-text {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 5px;
}

.login-redirect {
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #4a5568;
}
.login-link {
  color: #1a4f8d;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}
.login-link:hover {
  text-decoration: underline;
}
</style>