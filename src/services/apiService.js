import errorHandler, {
  NetworkError,
  ApiError,
  BoundaryChecks,
} from "../utils/errorHandler";

const MEMORY_FOLDERS = [
  "七七八八",
  "万象城",
  "乐山",
  "做戒指",
  "华尖山",
  "大二普",
  "天府艺术馆",
  "娘娘山",
  "打铁花",
  "未始的旅途-郎卡雪山",
  "植物园",
  "烛光晚餐",
  "白海子",
  "阿尔沟",
  "青城山"
];

const isCdnEnabled = () => {
  return import.meta.env.VITE_CDN_ENABLED === 'true' && import.meta.env.VITE_CDN_URL;
};

const buildImageUrl = (folderName, imageName) => {
  const baseUrl = import.meta.env.BASE_URL || "/";
  
  if (isCdnEnabled()) {
    return `${import.meta.env.VITE_CDN_URL}/memory/${folderName}/${imageName}`;
  }
  
  return `${baseUrl}memory/${folderName}/${imageName}`;
};

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.BASE_URL || "/";
    this.requestCache = new Map();
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async executeRequestInterceptors(config) {
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    return processedConfig;
  }

  async executeResponseInterceptors(response) {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  buildUrl(path) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${this.baseURL}${path}`;
  }

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

  get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  }

  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  clearCache(key) {
    if (key) {
      this.requestCache.delete(key);
    } else {
      this.requestCache.clear();
    }
  }
}

const apiService = new ApiService();

apiService.addRequestInterceptor(async (config) => {
  return config;
});

apiService.addResponseInterceptor(async (data) => {
  return data;
});

export const memoryApi = {
  async getMemoryFolders() {
    return [...MEMORY_FOLDERS];
  },

  async getMemoryDetail(folderName) {
    const jsonUrl = `memory/${folderName}/memory.json`;
    return apiService.get(jsonUrl);
  },

  async getAllMemories() {
    const folders = await this.getMemoryFolders();
    const memoryPromises = folders.map((folder) =>
      this.getMemoryDetail(folder)
    );
    const memoryResults = await Promise.all(memoryPromises);

    const validMemories = memoryResults.filter((memory) => memory != null);

    return validMemories.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  async getMemoryImages(folderName) {
    try {
      const memoryImages = await import("../data/memoryImages.json");
      const imageNames = memoryImages.default[folderName] || [];
      return imageNames.map((img) => buildImageUrl(folderName, img));
    } catch (error) {
      errorHandler.handleError(new NetworkError(`获取回忆${folderName}的图片失败`, error));
      throw error;
    }
  },
};

export const themeApi = {
  async getThemeConfig(themeName) {
    try {
      const themeData = await import("../data/themeConfigs.js");
      return themeData.getThemeConfig(themeName);
    } catch (error) {
      errorHandler.handleError(new NetworkError(`获取主题${themeName}配置失败`, error));
      throw error;
    }
  },

  async getAllThemes() {
    try {
      const themeData = await import("../data/themeConfigs.js");
      return themeData.getAllThemes();
    } catch (error) {
      errorHandler.handleError(new NetworkError("获取所有主题配置失败", error));
      throw error;
    }
  },
};

export const imageApi = {
  async getImageList(folderName) {
    try {
      const memoryImages = await import("../data/memoryImages.json");
      const images = memoryImages.default[folderName] || [];
      return images.map((img) => buildImageUrl(folderName, img));
    } catch (error) {
      errorHandler.handleError(new NetworkError(`获取${folderName}的图片列表失败`, error));
      throw error;
    }
  },

  async preloadImage(imgSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`图片加载失败: ${imgSrc}`));
    });
  },

  async preloadImages(imgSrcs, onProgress) {
    if (!Array.isArray(imgSrcs) || imgSrcs.length === 0) {
      return [];
    }

    const total = imgSrcs.length;
    const results = [];

    for (let i = 0; i < imgSrcs.length; i++) {
      const imgSrc = imgSrcs[i];
      try {
        const img = await this.preloadImage(imgSrc);
        results.push(img);
      } catch (error) {
        console.error(`图片加载失败: ${imgSrc}`, error);
        results.push(null);
      }

      if (onProgress) {
        onProgress(i + 1, total, Math.round(((i + 1) / total) * 100));
      }
    }

    return results;
  },
};

export default apiService;
