# -*- coding: utf-8 -*-
from django.http import QueryDict, HttpResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.conf import settings
from django.db import connection
from django.contrib.admin.views.decorators import staff_member_required
from utils import decorators
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from utils import recommendorder_utils
# from standard.models import StandardStore
# from std_libs.publisher import Publisher
from core import sql_utils
import sqlalchemy
import pandas
import StringIO
from xlwt import *
import json
import pay_util
import models
# publisher = Publisher(topic_test_prefix_enabled=False)
REWARD_INTEGRATION = 150


@csrf_exempt
@decorators.standard_api(methods=('GET'))
@pay_util.token_authentication
def verification_api(request):

    def get():
        params = request.GET
        user = pay_util.request_user(request)
        barcode = params.get('barcode')
        store_id = int(params.get('store_id'))
        store_name = params.get('store_name')
        lat = float(params.get('lat'))
        lng = float(params.get('lng'))
        location = str(lng) + ',' + str(lat)
        gd_address, adcode = recommendorder_utils.location_to_addrr(location)
        if store_id == -1:
            store = StandardStore.objects.create(
                source=1,
                name=store_name,
                lat=lat,
                lng=lng,
                address=gd_address)
            store.save()
            store_id = store.id

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
        if results.empty:
            item_count = models.NewItem.objects.filter(barcode=barcode).count()
            if item_count == 0:
                new_item = models.NewItem.objects.create(
                    operator=user,
                    store_id=store_id,
                    barcode=barcode)
                new_item.save()
                return {'code': 0, 'data': store_id}
            else:
                return {'code': 1, 'data': store_id}
        else:
            item_dict = {}
            for item in results.itertuples():
                item_dict['id'] = item[1]
                item_dict['name'] = item[2]
            log = models.ScanedItemLog.objects.create(
                standard_item_id=item_dict['id'],
                store_id=store_id,
                operator=user)
            log.save()
            return {'code': 1, 'data': store_id}
        item_dict = {}
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET', 'PATCH'))
@pay_util.token_authentication
def new_item_api(request):

    def post():
        user = pay_util.request_user(request)
        params = QueryDict(request.body)
        nid = int(params.get('nid'))
        name = params.get('name')
        brand = params.get('brand')
        unit = params.get('unit')
        taste = params.get('taste')
        price = float(params.get('price'))
        best_before_date = int(params.get('best_before_date'))
        pack = params.get('pack')
        models.NewItem.objects.filter(
            operator=user,
            id=nid).update(
                name=name,
                unit=unit,
                price=price,
                taste=taste,
                brand=brand,
                best_before_date=best_before_date,
                pack=pack,
                update_time=timezone.now())
        new_item = models.NewItem.objects.get(
            operator_id=user.id,
            id=nid)
        # publisher.pub_new_item(
        #     name=name,
        #     spec=unit,
        #     price=price,
        #     taste=taste,
        #     brand=brand,
        #     sources=['40'],
        #     barcodes=[new_item.barcode],
        #     durability=best_before_date,
        #     unit=pack)

    def get():
        user = pay_util.request_user(request)
        new_items = models.NewItem.objects.filter(
            operator=user,
            status=0,
            name=None)
        results = []
        for new_item in new_items:
            results.append(model_to_dict(new_item))
        return {'data': results}

    def patch():
        user = request.user
        params = QueryDict(request.body)
        nid = int(params.get('id'))
        status = int(params.get('status'))
        uid = int(params.get('uid'))
        if status == 1:
            us_map = models.UserStoreMap.objects.get(
                user_id=uid,
                store_id=2)
            us_map.residual_amount += REWARD_INTEGRATION
            us_map.save()
            log = models.NewItemRewardLog.objects.create(
                new_item_id=nid,
                reward=REWARD_INTEGRATION,
                user_id=uid,
                operator_id=user.id)
            log.save()
        else:
            log = models.NewItemRewardLog.objects.create(
                new_item_id=nid,
                reward=0,
                user_id=uid,
                operator_id=user.id)
            log.save()
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@pay_util.token_authentication
def item_search_api(request):

    def get():
        user = pay_util.request_user(request)
        params = request.GET
        barcode = params.get('barcode')
        search_type = params.get('type')
        if search_type == 'like':
            new_items = models.NewItem.objects.filter(
                operator=user,
                status=0,
                barcode__contains=barcode)
        elif search_type == 'equal':
            item = models.NewItem.objects.get(
                operator=user,
                status=0,
                barcode=barcode)
            temp = model_to_dict(item)
            if not temp['name']:
                temp['name'] = ''
            if not temp['unit']:
                temp['unit'] = ''
            if not temp['price']:
                temp['price'] = ''
            if not temp['brand']:
                temp['brand'] = ''
            if not temp['taste']:
                temp['taste'] = ''
            return {'data': temp}
        results = []
        for new_item in new_items:
            results.append(model_to_dict(new_item))
        return {'data': results}
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET'))
def store_api(request):
    def get():
        params = request.GET
        lat = float(params.get('lat'))
        lng = float(params.get('lng'))
        nearby_search_range = recommendorder_utils.distance_to_location(
            lng,
            lat,
            settings.CM_DISCOVER_CHECKIN_SEARCH_RADIUS)
        stores = StandardStore.objects.filter(
            lat__lte=nearby_search_range[3],
            lat__gte=nearby_search_range[2],
            lng__lte=nearby_search_range[1],
            lng__gte=nearby_search_range[0])
        results = {}
        stores_name = []
        for store in stores:
            temp = model_to_dict(store)
            results[temp['name']] = temp['id']
            stores_name.append(temp['name'])
        return {'data': {'stores': results, 'names': stores_name}}
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@pay_util.token_authentication
def ring_percent_api(request):

    def get():
        user = pay_util.request_user(request)
        result = pay_util.get_order_data(user, True, True)
        return {'data': result}
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@pay_util.token_authentication
def item_status_api(request):

    def get():
        user = pay_util.request_user(request)
        items = models.NewItem.objects.filter(
            operator=user).order_by('-add_time')
        results = []
        status_map = {0: u'待审核',
                      1: u'已通过',
                      2: u'已被拒'}
        for item in items:
            temp = model_to_dict(item)
            temp['status'] = status_map[temp['status']]
            if not temp['name']:
                temp['name'] = u'信息不全'
            results.append(temp)
        return {'data': results}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@pay_util.token_authentication
