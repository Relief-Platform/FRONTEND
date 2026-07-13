<template>
  <div class="admin-shell">
    <!-- ── Sidebar ─────────────────────────────────────────── -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="url(#adminGrad)"/>
            <path d="M18 8 L26 14 L26 22 L18 28 L10 22 L10 14 Z" fill="white" opacity="0.9"/>
            <path d="M18 13 L22 16 L22 21 L18 24 L14 21 L14 16 Z" fill="url(#adminGrad)"/>
            <defs>
              <linearGradient id="adminGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#c53030"/>
                <stop offset="100%" stop-color="#e53e3e"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <Transition name="fade-label">
          <div v-if="!sidebarCollapsed" class="brand-text">
            <span class="brand-name">ReliefConnect</span>
            <span class="brand-sub">Admin Portal</span>
          </div>
        </Transition>
      </div>

      <!-- Nav items -->
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="sidebar-item"
          :class="{ active: $route.name === item.routeName }"
          :title="sidebarCollapsed ? item.label : ''"
        >
          <span class="sidebar-item__icon" v-html="item.icon" />
          <Transition name="fade-label">
            <span v-if="!sidebarCollapsed" class="sidebar-item__label">{{ item.label }}</span>
          </Transition>
          <Transition name="fade-label">
            <span v-if="!sidebarCollapsed && item.badge" class="sidebar-badge">{{ item.badge }}</span>
          </Transition>
        </router-link>
      </nav>

      <!-- Collapse toggle -->
      <button class="sidebar-collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Mở rộng' : 'Thu gọn'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path :d="sidebarCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'" />
        </svg>
      </button>

      <!-- User profile mini card -->
      <div class="sidebar-user" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-avatar">{{ initials }}</div>
        <Transition name="fade-label">
          <div v-if="!sidebarCollapsed" class="sidebar-user-info">
            <span class="sidebar-user-name">{{ auth.user?.fullName }}</span>
            <span class="sidebar-user-role">Quản trị viên</span>
          </div>
        </Transition>
      </div>
    </aside>

    <!-- ── Main area ─────────────────────────────────────────── -->
    <div class="admin-body">
      <!-- Topbar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div class="topbar-page-info">
            <span class="topbar-greeting">{{ greeting }}, </span>
            <span class="topbar-name">{{ auth.user?.fullName?.split(' ').at(-1) }}!</span>
          </div>
        </div>

        <div class="topbar-right">
          <div class="topbar-user-menu" @click="showUserMenu = !showUserMenu" v-click-outside="() => (showUserMenu = false)">
            <div class="topbar-avatar">{{ initials }}</div>
            <span class="topbar-chevron" :class="{ rotated: showUserMenu }">▾</span>
            <Transition name="fade">
              <div v-if="showUserMenu" class="topbar-dropdown">
                <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  Hồ sơ cá nhân
                </router-link>
                <div class="dropdown-divider" />
                <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Đăng xuất
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page content slot -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const sidebarCollapsed = ref(false)
const showUserMenu = ref(false)

const initials = computed(() =>
  auth.user?.fullName
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? '?',
)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Chào buổi sáng'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
})

const navItems = [
  {
    name: 'dashboard',
    routeName: 'admin-dashboard',
    to: '/admin',
    label: 'Dashboard',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  },
  {
    name: 'users',
    routeName: 'users',
    to: '/users',
    label: 'Quản lý người dùng',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    name: 'requests',
    routeName: 'requester-dashboard',
    to: '/requester',
    label: 'Yêu cầu cứu trợ',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  },
  {
    name: 'coordinator',
    routeName: 'coordinator-dashboard',
    to: '/coordinator',
    label: 'Điều phối',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    name: 'volunteer-view',
    routeName: 'volunteer-dashboard',
    to: '/volunteer',
    label: 'Tình nguyện viên',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
]

async function handleLogout(): Promise<void> {
  showUserMenu.value = false
  await auth.logout()
  router.push('/home')
}

// ── Directive: click outside ────────────────────────────────
const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    el._clickOutside = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  },
}
</script>

