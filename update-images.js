#!/usr/bin/env node

import {
  readdirSync,
  statSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

// 在ES模块中模拟__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

/**
 * 更新回忆图片数据
 * 此脚本用于在修改public/memory目录下的图片后，无需重新构建整个项目即可更新图片列表
 */
function updateMemoryImagesData() {
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
  console.log(`✅ 已更新回忆图片数据: ${outputFile}`);
  console.log(`✅ 已扫描到 ${Object.keys(memoryImages).length} 个回忆文件夹`);
  
  // 显示更新的图片列表
  Object.keys(memoryImages).forEach((folderName) => {
    console.log(`📁 ${folderName}: ${memoryImages[folderName].length} 张图片`);
  });
}

// 执行更新
updateMemoryImagesData();
