<template>
  <div class="app-layout">
    <!-- ── Navbar ───────────────────────────────────────────── -->
    <nav class="navbar">
      <router-link to="/home" class="navbar__brand">
        <span class="brand-navy">Relief</span><span class="brand-orange">Connect</span>
      </router-link>

      <div class="navbar__links">
        <!-- Public link -->
        <router-link to="/home" class="nav-link">Trang chủ</router-link>

        <!-- Requester + Admin -->
        <router-link
          v-if="auth.hasRole('Requester', 'Admin')"
          to="/requester"
          class="nav-link"
        >Yêu cầu hỗ trợ</router-link>

        <!-- Volunteer + Admin -->
        <router-link
          v-if="auth.hasRole('Volunteer', 'Admin')"
          to="/volunteer"
          class="nav-link"
        >Tình nguyện</router-link>

        <!-- Admin + Coordinator (quản lý kho) -->
        <router-link
          v-if="auth.hasRole('Admin', 'Coordinator')"
          to="/warehouses"
          class="nav-link"
        >Kho</router-link>

        <!-- Admin only -->
        <router-link
          v-if="auth.hasRole('Admin')"
          to="/coordinator"
          class="nav-link"
        >Điều phối</router-link>
        <router-link
          v-if="auth.hasRole('Admin')"
          to="/admin"
          class="nav-link nav-link--admin"
        >Admin</router-link>
        <router-link
          v-if="auth.hasRole('Admin')"
          to="/users"
          class="nav-link"
        >Người dùng</router-link>
      </div>

      <div class="navbar__right">
        <!-- Guest: show login/register -->
        <template v-if="!auth.isLoggedIn">
          <router-link to="/login"    class="nav-btn nav-btn--ghost">Đăng nhập</router-link>
          <router-link to="/register" class="nav-btn nav-btn--primary">Đăng ký</router-link>
        </template>

        <!-- Logged-in: avatar dropdown -->
        <template v-else>
          <div class="user-menu" @click="showMenu = !showMenu" v-click-outside="() => (showMenu = false)">
            <div class="user-avatar">{{ initials }}</div>
            <div class="user-info">
              <span class="user-name">{{ auth.user?.fullName }}</span>
              <span class="user-role" :style="{ color: roleColor }">{{ roleLabel }}</span>
            </div>
            <span class="chevron" :class="{ rotated: showMenu }">▾</span>

            <!-- Dropdown -->
            <Transition name="fade">
              <div v-if="showMenu" class="user-dropdown">
                <router-link to="/profile" class="dropdown-item" @click="showMenu = false">
                  👤 Hồ sơ cá nhân
                </router-link>
                <div class="dropdown-divider" />
                <button id="logout-btn" class="dropdown-item dropdown-item--danger" @click="handleLogout">
                  🚪 Đăng xuất
                </button>
              </div>
            </Transition>
          </div>
        </template>
      </div>
    </nav>

    <!-- ── Page content ──────────────────────────────────────── -->
    <!-- SLOT chứ không phải RouterView: AppLayout được dùng kiểu
         <AppLayout>...nội dung trang...</AppLayout> bên trong các view.
         RouterView ở đây chỉ render route CON (không có) → thân trang trống. -->
    <main class="app-layout__main">
      <slot>
        <RouterView />
      </slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLE_LABELS, ROLE_COLORS } from '@/features/auth/auth.types'
import type { UserRole } from '@/features/auth/auth.types'

const router = useRouter()
const auth   = useAuthStore()
const showMenu = ref(false)

// BE trả role viết hoa ("Requester") còn mock cũ viết thường ("requester")
// → chuẩn hoá lowercase để check role chạy đúng cả 2
const normalizedRole = computed(() => (auth.role ?? '').toLowerCase() as UserRole | '')

const roleLabel = computed(() =>
  normalizedRole.value ? (ROLE_LABELS[normalizedRole.value as UserRole] ?? auth.role ?? '') : '',
)
const roleColor = computed(() =>
  normalizedRole.value ? (ROLE_COLORS[normalizedRole.value as UserRole] ?? '#4a5568') : '#4a5568',
)
const initials  = computed(() =>
  auth.user?.fullName
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? '?',
)

