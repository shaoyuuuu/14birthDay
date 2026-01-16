import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services'
import type { User, Role, PaginationParams, PaginatedResponse } from '@/types'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const roles = ref<Role[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentParams = ref<PaginationParams>({
    page: 1,
    pageSize: 10,
    keyword: '',
    role: '',
  })

  const fetchUsers = async (params?: Partial<PaginationParams>) => {
    try {
      loading.value = true
      currentParams.value = { ...currentParams.value, ...params }
      
      const response = await userService.getUsers(currentParams.value)
      users.value = response.list
      total.value = response.total
    } catch (error) {
      console.error('Fetch users error:', error)
      ElMessage.error('获取用户列表失败')
    } finally {
      loading.value = false
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await userService.getRoles()
      roles.value = response
    } catch (error) {
      console.error('Fetch roles error:', error)
      roles.value = [
        { value: 'admin', label: '管理员' },
        { value: 'editor', label: '编辑者' },
        { value: 'viewer', label: '访客' },
      ]
    }
  }

  const createUser = async (userData: any) => {
    try {
      loading.value = true
      await userService.createUser(userData)
      ElMessage.success('用户创建成功')
      await fetchUsers()
      return true
    } catch (error) {
      console.error('Create user error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: any) => {
    try {
      loading.value = true
      await userService.updateUser(id, userData)
      ElMessage.success('用户更新成功')
      await fetchUsers()
      return true
    } catch (error) {
      console.error('Update user error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    try {
      loading.value = true
      await userService.deleteUser(id)
      ElMessage.success('用户删除成功')
      await fetchUsers()
      return true
    } catch (error) {
      console.error('Delete user error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const resetParams = () => {
    currentParams.value = {
      page: 1,
      pageSize: 10,
      keyword: '',
      role: '',
    }
  }

  return {
    users,
    roles,
    total,
    loading,
    currentParams,
    fetchUsers,
    fetchRoles,
    createUser,
    updateUser,
    deleteUser,
    resetParams,
  }
})
