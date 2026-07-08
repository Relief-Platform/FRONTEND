<template>
  <div class="app-layout">
    <!-- ── Navbar ─────────────────────────────── -->
    <nav class="navbar">
      <router-link to="/home" class="navbar__brand">
        <span class="text-navy">Relief</span><span class="text-orange">Connect</span>
      </router-link>

      <div class="navbar__actions">
        <!-- Nav links (thêm route tuỳ dự án) -->
        <router-link to="/home" class="nav-link">Trang chủ</router-link>
        <router-link to="/users" class="nav-link">Người dùng</router-link>

        <!-- User info + Logout -->
        <div v-if="authStore.isLoggedIn" class="navbar__user">
          <span class="navbar__username">{{ authStore.user?.fullName ?? 'Người dùng' }}</span>
          <button id="logout-btn" class="navbar__logout" @click="handleLogout">
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>

    <!-- ── Page content ───────────────────────── -->
    <main class="app-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout(): void {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }

/* ── Navbar ── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 60px;
  background: #ffffff;
  box-shadow: 0 1px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__brand {
  font-size: 22px;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: -0.5px;
}
.text-navy  { color: #1a3b5c; }
.text-orange { color: #e27d24; }

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover,
.nav-link.router-link-active { color: #1a4f8d; }

.navbar__user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.navbar__username { font-size: 14px; font-weight: 600; color: #1a3b5c; }

.navbar__logout {
  font-size: 13px;
  font-weight: 600;
  color: #c53030;
  background: none;
  border: 1.5px solid #c53030;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
.navbar__logout:hover { background: #c53030; color: #fff; }

/* ── Main ── */
.app-layout__main { flex: 1; background: #f0f2f5; }
</style>
