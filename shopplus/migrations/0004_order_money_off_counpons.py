# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-14 07:44
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shopplus', '0003_auto_20180307_0939'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='money_off_counpons',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shopplus.MoneyOffCoupons', verbose_name='\u6ee1\u51cf\u4f18\u60e0\u5238'),
        ),
    ]