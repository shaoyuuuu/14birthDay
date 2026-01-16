<template>
  <div class="roles-page">
    <div class="page-header">
      <h1 class="page-title">角色管理</h1>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog" v-if="canManageRoles">
        添加角色
      </el-button>
    </div>

    <div v-if="canViewRoles" class="roles-content">
      <div class="table-section">
        <el-table v-loading="loading" :data="roles" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="角色名称" width="150">
            <template #default="scope">
              <el-tag :type="getRoleTagType(scope.row.name)" size="small">
                {{ scope.row.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="permissions" label="权限" width="400">
            <template #default="scope">
              <el-space wrap>
                <el-tag v-for="perm in scope.row.permissions" :key="perm" size="small" type="info">
                  {{ perm }}
                </el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right" align="center">
            <template #default="scope">
              <el-space>
                <el-tooltip content="编辑角色" placement="top" v-if="canEditRole(scope.row)">
                  <el-button type="warning" size="small" :icon="Edit" circle @click="editRole(scope.row)" />
                </el-tooltip>
                <el-tooltip content="删除角色" placement="top" v-if="canDeleteRole(scope.row)">
                  <el-button type="danger" size="small" :icon="Delete" circle @click="confirmDeleteRole(scope.row)" />
                </el-tooltip>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="no-permission">
      <el-icon :size="48" color="#909399">
        <Lock />
      </el-icon>
      <h3>您没有权限访问此页面</h3>
      <p>需要权限: users:view</p>
    </div>

    <!-- 添加/编辑角色弹窗 -->
    <el-dialog v-model="showFormDialog" :title="isEditing ? '编辑角色' : '添加角色'" :width="dialogWidth"
      :close-on-click-modal="false">
      <el-form ref="formRef" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-select v-model="roleForm.name" placeholder="请选择角色" :disabled="isEditing" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑者" value="editor" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" placeholder="请输入角色描述" maxlength="200"
            show-word-limit />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="roleForm.permissions">
            <el-checkbox label="dashboard:view">查看仪表盘</el-checkbox>
            <el-checkbox label="users:view">查看用户</el-checkbox>
            <el-checkbox label="users:edit">编辑用户</el-checkbox>
            <el-checkbox label="users:delete">删除用户</el-checkbox>
            <el-checkbox label="users:manage">管理用户</el-checkbox>
            <el-checkbox label="messages:view">查看留言</el-checkbox>
            <el-checkbox label="messages:manage">管理留言</el-checkbox>
            <el-checkbox label="memories:view">查看回忆</el-checkbox>
            <el-checkbox label="memories:manage">管理回忆</el-checkbox>
            <el-checkbox label="visits:view">查看访问统计</el-checkbox>
            <el-checkbox label="profile:view">查看个人资料</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showFormDialog = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Edit, Delete, Lock } from '@element-plus/icons-vue'
import { useRoleList } from '@/composables'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/api'

const authStore = useAuthStore()
const { roles, loading, fetchRoles, createRole, updateRole, deleteRole } = useRoleList()

const showFormDialog = ref(false)
const isEditing = ref(false)
const formRef = ref<FormInstance>()
const selectedRole = ref<Role | null>(null)
const dialogWidth = computed(() => window.innerWidth < 768 ? '90%' : '600px')

const canViewRoles = computed(() => authStore.hasPermission('users:view'))
const canManageRoles = computed(() => authStore.hasPermission('users:manage'))

const roleForm = reactive<CreateRoleRequest>({
  name: 'viewer',
  description: '',
  permissions: [],
})

const rules: FormRules = {
  name: [
    { required: true, message: '请选择角色名称', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { min: 2, max: 200, message: '描述长度在 2 到 200 个字符', trigger: 'blur' },
  ],
  permissions: [
    { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' },
  ],
}

const getRoleTagType = (roleName: string) => {
  const typeMap: Record<string, any> = {
    admin: 'danger',
    editor: 'warning',
    viewer: 'info',
  }
  return typeMap[roleName] || 'info'
}

const canEditRole = (role: Role) => {
  return role.name !== 'admin' && canManageRoles.value
}

const canDeleteRole = (role: Role) => {
  return role.name !== 'admin' && canManageRoles.value
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const openCreateDialog = () => {
  isEditing.value = false
  selectedRole.value = null
  Object.assign(roleForm, {
    name: 'viewer',
    description: '',
    permissions: [],
  })
  showFormDialog.value = true
}

const editRole = (role: Role) => {
  isEditing.value = true
  selectedRole.value = role
  Object.assign(roleForm, {
    name: role.name,
    description: role.description,
    permissions: role.permissions || [],
  })
  showFormDialog.value = true
}

const confirmDeleteRole = (role: Role) => {
  deleteRole(role.id)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (isEditing.value && selectedRole.value) {
          await updateRole(selectedRole.value.id, roleForm)
        } else {
          await createRole(roleForm)
        }
        showFormDialog.value = false
      } catch (error) {
        console.error('Submit error:', error)
      }
    }
  })
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped lang="scss">
@use "@/styles/design-tokens.scss" as *;

.roles-page {
  width: 100%;
  padding: $space-4;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $space-4;

    .page-title {
      margin: 0;
      font-size: $text-2xl;
      font-weight: 600;
      color: $text-primary;
    }
  }

  .roles-content {
    .table-section {
      background: white;
      border-radius: $radius-lg;
      box-shadow: $shadow-sm;
      padding: $space-4;
    }
  }

  .no-permission {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $space-8;
    text-align: center;

    h3 {
      margin: $space-3 0 $space-2;
      font-size: $text-xl;
      color: $text-primary;
    }

    p {
      margin: 0;
      color: $text-secondary;
    }
  }
}

@media (max-width: 768px) {
  .roles-page {
    padding: $space-2;

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-2;

      .page-title {
        font-size: $text-xl;
      }
    }

    .roles-content {
      .table-section {
        padding: $space-2;
      }
    }
  }
}
</style>
