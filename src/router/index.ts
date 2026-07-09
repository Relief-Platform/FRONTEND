import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { tokenStorage } from '@/lib/api/token-storage'

// ── Route definitions (lazy import) ─────────────────────────
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: { requiresAuth: true },
  },
  
  //ROUTER CỦA REQUESTER 
  {
    path: '/requester',
    name: 'requester-dashboard',
    component: () => import('@/views/RequesterDashboard.vue'),
    //meta: { requiresAuth: true }, 
  },
  {
    path: '/requester/create',
    name: 'create-request',
    component: () => import('@/views/CreateRequestView.vue'),
   //meta: { requiresAuth: true },
  },
{
    path: '/requester/notifications',
    name: 'requester-notifications',
    component: () => import('@/views/NotificationsView.vue'),
    // meta: { requiresAuth: true },
  },

  // ────────────────────────────────────────────────────────
  
  {
    // Catch-all 404
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// ── Global auth guard ────────────────────────────────────────
router.beforeEach((to) => {
  const isLoggedIn = tokenStorage.exists()

  // Trang yêu cầu đăng nhập → redirect về /login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Trang chỉ dành cho khách (login/register) → nếu đã login → vào /home
  if (to.meta.guestOnly && isLoggedIn) {
    return { name: 'home' }
  }
})

export default router