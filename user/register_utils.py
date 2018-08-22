#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .models import CMUser
from CCPRestSDK import REST
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.shortcuts import render
from .models import *
# import recommendorder.uac_utils
# import analytics.utils.uac_utils
import dailystatement.dailystate_util
import requests
import redis
import random
import json
import re
# from vendor.vendor_utils import is_vendor
# from recommendorder.models import (Customer, UserToCustomer,
#                                    DealerCustomerMap, Salesman, Dealer)
from django.utils import timezone
import logging
from django.core.cache import cache
logger = logging.getLogger(__name__)


def create_verify_code():
    return random.randint(100000, 999999)


def send_code_interface(to, datas, template_id):
    rest = REST(settings.CM_VERIFY_CODE_INTERFACE_SERVER_IP,
                settings.CM_VERIFY_CODE_INTERFACE_SERVER_PORT,
                settings.CM_VERIFY_CODE_INTERFACE_SOFT_VERSION)
    rest.setAccount(settings.CM_DUANXIN_ACCOUNTSID,
                    settings.CM_DUANXIN_ACCOUNTTOKEN)
    rest.setAppId(settings.CM_DUANXIN_APPID)
    result = rest.sendTemplateSMS(to, datas, template_id)
    return result['statusCode']


def send_code_to_phone(form, session_id):
    phone_number = form.cleaned_data.get('phone_number')
    verify_type = form.cleaned_data.get('verify_type')
    template_id = ''
    if verify_type == 'register':
        template_id = settings.CM_VERIFY_CODE_INTERFACE_SERVER_TEMPLATE_ID
    elif verify_type == 'forget':
        template_id = settings.CM_FORGET_CODE_INTERFACE_SERVER_TEMPLATE_ID
    elif verify_type == 'bind':
        template_id = settings.CM_BIND_CODE_INTERFACE_SERVER_TEMPLATE_ID
    elif verify_type == 'experience':
        template_id = settings.CM_VERIFY_CODE_INTERFACE_SERVER_TEMPLATE_ID
    # minite_cache_key = 'get_code_minite' + str(session_id)
    # day_cache_key = 'get_code_day' + str(session_id)
    # minite_count = cache.get(minite_cache_key)
    # day_count = cache.get(day_cache_key)
    # if (day_count and int(day_count) > 223) or minite_count is not None:
    #     return u'请求次数过多'
    if verify_type == 'register':
        user = CMUser.objects.filter(phone=phone_number)
        if user:
            return u'该手机号已注册'

    elif verify_type == 'forget':
        user = CMUser.objects.filter(phone=phone_number)
        if not user:
            return u'该手机号未注册'
    elif verify_type == 'bind':
        user = CMUser.objects.filter(phone=phone_number)
        if len(user) > 0:
            return u'该手机号已经被绑定'
    code = create_verify_code()
    # 调用发送验证码接口
    res = send_code_interface(
        str(phone_number),
        [str(code),
         '2分钟'],
        template_id)
    if res == '000000':
        if verify_type == 'register':
            cache.set(code, phone_number, timeout=settings.REDIS_TIMEOUT)
        if verify_type == 'forget':
            verify_key = str(code) + 'forget'
            cache.set(verify_key, phone_number, timeout=settings.REDIS_TIMEOUT)
        if verify_type == 'bind':
            verify_key = str(code) + 'bind'
            cache.set(verify_key, phone_number, timeout=settings.REDIS_TIMEOUT)
        if verify_type == 'experience':
            verify_key = str(code) + 'experience'
            cache.set(verify_key, phone_number, timeout=settings.REDIS_TIMEOUT)
        # cache.set(minite_cache_key, 1, timeout=settings.REDIS_TIMEOUT)
        # if day_count:
        #     day_count = int(day_count) + 1
        # else:
        #     day_count = 1
        # cache.set(day_cache_key, day_count, timeout=settings.VERIFY_CODE_REDIS_DAY_TIMEOUT)
        return 'ok'
    else:
        logger.info(str(res))
        return u'发送验证码失败'


