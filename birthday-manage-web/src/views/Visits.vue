<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { DataLine, TrendCharts, User, Loading, Lock } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import * as api from '../api'
import { useAuthStore } from '../stores/auth'
import type { Visit, VisitStats, DailyStat, TopPage } from '../types/api'

const authStore = useAuthStore()

const visits = ref<Visit[]>([])
const stats = ref<VisitStats>({ total: 0, recent: 0, unique: 0 })
const dailyStats = ref<DailyStat[]>([])
const topPages = ref<TopPage[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const canViewVisits = computed(() => authStore.hasPermission('visits:view'))

const statCards = computed(() => [
  { label: '总访问量', value: stats.value.total },
  { label: '最近30天', value: stats.value.recent },
  { label: '独立访客', value: stats.value.unique }
])

const visitChartRef = ref<HTMLElement>()
const pageChartRef = ref<HTMLElement>()
let visitChart: echarts.ECharts | null = null
let pageChart: echarts.ECharts | null = null

async function fetchStats() {
  try {
    const response = await api.visits.getVisitStats()
    stats.value = response.data.data.stats
    dailyStats.value = response.data.data.daily
    topPages.value = response.data.data.topPages
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch stats'
  }
}

async function fetchVisits() {
  try {
    const response = await api.visits.getVisits({ limit: 50 })
    visits.value = response.data.data.visits
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch visits'
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

function initVisitChart() {
  if (!visitChartRef.value) return

  visitChart = echarts.init(visitChartRef.value)

  const dates = dailyStats.value.map(d => d.date)
  const counts = dailyStats.value.map(d => d.count)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        },
        barWidth: '60%'
      }
    ]
  }

  visitChart.setOption(option)
}

function initPageChart() {
  if (!pageChartRef.value) return

  pageChart = echarts.init(pageChartRef.value)

  const pages = topPages.value.slice(0, 5).map(p => p.page_url || '首页')
  const counts = topPages.value.slice(0, 5).map(p => p.count)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '页面访问',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pages.map((page, index) => ({
          value: counts[index],
          name: page
        }))
      }
    ]
  }

  pageChart.setOption(option)
}

function handleResize() {
  visitChart?.resize()
  pageChart?.resize()
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchStats(), fetchVisits()])
  loading.value = false

  await nextTick()
  initVisitChart()
  initPageChart()

  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div class="visits-page">
    <el-empty v-if="loading" description="加载中...">
      <el-icon class="is-loading" :size="32">
        <Loading />
      </el-icon>
    </el-empty>

    <el-empty v-else-if="!canViewVisits" description="您没有权限访问此页面">
      <el-icon :size="48" color="#909399">
        <Lock />
      </el-icon>
      <template #description>
        <p>您没有权限访问此页面</p>
        <p class="permission-hint">需要权限: visits:view</p>
      </template>
    </el-empty>

    <el-empty v-else-if="error" description="加载失败">
      <el-button type="primary" @click="fetchStats">重试</el-button>
    </el-empty>

    <div v-else class="visits-content">
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, index) in statCards" :key="index">
          <div class="stat-content">
            <div class="stat-icon" :class="`stat-icon-${index}`">
              <el-icon :size="28" color="white">
                <DataLine v-if="index === 0" />
                <TrendCharts v-else-if="index === 1" />
                <User v-else />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>每日访问量</span>
            </div>
          </template>
          <div ref="visitChartRef" class="chart-container"></div>
        </el-card>

        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>热门页面</span>
            </div>
          </template>
          <div ref="pageChartRef" class="chart-container"></div>
        </el-card>
      </div>

      <el-card class="table-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近访问记录</span>
          </div>
        </template>
        <div class="table-wrapper">
          <el-table :data="visits" stripe style="width: 100%">
            <el-table-column prop="visit_date" label="时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.visit_date) }}
              </template>
            </el-table-column>
            <el-table-column prop="ip_address" label="IP地址" width="140">
              <template #default="{ row }">
                {{ row.ip_address || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="user_agent" label="浏览器" width="120">
              <template #default="{ row }">
                {{ getBrowserName(row.user_agent) }}
              </template>
            </el-table-column>
            <el-table-column prop="page_url" label="页面">
              <template #default="{ row }">
                {{ row.page_url || '首页' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.visits-page {
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + $mobile-nav-height);
  min-height: 100vh;
  background: $background-base;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    padding-bottom: calc($mobile-spacing-lg + $mobile-nav-height);
  }
}

.visits-content {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $mobile-spacing-md;
    margin-bottom: $mobile-spacing-lg;
  }
}

.stat-card {
  background: $background-white;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-base;
  padding: $spacing-lg;
  transition: $transition-base;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    border-radius: $mobile-border-radius-base;
    box-shadow: $mobile-box-shadow-base;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $box-shadow-dark;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-sm;
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius-base;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: $breakpoint-sm) {
    width: 48px;
    height: 48px;
  }

  &.stat-icon-1 {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.stat-icon-2 {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
}

.stat-info {
  flex: 1;
  min-width: 0;

  .stat-label {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin: 0 0 $spacing-xs 0;

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-extra-small;
    }
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: $text-color-primary;
    margin: 0;
    line-height: 1.2;

    @media (max-width: $breakpoint-sm) {
      font-size: 24px;
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-md;
    margin-bottom: $mobile-spacing-lg;
  }
}

.chart-card {
  background: $background-white;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-base;
  overflow: hidden;

  @media (max-width: $breakpoint-sm) {
    border-radius: $mobile-border-radius-base;
    box-shadow: $mobile-box-shadow-base;
  }

  .card-header {
    font-size: $font-size-medium;
    font-weight: 600;
    color: $text-color-primary;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-medium;
    }
  }

  .chart-container {
    height: 350px;

    @media (max-width: $breakpoint-md) {
      height: 300px;
    }

    @media (max-width: $breakpoint-sm) {
      height: 250px;
    }
  }
}

.table-card {
  background: $background-white;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-base;
  overflow: hidden;

  @media (max-width: $breakpoint-sm) {
    border-radius: $mobile-border-radius-base;
    box-shadow: $mobile-box-shadow-base;
  }

  .card-header {
    font-size: $font-size-medium;
    font-weight: 600;
    color: $text-color-primary;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-medium;
    }
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    @media (max-width: $breakpoint-sm) {
      margin: 0 (-$mobile-spacing-md);
      padding: 0 $mobile-spacing-md;
    }
  }

  :deep(.el-table) {
    font-size: $font-size-base;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-base;
    }

    .el-table__header th {
      background: $background-base;
      font-weight: 600;
    }

    .el-table__row {
      &:hover {
        background: $background-base;
      }
    }
  }

  .permission-hint {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-top: $spacing-xs;

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-extra-small;
    }
  }
}
</style>
