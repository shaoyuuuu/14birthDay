import { ref, computed, onMounted } from 'vue'
import * as usersApi from '@/api/users'
import type { User, PaginationParams } from '@/types/api'
import { useMessage } from '@/hooks/useMessage'

export function useUserList() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
  const selectedRole = ref<string>('')
  const userRoles = ref<{ value: string; label: string }[]>([])

  const { success, error: showError } = useMessage()

  const fetchUsers = async (resetPage = false) => {
    if (resetPage) {
      currentPage.value = 1
    }

    loading.value = true
    error.value = null

    try {
      const params: PaginationParams = {
        page: currentPage.value,
        pageSize: pageSize.value,
      }

      if (searchQuery.value) {
        params.keyword = searchQuery.value
      }

      if (selectedRole.value) {
        params.role = selectedRole.value
      }

      const response = await usersApi.getUsers(params)
      users.value = response.data.data.list
      total.value = response.data.data.total
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取用户列表失败'
      showError(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchUserRoles = async () => {
    try {
      const response = await usersApi.getUserRoles()
      userRoles.value = response.data.data.roles
    } catch (err: any) {
      console.error('获取用户角色失败:', err)
      // 如果API请求失败，使用默认角色列表
      userRoles.value = [
        { value: 'admin', label: '管理员' },
        { value: 'editor', label: '编辑者' },
        { value: 'viewer', label: '访客' },
      ]
    }
  }

  const createUser = async (data: any) => {
    loading.value = true
    error.value = null

    try {
      await usersApi.createUser(data)
      success('用户创建成功')
      await fetchUsers(true)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '创建用户失败'
      showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: any) => {
    loading.value = true
    error.value = null

    try {
      await usersApi.updateUser(id, data)
      success('用户更新成功')
      await fetchUsers()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新用户失败'
      showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await usersApi.deleteUser(id)
      success('用户删除成功')
      await fetchUsers()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '删除用户失败'
      showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  const filteredUsers = computed(() => {
    return users.value
  })

  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  const handleSearch = () => {
    fetchUsers(true)
  }

  const handleReset = () => {
    searchQuery.value = ''
    selectedRole.value = ''
    fetchUsers(true)
  }

  const handlePageChange = (page: number) => {
    currentPage.value = page
    fetchUsers()
  }

  const handlePageSizeChange = (size: number) => {
    pageSize.value = size
    fetchUsers(true)
  }

  onMounted(() => {
    fetchUserRoles()
    fetchUsers()
  })

  return {
    users,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    totalPages,
    searchQuery,
    selectedRole,
    userRoles,
    filteredUsers,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    handleSearch,
    handleReset,
    handlePageChange,
    handlePageSizeChange,
  }
}
