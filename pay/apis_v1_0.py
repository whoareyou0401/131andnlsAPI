# -*- coding: utf-8 -*-
from django.http import (
    QueryDict,
    JsonResponse,
    HttpResponse,
    HttpResponseForbidden)
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
from utils import decorators
from user.models import CMUser
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from cart_helper import CartHelper, OrderHelper, StoreOrderHelper
import models
import datetime
import json
import forms
import xmltodict
import requests
import uuid
import sys
import time
import os
import redis
import pay_util
reload(sys)
sys.setdefaultencoding('utf-8')


# client = redis.Redis(
#     host=settings.CM_REDIS_URL,
#     port=settings.CM_REDIS_PORT,
#     db=settings.CM_VENDOR_REIDS_DB)
# pubsub = client.pubsub()
# pubsub.subscribe(['pay_order'])


@decorators.standard_api(methods=('GET', ))
def token(request):
    def get():
        form = forms.CodeForm(request.GET or None)
        if form.is_valid():
            code = form.cleaned_data.get('code')
            avatar = form.cleaned_data.get('avatar')
            name = form.cleaned_data.get('name')
            gender = form.cleaned_data.get('gender')
            store_id = form.cleaned_data.get('store_id')
            store = models.Store.objects.get(id=int(store_id))
            if hasattr(store, 'cvsconfig'):
                config = store.cvsconfig
            else:
                raise Exception('No config')
            url = settings.SMALL_WEIXIN_OPENID_URL
            params = {"appid": config.appid,
                      "secret": config.secret,
                      "js_code": code,
                      "grant_type": 'authorization_code'}
            response = requests.get(url, params=params)
            data = json.loads(response.content)
            if 'openid' in data:
                openid = data.get('openid')
                user = models.User.objects.get_or_create(openid=openid)[0]
                user.avatar = avatar
                user.nick_name = name
                user.gender = gender
                user.save()
                if user.phone:
                    is_bind = 1
                else:
                    is_bind = 0
                token = pay_util.generate_validate_token(openid)

                return {'data': {'token': token, 'is_bind': is_bind}}
            else:
                return JsonResponse({'code': 1, 'data': u'token failed'})
        else:
            return JsonResponse({'code': 1, 'data': u'表单无效'})

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET', 'DELETE'))
@pay_util.token_authentication
def cart_api(request):
    params = QueryDict(request.body)

    def post():
        barcode = params.get('barcode')
        token = params.get('token')
        openid = pay_util.confirm_validate_token(token)
        sid = cache.get(openid)
        user = models.User.objects.get(openid=openid)
        item = models.Item.objects.get(barcode=barcode, store_id=sid)
        cart = models.Cart.objects.get_or_create(user=user, store_id=sid)[0]
        cart.save()
        cart_item = models.CartItem.objects.create(
            item=item,
            num=1,
            cart=cart)
        cart_item.save()
        return {'data': model_to_dict(item)}

    def get():
        token = request.GET.get('token')
        openid = pay_util.confirm_validate_token(token)
        sid = cache.get(openid)
        result = {}
        store = models.Store.objects.get(id=sid)
        cart = models.Cart.objects.get(user__openid=openid, store=store)
        cart_items = cart.get_cart_items()
        amount = 0
        result, amount = pay_util.bundling(cart_items, store)
        # for cart_item in cart_items:
        #     cart_item['price'] = float('%.2f' % cart_item['price'])
        #     cart_item['sum'] = float(cart_item.get('price')) * \
        #                                 float(cart_item.get('num'))
        #     amount += cart_item['sum']
        return {'items': cart_items, 'amount': amount}

    def delete():
        token = params.get('token')
        cart_item_id = params.get('id')
        openid = pay_util.confirm_validate_token(token)
        user = models.User.objects.get(openid=openid)
        models.CartItem.objects.filter(id=cart_item_id).delete()

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST',))
@pay_util.token_authentication
def order_api(request):
    params = QueryDict(request.body)

    def post():
        token = params.get('token')
        openid = pay_util.confirm_validate_token(token)
        helper = OrderHelper(openid)
        result = helper.order()
        return JsonResponse({'code': 0, 'data': result})

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST',))
@pay_util.token_authentication
def pay_unifiedorder(request):
    params = QueryDict(request.body)

    def post():
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip = request.META.get('HTTP_X_FORWARDED_FOR')
        else:
            ip = request.META.get('REMOTE_ADDR')
        if ip in getattr(settings, 'BLOCKED_IPS', []):
            return HttpResponseForbidden('<h1>Forbbidden</h1>')
        token = params.get('token')
        order_id = params.get('order_id')
        openid = pay_util.confirm_validate_token(token)
        sid = int(cache.get(openid))
        store = models.Store.objects.get(id=sid)
        if hasattr(store, 'cvsconfig'):
            config = store.cvsconfig
        else:
            raise Exception('No config')
        user = models.User.objects.get(openid=openid)
        helper = CartHelper(openid)
        cart_items = helper.get()
        amount = cart_items.get('amount')
        randuuid = uuid.uuid4()
        nonce_str = str(randuuid).replace('-', '')
        out_trade_no = pay_util.create_mch_billno(str(order_id))
        cache.set(out_trade_no, order_id, timeout=24 * 60 * 60)
        url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
        data = {}
        data['body'] = u'超便利'
        data['mch_id'] = config.mch_id
        data['nonce_str'] = nonce_str
        # data['device_info'] = 'WEB'
        data['total_fee'] = str(int(amount * 100))
        data['spbill_create_ip'] = ip
        # data['fee_type'] = 'CNY'
        data['openid'] = openid
        data['out_trade_no'] = out_trade_no
        data['notify_url'] = 'https://%s/api/v1.0/pay/notify' % (request.get_host())
        data['appid'] = config.appid
        data['trade_type'] = 'JSAPI'
        data['sign'] = pay_util.sign(data, config.pay_api_key)
        template = """
                    <xml>
                    <appid>{appid}</appid>
                    <body>{body}</body>
                    <mch_id>{mch_id}</mch_id>
                    <nonce_str>{nonce_str}</nonce_str>
                    <notify_url>{notify_url}</notify_url>
                    <openid>{openid}</openid>
                    <out_trade_no>{out_trade_no}</out_trade_no>
                    <spbill_create_ip>{spbill_create_ip}</spbill_create_ip>
                    <total_fee>{total_fee}</total_fee>
                    <trade_type>{trade_type}</trade_type>
                    <sign>{sign}</sign>
                    </xml>
                """
        content = template.format(**data)
        headers = {'Content-Type': 'application/xml'}
        raw = requests.post(url, data=content, headers=headers)
        rdict = pay_util.xml_response_to_dict(raw)

        return_data = {}
        if rdict['return_code'] == 'SUCCESS' and rdict['result_code'] == 'SUCCESS':
            randuuid = uuid.uuid4()
            nonce_str = str(randuuid).replace('-', '')
            time_stamp = str(int(time.time()))
            sign_data = {}
            sign_data['appId'] = rdict['appid']
            sign_data['nonceStr'] = nonce_str
            sign_data['package'] = 'prepay_id=%s' % rdict['prepay_id']
            sign_data['signType'] = 'MD5'
            sign_data['timeStamp'] = time_stamp
            paySign = pay_util.sign(sign_data, config.pay_api_key)
            return_data['appId'] = rdict['appid']
            return_data['paySign'] = paySign
            return_data['nonceStr'] = nonce_str
            return_data['timeStamp'] = time_stamp
            return_data['package'] = 'prepay_id=%s' % rdict['prepay_id']
            return_data['signType'] = 'MD5'
            return {'data': return_data}
        else:
            return JsonResponse({'code': 1, 'data': u'支付失败'})
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST',))
def notify_api(request):
    def post():
        d = xmltodict.parse(request.body)
        resp = dict(d['xml'])
        return_code = resp.get('return_code')
        data = {}
        if return_code == 'SUCCESS':
            """
            todo 这里需要做签名校验
            """
            order = models.Order.objects.get(
                id=int(cache.get(resp.get('out_trade_no'))))
            amount = 0.0
            for orderitem in order.orderitem_set.all():
                amount += float(orderitem.subtotal)
            openid = resp.get('openid')
            sid = int(cache.get(openid))
            store = models.Store.objects.get(id=sid)
            if hasattr(store, 'cvsconfig'):
                config = store.cvsconfig
            else:
                raise Exception('No config')
            if resp.get('appid') == config.appid \
                and resp.get('mch_id') == config.mch_id \
                    and float(resp.get('total_fee')) == amount * 100:
                order.status = 1
                # 支付方式（现金）
                order.pay_way = 1
                order.out_trade_no = resp.get('out_trade_no')
                order.save()
                helper = CartHelper(resp.get('openid'))
                helper.clean()
                data['return_code'] = 'SUCCESS'
                data['return_msg'] = 'OK'
                # client.publish(
                #     'pay_order',
                #     json.dumps(
                #         {'items': order_items,
                #          'amount': amount}
                #     )
                # )
            else:
                data['return_code'] = 'FAIL'
                data['return_msg'] = 'SIGNERROR'
        else:
            data['return_code'] = 'FAIL'
            data['return_msg'] = 'OK'
        template = """
                    <xml>
                    <return_code><![CDATA[{return_code}]]></return_code>
                    <return_msg><![CDATA[{return_msg}]]></return_msg>
                    </xml>
                    """
        content = template.format(**data)
        return HttpResponse(content, content_type='application/xml')

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET',))
def qrcode_api(request, sid):

    def get():
        if not pay_util.create_store_qrcode(request.get_host(), sid):
            return JsonResponse({'code': 1, 'data': u'生成失败'})
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET',))
@pay_util.token_authentication
def store_api(request, sid):
    def get():
        token = request.GET.get('token')
        openid = pay_util.confirm_validate_token(token)
        store_id_timeout = 60 * 60 * 24
        cache.set(openid, int(sid), timeout=store_id_timeout)
        user = models.User.objects.get(openid=openid)
        maps, created = models.UserStoreMap.objects.get_or_create(
            store_id=int(sid),
            user_id=user.id)
        if created:
            maps.residual_amount = 0
        maps.save()
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET', 'POST'))
@pay_util.token_authentication
def code_api(request):
    def get():
        phone = request.GET.get('phone')
        if pay_util.send_code_to_phone(phone) == 'ok':
            return {'data': 'ok'}

    def post():
        params = QueryDict(request.body)
        phone = params.get('phone')
        code = params.get('code')
        token = params.get('token')
        openid = pay_util.confirm_validate_token(token)
        if int(cache.get(str(phone))) == int(code):
            try:
                store = models.Store.objects.get(boss__phone=phone)
                return {'data': store.boss_id}
            except:
                user = models.User.objects.get_or_create(openid=openid)[0]
                user.phone = phone
                user.save()
                return {'data': 'ok'}
        else:
            return JsonResponse({'code': 1, 'data': 'error'})
    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@pay_util.boss_required
