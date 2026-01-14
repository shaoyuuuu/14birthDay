# Birthday Wish 后端 API

生日祝福应用的后端 API 服务，基于 Node.js、Express 和 PostgreSQL 构建，提供访问统计、留言管理和回忆存储功能。

## 项目简介

birthday-manage-node 是一个功能完整的后端服务，为 Birthday Wish 应用提供 RESTful API 接口。系统采用 JWT 认证、PostgreSQL 数据库，并包含完善的安全机制和日志记录。

## 技术栈

- **Node.js** - JavaScript 运行时环境
- **Express** - Node.js Web 应用框架
- **PostgreSQL** - 关系型数据库
- **JWT** - JSON Web Token 认证
- **Winston** - 日志管理
- **Joi** - 数据验证
- **Helmet** - 安全头设置
- **Bcrypt** - 密码加密

## 功能特性

### 认证系统
- 管理员注册
- 管理员登录
- JWT 令牌认证
- 令牌验证
- 密码加密存储

### 访问统计
- 记录用户访问
- IP 地址追踪
- User Agent 识别
- 页面 URL 记录
- 来源页面追踪
- 访问时间记录
- 访问统计查询
- 访问数据分析

### 留言管理
- 提交用户留言
- 获取所有留言
- 更新留言状态
- 删除留言
- 留言审核功能

### 回忆管理
- 创建回忆记录
- 获取所有回忆
- 获取单个回忆
- 更新回忆内容
- 删除回忆
- 图片存储支持

### 安全特性
- Helmet.js 安全头
- 请求速率限制
- JWT 认证保护
- 密码哈希加密
- 输入验证
- CORS 配置

### 日志系统
- 完整的请求日志
- 错误日志记录
- 日志文件存储
- 控制台输出

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- PostgreSQL >= 12.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置以下变量：
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/birthday_wish
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**环境变量说明：**
- `PORT` - 服务器监听端口
- `NODE_ENV` - 运行环境（development/production）
- `DATABASE_URL` - PostgreSQL 数据库连接字符串
- `JWT_SECRET` - JWT 令牌密钥（生产环境必须修改）
- `JWT_EXPIRES_IN` - JWT 令牌过期时间
- `CORS_ORIGIN` - 允许跨域的源地址

### 数据库初始化

1. 创建数据库：
```bash
createdb birthday_wish
```

2. 运行数据库迁移，创建表结构：
```bash
npm run migrate
```

3. 创建默认管理员账号：
```bash
npm run seed
```

默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

**⚠️ 重要：首次登录后请立即修改密码！**

### 开发模式

启动开发服务器（支持自动重启）：
```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

### 生产模式

启动生产服务器：
```bash
npm start
```

## API 接口文档

### 认证接口

#### 注册管理员
```
POST /api/auth/register
```

**请求体：**
```json
{
  "username": "admin",
  "password": "password123",
  "email": "admin@example.com"
}
```

**响应：**
```json
{
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 管理员登录
```
POST /api/auth/login
```

**请求体：**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应：**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

#### 验证令牌
```
GET /api/auth/verify
```

**请求头：**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### 访问统计接口

#### 记录访问
```
POST /api/visits
```

**请求体：**
```json
{
  "page_url": "/home",
  "referrer": "https://google.com"
}
```

**响应：**
```json
{
  "message": "Visit recorded successfully",
  "visit": {
    "id": 1,
    "ip_address": "192.168.1.1",
    "visit_date": "2026-01-14T10:00:00.000Z"
  }
}
```

#### 获取所有访问记录
```
GET /api/visits
```

**请求头：**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "visits": [
    {
      "id": 1,
      "ip_address": "192.168.1.1",
      "visit_date": "2026-01-14T10:00:00.000Z",
      "page_url": "/home"
    }
  ]
}
```

#### 获取访问统计
```
GET /api/visits/stats
```

**请求头：**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "total_visits": 1000,
  "unique_visitors": 500,
  "last_30_days": 300,
  "daily_stats": [
    {
      "date": "2026-01-14",
      "visits": 50
    }
  ]
}
```

