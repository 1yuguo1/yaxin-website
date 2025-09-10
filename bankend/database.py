import datetime
import os

from requests import session

import utils
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime, Boolean, create_engine, exists, update, \
    LargeBinary, Text, or_
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.inspection import inspect



import utils

Base = declarative_base()
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    name = Column(String)
    password = Column(String)
    created_at = Column(DateTime,default=datetime.datetime.now)
    last_login_at = Column(DateTime)
    is_active = Column(Boolean,default=True)
    is_admin = Column(Boolean,default=False)

class Sms(Base):
    __tablename__ = 'sms_verifications'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    code = Column(String)
    expires_at = Column(DateTime)
    sent_at = Column(DateTime,default=datetime.datetime.now)

class Admin(Base):
    __tablename__ = 'users1'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    password = Column(String,default='123456')
    role_id = Column(Integer)
    status = Column(String,default='active')
    created_at = Column(DateTime,default=datetime.datetime.now)
    last_login_at = Column(DateTime,default=None)

class Inform(Base):
    __tablename__ = 'usersInformation'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    avatar_url = Column(String)
    nickname = Column(String)
    real_name = Column(String)
    position = Column(String)
    phone_number = Column(String)
    email = Column(String)

class Image(Base):
    __tablename__ = 'images'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    image_data = Column(LargeBinary)
    type = Column(String)

class ArticleDetails(Base):
    __tablename__ = 'article_details'
    article_id = Column(Integer, primary_key=True, autoincrement=True, comment='文章ID')
    title = Column(String(255), nullable=False, comment='文章标题')
    content = Column(Text, nullable=False, comment='文章内容')
    author = Column(String(100), nullable=False, comment='作者')
    publish_time = Column(DateTime,default=datetime.datetime.now, nullable=False, comment='发布时间')
    update_time = Column(DateTime,default=datetime.datetime.now, nullable=False, comment='更新时间')
    category_id = Column(Integer, comment='分类ID，外键关联文章分类表')
    tags = Column(String(255), comment='标签，多个标签用逗号分隔')
    view_count = Column(Integer, default=0, comment='浏览量')
    like_count = Column(Integer, default=0, comment='点赞数')
    comment_count = Column(Integer, default=0, comment='评论数')
    is_published = Column(Integer, default=True, comment='是否发布，1表示已发布，0表示草稿')
    is_deleted = Column(Integer, default=False, comment='是否删除，1表示已删除，0表示正常')

class Leader(Base):
    __tablename__ = 'leader'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    role = Column(String)
    image_data = Column(LargeBinary)
    update_time = Column(DateTime,default=datetime.datetime.now)


# 在 database.py 中添加反馈相关模型
class Feedback(Base):
    __tablename__ = 'feedbacks'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), nullable=True)  # 用户名，字符串类型
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=False)
    type = Column(String(20), nullable=False)  # consultation, complaint, suggestion, other
    content = Column(Text, nullable=False)
    status = Column(String(20), default='unread')  # unread, read, replied
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)
    # 回复相关字段
    reply_content = Column(Text, nullable=True)
    reply_at = Column(DateTime, nullable=True)
    replied_by = Column(Integer, ForeignKey('users1.id'), nullable=True)


class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False, comment='消息标题')
    content = Column(Text, nullable=False, comment='消息内容')
    type = Column(String(50), default='system', comment='消息类型：system, notification, announcement, warning, info')
    is_read = Column(Boolean, default=False, comment='是否已读')
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, comment='接收用户ID')
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=True, comment='发送者ID')
    sender_name = Column(String(100), nullable=True, comment='发送者姓名')
    created_at = Column(DateTime, default=datetime.datetime.now, comment='创建时间')
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now, comment='更新时间')

