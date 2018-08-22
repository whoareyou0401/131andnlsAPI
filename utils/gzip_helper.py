# -*-coding:utf-8-*-
import gzip
import tempfile
import StringIO


# common
def uncompress_file(fn_in):
    f_in = gzip.open(fn_in, 'rb')
    file_content = f_in.read()
    f_out = tempfile.TemporaryFile()
    # f_out = open(fn_out, 'wb')
    f_out.write(file_content)
    f_out.seek(0)
    f_out.close()
    f_in.close()
    return f_out


# with StringIO
def gzip_uncompress(c_data):
    buf = StringIO.StringIO(c_data)
    f = gzip.GzipFile(mode='rb', fileobj=buf)
    f_out = tempfile.TemporaryFile()
    try:
        file_content = f.read()
        f_out.write(file_content)
        f_out.seek(0)
    finally:
        f.close()
        # f_out.close()
    return f_out
