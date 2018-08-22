# -*- coding: utf-8 -*-
from StringIO import StringIO
from tempfile import NamedTemporaryFile
from collections import OrderedDict
import pyexcel


def get_file_as(record_list, file_type, sheet_name='sheet1', field_mapping={}):
    _list = []
    for _item in record_list:
        _dict = OrderedDict()
        for _, v in _item.items():
            _dict[field_mapping.get(_) if field_mapping.get(_) else _] = v
        _list.append(_dict)
    return pyexcel.save_as(records=_list, dest_file_type=file_type, sheet_name=sheet_name, dest_encoding="UTF-8")
