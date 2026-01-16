import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermission() {
  const authStore = useAuthStore()

  const hasPermission = (permission: string): boolean => {
    return authStore.hasPermission(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => authStore.hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => authStore.hasPermission(permission))
  }

  const isAdmin = computed(() => {
    return authStore.user?.role === 'admin'
  })

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
  }
}
