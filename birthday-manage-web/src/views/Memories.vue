<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../utils/api'

interface Memory {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
}

const memories = ref<Memory[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const memoryToDelete = ref<number | null>(null)
const editingMemory = ref<Memory | null>(null)

const formData = ref({
  title: '',
  description: '',
  image_url: ''
})

async function fetchMemories() {
  try {
    const response = await api.get('/memories')
    memories.value = response.data.memories
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch memories'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

function openAddForm() {
  editingMemory.value = null
  formData.value = { title: '', description: '', image_url: '' }
  showFormModal.value = true
}

function openEditForm(memory: Memory) {
  editingMemory.value = memory
  formData.value = {
    title: memory.title,
    description: memory.description,
    image_url: memory.image_url
  }
  showFormModal.value = true
}

function closeForm() {
  showFormModal.value = false
  editingMemory.value = null
  formData.value = { title: '', description: '', image_url: '' }
}

async function handleSubmit() {
  if (!formData.value.title || !formData.value.description || !formData.value.image_url) {
    alert('请填写所有字段')
    return
  }

  try {
    if (editingMemory.value) {
      await api.put(`/memories/${editingMemory.value.id}`, formData.value)
    } else {
      await api.post('/memories', formData.value)
    }
    await fetchMemories()
    closeForm()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to save memory')
  }
}

function confirmDelete(memoryId: number) {
  memoryToDelete.value = memoryId
  showDeleteModal.value = true
}

async function deleteMemory() {
  if (!memoryToDelete.value) return
  
  try {
    await api.delete(`/memories/${memoryToDelete.value}`)
    memories.value = memories.value.filter(m => m.id !== memoryToDelete.value)
    showDeleteModal.value = false
    memoryToDelete.value = null
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete memory')
  }
}

onMounted(async () => {
  loading.value = true
  await fetchMemories()
  loading.value = false
})
</script>

<template>
  <div class="memories-page">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="memories-content">
      <div class="memories-header">
        <h3>共 {{ memories.length }} 个回忆</h3>
        <button class="add-button" @click="openAddForm">
          ➕ 添加回忆
        </button>
      </div>
      
      <div v-if="memories.length === 0" class="empty-state">
        <div class="empty-icon">📸</div>
        <h3>暂无回忆</h3>
        <p>点击"添加回忆"按钮开始记录美好时光</p>
      </div>
      
      <div v-else class="memories-grid">
        <div
          v-for="memory in memories"
          :key="memory.id"
          class="memory-card"
        >
          <div class="memory-image">
            <img :src="memory.image_url" :alt="memory.title" />
          </div>
          
          <div class="memory-info">
            <h4 class="memory-title">{{ memory.title }}</h4>
            <p class="memory-description">{{ memory.description }}</p>
            <p class="memory-date">{{ formatDate(memory.created_at) }}</p>
          </div>
          
          <div class="memory-actions">
            <button class="action-button edit" @click="openEditForm(memory)">
              ✏️ 编辑
            </button>
            <button class="action-button delete" @click="confirmDelete(memory.id)">
              🗑️ 删除
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showFormModal" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingMemory ? '编辑回忆' : '添加回忆' }}</h3>
          <button class="close-button" @click="closeForm">✕</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="memory-form">
            <div class="form-group">
              <label for="title">标题</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                placeholder="请输入标题"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="description">描述</label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="请输入描述"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="image_url">图片链接</label>
              <input
                id="image_url"
                v-model="formData.image_url"
                type="url"
                placeholder="请输入图片链接"
                required
              />
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="closeForm">取消</button>
          <button class="confirm-button" @click="handleSubmit">
            {{ editingMemory ? '保存' : '添加' }}
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
          <p>确定要删除这个回忆吗？此操作无法撤销。</p>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="showDeleteModal = false">取消</button>
          <button class="confirm-button" @click="deleteMemory">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memories-page {
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

.memories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.memories-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.add-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.memory-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.memory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.memory-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f7fa;
}

.memory-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.memory-info {
  padding: 20px;
}

.memory-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}

.memory-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.memory-date {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.memory-actions {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button.edit {
  background: #f5f7fa;
  color: #666;
}

.action-button.edit:hover {
  background: #e0e0e0;
}

.action-button.delete {
  background: #fff5f5;
  color: #ff4757;
}

.action-button.delete:hover {
  background: #ffe0e0;
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

.memory-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .memories-grid {
    grid-template-columns: 1fr;
  }
  
  .memories-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .add-button {
    width: 100%;
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
  .memory-card {
    border-radius: 12px;
  }
  
  .memory-info {
    padding: 16px;
  }
  
  .memory-title {
    font-size: 16px;
  }
  
  .memory-description {
    font-size: 13px;
  }
  
  .memory-actions {
    padding: 12px 16px;
  }
  
  .action-button {
    padding: 10px;
    font-size: 12px;
  }
}
</style>