# 在 database.py 中添加的评论表模型
class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey('article_details.article_id'), nullable=False, comment='文章ID')
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, comment='用户ID')
    username = Column(String(100), nullable=False, comment='用户名')
    content = Column(Text, nullable=False, comment='评论内容')
    parent_id = Column(Integer, ForeignKey('comments.id'), nullable=True, comment='父评论ID，用于回复')
    created_at = Column(DateTime, default=datetime.datetime.now, comment='创建时间')
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now, comment='更新时间')
    is_deleted = Column(Boolean, default=False, comment='是否删除')
    like_count = Column(Integer, default=0, comment='点赞数')
    reply_count = Column(Integer, default=0, comment='回复数')

# 从环境变量获取数据库配置
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USERNAME = os.getenv('DB_USERNAME', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'yaxin2.0')

# 构建数据库连接字符串
DATABASE_URL = f'mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def object_as_dict(obj):
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}

def insertSms(phoneNumber,code):
    session = Session()
    isExist = session.query(exists().where(Sms.username == phoneNumber)).scalar()
    if not isExist:
        data = Sms(username=phoneNumber, code=code, expires_at=datetime.datetime.now() + datetime.timedelta(minutes=4), sent_at=datetime.datetime.now())
        session.add(data)
        session.commit()
    else:
        new_data = session.query(Sms).where(Sms.username==phoneNumber).first()
        new_data.code = code
        new_data.expires_at = datetime.datetime.now() + datetime.timedelta(minutes=4)
        new_data.sent_at = datetime.datetime.now()
        session.commit()
    session.close()

def checkCode(phoneNumber,code):
    session = Session()
    isExist = session.query(exists().where(Sms.username == phoneNumber)).scalar()
    if isExist:
        rightCode = session.query(Sms.code).where(Sms.username==phoneNumber).first()
        rightTime = session.query(Sms.expires_at).where(Sms.code==code).first()
        if code==rightCode[0] and datetime.datetime.now()<rightTime[0]:
            session.close()
            return True
        else:
            print(1)
            session.close()
            return False
    else:
        session.close()
        return False

def regist(username,password):
    session = Session()
    isExist = session.query(exists().where(User.username == username)).scalar()
    if not isExist:
        try:
            data = User(username=username, password=password,name='用户'+utils.randName(),last_login_at=datetime.datetime.now())
            session.add(data)
            session.commit()
            session.close()
            return True
        except Exception as e:
            print(e)
            session.close()
            return False
    else:
        session.close()
        return False

def login(username,password):
    session = Session()
    isExist = session.query(exists().where(User.username == username)).scalar()
    if isExist:
        password_ = session.query(User.password).where(User.username == username).first()
        if password_[0]==password:
            session.close()
            return True
        else:
            session.close()
            return False
    else:
        session.close()
        return False

def getLoginMsg(user_id):
    session = Session()
    try:
        name = session.query(User.name).where(User.username == user_id).first()
        return name
    except Exception as e:
        print(e)
        return None

def createAdmin():
    session = Session()
    data = Admin(username=str(utils.randId()),role_id=1)
    session.add(data)
    session.commit()
    session.close()

def getInitData():
    session = Session()
    data = session.query(Admin).limit(8).all()
    result_dicts = [object_as_dict(admin) for admin in data]
    session.close()
    return result_dicts

def login_(username,password):
    session = Session()
    isExist = session.query(exists().where(Admin.username == username)).scalar()
    if isExist:
        password_ = session.query(Admin.password).where(Admin.username == username).first()
        status = session.query(Admin.status).where(Admin.username == username).first()
        if password_[0]==password and status[0]=='active':
            stmt = update(Admin).where(Admin.username == username).values(last_login_at=datetime.datetime.now())
            session.execute(stmt)
            session.commit()
            session.close()
            return True
        else:
            session.close()
            return False
    else:
        session.close()
        return False

def getTotal():
    session = Session()
    num = session.query(Admin).count()
    return num

def querypage(page):
    session = Session()
    page_size = 8
    offset = (page - 1) * page_size
    data = session.query(Admin).offset(offset).limit(page_size).all()
    result_dicts = [object_as_dict(admin) for admin in data]
    session.close()
    return result_dicts