@decorators.standard_api(methods=('POST'))
def upload_file_api(request):
    def post():
        user = request.user
        file_meta = request.FILES.get('file')
        sid = request.user.boss.id
        file_path = os.path.join('./%s_%s.xlsx' % (uuid.uuid4(), sid))
        destination = open(file_path, 'wb+')
        for chunk in file_meta.chunks():
            destination.write(chunk)
        destination.close()
        pay_util.read_excel(file_path, sid, user)
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
@pay_util.token_authentication
def order_history_api(request):
    def get():
        token = request.GET.get('token')
        openid = pay_util.confirm_validate_token(token)
        user = models.User.objects.get(openid=openid)
        print user
        return pay_util.get_order_history(user)
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
@pay_util.token_authentication
def integral_api(request):
    def get():
        token = request.GET.get('token')
        openid = pay_util.confirm_validate_token(token)
        user = models.User.objects.get(openid=openid)
        return pay_util.get_integrals(user)
    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@decorators.standard_api(methods=('GET',))
def integral_qrcode_api(request, sid, num):

    def get():
        if not pay_util.create_integral_qrcode(request.get_host(), sid, num):
            return JsonResponse({'code': 1, 'data': u'生成失败'})
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
@pay_util.token_authentication
def user_integral_api(request, sid, num):
    def get():
        token = request.GET.get('token')
        openid = pay_util.confirm_validate_token(token)
        user = models.User.objects.get(openid=openid)
        year = timezone.now().timetuple().tm_year
        month = timezone.now().timetuple().tm_mon
        logs = models.RechargeLog.objects.filter(
            user_id=user.id,
            time__year=year,
            time__month=month).count()
        if logs > 0:
            raise Exception("done")
        us_map = models.UserStoreMap.objects.get(
            user_id=user.id,
            store_id=int(sid))
        us_map.residual_amount += float(num)
        us_map.save()
        log = models.RechargeLog.objects.create(
            user=user,
            integral=float(num),
            time=timezone.now())
        log.save()
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET', 'POST'))
def item_api(request):
    def get():
        barcode = request.GET.get('barcode')
        result = pay_util.get_item_by_barcode(barcode)
        print result
        return {'data': result}

    def post():
        params = QueryDict(request.body)
        if not pay_util.save_item(params):
            raise Exception('error')
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET', 'DELETE'))
@pay_util.cashier_required
def store_cart_api(request):
    params = QueryDict(request.body)

    def post():
        barcode = params.get('barcode')
        user = pay_util.request_user(request)
        store_id = user.cashier.store_id
        store = models.Store.objects.get(pk=store_id)
        item = models.Item.objects.get(barcode=barcode, store=store)
        cart = models.StoreCart.objects.get_or_create(store=store)[0]
        cart.save()
        cart_item = models.StoreCartItem.objects.create(
            item=item,
            num=1,
            cart=cart)
        cart_item.save()
        return {'data': model_to_dict(item)}

    def get():
        user = pay_util.request_user(request)
        store = user.cashier.store
        cart = models.StoreCart.objects.get(store=store)
        cart_items = cart.get_cart_items()
        amount = 0
        result, amount = pay_util.bundling(cart_items, store)
        return {'items': result, 'amount': amount}

    def delete():
        cart_item_id = params.get('id')
        models.StoreCartItem.objects.filter(id=cart_item_id).delete()

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST',))
@pay_util.cashier_required
def store_order_api(request):
    params = QueryDict(request.body)

    def post():
        sid = int(params.get('sid'))
        helper = StoreOrderHelper(sid)
        result = helper.order()
        return JsonResponse({'code': 0, 'data': result})

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET',))
def pay_image_api(request):

    def get():
        sid = int(request.GET.get('sid'))
        store = models.Store.objects.get(boss_id=sid)
        return {'data': store.pay_image}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET'))
