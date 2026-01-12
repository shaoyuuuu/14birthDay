# Birthday Wish 项目文档

## 项目概述

Birthday Wish 是一个基于 Vue 3 的生日祝福网页应用，通过精美的手账风格界面展示美好的回忆时光。项目采用现代化的前端技术栈，结合 3D 视觉效果、流畅的动画和优雅的交互设计，为用户创造独特的视觉体验。

### 核心特性

- ✨ **打字机效果** - 优雅的文字逐字显示动画
- 📸 **时间轴回忆** - 按时间顺序展示美好时光
- 🖼️ **图片查看器** - 支持多图切换和缩略图浏览
- 💌 **3D 信封** - 真实的 3D 信封和信件交互效果
- 🎨 **主题系统** - 多样化的主题配色和装饰
- 🌸 **动态背景** - 飘落花瓣的动态背景效果
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **自动化配置** - 一键生成所有配置文件

## 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
  - Composition API
  - Script Setup 语法
  - 异步组件懒加载

### 构建工具
- **Vite** - 下一代前端构建工具
  - 快速的冷启动
  - 即时的热模块替换
  - 优化的生产构建

### 动画库
- **GSAP** - 专业级动画库
  - 复杂的时间轴动画
  - 流畅的过渡效果
  - 3D 变换支持

### UI 组件库
- **Element Plus** - Vue 3 组件库
  - 按钮组件
  - 对话框组件
  - 消息提示组件

### 样式处理
- **SCSS** - CSS 预处理器
  - 变量系统
  - 嵌套选择器
  - 混合宏和函数

### 图片优化
- **Sharp** - 高性能图片处理库
  - WebP 格式转换
  - 缩略图生成
  - 图片压缩优化

### 代码质量
- **ESLint** - JavaScript 代码检查工具
- **Prettier** - 代码格式化工具

## 项目结构

```
birthday-wish/
├── public/                      # 静态资源目录
│   ├── data/                    # 数据文件
│   │   └── memoryImages.json    # 记忆图片列表
│   └── memory/                  # 记忆文件夹（中文命名）
│       ├── 七七八八/
│       │   ├── memory.json      # 记忆配置
│       │   └── *.jpg            # 图片文件
│       ├── 乐山/
│       ├── 华尖山/
│       └── ...
│   └── memory-optimized/        # 优化后的图片
│       └── ...
│
├── scripts/                     # 脚本目录
│   ├── generate-configs.js      # 自动化配置生成脚本
│   ├── README.md                # 脚本使用说明
│   └── CLEANUP.md               # 脚本整理说明
│
├── src/                         # 源代码目录
│   ├── assets/                  # 资源文件
│   │   └── scss/                # SCSS 样式文件
│   │       ├── _variables.scss  # SCSS 变量
│   │       ├── _themeStyles.scss # 主题样式
│   │       └── global.scss      # 全局样式
│   │
│   ├── components/              # Vue 组件
│   │   ├── BlessingModal.vue    # 祝福模态框
│   │   ├── CachedImage.vue      # 缓存图片组件
│   │   ├── DynamicBackground.vue # 动态背景
│   │   ├── FinalMemoryCard.vue  # 最终记忆卡片
│   │   ├── ImageViewer.vue      # 图片查看器
│   │   ├── LoadingScreen.vue    # 加载屏幕
│   │   ├── StickFigure.vue      # 进度条小人
│   │   ├── ThemeDecorations.vue # 主题装饰
│   │   ├── Timeline.vue         # 时间轴容器
│   │   ├── TimelineCard.vue     # 时间轴卡片
│   │   └── Typewriter.vue       # 打字机效果
│   │
│   ├── composables/             # 组合式函数
│   │   ├── useAnimation.js      # 动画逻辑
│   │   ├── useImagePreload.js   # 图片预加载
│   │   └── useMemoryLoader.js   # 记忆数据加载
│   │
│   ├── data/                    # 数据文件
│   │   ├── memoryImages.json    # 记忆图片列表
│   │   ├── memoryImagesOptimized.json # 优化图片列表
│   │   └── themeConfigs.js      # 主题配置
│   │
│   ├── services/                # 服务层
│   │   └── apiService.js        # API 服务
│   │
│   ├── store/                   # 状态管理
│   │   └── index.js             # Vuex store
│   │
│   ├── utils/                   # 工具函数
│   │   ├── errorHandler.js      # 错误处理
│   │   ├── randomUtils.js       # 随机效果生成
│   │   └── themeUtils.js        # 主题工具函数
│   │
│   ├── views/                   # 页面视图
│   │   └── MemoryPage.vue       # 记忆页面
│   │
│   ├── App.vue                  # 应用根组件
│   └── main.js                  # 应用入口
│
├── .env                         # 环境变量
├── .eslintrc.json              # ESLint 配置
├── .gitignore                  # Git 忽略文件
├── .prettierrc.json            # Prettier 配置
├── index.html                  # HTML 模板
├── optimize-images.js          # 图片优化脚本
├── package.json                # 项目配置
├── vite.config.js              # Vite 配置
└── wrangler.jsonc              # Cloudflare Workers 配置
```

