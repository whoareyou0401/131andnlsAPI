# -*- coding: utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.views.generic.base import View
from django.http import HttpResponse, QueryDict
from django.conf import settings
from django.forms.models import model_to_dict
from django.utils.decorators import method_decorator
from xlwt import *
from utils import decorators

import requests
import pay_util
import models
import StringIO
import os
import datetime
import uuid


REWARD_INTEGRATION = 150


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                   login_required(login_url='/login/'),
                   pay_util.manager_required], name='dispatch')
class SalesProfileApi(View):

    def get(self, request):
        params = request.GET
        start_time = '%s 00:00:00' % params.get('start_time')
        end_time = '%s 23:59:59' % params.get('end_time')
        user = request.user
        key_word = params.get('key_word')
        current_page = int(params.get('page'))
        store = user.boss

        res = pay_util.get_store_sales_data_by_date(
            store.id,
            start_time,
            end_time,
            key_word)
        if not key_word:
            page_count = len(res) / 10
            paginator = pay_util.CustomPaginator(
                current_page,
                page_count,
                res,
                10)
            try:
                #获取前端传过来显示当前页的数据
                paginator = paginator.page(current_page)
            except PageNotAnInteger:
                # 如果有异常则显示第一页
                paginator = paginator.page(1)
            except EmptyPage:
            # 如果没有得到具体的分页内容的话,则显示最后一页
                paginator = paginator.page(paginator.num_pages)
            return {'data': {
                    'data': paginator.object_list,
                    'pages': page_count,
                    'count': len(res)}
                    }
        else:
            return {'data': {
                    'data': res,
                    'pages': 0,
                    'count': len(res)}
                    }


@method_decorator([decorators.standard_api(methods=('GET')),
                   login_required(login_url='/login/'),
                   pay_util.manager_required], name='dispatch')
class SalesProfileExcelApi(View):

    def get(self, request):
        params = request.GET
        start_time = '%s 00:00:00' % params.get('start_time')
        end_time = '%s 23:59:59' % params.get('end_time')
        key_word = params.get('key_word')
        user = request.user
        store = user.boss

        res = pay_util.get_store_sales_data_by_date(
            store.id,
            start_time,
            end_time,
            key_word)
        ws = Workbook(encoding='utf-8')
        w = ws.add_sheet(u"第一页")
        w.write(0, 0, u"条码")
        w.write(0, 1, u"商品名称")
        w.write(0, 2, u"价格")
        w.write(0, 3, u"销售数量")
        # 写入数据
        excel_row = 1
        for obj in res:
            w.write(excel_row, 0, obj['barcode'])
            w.write(excel_row, 1, obj['item_name'])
            w.write(excel_row, 2, obj['price'])
            w.write(excel_row, 3, obj['num'])
            excel_row += 1
        sio = StringIO.StringIO()
        ws.save(sio)
        sio.seek(0)
        response = HttpResponse(
            sio.getvalue(),
            content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=销售数据.xls'
        response.write(sio.getvalue())
        return response


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                   login_required(login_url='/login/'),
                   pay_util.manager_required], name='dispatch')
class NewItemMessageApi(View):

    def post(self, request):
        user = request.user
        file_meta = request.FILES.get('file')
        sid = request.user.boss.id
        if hasattr(user, 'cmusertopayusermap'):
            pay_user = user.cmusertopayusermap.pay_user
        else:
            return {'code': 3}
        file_path = os.path.join('./%s_%s.xlsx' % (uuid.uuid4(), sid))
        destination = open(file_path, 'wb+')
        for chunk in file_meta.chunks():
            destination.write(chunk)
        destination.close()
        pay_util.read_new_item_excel(file_path, sid, pay_user)


@method_decorator([decorators.standard_api(methods=('GET', 'POST'))], name='dispatch')
class WeixinPayAccountApi(View):

    def get(self, request):
        sid = int(request.GET.get('sid'))
        date = request.GET.get('date')
        if date:
            date = ''.join(date.split('-'))
        else:
            date = ''.join(str(datetime.datetime.today().date()).split('-'))
        url = settings.WEIXIN_PAY_ACCOUNT_URL
        config = models.CVSConfig.objects.get(store_id=sid)
        data = {}
        randuuid = uuid.uuid4()
        nonce_str = str(randuuid).replace('-', '')
        data['mch_id'] = config.mch_id
        data['nonce_str'] = nonce_str
        data['bill_date'] = date
        data['appid'] = config.appid
        data['bill_type'] = 'ALL'
        data['sign'] = pay_util.sign(data, config.pay_api_key)

        template = """
                    <xml>
                    <appid>{appid}</appid>
                    <bill_date>{bill_date}</bill_date>
                    <bill_type>{bill_type}</bill_type>
                    <mch_id>{mch_id}</mch_id>
                    <nonce_str>{nonce_str}</nonce_str>
                    <sign>{sign}</sign>
                    </xml>
                """
        content = template.format(**data)
        headers = {'Content-Type': 'application/xml'}
        raw = requests.post(url, data=content, headers=headers)
        res = []
        for i in raw.content.split('\n'):
            # print i
            array = i.split(',')
            if len(array) > 7:
                if str(array[6]) == u'商户订单号':
                    pass
                else:
                    res.append({'order_id': str(array[6][1:]),
                                'openid': str(array[7][1:])})
        return {'data': res}


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                  pay_util.token_authentication], name='dispatch')
class ActiveConfigApi(View):

    def get(self, request):
        params = request.GET
        sid = int(params.get('sid'))
        confs = models.SwiperConfig.objects.filter(
            item__store_id=sid,
            is_active=True).select_related('item')
        res = []
        for conf in confs:
            tmp = model_to_dict(conf)
            tmp['barcode'] = conf.item.barcode
            res.append(tmp)
        return {'data': res}


@method_decorator([decorators.standard_api(methods=('GET', 'POST')),
                  pay_util.manager_required,
                  login_required(login_url='/login/')], name='dispatch')
class IntegrationAvgApi(View):

    def post(self, request):
        params = QueryDict(request.body)
        avg = int(params.get('avg'))
        company = request.user.company_set.all()[0]
        maps = models.UserStoreMap.objects.filter(user__company_id=company.id)
        for user_map in maps:
            user_map.residual_amount += avg
            user_map.save()
            models.RechargeLog.objects.create(
                user=user_map.user,
                integral=user_map.residual_amount)
        results = pay_util.get_users_integration(company)
        return {'data': results}
