# -*- coding: utf-8 -*-
from django.http import (
    HttpResponse,
    QueryDict,
    HttpResponseForbidden)
from functools import wraps
from itsdangerous import URLSafeTimedSerializer as utsr
from django.utils import timezone
from django.conf import settings
from django.db import connection
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from os import environ
from core import sql_utils
from user.CCPRestSDK import REST
from django.core.cache import cache
# from std_libs.publisher import Publisher
from utils import datetime_utils
from user.models import CMUser
import models
import base64
import socket
import hashlib
import xmltodict
import qrcode
import uuid
import boto
import StringIO
import random
import os
import xlrd
import json
import datetime
import sqlalchemy
import pandas
import numpy as np
standard_heads = [u'商品条码', u'商品名称', u'数量', u'进货价',
                  u'销售价', u'生产日期', u'保质期', u'临界期']
REWARD_INTEGRATION = 150
# publisher = Publisher(topic_test_prefix_enabled=False)


def confirm_validate_token(token,
                           expiration=settings.SMALL_WEIXIN_TOKEN_VALID_TIME):
    serializer = utsr(settings.SECRET_KEY)
    salt = base64.encodestring(settings.SECRET_KEY)
    return serializer.loads(token, salt=salt, max_age=expiration)


def generate_validate_token(openid):
    serializer = utsr(settings.SECRET_KEY)
    salt = base64.encodestring(settings.SECRET_KEY)
    return serializer.dumps(openid, salt)


def get_local_ip():
    myname = socket.getfqdn(socket.gethostname())
    myaddr = socket.gethostbyname(myname)
    return myaddr


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


def create_store_qrcode(url, store_id):
    url = 'https://%s/api/v1.0/pay/store/%s' % (url, str(store_id))
    img = qrcode.make(url)
    content = StringIO.StringIO()
    img.save(content)
    content.seek(0)
    conn = boto.connect_s3(settings.AWS_ACCESS_KEY_ID,
                           settings.AWS_SECRET_ACCESS_KEY,
                           host=settings.AWS_S3_HOST)
    bucket = conn.get_bucket('pay-qrcode')
    ori_name = 'store_%s.jpg' % store_id
    k = boto.s3.key.Key(bucket)
    k.key = ori_name
    k.content_type = 'application/ms-excel'
    k.set_contents_from_file(content, policy="public-read")
    return True


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


def send_code_to_phone(phone_number):
    template_id = settings.CM_VERIFY_CODE_INTERFACE_SERVER_TEMPLATE_ID
    code = create_verify_code()
    # 调用发送验证码接口
    res = send_code_interface(
        str(phone_number),
        [str(code),
         '2分钟'],
        template_id)
    if res == '000000':
        cache.set(
            str(phone_number),
            code,
            timeout=settings.REDIS_TIMEOUT)
        return 'ok'
    else:
        return u'发送验证码失败'


def boss_required(func):
    """
    Decorator to make a view only confirm validate token
    """
    @wraps(func)
    def decorator(request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'boss'):
            return HttpResponseForbidden()
        return func(request, *args, **kwargs)

    return decorator


def read_excel(file_path, sid, user):
    data = xlrd.open_workbook(file_path)
    os.remove(file_path)
    table = data.sheet_by_index(0)
    # 获取表头
    col_head_array = table.row_values(0)
    row_number = table.nrows
    #检查表头
    if col_head_array == standard_heads:
        for row in range(1, row_number):
            row_datas = table.row_values(row)
            barcode = row_datas[0]
            name = row_datas[1]
            items = models.Item.objects.filter(
                store_id=sid,
                barcode=barcode)
            if len(items) > 0:
                item = items[0]
            else:
                item = models.Item.objects.create(
                    store_id=sid,
                    name=name,
                    barcode=barcode)
            if item.standard_item_id is None:
                res_dict = get_item_by_barcode(barcode)
                item.standard_item_id = res_dict.get('id')
            item.price = float(row_datas[4])
            item.purchase_price = float(row_datas[3])
            item.produced_time = row_datas[5] if row_datas[5] else None
            item.best_before_date = row_datas[6]
            item.critical_age = row_datas[7]
            item.inventory = item.inventory + int(row_datas[2])\
                if item.inventory else int(row_datas[2])

            item.save()
            record = models.PurchaseRecords.objects.create(
                operator=user,
                store_id=int(sid),
                item=item,
                num=int(row_datas[2]),
                price=float(row_datas[3]),
                retail_price=float(row_datas[4]))
            record.save()
    else:
        return 'format error'


def get_order_history(user):
    sql = '''
    SELECT
        orders.id,
        item.name AS item_name,
        store.name AS store_name,
        orders.order_time,
        orderitem.num,
        orderitem.subtotal
    FROM
        pay_item AS item
    LEFT JOIN
        pay_orderitem AS orderitem
    ON item.id=orderitem.item_id
    LEFT JOIN
        pay_order AS orders
    ON
        orderitem.order_id=orders.id
    LEFT JOIN
        pay_store AS store
    ON
        orders.store_id=store.id
    WHERE
      orders.user_id=%(user_id)s AND orders.status=1
    ORDER BY orders.order_time DESC
    '''
    cur = connection.cursor()
    cur.execute(sql, {'user_id': user.id})
    orders = sql_utils.dictfetchall(cur)
    result = []
    temp_order = {}
    for order in orders:
        if order['id'] in temp_order.keys():
            order_msg = temp_order.get(order['id'])
            order_msg['items'].append({'name': order['item_name'],
                                      'num': order['num'],
                                      'subtotal': float('%.2f' % order['subtotal'])})
            order_msg['amount'] += order['num']
            order_msg['subtotal'] += float('%.2f' % order['subtotal'])
            temp_order[order['id']] = order_msg

        else:
            temp_dict = {}
            temp_dict['name'] = order['store_name']
            temp_dict['order_time'] = datetime_utils.cst(order['order_time'])
            temp_dict['subtotal'] = float('%.2f' % order['subtotal'])
            temp_dict['amount'] = order['num']
            temp_dict['items'] = [{'name': order['item_name'],
                                   'num': order['num'],
                                   'subtotal': float('%.2f' % order['subtotal'])}]
            temp_order[order['id']] = temp_dict
    result = sorted(temp_order.values(),
                    key=lambda dic: dic['order_time'],
                    reverse=True)
    print result
    return {'data': result}


