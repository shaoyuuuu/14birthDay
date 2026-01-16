<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { computed, onMounted } from 'vue'
import MobileNav from './components/MobileNav.vue'

const authStore = useAuthStore()
const route = useRoute()

const isAuthPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <RouterView />
    <MobileNav v-if="!isAuthPage && authStore.isAuthenticated" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>
