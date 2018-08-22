# -*- coding: utf-8 -*-
from django.http import QueryDict, JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.db.models import Q
from PIL import Image
from utils import decorators, datetime_utils, s3_utils
from core import sql_utils
from utils.recommendorder_utils import location_to_addrr
from utils.recommendorder_utils import address_to_lcoation
from utils.recommendorder_utils import distance
from pay.pay_util import token_authentication
from utils.datetime_utils import cst
from xlwt import *
import boto
import datetime
import shortuuid
import redis
import requests
import uuid
import os
import sqlalchemy
import pandas
import models
import logging
import json
import forms
import dailystate_util as dsu
import StringIO
import qrcode
import pytz

logger = logging.getLogger(__name__)
EXCEL_ROOT_URL = 'https://s3.cn-north-1.amazonaws.com.cn/daily-statement'
# client = redis.Redis(
#     host=settings.CM_REDIS_URL,
#     port=settings.CM_REDIS_PORT,
#     db=settings.CM_VENDOR_REIDS_DB)
# pubsub = client.pubsub()
# pubsub.subscribe(['realtime_checkin', 'work_checkin'])


@decorators.standard_api(methods=('GET', ))
def token(request):
    def get():
        params = request.GET
        code = params.get('code')
        brand_id = params.get('brand_id', None)
        url = settings.SMALL_WEIXIN_OPENID_URL
        if brand_id:
            try:
                conf = models.Config.objects.get(brand_id=int(brand_id))
                appid = conf.appid
                secret = conf.secret
            except:
                return JsonResponse({'code': 1, 'data': u'Brand_id Illegal'})
        else:
            appid = settings.DAILYSTATE_WEIXIN_APPID
            secret = settings.DAILYSTATE_WEIXIN_SECRET
        params = {
            "appid": appid,
            "secret": secret,
            "js_code": code,
            "grant_type": 'authorization_code'
        }
        response = requests.get(url, params=params)
        data = json.loads(response.content)
        guide, leader = None, None
        if 'openid' in data:
            openid = data.get('openid')
            token = dsu.generate_validate_token(openid)
            try:
                guide = models.Guide.objects.get(openid=openid)
                if guide.status == 2:
                    return JsonResponse({
                        'code':
                        2,
                        'data':
                        u'离职员工无法登录，'
                        u'如有疑问，请联系牛栏山工作人员'
                    })
            except BaseException:
                try:
                    leader = models.GuideLeader.objects.get(openid=openid)
                except BaseException:
                    return {'data': {'token': token, 'is_bind': 0}}
            bind = 1 if (guide and guide.telephone) \
                or (leader and leader.phone) else 0
            return {'data': {'token': token, 'is_bind': bind}}
        else:
            return JsonResponse({'code': 1, 'data': u'token failed'})


    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', ))
