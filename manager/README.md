# 亚信后台管理系统

一个基于 Vue 3 + TypeScript + Element Plus 的现代化后台管理系统，专为玉溪亚信税务师事务所设计。

## 📋 项目概述

亚信后台管理系统是一个功能完善的企业级后台管理平台，提供用户管理、内容管理、报告生成、反馈管理等核心功能。系统采用前后端分离架构，前端使用 Vue 3 + TypeScript 开发，后端基于 FastAPI + MySQL 构建。

## ✨ 主要功能

### 🔐 用户认证与权限管理
- 用户登录/登出
- JWT Token 认证
- 基于角色的权限控制
- 滑动验证码集成
- 阿里云短信验证

### 📊 自助业务
- **报告生成器**：支持纳税审核汇总表和企业所得税年度纳税审核表的上传与处理
- Excel 文件解析与数据预览
- 自动生成 Word 格式报告
- 报告下载功能

### 👥 用户管理
- 管理员账户管理
- 用户状态控制（激活/禁用）
- 分页查询与搜索
- 用户信息维护

### 📝 内容管理
- 文章创建与编辑
- 富文本编辑器集成
- 文章分类管理
- 草稿保存功能
- 内容发布控制

### 🏢 团队管理
- 团队成员信息管理
- 头像上传与展示
- 成员角色分配
- 团队信息维护

### 💬 反馈管理
- 用户反馈收集
- 反馈分类与状态管理
- 管理员回复功能
- 反馈统计与分析

### 👤 个人中心
- 个人信息维护
- 头像上传
- 密码修改
- 个人资料管理

## 🛠️ 技术栈

### 前端技术
- **框架**: Vue 3.2.13
- **语言**: TypeScript 4.5.5
- **UI 组件库**: Element Plus 2.9.4
- **状态管理**: Vuex 4.0.0
- **路由**: Vue Router 4.0.3
- **HTTP 客户端**: Axios 1.7.9
- **富文本编辑器**: @wangeditor/editor 5.1.23
- **文档预览**: @vue-office/docx 1.6.3
- **图标**: @element-plus/icons-vue 2.3.1

### 后端技术
- **框架**: FastAPI
- **数据库**: MySQL
- **ORM**: SQLAlchemy
- **认证**: JWT Token
- **文件处理**: Python 标准库
- **短信服务**: 阿里云 SMS

### 开发工具
- **构建工具**: Vue CLI 5.0.8
- **代码规范**: ESLint + TypeScript ESLint
- **包管理**: npm

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0
- Python >= 3.8
- MySQL >= 5.7

### 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd manager

# 安装前端依赖
npm install
```

### 开发环境配置

1. **前端配置**
```bash
# 启动开发服务器
npm run serve
```
访问地址：http://localhost:8080

2. **后端配置**
```bash
# 安装 Python 依赖
pip install fastapi uvicorn sqlalchemy pymysql python-multipart

# 启动后端服务
python main.py
```
后端服务地址：http://127.0.0.1:8000

### 生产环境构建
```bash
# 构建生产版本
npm run build
```

## 📁 项目结构

```
manager/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 组件
│   │   ├── business/      # 业务组件
│   │   │   ├── ArticleEditor.vue
│   │   │   ├── ContentManagement.vue
│   │   │   ├── FeedbackForm.vue
│   │   │   ├── FeedbackManagement.vue
│   │   │   ├── PersonalCenter.vue
│   │   │   ├── ReportGenerator.vue
│   │   │   ├── TeamManagement.vue
│   │   │   └── UserManagement.vue
│   │   ├── layout/        # 布局组件
│   │   │   ├── AppLayout.vue
│   │   │   ├── ContentArea.vue
│   │   │   ├── HeaderComp.vue
│   │   │   └── SideComp.vue
│   │   ├── ArticleForm.vue
│   │   ├── CaptcheComp.vue
│   │   └── UpdateForm.vue
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   │   ├── api.ts         # API 配置
│   │   ├── articleApi.ts  # 文章相关 API
│   │   ├── authApi.ts     # 认证相关 API
│   │   ├── contentApi.ts  # 内容相关 API
│   │   ├── feedbackApi.ts # 反馈相关 API
│   │   ├── http.ts        # HTTP 客户端配置
│   │   ├── personalApi.ts # 个人中心 API
│   │   ├── reportApi.ts   # 报告相关 API
│   │   ├── teamApi.ts     # 团队管理 API
│   │   └── userApi.ts     # 用户管理 API
│   ├── views/             # 页面组件
│   │   ├── LoginPage.vue  # 登录页
│   │   └── MainPage.vue   # 主页面
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vue.config.js          # Vue CLI 配置
└── README.md              # 项目说明
```

## 🔧 配置说明

### 环境变量
系统根据 `NODE_ENV` 自动切换环境：
- **开发环境**: `http://127.0.0.1:8000/api`
- **生产环境**: `填写您的后端服务地址`

### API 配置
所有 API 请求统一通过 `src/utils/http.ts` 管理，支持：
- 自动添加 API 前缀
- 请求/响应拦截器
- 错误处理
- Token 自动添加

## 📊 数据库设计

### 主要数据表
- `users`: 用户表
- `users1`: 管理员表
- `usersInformation`: 用户信息表
- `article_details`: 文章详情表
- `leader`: 团队成员表
- `feedbacks`: 反馈表
- `messages`: 消息表
- `images`: 图片表
- `sms_verifications`: 短信验证表

## 🔐 权限系统

系统采用基于角色的权限控制：
- **普通用户** (role_id = 1): 基础功能访问
- **管理员** (role_id = -1): 完整功能访问

权限控制通过 Vuex 全局状态管理，支持：
- 实时权限更新
- 菜单动态显示
- 路由权限控制

## 📱 功能模块

### 1. 报告生成器
- 支持 Excel 文件上传
- 数据解析与预览
- 自动生成 Word 报告
- 报告下载功能

### 2. 内容管理
- 富文本编辑器
- 文章分类管理
- 草稿保存
- 发布控制

### 3. 用户管理
- 用户列表管理
- 状态控制
- 分页查询
- 搜索功能

### 4. 反馈管理
- 反馈收集
- 状态跟踪
- 管理员回复
- 统计分析

## 🚀 部署说明

### 前端部署
```bash
# 构建生产版本
npm run build

# 部署 dist 目录到 Web 服务器
```

### 后端部署
```bash
# 使用 uvicorn 部署
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者：玉溪亚信税务师事务所
- 邮箱：contact@yaxinshuiwu.com
- 网站：https://www.yaxinshuiwu.com

## 🙏 致谢

感谢以下开源项目的支持：
- Vue.js
- Element Plus
- FastAPI
- SQLAlchemy
- 阿里云服务

---

**注意**: 本项目仅供内部使用，请勿用于商业用途。