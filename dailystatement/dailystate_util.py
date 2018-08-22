# -*- coding: utf-8 -*-
from django.http import HttpResponse, QueryDict, HttpResponseForbidden
from functools import wraps
import datetime
from datetime import timedelta
from itsdangerous import URLSafeTimedSerializer as utsr
from django.utils import timezone
from django.forms.models import model_to_dict
from django.conf import settings
from django.db import connection
from os import environ
from sqlalchemy import text
from utils.datetime_utils import json_datetime_encoder
from core import sql_utils
from utils.datetime_utils import cst
import xlwt as ExcelWrite
import base64
import json
import StringIO
import xlrd
import sqlalchemy
import hashlib
import os
import operator
import pandas
import models
import sys
reload(sys)
sys.setdefaultencoding('utf8')

ITEMS_HEADS = {u'商品条码': u'barcode', u'商品名称': u'name',
               u'商品内码': u'inside_code', u'商品规格': u'unite',
               u'商品系列': u'groups_id', u'出厂价': u'factory_price',
               u'供货价': u'delivery_price', u'零售价': u'price',
               u'提成': u'commission', u'主线产品': u'is_mainline'}

STORES_HEADS = {u'门店名称': u'store_name',
                u'门店地址': u'store_address',
                u'店主姓名': u'shopkeeper_name',
                u'联系方式': u'shopkeeper_phone_number',
                u'所属连锁': u'chain_id', u'门店编号': u'number'}

GUIDES_HEADS = {u'导购姓名': u'name', u'联系方式': u'telephone',
                u'所属门店': u'store_id', u'员工编号': u'staff_number',
                u'在岗状态': u'status', u'底薪': u'basic_salary'}


def confirm_validate_token(token,
                           expiration=settings.SMALL_WEIXIN_TOKEN_VALID_TIME):
    serializer = utsr(settings.SECRET_KEY)
    salt = base64.encodestring(settings.SECRET_KEY)
    return serializer.loads(token, salt=salt, max_age=expiration)


def generate_validate_token(openid):
    serializer = utsr(settings.SECRET_KEY)
    salt = base64.encodestring(settings.SECRET_KEY)
    return serializer.dumps(openid, salt)


def get_groups(bid):
    groups = models.Groups.objects.filter(brand_id=bid)
    json_groups = []
    for group in groups:
        json_groups.append(model_to_dict(group))
    return json_groups


def get_stores(brand_id):
    sql = '''SELECT a.*, b.name chain_name FROM dailystatement_store AS a
                                LEFT JOIN dailystatement_chain AS b
                                ON a.chain_id=b.id
                                WHERE a.brand_id=%(id)s;'''
    cur = connection.cursor()
    cur.execute(sql, params={'id': brand_id})
    stores = sql_utils.dictfetchall(cur)

    for store in stores:
        store['create_time'] = str(store['create_time'])
        if store['lat'] and store['lng']:
            store['lat'] = float(store['lat'])
            store['lng'] = float(store['lng'])
    return stores


def get_guides(brand_id, type):
    if (type == ''):
        sql = '''
            SELECT a.*, b.store_name, b.number
            FROM dailystatement_guide AS a
            LEFT JOIN dailystatement_store AS b
            ON a.store_id=b.id
            WHERE a.brand_id={id}
            AND a.status != 2
            ORDER BY
              a.update_time DESC
            '''.format(id=brand_id)
    else:
        sql = '''
            SELECT a.*, b.store_name, b.number
            FROM dailystatement_guide AS a
            LEFT JOIN dailystatement_store AS b
            ON a.store_id=b.id
            WHERE a.brand_id={id}
            AND a.status={type}
            ORDER BY
              a.update_time DESC
            '''.format(id=brand_id, type=type)
    cur = connection.cursor()
    cur.execute(sql)
    guides = sql_utils.dictfetchall(cur)

    for guide in guides:
        guide['create_time'] = str(guide['create_time'])
    return guides


