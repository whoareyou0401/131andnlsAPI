# -*- coding: utf-8 -*-
from django.conf.urls import url
import apis_v1_1 as apis

urlpatterns = [
    url(r'^upload-receipts$',
        apis.upload_store_receipts_api),
    url(r'^store$',
        apis.store_api),
    url(r'^except$',
        apis.except_api),
    url(r'^realtime-ckeckin-exceptions$',
        apis.realtime_checkin_exceptions_api),
    url(r'^login$',
        apis.token),
]
