# -*- coding: UTF-8 -*-
import requests
import json
from user.CCPRestSDK import REST
import random
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from os import environ


def send_invitation(mobile, user=u'用户', dealer='', url='https://www.chaomengdata.com', hours=12, phone=''):
    template = u'【超盟数据】尊敬的{user}，您的供应商{dealer}正在为您开通网上订货，点击 {url} 继续，链接{hours}小时内有效，如有疑问，请咨询客服电话{phone}。'

    r = requests.post('https://sms.yunpian.com/v2/sms/multi_send.json', data={
        'apikey': 'cd50f5b4b0754e623bbd32cd346a0e56',
        'mobile': mobile,
        'text': unicode.format(template, user=user, dealer=dealer, url=url, hours=hours, phone=phone),
    })
    content = json.loads(r.content)
    print(content)


def send_code_interface(to, datas, template_id):
    rest = REST(settings.CM_VERIFY_CODE_INTERFACE_SERVER_IP,
                settings.CM_VERIFY_CODE_INTERFACE_SERVER_PORT,
                settings.CM_VERIFY_CODE_INTERFACE_SOFT_VERSION)
    rest.setAccount(settings.CM_DUANXIN_ACCOUNTSID,
                    settings.CM_DUANXIN_ACCOUNTTOKEN)
    rest.setAppId(settings.CM_DUANXIN_APPID)
    result = rest.sendTemplateSMS(to, datas, template_id)
    return result['statusCode']


def send_code_to_phone(mobile, code=None, timeout=u'2分钟', template_id=''):
    if not code:
        code = random.randint(100000, 999999)
    # 调用发送验证码接口
    res = send_code_interface(
        str(mobile),
        [str(code),
         timeout],
        template_id)
    if res == '000000':
        cache.set(str(mobile), code, timeout=settings.REDIS_TIMEOUT)
        return 'ok'
    else:
        return u'发送验证码失败'


def easy_send_email(subject, message, from_email, recipient_list):
    EMAIL_PASSWORD = environ.get('EMAIL_PASSWORD')
    send_mail(
        subject,
        message,
        from_email,
        recipient_list,
        fail_silently=False,
        auth_user=settings.EMAIL_USER,
        auth_password=EMAIL_PASSWORD)

if __name__ == '__main__':
    send_invitation('15311120105')
