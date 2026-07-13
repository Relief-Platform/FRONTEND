<template>
  <RequesterLayout>
    <div class="my-requests-page">

      <div class="page-header">
        <div>
          <h2>Yêu cầu của tôi</h2>
          <p class="subtitle">Danh sách tất cả yêu cầu cứu trợ bạn đã gửi</p>
        </div>
        <button class="btn-primary" @click="openCreateModal">
          + Tạo yêu cầu mới
        </button>
      </div>

      <!-- Bộ lọc trạng thái -->
      <div class="filter-bar">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          :class="['filter-tab', { active: activeFilter === tab.value }]"
          :style="activeFilter === tab.value ? tab.activeStyle : undefined"
          @click="activeFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Danh sách -->
      <div class="card">
        <div v-if="isLoading" class="empty-state">Đang tải...</div>
        <div v-else-if="filteredRequests.length === 0" class="empty-state">
          Không có yêu cầu nào phù hợp.
        </div>

        <div class="request-list" v-else>
          <div class="request-item" v-for="item in filteredRequests" :key="item.id">
            <div class="req-info">
              <div class="req-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <div>
                <h4>{{ item.title }}</h4>
                <span class="time">{{ formatDateTimeVI(item.createdAt) }}</span>
              </div>
            </div>
            <div class="req-actions">
              <span class="badge" :style="badgeStyle(item.status)">{{ STATUS_LABEL_VI[item.status] }}</span>
              <button class="btn-outline" @click="openDetailModal(item)">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════ MODAL: TẠO YÊU CẦU MỚI ══════════ -->
      <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
        <div class="modal-box">
          <div class="modal-header">
            <h3>Tạo yêu cầu cứu trợ mới</h3>
            <button class="modal-close" @click="closeCreateModal">✕</button>
          </div>

          <form class="modal-body" @submit.prevent="handleCreateSubmit">
            <div class="form-group">
              <label>Tiêu đề yêu cầu <span class="required">*</span></label>
              <input v-model="form.title" type="text" placeholder="VD: Cần hỗ trợ lương thực khẩn cấp..." required />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Mức độ khẩn cấp <span class="required">*</span></label>
                <select v-model.number="form.emergencyLevel">
                  <option :value="2">Trung bình</option>
                  <option :value="3">Cao</option>
                  <option :value="4">Khẩn cấp</option>
                </select>
              </div>
              <div class="form-group half">
                <label>Số người bị ảnh hưởng <span class="required">*</span></label>
                <input v-model.number="form.affectedPeople" type="number" min="1" required />
              </div>
            </div>

            <div class="form-group">
              <label>Địa chỉ cụ thể <span class="required">*</span></label>
              <input v-model="form.address" type="text" placeholder="Số nhà, thôn/xóm, phường/xã..." required />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label>Vĩ độ <span class="required">*</span></label>
                <input v-model.number="form.latitude" type="number" step="any" required />
              </div>
              <div class="form-group half">
                <label>Kinh độ <span class="required">*</span></label>
                <input v-model.number="form.longitude" type="number" step="any" required />
              </div>
            </div>
            <button type="button" class="btn-geo" @click="useCurrentLocation">📍 Dùng vị trí hiện tại</button>

            <div class="form-group">
              <label>Số điện thoại liên hệ <span class="required">*</span></label>
              <input v-model="form.contactPhone" type="tel" required />
            </div>

            <div class="form-group">
              <label>Mô tả tình trạng <span class="required">*</span></label>
              <textarea v-model="form.description" rows="3" required></textarea>
            </div>

            <div class="form-group">
              <label>Nhu cầu cần hỗ trợ</label>
              <div class="needs-grid">
                <label class="need-item"><input type="checkbox" v-model="form.needFood" /> Lương thực</label>
                <label class="need-item"><input type="checkbox" v-model="form.needWater" /> Nước sạch</label>
                <label class="need-item"><input type="checkbox" v-model="form.needMedicine" /> Thuốc men</label>
                <label class="need-item"><input type="checkbox" v-model="form.needBlanket" /> Chăn màn</label>
                <label class="need-item"><input type="checkbox" v-model="form.needShelter" /> Nơi trú ẩn</label>
              </div>
            </div>

            <p v-if="createError" class="error-text">{{ createError }}</p>

            <div class="modal-actions">
              <button type="button" class="btn-outline" @click="closeCreateModal">Hủy</button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ══════════ MODAL: XEM CHI TIẾT ══════════ -->
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
        <div class="modal-box" v-if="selectedRequest">
          <div class="modal-header">
            <h3>{{ selectedRequest.title }}</h3>
            <button class="modal-close" @click="closeDetailModal">✕</button>
          </div>
          <div class="modal-body detail-body">
            <span class="badge" :style="badgeStyle(selectedRequest.status)">
              {{ STATUS_LABEL_VI[selectedRequest.status] }}
            </span>

            <div class="detail-row"><strong>Địa chỉ:</strong> {{ selectedRequest.address }}</div>
            <div class="detail-row"><strong>Số người ảnh hưởng:</strong> {{ selectedRequest.affectedPeople }}</div>
            <div class="detail-row"><strong>SĐT liên hệ:</strong> {{ selectedRequest.contactPhone }}</div>
            <div class="detail-row"><strong>Ngày tạo:</strong> {{ formatDateTimeVI(selectedRequest.createdAt) }}</div>
            <div class="detail-row"><strong>Mô tả:</strong> {{ selectedRequest.description }}</div>
            <div class="detail-row">
              <strong>Nhu cầu:</strong>
              {{ needsSummary(selectedRequest) }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </RequesterLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RequesterLayout from '@/components/layout/RequesterLayout.vue'
import {
  createReliefRequest,
  getReliefRequests,
} from '@/features/requests/requests.api'
import {
  STATUS_LABEL_VI,
  STATUS_GROUP_MAP,
  STATUS_GROUP_COLOR,
  type CreateReliefRequestPayload,
  type ReliefRequestResponse,
} from '@/features/requests/requests.types'
import {
  badgeStyle,
  formatDateTimeVI,
  needsSummary,
} from '@/features/requests/requests.helpers'

const route = useRoute()
const router = useRouter()

// ── Danh sách yêu cầu ─────────────────────────────────────
const allRequests = ref<ReliefRequestResponse[]>([])
const isLoading = ref(false)

const loadRequests = async () => {
  isLoading.value = true
  allRequests.value = await getReliefRequests()
  isLoading.value = false
}

// Cho phép Dashboard mở thẳng modal tạo/chi tiết qua query (?create=true, ?id=...)
onMounted(async () => {
  await loadRequests()

  if (route.query.create === 'true') {
    openCreateModal()
  }

  const targetId = route.query.id as string | undefined
  if (targetId) {
    const found = allRequests.value.find((r) => r.id === targetId)
    if (found) openDetailModal(found)
  }

  if (route.query.create || route.query.id) {
    const { create, id, ...rest } = route.query
    router.replace({ query: rest })
  }
})

// ── Filter ────────────────────────────────────────────────
// Tab active đổi màu theo đúng nhóm trạng thái:
// đang xử lý = vàng, đã tiếp nhận = xanh dương, hoàn thành = xanh lá
const filterTabs = [
  { label: 'Tất cả', value: 'all', activeStyle: undefined },
  {
    label: 'Đang xử lý',
    value: 'processing',
    activeStyle: {
      background: STATUS_GROUP_COLOR.processing.bg,
      borderColor: STATUS_GROUP_COLOR.processing.color,
      color: STATUS_GROUP_COLOR.processing.color,
    },
  },
  {
    label: 'Đã tiếp nhận',
    value: 'received',
    activeStyle: {
      background: STATUS_GROUP_COLOR.received.bg,
      borderColor: STATUS_GROUP_COLOR.received.color,
      color: STATUS_GROUP_COLOR.received.color,
    },
  },
  {
    label: 'Đã hoàn thành',
    value: 'completed',
    activeStyle: {
      background: STATUS_GROUP_COLOR.completed.bg,
      borderColor: STATUS_GROUP_COLOR.completed.color,
      color: STATUS_GROUP_COLOR.completed.color,
    },
  },
]
const activeFilter = ref('all')

const filteredRequests = computed(() => {
  if (activeFilter.value === 'all') return allRequests.value
  return allRequests.value.filter((r) => STATUS_GROUP_MAP[r.status] === activeFilter.value)
})

// ── Modal: Tạo mới ────────────────────────────────────────
const showCreateModal = ref(false)
const isSubmitting = ref(false)
const createError = ref('')

const emptyForm = (): CreateReliefRequestPayload => ({
  title: '',
  description: '',
  address: '',
  latitude: 0,
  longitude: 0,
  emergencyLevel: 4,
  affectedPeople: 1,
  needFood: false,
  needWater: false,
  needMedicine: false,
  needBlanket: false,
  needShelter: false,
  contactPhone: '',
})

const form = ref<CreateReliefRequestPayload>(emptyForm())

const openCreateModal = () => {
  form.value = emptyForm()
  createError.value = ''
  showCreateModal.value = true
}
const closeCreateModal = () => { showCreateModal.value = false }

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Trình duyệt không hỗ trợ định vị.')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.value.latitude = pos.coords.latitude
      form.value.longitude = pos.coords.longitude
    },
    () => alert('Không thể lấy vị trí hiện tại. Vui lòng nhập tay.'),
  )
}

