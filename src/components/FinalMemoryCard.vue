<template>
  <div class="final-memory-card" ref="cardRef" v-if="textConfigs">
    <div class="card-background-decorations">
      <div class="paper-texture"></div>
      <div class="ink-splatter ink-1"></div>
      <div class="ink-splatter ink-2"></div>
      <div class="birthday-decorations">
        <div v-for="(balloon, index) in balloons" :key="`balloon-${index}`" class="balloon"
          :style="balloonStyles[index] || {}">
          {{ balloon }}
        </div>
        <div v-for="(star, index) in stars" :key="`star-${index}`" class="star" :style="starStyles[index] || {}">
          {{ star }}
        </div>
      </div>
    </div>

    <div class="card-content" ref="cardContent">
      <div class="title-section">
        <div class="birthday-cake">{{ textConfigs.finalCard.decorations.cake }}</div>
        <h3 class="card-number">{{ textConfigs.finalCard.title.number }}</h3>
        <h2 class="card-title">{{ textConfigs.finalCard.title.main }}</h2>
        <div class="title-underline"></div>
      </div>

      <div class="message-section">
        <p class="main-message">{{ textConfigs.finalCard.message.main }}</p>
        <p class="sub-message">{{ textConfigs.finalCard.message.sub }}</p>
      </div>

      <div class="envelope-section" ref="envelopeSection">
        <div class="envelope-container">
          <div class="envelope-3d" :class="{ 'opened': isEnvelopeOpened }" @click="toggleEnvelope">
            <div class="envelope-back"></div>
            <div class="envelope-left"></div>
            <div class="envelope-right"></div>
            <div class="envelope-bottom"></div>
            <div class="envelope-front">
              <div class="envelope-text" v-if="!isEnvelopeOpened">
                <span class="receive-text">{{ textConfigs.finalCard.envelope.receiveText }}</span>
              </div>
            </div>
            <div class="envelope-flap" ref="envelopeFlap">
              <span class="click-hint" v-if="!isEnvelopeOpened">{{ textConfigs.finalCard.envelope.clickHint }}</span>
              <div class="flap-inner"></div>
              <div class="flap-shadow"></div>
            </div>
          </div>
        </div>
      </div>

      <transition name="letter-fly">
        <div class="letter-overlay" v-if="isEnvelopeOpened">
          <div class="letter-3d" ref="letterRef" @click.stop="closeEnvelope">
            <div class="letter-front">
              <div class="letter-paper">
                <div class="letter-lines"></div>
                <div class="letter-content">
                  <div class="letter-header">
                    <span class="letter-heart">{{ textConfigs.finalLetter.header.heart }}</span>
                  </div>
                  <div class="letter-body">
                    <p class="letter-text">{{ textConfigs.finalLetter.body.greeting }}</p>
                    <p v-for="(msg, index) in textConfigs.finalLetter.body.messages" :key="index"
                      class="letter-message">{{ msg }}</p>
                    <p class="letter-signature">{{ textConfigs.finalLetter.body.signature }}</p>
                  </div>
                  <div class="letter-footer">
                    <div class="letter-decoration">{{ textConfigs.finalLetter.footer.decoration }}</div>
                  </div>
                </div>
                <div class="letter-border"></div>
                <div class="letter-corner top-left"></div>
                <div class="letter-corner top-right"></div>
                <div class="letter-corner bottom-left"></div>
                <div class="letter-corner bottom-right"></div>
              </div>
            </div>
            <div class="letter-back"></div>
            <div class="letter-top"></div>
            <div class="letter-bottom"></div>
            <div class="letter-left"></div>
            <div class="letter-right"></div>
            <div class="close-hint">{{ textConfigs.finalCard.envelope.closeHint }}</div>
          </div>
        </div>
      </transition>
    </div>

    <div class="footer-decoration">
      <div class="footer-sticker">{{ textConfigs.finalCard.decorations.footerSticker }}</div>
      <div class="footer-doodle"></div>
      <div class="birthday-badges">
        <span v-for="(badge, index) in textConfigs.finalCard.decorations.badges" :key="index" class="badge">{{ badge
          }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { loadTextConfigs, getTextConfigs } from '../utils/configLoader.js'

const cardRef = ref(null)
const cardContent = ref(null)
const envelopeSection = ref(null)
const envelopeFlap = ref(null)
const letterRef = ref(null)

const isEnvelopeOpened = ref(false)

let enterAnimations = []
let envelopeAnimation = null
let decorationAnimations = []

const textConfigs = ref(null)

const balloons = ref([])
const stars = ref([])

const balloonStyles = ref([])
const starStyles = ref([])

const screenWidth = ref(window.innerWidth)

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

const ANIMATION_CONFIG = {
  cardEnter: {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    staggerDelay: 0.15
  },
  envelope: {
    flapRotation: -180,
    flapDuration: 0.6,
    flapEase: 'power2.inOut',
    get letterYPercent() {
      if (screenWidth.value < 640) {
        return -20
      } else if (screenWidth.value < 768) {
        return -24
      } else {
        return -30
      }
    },
    letterRotation: -2,
    letterDuration: 0.8,
    letterDelay: 0.15,
    letterScale: 1.08,
    letterScaleDuration: 0.4,
    letterScaleEase: 'elastic.out(1, 0.5)',
    letterRotateX: 5,
    letterRotateY: -3
  },
  inkSplatter: {
    opacity: 0.6,
    scale: 1,
    duration: 1.5,
    delay: 0.5,
    ease: 'power2.out'
  },
  closeEnvelope: {
    letterOpacity: 0,
    letterDuration: 0.6,
    letterEase: 'power2.in',
    flapDuration: 0.5,
    flapEase: 'power2.inOut',
    flapDelay: 0.3
  },
  decorations: {
    balloonFloat: {
      y: -15,
      rotation: 3,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    },
    starTwinkle: {
      opacity: 0.4,
      scale: 0.9,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    }
  }
}

const initializeDecorationStyles = () => {
  if (Array.isArray(balloons.value)) {
    balloonStyles.value = balloons.value.map((_, index) => ({
      position: 'absolute',
      left: `${15 + index * 25}%`,
      top: `${8 + (index % 2) * 12}%`,
      fontSize: `${1.8 + (index % 2) * 0.4}rem`,
      opacity: 0.6,
      transform: `rotate(${-8 + index * 4}deg)`,
      animationDelay: `${index * 0.4}s`
    }))
  }

  if (Array.isArray(stars.value)) {
    starStyles.value = stars.value.map((_, index) => ({
      position: 'absolute',
      left: `${10 + (index % 3) * 25}%`,
      top: `${15 + (index % 2) * 18}%`,
      fontSize: `${1 + (index % 2) * 0.4}rem`,
      opacity: 0.5,
      transform: `rotate(${-12 + index * 6}deg)`,
      animationDelay: `${index * 0.3}s`
    }))
  }
}

const animateDecorations = () => {
  const balloonElements = document.querySelectorAll('.balloon')
  const starElements = document.querySelectorAll('.star')

  balloonElements.forEach((balloon, index) => {
    const anim = gsap.to(balloon, {
      ...ANIMATION_CONFIG.decorations.balloonFloat,
      delay: index * 0.3
    })
    decorationAnimations.push(anim)
  })

  starElements.forEach((star, index) => {
    const anim = gsap.to(star, {
      ...ANIMATION_CONFIG.decorations.starTwinkle,
      delay: index * 0.2
    })
    decorationAnimations.push(anim)
  })
}

const toggleEnvelope = () => {
  if (!isEnvelopeOpened.value) {
    openEnvelope()
  }
}

const openEnvelope = () => {
  if (isEnvelopeOpened.value) return

  isEnvelopeOpened.value = true

  nextTick(() => {
    animateEnvelopeOpening()
  })
}

const closeEnvelope = () => {
  if (!isEnvelopeOpened.value) return

  if (envelopeAnimation) {
    envelopeAnimation.kill()
  }

  const timeline = gsap.timeline({
    onComplete: () => {
      isEnvelopeOpened.value = false
      envelopeAnimation = null
    }
  })

  timeline.to(letterRef.value, {
    yPercent: 0,
    rotation: 0,
    scale: 1,
    opacity: ANIMATION_CONFIG.closeEnvelope.letterOpacity,
    duration: ANIMATION_CONFIG.closeEnvelope.letterDuration,
    ease: ANIMATION_CONFIG.closeEnvelope.letterEase
  })

  timeline.to(envelopeFlap.value, {
    rotationX: 0,
    duration: ANIMATION_CONFIG.closeEnvelope.flapDuration,
    ease: ANIMATION_CONFIG.closeEnvelope.flapEase
  }, `-= ${ANIMATION_CONFIG.closeEnvelope.flapDelay}`)

  envelopeAnimation = timeline
}

const animateEnvelopeOpening = () => {
  const timeline = gsap.timeline()

  timeline.to(envelopeFlap.value, {
    rotationX: ANIMATION_CONFIG.envelope.flapRotation,
    duration: ANIMATION_CONFIG.envelope.flapDuration,
    ease: ANIMATION_CONFIG.envelope.flapEase
  })

  timeline.fromTo(letterRef.value,
    {
      opacity: 0,
      scale: 0.8
    },
    {
      opacity: 1,
      scale: 1,
      duration: ANIMATION_CONFIG.envelope.letterDuration,
      ease: 'power3.out',
      delay: ANIMATION_CONFIG.envelope.letterDelay
    }
  )
}

const animateCardEnter = () => {
  const elements = cardContent.value.querySelectorAll('.title-section, .message-section, .envelope-section, .footer-decoration')

  elements.forEach((element, index) => {
    const anim = gsap.fromTo(element,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: ANIMATION_CONFIG.cardEnter.opacity,
        y: ANIMATION_CONFIG.cardEnter.y,
        duration: ANIMATION_CONFIG.cardEnter.duration,
        ease: ANIMATION_CONFIG.cardEnter.ease,
        delay: index * ANIMATION_CONFIG.cardEnter.staggerDelay
      }
    )
    enterAnimations.push(anim)
  })

  gsap.fromTo('.ink-splatter',
    {
      opacity: 0,
      scale: 0.8
    },
    {
      opacity: ANIMATION_CONFIG.inkSplatter.opacity,
      scale: ANIMATION_CONFIG.inkSplatter.scale,
      duration: ANIMATION_CONFIG.inkSplatter.duration,
      ease: ANIMATION_CONFIG.inkSplatter.ease,
      delay: ANIMATION_CONFIG.inkSplatter.delay
    }
  )
}