def cvs_ranking_api(request):

    def get():
        user = pay_util.request_user(request)
        result = pay_util.get_order_data(user, True, True)
        user_rankings = pay_util.get_order_user_data()
        return {'data': dict(result, **user_rankings)}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET'))
def notice_api(request):

    def get():
        notice = models.CVS_Notice.objects.all()[0]
        return {'data': model_to_dict(notice)}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@pay_util.token_authentication
@pay_util.cashier_required
def inventory_api(request):

    def get():
        params = request.GET
        user = pay_util.request_user(request)
        barcode = params.get('barcode')
        store = user.cashier.store
        item = models.Item.objects.get(
            store=store,
            barcode=barcode)
        result = model_to_dict(item)
        result['temp_inventory'] = 0
        if hasattr(item, 'inventorytemp') and item.inventorytemp.status == 1:
            result['temp_inventory'] = item.inventorytemp.num
        else:
            temp_inventory = models.InventoryTemp.objects.create(
                item=item,
                num=0,
                status=1)
            temp_inventory.save()
        return {'data': result}

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST'))
@pay_util.token_authentication
@pay_util.cashier_required
def finish_api(request):

    def post():
        user = pay_util.request_user(request)
        store = user.cashier.store
        temps = models.InventoryTemp.objects.filter(
            item__store_id=store.id,
            status=1)
        for temp in temps:
            item = temp.item
            item.inventory = temp.num
            item.save()
            temp.status = 0
            temp.save()

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET'))
@pay_util.token_authentication
def user_api(request):

    def get():
        user = pay_util.request_user(request)
        companies = models.Company.objects.all()
        results = []
        name_map = {}
        user_msg = model_to_dict(user)
        if user.company:
            user_msg['company'] = user.company.name
        for company in companies:
            temp = model_to_dict(company)
            name_map[temp['name']] = temp['id']
            results.append(temp['name'])
        results.append(u'其他')
        return {'data': {'companies': results,
                         'name_map': name_map,
                         'user': user_msg
                         }
                }

    def post():
        params = QueryDict(request.body)
        name = params.get('name')
        cid = int(params.get('cid'))
        user = pay_util.request_user(request)
        user.name = name
        user.company_id = cid
        user.is_active = True
        user.save()

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@staff_member_required
@pay_util.manager_required
@decorators.standard_api(methods=('POST', 'GET', 'DELETE'))
def staff_api(request):

    def get():
        user = request.user
        company = models.Company.objects.get(manager=user)
        results = pay_util.get_users_integration(company)
        return {'data': results}

    def post():
        params = QueryDict(request.body)
        datas = json.loads(params.get('data'))
        for data in datas:
            integration = int(data['integration']) if data['integration'] else 0
            models.UserStoreMap.objects.filter(
                user_id=data['id']).update(
                    residual_amount=integration)
            log = models.RechargeLog.objects.create(
                user_id=data['id'],
                integral=integration)
            log.save()
        user = request.user
        company = models.Company.objects.get(manager=user)
        results = pay_util.get_users_integration(company)
        return {'data': results}

    def delete():
        user = request.user
        company = models.Company.objects.get(manager=user)
        params = QueryDict(request.body)
        uid = int(params.get('uid'))
        models.User.objects.filter(
            id=uid,
            company_id=company.id).update(is_active=False)
        models.UserStoreMap.objects.filter(user_id=uid).update(residual_amount=0)
        results = pay_util.get_users_integration(company)
        return {'data': results}

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@staff_member_required
@pay_util.manager_required
@decorators.standard_api(methods=('POST', 'GET'))
def staff_search_api(request):

    def get():
        user = request.user
        company = models.Company.objects.get(manager=user)
        word = request.GET.get('word')
        results = pay_util.search_users_integration(company, word)
        return {'data': results}

    return locals()[request.method.lower()]()