def get_integrals(user):
    sql = '''
    SELECT
        usm.residual_amount,
        store.name
    FROM
        pay_userstoremap AS usm
    LEFT JOIN
        pay_store AS store
    ON usm.store_id=store.id
    WHERE
      usm.user_id=%(user_id)s
    '''
    cur = connection.cursor()
    cur.execute(sql, {'user_id': user.id})
    integrals = sql_utils.dictfetchall(cur)
    return {'data': integrals}


def token_authentication(func):
    """
    Decorator to make a view only confirm validate token
    """
    @wraps(func)
    def decorator(request, *args, **kwargs):
        params = QueryDict(request.body)
        if request.user:
            return func(request, *args, **kwargs)
        if params.get('token'):
            token = params.get('token')
        else:
            token = request.GET.get('token')
        try:
            openid = confirm_validate_token(token)
        except:
            return HttpResponse(
                json.dumps({'code': 2}),
                content_type='application/json')
        return func(request, *args, **kwargs)

    return decorator


def create_mch_billno(mch_id):
    now = datetime.datetime.now()
    randuuid = uuid.uuid4()
    mch_billno = '{}{}{}'.format(
        mch_id,
        now.strftime('%Y%m%d'),
        str(randuuid.int)[:10])
    return mch_billno


def create_integral_qrcode(url, store_id, integral):
    url = 'https://%s/api/v1.0/pay/store/%s/integral/%s' \
        % (url, str(store_id), str(integral))
    img = qrcode.make(url)
    content = StringIO.StringIO()
    img.save(content)
    content.seek(0)
    conn = boto.connect_s3(settings.AWS_ACCESS_KEY_ID,
                           settings.AWS_SECRET_ACCESS_KEY,
                           host=settings.AWS_S3_HOST)
    bucket = conn.get_bucket('pay-qrcode')
    ori_name = 'Integral-qrcode/store_%s_integral.jpg' % store_id
    k = boto.s3.key.Key(bucket)
    k.key = ori_name
    k.content_type = 'application/ms-excel'
    k.set_contents_from_file(content, policy="public-read")
    return True


def get_item_by_barcode(barcode):
    item_dict = {}
    item_dict['id'] = -1
    item_dict['name'] = ''
    data_engine = sqlalchemy.create_engine(settings.STD_DB_URL)
    results = pandas.read_sql_query(
        sqlalchemy.text(""" SELECT
                                id,
                                name
                            FROM standard_item
                            WHERE
                            barcodes @> array[:barcode];
                        """),
        data_engine,  params={'barcode': barcode})
    for item in results.itertuples():
        item_dict['id'] = item[1]
        item_dict['name'] = item[2]
    return item_dict


def save_item(params):
    barcode = params.get('barcode')
    name = params.get('name')
    item_id = None if int(params.get('item_id')) == -1 else int(params.get('item_id'))
    num = int(params.get('num'))
    purchase_price = float(params.get('purchase_price'))
    price = float(params.get('price'))
    store = models.Store.objects.get(boss__id=int(params.get('store_id')))
    user = CMUser.objects.get(id=int(params.get('store_id')))
    produced_time = params.get('produced_time')
    best_before_date = int(params.get('best_before_date'))
    critical_age = int(params.get('critical_age'))
    try:
        item = models.Item.objects.get(store_id=store.id, barcode=barcode)
        item.name = name
        item.price = price
        item.purchase_price = purchase_price
        item.inventory = item.inventory + num if item.inventory else num
        item.produced_time = produced_time
        item.best_before_date = best_before_date
        item.critical_age = critical_age
        item.standard_item_id = item_id
    except models.Item.DoesNotExist:
        item = models.Item.objects.create(
            store_id=store.id,
            barcode=barcode,
            name=name,
            price=price,
            purchase_price=purchase_price,
            inventory=num,
            standard_item_id=item_id,
            produced_time=produced_time,
            best_before_date=best_before_date,
            critical_age=critical_age)
    item.save()
    records = models.PurchaseRecords.objects.create(
        operator=user,
        store=store,
        item=item,
        num=num,
        price=purchase_price,
        retail_price=price)
    records.save()
    return True


def get_bundlings(sid):
    sql = '''
    SELECT
        bundling.bundling_num,
        bundling.bundling_price,
        item.name bundling_name,
        main_item.name main_name,
        to_char(bundling.start_time, 'YYYY-MM-DD') AS start_time,
        to_char(bundling.end_time, 'YYYY-MM-DD') AS end_time
    FROM
        pay_bundling AS bundling
    LEFT JOIN
        pay_item AS item
    ON bundling.bundling_item_id=item.id
    LEFT JOIN
        pay_item AS main_item
    ON bundling.main_item_id=main_item.id
    WHERE
      bundling.store_id=%(sid)s
    ORDER BY bundling.add_time DESC
    '''
    cur = connection.cursor()
    cur.execute(sql, {'sid': sid})
    integrals = sql_utils.dictfetchall(cur)
    return {'data': integrals}


