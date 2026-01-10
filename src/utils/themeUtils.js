/**
 * 主题工具函数 - 处理主题配置和动态样式生成
 */
import { themeConfigs } from '../data/themeConfigs'

/**
 * 根据主题配置获取阴影样式
 * @param {Object} shadowConfig - 阴影配置对象
 * @returns {string} - CSS阴影样式字符串
 */
export const getThemeShadow = (shadowConfig) => {
  const intensityMap = {
    soft: '0 10px 20px',
    medium: '0 15px 30px',
    strong: '0 20px 40px'
  }
  return `${intensityMap[shadowConfig.intensity]} ${shadowConfig.color}, 0 5px 10px ${shadowConfig.color.replace(/0\.\d+/, '0.08')}, inset 0 1px 0 rgba(255, 255, 255, 0.9)`
}

/**
 * 根据主题配置获取背景样式
 * @param {Object} colors - 颜色配置对象
 * @param {Object} decor - 装饰配置对象
 * @returns {string} - CSS背景样式字符串
 */
export const getThemeBackground = (colors, decor) => {
  const patterns = {
    dots: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    waves: 'repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255, 255, 255, 0.08) 10px, rgba(255, 255, 255, 0.08) 20px)',
    leaves: 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20%22%3E%3Cpath fill=\"%23ffffff\" fill-opacity=\"0.1\" d=\"M3 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM1 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm18 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM1 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm18 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z\"%3E%3C/path%3E%3C/svg%3E")'
  }

  return `${patterns[decor.pattern] || ''}, linear-gradient(135deg, ${colors.background} 0%, ${colors.background.replace(/\d+\.?\d*\)$/, '0.95)')} 100%)`
}

/**
 * 根据主题获取主题类名
 * @param {string} theme - 主题名称
 * @returns {string} - 格式化后的主题类名
 */
export const getThemeClassName = (theme) => {
  return `theme-${theme.replace(/\s+/g, '-').toLowerCase()}`
}

/**
 * 获取卡片背景渐变
 * @param {number} index - 卡片索引
 * @returns {string} - CSS渐变背景
 */
export const getCardBackground = (index) => {
  // 与SCSS变量保持一致的绿色主题渐变
  const gradients = [
    'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)', // 与$primary-gradient一致
    'linear-gradient(135deg, #aed581 0%, #81c784 100%)', // 与$accent-color和$secondary-color一致
    'linear-gradient(135deg, #c5e1a5 0%, #aed581 100%)',
    'linear-gradient(135deg, #dcedc8 0%, #c5e1a5 100%)',
    'linear-gradient(135deg, #e8f5e8 0%, #dcedc8 100%)'  // 与$background-accent一致
  ]
  return gradients[index % gradients.length]
}

/**
 * 为时间线项添加主题信息
 * @param {Array} items - 原始时间线项数组
 * @returns {Array} - 添加了主题信息的时间线项数组
 */
export const enhanceTimelineItemsWithTheme = (items) => {
  const themeKeys = Object.keys(themeConfigs)
  return items.map((item, index) => ({
    ...item,
    currentImage: item.images[0] || '',
    theme: themeKeys[index % themeKeys.length] || '七七八八'
  }))
}