def get_goods(gid, guide_id):
    goods = models.Goods.objects.filter(groups_id=gid, is_mainline=True)
    day = timezone.now().timetuple().tm_mday
    year = timezone.now().timetuple().tm_year
    month = timezone.now().timetuple().tm_mon
    statements = models.Statement.objects.filter(
        operator_id=guide_id,
        create_time__day=day,
        create_time__year=year,
        create_time__month=month)
    json_goods = []
    for good in goods:
        goods_dict = model_to_dict(good)
        goods_dict['is_finish'] = 0
        goods_dict['start'] = ''
        goods_dict['middle'] = ''
        goods_dict['sales'] = ''
        goods_dict['end'] = ''
        for statement in statements:
            if statement.goods_id == good.id:
                goods_dict['is_finish'] = 1
                goods_dict['start'] = statement.start
                goods_dict['middle'] = statement.middle
                goods_dict['sales'] = statement.sales
                goods_dict['end'] = statement.end
        json_goods.append(goods_dict)
    return json_goods


def is_administrator(user):
    if hasattr(user, 'administrator'):
        return user.administrator
    else:
        return None


def is_brand(user):
    if hasattr(user, 'brand'):
        return user.brand
    else:
        return None


def create_upload_excel(header_list, sheet_name):
    value = [header_list]
    xls = ExcelWrite.Workbook()
    sheet = xls.add_sheet(sheet_name)
    for i in range(0, len(value)):
        for j in range(0, len(header_list)):
            sheet.write(i, j, value[i][j])
    output = StringIO.StringIO()
    xls.save(output)
    output.seek(0)
    return output


def read_excel(file_name, template_type, brandor):

    data_engine = sqlalchemy.create_engine(
        environ.get('OLD_DB_URL'))
    data = xlrd.open_workbook(file_name)
    os.remove(file_name)
    table = data.sheet_by_index(0)
    if template_type == 'item':
        save_goods(data_engine, table, brandor)
    elif template_type == 'store':
        save_stores(data_engine, table, brandor)
    elif template_type == 'guide':
        save_guides(data_engine, table, brandor)


def save_guides(data_engine, table, brandor):
    # 校验表头
    col_data_array = []
    row_number = table.nrows
    col_number = table.ncols
    col_head_array = table.row_values(0)
    store_name_map = {}
    chain_index = -1
    insert_str = u'('
    guide_leader = models.GuideLeader.objects.filter(brand_id=brandor)
    for head in col_head_array:
        if head and head not in GUIDES_HEADS:
            return 'error'
        elif head:
            if head == u'所属门店':
                chain_index = col_head_array.index(head)
                chains = table.col_values(chain_index)
                chains = list(set(chains))
                for chain in chains:
                    if chain != u'所属门店':
                        if not chain:
                            chain = u'无'
                        obj, created = models.Store.objects.get_or_create(
                            store_name=chain,
                            brand_id=brandor.id)
                        obj.save()
                        store_name_map[chain] = obj.id
            insert_str = insert_str + GUIDES_HEADS[head] + u','
    insert_str = insert_str + 'brand_id,' + \
        'leader_id,' + 'update_time,' + 'create_time' + u')'
    # 处理数据
    for col in range(col_number):
        col_data_array.append(table.col_values(col))
    for i in range(1, row_number):
        status = 0
        telephone = None
        store = None
        try:
            data_str = '('
            for j in range(len(col_data_array)):
                col_list = col_data_array[j]
                # 如果没有填在岗状态默认为长促，状态是0
                if col_list[0] == u'在岗状态':
                    if not col_list[i]:
                        col_list[i] = '0'
                    if col_list[i] == u'短促':
                        col_list[i] = '3'
                        status = 3
                if col_list[0] == u'所属门店':
                    if not col_list[i]:
                        col_list[i] = u'无'
                if col_list[0] == u'联系方式':
                    telephone = str(int(col_list[i]))
                if chain_index != -1 and j == chain_index:
                    data_str = data_str + \
                        str(store_name_map.get(col_list[i])) + ','
                    store = store_name_map.get(col_list[i])
                else:
                    if isinstance(col_list[i], float):
                        col_list[i] = str(int(col_list[i]))
                    data_str = data_str + "'" + \
                        str(col_list[i].encode('utf-8')) + "'" + ','
                    # pass
            data_str = data_str + str(brandor.id) + ',' + \
                str(guide_leader[0].id) + ',now()' + ',now()' + ')'
            data_str = data_str.replace(' ', '')
            sql = '''
                INSERT INTO
                dailystatement_guide %s
                VALUES %s
                ON CONFLICT(name, brand_id, store_id)
                DO NOTHING ;''' % (insert_str, data_str.decode('utf-8'))
            guide = models.Guide.objects.get(telephone=telephone)
            if guide:
                guide.status=status
                guide.store_id=store
                guide.update_time=datetime.datetime.now()
                guide.save()
        except Exception as e:
            print(e)
        data_engine.engine.execute(
            text(sql).execution_options(autocommit=True))
    return 'ok'


