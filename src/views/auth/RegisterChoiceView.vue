<template>
  <div class="choice-wrapper">
    <router-link to="/home" class="back-link">← Quay lại trang chủ</router-link>

    <div class="choice-card">
      <router-link to="/home" class="header-logo">
        <h2 class="brand-name">
          <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
        </h2>
        <p class="slogan">Điều Phối Yêu Thương</p>
      </router-link>

      <h2 class="form-title">Bạn muốn đăng ký với vai trò nào?</h2>
      <p class="form-sub">Chọn 1 trong 2 lựa chọn bên dưới để tiếp tục.</p>

      <div class="options-grid">
        <router-link to="/register/sos" class="option-card option-sos">
          <div class="option-icon">🆘</div>
          <h3 class="option-title option-title-sos">Tôi cần cứu trợ</h3>
          <p class="option-desc">
            Đăng ký nhanh, gửi yêu cầu cứu trợ ngay khi cần hỗ trợ lương thực, nước uống, y tế...
          </p>
          <span class="option-btn option-btn-sos">Đăng ký ngay</span>
        </router-link>

        <router-link to="/register/volunteer" class="option-card option-volunteer">
          <div class="option-icon">🤝</div>
          <h3 class="option-title">Tôi muốn làm tình nguyện viên</h3>
          <p class="option-desc">
            Đăng ký hồ sơ tình nguyện viên, khai báo kỹ năng và vị trí để được phân công hỗ trợ.
          </p>
          <span class="option-btn option-btn-volunteer">Đăng ký ngay</span>
        </router-link>
      </div>

      <div class="login-redirect">
        Đã có tài khoản?
        <router-link to="/login" class="login-link">Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.choice-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 40px 20px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.back-link {
  align-self: flex-start;
  max-width: 780px;
  width: 100%;
  margin: 0 auto 20px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  text-decoration: none;
}

.back-link:hover {
  color: #1a4f8d;
}

.choice-card {
  background-color: #ffffff;
  width: 100%;
  max-width: 780px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 40px 48px;
  text-align: center;
}

.header-logo {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.brand-name {
  font-size: 30px;
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
  color: #e27d24;
  font-weight: 600;
  margin: 0;
}

.form-title {
  font-size: 22px;
  color: #1a3b5c;
  font-weight: 800;
  margin: 0 0 8px;
}

.form-sub {
  font-size: 14px;
  color: #718096;
  margin: 0 0 32px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  border-radius: 14px;
  padding: 32px 20px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.option-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.option-sos {
  background: #fdeeee;
}

.option-volunteer {
  background: #eef1f5;
}

.option-icon {
  font-size: 32px;
  margin-bottom: 14px;
}

.option-title {
  font-size: 17px;
  font-weight: 800;
  color: #1a3b5c;
  margin: 0 0 10px;
}

.option-title-sos {
  color: #c53030;
}

.option-desc {
  font-size: 13px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 20px;
  min-height: 62px;
}

.option-btn {
  display: inline-block;
  padding: 11px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.option-btn-sos {
  background: #e02424;
}

.option-btn-volunteer {
  background: #1a3b5c;
}

.login-redirect {
  margin-top: 32px;
  font-size: 14px;
  color: #4a5568;
}

.login-link {
  color: #e27d24;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  .choice-card {
    padding: 32px 24px;
  }
}
</style>