def bundling(cart_items, store):
    bundlings = None
    if hasattr(store, 'bundling_set'):
        bundlings = models.Bundling.objects.filter(
            store=store,
            start_time__lte=timezone.now(),
            end_time__gte=timezone.now()).values(
                'main_item_id',
                'bundling_item_id',
                'bundling_num',
                'bundling_price')
    bundling_temp = {}
    main_temp = {}
    for bundling in bundlings:
        bundling_temp[bundling['bundling_item_id']] = bundling
        main_temp[bundling['main_item_id']] = bundling
    bundling_count_dict = {}
    main_items = []
    for cart_item in cart_items:
        cart_item['privilege'] = 0
        item_id = cart_item['item_id']
        if item_id in main_temp:
            bundling_id = main_temp[item_id].get('bundling_item_id')
            if item_id in main_items:
                bundling_count_dict[bundling_id]['num'] = bundling_count_dict[
                    bundling_id].get('num') + main_temp[item_id].get('bundling_num')
            else:
                main_items.append(cart_item['item_id'])
                if bundling_id in bundling_count_dict:
                    bundling_count_dict[bundling_id]['num'] = bundling_count_dict[
                        bundling_id].get('num') + main_temp[item_id].get('bundling_num')
                else:
                    bundling_count_dict[bundling_id] = {'num': main_temp[item_id].get(
                        'bundling_num'),
                        'price': main_temp[item_id].get('bundling_price')}
    for item_id in bundling_count_dict:
        if item_id in main_items:
            bundling_count_dict[item_id]['num'] = bundling_count_dict[item_id]['num'] / (
                bundling_temp[item_id]['bundling_num'] + 1)
    amount = 0
    count_dict = {}
    for cart_item in cart_items:
        item_id = cart_item['item_id']
        if item_id in bundling_count_dict:
            if item_id in count_dict:
                count_dict[item_id] += 1
            else:
                count_dict[item_id] = 1
            if count_dict.get(item_id) <= bundling_count_dict[item_id]['num']:
                cart_item['old_price'] = cart_item['price']
                cart_item['privilege'] = 1
                cart_item['price'] = float(
                    '%.2f' % bundling_count_dict[item_id]['price'])
            else:
                cart_item['price'] = float('%.2f' % cart_item['price'])
        else:
            cart_item['price'] = float('%.2f' % cart_item['price'])
        cart_item['sum'] = float(cart_item.get('price')) * \
            float(cart_item.get('num'))
        amount += cart_item['sum']
    amount = float('%.2f' % amount)
    return cart_items, amount


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


# 获取排名信息
def get_order_data(user, is_month, is_all):
    month_ranking = 1
    all_ranking = 1
    all_user = models.User.objects.all().count()
    all_user_count = models.NewItem.objects.filter(operator=user).count()
    month_first = timezone.now().replace(day=1, hour=0, minute=0, second=0)
    month_user_count = models.NewItem.objects.filter(
        operator=user,
        add_time__lte=timezone.now(),
        add_time__gte=month_first).count()
    all_other_count = models.NewItem.objects.all().count() - all_user_count
    month_other_count = models.NewItem.objects.filter(
        add_time__lte=timezone.now(),
        add_time__gte=month_first).count() - month_user_count
    result = {
        'all_user_count': all_user_count,
        'month_user_count': month_user_count,
        'all_other_count': all_other_count,
        'month_other_count': month_other_count
    }
    if is_month:
        month_first = timezone.now().replace(day=1)
        sql = """
            SELECT
                COUNT(operator_id),
                operator_id
            FROM
                pay_newitem
            WHERE
                add_time <= now()
            AND
                add_time >= %(month_first)s
            GROUP BY
                operator_id
            ORDER BY
                COUNT(id) DESC
        """
        cur = connection.cursor()
        cur.execute(sql, {'month_first': month_first})
        alls = sql_utils.dictfetchall(cur)
        for item in alls:
            if item['operator_id'] == user.id:
                break
            else:
                month_ranking += 1
        result['month_ranking'] = month_ranking
        result['month_beat'] = all_user - month_ranking
    if is_all:
        sql = """
            SELECT
                COUNT(operator_id),
                operator_id
            FROM
                pay_newitem
            GROUP BY
                operator_id
            ORDER BY
                COUNT(id) DESC
        """
        cur = connection.cursor()
        cur.execute(sql)
        alls = sql_utils.dictfetchall(cur)
        for item in alls:
            if item['operator_id'] == user.id:
                break
            else:
                all_ranking += 1
        result['all_ranking'] = all_ranking
        result['all_beat'] = all_user - all_ranking
        return result


# 获取排名信息
def get_order_user_data():

    month_first = timezone.now().replace(day=1)
    sql = """
        SELECT
            users.*,
            new_item.num
        FROM
            (SELECT
                COUNT(operator_id) num,
                operator_id
            FROM
                pay_newitem

            WHERE
                add_time <= now()
            AND
                add_time >= %(month_first)s
            GROUP BY
                operator_id
            ORDER BY
                COUNT(id) DESC) AS new_item
        LEFT JOIN
            pay_user AS users
        ON
            new_item.operator_id=users.id
        ORDER BY
                new_item.num DESC
    """
    cur = connection.cursor()
    cur.execute(sql, {'month_first': month_first})
    month_sorts = sql_utils.dictfetchall(cur)
    sql = """
        SELECT
            users.*,
            new_item.num
        FROM
            (SELECT
                COUNT(operator_id) num,
                operator_id
            FROM
                pay_newitem
            GROUP BY
                operator_id
            ORDER BY
                COUNT(id) DESC) AS new_item
        LEFT JOIN
            pay_user AS users
        ON
            new_item.operator_id=users.id
        ORDER BY
                new_item.num DESC
    """
    cur = connection.cursor()
    cur.execute(sql)
    all_sorts = sql_utils.dictfetchall(cur)
    return {'month_sorts': month_sorts, 'all_sorts': all_sorts}


