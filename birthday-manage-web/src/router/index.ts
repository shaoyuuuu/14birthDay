import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
      redirect: '/visits',
      children: [
        {
          path: 'visits',
          name: 'visits',
          component: () => import('../views/Visits.vue'),
          meta: { permission: 'visits:view' }
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('../views/Messages.vue'),
          meta: { permission: 'messages:view' }
        },
        {
          path: 'memories',
          name: 'memories',
          component: () => import('../views/Memories.vue'),
          meta: { permission: 'memories:view' }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile.vue'),
          meta: { permission: 'profile:view' }
        }
      ]
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
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
