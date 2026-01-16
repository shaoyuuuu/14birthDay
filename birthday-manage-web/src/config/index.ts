export const APP_CONFIG = {
  name: 'Birthday Manage',
  version: '1.0.0',
  description: '生日管理系统',
  author: 'Birthday Team',
} as const

export const API_CONFIG = {
  baseURL: import.meta.env.DEV
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryTimes: 3,
  retryDelay: 1000,
} as const

export const STORAGE_CONFIG = {
  tokenKey: 'token',
  userKey: 'user',
  themeKey: 'theme',
  languageKey: 'language',
} as const

export const ROUTER_CONFIG = {
  mode: 'history',
  base: '/',
  scrollBehavior: (_to: any, _from: any, savedPosition: any) => {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
} as const

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const

export const UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const
