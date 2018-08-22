from WXBizDataCrypt import WXBizDataCrypt

def main():
    appId = 'wxa2b78eac0a7c7627'
    sessionKey = '2dHE45EXC+B+9EkaS4Hi2g=='
    encryptedData = "69F+aqB6rlJDrifc4zLgbuS1X1kK9+iOdmayvYNtDtfDhfF9w0nmvlYEKR3V05JCKCAuZvIS3TIk+wo1VsNI8t3Lm45kz+fle/rvGyzw/d+gnFuds6gzyfzHj1et15ZzJ4d8OIVYH7lTEGYgkjlzG/qAXcygTEhzinmD2aG5MMr0AjImwj1KT8J45wdSxl8geONtITeCoHTnkm+nPBCN/QcAvj6m0ic+QSlpc4F9CkZz0N1IWaqn1mX13UWud5+khWLSrafrqlW9m40HJjPOsJNTbrlcD03Nf17DRMoROZrpCCym7cf7K3kEb6LH02AlhtxDH8Ob4OBgyaHj+YSiZ0d5bJ0hF5E5/zh6S1jczKCDs+TLKby4ZLb0g2zme+lPzcrQD65MRGQIXOtvS0rpHyEqngC1oIN8cW4IRDqSkXQwkCZcK1TN106IWAeEQJmgAtsBeUOu5ub7T2rZDc4a2thEF2hnatJQnYpXeCNOznS3CVgNYPJPMb/7cGOIpODQj1wCGVv8ColmO+CBrx7qtA=="
    iv = "RJYTtXu+0c1OXeYUD1Zapg=="

    pc = WXBizDataCrypt(appId, sessionKey)

    print pc.decrypt(encryptedData, iv)

if __name__ == '__main__':
    main()
