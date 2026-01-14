<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../utils/api'

interface Message {
  id: number
  name: string
  message: string
  created_at: string
}

const messages = ref<Message[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedMessage = ref<Message | null>(null)
const showDeleteModal = ref(false)
const messageToDelete = ref<number | null>(null)

async function fetchMessages() {
  try {
    const response = await api.get('/messages')
    messages.value = response.data.messages
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch messages'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function viewMessage(message: Message) {
  selectedMessage.value = message
}

function closeMessage() {
  selectedMessage.value = null
}

function confirmDelete(messageId: number) {
  messageToDelete.value = messageId
  showDeleteModal.value = true
}

async function deleteMessage() {
  if (!messageToDelete.value) return
  
  try {
    await api.delete(`/messages/${messageToDelete.value}`)
    messages.value = messages.value.filter(m => m.id !== messageToDelete.value)
    showDeleteModal.value = false
    messageToDelete.value = null
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete message')
  }
}

onMounted(async () => {
  loading.value = true
  await fetchMessages()
  loading.value = false
})
</script>

<template>
  <div class="messages-page">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="messages-content">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>暂无留言</h3>
        <p>当有用户留言时，会在这里显示</p>
      </div>
      
      <div v-else class="messages-grid">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-card"
          @click="viewMessage(message)"
        >
          <div class="message-header">
            <div class="message-avatar">
              {{ message.name.charAt(0).toUpperCase() }}
            </div>
            <div class="message-info">
              <h4 class="message-name">{{ message.name }}</h4>
              <p class="message-date">{{ formatDate(message.created_at) }}</p>
            </div>
          </div>
          
          <div class="message-preview">
            {{ message.message.substring(0, 100) }}{{ message.message.length > 100 ? '...' : '' }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="selectedMessage" class="modal-overlay" @click="closeMessage">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>留言详情</h3>
          <button class="close-button" @click="closeMessage">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="message-detail">
            <div class="detail-row">
              <span class="detail-label">留言人：</span>
              <span class="detail-value">{{ selectedMessage.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">时间：</span>
              <span class="detail-value">{{ formatDate(selectedMessage.created_at) }}</span>
            </div>
            <div class="detail-content">
              <span class="detail-label">内容：</span>
              <p class="detail-message">{{ selectedMessage.message }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="delete-button" @click="confirmDelete(selectedMessage.id)">
            🗑️ 删除留言
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal modal-small" @click.stop>
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="close-button" @click="showDeleteModal = false">✕</button>
        </div>
        
        <div class="modal-body">
          <p>确定要删除这条留言吗？此操作无法撤销。</p>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="showDeleteModal = false">取消</button>
          <button class="confirm-button" @click="deleteMessage">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-page {
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #ff4757;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  color: #333;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.message-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.message-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.message-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.message-info {
  flex: 1;
}

.message-name {
  font-size: 16px;
  color: #333;
  margin: 0 0 4px 0;
}

.message-date {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.message-preview {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  color: #666;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.message-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-label {
  font-size: 14px;
  color: #666;
  min-width: 60px;
}

.detail-value {
  font-size: 14px;
  color: #333;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-message {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
  margin: 0;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 10px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.delete-button {
  padding: 10px 20px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-button:hover {
  background: #ff6b81;
}

.cancel-button {
  padding: 10px 20px;
  background: #f5f7fa;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.confirm-button {
  padding: 10px 20px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-button:hover {
  background: #ff6b81;
}

@media (max-width: 768px) {
  .messages-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .message-card {
    padding: 16px;
  }
  
  .message-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .message-name {
    font-size: 15px;
  }
  
  .message-preview {
    font-size: 13px;
  }
}
</style>
