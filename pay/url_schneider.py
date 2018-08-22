# -*- coding: utf-8 -*-
from django.conf.urls import include, url
import schneider

urlpatterns = [
    url(r'^snd_demo$',
            schneider.sndDemo_api),
    url(r'^upload_image$',
            schneider.upload_barcode_img),
    url(r'^detail$',
            schneider.sndDemoDetail_api),
    url(r'^search$',
            schneider.search_api),
]