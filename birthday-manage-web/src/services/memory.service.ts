import httpClient from './http'
import type { Memory, CreateMemoryRequest, UpdateMemoryRequest, PaginationParams } from '@/types/api'

export const memoryService = {
  getMemories(params?: PaginationParams) {
    return httpClient.get<{ list: Memory[]; total: number }>('/memories', { params })
  },

  getMemoryById(id: number) {
    return httpClient.get<Memory>(`/memories/${id}`)
  },

  createMemory(data: CreateMemoryRequest) {
    return httpClient.post<{ memory: Memory }>('/memories', data)
  },

  updateMemory(id: number, data: UpdateMemoryRequest) {
    return httpClient.put<Memory>(`/memories/${id}`, data)
  },

  deleteMemory(id: number) {
    return httpClient.delete(`/memories/${id}`)
  },
}
