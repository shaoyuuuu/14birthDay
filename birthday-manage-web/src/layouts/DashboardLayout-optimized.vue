<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo-icon">
            <el-icon :size="24">
              <DataLine />
            </el-icon>
          </div>
          <transition name="fade">
            <h1 v-if="!isCollapsed" class="app-name">生日管理</h1>
          </transition>
        </div>
        <button class="collapse-button" @click="toggleCollapse">
          <el-icon :size="20">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link v-for="item in navItems" :key="item.name" :to="item.path" class="nav-item"
          :class="{ active: isActive(item.path) }">
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          <transition name="fade">
            <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </transition>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            <el-icon :size="32">
              <User />
            </el-icon>
          </div>
          <transition name="fade">
            <div v-if="!isCollapsed" class="user-details">
              <p class="user-name">{{ authStore.user?.username || '用户' }}</p>
              <p class="user-role">{{ userRoleText }}</p>
            </div>
          </transition>
        </div>
        <RoleManager />
        <button class="logout-button" @click="handleLogout">
          <el-icon :size="20">
            <SwitchButton />
          </el-icon>
          <transition name="fade">
            <span v-if="!isCollapsed" class="logout-text">退出登录</span>
          </transition>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RoleManager from '@/components/RoleManager.vue'
import {
  DataLine,
  House,
  DataAnalysis,
  ChatDotRound,
  Document,
  User,
  Fold,
  Expand,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapsed = ref(false)

const navItems = computed(() => {
  const items = [
    { name: 'dashboard', label: '首页', path: '/', icon: House },
    { name: 'visits', label: '统计', path: '/visits', icon: DataAnalysis },
    { name: 'messages', label: '留言', path: '/messages', icon: ChatDotRound },
    { name: 'memories', label: '回忆', path: '/memories', icon: Document }
  ]

  // 只有管理员可以看到用户管理菜单
  if (authStore.hasPermission('users:view')) {
    items.push({ name: 'users', label: '用户管理', path: '/users', icon: User })
  }

  // 只有管理员可以看到角色管理菜单
  if (authStore.hasPermission('users:manage')) {
    items.push({ name: 'roles', label: '角色管理', path: '/roles', icon: User })
  }

  if (authStore.hasPermission('profile:view')) {
    items.push({ name: 'profile', label: '我的', path: '/profile', icon: User })
  }

  return items
})

const userRoleText = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return '管理员'
  if (role === 'editor') return '编辑者'
  return '访客'
})

function isActive(path: string) {
  return route.path === path
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
@use "@/styles/design-tokens.scss" as *;

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: $bg-secondary;
}

.sidebar {
  width: 280px;
  background: $bg-elevated;
  border-right: 1px solid $border-primary;
  display: flex;
  flex-direction: column;
  transition: width $duration-base $ease-in-out;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: $z-sticky;

  &.collapsed {
    width: 80px;

    .nav-label,
    .user-details,
    .logout-text {
      display: none;
    }

    .user-avatar {
      margin: 0 auto;
    }
  }
}

.sidebar-header {
  padding: $space-4;
  border-bottom: 1px solid $border-primary;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: $radius-md;
  color: $text-inverse;
  box-shadow: $shadow-sm;
}

.app-name {
  font-size: $text-lg;
  font-weight: $font-bold;
  color: $text-primary;
  margin: 0;
  letter-spacing: -0.5px;
}

.collapse-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  background: transparent;
  color: $text-secondary;
  transition: all $duration-base $ease-in-out;
  border: none;
  cursor: pointer;

  &:hover {
    background: $bg-secondary;
    color: $text-primary;
  }
}

.sidebar-nav {
  flex: 1;
  padding: $space-3;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3;
  border-radius: $radius-md;
  color: $text-secondary;
  text-decoration: none;
  transition: all $duration-base $ease-in-out;
  margin-bottom: $space-1;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) scaleX(0);
    width: 3px;
    height: 20px;
    background: $gradient-primary;
    border-radius: 0 3px 3px 0;
    transition: transform $duration-base $ease-in-out;
  }

  &:hover {
    background: $bg-secondary;
    color: $text-primary;

    &::before {
      transform: translateY(-50%) scaleX(1);
    }
  }

  &.active {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
    color: $color-primary;
    font-weight: $font-semibold;

    &::before {
      transform: translateY(-50%) scaleX(1);
    }
  }
}

.nav-label {
  font-size: $text-sm;
  font-weight: $font-medium;
}

.sidebar-footer {
  padding: $space-4;
  border-top: 1px solid $border-primary;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-secondary;
  border-radius: $radius-full;
  color: $text-inverse;
  box-shadow: $shadow-sm;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: $text-sm;
  font-weight: $font-semibold;
  color: $text-primary;
  margin: 0 0 $space-1 0;
}

.user-role {
  font-size: $text-xs;
  color: $text-tertiary;
  margin: 0;
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3;
  border-radius: $radius-md;
  background: transparent;
  color: $text-secondary;
  transition: all $duration-base $ease-in-out;
  border: none;
  cursor: pointer;
  margin-top: $space-3;

  &:hover {
    background: $bg-secondary;
    color: $color-danger;
  }
}

.logout-text {
  font-size: $text-sm;
  font-weight: $font-medium;
}

.main-content {
  flex: 1;
  overflow-x: hidden;
}

.content-wrapper {
  min-height: 100vh;
  background: $bg-secondary;
}

@media (max-width: $breakpoint-md) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: $z-modal;
    transform: translateX(-100%);
    transition: transform $duration-base $ease-in-out;

    &.mobile-open {
      transform: translateX(0);
    }
  }

  .main-content {
    margin-left: 0;
  }
}
</style>