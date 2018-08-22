# -*- coding: utf-8 -*-
from django.utils.encoding import force_text
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ungettext
from django.http import HttpResponse, JsonResponse
from utils import status

CODE_0_SUCCESS = 0
CODE_1_UNKNOWN_ERROR = 1
CODE_2_INVENTORY_INSUFFICIENCY = 2
CODE_3_OBJECT_DOES_NOT_EXIST = 3
CODE_4_INVALID_REQUEST_METHOD = 4
CODE_5_ORDER_ITEM_DOES_NOT_IN_CART = 5
CODE_6_OBJECT_ALREADY_EXISTS = 6
CODE_7_MultipleObjectsReturned = 7


class RunTimeError(Exception):

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    return_code = CODE_1_UNKNOWN_ERROR
    default_detail = _('An error occurred.')

    def __init__(self, detail=None):
        if detail is not None:
            self.detail = _(detail)
        else:
            self.detail = self.default_detail
        Exception.__init__(self, self.detail)

    def __str__(self):
        return str(self.default_detail)

    def __unicode__(self):
        return unicode(self.default_detail)


class InventoryInsufficiency(RuntimeError):

    status_code = status.HTTP_409_CONFLICT

    return_code = CODE_2_INVENTORY_INSUFFICIENCY
    default_detail = _('Inventory insufficiency.')


class ObjectDoesNotExist(RuntimeError):

    status_code = status.HTTP_404_NOT_FOUND

    return_code = CODE_3_OBJECT_DOES_NOT_EXIST
    default_detail = _('Object does not exist.')


class InvalidRequestMethod(RuntimeError):

    status_code = status.HTTP_405_METHOD_NOT_ALLOWED

    return_code = CODE_4_INVALID_REQUEST_METHOD
    default_detail = _('Invalid request method.')


class OrderItemDoesNotInCart(RuntimeError):

    status_code = status.HTTP_410_GONE

    return_code = CODE_5_ORDER_ITEM_DOES_NOT_IN_CART
    default_detail = _('Order item does not in cart.')


class ObjectAlreadyExists(RuntimeError):

    status_code = status.HTTP_409_CONFLICT

    return_code = CODE_6_OBJECT_ALREADY_EXISTS
    default_detail = _('Object Already Exists.')


class MultipleObjectsReturned(RuntimeError):
    status_code = status.HTTP_400_BAD_REQUEST

    return_code = CODE_7_MultipleObjectsReturned
    default_detail = _('Multiple objects returned.')
