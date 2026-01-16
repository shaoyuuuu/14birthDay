import { ref } from 'vue'
import { authService } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useMessage } from '@/hooks'

export function useAuth() {
  const authStore = useAuthStore()
  const { success, error } = useMessage()

  const loading = ref(false)

  const login = async (username: string, password: string) => {
    loading.value = true
    try {
      const response = await authService.login({ username, password })
      const { token, user } = response
      authStore.setToken(token)
      authStore.setUser(user)
      success('登录成功')
      return true
    } catch (err: any) {
      error(err.response?.data?.message || '登录失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    loading.value = true
    try {
      const response = await authService.register({ username, email, password })
      const { token, user } = response
      authStore.setToken(token)
      authStore.setUser(user)
      success('注册成功')
      return true
    } catch (err: any) {
      error(err.response?.data?.message || '注册失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      authStore.logout()
      success('已退出登录')
    }
  }

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    loading.value = true
    try {
      const response = await authService.updatePassword({ oldPassword, newPassword })
      authStore.setUser(response)
      success('密码修改成功')
      return true
    } catch (err: any) {
      error(err.response?.data?.message || '密码修改失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: { username?: string; email?: string }) => {
    loading.value = true
    try {
      const response = await authService.updateProfile(data)
      authStore.setUser(response)
      success('个人信息更新成功')
      return true
    } catch (err: any) {
      error(err.response?.data?.message || '个人信息更新失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const hasPermission = (permission: string): boolean => {
    return authStore.hasPermission(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return authStore.hasAnyPermission(permissions)
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return authStore.hasAllPermissions(permissions)
  }

  return {
    loading,
    login,
    register,
    logout,
    updatePassword,
    updateProfile,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}