def save_user(form, session_id):
    phone_number = form.cleaned_data.get('phone_number')
    verify_code = form.cleaned_data.get('verify_code')
    pwd = form.cleaned_data.get('pwd')
    # group_tag = form.cleaned_data.get('tag')
    register_key = str(session_id) + 'register'
    verify_count = cache.get(register_key)
    user_check = CMUser.objects.filter(phone=phone_number)
    if user_check:
        return u'该手机号已注册', None
    if pwd == '':
        return u'密码为空', None
    if not verify_count:
        cache.set(register_key, 1, timeout=settings.REDIS_TIMEOUT * 15)
    elif verify_count and int(verify_count) > settings.VERRIFY_AND_REGISTER_COUNT:
        return u'请求次数过多', None
    else:
        verify_count = int(verify_count) + 1
        cache.set(register_key, verify_count,
                  timeout=settings.REDIS_TIMEOUT * 15)
    result = cache.get(verify_code)
    if result and result == phone_number:
        # 信息入库
        user = CMUser.objects.create_user(
            'customer_' + phone_number,
            password=pwd,
            first_name='customer_' + phone_number,
            phone=phone_number)
        user.save()
        customer = Customer.objects.create(
            customer_phone=phone_number, customer_name=user.username)
        customer.save()
        utc = UserToCustomer.objects.create(user=user,
                                            related_customer=customer,
                                            user_name=customer.customer_name)

        utc.save()
        return 'ok', user
    else:
        return u'验证码错误', None


def binding_phone(form, session_id, user_type):
    phone_number = form.cleaned_data.get('phone_number')
    verify_code = form.cleaned_data.get('verify_code')
    pwd = form.cleaned_data.get('pwd')
    source = form.cleaned_data.get('source')
    openid = form.cleaned_data.get('sid')
    redis_key = 'bind_phone' + str(session_id)
    bind_count = cache.get(redis_key)
    if not bind_count:
        cache.set(redis_key, 1, timeout=settings.REDIS_TIMEOUT)
    if bind_count and int(bind_count) > settings.VERRIFY_AND_REGISTER_COUNT:
        return u'请求次数过多'
    if pwd == '':
        return u'密码为空'
    result = cache.get(verify_code + 'bind')
    if result and result == phone_number:
        try:
            user = CMUser.objects.get(phone=phone_number)
            if not user.check_password(pwd):
                return u'与已有密码不匹配'
        except CMUser.DoesNotExist:
            user = CMUser.objects.create_user(
                'dealer_' + phone_number,
                password=pwd,
                first_name='dealer_' + phone_number,
                phone=phone_number,
                user_type=user_type)
            user.save()
        user_info = json.loads(cache.get(openid))
        if source == 'weixin':
            user_platform = CMUserOfWeixin()
            user_platform.user = user
            user_platform.openid = openid
            user_platform.nickname = user_info['nickname']
            if user_info['sex'] == u'男':
                user_platform.sex = 0
            elif user_info['sex'] == u'女':
                user_platform.sex = 1
            user_platform.province = user_info['province']
            user_platform.counrty = user_info['counrty']
            user_platform.head_img_url = user_info['headimgurl']
            if 'unionid' in user_info:
                user_platform.union_id = user_info['unionid']
            user_platform.privilege = '&'.join(user_info['privilege'])
            user_platform.save()
        elif source == 'QQ':
            user_platform = CMUserOfQQ()
            user_platform.user = user
            user_platform.openid = openid
            user_platform.nickname = user_info['nickname']
            if user_info['gender'] == u'男':
                user_platform.gender = 0
            elif user_info['gender'] == u'女':
                user_platform.gender = 1
            user_platform.figureurl_qq_1 = user_info['figureurl_qq_1']
            user_platform.figureurl_qq_2 = user_info['figureurl_qq_2']
            user_platform.save()
        cache.delete(redis_key)
        return user
    else:
        return u'验证码错误'


def reset_user_password(request, form):
    phone_number = form.cleaned_data.get('phone_number')
    pwd = form.cleaned_data.get('pwd')
    try:
        user = CMUser.objects.get(phone=phone_number)
        if len(pwd) > 0:
            check = cache.get('verifyed' + phone_number)
            if check and int(check) == 1:
                user.set_password(pwd)
                user.save()
                cache.delete('verifyed' + phone_number)
                return 'ok'
            else:
                return u'非法请求'
        else:
            return u'密码不能为空'
    except CMUser.DoesNotExist:
        return u'重置密码失败'


def verify_reset_pwd_phone_code(form):
    phone_number = form.cleaned_data.get('phone_number')
    code = form.cleaned_data.get('code')
    verify_key = code + 'forget'
    phone = cache.get(verify_key)
    if phone == phone_number:
        cache.set('verifyed' + phone_number, 1)
        return 'ok'
    else:
        return u'验证失败'


def get_weixin_access_token_and_openid(code):
    url = settings.USER_GET_WEIXIN_ACCESS_TOKEN_URL
    params = {
        'appid': settings.CM_WEIXIN_APPID,
        'secret': settings.CM_WEIXIN_SECRET,
        'code': code,
        'grant_type': 'authorization_code'}
    my_request = requests.get(url, params=params)
    json_data = json.loads(my_request.content)
    return json_data['access_token'], json_data['openid']


