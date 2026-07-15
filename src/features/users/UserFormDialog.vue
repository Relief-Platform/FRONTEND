<template>
  <el-dialog
    v-model="visible"
    title="Đổi Vai Trò Người Dùng"
    width="400px"
    @close="resetForm"
  >
    <el-form label-position="top">
      <el-form-item label="Người dùng">
        <el-input :value="editData?.fullName || ''" disabled />
      </el-form-item>
      
      <el-form-item label="Vai trò mới" required>
        <el-select v-model="selectedRole" placeholder="Chọn vai trò mới" style="width: 100%">
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <p style="font-size: 12px; color: #718096; line-height: 1.4; margin-top: -10px;">
        Lưu ý: User cần đăng xuất và đăng nhập lại để nhận quyền của vai trò mới.
      </p>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">Huỷ</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleSubmit">
        Cập nhật Role
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUsersStore } from '@/stores/users'
import type { User } from './users.types'

// ── Props & Emits ────────────────────────────────────────────
interface Props {
  modelValue: boolean
  editData?: User | null
}
const props = withDefaults(defineProps<Props>(), { editData: null })
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

// ── State ────────────────────────────────────────────────────
const store = useUsersStore()
const isLoading = ref(false)
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const selectedRole = ref<string>('')

const roles = [
  { value: 'Admin', label: 'Quản trị viên (Admin)' },
  { value: 'Volunteer', label: 'Tình nguyện viên (Volunteer)' },
  { value: 'Requester', label: 'Người yêu cầu (Requester)' },
  { value: 'WarehouseManager', label: 'Quản lý kho (WarehouseManager)' },
  { value: 'Organization', label: 'Tổ chức (Organization)' },
]

watch(
  () => props.editData,
  (user) => {
    if (user) {
      selectedRole.value = user.role
    }
  },
  { immediate: true },
)

// ── Actions ──────────────────────────────────────────────────
function resetForm(): void {
  selectedRole.value = props.editData?.role || ''
}

async function handleSubmit(): Promise<void> {
  if (!props.editData || !selectedRole.value) return
  if (props.editData.role === selectedRole.value) {
    visible.value = false
    return
  }

  isLoading.value = true
  try {
    await store.changeRole(props.editData.id, selectedRole.value)
    ElMessage.success('Đổi vai trò thành công!')
    emit('saved')
    visible.value = false
  } catch (err) {
    ElMessage.error((err as Error).message || 'Có lỗi xảy ra')
  } finally {
    isLoading.value = false
  }
}
</script>
