# -*- coding: utf-8 -*-
from django.http import QueryDict, JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.utils import timezone
from django.conf import settings
from PIL import Image
from xlwt import *
from django.db.models import Q
from utils import decorators,  s3_utils
from utils.datetime_utils import cst
import shortuuid
import datetime
import requests
import json
import uuid
import models
import StringIO
import qrcode
import dailystate_util


@decorators.standard_api(methods=('GET',))
def token(request):
    def get():
        params = request.GET
        code = params.get('code')
        brand_id = params.get('brand_id')
        try:
            config = models.Config.objects.get(brand_id=int(brand_id))
        except Exception, e:
            return JsonResponse({'code': 3, 'data': u'No Brand'})
        url = settings.SMALL_WEIXIN_OPENID_URL
        params = {"appid": config.appid,
                  "secret": config.secret,
                  "js_code": code,
                  "grant_type": 'authorization_code'}
        response = requests.get(url, params=params)
        data = json.loads(response.content)
        guide, leader = None, None
        if 'openid' in data:
            openid = data.get('openid')
            token = dailystate_util.generate_validate_token(openid)
            try:
                guide = models.Guide.objects.get(openid=openid)
            except:
                try:
                    leader = models.GuideLeader.objects.get(openid=openid)
                except:
                    return {'data': {'token': token, 'is_bind': 0}}
            bind = 1 if (guide and guide.telephone) \
                        or (leader and leader.phone) else 0
            return {'data': {'token': token, 'is_bind': bind}}
        else:
            return JsonResponse({'code': 1, 'data': u'token failed'})


    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST'))
def upload_store_receipts_api(request):

    def post():
        params = request.POST
        rid = int(params.get('rid'))
        file = request.FILES.get('img_file')
        account = params.get('account')
        uid = uuid.uuid4()
        log = models.RebateLog.objects.get(id=rid)
        ori_name = 'nls-receipts/%s_ori.jpg' % uid
        image_ = StringIO.StringIO()
        image = Image.open(file)
        image.save(image_, format='JPEG')
        s3_url = s3_utils.upload_to_s3(
            'pay-qrcode',
            ori_name,
            image_.getvalue())

        # log.store_receipts_url = s3_url
        receipts = log.store_receipts
        if receipts and len(receipts) > 0:
            receipts.append(s3_url)
        else:
            receipts = [s3_url]
        log.store_receipts = receipts
        log.save()
        if len(log.store_receipts) != int(account):
            return {'code': 4}
        #发送红包请求
        qrcode_int = shortuuid.ShortUUID().random(length=15)
        total_amount = int(log.item_rebate.rebate * log.num * 100)
        request_data = {
            'qrcode': qrcode_int,
            'device_id': 'NLS%s' % log.guide.telephone,
            'barcode': 6906151890160,
            'total_amount': total_amount}
        r = requests.post(
            "http://test.ichaomeng.com/api/ticket",
            data=request_data)
        response = r.json()
        if response['erron'] != 1 or response['errmsg'] != 'finish':
            return JsonResponse({'code': 3, 'data': 'create error'})
        #上传红包二维码
        url = 'http://test.ichaomeng.com' + \
            '/weixin/rebate?q=%s&b=6906151890160&e=19&s=1' % (
            qrcode_int)

        img = qrcode.make(url)
        f = StringIO.StringIO()
        img.save(f)
        qrcode_name = 'nls-qrcode/%s.jpg' % uid

        qrcode_s3_url = s3_utils.upload_to_s3(
            'pay-qrcode',
            qrcode_name,
            f.getvalue())

        log.red_packets = qrcode_s3_url
        log.qrcode = qrcode_int
        log.save()
        return {'data': qrcode_s3_url}

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
def store_api(request):
    def get():
        user = request.user
        results = dailystate_util.get_map_data(3)
        profiles = dailystate_util.get_checkin_profile(3)
        return {'data': {'store': results, 'profiles': profiles}}
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
def except_api(request):
    def get():
        params = request.GET
        guides = models.Guide.objects.filter(~Q(openid=None))
        temp = []
        start = params.get('start')
        end = params.get('end')
        start = datetime.datetime.strptime(start, "%Y-%m-%d")
        end = datetime.datetime.strptime(end, "%Y-%m-%d")
        date_span = (end-start).days
        if date_span < 0:
            raise Exception('Date Error')
        else:
            date_list = []
            for i in range(0, date_span + 1):
                date = start + datetime.timedelta(i)
                date_list.append(date.strftime("%Y-%m-%d"))
            date_set = set(date_list)
            for guide in guides:
                res = dailystate_util.get_except_data(date_set, guide, start, end)
                if res:
                    temp.extend(res)
        ws = Workbook(encoding='utf-8')
        w = ws.add_sheet(u"第一页")
        w.write(0, 0, u"导购")
        w.write(0, 1, u"时间")
        w.write(0, 2, u"门店")
        # 写入数据
        excel_row = 1
        for obj in temp:
            w.write(excel_row, 0, obj['name'])
            w.write(excel_row, 1, obj['time'])
            w.write(excel_row, 2, obj['store'])
            excel_row += 1
        sio = StringIO.StringIO()
        ws.save(sio)
        sio.seek(0)
        response = HttpResponse(
            sio.getvalue(),
            content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=异常信息.xls'
        response.write(sio.getvalue())
        return response
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
def realtime_checkin_exceptions_api(request):
    def get():
        params = request.GET
        start = params.get('start')
        end = params.get('end')
        start = datetime.datetime.strptime(start, "%Y-%m-%d")
        end = datetime.datetime.strptime(end, "%Y-%m-%d")
        guides = models.Guide.objects.filter(~Q(openid=None))
        date_span = (end-start).days
        if date_span < 0:
            raise Exception('Date Error')
        else:
            date_list = []
            for i in range(0, date_span + 1):
                date = start + datetime.timedelta(i)
                date_list.append(date.strftime("%Y-%m-%d"))
            date_set = set(date_list)
            results = []
            for guide in guides:
                res = dailystate_util.get_realtime_cjeheckin_except_data(
                    date_set,
                    guide,
                    start.strftime("%Y-%m-%d"),
                    end.strftime("%Y-%m-%d") + ' 23:59:59')
                if res:
                    results.extend(res)
        return {'data': results}
    return locals()[request.method.lower()]()