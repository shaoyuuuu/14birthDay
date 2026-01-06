import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 回忆文件夹路径
const memoriesPath = path.join(__dirname, 'public', 'memory');

async function getAllTitles() {
  try {
    const folders = await fs.readdir(memoriesPath);
    const titles = {};
    
    // 遍历每个文件夹
    for (const folder of folders) {
      const memoryJsonPath = path.join(memoriesPath, folder, 'memory.json');
      
      try {
        // 检查文件是否存在
        await fs.access(memoryJsonPath);
        
        // 读取文件内容
        const data = await fs.readFile(memoryJsonPath, 'utf8');
        const memory = JSON.parse(data);
        
        // 存储文件夹名和对应的title
        titles[folder] = memory.title;
      } catch (error) {
        console.error(`处理 ${folder}/memory.json 失败:`, error);
      }
    }
    
    console.log('所有memory.json文件的标题:');
    console.log(JSON.stringify(titles, null, 2));
  } catch (error) {
    console.error('读取回忆文件夹失败:', error);
  }
}

// 执行函数
getAllTitles();
