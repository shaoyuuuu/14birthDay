<template>
  <div ref="containerRef" class="cached-image-container" :style="containerStyle">
    <img v-if="imageSrc" :src="imageSrc" :alt="alt" :class="['cached-image', imageClass]" :style="imageStyle"
      @load="handleLoad" @error="handleError" />
    <div v-if="isLoading" class="loading-placeholder"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  fitMode: {
    type: String,
    default: 'contain',
    validator: value => ['contain', 'cover', 'fill', 'auto'].includes(value)
  },
  imageClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['load', 'error'])

const containerRef = ref(null)
const imageSrc = ref('')
const isLoading = ref(true)
const containerAspectRatio = ref(null)
const imageAspectRatio = ref(null)

const containerStyle = computed(() => {
  return {}
})

const imageStyle = computed(() => {
  if (!imageAspectRatio.value || !containerAspectRatio.value) {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }
  }

  const imgRatio = imageAspectRatio.value
  const containerRatio = containerAspectRatio.value

  let objectFit = 'contain'

  switch (props.fitMode) {
    case 'cover':
      objectFit = 'cover'
      break
    case 'fill':
      objectFit = 'fill'
      break
    case 'auto':
      objectFit = imgRatio > containerRatio ? 'contain' : 'cover'
      break
    case 'contain':
    default:
      objectFit = 'contain'
      break
  }

  return {
    width: '100%',
    height: '100%',
    objectFit
  }
})

const calculateAspectRatio = (imgElement) => {
  if (imgElement && imgElement.naturalWidth && imgElement.naturalHeight) {
    return imgElement.naturalWidth / imgElement.naturalHeight
  }
  return null
}

const calculateContainerAspectRatio = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      containerAspectRatio.value = rect.width / rect.height
    }
  }
}

const handleLoad = (event) => {
  isLoading.value = false
  const img = event.target
  imageAspectRatio.value = calculateAspectRatio(img)
  emit('load', img)
}

const handleError = () => {
  isLoading.value = false
  emit('error')
}

const loadImage = () => {
  if (!props.src) {
    isLoading.value = false
    return
  }

  imageSrc.value = props.src
}

const handleResize = () => {
  calculateContainerAspectRatio()
}

watch(() => props.src, () => {
  isLoading.value = true
  loadImage()
}, { immediate: true })

onMounted(() => {
  calculateContainerAspectRatio()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.cached-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cached-image {
  display: block;
  transition: opacity 0.3s ease;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.cached-image.avatar {
  border-radius: 50%;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
