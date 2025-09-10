import datetime
import io
import os.path
import shutil
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, File, UploadFile, Form, Response, Query, HTTPException, Header
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import aliyun
import logging
import database
import utils

# 加载环境变量
try:
    from load_env import load_env_file
    load_env_file()
except ImportError:
    print("警告: 无法加载环境变量文件，请确保已配置环境变量")

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Item(BaseModel):
    phoneNumber: str

class Item1(BaseModel):
    captchaVerifyParam:str

class Item2(BaseModel):
    username:str
    password:str
    code:str

class Item3(BaseModel):
    username:str
    password:str

class Item4(BaseModel):
    token:str

class Item5(BaseModel):
    username:str
    avatar_url:str
    nickname:str
    real_name:str
    position:str
    phone_number:str
    email:str

class Item6(BaseModel):
    username:str
    old:str
    new:str

class Item7(BaseModel):
    title: str
    content: str
    author: str
    category_id: int
    tags: str
    is_published: int = 1

class Item8(BaseModel):
    article_id: int
    title: str
    content: str
    is_published: int

class Item9(BaseModel):
    id: int=-1
    name: str
    role: str

class Item10(BaseModel):
    username: str
    code: int
    password: str

class Item11(BaseModel):
    username: Optional[str] = None  # 用户名，可选字段
    user_name: str
    user_email: str
    type: str
    content: str

class Item12(BaseModel):
    content: str

class FeedbackSearchParams(BaseModel):
    keyword: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    page: int = 1
    page_size: int = 10

class MessageCreate(BaseModel):
    title: str
    content: str
    type: str = 'system'
    username: str  # 目标用户名
    sender_id: Optional[int] = None
    sender_name: Optional[str] = None
    feedback_id: Optional[int] = None

class MessageBatchCreate(BaseModel):
    title: str
    content: str
    type: str = 'system'
    target_user_ids: Optional[List[int]] = None

# 在 main.py 中添加的评论相关数据模型
class CommentCreate(BaseModel):
    article_id: int
    content: str
    parent_id: Optional[int] = None

class CommentUpdate(BaseModel):
    content: str
@app.post("/vaidcode")
def getVaidCode(Item: Item):
    phoneNumber = Item.phoneNumber

@app.post("/aliyunvaid")
def getAliyunVaidCode(Item: Item1):
    try:
        result = aliyun.Sample.main(Item.captchaVerifyParam)
        logging.info(result)
        return {'code':200,'result':result}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/phonecode/{phoneNumber}")
def getPhoneCode(phoneNumber:str):
    try:
        result,code = aliyun.Sample.main_(phoneNumber)
        database.insertSms(phoneNumber,code)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/regist")
