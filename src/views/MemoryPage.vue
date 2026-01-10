<template>
  <div class="memory-page">
    <LoadingScreen v-if="isLoading" :error="error" @retry="handleRetry" />

    <div v-else-if="error" class="error-state">
      <p>加载回忆失败: {{ error.message }}</p>
      <button @click="handleRetry" class="retry-button">重试</button>
    </div>

    <template v-else>
      <DynamicBackground :speed="speed" :petalCount="petalCount" />
      <Timeline :items="timelineItems" :autoPlay="autoPlay" :autoPlayInterval="autoPlayInterval"
        @timeline-complete="handleTimelineComplete" />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from '../components/LoadingScreen.vue'
import Timeline from '../components/Timeline.vue'
import useMemoryLoader from '../composables/useMemoryLoader'
import DynamicBackground from '../components/DynamicBackground.vue'
const props = defineProps({
  speed: {
    type: Number,
    default: 0.2
  },
  petalCount: {
    type: Number,
    default: 20
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

const { timelineItems, isLoading, error, loadMemories } = useMemoryLoader()

const handleTimelineComplete = () => {
  emit('timeline-complete')
}

const handleRetry = async () => {
  await loadMemories()
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/_variables' as *;

.memory-page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg,
      rgba(255, 220, 180, 0.15) 0%,
      rgba(200, 160, 120, 0.12) 50%,
      rgba(100, 80, 60, 0.18) 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }
}

.error-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 8px;
}

.retry-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }
}
</style>