@login_required(login_url='/login/')
@staff_member_required
@pay_util.manager_required
@decorators.standard_api(methods=('POST', 'GET'))
def new_item_log_api(request):

    def get():
        user = request.user
        company = models.Company.objects.get(manager=user)
        current_page = request.GET.get('page')
        results = pay_util.get_new_item_status(company, 1)
        page_count = len(results) / 15
        paginator = pay_util.CustomPaginator(
            current_page,
            page_count,
            results,
            15)
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
                'datas': paginator.object_list,
                'pages': range(1, page_count+1)}
                }

    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET'))
@pay_util.token_authentication
def new_item_search_api(request):

    def get():
        params = request.GET
        user = request.user
        company = models.Company.objects.get(manager=user)
        word = params.get('word')
        search_type = params.get('search_type')
        results = []
        results = pay_util.search_new_item_status(
            company=company,
            status=1,
            search_type=search_type,
            word=word)
        page_count = len(results) / 15

        return {'data': {
                'datas': results,
                'pages': range(1, page_count+1)}
                }
    return locals()[request.method.lower()]()


@csrf_exempt
@decorators.standard_api(methods=('GET', 'POST'))
@pay_util.token_authentication
@pay_util.cashier_required
def mobile_stock_taking_api(request):

    def get():
        params = request.GET
        barcode = params.get('barcode')
        user = pay_util.request_user(request)
        cashier = user.cashier
        item = models.Item.objects.get(
            barcode=barcode,
            store=cashier.store)
        return {'data': model_to_dict(item)}

    def post():
        params = QueryDict(request.body)
        item_id = int(params.get('id'))
        num = int(params.get('num'))
        user = pay_util.request_user(request)
        cashier = user.cashier
        stock_taking = models.StockTaking.objects.get_or_create(
            store=cashier.store,
            status=1)[0]
        stock_taking.save()
        sub_stock_taking = models.SubStockTaking.objects.create(
            operator=cashier,
            stock_taking=stock_taking,
            item_id=item_id,
            num=num)
        sub_stock_taking.save()

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('POST'))
@pay_util.boss_required
def goods_shelf_size_api(request):

    def post():
        params = QueryDict(request.body)
        user = request.user
        store = models.Store.objects.get(boss=user)
        max_columns = int(params.get('max_columns'))
        max_rows = int(params.get('max_rows'))
        name = params.get('name')
        shelf = models.StoreItemShelf.objects.get_or_create(
            store=store,
            name=name,
            max_rows=max_rows,
            max_columns=max_columns)[0]
        shelf.save()

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET', 'POST', 'PUT'))
@pay_util.boss_required
def goods_shelf_map_api(request):

    def post():
        params = QueryDict(request.body)
        user = request.user
        store = models.Store.objects.get(boss=user)
        barcode = int(params.get('barcode'))
        row = params.get('row')
        column = params.get('column')
        sid = int(params.get('sid'))
        item_shelf = models.StoreItemShelf.objects.get(pk=sid)
        item = models.Item.objects.get(barcode=barcode)
        shelf_map, created = models.ItemShelfMap.objects.get_or_create(
            shelf=item_shelf,
            item=item,
            row=row,
            column=column)
        if created:
            log = models.ItemPostionExchangeLog.objects.create(
                item=item,
                old_row=row,
                old_column=column,
                item_shelf_map=shelf_map)
            log.save()
        shelf_map.save()

    def get():
        user = request.user
        store = models.Store.objects.get(boss=user)
        results = pay_util.get_shelf_item_sales(store)
        return {'data': results}

    def put():
        params = QueryDict(request.body)
        barcode = int(params.get('barcode'))
        row = params.get('row')
        column = params.get('column')
        sid = int(params.get('sid'))
        mid = int(params.get('mid'))
        item_shelf = models.StoreItemShelf.objects.get(pk=sid)
        item = models.Item.objects.get(barcode=barcode)
        old_map = models.ItemShelfMap.objects.filter(
            column=column,
            row=row,
            shelf=item_shelf)
        if old_map.count() > 0:
            old_map.update(
                shelf=item_shelf,
                item=item,
                row=row,
                column=column,
                add_time=timezone.now())
            log = models.ItemPostionExchangeLog.objects.create(
                item_shelf_map_id=mid,
                item=item,
                old_row=old_map.row,
                old_column=old_map.column)
            log.save()
        else:
            shelf_map = models.ItemShelfMap.objects.create(
                shelf=item_shelf,
                item=item,
                row=row,
                column=column)
            shelf_map.save()
    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
