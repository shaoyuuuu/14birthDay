import api from '../utils/api'
import type { ApiResponse, Visit, VisitStats, DailyStat, TopPage } from '../types/api'

export function getVisits(params?: { start_date?: string; end_date?: string; limit?: number; offset?: number }) {
  return api.get<ApiResponse<{ visits: Visit[]; pagination: { total: number; limit: number; offset: number } }>>('/visits', { params })
}

export function getVisitStats(days: number = 30) {
  return api.get<ApiResponse<{ stats: VisitStats; daily: DailyStat[]; topPages: TopPage[] }>>('/visits/stats', { params: { days } })
}

export function recordVisit(data: { ip_address: string; user_agent: string; page_url: string; referrer: string }) {
  return api.post<ApiResponse<{ visit: Visit }>>('/visits', data)
}
