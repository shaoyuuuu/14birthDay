<template>
  <div class="memories-page">
    <div class="memories-header">
      <h2 class="page-title">回忆管理</h2>
      <div class="header-actions">
        <el-input v-model="searchQuery" placeholder="搜索回忆" :prefix-icon="Search" clearable class="search-input" />
        <el-button type="primary" :icon="Plus" @click="openCreateDialog"
          v-if="authStore.hasPermission('memories:create')">
          添加回忆
        </el-button>
      </div>
    </div>

    <div class="memories-content">
      <div v-if="!canViewMemories" class="empty-container">
        <el-icon :size="60" color="#c0c4cc">
          <Lock />
        </el-icon>
        <p>您没有权限访问此页面</p>
        <p class="permission-hint">需要权限: memories:view</p>
      </div>

      <div v-else-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="40">
          <Loading />
        </el-icon>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <el-icon :size="40" color="#f56c6c">
          <Warning />
        </el-icon>
        <p>{{ error }}</p>
        <el-button @click="fetchMemories">重新加载</el-button>
      </div>

      <div v-else-if="filteredMemories.length === 0" class="empty-container">
        <el-icon :size="60" color="#c0c4cc">
          <Document />
        </el-icon>
        <p>暂无回忆</p>
      </div>

      <div v-else class="memories-grid">
        <div v-for="memory in filteredMemories" :key="memory.id" class="memory-card" @click="viewMemory(memory)">
          <div class="memory-image" v-if="memory.image_url">
            <img :src="memory.image_url" :alt="memory.title" />
          </div>
          <div class="memory-content">
            <h3 class="memory-title">{{ memory.title }}</h3>
            <p class="memory-date">{{ formatDate(memory.date) }}</p>
            <p class="memory-description">{{ memory.description }}</p>
          </div>
          <div class="memory-actions">
            <el-button type="primary" size="small" text @click.stop="editMemory(memory)"
              v-if="authStore.hasPermission('memories:edit')">
              编辑
            </el-button>
            <el-button type="danger" size="small" text @click.stop="confirmDelete(memory.id)"
              v-if="authStore.hasPermission('memories:delete')">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showFormDialog" :title="isEditing ? '编辑回忆' : '添加回忆'" :width="dialogWidth"
      :close-on-click-modal="false">
      <el-form :model="memoryForm" label-width="80px" class="memory-form">
        <el-form-item label="标题">
          <el-input v-model="memoryForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="memoryForm.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="memoryForm.description" type="textarea" :rows="4" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload class="image-uploader" :show-file-list="false" :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload" action="/api/memories/upload">
            <img v-if="memoryForm.image_url" :src="memoryForm.image_url" class="uploaded-image" />
            <el-icon v-else class="uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeFormDialog">取消</el-button>
        <el-button type="primary" @click="saveMemory" :loading="saving">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDetailDialog" title="回忆详情" :width="dialogWidth" :close-on-click-modal="false">
      <div v-if="selectedMemory" class="memory-detail">
        <div class="detail-image" v-if="selectedMemory.image_url">
          <img :src="selectedMemory.image_url" :alt="selectedMemory.title" />
        </div>
        <h2 class="detail-title">{{ selectedMemory.title }}</h2>
        <p class="detail-date">{{ formatDate(selectedMemory.date) }}</p>
        <div class="detail-description">
          <p>{{ selectedMemory.description }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="closeDetailDialog">关闭</el-button>
        <el-button type="primary" @click="editMemory(selectedMemory)" v-if="authStore.hasPermission('memories:edit')">
          编辑
        </el-button>
        <el-button type="danger" @click="confirmDelete(selectedMemory?.id)"
          v-if="authStore.hasPermission('memories:delete')">
          删除
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDeleteDialog" title="确认删除" :width="dialogWidth" :close-on-click-modal="false">
      <p>确定要删除这条回忆吗？此操作无法撤销。</p>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="deleteMemory">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Loading, Warning, Document, Plus, Lock } from '@element-plus/icons-vue'
