# coding:utf8
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

from flask import request, current_app, g

from functools import wraps

import json

from libs.log import L
from libs.utils import TM

from mCache import RequestCache

from libs.redisEx2 import MyRedis as rs

from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

'''请求错误返回格式'''


def ErrorResponse(request, message="请求错误！", data={}):
    callback = request.args.get('callback', '')
    rst = {'error': True, 'message': message, 'data': data}

    return callback + "(" + json.dumps(rst, ensure_ascii=False) + ")"


'''请求错误返回格式'''


def ErrorResponseJson(message="请求错误！", data={}, errCode='001'):
    rst = {'error': True, 'message': message, 'data': data, 'code': errCode}

    return json.dumps(rst, ensure_ascii=False)


'''请求错误返回格式'''


def ErrorResponseData(data={}):
    return json.dumps(data, ensure_ascii=False)


'''请求标准返回格式'''


def NormalResponseJson(request, data):
    rst = {'error': 0, 'code': None, 'message': "请求成功", 'data': data}

    return json.dumps(rst, ensure_ascii=False)


'''请求标准返回格式'''


def NormalResponse(request, data):
    callback = request.args.get('callback', '')
    rst = {'error': False, 'message': "OK", 'data': data}

    return callback + "(" + json.dumps(rst, ensure_ascii=False) + ")"


'''其实未使用该装饰器'''


@auth.verify_password
def verify_password(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except BadSignature:
        return False, "温馨提示：登录超时，请重新登陆！"  # 'token is invalid'
    except SignatureExpired:
        raise False, 'token is expired'
    '''End try'''

    g.user = {'user': data['user'], 'level': data['level'], 'scope': data['scope']}
    return True, "OK"


def authRequired(level):
    def wrapper(func):
        @wraps(func)
        def inner_wrapper(*args, **kwargs):
            R = request.form if request.method == 'POST' else request.args
            token, lc = R.get('tk', ''), R.get('lc', '')

            '''未提供token'''
            if token == '':
                return ErrorResponseJson("温馨提示：登录超时，请重新登陆！", None, '110')  # 116-06
            flag, message = verify_password(token)
            '''token无效'''
            if not flag:
                user = R.get('user', '')
                L.log(user + " auth failed")
                return ErrorResponseJson(message, None, '110')
            '''二次验证'''
            info = rs.hget('TKS', lc)

            # if lc not in TKS or TKS[lc]['tk']!=token:
            if not info or info['tk'] != token:
                return ErrorResponseJson("登录超期，请重新登陆!", None, '110')

            '''权限检查'''
            U = rs.hget('UserInfo', info['user'])
            if not U or U['level'] < int(level[2:]): return ErrorResponseJson("权限不够或需要重新登陆！")

            '''此处可以优化，由装饰器控制返回结果'''
            res = RequestCache(func, info['user'], request, *args, **kwargs)
            # res = RequestCache(func, TKS[lc]['user'], request, *args, **kwargs)

            '''
            每次登录都更新时间
            '''
            info['time'] = TM()
            rs.hset('TKS', lc, info)

            return res
            # return func(TKS[lc]['user'], *args, **kwargs)

        return inner_wrapper

    return wrapper
