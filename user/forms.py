from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.translation import ugettext as _

from .models import *

class CMUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CMUser
        # widgets = {
        #     'tagline': forms.Textarea(attrs = {'cols': 80, 'rows': 10}),
        #     'tagline_cn': forms.Textarea(attrs = {'cols': 80, 'rows': 10}),
        # }

class CMUserCreationForm(UserCreationForm):
    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            CMUser._default_manager.get(username=username)
        except CMUser.DoesNotExist:
            return username
        raise forms.ValidationError(self.error_messages['duplicate_username'])

    class Meta(UserCreationForm.Meta):
        model = CMUser

class LoginForm(forms.Form):
    name = forms.CharField()
    pwd = forms.CharField()
    next = forms.CharField(required=False)

class RegisterForm(forms.Form):
    phone_number = forms.CharField()
    verify_code = forms.CharField()
    pwd = forms.CharField()

class BindPhoneForm(forms.Form):
    phone_number = forms.CharField()
    verify_code = forms.CharField()
    source = forms.CharField(required=False)
    sid = forms.CharField(required=False)
    pwd = forms.CharField(required=False)


class VerifyCodeForm(forms.Form):
    phone_number = forms.CharField()
    verify_type = forms.CharField()

class VerifyRestCodeForm(forms.Form):
    phone_number = forms.CharField()
    code = forms.CharField()

class ResetPasswordForm(forms.Form):
    pwd = forms.CharField()
    phone_number = forms.CharField()

class ExperienceForm(forms.Form):
    experience_type = forms.CharField()
    phone_number = forms.CharField()