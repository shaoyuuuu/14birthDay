import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const memoryDir = path.join(__dirname, '../public/memory')
const contentFile = path.join(__dirname, '../所有回忆卡片内容.json')

function parseContentFile() {
  const content = fs.readFileSync(contentFile, 'utf-8')
  const data = JSON.parse(content)
  
  const memories = {}
  
  for (const memory of data.memories) {
    memories[memory.name] = {
      date: memory.date,
      title: memory.title,
      description: memory.description,
      memory: memory.memory,
      comment: memory.comment
    }
  }
  
  return memories
}

function getMemoryFolders() {
  const folders = fs.readdirSync(memoryDir).filter(item => {
    const itemPath = path.join(memoryDir, item)
    return fs.statSync(itemPath).isDirectory()
  })
  
  return folders
}

function readMemoryJson(folderName) {
  const jsonPath = path.join(memoryDir, folderName, 'memory.json')
  
  if (!fs.existsSync(jsonPath)) {
    console.warn(`警告: ${folderName} 文件夹中没有 memory.json 文件`)
    return null
  }
  
  try {
    const content = fs.readFileSync(jsonPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`错误: 无法读取 ${folderName}/memory.json:`, error.message)
    return null
  }
}

function writeMemoryJson(folderName, data) {
  const jsonPath = path.join(memoryDir, folderName, 'memory.json')
  
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`✓ 已更新 ${folderName}/memory.json`)
    return true
  } catch (error) {
    console.error(`错误: 无法写入 ${folderName}/memory.json:`, error.message)
    return false
  }
}

function findMatchingFolder(memoryName, folders) {
  const exactMatch = folders.find(f => f === memoryName)
  if (exactMatch) return exactMatch
  
  const partialMatch = folders.find(f => f.includes(memoryName) || memoryName.includes(f))
  if (partialMatch) return partialMatch
  
  return null
}

function updateMemories() {
  console.log('开始批量更新 memory.json 文件...\n')
  
  const contentMemories = parseContentFile()
  const folders = getMemoryFolders()
  
  console.log(`从内容文件中解析到 ${Object.keys(contentMemories).length} 个回忆卡片`)
  console.log(`找到 ${folders.length} 个记忆文件夹\n`)
  
  let successCount = 0
  let failCount = 0
  let notFoundCount = 0
  
  for (const [memoryName, memoryData] of Object.entries(contentMemories)) {
    const folderName = findMatchingFolder(memoryName, folders)
    
    if (!folderName) {
      console.warn(`⚠ 未找到匹配的文件夹: ${memoryName}`)
      notFoundCount++
      continue
    }
    
    const existingData = readMemoryJson(folderName)
    if (!existingData) {
      failCount++
      continue
    }
    
    const updatedData = {
      ...existingData,
      date: memoryData.date,
      title: memoryData.title,
      description: memoryData.description,
      memory: memoryData.memory,
      comment: memoryData.comment
    }
    
    if (writeMemoryJson(folderName, updatedData)) {
      successCount++
    } else {
      failCount++
    }
  }
  
  console.log('\n更新完成!')
  console.log(`成功: ${successCount} 个文件`)
  console.log(`失败: ${failCount} 个文件`)
  console.log(`未找到匹配: ${notFoundCount} 个文件`)
}

function main() {
  updateMemories()
}

main()
