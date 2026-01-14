# 火柴人头像配置说明

## 文件位置
请将你的火柴人头像图片放置在以下目录：
- `public/config/images/front-avatar.png` - 前方火柴人头像
- `public/config/images/rear-avatar.png` - 后方火柴人头像

## 图片要求
- **格式**: PNG（推荐）或 JPG
- **尺寸**: 建议正方形，至少 50x50 像素
- **内容**: 你的火柴人头像图片

## 配置说明
头像路径已在 `public/config/textConfigs.json` 中配置：

```json
{
  "stickFigure": {
    "frontAvatar": "/config/images/front-avatar.png",
    "rearAvatar": "/config/images/rear-avatar.png"
  }
}
```

## 注意事项
1. 确保图片文件名与配置文件中的路径一致
2. 图片会自动适配火柴人头像的圆形显示
3. 如果没有提供图片，系统会使用默认的占位图片
