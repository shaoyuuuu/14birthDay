<template>
  <div class="messages-page">
    <PageHeader title="留言管理">
      <template #actions>
        <el-input v-model="searchQuery" placeholder="搜索留言" :prefix-icon="Search" clearable class="search-input" />
      </template>
    </PageHeader>

    <div class="messages-content">
      <LoadingState v-if="loading" />
      <ErrorState v-else-if="fetchError" :message="fetchError" @retry="handleFetchMessages" />
      <EmptyState v-else-if="filteredMessages.length === 0" description="暂无留言" />
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
              v-if="hasPermission('messages:delete')">
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
        <el-button type="danger" @click="confirmDelete(selectedMessage?.id)" v-if="hasPermission('messages:delete')">
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
import { Search, Message, User, MoreFilled } from '@element-plus/icons-vue'
import { useMessageList } from '@/composables/useMessageList'
import { useAuth } from '@/composables/useAuth'
import { LoadingState, ErrorState, EmptyState, PageHeader } from '@/components/common'

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
@use '@/styles/variables.scss' as *;

.messages-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4vw;
  padding-bottom: calc(4vw + 7vh);

  @media (min-width: $breakpoint-sm) {
    padding: 24px;
    padding-bottom: 24px;
  }
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

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 3vw;

  @media (min-width: $breakpoint-sm) {
    gap: 16px;
  }
}

.message-card {
  background: $background-white;
  border-radius: 2vw;
  padding: 4vw;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid $border-lighter;

  @media (min-width: $breakpoint-sm) {
    border-radius: 12px;
    padding: 20px;
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
  gap: 3vw;
  margin-bottom: 3vw;

  @media (min-width: $breakpoint-sm) {
    gap: 16px;
    margin-bottom: 16px;
  }
}

.message-avatar {
  width: 12vw;
  height: 12vw;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-color 0%, #66b1ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $background-white;
  flex-shrink: 0;

  @media (min-width: $breakpoint-sm) {
    width: 48px;
    height: 48px;
  }
}

.message-info {
  flex: 1;
  overflow: hidden;
}

.message-name {
  font-size: 4.5vw;
  color: $text-primary;
  margin: 0 0 1vw 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: $breakpoint-sm) {
    font-size: 16px;
    margin: 0 0 4px 0;
  }
}

.message-date {
  font-size: 3.5vw;
  color: $text-secondary;
  margin: 0;

  @media (min-width: $breakpoint-sm) {
    font-size: 14px;
  }
}

.more-btn {
  color: $text-secondary;
  cursor: pointer;
  padding: 1vw;
  border-radius: 1vw;
  transition: all 0.3s;

  @media (min-width: $breakpoint-sm) {
    padding: 4px;
    border-radius: 4px;
  }

  &:hover {
    background: $background-base;
    color: $text-primary;
  }
}

.message-body {
  margin-top: 3vw;

  @media (min-width: $breakpoint-sm) {
    margin-top: 16px;
  }
}

.message-preview {
  font-size: 4vw;
  color: $text-regular;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: $breakpoint-sm) {
    font-size: 15px;
    -webkit-line-clamp: 2;
  }
}

.message-detail {
  .detail-header {
    display: flex;
    align-items: center;
    gap: 3vw;
    margin-bottom: 5vw;

    @media (min-width: $breakpoint-sm) {
      gap: 16px;
      margin-bottom: 24px;
    }
  }

  .detail-avatar {
    width: 16vw;
    height: 16vw;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary-color 0%, #66b1ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $background-white;
    flex-shrink: 0;

    @media (min-width: $breakpoint-sm) {
      width: 64px;
      height: 64px;
    }
  }

  .detail-info {
    flex: 1;
  }

  .detail-name {
    font-size: 5.5vw;
    color: $text-primary;
    margin: 0 0 1vw 0;
    font-weight: 600;

    @media (min-width: $breakpoint-sm) {
      font-size: 20px;
      margin: 0 0 4px 0;
    }
  }

  .detail-date {
    font-size: 3.5vw;
    color: $text-secondary;
    margin: 0;

    @media (min-width: $breakpoint-sm) {
      font-size: 14px;
    }
  }

  .detail-content {
    margin-top: 5vw;

    @media (min-width: $breakpoint-sm) {
      margin-top: 24px;
    }
  }

  .detail-message {
    font-size: 4vw;
    color: $text-primary;
    line-height: 1.8;
    margin: 0;
    padding: 4vw;
    background: $background-base;
    border-radius: 2vw;
    white-space: pre-wrap;
    word-break: break-word;

    @media (min-width: $breakpoint-sm) {
      font-size: 15px;
      padding: 20px;
      border-radius: 12px;
    }
  }
}
</style>
