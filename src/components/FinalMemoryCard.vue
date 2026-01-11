<template>
  <div class="final-memory-card" ref="cardRef">
    <div class="card-background-decorations">
      <div class="paper-texture"></div>
      <div class="ink-splatter ink-1"></div>
      <div class="ink-splatter ink-2"></div>
    </div>

    <div class="card-content" ref="cardContent">
      <div class="title-section">
        <div class="title-decoration-left"></div>
        <div class="title-decoration-right"></div>
        <h3 class="card-number">未完待续...</h3>
        <h2 class="card-title">我们的故事还在继续</h2>
        <div class="title-underline"></div>
      </div>

      <div class="message-section">
        <p class="main-message">每一个瞬间都是珍贵的回忆</p>
        <p class="sub-message">期待与你一起创造更多美好的时光</p>
      </div>

      <div class="envelope-section" ref="envelopeSection">
        <div class="envelope-container">
          <div class="envelope" :class="{ 'opened': isEnvelopeOpened }" @click="toggleEnvelope">
            <div class="envelope-flap" ref="envelopeFlap">
              <div class="flap-inner"></div>
            </div>
            <div class="envelope-body">
              <div class="envelope-text" v-if="!isEnvelopeOpened">
                <span class="click-hint">💌</span>
                <span class="receive-text">接收祝福</span>
              </div>
            </div>
          </div>

          <transition name="letter-fly">
            <div class="letter" v-if="isEnvelopeOpened" ref="letterRef" @click.stop="closeEnvelope">
              <div class="letter-paper">
                <div class="letter-lines"></div>
                <div class="letter-content">
                  <div class="letter-header">
                    <span class="letter-heart">💕</span>
                  </div>
                  <div class="letter-body">
                    <p class="letter-text">亲爱的：</p>
                    <p class="letter-message">感谢你出现在我的生命中，</p>
                    <p class="letter-message">让每一个平凡的日子都变得闪闪发光。</p>
                    <p class="letter-message">愿我们的故事永远未完待续，</p>
                    <p class="letter-message">愿未来的每一天都有你的陪伴。</p>
                    <p class="letter-signature">永远爱你的 ❤️</p>
                  </div>
                  <div class="letter-footer">
                    <div class="letter-decoration">✨</div>
                  </div>
                </div>
                <div class="letter-border"></div>
                <div class="letter-corner top-left"></div>
                <div class="letter-corner top-right"></div>
                <div class="letter-corner bottom-left"></div>
                <div class="letter-corner bottom-right"></div>
              </div>
              <div class="close-hint">点击关闭</div>
            </div>
          </transition>
        </div>
      </div>

      <div class="footer-decoration">
        <div class="footer-sticker">💝</div>
        <div class="footer-doodle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const cardRef = ref(null)
const cardContent = ref(null)
const envelopeSection = ref(null)
const envelopeFlap = ref(null)
const letterRef = ref(null)

const isEnvelopeOpened = ref(false)

let enterAnimations = []
let envelopeAnimation = null

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
    flapDuration: 0.8,
    flapEase: 'power2.inOut',
    letterY: -200,
    letterRotation: -5,
    letterDuration: 1.2,
    letterDelay: 0.3,
    letterScale: 1.05,
    letterScaleDuration: 0.3,
    letterScaleEase: 'power2.out'
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
    letterDuration: 0.8,
    letterEase: 'power2.in',
    flapDuration: 0.6,
    flapEase: 'power2.inOut',
    flapDelay: 0.4
  }
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
    y: 0,
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

  timeline.to(letterRef.value, {
    y: ANIMATION_CONFIG.envelope.letterY,
    rotation: ANIMATION_CONFIG.envelope.letterRotation,
    duration: ANIMATION_CONFIG.envelope.letterDuration,
    ease: 'power2.out',
    delay: ANIMATION_CONFIG.envelope.letterDelay
  }, '-=0.4')

  timeline.to(letterRef.value, {
    scale: ANIMATION_CONFIG.envelope.letterScale,
    rotation: 0,
    duration: ANIMATION_CONFIG.envelope.letterScaleDuration,
    ease: ANIMATION_CONFIG.envelope.letterScaleEase
  })
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
}

onMounted(() => {
  nextTick(() => {
    animateCardEnter()
  })
})