def save_goods(data_engine, table, brandor):
    row_number = table.nrows
    col_number = table.ncols
    col_data_array = []
    col_head_array = table.row_values(0)
    group_name_map = {}
    group_index = -1
    insert_str = u'('
    flag = False
    if u'商品系列' not in col_head_array:
        flag = True
        null_group = models.Groups.objects.get_or_create(
            brand_id=brandor.id,
            name=u'无')[0]
    for head in col_head_array:
        if head and head not in ITEMS_HEADS:
            return 'error'
        elif head:
            if head == u'商品系列':
                group_index = col_head_array.index(head)
                groups = table.col_values(group_index)
                groups = list(set(groups))
                for group in groups:
                    if group != u'商品系列':
                        if not group:
                            group = u'无'
                        obj, created = models.Groups.objects.get_or_create(
                            brand_id=brandor.id,
                            name=group)
                        obj.save()
                        group_name_map[group] = obj.id
            insert_str = insert_str + ITEMS_HEADS[head] + u','
    if flag:
        insert_str = insert_str[:-1] + ', groups_id' + u')'
    else:
        insert_str = insert_str[:-1] + u')'
    # 处理数据
    for col in range(col_number):
        col_data_array.append(table.col_values(col))
    for i in range(1, row_number):
        data_str = '('
        for j in range(len(col_data_array)):
            col_list = col_data_array[j]
            # 如果出现商品系列，要先获得group_id
            if group_index != -1 and j == group_index:
                data_str = data_str + str(
                    group_name_map.get(col_list[i])) + ','
            else:
                if isinstance(col_list[i], float):
                    col_list[i] = str(int(col_list[i]))
                data_str = data_str + "'" + \
                    str(col_list[i].encode('utf-8')) + "'" + ','
                # pass
        if flag:
            data_str = data_str[:-1] + ',' + str(null_group.id) + ')'
        else:
            data_str = data_str[:-1] + ')'
        sql = u'''
            INSERT INTO
            dailystatement_goods %s
            VALUES %s
            ON CONFLICT(name, groups_id)
            DO NOTHING;''' % (insert_str, data_str.decode('utf-8'))
        data_engine.engine.execute(
            text(sql).execution_options(autocommit=True))
    return 'ok'


def save_stores(data_engine, table, brandor):
    # 校验表头
    col_data_array = []
    row_number = table.nrows
    col_number = table.ncols
    col_head_array = table.row_values(0)
    chain_name_map = {}
    chain_index = -1
    insert_str = u'('
    for head in col_head_array:
        if head and head not in STORES_HEADS:
            return 'error'
        elif head:
            if head == u'所属连锁':
                chain_index = col_head_array.index(head)
                chains = table.col_values(chain_index)
                chains = list(set(chains))
                for chain in chains:
                    if chain != u'所属连锁':
                        if not chain:
                            chain = u'无'
                        obj, created = models.Chain.objects.get_or_create(
                            name=chain)
                        obj.save()
                        chain_name_map[chain] = obj.id
            insert_str = insert_str + STORES_HEADS[head] + u','
    insert_str = insert_str + 'brand_id,' + 'create_time' u')'
    # 处理数据
    for col in range(col_number):
        col_data_array.append(table.col_values(col))
    for i in range(1, row_number):
        data_str = '('
        for j in range(len(col_data_array)):
            col_list = col_data_array[j]
            # 如果出现商品系列，要先获得group_id
            if chain_index != -1 and j == chain_index:
                data_str = data_str + \
                    str(chain_name_map.get(col_list[i])).encode(
                        'utf-8') + ','
            else:
                if isinstance(col_list[i], float):
                    col_list[i] = str(int(col_list[i]))
                data_str = data_str + "'" + \
                    str(col_list[i].encode('utf-8')) + "'" + ','
                # pass
        data_str = data_str.encode('utf-8') + str(brandor.id) + ',now()' + ')'
        sql = u'''
            INSERT INTO
            dailystatement_store %s
            VALUES %s
            ON CONFLICT(store_name, brand_id)
            DO NOTHING;''' % (insert_str, data_str.decode('utf-8'))
        data_engine.engine.execute(
            text(sql).execution_options(autocommit=True))
    return 'ok'