## 核心组件说明

### 1. Typewriter.vue - 打字机效果组件

**功能描述**：实现逐字显示文本的打字机效果，支持多段文本换行和完成事件。

**主要特性**：
- 可配置打字速度
- 支持多段文本
- 完成后显示"开始回忆"按钮
- 光标闪烁动画
- 魔羯座装饰元素

**Props**：
- `texts`: 打字机显示的文本数组
- `speed`: 打字速度（毫秒/字符），默认 100ms

**Events**：
- `typewriter-complete`: 打字完成事件

**使用示例**：
```vue
<Typewriter 
  :texts="['亲爱的，生日快乐！', '让我们一起回顾美好时光...']"
  :speed="100"
  @typewriter-complete="handleComplete"
/>
```

### 2. Timeline.vue - 时间轴容器组件

**功能描述**：管理时间轴卡片的切换和进度显示。

**主要特性**：
- 支持自动播放
- 触摸滑动切换
- 进度条显示
- 平滑过渡动画
- 完成后显示最终卡片

**Props**：
- `items`: 时间轴项目数组
- `autoPlay`: 是否自动播放，默认 false
- `autoPlayInterval`: 自动播放间隔，默认 5000ms

**Events**：
- `timeline-complete`: 时间轴完成事件

**交互方式**：
- 点击进度条小人跳转
- 左右滑动切换卡片
- 自动播放（可选）

### 3. TimelineCard.vue - 时间轴卡片组件

**功能描述**：展示单个记忆卡片，包含图片、文字和装饰元素。

**主要特性**：
- 手账风格设计
- 主题配色系统
- 动态装饰元素
- 卡片进入动画
- 纸张纹理效果
- 胶带和贴纸装饰

**Props**：
- `index`: 卡片索引
- `item`: 记忆数据对象
- `background`: 背景渐变色
- `theme`: 主题名称

**Events**：
- `image-change`: 图片切换事件

**数据结构**：
```javascript
{
  date: "2023-03-20",
  title: "生活中的小确幸",
  description: "那些零散却温暖的日常瞬间",
  memory: "一起在公园散步喂猫...",
  images: ["image1.jpg", "image2.jpg"],
  currentImage: "image1.jpg",
  comment: "最珍贵。",
  theme: "七七八八"
}
```

### 4. ImageViewer.vue - 图片查看器组件

**功能描述**：展示主图片和缩略图，支持图片切换。

**主要特性**：
- 主图片展示
- 缩略图网格
- 自动轮播
- 图片预加载
- 贴纸装饰
- 胶带效果
- 手绘元素

**Props**：
- `images`: 图片数组
- `currentImage`: 当前显示的图片
- `theme`: 主题名称

**Events**：
- `image-change`: 图片切换事件

**响应式设计**：
- 大屏：主图片 400px，缩略图 60px
- 中屏：主图片 320px，缩略图 50px
- 小屏：主图片 280px，缩略图 45px

### 5. FinalMemoryCard.vue - 最终记忆卡片组件

**功能描述**：展示最终的记忆卡片，包含 3D 信封和祝福信件。

**主要特性**：
- 生日主题装饰
- 气球和星星动画
- 3D 信封效果
- 信件飞出动画
- 祝福文字
- 魔羯座元素

**3D 效果**：
- 信封：多面 3D 结构（前、后、左、右、底、盖）
- 信件：纸张纹理和折叠效果
- 阴影和光照效果

**交互方式**：
- 点击信封打开
- 点击信件关闭
- 平滑的过渡动画