const stopAnimations = () => {
  enterAnimations.forEach(anim => {
    if (anim && anim.kill) anim.kill()
  })
  enterAnimations = []
  decorationAnimations.forEach(anim => {
    if (anim && anim.kill) anim.kill()
  })
  decorationAnimations = []
}

onMounted(async () => {
  try {
    await loadTextConfigs()
    textConfigs.value = getTextConfigs()
    if (textConfigs.value && textConfigs.value.finalCard) {
      balloons.value = textConfigs.value.finalCard.decorations.balloons || []
      stars.value = textConfigs.value.finalCard.decorations.stars || []
    }
    initializeDecorationStyles()

    window.addEventListener('resize', handleResize)

    nextTick(() => {
      animateCardEnter()
      animateDecorations()
    })
  } catch (error) {
    console.error('Failed to load text configs:', error)
    initializeDecorationStyles()

    window.addEventListener('resize', handleResize)

    nextTick(() => {
      animateCardEnter()
      animateDecorations()
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAnimations()
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.final-memory-card {
  width: 100%;
  min-width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg,
      rgba(255, 220, 180, 0.25) 0%,
      rgba(200, 160, 120, 0.2) 50%,
      rgba(100, 80, 60, 0.25) 100%);
}

.card-background-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.birthday-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.balloon {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
  transition: transform 0.4s ease;
}

.star {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
  transition: transform 0.4s ease;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.5;
}

.ink-splatter {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(139, 119, 101, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(2px);

  &.ink-1 {
    top: 10%;
    right: 15%;
    width: 100px;
    height: 100px;
  }

  &.ink-2 {
    bottom: 20%;
    left: 10%;
    width: 90px;
    height: 90px;
  }
}

.card-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  overflow-y: auto;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
  position: relative;

  .birthday-cake {
    font-size: 2.5rem;
    margin-bottom: 15px;
    animation: cakeBounce 3s ease-in-out infinite;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
  }

  @keyframes cakeBounce {

    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }

    50% {
      transform: translateY(-6px) rotate(2deg);
    }
  }

  .card-number {
    font-size: 1rem;
    color: rgba(139, 119, 101, 0.6);
    font-weight: 500;
    margin-bottom: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .card-title {
    font-size: 2.2rem;
    color: #8b7765;
    font-weight: 700;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
  }

  .title-underline {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(139, 119, 101, 0.5), transparent);
    margin: 0 auto;
  }
}

.message-section {
  text-align: center;
  margin-bottom: 30px;
  max-width: 500px;

  .main-message {
    font-size: 1.3rem;
    color: #8b7765;
    font-weight: 600;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .sub-message {
    font-size: 1rem;
    color: rgba(139, 119, 101, 0.75);
    font-weight: 500;
    line-height: 1.6;
  }
}

.envelope-section {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
}

.envelope-container {
  position: relative;
  width: 260px;
  height: 170px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &::before {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 20px;
    background: radial-gradient(ellipse, rgba(139, 119, 101, 0.2) 0%, transparent 70%);
    filter: blur(8px);
    z-index: -1;
  }
}

.envelope-3d {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.3s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
  }

  &.opened {
    cursor: default;
    transform: none;
  }
}

.envelope-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8d9cf 0%, #dfccc0 100%);
  border-radius: 6px;
  transform: translateZ(-10px);
  box-shadow: inset 0 0 20px rgba(139, 119, 101, 0.15);
}

.envelope-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, #f0e3d9 0%, #f7ebe3 100%);
  border-radius: 6px 0 0 6px;
  transform: rotateY(-90deg) translateZ(130px);
  transform-origin: left;
  box-shadow: inset -2px 0 10px rgba(139, 119, 101, 0.1);
}

.envelope-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, #f7ebe3 0%, #f0e3d9 100%);
  border-radius: 0 6px 6px 0;
  transform: rotateY(90deg) translateZ(130px);
  transform-origin: right;
  box-shadow: inset 2px 0 10px rgba(139, 119, 101, 0.1);
}

