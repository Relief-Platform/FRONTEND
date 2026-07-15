<template>
  <WarehouseLayout>
    <div class="inv-page">
      <div class="page-header">
        <div>
          <h2>Vật tư &amp; tồn kho</h2>
          <p class="subtitle">Nhập / xuất vật tư và theo dõi tồn kho theo từng kho</p>
        </div>
        <button class="btn-primary" :disabled="!selectedWarehouseId" @click="openCreateModal">
          + Thêm vật tư
        </button>
      </div>

      <!-- Chọn kho -->
      <div class="filter-bar">
        <label class="wh-select-label">Kho:</label>
        <select v-model="selectedWarehouseId" class="wh-select">
          <option value="" disabled>-- Chọn kho --</option>
          <option v-for="w in warehouseOptions" :key="w.id" :value="w.id">
            {{ w.name }}{{ w.isActive ? '' : ' (ngưng hoạt động)' }}
          </option>
        </select>
        <span v-if="lowStockCount > 0" class="low-stock-summary">
          ⚠️ {{ lowStockCount }} vật tư sắp hết
        </span>
      </div>

      <div class="card">
        <div v-if="!selectedWarehouseId" class="empty-state">Chọn kho để xem vật tư.</div>
        <div v-else-if="isLoading" class="empty-state">Đang tải...</div>
        <div v-else-if="loadError" class="empty-state error-state">{{ loadError }}</div>
        <div v-else-if="items.length === 0" class="empty-state">
          Kho này chưa có vật tư nào — bấm "+ Thêm vật tư" để tạo.
        </div>

        <table v-else class="inv-table">
          <thead>
            <tr>
              <th>Vật tư</th>
              <th>Đơn vị</th>
              <th class="col-num">Tồn kho</th>
              <th class="col-num">Ngưỡng cảnh báo</th>
              <th></th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" :class="{ 'row-low': item.isLowStock }">
              <td class="cell-name">{{ item.itemName }}</td>
              <td class="cell-muted">{{ item.unit }}</td>
              <td class="col-num cell-qty">{{ formatNumber(item.quantity) }}</td>
              <td class="col-num cell-muted">{{ formatNumber(item.minimumQuantity) }}</td>
              <td>
                <span v-if="item.isLowStock" class="badge badge--low">Sắp hết</span>
              </td>
              <td class="col-actions">
                <button class="btn-outline btn-in" @click="openStockModal(item, 'in')">+ Nhập</button>
                <button class="btn-outline btn-out" @click="openStockModal(item, 'out')">− Xuất</button>
                <button class="btn-outline" @click="openEditModal(item)">Sửa</button>
                <button class="btn-outline" @click="openHistoryModal(item)">Lịch sử</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination" v-if="totalPages > 1">
          <button class="btn-outline" :disabled="pageNumber <= 1" @click="changePage(pageNumber - 1)">← Trước</button>
          <span class="page-info">Trang {{ pageNumber }} / {{ totalPages }}</span>
          <button class="btn-outline" :disabled="pageNumber >= totalPages" @click="changePage(pageNumber + 1)">Sau →</button>
        </div>
      </div>

      <!-- ══════════ MODAL: TẠO / SỬA VẬT TƯ ══════════ -->
      <div v-if="showItemModal" class="modal-overlay" @click.self="closeItemModal">
        <div class="modal-box">
          <div class="modal-header">
            <h3>{{ editingId ? 'Sửa vật tư' : 'Thêm vật tư mới' }}</h3>
            <button class="modal-close" @click="closeItemModal">✕</button>
          </div>
          <form class="modal-body" @submit.prevent="handleItemSubmit">
            <div class="form-group">
              <label>Tên vật tư <span class="required">*</span></label>
              <input v-model="itemForm.itemName" type="text" placeholder="VD: Nước uống đóng chai" required />
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label>Đơn vị <span class="required">*</span></label>
                <input v-model="itemForm.unit" type="text" placeholder="thùng / chai / kg..." required />
              </div>
              <div class="form-group half">
                <label>Ngưỡng cảnh báo <span class="required">*</span></label>
                <input v-model.number="itemForm.minimumQuantity" type="number" min="0" step="any" required />
              </div>
            </div>

            <p v-if="!editingId" class="hint-text">
              💡 Tồn kho khởi tạo = 0. Sau khi tạo, dùng nút "+ Nhập" để đưa hàng vào kho.
            </p>

            <p v-if="itemFormError" class="error-text">{{ itemFormError }}</p>

            <div class="modal-actions">
              <button type="button" class="btn-outline" @click="closeItemModal">Hủy</button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Đang lưu...' : (editingId ? 'Lưu thay đổi' : 'Thêm vật tư') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ══════════ MODAL: NHẬP / XUẤT KHO ══════════ -->
      <div v-if="showStockModal" class="modal-overlay" @click.self="closeStockModal">
        <div class="modal-box" v-if="stockTarget">
          <div class="modal-header">
            <h3>{{ stockMode === 'in' ? 'Nhập kho' : 'Xuất kho' }}: {{ stockTarget.itemName }}</h3>
            <button class="modal-close" @click="closeStockModal">✕</button>
          </div>
          <form class="modal-body" @submit.prevent="handleStockSubmit">
            <p class="stock-current">
              Tồn hiện tại: <strong>{{ formatNumber(stockTarget.quantity) }} {{ stockTarget.unit }}</strong>
            </p>

            <div class="form-group">
              <label>Số lượng {{ stockMode === 'in' ? 'nhập' : 'xuất' }} <span class="required">*</span></label>
              <input v-model.number="stockForm.quantity" type="number" min="0.01" step="any" required autofocus />
            </div>
            <div class="form-group">
              <label>Số chứng từ</label>
              <input v-model="stockForm.referenceNo" type="text" placeholder="VD: PN-2026-001 (không bắt buộc)" />
            </div>
            <div class="form-group">
              <label>Ghi chú</label>
              <textarea v-model="stockForm.note" rows="2" placeholder="Không bắt buộc"></textarea>
            </div>

            <p v-if="stockError" class="error-text">{{ stockError }}</p>

            <div class="modal-actions">
              <button type="button" class="btn-outline" @click="closeStockModal">Hủy</button>
              <button
                type="submit"
                class="btn-primary"
                :class="{ 'btn-danger': stockMode === 'out' }"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Đang xử lý...' : (stockMode === 'in' ? 'Xác nhận nhập' : 'Xác nhận xuất') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ══════════ MODAL: LỊCH SỬ GIAO DỊCH ══════════ -->
      <div v-if="showHistoryModal" class="modal-overlay" @click.self="closeHistoryModal">
        <div class="modal-box" v-if="historyTarget">
          <div class="modal-header">
            <h3>Lịch sử: {{ historyTarget.itemName }}</h3>
            <button class="modal-close" @click="closeHistoryModal">✕</button>
          </div>
          <div class="modal-body">
            <div v-if="historyLoading" class="empty-state">Đang tải...</div>
            <div v-else-if="transactions.length === 0" class="empty-state">Chưa có giao dịch nào.</div>
            <div v-else class="tx-list">
              <div class="tx-item" v-for="tx in transactions" :key="tx.id">
                <div class="tx-icon" :class="isStockIn(tx) ? 'tx-icon--in' : 'tx-icon--out'">
                  {{ isStockIn(tx) ? '↓' : '↑' }}
                </div>
                <div class="tx-info">
                  <p class="tx-title">
                    {{ isStockIn(tx) ? 'Nhập kho' : 'Xuất kho' }}
                    <strong :class="isStockIn(tx) ? 't-green' : 't-red'">
                      {{ isStockIn(tx) ? '+' : '−' }}{{ formatNumber(tx.quantity) }} {{ historyTarget.unit }}
                    </strong>
                  </p>
                  <p class="tx-meta">
                    {{ formatDateTimeVI(tx.createdAt) }}
                    <template v-if="tx.referenceNo"> · CT: {{ tx.referenceNo }}</template>
                  </p>
                  <p class="tx-note" v-if="tx.note">{{ tx.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WarehouseLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import WarehouseLayout from '@/components/layout/WarehouseLayout.vue'
import { ApiError } from '@/lib/api/http'
import { getAllWarehouses } from '@/features/warehouses/warehouses.api'
import type { WarehouseResponse } from '@/features/warehouses/warehouses.types'
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  stockIn,
  stockOut,
  getInventoryTransactions,
} from '@/features/inventory/inventory.api'
import type {
  InventoryItemResponse,
  UpdateInventoryItemPayload,
  StockMovePayload,
  InventoryTransaction,
} from '@/features/inventory/inventory.types'
import { formatDateTimeVI } from '@/features/requests/requests.helpers'

const formatNumber = (n: number) => n.toLocaleString('vi-VN')

// ── Chọn kho ──────────────────────────────────────────────
const warehouseOptions = ref<WarehouseResponse[]>([])
const selectedWarehouseId = ref('')

onMounted(async () => {
  try {
    warehouseOptions.value = await getAllWarehouses()
    if (warehouseOptions.value.length > 0) {
      selectedWarehouseId.value = warehouseOptions.value[0].id
    }
  } catch (err) {
    loadError.value = (err as Error).message || 'Không tải được danh sách kho.'
  }
})

// ── Danh sách vật tư ──────────────────────────────────────
const items = ref<InventoryItemResponse[]>([])
const pageNumber = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const loadError = ref('')

const lowStockCount = computed(() => items.value.filter((i) => i.isLowStock).length)

const loadItems = async () => {
  if (!selectedWarehouseId.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const paged = await getInventoryItems({
      warehouseId: selectedWarehouseId.value,
      pageNumber: pageNumber.value,
      pageSize: 20,
    })
    items.value = paged.items ?? []
    totalPages.value = paged.totalPages || 1
  } catch (err) {
    loadError.value = (err as Error).message || 'Không tải được vật tư.'
  } finally {
    isLoading.value = false
  }
}

watch(selectedWarehouseId, () => {
  pageNumber.value = 1
  loadItems()
})

const changePage = (p: number) => {
  pageNumber.value = p
  loadItems()
}

// ── Modal tạo / sửa vật tư ────────────────────────────────
const showItemModal = ref(false)
const editingId = ref<string | null>(null)
const isSubmitting = ref(false)
const itemFormError = ref('')

const itemForm = ref<UpdateInventoryItemPayload>({
  itemName: '',
  unit: '',
  minimumQuantity: 0,
})

const openCreateModal = () => {
  editingId.value = null
  itemForm.value = { itemName: '', unit: '', minimumQuantity: 0 }
  itemFormError.value = ''
  showItemModal.value = true
}

const openEditModal = (item: InventoryItemResponse) => {
  editingId.value = item.id
  itemForm.value = {
    itemName: item.itemName ?? '',
    unit: item.unit ?? '',
    minimumQuantity: item.minimumQuantity,
  }
  itemFormError.value = ''
  showItemModal.value = true
}

const closeItemModal = () => { showItemModal.value = false }

const handleItemSubmit = async () => {
  itemFormError.value = ''
  isSubmitting.value = true
  try {
    if (editingId.value) {
      await updateInventoryItem(editingId.value, itemForm.value)
    } else {
      await createInventoryItem({
        warehouseId: selectedWarehouseId.value,
        ...itemForm.value,
      })
    }
    closeItemModal()
    await loadItems()
  } catch (err) {
    itemFormError.value = (err as Error).message || 'Lưu thất bại. Vui lòng thử lại!'
    // 409: người khác vừa sửa cùng lúc → reload cho dữ liệu mới nhất
    if (err instanceof ApiError && err.status === 409) await loadItems()
  } finally {
    isSubmitting.value = false
  }
}

// ── Modal nhập / xuất kho ─────────────────────────────────
const showStockModal = ref(false)
const stockMode = ref<'in' | 'out'>('in')
const stockTarget = ref<InventoryItemResponse | null>(null)
const stockError = ref('')

const stockForm = ref<StockMovePayload>({ quantity: 0, referenceNo: '', note: '' })

const openStockModal = (item: InventoryItemResponse, mode: 'in' | 'out') => {
  stockTarget.value = item
  stockMode.value = mode
  stockForm.value = { quantity: 0, referenceNo: '', note: '' }
  stockError.value = ''
  showStockModal.value = true
}

const closeStockModal = () => { showStockModal.value = false }

const handleStockSubmit = async () => {
  if (!stockTarget.value) return
  stockError.value = ''
  isSubmitting.value = true
  try {
    const fn = stockMode.value === 'in' ? stockIn : stockOut
    const result = await fn(stockTarget.value.id, stockForm.value)
    // BE trả tồn MỚI → cập nhật thẳng vào row, khỏi reload cả bảng
    const row = items.value.find((i) => i.id === result.inventoryItemId)
    if (row) {
      row.quantity = result.quantity
      row.isLowStock = result.isLowStock
    }
    closeStockModal()
  } catch (err) {
    // Xuất vượt tồn → 400; 2 người cùng thao tác → 409 (RowVersion)
    stockError.value = (err as Error).message || 'Thao tác thất bại. Vui lòng thử lại!'
    if (err instanceof ApiError && err.status === 409) await loadItems()
  } finally {
    isSubmitting.value = false
  }
}

// ── Modal lịch sử giao dịch ───────────────────────────────
const showHistoryModal = ref(false)
const historyTarget = ref<InventoryItemResponse | null>(null)
const transactions = ref<InventoryTransaction[]>([])
const historyLoading = ref(false)

const isStockIn = (tx: InventoryTransaction) =>
  (tx.transactionType ?? '').toLowerCase().includes('in')

const openHistoryModal = async (item: InventoryItemResponse) => {
  historyTarget.value = item
  showHistoryModal.value = true
  historyLoading.value = true
  try {
    const paged = await getInventoryTransactions(item.id, 1, 50)
    transactions.value = paged.items ?? []
  } catch {
    transactions.value = []
  } finally {
    historyLoading.value = false
  }
}

const closeHistoryModal = () => { showHistoryModal.value = false }
</script>

<style scoped>
.inv-page { max-width: 1100px; margin: 0 auto; }

.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.page-header h2 { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; margin: 0 0 4px 0; }
.subtitle { font-size: 13.5px; color: #718096; margin: 0; }

.btn-primary { background-color: #1a4f8d; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
.btn-primary:hover { background-color: #123766; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger { background-color: #e11d48; }
.btn-danger:hover { background-color: #be123c; }

/* ── Filter bar ── */
.filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
.wh-select-label { font-size: 13.5px; font-weight: 700; color: #334155; margin: 0; }
.wh-select {
  padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px;
  font-size: 13.5px; background: #fff; min-width: 240px;
}
.wh-select:focus { outline: none; border-color: #1a4f8d; }
.low-stock-summary { font-size: 13px; font-weight: 700; color: #b45309; background: #fef3c7; padding: 7px 14px; border-radius: 20px; }

.card { background: #ffffff; border-radius: 16px; padding: 22px; border: 1px solid #e9ecef; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.empty-state { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }
.error-state { color: #e53e3e; }

/* ── Table ── */
.inv-table { width: 100%; border-collapse: collapse; }
.inv-table th {
  text-align: left; font-size: 12px; font-weight: 700; color: #718096;
  text-transform: uppercase; letter-spacing: 0.4px;
  padding: 10px 12px; border-bottom: 1px solid #e9ecef;
}
.inv-table td { padding: 13px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; vertical-align: middle; }
.inv-table tbody tr:last-child td { border-bottom: none; }
.inv-table tbody tr:hover { background: #f8fafc; }
.row-low { background: #fffbeb; }
.row-low:hover { background: #fef3c7 !important; }
.cell-name { font-weight: 700; color: #1e293b; }
.cell-muted { color: #475569; }
.cell-qty { font-weight: 800; color: #1a4f8d; }
.col-num { text-align: right; }
.col-actions { text-align: right; white-space: nowrap; }
.col-actions .btn-outline { margin-left: 6px; }

.badge { padding: 4px 11px; border-radius: 20px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
.badge--low { background: #fee2e2; color: #b91c1c; }

.btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
.btn-outline:hover { background: #fff; border-color: #1a4f8d; color: #1a4f8d; }
.btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-in:hover  { border-color: #15803d; color: #15803d; }
.btn-out:hover { border-color: #e11d48; color: #e11d48; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 18px; }
.page-info { font-size: 13px; color: #718096; font-weight: 600; }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 14px; width: 100%; max-width: 520px;
  max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.25);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: #fff; z-index: 1;
}
.modal-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; }
.modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b; }
.modal-close:hover { color: #0f172a; }
.modal-body { padding: 20px 24px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }

.form-group { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.form-row .half { margin-bottom: 0; flex: 1; }
label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.required { color: #e11d48; }
input[type="text"], input[type="number"], textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; box-sizing: border-box;
}
input:focus, textarea:focus { outline: none; border-color: #1a4f8d; }
textarea { resize: vertical; }

.hint-text { font-size: 12.5px; color: #64748b; background: #f8fafc; border-radius: 8px; padding: 10px 12px; margin: 0 0 14px; line-height: 1.5; }
.stock-current { font-size: 13.5px; color: #334155; background: #f0f7ff; border-radius: 8px; padding: 10px 12px; margin: 0 0 16px; }
.error-text { color: #e53e3e; font-size: 12.5px; margin: 8px 0 0 0; }

/* ── Transaction list ── */
.tx-list { display: flex; flex-direction: column; gap: 4px; }
.tx-item { display: flex; gap: 12px; padding: 12px 8px; border-bottom: 1px solid #f1f5f9; }
.tx-item:last-child { border-bottom: none; }
.tx-icon {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 900;
}
.tx-icon--in  { background: #dcfce7; color: #15803d; }
.tx-icon--out { background: #fee2e2; color: #b91c1c; }
.tx-info { flex: 1; min-width: 0; }
.tx-title { margin: 0; font-size: 13.5px; font-weight: 600; color: #1e293b; }
.t-green { color: #15803d; } .t-red { color: #b91c1c; }
.tx-meta { margin: 3px 0 0; font-size: 11.5px; color: #94a3b8; }
.tx-note { margin: 4px 0 0; font-size: 12.5px; color: #475569; font-style: italic; }

@media (max-width: 800px) {
  .page-header { flex-direction: column; gap: 14px; }
  .inv-table th:nth-child(4), .inv-table td:nth-child(4) { display: none; }
  .col-actions .btn-outline { margin: 2px; }
}
</style>
