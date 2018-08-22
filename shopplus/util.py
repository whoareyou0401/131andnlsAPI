# -*- coding: utf-8 -*-

from pay import pay_util
from django.http import QueryDict
from core import sql_utils
from django.db import connection
import models


def request_user(request):
	params = None
	if request.method == 'GET':
		params = request.GET
	else:
		params = QueryDict(request.body)
	token = params.get('token')
	store_id = int(params.get('store_id'))
	openid = pay_util.confirm_validate_token(token)
	try:
		user = models.User.objects.get(openid=openid, app_id=store_id)
	except:
		return None
	return user

def get_orders(store_id, user_id):
	sql = """
		SELECT 
			item.name,
			order_item.num,
			order_item.subtotal,
			orders.order_time
		FROM
			shopplus_order as orders
		LEFT JOIN
			shopplus_orderitem as order_item
		ON
			orders.id=order_item.order_id
		LEFT JOIN
			shopplus_item as item
		ON
			order_item.item_id=item.id
		WHERE
			orders.store_id={store_id}
		AND
			orders.user_id={user_id}
		AND
			orders.status=1
		ORDER BY
			orders.order_time DESC
	""".format(store_id=store_id, user_id=user_id)
	cur = connection.cursor()
	cur.execute(sql)
	orders = sql_utils.dictfetchall(cur)
	return orders


