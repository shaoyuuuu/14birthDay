<template>
  <div class="dashboard-layout">
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

        <el-menu
          :default-active="activeTab"
          :collapse="false"
          :unique-opened="true"
          class="sidebar-menu"
          @select="handleMenuSelect"
          text-color="#606266"
          active-text-color="#409EFF"
          background-color="#ffffff"
        >
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
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables'
import { Menu, Close, User, Message, DataLine, Document, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()

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

const menuItems = computed(() => {
  const items = [
    { name: 'Dashboard', label: '仪表板', icon: DataLine },
  ]

  if (authStore.hasPermission('visits:view')) {
    items.push({ name: 'Visits', label: '访问统计', icon: Message })
  }

  if (authStore.hasPermission('messages:view')) {
    items.push({ name: 'Messages', label: '留言管理', icon: Message })
  }

  if (authStore.hasPermission('memories:view')) {
    items.push({ name: 'Memories', label: '回忆管理', icon: Document })
  }

  return items
})

const currentPageTitle = computed(() => {
  const item = menuItems.value.find((i) => i.name === route.name)
  return item?.label || '首页'
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleMenuSelect = (name: string) => {
  router.push({ name })
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
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
.dashboard-layout {
  min-height: 100vh;
  background: #f5f7fa;

  .dashboard-container {
    display: flex;
    min-height: 100vh;

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
      transition: all 0.3s ease;

      &.active {
        opacity: 1;
        visibility: visible;
      }
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 18vw;
      height: 100vh;
      background: #ffffff;
      box-shadow: 0 0.1vw 0.5vw rgba(0, 0, 0, 0.1);
      z-index: 999;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;

      @media (max-width: 768px) {
        transform: translateX(-100%);

        &.active {
          transform: translateX(0);
        }

        width: 70vw;
      }

      .sidebar-header {
        padding: 2vw;
        border-bottom: 0.1vw solid #ebeef5;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo {
          display: flex;
          align-items: center;
          gap: 1vw;

          .logo-icon {
            font-size: 2vw;
            color: #409EFF;
          }

          .logo-text {
            font-size: 1.5vw;
            font-weight: 600;
            color: #303133;
          }
        }

        .close-btn {
          .close-icon {
            font-size: 1.5vw;
          }
        }
      }

      .sidebar-menu {
        flex: 1;
        border: none;
        overflow-y: auto;
        padding: 1vw 0;

        :deep(.el-menu-item) {
          height: 4vw;
          line-height: 4vw;
          font-size: 1vw;
          margin: 0.5vw 1vw;
          border-radius: 0.5vw;

          &:hover {
            background: #f5f7fa;
          }

          &.is-active {
            background: #ecf5ff;
            color: #409EFF;
          }

          .el-icon {
            margin-right: 0.5vw;
            font-size: 1.2vw;
          }
        }
      }

      .sidebar-footer {
        padding: 1.5vw;
        border-top: 0.1vw solid #ebeef5;

        .user-card {
          margin-bottom: 1vw;

          .user-info {
            display: flex;
            align-items: center;
            gap: 1vw;

            .user-details {
              flex: 1;

              .username {
                font-size: 1vw;
                font-weight: 500;
                color: #303133;
                margin-bottom: 0.3vw;
              }
            }
          }
        }

        .logout-btn {
          width: 100%;
        }
      }
    }

    .main-content {
      flex: 1;
      margin-left: 18vw;
      display: flex;
      flex-direction: column;
      min-height: 100vh;

      @media (max-width: 768px) {
        margin-left: 0;
      }

      .main-header {
        background: #ffffff;
        padding: 1.5vw 2vw;
        box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .menu-btn {
          margin-right: 1vw;

          .menu-icon {
            font-size: 1.5vw;
          }
        }

        .header-actions {
          display: flex;
          gap: 1vw;
        }
      }

      .content-wrapper {
        flex: 1;
        padding: 2vw;
      }
    }
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

@media (max-width: 768px) {
  .dashboard-layout {
    .dashboard-container {
      .sidebar {
        .sidebar-header {
          padding: 4vw;

          .logo {
            .logo-icon {
              font-size: 4vw;
            }

            .logo-text {
              font-size: 3vw;
            }
          }

          .close-btn {
            .close-icon {
              font-size: 3vw;
            }
          }
        }

        .sidebar-menu {
          :deep(.el-menu-item) {
            height: 8vw;
            line-height: 8vw;
            font-size: 2vw;
            margin: 1vw 2vw;
            border-radius: 1vw;

            .el-icon {
              font-size: 2.5vw;
            }
          }
        }

        .sidebar-footer {
          padding: 3vw;

          .user-card {
            .user-info {
              .user-details {
                .username {
                  font-size: 2vw;
                }
              }
            }
          }
        }
      }

      .main-content {
        .main-header {
          padding: 3vw 4vw;

          .menu-btn {
            .menu-icon {
              font-size: 3vw;
            }
          }
        }

        .content-wrapper {
          padding: 4vw;
        }
      }
    }
  }
}
</style>
