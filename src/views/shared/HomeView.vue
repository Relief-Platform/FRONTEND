<template>
  <AppLayout>
    <div class="home-hero">
      <!-- Hero section -->
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
          <router-link to="/login" class="btn-primary">Đăng nhập</router-link>
          <router-link to="/register" class="btn-ghost">Đăng ký miễn phí</router-link>
        </div>

        <!-- Shortcut cho user đã login -->
        <div v-else class="hero-cta">
          <router-link :to="dashboardRoute" class="btn-primary">
            Vào Dashboard →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Feature cards -->
    <div class="page-container">
      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.title">
          <span class="feature-icon">{{ f.icon }}</span>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
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

/** Điều hướng tới dashboard phù hợp với role */
const dashboardRoute = computed(() => {
  switch (auth.role) {
    case 'admin':       return '/admin'
    case 'coordinator': return '/coordinator'
    case 'volunteer':   return '/volunteer'
    case 'requester':   return '/requester'
    default:            return '/home'
  }
})

const features = [
  {
    icon: '🆘',
    title: 'Gửi yêu cầu hỗ trợ',
    desc: 'Người dân có thể gửi yêu cầu cứu trợ nhanh chóng trong tình huống khẩn cấp.',
  },
  {
    icon: '🙋',
    title: 'Đăng ký tình nguyện',
    desc: 'Tình nguyện viên đăng ký tham gia hỗ trợ theo khu vực và kỹ năng.',
  },
  {
    icon: '🗺️',
    title: 'Điều phối thông minh',
    desc: 'Hệ thống phân công và theo dõi nhiệm vụ theo thời gian thực.',
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
.hero-content { max-width: 600px; margin: 0 auto; }
.hero-title {
  font-size: 52px; font-weight: 900;
  margin: 0 0 8px; line-height: 1;
}
.text-navy  { color: #ffffff; }
.text-orange { color: #fbbf24; }
.hero-slogan { font-size: 17px; color: rgba(255,255,255,0.8); margin: 0 0 16px; font-style: italic; }
.hero-desc  { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 36px; }

.hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  padding: 13px 28px; background: #e27d24; color: #fff;
  border-radius: 8px; font-weight: 700; font-size: 15px;
  text-decoration: none; transition: background 0.2s;
}
.btn-primary:hover { background: #c46a18; color: #fff; }
.btn-ghost {
  padding: 13px 28px; border: 2px solid rgba(255,255,255,0.6); color: #fff;
  border-radius: 8px; font-weight: 600; font-size: 15px;
  text-decoration: none; transition: all 0.2s;
}
.btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* ── Features ── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
  padding: var(--space-10) 0;
}
.feature-card {
  background: #fff; border-radius: 14px; padding: var(--space-6);
  box-shadow: var(--shadow-md); text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.feature-icon { font-size: 40px; display: block; margin-bottom: var(--space-3); }
.feature-title { font-size: 17px; font-weight: 700; color: #1a3b5c; margin-bottom: var(--space-2); }
.feature-desc  { font-size: 14px; color: #4a5568; line-height: 1.6; }
</style>