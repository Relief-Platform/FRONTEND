<template>
  <div class="register-wrapper">
    <router-link to="/register" class="back-link">← Quay lại trang chủ</router-link>

    <router-link to="/home" class="header-logo">
      <h2 class="brand-name">
        <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
      </h2>
      <p class="slogan">Điều Phối Yêu Thương</p>
    </router-link>

    <div class="register-card">
      <div class="stepper">
        <div class="step" :class="{ active: step === 1, done: step > 1 }">
          <span class="step-circle">1</span>
          <span class="step-label">Tài khoản</span>
        </div>
        <div class="step-line" :class="{ done: step > 1 }" />
        <div class="step" :class="{ active: step === 2 }">
          <span class="step-circle">2</span>
          <span class="step-label">Hồ sơ Volunteer</span>
        </div>
      </div>

      <!-- Thông báo lỗi -->
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <!-- ===== Step 1: Tài khoản ===== -->
      <form v-if="step === 1" @submit.prevent="handleCreateAccount">
        <div class="form-group">
          <label>Họ và tên</label>
          <input type="text" v-model="account.fullName" placeholder="Nguyễn Văn A" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="account.email" placeholder="example@email.com" required />
        </div>

        <div class="form-group">
          <label>Số điện thoại</label>
          <input type="tel" v-model="account.phoneNumber" placeholder="0912245678" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" v-model="account.password" placeholder="••••••••" required />
          </div>
          <div class="form-group">
            <label>Nhập lại mật khẩu</label>
            <input type="password" v-model="account.confirmPassword" placeholder="••••••••" required />
          </div>
        </div>
        <span v-if="passwordMismatch" class="error-text">Mật khẩu xác nhận không khớp!</span>
        <p class="hint-text">Mật khẩu tối thiểu 8 ký tự.</p>

        <div class="form-group checkbox-group">
          <input type="checkbox" id="commitment" v-model="account.isCommitted" required />
          <label for="commitment">
            Tôi cam kết cung cấp thông tin chính xác và đồng ý với điều khoản sử dụng của ReliefConnect.
          </label>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Đang xử lý...</span>
          <span v-else>Tiếp tục</span>
        </button>

        <div class="login-redirect">
          Đã có tài khoản?
          <router-link to="/login" class="login-link">Đăng nhập</router-link>
        </div>
      </form>

      <!-- ===== Step 2: Hồ sơ Volunteer ===== -->
      <form v-else @submit.prevent="handleCreateProfile">
        <div class="form-group">
          <label>Địa chỉ thường trú</label>
          <input type="text" v-model="profile.address" placeholder="123 Đường X, Quận Y, Hà Nội" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Vĩ độ (Latitude)</label>
            <input type="number" step="any" v-model.number="profile.latitude" placeholder="21.0285" required />
          </div>
          <div class="form-group">
            <label>Kinh độ (Longitude)</label>
            <input type="number" step="any" v-model.number="profile.longitude" placeholder="105.8542" required />
          </div>
        </div>

        <div class="form-group">
          <label>Số năm kinh nghiệm cứu trợ</label>
          <input type="number" min="0" v-model.number="profile.experienceYears" placeholder="0" required />
        </div>

        <div class="form-group">
          <label>Giới thiệu bản thân</label>
          <textarea v-model="profile.bio" rows="3" placeholder="Chia sẻ kinh nghiệm, tổ chức thiện nguyện bạn từng tham gia..." />
        </div>

        <div class="form-group">
          <label>Kỹ năng cứu trợ</label>
          <div class="skills-grid">
            <label v-for="skill in AVAILABLE_SKILLS" :key="skill.id" class="skill-chip">
              <input type="checkbox" :value="skill.id" v-model="profile.skillIds" />
              {{ skill.name }}
            </label>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Đang xử lý...</span>
          <span v-else>Hoàn tất đăng ký</span>
        </button>

        <button type="button" class="back-step-btn" @click="step = 1" :disabled="isLoading">
          ← Quay lại
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, toAuthUser } from '@/features/auth/auth.api'
import { createVolunteerProfile, AVAILABLE_SKILLS } from '@/features/volunteers/volunteers.api'
import { tokenStorage } from '@/lib/api/token-storage'
import { useAuthStore } from '@/stores/auth'
import type { RegisterPayload } from '@/features/auth/auth.types'

