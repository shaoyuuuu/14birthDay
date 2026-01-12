import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const memoryDir = path.join(__dirname, '../public/memory')
const dataDir = path.join(__dirname, '../src/data')
const servicesDir = path.join(__dirname, '../src/services')

const themeColors = [
  { primary: '#81c784', secondary: '#66bb6a', background: 'rgba(129, 199, 132, 0.15)' },
  { primary: '#aed581', secondary: '#81c784', background: 'rgba(174, 213, 129, 0.15)' },
  { primary: '#c5e1a5', secondary: '#aed581', background: 'rgba(197, 225, 165, 0.15)' },
  { primary: '#dcedc8', secondary: '#c5e1a5', background: 'rgba(220, 237, 200, 0.15)' },
  { primary: '#e8f5e8', secondary: '#dcedc8', background: 'rgba(232, 245, 232, 0.15)' },
  { primary: '#81c784', secondary: '#aed581', background: 'rgba(129, 199, 132, 0.15)' },
  { primary: '#66bb6a', secondary: '#81c784', background: 'rgba(102, 187, 106, 0.15)' },
  { primary: '#aed581', secondary: '#c5e1a5', background: 'rgba(174, 213, 129, 0.15)' },
  { primary: '#c5e1a5', secondary: '#dcedc8', background: 'rgba(197, 225, 165, 0.15)' },
  { primary: '#dcedc8', secondary: '#e8f5e8', background: 'rgba(220, 237, 200, 0.15)' },
  { primary: '#e8f5e8', secondary: '#81c784', background: 'rgba(232, 245, 232, 0.15)' },
  { primary: '#81c784', secondary: '#c5e1a5', background: 'rgba(129, 199, 132, 0.15)' },
]

function getMemoryFolders() {
  const folders = fs.readdirSync(memoryDir).filter(item => {
    const itemPath = path.join(memoryDir, item)
    return fs.statSync(itemPath).isDirectory()
  })

  return folders.sort()
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

function getImageFiles(folderName) {
  const folderPath = path.join(memoryDir, folderName)
  const files = fs.readdirSync(folderPath).filter(file => {
    const ext = path.extname(file).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) && file !== 'memory.json'
  })

  return files
}

function generateThemeConfigs(folders) {
  const configs = {}

  folders.forEach((folder, index) => {
    const memoryData = readMemoryJson(folder)
    const colorIndex = index % themeColors.length
    const colors = themeColors[colorIndex]

    configs[folder] = {
      colors: colors,
      shadow: {
        intensity: 'medium',
        color: colors.primary,
      },
      decor: {
        pattern: index % 3 === 0 ? 'dots' : index % 3 === 1 ? 'waves' : 'leaves',
      },
    }
  })

  return configs
}

function generateMemoryImages(folders) {
  const images = {}

  folders.forEach(folder => {
    images[folder] = getImageFiles(folder)
  })

  return images
}

function generateThemeConfigsFile(configs) {
  const content = `export const themeConfigs = ${JSON.stringify(configs, null, 2)};

export const getThemeConfig = (themeName) => {
  return themeConfigs[themeName] || themeConfigs['七七八八'];
};

export const getAllThemes = () => {
  return Object.keys(themeConfigs);
};
`

  return content
}

function generateMemoryImagesFile(images) {
  const content = JSON.stringify(images, null, 2)

  return content
}

function updateApiService(folders) {
  const apiServicePath = path.join(servicesDir, 'apiService.js')

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
    console.log('✓ 已更新 apiService.js')
  } else {
    console.error('错误: 无法在 apiService.js 中找到 MEMORY_FOLDERS 数组')
  }
}

function main() {
  console.log('开始自动生成配置文件...\n')

  const folders = getMemoryFolders()
  console.log(`找到 ${folders.length} 个记忆文件夹:`)
  folders.forEach(folder => console.log(`  - ${folder}`))
  console.log('')

  const themeConfigs = generateThemeConfigs(folders)
  const memoryImages = generateMemoryImages(folders)

  const themeConfigsContent = generateThemeConfigsFile(themeConfigs)
  const memoryImagesContent = generateMemoryImagesFile(memoryImages)

  const themeConfigsPath = path.join(dataDir, 'themeConfigs.js')
  const memoryImagesPath = path.join(dataDir, 'memoryImages.json')

  fs.writeFileSync(themeConfigsPath, themeConfigsContent, 'utf-8')
  console.log('✓ 已生成 themeConfigs.js')

  fs.writeFileSync(memoryImagesPath, memoryImagesContent, 'utf-8')
  console.log('✓ 已生成 memoryImages.json')

  updateApiService(folders)

  console.log('\n配置文件生成完成！')
}

main()
