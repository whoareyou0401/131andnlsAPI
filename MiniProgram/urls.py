"""MiniProgram URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from user.views import *
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^login/$',
        auth_views.login,
        {'template_name': 'user/login.html'},
        name='login'),
    url(r'^logout/$',
        auth_views.logout,
        {'template_name': 'user/login.html'},
        name='logout'),
]
urlpatterns += [
    url(r'^api/v1.1/user/',
        include('user.urls_apis_v1_1'))
]
urlpatterns += [
    url(r'^dailystatement/', include('dailystatement.urls')),
    url(r'^api/v1.0/dailystatement/',
        include('dailystatement.urls_apis_v1_0')),
    url(r'^api/v1.1/dailystatement/',
        include('dailystatement.urls_apis_v1_1')),
]
urlpatterns += [
    url(r'^pay/', include('pay.urls')),
    url(r'^api/v1.0/pay/',
        include('pay.urls_apis_v1_0')),
    url(r'^api/v1.0/schneider/',
        include('pay.url_schneider')),
    url(r'^api/v1.1/pay/',
        include('pay.urls_apis_v1_1')),
    url(r'^api/v1.2/pay/',
        include('pay.urls_apis_v1_2')),
]
urlpatterns += [
#    url(r'^shopplus/', include('shopplus.urls')),
    url(r'^api/v1/shopplus/',
        include('shopplus.urls_apis_v1')),
]
