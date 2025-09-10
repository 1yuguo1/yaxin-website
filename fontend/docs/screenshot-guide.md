# 📸 README展示图获取指南

## 🎯 图片尺寸要求

| 用途 | 尺寸 | 示例 |
|------|------|------|
| 功能版块展示 | 400x250 | 登录页面、消息中心 |
| 桌面端展示 | 600x400 | 首页桌面版 |
| 移动端展示 | 300x600 | 首页移动版 |
| 平板端展示 | 500x350 | 首页平板版 |
| 核心功能展示 | 200x120 | 功能模块缩略图 |
| 设计特色展示 | 500x300 | UI设计、响应式 |

## 🛠️ 获取方法

### 方法1: 浏览器截图 (推荐)

1. **启动项目**:
   ```bash
   npm run serve
   ```

2. **Chrome DevTools截图**:
   - 打开 http://localhost:8080
   - 按 F12 打开开发者工具
   - 点击设备模拟器图标 📱
   - 选择对应设备尺寸
   - 右键页面 → 截图

3. **推荐设备设置**:
   - 桌面端: 1920x1080
   - 移动端: iPhone 12 Pro (390x844)
   - 平板端: iPad (768x1024)

### 方法2: 在线截图服务

```bash
# 使用Screenshot API
https://api.screenshotmachine.com?key=YOUR_KEY&url=https://yaxinshuiwu.com&dimension=600x400

# 使用Page2Images
https://api.page2images.com/directlink?p2i_url=https://yaxinshuiwu.com&p2i_size=600x400
```

## 📁 文件组织

```
docs/images/
├── screenshots/          # 页面截图
│   ├── homepage-desktop-600x400.png
│   ├── homepage-mobile-300x600.png
│   ├── login-page-400x250.png
│   └── messages-page-400x250.png
├── features/            # 功能展示图
│   ├── user-auth-400x250.png
│   └── content-mgmt-400x250.png
└── responsive/          # 响应式展示图
    ├── desktop-600x400.png
    ├── mobile-300x600.png
    └── tablet-500x350.png
```

## 🔗 链接格式

### GitHub仓库链接 (推荐)
```markdown
[![首页](https://raw.githubusercontent.com/your-username/yaxin2.0/main/docs/images/screenshots/homepage-desktop-600x400.png)](https://yaxinshuiwu.com)
```

### CDN链接
```markdown
[![首页](https://cdn.jsdelivr.net/gh/your-username/yaxin2.0@main/docs/images/screenshots/homepage-desktop-600x400.png)](https://yaxinshuiwu.com)
```

### 图床链接
```markdown
[![首页](https://i.imgur.com/your-image-id.png)](https://yaxinshuiwu.com)
```

## 🎨 图片优化

### 压缩工具
- [TinyPNG](https://tinypng.com/) - PNG压缩
- [Compressor.io](https://compressor.io/) - 多格式压缩
- [Squoosh](https://squoosh.app/) - Google图片优化

### 质量设置
- 截图: 85-95%
- 功能图: 80-90%
- 缩略图: 70-80%

## 📝 更新步骤

1. **截图并保存**:
   ```bash
   # 保存到对应目录
   docs/images/screenshots/homepage-desktop-600x400.png
   ```

2. **更新README**:
   ```markdown
   # 替换占位符
   [![首页](https://raw.githubusercontent.com/your-username/yaxin2.0/main/docs/images/screenshots/homepage-desktop-600x400.png)](https://yaxinshuiwu.com)
   ```

3. **提交更改**:
   ```bash
   git add docs/images/
   git add README.md
   git commit -m "docs: 添加项目展示图片"
   git push origin main
   ```

## 🚀 自动化脚本

运行自动生成脚本:
```bash
node scripts/generate-screenshots.js
```

该脚本会:
- 创建必要的目录结构
- 生成截图命令指南
- 提供README更新建议

## 📋 检查清单

- [ ] 所有图片尺寸正确
- [ ] 图片质量清晰
- [ ] 文件大小合理 (< 500KB)
- [ ] 链接格式正确
- [ ] 图片描述准确
- [ ] 响应式展示完整
- [ ] 功能展示清晰

## 🎯 最佳实践

1. **保持一致性**: 所有图片使用相同的风格和色调
2. **优化加载**: 压缩图片，使用CDN加速
3. **描述准确**: 图片描述要与实际功能匹配
4. **定期更新**: 功能更新时同步更新展示图
5. **测试链接**: 确保所有图片链接可访问
