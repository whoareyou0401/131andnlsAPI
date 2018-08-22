#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .models import CMUser
from CCPRestSDK import REST
from register_utils import *
from django.shortcuts import render, HttpResponseRedirect, render_to_response
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from .forms import *
from .models import *
from django.conf import settings
from django.template import RequestContext
# from recommendorder import uac_utils
import ConfigParser
import json


def register(request, template='user/register.html'):
    if request.method == 'GET':
        return render(request, template)

    form = RegisterForm(request.POST or None)
    if form.is_valid():
        session_id = request.session.session_key
        pwd = form.cleaned_data.get('pwd')
        result, user = save_user(form, session_id)
        if result == 'ok':
            result, user = authenticate_and_login(
                request=request, username=user.phone, password=pwd)
            response = HttpResponse(json.dumps(
                result), content_type="application/json")
            user_role = None
            if uac_utils.is_dealer(user):
                user_role = 'dealer'
            elif uac_utils.is_salesman(user):
                user_role = 'salesman'
            elif uac_utils.is_customer(user):
                user_role = 'customer'
            if user_role:
                response.set_cookie('user_role', user_role)
            return response
        else:
            return HttpResponse(json.dumps({'code': 1, 'msg': result}), content_type="application/json")
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': 'parameter error'}), content_type="application/json")


def get_verify_code_view(request):
    form = VerifyCodeForm(request.POST or None)
    if form.is_valid():
        session_id = request.session.session_key
        result = send_code_to_phone(form, session_id)
        if result == 'ok':
            return HttpResponse(json.dumps({'code': 0, 'msg': result}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({'code': 1, 'msg': result}), content_type="application/json")
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")


def bind_phone(request):
    form = BindPhoneForm(request.POST or None)
    user_type = request.COOKIES['user_type']
    session_id = request.session.session_key
    if form.is_valid():
        result = binding_phone(form, session_id, user_type)
        if isinstance(result, str):
            return HttpResponse(json.dumps({'code': 1, 'msg': result}), content_type="application/json")
        elif isinstance(result, CMUser):
            source = form.cleaned_data.get('source')
            openid = form.cleaned_data.get('sid')
            return authenticate_and_login(request=request, source=source, openid=openid)
        else:
            return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")


def qq_login(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    access_token = get_qq_access_token(code, state)
    openid = get_qq_openid(access_token)
    get_qq_user_info(access_token, openid)
    result = authenticate_and_login(request=request, source='QQ', openid=openid)
    if type(result) == type(dict):
        url = result['msg']
        return HttpResponseRedirect(url)
    else:
        return result


def weixin_login(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    access_token, openid = get_weixin_access_token_and_openid(code)
    get_weixin_user_infos(access_token, openid)
    result = authenticate_and_login(request=request, source='weixin', openid=openid)
    if type(result) == type(dict):
        url = result['msg']
        return HttpResponseRedirect(url)
    else:
        return result


def auth_login(request, template='user/mlogin.html'):
    if request.method == 'GET':
        next = request.GET.get('next')
        user_type = request.GET.get('type')
        response = render_to_response(
            template, {'next': next}, context_instance=RequestContext(request))
        response.set_cookie('user_type', user_type)
        return response
    if request.method == 'POST':
        form = LoginForm(request.POST or None)
        if form.is_valid():
            name = form.cleaned_data.get('name')
            pwd = form.cleaned_data.get('pwd')
            next = form.cleaned_data.get('next')
            result, user = authenticate_and_login(
                request=request, username=name, password=pwd, next=next)
            response = HttpResponse(json.dumps(
                result), content_type="application/json")
            user_role = None
            if uac_utils.is_dealer(user):
                user_role = 'dealer'
            elif uac_utils.is_salesman(user):
                user_role = 'salesman'
            elif uac_utils.is_customer(user):
                user_role = 'customer'
            if user_role:
                response.set_cookie('user_role', user_role)
            return response
        else:
            return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")


def verify_reset_pwd_code(request, template='user/forget_pwd.html'):
    form = VerifyRestCodeForm(request.POST or None)
    if form.is_valid():
        phone_number = form.cleaned_data.get('phone_number')
        result = verify_reset_pwd_phone_code(form)
        if result == 'ok':
            response = HttpResponse(json.dumps(
                {'code': 0, 'msg': '/new-pwd'}), content_type="application/json")
            response.set_cookie('phone', phone_number)
            return response
        else:
            return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")


def reset_pwd(request, template='user/set_pwd.html'):
    if request.method == 'GET':
        return render(request, template)
    form = ResetPasswordForm(request.POST or None)
    if form.is_valid():
        result = reset_user_password(request, form)
        if result != 'ok':
            return HttpResponse(json.dumps({'code': 1, 'msg': result}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({'code': 0, 'msg': 'ok'}), content_type="application/json")
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': 'failed'}), content_type="application/json")


def forget_pwd_view(request, template='user/forget_pwd.html'):
    return render(request, template)


def verify_experience_code(request):
    form = VerifyRestCodeForm(request.POST or None)
    if form.is_valid():
        result = verify_and_experience(form)
        if result == 'ok':
            return HttpResponse(json.dumps({'code': 0, 'msg': u'验证成功'}),
                content_type="application/json")
        else:
            return HttpResponse(json.dumps({'code': 1, 'msg': u'验证码错误'}),
                content_type="application/json")
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': u'参数错误'}),
            content_type="application/json")


def experience(request):
    form = ExperienceForm(request.POST or None)
    result = experience_entry(form, request)
    experience_type = form.cleaned_data.get('experience_type')
    if isinstance(result, dict):
        user_role = None
        response = HttpResponse(json.dumps({'code': 0, 'msg': result}),
        content_type="application/json")
        if experience_type == 'salesman':
            user_role = 'salesman'
        elif experience_type == 'customer':
            user_role = 'customer'
        if user_role:
            response.set_cookie('user_role', user_role)
        return response
    else:
        return HttpResponse(json.dumps({'code': 1, 'msg': result}),
            content_type="application/json")