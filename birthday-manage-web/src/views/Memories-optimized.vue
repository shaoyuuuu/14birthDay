<template>
  <div class="memories-page">
    <div class="page-header">
      <h1 class="page-title">回忆管理</h1>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索回忆"
          :prefix-icon="Search"
          clearable
          class="search-input"
        />
        <el-button
          type="primary"
          :icon="Plus"
          @click="openCreateDialog"
          v-if="hasPermission('memories:create')"
        >
          添加回忆
        </el-button>
      </div>
    </div>

    <div class="memories-content">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="40">
          <Loading />
        </el-icon>
        <p>加载中...</p>
      </div>
      <div v-else-if="fetchError" class="error-container">
        <el-icon :size="48">
          <Warning />
        </el-icon>
        <p>{{ fetchError }}</p>
        <el-button type="primary" @click="handleFetchMemories">重试</el-button>
      </div>
      <div v-else-if="filteredMemories.length === 0" class="empty-container">
        <el-icon :size="48">
          <Picture />
        </el-icon>
        <p>暂无回忆</p>
      </div>
      <div v-else class="memories-grid">
        <div
          v-for="memory in filteredMemories"
          :key="memory.id"
          class="memory-card"
          @click="viewMemory(memory)"
        >
          <div class="memory-image" v-if="memory.image_url">
            <img :src="memory.image_url" :alt="memory.title" />
          </div>
          <div class="memory-content">
            <h3 class="memory-title">{{ memory.title }}</h3>
            <p class="memory-date">{{ formatDate(memory.date) }}</p>
            <p class="memory-description">{{ memory.description }}</p>
          </div>
          <div class="memory-actions">
            <el-button
              type="primary"
              size="small"
              text
              @click.stop="editMemory(memory)"
              v-if="hasPermission('memories:edit')"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              text
              @click.stop="confirmDelete(memory.id)"
              v-if="hasPermission('memories:delete')"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showFormDialog"
      :title="isEditing ? '编辑回忆' : '添加回忆'"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <el-form :model="memoryForm" label-width="80px" class="memory-form">
        <el-form-item label="标题">
          <el-input v-model="memoryForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="memoryForm.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="memoryForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
            action="/api/memories/upload"
          >
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

    <el-dialog
      v-model="showDetailDialog"
      title="回忆详情"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
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
        <el-button
          type="primary"
          @click="editMemory(selectedMemory)"
          v-if="hasPermission('memories:edit')"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          @click="confirmDelete(selectedMemory?.id)"
          v-if="hasPermission('memories:delete')"
        >
          删除
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showDeleteDialog"
      title="确认删除"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
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
import { Search, Plus, Loading, Warning, Picture } from '@element-plus/icons-vue'
import { useMemoryList } from '@/composables/useMemoryList'
import { useAuth } from '@/composables/useAuth'
import type { Memory } from '@/types/api'

const {
  memories,
  loading,
  error: fetchError,
  fetchMemories,
  createMemory,
  updateMemory,
  deleteMemory: deleteMemoryApi
} = useMemoryList()
const { hasPermission } = useAuth()

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
  const mems = memories.value || []
  if (!searchQuery.value) return mems
  const query = searchQuery.value.toLowerCase()
  return mems.filter(
    memory =>
      memory.title.toLowerCase().includes(query) ||
      memory.description.toLowerCase().includes(query)
  )
})

const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90%' : '600px'
})

async function handleFetchMemories() {
  await fetchMemories()
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
      await updateMemory(memoryForm.value.id, {
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
      const response = await createMemory({
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
    await deleteMemoryApi(memoryToDelete.value)
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
  handleFetchMemories()
})
</script>

<style scoped lang="scss">
.memories-page {
  max-width: $container-2xl;
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

.header-actions {
  display: flex;
  gap: $space-4;
  flex-wrap: wrap;
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
  padding: $space-12;
  color: $text-tertiary;

  p {
    margin-top: $space-4;
    font-size: $text-base;
  }
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-6;
}

.memory-card {
  background: $bg-elevated;
  border-radius: $radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: all $duration-base $ease-in-out;
  border: 1px solid $border-primary;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: $color-primary;
  }

  &:active {
    transform: translateY(-2px);
  }
}

.memory-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: $bg-secondary;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $duration-base $ease-in-out;

    .memory-card:hover & {
      transform: scale(1.05);
    }
  }
}

.memory-content {
  padding: $space-5;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.memory-title {
  font-size: $text-lg;
  color: $text-primary;
  margin: 0 0 $space-2 0;
  font-weight: $font-semibold;
}

.memory-date {
  font-size: $text-sm;
  color: $text-secondary;
  margin: 0 0 $space-3 0;
}

.memory-description {
  font-size: $text-base;
  color: $text-secondary;
  line-height: $leading-relaxed;
  margin: 0 0 $space-4 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.memory-actions {
  display: flex;
  gap: $space-2;
  padding-top: $space-3;
  border-top: 1px solid $border-primary;
}

.memory-form {
  :deep(.el-form-item__label) {
    font-weight: $font-medium;
  }
}

.image-uploader {
  width: 100%;
  height: 200px;
  border: 2px dashed $border-primary;
  border-radius: $radius-lg;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all $duration-base $ease-in-out;

  &:hover {
    border-color: $color-primary;
  }
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader-icon {
  font-size: 48px;
  color: $text-tertiary;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.memory-detail {
  .detail-image {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: $radius-lg;
    margin-bottom: $space-6;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .detail-title {
    font-size: $text-2xl;
    color: $text-primary;
    margin: 0 0 $space-2 0;
    font-weight: $font-semibold;
  }

  .detail-date {
    font-size: $text-base;
    color: $text-secondary;
    margin: 0 0 $space-6 0;
  }

  .detail-description {
    font-size: $text-base;
    color: $text-primary;
    line-height: $leading-relaxed;
    padding: $space-5;
    background: $bg-secondary;
    border-radius: $radius-lg;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

@media (max-width: $breakpoint-sm) {
  .memories-page {
    padding: $space-4;
    padding-bottom: calc($space-4 + 60px);
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: $text-xl;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .memories-grid {
    grid-template-columns: 1fr;
    gap: $space-4;
  }

  .memory-card {
    border-radius: $radius-md;
  }

  .memory-image {
    height: 180px;
  }

  .memory-content {
    padding: $space-4;
  }

  .memory-title {
    font-size: $text-base;
  }

  .memory-date {
    font-size: $text-xs;
  }

  .memory-description {
    font-size: $text-sm;
    -webkit-line-clamp: 2;
  }

  .memory-detail {
    .detail-image {
      height: 200px;
      border-radius: $radius-md;
      margin-bottom: $space-4;
    }

    .detail-title {
      font-size: $text-xl;
    }

    .detail-date {
      font-size: $text-sm;
      margin-bottom: $space-4;
    }

    .detail-description {
      font-size: $text-sm;
      padding: $space-4;
      border-radius: $radius-md;
    }
  }
}
</style>