def cashier_required(func):
    """
    Decorator to make a view only confirm validate token
    """
    @wraps(func)
    def decorator(request, *args, **kwargs):
        user = request_user(request)
        if not hasattr(user, 'cashier'):
            return HttpResponseForbidden()
        return func(request, *args, **kwargs)

    return decorator


def manager_required(func):
    """
    Decorator to make a view only confirm validate token
    """
    @wraps(func)
    def decorator(request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'company_set'):
            return HttpResponseForbidden()
        return func(request, *args, **kwargs)

    return decorator


def get_users_integration(company):
    sql = """
        SELECT
            users.name,
            users.id,
            usm.residual_amount integration
        FROM
           pay_user AS users
        LEFT JOIN
            pay_userstoremap AS usm
        ON
            usm.user_id = users.id
        WHERE
            users.company_id=%(company_id)s
        AND
            users.is_active=TRUE
        ORDER BY users.add_time
    """
    cur = connection.cursor()
    cur.execute(sql, {'company_id': company.id})
    all_users = sql_utils.dictfetchall(cur)
    return all_users


def search_users_integration(company, word):
    sql = """
        SELECT
            users.name,
            users.id,
            usm.residual_amount integration
        FROM
           pay_user AS users
        LEFT JOIN
            pay_userstoremap AS usm
        ON
            usm.user_id = users.id
        WHERE
            users.company_id={company_id}
        AND
            users.name LIKE '%{word}%'
        AND
            users.is_active=TRUE
        ORDER BY users.add_time
    """.format(company_id=company.id, word=word)
    cur = connection.cursor()
    cur.execute(sql)
    all_users = sql_utils.dictfetchall(cur)
    return all_users


def get_new_item_status(company, status):
    sql = """
        SELECT DISTINCT
            users.name username,
            users.id uid,
            item.*,
            log.reward,
            store.name storename,
            store.address storeaddress
        FROM
           pay_user AS users
        LEFT JOIN
            pay_newitem AS item
        ON
            item.operator_id = users.id
        LEFT JOIN
            pay_newitemrewardlog AS log
        ON
            item.id=log.new_item_id
        LEFT JOIN
            standard_standardstore AS store
        ON
            item.store_id=store.id
        WHERE
            users.company_id=%(company_id)s
        AND
            item.status=%(status)s
        ORDER BY item.add_time
    """
    cur = connection.cursor()
    cur.execute(sql, {'company_id': company.id, 'status': status})
    results = sql_utils.dictfetchall(cur)
    status_map = {
        0: u'待审核',
        1: u'已通过',
        2: u'已被拒'
    }
    for result in results:
        result['status'] = status_map[result['status']]
        if type(result['reward']) == int and result['reward'] == REWARD_INTEGRATION:
            result['selected'] = 'yes'
        elif type(result['reward']) == int and result['reward'] == 0:
            result['selected'] = 'no'
        else:
            result['selected'] = 'none'
    return results


class CustomPaginator(Paginator):
    def __init__(self, current_page, per_pager_num, *args, **kwargs):
        # per_pager_num  显示的页码数量
        self.current_page = int(current_page)
        self.per_pager_num = int(per_pager_num)
        super(CustomPaginator, self).__init__(*args, **kwargs)

    def pager_num_range(self):
        '''
        自定义显示页码数
        第一种：总页数小于显示的页码数
        第二种：总页数大于显示页数  根据当前页做判断  a 如果当前页大于显示页一半的时候  ，往右移一下
                                                b 如果当前页小于显示页的一半的时候，显示当前的页码数量
        第三种：当前页大于总页数
        :return:
        '''
        if self.num_pages < self.per_pager_num:
            return range(1, self.num_pages+1)

        half_part = int(self.per_pager_num/2)
        if self.current_page <= half_part:
            return range(1, self.per_pager_num+1)

        if (self.current_page+half_part) > self.num_pages:
            return range(self.num_pages - self.per_pager_num+1, self.num_pages)
        return range(self.current_page - half_part, self.current_page + half_part + 1)


