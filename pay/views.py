# -*- coding: utf-8 -*-
from django.shortcuts import render
from dailystatement.dailystate_util import brandor_required
from django.contrib.auth.decorators import login_required
import pay_util


@login_required(login_url='/login/')
@pay_util.boss_required
def upload_file(request, template='upload_file.html'):
    return render(request, template)


@login_required(login_url='/login/')
def integration(request, template='integration_management.html'):
    return render(request, template)


@login_required(login_url='/login/')
def new_item_view(request, template='new_item_confirm.html'):
    return render(request, template)


@login_required(login_url='/login/')
def edit_item_freezer_map_view(request, template='edit_item_freezer_map.html'):
    return render(request, template)


@login_required(login_url='/login/')
def realtime_sales_view(request, template='realtime_sales.html'):
    return render(request, template)


@login_required(login_url='/login/')
def cvs_data_view(request, template='cvs_data.html'):
    return render(request, template)


@login_required(login_url='/login/')
def cvs_sales_view(request, template='sales_detail.html'):
    return render(request, template)


@login_required(login_url='/login/')
def cvs_flexslider_view(request, template='cvs_flexslider.html'):
    return render(request, template)


@login_required(login_url='/login/')
def upload_new_item_excel_view(request, template='upload_new_itwm_excel.html'):
    return render(request, template)


@login_required(login_url='/login/')
def stock_taking_view(request, template='stock_taking.html'):
    return render(request, template)

@login_required(login_url='/login/')
def goods_self_view(request, template='goods_shelf.html'):
    return render(request, template)
