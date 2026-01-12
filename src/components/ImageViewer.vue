<template>
  <div class="image-viewer" ref="imageWrapper">
    <div class="stickers-layer">
      <div v-for="(sticker, index) in activeStickers" :key="`sticker-${index}`" class="sticker"
        :style="stickerStyles[index]">
        {{ sticker }}
      </div>
    </div>

    <div class="main-photo-wrapper">
      <div class="photo-card main-photo" ref="mainPhoto" @click="pauseAutoPlay">
        <div v-show="isMainImageLoading" class="image-loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <transition name="fade" mode="out-in">
          <CachedImage :key="currentOptimizedImage" :src="currentOptimizedImage" :alt="'主照片'" imageClass="photo-image"
            fitMode="auto" :class="{ 'loading': isMainImageLoading }" @load="handleMainImageLoad"
            @error="handleMainImageError" />
        </transition>
        <div class="tape tape-main" :style="mainTapeStyle"></div>
      </div>

      <div class="thumbnails-layer">
        <transition-group name="thumbnail" tag="div" class="thumbnails-grid">
          <div v-for="(img, idx) in thumbnailImages" :key="`${img}-${idx}`" class="photo-card thumbnail"
            :class="{ 'active': img === currentOptimizedImage }" :style="getThumbnailStyle(idx)"
            @click="handleThumbnailClick(img, idx)">
            <transition name="fade" mode="out-in">
              <CachedImage :key="img" :src="img" :alt="`缩略图 ${idx + 1}`" imageClass="photo-image" fitMode="cover" />
            </transition>
            <div class="tape tape-small" :style="getThumbnailTapeStyle(idx)"></div>
          </div>
        </transition-group>
      </div>
    </div>

    <div class="hand-drawn-layer">
      <svg v-for="(style, index) in handDrawnStyles" :key="`handdrawn-${index}`" class="hand-drawn-element"
        :style="style" viewBox="0 0 100 100">
        <circle v-if="style.type === 'circle'" cx="50" cy="50" r="45" fill="none" :stroke="style.stroke"
          stroke-width="2" stroke-dasharray="5,5" />
        <path v-else-if="style.type === 'star'"
          d="M50 5 L61 35 L95 35 L68 55 L79 85 L50 65 L21 85 L32 55 L5 35 L39 35 Z" fill="none" :stroke="style.stroke"
          stroke-width="2" />
        <path v-else-if="style.type === 'heart'"
          d="M50 30 C50 30 30 10 30 30 C30 45 50 65 50 65 C50 65 70 45 70 30 C70 10 50 30 50 30" fill="none"
          :stroke="style.stroke" stroke-width="2" />
        <path v-else-if="style.type === 'arrow'" d="M20 50 L80 50 M70 40 L80 50 L70 60" fill="none"
          :stroke="style.stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import CachedImage from './CachedImage.vue'
import { getThemeConfig } from '../data/themeConfigs'
import {
  randomStickerPosition,
  randomTapeStyle,
  randomScatteredPosition,
  randomHandDrawnStyle,
  shuffleArray,
  randomInt,
  randomFloat,
  randomScale,
  randomRotation
} from '../utils/randomUtils'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  currentImage: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: '七七八八'
  }
})

const emit = defineEmits(['image-change'])

const themeConfig = computed(() => getThemeConfig(props.theme))

const thumbnailImages = computed(() => {
  return props.images
})

const currentOptimizedImage = computed(() => {
  return props.currentImage
})

const imageWrapper = ref(null)
const mainPhoto = ref(null)
const isMainImageLoading = ref(false)
const mainImageLoaded = ref(false)

const isAutoPlaying = ref(true)
const isPaused = ref(false)
let autoPlayTimer = null
let pauseTimer = null
const AUTO_PLAY_INTERVAL = 3000
const PAUSE_DURATION = 5000

const stickerStyles = ref([])
const tapeStyles = ref([])
const thumbnailStyles = ref([])
const thumbnailTapeWidths = ref([])
const thumbnailTransforms = ref([])
const handDrawnStyles = ref([])
const mainTapeStyle = ref({})
let stickerAnimations = []

const activeStickers = computed(() => {
  const shuffled = shuffleArray(themeConfig.value.decor.stickers || [])
  const count = randomInt(3, 5)
  return shuffled.slice(0, count)
})

