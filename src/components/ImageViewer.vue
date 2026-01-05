<template>
  <div class="card-image-wrapper">
    <!-- 主图片 -->
    <div class="card-main-image-container">
      <div class="image-transition-wrapper">
        <Transition mode="out-in" v-on:before-enter="imageTransitionConfig.beforeEnter"
          v-on:enter="imageTransitionConfig.enter" v-on:before-leave="imageTransitionConfig.beforeLeave"
          v-on:leave="imageTransitionConfig.leave">
          <img :key="currentImage" :src="currentImage" :alt="'图片'" class="card-main-image" />
        </Transition>
      </div>
    </div>
    <!-- 缩略图 -->
    <div class="card-thumbnails">
      <div v-for="(img, idx) in images" :key="idx" class="thumbnail-item" @click="switchImage(img)">
        <img :src="img" :alt="`缩略图 ${idx + 1}`" class="thumbnail-image" :class="{ 'active': img === currentImage }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
// 引入动画composable
import { createImageTransitionConfig } from '../composables/useAnimation'

/**
 * ImageViewer.vue - 图片查看器组件
 * 负责图片的展示和切换逻辑
 */

const props = defineProps({
  /**
   * 图片数组
   */
  images: {
    type: Array,
    required: true
  },
  /**
   * 当前显示的图片
   */
  currentImage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['image-change']) // 图片切换事件

// 图片过渡动画配置
const imageTransitionConfig = createImageTransitionConfig()

/**
 * 切换图片
 */
const switchImage = (imgSrc) => {
  emit('image-change', imgSrc)
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

      // 点击效果已通过Vue的@click处理，这里只保留GSAP动画效果
      // 移除原生点击事件监听器，避免与Vue的@click冲突
    })
  }, 100)
}

/**
 * 移除缩略图事件监听器
 */
const removeThumbnailListeners = () => {
  const thumbnailItems = document.querySelectorAll('.thumbnail-item')

  thumbnailItems.forEach(item => {
    // 通过克隆节点的方式移除所有事件监听器
    item.replaceWith(item.cloneNode(true))
  })
}

onMounted(() => {
  setupThumbnailListeners()
})

onUnmounted(() => {
  removeThumbnailListeners()
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.card-image-wrapper {
  margin: $spacing-xs 0 $spacing-lg 0;
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.card-main-image-container {
  width: 100%;
  height: 400px;
  border-radius: $border-radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
  margin-bottom: $spacing-lg;
  transform: rotateX(5deg) translateY(10px);
  transition: all 0.3s ease;
  position: relative;
  background: rgba(0, 0, 0, 0.05);
}

.image-transition-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: $border-radius-md;
}

.card-thumbnails {
  display: flex;
  gap: $spacing-sm;
  overflow-x: auto;
  padding: $spacing-sm 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: $border-radius-sm;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  opacity: 0.8;
  position: relative;
}

.thumbnail-item.active {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 滚动条样式 */
.card-thumbnails::-webkit-scrollbar {
  height: 6px;
}

.card-thumbnails::-webkit-scrollbar-track {
  background: transparent;
}

.card-thumbnails::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: $border-radius-full;
}

/* 响应式设计 */
@media (max-width: $breakpoint-md) {
  .card-main-image-container {
    height: 320px;
  }

  .thumbnail-item {
    width: 80px;
    height: 60px;
  }
}

@media (max-width: $breakpoint-sm) {
  .card-main-image-container {
    height: 260px;
  }

  .thumbnail-item {
    width: 70px;
    height: 50px;
  }
}
</style>