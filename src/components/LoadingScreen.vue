<template>
  <div class="loading-screen">
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <h2 class="loading-title">正在准备回忆...</h2>
      <p class="loading-status">{{ loadingStatus }}</p>
      
      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="progress-text">
          {{ loadedCount }} / {{ totalCount }}
        </div>
      </div>

      <div v-if="error" class="error-message">
        <p>加载失败: {{ error.message }}</p>
        <button @click="$emit('retry')" class="retry-button">重试</button>
      </div>
    </div>

    <DynamicBackground :speed="0.3" :petalCount="15" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DynamicBackground from './DynamicBackground.vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  loadedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  },
  error: {
    type: Error,
    default: null
  }
})

const emit = defineEmits(['retry'])

const loadingStatus = computed(() => {
  if (props.error) {
    return '加载失败'
  }
  
  if (props.progress === 100) {
    return '准备完成！'
  }
  
  if (props.progress === 0) {
    return '正在加载资源...'
  }
  
  return `正在加载图片... ${props.progress}%`
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(255, 220, 180, 0.2) 0%,
    rgba(200, 160, 120, 0.15) 50%,
    rgba(100, 80, 60, 0.2) 100%);
  z-index: 9999;
  overflow: hidden;
}

.loading-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 40px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  
  &::before {
    width: 100%;
    height: 100%;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
  
  &::after {
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    border: 3px solid rgba(255, 255, 255, 0.15);
    border-bottom-color: white;
    animation: spin 0.8s linear infinite reverse;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.loading-status {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
}

.progress-container {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #81c784, #66bb6a);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(129, 199, 132, 0.5);
}

.progress-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.error-message {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 0, 0, 0.3);
  
  p {
    margin-bottom: 12px;
    color: #ff9999;
  }
}

.retry-button {
  background: linear-gradient(135deg, #81c784, #66bb6a);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(129, 199, 132, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(129, 199, 132, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