def delete_(username):
    session = Session()
    session.query(Admin).where(Admin.username == username).delete()
    session.commit()
    session.close()

def changeStatus(username):
    session = Session()
    status = session.query(Admin.status).where(Admin.username == username).first()
    if status[0]=='active':
        stmt = update(Admin).where(Admin.username == username).values(status='inactive')
        session.execute(stmt)
        session.commit()
        session.close()
    else:
        stmt = update(Admin).where(Admin.username == username).values(status='active')
        session.execute(stmt)
        session.commit()
        session.close()

def queryRole(username):
    session = Session()
    role = session.query(Admin.role_id).where(Admin.username == username).first()
    return role[0]

def addInform(username,avatar_url,nickname,real_name,position,phone_number,email):
    session = Session()
    isExist = session.query(exists().where(Inform.username == username)).scalar()
    if isExist:
        stmt = update(Inform).where(Inform.username == username).values(avatar_url=avatar_url,nickname=nickname,real_name=real_name,position=position,phone_number=phone_number,email=email)
        session.execute(stmt)
        session.commit()
        session.close()
    else:
        data = Inform(username=username,avatar_url=avatar_url,nickname=nickname,real_name=real_name,position=position,phone_number=phone_number,email=email)
        session.add(data)
        session.commit()
        session.close()

def upImage(username,image_data,type):
    session = Session()
    data = Image(username=username,image_data=image_data,type=type)
    session.add(data)
    session.commit()
    session.close()

def getInform(username):
    session = Session()
    isExist = session.query(exists().where(Inform.username == username)).scalar()
    if isExist:
        data = session.query(Inform).where(Inform.username == username).first()
        result_dict = object_as_dict(data)
        return result_dict
    else:
        return {'username': '', 'avatar_url': '', 'nickname': '', 'real_name': '', 'position': '', 'phone_number': '', 'email': ''}

def getImageData(username):
    session = Session()
    isExist = session.query(exists().where(Image.username == username)).scalar()
    if isExist:
        data = session.query(Image.image_data).where(Image.username == username).first()
        return data[0]
    else:
        return None

def changePassword(username,old,new):
    session = Session()
    password = session.query(Admin.password).where(Admin.username == username).first()
    if password[0]==old:
        stmt = update(Admin).where(Admin.username == username).values(password=new)
        session.execute(stmt)
        session.commit()
        session.close()
        return True
    else:
        session.close()
        return False


def insert_article(title: str,content: str,author: str,publish_time: datetime= datetime.datetime.now(),update_time :datetime = datetime.datetime.now(),category_id: int = None,tags: str = None,view_count: int = 0,like_count: int = 0,comment_count: int = 0,is_published: int = 1,is_deleted: int = 0):
    # 创建数据库会话
    session = Session()
    try:
        isExist = session.query(exists().where(ArticleDetails.tags==tags)).scalar()
        if not isExist or category_id != 1:
            new_article = ArticleDetails(title=title,content=content,author=author,publish_time=publish_time,update_time=update_time,category_id=category_id,tags=tags,view_count=view_count,like_count=like_count,comment_count=comment_count,is_published=is_published,is_deleted=is_deleted)
            session.add(new_article)
            session.commit()
            print("文章插入成功！")
        else:
            stmt = update(ArticleDetails).where(ArticleDetails.tags==tags).values(title=title,content=content,author=author)
            session.execute(stmt)
            session.commit()
            session.close()
    except Exception as e:
        # 如果发生错误，回滚事务
        session.rollback()
        print(f"插入文章时发生错误：{e}")
    finally:
        # 关闭会话
        session.close()

