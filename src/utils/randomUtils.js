/**
 * 随机工具函数 - 用于生成手账风格的随机效果
 */

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} - 随机整数
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成指定范围内的随机浮点数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {number} decimals - 小数位数
 * @returns {number} - 随机浮点数
 */
export const randomFloat = (min, max, decimals = 2) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

/**
 * 从数组中随机选择一个元素
 * @param {Array} array - 数组
 * @returns {*} - 随机元素
 */
export const randomChoice = array => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 从数组中随机选择多个元素（不重复）
 * @param {Array} array - 数组
 * @param {number} count - 选择数量
 * @returns {Array} - 随机元素数组
 */
export const randomChoices = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * 随机打乱数组
 * @param {Array} array - 数组
 * @returns {Array} - 打乱后的数组
 */
export const shuffleArray = array => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 生成随机位置
 * @param {Object} bounds - 边界 { top, right, bottom, left }
 * @returns {Object} - 位置 { top, right, bottom, left }
 */
export const randomPosition = (bounds = { top: 5, right: 5, bottom: 5, left: 5 }) => {
  const position = {}
  const positions = ['top', 'right', 'bottom', 'left']
  const selectedPositions = randomChoices(positions, randomInt(1, 2))

  selectedPositions.forEach(pos => {
    position[pos] = `${bounds[pos]}%`
  })

  return position
}

/**
 * 生成随机旋转角度
 * @param {number} maxAngle - 最大角度（绝对值）
 * @returns {number} - 随机角度
 */
export const randomRotation = (maxAngle = 15) => {
  return randomFloat(-maxAngle, maxAngle, 1)
}

/**
 * 生成随机缩放比例
 * @param {number} minScale - 最小缩放
 * @param {number} maxScale - 最大缩放
 * @returns {number} - 随机缩放比例
 */
export const randomScale = (minScale = 0.8, maxScale = 1.2) => {
  return randomFloat(minScale, maxScale, 2)
}

/**
 * 生成随机透明度
 * @param {number} minOpacity - 最小透明度
 * @param {number} maxOpacity - 最大透明度
 * @returns {number} - 随机透明度
 */
export const randomOpacity = (minOpacity = 0.3, maxOpacity = 0.8) => {
  return randomFloat(minOpacity, maxOpacity, 2)
}

/**
 * 生成随机动画延迟
 * @param {number} maxDelay - 最大延迟（秒）
 * @returns {number} - 随机延迟
 */
export const randomDelay = (maxDelay = 2) => {
  return randomFloat(0, maxDelay, 1)
}

/**
 * 生成随机颜色（基于基础色调）
 * @param {string} baseColor - 基础颜色（hex）
 * @param {number} variance - 色调变化范围
 * @returns {string} - 随机颜色
 */