import * as api from '../api'
import type { Memory } from '../types/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const canViewMemories = computed(() => authStore.hasPermission('memories:view'))

const memories = ref<Memory[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedMemory = ref<Memory | null>(null)
const showFormDialog = ref(false)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const memoryToDelete = ref<number | null>(null)
const searchQuery = ref('')
const isEditing = ref(false)
const saving = ref(false)

const memoryForm = ref({
  id: 0,
  title: '',
  description: '',
  date: '',
  image_url: ''
})

const filteredMemories = computed(() => {
  if (!searchQuery.value) return memories.value
  const query = searchQuery.value.toLowerCase()
  return memories.value.filter(
    memory =>
      memory.title.toLowerCase().includes(query) ||
      memory.description.toLowerCase().includes(query)
  )
})

const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90%' : '600px'
})

async function fetchMemories() {
  loading.value = true
  error.value = null
  try {
    const response = await api.memories.getMemories()
    memories.value = response.data.data.memories
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取回忆失败'
    ElMessage.error(error.value || '获取回忆失败')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

function viewMemory(memory: Memory) {
  selectedMemory.value = memory
  showDetailDialog.value = true
}

function closeDetailDialog() {
  showDetailDialog.value = false
  selectedMemory.value = null
}

function openCreateDialog() {
  isEditing.value = false
  memoryForm.value = {
    id: 0,
    title: '',
    description: '',
    date: String(new Date().toISOString().split('T')[0]),
    image_url: ''
  }
  showFormDialog.value = true
}

function editMemory(memory: Memory | null) {
  if (!memory) return
  isEditing.value = true
  memoryForm.value = {
    id: memory.id,
    title: memory.title,
    description: memory.description,
    date: memory.date,
    image_url: memory.image_url || ''
  }
  if (showDetailDialog.value) {
    showDetailDialog.value = false
  }
  showFormDialog.value = true
}

function closeFormDialog() {
  showFormDialog.value = false
  memoryForm.value = {
    id: 0,
    title: '',
    description: '',
    date: '',
    image_url: ''
  }
}

async function saveMemory() {
  if (!memoryForm.value.title || !memoryForm.value.date) {
    ElMessage.warning('请填写完整信息')
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await api.memories.updateMemory(memoryForm.value.id, {
        title: memoryForm.value.title,
        description: memoryForm.value.description,
        date: memoryForm.value.date,
        image_url: memoryForm.value.image_url
      })
      ElMessage.success('更新成功')
      const index = memories.value.findIndex(m => m.id === memoryForm.value.id)
      if (index !== -1 && memories.value[index]) {
        memories.value[index] = {
          ...memoryForm.value,
          created_at: memories.value[index].created_at,
          updated_at: new Date().toISOString()
        }
      }
    } else {
      const response = await api.memories.createMemory({
        title: memoryForm.value.title,
        description: memoryForm.value.description,
        date: memoryForm.value.date,
        image_url: memoryForm.value.image_url
      })
      ElMessage.success('创建成功')
      memories.value.unshift(response.data.data.memory)
    }
    closeFormDialog()
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

function confirmDelete(memoryId?: number) {
  memoryToDelete.value = memoryId || null
  showDeleteDialog.value = true
  if (showDetailDialog.value) {
    showDetailDialog.value = false
  }
}

async function deleteMemory() {
  if (!memoryToDelete.value) return

  try {
    await api.memories.deleteMemory(memoryToDelete.value)
    ElMessage.success('删除成功')
    memories.value = memories.value.filter(m => m.id !== memoryToDelete.value)
    showDeleteDialog.value = false
    memoryToDelete.value = null
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '删除失败')
  }
}

function beforeImageUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

function handleImageSuccess(response: any) {
  memoryForm.value.image_url = response.url
  ElMessage.success('图片上传成功')
}

onMounted(() => {
  fetchMemories()
})
</script>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.memories-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + $mobile-nav-height);

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    padding-bottom: calc($mobile-spacing-lg + $mobile-nav-height);
  }
}

.memories-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    align-items: stretch;
    gap: $mobile-spacing-md;
    margin-bottom: $mobile-spacing-lg;
  }
}

