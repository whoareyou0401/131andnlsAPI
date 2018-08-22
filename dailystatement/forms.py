# -*- coding: utf-8 -*-
from django import forms


class AddBrandForm(forms.Form):
    standardName = forms.CharField(label=u'企业标准名称')
    telephone = forms.CharField(label=u'联系电话')
    address = forms.CharField(label=u'地址', required=False)
    username = forms.CharField(label=u'用户名')
    password = forms.CharField(label=u'密码')


class CodeForm(forms.Form):
    code = forms.CharField()


class StatementForm(forms.Form):
    start_stock = forms.CharField(required=False)
    among_stock = forms.CharField(required=False)
    sales = forms.CharField()
    end_stock = forms.CharField(required=False)
    goods_id = forms.CharField(required=False)
    token = forms.CharField()


class GoodListForm(forms.Form):
    token = forms.CharField(required=False)
    group_id = forms.IntegerField()


class TokenForm(forms.Form):
    token = forms.CharField()


class TemplateFieldForm(forms.Form):
    fields = forms.CharField(required=False)
    template_type = forms.CharField()


class SearchForm(forms.Form):
    token = forms.CharField()
    barcode = forms.CharField()