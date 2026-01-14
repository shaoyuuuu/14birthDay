import api from '../utils/api'
import type { ApiResponse, Message, CreateMessageRequest, UpdateMessageRequest, PaginationParams } from '../types/api'

export function getMessages(params?: PaginationParams & { is_read?: boolean }) {
  return api.get<ApiResponse<{ messages: Message[]; total: number }>>('/messages', { params })
}

export function getMessage(id: number) {
  return api.get<ApiResponse<{ message: Message }>>(`/messages/${id}`)
}

export function createMessage(data: CreateMessageRequest) {
  return api.post<ApiResponse<{ message: Message }>>('/messages', data)
}

export function updateMessage(id: number, data: UpdateMessageRequest) {
  return api.put<ApiResponse<{ message: Message }>>(`/messages/${id}`, data)
}

export function deleteMessage(id: number) {
  return api.delete<ApiResponse<void>>(`/messages/${id}`)
}
