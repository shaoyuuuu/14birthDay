import { ref } from 'vue'
import { visitService } from '@/services'
import { useMessage } from '@/hooks'
import type { VisitStats, DailyStat, TopPage, Visit } from '@/types/api'

export function useVisitStats() {
  const { error: showError } = useMessage()

  const stats = ref<VisitStats | null>(null)
  const dailyStats = ref<DailyStat[]>([])
  const topPages = ref<TopPage[]>([])
  const recentVisits = ref<Visit[]>([])
  const loading = ref(false)
  const fetchError = ref<string | null>(null)

  const fetchStats = async () => {
    loading.value = true
    fetchError.value = null
    try {
      const response = await visitService.getStats()
      stats.value = response.data?.data || null
    } catch (err: any) {
      fetchError.value = err.response?.data?.message || '获取统计数据失败'
      showError(err.response?.data?.message || '获取统计数据失败')
    } finally {
      loading.value = false
    }
  }

  const fetchDailyStats = async (params?: { page?: number; pageSize?: number }) => {
    loading.value = true
    try {
      const response = await visitService.getDailyStats(params)
      dailyStats.value = response.data?.data?.list || []
    } catch (err: any) {
      showError(err.response?.data?.message || '获取每日统计失败')
    } finally {
      loading.value = false
    }
  }

  const fetchTopPages = async (params?: { page?: number; pageSize?: number }) => {
    loading.value = true
    try {
      const response = await visitService.getTopPages(params)
      topPages.value = response.data?.data?.list || []
    } catch (err: any) {
      showError(err.response?.data?.message || '获取热门页面失败')
    } finally {
      loading.value = false
    }
  }

  const fetchRecentVisits = async (params?: { page?: number; pageSize?: number }) => {
    loading.value = true
    try {
      const response = await visitService.getRecentVisits(params)
      recentVisits.value = response.data?.data?.list || []
    } catch (err: any) {
      showError(err.response?.data?.message || '获取最近访问失败')
    } finally {
      loading.value = false
    }
  }

  const fetchAllData = async () => {
    await Promise.all([fetchStats(), fetchDailyStats(), fetchTopPages(), fetchRecentVisits()])
  }

  return {
    stats,
    dailyStats,
    topPages,
    recentVisits,
    loading,
    error: fetchError,
    fetchStats,
    fetchDailyStats,
    fetchTopPages,
    fetchRecentVisits,
    fetchAllData,
  }
}
