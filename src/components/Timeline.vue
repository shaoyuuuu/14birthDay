<template>
  <div class="cloud-report-container">
    <!-- 滑动容器 -->
    <div class="slider-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
      @touchend="handleTouchEnd">
      <div class="slider-track" ref="sliderTrack">
        <div v-for="(item, index) in timelineItems" :key="index" class="card-item"
          :style="{ background: getCardBackground(index) }">
          <!-- 使用Transition组件实现卡片内容的转场动画 -->
          <Transition name="card-fade" mode="out-in" v-on:after-enter="handleCardEnter">
            <div class="card-content" :key="index" ref="cardContent">
              <!-- 标题部分 -->
              <div class="card-title-section">
                <h3 class="card-number">No.{{ index + 1 }}</h3>
                <h2 class="card-title">{{ item.title }}</h2>
              </div>

              <!-- 日期 -->
              <div class="card-date">{{ item.date }}</div>

              <!-- 图片部分（修改后支持多图切换） -->
              <div class="card-image-wrapper">
                <!-- 主图片 -->
                <div class="card-main-image-container">
                  <div class="image-transition-wrapper">
                    <Transition mode="out-in" v-on:before-enter="(el) => gsap.set(el, { opacity: 0, scale: 1.02 })"
                      v-on:enter="(el, done) => {
                        gsap.to(el, {
                          duration: 0.5,
                          opacity: 1,
                          scale: 1,
                          ease: 'power2.out',
                          onComplete: done
                        })
                      }" v-on:before-leave="(el) => gsap.set(el, { opacity: 1, scale: 1 })" v-on:leave="(el, done) => {
                        gsap.to(el, {
                          duration: 0.5,
                          opacity: 0,
                          scale: 0.98,
                          ease: 'power2.in',
                          onComplete: done
                        })
                      }">
                      <img :key="item.currentImage" :src="item.currentImage" :alt="item.title"
                        class="card-main-image" />
                    </Transition>
                  </div>
                </div>
                <!-- 缩略图 -->
                <div class="card-thumbnails">
                  <div v-for="(img, idx) in item.images" :key="idx" class="thumbnail-item"
                    @click="switchMainImage(item, img)">
                    <img :src="img" :alt="`缩略图 ${idx + 1}`" class="thumbnail-image"
                      :class="{ 'active': img === item.currentImage }" />
                  </div>
                </div>
              </div>

              <!-- 内容部分 -->
              <div class="card-text-section">
                <p class="card-description">{{ item.description }}</p>
                <p class="card-memory">{{ item.memory }}</p>
              </div>
            </div>
          </Transition>
        </div>
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
// 引入StickFigure组件
import StickFigure from './StickFigure.vue'
// 引入GSAP动画库
import gsap from 'gsap'

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
    default: () => [
      { date: '2023-01-15', title: '第一次相遇', description: '那天的阳光很好，你穿着白色的裙子，我知道，我的心被你偷走了。', images: ['https://picsum.photos/id/1027/600/800', 'https://picsum.photos/id/1035/600/800', 'https://picsum.photos/id/1040/600/800'], memory: '还记得在图书馆的转角，你低头看书的样子，那一刻时间仿佛静止了。' }, { date: '2023-02-14', title: '情人节告白', description: '鼓起勇气向你表白，谢谢你给了我这个机会，让我能够陪伴在你身边。', images: ['https://picsum.photos/id/1035/600/800', 'https://picsum.photos/id/1069/600/800'], memory: '在咖啡厅里，我紧张得手都在抖，但看到你微笑的那一刻，一切都值得了。' }, { date: '2023-06-01', title: '一起过六一', description: '像孩子一样一起吃冰淇淋，逛游乐园，那是我最快乐的一天。', images: ['https://picsum.photos/id/1040/800/600', 'https://picsum.photos/id/1050/600/800', 'https://picsum.photos/id/1060/800/600'], memory: '旋转木马上的你笑得那么开心，我多么希望时间能永远停留在那一刻。' }, { date: '2023-12-30', title: '你的生日', description: '今天是你的生日，我想对你说，谢谢你出现在我的生命里，我爱你。', images: ['https://picsum.photos/id/1069/600/800', 'https://picsum.photos/id/1070/800/600'], memory: '这一年有你陪伴，每一天都充满了幸福和温暖，祝你生日快乐，我的宝贝。' }
    ]
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
const cardContent = ref(null) // 卡片内容ref引用
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
 * 使用GSAP为卡片各部分添加有序的进入动画
 */