@token_authentication
def guide_phone_api(request):
    params = QueryDict(request.body)

    def post():
        token = params.get('token')
        phone = params.get('phone')
        if not phone or len(phone) == 0:
            return JsonResponse({'code': 2, 'data': u'邀请码不能为空'})
        openid = dsu.confirm_validate_token(token)
        try:
            guide = models.Guide.objects.get(telephone=phone)
            guide.openid = openid
            guide.save()
        except models.Guide.DoesNotExist:
            leader = models.GuideLeader.objects.get(phone=phone)
            leader.openid = openid
            leader.save()

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET', ))
@dsu.get_request_authentication
@token_authentication
def category_api(request):
    def get():
        token = request.GET.get('token')
        openid = dsu.confirm_validate_token(token)
        guide = models.Guide.objects.get(openid=openid)
        json_groups = dsu.get_groups(guide.brand_id)
        return {'data': json_groups}

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET', ))
@dsu.get_request_authentication
@token_authentication
def goods_api(request):
    def get():
        form = forms.GoodListForm(request.GET or None)
        if form.is_valid():
            token = form.cleaned_data.get('token')
            openid = dsu.confirm_validate_token(token)
            gid = form.cleaned_data.get('group_id')
            guide = models.Guide.objects.get(openid=openid)
            json_goods = dsu.get_goods(int(gid), guide.id)
            return {'data': json_goods}
        else:
            return JsonResponse({'code': 1, 'data': u'params Error'})

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', ))
@token_authentication
def statement_api(request):
    def post():
        form = forms.StatementForm(request.POST or None)
        if form.is_valid():
            start_stock = form.cleaned_data.get('start_stock')
            among_stock = form.cleaned_data.get('among_stock')
            sales = form.cleaned_data.get('sales')
            end_stock = form.cleaned_data.get('end_stock')
            goods_id = form.cleaned_data.get('goods_id')
            token = form.cleaned_data.get('token')
            openid = dsu.confirm_validate_token(token)
            guide = models.Guide.objects.get(openid=openid)
            day = timezone.now().timetuple().tm_mday
            year = timezone.now().timetuple().tm_year
            month = timezone.now().timetuple().tm_mon
            statements = models.Statement.objects.filter(
                operator_id=guide.id,
                goods_id=goods_id,
                create_time__day=day,
                create_time__year=year,
                create_time__month=month,
                store_id=guide.store_id)
            length = len(statements)
            if length == 1:
                statement = statements[0]
                statement.start = start_stock
                statement.middle = among_stock
                statement.sales = sales
                statement.end = end_stock
                statement.save()
            elif length == 0:
                statement = models.Statement.objects.create(
                    operator_id=guide.id,
                    goods_id=goods_id,
                    start=start_stock,
                    middle=among_stock,
                    sales=sales,
                    end=end_stock,
                    create_time=timezone.now(),
                    store_id=guide.store_id)
                statement.save()
            else:
                return {'data': model_to_dict(statements[-1])}
            return {'data': model_to_dict(statement)}
        else:
            return JsonResponse({'code': 1, 'data': u'params Error'})

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=('POST', ))
def excel_template_api(request):
    user = request.user
    brandor = user.brand

    def post():
        form = forms.TemplateFieldForm(request.POST or None)
        if form.is_valid():
            fields = form.cleaned_data.get('fields')
            template_type = form.cleaned_data.get('template_type')
            fields_array = fields.split('+')
            conn = boto.connect_s3(
                settings.AWS_ACCESS_KEY_ID,
                settings.AWS_SECRET_ACCESS_KEY,
                host=settings.AWS_S3_HOST)
            bucket = conn.get_bucket('daily-statement')
            if template_type == 'item':
                ori_name = 'items/%s_shangpin.csv' % brandor.id
                sheet_name = u'商品信息'
            elif template_type == 'store':
                ori_name = 'store/%s_mendian.csv' % brandor.id
                sheet_name = u'门店信息'
            elif template_type == 'guide':
                ori_name = 'guides/%s_daogou.csv' % brandor.id
                sheet_name = u'导购信息'
            else:
                return JsonResponse({'code': 1, 'data': u'type Error'})
            content = dsu.create_upload_excel(fields_array, sheet_name)
            k = boto.s3.key.Key(bucket)
            k.key = ori_name
            k.content_type = 'application/ms-excel'
            k.set_contents_from_file(content, policy="public-read")
        else:
            return JsonResponse({'code': 1, 'data': u'params Error'})

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'POST',
    'GET',
))
def excel_api(request):
    user = request.user
    brandor = user.brand

    def post():
        form = forms.TemplateFieldForm(request.POST or None)
        if form.is_valid():
            template_type = form.cleaned_data.get('template_type')
            uid = uuid.uuid4()
            file_meta = request.FILES.get('file')
            file_path = os.path.join('./%s_%s.csv' % (brandor.id, uid))
            destination = open(file_path, 'wb+')
            for chunk in file_meta.chunks():
                destination.write(chunk)
            destination.close()
            try:
                dsu.read_excel(file_path, template_type, brandor)
            except Exception as e:
                print(e)

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET', ))
@token_authentication
def goods_search_api(request):
    def get():
        statement_dict = {}
        form = forms.SearchForm(request.GET or None)
        if form.is_valid():
            token = form.cleaned_data.get('token')
            openid = dsu.confirm_validate_token(token)
            barcode = form.cleaned_data.get('barcode')
            try:
                goods = models.Goods.objects.get(barcode=barcode)
            except:
                return JsonResponse({'code': 1, 'data': u'not found'})
            if hasattr(goods, 'statement_set'):
                time = timezone.now()
                day = time.timetuple().tm_mday
                year = time.timetuple().tm_year
                month = time.timetuple().tm_mon
                statement = goods.statement_set.filter(
                    create_time__day=day,
                    create_time__month=month,
                    create_time__year=year,
                    operator__openid=openid)
                if len(statement) > 0:
                    statement_dict = model_to_dict(statement[0])
                else:
                    statement_dict = None
            return {
                'data': {
                    'goods': model_to_dict(goods),
                    'statement': statement_dict
                }
            }
        else:
            return JsonResponse({'code': 1, 'data': u'params Error'})

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@token_authentication
def checkin_api(request):
    def post():
        # today = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
        tz = pytz.timezone('Asia/Shanghai')
        today = datetime.datetime.now(tz).strftime("%Y-%m-%d")
        params = QueryDict(request.body)
        working = 1
        worked = 2
        real_time = 3
        token = params.get('token')
        openid = dsu.confirm_validate_token(token)
        lat = float(params.get('lat'))
        lng = float(params.get('lng'))
        checkin_type = int(params.get('checkin_type'))
        phone_model = params.get('model')
        phone_platform = params.get('platform')
        phone_system = params.get('system')
        guide = models.Guide.objects.get(openid=openid)
        location = str(lng) + ',' + str(lat)

        # push_data:电视实时显示签到情况页面所需要的数据
        gd_address, adcode = location_to_addrr(location)
        push_data = {
            'name': guide.name,
            'time': cst(datetime.datetime.now(tz)),
            'type': checkin_type,
            'place': gd_address,
            'phone': guide.telephone,
            'brand_id': guide.brand_id,
            'store_id': guide.store_id
        }

        # 补全签到状态记录表CheckinExceptionLog
        checklog = models.CheckinExceptionLog.objects.filter(
            guide=guide).order_by('-add_time')[:1]
        now = datetime.datetime.now(tz)
        if len(checklog) > 0:
            last_time = checklog[0].add_time
        else:
            last_time = now
        days = (now - last_time).days
        if days > 0:
            for day in range(days - 1):
                missing_day = last_time + datetime.timedelta(days=day + 1)
                if (guide.status == 1):
                    models.CheckinExceptionLog.objects.create(
                        exception_type=6, guide=guide, add_time=missing_day)
                    models.RealTimeCheckinExceptionLog.objects.create(
                        exception_type=6, guide=guide, add_time=missing_day)
                else:
                    models.CheckinExceptionLog.objects.create(
                        exception_type=3, guide=guide, add_time=missing_day)
                    models.RealTimeCheckinExceptionLog.objects.create(
                        exception_type=3, guide=guide, add_time=missing_day)

        # 获取长促排班信息
        today_now = cst(datetime.datetime.now(tz))
        today_now = datetime.datetime.strptime(today_now, "%Y-%m-%d %H:%M")
        start_time = today_now
        plan = None
        if guide.status == 0:
            try:
                plan = models.GuideWorkPlan.objects.get(
                    guide=guide, date=today)
                guide_work_plan = models.WorkTimeTable.objects.get(
                    store_id=guide.store_id, work_type=plan.work_type)
            except BaseException:
                guide_work_plan = None
            if guide_work_plan:
                start_time = datetime.datetime.strptime(
                    today + ' ' + str(guide_work_plan.start_time)[:-3],
                    "%Y-%m-%d %H:%M")
        # 获取门店地址
        store = models.Store.objects.get(guide=guide)
        if store.lat:
            checkin_distance = distance(lat, lng, store.lat, store.lng)
        else:
            store_lat, store_lng, adcode = address_to_lcoation(
                store.store_address)
            if (store_lat):
                models.Store.objects.filter(id=store.id).update(
                    lat=store_lat, lng=store_lng)
                checkin_distance = distance(lat, lng, store_lat, store_lng)
            else:
                checkin_distance = -1
        if guide.status == 3:
            checkin = models.Checkin.objects.filter(guide=guide)
            if len(checkin) >= 3:
                checkin = checkin[2]
                checkin_distance = distance(lat, lng, checkin.work_lat,
                                            checkin.work_lng)
        if (checkin_distance < 1):
            distances = checkin_distance * 1000
            distances = round(distances)
            place = '距离为' + str(int(distances)) + '米'
        else:
            distances = round(checkin_distance)
            place = '距离大于' + str(int(distances)) + '千米'
        # 判断打卡类型
        # 上班打卡
        if checkin_type == working:
            # 检查今日是否有过上班签到,创建上班签到
            sql = '''
                            SELECT
                                *
                            FROM
                                dailystatement_checkin
                            WHERE
                                guide_id = %(guide_id)s
                            AND
                                work_time::date = %(day)s
                            '''
            cur = connection.cursor()
            cur.execute(sql, params={'guide_id': guide.id, 'day': today})
            checkinlog = sql_utils.dictfetchall(cur)
            if len(checkinlog) > 0:
                return {'code': 4, 'data': u'上班卡已签，请在签到记录中查询。不可重复签到'}
            else:
                checkin = models.Checkin.objects.create(
                    guide=guide,
                    work_address=place,
                    work_lng=lng,
                    work_lat=lat,
                    phone_model=phone_model,
                    phone_platform=phone_platform,
                    phone_system=phone_system)

            # 检查签到是否异常
            # 距离大于500m标记为位置异常
            if checkin_distance > 0.5:
                models.CheckinExceptionLog.objects.create(
                    exception_type=4,
                    guide=guide,
                    checkin=checkin,
                    add_time=now)
            # 长促上班时间超过30分钟标记为迟到
            if guide.status == 0:
                # 排班不准，暂时不管迟到
                # if plan is None:
                #     models.CheckinExceptionLog.objects.create(
                #         exception_type=7,
                #         guide=guide,
                #         checkin=checkin,
                #         add_time=now
                #     )
                #     return {'code': 0}
                if today_now < start_time or (
                        today_now - start_time).seconds / 60 < 30:
                    push_data['except'] = 0
                else:
                    # models.CheckinExceptionLog.objects.create(
                    #     exception_type=1,
                    #     guide=guide,
                    #     checkin=checkin,
                    #     add_time=now,
                    #     guide_work_plan=plan
                    # )

                    push_data['except'] = 2
                    excepts = models.CheckinExceptionLog.objects.filter(
                        exception_type=1).order_by('-add_time')
                    excepts_array = []
                    for excep in excepts:
                        temp = model_to_dict(excep)
                        temp['add_time'] = str(excep.add_time)
                        excepts_array.append(temp)
                    push_data['late'] = excepts_array

        # 下班打卡
        elif checkin_type == worked:
            # 查最新一条上班时间距离现在不超过24h没有下班打卡的记录，添加下班打卡记录
            sql = '''
                    SELECT
                        *
                    FROM
                        dailystatement_checkin
                    WHERE
                        guide_id = %(guide_id)s
                    AND
                        (now()-work_time) < interval '24 hour'
                    ORDER BY
                        work_time desc
                    LIMIT
                        1
                '''
            cur = connection.cursor()
            cur.execute(sql, params={'guide_id': guide.id})
            checkinlog = sql_utils.dictfetchall(cur)
            if len(checkinlog) > 0:
                if (checkinlog[0]['worked_lat']):
                    return {'code': 4, 'data': u'下班卡已签，请在签到记录中查询。不可重复签到'}
                models.Checkin.objects.filter(
                    id=int(checkinlog[0]['id'])).update(
                        worked_address=place,
                        worked_lng=lng,
                        worked_lat=lat,
                        worked_time=datetime.datetime.now(tz))
            else:
                return {'code': 4, 'data': u'尚未查询到上班记录，请先打上班卡'}
            # 检查签到是否异常
            # 距离大于500m标记为位置异常
            checkin = models.Checkin.objects.get(id=int(checkinlog[0]['id']))
            if checkin_distance > 0.5:
                models.CheckinExceptionLog.objects.create(
                    exception_type=4,
                    guide=guide,
                    checkin=checkin,
                    add_time=now,
                    guide_work_plan=plan)
            # 长促下班时间距离标准提早超过30分钟标记为早退,未排班&短促时间不足8小时为早退
            work_time = checkin.work_time
            # 排班不准，暂时不管早退
            # if guide.status == 0 and guide_work_plan:
            #     # 当前距离标准上班时间的时间间隔
            #     spread = guide_work_plan.spread
            #     compute_spread = (now - start_time).seconds / 60
            # else:
            #     spread = 60 * 8
            #     compute_spread = (now - work_time).seconds / 60

            # 判断时间不足8小时
            spread = 60 * 8
            compute_spread = (now - work_time).seconds / 60
            if (compute_spread > spread - 30):
                models.CheckinExceptionLog.objects.create(
                    exception_type=0,
                    guide=guide,
                    checkin=checkin,
                    add_time=now,
                    guide_work_plan=plan)

                push_data['except'] = 1
            else:
                models.CheckinExceptionLog.objects.create(
                    exception_type=5,
                    guide=guide,
                    checkin=checkin,
                    add_time=now,
                    guide_work_plan=plan)

                push_data['except'] = 3
                excepts = models.CheckinExceptionLog.objects.filter(
                    exception_type=2).order_by('-add_time')
                excepts_array = []
                for excep in excepts:
                    temp = model_to_dict(excep)
                    temp['add_time'] = str(excep.add_time)
                    excepts_array.append(temp)
                push_data['leave_early'] = excepts_array

        # 即时打卡
        elif checkin_type == real_time:
            checkin = models.RealTimeCheck.objects.create(
                guide=guide,
                address=gd_address,
                lat=lat,
                lng=lng,
                time=now,
                phone_model=phone_model,
                phone_platform=phone_platform,
                phone_system=phone_system)
            checkin.save()
            now_time = datetime.datetime.strptime(
                cst(now).split(' ')[-1], "%H:%M")
            rules = guide.brand.realtimechackinrules.times
            is_exception = True
            for rule in rules:
                rule = rule.strftime("%H:%M")
                rule = datetime.datetime.strptime(rule, "%H:%M")
                if rule > now_time:
                    res = (rule - now_time).seconds / 60
                else:
                    res = (now_time - rule).seconds / 60
                if res <= 30:
                    is_exception = False
                    break
            if is_exception:
                models.RealTimeCheckinExceptionLog.objects.create(
                    guide=guide, checkin=checkin, exception_type=1)
            return {'data': 'ok'}
        try:
            profile = dsu.get_checkin_profile(guide.brand_id)
            push_data.update(profile)
            # client.publish('work_checkin', json.dumps(push_data))
        except BaseException:
            pass

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('POST', 'GET'))
@token_authentication
def checkin_history_api(request):
    def get():
        token = request.GET.get('token')
        get_type = request.GET.get('type')
        openid = dsu.confirm_validate_token(token)
        results = []
        if get_type == 'work':
            try:
                leader = models.GuideLeader.objects.get(openid=openid)
                sql = '''SELECT guide.id,
                                guide.name,
                                checkin.guide_id,
                                checkin.work_time,
                                checkin.work_address,
                                checkin.worked_time,
                                checkin.worked_address
                        FROM dailystatement_guideleader AS leader
                        LEFT JOIN dailystatement_guide AS guide
                        ON leader.id=guide.leader_id
                        LEFT JOIN dailystatement_checkin AS checkin
                        ON guide.id=checkin.guide_id
                        WHERE leader.id=%(id)s
                        AND (checkin.work_time <=now() AND
                            checkin.work_time>=date_trunc('day', now()))
                        OR (checkin.worked_time <=now() AND
                            checkin.worked_time>=date_trunc('day', now()));'''
                cur = connection.cursor()
                cur.execute(sql, params={'id': leader.id})
                checkins = sql_utils.dictfetchall(cur)
                # 上下班考勤记录
                for checkin in checkins:
                    checkin['work_time'] = datetime_utils.cst(
                        checkin['work_time']) \
                        if checkin['work_address'] else ''
                    checkin['worked_time'] = datetime_utils.cst(
                        checkin['worked_time']) \
                        if checkin['worked_address'] else ''
                    checkin['work_address'] = checkin['work_address'] \
                        if checkin['work_address'] else ''
                    checkin['worked_address'] = checkin['worked_address'] \
                        if checkin['worked_address'] else ''
                results = sorted(
                    checkins, key=lambda dic: dic['work_time'], reverse=True)
            except BaseException:
                # guide = models.Guide.objects.get(openid=openid)
                sql = '''SELECT guide.id,
                                guide.name,
                                checkin.guide_id,
                                checkin.work_time,
                                checkin.work_address,
                                checkin.worked_time,
                                checkin.worked_address
                        FROM  dailystatement_guide AS guide
                        LEFT JOIN dailystatement_checkin AS checkin
                        ON guide.id=checkin.guide_id
                        WHERE guide.openid=%(openid)s
                        ORDER BY checkin.work_time DESC
                        LIMIT 60;'''
                cur = connection.cursor()
                cur.execute(sql, params={'openid': openid})
                checkins = sql_utils.dictfetchall(cur)
                # 上下班考勤记录
                for checkin in checkins:
                    checkin['work_time'] = datetime_utils.cst(
                        checkin['work_time']) \
                        if checkin['work_address'] else ''
                    checkin['worked_time'] = datetime_utils.cst(
                        checkin['worked_time']) \
                        if checkin['worked_address'] else ''
                    checkin['work_address'] = checkin['work_address'] \
                        if checkin['work_address'] else ''
                    checkin['worked_address'] = checkin['worked_address'] \
                        if checkin['worked_address'] else ''
                results = sorted(
                    checkins, key=lambda dic: dic['work_time'], reverse=True)
        if get_type == 'realtime':
            try:
                leader = models.GuideLeader.objects.get(openid=openid)
                sql = '''SELECT guide.id,
                                guide.name,
                                checkin.guide_id,
                                checkin.time,
                                checkin.address
                        FROM dailystatement_guideleader AS leader
                        LEFT JOIN dailystatement_guide AS guide
                        ON leader.id=guide.leader_id
                        LEFT JOIN dailystatement_realtimecheck AS checkin
                        ON guide.id=checkin.guide_id
                        WHERE leader.id=%(id)s
                        AND checkin.time <=now() AND
                            checkin.time>=date_trunc('day', now());
                        '''
                cur = connection.cursor()
                cur.execute(sql, params={'id': leader.id})
                checkins = sql_utils.dictfetchall(cur)
                # 上下班考勤记录
                for checkin in checkins:
                    checkin['time'] = datetime_utils.cst(checkin['time'])
                    results.append(checkin)
                results = sorted(
                    checkins, key=lambda dic: dic['time'], reverse=True)
            except BaseException:
                sql = '''SELECT guide.id,
                                guide.name,
                                checkin.guide_id,
                                checkin.time,
                                checkin.address
                        FROM dailystatement_guide AS guide
                        LEFT JOIN dailystatement_realtimecheck AS checkin
                        ON guide.id=checkin.guide_id
                        WHERE guide.openid=%(openid)s
                        AND checkin.time <=now() AND
                            checkin.time>=date_trunc('day', now());
                        '''
                cur = connection.cursor()
                cur.execute(sql, params={'openid': openid})
                checkins = sql_utils.dictfetchall(cur)
                # 上下班考勤记录
                for checkin in checkins:
                    checkin['time'] = datetime_utils.cst(checkin['time'])
                results = sorted(
                    checkins, key=lambda dic: dic['time'], reverse=True)
        return {'data': results}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@token_authentication
