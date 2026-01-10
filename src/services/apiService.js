/**
 * apiService.js - 统一的API服务层
 * 集中管理所有数据请求，提供统一的错误处理和状态管理
 */

import errorHandler, {
  NetworkError,
  ApiError,
  BoundaryChecks,
} from "../utils/errorHandler";

/**
 * API服务类
 */
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.BASE_URL || "/";
    this.requestCache = new Map();
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * 添加请求拦截器
   * @param {Function} interceptor - 拦截器函数
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 添加响应拦截器
   * @param {Function} interceptor - 拦截器函数
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * 执行请求拦截器
   * @param {Object} config - 请求配置
   * @returns {Object} 处理后的请求配置
   */
  async executeRequestInterceptors(config) {
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    return processedConfig;
  }

  /**
   * 执行响应拦截器
   * @param {*} response - 响应数据
   * @returns {*} 处理后的响应数据
   */
  async executeResponseInterceptors(response) {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  /**
   * 构建完整URL
   * @param {string} path - 路径
   * @returns {string} 完整URL
   */
  buildUrl(path) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${this.baseURL}${path}`;
  }

  /**
   * 通用请求方法
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求Promise
   */
  async request(url, options = {}) {
    const cacheKey = `${options.method || "GET"}:${url}`;

    if (options.cache !== false && this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey);
    }

    try {
      const fullUrl = this.buildUrl(url);
      const config = {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const processedConfig = await this.executeRequestInterceptors(config);

      const response = await fetch(fullUrl, processedConfig);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      const processedData = await this.executeResponseInterceptors(data);

      if (options.cache !== false) {
        this.requestCache.set(cacheKey, Promise.resolve(processedData));
      }

      return processedData;
    } catch (error) {
      if (error instanceof ApiError) {
        errorHandler.handleError(error, { url, options });
        throw error;
      }
      errorHandler.handleError(new NetworkError(error.message, error), {
        url,
        options,
      });
      throw error;
    }
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求Promise
   */
  get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {*} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求Promise
   */
  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 清除缓存
   * @param {string} key - 缓存键，不传则清除所有缓存
   */
  clearCache(key) {
    if (key) {
      this.requestCache.delete(key);
    } else {
      this.requestCache.clear();
    }
  }
}

/**
 * 创建API服务实例
 */
const apiService = new ApiService();

/**
 * 添加默认的请求拦截器
 */
apiService.addRequestInterceptor(async (config) => {
  console.log(`发起请求: ${config.method} ${config.url}`);
  return config;
});

/**
 * 添加默认的响应拦截器
 */
apiService.addResponseInterceptor(async (data) => {
  console.log("收到响应数据:", data);
  return data;
});

/**
 * 回忆数据API
 */
export const memoryApi = {
  /**
   * 获取所有回忆文件夹名称
   * @returns {Promise<string[]>} 回忆文件夹名称列表
   */
  async getMemoryFolders() {
    const folders = [
      "七七八八",
      "乐山",
      "华尖山",
      "大二普",
      "天府艺术馆",
      "娘娘山",
      "打铁花",
      "植物园",
      "烛光晚餐",
      "白海子",
      "阿尔沟",
      "青城山",
    ];
    return folders;
  },

  /**
   * 获取单个回忆的详细信息
   * @param {string} folderName - 回忆文件夹名称
   * @returns {Promise<Object>} 回忆详细信息
   */
  async getMemoryDetail(folderName) {
    try {
      const jsonUrl = `memory/${folderName}/memory.json`;
      const memoryData = await apiService.get(jsonUrl);
      return memoryData;
    } catch (error) {
      console.error(`加载回忆${folderName}失败:`, error);
      throw new Error(`加载回忆${folderName}失败: ${error.message}`);
    }
  },

  /**
   * 获取所有回忆内容
   * @returns {Promise<Array>} 所有回忆内容数组
   */
  async getAllMemories() {
    try {
      const folders = await this.getMemoryFolders();
      const memoryPromises = folders.map((folder) =>
        this.getMemoryDetail(folder)
      );
      const memoryResults = await Promise.all(memoryPromises);

      const validMemories = memoryResults.filter((memory) => memory !== null);

      validMemories.sort((a, b) => new Date(a.date) - new Date(b.date));

      return validMemories;
    } catch (error) {
      console.error("加载所有回忆失败:", error);
      throw error;
    }
  },

  /**
   * 获取回忆的图片列表
   * @param {string} folderName - 回忆文件夹名称
   * @returns {Promise<Array>} 图片URL数组
   */
  async getMemoryImages(folderName) {
    try {
      const memoryImages = await import("../data/memoryImages.json");
      const imageNames = memoryImages.default[folderName] || [];
      const baseUrl = import.meta.env.BASE_URL || "/";
      const cdnEnabled = import.meta.env.VITE_CDN_ENABLED === 'true';
      const cdnUrl = import.meta.env.VITE_CDN_URL || '';

      if (cdnEnabled && cdnUrl) {
        return imageNames.map((img) => `${cdnUrl}/memory/${folderName}/${img}`);
      }

      return imageNames.map((img) => `${baseUrl}memory/${folderName}/${img}`);
    } catch (error) {
      console.error(`获取回忆${folderName}的图片失败:`, error);
      throw error;
    }
  },
};

/**
 * 主题配置API
 */
export const themeApi = {
  /**
   * 获取主题配置
   * @param {string} themeName - 主题名称
   * @returns {Promise<Object>} 主题配置
   */
  async getThemeConfig(themeName) {
    try {
      const themeData = await import("../data/themeConfigs.js");
      const config = themeData.getThemeConfig(themeName);
      return config;
    } catch (error) {
      console.error(`获取主题${themeName}配置失败:`, error);
      throw error;
    }
  },

  /**
   * 获取所有主题配置
   * @returns {Promise<Object>} 所有主题配置
   */
  async getAllThemes() {
    try {
      const themeData = await import("../data/themeConfigs.js");
      const themes = themeData.getAllThemes();
      return themes;
    } catch (error) {
      console.error("获取所有主题配置失败:", error);
      throw error;
    }
  },
};

/**
 * 图片资源API
 */
export const imageApi = {
  /**
   * 获取图片列表
   * @param {string} folderName - 回忆文件夹名称
   * @returns {Promise<Array>} 图片URL数组
   */
  async getImageList(folderName) {
    try {
      const memoryImages = await import("../data/memoryImages.json");
      const images = memoryImages.default[folderName] || [];
      const baseUrl = import.meta.env.BASE_URL || "/";
      return images.map((img) => `${baseUrl}memory/${folderName}/${img}`);
    } catch (error) {
      console.error(`获取${folderName}的图片列表失败:`, error);
      throw error;
    }
  },

  /**
   * 预加载图片
   * @param {string} imgSrc - 图片URL
   * @returns {Promise<HTMLImageElement>} 加载完成的图片元素
   */
  async preloadImage(imgSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`图片加载失败: ${imgSrc}`));
    });
  },

  /**
   * 批量预加载图片
   * @param {Array} imgSrcs - 图片URL数组
   * @param {Function} onProgress - 进度回调函数
   * @returns {Promise<Array>} 加载完成的图片元素数组
   */
  async preloadImages(imgSrcs, onProgress) {
    if (!Array.isArray(imgSrcs) || imgSrcs.length === 0) {
      return [];
    }

    const total = imgSrcs.length;
    let loaded = 0;
    const results = [];

    for (const imgSrc of imgSrcs) {
      try {
        const img = await this.preloadImage(imgSrc);
        results.push(img);
      } catch (error) {
        console.error(`图片加载失败: ${imgSrc}`, error);
        results.push(null);
      }

      loaded++;
      if (onProgress) {
        onProgress(loaded, total, Math.round((loaded / total) * 100));
      }
    }

    return results;
  },
};

/**
 * 统一的API导出
 */
export default apiService;