def query_article(category_id,page,enum):
    page_size = 8
    session = Session()
    offset = (page - 1) * page_size
    if enum == 0:
        if category_id == 1:
            data = session.query(ArticleDetails).where(ArticleDetails.category_id==category_id,ArticleDetails.is_deleted==0).order_by(ArticleDetails.tags).offset(offset).limit(page_size).all()
        else:
            data = session.query(ArticleDetails).where(ArticleDetails.category_id==category_id,ArticleDetails.is_deleted==0).offset(offset).limit(page_size).all()
    else:
        if category_id == 1:
            data = session.query(ArticleDetails).where(ArticleDetails.category_id==category_id,ArticleDetails.is_deleted==0,ArticleDetails.is_published ==1).order_by(ArticleDetails.tags).offset(offset).limit(page_size).all()
        else:
            data = session.query(ArticleDetails).where(ArticleDetails.category_id==category_id,ArticleDetails.is_deleted==0,ArticleDetails.is_published ==1).offset(offset).limit(page_size).all()
    result_dicts = [object_as_dict(admin) for admin in data]
    session.close()
    return result_dicts

def update_article(article_id,title,content,is_published):
    session = Session()
    isExist = session.query(exists().where(ArticleDetails.article_id == article_id)).scalar()
    if isExist:
        stmt = update(ArticleDetails).where(ArticleDetails.article_id==article_id).values(title=title,content=content,is_published=is_published)
        session.execute(stmt)
        session.commit()
        session.close()
        return True
    else:
        session.close()
        return False


def update_password(tel,password):
    session = Session()
    isExist = session.query(exists().where(User.username==tel)).scalar()
    if isExist:
        stmt = update(User).where(User.username==tel).values(password=password)
        session.execute(stmt)
        session.commit()
        session.close()
        return True
    else:
        session.close()
        return False

def delete_article(article_id):
    session = Session()
    isExist = session.query(exists().where(ArticleDetails.article_id == article_id)).scalar()
    if isExist:
        stmt = update(ArticleDetails).where(ArticleDetails.article_id==article_id).values(is_deleted=1)
        session.execute(stmt)
        session.commit()
        session.close()
        return True
    else:
        session.close()
        return False

def article_total(category_id):
    session = Session()
    num = session.query(ArticleDetails).where(ArticleDetails.category_id==category_id).count()
    session.close()
    return num

def add_leader(name,role,image_data):
    session = Session()
    data = Leader(name=name,role=role,image_data=image_data)
    session.add(data)
    session.commit()
    session.close()

def delete_leader(id):
    session = Session()
    session.query(Leader).where(Leader.id == id).delete()
    session.commit()
    session.close()
    return True

def edit_leader(id,name,role,image_data):
    session = Session()
    isExist = session.query(exists().where(Leader.id == id)).scalar()
    if isExist:
        stmt = update(Leader).where(Leader.id == id).values(name=name,role=role,image_data=image_data)
        session.execute(stmt)
        session.commit()
        session.close()
        return True
    else:
        session.close()
        return False

def getLeader():
    session = Session()
    data = session.query(Leader.id,Leader.name,Leader.role).order_by(Leader.id).all()
    result = [i._asdict() for i in data]
    session.close()
    return result

def getImageData1(id):
    session = Session()
    image_data = session.query(Leader.image_data).where(Leader.id == id).first()
    session.close()
    return image_data[0]

def getHot():
    session = Session()
    data = session.query(ArticleDetails).where(ArticleDetails.category_id==3).order_by(ArticleDetails.view_count.desc()).limit(10)
    result_dict = [object_as_dict(i) for i in data]
    session.close()
    return result_dict

def search(keyword):
    session = Session()
    query = session.query(ArticleDetails).filter(ArticleDetails.title.like(f"%{keyword}%")).limit(8)
    result_dict = [object_as_dict(i) for i in query]
    session.close()
    return result_dict


# 在 database.py 中添加反馈相关函数

def insert_feedback(username=None, user_name=None, user_email=None, type=None, content=None):
    """插入反馈"""
    session = Session()
    try:
        data = Feedback(
            username=username,  # 添加username字段
            user_name=user_name,
            user_email=user_email,
            type=type,
            content=content
        )
        session.add(data)
        session.commit()
        return data.id
    except Exception as e:
        print(f"插入反馈失败: {e}")
        session.rollback()
        return None
    finally:
        session.close()


