#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import AbstractUser
from core import choices


class CMUser(AbstractUser):
    phone = models.CharField(verbose_name=u'Phone number', max_length=14, blank=True, unique=True, null=True)
    chinese_name = models.CharField(verbose_name=u'汉语名字', unique=True, max_length=100, blank=True, null=True)
    passwd_dealer = models.CharField(verbose_name=u'经销商密码', max_length = 100, blank=True, null=True)
    user_type = models.CharField(verbose_name=u'用户类型', max_length=100, null=True, default='store', choices=choices.USER_TYPE)
    # is_authenticated = models.BooleanField(default=True)

    # def is_authenticated(self):
    #     return True


class CMUserOfWeixin(models.Model):
    user = models.OneToOneField(CMUser, verbose_name=u'与CMUser关联')
    openid = models.CharField(verbose_name=u'用户在微信的唯一id', max_length = 100)
    nickname = models.CharField(verbose_name=u'微信昵称', max_length = 30)
    sex = models.IntegerField(verbose_name=u'性别', choices=choices.GENDER_CHOICES)
    province = models.CharField(verbose_name=u'省份', max_length=20)
    country = models.CharField(verbose_name=u'国家', max_length=30)
    head_img_url = models.CharField(verbose_name=u'头像的URL', max_length=200)
    privilege = models.CharField(verbose_name=u'用户特权信息', max_length=200, null=True)
    union_id = models.CharField(verbose_name=u'UNION ID', max_length=200, null=True)


class CMUserOfQQ(models.Model):
    user = models.OneToOneField(CMUser, verbose_name=u'与CMUser关联')
    openid = models.CharField(verbose_name=u'用户在QQ的唯一id', max_length = 100)
    nickname = models.CharField(verbose_name=u'QQ空间昵称', max_length = 30)
    gender = models.IntegerField(verbose_name=u'性别', choices=choices.GENDER_CHOICES)
    figureurl_qq_1  = models.CharField(verbose_name=u'普通头像URL', max_length=200)
    figureurl_qq_2  = models.CharField(verbose_name=u'高清头像URL', max_length=200, null=True)


class ExperienceLog(models.Model):
    phone = models.CharField(verbose_name=u'Experiencer phone',
                                max_length=14,
                                db_index=True)
    time = models.DateTimeField(verbose_name=u'Experience time',
                                null=True,
                                auto_now_add=True,
                                db_index=True)
    experience_type = models.CharField(verbose_name=u'Experiencer type',
                                max_length=14,
                                db_index=True,
                                choices=choices.EXPERIENCE_TYPE)

