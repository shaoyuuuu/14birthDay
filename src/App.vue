<template>
  <div class="app">
    <!-- 打字机特效区域 - 初始显示打字效果 -->
    <section id="typewriter-section" class="section" v-if="currentSection === 'typewriter'">
      <!-- 打字机组件，完成后触发切换到回忆界面的事件 -->
      <Typewriter @typewriter-complete="switchToTimeline" />
    </section>

    <!-- 时间轴回忆界面 - 点击开始回忆后显示 -->
    <section id="timeline-section" class="section" v-if="currentSection === 'timeline'">
      <!-- 回忆页面组件 - 整合动态背景和时间轴 -->
      <MemoryPage />
    </section>
  </div>
</template>

<script setup>
/**
 * App.vue - 应用主组件
 * 管理应用的整体布局和界面切换逻辑
 */

// 引入Vue 3 Composition API的ref函数用于创建响应式数据
import { ref } from 'vue'

// 引入项目组件
import Typewriter from './components/Typewriter.vue' // 打字机特效组件
import MemoryPage from './components/MemoryPage.vue' // 回忆页面组件

// 响应式数据定义
const currentSection = ref('typewriter') // 当前显示的界面：'typewriter' 或 'timeline'

/**
 * 切换到时间轴回忆界面
 * 由Typewriter组件的typewriter-complete事件触发
 */
const switchToTimeline = () => {
  currentSection.value = 'timeline'
}
</script>

<style lang="scss">
// 引入SCSS变量文件
@use './assets/scss/_variables' as *;

.app {
  min-height: 100vh; // 确保应用占满整个视口高度
  overflow: hidden;
}

.section {
  min-height: 100vh; // 每个界面占满整个视口高度
  display: flex; // 使用Flexbox布局
  align-items: center; // 垂直居中
  justify-content: center; // 水平居中
  animation: sectionEnter 1s cubic-bezier(0.4, 0, 0.2, 1); // 界面进入动画
}
</style>