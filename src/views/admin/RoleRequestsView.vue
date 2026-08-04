<template>
  <AdminLayout>
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ $t('roleRequests.admin_title') }}</h1>
          <p class="page-sub">{{ $t('roleRequests.admin_sub') }}</p>
        </div>
      </div>

      <div class="card">
        <div v-if="isLoading" class="empty-state">{{ $t('common.loading') }}</div>
        <div v-else-if="pendingRequests.length === 0" class="empty-state">{{ $t('roleRequests.no_pending') }}</div>

        <table v-else class="rr-table">
          <thead>
            <tr>
              <th>{{ $t('roleRequests.col_user') }}</th>
              <th>{{ $t('roleRequests.col_current_role') }}</th>
              <th>{{ $t('roleRequests.col_requested_role') }}</th>
              <th>{{ $t('roleRequests.col_reason') }}</th>
              <th>{{ $t('donations.col_created') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in pendingRequests" :key="r.id">
              <td>
                <p class="font-semibold">{{ r.userFullName }}</p>
                <p class="text-muted">{{ r.userEmail }}</p>
              </td>
              <td>{{ r.currentRoleName }}</td>
              <td class="font-semibold">{{ r.requestedRoleName }}</td>
              <td class="reason-cell">{{ r.reason }}</td>
              <td class="text-muted">{{ formatDateTimeVI(r.createdAt) }}</td>
              <td class="actions-cell">
                <button class="action-btn action-btn--approve" :disabled="processingId === r.id" @click="handleApprove(r)">{{ $t('donations.btn_approve') }}</button>
                <button class="action-btn action-btn--reject" :disabled="processingId === r.id" @click="openRejectModal(r)">{{ $t('donations.btn_reject') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="listError" class="error-text">{{ listError }}</p>
      </div>

      <!-- ══════════ MODAL: TỪ CHỐI ══════════ -->
      <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
        <div class="modal-box modal-box--sm" v-if="rejectTarget">
          <div class="modal-header">
            <h3>{{ $t('roleRequests.reject_modal_title') }}</h3>
            <button class="modal-close" @click="closeRejectModal">✕</button>
          </div>
          <div class="modal-body">
            <p class="modal-desc">{{ rejectTarget.userFullName }} → {{ rejectTarget.requestedRoleName }}</p>
            <div class="form-group">
              <label>{{ $t('donations.reject_reason_label') }} <span class="required">*</span></label>
              <textarea v-model="rejectNote" rows="3" :placeholder="$t('donations.reject_reason_placeholder')" />
            </div>
            <p v-if="rejectError" class="error-text">{{ rejectError }}</p>
            <div class="modal-actions">
              <button type="button" class="btn-outline" @click="closeRejectModal">{{ $t('common.cancel') }}</button>
              <button type="button" class="btn-danger" :disabled="isRejecting" @click="handleReject">
                {{ isRejecting ? $t('donations.processing') : $t('donations.btn_confirm_reject') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  type RoleUpgradeRequest,
} from '@/features/role-requests/role-requests.api'
import { formatDateTimeVI } from '@/features/requests/requests.helpers'

const { t } = useI18n()

const pendingRequests = ref<RoleUpgradeRequest[]>([])
const isLoading = ref(true)
const listError = ref('')
const processingId = ref<string | null>(null)

async function loadPending() {
  isLoading.value = true
  listError.value = ''
  try {
    const result = await getRoleRequests('Pending', 1, 100)
    pendingRequests.value = result.items
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
onMounted(loadPending)

async function handleApprove(r: RoleUpgradeRequest) {
  processingId.value = r.id
  listError.value = ''
  try {
    await approveRoleRequest(r.id)
    await loadPending()
  } catch (e: unknown) {
    listError.value = e instanceof Error ? e.message : t('donations.approve_failed')
  } finally {
    processingId.value = null
  }
}

// ── Reject modal ─────────────────────────────────────────────
const showRejectModal = ref(false)
const rejectTarget = ref<RoleUpgradeRequest | null>(null)
const rejectNote = ref('')
const isRejecting = ref(false)
const rejectError = ref('')

function openRejectModal(r: RoleUpgradeRequest) {
  rejectTarget.value = r
  rejectNote.value = ''
  rejectError.value = ''
  showRejectModal.value = true
}
function closeRejectModal() {
  showRejectModal.value = false
  rejectTarget.value = null
}

async function handleReject() {
  if (!rejectTarget.value) return
  if (!rejectNote.value.trim()) {
    rejectError.value = t('donations.reject_reason_required')
    return
  }
  isRejecting.value = true
  rejectError.value = ''
  try {
    await rejectRoleRequest(rejectTarget.value.id, rejectNote.value.trim())
    showRejectModal.value = false
    await loadPending()
  } catch (e: unknown) {
    rejectError.value = e instanceof Error ? e.message : t('donations.reject_failed')
  } finally {
    isRejecting.value = false
  }
}
</script>

<style scoped>
.page-container { max-width: 1100px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; margin: 0 0 4px 0; }
.page-sub { font-size: 13.5px; color: #718096; margin: 0; }

.card { background: #fff; border-radius: 16px; padding: 22px; border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.empty-state { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }

.rr-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.rr-table th { text-align: left; font-size: 11.5px; text-transform: uppercase; color: #94a3b8; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
.rr-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
.font-semibold { font-weight: 600; color: #1e293b; }
.text-muted { color: #94a3b8; font-size: 12px; }
.reason-cell { max-width: 260px; color: #475569; }

.actions-cell { display: flex; gap: 8px; }
.action-btn { padding: 6px 14px; border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn--approve { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
.action-btn--approve:hover:not(:disabled) { background: #d1fae5; }
.action-btn--reject { background: #fef2f2; border-color: #fca5a5; color: #991b1b; }
.action-btn--reject:hover:not(:disabled) { background: #fee2e2; }

/* ── Modal ─────────────────────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000; }
.modal-box { background: #fff; border-radius: 14px; width: 100%; max-width: 640px; max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
.modal-box--sm { max-width: 460px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: #fff; z-index: 1; }
.modal-header h3 { margin: 0; font-size: 17px; font-weight: 700; color: #0f172a; }
.modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b; }
.modal-close:hover { color: #0f172a; }
.modal-body { padding: 20px 24px; }
.modal-desc { font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 16px 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }

.form-group { margin-bottom: 16px; }
label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.required { color: #e11d48; }
textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; box-sizing: border-box; resize: vertical;
}
textarea:focus { outline: none; border-color: #3b82f6; }

.error-text { color: #e53e3e; font-size: 12.5px; margin: 8px 0 0 0; }

.btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #475569; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; }
.btn-outline:hover { background: #f8fafc; }
.btn-danger { background: #991b1b; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-danger:hover { background: #7f1d1d; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 700px) {
  .rr-table { display: block; overflow-x: auto; }
}
</style>
