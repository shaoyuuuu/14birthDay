import { apiClient } from './apiClient'
import type { User, Role, CreateUserData, UpdateUserData, PaginationParams, PaginatedResponse } from '@/types'

export const userService = {
  async getUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params })
    return response.data
  },

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`/users/${id}`)
    return response.data.user
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<{ user: User }>('/users', data)
    return response.data.user
  },

  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<{ user: User }>(`/users/${id}`, data)
    return response.data.user
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },

  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<{ roles: Role[] }>('/users/roles')
    return response.data.roles
  },
}
