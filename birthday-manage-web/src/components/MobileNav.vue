<template>
  <div class="mobile-nav" v-if="isMobile">
    <div v-for="item in navItems" :key="item.name" class="nav-item" :class="{ active: isActive(item.name) }"
      @click="handleNav(item.name)">
      <div class="nav-icon-container">
        <component :is="item.icon" class="nav-icon" />
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ROUTE_NAMES } from '@/constants'
import { House, DataLine, Message, Document, User } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMobile = ref(false)

const navItems = computed(() => {
  const items = [
    { name: ROUTE_NAMES.DASHBOARD, label: '首页', icon: House },
    { name: ROUTE_NAMES.VISITS, label: '统计', icon: DataLine },
    { name: ROUTE_NAMES.MESSAGES, label: '留言', icon: Message },
    { name: ROUTE_NAMES.MEMORIES, label: '回忆', icon: Document }
  ]

  if (authStore.hasPermission('profile:view')) {
    items.push({ name: ROUTE_NAMES.PROFILE, label: '我的', icon: User })
  }

  return items
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function isActive(name: string) {
  return route.name === name
}

function handleNav(name: string) {
  if (route.name !== name) {
    router.push({ name })
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
@use "@/styles/design-tokens.scss" as *;

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: $z-sticky;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #9499a0;
  position: relative;
  min-width: 0;

  &:active {
    opacity: 0.7;
  }

  &.active {
    color: #fb7299;
  }
}

.nav-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
}

.nav-icon {
  font-size: 24px;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  transition: all 0.2s ease;
}

@media (min-width: $breakpoint-md) {
  .mobile-nav {
    display: none;
  }
}
</style>