export const randomColor = (baseColor, variance = 20) => {
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const newR = Math.min(255, Math.max(0, r + randomInt(-variance, variance)))
  const newG = Math.min(255, Math.max(0, g + randomInt(-variance, variance)))
  const newB = Math.min(255, Math.max(0, b + randomInt(-variance, variance)))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * 生成随机胶带样式
 * @param {Array} colors - 胶带颜色数组
 * @returns {Object} - 胶带样式对象
 */
export const randomTapeStyle = colors => {
  const tapeTypes = ['washi', 'kraft', 'transparent', 'patterned', 'glitter']
  const tapeType = randomChoice(tapeTypes)
  const color = randomChoice(colors)
  const rotation = randomRotation(8)
  const width = randomInt(40, 80)
  const opacity = randomOpacity(0.6, 0.9)

  return {
    type: tapeType,
    color,
    rotation,
    width: `${width}px`,
    opacity,
    background: `linear-gradient(135deg, ${color} 0%, ${randomColor(color, 15)} 50%, ${color} 100%)`,
  }
}

/**
 * 生成随机贴纸位置
 * @param {number} index - 贴纸索引
 * @param {number} total - 贴纸总数
 * @returns {Object} - 贴纸位置样式
 */
export const randomStickerPosition = (index, total) => {
  const positions = [
    { top: `${randomInt(3, 12)}%`, left: `${randomInt(3, 10)}%` },
    { top: `${randomInt(3, 12)}%`, right: `${randomInt(3, 10)}%` },
    { bottom: `${randomInt(25, 35)}%`, left: `${randomInt(3, 8)}%` },
    { bottom: `${randomInt(20, 30)}%`, right: `${randomInt(3, 8)}%` },
    { top: `${randomInt(40, 55)}%`, left: `${randomInt(2, 6)}%` },
    { top: `${randomInt(45, 60)}%`, right: `${randomInt(2, 6)}%` },
  ]

  const pos = positions[index % positions.length]
  return {
    ...pos,
    transform: `rotate(${randomRotation(20)}deg) scale(${randomScale(0.9, 1.3)})`,
    animationDelay: `${randomDelay(1.5)}s`,
    opacity: randomOpacity(0.5, 0.8),
  }
}

/**
 * 生成随机手绘元素样式
 * @param {string} type - 元素类型
 * @param {string} color - 主题颜色
 * @returns {Object} - 手绘元素样式
 */
export const randomHandDrawnStyle = (type, color) => {
  const positions = {
    circle: { top: `${randomInt(15, 25)}%`, left: `${randomInt(10, 20)}%` },
    star: { bottom: `${randomInt(30, 40)}%`, right: `${randomInt(10, 18)}%` },
    heart: { top: `${randomInt(35, 50)}%`, left: `${randomInt(5, 12)}%` },
    arrow: { bottom: `${randomInt(15, 25)}%`, right: `${randomInt(15, 22)}%` },
    doodle: { top: `${randomInt(20, 40)}%`, left: `${randomInt(8, 15)}%` },
    squiggle: { bottom: `${randomInt(25, 45)}%`, right: `${randomInt(8, 15)}%` },
  }

  const sizes = {
    circle: randomInt(50, 80),
    star: randomInt(35, 55),
    heart: randomInt(30, 45),
    arrow: randomInt(45, 65),
    doodle: randomInt(40, 60),
    squiggle: randomInt(35, 55),
  }

  return {
    ...positions[type],
    width: `${sizes[type]}px`,
    height: `${sizes[type]}px`,
    opacity: randomOpacity(0.25, 0.5),
    stroke: `${color}${randomInt(30, 60).toString(16).padStart(2, '0')}`,
  }
}

/**
 * 生成随机散落照片位置（优化版，使用网格系统避免重叠）
 * @param {number} index - 照片索引
 * @param {number} total - 照片总数
 * @returns {Object} - 照片位置样式
 */
/**
 * 使用极坐标系统生成避免重叠的散布位置
 * @param {number} index - 当前缩略图的索引
 * @param {number} total - 缩略图总数
 * @returns {Object} - 包含位置信息的对象
 */
export const randomScatteredPosition = (index, total = 6) => {
  const sideIndex = index % 4

  const sideCount = Math.ceil(total / 4)
  const indexOnSide = Math.floor(index / 4)

  const sideProgress = (indexOnSide + 0.5) / sideCount

  const jitter = randomFloat(-0.08, 0.08)
  const positionOnSide = Math.max(0.12, Math.min(0.88, sideProgress + jitter))

  const position = {}

  switch (sideIndex) {
    case 0:
      position.top = `${-randomFloat(22, 28)}%`
      position.left = `${positionOnSide * 100}%`
      break
    case 1:
      position.right = `${-randomFloat(14, 18)}%`
      position.top = `${positionOnSide * 100}%`
      break
    case 2:
      position.bottom = `${-randomFloat(22, 28)}%`
      position.left = `${positionOnSide * 100}%`
      break
    case 3:
      position.left = `${-randomFloat(14, 18)}%`
      position.top = `${positionOnSide * 100}%`
      break
  }

  return {
    ...position,
    zIndex: 15 + index,
  }
}

/**
 * 生成随机纸张纹理
 * @param {string} baseTexture - 基础纹理类型
 * @returns {Object} - 纸张纹理样式
 */
export const randomPaperTexture = baseTexture => {
  const textureVariations = {
    plain: [
      'radial-gradient(circle at 20% 30%, rgba(139, 119, 101, 0.03) 0%, transparent 50%)',
      'radial-gradient(circle at 80% 70%, rgba(139, 119, 101, 0.02) 0%, transparent 50%)',
    ],
    grid: [
      'linear-gradient(rgba(139, 119, 101, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 119, 101, 0.08) 1px, transparent 1px)',
      'linear-gradient(rgba(139, 119, 101, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 119, 101, 0.06) 1px, transparent 1px)',
    ],
    lined: [
      'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(139, 119, 101, 0.08) 24px, rgba(139, 119, 101, 0.08) 25px)',
      'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139, 119, 101, 0.06) 28px, rgba(139, 119, 101, 0.06) 29px)',
    ],
    dotted: [
      'radial-gradient(circle, rgba(139, 119, 101, 0.15) 1px, transparent 1px)',
      'radial-gradient(circle, rgba(139, 119, 101, 0.12) 1.5px, transparent 1.5px)',
    ],
    craft: [
      'linear-gradient(135deg, rgba(139, 119, 101, 0.05) 0%, transparent 50%)',
      'radial-gradient(circle at 30% 40%, rgba(139, 119, 101, 0.06) 0%, transparent 60%)',
    ],
    vintage: [
      'linear-gradient(45deg, rgba(139, 119, 101, 0.03) 25%, transparent 25%, transparent 75%, rgba(139, 119, 101, 0.03) 75%)',
      'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 119, 101, 0.02) 10px, rgba(139, 119, 101, 0.02) 20px)',
    ],
    subtle: [
      'radial-gradient(circle at 20% 30%, rgba(139, 119, 101, 0.02) 0%, transparent 50%)',
      'radial-gradient(circle at 80% 70%, rgba(139, 119, 101, 0.015) 0%, transparent 50%)',
    ],
  }

  const variations = textureVariations[baseTexture] || textureVariations.plain
  const selectedVariation = randomChoice(variations)

  return {
    background: selectedVariation,
    backgroundSize:
      baseTexture === 'dotted'
        ? '20px 20px'
        : baseTexture === 'grid'
          ? '20px 20px'
          : baseTexture === 'lined'
            ? '100% 25px'
            : '100% 100%',
    opacity: randomOpacity(0.2, 0.4),
  }
}

/**
 * 为主题生成随机装饰配置
 * @param {Object} themeConfig - 主题配置
 * @param {string} seed - 随机种子（基于文件夹名称）
 * @returns {Object} - 增强的随机装饰配置
 */
export const generateRandomDecorConfig = (themeConfig, seed) => {
  const seededRandom = seedStr => {
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i)
      hash = hash & hash
    }
    return () => {
      const x = Math.sin(hash++) * 10000
      return x - Math.floor(x)
    }
  }

  const random = seededRandom(seed || themeConfig.name)

  return {
    ...themeConfig.decor,
    stickers: shuffleArray(themeConfig.decor.stickers).slice(0, randomInt(3, 5)),
    tapeColors: shuffleArray(themeConfig.decor.tapeColors).slice(0, randomInt(2, 3)),
    handDrawn: shuffleArray(themeConfig.decor.handDrawn).slice(0, randomInt(2, 3)),
    paperTexture: themeConfig.decor.paperTexture,
    pattern: randomChoice(['dots', 'waves', 'leaves']),
    opacity: randomFloat(0.08, 0.15, 2),
  }
}
