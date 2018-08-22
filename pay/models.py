# -*- coding: utf-8 -*-
from django.db import models
from django.db import connection
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
from django.utils import timezone
from user.models import CMUser
from django.core.cache import cache
from core import sql_utils, choices
# from standard.models import StandardStore
import redis
import json
import queries
import operator as op
import pay_util
# client = redis.Redis(
#     host=settings.CM_REDIS_URL,
#     port=settings.CM_REDIS_PORT,
#     db=settings.CM_VENDOR_REIDS_DB)
# pubsub = client.pubsub()
# pubsub.subscribe(['pay_order'])


class Company(models.Model):
    name = models.CharField(
        verbose_name=u'公司名称',
        max_length=56)
    address = models.CharField(
        verbose_name=u'公司地址',
        max_length=256,
        null=True,
        blank=True)
    manager = models.ForeignKey(
        CMUser,
        verbose_name=u'管理者',
        db_index=True,
        null=True,
        blank=True)


class User(models.Model):
    openid = models.CharField(
        max_length=256,
        verbose_name=u'用户在微信的唯一id',
        db_index=True)
    add_time = models.DateTimeField(
        verbose_name=u'创建时间',
        auto_now_add=True,
        null=True,
        blank=True)
    phone = models.CharField(
        verbose_name=u'电话号码',
        max_length=11,
        null=True,
        blank=True)
    nick_name = models.CharField(
        verbose_name=u'微信昵称',
        max_length=30,
        null=True,
        blank=True)
    avatar = models.CharField(
        verbose_name=u'微信头像',
        max_length=256,
        null=True,
        blank=True)
    gender = models.IntegerField(
        verbose_name=u'性别',
        choices=choices.GENDER_CHOICES,
        null=True)
    name = models.CharField(
        verbose_name=u'真实名称',
        max_length=56,
        null=True,
        blank=True)
    company = models.ForeignKey(
        Company,
        verbose_name=u'公司',
        db_index=True,
        null=True,
        blank=True)
    is_active = models.BooleanField(
        verbose_name=u'是否在职',
        default=False)

    class Meta:
        verbose_name = u"用户"
        verbose_name_plural = u'用户'

    def __unicode__(self):
        return self.nick_name


