<template>
  <div class="cloud-report-container">
    <!-- 滑动容器 -->
    <div class="slider-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
      @touchend="handleTouchEnd">
      <div class="slider-track" ref="sliderTrack">
        <TimelineCard v-for="(item, index) in timelineItems" :key="index" :item="item" :index="index"
          :background="getCardBackground(index)" @card-enter="handleCardEnter"
          @image-change="(imgSrc, itemIndex) => handleImageChange(imgSrc, index)" />
      </div>
    </div>

    <!-- 火柴人进度指示器（替代原进度条） -->
    <div class="stick-figure-progress">
      <StickFigure :progress="progressPercentage" :size="20" />
    </div>

    <!-- 右侧滑动引导动画 -->
    <div class="swipe-guide">
      <div class="swipe-indicator" ref="swipeIndicator"></div>
    </div>
  </div>
</template>

<script setup>
// 引入Vue 3 Composition API的核心函数
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
// 引入组件
import StickFigure from './StickFigure.vue'
import TimelineCard from './TimelineCard.vue'
// 引入GSAP动画库
import gsap from 'gsap'
// 引入图片预加载composable
import useImagePreload from '../composables/useImagePreload'

/**
 * 定义组件属性
 */
const props = defineProps({
  /**
   * 时间轴项目数组
   * 每个项目包含标题、日期、图片、描述和回忆内容
   */
  items: {
    type: Array,
    required: true
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
 * 响应式数据定义
 */
const timelineItems = ref(props.items.map(item => ({
  ...item,
  currentImage: item.images[0] || '' // 为每个项目单独维护当前显示的图片
}))) // 时间轴项目列表
const currentIndex = ref(0) // 当前显示的卡片索引
const sliderTrack = ref(null) // 滑动轨道ref引用
const swipeIndicator = ref(null) // 右侧滑动引导指示器ref引用
let autoPlayTimer = null // 自动播放定时器
let touchStartX = 0 // 触摸开始X坐标
let touchStartY = 0 // 触摸开始Y坐标
let touchEndX = 0 // 触摸结束X坐标
let swipeGuideTimeline = null // 滑动引导动画时间线

/**
 * 计算进度百分比
 * 根据当前索引计算进度条填充比例
 */
const progressPercentage = computed(() => {
  if (timelineItems.value.length === 1) {
    return 0 // 只有一张卡片时，火柴人始终在最左端
  }
  return (currentIndex.value / (timelineItems.value.length - 1)) * 100
})

/**
 * 获取卡片背景渐变
 * 根据索引返回不同的渐变色，实现卡片视觉多样性
 */
const getCardBackground = (index) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ]
  return gradients[index % gradients.length] // 循环使用渐变数组
}

/**
 * 跳转到指定索引
 * @param {number} index - 目标索引
 */
const goToIndex = (index) => {
  // 检查索引是否在有效范围内
  if (index >= 0 && index < timelineItems.value.length) {
    // 先更新当前索引，确保动画过程中显示正确内容
    currentIndex.value = index
    // 使用GSAP实现平滑滑动动画
    gsap.to(sliderTrack.value, {
      duration: 0.8,
      ease: 'power2.inOut',
      x: `-${index * 100}%`,
      onComplete: () => {
        checkIfAllItemsViewed() // 检查是否浏览完所有项目
      }
    })
  }
}

/**
 * 切换到下一个卡片
 */
const nextItem = () => {
  // 使用模运算实现循环切换
  goToIndex((currentIndex.value + 1) % timelineItems.value.length)
}

/**
 * 切换到上一个卡片
 */
const prevItem = () => {
  // 使用模运算实现循环切换（处理负数情况）
  goToIndex((currentIndex.value - 1 + timelineItems.value.length) % timelineItems.value.length)
}

/**
 * 处理触摸开始事件
 * @param {TouchEvent} e - 触摸事件对象
 */
const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX // 记录触摸开始位置
  touchStartY = e.changedTouches[0].screenY // 记录触摸开始Y坐标，用于判断滑动方向
}

/**
 * 处理触摸移动事件
 * @param {TouchEvent} e - 触摸事件对象
 */
const handleTouchMove = (e) => {
  const touchX = e.changedTouches[0].screenX
  const touchY = e.changedTouches[0].screenY

  // 计算水平和垂直滑动距离
  const deltaX = touchX - touchStartX
  const deltaY = touchY - touchStartY

  // 如果是水平滑动，阻止默认行为，防止触发浏览器的后退/前进操作
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    e.preventDefault()
  }
}

/**
 * 处理触摸结束事件
 * @param {TouchEvent} e - 触摸事件对象
 */
const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX // 记录触摸结束位置
  handleSwipe(e) // 处理滑动逻辑，并传入事件对象
}

/**
 * 处理滑动逻辑
 * 根据滑动距离判断是否需要切换卡片
 * @param {TouchEvent} e - 触摸事件对象，用于阻止默认行为
 */
const handleSwipe = (e) => {
  const swipeThreshold = 50 // 滑动阈值（像素）
  const swipeDistance = touchEndX - touchStartX // 计算滑动距离

  // 判断是否为有效的滑动
  if (Math.abs(swipeDistance) > swipeThreshold) {
    // 阻止默认行为，防止触发浏览器的后退/前进操作
    if (e.cancelable) {
      e.preventDefault()
    }

    // 向左滑动超过阈值
    if (swipeDistance < -swipeThreshold) {
      nextItem() // 切换到下一张
    }
    // 向右滑动超过阈值
    else if (swipeDistance > swipeThreshold) {
      prevItem() // 切换到上一张
    }
  }
}

