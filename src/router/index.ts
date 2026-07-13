// ============================================================
//  Router – Routes + Role-based Auth Guard
//
//  Cấu trúc views:
//  views/
//  ├── shared/      → HomeView, NotFoundView, UnauthorizedView, ProfileView
//  ├── auth/        → LoginView, RegisterView
//  ├── admin/       → AdminDashboard, UsersView
//  ├── coordinator/ → CoordinatorDashboard
//  ├── volunteer/   → VolunteerDashboard
//  └── requester/   → RequesterDashboard, MyRequestsView, NotificationsView
// ============================================================

import './types'                                        // RouteMeta augmentation
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { tokenStorage } from '@/lib/api/token-storage'
import type { UserRole } from '@/features/auth/auth.types'

// ── Route definitions ────────────────────────────────────────
const routes: RouteRecordRaw[] = [

  // ── Root redirect ──────────────────────────────────────────
  { path: '/', redirect: '/home' },

  // ────────────────────────────────────────────────────────────
  //  SHARED – public hoặc any logged-in user
  // ────────────────────────────────────────────────────────────
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/shared/HomeView.vue'),
    meta: { title: 'Trang chủ' }, // Không requiresAuth → guest OK
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/shared/ProfileView.vue'),
    meta: { requiresAuth: true, title: 'Hồ sơ cá nhân' },
  },

  // ────────────────────────────────────────────────────────────
  //  AUTH – chỉ cho guest chưa đăng nhập
  // ────────────────────────────────────────────────────────────
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true, title: 'Đăng nhập' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guestOnly: true, title: 'Đăng ký' },
  },

  // ────────────────────────────────────────────────────────────
  //  REQUESTER – requester | coordinator | admin
  // ────────────────────────────────────────────────────────────
  {
    path: '/requester',
    name: 'requester-dashboard',
    component: () => import('@/views/requester/RequesterDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['requester', 'coordinator', 'admin'],
      title: 'Dashboard – Yêu cầu hỗ trợ',
    },
  },
  {
    path: '/requester/notifications',
    name: 'requester-notifications',
    component: () => import('@/views/requester/NotificationsView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['requester', 'coordinator', 'admin'],
      title: 'Thông báo',
    },
  },
  {
  path: '/requester/my-requests',
  name: 'my-requests',
  component: () => import('@/views/requester/MyRequestsView.vue'),
  meta: {
    requiresAuth: true,
    roles: ['requester', 'coordinator', 'admin'],
    title: 'Yêu cầu của tôi',
  },
},
{
  path: '/requester/tracking',
  name: 'requester-tracking',
  component: () => import('@/views/requester/TrackingView.vue'),
  meta: {
    requiresAuth: true,
    roles: ['requester', 'coordinator', 'admin'],
    title: 'Theo dõi hỗ trợ',
  },
},
{
  path: '/requester/guide',
  name: 'requester-guide',
  component: () => import('@/views/requester/GuideView.vue'),
  meta: {
    requiresAuth: true,
    roles: ['requester', 'coordinator', 'admin'],
    title: 'Hướng dẫn',
  },
},
  // ────────────────────────────────────────────────────────────
  //  VOLUNTEER – volunteer | coordinator | admin
  // ────────────────────────────────────────────────────────────
  {
    path: '/volunteer',
    name: 'volunteer-dashboard',
    component: () => import('@/views/volunteer/VolunteerDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['volunteer', 'coordinator', 'admin'],
      title: 'Dashboard – Tình nguyện viên',
    },
  },
  {
    path: '/volunteer/my-tasks',
    name: 'volunteer-my-tasks',
    component: () => import('@/views/volunteer/MyTasksView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['volunteer', 'coordinator', 'admin'],
      title: 'Nhiệm vụ của tôi',
    },
  },
  {
    path: '/volunteer/history',
    name: 'volunteer-history',
    component: () => import('@/views/volunteer/ActivityHistoryView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['volunteer', 'coordinator', 'admin'],
      title: 'Lịch sử hoạt động',
    },
  },
  {
    path: '/volunteer/skills',
    name: 'volunteer-skills',
    component: () => import('@/views/volunteer/SkillsView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['volunteer', 'coordinator', 'admin'],
      title: 'Đăng ký kỹ năng',
    },
  },
  {
    path: '/volunteer/notifications',
    name: 'volunteer-notifications',
    component: () => import('@/views/volunteer/NotificationsView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['volunteer', 'coordinator', 'admin'],
      title: 'Thông báo',
    },
  },
  {
    path: '/volunteer/profile',
    name: 'volunteer-profile',
    component: () => import('@/views/volunteer/VolunteerProfileView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['volunteer', 'coordinator', 'admin'],
      title: 'Hồ sơ cá nhân – Tình nguyện viên',
    },
  },

  // ────────────────────────────────────────────────────────────
  //  COORDINATOR – coordinator | admin
  // ────────────────────────────────────────────────────────────
  {
    path: '/coordinator',
    name: 'coordinator-dashboard',
    component: () => import('@/views/coordinator/CoordinatorDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['coordinator', 'admin'],
      title: 'Dashboard – Điều phối viên',
    },
  },

  // ────────────────────────────────────────────────────────────
  //  ADMIN – admin only
  // ────────────────────────────────────────────────────────────
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Dashboard – Quản trị',
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/admin/UsersView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Quản lý người dùng',
    },
  },

  // ────────────────────────────────────────────────────────────
  //  ERROR PAGES
  // ────────────────────────────────────────────────────────────
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/shared/UnauthorizedView.vue'),
    meta: { title: 'Không có quyền truy cập' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/shared/NotFoundView.vue'),
    meta: { title: 'Trang không tồn tại' },
  },
]

// ── Router instance ──────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// ── Global auth + RBAC guard ─────────────────────────────────
router.beforeEach((to) => {
  const isLoggedIn = tokenStorage.exists()

  // Đọc role từ user đã persist trong localStorage
  let userRole: UserRole | null = null
  try {
    const raw = localStorage.getItem('auth_user')
    if (raw) userRole = (JSON.parse(raw) as { role: UserRole }).role
  } catch { /* ignore */ }

  // 1. guestOnly → đã login → về /home
  if (to.meta.guestOnly && isLoggedIn) {
    return { name: 'home' }
  }

  // 2. requiresAuth → chưa login → về /login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. roles[] → kiểm tra role
  if (to.meta.roles && to.meta.roles.length > 0 && isLoggedIn) {
    if (!userRole || !to.meta.roles.includes(userRole)) {
      return { name: 'unauthorized' }
    }
  }
})

// ── Update document title ────────────────────────────────────
router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} | ReliefConnect` : 'ReliefConnect'
})

export default router