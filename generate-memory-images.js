import {
  readdirSync,
  statSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";

// 在ES模块中模拟__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

function generateMemoryImagesData() {
  const memoryDir = resolve(__dirname, "public/memory");
  const outputDir = resolve(__dirname, "src/data");
  const outputFile = resolve(outputDir, "memoryImages.json");

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const memoryImages = {};

  if (existsSync(memoryDir)) {
    const folders = readdirSync(memoryDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folderName) => {
      const folderPath = join(memoryDir, folderName);
      const files = readdirSync(folderPath);

      const images = files.filter((file) => {
        const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        return imageExtensions.includes(ext);
      });

      memoryImages[folderName] = images;
    });
  }

  writeFileSync(outputFile, JSON.stringify(memoryImages, null, 2), "utf-8");
  console.log("已生成回忆图片数据:", outputFile);
  console.log("已扫描到", Object.keys(memoryImages).length, "个回忆文件夹");
  console.log("图片列表:", JSON.stringify(memoryImages, null, 2));
}

generateMemoryImagesData();
