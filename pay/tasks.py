# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from celery import shared_task
import sqlalchemy
from os import environ
from pay import pay_util
from utils import sns
import pandas
import datetime


@shared_task
def run_cm_cvs_goodsflow():
    data_engine = sqlalchemy.create_engine(environ.get('OLD_DB_URL'))
    orderId = 0
    query = '''
    SELECT
        receipt_id
    FROM
        cm_cvs_goodsflow
    ORDER BY
        receipt_id
    DESC LIMIT 1
    '''
    query = sqlalchemy.text(query)
    data = pandas.read_sql_query(query, data_engine)
    if not data.empty:
        orderId = data['receipt_id'][0]
    with data_engine.connect() as con:
        sql = '''
        INSERT INTO
            cm_cvs_goodsflow
            (
                SELECT
                    out_trade_no as wx_flowno,
                    a.store_id as wx_store_id,
                    d.openid,e.sum as wx_total,
                    (order_time AT TIME ZONE 'CCT')::date as date,
                    c.barcode,
                    c.standard_item_id as foreign_item_id,
                    c.name as item_name,
                    c.price,b.num as quantity,
                    b.subtotal,
                    order_time AT TIME ZONE 'CCT' as wx_saletime,
                    c.id as receipt_item_id,
                    d.phone,
                    d.gender,
                    a.id as receipt_id,
                    c.purchase_price,
                    d.nick_name,
                    d.name
                FROM
                    pay_order as a
                INNER JOIN
                    pay_orderitem as b
                ON
                    a.id = b.order_id
                INNER JOIN
                    pay_item as c
                ON
                    b.item_id = c.id
                INNER JOIN
                    pay_user as d
                ON
                    a.user_id = d.id
                INNER JOIN
                    (
                        SELECT
                            sum(subtotal),order_id
                        FROM
                            pay_orderitem
                        GROUP BY
                            order_id
                    ) as e
                ON
                    a.id = e.order_id
                WHERE
                    a.id > {orderId} and a.status = 1
                )
        '''.format(orderId=orderId)
        con.execute(sql)


@shared_task
def get_recent_rebuy():
    start_time = datetime.datetime.now() - datetime.timedelta(days=30)
    end_time = datetime.datetime.now()
    results = pay_util.rebuy_percent_sort(2, start_time, end_time)[0:5]
    data_engine = sqlalchemy.create_engine(environ.get('CM_BUSSINESS_DB_URL'))
    i = 1
    today = datetime.datetime.today().date()
    with data_engine.connect() as con:
        for result in results:
            sql = '''
                INSERT INTO
                    pay_itemtimeframerebuypercent
                    (create_date, rebuy_percent, item_id, current_ranking)
                VALUES
                    ('{create_date}', {rebuy_percent}, {item_id}, {current_ranking})
            '''.format(create_date=today,
                       rebuy_percent=result['percent'],
                       item_id=result['id'],
                       current_ranking=i)
            con.execute(sql)
            i += 1


# @shared_task
# def get_time_frame_consume_coverage():
#     data_engine = sqlalchemy.create_engine(environ.get('CM_BUSSINESS_DB_URL'))
#     yestoday = str((datetime.datetime.now() - datetime.timedelta(days=1)).date())

#     query = '''
#         SELECT
#             *
#         FROM
#             pay_timeframe
#         ORDER BY
#             start_time
#     '''
#     query = sqlalchemy.text(query)
#     frames = pandas.read_sql_query(query, data_engine)

#     time_frames = []
#     for fr in frames.itertuples():
#         time_frames.append({'id': fr[1],
#                             'start_time': '%s %s' % (yestoday, str(fr[2])),
#                             'end_time': '%s %s' % (yestoday, str(fr[3]))
#                             })
#     first_start_time = time_frames[0]['start_time']
#     first_end_time = time_frames[0]['end_time']
#     last_start_time = time_frames[-1]['start_time']
#     last_end_time = str(datetime.datetime.now().date()) + ' ' + time_frames[-1]['end_time'].split(' ')[-1]
#     first_time_frame = []
#     first_sql = '''
#         select distinct
#             nick_name
#         from
#             cm_cvs_goodsflow
#         where
#             wx_saletime>'{start_time}'
#         and wx_saletime<='{end_time}'
#         and wx_store_id='2';
#         '''.format(start_time=first_start_time,
#                    end_time=first_end_time)
#     first_sql = sqlalchemy.text(first_sql)
#     first_results = pandas.read_sql_query(first_sql, data_engine)
#     if not first_results.empty:
#         for res in first_results.itertuples():
#             first_time_frame.append(res[1])
#     end_sql = '''
#         select distinct
#             name, nick_name
#         from
#             cm_cvs_goodsflow
#         where
#             wx_saletime>'{start_time}'
#         and
#             wx_saletime<='{end_time}'
#         and wx_store_id='2';
#         '''.format(start_time=last_start_time,
#                    end_time=last_end_time)
#     end_sql = sqlalchemy.text(end_sql)
#     end_results = pandas.read_sql_query(end_sql, data_engine)
#     if not end_results.empty:
#         for res in end_results.itertuples():
#             first_time_frame.append(res[2])
#     first_time_frame = list(set(first_time_frame))
#     other_time_frame = [{'id': time_frames[-1]['id'],
#                          'consume_coverage': len(first_time_frame)}]
#     for i in range(1, len(time_frames) - 1):
#         sql = '''
#             SELECT count(t1.nick_name)
#             FROM (SELECT DISTINCT
#                 name,
#                 nick_name,
#                 wx_saletime
#             FROM
#                 cm_cvs_goodsflow
#             WHERE
#                 wx_saletime>'{start_time}'
#             AND
#                 wx_saletime<='{end_time}'
#             AND wx_store_id='2'
#             ORDER BY
#                 wx_saletime) AS t1;
#         '''.format(start_time=time_frames[i]['start_time'],
#                    end_time=time_frames[i]['end_time'])
#         sql = sqlalchemy.text(sql)
#         results = pandas.read_sql_query(sql, data_engine)
#         if not results.empty:
#             for res in results.itertuples():
#                 other_time_frame.append({'id': time_frames[i]['id'],
#                                          'consume_coverage': res[1]})
#         else:
#             other_time_frame.append({'id': time_frames[i]['id'],
#                                      'consume_coverage': 0})
#     with data_engine.connect() as con:

