import httpClient from './http'
import type { Message, CreateMessageRequest, UpdateMessageRequest, PaginationParams } from '@/types/api'

export const messageService = {
  getMessages(params?: PaginationParams) {
    return httpClient.get<{ list: Message[]; total: number }>('/messages', { params })
  },

  getMessageById(id: number) {
    return httpClient.get<Message>(`/messages/${id}`)
  },

  createMessage(data: CreateMessageRequest) {
    return httpClient.post<Message>('/messages', data)
  },

  updateMessage(id: number, data: UpdateMessageRequest) {
    return httpClient.put<Message>(`/messages/${id}`, data)
  },

  deleteMessage(id: number) {
    return httpClient.delete(`/messages/${id}`)
  },

  markAsRead(id: number) {
    return httpClient.put<Message>(`/messages/${id}/read`)
  },

  markAllAsRead() {
    return httpClient.put('/messages/read-all')
  },
}
