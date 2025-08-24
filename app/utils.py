import hashlib
import os
from functools import wraps

from flask import make_response


def allow_cross_domain(fun):
    @wraps(fun)
    def wrapper_fun(*args, **kwargs):
        rst = make_response(fun(*args, **kwargs))
        rst.headers['Access-Control-Allow-Origin'] = '*'
        rst.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
        allow_headers = "Referer,Accept,Origin,User-Agent"
        rst.headers['Access-Control-Allow-Headers'] = allow_headers
        return rst

    return wrapper_fun

def hash_password(password: str, salt: str) -> str:
    """实现与 JavaScript 等价的 SHA-256 加盐哈希"""
    # 拼接密码和盐值，使用 UTF-8 编码
    combined = (password + salt).encode('utf-8')

    # 生成 SHA-256 哈希
    sha256 = hashlib.sha256()
    sha256.update(combined)
    digest = sha256.digest()  # 返回字节序列

    # 转换为十六进制字符串（小写）
    return digest.hex()


def generate_salt(length: int = 16) -> str:
    """生成加密安全的随机盐值（十六进制格式）"""
    # 生成指定长度的随机字节（length=16 表示 16 字节 -> 32 位十六进制）
    salt_bytes = os.urandom(length)
    return salt_bytes.hex()