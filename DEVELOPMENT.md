# Birthday Wish 开发文档

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

### 代码质量
- **ESLint** - JavaScript 代码检查工具
- **Prettier** - 代码格式化工具

## 项目结构

```
birthday-wish/
├── public/                      # 静态资源目录
│   ├── config/                  # 配置文件目录
│   │   ├── images/             # 头像图片
│   │   │   ├── README.md       # 头像配置说明
│   │   │   ├── front-avatar.png # 前方头像
│   │   │   └── rear-avatar.png  # 后方头像
│   │   ├── textConfigs.json    # 文本配置
│   │   └── themeConfigs.json   # 主题配置
│   ├── memory/                  # 记忆文件夹（中文命名）
│   │   ├── 七七八八/
│   │   │   ├── memory.json     # 记忆配置
│   │   │   └── *.jpg           # 图片文件
│   │   ├── 乐山/
│   │   ├── 华尖山/
│   │   └── ...
│   └── memory-optimized/        # 优化后的图片
│       └── ...
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
│   ├── services/                # 服务层
│   │   └── apiService.js        # API 服务
│   │
│   ├── store/                   # 状态管理
│   │   └── index.js             # Vuex store
│   │
│   ├── utils/                   # 工具函数
│   │   ├── configLoader.js      # 配置加载器
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
├── DEVELOPMENT.md              # 开发文档（本文件）
├── index.html                  # HTML 模板
├── optimize-images.js          # 图片优化脚本
├── package.json                # 项目配置
└── vite.config.js              # Vite 配置
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
- 防止垂直滑动时触发水平滑动

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
- 页面居中显示
- 响应式适配

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
- 支持自定义头像

**Props**：
- `progress`: 进度百分比（0-100）
- `size`: 小人大小，默认 20
- `comment`: 评论文字
- `isSliding`: 是否在滑动
- `frontAvatar`: 前方头像路径
- `rearAvatar`: 后方头像路径

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

### configLoader.js - 配置加载器

**功能描述**：异步加载配置文件，支持错误处理和重试机制。

**主要函数**：
- `loadConfig(configPath)` - 加载单个配置文件
- `loadConfigs(configPaths)` - 批量加载配置文件

**使用示例**：
```javascript
import { loadConfig } from '@/utils/configLoader'

const loadTextConfigs = async () => {
  try {
    const configs = await loadConfig('/config/textConfigs.json')
    console.log(configs)
  } catch (error) {
    console.error('配置加载失败:', error)
  }
}
```

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

## 部署

### 部署到 GitHub Pages

1. 修改 `vite.config.js` 中的 `base` 配置：
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ...其他配置
})
```

2. 构建项目：
```bash
npm run build
```

3. 将 `dist` 目录推送到 GitHub Pages

### 部署到 Cloudflare Pages

1. 访问 https://dash.cloudflare.com/
2. 创建 Cloudflare 账户
3. 连接 GitHub 仓库
4. 自动部署

### 部署到 Vercel

1. 访问 https://vercel.com/
2. 使用 GitHub 账户登录
3. 导入你的仓库
4. 自动部署

## 性能优化

### 图片优化

运行图片优化脚本：
```bash
npm run optimize-images
```

此脚本会：
- 将所有图片转换为 WebP 格式（减少 60-80% 文件大小）
- 生成缩略图版本（400x300）
- 优化图片质量（主图 75%，缩略图 70%）
- 限制最大尺寸（1920x1080）

### 代码分割

项目已配置代码分割：
- 路由级别的懒加载
- 组件级别的异步加载
- 第三方库的按需引入

### 缓存策略

- 使用 Service Worker 缓存静态资源
- 图片预加载机制
- 配置文件缓存

## 常见问题

### Q: 如何添加新的记忆？

A: 请参考 [配置文档](/public/CONFIGURATION.md) 中的"添加新的记忆"章节。

### Q: 如何修改主题配色？

A: 请参考 [配置文档](/public/CONFIGURATION.md) 中的"主题配置"章节。

### Q: 如何自定义打字机文字？

A: 请参考 [配置文档](/public/CONFIGURATION.md) 中的"文本配置"章节。

### Q: 图片加载慢怎么办？

A: 运行 `npm run optimize-images` 优化图片，或部署到 Cloudflare Pages/Vercel 等 CDN 平台。

### Q: 如何修改火柴人头像？

A: 请参考 [配置文档](/public/CONFIGURATION.md) 中的"火柴人头像配置"章节。

## 技术支持

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 在线讨论

## 许可证

MIT License
