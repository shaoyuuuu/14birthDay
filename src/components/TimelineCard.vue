<template>
  <div class="card-item" :style="{ background: background }">
    <!-- 卡片内容的转场动画 -->
    <Transition name="card-fade" mode="out-in" @after-enter="handleCardEnter">
      <div class="card-content" :key="index" ref="cardContent">
        <!-- 标题部分 -->
        <div class="card-title-section">
          <h3 class="card-number">No.{{ index + 1 }}</h3>
          <h2 class="card-title">{{ item.title }}</h2>
        </div>

        <!-- 日期 -->
        <div class="card-date">{{ item.date }}</div>

        <!-- 图片部分 -->
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

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: Object,
    required: true
  },
  background: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['card-enter', 'image-change'])

const cardContent = ref(null)

const handleImageChange = (imgSrc, index) => {
  emit('image-change', imgSrc, index)
}

const handleCardEnter = () => {
  cardContent.value && createCardEnterAnimation(cardContent.value)
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
  padding: $spacing-sm;
  position: relative;
  display: flex;
  justify-content: center;
  background-size: cover;
  background-position: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速，避免闪烁 */
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;

  /* 绿色主题色调叠加 - 更柔和的效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: $border-radius-lg;
    background: linear-gradient(135deg,
        rgba(200, 247, 197, 0.25) 0%,
        rgba(102, 187, 106, 0.3) 50%,
        rgba(76, 175, 80, 0.25) 100%);
    pointer-events: none;
    z-index: 0;
  }

  /* 柔和的阴影效果 - 符合小清新风格 */
  box-shadow:
  /* 主阴影 - 远处的柔和深度 */
  0 40px 80px rgba(102, 187, 106, 0.12),
  /* 中层阴影 - 增加层次 */
  0 20px 40px rgba(102, 187, 106, 0.08),
  /* 近层阴影 - 增加细节 */
  0 8px 16px rgba(102, 187, 106, 0.06),
  /* 底部阴影 - 增加柔和感 */
  0 2px 8px rgba(102, 187, 106, 0.04),
  /* 内阴影高光 - 增加光泽感 */
  inset 0 1px 0 rgba(255, 255, 255, 0.5);

  /* 微妙的高光效果 */
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    height: 30px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
    border-radius: $border-radius-lg;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px) translateZ(0) scale(1.01);
    box-shadow:
      /* 主阴影 - 更深的深度 */
      0 50px 100px rgba(102, 187, 106, 0.15),
      /* 中层阴影 - 增加层次 */
      0 30px 60px rgba(102, 187, 106, 0.12),
      /* 近层阴影 - 增加细节 */
      0 12px 24px rgba(102, 187, 106, 0.1),
      /* 底部阴影 - 增加厚重感 */
      0 4px 12px rgba(102, 187, 106, 0.08),
      /* 内阴影高光 - 增强光泽感 */
      inset 0 1px 0 rgba(255, 255, 255, 0.6);

    &::after {
      opacity: 0.8;
    }
  }
}

.card-content {
  width: 100%;
  max-width: min(90vw, 700px);
  height: 90vh;
  margin: 0 auto;
  /* 绿色小清新主题渐变背景 - 更柔和的色调 */
  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(240, 255, 240, 0.97) 25%,
      rgba(232, 245, 232, 0.95) 50%,
      rgba(220, 240, 220, 0.93) 75%,
      rgba(200, 247, 197, 0.9) 100%),
    // 增强的绿色纹理效果
    radial-gradient(circle at 15% 25%, rgba(102, 187, 106, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 85% 75%, rgba(165, 214, 167, 0.1) 0%, transparent 50%),
    // 更细腻的网格纹理
    repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(102, 187, 106, 0.01) 4px, rgba(102, 187, 106, 0.01) 8px);
  border-radius: $border-radius-xl;
  padding: $spacing-md;
  /* 柔和的阴影效果 - 符合小清新风格 */
  box-shadow:
    /* 远距离柔和阴影 */
    0 60px 180px rgba(102, 187, 106, 0.08),
    /* 中距离阴影 */
    0 30px 90px rgba(102, 187, 106, 0.1),
    /* 近距离阴影 */
    0 15px 45px rgba(102, 187, 106, 0.12),
    /* 极近距离阴影 */
    0 5px 15px rgba(102, 187, 106, 0.08),
    /* 高光内阴影 - 增加表面光泽 */
    inset 0 1px 0 rgba(255, 255, 255, 0.98),
    /* 底部内阴影 - 增加深度 */
    inset 0 -1px 0 rgba(102, 187, 106, 0.05);
  position: relative;
  z-index: 1;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  will-change: transform, box-shadow;

  /* 精致边框效果 - 增强版渐变光晕 */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: calc(#{$border-radius-xl} + 6px);
    background: linear-gradient(135deg,
        rgba(200, 247, 197, 0.5) 0%,
        rgba(165, 214, 167, 0.4) 30%,
        rgba(102, 187, 106, 0.3) 50%,
        rgba(76, 175, 80, 0.6) 100%);
    z-index: -2;
    pointer-events: none;
    opacity: 0.8;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    transition: opacity 0.5s ease, transform 0.5s ease;
    transform: translateZ(0);
  }

  /* 表面高光效果 - 双层设计 */
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    height: 40px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
    border-radius: $border-radius-xl;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0.6;
    /* 第二层高光 */
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.18);
  }

  /* 悬停效果增强 - 符合小清新风格 */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-5px) translateZ(0);
      box-shadow:
        /* 最远距离阴影增强 */
        0 150px 450px rgba(102, 187, 106, 0.12),
        /* 远距离阴影增强 */
        0 80px 240px rgba(102, 187, 106, 0.15),
        /* 中距离阴影增强 */
        0 40px 120px rgba(102, 187, 106, 0.18),
        /* 近距离阴影增强 */
        0 20px 60px rgba(102, 187, 106, 0.2),
        /* 极近距离阴影增强 */
        0 8px 24px rgba(102, 187, 106, 0.18),
        /* 高光内阴影增强 */
        inset 0 1px 0 rgba(255, 255, 255, 0.99),
        /* 底部内阴影增强 */
        inset 0 -1px 0 rgba(102, 187, 106, 0.05);

      &::before {
        opacity: 1;
        transform: translateY(-2px) translateZ(0);
      }

      &::after {
        opacity: 0.9;
        transform: translateY(2px);
      }
    }
  }
}

