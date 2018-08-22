# -*- coding: utf-8 -*-
from django.conf import settings
from django.core.cache import cache

import requests
import time
import json
import sys
import datetime
reload(sys)
sys.setdefaultencoding("utf-8")
TEST_APP_ACCESS_TOKEN = 'test_app_access_token'
TIME_OUT = 60 * 60


def get_access_token_function(appid, secret):
    access_token = cache.get(TEST_APP_ACCESS_TOKEN)
    if access_token is None:
        response = requests.get(
            url="https://api.weixin.qq.com/cgi-bin/token",
            params={
                "grant_type": "client_credential",
                "appid": appid,
                "secret": secret,
            }
        )
        response_json = response.json()
        access_token = response_json['access_token']
        cache.set(
            TEST_APP_ACCESS_TOKEN,
            access_token,
            TIME_OUT)
    return access_token

# "data":{
#                    "first": {
#                        "DATA":"恭喜你购买成功！"
#                    },
#                    "keyword1":{
#                        "DATA":"巧克力",
#                    },
#                    "keyword2": {
#                        "DATA":"39.8元"
#                    },
#                    "remark": {
#                        "DATA":"点击了解详情"
#                    }
#            }
def send_template_msg(template_id, touser, token):
    template = {
           "touser":touser,
           "template_id":template_id,
           "url":'https://b.ichaomeng.com',
           "topcolor": 'red',
           # "miniprogram":{
           #   "appid":"wxbcb22b1463494501",
           #   "pagepath":"pages/homeIndex/homeIndex"
           # },
           "data":{
                   "first": {
                    'value': "您选择的经营报告已发送，请注意查收",
                    'color': 'blue'
                   },
                   "keyword1":{
                    'value': "超盟BI"
                   },
                   "keyword2": {
                    'value': str(datetime.datetime.now().date())
                   },
                   "remark": {
                    'value': "点击了解详情"
                   }
           }
       }
    url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token
    response = requests.post(url, data=json.dumps(template))
    response_json = response.json()
    errcode = response_json.get('errcode')
    errmsg = response_json.get('errmsg')
    if (errcode == 0 and errmsg==u'ok'):
        return {'data': response_json.get('msgid')}
    else:
        return {'data': 'errmsg'}


def get_allUser(token):
    url='https://api.weixin.qq.com/cgi-bin/user/get'
    res = requests.get(url, params={'access_token':token, 'next_openid':''})

    openids = res.json().get('data').get('openid')

    # print openids
    msg_url = 'https://api.weixin.qq.com/cgi-bin/user/info'
    for openid in openids:
        params = {'access_token':token, 'openid': openid, 'lang':'zh_CN'}
        response = requests.get(url=msg_url, params=params)
        if response.json().get('nickname') == '暴走的蜗牛儿':
            print response.json().get('nickname'), openid
            return