def query_feedback(page=1, page_size=10, status=None, type=None, keyword=None):
    """查询反馈列表"""
    session = Session()
    try:
        query = session.query(Feedback)

        # 状态筛选
        if status:
            query = query.filter(Feedback.status == status)

        # 类型筛选
        if type:
            query = query.filter(Feedback.type == type)

        # 关键词搜索（包含username字段）
        if keyword:
            query = query.filter(
                or_(
                    Feedback.username.contains(keyword),  # 添加username搜索
                    Feedback.user_name.contains(keyword),
                    Feedback.user_email.contains(keyword),
                    Feedback.content.contains(keyword)
                )
            )

        # 总数
        total = query.count()

        # 分页
        offset = (page - 1) * page_size
        data = query.order_by(Feedback.created_at.desc()).offset(offset).limit(page_size).all()
        result_dicts = [object_as_dict(feedback) for feedback in data]

        session.close()
        return result_dicts, total
    except Exception as e:
        print(f"查询反馈失败: {e}")
        session.close()
        return [], 0


def get_feedback_by_id(feedback_id):
    """根据ID获取反馈详情"""
    session = Session()
    try:
        data = session.query(Feedback).filter(Feedback.id == feedback_id).first()
        if data:
            result_dict = object_as_dict(data)
            session.close()
            return result_dict
        else:
            session.close()
            return None
    except Exception as e:
        print(f"获取反馈详情失败: {e}")
        session.close()
        return None


def update_feedback_status(feedback_id, status):
    """更新反馈状态"""
    session = Session()
    try:
        isExist = session.query(exists().where(Feedback.id == feedback_id)).scalar()
        if isExist:
            stmt = update(Feedback).where(Feedback.id == feedback_id).values(
                status=status,
                updated_at=datetime.datetime.now()
            )
            session.execute(stmt)
            session.commit()
            session.close()
            return True
        else:
            session.close()
            return False
    except Exception as e:
        print(f"更新反馈状态失败: {e}")
        session.close()
        return False


def search_feedback(keyword=None, status=None, type=None, page=1, page_size=10):
    """搜索反馈的核心逻辑"""
    session = Session()
    try:
        # 构建基础查询
        query = session.query(Feedback)

        # 关键词搜索（支持模糊匹配，包含username字段）
        if keyword:
            keyword_filter = or_(
                Feedback.username.like(f'%{keyword}%'),  # 添加username搜索
                Feedback.user_name.like(f'%{keyword}%'),
                Feedback.user_email.like(f'%{keyword}%'),
                Feedback.content.like(f'%{keyword}%')
            )
            query = query.filter(keyword_filter)

        # 状态筛选
        if status and status in ['unread', 'read', 'replied']:
            query = query.filter(Feedback.status == status)

        # 类型筛选
        if type and type in ['consultation', 'complaint', 'suggestion', 'other']:
            query = query.filter(Feedback.type == type)

        # 排序（按创建时间倒序）
        query = query.order_by(Feedback.created_at.desc())

        # 分页
        offset = (page - 1) * page_size
        feedbacks = query.offset(offset).limit(page_size).all()

        # 获取总数
        total = query.count()

        # 转换为字典格式
        result_dicts = [object_as_dict(feedback) for feedback in feedbacks]

        return result_dicts, total

    except Exception as e:
        print(f"搜索反馈时发生错误：{e}")
        return [], 0
    finally:
        session.close()


def reply_feedback(feedback_id, reply_content, replied_by):
    """回复反馈"""
    session = Session()
    try:
        isExist = session.query(exists().where(Feedback.id == feedback_id)).scalar()
        if isExist:
            stmt = update(Feedback).where(Feedback.id == feedback_id).values(
                reply_content=reply_content,
                reply_at=datetime.datetime.now(),
                replied_by=replied_by,
                status='replied',
                updated_at=datetime.datetime.now()
            )
            session.execute(stmt)
            session.commit()
            session.close()
            return True
        else:
            session.close()
            return False
    except Exception as e:
        print(f"回复反馈失败: {e}")
        session.close()
        return False


