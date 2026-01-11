import { themeConfigs } from '../data/themeConfigs'

const SHADOW_INTENSITY_MAP = {
  soft: '0 10px 20px',
  medium: '0 15px 30px',
  strong: '0 20px 40px'
}

const PATTERN_MAP = {
  dots: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
  waves: 'repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255, 255, 255, 0.08) 10px, rgba(255, 255, 255, 0.08) 20px)',
  leaves: 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20%22%3E%3Cpath fill=\"%23ffffff\" fill-opacity=\"0.1\" d=\"M3 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM1 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm18 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM1 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm18 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z\"%3E%3C/path%3E%3C/svg%3E")'
}

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)',
  'linear-gradient(135deg, #aed581 0%, #81c784 100%)',
  'linear-gradient(135deg, #c5e1a5 0%, #aed581 100%)',
  'linear-gradient(135deg, #dcedc8 0%, #c5e1a5 100%)',
  'linear-gradient(135deg, #e8f5e8 0%, #dcedc8 100%)'
]

export const getThemeShadow = (shadowConfig) => {
  const baseShadow = SHADOW_INTENSITY_MAP[shadowConfig.intensity] || SHADOW_INTENSITY_MAP.medium;
  const secondaryColor = shadowConfig.color.replace(/0\.\d+/, '0.08');
  return `${baseShadow} ${shadowConfig.color}, 0 5px 10px ${secondaryColor}, inset 0 1px 0 rgba(255, 255, 255, 0.9)`
}

export const getThemeBackground = (colors, decor) => {
  const pattern = PATTERN_MAP[decor.pattern] || '';
  const backgroundEnd = colors.background.replace(/\d+\.?\d*\)$/, '0.95)');
  return `${pattern}, linear-gradient(135deg, ${colors.background} 0%, ${backgroundEnd} 100%)`
}

export const getThemeClassName = (theme) => {
  return `theme-${theme.replace(/\s+/g, '-').toLowerCase()}`
}

export const getCardBackground = (index) => {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length]
}

export const enhanceTimelineItemsWithTheme = (items) => {
  const themeKeys = Object.keys(themeConfigs)
  return items.map((item, index) => ({
    ...item,
    currentImage: item.images[0] || '',
    theme: themeKeys[index % themeKeys.length] || 'qiqibaba'
  }))
}