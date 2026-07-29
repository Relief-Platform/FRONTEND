<template>
  <AppLayout>
    <!-- ══════════ HERO ══════════ -->
    <div class="home-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
        </h1>
        <p class="hero-slogan">Kết nối trái tim – Vẹn tròn cứu trợ</p>
        <p class="hero-desc">
          Nền tảng kết nối tình nguyện viên, điều phối viên và người cần hỗ trợ
          trong các tình huống thiên tai, khẩn cấp.
        </p>

        <!-- CTA cho guest -->
        <div v-if="!auth.isLoggedIn" class="hero-cta">
          <router-link to="/register" class="btn-emergency">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Yêu cầu cứu trợ khẩn cấp
          </router-link>
          <router-link to="/register" class="btn-ghost">Trở thành tình nguyện viên</router-link>
        </div>
        <p v-if="!auth.isLoggedIn" class="hero-login-hint">
          Đã có tài khoản?
          <router-link to="/login" class="hero-login-link">Đăng nhập</router-link>
        </p>

        <!-- Shortcut cho user đã login -->
        <div v-else class="hero-cta">
          <router-link v-if="isRequester" :to="emergencyTo" class="btn-emergency">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Yêu cầu cứu trợ khẩn cấp
          </router-link>
          <router-link :to="dashboardRoute" class="btn-primary">Vào Dashboard →</router-link>
        </div>
      </div>
    </div>

    <!-- ══════════ QUY TRÌNH 4 BƯỚC ══════════ -->
    <div class="page-container">
      <section class="section">
        <h2 class="section-title">Cứu trợ đến với bạn như thế nào?</h2>
        <p class="section-sub">Quy trình 4 bước minh bạch, theo dõi được từng giai đoạn</p>

        <div class="steps-grid">
          <div class="step-card" v-for="(s, i) in steps" :key="s.title">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-icon" v-html="s.icon" />
            <h3 class="step-title">{{ s.title }}</h3>
            <p class="step-desc">{{ s.desc }}</p>
            <div v-if="i < steps.length - 1" class="step-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════ 3 VAI TRÒ ══════════ -->
      <section class="section">
        <h2 class="section-title">Bạn là ai trong hành trình này?</h2>
        <p class="section-sub">Mỗi vai trò là một mắt xích để cứu trợ đến đúng nơi, đúng lúc</p>

        <div class="features-grid">
          <div class="feature-card" v-for="f in roles" :key="f.title">
            <div class="feature-icon" :style="{ background: f.bg, color: f.color }" v-html="f.icon" />
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
            <router-link v-if="!auth.isLoggedIn" to="/register" class="feature-link" :style="{ color: f.color }">
              {{ f.cta }} →
            </router-link>
          </div>
        </div>
      </section>

      <!-- ══════════ VỀ CHÚNG TÔI (ABOUT US) ══════════ -->
      <section class="section about-home-banner">
        <div class="about-home-card">
          <div class="about-home-text">
            <span class="badge-tag">Về ReliefConnect</span>
            <h2 class="about-home-title">Sứ mệnh kết nối trái tim – Vẹn tròn cứu trợ</h2>
            <p class="about-home-desc">
              ReliefConnect ra đời với sứ mệnh ứng dụng công nghệ để minh bạch hóa toàn bộ quy trình cứu trợ thiên tai. 
              Chúng tôi kết nối trực tiếp nguồn lực từ các nhà hảo tâm, kho cứu trợ và tình nguyện viên tới tận tay người dân vùng lũ.
            </p>
            <router-link to="/about" class="btn-about-link">
              Tìm hiểu thêm về chúng tôi →
            </router-link>
          </div>
          <div class="about-home-stats">
            <div class="home-stat-item">
              <span class="num">10k+</span>
              <span class="lbl">Hỗ trợ thành công</span>
            </div>
            <div class="home-stat-item">
              <span class="num">5k+</span>
              <span class="lbl">Tình nguyện viên</span>
            </div>
            <div class="home-stat-item">
              <span class="num">100%</span>
              <span class="lbl">Minh bạch thông tin</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════ HƯỚNG DẪN SỬ DỤNG WEB ══════════ -->
      <section class="section">
        <h2 class="section-title">Hướng dẫn sử dụng hệ thống</h2>
        <p class="section-sub">Dễ dàng thao tác cho mọi đối tượng trên máy tính và điện thoại</p>

        <div class="guide-cards-grid">
          <div class="guide-quick-card">
            <div class="guide-icon-box bg-rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h4>Dành cho Người cần hỗ trợ</h4>
            <p>Tạo yêu cầu nhanh chỉ với 2 phút. Nhập nhu cầu vật tư và vị trí để nhận hỗ trợ kịp thời.</p>
            <router-link to="/guide" class="guide-card-link">Xem chi tiết →</router-link>
          </div>

          <div class="guide-quick-card">
            <div class="guide-icon-box bg-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#276749" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <h4>Dành cho Tình nguyện viên</h4>
            <p>Đăng ký kỹ năng, nhận thông báo nhiệm vụ cứu trợ gần nhất và cập nhật nhật ký đóng góp.</p>
            <router-link to="/guide" class="guide-card-link">Xem chi tiết →</router-link>
          </div>

          <div class="guide-quick-card">
            <div class="guide-icon-box bg-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a4f8d" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h4>Dành cho Điều phối & Kho</h4>
            <p>Duyệt đơn, quản lý số lượng tồn kho vật tư và phân công tình nguyện viên chính xác.</p>
            <router-link to="/guide" class="guide-card-link">Xem chi tiết →</router-link>
          </div>
        </div>
      </section>
    </div>

    <!-- ══════════ HOTLINE & LIÊN HỆ ══════════ -->
    <div class="hotline-band">
      <div class="hotline-inner">
        <div>
          <p class="hotline-label">Cần hỗ trợ gấp hoặc muốn tư vấn chi tiết?</p>
          <p class="hotline-sub">Tổng đài hoạt động 24/7, hoàn toàn miễn phí hoặc gửi tin nhắn cho chúng tôi</p>
        </div>
        <div class="hotline-contacts">
          <a href="tel:19001234" class="hotline-phone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            1900 1234
          </a>
          <router-link to="/contact" class="btn-contact-page">
            Trang Liên hệ →
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// BE trả role viết hoa ("Requester", "Admin"...) còn mock cũ viết thường
// → so sánh lowercase để chạy đúng cả 2 (fix bug bấm "Vào Dashboard" quay về /home)
const normalizedRole = computed(() => (auth.role ?? '').toLowerCase())

