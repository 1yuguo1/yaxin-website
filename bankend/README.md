# 亚信网站管理系统

一个基于 FastAPI 的现代化 Web 应用系统，提供用户管理、内容管理、反馈系统、消息通知等完整功能。

## ✨ 功能特性

### 🔐 用户认证系统
- 手机号注册/登录
- 短信验证码验证
- JWT Token 认证
- 用户信息管理
- 密码重置功能

### 📝 内容管理系统
- 文章发布与管理
- 分类管理
- 标签系统
- 评论功能
- 搜索功能
- 热门文章推荐

### 👥 用户管理
- 管理员后台
- 用户权限管理
- 用户状态控制
- 角色分配

### 💬 反馈系统
- 用户反馈收集
- 反馈分类管理
- 管理员回复
- 反馈状态跟踪

### 📨 消息通知
- 系统消息推送
- 个人消息中心
- 消息状态管理
- 批量消息发送

### 📊 数据报表
- Excel 文件上传处理
- 自动生成 Word 报告
- 数据统计分析
- 模板化报告生成

### 🛡️ 安全特性
- 阿里云验证码防护
- 短信验证码
- JWT 安全认证
- 环境变量配置
- 数据加密存储

## 🚀 技术栈

- **后端框架**: FastAPI
- **数据库**: MySQL + SQLAlchemy ORM
- **认证**: JWT Token
- **文件处理**: pandas, openpyxl, python-docx
- **云服务**: 阿里云短信服务、验证码服务
- **部署**: Docker, Nginx, systemd

## 📋 系统要求

- Python 3.7+
- MySQL 5.7+
- 阿里云账号（短信服务、验证码服务）

## 🛠️ 安装部署

### 1. 克隆项目

```bash
git clone <repository-url>
cd yaxin2.0
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 环境配置

```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置文件
nano .env
```

配置以下环境变量：

```env
# 阿里云API配置
ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=yaxin2.0

# JWT密钥配置
JWT_SECRET_KEY=your_strong_secret_key

# 短信服务配置
SMS_SIGN_NAME=your_sms_sign
SMS_TEMPLATE_CODE=your_template_code

# 验证码服务配置
CAPTCHA_ENDPOINT=your_captcha_endpoint
```

### 4. 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE yaxin2.0 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据库结构
mysql -u root -p yaxin2.0 < schalem.sql
```

### 5. 启动应用

```bash
# 开发环境
python main.py

# 或使用 uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📁 项目结构

```
yaxin2.0/
├── main.py              # 主应用文件，API 路由定义
├── database.py          # 数据库模型和操作函数
├── aliyun.py           # 阿里云服务集成（短信、验证码）
├── utils.py            # 工具函数（JWT、文件处理、报告生成）
├── load_env.py         # 环境变量加载脚本
├── requirements.txt    # Python 依赖包列表
├── schalem.sql        # 数据库结构文件
├── template.docx      # Word 报告模板
├── env.example        # 环境变量配置模板
├── .gitignore         # Git 忽略文件配置
├── README.md          # 项目说明文档
├── input/             # 用户上传文件目录
│   └── [user_id]/     # 用户专属上传目录
└── output/            # 生成文件输出目录
    └── [user_id]/     # 用户专属输出目录
```

## 🔧 API 接口

### 用户认证
- `POST /api/regist` - 用户注册
- `POST /api/login` - 用户登录
- `POST /api/loginmsg` - 获取登录信息
- `GET /api/phonecode/{phoneNumber}` - 发送短信验证码

### 内容管理
- `POST /api/carticle` - 创建文章
- `GET /api/articleData/{category_id}/{page}` - 获取文章列表
- `POST /api/updateArticle` - 更新文章
- `GET /api/deleteArticle/{article_id}` - 删除文章
- `GET /api/search` - 搜索文章

### 评论系统
- `GET /api/comments` - 获取评论列表
- `POST /api/comments` - 创建评论
- `DELETE /api/comments/{comment_id}` - 删除评论
- `POST /api/comments/{comment_id}/like` - 点赞评论

### 反馈系统
- `POST /api/feedback` - 提交反馈
- `GET /api/feedback/list` - 获取反馈列表
- `PUT /api/feedback/{feedback_id}/reply` - 回复反馈
- `GET /api/feedback/stats` - 获取反馈统计

### 消息系统
- `GET /api/message/list` - 获取消息列表
- `POST /api/message/send` - 发送消息
- `PUT /api/message/{message_id}/read` - 标记消息已读

### 文件处理
- `POST /api/filea` - 上传文件A
- `POST /api/fileb` - 上传文件B
- `GET /api/report/{username}` - 生成报告
- `GET /api/reportfile/{username}` - 下载报告

### 管理员功能
- `POST /api/mlogin` - 管理员登录
- `GET /api/initadmin` - 获取管理员列表
- `GET /api/total` - 获取用户总数
- `GET /api/delete/{username}` - 删除用户

## 🔒 安全配置

### 环境变量安全
- 所有敏感信息通过环境变量管理
- `.env` 文件已加入 `.gitignore`
- 生产环境使用强密码

### API 安全
- JWT Token 认证
- 阿里云验证码防护
- 短信验证码验证
- 请求频率限制

### 数据库安全
- 参数化查询防止 SQL 注入
- 数据库连接加密
- 用户权限最小化

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -t yaxin-website .
```

### 运行容器

```bash
docker run -d \
  --name yaxin-app \
  -p 8000:8000 \
  --env-file .env \
  yaxin-website
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=mysql
    depends_on:
      - mysql
    volumes:
      - ./input:/app/input
      - ./output:/app/output

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: yaxin2.0
    volumes:
      - mysql_data:/var/lib/mysql
      - ./schalem.sql:/docker-entrypoint-initdb.d/schalem.sql

volumes:
  mysql_data:
```

## 📊 监控和日志

### 日志配置
应用自动记录以下日志：
- API 请求日志
- 错误日志
- 用户操作日志
- 系统状态日志

### 健康检查
访问 `/api/health` 端点检查应用状态。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者：[您的姓名]
- 邮箱：[您的邮箱]
- 项目链接：[GitHub 仓库地址]

## 🙏 致谢

感谢以下开源项目：
- [FastAPI](https://fastapi.tiangolo.com/) - 现代、快速的 Web 框架
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL 工具包
- [阿里云 SDK](https://github.com/aliyun) - 阿里云服务集成

---

**注意**: 在生产环境部署前，请确保完成所有安全配置，并参考安全部署检查清单。