.card-title-section {
  margin-bottom: $spacing-xs;
  text-align: center;
  position: relative;
  z-index: 3;
}

.card-number {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-accent;
  margin-bottom: $spacing-xs;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}

.card-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8),
    0 0 10px rgba(200, 247, 197, 0.6);
  letter-spacing: 0.5px;
  line-height: 1.3;
}

.card-date {
  text-align: center;
  color: $text-secondary;
  font-size: $font-size-sm;
  margin-bottom: $spacing-sm;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
}

.card-text-section {
  display: flex;
  flex-direction: column;
  margin-top: $spacing-md;
  position: relative;
  z-index: 3;
  margin-bottom: $spacing-sm;
  overflow: hidden;
}

.card-description {
  font-size: $font-size-md;
  color: $text-primary;
  line-height: 1.8;
  margin-bottom: $spacing-sm;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
  letter-spacing: 0.3px;
}

.card-memory {
  font-size: $font-size-md;
  font-style: italic;
  color: $text-secondary;
  line-height: 1.8;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
  letter-spacing: 0.3px;
  font-weight: 500;
  border-left: 3px solid $primary-color;
  padding: $spacing-md;
  /* 更柔和的绿色渐变背景 */
  background: linear-gradient(135deg,
      rgba(240, 255, 240, 0.98) 0%,
      rgba(232, 245, 232, 0.95) 50%,
      rgba(220, 240, 220, 0.92) 100%);
  border-radius: $border-radius-lg;
  margin-bottom: 0;
  margin-top: $spacing-sm;
  /* 合适的高度范围 */
  max-height: 180px;
  min-height: 100px;
  overflow-y: auto;
  /* 更柔和的阴影效果 */
  box-shadow:
    /* 中距离柔和阴影 */
    0 10px 25px rgba(102, 187, 106, 0.1),
    /* 近距离阴影 */
    0 5px 15px rgba(102, 187, 106, 0.08),
    /* 极近距离阴影 */
    0 2px 8px rgba(102, 187, 106, 0.06),
    /* 高光内阴影 */
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba($primary-color, 0.1);
  position: relative;
  overflow: hidden;

  /* 微妙的纹理效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(rgba($primary-color, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.6;
    pointer-events: none;
    z-index: 0;
  }

  /* 文本内容提升层级 */
  &>* {
    position: relative;
    z-index: 1;
  }

  /* 悬停效果增强 */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow:
        /* 中距离阴影增强 */
        0 15px 35px rgba(0, 0, 0, 0.1),
        /* 近距离阴影增强 */
        0 8px 25px rgba(0, 0, 0, 0.08),
        /* 极近距离阴影增强 */
        0 3px 15px rgba(0, 0, 0, 0.06),
        /* 高光内阴影增强 */
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border-color: rgba($primary-color, 0.3);
      transform: translateX(2px);
    }
  }

  /* 自定义滚动条 - 更精致 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($primary-color, 0.08);
    border-radius: 4px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg,
        rgba($primary-color, 0.6) 0%,
        rgba($secondary-color, 0.5) 100%);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(180deg,
          rgba($primary-color, 0.8) 0%,
          rgba($secondary-color, 0.7) 100%);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }
}

/* 卡片切换动画 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.3s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
}
</style>