<template>
  <div class="card-item" :style="{ background: background }">
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

        <!-- 图片部分（支持多图切换） -->
        <ImageViewer :images="item.images" :current-image="item.currentImage"
          @image-change="(imgSrc) => handleImageChange(imgSrc, index)" />

        <!-- 内容部分 -->
        <div class="card-text-section">
          <p class="card-description">{{ item.description }}</p>
          <p class="card-memory">{{ item.memory }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageViewer from './ImageViewer.vue'
// 引入动画composable
import { createCardEnterAnimation } from '../composables/useAnimation'

/**
 * TimelineCard.vue - 时间轴卡片组件
 * 负责单个时间轴卡片的展示
 */

const props = defineProps({
  /**
   * 当前卡片的索引
   */
  index: {
    type: Number,
    required: true
  },
  /**
   * 卡片数据
   */
  item: {
    type: Object,
    required: true
  },
  /**
   * 卡片背景
   */
  background: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'card-enter',   // 卡片进入动画完成事件
  'image-change'  // 图片切换事件
])

const cardContent = ref(null)

/**
 * 处理图片切换事件
 */
const handleImageChange = (imgSrc, index) => {
  emit('image-change', imgSrc, index)
}

/**
 * 处理卡片进入动画
 */
const handleCardEnter = () => {
  if (cardContent.value) {
    createCardEnterAnimation(cardContent.value)
  }
  emit('card-enter')
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.card-item {
  min-width: 100%;
  min-height: calc(100% - #{$spacing-md} * 2);
  margin: 0 auto;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  padding: $spacing-sm;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
}

.card-content {
  width: 100%;
  max-width: 700px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  position: relative;
  z-index: 1;
}

.card-title-section {
  margin-bottom: $spacing-sm;
  text-align: center;
}

.card-number {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.card-title {
  font-size: $font-size-2xl;
  font-weight: bold;
  color: $text-primary;
  margin: 0;
}

.card-date {
  text-align: center;
  color: $text-secondary;
  font-size: $font-size-sm;
  margin-bottom: $spacing-lg;
}

.card-text-section {
  margin-top: $spacing-lg;
}

.card-description {
  font-size: $font-size-md;
  color: $text-primary;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
}

.card-memory {
  font-size: $font-size-md;
  font-style: italic;
  color: $text-secondary;
  line-height: 1.6;
}

/* 卡片内容淡入动画 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.5s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: $breakpoint-md) {
  .card-title {
    font-size: $font-size-2xl;
  }

  .card-number {
    font-size: $font-size-lg;
  }

  .card-date {
    font-size: $font-size-sm;
  }

  .card-content {
    max-width: 600px;
    padding: $spacing-2xl;
  }

  .card-description {
    font-size: $font-size-md;
  }

  .card-memory {
    font-size: $font-size-md;
  }
}

@media (max-width: $breakpoint-sm) {
  .card-title {
    font-size: $font-size-xl;
  }

  .card-number {
    font-size: $font-size-md;
  }

  .card-content {
    max-width: 500px;
    padding: $spacing-lg;
  }

  .card-description {
    font-size: $font-size-sm;
  }

  .card-memory {
    font-size: $font-size-sm;
  }
}
</style>