#coding: utf8
'''
-----------------------------------------------------------
User
Date:       2019年9月25日
-----------------------------------------------------------
'''
from libs.redisEx2 import MyRedis as rs
from libs.utils import MD5
import base64
from common.key import KEY


def callback(R):
    keys = ['resultcode', 'transactionid', 'mchid', 'mchno', 'tradetype', 'totalfee', 'attach', 'sign']
    params = dict((k, R.get(k, '')) for k in keys)
    for k in keys:
        print k, params[k]
    
    # print resultcode, transactionid, mchid, mchno, tradetype, totalfee, attach, sign
    # resultcode = 


def getThirdPay(billno, data, ip = '112.44.72.84'):
    '''alipayh5 银联, ysfpay 云闪付'''
    params = { 'mchno': billno, 'totalfee': float(data['amount'] * 100.0), 'attach': '1', 'clientip': ip}
    params['tradetype'] = data['payType'].lower()
    params['descrip'] = rs.hget(KEY.Config, 'payDesp', False)
    params['mchid'] = rs.hget(KEY.Config, 'appId', False)
    params['notifyurl'] = rs.hget(KEY.Config, 'notifyUrl', False)
    params['returnurl'] = rs.hget(KEY.Config, 'notifyUrl', False)
    
    
    secretKey = rs.hget(KEY.Config, 'secretKey', False)
    url, sign = url_sign(params, secretKey)
    server = rs.hget(KEY.Config, 'payServer', False) + rs.hget(KEY.Config, 'payUrl', False)
    url = server + '?' + url + '&sign=' + sign
    
    print url
#     print request_url()
    return
    fPath = os.path.dirname(__file__) + "/static/images/"
    payType = data['payType'] if data['payType'] != '' else 'OTHER'
    base64_data, fName = "", rs.hget(KEY.PayMethods, payType)['image']
    print fName
    try:
        with open(fPath + fName, "rb") as f:
            base64_data = base64.b64encode(f.read())
    except:
        print 'Error Image', fName
    context = {
        "amount": data['amount'],
        "codeUrl": "data:image/png;base64," + base64_data,
        "payType": data['payType'],
        "urlType": 'Base64',
        "billno": billno,
        "mark": data['mark']
    }
    
    return context


def url_sign(dt, secretKey = "yxheb7tb23c49z2cyq"):
    keys = ['mchid', 'mchno', 'tradetype', 'totalfee', 'descrip', 'attach', 'clientip', \
            'notifyurl', 'returnurl']
    url = '&'.join(k + '=' + str(dt.get(k, '')) for k in keys)
    return url, MD5(url + "&key=" + secretKey).upper()
    


if __name__ == '__main__':
#     print data_sign({'mchid': 123})
    getThirdPay('2019092612345', {'payType': 'weixin', 'amount': 200})
    
    