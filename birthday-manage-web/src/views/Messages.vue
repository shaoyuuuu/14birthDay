<template>
  <div class="messages-page">
    <div class="messages-header">
      <h2 class="page-title">留言管理</h2>
      <div class="header-actions">
        <el-input v-model="searchQuery" placeholder="搜索留言" :prefix-icon="Search" clearable class="search-input" />
      </div>
    </div>

    <div class="messages-content">
      <div v-if="!canViewMessages" class="empty-container">
        <el-icon :size="60" color="#c0c4cc">
          <Lock />
        </el-icon>
        <p>您没有权限访问此页面</p>
        <p class="permission-hint">需要权限: messages:view</p>
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
        <el-button @click="fetchMessages">重新加载</el-button>
      </div>

      <div v-else-if="filteredMessages.length === 0" class="empty-container">
        <el-icon :size="60" color="#c0c4cc">
          <Message />
        </el-icon>
        <p>暂无留言</p>
      </div>

      <div v-else class="messages-list">
        <div v-for="message in filteredMessages" :key="message.id" class="message-card" @click="viewMessage(message)">
          <div class="message-header">
            <div class="message-avatar">
              <el-icon :size="24">
                <User />
              </el-icon>
            </div>
            <div class="message-info">
              <h3 class="message-name">{{ message.name }}</h3>
              <p class="message-date">{{ formatDate(message.created_at) }}</p>
            </div>
            <el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, message.id)"
              v-if="authStore.hasPermission('messages:delete')">
              <el-icon class="more-btn">
                <MoreFilled />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="message-body">
            <p class="message-preview">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showDetailDialog" title="留言详情" :width="dialogWidth" :close-on-click-modal="false">
      <div v-if="selectedMessage" class="message-detail">
        <div class="detail-header">
          <div class="detail-avatar">
            <el-icon :size="40">
              <User />
            </el-icon>
          </div>
          <div class="detail-info">
            <h3 class="detail-name">{{ selectedMessage.name }}</h3>
            <p class="detail-date">{{ formatDate(selectedMessage.created_at) }}</p>
          </div>
        </div>
        <div class="detail-content">
          <p class="detail-message">{{ selectedMessage.message }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="closeDetailDialog">关闭</el-button>
        <el-button type="danger" @click="confirmDelete(selectedMessage?.id)"
          v-if="authStore.hasPermission('messages:delete')">
          删除
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDeleteDialog" title="确认删除" :width="dialogWidth" :close-on-click-modal="false">
      <p>确定要删除这条留言吗？此操作无法撤销。</p>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="deleteMessage">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Loading, Warning, Message, User, MoreFilled, Lock } from '@element-plus/icons-vue'
import * as api from '../api'
import type { Message as MessageType } from '../types/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const canViewMessages = computed(() => authStore.hasPermission('messages:view'))

interface Message {
  id: number
  name: string
  message: string
  created_at: string
}

const messages = ref<MessageType[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedMessage = ref<Message | null>(null)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const messageToDelete = ref<number | null>(null)
const searchQuery = ref('')

const filteredMessages = computed(() => {
  if (!searchQuery.value) return messages.value
  const query = searchQuery.value.toLowerCase()
  return messages.value.filter(
    msg =>
      msg.name.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query)
  )
})

const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90%' : '600px'
})

async function fetchMessages() {
  loading.value = true
  error.value = null
  try {
    const response = await api.messages.getMessages()
    messages.value = response.data.data.messages
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取留言失败'
    ElMessage.error(error.value || '获取留言失败')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function viewMessage(message: Message) {
  selectedMessage.value = message
  showDetailDialog.value = true
}

function closeDetailDialog() {
  showDetailDialog.value = false
  selectedMessage.value = null
}

function handleCommand(command: string, messageId: number) {
  if (command === 'delete') {
    confirmDelete(messageId)
  }
}

function confirmDelete(messageId?: number) {
  messageToDelete.value = messageId || null
  showDeleteDialog.value = true
  if (showDetailDialog.value) {
    showDetailDialog.value = false
  }
}

async function deleteMessage() {
  if (!messageToDelete.value) return

  try {
    await api.messages.deleteMessage(messageToDelete.value)
    ElMessage.success('删除成功')
    messages.value = messages.value.filter(m => m.id !== messageToDelete.value)
    showDeleteDialog.value = false
    messageToDelete.value = null
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '删除失败')
  }
}

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;

.messages-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
  padding-bottom: calc($spacing-lg + $mobile-nav-height);

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    padding-bottom: calc($mobile-spacing-lg + $mobile-nav-height);
  }
}

