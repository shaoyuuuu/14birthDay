import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { resolve, join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

const MEMORY_DIR = resolve(__dirname, 'public/memory')
const OUTPUT_DIR = resolve(__dirname, 'public/memory-optimized')
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const THUMBNAIL_WIDTH = 400
const THUMBNAIL_HEIGHT = 300
const JPEG_QUALITY = 80
const WEBP_QUALITY = 75

async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = MAX_WIDTH,
    height = MAX_HEIGHT,
    quality = WEBP_QUALITY,
    format = 'webp'
  } = options

  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    const resizeOptions = {}
    if (metadata.width > width || metadata.height > height) {
      resizeOptions.width = width
      resizeOptions.height = height
      resizeOptions.fit = 'inside'
      resizeOptions.withoutEnlargement = true
    }

    let sharpInstance = image.resize(resizeOptions)

    if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality })
    } else if (format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality })
    }

    await sharpInstance.toFile(outputPath)

    const originalSize = statSync(inputPath).size
    const optimizedSize = statSync(outputPath).size
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2)

    return {
      originalSize,
      optimizedSize,
      reduction: parseFloat(reduction)
    }
  } catch (error) {
    console.error(`优化图片失败: ${inputPath}`, error.message)
    return null
  }
}

async function processFolder(folderName) {
  const inputFolder = join(MEMORY_DIR, folderName)
  const outputFolder = join(OUTPUT_DIR, folderName)

  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder, { recursive: true })
  }

  const files = readdirSync(inputFolder)
  const imageFiles = files.filter(file => {
    const ext = extname(file).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
  })

  const results = []

  for (const file of imageFiles) {
    const inputPath = join(inputFolder, file)
    const baseName = basename(file, extname(file))

    const mainOutputPath = join(outputFolder, `${baseName}.webp`)
    const thumbnailOutputPath = join(outputFolder, `${baseName}-thumb.webp`)

    console.log(`正在处理: ${folderName}/${file}`)

    const mainResult = await optimizeImage(inputPath, mainOutputPath, {
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      quality: WEBP_QUALITY,
      format: 'webp'
    })

    const thumbResult = await optimizeImage(inputPath, thumbnailOutputPath, {
      width: THUMBNAIL_WIDTH,
      height: THUMBNAIL_HEIGHT,
      quality: 70,
      format: 'webp'
    })

    if (mainResult && thumbResult) {
      results.push({
        file,
        main: mainResult,
        thumbnail: thumbResult
      })

      console.log(`  主图: ${(mainResult.optimizedSize / 1024).toFixed(2)}KB (减少 ${mainResult.reduction}%)`)
      console.log(`  缩略图: ${(thumbResult.optimizedSize / 1024).toFixed(2)}KB (减少 ${thumbResult.reduction}%)`)
    }
  }

  return results
}

async function generateOptimizedImagesData() {
  const outputDir = resolve(__dirname, 'src/data')
  const outputFile = resolve(outputDir, 'memoryImagesOptimized.json')

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const memoryImages = {}

  if (existsSync(OUTPUT_DIR)) {
    const folders = readdirSync(OUTPUT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    folders.forEach(folderName => {
      const folderPath = join(OUTPUT_DIR, folderName)
      const files = readdirSync(folderPath)

      const mainImages = files.filter(file => file.endsWith('.webp') && !file.includes('-thumb'))
      const thumbnails = files.filter(file => file.includes('-thumb.webp'))

      memoryImages[folderName] = {
        main: mainImages,
        thumbnails: thumbnails
      }
    })
  }

  writeFileSync(outputFile, JSON.stringify(memoryImages, null, 2), 'utf-8')
  console.log('\n已生成优化后的图片数据:', outputFile)
}

async function main() {
  console.log('开始优化图片...\n')

  if (!existsSync(MEMORY_DIR)) {
    console.error('memory 目录不存在:', MEMORY_DIR)
    return
  }

  const folders = readdirSync(MEMORY_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  console.log(`找到 ${folders.length} 个文件夹\n`)

  let totalOriginalSize = 0
  let totalOptimizedSize = 0
  let totalFiles = 0

  for (const folder of folders) {
    console.log(`\n处理文件夹: ${folder}`)
    const results = await processFolder(folder)

    results.forEach(result => {
      totalOriginalSize += result.main.originalSize
      totalOptimizedSize += result.main.optimizedSize
      totalFiles++
    })
  }

  const totalReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(2)

  console.log('\n' + '='.repeat(60))
  console.log('优化完成！')
  console.log('='.repeat(60))
  console.log(`处理文件数: ${totalFiles}`)
  console.log(`原始大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`)
  console.log(`优化后大小: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`)
  console.log(`减少: ${totalReduction}%`)
  console.log(`节省空间: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB`)
  console.log('='.repeat(60))

  await generateOptimizedImagesData()
}

main().catch(console.error)
