# -*- coding: utf-8 -*-
from django.conf.urls import url
import apis_v1_2 as apis

urlpatterns = [
    url(r'^sales-profile$',
        apis.SalesProfileApi.as_view()),
    url(r'^sales-profile-excel$',
        apis.SalesProfileExcelApi.as_view()),
    url(r'^new-item-excel$',
        apis.NewItemMessageApi.as_view()),
    url(r'^wx-account$',
        apis.WeixinPayAccountApi.as_view()),
    url(r'^active-swiper$',
        apis.ActiveConfigApi.as_view()),
    url(r'^staff-avg$',
        apis.IntegrationAvgApi.as_view()),
]