/**
 * 处理卡片进入动画
 * 现在这个函数只是一个占位符，因为实际的卡片进入动画已经移至TimelineCard组件中
 */
const handleCardEnter = () => {
  // 这里可以添加全局的卡片进入动画效果，或保留为空
  // 实际的卡片内部动画由TimelineCard组件的createCardEnterAnimation处理
}

/**
 * 切换主图片
 * @param {object} item - 当前项目
 * @param {string} imgSrc - 要切换到的图片路径
 */
/**
 * 处理图片切换事件
 * @param {string} imgSrc - 要切换到的图片路径
 * @param {number} index - 当前时间轴项目索引
 */
const handleImageChange = (imgSrc, index) => {
  const item = timelineItems.value[index]
  if (!item) return

  // 直接更新当前图片，不等待预加载完成
  item.currentImage = imgSrc

  // 检查图片是否已加载，如果没有则在后台预加载
  const preloadedImage = preloadedImages.value[imgSrc]
  if (!preloadedImage) {
    // 在后台预加载图片，不阻塞图片切换
    preloadImage(imgSrc)
  }
}



/**
 * 图片加载管理 - 使用composable
 */
const {
  preloadedImages,
  imagesLoaded,
  loadingProgress,
  preloadImage,
  preloadImages,
  extractImagesFromTimeline
} = useImagePreload()

/**
 * 检查是否浏览到最后一张卡片
 * 当浏览到最后一张卡片时，触发完成事件
 */
const checkIfAllItemsViewed = () => {
  // 当用户浏览到最后一个时间点
  if (currentIndex.value === timelineItems.value.length - 1) {
    // 延迟2秒后触发完成事件，给用户足够时间查看最后一张卡片
    setTimeout(() => {
      emit('timeline-complete') // 通知父组件时间轴浏览完成
    }, 2000)
  }
}

/**
 * 设置自动播放
 * 根据props配置启动自动切换功能
 */
const setupAutoPlay = () => {
  if (props.autoPlay) {
    // 设置定时器，自动切换到下一张卡片
    autoPlayTimer = setInterval(nextItem, props.autoPlayInterval)
  }
}

/**
 * 清理自动播放
 * 组件卸载时清除定时器，避免内存泄漏
 */
const clearAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer) // 清除定时器
    autoPlayTimer = null // 重置定时器引用
  }
}

/**
 * 创建右侧滑动引导动画
 * 使用GSAP实现平滑的滑动提示动画
 */
const createSwipeGuideAnimation = () => {
  if (swipeGuideTimeline) {
    swipeGuideTimeline.kill()
  }

  swipeGuideTimeline = gsap.timeline({
    repeat: -1,
    duration: 2,
    ease: 'power2.inOut'
  })

  swipeGuideTimeline.to(swipeIndicator.value, {
    x: -20,
    opacity: 1,
    duration: 1,
    ease: 'power2.inOut'
  })
    .to(swipeIndicator.value, {
      x: 0,
      opacity: 0.7,
      duration: 1,
      ease: 'power2.inOut'
    })
}

/**
 * 清理右侧滑动引导动画
 */
const clearSwipeGuideAnimation = () => {
  if (swipeGuideTimeline) {
    swipeGuideTimeline.kill()
    swipeGuideTimeline = null
  }
}

/**
 * 组件挂载生命周期钩子
 */
onMounted(() => {
  // 预加载所有图片
  const allImages = extractImagesFromTimeline(timelineItems.value)
  preloadImages(allImages)

  // 设置自动播放
  setupAutoPlay()

  // 创建右侧滑动引导动画
  setTimeout(() => {
    createSwipeGuideAnimation()
  }, 100)
})

/**
 * 组件卸载生命周期钩子
 */
onUnmounted(() => {
  clearAutoPlay() // 组件卸载前清理自动播放
  clearSwipeGuideAnimation() // 清理右侧滑动引导动画
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

/* 网易云风格的云报告容器 */
.cloud-report-container {
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  font-family: $font-family;
  background: transparent;
  /* 改为透明背景，以便显示下层的动态背景 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 火柴人进度指示器 */
.stick-figure-progress {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 100;
  padding: $spacing-lg $spacing-lg;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 添加过渡效果 */
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.8);
}

/* 滑动容器 */
.slider-container {
  width: 100%;
  position: relative;
  perspective: 1000px;
}

.slider-track {
  display: flex;
  min-height: calc(100vh - 80px);
  /* 为进度条留出空间 */
  transform-style: preserve-3d;
}



/* 右侧滑动引导动画 */
.swipe-guide {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10;
  width: 60px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.swipe-indicator {
  width: 30px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  position: relative;
  animation: swipeRight 2s ease-in-out infinite;
}

.swipe-indicator::before,
.swipe-indicator::after {
  content: '';
  position: absolute;
  right: 0;
  width: 10px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  transform-origin: right center;
}

.swipe-indicator::before {
  top: -4px;
  transform: rotate(45deg);
}

.swipe-indicator::after {
  top: 4px;
  transform: rotate(-45deg);
}

/* 滑动引导动画由GSAP实现 */
</style>