const initializeStyles = () => {
  if (thumbnailImages.value.length === 0) return

  stickerStyles.value = activeStickers.value.map((_, index) =>
    randomStickerPosition(index, activeStickers.value.length)
  )

  const tapeColors = themeConfig.value.decor.tapeColors || ['rgba(255, 200, 150, 0.75)']
  tapeStyles.value = tapeColors.map(() => randomTapeStyle(tapeColors))

  thumbnailStyles.value = thumbnailImages.value.map((_, index) =>
    randomScatteredPosition(index, thumbnailImages.value.length)
  )

  thumbnailTapeWidths.value = thumbnailImages.value.map(() => randomInt(45, 65))

  thumbnailTransforms.value = thumbnailImages.value.map(() => {
    const scale = randomScale(0.6, 0.8)
    const rotation = randomRotation(12)
    return {
      transform: `rotate(${rotation}deg) scale(${scale})`,
      '--rotation': `${rotation}deg`,
      '--scale': scale
    }
  })

  const handDrawnTypes = themeConfig.value.decor.handDrawn || []
  handDrawnStyles.value = handDrawnTypes.map((type, index) => ({
    ...randomHandDrawnStyle(type, themeConfig.value.colors.primary),
    type
  }))

  mainTapeStyle.value = {
    background: tapeColors[0],
    transform: `translateX(-50%) rotate(${randomFloat(-2, 2, 1)}deg)`,
    width: `${randomInt(100, 130)}px`
  }
}

const animateStickers = () => {
  const stickers = document.querySelectorAll('.sticker')
  stickerAnimations.forEach(anim => anim.kill())
  stickerAnimations = []

  stickers.forEach((sticker, index) => {
    const anim = gsap.to(sticker, {
      y: -8,
      rotation: 5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    })
    stickerAnimations.push(anim)
  })
}

const handleThumbnailClick = (imgSrc, index) => {
  if (imgSrc === currentOptimizedImage.value) return
  pauseAutoPlay()
  emit('image-change', imgSrc)
}

const nextImage = () => {
  const currentIndex = props.images.indexOf(props.currentImage)
  const nextIndex = (currentIndex + 1) % props.images.length
  emit('image-change', props.images[nextIndex])
}

const startAutoPlay = () => {
  stopAutoPlay()
  isAutoPlaying.value = true
  autoPlayTimer = setInterval(() => {
    if (!isPaused.value) {
      nextImage()
    }
  }, AUTO_PLAY_INTERVAL)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
  isAutoPlaying.value = false
}

const pauseAutoPlay = () => {
  if (!isAutoPlaying.value) return

  isPaused.value = true

  if (pauseTimer) {
    clearTimeout(pauseTimer)
  }

  pauseTimer = setTimeout(() => {
    isPaused.value = false
  }, PAUSE_DURATION)
}

const handleMainImageLoad = () => {
  isMainImageLoading.value = false
  mainImageLoaded.value = true
}

const handleMainImageError = () => {
  isMainImageLoading.value = false
  mainImageLoaded.value = false
}

watch(() => props.currentImage, (newImage, oldImage) => {
  if (newImage !== oldImage) {
    isMainImageLoading.value = true
    mainImageLoaded.value = false
  }
}, { immediate: true })

const getThumbnailStyle = (index) => {
  const baseStyle = thumbnailStyles.value[index] || {}
  const transform = thumbnailTransforms.value[index] || {}

  return {
    ...baseStyle,
    ...transform,
    width: 'min(110px, 14vw)',
    height: 'min(82.5px, 10.5vw)'
  }
}

const getThumbnailTapeStyle = (index) => {
  const tapeColors = themeConfig.value.decor.tapeColors || ['rgba(255, 200, 150, 0.75)']
  const smallTape = tapeStyles.value[index % Math.max(tapeStyles.value.length, 1)]

  if (!smallTape) {
    return {
      background: tapeColors[0],
      transform: `translateX(-50%) rotate(${randomFloat(-5, 5, 1)}deg)`,
      width: `${thumbnailTapeWidths.value[index] || 50}px`
    }
  }

  return {
    background: smallTape.background,
    transform: `translateX(-50%) rotate(${smallTape.rotation}deg)`,
    width: `${thumbnailTapeWidths.value[index] || 50}px`
  }
}

onMounted(() => {
  initializeStyles()
  animateStickers()
  startAutoPlay()
})

watch(thumbnailImages, () => {
  initializeStyles()
}, { immediate: true })

onUnmounted(() => {
  stickerAnimations.forEach(anim => anim.kill())
  stopAutoPlay()
  if (pauseTimer) {
    clearTimeout(pauseTimer)
  }
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.image-viewer {
  width: 100%;
  height: clamp(35vh, 40vh, 450px);
  position: relative;
  overflow: visible;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stickers-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 8;
}

.sticker {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2) rotate(5deg) !important;
    opacity: 0.9;
  }
}

.main-photo-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.thumbnails-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(50vh, 420px);
  height: min(37vh, 300px);
  pointer-events: none;
  z-index: 10;
}

