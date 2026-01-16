<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { DataLine, TrendCharts, User, Loading, Lock } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useVisitStats } from '@/composables/useVisitStats'
import { useAuth } from '@/composables/useAuth'
import type { DailyStat, TopPage } from '@/types/api'

const { stats, dailyStats, topPages, recentVisits, loading, error: fetchError, fetchStats } = useVisitStats()
const { hasPermission } = useAuth()

const canViewVisits = computed(() => hasPermission('visits:view'))

const statCards = computed(() => [
  { label: '总访问量', value: stats.value?.total || 0 },
  { label: '最近30天', value: stats.value?.recent || 0 },
  { label: '独立访客', value: stats.value?.unique || 0 }
])

const visitChartRef = ref<HTMLElement>()
const pageChartRef = ref<HTMLElement>()
let visitChart: echarts.ECharts | null = null
let pageChart: echarts.ECharts | null = null

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

  const dates = dailyStats.value.map((d: DailyStat) => d.date)
  const counts = dailyStats.value.map((d: DailyStat) => d.count)

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
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: '访问量',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
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

  const pages = topPages.value.map((p: TopPage) => p.path)
  const counts = topPages.value.map((p: TopPage) => p.count)

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
        name: '访问量',
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

onMounted(async () => {
  await fetchStats()
  await nextTick()
  initVisitChart()
  initPageChart()

  window.addEventListener('resize', () => {
    visitChart?.resize()
    pageChart?.resize()
  })
})
</script>

<template>
  <div class="visits-page">
    <div class="visits-content">
      <div class="stats-grid">
        <div
          v-for="(card, index) in statCards"
          :key="card.label"
          class="stat-card"
        >
          <div class="stat-content">
            <div class="stat-icon" :class="`stat-icon-${index + 1}`">
              <el-icon :size="24">
                <DataLine v-if="index === 0" />
                <TrendCharts v-else-if="index === 1" />
                <User v-else />
              </el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">{{ card.label }}</p>
              <p class="stat-value">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <div class="card-header">
            <h3>访问趋势</h3>
          </div>
          <div class="chart-container">
            <div v-if="loading" class="loading-container">
              <el-icon class="is-loading" :size="40">
                <Loading />
              </el-icon>
              <p>加载中...</p>
            </div>
            <div v-else ref="visitChartRef" class="chart-wrapper"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h3>热门页面</h3>
          </div>
          <div class="chart-container">
            <div v-if="loading" class="loading-container">
              <el-icon class="is-loading" :size="40">
                <Loading />
              </el-icon>
              <p>加载中...</p>
            </div>
            <div v-else ref="pageChartRef" class="chart-wrapper"></div>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="card-header">
          <h3>最近访问</h3>
        </div>
        <div class="table-wrapper">
          <div v-if="!canViewVisits" class="permission-hint">
            <el-icon :size="48">
              <Lock />
            </el-icon>
            <p>您没有权限查看访问记录</p>
          </div>
          <el-table
            v-else
            :data="recentVisits"
            style="width: 100%"
            :loading="loading"
          >
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column prop="path" label="访问路径" min-width="200" />
            <el-table-column prop="userAgent" label="浏览器" width="100">
              <template #default="{ row }">
                {{ getBrowserName(row.userAgent) }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="访问时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/design-tokens.scss" as *;

.visits-page {
  padding: $space-6;
  padding-bottom: calc($space-6 + 60px);
  min-height: 100vh;
  background: $bg-secondary;
}

.visits-content {
  max-width: $container-2xl;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $space-6;
  margin-bottom: $space-8;
}

.stat-card {
  background: $bg-elevated;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  padding: $space-6;
  transition: all $duration-base $ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: $radius-lg;
  background: $gradient-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: $text-inverse;

  &.stat-icon-1 {
    background: $gradient-secondary;
  }

  &.stat-icon-2 {
    background: $gradient-success;
  }
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: $text-sm;
  color: $text-secondary;
  margin: 0 0 $space-1 0;
}

.stat-value {
  font-size: $text-2xl;
  font-weight: $font-bold;
  color: $text-primary;
  margin: 0;
  line-height: $leading-tight;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: $space-6;
  margin-bottom: $space-8;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: $bg-elevated;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  overflow: hidden;
  padding: $space-6;
}

.card-header {
  margin-bottom: $space-4;

  h3 {
    font-size: $text-lg;
    font-weight: $font-semibold;
    color: $text-primary;
    margin: 0;
  }
}

.chart-container {
  height: 400px;
  position: relative;

  @media (max-width: $breakpoint-md) {
    height: 300px;
  }

  @media (max-width: $breakpoint-sm) {
    height: 250px;
  }
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: $text-tertiary;

  p {
    margin-top: $space-2;
    font-size: $text-sm;
  }
}

.table-card {
  background: $bg-elevated;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  overflow: hidden;
  padding: $space-6;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

:deep(.el-table) {
  font-size: $text-sm;

  .el-table__header th {
    background: $bg-secondary;
    font-weight: $font-semibold;
    color: $text-primary;
  }

  .el-table__row {
    &:hover {
      background: $bg-secondary;
    }
  }
}

.permission-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-8;
  color: $text-tertiary;

  p {
    margin-top: $space-2;
    font-size: $text-sm;
  }
}

@media (max-width: $breakpoint-sm) {
  .visits-page {
    padding: $space-4;
    padding-bottom: calc($space-4 + 60px);
  }

  .stats-grid {
    gap: $space-4;
    margin-bottom: $space-6;
  }

  .stat-card {
    padding: $space-4;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-label {
    font-size: $text-xs;
  }

  .stat-value {
    font-size: $text-xl;
  }

  .charts-grid {
    gap: $space-4;
    margin-bottom: $space-6;
  }

  .chart-card,
  .table-card {
    padding: $space-4;
  }
}
</style>