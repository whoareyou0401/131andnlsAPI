# -*- coding: utf-8 -*-
from django.db import connection
from core import sql_utils
import datetime
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from django.forms.models import model_to_dict
# from .static_parameter import *
from user.models import CMUser
# from standard.models import StandardStore
from math import radians, cos, sin, asin, sqrt
import json
import logging
import requests
import time
import utils
import sqlalchemy
# from sqlalchemy import text
import pandas
from django.core.cache import cache

logger = logging.getLogger(__name__)


def get_dealers_by_customer_from_group(customer):
    customer_groups = customer.groups.all()
    return [g.dealer for g in customer_groups]






def log_order(
        user,
        dealer,
        customer,
        confirmed_orders,
        orders_code):
    if hasattr(user, 'usertocustomer') and \
            user.usertocustomer.related_customer.id == customer.id:
        from_type = 'customer'
    elif hasattr(user, 'salesman'):
        from_type = 'salesman'

    source = dealer.source
    customer_id = customer.customer_id

    if bool_ordered(source, customer_id):
        recommend_list = []
    else:
        recommend_list = recommend(source, customer_id)

    recommend_orders = ''
    for recommend_detail in recommend_list:
        recommend_num = recommend_detail['recommend_num']
        item_id = recommend_detail['item_id']
        recommend_orders = recommend_orders + \
            str(item_id) + ',' + str(recommend_num) + '|'

    logger.info('Logging order')

    order_log_obj = OrderLog()
    order_log_obj.user = user
    order_log_obj.related_customer = customer
    order_log_obj.dealer = dealer
    order_log_obj.source = dealer.source
    order_log_obj.customer_id = customer.customer_id
    order_log_obj.from_type = from_type
    order_log_obj.recommend_orders = recommend_orders
    order_log_obj.confirm_orders = confirmed_orders
    order_log_obj.orders_code = orders_code
    order_log_obj.save()


# def del_zero_price_item(source, item_list):
#     item_detail_results = get_items_detail(
#         source, [
#             item['item_id'] for item in item_list], if_stock=False)
#     zero_ids = []
#     for item in item_detail_results:
#         if float(item['price']) == 0:
#             zero_ids.append(item['item_id'])
#     item_list_out = []
#     for result in item_list:
#         item_id = result['item_id']
#         if item_id not in zero_ids:
#             item_list_out.append(result)
#     return item_list_out


# def send_orders_to_dealer(dealer, customer, orders):
#     order_url_pre = dealer.order_url_pre
#     url = order_url_pre + '?customer_id=' + \
#         str(customer.customer_id) + '&orders=' + orders
#     logger.info('sending order request with url: ' + url)
#     try:
#         page = urllib.urlopen(url).read()
#         logger.info('Returned value: ' + page)
#         if 'loss_ids=' in page:
#             status_code = '3'
#             status = settings.DEALER_ORDER_STATUS[status_code]
#             loss_array = page.split('loss_ids=')[1].split('|')
#             logger.info('Loss ids: ' + str(loss_array))
#             loss_detail = {}
#             for loss_one in loss_array:
#                 if not loss_one:
#                     continue
#                 loss_one_array = loss_one.split(',')
#                 item_id = loss_one_array[0]
#                 stock_num = loss_one_array[1]
#                 loss_detail[item_id] = stock_num
#             item_detail_list = get_items_detail(source, loss_detail.keys())
#             for item in item_detail_list:
#                 status = status + item['item_name'] + \
#                     u'剩余 ' + loss_detail[item_id] + ' ;'
#         else:
#             status_code = page
#             status = settings.DEALER_ORDER_STATUS[status_code]
#     except:
#         status_code = '4'
#         status = settings.DEALER_ORDER_STATUS[status_code]
#         logger.exception('Error sending request')

#     logger.info('Get status: ' + status + ', with code: ' + status_code)
#     return status_code, status


# def del_zero_recommend(results):
#     out = []
#     for result in results:
#         customer_id = result['customer_id']
#         source = result['source']
#         if bool_ordered(source, customer_id) or \
#                 (not recommend(source, customer_id, if_stock=False)):
#             continue
#         out.append(result)
#     return out


