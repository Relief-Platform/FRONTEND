<template>
  <div class="login-wrapper">
    <!-- Logo Header -->
    <div class="header-logo">
      <h2 class="brand-name">
        <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
      </h2>
      <p class="slogan">Kết nối trái tim - Vẹn tròn cứu trợ</p>
    </div>

    <!-- Login Card -->
    <div class="login-card">
      <h2 class="form-title">ĐĂNG NHẬP NGƯỜI DÙNG</h2>

      <!-- Thông báo lỗi -->
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            id="username"
            type="text"
            v-model="formData.usernameOrEmail"
            placeholder="Tên đăng nhập hoặc email"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <div class="input-with-icon">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="formData.password"
              placeholder="Mật khẩu"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="icon-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            >
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

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          <span>{{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
        </button>

        <div class="forgot-link-row">
          <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">Quên mật khẩu?</a>
        </div>
      </form>

      <div class="divider-row">
        <span class="register-prompt">
          Chưa có tài khoản?
          <router-link to="/register" class="register-link">Đăng ký ngay</router-link>
        </span>
      </div>

      <!-- ── Mock credentials (chỉ hiển thị khi MOCK mode) ── -->
      <div v-if="isMockMode" class="mock-panel">
        <button class="mock-toggle" @click="showMock = !showMock" type="button">
          🧪 Tài khoản test {{ showMock ? '▴' : '▾' }}
        </button>
        <div v-if="showMock" class="mock-list">
          <button
            v-for="acc in mockAccounts"
            :key="acc.role"
            class="mock-item"
            type="button"
            @click="fillMock(acc)"
          >
            <span class="mock-role" :class="`mock-role--${acc.role}`">{{ acc.role }}</span>
            <span class="mock-email">{{ acc.email }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MOCK_ACCOUNTS } from '@/mocks/auth.mock'
import { USE_MOCK_AUTH } from '@/config/env'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

// ── Mock panel state ────────────────────────────────────────
const isMockMode = ref(USE_MOCK_AUTH)
const showMock   = ref(false)
const mockAccounts = MOCK_ACCOUNTS

/** Click vào tài khoản test → tự điền form + đăng nhập ngay */
function fillMock(acc: { email: string; password: string }): void {
  formData.usernameOrEmail = acc.email
  formData.password = acc.password
  showMock.value = false
  void handleLogin()
}

const showPassword   = ref(false)
const isLoading      = ref(false)
const errorMessage   = ref('')

const formData = reactive({
  usernameOrEmail: '',
  password: '',
})

// ============================================================
//  Xử lý đăng nhập
// ============================================================
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value    = true

  try {
    const identifier = formData.usernameOrEmail.trim()
    if (!identifier) {
      throw new Error('Vui lòng nhập tên đăng nhập hoặc email.')
    }

    await authStore.login(identifier, formData.password)

    // Redirect tới dashboard phù hợp với role (PascalCase từ BE)
    const roleRoutes: Record<string, string> = {
      Admin:            '/admin',
      Volunteer:        '/volunteer',
      Requester:        '/requester',
      WarehouseManager: '/admin',     // chưa có dashboard riêng → dùng admin tạm
      Organization:     '/requester', // chưa có dashboard riêng → dùng requester tạm
    }
    const dest = authStore.role ? (roleRoutes[authStore.role] ?? '/home') : '/home'
    await router.push(dest)
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Đăng nhập thất bại. Vui lòng thử lại!'
    console.error('Lỗi đăng nhập:', error)
  } finally {
    isLoading.value = false
  }
}

// ============================================================
//  Quên mật khẩu — thêm logic/route sau
// ============================================================
const handleForgotPassword = () => {
  alert('Tính năng đang phát triển!')
}
</script>

<style scoped>
/* ===== Wrapper ===== */
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 40px 20px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* ===== Logo / Header ===== */
.header-logo {
  text-align: center;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-name {
  font-size: 32px;
  margin: 0 0 4px 0;
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
}

/* ===== Card ===== */
.login-card {
  background-color: #ffffff;
  width: 100%;
  max-width: 460px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 36px 40px;
}

/* ===== Title ===== */
.form-title {
  text-align: center;
  font-size: 20px;
  color: #1a3b5c;
  margin: 0 0 28px 0;
  font-weight: 700;
  letter-spacing: 0.5px;
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

/* ===== Form Groups ===== */
.form-group {
  margin-bottom: 14px;
}

.form-group input[type='text'],
.form-group input[type='password'] {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  color: #2d3748;
}

.form-group input::placeholder {
  color: #a0aec0;
}

.form-group input:focus {
  border-color: #1a4f8d;
  box-shadow: 0 0 0 3px rgba(26, 79, 141, 0.1);
  background-color: #fff;
}

/* ===== Password Toggle ===== */
.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-right: 44px;
}

.icon-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #a0aec0;
  padding: 0;
  line-height: 1;
}

.icon-btn:hover {
  color: #718096;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Forgot Password ===== */
.forgot-link-row {
  text-align: right;
  margin-top: 10px;
}

.forgot-link {
  font-size: 13px;
  color: #1a4f8d;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}

.forgot-link:hover {
  color: #e27d24;
}

/* ===== Divider / Register ===== */
.divider-row {
  text-align: center;
  margin-top: 18px;
}

.register-prompt {
  font-size: 14px;
  color: #4a5568;
}

.register-link {
  color: #1a4f8d;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.register-link:hover {
  text-decoration: underline;
  color: #e27d24;
}

.or-text {
  font-size: 14px;
  color: #a0aec0;
}

/* ===== Google Button ===== */
.google-btn {
  width: 100%;
  padding: 11px 14px;
  margin-top: 16px;
  background-color: #ffffff;
  color: #3c4043;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #dadce0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.google-btn:hover {
  background-color: #f8f9fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.google-icon {
  flex-shrink: 0;
}

/* ===== Mock credentials panel (dev only) ===== */
.mock-panel { margin-top: 18px; }

.mock-toggle {
  width: 100%;
  padding: 9px 14px;
  background: #fffbeb;
  border: 1.5px dashed #d69e2e;
  border-radius: 8px;
  color: #744210;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}
.mock-toggle:hover { background: #fef3c7; }

.mock-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mock-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background-color 0.15s, border-color 0.15s;
}
.mock-item:hover { background: #eef2ff; border-color: #1a4f8d; }

.mock-role {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}
.mock-role--admin       { background: rgba(197,48,48,0.12);  color: #c53030; }
.mock-role--coordinator { background: rgba(43,108,176,0.12); color: #2b6cb0; }
.mock-role--volunteer   { background: rgba(39,103,73,0.12);  color: #276749; }
.mock-role--requester   { background: rgba(151,90,22,0.12);  color: #975a16; }

.mock-email { font-size: 13px; color: #4a5568; }
</style>
