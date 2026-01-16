import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_CONFIG, STORAGE_CONFIG } from '@/config'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants'
import type { ApiResponse } from '@/types/api'

class HttpClient {
  private instance: AxiosInstance
  private retryTimes = 0
  private maxRetryTimes = API_CONFIG.retryTimes

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_CONFIG.tokenKey)
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { success, message } = response.data

        if (success) {
          return response
        } else {
          return Promise.reject({
            response: {
              ...response,
              data: {
                success: false,
                message,
                error: message,
              },
            },
          })
        }
      },
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true
          if (!originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/register')) {
            localStorage.removeItem(STORAGE_CONFIG.tokenKey)
            localStorage.removeItem(STORAGE_CONFIG.userKey)
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }

        if (this.shouldRetry(error) && this.retryTimes < this.maxRetryTimes) {
          this.retryTimes++
          await this.delay(API_CONFIG.retryDelay)
          return this.instance(originalRequest)
        }

        const errorData = error.response?.data || {}
        const errorMessage = errorData.message || errorData.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR

        return Promise.reject({
          ...error,
          response: {
            ...error.response,
            data: {
              success: false,
              message: errorMessage,
              error: errorMessage,
            },
          },
        })
      }
    )
  }

  private shouldRetry(error: any): boolean {
    return (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('timeout') ||
      error.message?.includes('Network Error')
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get<ApiResponse<T>>(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config)
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch<ApiResponse<T>>(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config)
  }
}

export const httpClient = new HttpClient()
export default httpClient