# def del_out_stock(recommend_list):
#     out = []
#     for result in recommend_list:
#         stock_num = result['stock_num']
#         recommend_num = result['recommend_num']
#         if stock_num < recommend_num:
#             recommend_num = stock_num
#         if recommend_num == 0:
#             continue
#         result['recommend_num'] = recommend_num
#         out.append(result)
#     return out


# def check_order_able(func):
#     def _deco(request, *args, **kwargs):
#         user = request.user
#         customer = get_customer(user)
#         if len(customer) < 1:
#             user_name = str(user)
#             dealers = Dealer.objects.filter(user_name=user_name)
#         else:
#             source = customer[0]['source']
#             dealers = Dealer.objects.filter(source=source)

#         if dealers:
#             dealer = dealers[0]
#             order_able = dealer.order_able
#         else:
#             order_able = True
#         if order_able:
#             ret = func(request, *args, **kwargs)
#             return ret
#         else:
#             return HttpResponse(u'系统暂时关闭')
#     return _deco


# def del_zero_cat(cats, source):
#     out = []
#     for cat in cats:
#         sql = '''
#         SELECT
#           i.item_id, i.price
#         FROM
#           recommendorder_item as i
#         WHERE
#           i.source = '%(source)s' AND
#           i.category = '%(cat_name)s'
#         ''' % {'source': source, 'cat_name': cat}
#         cur = connection.cursor()
#         cur.execute(sql)
#         results = sql_utils.dictfetchall(cur)
#         results = del_zero_price_item(source, results)
#         if len(results) > 0:
#             out.append(cat)
#     out.sort()
#     return out


# def get_stock(source, items):
#     if not items:
#         logger.warn('Items not specified')
#         return []
#     item_list = [x['item_id'] for x in items]
#     url = Dealer.objects.get(
#         source=source).stock_url_pre + '?stock=' + '|'.join(item_list)
#     page = None
#     try:
#         page = urllib.urlopen(url).read()
#     except:
#         logger.exception('Error getting page')
#         for i in items:
#             i['stock_num'] = 0
#         return items
#     stock_arr = page.split('stock=')[1].split('|')
#     stock_dict = {}
#     for stock_detail in stock_arr:
#         stock_detail_arr = stock_detail.split(',')
#         item_id = stock_detail_arr[0]
#         stock_num = float(stock_detail_arr[1])
#         stock_dict[item_id] = stock_num
#     out = []
#     for item in items:
#         item_id = item['item_id']
#         stock_num = stock_dict.get(item_id, None)
#         if stock_num is None:
#             logger.warn('Could not find stock for ' + str(item_id))
#             continue
#         item['stock_num'] = stock_num
#         out.append(item)
#     return out


def model_to_list_dict(items):
    return [model_to_dict(item) for item in items]


def query_items(source, query):
    query_list = map_query(query)
    out = []
    for query in query_list:
        items = Item.objects.filter(
            Q(source=source), Q(item_name__contains=query))
        items = model_to_list_dict(items)
        out.extend(items)
    return out


def map_query(query):
    query_list = []
    for key in QUERY_MAP.keys():
        if key in query:
            key_list = QUERY_MAP[key]
            for rep_key in key_list:
                rep_query = query.replace(key, rep_key)
                query_list.append(rep_query)
    query_list.append(query)
    return query_list


def distance_to_location(current_lng, current_lat, radius):
    add_lat = radius / settings.CM_DISCOVER_STORE_LAT_TO_DISTANCE
    add_lng = radius / settings.CM_DISCOVER_STORE_LNG_TO_DISTANCE
    radius_lat_location = add_lat / 3600
    radius_lng_location = add_lng / 3600
    start_lat = current_lat - radius_lat_location
    end_lat = current_lat + radius_lat_location
    start_lng = current_lng - radius_lng_location
    end_lng = current_lng + radius_lng_location
    return [start_lng, end_lng, start_lat, end_lat]


