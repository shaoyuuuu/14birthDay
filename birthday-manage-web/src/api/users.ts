import api from '../utils/api'
import type { ApiResponse, User, PaginationParams, PaginationResponse } from '../types/api'

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  role?: string
}

export function getUsers(params?: PaginationParams) {
  return api.get<ApiResponse<PaginationResponse<User>>>('/users', { params })
}

export function getUser(id: number) {
  return api.get<ApiResponse<{ user: User }>>(`/users/${id}`)
}

export function createUser(data: CreateUserRequest) {
  return api.post<ApiResponse<{ user: User }>>('/users', data)
}

export function updateUser(id: number, data: UpdateUserRequest) {
  return api.put<ApiResponse<{ user: User }>>(`/users/${id}`, data)
}

export function deleteUser(id: number) {
  return api.delete<ApiResponse<void>>(`/users/${id}`)
}

export function getUserRoles() {
  return api.get<ApiResponse<{ roles: { value: string; label: string }[] }>>('/users/roles')
}