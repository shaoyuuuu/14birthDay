export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  code?: string
  message: string
  error?: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface User {
  id: number
  username: string
  email: string
  role?: string
  permissions?: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Visit {
  id: number
  ip_address: string
  user_agent: string
  visit_date: string
  page_url: string
  referrer: string
}

export interface VisitStats {
  total: number
  recent: number
  unique: number
}

export interface DailyStat {
  date: string
  count: number
}

export interface TopPage {
  page_url: string
  count: number
}

export interface Message {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  is_read?: boolean
}

export interface Memory {
  id: number
  title: string
  description: string
  date: string
  image_url: string
  created_at: string
  updated_at?: string
}

export interface CreateMessageRequest {
  name: string
  email: string
  message: string
}

export interface UpdateMessageRequest {
  is_read?: boolean
}

export interface CreateMemoryRequest {
  title: string
  description: string
  date: string
  image_url?: string
}

export interface UpdateMemoryRequest {
  title?: string
  description?: string
  date?: string
  image_url?: string
}

export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  email?: string
  username?: string
}