def get_all_goods(brand_id):
    sql = '''
            SELECT a.*, b.name as group_name
            FROM dailystatement_goods AS a
            LEFT JOIN dailystatement_groups AS b
            ON a.groups_id=b.id
            WHERE b.brand_id=%(id)s;'''
    cur = connection.cursor()
    cur.execute(sql, params={'id': brand_id})
    goods_list = sql_utils.dictfetchall(cur)
    return goods_list


def get_commission(brand_id, start_time, end_time):
    sql = '''
            SELECT
                a.id, a.store_name, number, commission,e.name as guide
            FROM
                dailystatement_store as a
            LEFT JOIN
                (SELECT
                    sum(b.commission*c.sales) as commission,c.store_id
                FROM
                    dailystatement_goods as b
                RIGHT JOIN
                    dailystatement_statement as c
                ON
                    b.id = c.goods_id
                WHERE
                      c.create_time::date >= %(start_time)s
                      and c.create_time::date <= %(end_time)s
                GROUP BY
                    c.store_id
                ) AS d
            ON a.id = d.store_id
            LEFT JOIN
                dailystatement_guide as e
            ON a.id = e.store_id
            WHERE
                a.brand_id = %(brand_id)s
          '''
    cur = connection.cursor()
    cur.execute(sql, params={
        'start_time': start_time,
        'end_time': end_time,
        'brand_id': brand_id})
    commission_list = sql_utils.dictfetchall(cur)
    return commission_list


# 排序分页模糊查询
def page_sort_arg(data, page, sort, order, arg, keys):
    try:
        data = eval(data)
    except BaseException:
        pass
    _result = []
    for _row in data:
        flag = False
        for key in keys:
            try:
                if arg in _row.get(key):
                    flag = True
                    break
            except BaseException:
                pass
        if not flag:
            continue
        if 'update_time' in _row:
            _row['update_time'] = json_datetime_encoder(_row['update_time'])
        if 'add_time' in _row:
            _row['add_time'] = str(_row['add_time'])[:16]
        if 'work_time' in _row:
            _row['work_time'] = str(_row['work_time'])[11:16]
        if 'worked_time' in _row:
            _row['worked_time'] = str(_row['worked_time'])[11:16]
        if 'realtime_checkin_time' in _row:
            _row['realtime_checkin_time'] = str(_row['realtime_checkin_time'])[11:16]
        if 'time' in _row:
            _row['time'] = str(_row['time'])[11:16]
        _result.append(_row)
    if (sort != ''):
        _result = sorted(
            _result,
            key=operator.itemgetter(sort),
            reverse=(True if order == 'descending' else False))
    response = {'success': 1}
    response['data'] = {}
    if len(_result) % 10 == 0:
        response['data']['pages'] = len(_result) / 10
    else:
        response['data']['pages'] = len(_result) / 10 + 1
    response['data']['count'] = len(_result)
    response['data']['data'] = _result[(page - 1) * 10: page * 10]
    return response


def get_time(time):
    if time.hour < 8:
        time = (time - timedelta(hours=8)).replace(
            hour=0,
            minute=0,
            second=0) + timedelta(hours=8)
    else:
        time = time.replace(hour=0, minute=0, second=0) + timedelta(hours=8)
    return time


