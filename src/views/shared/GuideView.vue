<template>
  <AppLayout>
    <div class="guide-page">
      <!-- ══════════ HERO & SEARCH BANNER ══════════ -->
      <section class="guide-hero">
        <div class="hero-container">
          <div class="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Trung tâm trợ giúp & Cẩm nang ReliefConnect
          </div>
          <h1 class="hero-title">Hướng Dẫn Sử Dụng Nền Tảng</h1>
          <p class="hero-subtitle">
            Hướng dẫn từng bước trực quan cho Người cần hỗ trợ, Tình nguyện viên và Đội ngũ Điều phối cứu trợ.
          </p>

          <!-- Search Box -->
          <div class="hero-search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              v-model="searchQuery"
              type="text"
              class="hero-search-input"
              placeholder="Nhập từ khóa tìm kiếm (ví dụ: tạo yêu cầu, tình nguyện viên, kho vật tư, hotline...)"
            />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
          </div>

          <!-- Quick search tags -->
          <div class="quick-tags">
            <span class="tag-label">Gợi ý tìm kiếm:</span>
            <button
              v-for="tag in quickTags"
              :key="tag"
              class="tag-chip"
              @click="searchQuery = tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </section>

      <div class="page-container">
        <!-- ══════════ KHU VỰC VAI TRÒ (ROLE TABS) ══════════ -->
        <section class="roles-section">
          <div class="section-header text-center">
            <h2 class="section-title">Bạn muốn xem hướng dẫn cho vai trò nào?</h2>
            <p class="section-sub">Chọn vai trò để xem quy trình 4 bước chi tiết và mẹo sử dụng hiệu quả</p>
          </div>

          <div class="role-tabs">
            <button
              v-for="t in tabs"
              :key="t.id"
              class="tab-card"
              :class="{ active: activeTab === t.id }"
              :style="{ '--active-color': t.color }"
              @click="activeTab = t.id"
            >
              <div class="tab-icon-wrapper" :style="{ background: t.bg, color: t.color }">
                <span v-html="t.icon" />
              </div>
              <div class="tab-meta">
                <span class="tab-title">{{ t.label }}</span>
                <span class="tab-subtitle">{{ t.subtitle }}</span>
              </div>
              <span v-if="activeTab === t.id" class="active-indicator" :style="{ background: t.color }" />
            </button>
          </div>

          <!-- ══════════ NỘI DUNG CHI TIẾT TỪNG VAI TRÒ ══════════ -->
          <Transition name="fade-slide" mode="out-in">
            <!-- 1. Người cần hỗ trợ -->
            <div v-if="activeTab === 'requester'" key="requester" class="guide-panel panel-requester">
              <div class="panel-header">
                <div class="panel-badge bg-rose-subtle">
                  <span>🚨 Dành cho Người dân / Hộ gia đình cần ứng cứu</span>
                </div>
                <h3>Quy trình 4 bước gửi & nhận cứu trợ</h3>
                <p>Thao tác đơn giản, nhận hỗ trợ nhanh chóng ngay cả khi tín hiệu mạng yếu.</p>
              </div>

              <div class="timeline-steps">
                <div class="timeline-step">
                  <div class="step-badge step-rose">Bước 1</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-rose-subtle text-rose">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                      </span>
                      <h4>Tạo tài khoản hoặc Gửi yêu cầu nhanh</h4>
                    </div>
                    <p>
                      Đăng ký tài khoản với Số điện thoại & Họ tên. 
                      Nếu trong tình huống khẩn cấp, bạn có thể gọi hotline <strong>1900 1234</strong> để được hỗ trợ nhập liệu giúp.
                    </p>
                    <div class="step-tip">
                      💡 <strong>Mẹo nhỏ:</strong> Cho phép trình duyệt truy cập Vị trí GPS để hệ thống tự động xác định địa chỉ cứu hộ chính xác nhất.
                    </div>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-rose">Bước 2</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-orange-subtle text-orange">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </span>
                      <h4>Điền nhu cầu vật tư & Mức độ ưu tiên</h4>
                    </div>
                    <p>
                      Chọn các hạng mục cần hỗ trợ (Lương thực, Nước uống, Thuốc men, Nơi trú ẩn hay Di tản). 
                      Đánh dấu mức độ khẩn cấp (Nguy hiểm tính mạng / Cần gấp trong ngày / Bình thường).
                    </p>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-rose">Bước 3</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-blue-subtle text-blue">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </span>
                      <h4>Theo dõi tiến độ tiếp nhận & Phân công</h4>
                    </div>
                    <p>Trạng thái yêu cầu được cập nhật theo thời gian thực trên màn hình <strong>"Yêu cầu của tôi"</strong>:</p>
                    <div class="status-pills">
                      <span class="pill status-pending">Chờ tiếp nhận</span> ➔ 
                      <span class="pill status-accepted">Đã duyệt</span> ➔ 
                      <span class="pill status-delivering">Đang cứu trợ</span> ➔ 
                      <span class="pill status-done">Hoàn thành</span>
                    </div>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-rose">Bước 4</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-green-subtle text-green">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </span>
                      <h4>Xác nhận đã nhận cứu trợ</h4>
                    </div>
                    <p>Khi Tình nguyện viên bàn giao nhu yếu phẩm, bấm nút <strong>"Xác nhận hoàn thành"</strong> để hoàn tất quy trình và gửi lời nhắn tới tình nguyện viên.</p>
                    <div class="step-actions">
                      <router-link to="/register" class="action-btn btn-rose">Gửi yêu cầu ngay →</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Tình nguyện viên -->
            <div v-else-if="activeTab === 'volunteer'" key="volunteer" class="guide-panel panel-volunteer">
              <div class="panel-header">
                <div class="panel-badge bg-green-subtle">
                  <span>💚 Dành cho Tình nguyện viên & Nhóm cứu hộ</span>
                </div>
                <h3>Hướng dẫn tham gia cứu trợ cho Tình nguyện viên</h3>
                <p>Cập nhật kỹ năng, sẵn sàng ứng phó và mang nguồn lực cứu trợ tới từng hộ dân.</p>
              </div>

              <div class="timeline-steps">
                <div class="timeline-step">
                  <div class="step-badge step-green">Bước 1</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-green-subtle text-green">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </span>
                      <h4>Đăng ký Kỹ năng & Vùng hoạt động</h4>
                    </div>
                    <p>
                      Đăng nhập tài khoản TNV, truy cập <strong>"Hồ sơ cá nhân"</strong> → chọn các kỹ năng chuyên môn (lái thuyền, y tế sơ cấp cứu, bốc xếp vật tư, lái xe cứu thương) 
                      và bán kính vùng hoạt động.
                    </p>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-green">Bước 2</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-blue-subtle text-blue">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      </span>
                      <h4>Nhận thông báo Phân công Nhiệm vụ</h4>
                    </div>
                    <p>
                      Khi Ban điều phối phân công nhiệm vụ phù hợp với vị trí của bạn, bạn sẽ nhận được <strong>Thông báo khẩn</strong>. 
                      Bạn có thể chọn <em>"Chấp nhận nhiệm vụ"</em> hoặc <em>"Tạm từ chối"</em> nếu bận đột xuất.
                    </p>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-green">Bước 3</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-orange-subtle text-orange">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      </span>
                      <h4>Nhận hàng từ Kho & Di chuyển tới điểm hỗ trợ</h4>
                    </div>
                    <p>
                      Đến điểm Kho cứu trợ được chỉ định để xuất nhu yếu phẩm, mở bản đồ chỉ đường trên trang nhiệm vụ và di chuyển tới điểm của người cần hỗ trợ.
                    </p>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-green">Bước 4</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-green-subtle text-green">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </span>
                      <h4>Cập nhật Hoàn thành Nhiệm vụ</h4>
                    </div>
                    <p>
                      Xác nhận đã bàn giao hàng hóa cho người dân và ghi lại chú thích nếu có sự cố để Ban điều phối nắm tình hình.
                    </p>
                    <div class="step-actions">
                      <router-link to="/register" class="action-btn btn-green">Đăng ký Tình nguyện viên →</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Điều phối viên & Admin -->
            <div v-else-if="activeTab === 'coordinator'" key="coordinator" class="guide-panel panel-coordinator">
              <div class="panel-header">
                <div class="panel-badge bg-blue-subtle">
                  <span>📊 Dành cho Điều phối viên & Quản lý Kho</span>
                </div>
                <h3>Hướng dẫn Vận hành & Điều phối Hệ thống</h3>
                <p>Tối ưu quy trình duyệt, phân công lực lượng và quản lý minh bạch kho vật tư.</p>
              </div>

              <div class="timeline-steps">
                <div class="timeline-step">
                  <div class="step-badge step-blue">Bước 1</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-blue-subtle text-blue">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      </span>
                      <h4>Giám sát Dashboard Điều phối Realtime</h4>
                    </div>
                    <p>Theo dõi luồng yêu cầu cứu trợ đổ về trên bản đồ nhiệt (Heatmap) và danh sách phân loại khẩn cấp.</p>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-blue">Bước 2</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-orange-subtle text-orange">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                      </span>
                      <h4>Kiểm soát Kho & Phân bổ Nhu yếu phẩm</h4>
                    </div>
                    <p>Khớp nối nhu cầu cứu trợ với số lượng tồn kho khả dụng tại các điểm kho lân cận để tránh thiếu hụt cục bộ.</p>
                  </div>
                </div>

                <div class="timeline-step">
                  <div class="step-badge step-blue">Bước 3</div>
                  <div class="step-content-card">
                    <div class="step-header">
                      <span class="step-icon-box bg-rose-subtle text-rose">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      </span>
                      <h4>Giao nhiệm vụ cho Tình nguyện viên phù hợp</h4>
                    </div>
                    <p>Chọn tình nguyện viên gần nhất có đúng kỹ năng cần thiết để gán nhiệm vụ trực tiếp.</p>
                    <div class="step-actions">
                      <router-link to="/login" class="action-btn btn-blue">Đăng nhập Điều phối →</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </section>

        <!-- ══════════ BỘ CÂU HỎI THƯỜNG GẶP FAQ ══════════ -->
        <section class="faq-section">
          <div class="faq-header text-center">
            <span class="faq-badge">Giải đáp thắc mắc</span>
            <h2 class="faq-title">Câu Hỏi Thường Gặp (FAQ)</h2>
            <p class="faq-sub">Các thắc mắc phổ biến nhất của người dùng khi sử dụng ReliefConnect</p>
          </div>

          <div class="faq-container">
            <div v-if="filteredFaqs.length === 0" class="faq-empty text-center">
              <p>🔍 Không tìm thấy câu hỏi nào phù hợp với từ khóa "<strong>{{ searchQuery }}</strong>".</p>
              <button class="reset-search-btn" @click="searchQuery = ''">Xem tất cả câu hỏi</button>
            </div>

            <div v-else class="faq-accordion-list">
              <div
                v-for="(f, i) in filteredFaqs"
                :key="f.question"
                class="faq-card"
                :class="{ open: openFaq === i }"
                @click="toggleFaq(i)"
              >
                <div class="faq-card-header">
                  <div class="faq-q-text">
                    <span class="faq-cat-tag" :class="f.tagClass">{{ f.category }}</span>
                    <h4>{{ f.question }}</h4>
                  </div>
                  <div class="faq-chevron" :class="{ rotated: openFaq === i }">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                <Transition name="expand">
                  <div v-if="openFaq === i" class="faq-card-body">
                    <p>{{ f.answer }}</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </section>

        <!-- ══════════ BẠN CẦN TRỢ GIÚP TRỰC TIẾP? ══════════ -->
        <section class="help-cta-banner">
          <div class="help-cta-inner">
            <div class="help-cta-text">
              <h3>Vẫn chưa tìm thấy câu trả lời bạn cần?</h3>
              <p>Tổng đài viên và đội ngũ hỗ trợ kỹ thuật của ReliefConnect luôn sẵn sàng 24/7.</p>
            </div>
            <div class="help-cta-buttons">
              <a href="tel:19001234" class="cta-btn btn-call">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Gọi Hotline 1900 1234
              </a>
              <router-link to="/contact" class="cta-btn btn-chat">
                Gửi tin nhắn hỗ trợ →
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const activeTab = ref('requester')
const openFaq = ref<number | null>(0)
const searchQuery = ref('')