/** Điều hướng tới dashboard phù hợp với role */
const dashboardRoute = computed(() => {
  switch (normalizedRole.value) {
    case 'admin':       return '/admin'
    // role "Coordinator" = quản lý kho, KHÔNG phải trang /coordinator
    // (đó là "Điều phối viên" phân công TNV, chỉ dành cho Admin)
    case 'coordinator': return '/warehouses'
    case 'volunteer':   return '/volunteer'
    case 'requester':   return '/requester'
    // Organization: chưa có khu riêng trên FE → tạm về home
    default:            return '/home'
  }
})

const isRequester = computed(() => normalizedRole.value === 'requester')

/** Nút khẩn cấp: requester đã login → mở thẳng modal tạo yêu cầu */
const emergencyTo = { path: '/requester/my-requests', query: { create: 'true' } }

// ── Quy trình 4 bước ─────────────────────────────────────────
const steps = [
  {
    title: 'Gửi yêu cầu',
    desc: 'Người dân mô tả tình trạng, vị trí và nhu cầu cần hỗ trợ chỉ trong 2 phút.',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
  },
  {
    title: 'Hệ thống tiếp nhận',
    desc: 'Yêu cầu được xác minh và đưa vào điều phối theo mức độ khẩn cấp.',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  },
  {
    title: 'Tình nguyện viên hỗ trợ',
    desc: 'Tình nguyện viên phù hợp gần nhất được phân công mang vật tư đến tận nơi.',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    title: 'Hoàn thành & theo dõi',
    desc: 'Bạn nhận thông báo từng bước và xác nhận khi đã được hỗ trợ xong.',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 17 9"/></svg>`,
  },
]

