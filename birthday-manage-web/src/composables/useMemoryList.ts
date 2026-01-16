import { ref } from 'vue'
import { memoryService } from '@/services'
import { useMessage } from '@/hooks'
import type { Memory } from '@/types/api'

export function useMemoryList() {
  const { success, error: showError, confirm } = useMessage()

  const memories = ref<Memory[]>([])
  const loading = ref(false)
  const total = ref(0)
  const fetchError = ref<string | null>(null)

  const fetchMemories = async (params?: { page?: number; pageSize?: number }) => {
    loading.value = true
    fetchError.value = null
    try {
      const response = await memoryService.getMemories(params)
      memories.value = response.data.data?.list || []
      total.value = response.data.data?.total || 0
    } catch (err: any) {
      fetchError.value = err.response?.data?.message || '获取回忆列表失败'
      showError(err.response?.data?.message || '获取回忆列表失败')
    } finally {
      loading.value = false
    }
  }

  const createMemory = async (data: {
    title: string
    description: string
    date: string
    image_url?: string
  }) => {
    loading.value = true
    try {
      const response = await memoryService.createMemory(data)
      return response
    } catch (err: any) {
      showError(err.response?.data?.message || '创建失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMemory = async (
    id: number,
    data: { title: string; description: string; date: string; image_url?: string }
  ) => {
    loading.value = true
    try {
      const response = await memoryService.updateMemory(id, data)
      return response
    } catch (err: any) {
      showError(err.response?.data?.message || '更新失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMemory = async (id: number) => {
    try {
      await confirm('确定要删除这条回忆吗？', '删除确认')
      await memoryService.deleteMemory(id)
      success('删除成功')
      await fetchMemories()
      return true
    } catch (err: any) {
      if (err !== 'cancel') {
        showError(err.response?.data?.message || '删除失败')
      }
      return false
    }
  }

  return {
    memories,
    loading,
    total,
    error: fetchError,
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
  }
}
