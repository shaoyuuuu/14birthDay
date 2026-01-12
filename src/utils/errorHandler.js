/**
 * errorHandler.js - 统一的错误处理机制
 * 提供全局错误捕获、分类处理和用户友好的错误提示
 */

/**
 * 错误类型枚举
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  RESOURCE: 'RESOURCE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * 错误类
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, originalError = null) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.originalError = originalError
    this.timestamp = new Date().toISOString()
  }
}

/**
 * 网络错误
 */
export class NetworkError extends AppError {
  constructor(message, originalError = null) {
    super(message, ErrorTypes.NETWORK, originalError)
    this.name = 'NetworkError'
  }
}

/**
 * API错误
 */
export class ApiError extends AppError {
  constructor(message, statusCode = null, originalError = null) {
    super(message, ErrorTypes.API, originalError)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

/**
 * 资源错误
 */
export class ResourceError extends AppError {
  constructor(message, resource = null, originalError = null) {
    super(message, ErrorTypes.RESOURCE, originalError)
    this.name = 'ResourceError'
    this.resource = resource
  }
}

/**
 * 验证错误
 */
export class ValidationError extends AppError {
  constructor(message, field = null, originalError = null) {
    super(message, ErrorTypes.VALIDATION, originalError)
    this.name = 'ValidationError'
    this.field = field
  }
}

/**
 * 错误处理器类
 */
class ErrorHandler {
  constructor() {
    this.errorLog = []
    this.maxLogSize = 100
    this.errorHandlers = new Map()
    this.globalErrorCallback = null
  }

  /**
   * 注册全局错误回调
   * @param {Function} callback - 错误回调函数
   */
  setGlobalErrorCallback(callback) {
    this.globalErrorCallback = callback
  }

  /**
   * 注册特定类型的错误处理器
   * @param {string} errorType - 错误类型
   * @param {Function} handler - 处理器函数
   */
  registerErrorHandler(errorType, handler) {
    this.errorHandlers.set(errorType, handler)
  }

  /**
   * 处理错误
   * @param {Error} error - 错误对象
   * @param {Object} context - 错误上下文
   */
  handleError(error, context = {}) {
    const appError = this.normalizeError(error)

    this.logError(appError, context)

    const handler = this.errorHandlers.get(appError.type) || this.defaultErrorHandler

    handler.call(this, appError, context)

    if (this.globalErrorCallback) {
      this.globalErrorCallback(appError, context)
    }
  }

  /**
   * 标准化错误对象
   * @param {*} error - 错误对象
   * @returns {AppError} 标准化的错误对象
   */
  normalizeError(error) {
    if (error instanceof AppError) {
      return error
    }

    if (error === null || error === undefined) {
      return new AppError('未知错误', ErrorTypes.UNKNOWN, null)
    }

    if (error instanceof TypeError || error instanceof ReferenceError) {
      return new AppError(error.message, ErrorTypes.UNKNOWN, error)
    }

    if (error.message && error.message.includes('Failed to fetch')) {
      return new NetworkError('网络连接失败，请检查网络设置', error)
    }

    if (error.message && error.message.includes('HTTP error')) {
      return new ApiError('API请求失败', null, error)
    }

    if (error.message && error.message.includes('加载')) {
      return new ResourceError('资源加载失败', null, error)
    }

    return new AppError(error.message || '未知错误', ErrorTypes.UNKNOWN, error)
  }

  /**
   * 记录错误
   * @param {AppError} error - 错误对象
   * @param {Object} context - 错误上下文
   */
  logError(error, context) {
    const logEntry = {
      error: {
        message: error.message,
        type: error.type,
        name: error.name,
        timestamp: error.timestamp
      },
      context,
      stack: error.stack
    }

    this.errorLog.push(logEntry)

    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift()
    }

    console.error('[ErrorHandler]', logEntry)
  }

  /**
   * 默认错误处理器
   * @param {AppError} error - 错误对象
   * @param {Object} context - 错误上下文
   */
  defaultErrorHandler(error, context) {
    const userMessage = this.getUserFriendlyMessage(error)
    console.warn('错误发生:', userMessage)
  }

  /**
   * 获取用户友好的错误消息
   * @param {AppError|Error|*} error - 错误对象
   * @returns {string} 用户友好的错误消息
   */
  getUserFriendlyMessage(error) {
    const normalizedError = this.normalizeError(error)
    
    const messages = {
      [ErrorTypes.NETWORK]: '网络连接失败，请检查您的网络设置',
      [ErrorTypes.API]: '数据加载失败，请稍后重试',
      [ErrorTypes.VALIDATION]: '输入数据有误，请检查后重试',
      [ErrorTypes.RESOURCE]: '资源加载失败，请刷新页面重试',
      [ErrorTypes.UNKNOWN]: '发生未知错误，请稍后重试'
    }

    return messages[normalizedError.type] || normalizedError.message || '发生错误，请稍后重试'
  }

  /**
   * 获取错误日志
   * @returns {Array} 错误日志数组
   */
  getErrorLog() {
    return [...this.errorLog]
  }

  /**
   * 清除错误日志
   */
  clearErrorLog() {
    this.errorLog = []
  }

  /**
   * 重试机制
   * @param {Function} fn - 需要重试的函数
   * @param {number} maxRetries - 最大重试次数
   * @param {number} delay - 重试延迟（毫秒）
   * @returns {Promise} 函数执行结果
   */
  async retry(fn, maxRetries = 3, delay = 1000) {
    let lastError

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        console.warn(`重试 ${i + 1}/${maxRetries} 失败:`, error.message)

        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        }
      }
    }

    throw lastError
  }
}

