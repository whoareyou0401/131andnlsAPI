# -*- coding: utf-8 -*-
import models
from django.core.cache import cache
import pay_util


class CartHelper(object):
    def __init__(self, openid):
        self.user = models.User.objects.get(openid=openid)
        sid = int(cache.get(openid))
        self.cart = models.Cart.objects.get_or_create(
            user=self.user,
            store_id=sid)[0]
        self.cart.save()

    def get(self):
        result = {}
        cart_items = self.cart.get_cart_items()
        amount = 0
        cart_items, amount = pay_util.bundling(
            cart_items,
            self.cart.store)
        return {'items':cart_items, 'amount':amount}


    def add(self, query_dict):
        for item_id, n in query_dict.items():
            cart_item = models.CartItem.objects.create(
                item_id=int(item_id),
                num=int(n))
            cart_item.save()

    def delete(self, id):
        self.cart.cartitem_set.filter(id=id).delete()

    def clean(self):
        self.cart.cartitem_set.all().delete()


class OrderHelper(object):

    def __init__(self, openid):
        self.cart_helper = CartHelper(openid)


    def order(self):
        if self.cart_helper.cart.cartitem_set.all().count() == 0:
            raise Exception("No items in cart.")
        order = self.cart_helper.cart.order()
        for item in order['items']:
            _item = models.Item.objects.get(id=item['item_id'])
            if _item.inventory > 0 and item['num'] <= _item.inventory:
                _item.inventory -= item['num']
                _item.save()
        return order


class StoreCartHelper(object):
    def __init__(self, sid):
        self.cart = models.StoreCart.objects.get_or_create(
            store__boss_id=sid)[0]
        self.cart.save()

    def get(self):
        result = {}
        cart_items = self.cart.get_cart_items()
        amount = 0
        for cart_item in cart_items:
            cart_item['sum'] = float(cart_item.get('price')) * \
                                        float(cart_item.get('num'))
            amount += cart_item['sum']
        return {'items': cart_items, 'amount': amount}


    def add(self, query_dict):
        for item_id, n in query_dict.items():
            cart_item = models.StoreCartItem.objects.create(
                                item_id=int(item_id), num=int(n))
            cart_item.save()

    def delete(self, id):
        self.cart.cartitem_set.filter(id=id).delete()

    def clean(self):
        self.cart.cartitem_set.all().delete()


class StoreOrderHelper(object):

    def __init__(self, sid):
        self.cart_helper = StoreCartHelper(sid)


    def order(self):
        if self.cart_helper.cart.storecartitem_set.all().count() == 0:
            raise Exception("No items in cart.")
        order = self.cart_helper.cart.order()
        for item in order['items']:
            _item = models.Item.objects.get(id=item['item_id'])
            if _item.inventory > 0 and item['num'] <= _item.inventory:
                _item.inventory -= item['num']
                _item.save()
        return order