def token_required(func):
    """
    Decorator to make a view only confirm validate token
    """

    @wraps(func)
    def decorator(request, *args, **kwargs):
        params = QueryDict(request.body)
        token = params.get('token')
        openid = None

        if token:
            openid = confirm_validate_token(token)
            guide = models.Guide.objects.filter(openid=openid)
            if len(guide) > 0:
                guide = guide[0]
                if not guide.telephone:
                    return HttpResponse(
                        json.dumps({'code': 2, 'data': u'Token illegal'}),
                        content_type='application/json')
            else:
                return HttpResponse(
                    json.dumps({'code': 2, 'data': u'Token illegal'}),
                    content_type='application/json')
        if not openid or openid == '':
            return HttpResponse(
                json.dumps({'code': 2, 'data': u'Token illegal'}),
                content_type='application/json')
        return func(request, *args, **kwargs)

    return decorator


def brandor_required(func):
    """
    Decorator to make a view only confirm validate token
    """

    @wraps(func)
    def decorator(request, *args, **kwargs):
        user = request.user
        if not is_brand(user):
            return HttpResponseForbidden()
        return func(request, *args, **kwargs)

    return decorator


def get_request_authentication(func):
    """
    Decorator to make a view only confirm validate token
    """

    @wraps(func)
    def decorator(request, *args, **kwargs):
        if not get_key(request.GET):
            return HttpResponseForbidden()
        return func(request, *args, **kwargs)

    return decorator


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


def next_week_datetime():
    today = datetime.date.today()
    now_weekday = today.weekday()
    monday_delta = datetime.timedelta(now_weekday)
    sunday_delta = datetime.timedelta(6 - now_weekday)
    next_week = datetime.timedelta(7)
    start_time = (today - monday_delta + next_week).strftime("%Y-%m-%d")
    end_time = (today + sunday_delta + next_week).strftime("%Y-%m-%d")
    df = pandas.DataFrame(
        pandas.date_range(
            start_time, end_time).strftime("%Y-%m-%d"),
        columns=['period'])
    return df


def request_user(request):
    token = request.GET.get('token')
    if not token:
        token = QueryDict(request.body).get('token')
    openid = confirm_validate_token(token)
    user = models.Guide.objects.get_or_create(openid=openid)[0]
    return user


def read_rebate_excel(file_path, user):
    data = xlrd.open_workbook(file_path)
    os.remove(file_path)
    table = data.sheet_by_index(0)
    row_number = table.nrows
    for row in range(1, row_number):
        row_data = table.row_values(row)
        rebate_price = row_data[1]
        unit = row_data[2]
        barcode = row_data[3]
        item = models.Goods.objects.get(
            barcode=barcode,
            groups__brand_id=3)
        rebate = models.ItemRebate.objects.get_or_create(
            item=item,
            rebate=rebate_price,
            compute_unit=unit)[0]
        rebate.save()


def get_map_data(brand_id):
    sql = '''
            SELECT
                guide.name,
                guide.telephone,
                store.store_address,
                store.store_name,
                store.lng,
                store.lat,
                store.id store_id
            FROM
                dailystatement_guide AS guide
            LEFT JOIN
                dailystatement_store AS store
            ON guide.store_id = store.id
            WHERE
                guide.brand_id = %(brand_id)s
            AND store.lat IS NOT NULL
            AND store.lng IS NOT NULL;
          '''
    cur = connection.cursor()
    cur.execute(sql, params={
        'brand_id': brand_id})
    infos = sql_utils.dictfetchall(cur)
    return infos


