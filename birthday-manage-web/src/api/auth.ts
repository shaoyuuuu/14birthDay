import api from '../utils/api'
import type { ApiResponse, LoginRequest, RegisterRequest, LoginResponse, User } from '../types/api'

export function login(data: LoginRequest) {
  return api.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function register(data: RegisterRequest) {
  return api.post<ApiResponse<LoginResponse>>('/auth/register', data)
}

export function verify() {
  return api.get<ApiResponse<{ user: User }>>('/auth/verify')
}

export function logout() {
  return api.post<ApiResponse<void>>('/auth/logout')
}
