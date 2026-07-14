<template>
  <div class="wh-layout">
    <!-- ── Sidebar ─────────────────────────────────────────── -->
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8a2 2 0 0 0-2-2h-3l-2-2H9L7 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4"/></svg>
        </div>
        <div>
          <p class="brand-name"><span class="t-white">Relief</span><span class="t-orange">Connect</span></p>
          <p class="brand-sub">WAREHOUSE PORTAL</p>
        </div>
      </div>

      <nav class="sidebar__nav">
        <router-link to="/warehouse" class="nav-item" exact-active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21V12h6v9"/></svg>
          Quản lý kho
        </router-link>
        <router-link to="/warehouse/inventory" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          Vật tư &amp; tồn kho
        </router-link>
        <router-link to="/home" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>
          Trang chủ
        </router-link>
      </nav>

      <div class="sidebar__footer">
        <div class="user-avatar">{{ initials }}</div>
        <div class="user-info">
          <p class="user-name">{{ auth.user?.fullName }}</p>
          <p class="user-role">Quản lý kho</p>
        </div>
        <button class="logout-btn" title="Đăng xuất" @click="handleLogout">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </aside>

    <!-- ── Main content ─────────────────────────────────────── -->
    <main class="wh-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const initials = computed(() =>
  auth.user?.fullName
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? '?',
)

async function handleLogout(): Promise<void> {
  await auth.logout()
  router.push('/home')
}
</script>

<style scoped>
.wh-layout { display: flex; min-height: 100vh; background: #f5f6f8; }

/* ── Sidebar ── */
.sidebar {
  width: 240px; flex-shrink: 0;
  background: linear-gradient(180deg, #14263e 0%, #1a3b5c 100%);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
}
.sidebar__brand {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.08);
}
.brand-logo {
  width: 36px; height: 36px; border-radius: 10px;
  background: #1a4f8d; color: #fff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.brand-name { margin: 0; font-size: 16px; font-weight: 900; letter-spacing: -0.3px; line-height: 1.2; }
.t-white { color: #fff; } .t-orange { color: #e27d24; }
.brand-sub { margin: 2px 0 0; font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; color: rgba(255,255,255,0.45); }

.sidebar__nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 11px;
  padding: 11px 14px; border-radius: 10px;
  color: rgba(255,255,255,0.72); font-size: 13.5px; font-weight: 600;
  text-decoration: none; transition: all 0.15s ease;
}
.nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
.nav-item.active { background: #1a4f8d; color: #fff; }

.sidebar__footer {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; border-top: 1px solid rgba(255,255,255,0.08);
}
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: #1a4f8d; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; flex-shrink: 0;
}
.user-info { flex: 1; min-width: 0; }
.user-name { margin: 0; font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; }
.logout-btn {
  background: none; border: none; color: rgba(255,255,255,0.55);
  cursor: pointer; padding: 6px; border-radius: 8px; display: flex;
  transition: all 0.15s ease;
}
.logout-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* ── Main ── */
.wh-main { flex: 1; min-width: 0; padding: 28px 32px; }

@media (max-width: 900px) {
  .wh-layout { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; align-items: center; }
  .sidebar__brand { border-bottom: none; padding: 12px 16px; }
  .sidebar__nav { flex-direction: row; padding: 8px; overflow-x: auto; }
  .sidebar__footer { border-top: none; }
  .user-info { display: none; }
  .wh-main { padding: 18px 14px; }
}
</style>
