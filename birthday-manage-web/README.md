# Birthday Wish Admin Panel

管理后台用于管理 Birthday Wish 应用的访问统计、用户留言和回忆内容。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios

## 安装依赖

```bash
npm install
```

## 环境配置

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 在 `.env` 文件中配置后端 API 地址：
```
VITE_API_URL=http://localhost:3000/api
```

## 开发

启动开发服务器：
```bash
npm run dev
```

访问 http://localhost:5173

## 构建

构建生产版本：
```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 预览

预览生产构建：
```bash
npm run preview
```

## 功能模块

### 认证
- 管理员注册
- 管理员登录
- JWT 认证

### 访问统计
- 总访问量统计
- 最近30天访问量
- 独立访客统计
- 每日访问量图表
- 热门页面排行
- 访问记录列表

### 留言管理
- 查看所有留言
- 查看留言详情
- 删除留言

### 回忆管理
- 添加回忆
- 编辑回忆
- 删除回忆
- 回忆列表展示

## 响应式设计

管理后台完全支持移动端和 PC 端自适应，在以下设备上均有良好体验：
- 桌面端（>= 1024px）
- 平板端（768px - 1023px）
- 移动端（< 768px）

## API 依赖

管理后台需要连接到 Birthday Wish 后端 API。确保后端服务已启动并配置正确的 API 地址。

后端 API 文档请参考 [birthday-manage-node/README.md](../birthday-manage-node/README.md)
