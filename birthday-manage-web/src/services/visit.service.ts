import httpClient from './http'
import type { Visit, VisitStats, DailyStat, TopPage, PaginationParams } from '@/types/api'

export const visitService = {
  getStats() {
    return httpClient.get<VisitStats>('/visits/stats')
  },

  getDailyStats(params?: PaginationParams) {
    return httpClient.get<{ list: DailyStat[] }>('/visits/daily', { params })
  },

  getTopPages(params?: PaginationParams) {
    return httpClient.get<{ list: TopPage[] }>('/visits/top', { params })
  },

  getRecentVisits(params?: PaginationParams) {
    return httpClient.get<{ list: Visit[]; total: number }>('/visits/recent', { params })
  },

  getAllVisits(params?: PaginationParams) {
    return httpClient.get<{ list: Visit[]; total: number }>('/visits', { params })
  },
}
