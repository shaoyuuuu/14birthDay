<template>
  <div class="card-item" ref="cardRef" :style="{ background: background }" :class="themeClass">
    <!-- 卡片背景装饰 -->
    <div class="card-background-decorations">
      <div class="paper-texture" :style="paperTextureStyle"></div>
      <div class="ink-splatter ink-1"></div>
      <div class="ink-splatter ink-2"></div>
      <div class="ink-splatter ink-3"></div>
    </div>

    <!-- 动态主题装饰 -->
    <ThemeDecorations :decor="themeConfig.decor" :colors="themeConfig.colors" />

    <!-- 卡片内容的转场动画 -->
    <Transition name="card-fade" mode="out-in" @after-enter="handleCardEnter">
      <div class="card-content" :key="index" ref="cardContent" :style="cardContentStyle">
        <!-- 胶带装饰 - 顶部 -->
        <div class="tape-decoration tape-top"></div>

        <!-- 标题部分 -->
        <div class="card-title-section" ref="titleSectionRef">
          <div class="title-decoration-left"></div>
          <div class="title-decoration-right"></div>
          <h3 class="card-number" :style="{ color: themeConfig.colors.accent }">No.{{ index + 1 }}</h3>
          <h2 class="card-title">{{ item.title }}</h2>
          <div class="title-underline"></div>
        </div>

        <!-- 日期 -->
        <div class="card-date" ref="dateRef">
          <span class="date-icon">📅</span>
          {{ item.date }}
        </div>

        <!-- 图片部分 -->
        <div class="image-section" ref="imageSectionRef">
          <ImageViewer v-if="isVisible" :images="item.images" :current-image="item.currentImage" :theme="theme"
            @image-change="(imgSrc) => handleImageChange(imgSrc, index)" />
        </div>

        <!-- 内容部分 -->
        <div class="card-text-section" :style="{ textAlign: themeConfig.layout.contentAlignment }">
          <p class="card-description" ref="descriptionRef">{{ item.description }}</p>
          <div class="card-memory-wrapper">
            <div class="memory-tape"></div>
            <p class="card-memory" ref="memoryRef" :style="memoryStyle">{{ item.memory }}</p>
            <div class="memory-corner-decoration"></div>
          </div>
        </div>

        <!-- 底部装饰 -->
        <div class="card-footer-decoration" ref="footerRef">
          <div class="footer-sticker">💝</div>
          <div class="footer-doodle"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ImageViewer from './ImageViewer.vue'
import ThemeDecorations from './ThemeDecorations.vue'
import { createCardEnterAnimation } from '../composables/useAnimation'
import { getThemeConfig } from '../data/themeConfigs'
import { getThemeShadow, getThemeBackground, getThemeClassName } from '../utils/themeUtils'
import { randomPaperTexture, randomChoice, randomInt, randomFloat } from '../utils/randomUtils'

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
  },
  theme: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['card-enter', 'image-change'])

const cardContent = ref(null)
const titleSectionRef = ref(null)
const dateRef = ref(null)
const descriptionRef = ref(null)
const memoryRef = ref(null)
const footerRef = ref(null)
const imageSectionRef = ref(null)
const isVisible = ref(false)
let observer = null

const cardRef = ref(null)
let inkAnimations = []
let dateIconAnimation = null
let footerStickerAnimation = null
let doodleAnimation = null
let elementAnimations = []

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          startAnimations()
        } else {
          stopAnimations()
        }
      })
    },
    OBSERVER_CONFIG
  )

  if (cardRef.value) {
    observer.observe(cardRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  stopAnimations()
})

const ANIMATION_CONFIG = {
  ink: {
    scale: 1.1,
    opacity: 0.8,
    duration: 2,
    delayMultiplier: 1.5
  },
  dateIcon: {
    y: -3,
    rotation: 10,
    duration: 1
  },
  footerSticker: {
    y: -6,
    rotation: 5,
    duration: 2
  },
  doodle: {
    rotation: 360,
    duration: 15
  },
  text: {
    duration: 0.5,
    stagger: 0.05
  },
  title: {
    duration: 0.8,
    ease: 'back.out(1.7)',
    y: -30,
    scale: 0.9
  },
  date: {
    duration: 0.6,
    ease: 'power2.out',
    x: -20,
    delay: 0.2
  },
  image: {
    duration: 0.9,
    ease: 'back.out(1.2)',
    y: 30,
    scale: 0.95,
    rotationX: 15,
    delay: 0.3
  },
  description: {
    duration: 0.6,
    ease: 'power2.out',
    y: 10,
    opacity: 0,
    delay: 0.4
  },
  footer: {
    duration: 0.6,
    ease: 'power2.out',
    y: 30,
    delay: 0.6
  }
}