def item_api(request):
    def post():
        params = QueryDict(request.body)
        token = params.get('token')
        barcode = params.get('barcode')
        name = params.get('name')
        category_id = int(params.get('cid'))
        openid = dsu.confirm_validate_token(token)
        guide = models.Guide.objects.get(openid=openid)
        count = models.Goods.objects.filter(
            barcode=barcode, groups__brand_id=guide.brand_id).count()
        if count > 0:
            return {'code': 3}
        else:
            group = models.Groups.objects.get_or_create(
                brand_id=guide.brand_id, name=u'无')[0]
            group.save()
            goods = models.Goods.objects.create(
                groups_id=group.id,
                name=name,
                barcode=barcode,
                category_id=category_id)
            goods.save()
            log = models.AddItemLog.objects.create(guide=guide, goods=goods)
            log.save()

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET'))
def category_search_api(request):
    def get():
        code = request.GET.get('code')
        data_engine = sqlalchemy.create_engine(settings.STD_DB_URL)
        res_data = []
        if int(code) == -1:
            results = pandas.read_sql_query(
                sqlalchemy.text(""" SELECT
                                        id,
                                        name,
                                        code
                                    FROM standard_category
                                    WHERE
                                    level=2;
                                """), data_engine)
        else:
            results = pandas.read_sql_query(
                sqlalchemy.text(""" SELECT
                                        id,
                                        name,
                                        code
                                    FROM standard_category
                                    WHERE
                                    lv2_code=:code;
                                """),
                data_engine,
                params={
                    'code': code
                })
        for item in results.itertuples():
            item_dict = {}
            item_dict['id'] = item[1]
            item_dict['name'] = item[2]
            item_dict['code'] = item[3]
            res_data.append(item_dict)
        return {'data': res_data}

    return locals()[request.method.lower()]()


