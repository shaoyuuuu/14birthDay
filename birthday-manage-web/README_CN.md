# Birthday Wish 管理后台

生日祝福应用的管理后台，用于管理访问统计、用户留言和回忆内容。

## 项目简介

birthday-manage-web 是一个基于 Vue 3 + TypeScript 的现代化管理后台系统，为 Birthday Wish 应用提供完整的数据管理功能。系统采用响应式设计，完美支持移动端和 PC 端访问。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 官方状态管理库
- **Axios** - HTTP 客户端

## 功能特性

### 认证系统
- 管理员注册
- 管理员登录
- JWT 令牌认证
- 自动令牌刷新
- 路由权限控制

### 访问统计
- 实时访问量统计
- 最近 30 天访问趋势
- 独立访客数量统计
- 每日访问量图表展示
- 热门页面排行榜
- 详细访问记录列表

### 留言管理
- 查看所有用户留言
- 留言详情查看
- 删除不当留言
- 留言时间排序

### 回忆管理
- 添加新的回忆
- 编辑已有回忆
- 删除回忆记录
- 回忆图片展示
- 回忆列表网格布局

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 在 `.env` 文件中配置后端 API 地址：
```env
VITE_API_URL=http://localhost:3000/api
```

### 开发模式

启动开发服务器：
```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

构建生产版本：
```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

预览生产构建：
```bash
npm run preview
```

## 项目结构

```
birthday-manage-web/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 资源文件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── .env.example        # 环境变量示例
├── index.html          # HTML 模板
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 页面说明

### 登录页面 (`/login`)
- 管理员登录表单
- 用户名和密码验证
- 记住登录状态
- 跳转到注册页面

### 注册页面 (`/register`)
- 新管理员注册表单
- 用户名、密码、确认密码
- 表单验证
- 跳转到登录页面

### 仪表板首页 (`/`)
- 访问统计概览
- 快速导航到各功能模块
- 响应式布局

### 访问统计页面 (`/visits`)
- 总访问量展示
- 最近 30 天访问量
- 独立访客统计
- 每日访问量图表
- 热门页面排行
- 访问记录列表

### 留言管理页面 (`/messages`)
- 留言卡片列表
- 留言详情查看
- 删除留言功能
- 空状态提示

### 回忆管理页面 (`/memories`)
- 回忆网格展示
- 添加回忆表单
- 编辑回忆功能
- 删除回忆功能
- 图片预览

## 响应式设计

管理后台完全支持移动端和 PC 端自适应，在以下设备上均有良好体验：

- **桌面端** (>= 1024px)
  - 多列布局
  - 完整功能展示
  - 悬停效果

- **平板端** (768px - 1023px)
  - 自适应网格布局
  - 优化的触摸交互
  - 折叠菜单

- **移动端** (< 768px)
  - 单列布局
  - 大触摸目标
  - 滑动导航
  - 优化的表单输入

## 状态管理

使用 Pinia 进行状态管理，主要包含以下 store：

### Auth Store
- 管理用户认证状态
- 存储用户信息和令牌
- 提供登录、注册、登出方法

### Visits Store
- 管理访问统计数据
- 提供数据获取和更新方法

### Messages Store
- 管理留言数据
- 提供留言的增删改查方法

### Memories Store
- 管理回忆数据
- 提供回忆的增删改查方法

## 路由配置

使用 Vue Router 进行路由管理，主要包含以下路由：

- `/login` - 登录页面（未认证用户）
- `/register` - 注册页面（未认证用户）
- `/` - 仪表板首页（需要认证）
- `/visits` - 访问统计（需要认证）
- `/messages` - 留言管理（需要认证）
- `/memories` - 回忆管理（需要认证）

路由守卫会自动检查用户认证状态，未认证用户会被重定向到登录页面。

## API 依赖

管理后台需要连接到 Birthday Wish 后端 API。确保后端服务已启动并配置正确的 API 地址。

后端 API 文档请参考 [birthday-manage-node/README.md](../birthday-manage-node/README.md)

## 部署

### 部署到 Railway

详细的部署指南请参考后端项目的 [RAILWAY_DEPLOYMENT.md](../birthday-manage-node/RAILWAY_DEPLOYMENT.md) 文档。

### 部署到其他平台

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录部署到任何静态网站托管服务，例如：
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 开发建议

### 代码规范
- 使用 TypeScript 类型检查
- 遵循 Vue 3 组合式 API 最佳实践
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化

### 组件开发
- 组件应该单一职责
- 使用 Props 和 Emits 进行组件通信
- 合理使用计算属性和侦听器
- 避免不必要的响应式数据

### 性能优化
- 使用路由懒加载
- 合理使用 v-show 和 v-if
- 避免不必要的重新渲染
- 使用虚拟滚动处理长列表

### 测试
- 为关键功能编写单元测试
- 测试组件的 Props 和 Emits
- 测试路由导航
- 测试 API 交互

## 常见问题

### Q: 如何修改默认的 API 地址？

A: 在 `.env` 文件中修改 `VITE_API_URL` 变量。

### Q: 如何添加新的页面？

A: 在 `src/views` 目录下创建新的 Vue 组件，然后在 `src/router/index.ts` 中添加路由配置。

### Q: 如何添加新的状态管理？

A: 在 `src/stores` 目录下创建新的 store 文件，使用 Pinia 的 `defineStore` 函数定义状态。

### Q: 如何自定义主题样式？

A: 在组件的 `<style>` 标签中使用 CSS 变量或直接修改样式。

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送 Pull Request

## 更新日志

### v1.0.0 (2026-01-14)
- 初始版本发布
- 实现认证系统
- 实现访问统计功能
- 实现留言管理功能
- 实现回忆管理功能
- 完成响应式设计