def register(Item: Item2):
    try:
        # if not database.checkCode(Item.username,Item.code):
        #     return {'code':202,'msg':'验证码错误'}
        result = database.regist(Item.username,Item.password)
        if result:
            return {'code':200,'msg':'ok'}
        else:
            return {'code':203,'msg':'注册失败'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/login")
def login(Item: Item3):
    try:
        result = database.login(Item.username,Item.password)
        if result:
            token = utils.generate_jwt_token(database.get_user_id_by_username(Item.username),Item.username)
            return {'code':200,'msg':'ok','token':token}
        else:
            return {'code':201,'msg':'账号或密码错误'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/loginmsg")
def getLoginMsg(Item: Item4):
    try:
        result = utils.getLoginMsg(Item.token)
        if result==0:
            return {'code':204,'msg':'验证码已过期'}
        elif result==1:
            return {'code':205,'msg':'令牌无效'}
        else:
            username = result['username']
            name = database.getLoginMsg(username)[0]
            return {'code':200,'msg':'ok','user_id':username,'name':name}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/filea")
async def filea(file:UploadFile=File(...),username:str = Form(...)):
    path = f'input/{username}'
    if not os.path.exists(path):
        os.mkdir(path)
    with open(path + '/file0.xlsx','wb') as f:
        shutil.copyfileobj(file.file,f)
    return {'code':200,'msg':'ok'}

@app.post("/fileb")
async def filea(file:UploadFile=File(...),username:str = Form(...)):
    path = f'input/{username}'
    if not os.path.exists(path):
        os.mkdir(path)
    with open(path + '/file1.xlsx','wb') as f:
        shutil.copyfileobj(file.file,f)
    return {'code':200,'msg':'ok'}

@app.post("/filec")
async def filea(file:UploadFile=File(...),username:str = Form(...)):
    path = f'input/{username}'
    if not os.path.exists(path):
        os.mkdir(path)
    with open(path + '/file2.xlsx','wb') as f:
        shutil.copyfileobj(file.file,f)
    return {'code':200,'msg':'ok'}

@app.get("/viewdata/{username}/{enum}")
def getformdata(username:str,enum:int):
    path = f'input/{username}'
    if enum==1:
        if not os.path.exists(path + '/file0.xlsx'):
            return {'code':300,'msg':'文件不存在'}
        array_ = utils.getArray(path + '/file0.xlsx',1)
        return {'code':200,'msg':'ok','data':array_}
    elif enum==2:
        if not os.path.exists(path + '/file1.xlsx'):
            return {'code':300,'msg':'文件不存在'}
        array_ = utils.getArray(path + '/file1.xlsx',2)
        return {'code':200,'msg':'ok','data':array_}
    else:
        if not os.path.exists(path + '/file2.xlsx'):
            return {'code':300,'msg':'文件不存在'}
        array_ = utils.getArray(path + '/file2.xlsx',3)
        return {'code':200,'msg':'ok','data':array_}

@app.get("/report/{username}")
def getReport(username:str):
    path = f'output/{username}'
    if not os.path.exists(path):
        os.mkdir(path)
    if not os.path.exists(f'input/{username}/file0.xlsx') or not os.path.exists(f'input/{username}/file1.xlsx'):
        return {'code': 300, 'msg': '文件不存在'}
    utils.getReport(username)
    return {'code':200,'msg':'ok'}

@app.get("/reportfile/{username}")
def getReportFile(username):
    if not os.path.exists(f'output/{username}/output.docx'):
        return {'code': 300, 'msg': '文件不存在'}
    return FileResponse(f'output/{username}/output.docx',media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

@app.get("/createadmin")
def createad():
    try:
        database.createAdmin()
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/initadmin")
def initadmin():
    try:
        data = database.getInitData()
        return {'code':200,'msg':'ok','data':data}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/mlogin")
def login(Item: Item3):
    try:
        result = database.login_(Item.username,Item.password)
        if result:
            token = utils.generate_jwt_token(Item.username)
            return {'code':200,'msg':'ok','token':token}
        else:
            return {'code':201,'msg':'账号或密码错误'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/loginmsgm")
def getLoginMsg(Item: Item4):
    try:
        result = utils.getLoginMsg(Item.token)
        if result==0:
            return {'code':204,'msg':'验证码已过期'}
        elif result==1:
            return {'code':205,'msg':'令牌无效'}
        else:
            user_id = result['user_id']
            return {'code':200,'msg':'ok','user_id':user_id}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/total")
def getTotal():
    num = database.getTotal()
    return {'code':200,'msg':'ok','total':num}

@app.get("/page/{page}")
def getPage(page:int):
    try:
        data = database.querypage(page)
        return {'code':200,'msg':'ok','data':data}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/delete/{username}")
def deleteUser(username:str):
    try:
        database.delete_(username)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/status/{username}")
def changeStatus(username):
    try:
        database.changeStatus(username)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/role/{username}")
def getRole(username:str):
    try:
        role_id = database.queryRole(username)
        return {'code':200,'msg':'ok','role_id':role_id}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/addInform")
def addInform(Item: Item5):
    try:
        database.addInform(Item.username,Item.avatar_url,Item.nickname,Item.real_name,Item.position,Item.phone_number,Item.email)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/upImage")
async def upImage(file:UploadFile = File(...),username:str = Form(...),type:str = Form(...)):
    try:
        image_data = await file.read()
        database.upImage(username,image_data,type)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/inform/{username}")
def getInform(username:str):
    try:
        data = database.getInform(username)
        return {'code':200,'msg':'ok','data':data}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/image/{username}")
def getImage(username:str):
    try:
        data = io.BytesIO(database.getImageData(username))
        if data is not None:
            return Response(content=data, media_type="image/png")
        else:
            return FileResponse('test.png')
    except:
        return FileResponse('test.png')

@app.post("/changePass")
def changePass(Item: Item6):
    try:
        res = database.changePassword(Item.username,Item.old,Item.new)
        if res == True:
            return {'code':200,'msg':'ok'}
        else:
            return {'code':211,'msg':'failed'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/carticle")
def createArticle(Item: Item7):
    try:
        database.insert_article(Item.title,Item.content,Item.author,category_id=Item.category_id,tags=Item.tags,is_published=Item.is_published)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/articleData/{category_id}/{page}")
def getArticleData(category_id:int,page:int,enum:int=0):
    try:
        data = database.query_article(category_id,page,enum)
        return {'code':200,'msg':'ok','data':data}
    except:
        return {'code':211,'msg':'failed','data':[]}

@app.post("/updateArticle")
def update_article(Item: Item8):
    try:
        res = database.update_article(Item.article_id,Item.title,Item.content,Item.is_published)
        if res == True:
            return {'code':200,'msg':'ok'}
        else:
            return {'code':211,'msg':'failed'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/deleteArticle/{article_id}")
def deleteArticle(article_id:int):
    try:
        res = database.delete_article(article_id)
        if res == True:
            return {'code':200,'msg':'ok'}
        else:
            return {'code':211,'msg':'failed'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/articleTotal/{category_id}")
def getArticleData(category_id:int):
    try:
        ans = database.article_total(category_id)
        return {'code':200,'msg':'ok','data':ans}
    except Exception as e:
        return {'code':400,'error':str(e),'data':0}

@app.post("/addLeader")
async def addLeader(file:UploadFile = File(...),name:str = Form(...),role:str = Form(...)):
    try:
        image_data =await file.read()
        database.add_leader(name,role,image_data)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.post("/upLeader")
async def upLeader(file:UploadFile = File(...),id:int = Form(...),name:str = Form(...),role:str = Form(...)):
    try:
        image_data =await file.read()
        database.edit_leader(id,name,role,image_data)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/dleader/{id}")
def getLeader(id:int):
    try:
        database.delete_leader(id)
        return {'code':200,'msg':'ok'}
    except Exception as e:
        return {'code':400,'error':str(e)}

@app.get("/leaderData")
def getLeaderData():
    try:
        data = database.getLeader()
        return {'code':200,'msg':'ok','data':data}
    except Exception as e:
        return {'code':400,'error':str(e),'data':[]}

@app.get("/imagel/{id}")
def getImage(id:int):
    data = database.getImageData1(id)
    return Response(content=data, media_type="image/png")

@app.get("/hot")
def getHot():
    try:
        data = database.getHot()
        return {'code':200,'msg':'ok','data':data}
    except:
        return {'code':211,'msg':'failed','data':[]}

@app.get("/search")
def getSearch(keyword:str):
    try:
        data = database.search(keyword)
        return {'code':200,'msg':'ok','data':data}
    except:
        return {'code':211,'msg':'failed','data':[]}

@app.get("/reset-password")
def resetPassword(Item:Item10):
    try:
        if database.checkCode(Item.username,Item.code):
            res = database.update_password(Item.username,Item.password)
            if res == True:
                return {'code':200,'msg':'ok'}
            else:
                return {'code':211,'msg':'failed'}
        else:
            return {'code':400,'msg':'failed'}
    except Exception as e:
        return {'code':400,'error':str(e)}


@app.post("/feedback")
def create_feedback(Item: Item11):
    try:
        result = database.insert_feedback(
            username=Item.username,  # 传递用户名
            user_name=Item.user_name,
            user_email=Item.user_email,
            type=Item.type,
            content=Item.content
        )
        return {'code': 200, 'msg': '反馈创建成功', 'data': {'feedback_id': result}}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


# 添加搜索接口
@app.get("/feedback/search")
def search_feedback_api(
        keyword: Optional[str] = Query(None, description="搜索关键词"),
        status: Optional[str] = Query(None, description="反馈状态"),
        type: Optional[str] = Query(None, description="反馈类型"),
        page: int = Query(1, ge=1, description="页码"),
        pageSize: int = Query(10, ge=1, le=100, description="每页数量"),
        authorization: Optional[str] = Header(None, description="Bearer token")
):
    """搜索反馈接口"""
    try:
        # 从Authorization头部提取token
        token = None
        if authorization and authorization.startswith('Bearer '):
            token = authorization[7:]  # 移除 "Bearer " 前缀

        if not token:
            return {'code': 401, 'msg': '缺少认证token'}

        # 验证管理员token
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        # 参数验证
        if status and status not in ['unread', 'read', 'replied']:
            return {'code': 400, 'msg': '无效的状态值'}

        if type and type not in ['consultation', 'complaint', 'suggestion', 'other']:
            return {'code': 400, 'msg': '无效的类型值'}

        # 执行搜索
        feedbacks, total = database.search_feedback(
            keyword=keyword,
            status=status,
            type=type,
            page=page,
            page_size=pageSize
        )

        # 计算总页数
        total_pages = (total + pageSize - 1) // pageSize

        return {
            'code': 200,
            'msg': '搜索成功',
            'data': feedbacks,
            'total': total,
            'page': page,
            'page_size': pageSize,
            'total_pages': total_pages
        }

    except Exception as e:
        return {'code': 500, 'msg': f'服务器内部错误: {str(e)}'}

@app.get("/feedback/list")
def get_feedback_list(
        page: int = 1,
        page_size: int = 10,
        status: str = None,
        type: str = None,
        keyword: str = None
):
    """获取反馈列表（管理员接口）"""
    try:
        data, total = database.query_feedback(page, page_size, status, type, keyword)
        return {
            'code': 200,
            'msg': 'ok',
            'data': data,
            'total': total,
            'page': page,
            'page_size': page_size
        }
    except Exception as e:
        return {'code': 400, 'error': str(e), 'data': [], 'total': 0}


@app.get("/feedback/{feedback_id}")
def get_feedback_detail(feedback_id: int):
    """获取反馈详情"""
    try:
        data = database.get_feedback_by_id(feedback_id)
        if data:
            return {'code': 200, 'msg': 'ok', 'data': data}
        else:
            return {'code': 404, 'msg': '反馈不存在'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.put("/feedback/{feedback_id}/reply")
def reply_feedback(feedback_id: int, Item: Item12):
    """回复反馈"""
    try:
        # 这里需要从token中获取当前用户ID，简化处理
        replied_by = 1  # 实际应该从token解析

        result = database.reply_feedback(feedback_id, Item.content, replied_by)
        if result:
            return {'code': 200, 'msg': '回复发送成功'}
        else:
            return {'code': 211, 'msg': '回复失败'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.put("/feedback/{feedback_id}/read")
def mark_feedback_read(feedback_id: int):
    """标记反馈为已读"""
    try:
        result = database.update_feedback_status(feedback_id, 'read')
        if result:
            return {'code': 200, 'msg': '标记成功'}
        else:
            return {'code': 211, 'msg': '标记失败'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.put("/feedback/mark-all-read")
def mark_all_feedback_read():
    """批量标记为已读"""
    try:
        count = database.mark_all_feedback_read()
        return {'code': 200, 'msg': f'已标记 {count} 条反馈为已读'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.delete("/feedback/{feedback_id}")
def delete_feedback(feedback_id: int):
    """删除反馈"""
    try:
        result = database.delete_feedback(feedback_id)
        if result:
            return {'code': 200, 'msg': '删除成功'}
        else:
            return {'code': 211, 'msg': '删除失败'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.get("/feedback/stats")
def get_feedback_stats():
    """获取反馈统计信息"""
    try:
        stats = database.get_feedback_stats()
        return {'code': 200, 'msg': 'ok', 'data': stats}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.get("/message/list")
def get_message_list(
        page: int = Query(1, ge=1),
        page_size: int = Query(10, ge=1, le=100),
        status: Optional[str] = Query(None),
        type: Optional[str] = Query(None),
        keyword: Optional[str] = Query(None),
        token: str = Query(..., description="用户token")
):
    """获取消息列表"""
    try:
        # 验证token并获取用户ID
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        # 获取消息列表
        data = database.get_messages(
            user_id=user_id,
            page=page,
            page_size=page_size,
            status=status,
            type=type,
            keyword=keyword
        )

        return {
            'code': 200,
            'msg': 'ok',
            'data': data['data'],
            'total': data['total'],
            'page': data['page'],
            'page_size': data['page_size']
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.get("/message/{message_id}")
def get_message_detail_api(
        message_id: int,
        token: str = Query(..., description="用户token")
):
    """获取消息详情"""
    try:
        # 验证token并获取用户ID
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        # 获取消息详情
        message = database.get_message_detail(message_id, user_id)
        if not message:
            return {'code': 404, 'msg': '消息不存在'}

        return {
            'code': 200,
            'msg': 'ok',
            'data': message
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.put("/message/{message_id}/read")
def mark_message_read_api(
        message_id: int,
        token: str = Query(..., description="用户token")
):
    """标记消息为已读"""
    try:
        # 验证token并获取用户ID
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        # 标记为已读
        success = database.mark_message_as_read(message_id, user_id)
        if not success:
            return {'code': 404, 'msg': '消息不存在'}

        return {'code': 200, 'msg': '标记成功'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.put("/message/mark-all-read")
def mark_all_messages_read_api(
        token: str = Query(..., description="用户token")
):
    """批量标记为已读"""
    try:
        # 验证token并获取用户ID
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        # 批量标记为已读
        database.mark_all_messages_as_read(user_id)

        return {'code': 200, 'msg': '全部标记为已读'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.delete("/message/{message_id}")
def delete_message_api(
        message_id: int,
        token: str = Query(..., description="用户token")
):
    """删除消息"""
    try:
        # 验证token并获取用户ID
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        # 删除消息
        success = database.delete_message(message_id, user_id)
        if not success:
            return {'code': 404, 'msg': '消息不存在'}

        return {'code': 200, 'msg': '删除成功'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.get("/message/stats")
def get_message_stats_api(
        token: str = Query(..., description="用户token")
):
    """获取消息统计"""
    try:
        # 验证token并获取用户ID
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        # 获取统计信息
        stats = database.get_message_stats(user_id)

        return {
            'code': 200,
            'msg': 'ok',
            'data': stats
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.post("/message/send")
def send_system_message_api(
        message_data: MessageCreate,
        token: str = Query(..., description="管理员token")
):
    """发送系统消息（管理员接口）"""
    try:
        # 验证管理员token
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        # 检查是否为管理员
        user_id = result['user_id']

        # 根据username查找用户ID
        target_user_id = database.get_user_id_by_username(message_data.username)
        if not target_user_id:
            return {'code': 404, 'msg': '目标用户不存在'}

        # 创建消息
        message_id = database.create_message(
            title=message_data.title,
            content=message_data.content,
            type=message_data.type,
            user_id=target_user_id,  # 使用查找到的用户ID
            sender_id=message_data.sender_id,
            sender_name=message_data.sender_name
        )

        # 如果有关联的反馈ID，更新反馈状态
        if message_data.feedback_id:
            database.update_feedback_status(message_data.feedback_id, 'replied')

        return {
            'code': 200,
            'msg': '消息发送成功',
            'data': {'message_id': message_id}
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.post("/message/send-batch")
def send_batch_messages_api(
        message_data: MessageBatchCreate,
        token: str = Query(..., description="管理员token")
):
    """批量发送消息"""
    try:
        # 验证管理员token
        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        # 检查是否为管理员
        user_id = result['user_id']
        # 这里可以添加管理员权限检查逻辑

        # 如果没有指定目标用户，发送给所有用户
        if not message_data.target_user_ids:
            session = database.Session()
            users = session.query(database.User.id).all()
            target_user_ids = [user.id for user in users]
            session.close()
        else:
            target_user_ids = message_data.target_user_ids

        # 批量创建消息
        created_count = 0
        for target_user_id in target_user_ids:
            database.create_message(
                title=message_data.title,
                content=message_data.content,
                type=message_data.type,
                user_id=target_user_id,
                sender_id=user_id,
                sender_name="系统管理员"
            )
            created_count += 1

        return {
            'code': 200,
            'msg': f'成功发送{created_count}条消息',
            'data': {'created_count': created_count}
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


# 在 main.py 中添加的评论相关API接口

@app.get("/comments")
def get_comments_api(
        article_id: int = Query(..., description="文章ID"),
        page: int = Query(1, ge=1, description="页码"),
        page_size: int = Query(10, ge=1, le=100, description="每页数量"),
        parent_id: Optional[int] = Query(None, description="父评论ID，获取回复")
):
    """获取文章评论列表"""
    try:
        comments, total = database.get_comments(
            article_id=article_id,
            page=page,
            page_size=page_size,
            parent_id=parent_id
        )

        total_pages = (total + page_size - 1) // page_size

        return {
            'code': 200,
            'msg': '获取评论成功',
            'data': comments,
            'total': total,
            'page': page,
            'page_size': page_size,
            'total_pages': total_pages
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.post("/comments")
def create_comment_api(
        comment_data: CommentCreate,
        authorization: Optional[str] = Header(None, description="Bearer token")
):
    """创建评论"""
    try:
        # 验证token
        token = None
        if authorization and authorization.startswith('Bearer '):
            token = authorization[7:]

        if not token:
            return {'code': 401, 'msg': '缺少认证token'}

        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']
        username = database.get_user_username_by_id(user_id)

        comment_id = database.create_comment(
            article_id=comment_data.article_id,
            user_id=user_id,
            username=username,
            content=comment_data.content,
            parent_id=comment_data.parent_id
        )

        # 更新文章评论数
        database.update_article_comment_count(comment_data.article_id)

        return {
            'code': 200,
            'msg': '评论创建成功',
            'data': {'comment_id': comment_id}
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.delete("/comments/{comment_id}")
def delete_comment_api(
        comment_id: int,
        authorization: Optional[str] = Header(None, description="Bearer token")
):
    """删除评论"""
    try:
        # 验证token
        token = None
        if authorization and authorization.startswith('Bearer '):
            token = authorization[7:]

        if not token:
            return {'code': 401, 'msg': '缺少认证token'}

        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        success = database.delete_comment(comment_id, user_id)
        if not success:
            return {'code': 404, 'msg': '评论不存在或无权限删除'}

        return {'code': 200, 'msg': '评论删除成功'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.post("/comments/{comment_id}/like")
def like_comment_api(
        comment_id: int,
        authorization: Optional[str] = Header(None, description="Bearer token")
):
    """点赞评论"""
    try:
        # 验证token
        token = None
        if authorization and authorization.startswith('Bearer '):
            token = authorization[7:]

        if not token:
            return {'code': 401, 'msg': '缺少认证token'}

        result = utils.getLoginMsg(token)
        if result == 0:
            return {'code': 204, 'msg': '验证码已过期'}
        elif result == 1:
            return {'code': 205, 'msg': '令牌无效'}

        user_id = result['user_id']

        success = database.like_comment(comment_id, user_id)
        if not success:
            return {'code': 404, 'msg': '评论不存在'}

        return {'code': 200, 'msg': '点赞成功'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.get("/comments/stats/{article_id}")
def get_comment_stats_api(article_id: int):
    """获取文章评论统计"""
    try:
        stats = database.get_comment_stats(article_id)
        return {
            'code': 200,
            'msg': '获取统计成功',
            'data': stats
        }
    except Exception as e:
        return {'code': 400, 'error': str(e)}


@app.post("/articles/{article_id}/view")
def update_article_view_count_api(article_id: int):
    """更新文章浏览数"""
    try:
        success = database.update_article_view_count(article_id)
        if not success:
            return {'code': 404, 'msg': '文章不存在'}

        return {'code': 200, 'msg': '浏览数更新成功'}
    except Exception as e:
        return {'code': 400, 'error': str(e)}