<template>
  <div class="timeline-container">
    <div class="card-wrapper" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <Transition :name="transitionName">
        <TimelineCard v-if="currentIndex < items.length" :key="currentIndex" :item="items[currentIndex]"
          :index="currentIndex" :background="getCardBackground(currentIndex)" :theme="items[currentIndex].theme"
          @image-change="handleImageChange" />
        <FinalMemoryCard v-else :key="'final'" />
      </Transition>
    </div>

    <div class="progress-bar">
      <StickFigure :progress="progressPercentage" :size="20" :comment="currentComment" :is-sliding="isSliding" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import StickFigure from './StickFigure.vue'
import TimelineCard from './TimelineCard.vue'
import FinalMemoryCard from './FinalMemoryCard.vue'
import useImagePreload from '../composables/useImagePreload'
import { getCardBackground } from '../utils/themeUtils'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: false
  },
  autoPlayInterval: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['timeline-complete'])

const currentIndex = ref(0)
const isSliding = ref(false)
const slideDirection = ref('next')
let touchStartX = 0
let autoPlayTimer = null

const ANIMATION_DURATION = 0.6
const ANIMATION_EASE = 'power2.inOut'
const SWIPE_THRESHOLD = 50
const COMPLETE_DELAY = 2000

const transitionName = computed(() => {
  return slideDirection.value === 'next' ? 'slide-next' : 'slide-prev'
})

const progressPercentage = computed(() => {
  const totalItems = props.items.length + 1
  if (totalItems <= 1) return 0
  return (currentIndex.value / (totalItems - 1)) * 100
})

const currentComment = computed(() => {
  if (currentIndex.value >= props.items.length) {
    return '未完待续...'
  }
  return props.items[currentIndex.value]?.comment || ''
})

const goToIndex = (index) => {
  const totalItems = props.items.length + 1
  if (index < 0 || index >= totalItems || isSliding.value) return

  slideDirection.value = index > currentIndex.value ? 'next' : 'prev'
  isSliding.value = true
  currentIndex.value = index

  setTimeout(() => {
    isSliding.value = false
    checkIfAllItemsViewed()
  }, ANIMATION_DURATION * 1000)
}

const nextItem = () => goToIndex(currentIndex.value + 1)
const prevItem = () => goToIndex(currentIndex.value - 1)

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const swipeDistance = touchEndX - touchStartX

  if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
    swipeDistance < 0 ? nextItem() : prevItem()
  }
}

const handleImageChange = (imgSrc, index) => {
  if (props.items[index]) {
    props.items[index].currentImage = imgSrc
  }
}

const checkIfAllItemsViewed = () => {
  const totalItems = props.items.length + 1
  if (currentIndex.value === totalItems - 1) {
    setTimeout(() => emit('timeline-complete'), COMPLETE_DELAY)
  }
}

const startAutoPlay = () => {
  if (!props.autoPlay) return

  autoPlayTimer = setInterval(() => {
    const totalItems = props.items.length + 1
    if (currentIndex.value < totalItems - 1) {
      nextItem()
    } else {
      stopAutoPlay()
    }
  }, props.autoPlayInterval)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

watch(() => props.autoPlay, (newValue) => {
  if (newValue) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
})

const { preloadImages, extractImagesFromTimeline } = useImagePreload()

onMounted(() => {
  if (props.autoPlay) {
    startAutoPlay()
  }
})
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.timeline-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: $font-family;
}

.card-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.95) rotateY(-10deg);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-60px) scale(0.95) rotateY(10deg);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-60px) scale(0.95) rotateY(10deg);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.95) rotateY(-10deg);
}

.slide-next-enter-to,
.slide-next-leave-from,
.slide-prev-enter-to,
.slide-prev-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1) rotateY(0);
}

.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 100;
  padding: $spacing-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(to top, rgba($primary-color, 0.1), rgba($secondary-color, 0.05));
  border-radius: 15px 15px 0 0;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 50%, transparent 50%, transparent 100%);
    background-size: 150px;
    animation: animateRoad 0.8s linear infinite;
    border-radius: 3px;
    box-shadow: $shadow-sm;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
    box-shadow: $shadow-md;
    border-radius: 0 0 $border-radius-md $border-radius-md;
  }
}

@keyframes animateRoad {
  0% {
    background-position: 0px;
  }

  100% {
    background-position: -150px;
  }
}

@media (max-width: $breakpoint-sm) {
  .progress-bar {
    height: 60px;
    padding: $spacing-xs;
    border-radius: 10px 10px 0 0;

    &::before {
      height: 4px;
      background-size: 100px;
      animation: animateRoad 0.6s linear infinite;
    }

    &::after {
      height: 10px;
    }
  }
}
</style>