@csrf_exempt
@token_authentication
@decorators.standard_api(methods=('GET', 'POST', 'PUT'))
def work_api(request):
    def post():
        params = QueryDict(request.body)
        date = dsu.next_week_datetime()['period'][int(params.get('weekday'))]
        work_type = int(params.get('work_type'))
        token = params.get('token')
        openid = dsu.confirm_validate_token(token)
        guide = models.Guide.objects.get(openid=openid)
        guide_work_plan = models.GuideWorkPlan.objects.get_or_create(
            guide=guide, date=date)[0]
        guide_work_plan.work_type = work_type
        guide_work_plan.save()

    def get():
        params = request.GET
        token = params.get('token')
        openid = dsu.confirm_validate_token(token)
        dates = dsu.next_week_datetime()['period']
        plans = models.GuideWorkPlan.objects.filter(
            guide__openid=openid,
            date__gte=timezone.now().date(),
            date__lte=dates[-1]).order('date')[7]
        results = [model_to_dict(plan) for plan in plans]
        return {'data': results}

    def put():
        params = QueryDict(request.body)
        date = params.get('date')
        work_type = int(params.get('type'))
        token = params.get('token')
        openid = dsu.confirm_validate_token(token)
        try:
            plan = models.GuideWorkPlan.objects.get(
                guide__openid=openid, date=date)
            log = models.ChangePlanLog.objects.create(
                plan=plan, new_type=work_type)
            plan.work_type = work_type
            plan.save()
            log.save()
        except BaseException:
            return {'code': 0, 'data': 'none'}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET', 'POST'))