.photo-card {
  position: relative;
  background: #fff;
  padding: 16px;
  box-shadow:
    0 6px 16px rgba(139, 119, 101, 0.25),
    0 12px 32px rgba(139, 119, 101, 0.2),
    0 3px 8px rgba(139, 119, 101, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  cursor: pointer;
  overflow: hidden;
  border-radius: 3px;
  border: 2px solid rgba(139, 119, 101, 0.2);
  will-change: transform, opacity;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border: 1px solid rgba(139, 119, 101, 0.15);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.3) 100%);
    pointer-events: none;
    z-index: 2;
    border-radius: 3px;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 8px 24px rgba(139, 119, 101, 0.3),
      0 16px 48px rgba(139, 119, 101, 0.25),
      0 4px 12px rgba(139, 119, 101, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
    border-color: rgba(139, 119, 101, 0.3);
  }
}

.main-photo {
  width: min(50vh, 420px);
  height: min(37vh, 300px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-image {
  border-radius: 1px;
  filter: sepia(0.12) saturate(0.92) brightness(1.03) contrast(1.08);
  transition: opacity 0.3s ease;

  &.loading {
    opacity: 0;
  }
}

.image-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
  border-radius: 1px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 119, 101, 0.2);
  border-top-color: rgba(139, 119, 101, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-dots {
  display: flex;
  gap: 8px;
  margin-top: 16px;

  span {
    width: 8px;
    height: 8px;
    background: rgba(139, 119, 101, 0.6);
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }

    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}

.tape {
  position: absolute;
  height: 20px;
  background: linear-gradient(135deg,
      rgba(255, 200, 150, 0.75) 0%,
      rgba(255, 220, 180, 0.75) 50%,
      rgba(255, 200, 150, 0.75) 100%);
  opacity: 0.85;
  z-index: 10;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.tape-main {
  top: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(-1.5deg);
  width: 110px;
}

.tape-small {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
}

.thumbnails-grid {
  width: 100%;
  height: 100%;
}

.thumbnail {
  position: absolute;
  width: min(110px, 14vw);
  height: min(82.5px, 10.5vw);
  pointer-events: auto;
  opacity: 0.85;
  padding: 6px;
  will-change: transform, opacity;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 2px;
  border: 1px solid rgba(139, 119, 101, 0.2);
  box-shadow:
    0 3px 8px rgba(139, 119, 101, 0.2),
    0 6px 16px rgba(139, 119, 101, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 1px solid rgba(139, 119, 101, 0.12);
    border-radius: 1px;
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.2) 100%);
    pointer-events: none;
    z-index: 2;
    border-radius: 2px;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-3px) scale(1.05) !important;
    box-shadow:
      0 8px 20px rgba(139, 119, 101, 0.3),
      0 16px 40px rgba(139, 119, 101, 0.25),
      0 4px 12px rgba(139, 119, 101, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: rgba(139, 119, 101, 0.35);
    z-index: 100 !important;
  }

  &.active {
    opacity: 1;
    box-shadow:
      0 6px 20px rgba(196, 167, 125, 0.5),
      0 12px 40px rgba(196, 167, 125, 0.4),
      0 4px 12px rgba(196, 167, 125, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
    border-color: rgba(196, 167, 125, 0.8);
    border-width: 2px;
    transform: scale(1.1) translateY(-4px) !important;
    z-index: 50 !important;

    .tape-small {
      opacity: 1;
      transform: translateX(-50%) rotate(0deg) !important;
      background: linear-gradient(135deg,
          rgba(255, 200, 150, 0.95) 0%,
          rgba(255, 220, 180, 0.95) 50%,
          rgba(255, 200, 150, 0.95) 100%);
    }

    .photo-image {
      filter: sepia(0.08) saturate(0.95) brightness(1.05) contrast(1.1);
    }
  }
}

.hand-drawn-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.hand-drawn-element {
  position: absolute;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.6;
    transform: scale(1.1) rotate(5deg);
  }
}

@media (max-width: 768px) {
  .thumbnail {
    width: min(160px, 22vw);
    height: min(120px, 16.5vw);
    padding: 5px;
  }

  .thumbnails-layer {
    width: min(40vh, 350px);
    height: min(28vh, 240px);
  }

  .sticker {
    font-size: 20px;
  }

  .main-photo {
    width: min(40vh, 350px);
    height: min(28vh, 240px);
  }
}

@media (max-width: 480px) {
  .thumbnail {
    width: min(180px, 28vw);
    height: min(135px, 21vw);
    padding: 6px;
  }

  .thumbnails-layer {
    width: min(35vh, 300px);
    height: min(24vh, 210px);
  }

  .sticker {
    font-size: 18px;
  }

  .tape {
    height: 16px;
  }

  .main-photo {
    width: min(35vh, 300px);
    height: min(24vh, 210px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.thumbnail-enter-active,
.thumbnail-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumbnail-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.thumbnail-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.thumbnail-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