def mark_all_feedback_read():
    """批量标记为已读"""
    session = Session()
    try:
        stmt = update(Feedback).where(Feedback.status == 'unread').values(
            status='read',
            updated_at=datetime.datetime.now()
        )
        result = session.execute(stmt)
        session.commit()
        session.close()
        return result.rowcount
    except Exception as e:
        print(f"批量标记失败: {e}")
        session.close()
        return 0


def delete_feedback(feedback_id):
    """删除反馈"""
    session = Session()
    try:
        isExist = session.query(exists().where(Feedback.id == feedback_id)).scalar()
        if isExist:
            session.query(Feedback).filter(Feedback.id == feedback_id).delete()
            session.commit()
            session.close()
            return True
        else:
            session.close()
            return False
    except Exception as e:
        print(f"删除反馈失败: {e}")
        session.close()
        return False


def get_feedback_stats():
    """获取反馈统计"""
    session = Session()
    try:
        total = session.query(Feedback).count()
        unread = session.query(Feedback).filter(Feedback.status == 'unread').count()
        read = session.query(Feedback).filter(Feedback.status == 'read').count()
        replied = session.query(Feedback).filter(Feedback.status == 'replied').count()

        # 按类型统计
        consultation = session.query(Feedback).filter(Feedback.type == 'consultation').count()
        complaint = session.query(Feedback).filter(Feedback.type == 'complaint').count()
        suggestion = session.query(Feedback).filter(Feedback.type == 'suggestion').count()
        other = session.query(Feedback).filter(Feedback.type == 'other').count()

        session.close()
        return {
            'total': total,
            'unread': unread,
            'read': read,
            'replied': replied,
            'by_type': {
                'consultation': consultation,
                'complaint': complaint,
                'suggestion': suggestion,
                'other': other
            }
        }
    except Exception as e:
        print(f"获取统计失败: {e}")
        session.close()
        return {
            'total': 0,
            'unread': 0,
            'read': 0,
            'replied': 0,
            'by_type': {'consultation': 0, 'complaint': 0, 'suggestion': 0, 'other': 0}
        }


def get_messages(user_id, page=1, page_size=10, status=None, type=None, keyword=None):
    """获取用户消息列表"""
    session = Session()
    try:
        query = session.query(Message).filter(Message.user_id == user_id)

        # 状态筛选
        if status == 'read':
            query = query.filter(Message.is_read == True)
        elif status == 'unread':
            query = query.filter(Message.is_read == False)

        # 类型筛选
        if type:
            query = query.filter(Message.type == type)

        # 关键词搜索
        if keyword:
            query = query.filter(
                (Message.title.contains(keyword)) |
                (Message.content.contains(keyword))
            )

        # 分页
        total = query.count()
        offset = (page - 1) * page_size
        messages = query.order_by(Message.created_at.desc()).offset(offset).limit(page_size).all()

        result = []
        for msg in messages:
            result.append({
                'id': msg.id,
                'title': msg.title,
                'content': msg.content,
                'type': msg.type,
                'is_read': msg.is_read,
                'created_at': msg.created_at.isoformat(),
                'updated_at': msg.updated_at.isoformat(),
                'user_id': msg.user_id,
                'sender_id': msg.sender_id,
                'sender_name': msg.sender_name
            })

        return {
            'data': result,
            'total': total,
            'page': page,
            'page_size': page_size
        }
    except Exception as e:
        raise e
    finally:
        session.close()


def get_message_detail(message_id, user_id):
    """获取消息详情"""
    session = Session()
    try:
        message = session.query(Message).filter(
            Message.id == message_id,
            Message.user_id == user_id
        ).first()

        if not message:
            return None

        return {
            'id': message.id,
            'title': message.title,
            'content': message.content,
            'type': message.type,
            'is_read': message.is_read,
            'created_at': message.created_at.isoformat(),
            'updated_at': message.updated_at.isoformat(),
            'user_id': message.user_id,
            'sender_id': message.sender_id,
            'sender_name': message.sender_name
        }
    except Exception as e:
        raise e
    finally:
        session.close()


