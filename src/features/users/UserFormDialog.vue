<template>
  <el-dialog
    v-model="visible"
    :title="$t('admin.change_role_dialog_title')"
    width="400px"
    @close="resetForm"
  >
    <el-form label-position="top">
      <el-form-item :label="$t('common.user')">
        <el-input :value="editData?.fullName || ''" disabled />
      </el-form-item>
      
      <el-form-item :label="$t('admin.new_role_label')" required>
        <el-select v-model="selectedRole" :placeholder="$t('admin.new_role_placeholder')" style="width: 100%">
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <p style="font-size: 12px; color: #718096; line-height: 1.4; margin-top: -10px;">
        {{ $t('admin.role_change_note') }}
      </p>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleSubmit">
        {{ $t('admin.btn_update_role') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
const { locale, t } = useI18n()
const store = useUsersStore()
const isLoading = ref(false)
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const selectedRole = ref<string>('')

const roles = computed(() => {
  const _ = locale.value
  return [
    { value: 'Admin', label: `${t('roles.Admin')} (Admin)` },
    { value: 'Volunteer', label: `${t('roles.Volunteer')} (Volunteer)` },
    { value: 'Requester', label: `${t('roles.Requester')} (Requester)` },
    { value: 'Coordinator', label: `${t('roles.Coordinator')} (Coordinator)` },
    { value: 'Organization', label: `${t('roles.Organization')} (Organization)` },
  ]
})

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
