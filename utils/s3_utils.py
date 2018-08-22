# # -*-coding:utf-8-*-
# from django.conf import settings
# from os import environ
# from botocore.client import Config
# import boto
# import boto3
# import tempfile
# REGION_NAME = 'cn-north-1'


# def upload_to_s3(bucket_name, filename, content, policy="public-read"):
#     conn = boto.connect_s3(settings.AWS_ACCESS_KEY_ID,
#                            settings.AWS_SECRET_ACCESS_KEY,
#                            host=settings.AWS_S3_HOST)
#     bucket = conn.get_bucket(bucket_name)

#     k = boto.s3.key.Key(bucket)
#     k.key = filename
#     k.set_contents_from_string(content,
#                                policy=policy,
#                                headers={"Content-Type": "image/jpeg"})
#     return 'https://%s/%s/%s' % (settings.AWS_S3_HOST, bucket_name, filename)


# def delete_from_s3(bucket_name, filename):
#     conn = boto.connect_s3(settings.AWS_ACCESS_KEY_ID,
#                            settings.AWS_SECRET_ACCESS_KEY,
#                            host=settings.AWS_S3_HOST)
#     bucket = conn.get_bucket(bucket_name)

#     k = bucket.get_key(filename)
#     if k:
#         k.delete()
#     return ''


# def get_Bucket(bucket_name):
#     try:
#         __s3conn = boto3.resource('s3',
#             aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
#             aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
#             region_name=REGION_NAME,
#             config=Config(signature_version='s3v4'))
#         s3bucket = __s3conn.Bucket(bucket_name)
#     except:
#         return None
#     return s3bucket


# def download_from_s3_as_io(bucket, key):
#     s3_file = tempfile.TemporaryFile()
#     bucket.download_file(key, s3_file.name)
#     return s3_file


# def download_from_s3(s3_bucket, key_name):
#     try:
#         temp_file = download_from_s3_as_io(s3_bucket, key_name)
#     except Exception as e:
#         return None
#     with open(temp_file.name, 'r') as fr:
#         content = fr.read()
#     return content
