import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const memoryDir = path.join(__dirname, 'public', 'memory')

const folderMappings = {
  '七七八八': 'qiqibaba',
  '乐山': 'leshan',
  '华尖山': 'huajianshan',
  '大二普': 'daerpu',
  '天府艺术馆': 'tianfu-art-gallery',
  '娘娘山': 'niangniangshan',
  '打铁花': 'datiehua',
  '植物园': 'botanical-garden',
  '烛光晚餐': 'candlelight-dinner',
  '白海子': 'baihaizi',
  '阿尔沟': 'aergou',
  '青城山': 'qingchengshan'
}

const imageMappings = {
  '微信图片_2026-01-04_173254_818.jpg': 'memory-001.jpg',
  '微信图片_2026-01-04_173254_818 - 副本.jpg': 'memory-002.jpg',
  '微信图片_2026-01-04_173254_818 - 副本 (2).jpg': 'memory-003.jpg',
  '微信图片_2026-01-04_173319_877.jpg': 'memory-004.jpg',
  '微信图片_2026-01-04_173319_877 - 副本.jpg': 'memory-005.jpg',
  '微信图片_2026-01-04_173319_877 - 副本 - 副本.jpg': 'memory-006.jpg',
  '微信图片_2026-01-04_173319_877 - 副本 (2).jpg': 'memory-007.jpg',
  'freeimagecompression.com_DSC_3448.jpg': 'memory-001.jpg',
  'freeimagecompression.com_DSC_3522.jpg': 'memory-002.jpg',
  'freeimagecompression.com_DSC_3534.jpg': 'memory-003.jpg',
  'freeimagecompression.com_DSC_3680.jpg': 'memory-004.jpg',
  'freeimagecompression.com_DSC_3703.jpg': 'memory-005.jpg',
  'freeimagecompression.com_微信图片_20250913233803_7_3034.jpg': 'memory-006.jpg',
  'freeimagecompression.com_微信图片_2026-01-04_173254_818.jpg': 'memory-007.jpg',
  'freeimagecompression.com_微信图片_2026-01-04_173319_877.jpg': 'memory-008.jpg'
}

console.log('🚀 开始重命名文件和文件夹...\n')

const memoryImagesData = {}

Object.keys(folderMappings).forEach(chineseFolder => {
  const englishFolder = folderMappings[chineseFolder]
  const folderPath = path.join(memoryDir, chineseFolder)
  
  if (fs.existsSync(folderPath)) {
    console.log(`📁 处理文件夹: ${chineseFolder} -> ${englishFolder}`)
    
    const files = fs.readdirSync(folderPath)
    const imageFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
    
    const englishImageNames = []
    
    imageFiles.forEach(chineseFile => {
      if (imageMappings[chineseFile]) {
        const englishFile = imageMappings[chineseFile]
        const oldPath = path.join(folderPath, chineseFile)
        const newPath = path.join(folderPath, englishFile)
        
        if (fs.existsSync(newPath)) {
          console.log(`  ⚠️  跳过已存在的文件: ${englishFile}`)
        } else {
          fs.renameSync(oldPath, newPath)
          console.log(`  ✅ 重命名: ${chineseFile} -> ${englishFile}`)
        }
        
        englishImageNames.push(englishFile)
      }
    })
    
    memoryImagesData[englishFolder] = englishImageNames
    
    const newFolderPath = path.join(memoryDir, englishFolder)
    if (fs.existsSync(newFolderPath)) {
      console.log(`  ⚠️  跳过已存在的文件夹: ${englishFolder}`)
    } else {
      fs.renameSync(folderPath, newFolderPath)
      console.log(`  ✅ 重命名文件夹: ${chineseFolder} -> ${englishFolder}`)
    }
  }
})

const outputPath = path.join(__dirname, 'src', 'data', 'memoryImages.json')
fs.writeFileSync(outputPath, JSON.stringify(memoryImagesData, null, 2), 'utf-8')

console.log('\n✅ 文件和文件夹重命名完成！')
console.log('📁 已生成 memoryImages.json')
console.log(`📁 输出路径: ${outputPath}`)
console.log('\n下一步:')
console.log('1. 运行: git add .')
console.log('2. 运行: git commit -m "重命名文件为英文"')
console.log('3. 运行: git push')
