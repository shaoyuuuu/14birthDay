<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="toggleSidebar"></div>

      <aside class="sidebar" :class="{ active: sidebarOpen }">
        <div class="sidebar-header">
          <div class="logo">
            <el-icon class="logo-icon">
              <DataLine />
            </el-icon>
            <span class="logo-text">生日管理</span>
          </div>
          <el-button class="close-btn" @click="toggleSidebar" v-if="isMobile" text>
            <el-icon class="close-icon">
              <Close />
            </el-icon>
          </el-button>
        </div>

        <el-menu :default-active="activeTab" :collapse="false" :unique-opened="true" class="sidebar-menu"
          @select="handleMenuSelect" text-color="#606266" active-text-color="#409EFF" background-color="#ffffff">
          <el-menu-item v-for="item in menuItems" :key="item.name" :index="item.name">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">
          <el-card class="user-card" shadow="never">
            <div class="user-info">
              <el-avatar :size="40" :icon="User" />
              <div class="user-details">
                <div class="username">{{ authStore.user?.username }}</div>
                <el-tag :type="userRoleTagType" size="small">{{ userRoleLabel }}</el-tag>
              </div>
            </div>
          </el-card>
          <el-button class="logout-btn" type="danger" plain @click="handleLogout" :icon="SwitchButton">
            退出登录
          </el-button>
        </div>
      </aside>

      <main class="main-content">
        <header class="main-header">
          <el-button class="menu-btn" @click="toggleSidebar" v-if="isMobile" text>
            <el-icon class="menu-icon">
              <Menu />
            </el-icon>
          </el-button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="header-actions">
            <el-button circle @click="router.push('/profile')" v-if="authStore.hasPermission('profile:view')">
              <el-icon>
                <User />
              </el-icon>
            </el-button>
          </div>
        </header>

        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessageBox } from 'element-plus'
import { Menu, Close, User, Message, DataLine, Document, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const isMobile = ref(false)

const activeTab = computed(() => route.name as string)

const userRoleLabel = computed(() => {
  if (authStore.isAdmin) return '管理员'
  if (authStore.isEditor) return '编辑者'
  return '访客'
})

const userRoleTagType = computed(() => {
  if (authStore.isAdmin) return 'danger'
  if (authStore.isEditor) return 'warning'
  return 'info'
})

const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: '仪表板',
    visits: '访问统计',
    messages: '留言管理',
    memories: '回忆管理',
    profile: '个人信息'
  }
  return titles[activeTab.value] || '仪表板'
})

const menuItems = computed(() => {
  const items = [
    { name: 'visits', label: '访问统计', icon: DataLine, permission: 'visits:view' },
    { name: 'messages', label: '留言管理', icon: Message, permission: 'messages:view' },
    { name: 'memories', label: '回忆管理', icon: Document, permission: 'memories:view' }
  ]

  if (authStore.hasPermission('profile:view')) {
    items.push({ name: 'profile', label: '个人信息', icon: User, permission: 'profile:view' })
  }

  return items.filter(item => !item.permission || authStore.hasPermission(item.permission))
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    authStore.logout()
    router.push('/login')
  } catch {
  }
}

function handleMenuSelect(index: string) {
  router.push({ name: index })
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.dashboard {
  min-height: 100vh;
  background: $background-base;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;

  &.active {
    opacity: 1;
    visibility: visible;
  }

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.sidebar {
  width: 80vw;
  background: $background-white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 999;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  box-shadow: $box-shadow-dark;

  @media (min-width: $breakpoint-sm) {
    width: 280px;
    position: fixed;
    transform: translateX(0);
    box-shadow: none;
    border-right: 1px solid $border-light;
  }

  &.active {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4vw;
  border-bottom: 1px solid $border-light;
  height: 12vh;

  @media (min-width: $breakpoint-sm) {
    padding: 24px;
    height: 80px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 3vw;

  @media (min-width: $breakpoint-sm) {
    gap: 12px;
  }

  .logo-icon {
    font-size: 5vw;
    color: $primary-color;
    transition: all 0.3s ease;

    @media (min-width: $breakpoint-sm) {
      font-size: 24px;
    }
  }

  .logo-text {
    font-size: 5vw;
    font-weight: 600;
    color: $text-primary;
    letter-spacing: 0.05vw;

    @media (min-width: $breakpoint-sm) {
      font-size: 18px;
      letter-spacing: 0.5px;
    }
  }
}

.close-btn {
  padding: 2vw !important;

  .close-icon {
    font-size: 5vw;

    @media (min-width: $breakpoint-sm) {
      font-size: 20px;
    }
  }

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.sidebar-menu {
  flex: 1;
  border: none;
  padding: 2vw 0;

  :deep(.el-menu-item) {
    height: 10vh;
    line-height: 10vh;
    margin: 1vw 3vw;
    border-radius: 8px;
    font-size: 4.5vw;

    @media (min-width: $breakpoint-sm) {
      height: 50px;
      line-height: 50px;
      margin: 4px 12px;
      font-size: 15px;
    }

    &:hover {
      background-color: rgba(64, 158, 255, 0.1) !important;
    }

    &.is-active {
      background-color: rgba(64, 158, 255, 0.15) !important;
      font-weight: 500;
    }

    .el-icon {
      font-size: 5vw;
      margin-right: 3vw;

      @media (min-width: $breakpoint-sm) {
        font-size: 20px;
        margin-right: 12px;
      }
    }
  }
}

.sidebar-footer {
  padding: 3vw;
  border-top: 1px solid $border-light;

  @media (min-width: $breakpoint-sm) {
    padding: 16px;
  }
}

.user-card {
  margin-bottom: 3vw;
  border: none;

  @media (min-width: $breakpoint-sm) {
    margin-bottom: 12px;
  }

  :deep(.el-card__body) {
    padding: 3.5vw;

    @media (min-width: $breakpoint-sm) {
      padding: 14px;
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 3vw;

  @media (min-width: $breakpoint-sm) {
    gap: 12px;
  }
}

.user-details {
  flex: 1;
  overflow: hidden;

  .username {
    font-size: 4.5vw;
    font-weight: 500;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 1vw;

    @media (min-width: $breakpoint-sm) {
      font-size: 15px;
      margin-bottom: 4px;
    }
  }
}

.logout-btn {
  width: 100%;
  height: 8vh;
  font-size: 4.5vw;

  @media (min-width: $breakpoint-sm) {
    height: 44px;
    font-size: 15px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  padding-bottom: 60px;

  @media (min-width: $breakpoint-sm) {
    margin-left: 280px;
    padding-bottom: 0;
  }
}

.main-header {
  display: flex;
  align-items: center;
  gap: 3vw;
  padding: 4vw 5vw;
  background: $background-white;
  border-bottom: 1px solid $border-light;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 10vh;

  @media (min-width: $breakpoint-sm) {
    gap: 16px;
    padding: 20px 32px;
    height: 70px;
  }
}

.menu-btn {
  padding: 2vw !important;

  .menu-icon {
    font-size: 5vw;
    transition: all 0.3s ease;

    @media (min-width: $breakpoint-sm) {
      font-size: 20px;
    }
  }

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.header-actions {
  display: flex;
  gap: 2vw;

  @media (min-width: $breakpoint-sm) {
    gap: 8px;
  }
}

.content-wrapper {
  flex: 1;
  padding: 5vw;

  @media (min-width: $breakpoint-sm) {
    padding: 32px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