### 6. BlessingModal.vue - 祝福模态框组件

**功能描述**：显示生日祝福的模态框。

**主要特性**：
- 遮罩层效果
- 内容进入动画
- 魔羯座装饰
- 关闭按钮

**Events**：
- `close-modal`: 关闭模态框事件

### 7. DynamicBackground.vue - 动态背景组件

**功能描述**：创建飘落花瓣的动态背景效果。

**主要特性**：
- 可配置花瓣数量
- 可配置飘落速度
- 随机花瓣位置
- 平滑动画效果

**Props**：
- `speed`: 飘落速度，默认 0.2
- `petalCount`: 花瓣数量，默认 20

### 8. ThemeDecorations.vue - 主题装饰组件

**功能描述**：根据主题配置显示装饰元素。

**主要特性**：
- 贴纸装饰
- 胶带效果
- 手绘元素
- 纸张纹理
- 随机位置和旋转

**Props**：
- `decor`: 装饰配置对象
- `colors`: 主题颜色配置

### 9. StickFigure.vue - 进度条小人组件

**功能描述**：显示时间轴进度的火柴人动画。

**主要特性**：
- 进度显示
- 滑动动画
- 评论显示
- 可配置大小

**Props**：
- `progress`: 进度百分比（0-100）
- `size`: 小人大小，默认 20
- `comment`: 评论文字
- `isSliding`: 是否在滑动

### 10. CachedImage.vue - 缓存图片组件

**功能描述**：带缓存的图片组件，支持加载状态和错误处理。

**主要特性**：
- 图片缓存
- 加载状态显示
- 错误处理
- 自适应模式

**Props**：
- `src`: 图片地址
- `alt`: 替代文本
- `imageClass`: 图片类名
- `fitMode`: 适应模式（cover/contain/auto）

**Events**：
- `load`: 图片加载完成
- `error`: 图片加载失败

## 组合式函数

### useAnimation.js - 动画逻辑

**功能描述**：封装项目中可复用的 GSAP 动画效果。

**主要函数**：
- `createCardEnterAnimation()` - 卡片进入动画
- `createImageSwitchAnimation()` - 图片切换动画
- `createEnvelopeOpenAnimation()` - 信封打开动画
- `createLetterFlyAnimation()` - 信件飞出动画

**使用示例**：
```javascript
import { createCardEnterAnimation } from '@/composables/useAnimation'

const animateCard = () => {
  const cardContent = document.querySelector('.card-content')
  createCardEnterAnimation(cardContent)
}
```

### useImagePreload.js - 图片预加载

**功能描述**：预加载图片资源，提升用户体验。

**主要函数**：
- `preloadImage()` - 预加载单张图片
- `preloadImages()` - 批量预加载图片
- `getLoadProgress()` - 获取加载进度

**使用示例**：
```javascript
import { useImagePreload } from '@/composables/useImagePreload'

const { preloadImages, getLoadProgress } = useImagePreload()

const loadImages = async () => {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg']
  await preloadImages(images, (loaded, total, percent) => {
    console.log(`加载进度: ${percent}%`)
  })
}
```

### useMemoryLoader.js - 记忆数据加载

**功能描述**：加载和管理记忆数据。

**主要功能**：
- 加载所有记忆数据
- 按日期排序
- 错误处理
- 加载状态管理

**使用示例**：
```javascript
import { useMemoryLoader } from '@/composables/useMemoryLoader'

const { timelineItems, error, loadMemories } = useMemoryLoader()

const loadData = async () => {
  await loadMemories()
  console.log(timelineItems.value)
}
```

## 工具函数

### randomUtils.js - 随机效果生成

**功能描述**：生成手账风格的随机效果。

**主要函数**：
- `randomInt(min, max)` - 生成随机整数
- `randomFloat(min, max, decimals)` - 生成随机浮点数
- `randomChoice(array)` - 从数组中随机选择一个元素
- `randomChoices(array, count)` - 从数组中随机选择多个元素
- `shuffleArray(array)` - 随机打乱数组
- `randomPosition(bounds)` - 生成随机位置
- `randomRotation(maxAngle)` - 生成随机旋转角度
- `randomScale(minScale, maxScale)` - 生成随机缩放比例
- `randomOpacity(minOpacity, maxOpacity)` - 生成随机透明度
- `randomDelay(maxDelay)` - 生成随机动画延迟
- `randomColor(baseColor, variance)` - 生成随机颜色
- `randomTapeStyle(colors)` - 生成随机胶带样式
- `randomStickerPosition(index, total)` - 生成随机贴纸位置
- `randomHandDrawnStyle(type, color)` - 生成随机手绘元素样式
- `randomScatteredPosition(index, total)` - 生成随机散落照片位置
- `randomPaperTexture(baseTexture)` - 生成随机纸张纹理
- `generateRandomDecorConfig(themeConfig, seed)` - 为主题生成随机装饰配置

