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

      <form @submit.prevent="handleRegister">
        <!-- STEP 1 -->
        <div class="step-section">
          <h3 class="step-title">Step 1:</h3>
          
          <div class="form-group">
            <label>Họ và tên</label>
            <input type="text" v-model="formData.FullName" placeholder="Nguyễn Văn A" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="formData.Email" placeholder="example@email.com" required />
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="tel" v-model="formData.Phone" placeholder="0912245678" required />
          </div>

          <div class="form-group">
            <label>Mật khẩu</label>
            <div class="input-with-icon">
              <input :type="showPassword ? 'text' : 'password'" v-model="formData.Password" placeholder="••••••••••" required />
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
            <input type="password" v-model="formData.ConfirmPassword" placeholder="••••••••••" required />
            <span v-if="passwordMismatch" class="error-text">Mật khẩu xác nhận không khớp!</span>
          </div>
        </div>

      
        <div class="step-section">
          <h3 class="step-title">Step 2:</h3>
          
          <div class="form-group">
            <label>Địa phương</label>
            <select v-model="formData.Address" required>
              <option value="" disabled>Chọn Tỉnh / Thành Phố</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. HCM">TP. HCM</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              
            </select>
          </div>

          <div class="form-group">
            <label>Kỹ năng / Chuyên môn</label>
            <select v-model="formData.Skill" required>
              <option value="" disabled>Chọn lĩnh vực</option>
              <option value="Y tế">Y tế</option>
              <option value="Vận chuyển">Vận chuyển</option>
              <option value="Hậu cần">Hậu cần</option>
              <option value="IT">IT</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <input type="checkbox" id="commitment" v-model="formData.IsCommitted" required />
            <label for="commitment">
              Tôi cam kết tham gia các hoạt động cứu trợ với tinh thần tự nguyện, minh bạch, công bằng. Tất cả thông tin trên là hoàn toàn chính xác.
            </label>
          </div>
        </div>

        <button type="submit" class="submit-btn">Đăng ký</button>

        
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
import { registerUser } from '@/features/auth/auth.api'
import type { RegisterPayload } from '@/features/auth/auth.types'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const formData = reactive<RegisterPayload>({
  FullName: '',
  Email: '',
  Phone: '',
  Password: '',
  ConfirmPassword: '',
  Address: '',
})

const passwordMismatch = computed(() => {
  return formData.ConfirmPassword !== '' && formData.Password !== formData.ConfirmPassword
})

const handleRegister = async () => {
  if (passwordMismatch.value) {
    alert('Vui lòng kiểm tra lại mật khẩu xác nhận!')
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    await registerUser(formData)
    alert('Đăng ký thành công!')
    router.push('/login')
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