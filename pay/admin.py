# -*- coding: utf-8 -*-
from django.contrib import admin

import logging
import models


logger = logging.getLogger(__name__)

# Register your models here.


class PayStoreAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'address',
        'phone_number')
    search_fields = ('name', )


class CVSConfigAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'appid',
        'secret',
        'mch_id',
        'pay_api_key')
    list_filter = ('store',)
    search_fileds = ('store',)

admin.site.register(models.Store, PayStoreAdmin)
admin.site.register(models.CVSConfig, CVSConfigAdmin)
