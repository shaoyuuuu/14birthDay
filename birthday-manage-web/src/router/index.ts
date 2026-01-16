import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout-optimized.vue'),
      children: [
        {
          path: '',
          name: ROUTE_NAMES.LOGIN,
          component: () => import('@/views/Login-optimized.vue'),
          meta: { requiresGuest: true },
        },
      ],
    },
    {
      path: '/register',
      component: () => import('@/layouts/AuthLayout-optimized.vue'),
      children: [
        {
          path: '',
          name: ROUTE_NAMES.REGISTER,
          component: () => import('@/views/Register-optimized.vue'),
          meta: { requiresGuest: true },
        },
      ],
    },
    {
      path: '/',
      name: ROUTE_NAMES.DASHBOARD,
      component: () => import('@/layouts/DashboardLayout-optimized.vue'),
      meta: { requiresAuth: true },
      redirect: '/visits',
      children: [
        {
          path: 'visits',
          name: ROUTE_NAMES.VISITS,
          component: () => import('@/views/Visits-optimized.vue'),
          meta: { permission: 'visits:view' },
        },
        {
          path: 'messages',
          name: ROUTE_NAMES.MESSAGES,
          component: () => import('@/views/Messages-optimized.vue'),
          meta: { permission: 'messages:view' },
        },
        {
          path: 'memories',
          name: ROUTE_NAMES.MEMORIES,
          component: () => import('@/views/Memories-optimized.vue'),
          meta: { permission: 'memories:view' },
        },
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => import('@/views/Profile-optimized.vue'),
          meta: { permission: 'profile:view' },
        },
        {
          path: 'users',
          name: ROUTE_NAMES.USERS,
          component: () => import('@/views/Users-optimized.vue'),
          meta: { permission: 'users:view' },
        },
        {
          path: 'roles',
          name: ROUTE_NAMES.ROLES,
          component: () => import('@/views/Roles-optimized.vue'),
          meta: { permission: 'users:view' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.NOT_FOUND,
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.token && !authStore.user) {
    authStore.initializeAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
    next('/')
  } else {
    next()
  }
})

export default router
