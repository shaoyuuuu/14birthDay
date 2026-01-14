<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { RouterView } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const activeTab = computed(() => route.name)

const tabs = [
  { name: 'visits', label: '访问统计', icon: '📊' },
  { name: 'messages', label: '留言管理', icon: '💬' },
  { name: 'memories', label: '回忆管理', icon: '📸' }
]

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
  }
}

function navigateTo(tabName: string) {
  router.push({ name: tabName })
  if (window.innerWidth < 768) {
    sidebarOpen.value = false
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>
      
      <aside class="sidebar" :class="{ active: sidebarOpen }">
        <div class="sidebar-header">
          <h2>管理后台</h2>
          <button class="close-sidebar" @click="sidebarOpen = false" v-if="sidebarOpen">
            ✕
          </button>
        </div>
        
        <div class="user-info">
          <div class="user-avatar">
            👤
          </div>
          <div class="user-details">
            <p class="user-name">{{ authStore.user?.username }}</p>
            <p class="user-email">{{ authStore.user?.email }}</p>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            class="nav-item"
            :class="{ active: activeTab === tab.name }"
            @click="navigateTo(tab.name)"
          >
            <span class="nav-icon">{{ tab.icon }}</span>
            <span class="nav-label">{{ tab.label }}</span>
          </button>
        </nav>
        
        <div class="sidebar-footer">
          <button class="logout-button" @click="handleLogout">
            <span>🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>
      
      <main class="main-content">
        <header class="main-header">
          <button class="menu-toggle" @click="toggleSidebar">
            ☰
          </button>
          <h1 class="page-title">{{ tabs.find(t => t.name === activeTab)?.label }}</h1>
        </header>
        
        <div class="content-area">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
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
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 999;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.close-sidebar {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  color: #666;
}

.user-info {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  font-size: 15px;
  text-align: left;
}

.nav-item:hover {
  background: #f5f7fa;
  color: #667eea;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-weight: 500;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  font-size: 15px;
}

.logout-button:hover {
  border-color: #ff4757;
  color: #ff4757;
  background: #fff5f5;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-header {
  background: white;
  padding: 20px 32px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  color: #666;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.content-area {
  flex: 1;
  padding: 32px;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.active {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .content-area {
    padding: 20px 16px;
  }
  
  .main-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
  }
  
  .sidebar-header h2 {
    font-size: 18px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .content-area {
    padding: 16px 12px;
  }
}
</style>
