/**
 * useMemoryLoader.js - 回忆内容加载组合式函数
 * 用于从assets/memory文件夹自动读取回忆内容
 */

import { ref, onMounted } from "vue";

/**
 * 从assets/memory文件夹加载回忆内容
 * @returns {Object} 包含回忆列表和加载状态的对象
 */
export default function useMemoryLoader() {
  const timelineItems = ref([]);
  const isLoading = ref(true);
  const error = ref(null);

  /**
   * 加载所有回忆内容
   */
  const loadMemories = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // 导入所有memory文件夹下的json文件
      // 使用Vite的glob导入功能
      const memoryModules = import.meta.glob(
        "/src/assets/memory/**/memory.json",
        { eager: true }
      );

      // 处理每个回忆模块
      const memories = Object.entries(memoryModules).map(([path, module]) => {
        // 提取文件夹名称作为标识
        const folderName = path.split("/").slice(-2, -1)[0] || "未知回忆";

        // 返回回忆数据
        return {
          ...module.default,
          folderName,
          // 自动收集该文件夹下的所有图片
          images: [], // 图片路径将在后续处理
        };
      });

      // 静态导入所有图片
      try {
        const allImageModules = import.meta.glob(
          "/src/assets/memory/**/*.{jpg,jpeg,png,gif,webp}",
          { eager: true }
        );

        // 按日期排序
        memories.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 为每个回忆分配对应的图片
        for (const memory of memories) {
          const memoryImages = [];

          // 过滤出该回忆文件夹下的图片
          Object.entries(allImageModules).forEach(([path, module]) => {
            if (path.includes(`/memory/${memory.folderName}/`)) {
              memoryImages.push(module.default);
            }
          });

          memory.images = memoryImages;
        }
      } catch (err) {
        console.error("加载图片失败:", err);
        // 确保每个回忆都有images属性
        memories.forEach((memory) => {
          memory.images = [];
        });
      }

      timelineItems.value = memories;
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
