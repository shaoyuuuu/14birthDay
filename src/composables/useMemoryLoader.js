/**
 * useMemoryLoader.js - 回忆内容加载组合式函数
 * 用于从public/memory文件夹自动读取回忆内容
 */

import { ref, onMounted } from "vue";
// 导入自动生成的图片列表数据
import memoryImages from "../data/memoryImages.json"; // eslint-disable-line import/no-unresolved

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
      // 由于public目录的特殊性，我们需要手动指定文件夹名称
      // 这里可以根据实际情况修改或扩展
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
      // 加载memory.json文件
      // 注意：需要添加base前缀，从vite.config.js中的base配置获取
      const baseUrl = import.meta.env.BASE_URL || "/";
      const jsonUrl = `${baseUrl}memory/${folderName}/memory.json`;
      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error(`加载${folderName}的memory.json失败`);
      }

      const memoryData = await response.json();

      // 手动收集该文件夹下的图片
      // 注意：这里需要根据实际情况修改图片命名规则
      // 由于我们无法在运行时直接读取public目录的文件列表
      // 所以需要约定图片的命名规则或在JSON文件中列出图片

      // 假设每个回忆文件夹下有任意数量的图片文件
      // 这里我们需要一种方式来获取图片列表
      // 由于浏览器环境的限制，我们无法直接读取服务器文件系统
      // 所以最好的方法是在memory.json文件中包含图片列表

      // 使用自动生成的图片列表
      const images = memoryImages[folderName] || [];
      memoryData.images = images.map(
        (img) => `${baseUrl}memory/${folderName}/${img}`
      );

      return {
        ...memoryData,
        folderName,
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