def search_new_item_status(company, status, search_type, word):
    if search_type == 'person':
        sql = """
             SELECT
                users.name username,
                users.id uid,
                item.*,
                log.reward,
                store.name storename,
                store.address storeaddress
            FROM
               pay_user AS users
            LEFT JOIN
                pay_newitem AS item
            ON
                item.operator_id = users.id
            LEFT JOIN
                pay_newitemrewardlog AS log
            ON
                item.id=log.new_item_id
            LEFT JOIN
                standard_standardstore AS store
            ON
                item.store_id=store.id
            WHERE
                users.company_id={company_id}
            AND
                item.status={status}
            AND
                users.name LIKE '%{word}%'
            ORDER BY item.add_time
        """.format(company_id=company.id, status=status, word=word)
    elif search_type == 'item':
        sql = """
             SELECT DISTINCT
                users.name username,
                users.id uid,
                item.*,
                log.reward,
                store.name storename,
                store.address storeaddress
            FROM
               pay_user AS users
            LEFT JOIN
                pay_newitem AS item
            ON
                item.operator_id = users.id
            LEFT JOIN
                pay_newitemrewardlog AS log
            ON
                item.id=log.new_item_id
            LEFT JOIN
                standard_standardstore AS store
            ON
                item.store_id=store.id
            WHERE
                users.company_id={company_id}
            AND
                item.status={status}
            AND
                item.name LIKE '%{word}%'
            ORDER BY item.add_time
        """.format(company_id=company.id, status=status, word=word)
    elif search_type == 'store':
        sql = """
             SELECT DISTINCT
                users.name username,
                users.id uid,
                item.*,
                log.reward,
                store.name storename,
                store.address storeaddress
            FROM
               pay_user AS users
            LEFT JOIN
                pay_newitem AS item
            ON
                item.operator_id = users.id
            LEFT JOIN
                pay_newitemrewardlog AS log
            ON
                item.id=log.new_item_id
            LEFT JOIN
                standard_standardstore AS store
            ON
                item.store_id=store.id
            WHERE
                users.company_id={company_id}
            AND
                item.status={status}
            AND
                store.name LIKE '%{word}%'
            ORDER BY item.add_time
        """.format(company_id=company.id, status=status, word=word)
    else:
        return []
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    status_map = {
        0: u'待审核',
        1: u'已通过',
        2: u'已被拒'
    }
    for result in results:
        result['status'] = status_map[result['status']]
        if type(result['reward']) == int and result['reward'] == REWARD_INTEGRATION:
            result['selected'] = 'yes'
        elif type(result['reward']) == int and result['reward'] == 0:
            result['selected'] = 'no'
        else:
            result['selected'] = 'none'
    return results


def get_result(query1, query2, start_time=None, end_time=None):
    cur = connection.cursor()
    cur.execute(query1)
    data = sql_utils.dictfetchall(cur)
    result = {}
    result['total_order_number'] = data[0]['total_order_number']
    result['total_customer_number'] = data[0]['total_customer_number']
    result['total_order_price'] = data[0]['total_order_price']
    result['total_profit'] = data[0]['total_profit']
    try:
        average_customer_price = data[0]['total_order_price']/data[0]['total_customer_number']
        average_customer_price = ("%.2f" % average_customer_price)
    except:
        average_customer_price = 0
    result['average_customer_price'] = average_customer_price
    engine = sqlalchemy.create_engine(environ.get('CM_BUSSINESS_DB_URL'))
    df = pandas.read_sql_query(query2,engine)
    if not df.empty and start_time and end_time:
            df1 = pandas.DataFrame(pandas.date_range(start_time, end_time).strftime("%Y-%m-%d"), columns=['period'])
            df = df.merge(df1,how='outer').fillna(0).sort_values('period')
    result['order_number'] = df['order_number'].tolist()
    result['customer_number'] = df['customer_number'].tolist()
    result['order_price'] = df['order_price'].tolist()
    result['profit'] = df['profit'].tolist()
    result['customer_price'] = []
    for i in range(len(result['order_price'])):
        try:
            customer_price = result['order_price'][i]/result['customer_number'][i]
            customer_price = ("%.2f" % customer_price)
        except:
            customer_price = 0
        result['customer_price'].append(customer_price)
    result['period'] = df['period'].tolist()
    return result


def get_orders_data(start_time, end_time):
    query1 = '''
                SELECT
                    COUNT(DISTINCT(receipt_id)) as total_order_number,
                    COUNT(DISTINCT(user_id)) as total_customer_number,
                    SUM(subtotal) as total_order_price,
                    SUM(subtotal) - SUM(purchase_price) as total_profit
                FROM
                    cm_cvs_goodsflow
                WHERE
                    date >= '{start_time}'
                AND
                    date <= '{end_time}'
            '''.format(start_time=start_time, end_time=end_time)
    query2 = '''
                SELECT
                    COUNT(DISTINCT(receipt_id)) as order_number,
                    COUNT(DISTINCT(user_id)) as customer_number,
                    SUM(subtotal) as order_price,
                    SUM(subtotal) - SUM(purchase_price) as profit,
                    date as period
                FROM
                    cm_cvs_goodsflow
                WHERE
                    date >= '{start_time}'
                AND
                    date <= '{end_time}'
                GROUP BY
                    period
            '''.format(start_time=start_time, end_time=end_time)
    result = get_result(query1, query2, start_time, end_time)
    return result


def get_realtime_data(today):
    query1 = '''
                SELECT
                    COUNT(DISTINCT(receipt_id)) as total_order_number,
                    COUNT(DISTINCT(user_id)) as total_customer_number,
                    SUM(subtotal) as total_order_price,
                    SUM(subtotal) - SUM(purchase_price) as total_profit
                FROM
                    cm_cvs_goodsflow
                WHERE
                    wx_saletime::date = '{today}'
             '''.format(today=today)
    query2 = '''
                SELECT
                    SUM(inventory*purchase_price) as inventory_costs
                FROM pay_item
            '''
    cur = connection.cursor()
    cur.execute(query1)
    data = sql_utils.dictfetchall(cur)
    result = {}
    result['total_order_number'] = data[0]['total_order_number']
    result['total_customer_number'] = data[0]['total_customer_number']
    result['total_order_price'] = data[0]['total_order_price']
    result['total_profit'] = data[0]['total_profit']
    try:
        average_customer_price = data[0]['total_order_price']/data[0]['total_customer_number']
        average_customer_price = ("%.2f" % average_customer_price)
    except:
        average_customer_price = 0
    result['average_customer_price'] = average_customer_price
    cur.execute(query2)
    data = sql_utils.dictfetchall(cur)
    result['inventory_costs'] = data[0]['inventory_costs']
    return result