**使用示例**：
```javascript
import { 
  randomInt, 
  randomChoice, 
  randomScatteredPosition 
} from '@/utils/randomUtils'

const randomIndex = randomInt(0, 10)
const randomColor = randomChoice(['red', 'blue', 'green'])
const position = randomScatteredPosition(0, 6)
```

### themeUtils.js - 主题工具函数

**功能描述**：处理主题相关的工具函数。

**主要函数**：
- `getThemeShadow(shadowConfig)` - 获取主题阴影
- `getThemeBackground(colors, decor)` - 获取主题背景
- `getThemeClassName(theme)` - 获取主题类名
- `getCardBackground(index)` - 获取卡片背景渐变
- `enhanceTimelineItemsWithTheme(items)` - 为时间轴项目添加主题

**使用示例**：
```javascript
import { 
  getThemeShadow, 
  getThemeBackground 
} from '@/utils/themeUtils'

const shadow = getThemeShadow({
  intensity: 'medium',
  color: '#81c784'
})

const background = getThemeBackground(
  { primary: '#81c784', background: 'rgba(129, 199, 132, 0.15)' },
  { pattern: 'dots' }
)
```

### errorHandler.js - 错误处理

**功能描述**：统一的错误处理机制。

**主要类**：
- `NetworkError` - 网络错误
- `ApiError` - API 错误
- `BoundaryChecks` - 边界检查

**主要函数**：
- `handleError(error, context)` - 处理错误
- `getUserFriendlyMessage(error)` - 获取用户友好的错误信息
- `setGlobalErrorCallback(callback)` - 设置全局错误回调

**使用示例**：
```javascript
import errorHandler from '@/utils/errorHandler'

try {
  await fetchData()
} catch (error) {
  errorHandler.handleError(error, { context: 'fetchData' })
  console.error(errorHandler.getUserFriendlyMessage(error))
}
```

## API 服务

### apiService.js - API 服务层

**功能描述**：封装所有 API 请求，提供统一的数据访问接口。

**主要 API**：

#### memoryApi - 记忆数据 API
- `getMemoryFolders()` - 获取所有记忆文件夹
- `getMemoryDetail(folderName)` - 获取单个记忆详情
- `getAllMemories()` - 获取所有记忆（按日期排序）
- `getMemoryImages(folderName)` - 获取记忆图片列表

#### themeApi - 主题 API
- `getThemeConfig(themeName)` - 获取单个主题配置
- `getAllThemes()` - 获取所有主题配置

#### imageApi - 图片 API
- `getImageList(folderName)` - 获取图片列表
- `preloadImage(imgSrc)` - 预加载单张图片
- `preloadImages(imgSrcs, onProgress)` - 批量预加载图片

**特性**：
- 请求缓存
- 请求/响应拦截器
- CDN 支持
- 错误处理

**使用示例**：
```javascript
import { memoryApi, themeApi, imageApi } from '@/services/apiService'

// 获取所有记忆
const memories = await memoryApi.getAllMemories()

// 获取主题配置
const theme = await themeApi.getThemeConfig('七七八八')

// 预加载图片
await imageApi.preloadImages(images, (loaded, total, percent) => {
  console.log(`加载进度: ${percent}%`)
})
```

## 主题系统

### 主题配置结构

每个主题包含以下配置：

```javascript
{
  name: "主题名称",
  colors: {
    primary: "#81c784",        // 主色调
    secondary: "#66bb6a",      // 次要色
    background: "rgba(129, 199, 132, 0.15)", // 背景色
    accent: "#4caf50"          // 强调色
  },
  shadow: {
    intensity: "medium",       // 阴影强度: soft/medium/strong
    color: "#81c784"           // 阴影颜色
  },
  decor: {
    pattern: "dots",           // 装饰图案: dots/waves/leaves
    stickers: ["🌸", "⭐", "💝"], // 贴纸
    tapeColors: ["#81c784", "#66bb6a"], // 胶带颜色
    handDrawn: ["circle", "star", "heart"], // 手绘元素
    paperTexture: "plain"      // 纸张纹理
  },
  layout: {
    contentAlignment: "left"   // 内容对齐方式
  }
}
```