onUnmounted(() => {
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
  justify-content: center;
  padding: 40px 20px;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
  position: relative;

  .card-number {
    font-size: 1.2rem;
    color: rgba(139, 119, 101, 0.7);
    font-weight: 600;
    margin-bottom: 8px;
    letter-spacing: 2px;
  }

  .card-title {
    font-size: 2.5rem;
    color: #8b7765;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .title-underline {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(139, 119, 101, 0.6), transparent);
    margin: 0 auto;
  }

  .title-decoration-left,
  .title-decoration-right {
    position: absolute;
    top: 50%;
    width: 30px;
    height: 2px;
    background: rgba(139, 119, 101, 0.4);
  }

  .title-decoration-left {
    left: -40px;
  }

  .title-decoration-right {
    right: -40px;
  }
}

.message-section {
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;

  .main-message {
    font-size: 1.4rem;
    color: #8b7765;
    font-weight: 600;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .sub-message {
    font-size: 1.1rem;
    color: rgba(139, 119, 101, 0.8);
    font-weight: 500;
    line-height: 1.6;
  }
}

.envelope-section {
  position: relative;
  margin-bottom: 40px;
}

.envelope-container {
  position: relative;
  width: 280px;
  height: 180px;
  cursor: pointer;
  perspective: 1000px;
}

.envelope {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8d4c0 100%);
  border-radius: 8px;
  box-shadow:
    0 8px 24px rgba(139, 119, 101, 0.3),
    0 4px 12px rgba(139, 119, 101, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 12px 32px rgba(139, 119, 101, 0.4),
      0 6px 16px rgba(139, 119, 101, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  &.opened {
    cursor: default;
    transform: none;
  }
}

.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background: linear-gradient(135deg, #e8d4c0 0%, #d9c4b0 100%);
  transform-origin: top;
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  z-index: 3;
  transition: transform 0.8s ease;
  box-shadow: 0 2px 8px rgba(139, 119, 101, 0.2);

  .flap-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .click-hint {
    font-size: 2.5rem;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  .receive-text {
    font-size: 1.1rem;
    color: #8b7765;
    font-weight: 600;
    letter-spacing: 1px;
  }
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.letter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  min-height: 220px;
  z-index: 4;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.02);
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.98);
  }
}

.letter-paper {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fffef9 0%, #fff9f0 50%, #fff5e6 100%);
  border-radius: 4px;
  box-shadow:
    0 8px 24px rgba(139, 119, 101, 0.4),
    0 4px 12px rgba(139, 119, 101, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 20px;
  overflow: hidden;

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
        transparent 27px,
        rgba(139, 119, 101, 0.08) 28px);
    pointer-events: none;
    z-index: 1;
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
      transparent 27px,
      rgba(139, 119, 101, 0.1) 28px);
  pointer-events: none;
  z-index: 1;
}

.letter-border {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 2px solid rgba(139, 119, 101, 0.15);
  border-radius: 2px;
  pointer-events: none;
  z-index: 2;
}

.letter-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 2;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(139, 119, 101, 0.25);
  }

  &.top-left {
    top: 12px;
    left: 12px;

    &::before {
      top: 0;
      left: 0;
      width: 2px;
      height: 10px;
    }

    &::after {
      top: 0;
      left: 0;
      width: 10px;
      height: 2px;
    }
  }

  &.top-right {
    top: 12px;
    right: 12px;

    &::before {
      top: 0;
      right: 0;
      width: 2px;
      height: 10px;
    }

    &::after {
      top: 0;
      right: 0;
      width: 10px;
      height: 2px;
    }
  }

  &.bottom-left {
    bottom: 12px;
    left: 12px;

    &::before {
      bottom: 0;
      left: 0;
      width: 2px;
      height: 10px;
    }

    &::after {
      bottom: 0;
      left: 0;
      width: 10px;
      height: 2px;
    }
  }

  &.bottom-right {
    bottom: 12px;
    right: 12px;

    &::before {
      bottom: 0;
      right: 0;
      width: 2px;
      height: 10px;
    }

    &::after {
      bottom: 0;
      right: 0;
      width: 10px;
      height: 2px;
    }
  }
}

.letter-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}

.close-hint {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.85rem;
  color: rgba(139, 119, 101, 0.6);
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
  margin-bottom: 15px;

  .letter-heart {
    font-size: 2rem;
    animation: float 3s ease-in-out infinite;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.letter-body {
  width: 100%;
  text-align: center;
  padding: 10px 0;

  .letter-text {
    font-size: 1.1rem;
    color: #8b7765;
    font-weight: 600;
    margin-bottom: 15px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .letter-message {
    font-size: 0.95rem;
    color: rgba(139, 119, 101, 0.9);
    line-height: 2;
    margin-bottom: 0;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    font-family: 'Georgia', 'Times New Roman', serif;
  }

  .letter-signature {
    font-size: 1rem;
    color: #c4a77d;
    font-weight: 600;
    margin-top: 20px;
    font-style: italic;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    font-family: 'Georgia', 'Times New Roman', serif;
  }
}

.letter-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15px;

  .letter-decoration {
    font-size: 1.5rem;
    animation: sparkle 2s ease-in-out infinite;
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
    transform: scale(1.2);
  }
}

.letter-fly-enter-active {
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.letter-fly-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.letter-fly-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);
}

.letter-fly-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.footer-decoration {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;

  .footer-sticker {
    font-size: 2rem;
    animation: bounce 2s ease-in-out infinite;
  }

  .footer-doodle {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(139, 119, 101, 0.4), transparent);
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
  .title-section {
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
    .main-message {
      font-size: 1.2rem;
    }

    .sub-message {
      font-size: 1rem;
    }
  }

  .envelope-container {
    width: 240px;
    height: 150px;
  }

  .letter {
    width: 220px;
    min-height: 200px;
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
