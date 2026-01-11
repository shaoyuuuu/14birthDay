const decorTypes = {
  stickers: [
    '✨',
    '📷',
    '🌸',
    '💫',
    '🎈',
    '🎀',
    '🌟',
    '💝',
    '🍀',
    '🎵',
    '🎨',
    '🌺',
    '🦋',
    '🎪',
    '🎭',
  ],
  tapes: ['washi', 'kraft', 'transparent', 'patterned', 'glitter'],
  handDrawn: ['circle', 'star', 'heart', 'arrow', 'doodle', 'squiggle'],
  paperTextures: ['plain', 'grid', 'lined', 'dotted', 'craft', 'vintage'],
}

export const themeConfigs = {
  qiqibaba: {
    name: '日常回忆',
    colors: {
      primary: '#66bb6a',
      secondary: '#81c784',
      accent: '#aed581',
      background: '#e8f5e8',
      paper: '#f5f9f5',
    },
    animation: {
      enter: 'fadeIn',
      stagger: 0.1,
      duration: 0.8,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'dots',
      opacity: 0.1,
      stickers: ['✨', '🌸', '💫'],
      tapes: ['washi', 'transparent'],
      tapeColors: ['rgba(102, 187, 106, 0.7)', 'rgba(174, 213, 129, 0.6)'],
      handDrawn: ['circle', 'squiggle'],
      paperTexture: 'dotted',
      cornerDecor: 'rounded',
    },
    shadow: {
      intensity: 'soft',
      color: 'rgba(102, 187, 106, 0.1)',
    },
  },

  leshan: {
    name: '旅行回忆',
    colors: {
      primary: '#42a5f5',
      secondary: '#64b5f6',
      accent: '#90caf9',
      background: '#e3f2fd',
      paper: '#f0f7ff',
    },
    animation: {
      enter: 'slideInRight',
      stagger: 0.15,
      duration: 0.9,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'left',
    },
    decor: {
      pattern: 'mountains',
      opacity: 0.12,
      stickers: ['📷', '🎈', '🌟'],
      tapes: ['patterned', 'washi'],
      tapeColors: ['rgba(66, 165, 245, 0.7)', 'rgba(144, 202, 249, 0.6)'],
      handDrawn: ['arrow', 'doodle'],
      paperTexture: 'grid',
      cornerDecor: 'folded',
    },
    shadow: {
      intensity: 'medium',
      color: 'rgba(66, 165, 245, 0.12)',
    },
  },

  huajianshan: {
    name: '自然风景',
    colors: {
      primary: '#8d6e63',
      secondary: '#a1887f',
      accent: '#bcaaa4',
      background: '#efebe9',
      paper: '#faf6f4',
    },
    animation: {
      enter: 'scaleIn',
      stagger: 0.2,
      duration: 1.0,
    },
    layout: {
      imagePosition: 'center',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'trees',
      opacity: 0.08,
      stickers: ['🌺', '🍀', '🦋'],
      tapes: ['kraft', 'transparent'],
      tapeColors: ['rgba(141, 110, 99, 0.75)', 'rgba(188, 170, 164, 0.6)'],
      handDrawn: ['leaf', 'squiggle'],
      paperTexture: 'craft',
      cornerDecor: 'torn',
    },
    shadow: {
      intensity: 'strong',
      color: 'rgba(141, 110, 99, 0.15)',
    },
  },

  daerpu: {
    name: '校园回忆',
    colors: {
      primary: '#9575cd',
      secondary: '#a1887f',
      accent: '#b39ddb',
      background: '#f3e5f5',
      paper: '#faf5fc',
    },
    animation: {
      enter: 'slideInLeft',
      stagger: 0.1,
      duration: 0.8,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'left',
    },
    decor: {
      pattern: 'books',
      opacity: 0.1,
      stickers: ['🎨', '🎵', '✨'],
      tapes: ['washi', 'patterned'],
      tapeColors: ['rgba(149, 117, 205, 0.7)', 'rgba(179, 157, 219, 0.6)'],
      handDrawn: ['star', 'doodle'],
      paperTexture: 'lined',
      cornerDecor: 'rounded',
    },
    shadow: {
      intensity: 'medium',
      color: 'rgba(149, 117, 205, 0.12)',
    },
  },

  'tianfu-art-gallery': {
    name: '艺术文化',
    colors: {
      primary: '#f44336',
      secondary: '#ef5350',
      accent: '#e57373',
      background: '#ffebee',
      paper: '#fff5f5',
    },
    animation: {
      enter: 'rotateIn',
      stagger: 0.25,
      duration: 1.2,
    },
    layout: {
      imagePosition: 'center',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'art',
      opacity: 0.15,
      stickers: ['🎭', '🎪', '🌟'],
      tapes: ['glitter', 'patterned'],
      tapeColors: ['rgba(244, 67, 54, 0.7)', 'rgba(229, 115, 115, 0.6)'],
      handDrawn: ['circle', 'star', 'heart'],
      paperTexture: 'plain',
      cornerDecor: 'artistic',
    },
    shadow: {
      intensity: 'medium',
      color: 'rgba(244, 67, 54, 0.1)',
    },
  },

  niangniangshan: {
    name: '户外探险',
    colors: {
      primary: '#26a69a',
      secondary: '#26c6da',
      accent: '#4dd0e1',
      background: '#e0f7fa',
      paper: '#f0fbfc',
    },
    animation: {
      enter: 'bounceIn',
      stagger: 0.15,
      duration: 0.9,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'left',
    },
    decor: {
      pattern: 'peaks',
      opacity: 0.1,
      stickers: ['🎈', '🍀', '📷'],
      tapes: ['washi', 'transparent'],
      tapeColors: ['rgba(38, 166, 154, 0.7)', 'rgba(77, 208, 225, 0.6)'],
      handDrawn: ['arrow', 'doodle'],
      paperTexture: 'dotted',
      cornerDecor: 'folded',
    },
    shadow: {
      intensity: 'strong',
      color: 'rgba(38, 166, 154, 0.15)',
    },
  },

  datiehua: {
    name: '传统民俗',
    colors: {
      primary: '#ff7043',
      secondary: '#ff8a65',
      accent: '#ffab91',
      background: '#fff3e0',
      paper: '#fff8f0',
    },
    animation: {
      enter: 'flash',
      stagger: 0.3,
      duration: 1.0,
    },
    layout: {
      imagePosition: 'center',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'fireworks',
      opacity: 0.2,
      stickers: ['🌟', '💫', '✨'],
      tapes: ['glitter', 'patterned'],
      tapeColors: ['rgba(255, 112, 67, 0.75)', 'rgba(255, 171, 145, 0.6)'],
      handDrawn: ['star', 'circle'],
      paperTexture: 'vintage',
      cornerDecor: 'torn',
    },
    shadow: {
      intensity: 'strong',
      color: 'rgba(255, 112, 67, 0.18)',
    },
  },

  'botanical-garden': {
    name: '自然植物',
    colors: {
      primary: '#8bc34a',
      secondary: '#9ccc65',
      accent: '#aed581',
      background: '#f1f8e9',
      paper: '#f7fbf2',
    },
    animation: {
      enter: 'growIn',
      stagger: 0.1,
      duration: 0.9,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'leaves',
      opacity: 0.15,
      stickers: ['🌸', '🍀', '🌺'],
      tapes: ['washi', 'transparent'],
      tapeColors: ['rgba(139, 195, 74, 0.7)', 'rgba(174, 213, 129, 0.6)'],
      handDrawn: ['leaf', 'squiggle'],
      paperTexture: 'grid',
      cornerDecor: 'rounded',
    },
    shadow: {
      intensity: 'soft',
      color: 'rgba(139, 195, 74, 0.12)',
    },
  },

  'candlelight-dinner': {
    name: '浪漫回忆',
    colors: {
      primary: '#e91e63',
      secondary: '#ec407a',
      accent: '#f06292',
      background: '#fce4ec',
      paper: '#fef2f7',
    },
    animation: {
      enter: 'fadeInUp',
      stagger: 0.2,
      duration: 1.0,
    },
    layout: {
      imagePosition: 'center',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'hearts',
      opacity: 0.15,
      stickers: ['💝', '🌸', '✨'],
      tapes: ['washi', 'glitter'],
      tapeColors: ['rgba(233, 30, 99, 0.7)', 'rgba(240, 98, 146, 0.6)'],
      handDrawn: ['heart', 'circle'],
      paperTexture: 'plain',
      cornerDecor: 'artistic',
    },
    shadow: {
      intensity: 'soft',
      color: 'rgba(233, 30, 99, 0.1)',
    },
  },

  baihaizi: {
    name: '高山湖泊',
    colors: {
      primary: '#03a9f4',
      secondary: '#29b6f6',
      accent: '#4fc3f7',
      background: '#e1f5fe',
      paper: '#f0f9ff',
    },
    animation: {
      enter: 'slideInUp',
      stagger: 0.15,
      duration: 0.9,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'left',
    },
    decor: {
      pattern: 'waves',
      opacity: 0.1,
      stickers: ['🌟', '💫', '📷'],
      tapes: ['transparent', 'patterned'],
      tapeColors: ['rgba(3, 169, 244, 0.7)', 'rgba(79, 195, 247, 0.6)'],
      handDrawn: ['circle', 'squiggle'],
      paperTexture: 'lined',
      cornerDecor: 'folded',
    },
    shadow: {
      intensity: 'medium',
      color: 'rgba(3, 169, 244, 0.12)',
    },
  },

  aergou: {
    name: '森林探险',
    colors: {
      primary: '#43a047',
      secondary: '#66bb6a',
      accent: '#81c784',
      background: '#e8f5e8',
      paper: '#f4f9f4',
    },
    animation: {
      enter: 'rotateInDownLeft',
      stagger: 0.2,
      duration: 1.0,
    },
    layout: {
      imagePosition: 'top',
      contentAlignment: 'left',
    },
    decor: {
      pattern: 'trees',
      opacity: 0.12,
      stickers: ['🍀', '🦋', '🌺'],
      tapes: ['kraft', 'washi'],
      tapeColors: ['rgba(67, 160, 71, 0.75)', 'rgba(129, 199, 132, 0.6)'],
      handDrawn: ['leaf', 'doodle'],
      paperTexture: 'craft',
      cornerDecor: 'torn',
    },
    shadow: {
      intensity: 'strong',
      color: 'rgba(67, 160, 71, 0.15)',
    },
  },

  qingchengshan: {
    name: '山水风景',
    colors: {
      primary: '#795548',
      secondary: '#8d6e63',
      accent: '#a1887f',
      background: '#efebe9',
      paper: '#faf7f5',
    },
    animation: {
      enter: 'fadeInDown',
      stagger: 0.15,
      duration: 0.9,
    },
    layout: {
      imagePosition: 'center',
      contentAlignment: 'center',
    },
    decor: {
      pattern: 'mountains',
      opacity: 0.1,
      stickers: ['🌟', '🍀', '✨'],
      tapes: ['transparent', 'kraft'],
      tapeColors: ['rgba(121, 85, 72, 0.75)', 'rgba(161, 136, 127, 0.6)'],
      handDrawn: ['circle', 'squiggle'],
      paperTexture: 'vintage',
      cornerDecor: 'rounded',
    },
    shadow: {
      intensity: 'medium',
      color: 'rgba(121, 85, 72, 0.12)',
    },
  },
}

export const getThemeConfig = themeName => {
  return themeConfigs[themeName] || themeConfigs['qiqibaba']
}

export const getAllThemes = () => {
  return Object.keys(themeConfigs)
}