def distance(lat1, lng1, lat2, lng2):
    radlat1 = radians(lat1)
    radlat2 = radians(lat2)
    a = radlat1 - radlat2
    b = radians(lng1) - radians(lng2)
    s = 2 * asin(sqrt(pow(sin(a / 2),
                          2) + cos(radlat1) * cos(radlat2) * pow(sin(b / 2), 2)))
    earth_radius = 6378.137
    s = s * earth_radius
    if s < 0:
        return -s
    else:
        return s


def location_to_addrr(location):
    url = settings.CM_GAODE_MAP_TO_ADDRESS_URL
    params = {'output': 'json',
              'location': location,
              'key': settings.GAODE_MAP_KEY,
              'radius': 1000,
              'extensions': 'all'}
    req = requests.get(url, params=params)
    json_data = json.loads(req.content)
    if json_data['status'] == '1':
        addr = json_data['regeocode']['formatted_address']
        adcode = json_data['regeocode']['addressComponent']['adcode']
        return addr, adcode
    else:
        return u'定位失败，请重试'


def get_delete_store_choice(user, search_area, form):
    salesman = user.salesman
    dealer = salesman.dealer
    data_engine = sqlalchemy.create_engine(settings.BUSSINESS_DB_URL)
    results = pandas.read_sql_query(sqlalchemy.text(""" SELECT
        *
        FROM
        recommendorder_customer
        WHERE dealer_id=:dealer_id
        AND lat>=:lat_min
        AND lat<=:lat_max
        AND lng>=:lng_min AND lng<=:lng_max"""),
                                    data_engine,
                                    params={
        'dealer_id': dealer.id,
        'lat_min': search_area[2],
        'lat_max': search_area[3],
        'lng_min': search_area[0],
        'lng_max': search_area[1]})
    stores = []
    for store in results.itertuples():
        store_dict = {}
        store_dict['id'] = store[1]
        store_dict['source'] = store[2]
        store_dict['customer_id'] = store[3]
        store_dict['customer_name'] = store[4]
        store_dict['customer_phone'] = store[5]
        store_dict['customer_address'] = store[6]
        store_dict['dealer'] = store[11]
        store_dict['lat'] = store[9]
        store_dict['lng'] = store[10]
        stores.append(store_dict)
    return_info = []
    current_lng = form.cleaned_data.get('lng')
    current_lat = form.cleaned_data.get('lat')
    for store in stores:
        store['lat'] = float(store['lat'])
        store['lng'] = float(store['lng'])
        dis = distance(
            float(current_lat),
            float(current_lng),
            float(store['lat']),
            float(store['lng']))
        time = timezone.now()
        day = timezone.now().timetuple().tm_mday
        year = timezone.now().timetuple().tm_year
        month = timezone.now().timetuple().tm_mon
        is_checkin = Checkin.objects.filter(
            salesman=salesman,
            customer_id=store['id'],
            time__day=day,
            time__year=year,
            time__month=month)
        if len(is_checkin) > 0:
            store['is_checkin'] = 1
        else:
            store['is_checkin'] = 0
        store['dis'] = dis
        return_info.append(store)
        return_info = sorted(
            return_info,
            key=lambda dict: dict["dis"],
            reverse=False)
    return return_info


def address_to_lcoation(address):
    url = settings.CM_GAODE_MAP_URL
    params = {"key": settings.GAODE_MAP_KEY, 'address': address}
    retry = 3
    result_dict = {}
    while retry > 0:
        try:
            req = requests.get(url, params=params)
            json_data = json.loads(req.content)
            weather_dict = {}
            if json_data['info'] == 'OK' and len(json_data['geocodes']) > 0:
                geocodes = json_data['geocodes'][0]
                location = geocodes['location']
                adcode = geocodes.get('adcode')
                lat = float(location.split(',')[1])
                lng = float(location.split(',')[0])
                retry = -1
                return lat, lng, adcode
            else:
                time.sleep(0.5)
                retry = retry - 1
        except requests.RequestException, e:
            retry = retry - 1
    return None, None, None


