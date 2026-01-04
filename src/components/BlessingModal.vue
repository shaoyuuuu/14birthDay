<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content">
      <div class="modal-header">
        <h2>生日快乐，我的宝贝</h2>
      </div>
      <div class="modal-body">
        <p>亲爱的，今天是你的生日，我想对你说：</p>
        <p>感谢上天让我遇到你，感谢你一直以来的陪伴和支持。</p>
        <p>在这个特别的日子里，我祝你永远开心快乐，永远年轻美丽。</p>
        <p>我爱你，不止今天，而是每一天！</p>
        <div class="capricorn-modal">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50C90 27.9 72.1 10 50 10ZM50 85C31.3 85 15 68.7 15 50C15 31.3 31.3 15 50 15C68.7 15 85 31.3 85 50C85 68.7 68.7 85 50 85ZM40 30L50 45L60 30L55 40L65 40L55 50L65 60L55 60L60 70L50 55L40 70L35 60L25 60L35 50L25 40L35 40L40 30Z"
              fill="#6c757d" />
          </svg>
        </div>
      </div>
      <div class="modal-footer">
        <el-button id="close-modal" @click="handleClose" type="primary" size="large">
          我也爱你
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入Vue 3 Composition API的核心函数
import { ref, onMounted } from 'vue'

/**
 * 定义组件事件
 */
const emit = defineEmits([
  'close-modal' // 关闭模态框事件
])

/**
 * 处理关闭按钮点击事件
 * 触发close-modal事件，通知父组件关闭模态框
 */
const handleClose = () => {
  emit('close-modal')
}

/**
 * 处理遮罩层点击事件
 * 当点击遮罩层（而不是模态框内容）时，关闭模态框
 * @param {MouseEvent} e - 点击事件对象
 */
const handleOverlayClick = (e) => {
  // 检查点击目标是否为遮罩层本身
  if (e.target === e.currentTarget) {
    emit('close-modal') // 触发关闭事件
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.modal-overlay {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: $primary-gradient;
  backdrop-filter: blur(5px);
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  opacity: 1;
  visibility: visible;
}

.modal-overlay.hidden {
  opacity: 0;
  visibility: hidden;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: $border-radius-2xl;
  padding: $spacing-2xl;
  max-width: 600px;
  width: 90%;
  position: relative;
  transition: all 0.5s ease;
  transform: translateY(0) scale(1);
  box-shadow: $shadow-2xl;
}

.modal-overlay.hidden .modal-content {
  transform: translateY(-30px) scale(0.95);
  opacity: 0;
}



.modal-header h2 {
  color: $primary-color;
  font-size: $font-size-3xl;
  margin-bottom: $spacing-lg;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 0.6s ease forwards 0.2s;
  opacity: 0;
  transform: translateY(-20px);
}

.modal-body {
  padding: $spacing-xl 0;
  margin-bottom: $spacing-xl;
}

.modal-body p {
  color: $text-primary;
  font-size: $font-size-lg;
  line-height: 1.8;
  margin-bottom: $spacing-lg;
  text-align: center;
  font-weight: 500;
  opacity: 0;
  transform: translateY(20px);
}

.modal-body p:nth-child(1) {
  animation: fadeInUp 0.6s ease forwards 0.4s;
}

.modal-body p:nth-child(2) {
  animation: fadeInUp 0.6s ease forwards 0.6s;
}

.modal-body p:nth-child(3) {
  animation: fadeInUp 0.6s ease forwards 0.8s;
}

.modal-body p:nth-child(4) {
  animation: fadeInUp 0.6s ease forwards 1.0s;
  margin-bottom: 0;
  font-weight: bold;
  color: $primary-color;
  font-size: $font-size-xl;
}

.capricorn-modal {
  text-align: center;
  margin: $spacing-xl 0;
  animation: fadeInScale 0.8s ease forwards 1.2s, float 6s ease-in-out infinite 2s;
  opacity: 0;
  transform: scale(0.8);
}



.modal-footer {
  text-align: center;
}

#close-modal {
  background: $primary-gradient !important;
  color: $text-light !important;
  border: none !important;
  padding: $spacing-lg $spacing-3xl !important;
  font-size: $font-size-lg !important;
  font-weight: bold !important;
  border-radius: $border-radius-full !important;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba($primary-color, 0.4);
  --el-button-bg-color: $primary-gradient !important;
  --el-button-border-color: transparent !important;
  --el-button-text-color: $text-light !important;
  --el-button-hover-bg-color: $primary-gradient !important;
  --el-button-hover-border-color: transparent !important;
  --el-button-hover-text-color: $text-light !important;
  animation: fadeInUp 0.8s ease forwards 1.4s;
  opacity: 0;
  transform: translateY(30px);
}

#close-modal:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

/* 响应式设计 */
/* 关键帧动画定义 */
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* 响应式设计 */
@media (max-width: $breakpoint-md) {
  .modal-content {
    padding: $spacing-xl;
  }

  .modal-header h2 {
    font-size: $font-size-2xl;
  }

  .modal-body p {
    font-size: $font-size-md;
    margin-bottom: $spacing-md;
  }

  .modal-body p:last-child {
    font-size: $font-size-lg;
  }

  #close-modal {
    padding: $spacing-md $spacing-2xl;
    font-size: $font-size-md;
  }
}
</style>