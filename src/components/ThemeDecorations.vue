<template>
  <div class="theme-decorations">
    <div class="paper-texture" :class="`texture-${decor.paperTexture}`"></div>

    <div v-if="decor.stickers && decor.stickers.length" class="sticker-decorations">
      <div v-for="(sticker, index) in decor.stickers" :key="`sticker-${index}`" class="sticker"
        :class="`sticker-${index + 1}`" :style="getStickerStyle(index)">
        {{ sticker }}
      </div>
    </div>

    <div v-if="decor.handDrawn && decor.handDrawn.length" class="hand-drawn-elements">
      <svg v-for="(type, index) in decor.handDrawn" :key="`handdrawn-${index}`" :class="`hand-drawn-${type}`"
        viewBox="0 0 100 100">
        <circle v-if="type === 'circle'" cx="50" cy="50" r="45" fill="none" :stroke="`${colors.primary}40`"
          stroke-width="2" stroke-dasharray="5,5" />
        <path v-else-if="type === 'star'" d="M50 5 L61 35 L95 35 L68 55 L79 85 L50 65 L21 85 L32 55 L5 35 L39 35 Z"
          fill="none" :stroke="`${colors.primary}40`" stroke-width="2" />
        <path v-else-if="type === 'heart'"
          d="M50 85 C20 60 5 40 5 25 C5 10 20 5 35 15 L50 30 L65 15 C80 5 95 10 95 25 C95 40 80 60 50 85 Z" fill="none"
          :stroke="`${colors.primary}40`" stroke-width="2" />
        <path v-else-if="type === 'arrow'" d="M10 50 L70 50 M60 40 L70 50 L60 60" fill="none"
          :stroke="`${colors.primary}40`" stroke-width="3" stroke-linecap="round" />
        <path v-else-if="type === 'leaf'" d="M50 90 Q30 70 30 50 Q30 30 50 10 Q70 30 70 50 Q70 70 50 90 Z" fill="none"
          :stroke="`${colors.primary}40`" stroke-width="2" />
        <path v-else-if="type === 'doodle'"
          d="M20 30 Q35 20 50 30 T80 30 M15 50 Q40 40 50 50 T85 50 M20 70 Q35 60 50 70 T80 70" fill="none"
          :stroke="`${colors.primary}40`" stroke-width="2" stroke-linecap="round" />
        <path v-else-if="type === 'squiggle'" d="M10 50 Q30 20 50 50 T90 50" fill="none" :stroke="`${colors.primary}40`"
          stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>

    <div class="corner-decorations" :class="`corner-${decor.cornerDecor || 'rounded'}`"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  decor: {
    type: Object,
    required: true
  },
  colors: {
    type: Object,
    required: true
  }
})

let stickerAnimations = []
let handDrawnAnimations = []

onMounted(() => {
  animateStickers()
  animateHandDrawnElements()
})

onUnmounted(() => {
  stickerAnimations.forEach(anim => anim.kill())
  handDrawnAnimations.forEach(anim => anim.kill())
})

const animateStickers = () => {
  const stickers = document.querySelectorAll('.sticker')
  stickerAnimations = []

  stickers.forEach((sticker, index) => {
    const anim = gsap.to(sticker, {
      y: -10,
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.4
    })
    stickerAnimations.push(anim)
  })
}

