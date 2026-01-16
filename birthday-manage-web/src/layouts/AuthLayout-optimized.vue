<template>
  <div class="auth-layout">
    <div class="auth-background"></div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-section">
            <div class="logo-icon">
              <el-icon :size="32">
                <DataLine />
              </el-icon>
            </div>
            <div class="logo-text">
              <h1 class="app-name">生日管理</h1>
              <p class="app-subtitle">Birthday Management System</p>
            </div>
          </div>
        </div>

        <div class="auth-content">
          <RouterView />
        </div>

        <div class="auth-footer">
          <p class="footer-text">&copy; {{ currentYear }} 生日管理系统. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DataLine } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/constants'

const currentYear = computed(() => new Date().getFullYear())
const route = useRoute()

const pageTitle = computed(() => {
  return route.name === ROUTE_NAMES.LOGIN ? '欢迎回来' : '创建账户'
})

const pageSubtitle = computed(() => {
  return route.name === ROUTE_NAMES.LOGIN ? '登录您的账户以继续' : '填写信息以创建新账户'
})
</script>

<style scoped lang="scss">
// design-tokens.scss 已通过 vite.config.ts 全局注入

.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: $bg-secondary;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $gradient-primary;
  opacity: 0.05;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, $color-primary-light 0%, transparent 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    opacity: 0.3;
  }
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: $container-md;
  padding: $space-4;
}

.auth-card {
  background: $bg-elevated;
  border-radius: $radius-2xl;
  box-shadow: $shadow-xl;
  overflow: hidden;
  animation: slideUp 0.6s $ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  padding: $space-6 $space-6 $space-4;
  border-bottom: 1px solid $border-primary;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.logo-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: $radius-lg;
  color: $text-inverse;
  box-shadow: $shadow-md;
  transition: transform $duration-base $ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
}

.logo-text {
  flex: 1;
}

.app-name {
  font-size: $text-xl;
  font-weight: $font-bold;
  color: $text-primary;
  margin: 0 0 $space-1 0;
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: $text-sm;
  color: $text-secondary;
  margin: 0;
  font-weight: $font-normal;
}

.auth-content {
  padding: $space-6;
}

.auth-footer {
  padding: $space-4;
  background: $bg-secondary;
  border-top: 1px solid $border-primary;
  text-align: center;
}

.footer-text {
  font-size: $text-sm;
  color: $text-tertiary;
  margin: 0;
}

@media (max-width: $breakpoint-sm) {
  .auth-container {
    padding: $space-2;
  }

  .auth-card {
    border-radius: $radius-xl;
  }

  .auth-header {
    padding: $space-4 $space-4 $space-3;
  }

  .auth-content {
    padding: $space-4;
  }

  .logo-section {
    flex-direction: column;
    text-align: center;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
  }

  .app-name {
    font-size: $text-lg;
  }
}
</style>