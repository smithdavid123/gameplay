#coding: utf8
'''
-----------------------------------------------------------

-----------------------------------------------------------
'''
import sys
sys.path.append('..')

import json
import urlparse
# import urllib2
# import urllib
from urllib import quote
from libs.redisEx2 import MyRedis as rs
from libs.utils import MD5
from common.key import KEY
from libs.log import L
from method import get_pay_method

class ThirdPAY(object):
    param_names = {
            'mch_id': 'memberid',          # 商户ID
            'mch_no': 'trade_no',          # 商户订单号
            'pay_type': 'pay_type',    # 支付类型
            'total_fee': 'amount',    # 总金额
            # 'user_id': 'userId',
            # 'type': 'type',
            'remark': 'mark',        # 备注说明
            # 'attach': 'attach',         # 附加数据，原样返回
            # 'client_ip': 'clientip',    # 客户端IP
            'json': 'json',
            'notify_url': 'notify_url',  # 回调通知地址
            'return_url': 'backurl'   # 返回跳转地址
    }
    notice_names = {
            # 'mch_id': 'merchantId',                  # 商户ID
            'mch_no': 'trade_no',                  # 商户订单号
            'pay_type': 'pay_type',            # 支付类型
            'pay_amount': 'pay_amount', # 下单请求金额
            'total_fee': 'receipt_amount',            # 总金额
            'pay_time': 'paydate',
            'attach': 'mark',                 # 附加数据，原样返回
            # 'result_code': 'status',        # 状态码，1成功 0失败
            # 'transaction_id': 'sysBizNum',  # 系统订单号
            'sign': 'sign',                     # 签名
    }
    RESULT_FIELD = "result_code"
    SUCCESS_CODE = "1"
    RESPONSE_TYPE = "string"
    RESPONSE_SUCCESS = "OK"
    
    
    
    notice_fields = ['trade_no', 'pay_type', 'pay_amount', 'receipt_amount', 'paydate', 'sign']
    param_index = dict((v, k) for k, v in param_names.items())
    notice_index = dict((v, k) for k, v in notice_names.items())
    need_verify = False
    use_cache = False
    
    
    '''调用第三方，并加入缓存'''
    def getThirdPay(self, billno, data, ip = '127.0.0.1'):
        if ThirdPAY.use_cache:
            url = rs.hget(KEY.PayUrl, billno, False)
            if url: return url
        
        tar = self.create_url(billno, data, ip)
        # 缓存支付链接
        if tar and ThirdPAY.use_cache: rs.hset(KEY.PayUrl, billno, tar)
            
        return tar
    
    def create_url(self, billno, data, ip):
        M = get_pay_method(data['pid'], billno)
        if not M: return None
        
        '''alipayh5 银联, ysfpay 云闪付'''
        params = { 'mch_no': billno, 'total_fee': format(float(data['amount']), ".2f")}
        params['mch_id'] = M['appId']
        params['pay_type'] = M['payMethod']
        params['remark'] = M['remark']
        # params['user_id'] = rs.hget(KEY.Config, 'payUserId', False)
        # params['attach'] = "无"
        # params['client_ip'] = ip
        params['json'] = 1
        
        params['notify_url'] = M['notifyUrl']
        params['return_url'] = M['returnUrl']
        
        url, sign = self.url_sign(params, M['secretKey'])
        url = M['server'] + '?' + url + '&sign=' + sign
        
        return url
    
    def url_sign(self, dt, secretKey = "yxheb7tb23c49z2cyq"):
        keys = ['memberid', 'pay_type', 'trade_no', 'amount', 'notify_url']
        url = '&'.join(k + '=' + str(dt.get(ThirdPAY.param_index[k], '')) for k in keys)
        return url, MD5(url + "" + secretKey)

    
    def check_sign(self, params, secret_key):
        fields = ThirdPAY.notice_fields
        for k in fields:
            if k not in params: return False
        
        txt = '&'.join([k + '=' + str(params[k]) for k in fields if k != 'sign'])
        sign = MD5(txt + "" + secret_key)
        if sign == params['sign']: return True
        
        return False    


'''--------------------------------------------华丽丽--------------------------------------------'''


if __name__ == '__main__':
    tp = ThirdPAY()   
    print tp.getThirdPay('22026829398070554143', {'amount': '100', 'user': 'Lucy', 'pid': 30})
    
    url = '''/sss?resultcode=1&mchid=5&mchno=201904121931111273&tradetype=weixin&totalfee=100.00
            &attach=test&transactionid=1201908061737579679&sign=D42F8D185F7D901B9D670490629055A7'''
    url = "http://cj.buy.yilidaochang.com/pay/payIndex?mchid=691406&mchno=20191113160609117396301833129385&tradetype=alipay&totalfee=100.0&descrip=test&attach=无&clientip=171.221.146.208&notifyurl=http://d.byyl1013.com/moneyNotice&returnurl=http://d.byyl1013.com/moneyNotice&sign=FC82BCED4B75543635A72D7817FA5B78" 
    url = "http://d.byyl1013.com:80/moneyNotice?resultcode=1&transactionid=64088cd329a24cd4864b46ab7c6b6f&mchid=691406&mchno=20191113160609117396301833129385&tradetype=alipay&totalfee=1.00000&attach=无&sign=70917C229B57702E49550743B1CD5DD1"
#     print tp.check_sign(url)
#     print quote("http://d.byyl1011.com/moneyNotice")    
#     print rs.hget(KEY.Config, "secretKey")
    
    