<template>
  <div class="messages-page">
    <div class="page-header">
      <h1 class="page-title">留言管理</h1>
      <el-input
        v-model="searchQuery"
        placeholder="搜索留言"
        :prefix-icon="Search"
        clearable
        class="search-input"
      />
    </div>

    <div class="messages-content">
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
        <el-button type="primary" @click="handleFetchMessages">重试</el-button>
      </div>
      <div v-else-if="filteredMessages.length === 0" class="empty-container">
        <el-icon :size="48">
          <ChatDotRound />
        </el-icon>
        <p>暂无留言</p>
      </div>
      <div v-else class="messages-list">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="message-card"
          @click="viewMessage(message)"
        >
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
            <el-dropdown
              trigger="click"
              @command="(cmd: string) => handleCommand(cmd, message.id)"
              v-if="hasPermission('messages:delete')"
            >
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

    <el-dialog
      v-model="showDetailDialog"
      title="留言详情"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
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
        <el-button
          type="danger"
          @click="confirmDelete(selectedMessage?.id)"
          v-if="hasPermission('messages:delete')"
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
import { Search, User, MoreFilled, Loading, Warning, ChatDotRound } from '@element-plus/icons-vue'
import { useMessageList } from '@/composables/useMessageList'
import { useAuth } from '@/composables/useAuth'

const { messages, loading, error: fetchError, fetchMessages, deleteMessage: deleteMessageApi } = useMessageList()
const { hasPermission } = useAuth()

interface Message {
  id: number
  name: string
  message: string
  created_at: string
}

const selectedMessage = ref<Message | null>(null)
const showDetailDialog = ref(false)
const showDeleteDialog = ref(false)
const messageToDelete = ref<number | null>(null)
const searchQuery = ref('')

const filteredMessages = computed(() => {
  const msgs = messages.value || []
  if (!searchQuery.value) return msgs
  const query = searchQuery.value.toLowerCase()
  return msgs.filter(
    msg =>
      msg.name.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query)
  )
})

const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90%' : '600px'
})

async function handleFetchMessages() {
  await fetchMessages()
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
    await deleteMessageApi(messageToDelete.value)
    ElMessage.success('删除成功')
    messages.value = messages.value.filter(m => m.id !== messageToDelete.value)
    showDeleteDialog.value = false
    messageToDelete.value = null
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '删除失败')
  }
}

onMounted(() => {
  handleFetchMessages()
})
</script>

<style scoped lang="scss">
@use "@/styles/design-tokens.scss" as *;

.messages-page {
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

.search-input {
  width: 300px;

  @media (max-width: $breakpoint-sm) {
    width: 100%;
  }
}

.messages-content {
  min-height: 50vh;
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

.messages-list {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.message-card {
  background: $bg-elevated;
  border-radius: $radius-lg;
  padding: $space-5;
  cursor: pointer;
  transition: all $duration-base $ease-in-out;
  border: 1px solid $border-primary;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: $color-primary;
  }

  &:active {
    transform: translateY(0);
  }
}

.message-header {
  display: flex;
  align-items: center;
  gap: $space-4;
  margin-bottom: $space-4;
}

.message-avatar {
  width: 48px;
  height: 48px;
  border-radius: $radius-full;
  background: $gradient-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-inverse;
  flex-shrink: 0;
}

.message-info {
  flex: 1;
  overflow: hidden;
}

.message-name {
  font-size: $text-base;
  color: $text-primary;
  margin: 0 0 $space-1 0;
  font-weight: $font-semibold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-date {
  font-size: $text-sm;
  color: $text-secondary;
  margin: 0;
}

.more-btn {
  color: $text-secondary;
  cursor: pointer;
  padding: $space-1;
  border-radius: $radius-sm;
  transition: all $duration-base $ease-in-out;

  &:hover {
    background: $bg-secondary;
    color: $text-primary;
  }
}

.message-body {
  margin-top: $space-4;
}

.message-preview {
  font-size: $text-base;
  color: $text-secondary;
  line-height: $leading-relaxed;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-detail {
  .detail-header {
    display: flex;
    align-items: center;
    gap: $space-4;
    margin-bottom: $space-6;
  }

  .detail-avatar {
    width: 64px;
    height: 64px;
    border-radius: $radius-full;
    background: $gradient-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-inverse;
    flex-shrink: 0;
  }

  .detail-info {
    flex: 1;
  }

  .detail-name {
    font-size: $text-lg;
    color: $text-primary;
    margin: 0 0 $space-1 0;
    font-weight: $font-semibold;
  }

  .detail-date {
    font-size: $text-sm;
    color: $text-secondary;
    margin: 0;
  }

  .detail-content {
    margin-top: $space-6;
  }

  .detail-message {
    font-size: $text-base;
    color: $text-primary;
    line-height: $leading-relaxed;
    margin: 0;
    padding: $space-5;
    background: $bg-secondary;
    border-radius: $radius-lg;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

@media (max-width: $breakpoint-sm) {
  .messages-page {
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

  .search-input {
    width: 100%;
  }

  .messages-list {
    gap: $space-3;
  }

  .message-card {
    padding: $space-4;
  }

  .message-header {
    gap: $space-3;
    margin-bottom: $space-3;
  }

  .message-avatar {
    width: 40px;
    height: 40px;
  }

  .message-name {
    font-size: $text-sm;
  }

  .message-date {
    font-size: $text-xs;
  }

  .message-preview {
    font-size: $text-sm;
    -webkit-line-clamp: 2;
  }
}
</style>