.envelope-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, #f7ebe3 0%, #f0e3d9 100%);
  border-radius: 0 0 6px 6px;
  transform: rotateX(90deg) translateZ(85px);
  transform-origin: bottom;
  box-shadow: inset 0 2px 10px rgba(139, 119, 101, 0.1);
}

.envelope-front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f7ebe3 0%, #f0e3d9 100%);
  border-radius: 6px;
  transform: translateZ(10px);
  box-shadow:
    0 4px 16px rgba(139, 119, 101, 0.15),
    0 2px 8px rgba(139, 119, 101, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
}

.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 85px;
  background: linear-gradient(135deg, #f0e3d9 0%, #e8d9cf 100%);
  transform-origin: top;
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  z-index: 3;
  transform: translateZ(20px);
  transition: transform 0.8s ease;
  box-shadow: 0 1px 4px rgba(139, 119, 101, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 5px;

  .click-hint {
    font-size: 2rem;
    animation: heartbeat 2s ease-in-out infinite;
  }

  .flap-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
  }

  .flap-shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(to bottom, transparent, rgba(139, 119, 101, 0.1));
    pointer-events: none;
  }
}

.envelope-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.envelope-text {
  position: relative;
  z-index: 10;

  .receive-text {
    font-size: 0.9rem;
    color: #8b7765;
    font-weight: 500;
    letter-spacing: 1px;
  }
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.letter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.letter-3d {
  position: relative;
  width: 320px;
  height: 600px;
  z-index: 10;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
}

.letter-front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(5px);
  z-index: 5;
}

