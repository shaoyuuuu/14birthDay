<template>
  <div class="profile-page">
    <div v-if="!canViewProfile" class="permission-denied">
      <el-icon :size="48">
        <Lock />
      </el-icon>
      <h3>您没有权限访问此页面</h3>
      <p>需要权限: profile:view</p>
    </div>

    <div v-else class="profile-container">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar">
            <el-icon :size="48">
              <User />
            </el-icon>
          </div>
          <div class="avatar-actions">
            <el-button size="small" type="primary" plain>更换头像</el-button>
          </div>
        </div>
        <div class="user-info">
          <h2 class="username">{{ authStore.user?.username }}</h2>
          <p class="user-email">{{ authStore.user?.email }}</p>
          <el-tag v-if="authStore.isAdmin" type="danger" size="small">管理员</el-tag>
          <el-tag v-else-if="authStore.isEditor" type="warning" size="small">编辑者</el-tag>
          <el-tag v-else type="info" size="small">访客</el-tag>
        </div>
      </div>

      <div class="profile-content">
        <el-tabs v-model="activeTab" stretch>
          <el-tab-pane label="基本信息" name="basic">
            <el-form :model="profileForm" label-width="80px" class="profile-form">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile" :loading="loading">
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="修改密码" name="password">
            <el-form :model="passwordForm" label-width="80px" class="profile-form">
              <el-form-item label="当前密码">
                <el-input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="新密码">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changePassword" :loading="loading">
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane
            label="权限信息"
            name="permissions"
            v-if="authStore.isAdmin || authStore.isEditor"
          >
            <div class="permissions-info">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="角色">
                  <el-tag v-if="authStore.isAdmin" type="danger">管理员</el-tag>
                  <el-tag v-else-if="authStore.isEditor" type="warning">编辑者</el-tag>
                  <el-tag v-else type="info">访客</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="权限列表">
                  <div class="permission-list">
                    <el-tag
                      v-for="permission in allPermissions"
                      :key="permission.key"
                      :type="hasPermission(permission.key) ? 'success' : 'info'"
                      size="small"
                      style="margin: 4px"
                    >
                      {{ permission.label }}
                    </el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="profile-actions">
        <el-button type="danger" @click="handleLogout" plain>
          退出登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import * as api from '../api'

const router = useRouter()
const authStore = useAuthStore()

const canViewProfile = computed(() => authStore.hasPermission('profile:view'))

const activeTab = ref('basic')
const loading = ref(false)

const profileForm = reactive({
  username: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const allPermissions = [
  { key: 'dashboard:view', label: '查看仪表板' },
  { key: 'visits:view', label: '查看访问统计' },
  { key: 'messages:view', label: '查看留言' },
  { key: 'messages:delete', label: '删除留言' },
  { key: 'memories:view', label: '查看回忆' },
  { key: 'memories:create', label: '创建回忆' },
  { key: 'memories:edit', label: '编辑回忆' },
  { key: 'memories:delete', label: '删除回忆' },
  { key: 'profile:view', label: '查看个人信息' },
  { key: 'profile:edit', label: '编辑个人信息' },
  { key: 'users:view', label: '查看用户' },
  { key: 'users:edit', label: '编辑用户' },
  { key: 'users:delete', label: '删除用户' },
  { key: 'roles:view', label: '查看角色' },
  { key: 'roles:edit', label: '编辑角色' }
]

function hasPermission(key: string): boolean {
  return authStore.hasPermission(key)
}

onMounted(() => {
  if (authStore.user) {
    profileForm.username = authStore.user.username
    profileForm.email = authStore.user.email
  }
})

async function updateProfile() {
  if (!profileForm.username || !profileForm.email) {
    ElMessage.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    const response = await api.user.updateProfile({
      username: profileForm.username,
      email: profileForm.email
    })
    ElMessage.success('个人信息更新成功')

    if (authStore.user) {
      authStore.user = response.data.data.user
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '更新失败')
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    ElMessage.warning('新密码长度不能少于6位')
    return
  }

  loading.value = true
  try {
    await api.user.updatePassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')

    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '密码修改失败')
  } finally {
    loading.value = false
  }
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
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: $bg-secondary;
  padding: $space-6;
  padding-bottom: calc($space-6 + 60px);
}

.permission-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: $text-tertiary;

  h3 {
    margin: $space-4 0 $space-2 0;
    font-size: $text-lg;
    color: $text-primary;
  }

  p {
    margin: 0;
    font-size: $text-sm;
  }
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: $bg-elevated;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: $space-6;
  padding: $space-8;
  background: $gradient-primary;
  color: $text-inverse;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    text-align: center;
    padding: $space-6;
    gap: $space-4;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: $radius-full;
  background: $bg-elevated;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-primary;
  box-shadow: $shadow-lg;
}

.avatar-actions {
  :deep(.el-button) {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: $text-inverse;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
}

.user-info {
  flex: 1;

  .username {
    margin: 0 0 $space-2 0;
    font-size: $text-2xl;
    font-weight: $font-bold;
  }

  .user-email {
    margin: 0 0 $space-3 0;
    font-size: $text-base;
    opacity: 0.9;
  }
}

.profile-content {
  padding: $space-8;
}

.profile-form {
  max-width: 500px;
  margin: 0 auto;

  :deep(.el-form-item__label) {
    font-weight: $font-medium;
  }
}

.permissions-info {
  .permission-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }
}

.profile-actions {
  padding: $space-6;
  border-top: 1px solid $border-primary;
  display: flex;
  justify-content: center;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__item) {
  font-size: $text-base;
}

@media (max-width: $breakpoint-sm) {
  .profile-page {
    padding: $space-4;
    padding-bottom: calc($space-4 + 60px);
  }

  .profile-container {
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
  }

  .profile-header {
    padding: $space-5;
    gap: $space-3;
  }

  .avatar {
    width: 64px;
    height: 64px;
  }

  .user-info {
    .username {
      font-size: $text-xl;
      margin: 0 0 $space-1 0;
    }

    .user-email {
      font-size: $text-sm;
      margin: 0 0 $space-2 0;
    }
  }

  .profile-content {
    padding: $space-5;
  }

  .profile-form {
    max-width: 100%;
  }

  .profile-actions {
    padding: $space-4;
  }
}
</style>