// ── 3 vai trò ────────────────────────────────────────────────
const roles = [
  {
    title: 'Người cần hỗ trợ',
    desc: 'Gửi yêu cầu cứu trợ khẩn cấp về lương thực, nước sạch, thuốc men, nơi trú ẩn — theo dõi tiến độ theo thời gian thực.',
    cta: 'Gửi yêu cầu ngay',
    color: '#e11d48',
    bg: 'rgba(225,29,72,0.10)',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  },
  {
    title: 'Tình nguyện viên',
    desc: 'Đăng ký kỹ năng và khu vực hoạt động, nhận nhiệm vụ phù hợp và ghi dấu từng đóng góp của bạn cho cộng đồng.',
    cta: 'Đăng ký tình nguyện',
    color: '#276749',
    bg: 'rgba(39,103,73,0.10)',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
  {
    title: 'Điều phối & quản trị',
    desc: 'Duyệt yêu cầu, phân công tình nguyện viên, quản lý kho vật tư và giám sát toàn bộ hoạt động trên một màn hình.',
    cta: 'Tìm hiểu thêm',
    color: '#1a4f8d',
    bg: 'rgba(26,79,141,0.10)',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
]
</script>

<style scoped>
/* ── Hero ── */
.home-hero {
  background: linear-gradient(135deg, #1a3b5c 0%, #1a4f8d 60%, #e27d24 100%);
  padding: 80px 20px;
  text-align: center;
}
.hero-content { max-width: 640px; margin: 0 auto; }
.hero-title {
  font-size: 52px; font-weight: 900;
  margin: 0 0 8px; line-height: 1;
}
.text-navy  { color: #ffffff; }
.text-orange { color: #fbbf24; }
.hero-slogan { font-size: 17px; color: rgba(255,255,255,0.85); margin: 0 0 16px; font-style: italic; }
.hero-desc  { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 36px; }

.hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-emergency {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 28px; background: #e11d48; color: #fff;
  border-radius: 8px; font-weight: 700; font-size: 15px;
  text-decoration: none; transition: background 0.2s;
  box-shadow: 0 4px 14px rgba(225,29,72,0.35);
}
.btn-emergency:hover { background: #be123c; color: #fff; }
.btn-primary {
  display: inline-flex; align-items: center;
  padding: 13px 28px; background: #e27d24; color: #fff;
  border-radius: 8px; font-weight: 700; font-size: 15px;
  text-decoration: none; transition: background 0.2s;
}
.btn-primary:hover { background: #c46a18; color: #fff; }
.btn-ghost {
  display: inline-flex; align-items: center;
  padding: 13px 28px; border: 2px solid rgba(255,255,255,0.6); color: #fff;
  border-radius: 8px; font-weight: 600; font-size: 15px;
  text-decoration: none; transition: all 0.2s;
}
.btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
.hero-login-hint { margin-top: 18px; font-size: 13.5px; color: rgba(255,255,255,0.7); }
.hero-login-link { color: #fbbf24; font-weight: 700; text-decoration: none; }
.hero-login-link:hover { text-decoration: underline; }

/* ── Sections ── */
.section { padding: var(--space-10) 0 var(--space-6); }
.section-title {
  text-align: center; font-size: 26px; font-weight: 800;
  color: #1a3b5c; letter-spacing: -0.5px; margin: 0 0 6px;
}
.section-sub { text-align: center; font-size: 14px; color: #718096; margin: 0 0 32px; }

/* ── Steps ── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-5);
}
.step-card {
  position: relative;
  background: #fff; border-radius: 14px; padding: var(--space-6) var(--space-5);
  box-shadow: var(--shadow-md); text-align: center;
  border-top: 3px solid #e27d24;
}
.step-number {
  position: absolute; top: 12px; left: 14px;
  width: 24px; height: 24px; border-radius: 50%;
  background: #fff1eb; color: #e27d24;
  font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.step-icon {
  width: 52px; height: 52px; margin: 0 auto var(--space-3);
  border-radius: 14px; background: #fff7ed; color: #e27d24;
  display: flex; align-items: center; justify-content: center;
}
.step-title { font-size: 15.5px; font-weight: 700; color: #1a3b5c; margin-bottom: var(--space-2); }
.step-desc  { font-size: 13px; color: #4a5568; line-height: 1.6; margin: 0; }
.step-arrow {
  position: absolute; top: 50%; right: -16px; transform: translateY(-50%);
  color: #cbd5e1; z-index: 1;
}

/* ── Role cards ── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
}
.feature-card {
  background: #fff; border-radius: 14px; padding: var(--space-6);
  box-shadow: var(--shadow-md); text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;
}
.feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.feature-icon {
  width: 52px; height: 52px; margin: 0 auto var(--space-3);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.feature-title { font-size: 17px; font-weight: 700; color: #1a3b5c; margin-bottom: var(--space-2); }
.feature-desc  { font-size: 14px; color: #4a5568; line-height: 1.6; flex: 1; }
.feature-link {
  display: inline-block; margin-top: var(--space-3);
  font-size: 13.5px; font-weight: 700; text-decoration: none;
}
.feature-link:hover { text-decoration: underline; }

/* ── Hotline band ── */
.hotline-band {
  background: linear-gradient(135deg, #ffe4e6 0%, #ffedd5 100%);
  padding: 32px 20px;
  margin-top: var(--space-6);
}
.hotline-inner {
  max-width: 900px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
}
.hotline-label { font-size: 16px; font-weight: 800; color: #9f1239; margin: 0 0 4px; }
.hotline-sub   { font-size: 13px; color: #881337; margin: 0; }
.hotline-contacts { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.hotline-phone {
  display: inline-flex; align-items: center; gap: 8px;
  background: #e11d48; color: #fff; text-decoration: none;
  padding: 12px 22px; border-radius: 99px;
  font-size: 17px; font-weight: 800; letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(225,29,72,0.3); transition: background 0.2s;
}
.hotline-phone:hover { background: #be123c; color: #fff; }
.hotline-email { font-size: 14px; font-weight: 600; color: #9f1239; text-decoration: none; }
.hotline-email:hover { text-decoration: underline; }

.btn-contact-page {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 22px;
  background: #1a4f8d;
  color: #fff;
  border-radius: 99px;
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-contact-page:hover {
  background: #123766;
  color: #fff;
}

/* ── About Home Banner ── */
.about-home-banner {
  margin: var(--space-8) 0;
}
.about-home-card {
  background: linear-gradient(135deg, #1a3b5c 0%, #1a4f8d 100%);
  border-radius: 20px;
  padding: 40px;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 36px;
  align-items: center;
  box-shadow: var(--shadow-lg);
}
.badge-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
}
.about-home-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.3;
}
.about-home-desc {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin-bottom: 24px;
}
.btn-about-link {
  display: inline-block;
  padding: 10px 22px;
  background: #e27d24;
  color: #fff;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-about-link:hover {
  background: #c46a18;
  color: #fff;
}

.about-home-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.08);
  padding: 24px;
  border-radius: 14px;
  backdrop-filter: blur(4px);
}
.home-stat-item {
  display: flex;
  flex-direction: column;
}
.home-stat-item .num {
  font-size: 28px;
  font-weight: 900;
  color: #fbbf24;
  line-height: 1;
}
.home-stat-item .lbl {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4px;
}

/* ── Guide Cards Grid ── */
.guide-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.guide-quick-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-soft);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}
.guide-quick-card:hover {
  transform: translateY(-4px);
}
.guide-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.bg-rose { background: #ffe4e6; }
.bg-green { background: #f0fff4; }
.bg-blue { background: #ebf8ff; }

.guide-quick-card h4 {
  font-size: 16.5px;
  font-weight: 700;
  color: #1a3b5c;
  margin-bottom: 8px;
}
.guide-quick-card p {
  font-size: 13.5px;
  color: #718096;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 16px;
}
.guide-card-link {
  font-size: 13.5px;
  font-weight: 700;
  color: #1a4f8d;
  text-decoration: none;
}
.guide-card-link:hover {
  text-decoration: underline;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .step-arrow { display: none; }
  .about-home-card { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .hero-title { font-size: 40px; }
  .home-hero { padding: 56px 16px; }
  .hotline-inner { flex-direction: column; text-align: center; }
  .about-home-card { padding: 24px; }
}
</style>