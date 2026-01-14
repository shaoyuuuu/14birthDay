import api from '../utils/api'
import type { ApiResponse, User, UpdatePasswordRequest, UpdateProfileRequest } from '../types/api'

export function getProfile() {
  return api.get<ApiResponse<{ user: User }>>('/user/profile')
}

export function updateProfile(data: UpdateProfileRequest) {
  return api.put<ApiResponse<{ user: User }>>('/user/profile', data)
}

export function updatePassword(data: UpdatePasswordRequest) {
  return api.put<ApiResponse<void>>('/user/password', data)
}
