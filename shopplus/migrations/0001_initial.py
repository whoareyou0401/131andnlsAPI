# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-06 07:34
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.DecimalField(db_index=True, decimal_places=4, default=0, max_digits=18, verbose_name='\u6570\u91cf')),
                ('add_time', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
                ('cart', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shopplus.Cart', verbose_name='\u8d2d\u7269\u8f66')),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='\u5546\u54c1\u540d\u79f0')),
                ('barcode', models.CharField(blank=True, max_length=20, null=True, verbose_name='\u6761\u7801')),
                ('price', models.DecimalField(db_index=True, decimal_places=2, max_digits=18, null=True, verbose_name='\u96f6\u552e\u4ef7')),
                ('purchase_price', models.DecimalField(db_index=True, decimal_places=2, max_digits=18, null=True, verbose_name='\u8fdb\u8d27\u4ef7')),
                ('inventory', models.IntegerField(blank=True, null=True, verbose_name='\u5e93\u5b58')),
                ('add_time', models.DateTimeField(auto_now_add=True, null=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('standard_item_id', models.IntegerField(db_index=True, null=True, verbose_name='\u6807\u51c6\u5546\u54c1ID')),
                ('produced_time', models.DateField(auto_now_add=True, null=True, verbose_name='\u751f\u4ea7\u65e5\u671f')),
                ('best_before_date', models.IntegerField(db_index=True, null=True, verbose_name='\u4fdd\u8d28\u671f(\u5355\u4f4d:\u5929)')),
                ('critical_age', models.IntegerField(null=True, verbose_name='\u4e34\u754c\u671f')),
                ('tags', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=56, null=True), null=True, size=None, verbose_name='\u6807\u7b7e')),
                ('sold_out', models.DateField(auto_now_add=True, null=True, verbose_name='\u4e0b\u67b6\u65e5\u671f')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_time', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='\u8d2d\u4e70\u65f6\u95f4')),
                ('status', models.IntegerField(choices=[(0, '\u672a\u652f\u4ed8'), (1, '\u652f\u4ed8\u5b8c\u6210')], default=0, verbose_name='\u652f\u4ed8\u72b6\u6001')),
                ('pay_way', models.IntegerField(choices=[(0, '\u79ef\u5206'), (1, '\u73b0\u91d1')], default=1, null=True, verbose_name='\u652f\u4ed8\u65b9\u5f0f')),
                ('out_trade_no', models.CharField(db_index=True, default=b'integral', max_length=256, null=True, verbose_name='\u5fae\u4fe1\u4e0b\u5355ID')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.IntegerField(verbose_name='\u6570\u91cf')),
                ('subtotal', models.DecimalField(db_index=True, decimal_places=4, max_digits=18, verbose_name='\u603b\u4ef7')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shopplus.Item', verbose_name='\u8d2d\u4e70\u7684\u5546\u54c1')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shopplus.Order', verbose_name='\u8ba2\u5355')),
            ],
        ),
        migrations.CreateModel(
            name='Store',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, null=True, verbose_name='\u95e8\u5e97\u540d\u79f0')),
                ('address', models.CharField(max_length=255, null=True, verbose_name='\u95e8\u5e97\u5730\u5740')),
                ('lng', models.DecimalField(blank=True, decimal_places=15, max_digits=20, null=True, verbose_name='\u95e8\u5e97\u7ecf\u5ea6')),
                ('lat', models.DecimalField(blank=True, decimal_places=15, max_digits=20, null=True, verbose_name='\u95e8\u5e97\u7eac\u5ea6')),
                ('add_time', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
                ('phone_number', models.CharField(max_length=20, null=True, verbose_name='\u8054\u7cfb\u65b9\u5f0f')),
                ('pay_id', models.CharField(db_index=True, max_length=256, null=True, verbose_name='\u5fae\u4fe1\u6536\u6b3eID')),
                ('pay_image', models.CharField(max_length=512, null=True, verbose_name='\u6536\u6b3e\u7801\u94fe\u63a5')),
                ('boss', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='shopboss', to=settings.AUTH_USER_MODEL, verbose_name='\u5e97\u8001\u677f')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('openid', models.CharField(db_index=True, max_length=256, verbose_name='\u7528\u6237\u5728\u5fae\u4fe1\u7684\u552f\u4e00id')),
                ('add_time', models.DateTimeField(auto_now_add=True, null=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('phone', models.CharField(blank=True, max_length=11, null=True, verbose_name='\u7535\u8bdd\u53f7\u7801')),
                ('nick_name', models.CharField(blank=True, max_length=30, null=True, verbose_name='\u5fae\u4fe1\u6635\u79f0')),
                ('avatar', models.CharField(blank=True, max_length=256, null=True, verbose_name='\u5fae\u4fe1\u5934\u50cf')),
                ('gender', models.IntegerField(choices=[(0, b'\xe5\xa5\xb3'), (1, b'\xe7\x94\xb7')], null=True, verbose_name='\u6027\u522b')),
                ('name', models.CharField(blank=True, max_length=56, null=True, verbose_name='\u771f\u5b9e\u540d\u79f0')),
                ('address', models.CharField(blank=True, max_length=512, null=True, verbose_name='\u7528\u6237\u6536\u8d27\u5730\u5740')),
                ('is_active', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5728\u804c')),
            ],
            options={
                'verbose_name': '\u7528\u6237',
                'verbose_name_plural': '\u7528\u6237',
            },
        ),
        migrations.AddField(
            model_name='order',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shopplus.Store', verbose_name='\u95e8\u5e97'),
        ),
        migrations.AddField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shopplus.User', verbose_name='\u7528\u6237'),
        ),
        migrations.AddField(
            model_name='item',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shopplus.Store', verbose_name='\u95e8\u5e97'),
        ),
        migrations.AddField(
            model_name='cartitem',
            name='item',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shopplus.Item', verbose_name='\u5546\u54c1'),
        ),
        migrations.AddField(
            model_name='cart',
            name='store',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='shopplus.Store', verbose_name='\u95e8\u5e97'),
        ),
        migrations.AddField(
            model_name='cart',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='shopplus.User', verbose_name='\u7528\u6237'),
        ),
    ]