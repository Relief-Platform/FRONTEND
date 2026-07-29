<template>
  <AppLayout>
    <div class="about-page">
      <!-- ══════════ HERO ══════════ -->
      <section class="about-hero">
        <div class="hero-container">
          <span class="hero-badge">Về ReliefConnect</span>
          <h1 class="hero-title">Sứ mệnh gắn kết – Cứu trợ kịp thời</h1>
          <p class="hero-subtitle">
            Nền tảng công nghệ nhân đạo kết nối trực tiếp Người cần cứu trợ, Tình nguyện viên 
            và Đội ngũ Điều phối nhằm nâng cao hiệu quả cứu trợ thiên tai tại Việt Nam.
          </p>
        </div>
      </section>

      <div class="page-container">
        <!-- ══════════ CON SỐ ẤN TƯỢNG ══════════ -->
        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card" v-for="s in stats" :key="s.label">
              <div class="stat-number">{{ s.value }}</div>
              <div class="stat-label">{{ s.label }}</div>
              <div class="stat-desc">{{ s.desc }}</div>
            </div>
          </div>
        </section>

        <!-- ══════════ SỨ MỆNH & TẦM NHÌN ══════════ -->
        <section class="mission-section">
          <div class="grid-2">
            <div class="mission-card">
              <div class="card-icon bg-blue">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Sứ mệnh của chúng tôi</h3>
              <p>
                Rút ngắn tối đa thời gian từ khi người dân gửi yêu cầu cứu trợ cho đến khi vật tư 
                và tình nguyện viên đến tận tay họ. Sử dụng công nghệ minh bạch để không ai bị bỏ lại phía sau.
              </p>
            </div>

            <div class="mission-card">
              <div class="card-icon bg-orange">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3>Tầm nhìn phát triển</h3>
              <p>
                Trở thành nền tảng số hóa quản lý cứu trợ thiên tai toàn diện hàng đầu, 
                được các tổ chức từ thiện, tình nguyện viên và chính quyền địa phương tin tưởng ứng dụng.
              </p>
            </div>
          </div>
        </section>

        <!-- ══════════ GIÁ TRỊ CỐT LÕI ══════════ -->
        <section class="values-section">
          <h2 class="section-title text-center">Giá trị cốt lõi</h2>
          <p class="section-sub text-center">4 trụ cột định hình mọi hoạt động của ReliefConnect</p>

          <div class="values-grid">
            <div class="value-card" v-for="v in coreValues" :key="v.title">
              <div class="value-icon" v-html="v.icon" />
              <h4>{{ v.title }}</h4>
              <p>{{ v.desc }}</p>
            </div>
          </div>
        </section>

        <!-- ══════════ CÂU CHUYỆN SÁNG LẬP ══════════ -->
        <section class="story-section">
          <div class="story-content">
            <div class="story-text">
              <h2>Tại sao ReliefConnect ra đời?</h2>
              <p>
                Trong các đợt thiên tai, lũ lụt miền Trung hay thiên tai khẩn cấp, hàng ngàn cuộc gọi 
                cứu trợ bị trôi mất, thông tin cứu trợ thiếu tập trung khiến nơi thì dư thừa vật tư, 
                nơi lại hoàn toàn cô lập.
              </p>
              <p>
                ReliefConnect được xây dựng nhằm giải quyết bài toán điều phối cứu trợ bằng bản đồ số, 
                quản lý kho vật tư minh bạch và quy trình kết nối tình nguyện viên thông minh theo thời gian thực.
              </p>
              <div class="story-cta">
                <router-link to="/register" class="btn-primary">Tham gia cùng chúng tôi</router-link>
                <router-link to="/contact" class="btn-outline">Liên hệ hợp tác</router-link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'

