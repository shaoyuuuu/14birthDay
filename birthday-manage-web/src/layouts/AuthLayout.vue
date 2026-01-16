<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo">
          <el-icon class="logo-icon">
            <DataLine />
          </el-icon>
          <span class="logo-text">生日管理</span>
        </div>
        <h2 class="page-title">{{ pageTitle }}</h2>
      </div>
      <div class="auth-content">
        <RouterView />
      </div>
      <div class="auth-footer">
        <p>&copy; {{ currentYear }} 生日管理系统. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DataLine } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import { ROUTE_NAMES } from '@/constants'

const currentYear = computed(() => new Date().getFullYear())
const route = useRoute()

const pageTitle = computed(() => {
  return route.name === ROUTE_NAMES.LOGIN ? '管理员登录' : '管理员注册'
})
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.auth-header {
  padding: 30px 20px 20px;
  text-align: center;
  border-bottom: 1px solid #ebeef5;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;

    .logo-icon {
      font-size: 32px;
      color: #409EFF;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }
  }

  .page-title {
    font-size: 20px;
    font-weight: 500;
    color: #606266;
    margin: 0;
  }
}

.auth-content {
  padding: 30px;
}

.auth-footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #ebeef5;
  background: #f5f7fa;

  p {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}
</style>