def leave_type_api(request):
    def get():
        types = models.LeaveType.objects.all()
        results = [model_to_dict(leave_type) for leave_type in types]
        return {'data': results}

    def post():
        params = QueryDict(request.body)
        leave_type = int(params.get('leave_type'))
        leave_begin = params.get('leave_begin')
        leave_end = params.get('leave_end')
        remark = params.get('remark')
        token = params.get('token')
        openid = dsu.confirm_validate_token(token)
        guide = models.Guide.objects.get(openid=openid)
        leave = models.GuideLeave.objects.create(
            guide=guide,
            leave_begin=leave_begin,
            leave_end=leave_end,
            leave_type_id=leave_type,
            remark=remark)
        leave.save()
        models.GuideWorkPlan.objects.filter(
            guide=guide, date__gte=leave_begin,
            date__lte=leave_end).update(guide_leave=leave.id)

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET', 'POST'))
def work_talbe_api(request):
    def get():
        params = request.GET
        token = params.get('token')
        openid = dsu.confirm_validate_token(token)
        guide = models.Guide.objects.get(openid=openid)
        work_tables = models.WorkTimeTable.objects.filter(
            store_id=guide.store_id)
        results = []
        for table in work_tables:
            temp = model_to_dict(table)
            temp['start_time'] = temp['start_time'].strftime('%H:%M')
            temp['hour'] = temp['spread'] / 60
            temp['minute'] = temp['spread'] % 60
            results.append(temp)
        result = sorted(results, key=lambda dic: dic['work_type'])
        return {'data': result}

    return locals()[request.method.lower()]()


@csrf_exempt
@token_authentication
@decorators.standard_api(methods=('GET', 'POST'))
def search_by_name_api(request):
    def get():
        guide = dsu.request_user(request)
        params = request.GET
        key_word = params.get('key_word')
        items = models.Goods.objects.filter(
            Q(groups__brand_id=guide.brand_id),
            Q(name__contains=key_word) | Q(barcode__contains=key_word))
        results = []
        for item in items:
            results.append(model_to_dict(item))
        return {'data': results}

    return locals()[request.method.lower()]()


@csrf_exempt
@token_authentication
@decorators.standard_api(methods=('POST'))
def rebate_api(request):
    def post():
        params = QueryDict(request.body)
        guide = dsu.request_user(request)
        if guide.status != 0:
            return {'code': 4, 'data': u'无权限'}
        goods_id = int(params.get('gid'))
        num = int(params.get('num'))
        unit = params.get('unit')
        goods = models.Goods.objects.get(id=goods_id)
        if not hasattr(goods, 'itemrebate') or \
                goods.itemrebate.compute_unit != unit or \
                num == 0:
            return JsonResponse({'code': 2, 'data': u'no itemrebate'})
        rebate = models.RebateLog.objects.create(
            item_rebate=goods.itemrebate, guide=guide, num=num)
        return {'data': rebate.id}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST'))
def upload_store_receipts_api(request):
    def post():
        params = request.POST
        rid = int(params.get('rid'))
        file = request.FILES.get('img_file')
        uid = uuid.uuid4()
        log = models.RebateLog.objects.get(id=rid)

        # 上传小票图片
        ori_name = 'nls-receipts/%s_ori.jpg' % uid
        image_ = StringIO.StringIO()
        image = Image.open(file)
        image.save(image_, format='JPEG')
        s3_url = s3_utils.upload_to_s3('pay-qrcode', ori_name,
                                       image_.getvalue())

        log.store_receipts_url = s3_url
        # 发送红包请求
        qrcode_int = shortuuid.ShortUUID().random(length=15)
        total_amount = int(log.item_rebate.rebate * log.num * 100)
        request_data = {
            'qrcode': qrcode_int,
            'device_id': 'NLS%s' % log.guide.telephone,
            'barcode': 6906151890160,
            'total_amount': total_amount
        }
        r = requests.post(
            "http://test.ichaomeng.com/api/ticket", data=request_data)
        response = r.json()

        if response['erron'] != 1 or response['errmsg'] != 'finish':
            return JsonResponse({'code': 3, 'data': 'create error'})
        # 上传红包二维码
        url = 'http://test.ichaomeng.com' + \
              '/weixin/rebate?q=%s&b=6906151890160&e=19&s=1' % (
                  qrcode_int)

        img = qrcode.make(url)
        f = StringIO.StringIO()
        img.save(f)
        qrcode_name = 'nls-qrcode/%s.jpg' % uid

        qrcode_s3_url = s3_utils.upload_to_s3('pay-qrcode', qrcode_name,
                                              f.getvalue())

        log.red_packets = qrcode_s3_url
        log.save()
        return {'data': qrcode_s3_url}

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('POST'))
def rebate_excel_api(request):
    def post():
        user = request.user
        file_meta = request.FILES.get('file')
        file_path = os.path.join('./%s.xlsx' % (uuid.uuid4()))
        destination = open(file_path, 'wb+')
        for chunk in file_meta.chunks():
            destination.write(chunk)
        destination.close()
        dsu.read_rebate_excel(file_path, user)

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST'))
def socket_api(request):
    def post():
        user = request.user
        if not hasattr(user, 'brand'):
            return HttpResponse('permission denied')
        brand = user.brand
        user_source = 'brand_%s' % str(brand.id)
        user_socket = request.POST.get('socket_id').encode('utf-8')
        sockets = client.get(user_source)
        if sockets:
            socket_ids = eval(sockets)
            if user_socket not in socket_ids:
                socket_ids.append(user_socket)
                client.set(user_source, socket_ids)
        else:
            client.set(user_source, [user_socket])

    return locals()[request.method.lower()]()

