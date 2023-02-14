#coding: utf8


from flask import request, current_app, g
from functools import wraps
from flask_httpauth import HTTPBasicAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from common.response import ErrorResponseJson, ErrorResponseData
from mCache import RequestCache
from libs.redisEx2 import MyRedis as rs
from libs.log import L

auth = HTTPBasicAuth()


'''其实未使用该装饰器'''
@auth.verify_password
def verify_password(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except BadSignature:
        return False, "温馨提示：登录超时，请重新登陆！" # 'token is invalid'
    except SignatureExpired:
        raise False, 'token is expired'
    '''End try'''
     
    g.user = {'user': data['user'], 'level': data['level'], 'scope': data['scope']}
    return True, "OK"


def authRequired(level):
    def wrapper(func):
        @wraps(func)
        def inner_wrapper(*args, **kwargs):
            R = request.form if request.method=='POST' else request.args
            token, lc = R.get('tk', ''), R.get('lc', '')
            
            '''未提供token'''
            if token=='':
                return ErrorResponseJson("温馨提示：登录超时，请重新登陆！", None, '110') # 116-06
            flag, message = verify_password(token)
            '''token无效'''
            if not flag: 
                user = R.get('user', '')
                L.log(user + " auth failed")
                return ErrorResponseJson(message, None, '110')
            '''二次验证'''
            info = rs.hget('TKS', lc)
            
            # if lc not in TKS or TKS[lc]['tk']!=token: 
            if not info or info['tk']!=token:
                return ErrorResponseJson("登录超期，请重新登陆!", None, '110')
            
            '''权限检查'''
            U = rs.hget('UserInfo', info['user'])
            if not U or U['level'] < int(level[2:]): return ErrorResponseJson("权限不够或需要重新登陆！")
            
            '''此处可以优化，由装饰器控制返回结果'''
            res = RequestCache(func, info['user'], request, *args, **kwargs)
            # res = RequestCache(func, TKS[lc]['user'], request, *args, **kwargs)
            return res
            # return func(TKS[lc]['user'], *args, **kwargs)
        return inner_wrapper
    return wrapper  


if __name__ == '__main__':
    pass