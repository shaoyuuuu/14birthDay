import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 回忆文件夹路径
const memoriesPath = path.join(__dirname, "public", "memory");

// 为每个回忆生成评论的函数
function generateComment(title) {
  const comments = {
    青城山问道之旅: "青城山！",
    娘娘山云海日出: "娘娘山。",
    阿尔沟看红叶: "阿尔沟！",
    白海子徒步旅行: "白海子。",
    浪漫的烛光晚餐: "感动。",
    植物园赏花: "珍贵。",
    震撼的打铁花表演: "壮观了！",
    天府艺术馆看展: "有意思。",
    大二普草原之旅: "很开心。",
    华尖山云海日出: "景色。",
    乐山之行: "很宏伟。",
    生活中的小确幸: "最珍贵。",
  };
  return comments[title] || "这是一段美好的回忆！";
}

// 异步读取所有回忆文件夹
async function addCommentsToAllMemories() {
  try {
    const folders = await fs.readdir(memoriesPath);

    // 遍历每个文件夹
    for (const folder of folders) {
      const memoryJsonPath = path.join(memoriesPath, folder, "memory.json");

      try {
        // 检查文件是否存在
        await fs.access(memoryJsonPath);

        // 读取文件内容
        const data = await fs.readFile(memoryJsonPath, "utf8");
        const memory = JSON.parse(data);

        // 添加或更新comment字段
        memory.comment = generateComment(memory.title);

        // 写回文件
        await fs.writeFile(
          memoryJsonPath,
          JSON.stringify(memory, null, 2),
          "utf8"
        );
        console.log(`已为 ${folder}/memory.json 更新comment字段`);
      } catch (error) {
        if (error.code === "ENOENT") {
          console.log(`${folder}/memory.json 不存在，跳过`);
        } else {
          console.error(`处理 ${folder}/memory.json 失败:`, error);
        }
      }
    }
  } catch (error) {
    console.error("读取回忆文件夹失败:", error);
  }
}

// 执行函数
addCommentsToAllMemories();