@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'GET'
))
def store_list_api(request):
    params = QueryDict(request.body)
    user = request.user
    brandor = user.brand
    keys = ['store_name']

    def get():
        data = dsu.get_stores(brandor.id)
        return {"data": data}

    return locals()[request.method.lower()]()

@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'POST',
    'GET',
    'DELETE',
))
def store_api(request):
    params = QueryDict(request.body)
    user = request.user
    brandor = user.brand
    keys = ['store_name']

    def get():
        sort = request.GET.get('sort', 'number')
        order = request.GET.get('order', 'ascending')
        page = int(request.GET.get('page', "1"))
        arg = request.GET.get('arg')
        data = dsu.get_stores(brandor.id)
        response = dsu.page_sort_arg(data, page, sort, order, arg, keys)
        return HttpResponse(
            json.dumps(response), content_type="application/json")

    def delete():
        ids = params.get('ids')
        ids = json.loads(ids)
        for sid in ids:
            models.Store.objects.filter(id=sid).delete()
        return {'data': 'ok'}

    def post():
        params = QueryDict(request.body)
        store_id = params.get('id')
        store_name = params.get('store_name')
        store_address = params.get('store_address')

        if store_id:
            models.Store.objects.filter(
                id=store_id).update(
                    store_name=store_name,
                    store_address=store_address)
        else:
            models.Store.objects.create(
                store_name=store_name,
                store_address=store_address,
                brand=brandor)

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'POST',
    'PATCH',
    'GET',
    'DELETE',
))
def guide_api(request):
    params = QueryDict(request.body)
    user = request.user
    brandor = user.brand
    keys = ['name', 'store_name', 'telephone']

    def get():
        sort = request.GET.get('sort', 'number')
        order = request.GET.get('order', 'ascending')
        page = int(request.GET.get('page', "1"))
        arg = request.GET.get('arg')
        type = request.GET.get('type')
        data = dsu.get_guides(brandor.id, type)
        response = dsu.page_sort_arg(data, page, sort, order, arg, keys)
        return HttpResponse(
            json.dumps(response), content_type="application/json")

    def post():
        params = QueryDict(request.body)
        guide_id = params.get('guide_id')
        name = params.get('name')
        telephone = params.get('telephone')
        basic_salary = params.get('basic_salary', 0)
        store_name = params.get('store_id')
        status = int(params.get('status', 0))
        store = models.Store.objects.get(
            brand=brandor.id, store_name=store_name)
        if (guide_id):
            models.Guide.objects.filter(
                brand=brandor.id, id=guide_id).update(
                    name=name,
                    telephone=telephone,
                    store=store,
                    basic_salary=basic_salary,
                    status=status,
                    update_time=timezone.now())
        else:
            guide = models.Guide.objects.filter(telephone=telephone)
            if guide:
                return {'code': 1, 'error_msg': "手机号已存在，不能重复添加，请确认该员工是否加入过系统"}
            models.Guide.objects.create(
                name=name,
                telephone=telephone,
                store=store,
                basic_salary=basic_salary,
                brand=brandor,
                status=status)

    def delete():
        ids = params.get('ids')
        ids = json.loads(ids)
        for gid in ids:
            models.Guide.objects.filter(
                brand=brandor.id, id=gid).update(
                    status=2, update_time=timezone.now())
        return {'data': 'ok'}

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'PATCH',
    'POST',
    'GET',
    'DELETE',
))
def goods_operation_api(request):
    params = QueryDict(request.body)
    user = request.user
    brandor = user.brand
    keys = ['name', 'barcode']

    def get():
        sort = request.GET.get('sort', 'name')
        order = request.GET.get('order', 'ascending')
        page = int(request.GET.get('page', "1"))
        arg = request.GET.get('arg')
        data = dsu.get_all_goods(brandor.id)
        response = dsu.page_sort_arg(data, page, sort, order, arg, keys)
        return HttpResponse(
            json.dumps(response), content_type="application/json")

    def post():
        params = QueryDict(request.body)
        id = params.get('id', '')
        name = params.get('name')
        barcode = params.get('barcode')

        if id:
            models.Goods.objects.filter(id=id).update(
                name=name, barcode=barcode)
        else:
            models.Goods.objects.create(
                name=name,
                barcode=barcode,
                groups_id=3)

    def delete():
        ids = params.get('ids')
        ids = json.loads(ids)
        for gid in ids:
            models.Goods.objects.filter(id=gid).delete()
        return {'data': 'ok'}
    #
    # def patch():
    #     is_mainline = params.get('is_mainline')
    #     goods_id = params.get('goods_id', '')
    #     if int(is_mainline) == 1:
    #         is_mainline = True
    #     else:
    #         is_mainline = False
    #     models.Goods.objects.filter(id=goods_id).update(
    #         is_mainline=is_mainline)
    #     cache.delete('goods_response:%d' % (brandor.id))

    return locals()[request.method.lower()]()