.letter-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8d9cf 0%, #dfccc0 100%);
  border-radius: 4px;
  transform: translateZ(-5px);
  box-shadow: inset 0 0 15px rgba(139, 119, 101, 0.15);
}

.letter-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(180deg, #fffef9 0%, #fff9f0 100%);
  transform: rotateX(90deg) translateZ(5px);
  transform-origin: top;
}

.letter-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(180deg, #fff5e6 0%, #fffef9 100%);
  transform: rotateX(-90deg) translateZ(5px);
  transform-origin: bottom;
}

.letter-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
  background: linear-gradient(90deg, #fffef9 0%, #fff9f0 100%);
  transform: rotateY(-90deg) translateZ(5px);
  transform-origin: left;
}

.letter-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
  background: linear-gradient(90deg, #fff9f0 0%, #fffef9 100%);
  transform: rotateY(90deg) translateZ(5px);
  transform-origin: right;
}

.letter-paper {
  position: relative;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(135deg, #fffef9 0%, #fff9f0 50%, #fff5e6 100%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  border-radius: 4px;
  box-shadow:
    0 4px 16px rgba(139, 119, 101, 0.2),
    0 2px 8px rgba(139, 119, 101, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(139, 119, 101, 0.05);
  padding: 16px;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      repeating-linear-gradient(0deg,
        transparent,
        transparent 23px,
        rgba(139, 119, 101, 0.06) 24px);
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(139, 119, 101, 0.05) 100%);
    pointer-events: none;
    z-index: 6;
  }
}

.letter-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 23px,
      rgba(139, 119, 101, 0.08) 24px);
  pointer-events: none;
  z-index: 2;
}

.letter-border {
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  border: 1px solid rgba(139, 119, 101, 0.12);
  border-radius: 2px;
  pointer-events: none;
  z-index: 3;
}