def get_goods_info(start_time, end_time):
    query = '''
                SELECT
                    is_best_seller,
                    name,
                    barcode,
                    count as week_sales,
                    inventory,
                    price,
                    (price-purchase_price) as profit
                FROM
                    pay_item
                LEFT JOIN
                    (
                        SELECT
                            COUNT(*),
                            receipt_item_id
                        FROM
                            cm_cvs_goodsflow
                        WHERE
                            date >= '{start_time}' and date <= '{end_time}'
                        GROUP BY
                            receipt_item_id
                    )as sales
                ON
                    pay_item.id = sales.receipt_item_id::int
                WHERE
                    inventory is not null
            '''.format(start_time=start_time, end_time=end_time)
    cur = connection.cursor()
    cur.execute(query)
    data = sql_utils.dictfetchall(cur)
    return data


def get_shelf_item_sales(store):
    shelfs = models.StoreItemShelf.objects.filter(
        store=store)
    results = []
    for shelf in shelfs:
        items = models.ItemShelfMap.objects.filter(
            shelf=shelf)
        barcodes = []
        shelf_dict = {}
        position_map = {}
        for item in items:
            barcodes.append(item.barcode)
            position_map[item.id] = {'row': item.row,
                                     'column': item.column}
        barcodes = "','".join(barcodes)
        sql = """
            SELECT
                receipt_item_id,
                max(item_name) name,
                sum(quantity) sales,
                (max(price) - max(purchase_price)) profit
            FROM
                cm_cvs_goodsflow
            WHERE
                receipt_item_id
            IN ('{barcodes}')
            AND
                wx_store_id='{store_id}'
            AND
                wx_saletime<=now()
            AND
                wx_saletime>=date_trunc('day', now())
            GROUP BY  receipt_item_id;
        """.format(store_id=store.id, barcodes=barcodes)
        cur = connection.cursor()
        cur.execute(sql)
        shelf_results = sql_utils.dictfetchall(cur)
        for shelf_result in shelf_results:
            shelf_result['row'] = position_map.get(
                shelf_result['receipt_item_id'])['row']
            shelf_result['column'] = position_map.get(
                shelf_result['receipt_item_id'])['column']
        shelf_dict[shelf.name] = {'id': shelf.id,
                                  'max_row': shelf.max_rows,
                                  'max_column': shelf.max_columns,
                                  'content': shelf_results
                                  }

        results.append(shelf_dict)
    return {'data': results}


def item_rebuy_percent(item_id, store_id, start_time, end_time):
    sql = """
            SELECT
                user_id,
                    count(user_id) as rebuy_amount
            FROM
                (SELECT
                    user_id,
                    count(user_id) as rebuy_amount
                FROM
                    cm_cvs_goodsflow
                WHERE
                    wx_store_id='{store_id}'
                AND
                    wx_saletime>='{start_time}'
                AND
                    wx_saletime<='{end_time}'
                AND
                    receipt_item_id='{item_id}'
                GROUP BY
                    user_id, receipt_id) AS temp
            GROUP BY
                    user_id
    """.format(store_id=store_id,
               start_time=start_time,
               end_time=end_time,
               item_id=item_id)
    flow = get_person_flow(store_id, start_time, end_time)
    cur = connection.cursor()
    cur.execute(sql)
    shelf_results = sql_utils.dictfetchall(cur)
    amount = len(shelf_results)
    rebuy_amount = 0
    for result in shelf_results:
        if result['rebuy_amount'] > 1:
            rebuy_amount += 1
    if amount == 0:
        rebuy_percent = 0
        permeability = 0
    else:
        rebuy_percent = rebuy_amount / float(amount)
        rebuy_percent = float('%.2f' % rebuy_percent)
        permeability = float(amount) / flow
        permeability = float('%.2f' % permeability)
    data = {'percent': rebuy_percent,
            'rebuy_amount': rebuy_amount,
            'amount': amount,
            'permeability': permeability}
    return data


def get_person_flow(store_id, start_time, end_time):
    sql = """
        SELECT
            COUNT(temp1.user_id)
        FROM (
                SELECT
                    COUNT(user_id),
                    user_id
                FROM
                    pay_order
                WHERE
                    order_time>='{start_time}'
                AND
                    order_time<='{end_time}'
                AND
                    store_id={store_id}
                GROUP BY
                    user_id) as temp1
    """.format(store_id=store_id,
               start_time=start_time,
               end_time=end_time)
    cur = connection.cursor()
    cur.execute(sql)
    flow = sql_utils.dictfetchall(cur)[0]['count']
    return flow


def rebuy_percent_sort(store_id, start_time, end_time):
    items = models.Item.objects.all()
    percents = []
    for item in items:
        percent = item_rebuy_percent(
            item.id,
            store_id,
            start_time,
            end_time)
        percents.append({
            'name': item.name,
            'percent': percent['percent'],
            'rebuy_amount': percent['rebuy_amount'],
            'amount': percent['amount'],
            'id': item.id,
            'permeability': percent['permeability']})
    result = sorted(percents,
                    key=lambda dic: dic['percent'],
                    reverse=True)
    return result


