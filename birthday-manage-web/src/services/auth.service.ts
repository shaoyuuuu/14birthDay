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
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/register', data)
    return response.data.data
  },

  async verify(): Promise<User> {
    const response = await httpClient.get<{ user: User }>('/auth/verify')
    return response.data.data.user
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<User> {
    const response = await httpClient.put<{ user: User }>('/auth/password', data)
    return response.data.data.user
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await httpClient.put<{ user: User }>('/auth/profile', data)
    return response.data.data.user
  },

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout')
  },
}
