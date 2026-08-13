<template>
  <div class="phone-input-wrap" :class="{ 'is-disabled': disabled }">
    <div class="country-select-box">
      <select
        v-model="selectedCode"
        class="country-select"
        :disabled="disabled"
        @change="handleInput"
      >
        <option
          v-for="item in COUNTRY_CODES"
          :key="item.code + item.iso"
          :value="item.code"
        >
          {{ item.flag }} {{ item.code }} ({{ item.name }})
        </option>
      </select>
      <span class="select-arrow">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
    <input
      type="tel"
      v-model="localNumber"
      class="phone-num-input"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { COUNTRY_CODES } from '@/constants/countryCodes'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: '0912 345 678',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedCode = ref('+84')
const localNumber = ref('')

function parseValue(val: string) {
  if (!val) {
    localNumber.value = ''
    return
  }
  const trimmed = val.trim()
  if (trimmed.startsWith('+')) {
    // Sắp xếp mã vùng từ dài đến ngắn để khớp chính xác nhất (VD: +852 vs +85)
    const sortedCodes = COUNTRY_CODES.slice().sort((a, b) => b.code.length - a.code.length)
    const matched = sortedCodes.find(c => trimmed.startsWith(c.code))
    if (matched) {
      selectedCode.value = matched.code
      localNumber.value = trimmed.slice(matched.code.length).trim()
      return
    }
  }
  if (trimmed.startsWith('84') && trimmed.length >= 10) {
    selectedCode.value = '+84'
    localNumber.value = trimmed.slice(2)
    return
  }
  // Mặc định +84
  selectedCode.value = '+84'
  localNumber.value = trimmed
}

function handleInput() {
  const digits = localNumber.value.trim()
  if (!digits) {
    emit('update:modelValue', '')
    return
  }
  const cleanDigits = (selectedCode.value === '+84' && digits.startsWith('0'))
    ? digits.slice(1)
    : digits
  const full = `${selectedCode.value}${cleanDigits}`
  emit('update:modelValue', full)
}

watch(() => props.modelValue, (newVal) => {
  const currentDigits = localNumber.value.trim()
  const cleanCurrent = (selectedCode.value === '+84' && currentDigits.startsWith('0'))
    ? currentDigits.slice(1)
    : currentDigits
  const currentFull = currentDigits ? `${selectedCode.value}${cleanCurrent}` : ''
  
  if (newVal !== currentFull) {
    parseValue(newVal ?? '')
  }
}, { immediate: true })
</script>

<style scoped>
.phone-input-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #fafafa;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
  box-sizing: border-box;
}

.phone-input-wrap:focus-within {
  border-color: #1a4f8d;
  box-shadow: 0 0 0 3px rgba(26, 79, 141, 0.12);
  background: #fff;
}

.phone-input-wrap.is-disabled {
  background: #f3f4f6;
  opacity: 0.7;
  cursor: not-allowed;
}

.country-select-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-right: 1px solid #d1d5db;
  flex-shrink: 0;
}

.country-select {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: none;
  padding: 10px 26px 10px 12px;
  font-size: 13.5px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}

.select-arrow {
  position: absolute;
  right: 8px;
  pointer-events: none;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.phone-num-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 14px;
  font-size: 14px;
  color: #1f2937;
  background: transparent;
  font-family: inherit;
  width: 100%;
  min-width: 0;
}

.phone-num-input::placeholder {
  color: #9ca3af;
}
</style>
