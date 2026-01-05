<template>
    <div class="memory-page-container">
        <!-- 动态背景组件 -->
        <DynamicBackground :speed="speed" :petalCount="petalCount" />

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载回忆...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
            <p>加载回忆失败: {{ error.message }}</p>
            <button @click="loadMemories">重试</button>
        </div>

        <!-- 时间轴组件 -->
        <Timeline v-else :items="timelineItems" :autoPlay="autoPlay" :autoPlayInterval="autoPlayInterval"
            @timeline-complete="handleTimelineComplete" />
    </div>
</template>

<script setup>
/**
 * MemoryPage.vue - 回忆页面组件
 * 整合动态背景和时间轴组件，作为完整的回忆页面
 */

// 引入Vue 3 Composition API的ref函数
import { ref } from 'vue'

// 引入必要的组件
import DynamicBackground from './DynamicBackground.vue'
import Timeline from './Timeline.vue'

// 引入回忆加载组合式函数
import useMemoryLoader from '../composables/useMemoryLoader'

/**
 * 定义组件属性
 */
const props = defineProps({
    /**
     * 樱花飘落速度
     */
    speed: {
        type: Number,
        default: 0.2
    },
    /**
     * 樱花花瓣数量
     */
    petalCount: {
        type: Number,
        default: 20
    },
    /**
     * 是否启用自动播放
     */
    autoPlay: {
        type: Boolean,
        default: false
    },
    /**
     * 自动播放间隔时间（毫秒）
     */
    autoPlayInterval: {
        type: Number,
        default: 5000
    }
})

/**
 * 使用回忆加载组合式函数
 */
const { timelineItems, isLoading, error, loadMemories } = useMemoryLoader()

/**
 * 定义组件事件
 */
const emit = defineEmits([
    'timeline-complete' // 时间轴浏览完成事件
])

/**
 * 处理时间轴完成事件
 */
const handleTimelineComplete = () => {
    emit('timeline-complete')
}
</script>

<style lang="scss" scoped>
.memory-page-container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: hidden;
    padding-bottom: 80px;
}

/* 确保DynamicBackground组件能撑满容器高度 */
.memory-page-container>.DynamicBackground {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 80px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

/* 让Timeline组件保持其内部的flex布局 */
.memory-page-container>.Timeline {
    width: 100%;
    flex: 1;
}

/* 加载状态样式 */
.loading-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 10;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 错误状态样式 */
.error-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 8px;
}

.error-container button {
    background: white;
    color: #667eea;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    font-weight: bold;
}

.error-container button:hover {
    background: #f0f0f0;
}
</style>