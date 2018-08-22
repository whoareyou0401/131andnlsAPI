from django.http import JsonResponse
from django.core.cache import cache
# from core import exceptions as _exceptions
from django.core import exceptions
from utils import exceptions as _exceptions
from collections import OrderedDict
from django.core.paginator import EmptyPage
# from recommendorder import uac_utils
import django.db
import traceback
import status

exceptions_dict = OrderedDict()

exceptions_dict[exceptions.ObjectDoesNotExist] = {'return_code': 3, 'status': status.HTTP_400_BAD_REQUEST}
exceptions_dict[_exceptions.MethodNotAllowed] = {'return_code': 4, 'status': status.HTTP_405_METHOD_NOT_ALLOWED}
exceptions_dict[exceptions.MultipleObjectsReturned] = {'return_code': 7, 'status': status.HTTP_400_BAD_REQUEST}
exceptions_dict[exceptions.FieldError] = {'return_code': 8, 'status': status.HTTP_400_BAD_REQUEST}
exceptions_dict[django.db.IntegrityError] = {'return_code': 9, 'status': status.HTTP_409_CONFLICT}
exceptions_dict[EmptyPage] = {'return_code': 10, 'status': status.HTTP_204_NO_CONTENT}

exceptions_dict[Exception] = {'return_code': 1, 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}


def standard_api(methods=('GET', 'POST')):

    def _decorator(func):
        def decorator(request, *args, **kwargs):
            try:
                if request.method not in methods:
                    raise _exceptions.MethodNotAllowed(request.method)
                result = func(request, *args, **kwargs)
                if result and type(result) != dict:
                    return result
                response = {'code': 0}
                response.update(result or {})
                _status = 200
                if response.get('status'):
                    _status = response.pop('status')
                response = JsonResponse(response, status=_status)
                # if uac_utils.is_salesman(request.user):
                #     response.set_cookie('user_role', 'salesman')
                # elif uac_utils.is_customer(request.user):
                #     response.set_cookie('user_role', 'customer')
                return response
            # except tuple(exceptions_dict.keys()) as e:
            except Exception as e:
                if exceptions_dict.get(type(e)):
                    _status = exceptions_dict.get(type(e)).get('status')
                    code = exceptions_dict.get(type(e)).get('return_code')
                else:
                    _status = status.HTTP_500_INTERNAL_SERVER_ERROR
                code = 1
                message = unicode(e)
                return JsonResponse({'code': code, 'error_msg': message}, status=_status)
        return decorator
    return _decorator


def cart_lock_required(func):
    def decorator(*args, **kwargs):
        with cache.lock('lock:%s' % kwargs.get('cid')):
            return func(*args, **kwargs)
    return decorator