@login_required
@dsu.brandor_required
@decorators.standard_api(methods=('GET', ))
def commission(request):
    user = request.user
    brandor = user.brand
    keys = ['store_name', 'number']

    def save_or_add_cache(brand_id, start_time, end_time, data=None):
        if not data:
            return cache.get('commission_response:%d:%s:%s' %
                             (brand_id, start_time, end_time))
        else:
            cache.set('commission_response:%d:%s:%s' % (brand_id, start_time,
                                                        end_time), data)
            cache.expire('commission_response:%d:%s:%s' %
                         (brand_id, start_time, end_time), 60 * 60 * 18)

    def get():
        start_time = request.GET.get('start_time')
        end_time = request.GET.get('end_time')
        sort = request.GET.get('sort', 'number')
        order = request.GET.get('order', 'ascending')
        page = int(request.GET.get('page', "1"))
        arg = request.GET.get('arg')
        data = save_or_add_cache(brandor.id, start_time, end_time)
        if not data:
            data = dsu.get_commission(brandor.id, start_time, end_time)
            save_or_add_cache(brandor.id, start_time, end_time, data)
        response = dsu.page_sort_arg(data, page, sort, order, arg, keys)
        return HttpResponse(
            json.dumps(response), content_type="application/json")

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'PATCH',
    'POST',
    'GET',
    'DELETE',
))
def sales_api(request):
    params = QueryDict(request.body)
    user = request.user
    brandor = user.brand

    def save_or_add_cache(key, brand_id, start_time, end_time, data=None):
        if not data:
            return cache.get('sales:%s:%d:%s:%s' % (key, brand_id, start_time,
                                                    end_time))
        else:
            cache.set('sales:%s:%d:%s:%s' % (key, brand_id, start_time,
                                             end_time), data)
            cache.expire('commission_response:%d:%s:%s' %
                         (key, brand_id, start_time, end_time), 60 * 60 * 18)

    def get():
        start_time = request.GET.get('start_time')
        end_time = request.GET.get('end_time')
        args = request.GET.get('args', '')
        key = request.GET.get('key', '')
        download = int(request.GET.get('download', 0))
        data = save_or_add_cache(key, brandor.id, start_time, end_time)
        if not data:
            data = dsu.get_sales_data(brandor.id, start_time, end_time, key,
                                      args)
        if download == 0:
            return data
        elif download == 1:
            ws = Workbook(encoding='utf-8')
            w = ws.add_sheet(start_time + u"~" + end_time + u"店铺销量统计")
            w.write(0, 0, u"门店")
            w.write(0, 1, u"导购")
            w.write(0, 2, u"商品")
            w.write(0, 3, u"销量")
            # 写入数据
            excel_row = 1
            for obj in range(len(data)):
                w.write(excel_row, 0, data[obj].get('store', '无'))
                w.write(excel_row, 1, data[obj].get('guide', '无'))
                sales = data[obj]['sales']
                if len(sales) == 0:
                    excel_row += 1
                else:
                    for sale in sales:
                        w.write(excel_row, 2, sale.get('goods', '无'))
                        w.write(excel_row, 3, sale.get('num', '无'))
                        excel_row += 1
            sio = StringIO.StringIO()
            ws.save(sio)
            sio.seek(0)
            response = HttpResponse(
                sio.getvalue(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment; ' \
                                              'filename=店铺销量统计.xls'
            response.write(sio.getvalue())
            return response

    def post():
        pass

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=(
    'PATCH',
    'POST',
    'GET',
    'DELETE',
))
def sales_detail_api(request):
    params = QueryDict(request.body)
    user = request.user
    brandor = user.brand

    def save_or_add_cache(brand_id, start_time, end_time, data=None):
        if not data:
            return cache.get('sales_detail:%d:%s:%s' % (brand_id, start_time,
                                                        end_time))
        else:
            cache.set('sales_detail:%d:%s:%s' % (brand_id, start_time,
                                                 end_time), data)
            cache.expire('commission_response:%d:%s:%s' %
                         (brand_id, start_time, end_time), 60 * 60 * 18)

    def get():
        page = int(request.GET.get('page', 1))
        start_time = request.GET.get('start_time')
        end_time = request.GET.get('end_time')
        args = request.GET.get('args', '')
        isnormal = request.GET.get('isnormal')
        download = int(request.GET.get('download', 0))
        data = dsu.get_sales_detail_data(brandor.id, start_time, end_time,
                                         args, isnormal)
        if (isnormal == 'true'):
            keys = ['guide', 'goods', 'barcode', 'store']
        else:
            keys = ['name', 'telephone', 'store_name']
        if download == 0:
            response = dsu.page_sort_arg(data, page, '', '', args, keys)
            return response
        else:
            ws = Workbook(encoding='utf-8')
            if isnormal == 'true':
                w = ws.add_sheet(start_time + u"~" + end_time + u"销量详情表")
                w.write(0, 0, u"商品名称")
                w.write(0, 1, u"商品条码")
                w.write(0, 2, u"销量")
                w.write(0, 3, u"门店")
                w.write(0, 4, u"上报人")
                w.write(0, 5, u"上报时间")
                # 写入数据
                excel_row = 1
                for obj in data:
                    w.write(excel_row, 0, obj['goods'])
                    w.write(excel_row, 1, obj['barcode'])
                    w.write(excel_row, 2, obj['sales'])
                    w.write(excel_row, 3, obj['store'])
                    w.write(excel_row, 4, obj['guide'])
                    w.write(excel_row, 5, str(obj['add_time'])[:16])
                    excel_row += 1
            else:
                w = ws.add_sheet(start_time + u"~" + end_time + u"未报销量人员")
                w.write(0, 0, u"导购")
                w.write(0, 1, u"电话")
                w.write(0, 2, u"门店")
                w.write(0, 3, u"入职时间")
                # 写入数据
                excel_row = 1
                for obj in data:
                    w.write(excel_row, 0, obj['name'])
                    w.write(excel_row, 1, obj['telephone'])
                    w.write(excel_row, 2, obj['store_name'])
                    w.write(excel_row, 3, str(obj['create_time'])[:16])
                    excel_row += 1
            sio = StringIO.StringIO()
            ws.save(sio)
            sio.seek(0)
            response = HttpResponse(
                sio.getvalue(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment;' \
                                              ' filename=销量信息表.xls'
            response.write(sio.getvalue())
            return response

    def post():
        pass

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=('GET'))
def activity_api(request):
    user = request.user
    brandor = user.brand
    keys = ['guide', 'store', 'goods']

    def get():
        page = int(request.GET.get('page', 0))
        start_time = request.GET.get('start_time', '')
        end_time = request.GET.get('end_time', '')
        args = request.GET.get('arg', '')
        download = int(request.GET.get('download', 0))
        data = dsu.get_activity_data(brandor.id, start_time, end_time, args)
        if download == 0:
            response = dsu.page_sort_arg(data, page, '', '', args, keys)
            return response
        elif download == 1:
            ws = Workbook(encoding='utf-8')
            w = ws.add_sheet(start_time + u"~" + end_time + u"红包活动记录")
            w.write(0, 0, u"导购")
            w.write(0, 1, u"门店")
            w.write(0, 2, u"商品")
            w.write(0, 3, u"金额")
            w.write(0, 4, u"数量")
            w.write(0, 5, u"派发时间")
            w.write(0, 6, u"小票图片")
            # 写入数据
            excel_row = 1
            for obj in data:
                w.write(excel_row, 0, obj['guide'])
                w.write(excel_row, 1, obj['store'])
                w.write(excel_row, 2, obj['goods'])
                w.write(excel_row, 3, obj['money'])
                w.write(excel_row, 4, obj['num'])
                w.write(excel_row, 5, str(obj['add_time'])[:16])
                w.write(excel_row, 6, obj['img'])
                excel_row += 1
            sio = StringIO.StringIO()
            ws.save(sio)
            sio.seek(0)
            response = HttpResponse(
                sio.getvalue(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment; ' \
                                              'filename=红包活动记录.xls'
            response.write(sio.getvalue())
            return response

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=('GET'))
def work_checkin_api(request):
    user = request.user
    brandor = user.brand
    keys = ['guide', 'telephone', 'store']
    exception_types = {
        -1: '无记录',
        0: '正常',
        1: '迟到',
        2: '早退',
        3: '旷工',
        4: '位置异常',
        5: '不足8小时',
        6: '休假',
        7: '未排班'
    }
    types = {'0': '长促', '3': '短促'}
    work_types = {
        -1: '无',
        0: '早班',
        1: '中班',
        2: '晚班',
        3: '大班',
        4: '休息',
        5: '夜班'
    }

    def get():
        page = int(request.GET.get('page', 0))
        start_time = request.GET.get('start_time', '')
        end_time = request.GET.get('end_time', '')
        args = request.GET.get('arg', '')
        download = int(request.GET.get('download', 0))
        type = request.GET.get('type')
        data = dsu.get_work_checkin(brandor.id, type, start_time, end_time)
        if download == 0:
            response = dsu.page_sort_arg(data, page, '', '', args, keys)
            return response
        elif download == 1:
            ws = Workbook(encoding='utf-8')
            name = start_time + u"~" + end_time + types[type] + u"打卡记录"
            w = ws.add_sheet(name)
            w.write(0, 0, u"日期")
            w.write(0, 1, u"导购")
            w.write(0, 2, u"门店")
            w.write(0, 3, u"电话")
            w.write(0, 4, u"上班时间")
            w.write(0, 5, u"下班时间")
            w.write(0, 6, u"即时考勤")
            w.write(0, 7, u"手机型号")
            w.write(0, 8, u"排班")
            w.write(0, 9, u"销量")
            # 写入数据
            excel_row = 1
            for obj in data:
                try:
                    exception_type = int(obj['exception_type'])
                except BaseException:
                    exception_type = -1
                try:
                    work_type = int(obj['work_type'])
                except BaseException:
                    work_type = -1
                if obj['operator_id'] or obj['operator_id'] == '':
                    statement = '已报'
                else:
                    statement = '未报'

                w.write(excel_row, 0, str(obj['date'])[:16])
                w.write(excel_row, 1, obj['guide'])
                w.write(excel_row, 2, obj['store'])
                w.write(excel_row, 3, obj['telephone'])
                w.write(excel_row, 4, str(obj['work_time'])[11:16])
                w.write(excel_row, 5, str(obj['worked_time'])[11:16])
                w.write(excel_row, 6, str(obj['realtime_checkin_time'])[11:16])
                w.write(excel_row, 7, obj['phone'])
                w.write(excel_row, 8, work_types[work_type])
                w.write(excel_row, 9, statement)
                # w.write(excel_row, 7, exception_types[exception_type])
                excel_row += 1
            sio = StringIO.StringIO()
            ws.save(sio)
            sio.seek(0)
            response = HttpResponse(
                sio.getvalue(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment; ' \
                                              'filename=打卡记录.xls'
            response.write(sio.getvalue())
            return response

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@dsu.brandor_required
@decorators.standard_api(methods=('GET'))
def realtime_checkin_api(request):
    user = request.user
    brandor = user.brand
    keys = ['guide', 'telephone', 'store']
    types = {'0': '长促', '3': '短促'}

    def get():
        page = int(request.GET.get('page', 0))
        start_time = request.GET.get('start_time', '')
        end_time = request.GET.get('end_time', '')
        args = request.GET.get('arg', '')
        download = int(request.GET.get('download', 0))
        type = request.GET.get('type')
        data = dsu.get_realtime_checkin(brandor.id, type, start_time, end_time)
        if download == 0:
            response = dsu.page_sort_arg(data, page, '', '', args, keys)
            return response
        elif download == 1:
            ws = Workbook(encoding='utf-8')
            name = start_time + u"~" + end_time + types[type] + u"即时考勤记录"
            w = ws.add_sheet(name)
            w.write(0, 0, u"日期")
            w.write(0, 1, u"导购")
            w.write(0, 2, u"门店")
            w.write(0, 3, u"电话")
            w.write(0, 4, u"打卡时间")
            w.write(0, 5, u"手机型号")
            # 写入数据
            excel_row = 1
            for obj in data:
                w.write(excel_row, 0, str(obj['date'])[:16])
                w.write(excel_row, 1, obj['guide'])
                w.write(excel_row, 2, obj['store'])
                w.write(excel_row, 3, obj['telephone'])
                w.write(excel_row, 4, str(obj['time'])[11:16])
                w.write(excel_row, 5, obj['phone'])
                excel_row += 1
            sio = StringIO.StringIO()
            ws.save(sio)
            sio.seek(0)
            response = HttpResponse(
                sio.getvalue(), content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment; ' \
                                              'filename=即时考勤记录.xls'
            response.write(sio.getvalue())
            return response

    return locals()[request.method.lower()]()
