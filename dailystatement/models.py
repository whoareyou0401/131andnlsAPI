# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.postgres.fields import ArrayField
from user.models import CMUser
from core import choices


class Administrator(models.Model):
    user = models.OneToOneField(
        CMUser,
        verbose_name=u'用户')

    class Meta:
        verbose_name = u"管理员"
        verbose_name_plural = u'管理员'

    def __unicode__(self):
        return self.name


class Brand(models.Model):
    user = models.OneToOneField(
        CMUser,
        verbose_name=u'用户')
    standard_name = models.CharField(
        max_length=200,
        verbose_name=u'企业标准名称')
    create_time = models.DateTimeField(
        verbose_name=u'创建时间',
        auto_now_add=True)
    telephone = models.CharField(
        max_length=200,
        verbose_name=u'联系电话',
        null=True)
    address = models.CharField(
        max_length=200,
        verbose_name=u'联系地址',
        null=True)

    class Meta:
        verbose_name = u'品牌'
        verbose_name_plural = u'品牌'

    def __unicode__(self):
        return self.standard_name


class Chain(models.Model):
    name = models.CharField(
        verbose_name=u'连锁名称',
        max_length=255,
        null=True)


class Store(models.Model):
    brand = models.ForeignKey(
        Brand,
        verbose_name=u'品牌',
        null=True)
    store_name = models.CharField(
        verbose_name=u'门店名称',
        max_length=255,
        null=True)
    store_address = models.CharField(
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
    shopkeeper_name = models.CharField(
        verbose_name=u'店主姓名',
        max_length=255,
        null=True)
    shopkeeper_phone_number = models.CharField(
        verbose_name=u'店主联系方式',
        max_length=200,
        null=True)
    create_time = models.DateTimeField(
        verbose_name=u'创建时间',
        auto_now_add=True)
    chain = models.ForeignKey(
        Chain,
        verbose_name=u'连锁名称',
        blank=True,
        null=True)
    number = models.CharField(
        verbose_name=u'门店编号',
        max_length=255,
        null=True)

    class Meta:
        unique_together = (
            ('store_name', 'brand'),)


class GuideLeader(models.Model):
    brand = models.ForeignKey(
        Brand,
        verbose_name=u'品牌商',
        null=True)
    name = models.CharField(
        verbose_name=u'名字',
        max_length=20,
        null=True)
    phone = models.CharField(
        verbose_name=u'手机号',
        max_length=20,
        null=True)
    openid = models.CharField(
        max_length=256,
        verbose_name=u'用户在微信的唯一id',
        null=True,
        db_index=True)


class Guide(models.Model):
    brand = models.ForeignKey(
        Brand,
        verbose_name=u'品牌',
        null=True)
    leader = models.ForeignKey(
        GuideLeader,
        verbose_name=u'直属领导',
        null=True)
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    name = models.CharField(
        max_length=200,
        verbose_name=u'用户名称')
    telephone = models.CharField(
        max_length=200,
        verbose_name=u'联系电话',
        db_index=True)
    staff_number = models.CharField(
        verbose_name=u'员工编号',
        max_length=255,
        null=True)
    status = models.IntegerField(
        verbose_name=u'在岗状态',
        choices=choices.STAFF_STATUS,
        null=True)
    openid = models.CharField(
        max_length=256,
        verbose_name=u'用户在微信的唯一id',
        null=True,
        db_index=True)
    create_time = models.DateTimeField(
        verbose_name=u'创建时间',
        auto_now_add=True)
    update_time = models.DateTimeField(
        verbose_name=u'更新时间',
        auto_now_add=True)
    basic_salary = models.FloatField(
        verbose_name=u'底薪',
        default=0,
        null=True)

    class Meta:
        verbose_name = u"导购员"
        verbose_name_plural = u'导购员'
        unique_together = (
            ('name', 'brand', 'store'),)

    def __unicode__(self):
        return self.name


class Groups(models.Model):
    brand = models.ForeignKey(
        Brand,
        verbose_name=u'品牌',
        null=True)
    name = models.CharField(
        max_length=200,
        verbose_name=u'系列名称')
    group_code = models.CharField(
        max_length=200,
        verbose_name=u'系列编码',
        null=True)

    def __unicode__(self):
        return self.name


class Goods(models.Model):
    groups = models.ForeignKey(
        Groups,
        verbose_name=u'商品分组',
        null=True)
    barcode = models.CharField(
        max_length=200,
        verbose_name=u'商品条码')
    name = models.CharField(
        max_length=200,
        verbose_name=u'商品名称')
    inside_code = models.CharField(
        max_length=200,
        verbose_name=u'商品内码',
        null=True)
    unite = models.CharField(
        max_length=200,
        verbose_name=u'商品规格',
        null=True)
    factory_price = models.FloatField(
        verbose_name=u'出厂价',
        default=0,
        null=True)
    delivery_price = models.FloatField(
        verbose_name=u'供货价',
        default=0,
        null=True)
    price = models.FloatField(
        verbose_name=u'零售价',
        default=0,
        null=True)
    commission = models.FloatField(
        verbose_name=u'提成',
        default=0,
        null=True)
    is_mainline = models.BooleanField(
        verbose_name=u'是否是主线产品',
        default=False)
    category_id = models.IntegerField(
        verbose_name=u'新标准分类ID',
        null=True)
    is_competitive = models.BooleanField(
        verbose_name=u'是否是竞品',
        default=False,
        db_index=True)

    def __unicode__(self):
        return self.name

    class Meta:
        unique_together = (
            ('name', 'groups'),)


class Statement(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        null=True)
    operator = models.ForeignKey(
        Guide,
        verbose_name=u'操作员',
        null=True)
    goods = models.ForeignKey(
        Goods,
        verbose_name=u'商品',
        null=True)
    start = models.IntegerField(
        verbose_name=u'期初库存',
        null=True)
    middle = models.IntegerField(
        verbose_name=u'期间进货',
        null=True)
    sales = models.IntegerField(
        verbose_name=u'销量数据',
        null=True)
    end = models.IntegerField(
        verbose_name=u'期末库存',
        null=True)
    create_time = models.DateTimeField(
        verbose_name=u'创建时间',
        auto_now_add=True)


class Checkin(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购员',
        null=True)
    work_address = models.CharField(
        verbose_name=u'上班签到地址',
        max_length=255,
        null=True)
    work_lng = models.DecimalField(
        verbose_name=u'上班签到经度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    work_lat = models.DecimalField(
        verbose_name=u'上班签到纬度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    work_time = models.DateTimeField(
        verbose_name=u'上班签到时间',
        auto_now_add=True,
        db_index=True)
    worked_address = models.CharField(
        verbose_name=u'下班签到地址',
        max_length=255,
        null=True)
    worked_lng = models.DecimalField(
        verbose_name=u'下班签到经度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    worked_lat = models.DecimalField(
        verbose_name=u'下班签到纬度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    worked_time = models.DateTimeField(
        verbose_name=u'下班签到时间',
        null=True,
        db_index=True)
    phone_model = models.CharField(
        verbose_name=u'手机型号',
        max_length=128,
        null=True)
    phone_platform = models.CharField(
        verbose_name=u'客户端平台',
        max_length=128,
        null=True)
    phone_system = models.CharField(
        verbose_name=u'操作系统版本',
        max_length=128,
        null=True)

    def __unicode__(self):
        return self.guide.name


class RealTimeCheck(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购员',
        null=True)
    address = models.CharField(
        verbose_name=u'实时签到地址',
        max_length=255,
        null=True)
    lng = models.DecimalField(
        verbose_name=u'实时签到经度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    lat = models.DecimalField(
        verbose_name=u'实时签到纬度',
        decimal_places=15,
        max_digits=20,
        blank=True,
        null=True)
    time = models.DateTimeField(
        verbose_name=u'实时签到时间',
        auto_now_add=True)
    phone_model = models.CharField(
        verbose_name=u'手机型号',
        max_length=128,
        null=True)
    phone_platform = models.CharField(
        verbose_name=u'客户端平台',
        max_length=128,
        null=True)
    phone_system = models.CharField(
        verbose_name=u'操作系统版本',
        max_length=128,
        null=True)

    def __unicode__(self):
        return self.guide.name


class AddItemLog(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购员',
        db_index=True)
    goods = models.ForeignKey(
        Goods,
        verbose_name=u'商品',
        db_index=True)
    time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True)


