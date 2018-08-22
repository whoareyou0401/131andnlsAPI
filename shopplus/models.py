# -*- coding: utf-8 -*-
from django.db import models
from django.db import connection
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
from django.utils import timezone
from user.models import CMUser
from django.core.cache import cache
from core import sql_utils, choices

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
    address = models.CharField(
    	verbose_name=u'用户收货地址',
    	max_length=512,
    	null=True,
    	blank=True)
    is_active = models.BooleanField(
        verbose_name=u'是否在职',
        default=False)
    app_id = models.IntegerField(
    	verbose_name=u'哪个门店的用户',
    	null=True,
    	blank=True)

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
        related_name='shopboss')
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
    tags = ArrayField(
        models.CharField(
            max_length=56,
            null=True),
        verbose_name=u'标签',
        null=True)
    icon = models.CharField(
    	verbose_name=u'商品首图',
    	max_length=256,
    	null=True,
    	blank=True)
    images = ArrayField(
    	models.CharField(
    		verbose_name=u'单个图片',
    		max_length=256,
    		null=True,
    		blank=True),
    	verbose_name=u'商品的全部图片',
    	null=True,
    	blank=True)
    sold_out = models.DateField(
        verbose_name=u'下架日期',
        auto_now_add=True,
        null=True)
    sale_num = models.IntegerField(
    	verbose_name=u'商品上架数量',
    	null=True,
    	blank=True)
    original_price = models.DecimalField(
        verbose_name=u'原价',
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True)
    uint = models.CharField(
    	verbose_name=u'销售单位',
    	max_length=12,
    	null=True,
    	blank=True)


class MoneyOffCoupons(models.Model):
    store = models.ForeignKey(
		Store,
		verbose_name=u'门店',
		db_index=True)
    money = models.FloatField(
		verbose_name=u'优惠金额')
    off_money = models.FloatField(
		verbose_name=u'达标金额')
    start_date = models.DateField(
        verbose_name=u'开始日期',
        auto_now_add=True,
        null=True)
    finish_date = models.DateField(
        verbose_name=u'结束日期',
        auto_now_add=True,
        null=True)
    inroduce = models.CharField(
	verbose_name=u'约束说明',
	max_length=128,
	null=True,
	blank=True)

class MoneyOffCouponsUserMap(models.Model):
    user = models.ForeignKey(
		User,
		verbose_name=u'用户',
		db_index=True)
    money_off_counpons = models.ForeignKey(
		MoneyOffCoupons,
		verbose_name=u'满减优惠券',
		db_index=True)
    is_used = models.BooleanField(
		verbose_name=u'是否已经使用',
		default=False)


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
    order_address = models.CharField(
    	verbose_name=u'本次订单的收货地址',
    	max_length=512,
    	null=True,
    	blank=True)
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
    money_off_counpons =  models.ForeignKey(
        MoneyOffCoupons,
        verbose_name=u'满减优惠券',
        db_index=True,
        null=True)
    write_off_status = models.BooleanField(
    	verbose_name=u'是否核销',
    	default=False)
    write_off_code = models.CharField(
    	verbose_name=u'核销码',
    	max_length=256,
    	null=True,
    	blank=True)
    

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