def search_dealer_customers(form, user):
    name = form.cleaned_data.get('name')
    salesman = user.salesman
    dealer = salesman.dealer
    sql = ''' SELECT c.id
               FROM recommendorder_customerorder AS a
               LEFT JOIN recommendorder_dealercustomermap AS b
               ON a.customer_id=b.customer_id
               LEFT JOIN recommendorder_customer AS c
               ON b.customer_id=c.id WHERE
               b.dealer_id=%(dealer_id)s AND
               a.order_time<=now() AND a.order_time>=date_trunc('day', now());
          '''
    cur = connection.cursor()
    cur.execute(sql,  {'dealer_id': dealer.id})
    record_results = sql_utils.dictfetchall(cur)

    sql = ''' SELECT c.id
               FROM recommendorder_bagmancustomerorder AS a
               LEFT JOIN recommendorder_dealercustomermap AS b
               ON a.customer_id=b.customer_id
               LEFT JOIN recommendorder_customer AS c
               ON b.customer_id=c.id WHERE
               b.dealer_id=%(dealer_id)s AND
               a.order_time<=now() AND a.order_time>=date_trunc('day', now());
          '''
    cur = connection.cursor()
    cur.execute(sql,  {'dealer_id': dealer.id})
    bagman_orders = sql_utils.dictfetchall(cur)

    record_dict = {}
    for record in record_results:
        record_dict[record['id']] = 1

    for order in bagman_orders:
        record_dict[order['id']] = 1

    sql = ''' SELECT b.*
               FROM recommendorder_dealercustomermap AS a
               LEFT JOIN recommendorder_customer AS b
               ON a.customer_id=b.id WHERE
               a.dealer_id=%(dealer_id)s AND
               b.customer_name LIKE %(name)s;
          '''
    cur = connection.cursor()
    cur.execute(sql,  {'dealer_id': dealer.id, 'name': '%' + name + '%'})
    records = sql_utils.dictfetchall(cur)

    search_results = []
    now = timezone.now().timetuple()
    day = now.tm_mday
    year = now.tm_year
    month = now.tm_mon
    for record in records:
        if record['lat'] and record['lng']:
            record['lat'] = float(record['lat'])
            record['lng'] = float(record['lng'])
        if record_dict.get(record['id']) == 1:
            record['is_buy'] = 1
        else:
            record['is_buy'] = 0
        search_results.append(record)
    return search_results


def get_salesman_all_customers(dealer_id):
    sql = '''SELECT
    b.customer_id,
    b.customer_name,
    b.customer_address,
    b.id, a.dealer_id
    FROM recommendorder_dealercustomermap AS a
    LEFT JOIN
    recommendorder_customer AS b
    ON a.customer_id=b.id
    LEFT JOIN recommendorder_customerorder AS c
    ON b.id=c.customer_id
    WHERE
    a.dealer_id= %(dealer_id)s
    AND b.deleted_flag is FALSE
    AND a.status = 1
    GROUP BY
    b.id,
    a.dealer_id,
    b.customer_id,
    b.customer_name,
    b.customer_address
    ORDER BY count(a.customer_id) DESC LIMIT 100;
    '''
    cur = connection.cursor()
    cur.execute(sql,  {'dealer_id': dealer_id})
    results = sql_utils.dictfetchall(cur)

    sql = ''' SELECT c.id
               FROM recommendorder_customerorder AS a
               LEFT JOIN recommendorder_dealercustomermap AS b
               ON a.customer_id=b.customer_id
               LEFT JOIN recommendorder_customer AS c
               ON b.customer_id=c.id
               WHERE
               b.dealer_id=%(dealer_id)s
               AND
               a.order_time<=now()
               AND
               a.order_time>=date_trunc('day', now());
          '''
    cur = connection.cursor()
    cur.execute(sql,  {'dealer_id': dealer_id})
    record_results = sql_utils.dictfetchall(cur)
    sql = ''' SELECT c.id
               FROM recommendorder_bagmancustomerorder AS a
               LEFT JOIN recommendorder_dealercustomermap AS b
               ON a.customer_id=b.customer_id
               LEFT JOIN recommendorder_customer AS c
               ON b.customer_id=c.id
                WHERE
               b.dealer_id=%(dealer_id)s
               AND
               a.order_time<=now()
               AND
               a.order_time>=date_trunc('day', now());
          '''
    cur = connection.cursor()
    cur.execute(sql,  {'dealer_id': dealer_id})
    bagman_orders = sql_utils.dictfetchall(cur)
    customers = []
    record_dict = {}
    for record in record_results:
        record_dict[record['id']] = 1

    for order in bagman_orders:
        record_dict[order['id']] = 1
    cur.close()
    for result in results:
        is_buy = 0
        if record_dict.get(result['id']) == 1:
            is_buy = 1
        result['is_buy'] = is_buy
        customers.append(result)
    return customers