const animateHandDrawnElements = () => {
  handDrawnAnimations = []

  const circle = document.querySelector('.hand-drawn-circle')
  if (circle) {
    const anim = gsap.to(circle, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })
    handDrawnAnimations.push(anim)
  }

  const star = document.querySelector('.hand-drawn-star')
  if (star) {
    const anim = gsap.to(star, {
      scale: 1.15,
      opacity: 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    handDrawnAnimations.push(anim)
  }

  const heart = document.querySelector('.hand-drawn-heart')
  if (heart) {
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(heart, { scale: 1.1, duration: 0.5, ease: 'power1.out' })
      .to(heart, { scale: 1, duration: 0.5, ease: 'power1.in' })
      .to(heart, { scale: 1.1, duration: 0.5, ease: 'power1.out' })
      .to(heart, { scale: 1, duration: 0.5, ease: 'power1.in' })
    handDrawnAnimations.push(tl)
  }

  const arrow = document.querySelector('.hand-drawn-arrow')
  if (arrow) {
    const anim = gsap.to(arrow, {
      x: 5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    handDrawnAnimations.push(anim)
  }

  const leaf = document.querySelector('.hand-drawn-leaf')
  if (leaf) {
    const anim = gsap.to(leaf, {
      rotation: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    handDrawnAnimations.push(anim)
  }

  const doodle = document.querySelector('.hand-drawn-doodle')
  if (doodle) {
    const anim = gsap.to(doodle, {
      opacity: 0.5,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    handDrawnAnimations.push(anim)
  }

  const squiggle = document.querySelector('.hand-drawn-squiggle')
  if (squiggle) {
    const anim = gsap.to(squiggle, {
      x: 3,
      rotation: 2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    handDrawnAnimations.push(anim)
  }
}

const getStickerStyle = (index) => {
  const positions = [
    { top: '5%', left: '8%', rotation: -15 },
    { top: '8%', right: '10%', rotation: 12 },
    { bottom: '25%', left: '5%', rotation: -8 },
    { bottom: '20%', right: '7%', rotation: 10 },
    { top: '45%', left: '3%', rotation: -5 },
    { top: '50%', right: '4%', rotation: 7 }
  ]

  const pos = positions[index % positions.length]
  return {
    top: pos.top,
    left: pos.left,
    right: pos.right,
    transform: `rotate(${pos.rotation}deg)`
  }
}
</script>

<style lang="scss" scoped>
.theme-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  pointer-events: none;

  &.texture-plain {
    background: transparent;
  }

  &.texture-grid {
    background-image:
      linear-gradient(rgba(139, 119, 101, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 119, 101, 0.08) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  &.texture-lined {
    background-image: repeating-linear-gradient(0deg,
        transparent,
        transparent 24px,
        rgba(139, 119, 101, 0.06) 24px,
        rgba(139, 119, 101, 0.06) 25px);
  }

  &.texture-dotted {
    background-image: radial-gradient(rgba(139, 119, 101, 0.15) 1px, transparent 1px);
    background-size: 15px 15px;
  }

  &.texture-craft {
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
  }

  &.texture-vintage {
    background-image:
      radial-gradient(circle at 20% 30%, rgba(139, 119, 101, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(139, 119, 101, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 119, 101, 0.03) 0%, transparent 60%);
  }
}

.sticker-decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sticker {
  position: absolute;
  font-size: 28px;
  opacity: 0.7;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.hand-drawn-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hand-drawn-circle {
  position: absolute;
  top: 15%;
  left: 12%;
  width: 70px;
  height: 70px;
  opacity: 0.4;
}

.hand-drawn-star {
  position: absolute;
  top: 20%;
  right: 15%;
  width: 50px;
  height: 50px;
  opacity: 0.35;
}

.hand-drawn-heart {
  position: absolute;
  bottom: 30%;
  left: 10%;
  width: 60px;
  height: 60px;
  opacity: 0.4;
}

.hand-drawn-arrow {
  position: absolute;
  bottom: 35%;
  right: 12%;
  width: 80px;
  height: 60px;
  opacity: 0.35;
}

.hand-drawn-leaf {
  position: absolute;
  top: 40%;
  left: 8%;
  width: 50px;
  height: 70px;
  opacity: 0.4;
}

.hand-drawn-doodle {
  position: absolute;
  top: 60%;
  right: 10%;
  width: 80px;
  height: 60px;
  opacity: 0.3;
}

.hand-drawn-squiggle {
  position: absolute;
  bottom: 25%;
  left: 15%;
  width: 90px;
  height: 50px;
  opacity: 0.35;
}

.corner-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &.corner-rounded::before,
  &.corner-rounded::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(139, 119, 101, 0.2);
    border-radius: 50%;
  }

  &.corner-rounded::before {
    top: 15px;
    left: 15px;
  }

  &.corner-rounded::after {
    bottom: 15px;
    right: 15px;
  }

  &.corner-folded::before,
  &.corner-folded::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, rgba(139, 119, 101, 0.1) 0%, transparent 50%);
  }

  &.corner-folded::before {
    top: 0;
    right: 0;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
  }

  &.corner-folded::after {
    bottom: 0;
    left: 0;
    clip-path: polygon(0 0, 100% 100%, 0 100%);
  }

  &.corner-torn::before,
  &.corner-torn::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    border: 2px dashed rgba(139, 119, 101, 0.25);
  }

  &.corner-torn::before {
    top: 10px;
    left: 10px;
    border-radius: 2px 10px 2px 10px;
  }

  &.corner-torn::after {
    bottom: 10px;
    right: 10px;
    border-radius: 10px 2px 10px 2px;
  }

  &.corner-artistic::before,
  &.corner-artistic::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(139, 119, 101, 0.15);
    transform: rotate(45deg);
  }

  &.corner-artistic::before {
    top: 15px;
    left: 15px;
    border-radius: 50%;
  }

  &.corner-artistic::after {
    bottom: 15px;
    right: 15px;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}
</style>
