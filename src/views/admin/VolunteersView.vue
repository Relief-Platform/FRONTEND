<template>
  <AdminLayout>
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Quản lý tình nguyện viên</h1>
        <div class="stats-badge" v-if="pendingCount > 0">
          {{ pendingCount }} đơn đang chờ duyệt
        </div>
      </div>

      <!-- Toolbar -->
      <div class="volunteers-toolbar">
        <BaseInput
          id="search-volunteers"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên, email..."
          style="max-width: 340px"
        >
          <template #prefix>
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </template>
        </BaseInput>

        <select v-model="statusFilter" class="status-filter">
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">⏳ Chờ duyệt (Pending)</option>
          <option value="Approved">✓ Đã duyệt (Approved)</option>
        </select>
      </div>

      <!-- Main Content Card -->
      <BaseCard>
        <div v-if="isLoading" class="volunteers-loading">
          <BaseSpinner size="lg" class="spinner-dark" />
        </div>

        <div v-else-if="filteredVolunteers.length === 0" class="volunteers-empty">
          <p>Không tìm thấy hồ sơ tình nguyện viên nào.</p>
        </div>

        <table v-else class="volunteers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Kinh nghiệm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vol, idx) in filteredVolunteers" :key="vol.id">
              <td class="text-muted">{{ idx + 1 }}</td>
              <td class="font-semibold">{{ vol.fullName }}</td>
              <td>{{ vol.email }}</td>
              <td>{{ vol.phoneNumber || '—' }}</td>
              <td>{{ vol.experienceYears }} năm</td>
              <td>
                <span class="status-badge" :class="`status--${vol.status.toLowerCase()}`">
                  {{ vol.status === 'Pending' ? '⏳ Chờ duyệt' : '✓ Đã duyệt' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="action-btn action-btn--details" @click="openDetails(vol.id)">Chi tiết</button>
                <button
                  v-if="vol.status === 'Pending'"
                  class="action-btn action-btn--approve"
                  @click="handleApprove(vol)"
                >
                  Duyệt
                </button>
                <button
                  v-if="vol.status === 'Pending'"
                  class="action-btn action-btn--reject"
                  @click="handleReject(vol)"
                >
                  Từ chối
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </BaseCard>
    </div>

    <!-- Details Dialog -->
    <el-dialog
      v-model="isDetailsVisible"
      title="Chi tiết Hồ sơ Tình nguyện viên"
      width="600px"
      destroy-on-close
    >
      <div v-if="isDetailsLoading" class="details-loading">
        <BaseSpinner size="md" class="spinner-dark" />
        <p>Đang tải chi tiết hồ sơ...</p>
      </div>
      <div v-else-if="selectedVolunteer" class="details-container">
        <!-- User summary -->
        <div class="detail-section">
          <div class="user-avatar-placeholder">
            {{ selectedVolunteer.fullName.split(" ").slice(-1)[0][0] }}
          </div>
          <div class="user-meta-info">
            <h3 class="detail-name">{{ selectedVolunteer.fullName }}</h3>
            <p class="detail-email">{{ selectedVolunteer.email }}</p>
            <p class="detail-phone">{{ selectedVolunteer.phoneNumber || 'Không có số điện thoại' }}</p>
          </div>
        </div>

        <div class="divider" />

        <!-- Profile details -->
        <div class="detail-grid">
          <div class="grid-item">
            <span class="grid-label">Kinh nghiệm:</span>
            <span class="grid-value font-semibold">{{ selectedVolunteer.experienceYears }} năm</span>
          </div>
          <div class="grid-item">
            <span class="grid-label">Trạng thái:</span>
            <span class="status-badge" :class="`status--${selectedVolunteer.status.toLowerCase()}`">
              {{ selectedVolunteer.status === 'Pending' ? '⏳ Chờ duyệt' : '✓ Đã duyệt' }}
            </span>
          </div>
          <div class="grid-item span-full">
            <span class="grid-label">Địa chỉ:</span>
            <span class="grid-value">{{ selectedVolunteer.address }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-label">Vĩ độ (Lat):</span>
            <span class="grid-value text-muted">{{ selectedVolunteer.latitude }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-label">Kinh độ (Lng):</span>
            <span class="grid-value text-muted">{{ selectedVolunteer.longitude }}</span>
          </div>
        </div>

        <div class="divider" />

        <!-- Bio -->
        <div class="detail-block">
          <span class="block-label">Giới thiệu bản thân:</span>
          <p class="block-text">{{ selectedVolunteer.bio || 'Chưa cung cấp thông tin giới thiệu.' }}</p>
        </div>

        <div class="divider" />

        <!-- Skills -->
        <div class="detail-block">
          <span class="block-label">Kỹ năng đã đăng ký:</span>
          <div v-if="selectedVolunteer.skills && selectedVolunteer.skills.length > 0" class="skills-tags">
            <span
              v-for="(skill, sIdx) in selectedVolunteer.skills"
              :key="sIdx"
              class="skill-tag"
            >
              {{ typeof skill === 'object' ? (skill as any).name : skill }}
            </span>
          </div>
          <p v-else class="text-muted text-sm">Chưa đăng ký kỹ năng nào.</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer" v-if="selectedVolunteer">
          <el-button @click="isDetailsVisible = false">Đóng</el-button>
          <template v-if="selectedVolunteer.status === 'Pending'">
            <el-button
              type="danger"
              :loading="isActionPending"
              @click="handleReject(selectedVolunteer)"
            >
              Từ chối
            </el-button>
            <el-button
              type="primary"
              :loading="isActionPending"
              @click="handleApprove(selectedVolunteer)"
            >
              Phê duyệt
            </el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { useConfirm } from '@/composables/useConfirm'
import {
  getAdminVolunteers,
  getAdminVolunteerById,
  approveVolunteer,
  rejectVolunteer,
} from '@/features/volunteers/volunteers.api'
import type { AdminVolunteerSummary, VolunteerProfile } from '@/features/volunteers/volunteers.types'

const { confirm } = useConfirm()

// ── State ────────────────────────────────────────────────────
const volunteers = ref<AdminVolunteerSummary[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')

const isDetailsVisible = ref(false)
const isDetailsLoading = ref(false)
const selectedVolunteer = ref<VolunteerProfile | null>(null)
const isActionPending = ref(false)

// ── Load Data ────────────────────────────────────────────────
async function loadVolunteers(): Promise<void> {
  isLoading.value = true
  try {
    volunteers.value = await getAdminVolunteers()
  } catch (err) {
    ElMessage.error((err as Error).message || 'Không thể tải danh sách tình nguyện viên')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadVolunteers()
})

// ── Computed ──────────────────────────────────────────────────
const pendingCount = computed(() => {
  return volunteers.value.filter(v => v.status === 'Pending').length
})

const filteredVolunteers = computed(() => {
  return volunteers.value.filter(v => {
    // Filter by search query (name/email)
    const matchQuery =
      v.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Filter by status
    const matchStatus = statusFilter.value ? v.status === statusFilter.value : true

    return matchQuery && matchStatus
  })
})

// ── Actions ──────────────────────────────────────────────────
async function openDetails(volunteerId: string): Promise<void> {
  isDetailsVisible.value = true
  isDetailsLoading.value = true
  selectedVolunteer.value = null
  try {
    selectedVolunteer.value = await getAdminVolunteerById(volunteerId)
  } catch (err) {
    ElMessage.error((err as Error).message || 'Không thể tải chi tiết hồ sơ')
    isDetailsVisible.value = false
  } finally {
    isDetailsLoading.value = false
  }
}

async function handleApprove(vol: AdminVolunteerSummary | VolunteerProfile): Promise<void> {
  if (await confirm(`Bạn có chắc chắn muốn phê duyệt hồ sơ của ${vol.fullName}?`)) {
    isActionPending.value = true
    try {
      await approveVolunteer(vol.id)
      ElMessage.success(`Đã phê duyệt hồ sơ của ${vol.fullName}`)
      isDetailsVisible.value = false
      await loadVolunteers()
    } catch (err) {
      ElMessage.error((err as Error).message || 'Có lỗi xảy ra khi phê duyệt')
    } finally {
      isActionPending.value = false
    }
  }
}

async function handleReject(vol: AdminVolunteerSummary | VolunteerProfile): Promise<void> {
  if (await confirm(`Bạn có chắc chắn muốn từ chối hồ sơ của ${vol.fullName}?`)) {
    isActionPending.value = true
    try {
      await rejectVolunteer(vol.id)
      ElMessage.success(`Đã từ chối hồ sơ của ${vol.fullName}`)
      isDetailsVisible.value = false
      await loadVolunteers()
    } catch (err) {
      ElMessage.error((err as Error).message || 'Có lỗi xảy ra khi từ chối')
    } finally {
      isActionPending.value = false
    }
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a3b5c;
  margin: 0;
}

.stats-badge {
  background-color: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
}

.volunteers-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}

.status-filter {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  cursor: pointer;
}

.search-icon {
  color: var(--color-text-muted);
  margin: 0 8px;
  flex-shrink: 0;
}

/* Table styling */
.volunteers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.volunteers-table th {
  text-align: left;
  padding: 12px 14px;
  background: #f8fafc;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-border-soft);
}

.volunteers-table td {
  padding: 14px;
  border-bottom: 1px solid var(--color-border-soft);
  color: var(--color-text-primary);
}

.volunteers-table tbody tr:hover {
  background: #f8fafc;
}

.volunteers-table tbody tr:last-child td {
  border-bottom: none;
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
}

.status--pending {
  background-color: #fffbeb;
  color: #d97706;
}

.status--approved {
  background-color: #f0fdf4;
  color: #166534;
}

.status--rejected {
  background-color: #fef2f2;
  color: #991b1b;
}

/* Actions cell */
.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.action-btn--details {
  background-color: rgba(26, 79, 141, 0.08);
  color: var(--color-blue);
}

.action-btn--details:hover {
  background-color: rgba(26, 79, 141, 0.16);
}

.action-btn--approve {
  background-color: rgba(22, 101, 52, 0.08);
  color: #166534;
}

.action-btn--approve:hover {
  background-color: rgba(22, 101, 52, 0.16);
}

.action-btn--reject {
  background-color: rgba(153, 27, 27, 0.08);
  color: #991b1b;
}

.action-btn--reject:hover {
  background-color: rgba(153, 27, 27, 0.16);
}

/* Loading & Empty states */
.volunteers-loading,
.volunteers-empty,
.details-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-text-muted);
  gap: 12px;
}

/* Dialog details container */
.details-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #2d3748;
}

.detail-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a4f8d, #3b82f6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
}

.user-meta-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a3b5c;
  margin: 0;
}

.detail-email {
  font-size: 13.5px;
  color: var(--color-text-secondary);
  margin: 0;
}

.detail-phone {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.divider {
  height: 1px;
  background-color: #e2e8f0;
  margin: 4px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.span-full {
  grid-column: 1 / -1;
}

.grid-label {
  font-size: 12px;
  font-weight: 600;
  color: #718096;
}

.grid-value {
  font-size: 14.5px;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.block-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #4a5568;
}

.block-text {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #edf2f7;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.skill-tag {
  background-color: #eff6ff;
  color: #1e40af;
  border: 1.5px solid #bfdbfe;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
