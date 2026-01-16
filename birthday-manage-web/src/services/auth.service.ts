import httpClient from './http'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from '@/types/api'

export const authService = {
  login(data: LoginRequest) {
    return httpClient.post<LoginResponse>('/auth/login', data)
  },

  register(data: RegisterRequest) {
    return httpClient.post<LoginResponse>('/auth/register', data)
  },

  verify() {
    return httpClient.get<{ user: User }>('/auth/verify')
  },

  updatePassword(data: UpdatePasswordRequest) {
    return httpClient.put<{ user: User }>('/auth/password', data)
  },

  updateProfile(data: UpdateProfileRequest) {
    return httpClient.put<{ user: User }>('/auth/profile', data)
  },

  logout() {
    return httpClient.post('/auth/logout')
  },
}