def get_rebuy_ranking():
    sql = """
        select
            log.num,
            guide.name,
            store.store_name,
            log.add_time + interval '8 hour' add_time,
            log.store_receipts,
            case log.item_rebate_id when 1
            then '百年牛栏山珍品陈酿39度500ML '
            when 2
            then '牛栏山42度百年（珍品陈酿20）500ml'
            when 3
            then '牛栏山52度百年（珍品陈酿20）500ml'
            when 4
            then '牛栏山52度500ml百年牛栏山珍品陈酿'
            when 5
            then '牛栏山43度精制陈酿500ml'
            end goods_name
        from
            dailystatement_rebatelog as log
        left join
            dailystatement_guide as guide
            on log.guide_id=guide.id
        left join dailystatement_store as store
        on guide.store_id=store.id
        where
            add_time>'2017-7-27'
        order by guide.name;
    """
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    num_dict = {}
    for res in results:
        temp_dict = {'store': res['store_name'],
                     'num': res['num'],
                     'add_time': res['add_time'],
                     'store_receipts': res['store_receipts'],
                     'goods_name': res['goods_name']}
        if res['name'] in num_dict:
            temp = num_dict[res['name']]
            temp.append(temp_dict)
            num_dict[res['name']] = temp
        elif res['name'] and res['name'] not in num_dict:
            num_dict[res['name']] = [temp_dict]

    reco_sql = """
        select
            t1.money,t1.effective_time + interval '8 hour' times,
            guide.name,
            store.store_name from
                (select record.total_amount / 100 as money,
                    record.id, effective_time,
                    substring(device_id, 4) as phone
                    from advertisement_redpackrecord as record
                    left join advertisement_weixinqrcode as qr
                    on record.qrcode_id=qr.id
                    where
                    qr.device_id like 'NLS%'
                    and record.redpack_name_id=19
                    AND record.status='SUCCESS'
                    and record.current_time>'2017-7-27') as t1
    left join
        dailystatement_guide as guide
    on t1.phone=guide.telephone
    left join
        dailystatement_store as store
    on guide.store_id=store.id order by guide.name;
    """
    cur.execute(reco_sql)
    shelf_results = sql_utils.dictfetchall(cur)
    money_dict = {}
    for res in shelf_results:
        temp_dict = {'store': res['store_name'],
                     'money': res['money'],
                     'times': res['times']}
        if res['name'] in money_dict:
            temp = money_dict[res['name']]
            temp.append(temp_dict)
            money_dict[res['name']] = temp
        elif res['name'] and res['name'] not in money_dict:
            money_dict[res['name']] = [temp_dict]
    result = []
    for key, value in money_dict.items():
        money_temp = value
        num_temp = num_dict.get(key)
        for i in value:
            for j in num_temp:
                if (i['times'] - j['add_time']).seconds < 50:
                    all_msg = {'name': key}
                    all_msg.update(i)
                    all_msg.update(j)
                    result.append(all_msg)
                    break
    return result


def get_newest_sales(store_id):
    sql = """
        SELECT
            orders.order_time,
            users.nick_name,
            users.avatar,
            orderitem.num,
            orderitem.subtotal,
            item.name
        FROM
            pay_order AS orders
        LEFT JOIN
            pay_orderitem AS orderitem
        ON
            orders.id=orderitem.order_id
        LEFT JOIN
            pay_item AS item
        ON
            orderitem.item_id=item.id
        LEFT JOIN
            pay_user AS users
        ON
            orders.user_id=users.id
        WHERE
            orders.order_time > date_trunc('day', now())
        AND
            orders.status=1
        ORDER BY
            orders.order_time DESC;
    """
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    amount = 0
    for res in results:
        amount += res['subtotal']
    return {'msg': results, 'amount': amount}


def get_store_sales_data_by_date(store_id, start_time, end_time, key_word):
    if not key_word:
        sql = """SELECT
            max(item.name) AS item_name,
            max(item.barcode) AS barcode,
            count(item.barcode) AS num,
            max(item.price) AS price
        FROM
            pay_order AS orders
        LEFT JOIN
            pay_orderitem AS orderitem
        ON
            orders.id=orderitem.order_id
        LEFT JOIN
            pay_item AS item
        ON
            orderitem.item_id=item.id
        WHERE
            orders.store_id={store_id}
        AND
            orders.status=1
        AND
            orders.order_time>='{start_time}'
        AND
            orders.order_time<='{end_time}'
        GROUP BY
            item.barcode;
    """.format(store_id=store_id,
               start_time=start_time,
               end_time=end_time)
    else:
        sql = """SELECT
            max(item.name) AS item_name,
            max(item.barcode) AS barcode,
            count(item.barcode) AS num,
            max(item.price) AS price
        FROM
            pay_order AS orders
        LEFT JOIN
            pay_orderitem AS orderitem
        ON
            orders.id=orderitem.order_id
        LEFT JOIN
            pay_item AS item
        ON
            orderitem.item_id=item.id
        WHERE
            orders.store_id={store_id}
        AND
            orders.status=1
        AND
            orders.order_time>='{start_time}'
        AND
            orders.order_time<='{end_time}'
        AND
                (item.name LIKE '%{key_word}%'
                OR
                item.barcode LIKE '%{key_word}%')
        GROUP BY
            item.barcode;
    """.format(store_id=store_id,
               start_time=start_time,
               end_time=end_time,
               key_word=key_word)
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    return results


