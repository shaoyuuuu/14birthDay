export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: {
    message: string
    code: string
    errors?: Array<{
      field: string
      message: string
    }>
  }
}

export interface PaginationParams {
  page: number
  pageSize: number
  keyword?: string
  role?: string
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface User {
  id: number
  username: string
  email: string
  role: string
  permissions?: string[]
  created_at: string
  updated_at?: string
}

export interface Role {
  value: string
  label: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role?: string
}

export interface UpdateUserData {
  username: string
  email: string
  role: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Memory {
  id: number
  title: string
  description: string
  images: string[]
  created_at: string
}

export interface Message {
  id: number
  content: string
  author: string
  created_at: string
}

export interface VisitStats {
  totalVisits: number
  todayVisits: number
  uniqueVisitors: number
  dailyData: Array<{
    date: string
    visits: number
  }>
}
