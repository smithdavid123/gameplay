#coding: utf8
'''
-----------------------------------------------------------
User
Date:       2019年9月25日
-----------------------------------------------------------
'''

import json
import urlparse
import urllib2
import urllib
from libs.redisEx2 import MyRedis as rs
from libs.utils import MD5
from common.key import KEY
from libs.log import L
from libs.database import Database
from mBill import manageMoney

class ThirdPAY():
    
    def pay_type(self, m):
        methods = {'UNIONPAY': 'unionpay.native', 'ALIPAY': 'alipay.native', 'QUICK_PAY': 'unionpay.quick', 
                'WXPAYH5': 'wechat.h5', 'WXPAY': 'wechat.native', 'ALIPAYH5': 'alipay.wap', 
                'ALIPAYWEB': 'alipay.web'}
        return methods.get(m, None)
    
    '''调用第三方，并加入缓存'''
    def getThirdPay(self, billno, data, ip = '127.0.0.1'):
        url = rs.hget(KEY.PayUrl, billno, False)
        if url: return url
        
        tmp = self.create_url(billno, data)
        tar = self.request_pay(tmp)
        if tar:
            db = Database()
            sql = "update money_in set url = %s, ipAddr = %s where billno = %s"
            db.execute(sql, (tar, ip, billno))
            rs.hset(KEY.PayUrl, billno, tar)
            
        return tar
    
    @staticmethod
    def create_url(self, billno, data):
        '''alipayh5 银联, ysfpay 云闪付'''
        params = { 'version': '1.0', 'out_trade_no': billno, 'total_fee': data['amount'], 
                  'format': 'json'}
        params['mch_id'] = rs.hget(KEY.Config, 'appId', False)
        params['pay_type'] = self.pay_type(data['payType'])
        params['remark'] = rs.hget(KEY.Config, 'payDesp', False)
        params['notify_url'] = rs.hget(KEY.Config, 'notifyUrl', False)
        params['return_url'] = rs.hget(KEY.Config, 'notifyUrl', False)
        
        secretKey = rs.hget(KEY.Config, 'secretKey', False)
        url, sign = self.url_sign(params, secretKey)
        server = rs.hget(KEY.Config, 'payServer', False) + rs.hget(KEY.Config, 'payUrl', False)
        url = server + '?' + url + '&sign=' + sign
        
        return url 
    
    def url_sign(self, dt, secretKey = "yxheb7tb23c49z2cyq"):
        keys = ['format', 'mch_id', 'notify_url', 'out_trade_no', 'pay_type', 'remark', 
                'return_url', 'total_fee', 'version']
        url = '&'.join(k + '=' + str(dt.get(k, '')) for k in keys if (k in dt and dt[k]!=''))
        return url, MD5(url + "&" + secretKey).lower()

    def request_pay(self, url):
        data = None
        try:
            opener = urllib2.build_opener()
            opener.addheaders = [('User-agent', 'Mozilla/5.0'), 
                                 ("Content-Type", "application/x-www-form-urlencoded")]
            response = opener.open(url, timeout = 5)
            res = response.read()
            res = json.loads(res, encoding = "utf8")
            if res['data']: data = res['data']['url']
        except Exception as e:
            L.error(str(e) + url)
        return data

    



'''--------------------------------------------华丽丽--------------------------------------------'''
def check_sign(url, secretKey = "test"):
    fields = ['version', 'status', 'mch_id', 'trade_no', 'out_trade_no', 'total_fee', 'pay_money', 
            'pay_type', 'remark', 'sign']

    url = "/sss?mch_id=5&out_trade_no=201904121931111273&pay_money=100.00&pay_type=alipay.wap&remark=test&status=1&total_fee=100.00&trade_no=1201908061737579679&version=1.0&6rUHNTwkWzD************MAlF3gZsOnP0"
    result = urlparse.urlparse(url)
    params = dict([(k, urlparse.unquote(v[0])) for k, v in urlparse.parse_qs(result.query).items()])
    for k in fields:
        if k not in params: print 'error', k
        
    keys = sorted(params.keys())
    txt = '&'.join([k + '=' + params[k] for k in keys if params[k]!=''])
    sign = MD5(txt + "&" + secretKey).lower()
    
    print params
    print keys
    print txt
    print sign
    
    return

def callback(R):
    fields = ['version', 'status', 'mch_id', 'trade_no', 'out_trade_no', 'total_fee', 'pay_money', 
            'pay_type', 'remark', 'sign']
    billno = R.get('out_trade_no', '')
    user = rs.hget(KEY.PayBill, billno) 
    manageMoney('sys', user, billno, 2)
    
    
    pass



if __name__ == '__main__':
#     print data_sign({'mchid': 123})
    print len('20190907143727147214399209506657')
    url = getThirdPay('20190907143727147214399209506657', {'payType': 'WXPAY', 'amount': '199'})
    print url
    
#     print request_pay(url)
#     check_sign("")


    