const handleCardEnter = () => {
  if (cardContent.value) {
    const titleSection = cardContent.value.querySelector('.card-title-section')
    const cardNumber = cardContent.value.querySelector('.card-number')
    const cardTitle = cardContent.value.querySelector('.card-title')
    const date = cardContent.value.querySelector('.card-date')
    const imageWrapper = cardContent.value.querySelector('.card-image-wrapper')
    const mainImageContainer = cardContent.value.querySelector('.card-main-image-container')
    const thumbnails = cardContent.value.querySelector('.card-thumbnails')
    const textSection = cardContent.value.querySelector('.card-text-section')
    const description = cardContent.value.querySelector('.card-description')
    const memory = cardContent.value.querySelector('.card-memory')
    const currentImage = timelineItems.value[currentIndex.value].currentImage

    // 重置所有元素的初始状态
    gsap.set([titleSection, cardNumber, cardTitle, date, imageWrapper, mainImageContainer, thumbnails, textSection, description, memory], {
      opacity: 0
    })

    // 设置标题部分的初始状态
    gsap.set(cardNumber, {
      y: -20,
      scale: 0.8
    })

    gsap.set(cardTitle, {
      y: -30
    })

    // 设置日期的初始状态
    gsap.set(date, {
      y: -20
    })

    // 设置图片部分的初始状态
    gsap.set(mainImageContainer, {
      scale: 0.9,
      y: 20
    })

    gsap.set(thumbnails, {
      y: 20
    })

    // 设置文本部分的初始状态
    gsap.set(description, {
      y: 20
    })

    gsap.set(memory, {
      y: 20
    })

    // 执行序列动画
    const tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: 'power2.out'
      }
    })

    // 标题部分的交错动画
    tl.to(cardNumber, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5
    })
      .to(cardTitle, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.3')
      .to(date, {
        opacity: 1,
        y: 0,
        duration: 0.5
      }, '-=0.3')
      .to(mainImageContainer, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7
      }, '-=0.2')
      .to(thumbnails, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.4')
      .to(description, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.3')
      .to(memory, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.4')
  }
}

/**
 * 切换主图片
 * @param {object} item - 当前项目
 * @param {string} imgSrc - 要切换到的图片路径
 */
/**
 * 切换主图片
 * @param {object} item - 当前时间轴项目
 * @param {string} imgSrc - 要切换到的图片路径
 */
const switchMainImage = (item, imgSrc) => {
  // 检查图片是否已加载（避免重复加载）
  const preloadedImage = preloadedImages.value[imgSrc]
  if (!preloadedImage) {
    // 如果图片未预加载，使用预加载函数
    preloadImage(imgSrc).then(() => {
      // 图片预加载完成后更新当前图片
      item.currentImage = imgSrc
    })
  } else {
    // 图片已预加载，直接更新当前图片
    item.currentImage = imgSrc
  }
}



/**
 * 图片加载管理
 */
const preloadedImages = ref({}) // 预加载图片缓存
const imageDimensions = ref({}) // 图片尺寸缓存（当前未使用）
const imagesLoaded = ref(false) // 加载状态管理
const loadingProgress = ref(0) // 图片加载进度（当前未使用）

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
 * 设置缩略图事件监听器
 * 使用GSAP实现缩略图的悬停和点击动画
 */
const setupThumbnailListeners = () => {
  // 使用setTimeout确保DOM已渲染完成
  setTimeout(() => {
    const thumbnailItems = document.querySelectorAll('.thumbnail-item')

    thumbnailItems.forEach(item => {
      // 悬停效果
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.1,
          y: -5,
          opacity: 1,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        // 只有非激活状态才恢复到正常状态
        if (!item.classList.contains('active')) {
          gsap.to(item, {
            scale: 1,
            y: 0,
            opacity: 0.8,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      })

      // 为卡片容器添加GSAP悬停效果
      const cardContainer = item.closest('.card-main-image-container')
      if (cardContainer && !cardContainer.hasHoverListener) {
        cardContainer.addEventListener('mouseenter', () => {
          gsap.to(cardContainer, {
            transform: 'rotateX(0deg) translateY(0px)',
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        cardContainer.addEventListener('mouseleave', () => {
          gsap.to(cardContainer, {
            transform: 'rotateX(5deg) translateY(10px)',
            duration: 0.3,
            ease: 'power2.out'
          })
        })
        cardContainer.hasHoverListener = true
      }

      // 点击效果
      item.addEventListener('click', () => {
        // 移除所有激活状态
        thumbnailItems.forEach(thumb => {
          if (thumb !== item) {
            gsap.to(thumb, {
              scale: 1,
              y: 0,
              opacity: 0.8,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                thumb.classList.remove('active')
              }
            })
          }
        })

        // 设置当前点击项为激活状态
        item.classList.add('active')
        gsap.to(item, {
          scale: 1.05,
          y: 0,
          opacity: 1,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }, 100)
}

/**
 * 移除缩略图事件监听器
 * 组件卸载时调用，避免内存泄漏
 */
const removeThumbnailListeners = () => {
  const thumbnailItems = document.querySelectorAll('.thumbnail-item')

  thumbnailItems.forEach(item => {
    // 通过克隆节点的方式移除所有事件监听器
    item.replaceWith(item.cloneNode(true))
  })
}

/**
 * 预加载单个图片
 * @param {string} imgSrc - 图片路径
 * @returns {Promise} 图片加载完成的Promise
 */
const preloadImage = (imgSrc) => {
  // 如果图片已经预加载，直接返回
  if (preloadedImages.value[imgSrc]) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.src = imgSrc
    img.onload = () => {
      // 将加载的图片添加到缓存中
      preloadedImages.value[imgSrc] = img
      // 记录图片尺寸（当前未使用）
      imageDimensions.value[imgSrc] = {
        width: img.width,
        height: img.height
      }
      resolve()
    }
    img.onerror = () => {
      // 即使加载失败也继续
      preloadedImages.value[imgSrc] = null // 标记为加载失败
      resolve()
    }
  })
}

/**
 * 预加载所有图片
 */
const preloadAllImages = async () => {
  // 清空缓存
  preloadedImages.value = {}
  imagesLoaded.value = false
  loadingProgress.value = 0

  // 收集所有需要预加载的图片
  const allImages = timelineItems.value.flatMap(item => item.images)
  const totalImages = allImages.length

  if (totalImages === 0) {
    imagesLoaded.value = true
    return
  }

  // 并行预加载所有图片，提高性能
  const preloadPromises = allImages.map(img => preloadImage(img))

  // 跟踪加载进度
  let loadedCount = 0
  for (const promise of preloadPromises) {
    await promise
    loadedCount++
    loadingProgress.value = Math.round((loadedCount / totalImages) * 100)
  }

  imagesLoaded.value = true
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
  preloadAllImages()

  // 设置自动播放
  setupAutoPlay()

  // 添加缩略图事件监听器
  setupThumbnailListeners()

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
  removeThumbnailListeners() // 移除缩略图事件监听器
  clearSwipeGuideAnimation() // 清理右侧滑动引导动画
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

/* 网易云风格的云报告容器 */
.cloud-report-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: $font-family;
  background: transparent;
  /* 改为透明背景，以便显示下层的动态背景 */
}

/* 火柴人进度指示器 */
.stick-figure-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: $spacing-lg $spacing-lg;
  pointer-events: none;
}

/* 滑动容器 */
.slider-container {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  perspective: 1000px;
}

.slider-track {
  display: flex;
  min-height: 100vh;
  transform-style: preserve-3d;
}

/* 卡片样式 */
.card-item {
  flex: 0 0 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 移除CSS过渡，完全由GSAP控制动画 */
}

.card-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* 卡片内容 */
.card-content {
  width: 100%;
  max-width: 550px;
  padding: 0 $spacing-sm;
  position: relative;
  z-index: 2;
  margin-bottom: 50px;
  /* 减小左右内边距和底部外边距，让布局更紧凑 */
}

/* Transition组件的转场动画类 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

/* 为卡片内容添加更平滑的过渡 */
.card-title-section,
.card-date,
.card-image-wrapper,
.card-text-section {
  transition: all 0.5s ease;
}

/* 为滑动轨道添加更平滑的过渡 */
/* 滑动轨道的过渡现在由GSAP控制 */



/* 卡片标题部分 */
.card-title-section {
  text-align: center;
  margin-bottom: $spacing-md;
}

.card-number {
  color: rgba(255, 255, 255, 0.9);
  font-size: $font-size-sm;
  font-weight: 500;
  margin-bottom: $spacing-sm;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.card-title {
  color: $text-light;
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

/* 日期 */
.card-date {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: $font-size-md;
  font-weight: 500;
  margin-bottom: $spacing-lg;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 图片部分 */
.card-image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: $spacing-lg;
  perspective: 1000px;
}

/* 主图片容器 */
.card-main-image-container {
  width: 100%;
  max-width: 500px;
  height: 320px;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-2xl;
  margin-bottom: $spacing-sm;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  position: relative;
  flex-shrink: 0;
  min-width: 250px;
  /* 确保容器尺寸完全固定 */
  min-height: 320px;
  margin-top: -20px;
}

/* 图片过渡容器，确保图片切换不影响容器尺寸 */
.image-transition-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-item:hover .card-main-image-container {
  /* 悬停效果由GSAP动画控制，避免与图片切换动画冲突 */
}

.card-main-image {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  display: block;
}



/* 确保所有图片元素都保持容器尺寸 */
.card-main-image-container img {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

/* 为当前显示的图片添加hover效果 */
.card-main-image-container img:not(.image-fade-leave-active):hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* 缩略图容器 */
.card-thumbnails {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $thumbnail-gap;
  max-width: 400px;
  transition: all 0.5s ease;
}

.thumbnail-item {
  width: $thumbnail-size;
  height: $thumbnail-size;
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  box-shadow: $shadow-lg;
  opacity: 0.8;
  transform: scale(1);
}

.thumbnail-item.active {
  opacity: 1;
  border: $thumbnail-active-border;
  box-shadow: $shadow-xl;
  transform: scale(1.05);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 内容部分 */
.card-text-section {
  background: $background-light;
  padding: $spacing-md;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-lg;
}

.card-description {
  color: $text-primary;
  font-size: $font-size-md;
  line-height: 1.7;
  margin-bottom: $spacing-md;
  font-weight: 500;
}

.card-memory {
  color: $text-secondary;
  font-size: $font-size-sm;
  line-height: 1.6;
  font-style: italic;
  margin: 0;
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

/* 响应式设计 */
@media (max-width: $breakpoint-md) {
  .card-title {
    font-size: $font-size-2xl;
  }

  .card-date {
    font-size: $font-size-sm;
  }

  .card-main-image-container {
    max-width: 90%;
  }

  .card-text-section {
    padding: $spacing-lg;
  }

  .card-description {
    font-size: $font-size-sm;
  }

  .card-memory {
    font-size: $font-size-xs;
  }

  .card-content {
    margin-bottom: 80px;
  }
}

@media (max-width: $breakpoint-sm) {
  .card-title {
    font-size: $font-size-xl;
  }

  .card-number {
    font-size: $font-size-xs;
  }

  .card-main-image-container {
    max-width: 95%;
  }

  .card-text-section {
    padding: $spacing-md;
  }

  .card-description {
    font-size: $font-size-sm;
  }

  .card-content {
    margin-bottom: 60px;
    padding: 0 $spacing-md;
  }
}
</style>