#         for data in other_time_frame:
#             sql = '''
#                 INSERT INTO
#                     pay_timeframeconsumecoverage
#                     (time_frame_id, consume_coverage, add_time)
#                 VALUES
#                     ({time_frame_id}, {consume_coverage}, now()::date)
#             '''.format(time_frame_id=data['id'],
#                        consume_coverage=data['consume_coverage'])
#             con.execute(sql)


# @shared_task
# def get_time_frame_sales_top_five_item():
#     data_engine = sqlalchemy.create_engine(environ.get('CM_BUSSINESS_DB_URL'))
#     yestoday = str((datetime.datetime.now() - datetime.timedelta(days=1)).date())
#     before_yestoday = str((datetime.datetime.now() - datetime.timedelta(days=2)).date())
#     query = '''
#         SELECT
#             *
#         FROM
#             pay_timeframe
#         ORDER BY
#             start_time;
#     '''
#     query = sqlalchemy.text(query)
#     frames = pandas.read_sql_query(query, data_engine)
#     time_frames = []
#     for fr in frames.itertuples():
#         time_frames.append({'id': fr[1],
#                             'yestoday_start': '%s %s' % (yestoday, str(fr[2])),
#                             'yestoday_end': '%s %s' % (yestoday, str(fr[3])),
#                             'before_yestoday_start': '%s %s' % (before_yestoday, str(fr[2])),
#                             'before_yestoday_end': '%s %s' % (before_yestoday, str(fr[3]))
#                             })
#     other_time_frame = []
#     for i in range(1, len(time_frames) - 1):
#         sql = '''
#             SELECT
#                 receipt_item_id AS item_id,
#                 COUNT(receipt_item_id) AS num
#             FROM
#                 cm_cvs_goodsflow
#             WHERE
#                 (wx_saletime>'{yestoday_start}'
#                 AND wx_saletime<= '{yestoday_end}')
#             OR
#                 (wx_saletime>'{before_yestoday_start}'
#                 AND wx_saletime<= '{before_yestoday_end}')
#             AND wx_store_id='2'
#             GROUP BY
#                 receipt_item_id
#             ORDER BY
#                 COUNT(receipt_item_id) DESC
#             LIMIT 5;
#         '''.format(yestoday_start=time_frames[i]['yestoday_start'],
#                    yestoday_end=time_frames[i]['yestoday_end'],
#                    before_yestoday_start=time_frames[i]['before_yestoday_start'],
#                    before_yestoday_end=time_frames[i]['before_yestoday_end'])
#         sql = sqlalchemy.text(sql)
#         results = pandas.read_sql_query(sql, data_engine)
#         if not results.empty:
#             for res in results.itertuples():
#                 other_time_frame.append({'id': time_frames[i]['id'],
#                                          'item_id': res[1],
#                                          'num': res[2],
#                                          'current_ranking': res[0] + 1})
#         else:
#             other_time_frame.append({'id': time_frames[i]['id'],
#                                      'item_id': None,
#                                      'num': 0,
#                                      'current_ranking': 1})

