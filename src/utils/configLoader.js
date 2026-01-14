import { ref } from 'vue'

const textConfigs = ref(null)
const themeConfigs = ref(null)

export async function loadTextConfigs() {
  try {
    const response = await fetch('/config/textConfigs.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    textConfigs.value = await response.json()
    return textConfigs.value
  } catch (error) {
    console.error('Failed to load text configs:', error)
    throw error
  }
}

export async function loadThemeConfigs() {
  try {
    const response = await fetch('/config/themeConfigs.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    themeConfigs.value = await response.json()
    return themeConfigs.value
  } catch (error) {
    console.error('Failed to load theme configs:', error)
    throw error
  }
}

export function getTextConfigs() {
  return textConfigs.value
}

export function getThemeConfigs() {
  return themeConfigs.value
}

const DEFAULT_THEME = {
  colors: {
    primary: '#ff8a65',
    secondary: '#ffab91',
    background: 'rgba(255, 138, 101, 0.15)',
    accent: '#ff7043',
    pageBackground: 'linear-gradient(135deg, rgba(255, 171, 145, 0.35) 0%, rgba(255, 224, 178, 0.25) 50%, rgba(255, 138, 101, 0.3) 100%)'
  },
  shadow: {
    intensity: 'medium',
    color: '#ff8a65'
  },
  decor: {
    pattern: 'dots',
    paperTexture: 'warm',
    stickers: ['🍵', '🎬', '🎮', '🌟', '💕'],
    handDrawn: ['heart', 'star', 'wave'],
    cornerDecor: 'rounded'
  },
  layout: {
    contentAlignment: 'left'
  }
}

export function getThemeConfig(themeName) {
  if (!themeConfigs.value) {
    console.warn('Theme configs not loaded yet, using default theme')
    return DEFAULT_THEME
  }
  return themeConfigs.value[themeName] || themeConfigs.value['七七八八'] || DEFAULT_THEME
}

export function getAllThemes() {
  if (!themeConfigs.value) {
    console.warn('Theme configs not loaded yet')
    return []
  }
  return Object.keys(themeConfigs.value)
}