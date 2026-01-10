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
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

/**
 * 定义组件事件
 */
const emit = defineEmits([
  'close-modal' // 关闭模态框事件
])

// 动画管理
let overlayAnimation = null
let contentAnimation = null
let headerAnimation = null
let paragraphAnimations = []
let capricornAnimation = null
let buttonAnimation = null

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

// 模态框遮罩层淡入动画
const animateOverlay = () => {
  const overlay = document.querySelector('.modal-overlay')
  if (overlay) {
    overlayAnimation = gsap.fromTo(overlay,
      {
        opacity: 0,
        visibility: 'hidden'
      },
      {
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: 'power2.out'
      }
    )
  }
}

// 模态框内容进入动画
const animateContent = () => {
  const content = document.querySelector('.modal-content')
  if (content) {
    contentAnimation = gsap.fromTo(content,
      {
        y: -30,
        scale: 0.95,
        opacity: 0
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }
    )
  }
}

// 标题淡入动画
const animateHeader = () => {
  const header = document.querySelector('.modal-header h2')
  if (header) {
    headerAnimation = gsap.fromTo(header,
      {
        y: -20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
      }
    )
  }
}

// 段落淡入动画
const animateParagraphs = () => {
  const paragraphs = document.querySelectorAll('.modal-body p')
  paragraphAnimations = []

  paragraphs.forEach((p, index) => {
    const anim = gsap.fromTo(p,
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.4 + (index * 0.2),
        ease: 'power2.out'
      }
    )
    paragraphAnimations.push(anim)
  })
}

// 魔羯座元素动画
const animateCapricorn = () => {
  const capricorn = document.querySelector('.capricorn-modal')
  if (capricorn) {
    const tl = gsap.timeline()

    tl.fromTo(capricorn,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: 1.2,
        ease: 'back.out(1.7)'
      }
    )

    tl.to(capricorn, {
      y: -20,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '+=0.8')

    capricornAnimation = tl
  }
}

// 按钮淡入动画
const animateButton = () => {
  const button = document.querySelector('#close-modal')
  if (button) {
    buttonAnimation = gsap.fromTo(button,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 1.4,
        ease: 'power2.out'
      }
    )
  }
}

// 初始化所有动画
const initAnimations = () => {
  animateOverlay()
  animateContent()
  animateHeader()
  animateParagraphs()
  animateCapricorn()
  animateButton()
}

// 组件挂载时初始化动画
onMounted(() => {
  initAnimations()
})

// 组件卸载时清理动画
onUnmounted(() => {
  if (overlayAnimation) overlayAnimation.kill()
  if (contentAnimation) contentAnimation.kill()
  if (headerAnimation) headerAnimation.kill()
  paragraphAnimations.forEach(anim => anim.kill())
  if (capricornAnimation) capricornAnimation.kill()
  if (buttonAnimation) buttonAnimation.kill()
})
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
}

.modal-body p:nth-child(4) {
  margin-bottom: 0;
  font-weight: bold;
  color: $primary-color;
  font-size: $font-size-xl;
}

.capricorn-modal {
  text-align: center;
  margin: $spacing-xl 0;
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
}

#close-modal:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
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