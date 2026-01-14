<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../utils/api'

interface Visit {
  id: number
  ip_address: string
  user_agent: string
  visit_date: string
  page_url: string
  referrer: string
}

interface Stats {
  total: number
  recent: number
  unique: number
}

interface DailyStat {
  date: string
  count: number
}

const visits = ref<Visit[]>([])
const stats = ref<Stats>({ total: 0, recent: 0, unique: 0 })
const dailyStats = ref<DailyStat[]>([])
const topPages = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchStats() {
  try {
    const response = await api.get('/visits/stats')
    stats.value = response.data.stats
    dailyStats.value = response.data.daily
    topPages.value = response.data.topPages
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch stats'
  }
}

async function fetchVisits() {
  try {
    const response = await api.get('/visits?limit=50')
    visits.value = response.data.visits
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch visits'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function getBrowserName(userAgent: string) {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Other'
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchStats(), fetchVisits()])
  loading.value = false
})
</script>

<template>
  <div class="visits-page">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="visits-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-label">总访问量</div>
            <div class="stat-value">{{ stats.total }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <div class="stat-label">最近30天</div>
            <div class="stat-value">{{ stats.recent }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-label">独立访客</div>
            <div class="stat-value">{{ stats.unique }}</div>
          </div>
        </div>
      </div>
      
      <div class="charts-section">
        <div class="chart-card">
          <h3>每日访问量</h3>
          <div class="daily-chart">
            <div
              v-for="day in dailyStats.slice(0, 14)"
              :key="day.date"
              class="chart-bar"
              :style="{ height: `${(day.count / Math.max(...dailyStats.map(d => d.count))) * 100}%` }"
            >
              <div class="bar-tooltip">
                <div class="tooltip-date">{{ day.date }}</div>
                <div class="tooltip-count">{{ day.count }} 次</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <h3>热门页面</h3>
          <div class="top-pages-list">
            <div
              v-for="(page, index) in topPages.slice(0, 5)"
              :key="index"
              class="top-page-item"
            >
              <div class="page-rank">{{ index + 1 }}</div>
              <div class="page-info">
                <div class="page-url">{{ page.page_url || '首页' }}</div>
                <div class="page-count">{{ page.count }} 次访问</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="visits-table-section">
        <h3>最近访问记录</h3>
        <div class="table-container">
          <table class="visits-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>IP地址</th>
                <th>浏览器</th>
                <th>页面</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="visit in visits" :key="visit.id">
                <td>{{ formatDate(visit.visit_date) }}</td>
                <td>{{ visit.ip_address || '-' }}</td>
                <td>{{ getBrowserName(visit.user_agent) }}</td>
                <td>{{ visit.page_url || '首页' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visits-page {
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #ff4757;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
}

.daily-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding-top: 20px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px 6px 0 0;
  min-height: 20px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.chart-bar:hover {
  transform: scaleY(1.05);
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  margin-bottom: 8px;
  z-index: 10;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip-date {
  margin-bottom: 4px;
}

.tooltip-count {
  font-weight: 600;
}

.top-pages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-page-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 10px;
}

.page-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.page-info {
  flex: 1;
}

.page-url {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-count {
  font-size: 12px;
  color: #666;
}

.visits-table-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.visits-table-section h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
}

.table-container {
  overflow-x: auto;
}

.visits-table {
  width: 100%;
  border-collapse: collapse;
}

.visits-table th,
.visits-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.visits-table th {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  background: #f5f7fa;
}

.visits-table td {
  font-size: 14px;
  color: #333;
}

.visits-table tr:hover {
  background: #f5f7fa;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .chart-card {
    padding: 20px;
  }
  
  .daily-chart {
    height: 150px;
  }
  
  .visits-table-section {
    padding: 20px;
  }
  
  .visits-table th,
  .visits-table td {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .chart-card {
    padding: 16px;
  }
  
  .daily-chart {
    height: 120px;
    gap: 4px;
  }
  
  .visits-table-section {
    padding: 16px;
  }
  
  .visits-table th,
  .visits-table td {
    padding: 8px;
    font-size: 12px;
  }
}
</style>