async function handleLogout(): Promise<void> {
  showMenu.value = false
  await auth.logout()
  router.push('/home')
}

// ── Directive: click outside ────────────────────────────────
type ClickOutsideEl = HTMLElement & { _clickOutside?: (e: Event) => void }

const vClickOutside = {
  mounted(el: ClickOutsideEl, binding: { value: () => void }) {
    el._clickOutside = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: ClickOutsideEl) {
    if (el._clickOutside) document.removeEventListener('click', el._clickOutside)
  },
}
</script>

<style scoped>
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }

/* ── Navbar ── */
.navbar {
  display: flex; align-items: center; gap: var(--space-4);
  padding: 0 var(--space-8); height: var(--navbar-height);
  background: #fff; box-shadow: 0 1px 8px rgba(0,0,0,0.08);
  position: sticky; top: 0; z-index: 100;
}
.navbar__brand {
  font-size: 22px; font-weight: 900; text-decoration: none;
  letter-spacing: -0.5px; white-space: nowrap; margin-right: var(--space-4);
}
.brand-navy   { color: #1a3b5c; }
.brand-orange { color: #e27d24; }

.navbar__links { display: flex; align-items: center; gap: var(--space-1); flex: 1; }

.nav-link {
  padding: 6px 12px; border-radius: var(--radius-md);
  font-size: 13px; font-weight: 600; color: #4a5568;
  text-decoration: none; transition: all var(--transition-fast); white-space: nowrap;
}
.nav-link:hover, .nav-link.router-link-active { color: #1a4f8d; background: rgba(26,79,141,0.07); }
.nav-link--admin { color: #c53030; }
.nav-link--admin:hover { background: rgba(197,48,48,0.08); }

.navbar__right { display: flex; align-items: center; gap: var(--space-2); margin-left: auto; }

.nav-btn {
  padding: 7px 16px; border-radius: var(--radius-md);
  font-size: 13px; font-weight: 600; text-decoration: none;
  transition: all var(--transition-fast); white-space: nowrap;
}
.nav-btn--ghost   { color: #1a4f8d; border: 1.5px solid #1a4f8d; }
.nav-btn--ghost:hover { background: rgba(26,79,141,0.07); }
.nav-btn--primary { background: #1a4f8d; color: #fff; }
.nav-btn--primary:hover { background: #123766; color: #fff; }

/* ── User menu ── */
.user-menu {
  display: flex; align-items: center; gap: var(--space-2);
  cursor: pointer; padding: 6px var(--space-2); border-radius: var(--radius-md);
  position: relative; user-select: none;
  transition: background var(--transition-fast);
}
.user-menu:hover { background: #f8fafc; }

.user-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: #1a4f8d; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; flex-shrink: 0;
}
.user-info { display: flex; flex-direction: column; line-height: 1.2; }
.user-name  { font-size: 13px; font-weight: 700; color: #1a3b5c; }
.user-role  { font-size: 11px; font-weight: 600; }

.chevron { font-size: 12px; color: #a0aec0; transition: transform var(--transition-fast); }
.chevron.rotated { transform: rotate(180deg); }

/* ── Dropdown ── */
.user-dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: #fff; border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); border: 1px solid var(--color-border-soft);
  min-width: 190px; overflow: hidden; z-index: 200;
}
.dropdown-item {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 16px; font-size: 14px; font-weight: 500;
  color: #2d3748; text-decoration: none;
  width: 100%; background: none; border: none; cursor: pointer;
  transition: background var(--transition-fast); text-align: left;
}
.dropdown-item:hover { background: #f8fafc; }
.dropdown-item--danger { color: #c53030; }
.dropdown-item--danger:hover { background: rgba(197,48,48,0.06); }
.dropdown-divider { border-top: 1px solid var(--color-border-soft); }

/* ── Fade transition ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Main ── */
.app-layout__main { flex: 1; background: var(--color-bg); }

@media (max-width: 768px) {
  .navbar { padding: 0 var(--space-4); }
  .navbar__links { display: none; }
  .user-info { display: none; }
}
</style>