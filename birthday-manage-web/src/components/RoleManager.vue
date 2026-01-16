<template>
  <div class="role-manager" v-if="!isMobile">
    <el-dropdown trigger="click">
      <el-button type="primary" size="small">
        角色管理 <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="changeRole('admin')">
            设置为管理员
          </el-dropdown-item>
          <el-dropdown-item @click="changeRole('editor')">
            设置为编辑者
          </el-dropdown-item>
          <el-dropdown-item @click="changeRole('user')">
            设置为用户
          </el-dropdown-item>
          <el-dropdown-item @click="changeRole('viewer')">
            设置为访客
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isMobile = computed(() => window.innerWidth < 768)

function changeRole(role: string) {
  if (authStore.user) {
    // 直接修改本地用户角色，仅用于测试
    authStore.setUser({
      ...authStore.user,
      role
    })
  }
}
</script>

<style scoped lang="scss">
.role-manager {
  width: 100%;
  margin: $space-3 0;

  :deep(.el-button) {
    width: 100%;
    justify-content: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: $font-medium;
  }

  :deep(.el-dropdown-menu) {
    min-width: 120px;
  }

  :deep(.el-dropdown-item) {
    font-size: $text-sm;
  }
}
</style>