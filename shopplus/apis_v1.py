# -*- coding: utf-8 -*-
import sys
from os.path import dirname, abspath
sys.path.insert(0, dirname(dirname(abspath(__file__))))
from django.contrib.auth.decorators import login_required
from django.views.generic.base import View
from django.http import HttpResponse, QueryDict
from django.conf import settings
from django.forms.models import model_to_dict
from django.utils.decorators import method_decorator
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from xlwt import *
from utils import decorators    
from django.utils import timezone
from pay import pay_util
import json
import random
import os
import requests
import xmltodict
import uuid
import time
import models
import util
import boto
import StringIO
import oss2
import base64,hashlib

endpoint = 'http://oss-cn-shanghai.aliyuncs.com'
access_key_id = 'LTAIXPTosazV9jSq'
access_key_secret = '7uXYe15rjLzEjStAwVraExvAWFkxIw'
bucket_name = 'share-msg'


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                  csrf_exempt], name='dispatch')
class LoginView(View):
    def get(self, request):
        params = request.GET
        code = params.get('code')
        avatar = params.get('avatar')
        gender = params.get('gender')
        nick_name = params.get('name')
        store_id = int(params.get('store_id'))
        url = settings.SMALL_WEIXIN_OPENID_URL
        # appid = "wx45ad4d04e994e744"
        # secret = "fd1b6c384717a5fc1ac53fd78265fac0"
        conf = models.CVSConfig.objects.get(store_id=store_id)
        params = {"appid": conf.appid,
	              "secret": conf.secret,
	              "js_code": code,
	              "grant_type": 'authorization_code'
	            }
        
        response = requests.get(url, params=params)
        data = json.loads(response.content)
        if 'openid' in data:
            openid= data.get('openid')	
            token = pay_util.generate_validate_token(openid)
            user,created = models.User.objects.get_or_create(openid=openid)
            user.nick_name = nick_name
            user.avatar = avatar
            user.app_id = store_id
            user.gender = gender
            user.save()
            if created:
                pass
            return {'code':0, 'data':{'token': token}}
        else:
            {'code':1, 'msg':'failed'}


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                  csrf_exempt], name='dispatch')
class ItemView(View):
    def get(self, request):
     	params = request.GET
    	id = int(params.get('id'))
        today = timezone.now().date()
        item = models.Item.objects.get(id=id)
        if today > item.sold_out:
            return {'code': 2, 'data': u'该商品已下架'}
    	if item.sale_num <=0:
            return {'code': 2, 'data': u'该商品已售空'}
        data = model_to_dict(item)
        data['sold_out'] = item.sold_out.strftime("%Y-%m-%d")
        return {'data': data}

    def post(self, request):
        params = request.POST
        print params, params.get('token')
        sold_out = params.get('date')
        name = params.get('name')
        price = params.get('price')
        original_price = params.get('original_price')
        num = params.get('num')
        store_id = params.get('store_id')
        unit = params.get('unit')
        item = models.Item.objects.get_or_create(
            name=name,
            store_id=store_id,
            price=price,
            sold_out=sold_out,
            sale_num=num,
            uint=unit,
            original_price=original_price)[0]
        file = request.FILES.get('image')
        uid = uuid.uuid4()
        dest = "/data/MiniProgram/%s.jpg" % uid
        dest_ori = "%s_ori.jpg" % uid
        item.icon = 'http://share-msg.oss-cn-shanghai.aliyuncs.com/' + dest_ori
        item.save()
        with open(dest, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
            destination.close()
        bucket = oss2.Bucket(oss2.Auth(access_key_id, access_key_secret), endpoint, bucket_name)
        bucket.put_object_from_file(dest_ori, dest)
        if os.path.exists(dest):
            os.remove(dest)
	return {'data': '上传成功'}
		

@method_decorator([decorators.standard_api(methods=('GET', 'POST'))], name='dispatch')
class ItemsView(View):
    def get(self, request):
        params = request.GET
        sid = int(params.get('sid'))
        items = models.Item.objects.filter(store_id=sid)
        res = []
        for item in items:
            data = model_to_dict(item)
            data['sold_out'] = item.sold_out.strftime("%Y-%m-%d")
            res.append(data)
        return {'data': res}


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                  csrf_exempt], name='dispatch')
class BuyView(View):
    def post(self, request):
        params = QueryDict(request.body)
        user = util.request_user(request)
        store_id = params.get('store_id')
        config = models.CVSConfig.objects.get(store_id=store_id)
        item_id = int(params.get('item_id'))
        num = int(params.get('num'))
        item = models.Item.objects.get(id=item_id)
        if num <= 0:
            return {'code':1, 'data': u'请选购商品'}
        amount = num * item.price
        randuuid = uuid.uuid4()
        nonce_str = str(randuuid).replace('-', '')
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip = request.META.get('HTTP_X_FORWARDED_FOR')
        else:
            ip = request.META.get('REMOTE_ADDR')
        if ip in getattr(settings, 'BLOCKED_IPS', []):
            return HttpResponseForbidden('<h1>Forbbidden</h1>')
        # 创建订单
        url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
        # random_num = random.randint(100, 999)
        # write_off_code = str(user.id) + str(random_num)
        order = models.Order.objects.create(
            store_id=store_id,
            user=user,
            order_time=timezone.now())
        order.save()
        models.OrderItem.objects.create(
            order=order,
            item_id=item_id,
            subtotal=amount,
            num=num)
        out_trade_no = pay_util.create_mch_billno(str(order.id))
        order.out_trade_no = out_trade_no
        order.save()
        data = {}
        data['body'] = u'便利购'
        data['mch_id'] = config.mch_id
        data['nonce_str'] = nonce_str
        # data['device_info'] = 'WEB'
        data['total_fee'] = str(int(amount * 100))
        data['spbill_create_ip'] = ip
        # data['fee_type'] = 'CNY'
        data['openid'] = user.openid
        data['out_trade_no'] = out_trade_no
        data['notify_url'] = 'http://%s/api/v1/shopplus/notify' % (request.get_host())
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


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                  csrf_exempt], name='dispatch')
class notifyView(View):
    def post(self, request):
        d = xmltodict.parse(request.body)
        resp = dict(d['xml'])
        return_code = resp.get('return_code')
        data = {}
        if return_code == 'SUCCESS':
            """
            todo 这里需要做签名校验
            """
            order = models.Order.objects.get(
                out_trade_no=resp.get('out_trade_no'))
            amount = 0.0
            for orderitem in order.orderitem_set.all():
                amount += float(orderitem.subtotal)
            # if hasattr(store, 'cvsconfig'):
            #     config = order.store.cvsconfig
            # else:
            #     raise Exception('No config')
            config = order.store.cvsconfig
            if resp.get('appid') == config.appid \
                and resp.get('mch_id') == config.mch_id \
                    and float(resp.get('total_fee')) == amount * 100:
                order.status = 1
                # 支付方式（现金）
                order.pay_way = 1
                order.out_trade_no = resp.get('out_trade_no')
                order.save()
                
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


@method_decorator([decorators.standard_api(methods=('GET', 'POST'))], name='dispatch')
class OrderView(View):
    def get(self, request):
        params = request.GET
        user = util.request_user(request)
        store_id = int(params.get('store_id'))
        orders = get_orders(store_id, user.id)
        return {'data': orders}