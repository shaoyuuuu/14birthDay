<template>
    <div class="memory-page-container">
        <!-- 动态背景组件 -->
        <DynamicBackground :speed="speed" :petalCount="petalCount" />
        <!-- 时间轴组件 -->
        <Timeline :items="timelineItems" :autoPlay="autoPlay" :autoPlayInterval="autoPlayInterval"
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

/**
 * 定义组件属性
 */
const props = defineProps({
    /**
     * 时间轴项目数组
     */
    timelineItems: {
        type: Array,
        default: () => [
            { date: '2023-01-15', title: '第一次相遇', description: '那天的阳光很好，你穿着白色的裙子，我知道，我的心被你偷走了。', images: ['https://picsum.photos/id/1027/600/800', 'https://picsum.photos/id/1035/600/800', 'https://picsum.photos/id/1040/600/800'], memory: '还记得在图书馆的转角，你低头看书的样子，那一刻时间仿佛静止了。' },
            { date: '2023-02-14', title: '情人节告白', description: '鼓起勇气向你表白，谢谢你给了我这个机会，让我能够陪伴在你身边。', images: ['https://picsum.photos/id/1035/600/800', 'https://picsum.photos/id/1069/600/800'], memory: '在咖啡厅里，我紧张得手都在抖，但看到你微笑的那一刻，一切都值得了。' },
            { date: '2023-06-01', title: '一起过六一', description: '像孩子一样一起吃冰淇淋，逛游乐园，那是我最快乐的一天。', images: ['https://picsum.photos/id/1040/800/600', 'https://picsum.photos/id/1050/600/800', 'https://picsum.photos/id/1060/800/600'], memory: '旋转木马上的你笑得那么开心，我多么希望时间能永远停留在那一刻。' },
            { date: '2023-12-30', title: '你的生日', description: '今天是你的生日，我想对你说，谢谢你出现在我的生命里，我爱你。', images: ['https://picsum.photos/id/1069/600/800', 'https://picsum.photos/id/1070/800/600'], memory: '这一年有你陪伴，每一天都充满了幸福和温暖，祝你生日快乐，我的宝贝。' }
        ]
    },
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
    height: 100vh;
    overflow: hidden;
    position: relative;
}
</style>