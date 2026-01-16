<template>
  <div class="users-page">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog" v-if="canManageUsers">
        添加用户
      </el-button>
    </div>

    <div v-if="canViewUsers" class="users-content">
      <div class="filters-section">
        <el-form :inline="true" :model="filterForm" class="filters-form">
          <el-form-item label="搜索">
            <el-input v-model="filterForm.keyword" placeholder="输入用户名或邮箱" :prefix-icon="Search" clearable
              @keyup.enter="customHandleSearch" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="filterForm.role" placeholder="选择角色" clearable style="width: 150px">
              <el-option v-for="role in userRoles" :key="role.value" :label="role.label" :value="role.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="customHandleSearch">
              搜索
            </el-button>
            <el-button @click="customHandleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table-section">
        <el-table v-loading="loading" :data="filteredUsers" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" width="120">
            <template #default="scope">
              <el-tag :type="getRoleTagType(scope.row.role)" size="small">
                {{ getRoleLabel(scope.row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right" align="center">
            <template #default="scope">
              <el-space>
                <el-tooltip content="查看详情" placement="top">
                  <el-button type="primary" size="small" :icon="View" circle @click="viewUser(scope.row)" />
                </el-tooltip>
                <el-tooltip content="编辑用户" placement="top" v-if="canEditUsers">
                  <el-button type="warning" size="small" :icon="Edit" circle @click="editUser(scope.row)" />
                </el-tooltip>
                <el-tooltip content="删除用户" placement="top" v-if="canDeleteUsers">
                  <el-button type="danger" size="small" :icon="Delete" circle @click="confirmDeleteUser(scope.row)" />
                </el-tooltip>
              </el-space>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handlePageSizeChange"
            @current-change="handlePageChange" />
        </div>
      </div>
    </div>
    <div v-else class="no-permission">
      <el-icon :size="48" color="#909399">
        <Lock />
      </el-icon>
      <h3>您没有权限访问此页面</h3>
      <p>需要权限: users:view</p>
    </div>

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="用户详情" :width="dialogWidth" :close-on-click-modal="false">
      <div v-if="selectedUser" class="user-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ selectedUser.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ selectedUser.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedUser.email }}</el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag :type="getRoleTagType(selectedUser.role)" size="small">
              {{ getRoleLabel(selectedUser.role) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">
          关闭
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog v-model="showFormDialog" :title="isEditing ? '编辑用户' : '添加用户'" :width="dialogWidth"
      :close-on-click-modal="false">
      <el-form :model="userForm" :rules="formRules" ref="formRef" label-width="80px" class="user-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" type="email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEditing">
          <el-input v-model="userForm.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option v-for="role in userRoles" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showFormDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveUser" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="showDeleteDialog" title="确认删除" :width="dialogWidth" :close-on-click-modal="false">
      <p>确定要删除用户 <span class="delete-username">{{ userToDelete?.username }}</span> 吗？</p>
      <template #footer>
        <el-button @click="showDeleteDialog = false">
          取消
        </el-button>
        <el-button type="danger" @click="deleteUser" :loading="submitting">
          确定删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, View, Edit, Delete, More } from '@element-plus/icons-vue'
import { useUserList } from '@/composables/useUserList'
import { useAuth } from '@/composables/useAuth'
import type { User } from '@/types/api'

const { hasPermission } = useAuth()
const {
  users,
  loading,
  error,
  total,
  currentPage,
  pageSize,
  totalPages,
  searchQuery,
  selectedRole,
  userRoles,
  filteredUsers,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser: deleteUserApi,
  handleSearch,
  handleReset,
  handlePageChange,
  handlePageSizeChange,
} = useUserList()

// 权限检查
const canViewUsers = computed(() => hasPermission('users:view'))
const canManageUsers = computed(() => hasPermission('users:manage'))
const canEditUsers = computed(() => hasPermission('users:edit'))
const canDeleteUsers = computed(() => hasPermission('users:delete'))

// 筛选表单
const filterForm = ref({
  keyword: '',
  role: '',
})

// 对话框相关
const showDetailDialog = ref(false)
const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const selectedUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)

// 表单相关
const formRef = ref()
const userForm = ref({
  id: 0,
  username: '',
  email: '',
  password: '',
  role: '',
})

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' },
  ],
}

// 计算对话框宽度
const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90%' : '600px'
})

