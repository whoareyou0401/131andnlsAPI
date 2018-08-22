# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
from celery import shared_task
import smtplib
from email.mime.text import MIMEText
import os
from threading import Lock
from django.db import connection


alert_addr = 'liuda@chaomengdata.com'
cmdata_members = [
    'liuda@chaomengdata.com',
    'lijun@chaomengdata.com'
]
email_host = 'smtp.exmail.qq.com'


smtp_server = None

send_mail_lock = Lock()

error_dict = {}


def send_alertmail(subject, content):
    with send_mail_lock:
        global smtp_server
        msg = MIMEText(content, 'plain', 'utf-8')
        msg['From'] = '[Alert] ' + alert_addr
        msg['To'] = ','.join(cmdata_members)
        msg['Subject'] = subject

        if not smtp_server:
            password = os.getenv('ALERT_MAIL_PWD', None)
            if not password:
                return
            smtp_server = smtplib.SMTP(email_host)
            smtp_server.login(alert_addr, password)
        smtp_server.sendmail(alert_addr, cmdata_members, msg.as_string())


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


@shared_task
def redpack_monitor():
    with connection.cursor() as cursor:
        sql = """
            SELECT
                SUM(total_amount)
            FROM
                advertisement_redpackrecord
            WHERE
                redpack_name_id=19
            AND status='SUCCESS';
        """
        total_sum = 0
        cursor.execute(sql)
        count = dictfetchall(cursor)[0]
        total_sum = count['sum'] / 100
        int_park = total_sum / (10**5 * 5)
        result = 0
        if int_park == 0:
            result = total_sum
        else:
            result = total_sum - int_park * 10**5 * 5
        content = u'已发放红包%s元人民币' % (str(result), str(10**5 * 5 - result))
        send_alertmail(u'牛栏山红包金额监控', content)
