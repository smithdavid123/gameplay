#coding: utf8
'''
-----------------------------------------------------------
User
Date:       2019年9月25日
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

class ThirdPAY(object):
    param_names = {
            'mch_id': 'merchantId',          # 商户ID
            'mch_no': 'bizNum',          # 商户订单号
            'pay_type': 'payMethod',    # 支付类型
            'total_fee': 'money',    # 总金额
            'user_id': 'userId',
            'type': 'type',
            # 'remark': 'descrip',        # 备注说明
            # 'attach': 'attach',         # 附加数据，原样返回
            # 'client_ip': 'clientip',    # 客户端IP
            'notify_url': 'notifyAddress'  # 回调通知地址
            # 'return_url': 'returnurl'   # 返回跳转地址
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
    notice_fields = ['merchantBizNum', 'merchantId', 'money', 'status', 'sysBizNum', 'sign']
    param_index = dict((v, k) for k, v in param_names.items())
    notice_index = dict((v, k) for k, v in notice_names.items())
    need_verify = False
    use_cache = False
    
    def pay_type(self, m):
        methods = {'UNIONPAY': 'bank', 'ALIPAY': 'alipay', 'QUICK_PAY': 'bkpay', 
                'WXPAYH5': '', 'WXPAY': 'wechat', 'ALIPAYH5': 'alipay5', 
                'ALIPAYWEB': '', 'YUNSHANFU': 'ysf'}
        return methods.get(m, None)
    
    '''调用第三方，并加入缓存'''
    def getThirdPay(self, billno, data, ip = '127.0.0.1'):
        if ThirdPAY.use_cache:
            url = rs.hget(KEY.PayUrl, billno, False)
            if url: return url
        
        tar = self.create_url(billno, data, ip)
        if ThirdPAY.need_verify: tar = self.request_pay(tar)
        # 缓存支付链接
        if tar and ThirdPAY.use_cache: rs.hset(KEY.PayUrl, billno, tar)
            
        return tar
    
    def create_url(self, billno, data, ip):
        '''alipayh5 银联, ysfpay 云闪付'''
        params = { 'version': '1.0', 'format': 'json', 'mch_no': billno, 'total_fee': float(data['amount']) * 100.0}
        params['total_fee'] = int(params['total_fee'])
        params['mch_id'] = rs.hget(KEY.Config, 'appId', False)
        params['pay_type'] = self.pay_type(data['payType'])
        params['remark'] = rs.hget(KEY.Config, 'payDesp', False)
        params['user_id'] = rs.hget(KEY.Config, 'payUserId', False)
        # params['attach'] = "无"
        # params['client_ip'] = ip
        params['type'] = "recharge"
        
        params['notify_url'] = rs.hget(KEY.Config, 'notifyUrl', False)
        # params['return_url'] = rs.hget(KEY.Config, 'notifyUrl', False)
        
        secretKey = rs.hget(KEY.Config, 'secretKey', False)
        url, sign = self.url_sign(params, secretKey)
        server = rs.hget(KEY.Config, 'payServer', False) + rs.hget(KEY.Config, 'payUrl', False)
        url = server + '?' + url + '&sign=' + sign
        
        return url
    
    def url_sign(self, dt, secretKey = "yxheb7tb23c49z2cyq"):
        keys = ['bizNum', 'merchantId', 'money', 'notifyAddress', 'payMethod', 'type', 'userId']
        url = '&'.join(k + '=' + str(dt.get(ThirdPAY.param_index[k], '')) for k in keys)
        return url, MD5(url + "&key=" + secretKey).upper()

    
    def check_sign(self, params):
        fields = ThirdPAY.notice_fields
        secretKey = rs.hget(KEY.Config, 'secretKey', False)
        for k in fields:
            if k not in params: return False
        
        txt = '&'.join([k + '=' + str(params[k]) for k in fields if k != 'sign'])
        sign = MD5(txt + "&key=" + secretKey).upper()
        if sign == params['sign']: return True
        
        return False    



'''--------------------------------------------华丽丽--------------------------------------------'''




if __name__ == '__main__':
    print len('1573352033958867218355929810582')
    tp = ThirdPAY()
#     print tp.getThirdPay('1573352033958867218355929810582', {'payType': 'WXPAY', 'amount': '100', 'user': 'Lucy'})
    
    url = '''/sss?resultcode=1&mchid=5&mchno=201904121931111273&tradetype=weixin&totalfee=100.00
            &attach=test&transactionid=1201908061737579679&sign=D42F8D185F7D901B9D670490629055A7'''
    url = "http://cj.buy.yilidaochang.com/pay/payIndex?mchid=691406&mchno=20191113160609117396301833129385&tradetype=alipay&totalfee=100.0&descrip=test&attach=无&clientip=171.221.146.208&notifyurl=http://d.byyl1013.com/moneyNotice&returnurl=http://d.byyl1013.com/moneyNotice&sign=FC82BCED4B75543635A72D7817FA5B78" 
    url = "http://d.byyl1013.com:80/moneyNotice?resultcode=1&transactionid=64088cd329a24cd4864b46ab7c6b6f&mchid=691406&mchno=20191113160609117396301833129385&tradetype=alipay&totalfee=1.00000&attach=无&sign=70917C229B57702E49550743B1CD5DD1"
#     print tp.check_sign(url)
    print quote("http://d.byyl1011.com/moneyNotice")    