@pay_util.boss_required
def item_shelf_sales_api(request):

    def get():
        params = request.GET
        user = request.user
        store = models.Store.objects.get(boss=user)
        item_id = int(params.get('item_id'))
        shelf_id = params.get('shelf_id')
        logs = models.ItemPostionExchangeLog.objects.filter(
            shelf_id=shelf_id,
            item_id=item_id)
        logs = logs[-5:]
        log_count = logs.count()
        results = []
        rebuy_start = timezone.now() - datetime.timedelta(15)
        rebuy_percent = pay_util.item_rebuy_percent(
            item_id,
            store.id,
            rebuy_start,
            timezone.now())

        for i in range(log_count):
            if i == log_count:
                start_time = logs[i].create_time
                end_time = timezone.now()
            else:
                start_time = logs[i].create_time
                end_time = logs[i+1].create_time

            sql = """
                SELECT
                    receipt_item_id as item_id,
                    max(item_name) as name,
                    sum(quantity) as sales,
                    (max(price) - max(purchase_price)) as profit,
                    wx_saletime
                FROM
                    cm_cvs_goodsflow
                WHERE
                    receipt_item_id='{item_id}'
                AND
                    wx_store_id='{store_id}'
                AND
                    wx_saletime>={start_time}
                AND
                    wx_saletime<={end_time}
                GROUP BY
                    receipt_item_id;
            """.format(store_id=store.id,
                       start_time=start_time,
                       end_time=end_time,
                       item_id=item_id)
            cur = connection.cursor()
            cur.execute(sql)
            shelf_results = sql_utils.dictfetchall(cur)
            shelf_result = shelf_results[0]
            time_space = float((end_time - start_time).days)
            shelf_result['row'] = logs[0].row
            shelf_result['column'] = logs[0].column
            shelf_result['sales'] = float('%.2f' % (shelf_result['sales'] / time_space))
            results.append(shelf_result)
        results = sorted(results, key=lambda dic: dic['wx_saletime'])
        return {'data': {'sales': results, 'rebuy_percent': rebuy_percent}}

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
@pay_util.boss_required
def item_shelf_rebuy_api(request):

    def get():
        params = request.GET
        user = request.user
        store = models.Store.objects.get(boss=user)
        item_id = int(params.get('item_id'))
        start_time = params.get('start_time')
        end_time = params.get('end_time')
        rebuy_percent = pay_util.item_rebuy_percent(
            item_id,
            store.id,
            start_time,
            end_time)
        data = {'item_id': item_id,
                'rebuy_percent': rebuy_percent}
        return {'data': data}

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('GET'))
@pay_util.boss_required
def rebuy_percent_ranking_api(request):

    def get():
        params = request.GET
        user = request.user
        store = models.Store.objects.get(boss=user)
        start_time = params.get('start_time')
        end_time = params.get('end_time')
        res = pay_util.rebuy_percent_sort(store.id, start_time, end_time)
        if params.get('data_type') == 'json':
            return {'data': res}
        elif params.get('data_type') == 'excel':
            ws = Workbook(encoding='utf-8')
            w = ws.add_sheet(u"第一页")
            w.write(0, 0, u"商品")
            w.write(0, 1, u"总购买人数")
            w.write(0, 2, u"复购人数")
            w.write(0, 3, u"复购率")
            w.write(0, 4, u"渗透率")
            w.write(0, 5, u"商品ID")
            # 写入数据
            excel_row = 1
            for obj in res:
                w.write(excel_row, 0, obj['name'])
                w.write(excel_row, 1, str(obj['amount']))
                w.write(excel_row, 2, obj['rebuy_amount'])
                w.write(excel_row, 3, obj['percent'])
                w.write(excel_row, 4, obj['permeability'])
                w.write(excel_row, 5, obj['id'])
                excel_row += 1
            sio = StringIO.StringIO()
            ws.save(sio)
            sio.seek(0)
            response = HttpResponse(
                sio.getvalue(),
                content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment; filename=复购率.xls'
            response.write(sio.getvalue())
            return response

    return locals()[request.method.lower()]()


@csrf_exempt
@pay_util.boss_required
@decorators.standard_api(methods=('GET', 'PATCH', 'POST', 'PUT'))
def pc_stock_taking_api(request):
    DOING = 1
    DID = 0

    def get():
        user = request.user
        params = request.GET
        store = models.Store.objects.get(boss=user)
        results = pay_util.get_stocking_peer_item(store, DOING)
        current_page = int(params.get('page'))
        page_count = len(results) / 10
        paginator = pay_util.CustomPaginator(
            current_page,
            page_count,
            results,
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
        if len(results) % 10 > 0 and page_count > 0:
            page_count += 1
        return {'data': {
                'data': paginator.object_list,
                'pages': page_count,
                'count': len(results)}
                }

    def patch():
        user = request.user
        store = models.Store.objects.get(boss=user)
        results = pay_util.get_stocking_items(store, DOING)
        try:
            stocktaking_id = int(results[0]['stocktaking_id'])
        except:
            return {'code': 3, 'data': 'No Item'}
        #将所有的商品相加然后更新库存
        for res in results:
            models.Item.objects.filter(id=res['item_id']).update(
                inventory=res['amount'])
        #状态变为结束0
        models.StockTaking.objects.filter(
            id=stocktaking_id).update(status=DID)
        return {'data': 'ok'}

    def post():
        user = request.user
        store = models.Store.objects.get(boss=user)
        stock = models.StockTaking.objects.get_or_create(store=store, status=1)[0]
        stock.save()
        return {'data': {'sid': stock.id}}

    def put():
        params = QueryDict(request.body)
        sid = int(params.get('sid'))
        num = int(params.get('num'))
        models.SubStockTaking.objects.filter(id=sid).update(
            num=num)
        return {'data': 'ok'}

    return locals()[request.method.lower()]()
