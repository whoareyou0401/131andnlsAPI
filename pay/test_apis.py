# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.urlresolvers import reverse
from django.conf import settings
from django.test import TestCase, override_settings
from django.test import Client, modify_settings
from django.utils.http import urlencode
import json
import models
import random


class StaffApiTest(TestCase):

    def setUp(self):
        self.client = Client()
        username = settings.PAY_STAFF_TEST_USER
        self.client.login(username=username, password='ichaomeng.com')

    # @classmethod
    # def tearDownClass(cls):
    #     cls.client.logout()

    # @override_settings(DEBUG=True)
    # def test_get(self):
    #     # self.client.post('/mlogin', {'username': 'liuda', 'password': 'ichaomeng.com'})
    #     # self.client.login(username='liuda', password='ichaomeng.com')
    #     url = '/api/v1.1/pay/staff'
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 200)
    #     self.assertTrue('code' in response.json())
    #     self.assertTrue('data' in response.json())
    #     staffs = response.json().get('data')
    #     self.assertTrue(type(staffs) == list)
    #     staffs_length = len(staffs)
    #     self.assertNotEqual(0, staffs_length)
    #     staff = staffs[random.randint(0, staffs_length)]
    #     self.assertTrue('id' in staff)
    #     self.assertTrue('integration' in staff)
    #     self.assertTrue('name' in staff)

    @override_settings(DEBUG=True)
    def test_delete(self):
        url = '/api/v1.1/pay/staff'
        data = json.dumps({'uid': 2})
        print data
        response = self.client.delete(url, data=data, content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('code' in response.json())
        self.assertTrue('data' in response.json())
        staffs = response.json().get('data')
        self.assertTrue(type(staffs) == list)
        staffs_length = len(staffs)
        self.assertNotEqual(0, staffs_length)
        staff = staffs[random.randint(0, staffs_length)]
        self.assertTrue('id' in staff)
        self.assertTrue('integration' in staff)
        self.assertTrue('name' in staff)
