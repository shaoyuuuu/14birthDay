<template>
  <div class="container">
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
          <el-button type="primary" size="large" class="start-button" @click="handleStartRecall">
            开始回忆
          </el-button>
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
import { ref, onMounted, onUnmounted } from 'vue'

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

/**
 * 打字机核心逻辑
 * 实现逐字显示文本的效果，支持多段文本换行
 */
const type = () => {
  const currentText = props.texts[textIndex.value] // 获取当前要显示的文本

  // 逐字显示当前文本
  if (charIndex.value <= currentText.length) {
    displayText.value = currentText.substring(0, charIndex.value)
    charIndex.value++
    timer.value = setTimeout(type, props.speed)
    return
  }

  // 检查是否为最后一段文本
  if (textIndex.value === props.texts.length - 1) {
    showStartButton.value = true // 显示开始回忆按钮
    return
  }

  // 切换到下一段文本
  displayText.value += '\n'
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

// 组件挂载后开始打字效果
onMounted(() => {
  type()
})

// 组件卸载前清除定时器，避免内存泄漏
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value)
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
  background: $primary-gradient; // 使用主渐变色背景
  transition: all 0.8s ease;
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
  animation: cardEnter 0.8s ease-out;
  transition: all 0.5s ease;
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
}

.cursor {
  font-size: $font-size-4xl;
  color: $text-light;
  animation: blink 1s infinite;
  vertical-align: bottom;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
}

.start-button-container {
  text-align: center;
  margin-top: $spacing-2xl;
  z-index: 2;
  transition: all 0.5s ease;
}

.start-button {
  background: rgba(255, 255, 255, 0.9) !important;
  color: $primary-color !important;
  border: none !important;
  padding: $spacing-lg $spacing-3xl !important;
  font-size: $font-size-xl !important;
  font-weight: bold !important;
  border-radius: $border-radius-full !important;
  cursor: pointer !important;
  transition: all $transition-fast !important;
  box-shadow: $shadow-md !important;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards 0.3s;
  // 覆盖Element Plus按钮默认样式
  --el-button-text-color: $primary-color !important;
  --el-button-bg-color: rgba(255, 255, 255, 0.9) !important;
  --el-button-border-color: transparent !important;
  --el-button-hover-bg-color: $text-light !important;
  --el-button-hover-text-color: $primary-color !important;
  --el-button-hover-border-color: transparent !important;
  --el-button-active-bg-color: rgba(255, 255, 255, 0.95) !important;
}

.start-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  background: $text-light;
}

.capricorn-element {
  position: absolute;
  top: 20%;
  right: 10%;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
  z-index: 1;
  transition: all 0.8s ease;
}

// 增强的动画效果
@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
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

  // 中等屏幕尺寸
  h1 {
    font-size: $font-size-2xl;
  }

  .cursor {
    font-size: $font-size-2xl;
  }

  .start-button {
    padding: $spacing-md $spacing-2xl !important;
    font-size: $font-size-lg !important;
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
    padding: $spacing-sm $spacing-xl !important;
    font-size: $font-size-md !important;
  }

  .capricorn-element {
    width: 80px;
    height: 80px;
    right: 5%;
  }
}
</style>