.messages-header {
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

  @media (max-width: $breakpoint-sm) {
    width: 100%;
  }
}

.search-input {
  width: 300px;

  @media (max-width: $breakpoint-sm) {
    width: 100%;
  }
}

.messages-content {
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

.messages-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-md;
  }
}

.message-card {
  background: $background-white;
  border-radius: $border-radius-base;
  padding: $spacing-lg;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid $border-lighter;

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-md;
    border-radius: $mobile-border-radius-base;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: $box-shadow-base;
    border-color: $border-light;
  }

  &:active {
    transform: translateY(0);
  }
}

.message-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    gap: $mobile-spacing-md;
    margin-bottom: $mobile-spacing-md;
  }
}

.message-avatar {
  width: 48px;
  height: 48px;
  border-radius: $border-radius-circle;
  background: linear-gradient(135deg, $primary-color 0%, #66b1ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $background-white;
  flex-shrink: 0;

  @media (max-width: $breakpoint-sm) {
    width: 40px;
    height: 40px;
  }
}

.message-info {
  flex: 1;
  overflow: hidden;
}

.message-name {
  font-size: $font-size-medium;
  color: $text-primary;
  margin: 0 0 $spacing-xs 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-medium;
    margin: 0 0 $mobile-spacing-xs 0;
  }
}

.message-date {
  font-size: $font-size-small;
  color: $text-secondary;
  margin: 0;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-small;
  }
}

.more-btn {
  color: $text-secondary;
  cursor: pointer;
  padding: $spacing-xs;
  border-radius: $border-radius-base;
  transition: all 0.3s;

  &:hover {
    background: $background-base;
    color: $text-primary;
  }

  @media (max-width: $breakpoint-sm) {
    padding: $mobile-spacing-xs;
  }
}

.message-body {
  margin-top: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    margin-top: $mobile-spacing-md;
  }
}

.message-preview {
  font-size: $font-size-base;
  color: $text-regular;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: $breakpoint-sm) {
    font-size: $mobile-font-size-base;
    -webkit-line-clamp: 2;
  }
}

.message-detail {
  .detail-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;

    @media (max-width: $breakpoint-sm) {
      gap: $mobile-spacing-md;
      margin-bottom: $mobile-spacing-lg;
    }
  }

  .detail-avatar {
    width: 64px;
    height: 64px;
    border-radius: $border-radius-circle;
    background: linear-gradient(135deg, $primary-color 0%, #66b1ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $background-white;
    flex-shrink: 0;

    @media (max-width: $breakpoint-sm) {
      width: 56px;
      height: 56px;
    }
  }

  .detail-info {
    flex: 1;
  }

  .detail-name {
    font-size: $font-size-large;
    color: $text-primary;
    margin: 0 0 $spacing-xs 0;
    font-weight: 600;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-large;
      margin: 0 0 $mobile-spacing-xs 0;
    }
  }

  .detail-date {
    font-size: $font-size-small;
    color: $text-secondary;
    margin: 0;

    @media (max-width: $breakpoint-sm) {
      font-size: $mobile-font-size-small;
    }
  }

  .detail-content {
    margin-top: $spacing-lg;

    @media (max-width: $breakpoint-sm) {
      margin-top: $mobile-spacing-lg;
    }
  }

  .detail-message {
    font-size: $font-size-base;
    color: $text-primary;
    line-height: 1.8;
    margin: 0;
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
