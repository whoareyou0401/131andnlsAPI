# -*- coding: utf-8 -*-
from django.conf.urls import url
import views

urlpatterns = [
    url(r'^excel$',
        views.upload_file),
    url(r'^integration$',
        views.integration),
    url(r'^new-item-status$',
        views.new_item_view),
    url(r'^item-freezer-map$',
        views.edit_item_freezer_map_view),
    url(r'^realtime-sales$',
        views.realtime_sales_view),
    url(r'^cvs-data$',
        views.cvs_data_view),
    url(r'^cvs-sales$',
        views.cvs_sales_view),
    url(r'^cvs-flexslider$',
        views.cvs_flexslider_view),
    url(r'^new-item-excel$',
        views.upload_new_item_excel_view),
    url(r'^stock-taking$',
        views.stock_taking_view),
    url(r'^goods-self$',
        views.goods_self_view),
]
