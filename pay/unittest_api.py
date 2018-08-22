# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import requests
import json
import random
import sys

BASE_URL = 'http://www.chaomengbi.com:12371'


class StaffApiTest(unittest.TestCase):

    cookies = {}
    headers = {}
    _secure = ''
    def setUp(self):
        url = BASE_URL + '/api/login/v0/login'
        data = {
            'account': 'xiaochen',
            'password': 'chaomeng'
        }
        response = requests.post(url, data=data)
        self.cookies = dict(response.cookies)
        self._secure = response.cookies.get('_secure')
        _xsrf = response.cookies.get('_xsrf')
        self.headers = dict(response.headers)
        self.headers['X-XSRF-TOKEN'] = _xsrf


    def tearDown(self):
        pass

    def test_get_users(self):
        url = BASE_URL + '/api/basic/v0/user'
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(dict == type(response_data))
        self.assertTrue('code' in response_data)
        self.assertTrue('data' in response_data)
        users = response_data.get('data')
        self.assertTrue(type(users) == list)
        users_length = len(users)
        self.assertNotEqual(0, users_length)
        user = users[random.randint(0, users_length)]
        self.assertTrue('id' in user)
        self.assertTrue('cm_name' in user)
        self.assertTrue('table_prefix' in user)
        self.assertTrue('cm_id' in user)

    def test_login(self):
        url = BASE_URL + '/api/basic/v0/area'
        response = requests.get(url, cookies=self.cookies)
        response_data = json.loads(response.content)
        self.assertTrue(dict == type(response_data))
        self.assertTrue('code' in response_data)
        self.assertTrue('data' in response_data)
        areas = response_data.get('data')
        self.assertTrue(type(areas) == list)
        areas_length = len(areas)
        self.assertNotEqual(0, areas_length)
        area = areas[random.randint(0, areas_length)]
        self.assertTrue('id' in area)
        self.assertTrue('label' in area)
        if 'children' in area:
            children = area.get('children')
            self.assertTrue(type(children) == list)
            children_length = len(children)
            children_data = children[random.randint(0, children_length)]
            self.assertTrue('id' in children_data)
            self.assertTrue('pid' in children_data)
            self.assertTrue('label' in children_data)
            self.assertTrue('store_show_code' in children_data)


if __name__ == '__main__':
    # unittest.main()
    suite = unittest.TestSuite()
    suite.addTests(
        unittest.TestLoader().loadTestsFromTestCase(StaffApiTest))
    with open('TestReport.txt', 'w') as f:
        runner = unittest.TextTestRunner(stream=f)
        runner.run(suite)
