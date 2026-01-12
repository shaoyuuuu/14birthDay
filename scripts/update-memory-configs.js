import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const memoryDir = path.join(__dirname, '../public/memory')
const srcDataDir = path.join(__dirname, '../src/data')
const publicDataDir = path.join(__dirname, '../public/data')

function getMemoryFolders() {
  const folders = fs.readdirSync(memoryDir).filter(item => {
    const itemPath = path.join(memoryDir, item)
    return fs.statSync(itemPath).isDirectory()
  })

  return folders.sort()
}

function getImageFiles(folderName) {
  const folderPath = path.join(memoryDir, folderName)
  
  if (!fs.existsSync(folderPath)) {
    console.warn(`警告: ${folderName} 文件夹不存在`)
    return []
  }

  const files = fs.readdirSync(folderPath).filter(file => {
    const ext = path.extname(file).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) && file !== 'memory.json'
  })

  return files
}

function generateMemoryImages(folders) {
  const images = {}

  folders.forEach(folder => {
    const imageFiles = getImageFiles(folder)
    images[folder] = imageFiles
    
    if (imageFiles.length > 0) {
      console.log(`  ${folder}: ${imageFiles.length} 张图片`)
    } else {
      console.warn(`  ${folder}: 没有找到图片`)
    }
  })

  return images
}

function updateMemoryImagesJson(images, outputPath) {
  const content = JSON.stringify(images, null, 2)
  fs.writeFileSync(outputPath, content, 'utf-8')
  console.log(`\n✓ 已生成 ${outputPath}`)
}

function updateApiService(folders) {
  const apiServicePath = path.join(__dirname, '../src/services/apiService.js')

  if (!fs.existsSync(apiServicePath)) {
    console.error('错误: apiService.js 文件不存在')
    return
  }

  let content = fs.readFileSync(apiServicePath, 'utf-8')

  const foldersArray = folders.map(f => `  "${f}"`).join(',\n')
  const newFoldersArray = `const MEMORY_FOLDERS = [\n${foldersArray}\n];`

  const regex = /const MEMORY_FOLDERS = \[[\s\S]*?\];/

  if (regex.test(content)) {
    content = content.replace(regex, newFoldersArray)
    fs.writeFileSync(apiServicePath, content, 'utf-8')
    console.log('✓ 已更新 apiService.js 中的 MEMORY_FOLDERS')
  } else {
    console.error('错误: 无法在 apiService.js 中找到 MEMORY_FOLDERS 数组')
  }
}

function main() {
  console.log('开始自动扫描 memory 文件夹...\n')

  const folders = getMemoryFolders()
  console.log(`找到 ${folders.length} 个记忆文件夹:`)
  folders.forEach(folder => console.log(`  - ${folder}`))
  console.log('\n扫描图片文件:')

  const memoryImages = generateMemoryImages(folders)

  const srcMemoryImagesPath = path.join(srcDataDir, 'memoryImages.json')
  const publicMemoryImagesPath = path.join(publicDataDir, 'memoryImages.json')

  updateMemoryImagesJson(memoryImages, srcMemoryImagesPath)
  updateMemoryImagesJson(memoryImages, publicMemoryImagesPath)

  updateApiService(folders)

  console.log('\n✅ 配置文件更新完成！')
  console.log('💡 提示: 现在你只需要将图片放到对应的 memory 文件夹中，然后运行此脚本即可自动更新配置。')
}

main()
