from django.conf.urls import url
import apis_v1 as apis

urlpatterns = [
    url(r'^token$',
        apis.LoginView.as_view()),
    url(r'^item$',
        apis.ItemView.as_view()),
    url(r'^items$',
        apis.ItemsView.as_view()),
    url(r'^buy$',
        apis.BuyView.as_view()),
    url(r'^notify$',
        apis.notifyView.as_view()),
    url(r'^order$',
        apis.OrderView.as_view()),
]
