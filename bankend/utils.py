import random
import jwt
import datetime
import os
import pandas as pd
from docxtpl import DocxTemplate
def randCode():
    result = ''
    for i in range(4):
        result += str(random.randint(0, 9))
    return result

def randName():
    result = ''
    for i in range(6):
        result += str(random.randint(0, 9))
    return result

def randId():
    result = ''
    for i in range(8):
        result += str(random.randint(0, 9))
    return result

def generate_jwt_token(user_id, username, secret_key=None, algorithm='HS256', expires_in=3600):
    """
    生成 JWT Token
    :param user_id: 用户ID
    :param secret_key: 密钥
    :param algorithm: 签名算法
    :param expires_in: 有效时间（秒）
    :return: JWT Token
    """
    if secret_key is None:
        secret_key = os.getenv('JWT_SECRET_KEY', 'default_secret_key')
    
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, secret_key)
    return token

def getLoginMsg(jwt_token,secret_key=None):
    if secret_key is None:
        secret_key = os.getenv('JWT_SECRET_KEY', 'default_secret_key')
    
    try:
        decoded_payload = jwt.decode(jwt_token, secret_key, algorithms=["HS256"])
        return decoded_payload
    except jwt.ExpiredSignatureError:
        return 0
    except jwt.InvalidTokenError:
        return 1
def getArray(filename,enum):
    if enum==1:
        df = pd.read_excel(filename, header=5)
    elif enum==2:
        df = pd.read_excel(filename, header=3,sheet_name='A100000年度纳税审核表',usecols=range(5,9))
    else:
        df = pd.read_excel(filename,header=2,sheet_name='A105000纳税调整项目明细表')
    df_filled = df.fillna(0)
    array_ = df_filled.to_dict('records')
    return array_

def formInt(num):
    try:
        formatted_num = f"{float(num):,.2f}"
        return formatted_num
    except:
        return 0


def getReport(username):
    result = {}
    table1 = pd.read_excel(f'input/{username}/file0.xlsx',skiprows=5,nrows=6,usecols=range(2,10)).fillna(0)
    index_ = 0
    for column in table1.columns:
        for item in table1[column]:
            result['data'+str(index_)] = formInt(item)
            index_ += 1
    table2 = pd.read_excel(f'input/{username}/file1.xlsx',sheet_name='A100000年度纳税审核表',skiprows=3,nrows=54,usecols=range(7,8)).fillna(0)
    for column in table2.columns:
        for item in table2[column]:
            result['data'+str(index_)] = formInt(item)
            index_ += 1
    table3 = pd.read_excel(f'input/{username}/file1.xlsx',sheet_name='A105000纳税调整项目明细表',skiprows=3,nrows=53,usecols=range(4,8)).fillna(0)
    for column in table3.columns:
        for item in table3[column]:
            result['data'+str(index_)] = formInt(item)
            index_ += 1
    table4 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A105010视同销售和房地产开发企业特定业务纳税调整明细表', skiprows=2, nrows=29,usecols=range(6, 8)).fillna(0)
    for column in table4.columns:
        for item in table4[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table5 = pd.read_excel(f'input/{username}/file1.xlsx',sheet_name='A105020未按权责发生制确认收入纳税调整明细表', skiprows=4, nrows=14,usecols=range(3, 9)).fillna(0)
    for column in table5.columns:
        for item in table5[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table6 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A105050职工薪酬支出及纳税调整明细表',skiprows=3, nrows=13, usecols=range(4, 11)).fillna(0)
    for column in table6.columns:
        for item in table6[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table7 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A105070捐赠支出纳税调整明细表', skiprows=3,nrows=12, usecols=range(2, 9)).fillna(0)
    for column in table7.columns:
        for item in table7[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table8 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A105080资产折旧、摊销及纳税调整明细表', skiprows=4,nrows=35, usecols=range(4, 13)).fillna(0)
    for column in table8.columns:
        for item in table8[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table9 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A105090资产损失税前扣除及纳税调整明细表',skiprows=3, nrows=30, usecols=range(2, 9)).fillna(0)
    for column in table9.columns:
        for item in table9[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table10 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A105120贷款损失准备金及纳税调整明细表',skiprows=4, nrows=10, usecols=range(3, 14)).fillna(0)
    for column in table10.columns:
        for item in table10[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table11 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A106000企业所得税弥补亏损明细表',skiprows=4, nrows=11, usecols=range(2, 14)).fillna(0)
    for column in table11.columns:
        for item in table11[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    table12 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A106000企业所得税弥补亏损明细表').fillna(0)
    result['data' + str(index_)] = table12['Unnamed: 13'][15]
    index_ += 1
    table13 = pd.read_excel(f'input/{username}/file1.xlsx', sheet_name='A107020所得减免优惠明细表', skiprows=4,nrows=31, usecols=range(2, 13)).fillna(0)
    for column in table13.columns:
        for item in table13[column]:
            result['data' + str(index_)] = formInt(item)
            index_ += 1
    template_path = "template.docx"
    doc = DocxTemplate(template_path)
    doc.render(result)
    doc.save(f'output/{username}/output.docx')



if __name__ == '__main__':
    # 示例用法，请替换为实际的JWT token
    print(getLoginMsg('your_jwt_token_here'))