const OBSERVER_CONFIG = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
}

const startAnimations = () => {
  animateInkSplatters()
  animateDateIcon()
  animateFooterSticker()
  animateDoodle()
  animateTitleSection()
  animateDate()
  animateImageSection()
  animateDescription()
  animateFooter()
  animateTextElements()
}

const stopAnimations = () => {
  inkAnimations.forEach(anim => anim.kill())
  if (dateIconAnimation) dateIconAnimation.kill()
  if (footerStickerAnimation) footerStickerAnimation.kill()
  if (doodleAnimation) doodleAnimation.kill()
  elementAnimations.forEach(anim => anim.kill())
  resetTextAnimation()
}

const resetTextAnimation = () => {
  if (memoryRef.value && props.item.memory) {
    memoryRef.value.innerHTML = props.item.memory
  }
  if (descriptionRef.value && props.item.description) {
    descriptionRef.value.innerHTML = props.item.description
  }
}

const animateInkSplatters = () => {
  const inkSplatters = document.querySelectorAll('.ink-splatter')
  inkAnimations = []

  inkSplatters.forEach((ink, index) => {
    const anim = gsap.to(ink, {
      scale: ANIMATION_CONFIG.ink.scale,
      opacity: ANIMATION_CONFIG.ink.opacity,
      duration: ANIMATION_CONFIG.ink.duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * ANIMATION_CONFIG.ink.delayMultiplier
    })
    inkAnimations.push(anim)
  })
}

