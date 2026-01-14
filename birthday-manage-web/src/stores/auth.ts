import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../api'
import type { User } from '../types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const userRole = computed(() => user.value?.role || 'viewer')

  const userPermissions = computed(() => user.value?.permissions || [])

  const isAdmin = computed(() => userRole.value === 'admin')

  const isEditor = computed(() => ['admin', 'editor'].includes(userRole.value))

  function hasPermission(permission: string): boolean {
    if (isAdmin.value) return true
    return userPermissions.value.includes(permission)
  }

  function hasAnyPermission(permissions: string[]): boolean {
    if (isAdmin.value) return true
    return permissions.some(p => userPermissions.value.includes(p))
  }

  function hasAllPermissions(permissions: string[]): boolean {
    if (isAdmin.value) return true
    return permissions.every(p => userPermissions.value.includes(p))
  }

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.auth.login({ username, password })
      token.value = response.data.data.token
      user.value = response.data.data.user
      localStorage.setItem('token', response.data.data.token)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(username: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.auth.register({ username, email, password })
      token.value = response.data.data.token
      user.value = response.data.data.user
      localStorage.setItem('token', response.data.data.token)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function verify() {
    if (!token.value) return false

    try {
      const response = await api.auth.verify()
      user.value = response.data.data.user
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    userPermissions,
    isAdmin,
    isEditor,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    register,
    verify,
    logout,
  }
})
