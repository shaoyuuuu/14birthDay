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
    const { success } = response.data

    if (success) {
      return response
    } else {
      return Promise.reject({
        response: {
          ...response,
          data: {
            ...response.data,
            error: response.data.message,
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
    const errorMessage = errorData.error?.message || errorData.message || '请求失败'

    return Promise.reject({
      ...error,
      response: {
        ...error.response,
        data: {
          ...errorData,
          message: errorMessage,
          error: errorMessage,
        },
      },
    })
  }
)

export default api