const handleCreateSubmit = async () => {
  createError.value = ''
  isSubmitting.value = true
  try {
    await createReliefRequest(form.value)
    closeCreateModal()
    await loadRequests()
  } catch (err) {
    createError.value = (err as Error).message || 'Gửi yêu cầu thất bại. Vui lòng thử lại!'
  } finally {
    isSubmitting.value = false
  }
}

// ── Modal: Xem chi tiết ───────────────────────────────────
const showDetailModal = ref(false)
const selectedRequest = ref<ReliefRequestResponse | null>(null)

const openDetailModal = (item: ReliefRequestResponse) => {
  selectedRequest.value = item
  showDetailModal.value = true
}
const closeDetailModal = () => { showDetailModal.value = false }
</script>

<style scoped>
.my-requests-page { max-width: 1000px; margin: 0 auto; }

.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-header h2 { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; margin: 0 0 4px 0; }
.subtitle { font-size: 13.5px; color: #718096; margin: 0; }

.btn-primary { background-color: #e11d48; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
.btn-primary:hover { background-color: #be123c; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.filter-bar { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-tab { background: #fff; border: 1px solid #e2e8f0; color: #475569; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
.filter-tab:hover { background: #f8fafc; }
.filter-tab.active { background: #fff1eb; border-color: #ea580c; color: #ea580c; font-weight: 600; }

.card { background: #ffffff; border-radius: 16px; padding: 22px; border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.empty-state { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }

.request-list { display: flex; flex-direction: column; gap: 16px; }
.request-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.request-item:last-child { border-bottom: none; padding-bottom: 0; }

.req-info { display: flex; align-items: center; gap: 16px; }
.req-icon { background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; }
.req-icon svg { width: 20px; height: 20px; color: #64748b; }
.req-info h4 { margin: 0 0 4px 0; font-size: 14px; color: #1e293b; font-weight: 600; }
.req-info .time { font-size: 12px; color: #64748b; }

.req-actions { display: flex; align-items: center; gap: 16px; }
.badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #475569; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
.btn-outline:hover { background: #fff; border-color: #ea580c; color: #ea580c; }

/* ── Modal ─────────────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 14px; width: 100%; max-width: 560px;
  max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.25);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: #fff; z-index: 1;
}
.modal-header h3 { margin: 0; font-size: 17px; font-weight: 700; color: #0f172a; }
.modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b; }
.modal-close:hover { color: #0f172a; }
.modal-body { padding: 20px 24px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }

.form-group { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.form-row .half { margin-bottom: 0; flex: 1; }
label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.required { color: #e11d48; }
input[type="text"], input[type="number"], input[type="tel"], select, textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; box-sizing: border-box;
}
input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6; }
textarea { resize: vertical; }
.btn-geo { background: none; border: none; color: #2563eb; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 0; margin: -8px 0 16px 0; }

.needs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 8px; }
.need-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; cursor: pointer; margin: 0; }
.need-item input { width: 15px; height: 15px; }

.error-text { color: #e53e3e; font-size: 12.5px; margin: 8px 0 0 0; }

.detail-body { display: flex; flex-direction: column; gap: 4px; }
.detail-row { font-size: 13.5px; color: #334155; padding: 6px 0; border-bottom: 1px solid #f8fafc; line-height: 1.5; }

@media (max-width: 600px) {
  .page-header { flex-direction: column; gap: 14px; }
  .request-item { flex-direction: column; align-items: flex-start; gap: 12px; }
  .req-actions { width: 100%; justify-content: space-between; }
  .form-row { flex-direction: column; gap: 16px; }
}
</style>