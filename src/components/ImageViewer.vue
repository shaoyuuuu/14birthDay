<template>
  <div class="card-image-wrapper">
    <!-- 主图片 -->
    <div class="card-main-image-container">
      <Transition mode="out-in" name="image-fade">
        <img :key="currentImage" :src="currentImage" :alt="'图片'" class="card-main-image" />
      </Transition>
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
const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  currentImage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['image-change'])

const switchImage = (imgSrc) => {
  emit('image-change', imgSrc)
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.card-image-wrapper {
  // margin: $spacing-xs 0 $spacing-lg 0;
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.card-main-image-container {
  width: 100%;
  height: min(35vh, 350px);
  border-radius: $border-radius-xl;
  overflow: hidden;
  /* 柔和的阴影效果 - 符合小清新风格 */
  box-shadow:
    /* 远距离柔和阴影 */
    0 60px 150px rgba(102, 187, 106, 0.1),
    /* 中距离阴影 */
    0 30px 80px rgba(102, 187, 106, 0.08),
    /* 近距离阴影 */
    0 15px 40px rgba(102, 187, 106, 0.12),
    /* 极近距离阴影 */
    0 8px 25px rgba(102, 187, 106, 0.08),
    /* 底层阴影 */
    0 3px 12px rgba(102, 187, 106, 0.06),
    /* 高光内阴影 - 增加表面光泽 */
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  margin-bottom: $spacing-sm;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  /* 清新的背景效果 - 增强层次感 */
  background:
    linear-gradient(135deg,
      rgba(240, 255, 240, 0.8) 0%,
      rgba(200, 247, 197, 0.6) 50%,
      rgba(165, 214, 167, 0.4) 100%),
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(102, 187, 106, 0.08) 0%, transparent 50%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  /* 精致相框边框效果 - 增强立体感 */
  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    border-radius: calc(#{$border-radius-xl} + 12px);
    background: linear-gradient(135deg,
        rgba(200, 247, 197, 0.6) 0%,
        rgba(165, 214, 167, 0.45) 50%,
        rgba(76, 175, 80, 0.7) 100%);
    z-index: -1;
    pointer-events: none;
    opacity: 0.7;
    /* 边框高光细节 - 更丰富的层次 */
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.95),
      inset 0 -2px 0 rgba(0, 0, 0, 0.2),
      0 1px 0 rgba(255, 255, 255, 0.6),
      0 -1px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateZ(0);
  }

  /* 微妙的光泽效果 */
  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 20px;
    right: 20px;
    height: 30px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.4s ease;
    opacity: 0.5;
  }

  /* 悬停效果增强 - 符合小清新风格 */
  &:hover {
    box-shadow:
      /* 最远距离阴影增强 */
      0 100px 250px rgba(102, 187, 106, 0.15),
      /* 远距离阴影增强 */
      0 60px 150px rgba(102, 187, 106, 0.12),
      /* 中距离阴影增强 */
      0 40px 100px rgba(102, 187, 106, 0.18),
      /* 近距离阴影增强 */
      0 20px 50px rgba(102, 187, 106, 0.15),
      /* 极近距离阴影增强 */
      0 10px 30px rgba(102, 187, 106, 0.12),
      /* 底层阴影增强 */
      0 5px 15px rgba(102, 187, 106, 0.1),
      /* 高光内阴影增强 */
      inset 0 1px 0 rgba(255, 255, 255, 0.7);

    &::before {
      opacity: 1;
      transform: translateY(-2px) translateZ(0);
    }

    &::after {
      opacity: 0.8;
    }
  }
}

.card-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: $border-radius-xl;
  /* 高级滤镜效果 - 增强图片质感 */
  filter:
    sepia(0.1) saturate(0.95) brightness(1.08) contrast(1.02) hue-rotate(10deg);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  backface-visibility: hidden;
  /* 微妙的边框效果 */
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.card-thumbnails {
  display: flex;
  gap: $spacing-md;
  overflow-x: auto;
  padding: $spacing-sm 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 187, 106, 0.4) transparent;
}

.thumbnail-item {
  flex-shrink: 0;
  width: min(80px, 10vw);
  height: min(60px, 8vw);
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  /* 小清新风格缩略图阴影 */
  box-shadow:
    /* 远处阴影 */
    0 15px 30px rgba(102, 187, 106, 0.1),
    /* 中层阴影 */
    0 8px 20px rgba(102, 187, 106, 0.08),
    /* 近层阴影 */
    0 2px 10px rgba(102, 187, 106, 0.06),
    /* 高光内阴影 */
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.75;
  position: relative;
  transform: translateZ(0);
  will-change: transform, box-shadow, opacity;
  /* 精致背景 */
  background: linear-gradient(135deg,
      rgba($primary-color, 0.2) 0%,
      rgba($secondary-color, 0.15) 100%);

  &:hover {
    opacity: 1;
    transform: translateY(-3px) scale(1.12);
    box-shadow:
      /* 远处阴影增强 */
      0 25px 50px rgba(102, 187, 106, 0.2),
      /* 中层阴影增强 */
      0 15px 35px rgba(102, 187, 106, 0.18),
      /* 近层阴影增强 */
      0 8px 20px rgba(102, 187, 106, 0.15),
      /* 底层阴影增强 */
      0 2px 8px rgba(102, 187, 106, 0.1),
      /* 高光内阴影增强 */
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

.thumbnail-item.active {
  opacity: 1;
  transform: translateY(-3px) scale(1.12);
  box-shadow:
    /* 远处阴影 */
    0 20px 40px rgba($primary-color, 0.4),
    /* 中层阴影 */
    0 10px 25px rgba($primary-color, 0.3),
    /* 近层阴影 */
    0 5px 15px rgba($primary-color, 0.2),
    /* 高光内阴影 */
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    /* 发光效果 */
    0 0 25px rgba($primary-color, 0.5);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter:
    sepia(0.2) saturate(0.85) brightness(1.02) contrast(0.9);
  border-radius: $border-radius-lg;
}

.thumbnail-item:hover .thumbnail-image,
.thumbnail-item.active .thumbnail-image {
  transform: scale(1.1);
  opacity: 1;
  filter:
    sepia(0.1) saturate(1) brightness(1.05) contrast(1);
}

/* 滚动条样式 */
.card-thumbnails::-webkit-scrollbar {
  height: 6px;
}

.card-thumbnails::-webkit-scrollbar-track {
  background: transparent;
}

.card-thumbnails::-webkit-scrollbar-thumb {
  background-color: rgba(102, 187, 106, 0.4);
  border-radius: $border-radius-full;
}

/* 图片过渡动画 */
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.4s ease;
}

.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}
</style>