def get_checkin_profile(brand_id):
    sql = """
        SELECT
            guide.name,
            guide.telephone,
            log.exception_type
        FROM
            dailystatement_guide AS guide
        LEFT JOIN
            dailystatement_checkinexceptionlog AS log
        ON
            guide.id=log.guide_id
        WHERE
            guide.brand_id=%(brand_id)s
        AND
            log.add_time > date_trunc('day', now())
        AND
            log.add_time <= now()
    """
    cur = connection.cursor()
    cur.execute(sql, params={'brand_id': brand_id})
    infos = sql_utils.dictfetchall(cur)
    late = []
    late_count = 0
    leave_early = []
    leave_early_count = 0
    guide_count = models.Guide.objects.filter(
        brand_id=brand_id).count()
    for info in infos:
        if info['exception_type'] == 1:
            late.append(info)
            late_count += 1
        elif info['exception_type'] == 2:
            leave_early.append(info)
            leave_early_count += 1
    late_percent = '%.2f' % (
        float(late_count) / guide_count * 100)
    leave_early_percent = '%.2f' % (
        float(leave_early_count) / guide_count * 100)
    if len(late) > 8:
        late = late[0:8]
    if len(leave_early) > 8:
        leave_early = leave_early[0:8]
    return {
        'lates': late,
        'leave_earlies': leave_early,
        'late_count': late_count,
        'leave_early_count': leave_early_count,
        'late_percent': late_percent,
        'leave_early_percent': leave_early_percent}


def get_except_data(date_set, guide, start, end):
    data_engine = sqlalchemy.create_engine(settings.BUSSINESS_DB_URL)
    results = pandas.read_sql_query(
        sqlalchemy.text("""
        SELECT
            guide.name,
            to_char(checkin.work_time, 'YYYY-MM-DD') as dates ,
            count(to_char(checkin.work_time, 'YYYY-MM-DD'))
        FROM
            dailystatement_checkin AS checkin
        LEFT JOIN
            dailystatement_guide AS guide
        ON
            checkin.guide_id = guide.id
        LEFT JOIN
            dailystatement_store AS store
        ON
            store.id=guide.store_id
        WHERE
            guide.id = :guide_id
        AND checkin.work_time>=:start
        AND checkin.work_time<=:end
        GROUP BY guide.name, dates;
                        """),
        data_engine, params={
            'guide_id': guide.id,
            'start': str(start),
            'end': str(end)})
    res = []
    if results.empty:
        return []
    else:
        item_dict = {}
        for item in results.itertuples():
            item_dict[item[2]] = {
                'name': item[1]}
        did_set = set(item_dict.keys())
        not_did = list(date_set - did_set)
        for item in not_did:
            res.append({
                'name': guide.name,
                'time': item,
                'store': guide.store.store_name})
    return res


def get_realtime_cjeheckin_except_data(date_set, guide, start, end):
    res = []
    checkins = models.RealTimeCheck.objects.filter(
        guide=guide,
        time__range=(start, end))
    if checkins.count() == 0:
        return res
    else:
        item_dict = {}
        for checkin in checkins:
            date = checkin.time.strftime("%Y-%m-%d")
            item_dict[date] = {'name': guide.name}

        did_set = set(item_dict.keys())
        not_did = list(date_set - did_set)
        for item in not_did:
            res.append({
                'name': guide.name,
                'time': item,
                'store': guide.store.store_name})
    return res


def get_sales_data(brand_id, start_time, end_time, key, args):
    result = {}
    engine = sqlalchemy.create_engine(settings.BUSSINESS_DB_URL)
    sql = '''
            SELECT
                a.id, a.store_name, a.number
            FROM
                dailystatement_store as a
            LEFT JOIN
                dailystatement_guide as b
            ON
                a.id = b.store_id
            WHERE
                a.brand_id = {brand_id}
            AND
                (a.store_name like '%{args}%' or b.name like '%{args}%')
            ORDER BY
                number
        '''.format(brand_id=brand_id, args=args)
    sql = sqlalchemy.text(sql)
    data = pandas.read_sql_query(sql, engine)
    if not data.empty:
        for i in range(len(data['id'])):
            id = data['id'][i]
            store_name = data['store_name'][i]
            index = i
            result[index] = {}
            result[index]['store'] = store_name
            sql = '''
                    SELECT
                        name
                    FROM
                        dailystatement_guide
                    WHERE
                        store_id = {id}
                    AND
                        status = 0
                    '''.format(id=id)
            name_data = pandas.read_sql_query(sql, engine)
            guide = []
            if not name_data.empty:
                for name in name_data['name']:
                    guide.append(name)
            result[index]['guide'] = guide
            sql = '''
                    SELECT
                        b.name,sum(a.sales)
                    FROM
                        dailystatement_statement as a
                    INNER JOIN
                        dailystatement_goods as b
                    ON
                        a.goods_id = b.id
                    WHERE
                        a.store_id = {id}
                    AND
                        a.create_time >= '{start_time}'
                    AND
                        a.create_time <= '{end_time}'
                    GROUP BY
                        b.name
                    ORDER BY
                        sum(a.sales)
                    DESC
                '''.format(id=id, start_time=start_time, end_time=end_time)
            sales_data = pandas.read_sql_query(sql, engine)
            sales = []
            if not sales_data.empty:
                for i in range(len(sales_data['name'])):
                    sale = {}
                    sale['goods'] = sales_data['name'][i]
                    sale['num'] = sales_data['sum'][i]
                    sales.append(sale)
            result[index]['sales'] = sales
    return result


