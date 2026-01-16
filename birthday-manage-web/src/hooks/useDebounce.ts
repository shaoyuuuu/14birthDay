import { ref, watch, onUnmounted, type Ref } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const debouncedValue = ref<T>(value.value)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const updateDebouncedValue = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = value.value
    }, delay)
  }

  watch(value, updateDebouncedValue, { immediate: true })

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedValue as Ref<T>
}
