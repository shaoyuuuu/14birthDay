# Railway 部署指南

本指南将帮助你将 Birthday Wish 后端和管理面板部署到 Railway。

## 前置准备

1. **Railway 账号**
   - 访问 [railway.app](https://railway.app) 注册账号
   - 完成邮箱验证

2. **GitHub 账号**
   - 确保你的项目代码已推送到 GitHub
   - Railway 通过 GitHub 集成进行部署

## 部署后端服务

### 步骤 1：创建新项目

1. 登录 Railway 控制台
2. 点击 "New Project" 按钮
3. 选择 "Deploy from GitHub repo"
4. 选择你的 Birthday Wish 项目仓库
5. 选择 `birthday-manage-node` 目录作为根目录

### 步骤 2：配置 PostgreSQL 数据库

1. 在项目中点击 "New Service"
2. 选择 "Database"
3. 选择 "PostgreSQL"
4. Railway 会自动创建一个 PostgreSQL 数据库实例

### 步骤 3：配置环境变量

在 Railway 项目的 "Variables" 标签页中添加以下环境变量：

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_URL=postgresql://postgres:password@host:5432/railway
```

**重要提示：**

- `DATABASE_URL` 会自动由 Railway 的 PostgreSQL 服务提供
- `JWT_SECRET` 必须是一个强随机字符串，建议使用以下命令生成：
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 步骤 4：配置构建和启动

Railway 会自动检测 Node.js 项目并使用以下配置：

**构建命令：**

```bash
npm install
```

**启动命令：**

```bash
node src/server.js
```

如果需要自定义，可以在 `package.json` 中添加：

```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### 步骤 5：运行数据库迁移

部署后，需要初始化数据库表和创建默认管理员账号：

1. 在 Railway 控制台中，找到后端服务
2. 点击 "Console" 标签
3. 点击 "New Console" 打开终端
4. 运行以下命令：

```bash
# 创建数据库表
node src/database/migrate.js

# 创建默认管理员账号
node src/database/seed.js
```

默认管理员账号：

- 用户名：`admin`
- 密码：`admin123`

**⚠️ 重要：首次登录后请立即修改密码！**

### 步骤 6：获取后端 API 地址

部署完成后，Railway 会为你的服务分配一个 URL：

- 在 Railway 控制台中，点击后端服务
- 在 "Settings" 标签页中找到 "Domains"
- 复制生成的 URL（例如：`https://birthday-manage-node.up.railway.app`）

## 部署管理面板

### 步骤 1：创建静态网站服务

1. 在 Railway 项目中点击 "New Service"
2. 选择 "Static Site"
3. 选择你的 GitHub 仓库
4. 选择 `birthday-manage-web` 目录作为根目录

### 步骤 2：配置环境变量

在管理面板服务的 "Variables" 标签页中添加：

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

将 `your-backend-url` 替换为实际的后端服务 URL。

### 步骤 3：配置构建设置

在管理面板服务的 "Settings" 标签页中配置：

**Root Directory:** `birthday-manage-web`

**Build Command:**

```bash
npm install
npm run build
```

**Output Directory:** `dist`

### 步骤 4：获取管理面板地址

部署完成后，Railway 会为管理面板分配一个 URL：

- 在 Railway 控制台中，点击管理面板服务
- 在 "Settings" 标签页中找到 "Domains"
- 复制生成的 URL

## 配置自定义域名（可选）

### 为后端配置自定义域名

1. 在后端服务的 "Settings" > "Domains" 中
2. 点击 "Add Domain"
3. 输入你的域名（例如：`api.birthdaywish.com`）
4. 按照提示配置 DNS 记录：
   - 类型：`CNAME`
   - 名称：`api`
   - 值：`cname.railway.app`

### 为管理面板配置自定义域名

1. 在管理面板服务的 "Settings" > "Domains" 中
2. 点击 "Add Domain"
3. 输入你的域名（例如：`admin.birthdaywish.com`）
4. 按照提示配置 DNS 记录：
   - 类型：`CNAME`
   - 名称：`admin`
   - 值：`cname.railway.app`

## 监控和日志

### 查看日志

1. 在 Railway 控制台中，选择对应的服务
2. 点击 "Logs" 标签
3. 实时查看应用日志

### 查看指标

1. 在 Railway 控制台中，选择对应的服务
2. 点击 "Metrics" 标签
3. 查看 CPU、内存、网络使用情况

### 设置告警

1. 在项目设置中，点击 "Notifications"
2. 配置邮件或 Slack 告警
3. 设置 CPU、内存使用阈值

## 数据库管理

### 连接到数据库

1. 在 Railway 控制台中，点击 PostgreSQL 服务
2. 点击 "Connect" 按钮
3. 可以选择：
   - 使用内置的数据库浏览器
   - 获取连接字符串使用外部工具（如 pgAdmin、DBeaver）

### 备份数据库

Railway 自动为 PostgreSQL 创建每日备份。你也可以手动创建备份：

1. 在 PostgreSQL 服务中，点击 "Backups" 标签
2. 点击 "Create Backup"

### 恢复数据库

1. 在 PostgreSQL 服务中，点击 "Backups" 标签
2. 选择一个备份点
3. 点击 "Restore"

## 故障排查

### 后端无法启动

1. 检查日志：查看 "Logs" 标签页的错误信息
2. 检查环境变量：确保所有必需的环境变量都已配置
3. 检查数据库连接：确认 `DATABASE_URL` 正确
4. 检查端口：确保 `PORT` 环境变量已设置

### 数据库连接失败

1. 确认 PostgreSQL 服务正在运行
2. 检查 `DATABASE_URL` 是否正确
3. 确认数据库迁移已执行
4. 查看后端日志中的数据库连接错误

### 管理面板无法连接后端

1. 检查 `VITE_API_URL` 是否正确
2. 确认后端服务正在运行
3. 检查 CORS 配置（如果需要）
4. 查看浏览器控制台的网络请求错误

### 构建失败

1. 检查 `package.json` 中的依赖是否正确
2. 确认 Node.js 版本兼容性
3. 查看构建日志中的具体错误信息
4. 确保所有依赖都在 `package.json` 中声明

## 成本优化

### 免费套餐

Railway 提供免费套餐，包括：

- $5/月的免费额度
- 512MB RAM
- 1GB 存储

### 优化建议

1. **使用空闲休眠**：配置服务在无流量时自动休眠
2. **优化数据库查询**：减少不必要的查询，使用索引
3. **启用缓存**：在适当的地方使用缓存减少数据库访问
4. **监控资源使用**：定期检查 CPU 和内存使用情况

## 安全建议

1. **修改默认密码**：首次登录后立即修改管理员密码
2. **使用强 JWT_SECRET**：确保 JWT 密钥足够复杂
3. **启用 HTTPS**：Railway 自动提供 SSL 证书
4. **限制访问**：考虑使用 IP 白名单或 VPN
5. **定期更新依赖**：保持依赖包最新以修复安全漏洞
6. **备份策略**：定期备份数据库

## 持续部署

Railway 支持持续部署：

1. **自动部署**：每次推送到 GitHub 主分支时自动部署
2. **手动部署**：在 Railway 控制台中手动触发部署
3. **分支部署**：为不同的分支创建预览环境

配置自动部署：

1. 在项目设置中，点击 "GitHub"
2. 选择要自动部署的分支
3. 配置部署触发条件

## 常见问题

### Q: 如何重置数据库？

A: 在 PostgreSQL 服务中，点击 "Reset" 可以重置数据库。**注意：这会删除所有数据！**

### Q: 如何升级 Node.js 版本？

A: 在 `package.json` 中指定 `engines` 字段：

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Q: 如何查看数据库大小？

A: 在 PostgreSQL 服务中，点击 "Metrics" 标签查看存储使用情况。

### Q: 如何添加更多环境变量？

A: 在服务的 "Variables" 标签页中点击 "New Variable" 添加。

## 支持和资源

- [Railway 官方文档](https://docs.railway.app)
- [Railway 社区论坛](https://community.railway.app)
- [Railway GitHub](https://github.com/railwayapp)

## 总结

完成以上步骤后，你将拥有：

- ✅ 运行在 Railway 的后端 API 服务
- ✅ 运行在 Railway 的 PostgreSQL 数据库
- ✅ 运行在 Railway 的管理面板
- ✅ 自定义域名（可选）
- ✅ 自动备份和监控

现在你可以通过管理面板的 URL 访问后台，使用默认管理员账号登录并开始管理你的 Birthday Wish 应用！