def get_weixin_user_infos(access_token, openid):
    url = settings.GET_WEIXIN_USER_INFO_URL
    params = {'access_token': access_token, 'openid': openid, 'lang': 'zh_CN'}
    my_request = requests.get(url, params=params)
    json_data = json.loads(my_request.content)
    cache.set(openid, json.dumps(json_data))
    return 'ok'


def get_qq_access_token(code, state):
    url = settings.USER_GET_QQ_ACCESS_TOKEN_URL
    params = {
        'client_id': settings.CM_QQ_APPID,
        'client_secret': settings.CM_QQ_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'state': state,
        'redirect_uri': settings.QQ_REDIRECT_URL}
    my_request = requests.get(url, params=params)
    access_token = my_request.content.split('&')[0].split('=')[1]
    return access_token


def get_qq_openid(access_token):
    url = settings.GET_QQ_OPENID_URL
    params = {'access_token': access_token}
    my_request = requests.get(url, params=params)
    json_data = json.loads(
        '{' + re.findall(r"{(.+?)}", my_request.content)[0] + '}')
    return json_data['openid']


def get_qq_user_info(access_token, openid):
    url = settings.GET_QQ_USER_INFO_URL
    params = {'access_token': access_token, 'openid': openid,
              'oauth_consumer_key': settings.CM_QQ_APPID}
    my_request = requests.get(url, params=params)
    json_data = json.loads(my_request.content)
    if json_data['ret'] == 0:
        cache.set(openid, json.dumps(json_data))
    return 'ok'


def authenticate_and_login(
        request=None,
        username=None,
        password=None,
        source=None,
        openid=None,
        next=None,
        template='user/commit_phone.html'):
    if source is not None and openid is not None:
        user = authenticate(source=source, openid=openid)
    elif username is not None and password is not None:
        user = authenticate(username=username, password=password)
    print user
    if user is not None:

        print login(request, user)
        if next and next != '' and next != 'None':
            result = {'code': 0, 'msg': next}
        elif hasattr(user, 'boss'):
            result = {'code': 0, 'msg': '/pay/cvs-sales'}
        elif dailystatement.dailystate_util.is_administrator(user):
            result = {'code': 0, 'msg': '/dailystatement/manager'}
        elif dailystatement.dailystate_util.is_brand(user):
            result = {'code': 0, 'msg': '/dailystatement/sales'}
        else:
            result = {'code': 0, 'msg': '/logout'}
        print 'user', user ,result
        return result, user
    elif source is not None and openid is not None and user is None:
        return render(request, template, {'source': source, 'openid': openid})
    elif username is not None and password is not None and user is None:
        return {'code': 1, 'msg': 'failed'}, None
    else:
        print 'dasdsa'
        return {'code': 1, 'msg': 'failed'}, None


def verify_and_experience(form):
    phone_number = form.cleaned_data.get('phone_number')
    code = form.cleaned_data.get('code')
    verify_key = code + 'experience'
    phone = cache.get(verify_key)
    if phone == phone_number:
        cache.set('verifyed' + phone_number, 1)
        return 'ok'
    else:
        return u'验证失败'


def experience_entry(form, request):
    if form.is_valid():
        experience_type = form.cleaned_data.get('experience_type')
        phone_number = form.cleaned_data.get('phone_number')
        return_dict = {}
        if cache.get('verifyed' + phone_number) == 1:
            authenticate_user = user = None
            dealer = Dealer.objects.get(source='chaomeng')
            return_dict['dealer_id'] = dealer.id
            if experience_type == 'salesman':
                salesman = Salesman.objects.get(name=u'李大萌')
                user = salesman.user
                log = ExperienceLog.objects.create(time=timezone.now(),
                                                   phone=phone_number, experience_type=1)
                log.save()
                return_dict['id'] = salesman.id
                authenticate_user = authenticate(username=user.username,
                                                 password='ichaomeng')
                if authenticate_user:
                    login(request, authenticate_user)
                    return return_dict
                else:
                    return u'用户登录失败'
            elif experience_type == 'customer':
                utc = UserToCustomer.objects.get(user_name=u'chaomeng')
                user = utc.user
                log = ExperienceLog.objects.create(time=timezone.now(),
                                                   phone=phone_number, experience_type=2)
                log.save()
                return_dict['id'] = utc.related_customer.id
                authenticate_user = authenticate(username=user.username,
                                                 password='chaomeng')
                if authenticate_user:
                    login(request, authenticate_user)
                    return return_dict
                else:
                    return u'用户登录失败'
            else:
                return u'type error'
        else:
            return u'手机号未验证'
    else:
        return u'参数无效'