def get_cart_sale_buyed_categorys(customer_id):
    sql = '''SELECT item.category,
                             item.related_category_id,
                             item.series_item_id,
                             bagmanitem.quantity,
                             series.name series_name,
                             series.id series_id,
                             seriesitem.name series_item_name
            FROM recommendorder_bagmanitem AS bagmanitem
            LEFT JOIN
            recommendorder_item AS item
            ON bagmanitem.item_id=item.id
            LEFT JOIN
            recommendorder_series AS series
            ON item.related_category_id=series.category_id
            LEFT JOIN
            recommendorder_seriesitem AS seriesitem
            ON series.id = seriesitem.series_id
            WHERE
            bagmanitem.customer_id=%(customer_id)s
            AND bagmanitem.add_time<=now()
            AND bagmanitem.add_time>=date_trunc('day', now());
    '''
    cur = connection.cursor()
    cur.execute(sql,  {'customer_id': customer_id})
    results = sql_utils.dictfetchall(cur)
    category_array = []
    category_temp = []
    series_temp = {}
    for result in results:
        category_dict = {}
        if result['category'] not in category_temp:
            category_temp.append(result['category'])
            category_dict['name'] = result['category']
            category_dict['id'] = result['related_category_id']
            if result['series_name']:
                category_dict['series'] = [{'name': result['series_name'],
                                            'id':result['series_id']}]
            else:
                category_dict['series'] = []
            series_temp[result['category']] = category_dict['series']
            category_array.append(category_dict)
        else:
            series = series_temp[result['category']]
            flag = True
            for serie in series:
                if result['series_name'] == serie.get('name'):
                    flag = False
                    break
            if flag and result['series_name']:
                series.append({'name': result['series_name'],
                               'id': result['series_id']})
            category_dict['series'] = series

    return category_array


def get_cart_sale_category_items(cid, bagman_customer_id, cat_id):
    sql = '''SELECT temp.num selected_num, item.*, bagmanitem.quantity
            FROM recommendorder_bagmanitem AS bagmanitem
            LEFT JOIN
            recommendorder_item AS item
            ON bagmanitem.item_id=item.id
            LEFT JOIN (SELECT cartitem.item_id, num FROM
                recommendorder_bagmancartitem AS cartitem
                INNER JOIN recommendorder_bagmancart AS cart
                ON cartitem.cart_id=cart.id
                WHERE cart.customer_id=%(customer_id)s
            ) AS temp
            ON temp.item_id=item.id
            WHERE
            bagmanitem.customer_id=%(bagman_customer_id)s
            AND bagmanitem.add_time<=now()
            AND bagmanitem.add_time>=date_trunc('day', now())
            AND item.related_category_id=%(category_id)s;
    '''
    cur = connection.cursor()
    cur.execute(sql, {'customer_id': cid,
                      'category_id': cat_id,
                      'bagman_customer_id': bagman_customer_id})
    results = sql_utils.dictfetchall(cur)
    return results


def get_cart_sale_series_items(sid, bagman_customer_id):

    sql = '''SELECT item.*, bagmanitem.quantity
            FROM recommendorder_bagmanitem AS bagmanitem
            LEFT JOIN
            recommendorder_item AS item
            ON bagmanitem.item_id=item.id
            LEFT JOIN
            recommendorder_series AS series
            ON series.category_id=item.related_category_id
            INNER JOIN
            recommendorder_seriesitem AS seriesitem
            ON seriesitem.series_id = series.id
            AND seriesitem.id=item.series_item_id
            WHERE
            series.id=%(sid)s
            AND bagmanitem.add_time<=now()
            AND bagmanitem.add_time>=date_trunc('day', now())
            AND bagmanitem.customer_id=%(bagman_customer_id)s;
    '''
    cur = connection.cursor()
    cur.execute(sql, {'sid': sid,
                      'bagman_customer_id': bagman_customer_id})
    results = sql_utils.dictfetchall(cur)
    return results