def read_new_item_excel(file_path, sid, user):
    data = xlrd.open_workbook(file_path)
    os.remove(file_path)
    table = data.sheet_by_index(0)
    # 获取表头
    col_head_array = table.row_values(0)
    row_number = table.nrows
    #检查表头
    # if col_head_array == standard_heads:
    for row in range(1, row_number):
        row_datas = table.row_values(row)
        name = row_datas[0]
        brand = row_datas[1]
        unit = row_datas[2] #规格
        taste = row_datas[3]
        barcode = row_datas[4]
        price = row_datas[5]
        durability = int(row_datas[6]) #保质期
        spec = row_datas[7] #包装
        res = models.NewItem.objects.filter(barcode=barcode).update(
            name=name,
            unit=unit,
            price=price,
            taste=taste,
            brand=brand,
            best_before_date=durability,
            pack=spec,
            update_time=timezone.now())
        # if res:
        #     publisher.pub_new_item(
        #         name=name,
        #         spec=spec,
        #         price=price,
        #         taste=taste,
        #         brand=brand,
        #         sources=['40'],
        #         barcodes=[barcode],
        #         durability=durability,
        #         unit=unit)
    return 'ok'


def get_stocking_items(store, status):
    sql = '''
            SELECT
                max(stocktaking.id) AS stocktaking_id,
                max(item.id) AS item_id,
                max(item.name) AS item_name,
                sum(subs.num) AS amount,
                max(item.barcode) AS barcode
            FROM
                pay_stocktaking AS stocktaking
            LEFT JOIN
                pay_substocktaking as subs
            ON
                stocktaking.id=subs.stock_taking_id
            LEFT JOIN
                pay_item as item
            ON
                subs.item_id=item.id
            WHERE
                stocktaking.store_id={store_id}
            AND
                stocktaking.status={status}
            GROUP BY
                subs.item_id;
        '''.format(store_id=store.id,
                   status=status)
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    return results


def get_stocking_peer_item(store, status):
    sql = '''
            SELECT
                stocktaking.id AS stocktaking_id,
                subs.id AS substock_id,
                item.id AS item_id,
                item.name AS item_name,
                subs.num AS amount,
                item.barcode AS barcode,
                users.name
            FROM
                pay_stocktaking AS stocktaking
            LEFT JOIN
                pay_substocktaking as subs
            ON
                stocktaking.id=subs.stock_taking_id
            LEFT JOIN
                pay_item as item
            ON
                subs.item_id=item.id
            LEFT JOIN
                pay_cashier AS cashier
            ON
                subs.operator_id=cashier.id
            LEFT JOIN
                pay_user AS users
            ON
                cashier.user_id=users.id
            WHERE
                stocktaking.store_id={store_id}
            AND
                stocktaking.status={status}

        '''.format(store_id=store.id,
                   status=status)
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    return results


def get_yestoday_redpack_amount():
    start_time = (timezone.now()- datetime.timedelta(days=1)).replace(hour=0, minute=0, second=0)
    end_time = (timezone.now()- datetime.timedelta(days=1)).replace(hour=23, minute=59, second=59)
    sql = '''
        SELECT
            guide.name,
            store.store_name,
            goods.name,
            redpack.total_amount / 100 as money,
            log.num,
            to_char(log.add_time + interval '8 hour' , 'YYYY-MM-DD HH:MM') add_time,
            log.red_packets
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
            log.add_time>'{start_time}'
        AND
            log.add_time<'{end_time}'
        AND
            log.qrcode is not null;
    '''.format(
        start_time=start_time,
        end_time=end_time)
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    amount = 0
    for res in results:
        amount += res['money']
    return {'amount': amount, 'items': results}


def auto_replenish(store_id):
    items = models.AutoReplenishConf.objects.all()
    item_ids = [str(item.item_id) for item in items]
    query_item_ids = ','.join(item_ids)
    print item_ids, query_item_ids
    time_span = 6
    start_time = (timezone.now() - datetime.timedelta(days=time_span)).replace(hour=0, minute=0, second=0)
    end_time = timezone.now()
    sql = """
        SELECT
            to_char(orders.order_time, 'yyyy-MM-dd'),
            max(item.id) AS item_id,
            sum(orderitem.num)
        FROM
            pay_order AS orders
        LEFT JOIN
            pay_orderitem AS orderitem
        ON
            orders.id=orderitem.order_id
        LEFT JOIN
            pay_item AS item
        ON
            orderitem.item_id=item.id
        WHERE
            orders.store_id={store_id}
        AND
            orders.status=1
        AND
            orders.order_time>='{start_time}'
        AND
            orders.order_time<='{end_time}'
        AND
            item.id in ({item_ids})
        GROUP BY
            to_char(orders.order_time, 'yyyy-MM-dd');
    """.format(store_id=store_id,
               item_ids=query_item_ids,
               start_time=start_time,
               end_time=end_time)
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    sales = {}
    for res in results:
        key = str(res['item_id'])
        value = int(res['sum'])
        if key in sales:
            tmp = sales[key]
            tmp.append(value)
            sales[key] = tmp
        else:
            sales[key] = [value]
    for key in sales:
        tmp = sales[key]
        tmp.extend([0]*(time_span-len(tmp)))
        sales[key] = tmp
        avg = sum(tmp) / float(time_span)
        np_tmp = np.array(sales[key])
        models.AutoReplenishConf.objects.filter(item_id=int(key)).update(
            avg=avg,
            sale_std=np.std(np_tmp))


def check_item_inventory(store_id):
    sql = """
        SELECT
            item.name,
            item.barcode,
            item.inventory,
            (item.inventory-conf.stock_period*conf.avg) AS later,
            conf.stock_period
        FROM
            pay_autoreplenishconf AS conf
        LEFT JOIN
            pay_item AS item
        ON
            conf.item_id=item.id
        WHERE
            conf.min_inventory>=(item.inventory-conf.stock_period*conf.avg)
        AND
            item.store_id={store_id};
    """.format(store_id=store_id)
    cur = connection.cursor()
    cur.execute(sql)
    results = sql_utils.dictfetchall(cur)
    return results