def get_sales_detail_data(brand_id, start_time, end_time, args, isnormal):
    if (isnormal == 'true'):
        sql = '''
                SELECT
                    b.name as guide,
                    c.name as goods,
                    c.barcode as barcode,
                    a.sales,
                    (a.create_time AT TIME ZONE 'CCT')::date as add_time,
                    d.store_name as store
                FROM
                    dailystatement_statement as a
                LEFT JOIN
                    dailystatement_guide as b
                ON
                    a.operator_id = b.id
                LEFT JOIN
                    dailystatement_goods as c
                ON
                    a.goods_id = c.id
                LEFT JOIN
                    dailystatement_store as d
                ON
                    a.store_id = d.id
                WHERE
                    a.create_time >= '{start_time}'
                AND
                    a.create_time <= '{end_time}'
                AND
                    b.status = 0
                '''.format(start_time=start_time, end_time=end_time)
    else:
        sql = '''
                SELECT
                    a.name,
                    a.telephone,
                    c.store_name,
                    a.status,
                    a.create_time::date as create_time
                FROM
                    dailystatement_guide as a
                LEFT JOIN
                    (SELECT
                        operator_id
                    FROM
                        dailystatement_statement
                    WHERE
                        (create_time AT TIME ZONE 'CCT')::DATE >= '{start_time}'
                    AND
                        (create_time AT TIME ZONE 'CCT')::DATE <= '{end_time}'
                    )AS b
                ON
                    a.id = b.operator_id
                LEFT JOIN
                    dailystatement_store as c
                ON
                    a.store_id = c.id
                WHERE
                    b.operator_id is null
                AND
                    a.status = 0
                AND
                    (a.create_time AT TIME ZONE 'CCT') < '{start_time}'
                '''.format(start_time=start_time, end_time=end_time)
    cur = connection.cursor()
    cur.execute(sql)
    data = sql_utils.dictfetchall(cur)
    return data


def get_activity_data(brand_id, start_time, end_time, args):
    sql = '''
            SELECT
                guide.name as guide,
                store.store_name as store,
                goods.name as goods,
                redpack.total_amount / 100 as money,
                log.num,
                (log.add_time AT TIME ZONE 'CCT') as add_time,
                log.store_receipts as img
            FROM
                advertisement_redpackrecord as redpack
            LEFT JOIN
                advertisement_weixinqrcode as qr
            ON
                redpack.qrcode_id=qr.id
            LEFT JOIN
                dailystatement_rebatelog as log
            ON
                qr.qrcode=log.qrcode
            LEFT JOIN
                dailystatement_itemrebate as itemrebate
            ON
                log.item_rebate_id=itemrebate.id
            LEFT JOIN
                dailystatement_goods as goods
            ON
                itemrebate.item_id=goods.id
            LEFT JOIN
                dailystatement_guide as guide
            ON
                log.guide_id=guide.id
            LEFT JOIN
                dailystatement_store as store
            ON
                guide.store_id=store.id
            WHERE
                redpack.redpack_name_id=19
            AND
                redpack.status='SUCCESS'
            AND
                log.add_time::date >='{start_time}'
            AND
                log.add_time::date <='{end_time}'
            AND
                log.qrcode is not null;
            '''.format(start_time=start_time, end_time=end_time)
    cur = connection.cursor()
    cur.execute(sql)
    data = sql_utils.dictfetchall(cur)
    return data

