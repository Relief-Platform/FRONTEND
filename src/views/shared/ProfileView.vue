<template>
  <AppLayout>
    <div class="page-container" style="max-width: 560px;">
      <h1 class="page-title" style="margin-bottom: var(--space-6);">Hồ sơ cá nhân</h1>

      <BaseCard>
        <div class="profile-top">
          <img
            v-if="auth.user?.avatar"
            :src="auth.user.avatar"
            :alt="auth.user.fullName"
            class="profile-avatar"
          />
          <div class="profile-initials" v-else>
            {{ initials }}
          </div>
          <div>
            <h2 class="profile-name">{{ auth.user?.fullName }}</h2>
            <span class="profile-role-badge" :style="{ background: roleBg, color: roleColor }">
              {{ roleLabel }}
            </span>
          </div>
        </div>

        <div class="profile-info">
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ auth.user?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Điện thoại</span>
            <span class="info-value">{{ auth.user?.phone ?? '—' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Vai trò</span>
            <span class="info-value">{{ roleLabel }}</span>
          </div>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { useAuthStore } from '@/stores/auth'
import { ROLE_LABELS, ROLE_COLORS } from '@/features/auth/auth.types'

const auth = useAuthStore()

const roleLabel = computed(() =>
  auth.role ? ROLE_LABELS[auth.role] : '—',
)
const roleColor = computed(() =>
  auth.role ? ROLE_COLORS[auth.role] : '#4a5568',
)
const roleBg = computed(() =>
  auth.role ? `${ROLE_COLORS[auth.role]}1a` : '#f0f2f5',
)
const initials = computed(() =>
  auth.user?.fullName
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? '?',
)
</script>

<style scoped>
.profile-top {
  display: flex; align-items: center; gap: var(--space-5);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border-soft);
  margin-bottom: var(--space-5);
}
.profile-avatar {
  width: 72px; height: 72px; border-radius: 50%; object-fit: cover;
  border: 2px solid var(--color-border-soft);
}
.profile-initials {
  width: 72px; height: 72px; border-radius: 50%;
  background: #1a4f8d; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800;
}
.profile-name { font-size: 20px; font-weight: 700; color: #1a3b5c; margin-bottom: 6px; }
.profile-role-badge {
  display: inline-block; padding: 3px 12px;
  border-radius: 99px; font-size: 12px; font-weight: 700;
}
.profile-info { display: flex; flex-direction: column; gap: var(--space-3); }
.info-row {
  display: flex; justify-content: space-between;
  padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border-soft);
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 13px; color: var(--color-text-secondary); font-weight: 500; }
.info-value  { font-size: 14px; color: var(--color-text-primary); font-weight: 600; }
</style>
