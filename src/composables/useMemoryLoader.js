/**
 * useMemoryLoader.js - 回忆内容加载组合式函数
 * 用于从public/memory文件夹自动读取回忆内容
 */

import { ref, onMounted } from "vue";
import { memoryApi } from "../services/apiService";

/**
 * 从public/memory文件夹加载回忆内容
 * @returns {Object} 包含回忆列表和加载状态的对象
 */
export default function useMemoryLoader() {
  const timelineItems = ref([]);
  const isLoading = ref(true);
  const error = ref(null);

  /**
   * 获取public/memory目录下的所有回忆文件夹
   * @returns {Promise<string[]>} 回忆文件夹名称列表
   */
  const getMemoryFolders = async () => {
    try {
      return await memoryApi.getMemoryFolders();
    } catch (err) {
      console.error("获取回忆文件夹列表失败:", err);
      return [];
    }
  };

  /**
   * 加载单个回忆的详细信息
   * @param {string} folderName 回忆文件夹名称
   * @returns {Promise<Object|null>} 回忆详细信息或null
   */
  const loadMemoryDetail = async (folderName) => {
    try {
      const memoryData = await memoryApi.getMemoryDetail(folderName);
      const images = await memoryApi.getMemoryImages(folderName);

      return {
        ...memoryData,
        folderName,
        images,
        currentImage: images.length > 0 ? images[0] : null,
        theme: folderName // 直接使用文件夹名称作为主题名称
      };
    } catch (err) {
      console.error(`加载回忆${folderName}失败:`, err);
      return null;
    }
  };

  /**
   * 加载所有回忆内容
   */
  const loadMemories = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // 获取所有回忆文件夹
      const folders = await getMemoryFolders();

      // 加载每个回忆的详细信息
      const memoryPromises = folders.map((folder) => loadMemoryDetail(folder));
      const memoryResults = await Promise.all(memoryPromises);

      // 过滤掉加载失败的回忆
      const validMemories = memoryResults.filter((memory) => memory !== null);

      // 按日期排序
      validMemories.sort((a, b) => new Date(a.date) - new Date(b.date));

      timelineItems.value = validMemories;
    } catch (err) {
      console.error("加载回忆内容失败:", err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  // 组件挂载时加载回忆内容
  onMounted(() => {
    loadMemories();
  });

  return {
    timelineItems,
    isLoading,
    error,
    loadMemories,
  };
}