# 获取上班签到记录


def get_work_checkin(brand_id, type, start_time, end_time):
    datelist = pandas.date_range(start_time, end_time)
    results = []
    for date in datelist:
        date = str(date)[:10]
        sql = '''
                SELECT
                    guide.id,
                    guide.name as guide,
                    store.store_name as store,
                    guide.telephone,
                    (checkin.work_time AT TIME ZONE 'CCT') as work_time,
                    (checkin.worked_time AT TIME ZONE 'CCT') as worked_time,
                    (realtime_checkin.time AT TIME ZONE 'CCT') as realtime_checkin_time,
                    checkin.phone_model as phone,
                    work.work_type,
                    statement.operator_id,
                    guide.status
                FROM
                    dailystatement_guide as guide
                LEFT JOIN
                    dailystatement_store as store
                ON
                    guide.store_id = store.id
                LEFT JOIN
                    (
                        SELECT
                            guide_id, min(work_time) as work_time, max(worked_time) as worked_time, min(phone_model) as phone_model
                        FROM
                            dailystatement_checkin
                        WHERE
                            (work_time AT TIME ZONE 'CCT')::date = '{date}'
                        GROUP BY
                            guide_id
                    ) AS checkin
                ON
                    guide.id = checkin.guide_id
                LEFT JOIN
                  (
                        SELECT
                            guide_id, max(time) as time
                        FROM
                            dailystatement_realtimecheck
                        WHERE
                            (time AT TIME ZONE 'CCT')::date = '{date}'
                        GROUP BY
                            guide_id
                    ) AS realtime_checkin
                ON
                    guide.id = realtime_checkin.guide_id
                LEFT JOIN
                    (
                        SELECT
                            operator_id
                        FROM
                            dailystatement_statement
                        WHERE
                             (create_time AT TIME ZONE 'CCT')::date = '{date}'
                        GROUP BY
                            operator_id
                    ) AS statement
                ON
                    guide.id = statement.operator_id
                LEFT JOIN
                    (
                        SELECT
                            guide_id, work_type
                        FROM
                            dailystatement_guideworkplan
                        WHERE
                            date = '{date}'
                    ) as work
                ON
                    guide.id = work.guide_id
                WHERE
                    guide.status = {type}
                AND
                    guide.brand_id = {brand_id}
                ORDER BY
                    work_time
                DESC;

                '''.format(date=date, type=type, brand_id=brand_id)
        cur = connection.cursor()
        cur.execute(sql)
        data = sql_utils.dictfetchall(cur)
        for result in data:
            result['date'] = date
        results.extend(data)
    return results

def get_realtime_checkin(brand_id, type, start_time, end_time):
    datelist = pandas.date_range(start_time, end_time)
    results = []
    for date in datelist:
        date = str(date)[:10]
        sql = '''
                SELECT
                    guide.name as guide,
                    store.store_name as store,
                    guide.telephone,
                    (checkin.time AT TIME ZONE 'CCT') as time,
                    checkin.phone_model as phone,
                    guide.status
                FROM
                    dailystatement_guide as guide
                LEFT JOIN
                    dailystatement_store as store
                ON
                    guide.store_id = store.id
                LEFT JOIN
                    (
                        SELECT
                            *
                        FROM
                            dailystatement_realtimecheck
                        WHERE
                            (time AT TIME ZONE 'CCT')::date = '{date}'
                    ) AS checkin
                ON
                    guide.id = checkin.guide_id
                WHERE
                    guide.status = {type}
                AND
                    guide.brand_id = {brand_id}
                ORDER BY
                    time
                '''.format(date=date, type=type, brand_id=brand_id)
        cur = connection.cursor()
        cur.execute(sql)
        data = sql_utils.dictfetchall(cur)
        for result in data:
            result['date'] = date
        results.extend(data)
    return results

def paging(data, page):
    try:
        data = eval(data)
    except BaseException:
        pass
    _result = data
    response = {'success': 1}
    response['data'] = {}
    response['data']['pages'] = len(_result) / 10
    response['data']['count'] = len(_result)
    response['data']['data'] = _result[(page - 1) * 10: page * 10]
    return response
