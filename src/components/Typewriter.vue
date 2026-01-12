<template>
  <div class="container">
    <!-- 背景装饰元素 -->
    <div class="background-decorations">
      <div class="decoration-star star-1"></div>
      <div class="decoration-star star-2"></div>
      <div class="decoration-star star-3"></div>
      <div class="decoration-star star-4"></div>
      <div class="decoration-star star-5"></div>
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-glow glow-1"></div>
      <div class="decoration-glow glow-2"></div>
    </div>
    
    <!-- 打字机效果容器 -->
    <div class="typewriter-container">
      <!-- 卡片内容区域 -->
      <div class="card-content">
        <h1>
          {{ displayText }} <!-- 显示当前正在输入的文本 -->
          <span class="cursor">|</span> <!-- 光标动画 -->
        </h1>
        <!-- 开始回忆按钮，当所有文字显示完成后出现 -->
        <div class="start-button-container" v-if="showStartButton">
          <button class="start-button" @click="handleStartRecall">
            <span class="button-icon">✨</span>
            <span class="button-text">开始回忆</span>
            <span class="button-glow"></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 魔羯座元素（星座装饰） -->
    <div class="capricorn-element">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50C90 27.9 72.1 10 50 10ZM50 85C31.3 85 15 68.7 15 50C15 31.3 31.3 15 50 15C68.7 15 85 31.3 85 50C85 68.7 68.7 85 50 85ZM40 30L50 45L60 30L55 40L65 40L55 50L65 60L55 60L60 70L50 55L40 70L35 60L25 60L35 50L25 40L35 40L40 30Z"
          fill="rgba(255, 255, 255, 0.8)" />
      </svg>
    </div>
  </div>
</template>

<script setup>
/**
 * Typewriter.vue 打字机效果组件
 * 实现逐字显示文本的打字机效果，支持多段文本换行和完成事件
 */

// 引入Vue 3 Composition API的ref和onMounted
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

// 定义组件属性
const props = defineProps({
  /**
   * 打字机显示的文本数组
   */
  texts: {
    type: Array,
    default: () => [
      '亲爱的，生日快乐！',
      '今天是你的特别日子，',
      '让我们一起回顾我们的美好时光...'
    ]
  },
  /**
   * 打字速度（毫秒/字符）
   */
  speed: {
    type: Number,
    default: 100
  }
})

// 定义组件事件
const emit = defineEmits(['typewriter-complete']) // 打字完成事件

// 响应式数据定义
const displayText = ref('') // 当前显示的文本
const textIndex = ref(0) // 当前文本数组的索引
const charIndex = ref(0) // 当前文本的字符索引
const timer = ref(null) // 打字动画定时器
const showStartButton = ref(false) // 是否显示开始回忆按钮
const accumulatedText = ref('') // 累积的文本内容

// 动画管理
let cardAnimation = null
let buttonAnimation = null
let cursorAnimation = null
let capricornAnimation = null

/**
 * 打字机核心逻辑
 * 实现逐字显示文本的效果，支持多段文本换行
 */
const type = () => {
  const currentText = props.texts[textIndex.value] // 获取当前要显示的文本

  // 逐字显示当前文本
  if (charIndex.value <= currentText.length) {
    displayText.value = accumulatedText.value + currentText.substring(0, charIndex.value)
    charIndex.value++
    timer.value = setTimeout(type, props.speed)
    return
  }

  // 检查是否为最后一段文本
  if (textIndex.value === props.texts.length - 1) {
    showStartButton.value = true // 显示开始回忆按钮
    nextTick(() => {
      animateButton() // 等待DOM更新后触发按钮动画
    })
    return
  }

  // 累积当前文本并切换到下一段文本
  accumulatedText.value += currentText + '\n'
  textIndex.value++
  charIndex.value = 0
  timer.value = setTimeout(type, 1000) // 延迟1秒后开始显示下一段
}

/**
 * 处理开始回忆按钮点击事件
 * 触发打字机完成事件，通知父组件切换到回忆界面
 */
const handleStartRecall = () => {
  emit('typewriter-complete')
}

// 卡片进入动画
const animateCardEnter = () => {
  const cardContent = document.querySelector('.card-content')
  if (cardContent) {
    cardAnimation = gsap.fromTo(cardContent,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      }
    )
  }
}

// 背景装饰元素进入动画
const animateDecorations = () => {
  const stars = document.querySelectorAll('.decoration-star')
  const circles = document.querySelectorAll('.decoration-circle')
  const glows = document.querySelectorAll('.decoration-glow')
  
  gsap.fromTo(stars,
    { opacity: 0, scale: 0 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 0.6, 
      stagger: 0.1, 
      ease: 'back.out(1.7)',
      delay: 0.3
    }
  )
  
  gsap.fromTo(circles,
    { opacity: 0, scale: 0.8 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 0.8, 
      stagger: 0.2, 
      ease: 'power2.out',
      delay: 0.5
    }
  )
  
  gsap.fromTo(glows,
    { opacity: 0, scale: 0.5 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 1, 
      stagger: 0.3, 
      ease: 'power2.out',
      delay: 0.7
    }
  )
}

// 按钮淡入动画
const animateButton = () => {
  const startButton = document.querySelector('.start-button')
  if (startButton) {
    buttonAnimation = gsap.fromTo(startButton,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out'
      }
    )
  }
}

