import { ref } from 'vue'
import { messageService } from '@/services'
import { useMessage } from '@/hooks'
import type { Message as MessageType } from '@/types/api'

export function useMessageList() {
  const { success, error: showError, confirm } = useMessage()

  const messages = ref<MessageType[]>([])
  const loading = ref(false)
  const total = ref(0)
  const fetchError = ref<string | null>(null)

  const fetchMessages = async (params?: { page?: number; pageSize?: number }) => {
    loading.value = true
    fetchError.value = null
    try {
      const response = await messageService.getMessages(params)
      messages.value = response.data?.data?.list || []
      total.value = response.data?.data?.total || 0
    } catch (err: any) {
      fetchError.value = err.response?.data?.message || '获取留言列表失败'
      showError(err.response?.data?.message || '获取留言列表失败')
    } finally {
      loading.value = false
    }
  }

  const deleteMessage = async (id: number) => {
    try {
      await confirm('确定要删除这条留言吗？', '删除确认')
      await messageService.deleteMessage(id)
      success('删除成功')
      await fetchMessages()
      return true
    } catch (err: any) {
      if (err !== 'cancel') {
        showError(err.response?.data?.message || '删除失败')
      }
      return false
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await messageService.markAsRead(id)
      const message = messages.value.find(m => m.id === id)
      if (message) {
        message.is_read = true
      }
    } catch (err: any) {
      showError(err.response?.data?.message || '标记失败')
    }
  }

  const markAllAsRead = async () => {
    try {
      await messageService.markAllAsRead()
      messages.value.forEach(m => {
        m.is_read = true
      })
      success('全部标记为已读')
    } catch (err: any) {
      showError(err.response?.data?.message || '标记失败')
    }
  }

  return {
    messages,
    loading,
    total,
    error: fetchError,
    fetchMessages,
    deleteMessage,
    markAsRead,
    markAllAsRead,
  }
}
