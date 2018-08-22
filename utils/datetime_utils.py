import pytz
import datetime
import exceptions

_tzinfo = pytz.timezone('Asia/Shanghai')


def cst(datetime, format='%Y-%m-%d %H:%M'):
    return datetime.astimezone(_tzinfo).strftime(format)


def is_same_day_in_cst(datetime1, datetime2):
    return datetime1.astimezone(_tzinfo).date() == datetime2.astimezone(_tzinfo).date()


def json_datetime_encoder(obj):
    if isinstance(obj, datetime.datetime):
        return cst(obj)
    if isinstance(obj, datetime.time):
        return str(obj)
    else:
        raise exceptions.ValidationError('Invalid object type')