### 主题配色方案

项目提供 5 种主题配色方案：

1. **绿色系** (#81c784)
2. **浅绿色** (#aed581)
3. **柔和绿** (#c5e1a5)
4. **淡绿色** (#dcedc8)
5. **极淡绿** (#e8f5e8)

### 装饰图案

- **dots** - 点状图案
- **waves** - 波浪图案
- **leaves** - 叶子图案

### 纸张纹理

- **plain** - 纯白纸张
- **grid** - 网格纸张
- **lined** - 横线纸张
- **dotted** - 点阵纸张
- **craft** - 牛皮纸纹理
- **vintage** - 复古纹理

## 数据结构

### memory.json 格式

每个记忆文件夹必须包含一个 `memory.json` 文件：

```json
{
  "date": "2023-03-20",
  "title": "生活中的小确幸",
  "description": "那些零散却温暖的日常瞬间，构成了我们最珍贵的回忆。",
  "memory": "一起在公园散步喂猫，一起看电影到深夜，一起分享一杯奶茶...这些看似平凡的小事，却是我最珍惜的时光。",
  "images": [],
  "comment": "最珍贵。"
}
```

**字段说明**：
- `date`: 日期（YYYY-MM-DD 格式）
- `title`: 标题
- `description`: 简短描述
- `memory`: 详细回忆内容
- `images`: 图片数组（可选，脚本会自动生成）
- `comment`: 评论/备注

### memoryImages.json 格式

```json
{
  "七七八八": [
    "微信图片_2026-01-04_173254_818 - 副本 (2).jpg",
    "微信图片_2026-01-04_173254_818 - 副本.jpg"
  ],
  "乐山": [
    "微信图片_2026-01-11_120504_418.jpg",
    "微信图片_2026-01-11_120520_982.jpg"
  ]
}
```

## 自动化配置

### generate-configs.js - 自动化配置生成脚本

**功能描述**：一键生成所有配置文件，无需手动编辑。

**生成的文件**：
1. `src/data/themeConfigs.js` - 主题配置
2. `src/data/memoryImages.json` - 图片列表
3. `src/services/apiService.js` 中的 `MEMORY_FOLDERS` 数组

**使用方法**：

1. 添加新的记忆文件夹：
   ```bash
   # 1. 在 public/memory 下创建新文件夹（中文命名）
   mkdir public/memory/成都美食
   
   # 2. 创建 memory.json 配置文件
   # 3. 添加图片文件
   ```

2. 运行生成脚本：
   ```bash
   npm run generate-configs
   ```

**脚本特性**：
- 自动扫描所有记忆文件夹
- 智能分配主题配色
- 自动收集图片文件
- 更新所有相关配置
- 错误处理和提示

### optimize-images.js - 图片优化脚本

**功能描述**：优化图片，生成 WebP 格式和缩略图。

**使用方法**：
```bash
npm run optimize-images
```

**优化内容**：
- 转换为 WebP 格式
- 生成缩略图（-thumb.webp）
- 图片压缩
- 保存到 `public/memory-optimized` 目录

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

### 部署到 GitHub Pages

```bash
npm run deploy
```

## 添加新的记忆

### 步骤 1：创建文件夹

在 `public/memory` 下创建新文件夹（使用中文命名）：

```bash
mkdir public/memory/成都美食
```

### 步骤 2：创建配置文件

在新文件夹中创建 `memory.json`：

```json
{
  "date": "2024-01-15",
  "title": "成都美食之旅",
  "description": "探索成都的美食文化",
  "memory": "我们品尝了火锅、串串香、担担面...每一道菜都让人回味无穷。",
  "comment": "美味！"
}
```

### 步骤 3：添加图片

将图片文件复制到文件夹中：

```bash
cp *.jpg public/memory/成都美食/
```

### 步骤 4：生成配置

运行自动化脚本：

```bash
npm run generate-configs
```

### 步骤 5：（可选）优化图片

如果需要优化图片：

```bash
npm run optimize-images
```

### 步骤 6：测试

启动开发服务器测试：

```bash
npm run dev
```

## 响应式设计

### 断点设置

- **小屏**：< 768px
- **中屏**：768px - 1024px
- **大屏**：> 1024px

### 图片尺寸

| 屏幕尺寸 | 主图片 | 缩略图 |
|---------|--------|--------|
| 小屏    | 280px  | 45px   |
| 中屏    | 320px  | 50px   |
| 大屏    | 400px  | 60px   |

### 字体大小

- **标题**：1.5rem - 2rem
- **正文**：0.9rem - 1rem
- **小字**：0.8rem

## 性能优化

### 图片优化

- 使用 WebP 格式
- 生成缩略图
- 懒加载图片
- 图片预加载

### 代码优化

- 组件懒加载
- 代码分割
- Tree shaking
- 压缩混淆

### 缓存策略

- API 请求缓存
- 图片缓存
- 静态资源缓存

## 浏览器兼容性

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 常见问题

### Q: 如何修改打字机文字？

A: 编辑 [Typewriter.vue](file:///d:/learn/BirthDay/src/components/Typewriter.vue) 组件的 `texts` prop 默认值。

### Q: 如何添加新的主题？

A: 编辑 [themeConfigs.js](file:///d:/learn/BirthDay/src/data/themeConfigs.js) 文件，添加新的主题配置。

### Q: 如何调整动画速度？

A: 编辑 [useAnimation.js](file:///d:/learn/BirthDay/src/composables/useAnimation.js) 中的动画参数。

### Q: 图片加载失败怎么办？

A: 检查图片路径是否正确，确保图片文件存在于 `public/memory` 对应的文件夹中。

### Q: 如何修改背景颜色？

A: 编辑 [MemoryPage.vue](file:///d:/learn/BirthDay/src/views/MemoryPage.vue) 中的背景渐变色。

### Q: 如何调整花瓣数量？

A: 修改 [DynamicBackground.vue](file:///d:/learn/BirthDay/src/components/DynamicBackground.vue) 组件的 `petalCount` prop。

## 技术亮点

### 1. 3D 视觉效果

- 使用 CSS 3D transforms 创建真实的 3D 信封和信件
- 多面 3D 结构（前、后、左、右、底、盖）
- 透视和阴影效果
- 平滑的 3D 动画过渡

### 2. 手账风格设计

- 纸张纹理效果
- 胶带和贴纸装饰
- 手绘元素
- 随机位置和旋转
- 温暖的色调

### 3. 流畅的动画

- GSAP 时间轴动画
- 复杂的序列动画
- 平滑的过渡效果
- 自然的交互反馈

### 4. 智能的随机系统

- 基于种子的随机数生成
- 网格化位置系统
- 避免重叠的照片布局
- 一致性随机效果

### 5. 自动化配置

- 一键生成所有配置
- 智能主题分配
- 自动图片收集
- 减少手动操作

## 项目特色

### 🎨 精美的视觉设计

- 手账风格的界面
- 丰富的装饰元素
- 优雅的配色方案
- 细致的动画效果

### 💝 温馨的情感表达

- 打字机效果
- 时间轴回忆
- 3D 信封交互
- 生日祝福主题

### 🚀 现代化的技术栈

- Vue 3 Composition API
- Vite 构建工具
- GSAP 动画库
- SCSS 样式处理

### 📱 完美的响应式设计

- 适配各种屏幕尺寸
- 流畅的触摸交互
- 优化的移动端体验

### ⚡ 优秀的性能表现

- 组件懒加载
- 图片优化
- 代码分割
- 缓存策略

## 贡献指南

### 开发流程

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 代码规范

- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 编写清晰的注释
- 保持代码简洁

### 提交信息

使用语义化的提交信息：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送 Pull Request
- 联系项目维护者

## 更新日志

### v1.0.0 (2024-01-12)

- ✨ 初始版本发布
- 🎨 手账风格界面设计
- 📸 时间轴回忆展示
- 💌 3D 信封交互效果
- 🌸 动态花瓣背景
- ⚡ 自动化配置生成
- 📱 响应式设计
- 🚀 性能优化

## 致谢

感谢所有为这个项目做出贡献的人！

特别感谢：

- Vue.js 团队
- GSAP 团队
- Element Plus 团队
- Vite 团队

---

**Happy Coding! 💝**
