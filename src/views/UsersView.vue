<template>
  <AppLayout>
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Quản lý người dùng</h1>
        <BaseButton id="add-user-btn" @click="openCreate">+ Thêm người dùng</BaseButton>
      </div>

      <!-- Search bar -->
      <div class="users-toolbar">
        <BaseInput
          id="search-users"
          v-model="query"
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
      </div>

      <!-- Table -->
      <BaseCard>
        <div v-if="store.isLoading" class="users-loading">
          <BaseSpinner size="lg" class="spinner-dark" />
        </div>

        <div v-else-if="store.users.length === 0" class="users-empty">
          <p>Chưa có người dùng nào.</p>
        </div>

        <table v-else class="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, idx) in store.users" :key="user.id">
              <td class="text-muted">{{ (store.page - 1) * store.pageSize + idx + 1 }}</td>
              <td class="font-semibold">{{ user.fullName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone ?? '—' }}</td>
              <td><span class="role-badge">{{ user.role ?? 'User' }}</span></td>
              <td class="actions-cell">
                <button class="action-btn action-btn--edit" @click="openEdit(user)">Sửa</button>
                <button class="action-btn action-btn--delete" @click="handleDelete(user.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="store.total > store.pageSize" class="users-pagination">
          <button class="page-btn" :disabled="!pagination.hasPrev.value" @click="changePage(-1)">‹ Trước</button>
          <span class="page-info">Trang {{ store.page }} / {{ pagination.totalPages.value }}</span>
          <button class="page-btn" :disabled="!pagination.hasNext.value" @click="changePage(1)">Tiếp ›</button>
        </div>
      </BaseCard>
    </div>

    <!-- Dialog -->
    <UserFormDialog v-model="showDialog" :edit-data="editTarget" @saved="onSaved" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import UserFormDialog from '@/features/users/UserFormDialog.vue'
import { useUsersStore } from '@/stores/users'
import { useDebouncedSearch } from '@/composables/useDebouncedRef'
import { usePagination } from '@/composables/usePagination'
import { useConfirm } from '@/composables/useConfirm'
import type { User } from '@/features/users/users.types'

const store = useUsersStore()
const { query, debouncedQuery } = useDebouncedSearch(300)
const pagination = usePagination()
const { confirm } = useConfirm()

const showDialog = ref(false)
const editTarget = ref<User | null>(null)

onMounted(() => store.fetchUsers())

watch(debouncedQuery, () => {
  store.page = 1
  store.fetchUsers()
})

function changePage(delta: number): void {
  store.page += delta
  store.fetchUsers()
}

function openCreate(): void {
  editTarget.value = null
  showDialog.value = true
}
function openEdit(user: User): void {
  editTarget.value = user
  showDialog.value = true
}
async function handleDelete(id: string | number): Promise<void> {
  if (await confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    await store.removeUser(id)
  }
}
function onSaved(): void {
  store.fetchUsers()
}
</script>

<style scoped>
.users-toolbar { margin-bottom: var(--space-4); }

/* Table */
.users-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.users-table th {
  text-align: left;
  padding: 10px 14px;
  background: #f8fafc;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-border-soft);
}
.users-table td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--color-border-soft);
  color: var(--color-text-primary);
}
.users-table tbody tr:hover { background: #f8fafc; }
.users-table tbody tr:last-child td { border-bottom: none; }

/* Role badge */
.role-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: rgba(26,79,141,0.08);
  color: var(--color-blue);
  font-size: 12px;
  font-weight: 600;
}

/* Actions */
.actions-cell { display: flex; gap: 8px; }
.action-btn {
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}
.action-btn--edit  { background: rgba(26,79,141,0.1); color: var(--color-blue); }
.action-btn--edit:hover  { background: rgba(26,79,141,0.2); }
.action-btn--delete { background: rgba(197,48,48,0.1); color: var(--color-danger); }
.action-btn--delete:hover { background: rgba(197,48,48,0.2); }

/* States */
.users-loading,
.users-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  color: var(--color-text-muted);
}

/* Pagination */
.users-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-soft);
}
.page-btn {
  padding: 7px 16px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-blue);
  transition: all var(--transition-fast);
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { border-color: var(--color-blue); background: rgba(26,79,141,0.05); }
.page-info { font-size: 13px; color: var(--color-text-secondary); }

/* Search icon */
.search-icon { color: var(--color-text-muted); margin: 0 8px; flex-shrink: 0; }
</style>