const quickTags = ['gửi yêu cầu', 'tình nguyện viên', 'kho vật tư', 'hotline khẩn cấp', 'xác minh']

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

const tabs = [
  {
    id: 'requester',
    label: 'Người cần hỗ trợ',
    subtitle: 'Hướng dẫn tạo & theo dõi yêu cầu',
    color: '#e11d48',
    bg: 'rgba(225, 29, 72, 0.12)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  },
  {
    id: 'volunteer',
    label: 'Tình nguyện viên',
    subtitle: 'Quy trình nhận & ứng cứu nhiệm vụ',
    color: '#276749',
    bg: 'rgba(39, 103, 73, 0.12)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
  {
    id: 'coordinator',
    label: 'Điều phối & Quản trị',
    subtitle: 'Vận hành kho & phân công lực lượng',
    color: '#1a4f8d',
    bg: 'rgba(26, 79, 141, 0.12)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
]

const faqs = [
  {
    category: 'Chi phí',
    tagClass: 'tag-blue',
    question: 'Sử dụng hệ thống ReliefConnect có mất phí không?',
    answer: 'Hoàn toàn không. ReliefConnect là giải pháp công nghệ nhân đạo phi lợi nhuận phục vụ cộng đồng. Mọi tính năng dành cho Người dân, Tình nguyện viên và Tổ chức cứu trợ đều hoàn toàn miễn phí.',
  },
  {
    category: 'Kỹ thuật / Offline',
    tagClass: 'tag-rose',
    question: 'Nếu tôi ở vùng lũ bị mất Internet thì làm thế nào để gửi cứu trợ?',
    answer: 'Bạn có thể gọi trực tiếp tới Hotline cứu hộ 1900 1234 (miễn phí cước gọi). Tổng đài viên 24/7 của ReliefConnect sẽ tiếp nhận tọa độ, số điện thoại và nhu cầu của bạn để tạo yêu cầu cứu trợ khẩn trên hệ thống.',
  },
  {
    category: 'Xác minh',
    tagClass: 'tag-green',
    question: 'Tình nguyện viên có cần qua kiểm duyệt kỹ năng không?',
    answer: 'Có. Đội ngũ Điều phối viên sẽ kiểm tra thông tin liên lạc, phương tiện cứu hộ và các chứng chỉ kỹ năng (y tế, lặn cứu hộ, lái xuồng) trước khi giao các nhiệm vụ khẩn cấp nhằm đảm bảo an toàn tối đa.',
  },
  {
    category: 'Quản lý Kho',
    tagClass: 'tag-orange',
    question: 'Làm thế nào để các Quỹ từ thiện / Đội cứu trợ mở Kho hàng trên ReliefConnect?',
    answer: 'Vui lòng vào trang Liên hệ hoặc gửi thông tin tới email hotro@reliefconnect.vn. Ban quản trị hệ thống sẽ xác minh tổ chức và cấp tài khoản Quản lý Kho vật tư trong vòng 2 giờ.',
  },
  {
    category: 'Theo dõi',
    tagClass: 'tag-blue',
    question: 'Làm sao để biết khi nào Tình nguyện viên mang vật tư tới nơi?',
    answer: 'Sau khi yêu cầu được duyệt và phân công, hệ thống sẽ gửi tin nhắn SMS/Zalo kèm tên, số điện thoại và mã cứu trợ của Tình nguyện viên đang di chuyển tới địa điểm của bạn.',
  },
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) return faqs
  const q = searchQuery.value.toLowerCase()
  return faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
/* ── Hero & Search ── */
.guide-hero {
  background: linear-gradient(135deg, #0f2540 0%, #1a4f8d 55%, #e27d24 100%);
  color: #fff;
  padding: 64px 20px 80px;
  text-align: center;
}
.hero-container {
  max-width: 840px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.hero-title {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 14px;
  line-height: 1.35;
  letter-spacing: 0;
}
.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* Search Box */
.hero-search-box {
  position: relative;
  max-width: 640px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 18px;
  color: #1a4f8d;
  pointer-events: none;
}
.hero-search-input {
  width: 100%;
  padding: 16px 48px 16px 52px;
  border-radius: 14px;
  border: none;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s;
}
.hero-search-input:focus {
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(226, 125, 36, 0.5);
}
.clear-btn {
  position: absolute;
  right: 16px;
  background: #cbd5e1;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  color: #334155;
}

.quick-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
}
.tag-label {
  opacity: 0.8;
  font-weight: 500;
}
.tag-chip {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12.5px;
  cursor: pointer;
  transition: all 0.2s;
}
.tag-chip:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

/* ── Role Tabs ── */
.roles-section {
  margin-top: 48px;
  margin-bottom: 56px;
  position: relative;
  z-index: 10;
}
.section-header {
  margin-bottom: 32px;
}
.section-title {
  font-size: 26px;
  font-weight: 800;
  color: #1a3b5c;
  margin-bottom: 8px;
  line-height: 1.35;
}
.section-sub {
  font-size: 14.5px;
  color: #64748b;
}

.role-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 36px;
}
.tab-card {
  position: relative;
  background: #fff;
  border: 2px solid var(--color-border-soft);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
  text-align: left;
  overflow: hidden;
}
.tab-card:hover {
  border-color: var(--active-color);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.tab-card.active {
  border-color: var(--active-color);
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.active-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.tab-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tab-meta {
  display: flex;
  flex-direction: column;
}
.tab-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a3b5c;
}
.tab-subtitle {
  font-size: 12.5px;
  color: #64748b;
  margin-top: 2px;
}

/* ── Guide Panel ── */
.guide-panel {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-soft);
}
.panel-header {
  margin-bottom: 36px;
}
.panel-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
}
.panel-header h3 {
  font-size: 24px;
  font-weight: 800;
  color: #1a3b5c;
  margin-bottom: 6px;
}
.panel-header p {
  font-size: 14.5px;
  color: #64748b;
}

/* Timeline Steps */
.timeline-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
}
.timeline-step {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 20px;
  align-items: flex-start;
}
.step-badge {
  padding: 8px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.step-rose { background: #ffe4e6; color: #e11d48; }
.step-green { background: #f0fff4; color: #276749; }
.step-blue { background: #ebf8ff; color: #1a4f8d; }

.step-content-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}
.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.step-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-header h4 {
  font-size: 17px;
  font-weight: 800;
  color: #1a3b5c;
}
.step-content-card p {
  font-size: 14.5px;
  color: #334155;
  line-height: 1.6;
}

.step-tip {
  margin-top: 14px;
  padding: 10px 14px;
  background: #fff;
  border-left: 3px solid #e27d24;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.status-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  font-weight: 700;
}
.pill {
  padding: 4px 10px;
  border-radius: 6px;
}
.status-pending { background: #fef3c7; color: #d69e2e; }
.status-accepted { background: #e0f2fe; color: #0284c7; }
.status-delivering { background: #fae8ff; color: #a21caf; }
.status-done { background: #dcfce7; color: #15803d; }

.step-actions {
  margin-top: 16px;
}
.action-btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.btn-rose { background: #e11d48; color: #fff; }
.btn-green { background: #276749; color: #fff; }
.btn-blue { background: #1a4f8d; color: #fff; }
.action-btn:hover { opacity: 0.9; color: #fff; }

/* Subtles */
.bg-rose-subtle { background: #ffe4e6; }
.bg-orange-subtle { background: #ffedd5; }
.bg-blue-subtle { background: #ebf8ff; }
.bg-green-subtle { background: #f0fff4; }

.text-rose { color: #e11d48; }
.text-orange { color: #e27d24; }
.text-blue { color: #1a4f8d; }
.text-green { color: #276749; }

/* ── FAQ Section ── */
.faq-section {
  margin-bottom: 56px;
}
.faq-header {
  margin-bottom: 32px;
}
.faq-badge {
  display: inline-block;
  padding: 4px 14px;
  background: #e2e8f0;
  color: #334155;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}
.faq-title {
  font-size: 28px;
  font-weight: 800;
  color: #1a3b5c;
}
.faq-sub {
  font-size: 14.5px;
  color: #64748b;
}

.faq-container {
  max-width: 860px;
  margin: 0 auto;
}
.faq-accordion-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.faq-card {
  background: #fff;
  border: 1px solid var(--color-border-soft);
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}
.faq-card:hover {
  border-color: #cbd5e1;
  box-shadow: var(--shadow-md);
}
.faq-card.open {
  border-color: #1a4f8d;
}

.faq-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.faq-q-text {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.faq-q-text h4 {
  font-size: 16px;
  font-weight: 700;
  color: #1a3b5c;
}

.faq-cat-tag {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
}
.tag-blue { background: #ebf8ff; color: #1a4f8d; }
.tag-rose { background: #ffe4e6; color: #e11d48; }
.tag-green { background: #f0fff4; color: #276749; }
.tag-orange { background: #ffedd5; color: #e27d24; }

.faq-chevron {
  color: #94a3b8;
  transition: transform 0.25s ease;
}
.faq-chevron.rotated {
  transform: rotate(180deg);
  color: #1a4f8d;
}

.faq-card-body {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  font-size: 14.5px;
  color: #475569;
  line-height: 1.7;
}

.faq-empty {
  background: #fff;
  padding: 40px;
  border-radius: 14px;
  color: #64748b;
}
.reset-search-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #1a4f8d;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

/* ── Help CTA ── */
.help-cta-banner {
  background: linear-gradient(135deg, #1a3b5c 0%, #0f2540 100%);
  color: #fff;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 48px;
}
.help-cta-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.help-cta-text h3 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.help-cta-text p {
  font-size: 14.5px;
  opacity: 0.85;
}

.help-cta-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14.5px;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-call { background: #e11d48; color: #fff; }
.btn-call:hover { background: #be123c; color: #fff; }
.btn-chat { background: #e27d24; color: #fff; }
.btn-chat:hover { background: #c46a18; color: #fff; }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.expand-enter-active, .expand-leave-active { transition: all 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) {
  .hero-title { font-size: 30px; }
  .timeline-step { grid-template-columns: 1fr; }
  .guide-panel { padding: 24px; }
  .help-cta-inner { flex-direction: column; text-align: center; }
  .help-cta-buttons { justify-content: center; }
}
</style>