const router    = useRouter()
const authStore = useAuthStore()

const step          = ref(1)
const isLoading      = ref(false)
const errorMessage  = ref('')

const account = reactive({
  fullName:        '',
  email:           '',
  phoneNumber:     '',
  password:        '',
  confirmPassword: '',
  isCommitted:     false,
})

const profile = reactive({
  address:         '',
  latitude:        21.0285,
  longitude:       105.8542,
  experienceYears: 0,
  bio:             '',
  skillIds:        [] as string[],
})

const passwordMismatch = computed(() => {
  return account.confirmPassword !== '' && account.password !== account.confirmPassword
})

// ── Bước 1: tạo tài khoản (role mặc định Requester) rồi auto-login ──
const handleCreateAccount = async () => {
  if (passwordMismatch.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp!'
    return
  }

  errorMessage.value = ''
  isLoading.value    = true

  const payload: RegisterPayload & { phoneNumber: string } = {
    fullName:        account.fullName,
    email:           account.email,
    phoneNumber:     account.phoneNumber,
    password:        account.password,
    confirmPassword: account.confirmPassword,
  }

  try {
    const result = await registerUser(payload)
    tokenStorage.set(result.accessToken)
    tokenStorage.setRefresh(result.refreshToken)
    authStore.accessToken = result.accessToken
    authStore.user        = { ...toAuthUser(result), phoneNumber: account.phoneNumber }
    localStorage.setItem('auth_user', JSON.stringify(authStore.user))
    step.value = 2
  } catch (error) {
    errorMessage.value = (error as Error).message || 'Đăng ký thất bại. Vui lòng thử lại!'
    console.error('Lỗi đăng ký:', error)
  } finally {
    isLoading.value = false
  }
}

// ── Bước 2: gửi hồ sơ Volunteer (trạng thái Pending, chờ Admin duyệt) ──
const handleCreateProfile = async () => {
  errorMessage.value = ''
  isLoading.value    = true

  try {
    await createVolunteerProfile({
      address:         profile.address,
      latitude:        profile.latitude,
      longitude:       profile.longitude,
      experienceYears: profile.experienceYears,
      bio:             profile.bio || null,
      skillIds:        profile.skillIds,
    })
    // Hồ sơ vào trạng thái Pending; role vẫn là Requester tới khi Admin duyệt
    await router.push('/requester')
  } catch (error) {
    errorMessage.value = (error as Error).message || 'Gửi hồ sơ thất bại. Vui lòng thử lại!'
    console.error('Lỗi tạo hồ sơ volunteer:', error)
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
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.back-link {
  align-self: flex-start;
  max-width: 500px;
  width: 100%;
  margin: 0 auto 16px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  text-decoration: none;
}

.back-link:hover {
  color: #1a4f8d;
}

.header-logo {
  text-align: center;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.brand-name {
  font-size: 32px;
  margin: 0 0 5px 0;
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
  color: #e27d24;
  margin: 0;
  font-weight: 600;
}

.register-card {
  background-color: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px 40px;
}

/* ===== Stepper ===== */
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.45;
}

.step.active,
.step.done {
  opacity: 1;
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #cbd5e0;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step.active .step-circle {
  background: #e27d24;
}

.step.done .step-circle {
  background: #1a4f8d;
}

.step-label {
  font-size: 13px;
  font-weight: 700;
  color: #2d3748;
  white-space: nowrap;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #cbd5e0;
}

.step-line.done {
  background: #1a4f8d;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

.form-group input[type='text'],
.form-group input[type='email'],
.form-group input[type='tel'],
.form-group input[type='password'],
.form-group input[type='number'],
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fcfcfc;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3182ce;
}

.hint-text {
  font-size: 12px;
  color: #a0aec0;
  margin: -10px 0 15px;
}

.checkbox-group {
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  margin-top: 6px;
}

.checkbox-group input[type='checkbox'] {
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

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #2d3748;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 10px;
  cursor: pointer;
}

.skill-chip input {
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

.submit-btn:hover:not(:disabled) {
  background-color: #123766;
}

.submit-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.back-step-btn {
  width: 100%;
  padding: 10px;
  background: none;
  border: none;
  color: #4a5568;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.back-step-btn:hover:not(:disabled) {
  color: #1a4f8d;
}

.error-text {
  color: #e53e3e;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
  display: block;
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

@media (max-width: 560px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
