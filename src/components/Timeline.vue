<template>
  <div class="cloud-report-container">
    <!-- 滑动容器 -->
    <div class="slider-container" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <div class="slider-track" ref="sliderTrack">
        <TimelineCard v-for="(item, index) in timelineItems" :key="index" :item="item" :index="index"
          :background="getCardBackground(index)" @image-change="(imgSrc, idx) => handleImageChange(imgSrc, idx)" />
      </div>
    </div>

    <!-- 火柴人进度指示器 -->
    <div class="stick-figure-progress">
      <StickFigure :progress="progressPercentage" :size="20" :comment="currentComment" :is-sliding="isSliding" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StickFigure from './StickFigure.vue'
import TimelineCard from './TimelineCard.vue'
import gsap from 'gsap'
import useImagePreload from '../composables/useImagePreload'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['timeline-complete'])

const timelineItems = ref(props.items.map(item => ({
  ...item,
  currentImage: item.images[0] || ''
})))

// 核心状态
const currentIndex = ref(0)
const isSliding = ref(false)
const sliderTrack = ref(null)
let touchStartX = 0

// 动画配置
const ANIMATION_DURATION = 0.6
const ANIMATION_EASE = 'power2.inOut'

// 计算属性
const progressPercentage = computed(() => {
  if (timelineItems.value.length <= 1) return 0
  return (currentIndex.value / (timelineItems.value.length - 1)) * 100
})

const currentComment = computed(() => {
  return timelineItems.value[currentIndex.value]?.comment || ''
})

// 卡片背景渐变
const getCardBackground = (index) => {
  // 与SCSS变量保持一致的绿色主题渐变
  const gradients = [
    'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)', // 与$primary-gradient一致
    'linear-gradient(135deg, #aed581 0%, #81c784 100%)', // 与$accent-color和$secondary-color一致
    'linear-gradient(135deg, #c5e1a5 0%, #aed581 100%)',
    'linear-gradient(135deg, #dcedc8 0%, #c5e1a5 100%)',
    'linear-gradient(135deg, #e8f5e8 0%, #dcedc8 100%)'  // 与$background-accent一致
  ]
  return gradients[index % gradients.length]
}

// 滑动逻辑
const goToIndex = (index) => {
  if (index < 0 || index >= timelineItems.value.length || isSliding.value) return

  isSliding.value = true

  gsap.to(sliderTrack.value, {
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
    x: `-${index * 100}%`,
    onComplete: () => {
      currentIndex.value = index
      isSliding.value = false
      checkIfAllItemsViewed()
    }
  })
}

const nextItem = () => goToIndex(currentIndex.value + 1)
const prevItem = () => goToIndex(currentIndex.value - 1)

// 触摸事件
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const swipeDistance = touchEndX - touchStartX
  const threshold = 30

  if (Math.abs(swipeDistance) > threshold) {
    swipeDistance < 0 ? nextItem() : prevItem()
  }
}

// 图片切换
const handleImageChange = (imgSrc, index) => {
  if (timelineItems.value[index]) {
    timelineItems.value[index].currentImage = imgSrc
  }
}

// 完成检查
const checkIfAllItemsViewed = () => {
  if (currentIndex.value === timelineItems.value.length - 1) {
    setTimeout(() => emit('timeline-complete'), 2000)
  }
}

// 图片预加载
const { preloadImages, extractImagesFromTimeline } = useImagePreload()

onMounted(() => {
  const allImages = extractImagesFromTimeline(timelineItems.value)
  preloadImages(allImages)
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.cloud-report-container {
  width: 100%;
  height: calc(100vh);
  position: relative;
  font-family: $font-family;
  background: transparent;
  overflow: hidden;
}

.slider-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slider-track {
  display: flex;
  height: 100%;
}

.stick-figure-progress {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 100;
  padding: $spacing-sm;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(to top, rgba($primary-color, 0.1), rgba($secondary-color, 0.05));
  border-radius: 15px 15px 0 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 响应式设计 */
@media (max-width: $breakpoint-sm) {
  .stick-figure-progress {
    height: 60px;
    padding: $spacing-xs;
    border-radius: 10px 10px 0 0;
  }

  /* 公路分隔线动画 - 移动端优化 */
  .stick-figure-progress::before {
    height: 4px;
    background-size: 100px;
    animation: animateRoad 0.6s linear infinite;
  }

  /* 公路底部阴影 - 移动端优化 */
  .stick-figure-progress::after {
    height: 10px;
  }
}

/* 公路分隔线动画 */
.stick-figure-progress::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 50%, transparent 50%, transparent 100%);
  background-size: 150px;
  animation: animateRoad 0.8s linear infinite;
  border-radius: 3px;
  box-shadow: $shadow-sm;
}

/* 公路底部阴影 */
.stick-figure-progress::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
  box-shadow: $shadow-md;
  border-radius: 0 0 $border-radius-md $border-radius-md;
}

/* 公路分隔线滚动动画 */
@keyframes animateRoad {
  0% {
    background-position: 0px;
  }

  100% {
    background-position: -150px;
  }
}
</style>