def create_bagman_account(params, operator):
    num = int(params.get('num'))
    dealer_id = int(params.get('dealer_id'))
    start_name = params.get('start_name')
    dealer = Dealer.objects.get(id=dealer_id)
    results = []
    for i in range(num):
        # create salesman
        user = CMUser.objects.create_user(
            '%s%s' % (start_name, str(i)),
            password='123456',
            first_name='%s%s' % (start_name, str(i)))
        user.save()
        salesman = Salesman.objects.create(
            dealer_id=dealer_id,
            name=user.username,
            user=user,
            status=1)
        salesman.save()
        # create customer
        customer_name = '%s车销库存%s' % (dealer.dealer_name, str(i))
        customer = Customer.objects.create(
            dealer_id=dealer_id,
            customer_name=customer_name)
        customer.save()

        group = CustomerGroup.objects.filter(dealer_id=dealer_id)[0]
        group_map = GroupCustomerMap.objects.create(
            group=group,
            dealer=dealer,
            customer=customer)
        group_map.save()
        dealercustomermap = DealerCustomerMap.objects.create(
            dealer=dealer,
            customer=customer,
            status=1,
            operator=operator)
        dealercustomermap.save()
        bcmap = BagmanCustomerMap.objects.create(
            customer=customer,
            salesman=salesman,
            add_time=timezone.now())
        bcmap.save()
        results.append({'customer': customer_name,
                        'salesman': salesman.name})
    return results


def get_bagman_history(user_id, start_name, end_time):
    sql = """SELECT
    customer.customer_name,
    orders.order_time,
    to_char(
        orders.order_time AT TIME ZONE 'Asia/ShangHai',
        'YYYY-MM-DD HH24:MI')
    AS order_time,
    suborder.status,
    suborder.id,
    item.item_name,
    item.unit,
    order_item.unit_price,
    order_item.num,
    order_item.subtotal
    FROM
    recommendorder_bagmancustomerorder AS orders
    LEFT JOIN
    recommendorder_bagmansuborder AS suborder
    ON
    orders.id=suborder.order_id
    LEFT JOIN
    recommendorder_bagmanorderitem AS order_item
    ON
    suborder.id=order_item.suborder_id
    LEFT JOIN
    recommendorder_item AS item
    ON
    order_item.item_id=item.id
    LEFT JOIN
    recommendorder_customer AS customer
    ON customer.id=orders.customer_id
    WHERE
    orders.operator_id=%(user_id)s
    AND
    orders.order_time>=%(start_name)s
    AND
    orders.order_time<=%(end_time)s
    ORDER BY suborder.id"""
    cur = connection.cursor()
    cur.execute(
        sql,
        {'user_id': user_id,
         'start_name': start_name,
         'end_time': end_time})
    orders = sql_utils.dictfetchall(cur)
    temp = {}
    results = []
    for order in orders:
        order_dict = {}
        if order['id'] in temp:
            order_dict = temp[order['id']]
            order_dict['total'] += order['subtotal']
            order_dict['total_num'] += order['num']
            order_dict['order_items'].append({'item': {'item_name': order['item_name'],
                                                       'unit': order['unit'],
                                                       'price': order['unit_price']},
                                              'num': order['num']})

        else:
            order_dict = {'total': order['subtotal'],
                          'total_num': order['num'],
                          'status': order['status'],
                          'order_time': order['order_time'],
                          'customer_name': order['customer_name'],
                          'order_items': [{'item': {'item_name': order['item_name'],
                                                    'unit': order['unit'],
                                                    'price': order['unit_price']},
                                           'num': order['num']}],
                          }
            results.append(order_dict)
            temp[order['id']] = order_dict

    results = sorted(
        results,
        key=lambda dict: dict["order_time"],
        reverse=True)
    return results
