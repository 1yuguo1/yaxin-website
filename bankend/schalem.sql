CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 主键，自动递增
    username VARCHAR(11) NOT NULL UNIQUE,  -- 用户名，唯一
    name VARCHAR(10) NOT NULL UNIQUE , -- 用户昵称，唯一
    password VARCHAR(11) NOT NULL,  -- 密码哈希
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,  -- 账号创建时间，默认为当前时间
    last_login_at DATETIME,  -- 最后登录时间
    is_active BOOLEAN DEFAULT TRUE NOT NULL ,  -- 账号是否激活
    is_admin BOOLEAN DEFAULT FALSE NOT NULL  -- 是否是管理员
);

CREATE TABLE sms_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 主键，自动递增
    username VARCHAR(11) NOT NULL UNIQUE,               -- 用户标识，假设用户表中有对应的用户ID
    code VARCHAR(4) NOT NULL,           -- 验证码，通常是4位数字
    expires_at DATETIME NOT NULL,       -- 验证码过期时间
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,  -- 发送时间，默认为当前时间
);

CREATE TABLE article_details (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '文章标题',
    content TEXT NOT NULL COMMENT '文章内容',
    author VARCHAR(100) NOT NULL COMMENT '作者',
    publish_time DATETIME NOT NULL COMMENT '发布时间',
    update_time DATETIME NOT NULL COMMENT '更新时间',
    category_id INT COMMENT '分类ID，外键关联文章分类表',
    tags VARCHAR(255) COMMENT '标签，多个标签用逗号分隔',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    is_published TINYINT(1) DEFAULT 1 COMMENT '是否发布，1表示已发布，0表示草稿',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除，1表示已删除，0表示正常'
);

CREATE TABLE users1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) DEFAULT '123456',
    role_id INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME DEFAULT NULL,
);

CREATE TABLE usersInformation (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主键，自动递增
    username VARCHAR(50) NOT NULL UNIQUE, -- 用户名，不允许为空，且唯一
    avatar_url VARCHAR(255), -- 用户头像的URL地址
    nickname VARCHAR(50), -- 昵称
    real_name VARCHAR(50), -- 真实姓名
    position VARCHAR(100), -- 职务
    phone_number VARCHAR(15) UNIQUE, -- 电话号码，唯一
    email VARCHAR(100) UNIQUE -- 电子邮箱，唯一
);

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主键，自动递增
    username VARCHAR(50) NOT NULL UNIQUE, -- 用户名，不允许为空，且唯一
    image_data BLOB,
    type VARCHAR(30)
)

CREATE TABLE leader (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    image_data BLOB,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

-- 创建反馈表
CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reply_content TEXT NULL,
    reply_at DATETIME NULL,
    replied_by INT NULL,
    FOREIGN KEY (replied_by) REFERENCES users1(id)
);

-- 创建索引
CREATE INDEX idx_feedback_status ON feedbacks(status);
CREATE INDEX idx_feedback_type ON feedbacks(type);
CREATE INDEX idx_feedback_created_at ON feedbacks(created_at);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '消息标题',
    content TEXT NOT NULL COMMENT '消息内容',
    type VARCHAR(50) DEFAULT 'system' COMMENT '消息类型：system, notification, announcement, warning, info',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    user_id INT NOT NULL COMMENT '接收用户ID',
    sender_id INT NULL COMMENT '发送者ID',
    sender_name VARCHAR(100) NULL COMMENT '发送者姓名',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 创建评论表
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL COMMENT '文章ID',
    user_id INT NOT NULL COMMENT '用户ID',
    username VARCHAR(100) NOT NULL COMMENT '用户名',
    content TEXT NOT NULL COMMENT '评论内容',
    parent_id INT NULL COMMENT '父评论ID，用于回复',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    reply_count INT DEFAULT 0 COMMENT '回复数',
    FOREIGN KEY (article_id) REFERENCES article_details(article_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- 创建评论表索引
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_is_deleted ON comments(is_deleted);