const stats = [
  { value: '10,000+', label: 'Yêu cầu hỗ trợ', desc: 'Đã được tiếp nhận & xác minh' },
  { value: '5,000+', label: 'Tình nguyện viên', desc: 'Sẵn sàng ứng phó khẩn cấp' },
  { value: '120+', label: 'Điểm kho vật tư', desc: 'Phân bố trên toàn quốc' },
  { value: '98%', label: 'Cứu trợ thành công', desc: 'Tỷ lệ ứng cứu hoàn thành' },
]

const coreValues = [
  {
    title: 'Minh bạch tuyệt đối',
    desc: 'Mọi yêu cầu, vật tư trong kho và trạng thái phân công được công khai rõ ràng, theo dõi thời gian thực.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a4f8d" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    title: 'Tốc độ & Kịp thời',
    desc: 'Tối ưu hóa quy trình duyệt và điều hướng tình nguyện viên gần nhất đến vị trí cần giúp đỡ.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e27d24" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
  {
    title: 'Kết nối mạng lưới',
    desc: 'Liên kết chặt chẽ giữa người dân, tình nguyện viên, quản lý kho và các đơn vị cứu trợ.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#276749" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    title: 'Nhân ái & Tôn trọng',
    desc: 'Đặt sự an toàn, phẩm giá và nhu cầu thiết yếu của người gặp khó khăn lên hàng đầu.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
]
</script>

<style scoped>
.about-hero {
  background: linear-gradient(135deg, #1a3b5c 0%, #1a4f8d 60%, #e27d24 100%);
  color: #fff;
  padding: 72px 20px;
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
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 16px;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.7;
}

/* Stats */
.stats-section {
  margin-top: -40px;
  margin-bottom: 48px;
  position: relative;
  z-index: 10;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.stat-card {
  background: #fff;
  padding: 24px 20px;
  border-radius: 14px;
  box-shadow: var(--shadow-md);
  text-align: center;
  border: 1px solid var(--color-border-soft);
}
.stat-number {
  font-size: 32px;
  font-weight: 900;
  color: #1a4f8d;
}
.stat-label {
  font-size: 15px;
  font-weight: 700;
  color: #1a3b5c;
  margin: 4px 0;
}
.stat-desc {
  font-size: 12px;
  color: #718096;
}

/* Mission */
.mission-section {
  margin-bottom: 56px;
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
.mission-card {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-soft);
}
.card-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.bg-blue { background: rgba(26, 79, 141, 0.1); color: #1a4f8d; }
.bg-orange { background: rgba(226, 125, 36, 0.1); color: #e27d24; }
.mission-card h3 {
  font-size: 20px;
  font-weight: 800;
  color: #1a3b5c;
  margin-bottom: 12px;
}
.mission-card p {
  font-size: 14.5px;
  color: #4a5568;
  line-height: 1.7;
}

/* Values */
.values-section {
  margin-bottom: 56px;
}
.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #1a3b5c;
}
.section-sub {
  font-size: 14px;
  color: #718096;
  margin-bottom: 32px;
}
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.value-card {
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-soft);
  text-align: center;
  transition: transform 0.2s;
}
.value-card:hover {
  transform: translateY(-4px);
}
.value-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.value-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: #1a3b5c;
  margin-bottom: 8px;
}
.value-card p {
  font-size: 13px;
  color: #718096;
  line-height: 1.6;
}

/* Story */
.story-section {
  background: linear-gradient(135deg, #1a3b5c 0%, #0f2540 100%);
  color: #fff;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
}
.story-text h2 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 16px;
}
.story-text p {
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.7;
  margin-bottom: 16px;
}
.story-cta {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.btn-primary {
  padding: 12px 24px;
  background: #e27d24;
  color: #fff;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
}
.btn-primary:hover { background: #c46a18; }
.btn-outline {
  padding: 12px 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
}
.btn-outline:hover { background: rgba(255, 255, 255, 0.1); }

@media (max-width: 768px) {
  .hero-title { font-size: 30px; }
  .story-section { padding: 24px; }
}
</style>