.letter-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 4;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(139, 119, 101, 0.2);
  }

  &.top-left {
    top: 10px;
    left: 10px;

    &::before {
      top: 0;
      left: 0;
      width: 1px;
      height: 8px;
    }

    &::after {
      top: 0;
      left: 0;
      width: 8px;
      height: 1px;
    }
  }

  &.top-right {
    top: 10px;
    right: 10px;

    &::before {
      top: 0;
      right: 0;
      width: 1px;
      height: 8px;
    }

    &::after {
      top: 0;
      right: 0;
      width: 8px;
      height: 1px;
    }
  }

  &.bottom-left {
    bottom: 10px;
    left: 10px;

    &::before {
      bottom: 0;
      left: 0;
      width: 1px;
      height: 8px;
    }

    &::after {
      bottom: 0;
      left: 0;
      width: 8px;
      height: 1px;
    }
  }

  &.bottom-right {
    bottom: 10px;
    right: 10px;

    &::before {
      bottom: 0;
      right: 0;
      width: 1px;
      height: 8px;
    }

    &::after {
      bottom: 0;
      right: 0;
      width: 8px;
      height: 1px;
    }
  }
}

.letter-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
}

.close-hint {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: rgba(139, 119, 101, 0.5);
  white-space: nowrap;
  opacity: 0;
  animation: fadeInUp 0.5s ease 1s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.letter-header {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;

  .letter-heart {
    font-size: 1.5rem;
    animation: float 4s ease-in-out infinite;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.letter-body {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  overflow-y: auto;
  max-height: 480px;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 119, 101, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 119, 101, 0.3);
    border-radius: 3px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 119, 101, 0.5);
  }

  .letter-text {
    font-size: 0.9rem;
    color: #8b7765;
    font-weight: 600;
    margin-bottom: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .letter-message {
    font-size: 0.8rem;
    color: rgba(139, 119, 101, 0.85);
    line-height: 1.8;
    margin-bottom: 0;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    font-family: 'Georgia', 'Times New Roman', serif;
    text-indent: 2em;
  }

  .letter-signature {
    font-size: 0.85rem;
    color: #c4a77d;
    font-weight: 600;
    margin-top: 15px;
    font-style: italic;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    font-family: 'Georgia', 'Times New Roman', serif;
    text-align: right;
  }
}

.letter-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;

  .letter-decoration {
    font-size: 1.2rem;
    animation: sparkle 3s ease-in-out infinite;
  }
}

@keyframes sparkle {

  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.letter-fly-enter-active {
  transition: all 1.0s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.letter-fly-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.letter-fly-leave-active {
  transition: all 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.letter-fly-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.footer-decoration {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  .footer-sticker {
    font-size: 1.8rem;
    animation: bounce 2.5s ease-in-out infinite;
  }

  .footer-doodle {
    width: 50px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 119, 101, 0.3), transparent);
  }

  .birthday-badges {
    display: flex;
    gap: 12px;

    .badge {
      font-size: 1.3rem;
      animation: badgeFloat 3s ease-in-out infinite;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.5s;
      }

      &:nth-child(3) {
        animation-delay: 1s;
      }
    }
  }
}

@keyframes badgeFloat {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-6px) rotate(3deg);
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: $breakpoint-sm) {
  .card-content {
    padding: 20px 15px;
  }

  .title-section {
    margin-bottom: 20px;

    .card-title {
      font-size: 2rem;
    }

    .title-decoration-left {
      left: -30px;
    }

    .title-decoration-right {
      right: -30px;
    }
  }

  .message-section {
    margin-bottom: 20px;

    .main-message {
      font-size: 1.2rem;
    }

    .sub-message {
      font-size: 1rem;
    }
  }

  .envelope-section {
    height: 650px;
    margin: 15px 0;
  }

  .envelope-container {
    width: 240px;
    height: 160px;

    .envelope-left {
      transform: rotateY(-90deg) translateZ(120px);
    }

    .envelope-right {
      transform: rotateY(90deg) translateZ(120px);
    }

    .envelope-bottom {
      transform: rotateX(90deg) translateZ(80px);
    }
  }

  .letter-paper {
    padding: 15px;
  }

  .letter-body {
    .letter-text {
      font-size: 1rem;
    }

    .letter-message {
      font-size: 0.85rem;
      line-height: 1.8;
    }
  }

  .letter-border {
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
  }

  .letter-corner {
    width: 16px;
    height: 16px;

    &.top-left,
    &.top-right {
      top: 10px;
    }

    &.bottom-left,
    &.bottom-right {
      bottom: 10px;
    }

    &.top-left,
    &.bottom-left {
      left: 10px;
    }

    &.top-right,
    &.bottom-right {
      right: 10px;
    }

    &::before {
      width: 2px;
      height: 8px;
    }

    &::after {
      width: 8px;
      height: 2px;
    }
  }
}
</style>
