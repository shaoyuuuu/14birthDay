import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'
import type { User } from '@/types'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const hasPermission = (permission: string): boolean => {
    if (!user.value) return false
    if (user.value.role === 'admin') return true
    
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'],
      editor: ['users:view', 'messages:manage', 'memories:manage', 'visits:view', 'profile:view'],
      viewer: ['users:view', 'messages:view', 'memories:view', 'visits:view', 'profile:view'],
    }
    
    const permissions = rolePermissions[user.value.role] || []
    return permissions.includes('*') || permissions.includes(permission)
  }

  const canEditUsers = computed(() => hasPermission('users:edit'))
  const canDeleteUsers = computed(() => hasPermission('users:delete'))
  const canManageUsers = computed(() => hasPermission('users:manage'))

  const login = async (username: string, password: string) => {
    try {
      loading.value = true
      const { user: userData, token: authToken } = await authService.login({ username, password })
      
      user.value = userData
      token.value = authToken
      
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      ElMessage.success('登录成功')
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      loading.value = true
      const { user: userData, token: authToken } = await authService.register({ username, email, password })
      
      user.value = userData
      token.value = authToken
      
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      ElMessage.success('注册成功')
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      ElMessage.success('已退出登录')
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Fetch current user error:', error)
      await logout()
    }
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (newUser: User) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    canEditUsers,
    canDeleteUsers,
    canManageUsers,
    hasPermission,
    login,
    register,
    logout,
    fetchCurrentUser,
    initializeAuth,
    setToken,
    setUser,
  }
})