def mark_message_as_read(message_id, user_id):
    """标记消息为已读"""
    session = Session()
    try:
        message = session.query(Message).filter(
            Message.id == message_id,
            Message.user_id == user_id
        ).first()

        if not message:
            return False

        message.is_read = True
        message.updated_at = datetime.datetime.now()
        session.commit()
        return True
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def mark_all_messages_as_read(user_id):
    """批量标记为已读"""
    session = Session()
    try:
        session.query(Message).filter(
            Message.user_id == user_id,
            Message.is_read == False
        ).update({
            'is_read': True,
            'updated_at': datetime.datetime.now()
        })
        session.commit()
        return True
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def delete_message(message_id, user_id):
    """删除消息"""
    session = Session()
    try:
        message = session.query(Message).filter(
            Message.id == message_id,
            Message.user_id == user_id
        ).first()

        if not message:
            return False

        session.delete(message)
        session.commit()
        return True
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def get_message_stats(user_id):
    """获取消息统计"""
    session = Session()
    try:
        total = session.query(Message).filter(Message.user_id == user_id).count()
        unread = session.query(Message).filter(
            Message.user_id == user_id,
            Message.is_read == False
        ).count()
        read = total - unread

        return {
            'total': total,
            'unread': unread,
            'read': read
        }
    except Exception as e:
        raise e
    finally:
        session.close()


def create_message(title, content, type, user_id, sender_id=None, sender_name=None):
    """创建消息"""
    session = Session()
    try:
        message = Message(
            title=title,
            content=content,
            type=type,
            user_id=user_id,
            sender_id=sender_id,
            sender_name=sender_name
        )
        session.add(message)
        session.commit()
        return message.id
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def get_user_id_by_username(username):
    """根据用户名查找用户ID"""
    try:
        session = Session()
        user = session.query(User).filter(User.username == username).first()
        return user.id if user else None
    except Exception as e:
        print(f"查找用户失败: {e}")
        return None


# 在 database.py 中添加的评论相关数据库函数

def get_user_username_by_id(user_id):
    """根据用户ID获取用户名"""
    try:
        session = Session()
        user = session.query(User).filter(User.id == user_id).first()
        return user.username if user else None
    except Exception as e:
        print(f"获取用户名失败: {e}")
        return None


def get_comments(article_id, page=1, page_size=10, parent_id=None):
    """获取评论列表"""
    session = Session()
    try:
        query = session.query(Comment).filter(
            Comment.article_id == article_id,
            Comment.is_deleted == False
        )

        # 如果指定了parent_id，获取回复评论
        if parent_id is not None:
            query = query.filter(Comment.parent_id == parent_id)
        else:
            # 获取主评论（parent_id为None）
            query = query.filter(Comment.parent_id == None)

        # 总数
        total = query.count()

        # 分页
        offset = (page - 1) * page_size
        comments = query.order_by(Comment.created_at.desc()).offset(offset).limit(page_size).all()

        result = []
        for comment in comments:
            result.append({
                'id': comment.id,
                'article_id': comment.article_id,
                'user_id': comment.user_id,
                'username': comment.username,
                'content': comment.content,
                'parent_id': comment.parent_id,
                'created_at': comment.created_at.isoformat(),
                'updated_at': comment.updated_at.isoformat(),
                'is_deleted': comment.is_deleted,
                'like_count': comment.like_count,
                'reply_count': comment.reply_count
            })

        session.close()
        return result, total
    except Exception as e:
        print(f"获取评论失败: {e}")
        session.close()
        return [], 0


