import {
  readdirSync,
  statSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { join, resolve } from "path";

/**
 * Vite插件：自动扫描public/memory目录下的图片并生成图片列表
 */
export default function memoryImagesPlugin() {
  return {
    name: "vite-plugin-memory-images",
    // 在开发服务器启动时执行
    configureServer(server) {
      generateMemoryImagesData();

      // 监听public/memory目录的变化
      server.watcher.add(resolve(__dirname, "public/memory"));
      server.watcher.on("change", (path) => {
        if (path.startsWith(resolve(__dirname, "public/memory"))) {
          generateMemoryImagesData();
        }
      });
      server.watcher.on("add", (path) => {
        if (path.startsWith(resolve(__dirname, "public/memory"))) {
          generateMemoryImagesData();
        }
      });
      server.watcher.on("unlink", (path) => {
        if (path.startsWith(resolve(__dirname, "public/memory"))) {
          generateMemoryImagesData();
        }
      });
    },
    // 在构建时执行
    buildStart() {
      generateMemoryImagesData();
    },
  };
}

/**
 * 生成回忆图片数据
 */
function generateMemoryImagesData() {
  const memoryDir = resolve(__dirname, "public/memory");
  const outputDir = resolve(__dirname, "src/data");
  const outputFile = resolve(outputDir, "memoryImages.json");

  // 确保输出目录存在
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // 图片扩展名
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  // 扫描所有回忆文件夹
  const memoryImages = {};

  if (existsSync(memoryDir)) {
    const folders = readdirSync(memoryDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folderName) => {
      const folderPath = join(memoryDir, folderName);
      const files = readdirSync(folderPath);

      // 筛选图片文件
      const images = files.filter((file) => {
        const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        return imageExtensions.includes(ext);
      });

      memoryImages[folderName] = images;
    });
  }

  // 写入JSON文件
  writeFileSync(outputFile, JSON.stringify(memoryImages, null, 2), "utf-8");
  console.log(`[vite-plugin-memory-images] 已生成回忆图片数据: ${outputFile}`);
  console.log(
    `[vite-plugin-memory-images] 已扫描到 ${
      Object.keys(memoryImages).length
    } 个回忆文件夹`
  );
}
