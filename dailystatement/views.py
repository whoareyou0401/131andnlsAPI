# -*- coding: utf-8 -*-
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, FileResponse, HttpResponseRedirect
from django.contrib.admin.views.decorators import staff_member_required
from django.utils import timezone
from .forms import AddBrandForm
import dailystate_util as dsu
from user.models import CMUser
import logging
import json
import models

logger = logging.getLogger(__name__)


# 后台管理获得所有品牌列表
@login_required(login_url='/login/')
def get_brands(request, template='dailystatement_admin.html'):
    brand_list = []
    try:
        brands = models.Brand.objects.all()
        for b in brands:
            brand = model_to_dict(b)
            brand['create_time'] = b.create_time
            brand_list.append(brand)
    except Exception as e:
        logger.error(e)
    return render(request, template, {'brand_list': brand_list})


# 添加品牌
@login_required(login_url='/login/')
def add_brand(request):
    resp = {'success': False}
    form = AddBrandForm(request.POST or None)
    if form.is_valid():
        standardname = form.cleaned_data['standardName']
        telephone = form.cleaned_data['telephone']
        address = form.cleaned_data['address']
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = CMUser.objects.create_user(username, password=password)
        user.save()
        brand = models.Brand.objects.create(
            user=user,
            standard_name=standardname,
            telephone=telephone,
            address=address)
        leader = models.GuideLeader.objects.create(
            name=username,
            phone=telephone,
            brand_id=brand.id)
        resp['success'] = True
    return HttpResponse(json.dumps(resp), content_type="application/json")


@login_required(login_url='/login/')
@dsu.brandor_required
def store_commission(request, template='store-commission.html'):
    return render(request, template)


@login_required(login_url='/login/')
@dsu.brandor_required
def guide_salary(request, template='guide-salary.html'):
    return render(request, template)


# 品牌商上传数据
@login_required(login_url='/login/')
@dsu.brandor_required
def upload(request, template='upload.html'):
    return render(request, template)


# 商品数据管理
@login_required(login_url='/login/')
@dsu.brandor_required
def goods_manage(request, template='goods-manage.html'):
    return render(request, template)


# 导购数据管理
@login_required(login_url='/login/')
@dsu.brandor_required
def guide_manage(request, template='guide-manage.html'):
    return render(request, template)


# 品牌商上传数据
@login_required(login_url='/login/')
@staff_member_required
def upload_rebate(request, template='upload_rebate_file.html'):
    return render(request, template)


# 电视实时显示导购签到情况
@login_required(login_url='/login/')
def guide_checkin_map(request, template='show_guide_checkin.html'):
    return render(request, template)


# 销量统计
@login_required(login_url='/login/')
def sales(request, template='sales.html'):
    return render(request, template)


# 销量明细
@login_required(login_url='/login/')
def sales_detail(request, template='sales-detail.html'):
    return render(request, template)


# 导购管理
@login_required(login_url='/login/')
def guide(request, template='guide.html'):
    return render(request, template)


# 数据管理
@login_required(login_url='/login/')
def goods(request, template='goods.html'):
    return render(request, template)


# 签到管理
@login_required(login_url='/login/')
def checkin(request, template='checkin.html'):
    return render(request, template)

# 即时考勤管理
@login_required(login_url='/login/')
def realtime_checkin(request, template='realtime-checkin.html'):
    return render(request, template)

# 红包活动数据
@login_required(login_url='/login/')
def activity(request, template='activity.html'):
    return render(request, template)


# 门店管理
@login_required(login_url='/login/')
def store(request, template='store.html'):
    return render(request, template)
