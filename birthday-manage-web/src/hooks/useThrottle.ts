import { ref, watch, type Ref } from 'vue'

export function useThrottle<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const throttledValue = ref<T>(value.value)
  let lastTime = 0

  const updateThrottledValue = () => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      throttledValue.value = value.value
      lastTime = now
    }
  }

  watch(value, updateThrottledValue, { immediate: true })

  return throttledValue as Ref<T>
}
