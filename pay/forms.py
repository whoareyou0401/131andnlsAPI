# -*- coding: utf-8 -*-
from django import forms

class CodeForm(forms.Form):
    code = forms.CharField()
    avatar = forms.CharField(required=False)
    name = forms.CharField(required=False)
    gender = forms.IntegerField(required=False)
    store_id = forms.IntegerField()