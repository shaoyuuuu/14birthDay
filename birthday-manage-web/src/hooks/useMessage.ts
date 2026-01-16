import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { MessageBoxData } from 'element-plus'

export function useMessage() {
  const success = (message: string, duration = 3000) => {
    ElMessage.success({ message, duration })
  }

  const error = (message: string, duration = 3000) => {
    ElMessage.error({ message, duration })
  }

  const warning = (message: string, duration = 3000) => {
    ElMessage.warning({ message, duration })
  }

  const info = (message: string, duration = 3000) => {
    ElMessage.info({ message, duration })
  }

  const confirm = (
    message: string,
    title = '提示',
    options = {}
  ): Promise<MessageBoxData> => {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      ...options,
    })
  }

  const alert = (
    message: string,
    title = '提示',
    type: 'success' | 'warning' | 'info' | 'error' = 'info'
  ): Promise<MessageBoxData> => {
    return ElMessageBox.alert(message, title, {
      confirmButtonText: '确定',
      type,
    })
  }

  const notify = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    duration = 3000
  ) => {
    ElNotification({
      title,
      message,
      type,
      duration,
    })
  }

  return {
    success,
    error,
    warning,
    info,
    confirm,
    alert,
    notify,
  }
}
