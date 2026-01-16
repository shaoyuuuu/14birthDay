import { ref } from 'vue'
import { roleService } from '@/services'
import { useMessage } from '@/hooks'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/api'

export function useRoleList() {
  const { success, error: showError, confirm } = useMessage()

  const roles = ref<Role[]>([])
  const loading = ref(false)
  const total = ref(0)
  const fetchError = ref<string | null>(null)

  const fetchRoles = async (params?: { page?: number; pageSize?: number }) => {
    loading.value = true
    fetchError.value = null
    try {
      const response = await roleService.getRoles(params)
      roles.value = response.data.data?.roles || []
      total.value = response.data.data?.roles?.length || 0
    } catch (err: any) {
      fetchError.value = err.response?.data?.message || '获取角色列表失败'
      showError(err.response?.data?.message || '获取角色列表失败')
    } finally {
      loading.value = false
    }
  }

  const createRole = async (data: CreateRoleRequest) => {
    loading.value = true
    try {
      const response = await roleService.createRole(data)
      success('角色创建成功')
      await fetchRoles()
      return response.data
    } catch (err: any) {
      showError(err.response?.data?.message || '创建失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (id: number, data: UpdateRoleRequest) => {
    loading.value = true
    try {
      const response = await roleService.updateRole(id, data)
      success('角色更新成功')
      await fetchRoles()
      return response.data
    } catch (err: any) {
      showError(err.response?.data?.message || '更新失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRole = async (id: number) => {
    try {
      await confirm('确定要删除这个角色吗？', '删除确认')
      await roleService.deleteRole(id)
      success('删除成功')
      await fetchRoles()
      return true
    } catch (err: any) {
      if (err !== 'cancel') {
        showError(err.response?.data?.message || '删除失败')
      }
      return false
    }
  }

  return {
    roles,
    loading,
    total,
    error: fetchError,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  }
}
