import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { ApiResponse } from '../types/api'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message } = response.data

    if (code === 200) {
      return response
    } else {
      return Promise.reject({
        response: {
          ...response,
          data: {
            code,
            message,
            error: message,
          },
        },
      })
    }
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    const errorData = error.response?.data || {}
    const errorMessage = errorData.message || errorData.error || '请求失败'

    return Promise.reject({
      ...error,
      response: {
        ...error.response,
        data: {
          code: errorData.code || error.response?.status || 500,
          message: errorMessage,
          error: errorMessage,
        },
      },
    })
  }
)

export default api