#     first_yestoday_start = time_frames[0]['yestoday_start']
#     first_yestoday_end = time_frames[0]['yestoday_end']
#     first_before_yestoday_start = time_frames[0]['before_yestoday_start']
#     first_before_yestoday_end = time_frames[0]['before_yestoday_end']
#     last_yestoday_start = time_frames[-1]['yestoday_start']
#     last_yestoday_end = str(datetime.datetime.now().date()) + ' ' + time_frames[-1]['yestoday_end'].split(' ')[-1]
#     last_before_yestoday_start = time_frames[-1]['before_yestoday_start']
#     last_before_yestoday_end = yestoday + ' ' + time_frames[-1]['before_yestoday_end'].split(' ')[-1]
#     time_frame_dict = {}
#     first_sql = '''
#         SELECT
#             receipt_item_id AS item_id,
#             COUNT(receipt_item_id) AS num
#         FROM
#             cm_cvs_goodsflow
#         WHERE
#             (wx_saletime>'{yestoday_start}'
#             AND wx_saletime<= '{yestoday_end}')
#         OR
#             (wx_saletime>'{before_yestoday_start}'
#             AND wx_saletime<= '{before_yestoday_end}')
#         AND
#             wx_store_id='2'
#         GROUP BY
#             receipt_item_id
#         ORDER BY
#             COUNT(receipt_item_id) DESC
#         LIMIT 5;
#         '''.format(yestoday_start=first_yestoday_start,
#                    yestoday_end=first_yestoday_end,
#                    before_yestoday_start=first_before_yestoday_start,
#                    before_yestoday_end=first_before_yestoday_end)
#     first_sql = sqlalchemy.text(first_sql)
#     first_results = pandas.read_sql_query(first_sql, data_engine)
#     if not first_results.empty:
#         for res in first_results.itertuples():
#             time_frame_dict[res[1]] = res[2]
#     end_sql = '''
#         SELECT
#             receipt_item_id AS item_id,
#             COUNT(receipt_item_id) AS num
#         FROM
#             cm_cvs_goodsflow
#         WHERE
#             (wx_saletime>'{yestoday_start}'
#             AND wx_saletime<= '{yestoday_end}')
#         OR
#             (wx_saletime>'{before_yestoday_start}'
#             AND wx_saletime<= '{before_yestoday_end}')
#         AND
#             wx_store_id='2'
#         GROUP BY
#             receipt_item_id
#         ORDER BY
#             COUNT(receipt_item_id) DESC
#         LIMIT 5;
#         '''.format(yestoday_start=last_yestoday_start,
#                    yestoday_end=last_yestoday_end,
#                    before_yestoday_start=last_before_yestoday_start,
#                    before_yestoday_end=last_before_yestoday_end)
#     end_sql = sqlalchemy.text(end_sql)
#     end_results = pandas.read_sql_query(end_sql, data_engine)
#     if not end_results.empty:
#         for res in end_results.itertuples():
#             if res[1] in time_frame_dict:
#                 time_frame_dict[res[1]] = time_frame_dict[res[1]] + res[2]
#             else:
#                 time_frame_dict[res[1]] = res[2]
#     time_frame_dict = sorted(time_frame_dict.items(),
#                              lambda x, y: cmp(x[1], y[1]),
#                              reverse=True)
#     sort = 1
#     for key, value in time_frame_dict:
#         other_time_frame.append({'id': 5,
#                                  'item_id': key,
#                                  'num': value,
#                                  'current_ranking': sort})
#         sort += 1
#     with data_engine.connect() as con:

#         for data in other_time_frame:
#             if data['item_id']:
#                 sql = '''
#                     INSERT INTO
#                         pay_itemtimeframesales
#                         (time_frame_id, sales_volume, item_id, current_ranking, create_date)
#                     VALUES
#                         ({time_frame_id}, {sales_volume}, {item_id}, {current_ranking}, now()::date)
#                 '''.format(time_frame_id=data['id'],
#                            sales_volume=data['num'],
#                            item_id=data['item_id'],
#                            current_ranking=data['current_ranking'])
#                 con.execute(sql)


# # @shared_task
# # def redpack_yestoday_money():
# #     receipts = ['liuda@chaomengdata.com', 'lijun@chaomengdata.com',
# #                 '1019642015@qq.com', 'gongxiaochen@chaomengdata.com']
# #     data = pay_util.get_yestoday_redpack_amount()
# #     msg = u'昨日已经累计发放%s元,超盟管理员请注意关注商户号余额,发放详情请登录后台\nhttps:b.ichaomeng.com/login' % data['amount']
# #     title = u'牛栏山红包活动'
# #     email_from = 'chaomeng001@chaomengdata.com'
# #     sns.easy_send_email(title, msg, email_from, receipts)


# @shared_task
# def auto_ckeck_inventory():
#     receipts = ['liuda@chaomengdata.com',
#                 'gongxiaochen@chaomengdata.com',
#                 'zhaohuansha@chaomengdata.com']
#     results = pay_util.check_item_inventory(2)

#     msg = u'订货单如下，请及时处理\n'
#     if not results:
#         return
#     for res in results:
#         msg += u'品名:{name}  条码:{barcode} \
#          当前库存:{inventory}    {stock_period}天后剩余{later}\n'.format(
#             name=res['name'],
#             barcode=res['barcode'],
#             inventory=res['inventory'],
#             later=res['later'],
#             stock_period=res['stock_period'])
#     title = u'超便利补货单'
#     email_from = 'chaomeng001@chaomengdata.com'
#     sns.easy_send_email(title, msg, email_from, receipts)
