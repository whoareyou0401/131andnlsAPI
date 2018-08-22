# -*- coding: utf-8 -*-
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render,render_to_response
from django.contrib.auth import authenticate, login
# from recommendorder import uac_utils
from utils import decorators
from register_utils import authenticate_and_login
from forms import LoginForm
import json


@decorators.standard_api(methods=('POST'))
def login(request, template='user/mlogin.html'):
    def post():
        form = LoginForm(request.POST or None)
        if form.is_valid():
            name = form.cleaned_data.get('name')
            pwd = form.cleaned_data.get('pwd')
            next = form.cleaned_data.get('next')
            result, user = authenticate_and_login(
                request=request, username=name, password=pwd, next=next)
            print user, result
            response = HttpResponse(json.dumps(
                result), content_type="application/json")
            user_role = None
            # if uac_utils.is_dealer(user):
            #     user_role = 'dealer'
            # elif uac_utils.is_salesman(user):
            #     user_role = 'salesman'
            # elif uac_utils.is_customer(user):
            #     user_role = 'customer'
            # if user_role:
            #     response.set_cookie('user_role', user_role)
            return response
        else:
            print 'dsadas'
            return JsonResponse({'code': 1, 'msg': 'failed'})
    return locals()[request.method.lower()]()