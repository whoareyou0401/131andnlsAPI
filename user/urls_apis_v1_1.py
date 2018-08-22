# -*- coding: utf-8 -*-
from django.conf.urls import include, url
import apis_v1_1 as apis
urlpatterns = [
    url(r'^login$',
            apis.login),
]