// 魔羯座元素浮动动画
const animateCapricorn = () => {
  const capricorn = document.querySelector('.capricorn-element')
  if (capricorn) {
    capricornAnimation = gsap.to(capricorn, {
      y: -20,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }
}

// 组件挂载后开始打字效果
onMounted(() => {
  type()
  animateCardEnter()
  animateDecorations()
  animateCapricorn()
})

// 组件卸载前清除定时器和动画，避免内存泄漏
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  if (cardAnimation) {
    cardAnimation.kill()
  }
  if (buttonAnimation) {
    buttonAnimation.kill()
  }
  if (capricornAnimation) {
    capricornAnimation.kill()
  }
})
</script>

<style lang="scss" scoped>
// 引入SCSS变量文件
@use '../assets/scss/_variables' as *;

.container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary-gradient;
  transition: all 0.8s ease;
}

.background-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
}

.star-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.star-2 {
  top: 25%;
  right: 15%;
  animation-delay: 0.5s;
}

.star-3 {
  top: 60%;
  left: 8%;
  animation-delay: 1s;
}

.star-4 {
  bottom: 20%;
  right: 12%;
  animation-delay: 1.5s;
}

.star-5 {
  top: 45%;
  left: 20%;
  animation-delay: 2s;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 150px;
  height: 150px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.circle-2 {
  width: 100px;
  height: 100px;
  bottom: 15%;
  right: 8%;
  animation-delay: 2s;
}

.decoration-glow {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.glow-1 {
  width: 300px;
  height: 300px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.glow-2 {
  width: 250px;
  height: 250px;
  bottom: 25%;
  left: 15%;
  animation-delay: 2s;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.6;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.typewriter-container {
  width: 100%;
  max-width: 600px;
  padding: 0 $spacing-lg;
  position: relative;
  z-index: 2; // 确保内容显示在装饰元素之上
}

.card-content {
  width: 100%;
  padding: $spacing-2xl $spacing-lg;
  text-align: center;
  transition: all 0.5s ease;
  position: relative;
}

.card-content::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  border-radius: 20px;
  z-index: -1;
  opacity: 0;
  animation: cardGlow 3s ease-in-out infinite;
}

@keyframes cardGlow {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

h1 {
  font-size: $font-size-4xl;
  font-weight: 700;
  color: $text-light;
  margin-bottom: $spacing-xl;
  line-height: 1.5;
  display: block;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: pre-line;
  transition: all 0.5s ease;
  opacity: 1;
  letter-spacing: 0.02em;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  border-radius: 2px;
  opacity: 0;
  animation: lineAppear 1s ease-out 2s forwards;
}

@keyframes lineAppear {
  to {
    opacity: 1;
  }
}

.cursor {
  font-size: $font-size-4xl;
  color: $text-light;
  vertical-align: bottom;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
  display: inline-block;
  animation: cursorBlink 1s ease-in-out infinite;
}

@keyframes cursorBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.start-button-container {
  text-align: center;
  margin-top: $spacing-2xl;
  z-index: 2;
  transition: all 0.5s ease;
}

.start-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-3xl;
  font-size: $font-size-xl;
  font-weight: bold;
  color: $primary-color;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: $border-radius-full;
  cursor: pointer;
  transition: all $transition-fast cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  opacity: 0;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.button-icon {
  font-size: $font-size-2xl;
  animation: sparkle 2s ease-in-out infinite;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  transition: left 0.6s ease;
  z-index: 1;
}

.start-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 35px rgba(0, 0, 0, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-color: rgba(255, 255, 255, 0.9);
}

.start-button:hover .button-glow {
  left: 100%;
}

.start-button:hover .button-icon {
  animation: sparkle 0.8s ease-in-out infinite;
  transform: scale(1.2) rotate(15deg);
}

.start-button:active {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 15px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1) rotate(10deg);
  }
}

.capricorn-element {
  position: absolute;
  top: 20%;
  right: 10%;
  opacity: 0.3;
  z-index: 1;
  transition: all 0.8s ease;
}

/* 响应式设计 */
@media (max-width: $breakpoint-md) {

  // 中等屏幕尺寸
  h1 {
    font-size: $font-size-2xl;
  }

  .cursor {
    font-size: $font-size-2xl;
  }

  .start-button {
    padding: $spacing-md $spacing-2xl;
    font-size: $font-size-lg;
  }

  .button-icon {
    font-size: $font-size-xl;
  }

  .decoration-circle.circle-1 {
    width: 100px;
    height: 100px;
  }

  .decoration-circle.circle-2 {
    width: 70px;
    height: 70px;
  }

  .decoration-glow.glow-1 {
    width: 200px;
    height: 200px;
  }

  .decoration-glow.glow-2 {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: $breakpoint-sm) {

  // 小屏幕尺寸
  h1 {
    font-size: $font-size-xl;
  }

  .cursor {
    font-size: $font-size-xl;
  }

  .start-button {
    padding: $spacing-sm $spacing-xl;
    font-size: $font-size-md;
  }

  .button-icon {
    font-size: $font-size-lg;
  }

  .capricorn-element {
    width: 80px;
    height: 80px;
    right: 5%;
  }

  .decoration-star {
    width: 3px;
    height: 3px;
  }

  .decoration-circle.circle-1 {
    width: 80px;
    height: 80px;
  }

  .decoration-circle.circle-2 {
    width: 50px;
    height: 50px;
  }

  .decoration-glow.glow-1 {
    width: 150px;
    height: 150px;
  }

  .decoration-glow.glow-2 {
    width: 120px;
    height: 120px;
  }
}
</style>