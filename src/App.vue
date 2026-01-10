<template>
  <div class="app">
    <!-- 打字机特效区域 - 初始显示打字效果 -->
    <section id="typewriter-section" class="section" v-if="appStore.currentSection === 'typewriter'">
      <Typewriter @typewriter-complete="switchToTimeline" />
    </section>

    <!-- 时间轴回忆界面 - 点击开始回忆后显示 -->
    <section id="timeline-section" class="section" v-if="appStore.currentSection === 'timeline'">
      <MemoryPage />
    </section>
  </div>
</template>

<script setup>
/**
 * App.vue - 应用主组件
 * 管理应用的整体布局和界面切换逻辑
 */

import { defineAsyncComponent, onMounted } from 'vue'
import appStore, { actions, loadPreferences } from './store/index.js'

// 使用异步组件实现懒加载，优化首屏加载性能
const Typewriter = defineAsyncComponent(() =>
  import('./components/Typewriter.vue')
)
const MemoryPage = defineAsyncComponent(() =>
  import('./views/MemoryPage.vue')
)

// 组件挂载时加载用户偏好
onMounted(() => {
  loadPreferences()
})

/**
 * 切换到时间轴回忆界面
 */
const switchToTimeline = () => {
  actions.setCurrentSection('timeline')
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