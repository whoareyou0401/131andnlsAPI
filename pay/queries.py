# -*- coding: utf-8 -*-

CART_ITEMS_SQL = """
    SELECT
        cartitem.id,
        cartitem.item_id,
        cartitem.num,
        cartitem.add_time,
        item.name,
        item.price
    FROM pay_cart AS cart
    RIGHT JOIN pay_cartitem AS cartitem
    ON cart.id=cartitem.cart_id
    RIGHT JOIN pay_item AS item
    ON item.id=cartitem.item_id
    WHERE
    cart.id IS NOT NULL
    AND
    item.id IS NOT NULL
    AND
    cart.user_id=%s
    AND cart.store_id=%s
"""
STORE_CART_ITEMS_SQL = """
    SELECT
        cartitem.id,
        cartitem.item_id,
        cartitem.num,
        cartitem.add_time,
        item.name,
        item.price
    FROM pay_storecart AS cart
    RIGHT JOIN pay_storecartitem AS cartitem
    ON cart.id=cartitem.cart_id
    RIGHT JOIN pay_item AS item
    ON item.id=cartitem.item_id
    WHERE
    cart.id IS NOT NULL
    AND
    item.id IS NOT NULL
    AND cart.store_id=%s
"""