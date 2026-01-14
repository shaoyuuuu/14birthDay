<template>
  <div class="mobile-nav" v-if="isMobile">
    <div v-for="item in navItems" :key="item.name" class="nav-item" :class="{ active: isActive(item.name) }"
      @click="handleNav(item.name)">
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { House, DataLine, Message, Document, User } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMobile = computed(() => window.innerWidth < 768)

const navItems = computed(() => {
  const items = [
    { name: 'dashboard', label: '首页', icon: House },
    { name: 'visits', label: '统计', icon: DataLine },
    { name: 'messages', label: '留言', icon: Message },
    { name: 'memories', label: '回忆', icon: Document }
  ]

  if (authStore.hasPermission('profile:view')) {
    items.push({ name: 'profile', label: '我的', icon: User })
  }

  return items
})

function isActive(name: string) {
  return route.name === name
}

function handleNav(name: string) {
  router.push({ name })
}
</script>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $mobile-nav-height;
  background: $background-white;
  border-top: 1px solid $border-light;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  box-shadow: $mobile-box-shadow-base;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $mobile-spacing-xs;
  padding: $mobile-spacing-sm 0;
  cursor: pointer;
  transition: all 0.3s;
  color: $text-secondary;

  &:active {
    transform: scale(0.95);
  }

  &.active {
    color: $primary-color;
  }
}

.nav-icon {
  font-size: $mobile-font-size-large;
  transition: all 0.3s;
}

.nav-label {
  font-size: $mobile-font-size-extra-small;
  font-weight: 500;
  transition: all 0.3s;
}

@media (min-width: $breakpoint-sm) {
  .mobile-nav {
    display: none;
  }
}
</style>
