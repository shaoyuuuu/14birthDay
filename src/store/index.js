/**
 * store.js - 全局状态管理
 * 提供集中的状态管理，支持模块化和响应式更新
 */

import { reactive, computed, watch } from 'vue'

/**
 * 应用状态store
 */
const appStore = reactive({
  /**
   * 当前界面状态
   */
  currentSection: 'typewriter',

  /**
   * 加载状态
   */
  isLoading: false,

  /**
   * 错误信息
   */
  error: null,

  /**
   * 回忆数据
   */
  memories: [],

  /**
   * 当前选中的回忆
   */
  currentMemory: null,

  /**
   * 当前主题
   */
  currentTheme: null,

  /**
   * 图片预加载状态
   */
  imagesLoaded: false,

  /**
   * 图片加载进度
   */
  loadingProgress: 0,

  /**
   * 用户偏好设置
   */
  preferences: {
    autoPlay: false,
    autoPlayInterval: 5000,
    animationSpeed: 1,
    soundEnabled: false
  }
})

/**
 * 计算属性：是否有错误
 */
export const hasError = computed(() => appStore.error !== null)

/**
 * 计算属性：是否已加载
 */
export const isLoaded = computed(() => appStore.memories.length > 0)

/**
 * 计算属性：当前回忆的索引
 */
export const currentMemoryIndex = computed(() => {
  if (!appStore.currentMemory) return -1
  return appStore.memories.findIndex(m => m.folderName === appStore.currentMemory.folderName)
})

/**
 * 计算属性：是否有下一个回忆
 */
export const hasNextMemory = computed(() => {
  return currentMemoryIndex.value < appStore.memories.length - 1
})

/**
 * 计算属性：是否有上一个回忆
 */
export const hasPreviousMemory = computed(() => {
  return currentMemoryIndex.value > 0
})

/**
 * Actions - 状态修改方法
 */
export const actions = {
  /**
   * 设置当前界面
   * @param {string} section - 界面名称
   */
  setCurrentSection(section) {
    appStore.currentSection = section
  },

  /**
   * 设置加载状态
   * @param {boolean} loading - 是否加载中
   */
  setLoading(loading) {
    appStore.isLoading = loading
  },

  /**
   * 设置错误信息
   * @param {Error|null} error - 错误对象
   */
  setError(error) {
    appStore.error = error
  },

  /**
   * 清除错误
   */
  clearError() {
    appStore.error = null
  },

  /**
   * 设置回忆数据
   * @param {Array} memories - 回忆数组
   */
  setMemories(memories) {
    appStore.memories = memories
  },

  /**
   * 添加回忆
   * @param {Object} memory - 回忆对象
   */
  addMemory(memory) {
    appStore.memories.push(memory)
  },

  /**
   * 更新回忆
   * @param {string} folderName - 回忆文件夹名称
   * @param {Object} updates - 更新内容
   */
  updateMemory(folderName, updates) {
    const index = appStore.memories.findIndex(m => m.folderName === folderName)
    if (index !== -1) {
      appStore.memories[index] = { ...appStore.memories[index], ...updates }
    }
  },

  /**
   * 设置当前回忆
   * @param {Object} memory - 回忆对象
   */
  setCurrentMemory(memory) {
    appStore.currentMemory = memory
  },

  /**
   * 切换到下一个回忆
   */
  nextMemory() {
    if (hasNextMemory.value) {
      appStore.currentMemory = appStore.memories[currentMemoryIndex.value + 1]
    }
  },

  /**
   * 切换到上一个回忆
   */
  previousMemory() {
    if (hasPreviousMemory.value) {
      appStore.currentMemory = appStore.memories[currentMemoryIndex.value - 1]
    }
  },

  /**
   * 设置当前主题
   * @param {string} theme - 主题名称
   */
  setCurrentTheme(theme) {
    appStore.currentTheme = theme
  },

  /**
   * 设置图片加载状态
   * @param {boolean} loaded - 是否加载完成
   */
  setImagesLoaded(loaded) {
    appStore.imagesLoaded = loaded
  },

  /**
   * 设置图片加载进度
   * @param {number} progress - 进度值 (0-100)
   */
  setLoadingProgress(progress) {
    appStore.loadingProgress = progress
  },

  /**
   * 更新用户偏好
   * @param {Object} updates - 更新内容
   */
  updatePreferences(updates) {
    appStore.preferences = { ...appStore.preferences, ...updates }
  },

  /**
   * 重置状态
   */
  reset() {
    appStore.currentSection = 'typewriter'
    appStore.isLoading = false
    appStore.error = null
    appStore.currentMemory = null
    appStore.currentTheme = null
    appStore.imagesLoaded = false
    appStore.loadingProgress = 0
  }
}

/**
 * 持久化用户偏好到localStorage
 */
watch(
  () => appStore.preferences,
  (preferences) => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('保存用户偏好失败:', error)
    }
  },
  { deep: true }
)

/**
 * 从localStorage加载用户偏好
 */
export const loadPreferences = () => {
  try {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      const preferences = JSON.parse(saved)
      appStore.preferences = { ...appStore.preferences, ...preferences }
    }
  } catch (error) {
    console.error('加载用户偏好失败:', error)
  }
}

/**
 * 导出store
 */
export default appStore
