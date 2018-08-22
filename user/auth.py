#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .models import CMUser, CMUserOfWeixin, CMUserOfQQ
from django.contrib.auth.backends import ModelBackend
import logging

logger = logging.getLogger(__name__)


class CmBackend(ModelBackend):
    def authenticate(self, username=None, password=None, is_staff=None, source=None, openid=None):
        if source is not None and openid is not None and source == 'weixin':
            try:
                platform = CMUserOfWeixin.objects.get(openid=openid)
                return platform.user
            except CMUserOfWeixin.DoesNotExist:
                return None
        if source is not None and openid is not None and source == 'QQ':
            try:
                platform = CMUserOfQQ.objects.get(openid=openid)
                return platform.user
            except CMUserOfQQ.DoesNotExist:
                return None

        try:
            user = CMUser.objects.get(username=username)
        except CMUser.DoesNotExist:
            try:
                user = CMUser.objects.get(chinese_name=username)
            except CMUser.DoesNotExist:
                try:
                    user = CMUser.objects.get(phone=username)
                except CMUser.DoesNotExist:
                    return None
        logger.info('Found User ' + str(user))

        if user.check_password(password):
            if is_staff is not None:
                if user.is_staff == is_staff:
                    return user
                else:
                    return None
            logger.info('returning user' + str(user))
            return user
        else:
            return None
