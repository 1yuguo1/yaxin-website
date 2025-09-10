# -*- coding: utf-8 -*-
# This file is auto-generated, don't edit it. Thanks.
import sys
import os
import utils
from typing import List

from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_captcha20230305.client import Client as Captcha20230305Client
from alibabacloud_captcha20230305 import models as captcha_20230305_models
from alibabacloud_dysmsapi20170525.client import Client as Dysmsapi20170525Client
from alibabacloud_dysmsapi20170525 import models as dysmsapi_20170525_models
from alibabacloud_tea_util import models as util_models
from alibabacloud_tea_util.client import Client as UtilClient


import logging

class Sample:
    def __init__(self):
        pass

    @staticmethod
    def create_client() -> Dysmsapi20170525Client:
        """
        使用AK&SK初始化账号Client
        @return: Client
        @throws Exception
        """
        # 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
        # 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378659.html。
        config = open_api_models.Config(
            # 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。,
            access_key_id=os.getenv('ALIBABA_CLOUD_ACCESS_KEY_ID', ''),
            # 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。,
            access_key_secret=os.getenv('ALIBABA_CLOUD_ACCESS_KEY_SECRET', '')
        )
        # Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.endpoint = f'dysmsapi.aliyuncs.com'
        return Dysmsapi20170525Client(config)

    @staticmethod
    def main_(phonenumber):
        client = Sample.create_client()
        code = utils.randCode()
        send_sms_request = dysmsapi_20170525_models.SendSmsRequest(
            sign_name=os.getenv('SMS_SIGN_NAME', '玉溪亚信'),
            template_code=os.getenv('SMS_TEMPLATE_CODE', 'SMS_478460010'),
            phone_numbers=phonenumber,
            template_param='{"code":"' + code + '"}'
        )
        runtime = util_models.RuntimeOptions()
        try:
            # 复制代码运行请自行打印 API 的返回值
            result = client.send_sms_with_options(send_sms_request, runtime)
            return result,code
        except Exception as error:
            # 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
            # 错误 message
            print(error.message)
            # 诊断地址
            print(error.data.get("Recommend"))
            UtilClient.assert_as_string(error.message)

    @staticmethod
    def main(captchaVerifyParam):
        # ====================== 1. 初始化配置 ======================\
        config = open_api_models.Config()
        # 设置您的AccessKey ID 和 AccessKey Secret。
        # getEnvProperty只是个示例方法，需要您自己实现AccessKey ID 和 AccessKey Secret安全的获取方式。
        config.access_key_id = os.getenv('ALIBABA_CLOUD_ACCESS_KEY_ID', '')
        config.access_key_secret = os.getenv('ALIBABA_CLOUD_ACCESS_KEY_SECRET', '')
        # 设置请求地址
        config.endpoint = os.getenv('CAPTCHA_ENDPOINT', 'captcha.cn-shanghai.aliyuncs.com')
        # 设置连接超时为5000毫秒
        config.connect_timeout = 5000
        # 设置读超时为5000毫秒
        config.read_timeout = 5000
        # ====================== 2. 初始化客户端（实际生产代码中建议复用client） ======================\
        client = Captcha20230305Client(config)
        # 创建APi请求
        request = captcha_20230305_models.VerifyCaptchaRequest()
        # 前端传来的验证参数 CaptchaVerifyParam
        request.captcha_verify_param = captchaVerifyParam
        # ====================== 3. 发起请求） ======================\
        try:
            resp = client.verify_captcha(request)
            # 建议使用您系统中的日志组件，打印返回
            # 获取验证码验证结果（请注意判空），将结果返回给前端。出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
            captcha_verify_result = resp.body.result.verify_result
            logging.info(captcha_verify_result)
            return captcha_verify_result
        except Exception as error:
            # 建议使用您系统中的日志组件，打印异常
            # 出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
            captcha_verify_result = True
            return captcha_verify_result




if __name__ == '__main__':
    # 示例用法，请替换为实际的手机号码
    print(Sample.main_('your_phone_number_here'))