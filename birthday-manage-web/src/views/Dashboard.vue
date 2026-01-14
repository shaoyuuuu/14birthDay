<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="toggleSidebar"></div>

      <aside class="sidebar" :class="{ active: sidebarOpen }">
        <div class="sidebar-header">
          <div class="logo">
            <el-icon :size="32" color="#409eff">
              <DataLine />
            </el-icon>
            <span class="logo-text">生日管理</span>
          </div>
          <button class="close-btn" @click="toggleSidebar" v-if="isMobile">
            <el-icon :size="24">
              <Close />
            </el-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          <div v-for="item in menuItems" :key="item.name" class="nav-item" :class="{ active: activeTab === item.name }"
            @click="navigateTo(item.name)">
            <component :is="item.icon" class="nav-icon" />
            <span class="nav-label">{{ item.label }}</span>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <el-icon :size="24">
              <User />
            </el-icon>
            <div class="user-details">
              <div class="username">{{ authStore.user?.username }}</div>
              <div class="user-role">{{ userRoleLabel }}</div>
            </div>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出</span>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="main-header">
          <button class="menu-btn" @click="toggleSidebar" v-if="isMobile">
            <el-icon :size="24">
              <Menu />
            </el-icon>
          </button>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
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

function navigateTo(tabName: string) {
  router.push({ name: tabName })
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
@use '../styles/variables.scss' as *;

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
  width: $mobile-sidebar-width;
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
  padding: $spacing-lg;
  border-bottom: 1px solid $border-light;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-sm;
  }

  .logo-text {
    font-size: $font-size-large;
    font-weight: 600;
    color: $text-primary;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-large;
    }
  }
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: $text-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xs;
  border-radius: $border-radius-base;
  transition: all 0.3s;

  &:hover {
    background: $background-base;
    color: $text-primary;
  }

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.sidebar-nav {
  flex: 1;
  padding: $spacing-md;
  overflow-y: auto;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-sm;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-base;
  cursor: pointer;
  transition: all 0.3s;
  color: $text-secondary;
  margin-bottom: $spacing-xs;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    gap: $mobile-spacing-md;
    margin-bottom: $mobile-spacing-xs;
    border-radius: $mobile-border-radius-base;
  }

  &:hover {
    background: $background-base;
    color: $primary-color;
  }

  &.active {
    background: rgba(64, 158, 255, 0.1);
    color: $primary-color;
    font-weight: 500;
  }
}

.nav-icon {
  font-size: $font-size-medium;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-medium;
  }
}

.nav-label {
  font-size: $font-size-base;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-base;
  }
}

.sidebar-footer {
  padding: $spacing-md;
  border-top: 1px solid $border-light;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-md;
    margin-bottom: $mobile-spacing-md;
  }
}

.user-details {
  flex: 1;
  overflow: hidden;

  .username {
    font-size: $font-size-base;
    font-weight: 500;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-base;
    }
  }

  .user-role {
    font-size: $font-size-small;
    color: $text-secondary;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-small;
    }
  }
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: $background-base;
  border: 1px solid $border-base;
  border-radius: $border-radius-base;
  cursor: pointer;
  transition: all 0.3s;
  color: $text-secondary;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    gap: $mobile-spacing-sm;
    border-radius: $mobile-border-radius-base;
  }

  &:hover {
    background: $danger-color;
    border-color: $danger-color;
    color: $background-white;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  padding-bottom: $mobile-nav-height;

  @media (min-width: $breakpoint-sm) {
    margin-left: 280px;
    padding-bottom: 0;
  }
}

.main-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg $spacing-xl;
  background: $background-white;
  border-bottom: 1px solid $border-light;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md $mobile-spacing-lg;
    gap: $mobile-spacing-md;
  }
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: $text-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xs;
  border-radius: $border-radius-base;
  transition: all 0.3s;

  &:hover {
    background: $background-base;
    color: $text-primary;
  }

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.page-title {
  flex: 1;
  font-size: $font-size-large;
  font-weight: 600;
  color: $text-primary;
  margin: 0;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-large;
  }
}

.header-actions {
  display: flex;
  gap: $spacing-sm;

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-sm;
  }
}

.content-wrapper {
  flex: 1;
  padding: $spacing-xl;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
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