### 留言管理接口

#### 提交留言
```
POST /api/messages
```

**请求体：**
```json
{
  "name": "张三",
  "message": "生日快乐！"
}
```

**响应：**
```json
{
  "message": "Message submitted successfully",
  "message": {
    "id": 1,
    "name": "张三",
    "message": "生日快乐！",
    "created_at": "2026-01-14T10:00:00.000Z"
  }
}
```

#### 获取所有留言
```
GET /api/messages
```

**请求头：**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "messages": [
    {
      "id": 1,
      "name": "张三",
      "message": "生日快乐！",
      "created_at": "2026-01-14T10:00:00.000Z"
    }
  ]
}
```

#### 删除留言
```
DELETE /api/messages/:id
```

**请求头：**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "message": "Message deleted successfully"
}
```

### 回忆管理接口

#### 创建回忆
```
POST /api/memories
```

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "title": "生日派对",
  "description": "和朋友一起庆祝生日",
  "image_url": "https://example.com/image.jpg"
}
```

**响应：**
```json
{
  "message": "Memory created successfully",
  "memory": {
    "id": 1,
    "title": "生日派对",
    "description": "和朋友一起庆祝生日",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2026-01-14T10:00:00.000Z"
  }
}
```

#### 获取所有回忆
```
GET /api/memories
```

**响应：**
```json
{
  "memories": [
    {
      "id": 1,
      "title": "生日派对",
      "description": "和朋友一起庆祝生日",
      "image_url": "https://example.com/image.jpg",
      "created_at": "2026-01-14T10:00:00.000Z"
    }
  ]
}
```

#### 获取单个回忆
```
GET /api/memories/:id
```

**响应：**
```json
{
  "memory": {
    "id": 1,
    "title": "生日派对",
    "description": "和朋友一起庆祝生日",
    "image_url": "https://example.com/image.jpg",
    "created_at": "2026-01-14T10:00:00.000Z"
  }
}
```

#### 更新回忆
```
PUT /api/memories/:id
```

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "title": "生日派对",
  "description": "和朋友一起庆祝生日，非常开心！",
  "image_url": "https://example.com/image.jpg"
}
```

**响应：**
```json
{
  "message": "Memory updated successfully",
  "memory": {
    "id": 1,
    "title": "生日派对",
    "description": "和朋友一起庆祝生日，非常开心！",
    "image_url": "https://example.com/image.jpg",
    "updated_at": "2026-01-14T11:00:00.000Z"
  }
}
```

#### 删除回忆
```
DELETE /api/memories/:id
```

**请求头：**
```
Authorization: Bearer <token>
```

**响应：**
```json
{
  "message": "Memory deleted successfully"
}
```

## 数据库结构

### admins 表
管理员账号表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| username | VARCHAR(50) | 用户名（唯一） |
| password_hash | VARCHAR(255) | 密码哈希 |
| email | VARCHAR(255) | 邮箱（唯一） |
| created_at | TIMESTAMP | 创建时间 |

### visits 表
访问记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| ip_address | VARCHAR(45) | IP 地址 |
| user_agent | TEXT | 用户代理 |
| visit_date | TIMESTAMP | 访问时间 |
| page_url | VARCHAR(255) | 页面 URL |
| referrer | TEXT | 来源页面 |

### messages 表
留言表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| name | VARCHAR(100) | 留言人姓名 |
| message | TEXT | 留言内容 |
| created_at | TIMESTAMP | 创建时间 |

### memories 表
回忆表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| title | VARCHAR(255) | 标题 |
| description | TEXT | 描述 |
| image_url | TEXT | 图片 URL |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 项目结构