class CompetitiveMap(models.Model):
    brand_goods = models.ForeignKey(
        Goods,
        verbose_name=u'品牌商品',
        related_name='brand_goods',
        db_index=True)
    competitive_goods = models.ForeignKey(
        Goods,
        verbose_name=u'竞品',
        related_name='competitive_goods',
        db_index=True)


class WorkTimeTable(models.Model):
    store = models.ForeignKey(
        Store,
        verbose_name=u'门店',
        db_index=True)
    start_time = models.TimeField(
        verbose_name=u'上班起始时间',
        null=True,
        blank=True)
    spread = models.IntegerField(
        verbose_name=u'上班跨度(分钟)',
        null=True,
        blank=True)
    work_type = models.IntegerField(
        verbose_name=u'排班类型',
        choices=choices.WORK_PLAN_TYPE)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True)


class LeaveType(models.Model):
    leave_type = models.CharField(
        verbose_name=u'请假类',
        max_length=100,
        null=True)
    should_payoff = models.FloatField(
        verbose_name=u'应发工资百分比',
        null=True)


class GuideLeave(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购员',
        db_index=True)
    leave_begin = models.DateField(
        verbose_name=u'请假开始日期',
        blank=True,
        null=True)
    leave_end = models.DateField(
        verbose_name=u'请假结束日期',
        blank=True,
        null=True)
    remark = models.CharField(
        verbose_name=u'请假备注信息',
        max_length=1024,
        null=True,
        blank=True)
    leave_type = models.ForeignKey(
        LeaveType,
        verbose_name=u'请假类型')
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True)


