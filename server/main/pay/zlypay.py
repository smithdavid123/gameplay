#coding: utf8

import hashlib
import time
import random
from method import get_pay_method

def Md5str(src):
    m = hashlib.md5( src.encode("utf8"))
    return m.hexdigest().upper()
def obtaindate():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
def order():
    pre=time.strftime("%Y%m%d%H%M%S", time.localtime())
    sub=random.randint(100000,999999) #输出 12
    return str(pre)+str(sub)


def get_params(billno, data):
    M = get_pay_method(data['pid'], billno)
    if not M: return None
    
    pay_amount = format(float(data['amount']), ".2f")
    pay_applydate = obtaindate()
    pay_bankcode = M['payMethod'] # 微信扫码支付 银行编码见附件
    pay_callbackurl = M['returnUrl'] #同步地址
    pay_memberid = M['appId']
    pay_notifyurl = M['notifyUrl'] #异步地址
    pay_orderid = billno
    keyValue = M['secretKey'] #商户APIKEY
    SignTemp = "pay_amount=" + pay_amount + "&pay_applydate=" + pay_applydate + "&pay_bankcode=" + pay_bankcode + "&pay_callbackurl=" + pay_callbackurl + "&pay_memberid=" + pay_memberid + "&pay_notifyurl=" + pay_notifyurl + "&pay_orderid=" + pay_orderid + "&key=" + keyValue + "";
    print(SignTemp)
    pay_md5sign = Md5str(SignTemp)
    pay_productname = "VIP基础服务"
    params = {
        'pay_amount': pay_amount, 'pay_applydate': pay_applydate, 'pay_bankcode': pay_bankcode,
        'pay_memberid': pay_memberid, 'pay_orderid': pay_orderid, 'keyValue': keyValue, 
        'pay_callbackurl': pay_callbackurl, 'pay_notifyurl': pay_notifyurl, 'pay_productname': pay_productname,
        'pay_md5sign': pay_md5sign, 
        'pay_server': M['server'], 'pay_method_name': M['payMethodName']
    }
    
    return params

def check_sign_zly(R, secret_key):
    sign = R.get('sign', '')
    keys = ['memberid', 'orderid', 'amount', 'transaction_id', 'returncode', 'datetime']
    params = dict((k, R.get(k, '')) for k in keys)
    keys.sort()
    url = '&'.join(k + '=' + str(params.get(k, '')) for k in keys)
    url += "&key=" + secret_key
    
    return Md5str(url) == sign

if __name__ == '__main__':
    txt = "amount=1.0000&datetime=20200526024442&memberid=200548655&orderid=20200526010536421765&returncode=00&transaction_id=2020052601054052505210"
    txt += "&key=" + "6ulsc26bljne1pwp3d8l2qvp6vfdxfv3"
    print Md5str(txt)
    