def store_item_api(request):

    def get():
        barcode = request.GET.get('barcode')
        uid = request.GET.get('uid')
        item = models.Item.objects.get(
            store__boss_id=int(uid),
            barcode=barcode)
        return {'data': model_to_dict(item)}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET', 'POST'))
def store_bundling_api(request):
    def get():
        uid = request.GET.get('uid')
        store = models.Store.objects.get(boss_id=int(uid))
        result = pay_util.get_bundlings(store.id)
        return {'data': result}

    def post():
        params = QueryDict(request.body)
        uid = int(params.get('uid'))
        store = models.Store.objects.get(boss_id=uid)
        main_id = params.get('main_id')
        bundling_id = params.get('bundling_id')
        bundling_num = int(params.get('bundling_num'))
        bundling_price = float(params.get('bundling_price'))

        start = "%s 00:00:00" % params.get('start')
        end = "%s 23:59:59" % params.get('end')
        start = datetime.datetime.strptime(start, "%Y-%m-%d %H:%M:%S")
        end = datetime.datetime.strptime(end, "%Y-%m-%d %H:%M:%S")
        if bundling_num <= 0 or main_id is None or bundling_id is None\
                or start is None or end is None:
            raise Exception('params error')
        bundling = models.Bundling.objects.create(
            store=store,
            main_item_id=main_id,
            bundling_item_id=bundling_id,
            bundling_num=bundling_num,
            bundling_price=bundling_price,
            status=1,
            start_time=start,
            end_time=end)
        bundling.save()
    return locals()[request.method.lower()]()