class Store(models.Model):
    boss = models.OneToOneField(
        CMUser,
        verbose_name=u'店老板',
        db_index=True,
        related_name='boss')
    name = models.CharField(
        verbose_name=u'门店名称',
        max_length=255,
        null=True)
    address = models.CharField(
        verbose_name=u'门店地址',
        max_length=255,
        null=True)
    lng = models.DecimalField(
        verbose_name=u'门店经度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    lat = models.DecimalField(
        verbose_name=u'门店纬度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)
    phone_number = models.CharField(
        verbose_name=u'联系方式',
        max_length=20,
        null=True)
    pay_id = models.CharField(
        verbose_name=u'微信收款ID',
        max_length=256,
        null=True,
        db_index=True)
    pay_image = models.CharField(
        verbose_name=u'收款码链接',
        max_length=512,
        null=True)


class Cashier(models.Model):
    user = models.OneToOneField(
        User,
        verbose_name=u'用户',
        db_index=True)
    store = models.ForeignKey(
        Store,
        verbose_name=u'所属门店',
        db_index=True)
    code = models.CharField(
        verbose_name=u'收银员编号',
        max_length=256,
        null=True,
        blank=True)


class Item(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    name = models.CharField(
        verbose_name=u'商品名称',
        max_length=100)
    barcode = models.CharField(
        verbose_name=u'条码',
        max_length=20,
        null=True,
        blank=True)
    price = models.DecimalField(
        verbose_name=u'零售价',
        max_digits=18,
        decimal_places=2,
        db_index=True,
        null=True)
    purchase_price = models.DecimalField(
        verbose_name=u'进货价',
        max_digits=18,
        decimal_places=2,
        db_index=True,
        null=True)
    inventory = models.IntegerField(
        verbose_name=u'库存',
        null=True,
        blank=True)
    add_time = models.DateTimeField(
        verbose_name=u'创建时间',
        auto_now_add=True,
        null=True,
        blank=True)
    standard_item_id = models.IntegerField(
        verbose_name=u'标准商品ID',
        null=True,
        db_index=True)
    produced_time = models.DateField(
        verbose_name=u'生产日期',
        auto_now_add=True,
        null=True)
    best_before_date = models.IntegerField(
        verbose_name=u'保质期(单位:天)',
        null=True,
        db_index=True)
    critical_age = models.IntegerField(
        verbose_name=u'临界期',
        null=True)


class Order(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    user = models.ForeignKey(
        User,
        verbose_name=u'用户',
        db_index=True)
    order_time = models.DateTimeField(
        verbose_name=u'购买时间',
        auto_now_add=True,
        db_index=True)
    status = models.IntegerField(
        verbose_name=u'支付状态',
        choices=choices.PAY_STATUS,
        default=0)
    pay_way = models.IntegerField(
        verbose_name=u'支付方式',
        default=1,
        choices=choices.PAY_WAYS,
        null=True)
    out_trade_no = models.CharField(
        verbose_name=u'微信下单ID',
        max_length=256,
        db_index=True,
        null=True,
        default='integral')


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        verbose_name=u'订单',
        db_index=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'购买的商品')
    num = models.IntegerField(
        verbose_name=u'数量')
    subtotal = models.DecimalField(
        verbose_name=u'总价',
        max_digits=18,
        decimal_places=4,
        db_index=True)


class Cart(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    user = models.OneToOneField(
        User,
        verbose_name=u'用户',
        db_index=True)

    def get_cart_items(self):
        result = []
        with connection.cursor() as cursor:
            cursor.execute(
                queries.CART_ITEMS_SQL,
                [self.user_id, self.store_id])
            result = sql_utils.dictfetchall(cursor)
        return sorted(result, key=op.itemgetter('add_time'),
                      reverse=True)

    def order(self):

        order_time = timezone.now()
        cart_items = self.get_cart_items()
        sid = int(cache.get(self.user.openid))
        order = Order(
            order_time=order_time,
            user=self.user,
            store_id=sid)
        order.save()
        order_items = []
        cart_items, amount = pay_util.bundling(cart_items, self.store)
        for cart_item in cart_items:
            items = {}
            _item_id = cart_item.get('item_id')
            _price = float(cart_item.get('price'))
            _num = int(cart_item.get('num'))
            items['item_id'] = _item_id
            items['num'] = _num
            _order_item = OrderItem(
                num=_num,
                item_id=_item_id,
                subtotal=float(
                    _price) * float(_num),
                order=order)
            _order_item.save()
            order_items.append(items)
        if hasattr(self.user, 'userstoremap_set'):
            usmap = self.user.userstoremap_set.get(store_id=self.store_id)
            if usmap.residual_amount >= amount * 100:
                usmap.residual_amount -= amount * 100
                usmap.save()
                self.clean()
                order.status = 1
                # 支付方式（积分）
                order.pay_way = 0
                order.save()
                # client.publish('pay_order', json.dumps({
                #         'items': order_items,
                #         'amount': amount}))
                return {'id': order.id, 'items': order_items, 'is_success': 1}
            else:
                return {'id': order.id, 'items': order_items, 'is_success': 0}
        else:
            return {'id': order.id, 'items': order_items, 'is_success': 0}
            self.cartitem_set.get(id=cart_item.get('id')).delete()
        return {'id': order.id, 'items': order_items}

    def clean(self):
        self.cartitem_set.all().delete()


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        verbose_name=u'购物车',
        db_index=True,
        null=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        null=True,
        db_index=True)
    num = models.DecimalField(
        verbose_name=u'数量',
        max_digits=18,
        decimal_places=4,
        default=0,
        db_index=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class UserStoreMap(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    user = models.ForeignKey(
        User,
        verbose_name=u'用户',
        db_index=True)
    residual_amount = models.FloatField(
        verbose_name=u'账户余额',
        null=True,
        blank=True)


class RechargeLog(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name=u'用户',
        db_index=True)
    integral = models.FloatField(
        verbose_name=u'充值积分数',
        null=True,
        blank=True)
    time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True,
        null=True,
        blank=True)


class PurchaseRecords(models.Model):
    operator = models.ForeignKey(
        CMUser,
        verbose_name=u'操作员',
        db_index=True)
    store = models.ForeignKey(
        Store,
        verbose_name=u'店铺',
        db_index=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        null=True)
    num = models.IntegerField(
        verbose_name=u'进货数量')
    price = models.DecimalField(
        verbose_name=u'进货价',
        max_digits=18,
        decimal_places=2,
        db_index=True)
    retail_price = models.DecimalField(
        verbose_name=u'零售价',
        max_digits=18,
        decimal_places=2,
        db_index=True)
    time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True,
        null=True,
        blank=True)


class StoreGoodsFlow(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    time = models.DateTimeField(
        verbose_name=u'发生时间',
        auto_now_add=True,
        db_index=True)
    status = models.IntegerField(
        verbose_name=u'支付状态',
        choices=choices.PAY_STATUS,
        default=0)


class StoreGoodsFlowItem(models.Model):
    goods_flow = models.ForeignKey(
        StoreGoodsFlow,
        verbose_name=u'订单',
        db_index=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'购买的商品')
    num = models.IntegerField(
        verbose_name=u'数量')
    subtotal = models.DecimalField(
        verbose_name=u'总价',
        max_digits=18,
        decimal_places=4,
        db_index=True)


class StoreCart(models.Model):
    store = models.OneToOneField(
        Store,
        verbose_name=u'门店',
        null=True)

    def get_cart_items(self):
        result = []
        with connection.cursor() as cursor:
            cursor.execute(queries.STORE_CART_ITEMS_SQL, [self.store_id])
            result = sql_utils.dictfetchall(cursor)
        return sorted(result, key=op.itemgetter('add_time'),
                      reverse=True)

    def order(self):

        order_time = timezone.now()
        cart_items = self.get_cart_items()
        goods_flow = StoreGoodsFlow(
            time=order_time,
            store=self.store)
        goods_flow.save()
        goods_flow_items = []
        amount = 0.0
        for cart_item in cart_items:
            items = {}
            _item_id = cart_item.get('item_id')
            _price = float(cart_item.get('price'))
            _num = int(cart_item.get('num'))
            items['item_id'] = _item_id
            items['num'] = _num
            goods_flow_item = StoreGoodsFlowItem(
                num=_num,
                item_id=_item_id,
                subtotal=float(
                    _price) * float(_num), goods_flow=goods_flow)
            goods_flow_item.save()
            amount += goods_flow_item.subtotal
            goods_flow_items.append(items)
        self.clean()
        return {'id': goods_flow.id, 'items': goods_flow_items}

    def clean(self):
        self.storecartitem_set.all().delete()


class StoreCartItem(models.Model):
    cart = models.ForeignKey(
        StoreCart,
        verbose_name=u'购物车',
        db_index=True,
        null=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        null=True,
        db_index=True)
    num = models.DecimalField(
        verbose_name=u'数量',
        max_digits=18,
        decimal_places=4,
        default=0,
        db_index=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class Bundling(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        db_index=True)
    main_item = models.ForeignKey(
        Item,
        verbose_name=u'主品',
        db_index=True,
        related_name='main_item_set')
    bundling_item = models.ForeignKey(
        Item,
        verbose_name=u'绑定品',
        db_index=True,
        related_name='bunding_item_set')
    bundling_num = models.IntegerField(
        verbose_name=u'绑定量')
    bundling_price = models.DecimalField(
        verbose_name=u'绑定品售价',
        max_digits=8,
        decimal_places=2,
        db_index=True)
    status = models.IntegerField(
        verbose_name=u'搭售状态')
    start_time = models.DateTimeField(
        verbose_name=u'开始时间',
        db_index=True)
    end_time = models.DateTimeField(
        verbose_name=u'结束时间',
        db_index=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class BundlingLog(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        db_index=True)
    bundling = models.ForeignKey(
        Bundling,
        verbose_name=u'绑定品记录',
        db_index=True)
    real_sales_num = models.IntegerField(
        verbose_name=u'实际绑定品销量')
    time = models.DateTimeField(
        verbose_name=u'记录时间',
        auto_now_add=True,
        db_index=True)


# class NewItem(models.Model):
#     operator = models.ForeignKey(
#         User,
#         verbose_name=u'操作员',
#         db_index=True)
#     store = models.ForeignKey(
#         StandardStore,
#         verbose_name=u'所在门店',
#         db_index=True)
#     name = models.CharField(
#         verbose_name=u'商品名称',
#         max_length=256,
#         db_index=True,
#         null=True)
#     barcode = models.CharField(
#         verbose_name=u'条码',
#         max_length=20,
#         db_index=True)
#     unit = models.CharField(
#         verbose_name=u'规格',
#         max_length=32)
#     add_time = models.DateTimeField(
#         verbose_name=u'添加时间',
#         auto_now_add=True,
#         db_index=True)
#     status = models.IntegerField(
#         verbose_name=u'审核状态',
#         choices=choices.CVS_NEW_ITEM_STATUS,
#         default=0)
#     brand = models.CharField(
#         verbose_name=u'品牌',
#         max_length=128,
#         null=True,
#         db_index=True)
#     price = models.FloatField(
#         verbose_name=u'价格',
#         null=True)
#     taste = models.CharField(
#         verbose_name=u'口味',
#         max_length=128,
#         null=True)
#     best_before_date = models.IntegerField(
#         verbose_name=u'保质期(单位:天)',
#         null=True,
#         db_index=True)
#     pack = models.CharField(
#         verbose_name=u'包装',
#         max_length=56,
#         null=True,
#         blank=True,
#         db_index=True)
#     update_time = models.DateTimeField(
#         verbose_name=u'更新时间',
#         db_index=True,
#         null=True,
#         blank=True)
#     finish_time = models.DateTimeField(
#         verbose_name=u'审核完成时间',
#         db_index=True,
#         null=True,
#         blank=True)


# class ScanedItemLog(models.Model):
#     standard_item_id = models.IntegerField(
#         verbose_name='标准商品库ID',
#         db_index=True)
#     operator = models.ForeignKey(
#         User,
#         verbose_name=u'操作员',
#         db_index=True)
#     store = models.ForeignKey(
#         StandardStore,
#         verbose_name=u'所在门店',
#         db_index=True)
#     add_time = models.DateTimeField(
#         verbose_name=u'添加时间',
#         auto_now_add=True,
#         db_index=True)


class CVS_Notice(models.Model):
    title = models.CharField(
        verbose_name=u'公告标题',
        max_length=56,
        null=True)
    subtitle = models.CharField(
        verbose_name=u'公告小标题',
        max_length=56,
        null=True)
    rule_title = models.CharField(
        verbose_name=u'规则标题',
        max_length=56,
        null=True)
    rules = ArrayField(
        models.CharField(
            verbose_name=u'单条活动说明',
            max_length=128,
            null=True),
        verbose_name=u'活动说明',
        null=True)


class CVSConfig(models.Model):
    store = models.OneToOneField(
        Store,
        verbose_name=u'门店',
        db_index=True)
    appid = models.CharField(
        verbose_name=u'小程序appid',
        max_length=256)
    secret = models.CharField(
        verbose_name=u'小程序secret',
        max_length=256)
    mch_id = models.CharField(
        verbose_name=u'商户号ID',
        max_length=256,
        null=True,
        blank=True)
    pay_api_key = models.CharField(
        verbose_name=u'支付签名秘钥',
        max_length=256,
        null=True,
        blank=True)


class InventoryTemp(models.Model):
    item = models.OneToOneField(
        Item,
        verbose_name=u'商品',
        db_index=True)
    num = models.IntegerField(
        verbose_name=u'临时库存',
        null=True,
        blank=True)
    status = models.IntegerField(
        verbose_name=u'当前状态',
        choices=choices.INVENTORY_ITEM_STATUS)


# class NewItemRewardLog(models.Model):
#     new_item = models.ForeignKey(
#         NewItem,
#         verbose_name=u'新品',
#         db_index=True)
#     reward = models.IntegerField(
#         verbose_name=u'积分数')
#     user = models.ForeignKey(
#         User,
#         verbose_name=u'用户',
#         db_index=True)
#     operator = models.ForeignKey(
#         CMUser,
#         verbose_name=u'操作员',
#         db_index=True)
#     add_time = models.DateTimeField(
#         verbose_name=u'添加时间',
#         auto_now_add=True,
#         db_index=True)


class StockTaking(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'便利店',
        db_index=True)
    time = models.DateTimeField(
        verbose_name=u'盘点时间',
        db_index=True,
        blank=True,
        null=True)
    status = models.IntegerField(
        verbose_name=u'盘点状态',
        choices=choices.INVENTORY_ITEM_STATUS)
    breakage = models.FloatField(
        verbose_name=u'报损值',
        null=True,
        blank=True)


class SubStockTaking(models.Model):
    operator = models.ForeignKey(
        Cashier,
        verbose_name=u'收银员',
        db_index=True)
    stock_taking = models.ForeignKey(
        StockTaking,
        verbose_name=u'库存盘点',
        db_index=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True)
    num = models.IntegerField(
        verbose_name=u'数量',
        null=True,
        blank=True)


class StoreItemShelf(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'所属门店',
        db_index=True)
    name = models.CharField(
        verbose_name=u'名称',
        max_length=128,
        db_index=True,
        null=True,
        blank=True)
    max_rows = models.IntegerField(
        verbose_name=u'最大行数')
    max_columns = models.IntegerField(
        verbose_name=u'最大列数')


class ItemShelfMap(models.Model):
    shelf = models.ForeignKey(
        StoreItemShelf,
        verbose_name=u'冰箱',
        db_index=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True)
    row = models.IntegerField(
        verbose_name=u'所在行')
    column = models.IntegerField(
        verbose_name=u'所在列')
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class ItemPostionExchangeLog(models.Model):
    item_shelf_map = models.ForeignKey(
        ItemShelfMap,
        verbose_name=u'货架',
        db_index=True,
        null=True,
        blank=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True)
    old_row = models.IntegerField(
        verbose_name=u'所在行')
    old_column = models.IntegerField(
        verbose_name=u'所在列')
    create_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True,
        null=True,
        blank=True)


class TimeFrame(models.Model):
    start_time = models.TimeField(
        verbose_name=u'开始时间')
    end_time = models.TimeField(
        verbose_name=u'结束时间')


class ItemTimeFrameSales(models.Model):
    create_date = models.DateField(
        verbose_name=u'生成日期',
        auto_now_add=True,
        null=True)
    sales_volume = models.IntegerField(
        verbose_name=u'销售量',
        null=True,
        blank=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True,
        null=True,
        blank=True)
    current_ranking = models.IntegerField(
        verbose_name=u'当日排名',
        null=True,
        blank=True)
    time_frame = models.ForeignKey(
        TimeFrame,
        verbose_name=u'时段',
        db_index=True,
        null=True,
        blank=True)


class ItemTimeFrameRebuyPercent(models.Model):
    create_date = models.DateField(
        verbose_name=u'生成日期',
        auto_now_add=True,
        null=True)
    rebuy_percent = models.IntegerField(
        verbose_name=u'复购率',
        null=True,
        blank=True)
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True,
        null=True,
        blank=True)
    current_ranking = models.IntegerField(
        verbose_name=u'当日排名',
        null=True,
        blank=True)


class TimeFrameConsumeCoverage(models.Model):
    time_frame = models.ForeignKey(
        TimeFrame,
        verbose_name=u'时段',
        db_index=True)
    consume_coverage = models.FloatField(
        verbose_name=u'消费人数',
        null=True,
        blank=True)
    add_time = models.DateField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class RecentTopFiveCustomer(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name=u'消费者',
        db_index=True)
    consumption = models.FloatField(
        verbose_name=u'消费金额',
        null=True,
        blank=True)
    ranking = models.IntegerField(
        verbose_name=u'排名')
    add_time = models.DateField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class CMUserToPayUserMap(models.Model):
    user = models.OneToOneField(
        CMUser,
        verbose_name=u'超盟用户',
        db_index=True)
    pay_user = models.OneToOneField(
        User,
        verbose_name=u'微信用户',
        db_index=True)
    add_time = models.DateField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)


class AutoReplenishConf(models.Model):
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True)
    avg = models.FloatField(
        verbose_name=u'日平均销量',
        default=0,
        null=True)
    sale_std = models.FloatField(
        verbose_name=u'日销量标准差',
        default=0,
        null=True)
    unit = models.IntegerField(
        verbose_name=u'箱规')
    min_inventory = models.IntegerField(
        verbose_name=u'最低库存',
        default=6)
    add_time = models.DateField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        db_index=True)
    last_update_date = models.DateField(
        verbose_name=u'最后更新时间',
        auto_now_add=True,
        db_index=True,
        null=True,
        blank=True)
    stock_period = models.IntegerField(
        verbose_name=u'进货周期',
        null=True)


class SwiperConfig(models.Model):
    item = models.ForeignKey(
        Item,
        verbose_name=u'商品',
        db_index=True)
    image = models.CharField(
        verbose_name=u'图片URL',
        max_length=512)
    is_active = models.BooleanField(
        verbose_name=u'是否活跃',
        default=True,
        blank=True)
    add_time = models.DateTimeField(
        verbose_name=u'最后更新时间',
        auto_now_add=True,
        null=True,
        blank=True)
