/**
 * useImagePreload.js - 图片预加载逻辑组合式函数
 * 封装项目中可复用的图片预加载功能
 */
import { ref } from 'vue'

/**
 * 图片预加载组合式函数
 */
export default function useImagePreload() {
  /**
   * 预加载图片缓存
   */
  const preloadedImages = ref({})

  /**
   * 图片尺寸缓存
   */
  const imageDimensions = ref({})

  /**
   * 加载状态管理
   */
  const imagesLoaded = ref(false)

  /**
   * 图片加载进度
   */
  const loadingProgress = ref(0)

  /**
   * 预加载单个图片
   * @param {string} imgSrc - 图片路径
   * @returns {Promise} 图片加载完成的Promise
   */
  const preloadImage = (imgSrc) => {
    // 如果图片已经预加载，直接返回
    if (preloadedImages.value[imgSrc]) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      const img = new Image()
      img.src = imgSrc
      img.onload = () => {
        // 将加载的图片添加到缓存中
        preloadedImages.value[imgSrc] = img
        // 记录图片尺寸
        imageDimensions.value[imgSrc] = {
          width: img.width,
          height: img.height
        }
        resolve()
      }
      img.onerror = () => {
        // 即使加载失败也继续
        preloadedImages.value[imgSrc] = null // 标记为加载失败
        resolve()
      }
    })
  }

  /**
   * 预加载多个图片
   * @param {string[]} imgSrcs - 图片路径数组
   * @returns {Promise} 所有图片加载完成的Promise
   */
  const preloadImages = async (imgSrcs) => {
    if (!Array.isArray(imgSrcs) || imgSrcs.length === 0) {
      imagesLoaded.value = true
      return Promise.resolve()
    }

    // 过滤掉已经预加载的图片
    const imagesToLoad = imgSrcs.filter(src => !preloadedImages.value[src])
    const totalImages = imagesToLoad.length

    if (totalImages === 0) {
      imagesLoaded.value = true
      return Promise.resolve()
    }

    imagesLoaded.value = false
    loadingProgress.value = 0

    // 并行预加载所有图片，提高性能
    const preloadPromises = imagesToLoad.map(img => preloadImage(img))

    // 跟踪加载进度
    let loadedCount = 0
    for (const promise of preloadPromises) {
      await promise
      loadedCount++
      loadingProgress.value = Math.round((loadedCount / totalImages) * 100)
    }

    imagesLoaded.value = true
    return Promise.resolve()
  }

  /**
   * 从时间轴项目中提取所有图片URL
   * @param {Array} timelineItems - 时间轴项目数组
   * @returns {string[]} 所有图片URL数组
   */
  const extractImagesFromTimeline = (timelineItems) => {
    if (!Array.isArray(timelineItems) || timelineItems.length === 0) {
      return []
    }

    // 从每个项目中提取所有图片URL
    const imageUrls = timelineItems.flatMap(item => {
      return Array.isArray(item.images) ? item.images : []
    })

    // 去重
    return [...new Set(imageUrls)]
  }

  /**
   * 检查图片是否已预加载
   * @param {string} imgSrc - 图片路径
   * @returns {boolean} 是否已预加载
   */
  const isImagePreloaded = (imgSrc) => {
    return !!preloadedImages.value[imgSrc]
  }

  /**
   * 获取图片尺寸
   * @param {string} imgSrc - 图片路径
   * @returns {Object|null} 图片尺寸对象 {width, height} 或 null
   */
  const getImageDimensions = (imgSrc) => {
    return imageDimensions.value[imgSrc] || null
  }

  /**
   * 清空预加载缓存
   */
  const clearPreloadCache = () => {
    preloadedImages.value = {}
    imageDimensions.value = {}
    imagesLoaded.value = false
    loadingProgress.value = 0
  }

  return {
    preloadedImages,
    imageDimensions,
    imagesLoaded,
    loadingProgress,
    preloadImage,
    preloadImages,
    extractImagesFromTimeline,
    isImagePreloaded,
    getImageDimensions,
    clearPreloadCache
  }
}