.page-title {
  font-size: $font-size-large;
  font-weight: 600;
  color: $text-primary;
  margin: 0;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-large;
  }
}

.header-actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-sm) {
    width: 100%;
    flex-direction: column;
  }
}

.search-input {
  width: 300px;

  @media (max-width: $breakpoint-sm) {
    width: 100%;
  }
}

.memories-content {
  min-height: 400px;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  color: $text-secondary;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-lg;
  }

  p {
    margin: $spacing-md 0;
    font-size: $font-size-base;

    @media (max-width: $breakpoint-sm) {
      margin: $mobile-spacing-md 0;
      font-size: $mobile-font-size-base;
    }
  }

  .permission-hint {
    font-size: $font-size-small;
    color: $text-placeholder;
    margin-top: $spacing-xs;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-small;
      margin-top: $mobile-spacing-xs;
    }
  }
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $mobile-spacing-md;
  }
}

.memory-card {
  background: $background-white;
  border-radius: $border-radius-base;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid $border-lighter;
  display: flex;
  flex-direction: column;

  @media (max-width: $breakpoint-sm) {
    border-radius: $mobile-border-radius-base;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $box-shadow-base;
    border-color: $border-light;
  }

  &:active {
    transform: translateY(-2px);
  }
}

.memory-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: $background-base;

  @media (max-width: $breakpoint-sm) {
    height: 180px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;

    .memory-card:hover & {
      transform: scale(1.05);
    }
  }
}

.memory-content {
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
  }
}

.memory-title {
  font-size: $font-size-medium;
  color: $text-primary;
  margin: 0 0 $spacing-xs 0;
  font-weight: 600;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-medium;
    margin: 0 0 $mobile-spacing-xs 0;
  }
}

.memory-date {
  font-size: $font-size-small;
  color: $text-secondary;
  margin: 0 0 $spacing-sm 0;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-small;
    margin: 0 0 $mobile-spacing-sm 0;
  }
}

.memory-description {
  font-size: $font-size-base;
  color: $text-regular;
  line-height: 1.6;
  margin: 0 0 $spacing-md 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-base;
    margin: 0 0 $mobile-spacing-md 0;
    -webkit-line-clamp: 2;
  }
}

.memory-actions {
  display: flex;
  gap: $spacing-sm;
  padding-top: $spacing-sm;
  border-top: 1px solid $border-lighter;

  @media (max-width: $breakpoint-sm) {
    padding-top: $mobile-spacing-sm;
  }
}

.memory-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

.image-uploader {
  width: 100%;
  height: 200px;
  border: 2px dashed $border-light;
  border-radius: $border-radius-base;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: $primary-color;
  }

  @media (max-width: $breakpoint-sm) {
    height: 180px;
    border-radius: $mobile-border-radius-base;
  }
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader-icon {
  font-size: 48px;
  color: $text-placeholder;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: $breakpoint-sm) {
    font-size: 40px;
  }
}

.memory-detail {
  .detail-image {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: $border-radius-base;
    margin-bottom: $spacing-lg;

    @media (max-width: $breakpoint-sm) {
      height: 200px;
      border-radius: $mobile-border-radius-base;
      margin-bottom: $mobile-spacing-lg;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .detail-title {
    font-size: $font-size-extra-large;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
    font-weight: 600;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-extra-large;
      margin: 0 0 $mobile-spacing-sm 0;
    }
  }

  .detail-date {
    font-size: $font-size-base;
    color: $text-secondary;
    margin: 0 0 $spacing-lg 0;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-base;
      margin: 0 0 $mobile-spacing-lg 0;
    }
  }

  .detail-description {
    font-size: $font-size-base;
    color: $text-primary;
    line-height: 1.8;
    padding: $spacing-lg;
    background: $background-base;
    border-radius: $border-radius-base;
    white-space: pre-wrap;
    word-break: break-word;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-base;
      padding: $mobile-spacing-md;
      border-radius: $mobile-border-radius-base;
    }
  }
}
</style>