class GuideWorkPlan(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购员',
        db_index=True)
    work_type = models.IntegerField(
        verbose_name=u'工作类型',
        choices=choices.WORK_TYPE,
        null=True)
    date = models.DateField(
        verbose_name=u'计划日期',
        null=True)
    guide_leave = models.ForeignKey(
        GuideLeave,
        verbose_name=u'请假记录',
        null=True)


class ChangePlanLog(models.Model):
    plan = models.ForeignKey(
        GuideWorkPlan,
        verbose_name=u'计划',
        db_index=True,
        null=True)
    new_type = models.IntegerField(
        verbose_name=u'修改后类型',
        choices=choices.WORK_TYPE,
        null=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True)


class ItemRebate(models.Model):
    item = models.OneToOneField(
        Goods,
        verbose_name=u'商品',
        db_index=True)
    rebate = models.FloatField(
        verbose_name=u'返利金额',
        null=True)
    compute_unit = models.CharField(
        verbose_name=u'返利计量单位',
        max_length=168,
        null=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True)


class RebateLog(models.Model):
    item_rebate = models.ForeignKey(
        ItemRebate,
        verbose_name=u'商品返利',
        db_index=True,
        null=True)
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购员',
        db_index=True)
    num = models.IntegerField(
        verbose_name=u'数量',
        null=True)
    store_receipts_url = models.CharField(
        verbose_name=u'小票URL',
        max_length=1024,
        null=True,
        blank=True)
    red_packets = models.CharField(
        verbose_name=u'红包二维码URL',
        max_length=1024,
        null=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True)
    store_receipts = ArrayField(
        models.CharField(
            max_length=256,
            null=True),
        verbose_name=u'多张小票URL',
        null=True)
    qrcode = models.CharField(
        verbose_name=u'二维码',
        max_length=128,
        null=True,
        blank=True)


class CheckinExceptionLog(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购',
        db_index=True)
    checkin = models.ForeignKey(
        Checkin,
        verbose_name=u'签到记录',
        null=True,
        db_index=True,
        blank=True)
    exception_type = models.IntegerField(
        verbose_name=u'异常类型',
        choices=choices.CHECKIN_EXCEPTION_TYPE)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        null=True)
    guide_work_plan = models.ForeignKey(
        GuideWorkPlan,
        verbose_name=u'导购排班',
        db_index=True,
        null=True,
        blank=True)


class RealTimeCheckinExceptionLog(models.Model):
    guide = models.ForeignKey(
        Guide,
        verbose_name=u'导购',
        db_index=True)
    checkin = models.ForeignKey(
        RealTimeCheck,
        verbose_name=u'签到记录',
        null=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        null=True)
    exception_type = models.IntegerField(
        verbose_name=u'异常类型',
        choices=choices.CHECKIN_EXCEPTION_TYPE,
        null=True,
        blank=True)


class RealTimeChackinRules(models.Model):
    times = ArrayField(
        models.TimeField(
            verbose_name=u'单项签到时间'),
        verbose_name=u'即时考勤时间',
        null=True,
        blank=True)
    add_time = models.DateTimeField(
        verbose_name=u'添加时间',
        auto_now_add=True,
        null=True)
    brand = models.OneToOneField(
        Brand,
        verbose_name=u'品牌商',
        db_index=True)


class Config(models.Model):
    brand = models.OneToOneField(
        Brand,
        verbose_name=u'品牌商',
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