```
birthday-manage-node/
├── src/
│   ├── database/       # 数据库配置和迁移
│   │   ├── config.js   # 数据库连接配置
│   │   ├── migrate.js  # 数据库迁移脚本
│   │   └── seed.js     # 初始数据脚本
│   ├── middleware/     # 中间件
│   │   ├── auth.js     # 认证中间件
│   │   ├── errorHandler.js  # 错误处理
│   │   └── rateLimiter.js    # 速率限制
│   ├── routes/         # 路由
│   │   ├── auth.js     # 认证路由
│   │   ├── visits.js   # 访问统计路由
│   │   ├── messages.js # 留言管理路由
│   │   └── memories.js # 回忆管理路由
│   ├── utils/          # 工具函数
│   │   └── logger.js   # 日志工具
│   └── server.js       # 服务器入口
├── logs/               # 日志文件目录
├── .env.example        # 环境变量示例
├── .gitignore          # Git 忽略文件
├── package.json        # 项目配置
├── railway.json        # Railway 部署配置
└── README.md           # 项目文档
```

## 部署到 Railway

详细的 Railway 部署指南请参考 [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) 文档。

快速部署步骤：
1. 将代码推送到 GitHub
2. 在 Railway 创建新项目
3. 连接 GitHub 仓库
4. 添加 PostgreSQL 数据库服务
5. 在 Railway 控制台设置环境变量
6. 部署！

Railway 将自动：
- 安装依赖
- 运行数据库迁移
- 启动服务器

## 前端集成

前端管理面板项目位于 [birthday-manage-web](../birthday-manage-web/) 目录。

前端项目需要配置后端 API 地址才能正常工作。请参考前端项目的 [README.md](../birthday-manage-web/README.md) 了解如何配置。

## 安全建议

1. **修改默认密码**：首次登录后立即修改管理员密码
2. **使用强 JWT_SECRET**：生产环境必须使用强随机密钥
3. **启用 HTTPS**：Railway 自动提供 SSL 证书
4. **限制访问**：考虑使用 IP 白名单或 VPN
5. **定期更新依赖**：保持依赖包最新以修复安全漏洞
6. **备份策略**：定期备份数据库

## 日志管理

日志存储位置：
- 控制台输出（所有环境）
- `logs/error.log`（开发环境）
- `logs/combined.log`（开发环境）

日志级别：
- error - 错误信息
- warn - 警告信息
- info - 一般信息
- http - HTTP 请求日志

## 开发建议

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Node.js 最佳实践
- 使用 async/await 处理异步操作
- 合理使用 try-catch 错误处理

### API 设计
- 遵循 RESTful API 设计原则
- 使用合适的 HTTP 方法
- 提供清晰的错误信息
- 统一的响应格式

### 数据库操作
- 使用参数化查询防止 SQL 注入
- 合理使用数据库索引
- 定期优化数据库查询
- 实施数据库备份策略

### 测试
- 为 API 端点编写单元测试
- 测试认证和授权
- 测试错误处理
- 测试数据库操作

## 常见问题

### Q: 如何修改 JWT 密钥？

A: 在 `.env` 文件中修改 `JWT_SECRET` 变量。修改后需要重新生成令牌。

### Q: 如何重置数据库？

A: 删除数据库后重新创建，然后运行 `npm run migrate` 和 `npm run seed`。

### Q: 如何添加新的 API 端点？

A: 在 `src/routes/` 目录下创建新的路由文件，然后在 `src/server.js` 中注册路由。

### Q: 如何配置 CORS？

A: 在 `.env` 文件中修改 `CORS_ORIGIN` 变量，可以设置多个源地址。

### Q: 如何查看日志？

A: 开发环境下日志存储在 `logs/` 目录中，生产环境使用 Railway 的日志查看功能。

## 浏览器支持

API 服务不依赖浏览器，支持所有现代 HTTP 客户端。

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
- 完成安全机制
- 完成日志系统
- 添加 Railway 部署支持
