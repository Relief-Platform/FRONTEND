<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'"
    width="500px"
    @close="resetForm"
  >
    <el-form :model="form" label-width="120px" label-position="top">
      <el-form-item label="Họ và tên" required>
        <el-input v-model="form.fullName" placeholder="Nguyễn Văn A" />
      </el-form-item>
      <el-form-item label="Email" required>
        <el-input v-model="form.email" type="email" placeholder="example@email.com" />
      </el-form-item>
      <el-form-item label="Số điện thoại">
        <el-input v-model="form.phone" placeholder="0912345678" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="Mật khẩu" required>
        <el-input v-model="form.password" type="password" placeholder="••••••••" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">Huỷ</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleSubmit">
        {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createUser, updateUser } from './users.api'
import type { User, CreateUserPayload } from './users.types'

// ── Props & Emits ────────────────────────────────────────────
interface Props {
  modelValue: boolean
  editData?: User | null
}
const props = withDefaults(defineProps<Props>(), { editData: null })
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [user: User]
}>()

// ── State ────────────────────────────────────────────────────
const isLoading = ref(false)
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const isEdit = computed(() => !!props.editData)

const defaultForm = (): CreateUserPayload => ({
  fullName: '',
  email: '',
  phone: '',
  password: '',
})
const form = ref<CreateUserPayload>(defaultForm())

watch(
  () => props.editData,
  (user) => {
    if (user) {
      form.value = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? '',
        password: '',
      }
    }
  },
  { immediate: true },
)

// ── Actions ──────────────────────────────────────────────────
function resetForm(): void {
  form.value = defaultForm()
}

async function handleSubmit(): Promise<void> {
  isLoading.value = true
  try {
    let saved: User
    if (isEdit.value && props.editData) {
      saved = await updateUser({ id: props.editData.id, ...form.value })
    } else {
      saved = await createUser(form.value)
    }
    ElMessage.success(isEdit.value ? 'Cập nhật thành công!' : 'Tạo mới thành công!')
    emit('saved', saved)
    visible.value = false
  } catch (err) {
    ElMessage.error((err as Error).message || 'Có lỗi xảy ra')
  } finally {
    isLoading.value = false
  }
}
</script>