<style scoped>
/* ── Shell layout ─────────────────────────────────────────── */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f0f4f8;
}

/* ── Sidebar ──────────────────────────────────────────────── */
.admin-sidebar {
  width: 260px;
  min-height: 100vh;
  background: linear-gradient(175deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.admin-sidebar.collapsed { width: 72px; }

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.brand-logo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-text { overflow: hidden; }
.brand-name {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  white-space: nowrap;
  letter-spacing: -0.3px;
}
.brand-sub {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 2px;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255,255,255,0.62);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.18s ease;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}
.sidebar-item:hover {
  background: rgba(255,255,255,0.10);
  color: #fff;
}
.sidebar-item.active {
  background: rgba(229,62,62,0.22);
  color: #fc8181;
}
.sidebar-item.active .sidebar-item__icon {
  color: #fc8181;
}
.sidebar-item__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}
.sidebar-item__label { overflow: hidden; text-overflow: ellipsis; }

.sidebar-badge {
  margin-left: auto;
  background: #c53030;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
  flex-shrink: 0;
}

/* Collapse button */
.sidebar-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: none;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  margin: 8px auto;
  transition: all 0.18s ease;
  flex-shrink: 0;
}
.sidebar-collapse-btn:hover {
  background: rgba(255,255,255,0.16);
  color: #fff;
}

/* User mini card */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
  overflow: hidden;
}
.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c53030, #e53e3e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}
.sidebar-user-info { overflow: hidden; }
.sidebar-user-name {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-user-role {
  display: block;
  font-size: 10.5px;
  color: #fc8181;
  font-weight: 500;
  white-space: nowrap;
}

/* ── Body ─────────────────────────────────────────────────── */
.admin-body {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.admin-sidebar.collapsed ~ .admin-body { margin-left: 72px; }

/* ── Topbar ───────────────────────────────────────────────── */
.admin-topbar {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0,0,0,0.05);
}
.topbar-left { display: flex; align-items: center; gap: 14px; }
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e9ecef;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.15s ease;
}
.mobile-menu-btn:hover { background: #f0f4f8; }
.topbar-page-info { font-size: 15px; }
.topbar-greeting { color: #718096; font-weight: 400; }
.topbar-name { color: #1a3b5c; font-weight: 700; }

.topbar-right { display: flex; align-items: center; gap: 10px; }

.topbar-user-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  background: #f8fafc;
  position: relative;
  user-select: none;
  transition: all 0.15s ease;
}
.topbar-user-menu:hover { background: #f0f4f8; }
.topbar-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c53030, #e53e3e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
}
.topbar-chevron { font-size: 12px; color: #a0aec0; transition: transform 0.15s ease; }
.topbar-chevron.rotated { transform: rotate(180deg); }

.topbar-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.12);
  border: 1px solid #e9ecef;
  min-width: 200px;
  overflow: hidden;
  z-index: 300;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  font-size: 13.5px;
  font-weight: 500;
  color: #2d3748;
  text-decoration: none;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
  text-align: left;
}
.dropdown-item:hover { background: #f8fafc; }
.dropdown-item--danger { color: #c53030; }
.dropdown-item--danger:hover { background: rgba(197,48,48,0.06); }
.dropdown-divider { border-top: 1px solid #e9ecef; }

/* ── Content ──────────────────────────────────────────────── */
.admin-content {
  flex: 1;
  padding: 28px 32px;
}

/* ── Transitions ──────────────────────────────────────────── */
.fade-label-enter-active,
.fade-label-leave-active { transition: opacity 0.18s ease; }
.fade-label-enter-from,
.fade-label-leave-to { opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 900px) {
  .admin-sidebar {
    position: fixed;
    transform: translateX(0);
    z-index: 300;
  }
  .admin-sidebar.collapsed {
    transform: translateX(-100%);
    width: 260px;
  }
  .admin-body { margin-left: 0 !important; }
  .mobile-menu-btn { display: flex; }
  .admin-content { padding: 20px 16px; }
}
</style>
