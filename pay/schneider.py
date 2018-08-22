# -*- coding: utf-8 -*-
from django.http import QueryDict, JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from PIL import Image
from django.db.models import Q
from django.core.cache import cache
from django.shortcuts import render
from django.conf import settings
from dailystatement.dailystate_util import brandor_required
from utils import decorators
import json
import boto
import requests
import StringIO
import uuid
import sys
import time
import os
import pay_util
import models

src='http://share-msg.oss-cn-shanghai.aliyuncs.com/Smr.png'

@csrf_exempt
@decorators.standard_api(methods=('POST', 'GET', 'PUT'))
def sndDemo_api(request):
    params = QueryDict(request.body)

    def post():
        print params
        name = params.get('name')
        unit = params.get('unit')
        barcode = params.get('barcode')
        price = float(params.get('purchase_price'))
        retail_price = float(params.get('price'))
        inventory = int(params.get('inventory'))
        inner_id = params.get('inner_id')
        category = params.get('category')
        demo = models.SndDemo.objects.get_or_create(
            name=name,
            barcode=barcode,
            price=price,
            retail_price=retail_price,
            inner_id=inner_id,
            category=category,
            inventory=inventory,
            unit=unit)[0]
        demo.save()
        return {'data': demo.id}

    def get():
        demos = models.SndDemo.objects.all()
        results = []
        for demo in demos:
            demo = model_to_dict(demo)
            demo['image'] = src
            if demo['images'] and len(demo['images']) > 0:
                demo['image'] = demo['images'][0]
            results.append(demo)
        return {'data': results}

    def put():
        mid = params.get('mid')
        num = int(params.get('num'))
        models.SndDemo.objects.filter(id=int(mid)).update(inventory=num)

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('POST', 'GET'))
def sndDemoDetail_api(request):
    def get():
        params = request.GET
        mid = int(params.get('mid'))
        demo = models.SndDemo.objects.get(id=mid)
        demo = model_to_dict(demo)
        demo['src'] = src
        if demo['images'] and len(demo['images']) > 0:
            demo['src'] = demo['images'][0]
            demo['images'] = demo['images'][1:]
        return {'data': demo}

    return locals()[request.method.lower()]()


@decorators.standard_api(methods=('POST', 'GET'))
def search_api(request):
    def get():
        params = request.GET
        word = params.get('word')
        qset = (
            Q(barcode__contains=word) |
            Q(name__contains=word) |
            Q(inner_id__contains=word))
        demos = models.SndDemo.objects.filter(qset)
        results = []
        for demo in demos:
            demo = model_to_dict(demo)
            demo['image'] = src
            if demo['images'] and len(demo['images']) > 0:
                demo['image'] = demo['images'][0]
            results.append(demo)
        return {'data': results}

    return locals()[request.method.lower()]()


@csrf_exempt
def upload_barcode_img(request):
    params = request.POST
    file = request.FILES.get('img_file')
    uid = uuid.uuid4()
    dest = "./%s.jpg" % uid
    if os.path.exists(dest):
        os.remove(dest)
    with open(dest, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        destination.close()
    demo = models.SndDemo.objects.get(id=int(params.get('sid')))
    conn = boto.connect_s3(
        settings.AWS_ACCESS_KEY_ID,
        settings.AWS_SECRET_ACCESS_KEY,
        host=settings.AWS_S3_HOST)
    bucket = conn.get_bucket('pay-qrcode')
    output = StringIO.StringIO()
    image = Image.open(dest)
    out = image.resize((260, 260), Image.ANTIALIAS)
    out.save(output, 'JPEG')
    output.seek(0)
    img_name = 'snd_demo/%s.jpg' % uid
    k = boto.s3.key.Key(bucket)
    k.key = img_name
    k.set_contents_from_file(output, policy="public-read")

    # item.image = img_name
    url = 'https://s3.cn-north-1.amazonaws.com.cn/pay-qrcode/%s' % (img_name)
    images = demo.images
    if not demo.images:
        demo.images = [url]
    else:
        demo.images.append(url)

    demo.save()
    if os.path.exists(dest):
        os.remove(dest)
    return HttpResponse(
        json.dumps({'code':0, 'data':'ok'}),
        content_type="application/json")