// 处理搜索
const handleFilterSearch = () => {
  searchQuery.value = filterForm.value.keyword
  selectedRole.value = filterForm.value.role
  handleSearch()
}

// 处理重置
const handleFilterReset = () => {
  filterForm.value = {
    keyword: '',
    role: '',
  }
  handleReset()
}

// 获取角色标签类型
const getRoleTagType = (role: string) => {
  if (role === 'admin') return 'danger'
  if (role === 'editor') return 'warning'
  return 'info'
}

// 获取角色标签文本
const getRoleLabel = (role: string) => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    editor: '编辑者',
    viewer: '访客',
    user: '用户',
  }
  return roleMap[role] || role
}

// 查看用户详情
const viewUser = (user: User) => {
  selectedUser.value = user
  showDetailDialog.value = true
}

// 打开添加用户对话框
const openCreateDialog = () => {
  isEditing.value = false
  userForm.value = {
    id: 0,
    username: '',
    email: '',
    password: '',
    role: '',
  }
  showFormDialog.value = true
}

// 打开编辑用户对话框
const editUser = (user: User) => {
  isEditing.value = true
  userForm.value = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: '',
    role: user.role || '',
  }
  showFormDialog.value = true
}

// 确认删除用户
const confirmDeleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

// 保存用户
const saveUser = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEditing.value) {
          // 编辑用户，移除密码字段（如果为空）
          const updateData = { ...userForm.value }
          if (!updateData.password) {
            delete updateData.password
          }
          await updateUser(userForm.value.id, updateData)
        } else {
          // 添加用户
          await createUser(userForm.value)
        }
        showFormDialog.value = false
      } finally {
        submitting.value = false
      }
    }
  })
}

// 删除用户
const deleteUser = async () => {
  if (!userToDelete?.id) return

  submitting.value = true
  try {
    await deleteUserApi(userToDelete.id)
    showDeleteDialog.value = false
    userToDelete.value = null
  } finally {
    submitting.value = false
  }
}

// 自定义搜索和重置方法
const customHandleSearch = () => {
  searchQuery.value = filterForm.value.keyword
  selectedRole.value = filterForm.value.role
  handleSearch()
}

const customHandleReset = () => {
  filterForm.value = {
    keyword: '',
    role: '',
  }
  handleReset()
}
</script>

<style scoped lang="scss">
.users-page {
  max-width: $container-xl;
  margin: 0 auto;
  padding: $space-6;
  padding-bottom: calc($space-6 + 60px);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-6;
  flex-wrap: wrap;
  gap: $space-4;
}

.page-title {
  font-size: $text-2xl;
  font-weight: $font-bold;
  color: $text-primary;
  margin: 0;
}

.users-content {
  background: $bg-elevated;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  padding: $space-5;
}

.filters-section {
  margin-bottom: $space-5;
  padding-bottom: $space-4;
  border-bottom: 1px solid $border-primary;
}

.filters-form {
  display: flex;
  align-items: center;
  gap: $space-3;
  flex-wrap: wrap;
}

.table-section {
  width: 100%;
  overflow-x: auto;
}

.pagination {
  margin-top: $space-4;
  display: flex;
  justify-content: flex-end;
}

.user-detail {
  .el-descriptions {
    margin-top: $space-2;
  }
}

.user-form {
  max-width: 500px;
  margin: 0 auto;
}

.delete-username {
  font-weight: $font-semibold;
  color: $color-danger;
}

@media (max-width: $breakpoint-md) {
  .users-page {
    padding: $space-4;
    padding-bottom: calc($space-4 + 60px);
  }

  .users-content {
    padding: $space-4;
  }

  .filters-form {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>