#coding: utf8


import sys
sys.path.append('..')

import json
import urlparse
# import urllib2
# import urllib
from urllib import quote
from libs.redisEx2 import MyRedis as rs
from libs.utils import MD5, TMSL, hmac_sha256
from common.key import KEY
from common.tools import request_url
from libs.log import L
from method import get_pay_method

class ThirdPAY(object):
    param_names = {
            'mch_id': 'merchantId',        # 商户ID
            'mch_no': 'jOrderId',          # 商户订单号
            'pay_type': 'payWay',          # 支付类型
            'total_fee': 'amount',         # 总金额
            'user_id': 'jUserId',
            'type': 'orderType',
            # 'remark': 'jExtra',         # 备注说明
            'attach': 'jExtra',         # 附加数据，原样返回
            'client_ip': 'jUserIp',       # 客户端IP
            'notify_url': 'notifyUrl',     # 回调通知地址
            # 'return_url': 'returnurl'   # 返回跳转地址
            'version': 'signatureVersion',
            'timestamp': 'timestamp',
            'sign_method': 'signatureMethod',
            'currency': 'currency'
    }
    notice_names = {
            'mch_id': 'merchantId',                  # 商户ID
            'mch_no': 'merchantBizNum',                  # 商户订单号
            # 'pay_type': 'tradetype',            # 支付类型
            'total_fee': 'money',            # 总金额
            # 'attach': 'attach',                 # 附加数据，原样返回
            'result_code': 'status',        # 状态码，1成功 0失败
            'transaction_id': 'sysBizNum',  # 系统订单号
            'sign': 'sign',                     # 签名
    }
    notice_fields = ['actualAmount', 'amount', 'currency', 'fee', 'jExtra', 'jOrderId', 
                    'merchantId', 'notifyUrl', 'orderId', 'orderType', 'payTime', 'payWay', 
                    'signature', 'signatureMethod', 'signatureVersion', 'status', 'timestamp']
    param_index = dict((v, k) for k, v in param_names.items())
    notice_index = dict((v, k) for k, v in notice_names.items())
    need_verify = False
    use_cache = False
    
    SUCCESS_CODE = "3"
    RESPONSE_TYPE = "json"
    RESPONSE_SUCCESS = {"code": 0, "message": "ok", "data": {}}
    
    def pay_type(self, m):
        methods = {'UNIONPAY': 'AlipayBankcard', 'ALIPAY': 'AliPay', 
                   'WXPAY': 'WechatPay', 'ALIPAYH5': 'AliPay_H5', 
                'ALIPAYWEB': 'AliPayTransfer'}
        return methods.get(m, None)
    
    '''调用第三方，并加入缓存'''
    def getThirdPay(self, billno, data, ip = '127.0.0.1'):
        if ThirdPAY.use_cache:
            url = rs.hget(KEY.PayUrl, billno, False)
            if url: return url
        
        tar = self.get_pay_url(billno, data, ip)
        
        
        # 缓存支付链接
        if tar and ThirdPAY.use_cache: rs.hset(KEY.PayUrl, billno, tar)
        return tar
    
    def pre_request(self, billno, data, ip):
        M = get_pay_method(data['pid'], billno)
        
        params = { 'version': '1', 'sign_method': 'HmacSHA256', 'timestamp': TMSL(),
                  'mch_no': billno, 'total_fee': float(data['amount']) * 1.0}
        params['mch_id'] = M['appId']
        params['total_fee'] = '%.2f' % params['total_fee'] 
        params['pay_type'] = M['payMethod']
        # params['remark'] = M['remark']
        params['attach'] = 'zbpay'
        params['user_id'] = data['user']
        params['client_ip'] = ip
        params['type'] = "1"
        params['notify_url'] = M['notifyUrl']
        params['currency'] = "CNY"
        
        self.secret_key = M['secretKey']
        
        return M['server'], params
    
    def get_pay_url(self, billno, data, ip):
        server, params = self.pre_request(billno, data, ip)
        url, sign, params2 = self.url_sign(params, self.secret_key)
        params2['signature'] = sign
        
        res = request_url(server, params2)
        if res and 'data' in res and 'paymentUrl' in res['data']: 
            return res['data']['paymentUrl']
        
        return None
    
    '''前通用方式'''
    def create_url(self, billno, data, ip):
        server, params = self.pre_request(billno, data, ip)
        url, sign, params2 = self.url_sign(params, self.secret_key)
        url = server + '?' + url + '&signature=' + sign
        
        return url
    
    def url_sign(self, dt, secret_key = ""):
        keys = ['amount', 'currency', 'jExtra', 'jOrderId', 'jUserId', 'jUserIp', 'merchantId', 'notifyUrl', 
         'orderType', 'payWay', 'signatureMethod', 'signatureVersion', 'timestamp']
        params = dict((k, dt.get(ThirdPAY.param_index[k], '')) for k in keys)
        url = '&'.join(k + '=' + str(params[k]) for k in keys)
        
        return url, hmac_sha256(secret_key, url).upper(), params

    
    def check_sign(self, params, secret_key):
        fields = ThirdPAY.notice_fields
        for k in fields:
            if k == 'notifyUrl': continue
            if k not in params: return False
        
        txt = '&'.join([k + '=' + str(params.get(k, '')) for k in fields if k != 'signature'])
        sign = hmac_sha256(secret_key, txt).upper()
        print params
        print txt
        print sign
        
        if sign == params['sign']: return True
        
        return False    



'''--------------------------------------------华丽丽--------------------------------------------'''




if __name__ == '__main__':
    tp = ThirdPAY()
    print tp.getThirdPay('12345678901', {'pid': '61', 'amount': '300', 'user': 'test1994'})
    
    url = '''/sss?resultcode=1&mchid=5&mchno=201904121931111273&tradetype=weixin&totalfee=100.00
            &attach=test&transactionid=1201908061737579679&sign=D42F8D185F7D901B9D670490629055A7'''
    url = "http://cj.buy.yilidaochang.com/pay/payIndex?mchid=691406&mchno=20191113160609117396301833129385&tradetype=alipay&totalfee=100.0&descrip=test&attach=无&clientip=171.221.146.208&notifyurl=http://d.byyl1013.com/moneyNotice&returnurl=http://d.byyl1013.com/moneyNotice&sign=FC82BCED4B75543635A72D7817FA5B78" 
    url = "http://d.byyl1013.com:80/moneyNotice?resultcode=1&transactionid=64088cd329a24cd4864b46ab7c6b6f&mchid=691406&mchno=20191113160609117396301833129385&tradetype=alipay&totalfee=1.00000&attach=无&sign=70917C229B57702E49550743B1CD5DD1"
#     print tp.check_sign(url)
    
    
#     print quote("http://d.byyl1011.com/moneyNotice")    
