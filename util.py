# -*- coding: utf-8 -*-
from itsdangerous import URLSafeTimedSerializer as utsr
from django.utils import timezone
from django.conf import settings
from django.db import connection
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import models

def request_user(request):
	params = None
    if request.method == 'GET':
        params = request.GET
    else:
        params = QueryDict(request.body)
    token = params.get('token')
    openid = confirm_validate_token(token)
    try:
        user = models.User.objects.get(openid=openid)
    except:
        return None
    return user

def get_local_ip():
    myname = socket.getfqdn(socket.gethostname())
    myaddr = socket.gethostbyname(myname)
    return myaddr


def get_key(params):
    key_str = ''
    key = None
    params = sorted(params.iteritems(), key=lambda dic: dic[0])
    for param in params:
        if param[0] != 'key':
            key_str += param[0] + param[1]
        else:
            key = param[1]
    md5 = hashlib.md5()
    md5.update(key_str)
    return (key and md5.hexdigest() == key)


def sign(params, sign_key):
    params = [(u'%s' % key, u'%s' % val) for key, val in params.iteritems() if val]
    sorted_params_string = '&'.join('='.join(pair) for pair in sorted(params))
    sign = '{}&key={}'.format(sorted_params_string.encode('utf-8'), sign_key)
    md5 = hashlib.md5()
    md5.update(sign)
    return md5.hexdigest().upper()


def xml_response_to_dict(rep):
    d = xmltodict.parse(rep.content)
    return dict(d['xml'])