/**
 * 创建全局错误处理器实例
 */
const errorHandler = new ErrorHandler()

/**
 * 注册默认的错误处理器
 */
errorHandler.registerErrorHandler(ErrorTypes.NETWORK, (error, context) => {
  console.error('[网络错误]', error.message, context)
})

errorHandler.registerErrorHandler(ErrorTypes.API, (error, context) => {
  console.error('[API错误]', error.message, context)
})

errorHandler.registerErrorHandler(ErrorTypes.RESOURCE, (error, context) => {
  console.error('[资源错误]', error.message, context)
})

/**
 * 边界情况检查工具
 */
export const BoundaryChecks = {
  /**
   * 检查数组是否为空
   * @param {Array} arr - 数组
   * @returns {boolean} 是否为空
   */
  isEmptyArray(arr) {
    return !Array.isArray(arr) || arr.length === 0
  },

  /**
   * 检查对象是否为空
   * @param {Object} obj - 对象
   * @returns {boolean} 是否为空
   */
  isEmptyObject(obj) {
    return !obj || Object.keys(obj).length === 0
  },

  /**
   * 检查字符串是否为空
   * @param {string} str - 字符串
   * @returns {boolean} 是否为空
   */
  isEmptyString(str) {
    return !str || typeof str !== 'string' || str.trim().length === 0
  },

  /**
   * 检查值是否为null或undefined
   * @param {*} value - 值
   * @returns {boolean} 是否为null或undefined
   */
  isNullOrUndefined(value) {
    return value === null || value === undefined
  },

  /**
   * 检查是否为有效的日期
   * @param {*} date - 日期
   * @returns {boolean} 是否有效
   */
  isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime())
  },

  /**
   * 检查是否为有效的URL
   * @param {string} url - URL字符串
   * @returns {boolean} 是否有效
   */
  isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * 检查数组索引是否有效
   * @param {Array} arr - 数组
   * @param {number} index - 索引
   * @returns {boolean} 是否有效
   */
  isValidIndex(arr, index) {
    return Array.isArray(arr) && index >= 0 && index < arr.length
  }
}

/**
 * 安全执行函数
 * @param {Function} fn - 要执行的函数
 * @param {*} defaultValue - 默认返回值
 * @returns {*} 函数执行结果或默认值
 */
export function safeExecute(fn, defaultValue = null) {
  try {
    return fn()
  } catch (error) {
    errorHandler.handleError(error, { safeExecute: true })
    return defaultValue
  }
}

/**
 * 安全获取对象属性
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径
 * @param {*} defaultValue - 默认值
 * @returns {*} 属性值或默认值
 */
export function safeGet(obj, path, defaultValue = null) {
  return safeExecute(() => {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
      if (result == null) {
        return defaultValue
      }
      result = result[key]
    }

    return result !== undefined ? result : defaultValue
  }, defaultValue)
}

export default errorHandler
