# 脚本文件整理说明

## 已删除的脚本文件

以下脚本文件已被删除，因为它们的功能已被 `scripts/generate-configs.js` 替代：

### 1. addComments.js
- **功能**: 为所有 memory.json 文件添加 comment 字段
- **删除原因**: 功能已过时，现在 comment 字段应该在创建 memory.json 时直接添加

### 2. generate-memory-images.js
- **功能**: 扫描 memory 文件夹并生成 memoryImages.json
- **删除原因**: 功能已被 `scripts/generate-configs.js` 完全替代

### 3. getTitles.js
- **功能**: 获取所有 memory.json 的标题
- **删除原因**: 临时调试脚本，不再需要

### 4. rename-files.ps1
- **功能**: PowerShell 脚本，用于重命名文件和文件夹
- **删除原因**: 已不再需要批量重命名功能

### 5. rename-to-chinese.js
- **功能**: 将英文文件夹名还原为中文
- **删除原因**: 已完成中文化，不再需要

### 6. rename-to-english.js
- **功能**: 将中文文件夹名转换为英文
- **删除原因**: 已决定使用中文文件夹名，不再需要

### 7. update-images.js
- **功能**: 更新 memoryImages.json
- **删除原因**: 功能已被 `scripts/generate-configs.js` 完全替代

### 8. vite-plugin-memory-images.js
- **功能**: Vite 插件，自动生成 memoryImages.json
- **删除原因**: 功能已被 `scripts/generate-configs.js` 替代，更灵活可控

## 保留的脚本文件

### 1. scripts/generate-configs.js ⭐
- **功能**: 一键生成所有配置文件
- **生成内容**:
  - themeConfigs.js (主题配置)
  - memoryImages.json (图片列表)
  - apiService.js 中的 MEMORY_FOLDERS 数组
- **使用方法**: `npm run generate-configs`

### 2. optimize-images.js
- **功能**: 优化图片，生成 WebP 格式和缩略图
- **使用方法**: `npm run optimize-images`

## 配置文件更新

### package.json
- 移除了 `update-images` 命令
- 保留了 `generate-configs` 和 `optimize-images` 命令

### vite.config.js
- 移除了 `memoryImagesPlugin` 插件
- 保留了 `viteImagemin` 插件（用于构建时优化图片）

## 现在的工作流程

### 添加新的记忆文件夹

1. 在 `public/memory` 下创建新文件夹（中文命名）
2. 创建 `memory.json` 配置文件
3. 添加图片文件
4. 运行 `npm run generate-configs`

就这么简单！所有配置会自动生成。

### 优化图片

如果需要优化图片：

```bash
npm run optimize-images
```

这会生成 WebP 格式的优化图片和缩略图。

## 优势

1. **简化**: 从 8 个脚本减少到 2 个核心脚本
2. **统一**: 所有配置生成集中在一个脚本中
3. **可控**: 不再依赖自动监听，按需生成
4. **清晰**: 每个脚本的功能明确，易于维护

## 注意事项

- 每次添加新的记忆文件夹后，记得运行 `npm run generate-configs`
- 如果修改了 memory.json 文件，也需要运行 `npm run generate-configs`
- 优化图片是可选的，主要用于生产环境部署