def create_comment(article_id, user_id, username, content, parent_id=None):
    """创建评论"""
    session = Session()
    try:
        comment = Comment(
            article_id=article_id,
            user_id=user_id,
            username=username,
            content=content,
            parent_id=parent_id
        )
        session.add(comment)
        session.commit()

        # 如果是回复评论，更新父评论的回复数
        if parent_id:
            parent_comment = session.query(Comment).filter(Comment.id == parent_id).first()
            if parent_comment:
                parent_comment.reply_count += 1
                session.commit()

        return comment.id
    except Exception as e:
        session.rollback()
        print(f"创建评论失败: {e}")
        return None
    finally:
        session.close()


def delete_comment(comment_id, user_id):
    """删除评论（软删除）"""
    session = Session()
    try:
        comment = session.query(Comment).filter(
            Comment.id == comment_id,
            Comment.user_id == user_id,
            Comment.is_deleted == False
        ).first()

        if not comment:
            return False

        # 软删除
        comment.is_deleted = True
        comment.updated_at = datetime.datetime.now()

        # 如果是主评论，同时删除其所有回复
        if comment.parent_id is None:
            session.query(Comment).filter(
                Comment.parent_id == comment_id,
                Comment.is_deleted == False
            ).update({
                'is_deleted': True,
                'updated_at': datetime.datetime.now()
            })

        session.commit()
        return True
    except Exception as e:
        session.rollback()
        print(f"删除评论失败: {e}")
        return False
    finally:
        session.close()


def like_comment(comment_id, user_id):
    """点赞评论"""
    session = Session()
    try:
        comment = session.query(Comment).filter(
            Comment.id == comment_id,
            Comment.is_deleted == False
        ).first()

        if not comment:
            return False

        # 这里可以添加防重复点赞的逻辑
        # 简单实现：直接增加点赞数
        comment.like_count += 1
        comment.updated_at = datetime.datetime.now()
        session.commit()

        return True
    except Exception as e:
        session.rollback()
        print(f"点赞评论失败: {e}")
        return False
    finally:
        session.close()


def get_comment_stats(article_id):
    """获取评论统计"""
    session = Session()
    try:
        # 主评论数
        main_comments = session.query(Comment).filter(
            Comment.article_id == article_id,
            Comment.parent_id == None,
            Comment.is_deleted == False
        ).count()

        # 回复数
        replies = session.query(Comment).filter(
            Comment.article_id == article_id,
            Comment.parent_id != None,
            Comment.is_deleted == False
        ).count()

        session.close()
        return {
            'total_comments': main_comments,
            'total_replies': replies,
            'total_all': main_comments + replies
        }
    except Exception as e:
        print(f"获取评论统计失败: {e}")
        session.close()
        return {
            'total_comments': 0,
            'total_replies': 0,
            'total_all': 0
        }


def update_article_view_count(article_id):
    """更新文章浏览数"""
    session = Session()
    try:
        article = session.query(ArticleDetails).filter(
            ArticleDetails.article_id == article_id,
            ArticleDetails.is_deleted == False
        ).first()

        if not article:
            return False

        article.view_count += 1
        article.updated_time = datetime.datetime.now()
        session.commit()

        return True
    except Exception as e:
        session.rollback()
        print(f"更新浏览数失败: {e}")
        return False
    finally:
        session.close()


def update_article_comment_count(article_id):
    """更新文章评论数"""
    session = Session()
    try:
        # 计算当前评论数
        comment_count = session.query(Comment).filter(
            Comment.article_id == article_id,
            Comment.is_deleted == False
        ).count()

        # 更新文章评论数
        article = session.query(ArticleDetails).filter(
            ArticleDetails.article_id == article_id
        ).first()

        if article:
            article.comment_count = comment_count
            article.updated_time = datetime.datetime.now()
            session.commit()

        return True
    except Exception as e:
        session.rollback()
        print(f"更新评论数失败: {e}")
        return False
    finally:
        session.close()
if __name__ == '__main__':
    # 示例用法，请替换为实际的用户名
    print(get_user_id_by_username('your_username_here'))
