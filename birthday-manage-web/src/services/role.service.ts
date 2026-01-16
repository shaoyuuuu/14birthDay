import httpClient from './http'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/api'

export const roleService = {
  getRoles() {
    return httpClient.get<{ roles: Role[] }>('/roles')
  },

  getRoleById(id: number) {
    return httpClient.get<{ role: Role }>(`/roles/${id}`)
  },

  createRole(data: CreateRoleRequest) {
    return httpClient.post<{ role: Role }>('/roles', data)
  },

  updateRole(id: number, data: UpdateRoleRequest) {
    return httpClient.put<{ role: Role }>(`/roles/${id}`, data)
  },

  deleteRole(id: number) {
    return httpClient.delete(`/roles/${id}`)
  },
}
