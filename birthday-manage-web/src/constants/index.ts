export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请检查网络连接',
  TIMEOUT: '请求超时，请稍后重试',
  UNAUTHORIZED: '未授权，请重新登录',
  FORBIDDEN: '无权限访问',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNKNOWN_ERROR: '未知错误',
} as const

export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^1[3-9]\d{9}$/,
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export const USER_PERMISSIONS = {
  VIEW_DASHBOARD: 'dashboard:view',
  VIEW_VISITS: 'visits:view',
  VIEW_MESSAGES: 'messages:view',
  VIEW_MEMORIES: 'memories:view',
  VIEW_PROFILE: 'profile:view',
  MANAGE_MESSAGES: 'messages:manage',
  MANAGE_MEMORIES: 'memories:manage',
  MANAGE_USERS: 'users:manage',
  MANAGE_ROLES: 'roles:manage',
  VIEW_USERS: 'users:view',
  EDIT_USERS: 'users:edit',
  DELETE_USERS: 'users:delete',
} as const

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const

export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
} as const

export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const

export const ROUTE_NAMES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  DASHBOARD: 'Dashboard',
  VISITS: 'Visits',
  MESSAGES: 'Messages',
  MEMORIES: 'Memories',
  PROFILE: 'Profile',
  USERS: 'Users',
  ROLES: 'Roles',
  NOT_FOUND: 'NotFound',
} as const

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

export const SESSION_STORAGE_KEYS = {
  REDIRECT_URL: 'redirect_url',
} as const