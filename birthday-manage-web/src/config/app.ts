export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const APP_CONFIG = {
  title: '生日祝福管理系统',
  version: '1.0.0',
  
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
  
  upload: {
    maxFileSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  cache: {
    tokenKey: 'token',
    userKey: 'user',
  },
}

export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  users: '/users',
  memories: '/memories',
  messages: '/messages',
  profile: '/profile',
} as const

export const PERMISSIONS = {
  users: {
    view: 'users:view',
    manage: 'users:manage',
    edit: 'users:edit',
    delete: 'users:delete',
  },
  messages: {
    view: 'messages:view',
    manage: 'messages:manage',
  },
  memories: {
    view: 'memories:view',
    manage: 'memories:manage',
  },
} as const
