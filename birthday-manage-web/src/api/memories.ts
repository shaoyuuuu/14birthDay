import api from '../utils/api'
import type { ApiResponse, Memory, CreateMemoryRequest, UpdateMemoryRequest, PaginationParams } from '../types/api'

export function getMemories(params?: PaginationParams) {
  return api.get<ApiResponse<{ memories: Memory[]; total: number }>>('/memories', { params })
}

export function getMemory(id: number) {
  return api.get<ApiResponse<{ memory: Memory }>>(`/memories/${id}`)
}

export function createMemory(data: CreateMemoryRequest) {
  return api.post<ApiResponse<{ memory: Memory }>>('/memories', data)
}

export function updateMemory(id: number, data: UpdateMemoryRequest) {
  return api.put<ApiResponse<{ memory: Memory }>>(`/memories/${id}`, data)
}

export function deleteMemory(id: number) {
  return api.delete<ApiResponse<void>>(`/memories/${id}`)
}
