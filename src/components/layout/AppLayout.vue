<template>
  <div class="app-layout">
    <!-- ── Navbar ───────────────────────────────────────────── -->
    <nav class="navbar">
      <router-link to="/home" class="navbar__brand">
        <span class="brand-navy">Relief</span><span class="brand-orange">Connect</span>
      </router-link>

      <div class="navbar__links">
        <!-- Public links -->
        <router-link to="/home" class="nav-link">{{ $t('nav.home') }}</router-link>
        <router-link to="/about" class="nav-link">{{ $t('nav.about') }}</router-link>
        <router-link to="/guide" class="nav-link">{{ $t('nav.guide') }}</router-link>
        <router-link to="/contact" class="nav-link">{{ $t('nav.contact') }}</router-link>

        <!-- Requester + Admin -->
        <router-link
          v-if="auth.hasRole('Requester', 'Admin')"
          to="/requester"
          class="nav-link"
        >{{ $t('nav.requests') }}</router-link>

        <!-- Volunteer + Admin -->
        <router-link
          v-if="auth.hasRole('Volunteer', 'Admin')"
          to="/volunteer"
          class="nav-link"
        >{{ $t('nav.volunteer') }}</router-link>

        <!-- Admin + Coordinator (quản lý kho) -->
        <router-link
          v-if="auth.hasRole('Admin', 'Coordinator')"
          to="/warehouses"
          class="nav-link"
        >{{ $t('nav.warehouse') }}</router-link>

        <!-- Admin only -->
        <router-link
          v-if="auth.hasRole('Admin')"
          to="/coordinator"
          class="nav-link"
        >{{ $t('nav.coordination') }}</router-link>
        <router-link
          v-if="auth.hasRole('Admin')"
          to="/admin"
          class="nav-link nav-link--admin"
        >{{ $t('nav.admin') }}</router-link>
        <router-link
          v-if="auth.hasRole('Admin')"
          to="/users"
          class="nav-link"
        >{{ $t('nav.users') }}</router-link>
      </div>

      <div class="navbar__right">
        <!-- Language Switcher -->
        <div class="lang-switch">
          <button
            class="lang-btn"
            :class="{ active: currentLang === 'vi' }"
            @click="changeLang('vi')"
            title="Tiếng Việt"
          >
            VI
          </button>
          <span class="lang-divider">|</span>
          <button
            class="lang-btn"
            :class="{ active: currentLang === 'en' }"
            @click="changeLang('en')"
            title="English"
          >
            EN
          </button>
        </div>

        <!-- Guest: show login/register -->
        <template v-if="!auth.isLoggedIn">
          <router-link to="/login"    class="nav-btn nav-btn--ghost">{{ $t('nav.login') }}</router-link>
          <router-link to="/register" class="nav-btn nav-btn--primary">{{ $t('nav.register') }}</router-link>
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
                  👤 {{ $t('nav.profile') }}
                </router-link>
                <div class="dropdown-divider" />
                <button id="logout-btn" class="dropdown-item dropdown-item--danger" @click="handleLogout">
                  🚪 {{ $t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </template>
      </div>
    </nav>

    <!-- ── Page content ──────────────────────────────────────── -->
    <main class="app-layout__main">
      <slot>
        <RouterView />
      </slot>
    </main>

    <!-- ── Global Footer ────────────────────────────────────── -->
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <router-link to="/home" class="footer-logo">
            <span class="brand-navy-light">Relief</span><span class="brand-orange">Connect</span>
          </router-link>
          <p class="footer-desc">
            {{ $t('footer.desc') }}
          </p>
        </div>

        <div class="footer-links-group">
          <div class="footer-col">
            <h4 class="footer-heading">{{ $t('footer.explore') }}</h4>
            <router-link to="/home">{{ $t('nav.home') }}</router-link>
            <router-link to="/about">{{ $t('nav.about') }}</router-link>
            <router-link to="/guide">{{ $t('nav.guide') }}</router-link>
            <router-link to="/contact">{{ $t('nav.contact') }}</router-link>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">{{ $t('footer.join') }}</h4>
            <router-link to="/register">{{ $t('footer.send_request') }}</router-link>
            <router-link to="/register">{{ $t('footer.volunteer_reg') }}</router-link>
            <router-link to="/login">{{ $t('footer.login_acc') }}</router-link>
          </div>

          <div class="footer-col">
            <h4 class="footer-heading">{{ $t('footer.emergency') }}</h4>
            <a href="tel:19001234" class="footer-phone">📞 1900 1234</a>
            <a href="mailto:hotro@reliefconnect.vn">✉ hotro@reliefconnect.vn</a>
            <span class="footer-addr">📍 {{ $t('footer.address') }}</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>{{ $t('footer.rights') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { ROLE_LABELS, ROLE_COLORS } from '@/features/auth/auth.types'
import type { UserRole } from '@/features/auth/auth.types'

const router = useRouter()
const auth   = useAuthStore()
const showMenu = ref(false)

const { locale, t } = useI18n()
const currentLang = computed(() => locale.value)

function changeLang(lang: 'vi' | 'en') {
  locale.value = lang
  localStorage.setItem('app_lang', lang)
}

// BE trả role viết hoa ("Requester") còn mock cũ viết thường ("requester")
// → chuẩn hoá lowercase để check role chạy đúng cả 2
const normalizedRole = computed(() => (auth.role ?? '').toLowerCase() as UserRole | '')

const hasRole = (...roles: string[]): boolean =>
  normalizedRole.value !== '' && roles.includes(normalizedRole.value)

const roleLabel = computed(() => {
  const _ = locale.value
  if (!auth.role) return ''
  // Normalize PascalCase or lowercase role to UserRole key
  const roleName = auth.role.charAt(0).toUpperCase() + auth.role.slice(1).toLowerCase()
  return t(`roles.${roleName}`, ROLE_LABELS[auth.role as UserRole] ?? auth.role)
})
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

.navbar__right { display: flex; align-items: center; gap: var(--space-3); margin-left: auto; }

/* ── Language Switcher ── */
.lang-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
}
.lang-btn {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 99px;
  transition: all 0.2s ease;
}
.lang-btn:hover {
  color: #1a4f8d;
}
.lang-btn.active {
  background: #ffffff;
  color: #1a4f8d;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.lang-divider {
  font-size: 11px;
  color: #cbd5e1;
}

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

/* ── Footer ── */
.app-footer {
  background: #0f2540;
  color: rgba(255, 255, 255, 0.8);
  padding: 48px 24px 24px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
}
.footer-logo {
  font-size: 24px;
  font-weight: 900;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 12px;
}
.brand-navy-light { color: #ffffff; }
.footer-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}
.footer-links-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.footer-heading {
  font-size: 14px;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-col a {
  color: rgba(255, 255, 255, 0.75);
  font-size: 13.5px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-col a:hover {
  color: #ffffff;
}
.footer-phone {
  font-weight: 800;
  color: #fbbf24 !important;
  font-size: 15px !important;
}
.footer-addr {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
  margin-top: 4px;
}
.footer-bottom {
  max-width: 1200px;
  margin: 36px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 900px) {
  .footer-inner { grid-template-columns: 1fr; gap: 32px; }
  .footer-links-group { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .navbar { padding: 0 var(--space-4); }
  .navbar__links { display: none; }
  .user-info { display: none; }
}
@media (max-width: 500px) {
  .footer-links-group { grid-template-columns: 1fr; }
}
</style>