const animateDateIcon = () => {
  const dateIcon = document.querySelector('.date-icon')
  if (dateIcon) {
    dateIconAnimation = gsap.to(dateIcon, {
      y: ANIMATION_CONFIG.dateIcon.y,
      rotation: ANIMATION_CONFIG.dateIcon.rotation,
      duration: ANIMATION_CONFIG.dateIcon.duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }
}

const animateFooterSticker = () => {
  const footerSticker = document.querySelector('.footer-sticker')
  if (footerSticker) {
    footerStickerAnimation = gsap.to(footerSticker, {
      y: ANIMATION_CONFIG.footerSticker.y,
      rotation: ANIMATION_CONFIG.footerSticker.rotation,
      duration: ANIMATION_CONFIG.footerSticker.duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }
}

const animateDoodle = () => {
  const doodle = document.querySelector('.footer-doodle')
  if (doodle) {
    doodleAnimation = gsap.to(doodle, {
      rotation: ANIMATION_CONFIG.doodle.rotation,
      duration: ANIMATION_CONFIG.doodle.duration,
      repeat: -1,
      ease: 'none'
    })
  }
}

const animateTextElements = () => {
  if (!memoryRef.value) return

  nextTick(() => {
    const memoryElement = memoryRef.value

    if (!memoryElement) return

    const text = memoryElement.textContent
    const chars = text.split('')

    memoryElement.innerHTML = chars.map((char, index) => {
      if (char === ' ') {
        return '<span class="char-space"> </span>'
      }
      return `<span class="char-animate" style="display: inline-block; opacity: 0; transform: translateY(20px);">${char}</span>`
    }).join('')

    const charElements = memoryElement.querySelectorAll('.char-animate')

    if (charElements.length > 0) {
      gsap.to(charElements, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.text.duration,
        ease: 'power2.out',
        stagger: ANIMATION_CONFIG.text.stagger
      })
    }
  })
}

const animateTitleSection = () => {
  if (!titleSectionRef.value) return

  const anim = gsap.fromTo(titleSectionRef.value,
    {
      opacity: 0,
      y: ANIMATION_CONFIG.title.y,
      scale: ANIMATION_CONFIG.title.scale
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.title.duration,
      ease: ANIMATION_CONFIG.title.ease
    }
  )
  elementAnimations.push(anim)
}

const animateDate = () => {
  if (!dateRef.value) return

  const anim = gsap.fromTo(dateRef.value,
    {
      opacity: 0,
      x: ANIMATION_CONFIG.date.x
    },
    {
      opacity: 1,
      x: 0,
      duration: ANIMATION_CONFIG.date.duration,
      ease: ANIMATION_CONFIG.date.ease,
      delay: ANIMATION_CONFIG.date.delay
    }
  )
  elementAnimations.push(anim)
}

const animateImageSection = () => {
  if (!imageSectionRef.value) return

  const anim = gsap.fromTo(imageSectionRef.value,
    {
      opacity: 0,
      y: ANIMATION_CONFIG.image.y,
      scale: ANIMATION_CONFIG.image.scale,
      rotationX: ANIMATION_CONFIG.image.rotationX
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: ANIMATION_CONFIG.image.duration,
      ease: ANIMATION_CONFIG.image.ease,
      delay: ANIMATION_CONFIG.image.delay
    }
  )
  elementAnimations.push(anim)
}

const animateDescription = () => {
  if (!descriptionRef.value) return

  nextTick(() => {
    const descriptionElement = descriptionRef.value

    if (!descriptionElement) return

    const text = descriptionElement.textContent
    const chars = text.split('')

    descriptionElement.innerHTML = chars.map((char, index) => {
      if (char === ' ') {
        return '<span class="char-space"> </span>'
      }
      return `<span class="char-animate" style="display: inline-block; opacity: 0; transform: translateY(20px);">${char}</span>`
    }).join('')

    const charElements = descriptionElement.querySelectorAll('.char-animate')

    if (charElements.length > 0) {
      gsap.to(charElements, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.text.duration,
        ease: 'power2.out',
        stagger: ANIMATION_CONFIG.text.stagger,
        delay: ANIMATION_CONFIG.description.delay
      })
    }
  })
}

const animateFooter = () => {
  if (!footerRef.value) return

  const anim = gsap.fromTo(footerRef.value,
    {
      opacity: 0,
      y: ANIMATION_CONFIG.footer.y
    },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.footer.duration,
      ease: ANIMATION_CONFIG.footer.ease,
      delay: ANIMATION_CONFIG.footer.delay
    }
  )
  elementAnimations.push(anim)
}

// 获取主题配置
const themeConfig = computed(() => getThemeConfig(props.theme))

// 计算主题类名
const themeClass = computed(() => getThemeClassName(props.theme))

// 随机纸张纹理样式
const paperTextureStyle = ref({})

// 计算卡片内容样式
const cardContentStyle = computed(() => ({
  backgroundColor: themeConfig.value.colors.background,
  backgroundImage: getThemeBackground(themeConfig.value.colors, themeConfig.value.decor)
}))

// 计算记忆内容样式
const memoryStyle = computed(() => ({
  borderLeftColor: themeConfig.value.colors.primary,
  backgroundColor: `${themeConfig.value.colors.background}e6`
}))

onMounted(() => {
  generateRandomPaperTexture()
})

const generateRandomPaperTexture = () => {
  const textureConfig = randomPaperTexture(themeConfig.value.decor.paperTexture)
  paperTextureStyle.value = {
    background: textureConfig.background,
    backgroundSize: textureConfig.backgroundSize,
    opacity: textureConfig.opacity
  }
}

const handleImageChange = (imgSrc, index) => {
  emit('image-change', imgSrc, index)
}

const handleCardEnter = () => {
  animateTextElements()
  emit('card-enter')
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.card-item {
  min-width: 100%;
  min-height: calc(100% - #{$spacing-md} * 2);
  margin: 0 auto;
  border-radius: 4px;
  padding: $spacing-sm;
  position: relative;
  display: flex;
  justify-content: center;
  background: #f5f0e6;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  will-change: transform;
  overflow: visible;

  /* 纸张纹理 */
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(139, 119, 101, 0.03) 2px,
      rgba(139, 119, 101, 0.03) 4px),
    repeating-linear-gradient(90deg,
      transparent,
      transparent 2px,
      rgba(139, 119, 101, 0.03) 2px,
      rgba(139, 119, 101, 0.03) 4px);

  /* 增强立体感的阴影效果 */
  box-shadow:
    0 1px 2px rgba(139, 119, 101, 0.06),
    0 2px 4px rgba(139, 119, 101, 0.08),
    0 4px 8px rgba(139, 119, 101, 0.06),
    0 8px 16px rgba(139, 119, 101, 0.04),
    0 16px 32px rgba(139, 119, 101, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(139, 119, 101, 0.03);

  &:hover {
    transform: translateY(-4px) rotateX(1deg);
    box-shadow:
      0 2px 4px rgba(139, 119, 101, 0.08),
      0 4px 8px rgba(139, 119, 101, 0.1),
      0 8px 16px rgba(139, 119, 101, 0.08),
      0 16px 32px rgba(139, 119, 101, 0.06),
      0 32px 64px rgba(139, 119, 101, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(139, 119, 101, 0.04);
  }
}

/* 卡片背景装饰 */
.card-background-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(139, 119, 101, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 119, 101, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(139, 119, 101, 0.02) 0%, transparent 60%),
    radial-gradient(circle at 10% 80%, rgba(139, 119, 101, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 90% 20%, rgba(139, 119, 101, 0.02) 0%, transparent 40%);
  opacity: 0.8;
}

.ink-splatter {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 119, 101, 0.1) 0%, transparent 70%);
  filter: blur(2px);
  box-shadow: 0 1px 2px rgba(139, 119, 101, 0.05);
}

.ink-1 {
  top: 15%;
  left: 10%;
  width: 80px;
  height: 80px;
}

.ink-2 {
  top: 60%;
  right: 15%;
  width: 60px;
  height: 60px;
}

.ink-3 {
  bottom: 20%;
  left: 20%;
  width: 70px;
  height: 70px;
}

.card-content {
  width: 100%;
  max-width: min(90vw, 700px);
  height: 90vh;
  margin: 0 auto;
  border-radius: 2px;
  padding: $spacing-md;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: visible;
  border: 1px solid rgba(139, 119, 101, 0.3);
  box-shadow:
    0 1px 2px rgba(139, 119, 101, 0.06),
    0 2px 4px rgba(139, 119, 101, 0.08),
    0 4px 8px rgba(139, 119, 101, 0.06),
    0 8px 16px rgba(139, 119, 101, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 2px 4px rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(139, 119, 101, 0.08),
    inset 0 -2px 4px rgba(139, 119, 101, 0.04);

  &:hover {
    box-shadow:
      0 2px 4px rgba(139, 119, 101, 0.08),
      0 4px 8px rgba(139, 119, 101, 0.1),
      0 8px 16px rgba(139, 119, 101, 0.08),
      0 16px 32px rgba(139, 119, 101, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.95),
      inset 0 2px 4px rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(139, 119, 101, 0.1),
      inset 0 -2px 4px rgba(139, 119, 101, 0.06);
    transform: translateY(-3px) rotateX(1deg);
  }

  /* 手绘风格边框 */
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px dashed rgba(139, 119, 101, 0.25);
    border-radius: 4px;
    pointer-events: none;
    z-index: 0;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  /* 内层高光边框 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    pointer-events: none;
    z-index: 2;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
}

/* 胶带装饰 */
.tape-decoration {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  transition: all 0.3s ease;
}

.tape-top {
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  width: 120px;
  height: 28px;
  background: linear-gradient(135deg,
      rgba(255, 200, 150, 0.85) 0%,
      rgba(255, 220, 180, 0.85) 50%,
      rgba(255, 200, 150, 0.85) 100%);
  opacity: 0.9;
  box-shadow:
    0 2px 4px rgba(139, 119, 101, 0.15),
    0 4px 8px rgba(139, 119, 101, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(139, 119, 101, 0.1);
  border: 1px solid rgba(255, 240, 220, 0.3);
}

.card-content:hover .tape-top {
  opacity: 1;
  transform: translateX(-50%) rotate(0deg);
  box-shadow:
    0 3px 6px rgba(139, 119, 101, 0.2),
    0 6px 12px rgba(139, 119, 101, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(139, 119, 101, 0.12);
  border-color: rgba(255, 240, 220, 0.4);
}

.card-title-section {
  margin-bottom: 0;
  text-align: center;
  position: relative;
  z-index: 3;
  padding-top: 16px;
  padding-bottom: 4px;
  transition: all 0.3s ease;
}

.card-content:hover .card-title-section {
  transform: translateY(-2px);
}

/* 手绘装饰圆圈 */
.title-decoration-left,
.title-decoration-right {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(196, 167, 125, 0.3);
  border-radius: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.title-decoration-left {
  left: 10%;
  border-right: none;
}

.title-decoration-right {
  right: 10%;
  border-left: none;
}

.card-number {
  font-size: $font-size-md;
  font-weight: 600;
  color: #8b7765;
  margin-bottom: $spacing-xs;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  position: relative;
  display: inline-block;

  &::before,
  &::after {
    content: '✦';
    margin: 0 6px;
    color: #c4a77d;
    font-size: 0.8em;
  }
}

.card-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: #5d4e37;
  margin: 0;
  letter-spacing: 1px;
  line-height: 1.4;
  font-family: 'Georgia', serif;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

.text-animate {
  opacity: 0;
}

.title-underline {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(196, 167, 125, 0.4) 20%,
      rgba(196, 167, 125, 0.6) 50%,
      rgba(196, 167, 125, 0.4) 80%,
      transparent 100%);
  border-radius: 1px;
}

.card-date {
  text-align: center;
  color: #8b7765;
  font-size: $font-size-sm;
  margin-bottom: 4px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  background: rgba(255, 248, 240, 0.6);
  border-radius: 20px;
  border: 1px dashed rgba(196, 167, 125, 0.3);
  transition: all 0.3s ease;
  box-shadow:
    0 1px 2px rgba(139, 119, 101, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);

  &:hover {
    background: rgba(255, 248, 240, 0.8);
    border-color: rgba(196, 167, 125, 0.5);
    transform: translateX(-50%) translateY(-3px);
    box-shadow:
      0 2px 4px rgba(139, 119, 101, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .date-icon {
    font-size: 1.1em;
  }
}

.image-section {
  position: relative;
  z-index: 3;
  margin: 8px 0;
  transform-style: preserve-3d;
  perspective: 1000px;

  .card-image {
    width: 100%;
    max-height: 350px;
    object-fit: contain;
    border-radius: 2px;
    box-shadow:
      0 2px 4px rgba(139, 119, 101, 0.08),
      0 4px 8px rgba(139, 119, 101, 0.06),
      0 8px 16px rgba(139, 119, 101, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(139, 119, 101, 0.06),
      inset 0 -2px 4px rgba(139, 119, 101, 0.04);
    border: 2px solid rgba(196, 167, 125, 0.25);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;

    &:hover {
      box-shadow:
        0 4px 8px rgba(139, 119, 101, 0.12),
        0 8px 16px rgba(139, 119, 101, 0.1),
        0 16px 32px rgba(139, 119, 101, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        inset 0 2px 4px rgba(255, 255, 255, 0.5),
        inset 0 -1px 0 rgba(139, 119, 101, 0.08),
        inset 0 -2px 4px rgba(139, 119, 101, 0.06);
      transform: translateY(-3px) scale(1.01);
      border-color: rgba(196, 167, 125, 0.4);
    }
  }
}

.card-text-section {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  position: relative;
  z-index: 3;
  margin-bottom: 4px;
  overflow: visible;
  flex: 1;
}

.card-description {
  font-size: $font-size-md;
  text-align: center;
  color: #5d4e37;
  line-height: 1.9;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
  font-family: 'Georgia', serif;
  font-weight: 400;
  position: relative;
  padding: $spacing-xs;
  border-radius: 2px;
  background: linear-gradient(135deg,
      rgba(255, 245, 235, 0.9) 0%,
      rgba(255, 235, 215, 0.85) 100%);
  box-shadow:
    0 1px 2px rgba(139, 119, 101, 0.04),
    0 2px 4px rgba(139, 119, 101, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(139, 119, 101, 0.04);
  border: 1px solid rgba(210, 180, 140, 0.3);
  transition: all 0.3s ease;

  /* 纸张纹理 */
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(180, 140, 100, 0.02) 2px,
      rgba(180, 140, 100, 0.02) 4px),
    repeating-linear-gradient(90deg,
      transparent,
      transparent 2px,
      rgba(180, 140, 100, 0.02) 2px,
      rgba(180, 140, 100, 0.02) 4px),
    linear-gradient(135deg,
      rgba(255, 245, 235, 0.9) 0%,
      rgba(255, 235, 215, 0.85) 100%);

  &:hover {
    box-shadow:
      0 2px 4px rgba(139, 119, 101, 0.06),
      0 4px 8px rgba(139, 119, 101, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(139, 119, 101, 0.06);
    border-color: rgba(210, 180, 140, 0.45);
  }
}

.card-memory-wrapper {
  position: relative;
  margin-top: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.memory-tape {
  position: absolute;
  top: -8px;
  right: 20px;
  width: 60px;
  height: 18px;
  background: linear-gradient(135deg,
      rgba(255, 200, 150, 0.7) 0%,
      rgba(255, 220, 180, 0.7) 50%,
      rgba(255, 200, 150, 0.7) 100%);
  opacity: 0.75;
  z-index: 10;
  box-shadow:
    0 1px 2px rgba(139, 119, 101, 0.1),
    0 2px 4px rgba(139, 119, 101, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(139, 119, 101, 0.08);
  transform: rotate(3deg);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 240, 220, 0.25);
}

.card-memory-wrapper:hover .memory-tape {
  opacity: 0.9;
  transform: rotate(0deg);
  box-shadow:
    0 2px 4px rgba(139, 119, 101, 0.12),
    0 4px 8px rgba(139, 119, 101, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(139, 119, 101, 0.1);
  border-color: rgba(255, 240, 220, 0.35);
}

.card-memory {
  font-size: $font-size-md;
  font-style: italic;
  color: #8b7765;
  line-height: 1.9;
  letter-spacing: 0.5px;
  font-weight: 400;
  font-family: 'Georgia', serif;
  border-left: 3px solid #c4a77d;
  padding: $spacing-md;
  border-radius: 2px;
  margin-bottom: 0;
  margin-top: 0;
  max-height: 200px;
  min-height: 120px;
  overflow-y: auto;
  box-shadow:
    0 1px 2px rgba(139, 119, 101, 0.06),
    0 2px 4px rgba(139, 119, 101, 0.08),
    0 4px 8px rgba(139, 119, 101, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(139, 119, 101, 0.08),
    inset 0 -2px 4px rgba(139, 119, 101, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(196, 167, 125, 0.25);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg,
      rgba(255, 248, 240, 0.95) 0%,
      rgba(255, 240, 220, 0.9) 100%);

  /* 纸张纹理 */
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(139, 119, 101, 0.03) 2px,
      rgba(139, 119, 101, 0.03) 4px),
    repeating-linear-gradient(90deg,
      transparent,
      transparent 2px,
      rgba(139, 119, 101, 0.03) 2px,
      rgba(139, 119, 101, 0.03) 4px),
    linear-gradient(135deg,
      rgba(255, 248, 240, 0.95) 0%,
      rgba(255, 240, 220, 0.9) 100%);

  /* 手写风格装饰 */
  &::before {
    content: '✎';
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 16px;
    color: #c4a77d;
    opacity: 0.5;
    z-index: 0;
  }

  &>* {
    position: relative;
    z-index: 1;
  }

  &:hover {
    box-shadow:
      0 2px 4px rgba(139, 119, 101, 0.08),
      0 4px 8px rgba(139, 119, 101, 0.1),
      0 8px 16px rgba(139, 119, 101, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 2px 4px rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(139, 119, 101, 0.1),
      inset 0 -2px 4px rgba(139, 119, 101, 0.08);
    border-color: rgba(196, 167, 125, 0.4);
    transform: translateX(3px);
  }

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(196, 167, 125, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg,
        rgba(196, 167, 125, 0.6) 0%,
        rgba(139, 119, 101, 0.5) 100%);
    border-radius: 2px;

    &:hover {
      background: linear-gradient(180deg,
          rgba(196, 167, 125, 0.8) 0%,
          rgba(139, 119, 101, 0.7) 100%);
    }
  }
}

.memory-corner-decoration {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(196, 167, 125, 0.4);
  border-bottom: 2px solid rgba(196, 167, 125, 0.4);
  transform: rotate(45deg);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.card-memory-wrapper:hover .memory-corner-decoration {
  opacity: 0.9;
  transform: rotate(45deg) scale(1.2);
}

/* 底部装饰 */
.card-footer-decoration {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 5;
  pointer-events: none;
  transition: all 0.3s ease;
}

.card-content:hover .card-footer-decoration {
  transform: translateY(-2px) scale(1.05);
}

.footer-sticker {
  font-size: 28px;
  opacity: 0.6;
  filter: none;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(139, 119, 101, 0.1);
}

.card-content:hover .footer-sticker {
  opacity: 0.8;
  text-shadow: 0 2px 4px rgba(139, 119, 101, 0.15);
}

.footer-doodle {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(196, 167, 125, 0.3);
  border-radius: 50%;
  opacity: 0.4;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(139, 119, 101, 0.05);
}

.card-content:hover .footer-doodle {
  opacity: 0.6;
  border-color: rgba(196, 167, 125, 0.5);
  box-shadow: 0 2px 4px rgba(139, 119, 101, 0.08);
}

/* 卡片切换动画 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>