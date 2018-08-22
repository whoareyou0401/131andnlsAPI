# -*- coding: utf-8 -*-
import sys
from os.path import dirname, abspath
sys.path.insert(0, dirname(dirname(abspath(__file__))))

from std_libs.listeners import PublishingMsgListener
from os import environ
from tornado.options import parse_command_line
from sqlalchemy import text
import sqlalchemy
import pandas

BUSSINESS_DB_URL = environ.get('CM_BUSSINESS_DB_URL', '')
data_engine = sqlalchemy.create_engine(BUSSINESS_DB_URL)


def message_processor(message):

    if message['item_status'] not in ('verified', "redoing", "deleted"):
        return True
    if '40' not in message['payload']['sources']:
        return True
    barcode = message['payload']['barcodes']
    barcode = "','".join(barcode)
    if message['item_status'] == 'verified':
        status = 1
    else:
        status = 2
    sql = unicode('''
                UPDATE
                    pay_newitem
                SET
                    status={status},
                    finish_time=now()
                WHERE
                    barcode in ('{barcode}')
                ;
        ''').format(barcode=barcode, status=status)
    result = data_engine.engine.execute(
        text(sql).execution_options(autocommit=True))
    return True


listener = PublishingMsgListener(
    channel='cvs_new_item_confirm',
    topic_test_prefix_enabled=False,
    msg_handler=message_processor,
)

parse_command_line()
listener.run()
