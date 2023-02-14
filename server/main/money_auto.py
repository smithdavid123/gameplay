#coding: utf8
'''
-----------------------------------------------------------
User
Date:       2019年9月25日
-----------------------------------------------------------
'''

from urllib import quote
from libs.redisEx2 import MyRedis as rs
from common.key import KEY
from libs.log import L
from libs.database import Database
from mBill import manageMoney
from pay.thepay import ThirdPAY as PAY_T
from pay.zbpay import ThirdPAY as PAY_ZB
from pay.long_river import ThirdPAY as PAY_LR
from pay.zlypay import check_sign_zly
from pay.method import get_pay_method
from config import Config as C

PAYS = {'zhepay': PAY_T, 'zbpay': PAY_ZB, 'lrpay': PAY_LR, 'zlypay': None}

def url_quote(url):
    if url[:7] == "http://":
        url = "http://" + quote(url[7:])
    elif url[:8] == "https://":
        url = "https://" + quote(url[8:])
    print url

def check_pay_source(billno, params, ip):
    M = get_pay_method(params['pid'], billno)
    '''特殊第三方，和别人不一样'''
    if M and M['paySource'] == 'zlypay':
        return True, C.PAY_URL_ZLY + "?mark=ok&user=" + billno
    return False, M['paySource']
    
'''调用第三方，并加入缓存'''
def getThirdPay(billno, data, ip = '127.0.0.1', pay_source="", db = None):
    flag, res = check_pay_source(billno, data, ip)
    if flag: return res
    
    tp = PAYS[pay_source]()
    tar = tp.getThirdPay(billno, data, ip)
    
    if tar:
        if not db: db = Database()
        sql = "update money_in set url = %s, ipAddr = %s where billno = %s"
        db.execute(sql, (tar, ip, billno))
        rs.hset(KEY.PayBill, billno, data['user'])
        L.log("return pay url: " + tar)
    return tar

'''获取支付通道密钥'''
def get_pay_info(billno):
    '''从缓存取出'''
    secret_key = rs.hget(KEY.BillPay, billno, False)
    fee_rate = rs.hget(KEY.PayFeeRate, billno, False)
    pay_source = rs.hget(KEY.BillPaySource, billno, False)
    
    if secret_key: return secret_key, fee_rate, pay_source
    db = Database()
    sql = "SELECT secretKey, b.feeRate, paySource FROM `money_in` a join pay_method b on a.pid=b.id where a.billno=%s"
    res = db.selectEx(sql, (billno, ))
    if len(res) == 0: return None
    
    return res[0]

'''修复实际支付金额'''
def repair_receive_money(billno, amount, fee_rate):
    print 'repair', billno, amount, fee_rate
    
#     db = Database()
#     sql = "SELECT  FROM `money_in` a join pay_method b on a.pid=b.id where a.billno=%s"
#     res = db.selectEx(sql, (billno, ))
#     if len(res) == 0: return None
    
    
'''TODO: 若用户充值金额少于订单金额，实际到帐金额需调整'''
def callback(R, url=""):
    L.sys("Receive Pay Notice: " + url)
    # 需智能识别第三方来源，调用对应的类处理
    
    billno = R.get(PAY_ZB.notice_names['mch_no'], '')    
    if billno == '': billno = R.get(PAY_LR.notice_names['mch_no'], '')
    if billno == '': billno = R.get('orderid', '')
        
    info = get_pay_info(billno)
    if not info: return 
        
    secret_key, fee_rate, pay_source = info
    PAY = PAYS[pay_source]
    
    if pay_source != 'zlypay': 
        tp = PAY()
        if not tp.check_sign(R, secret_key): 
            L.error("pay callback for {}, check sign error".format(pay_source))
            return False
        if str(R.get(PAY.notice_names['result_code'], '')) != PAY.SUCCESS_CODE:
            L.error("pay result code wrong!")
            '''该网站支付不成功也会回调''' 
            return False if pay_source != 'lrpay' else PAY.RESPONSE_SUCCESS 
    else:
        if not check_sign_zly(R, secret_key): 
            print 'pay zly sign error!!!!!!!!!!!!!!!!!!!!'
            return False
            
    db = Database()
    sql, params = ("select amount, account, status from money_in where billno = %s"), (billno, )
    rs = db.selectEx(sql, params)
    if len(rs) == 0 or str(rs[0][2]) != '0': return True 
    account = rs[0][1]
    
    # repair_receive_money(billno, R.get('receipt_amount', 0), fee_rate)
    
    flag = manageMoney('sys', account, billno, 2, "money_in", db)
    if pay_source == 'zlypay': 
        return "OK" if flag else "ERROR"
    else: 
        return PAY.RESPONSE_SUCCESS if flag else "ERROR"
    


if __name__ == '__main__':
#     print getThirdPay('1573352033958867218355929810583', {'payType': 'WXPAY', 'amount': '99', 'user': 'Lucy'})
#     print manageMoney('sys', 'qq123', '20191113160609117396301833129385', 2, "money_in")
#     tp = PAY()
#     billno = "20200221172315266034910630587700"
#     tar = tp.getThirdPay(billno, {'payType': 'ALIPAY', 'amount': '1', 'user': 'Lucy'}, "12309")
#     print tar
#     print get_secret_key(billno)
#     url = "https://thepay.vip/api/pay?memberid=10091&pay_type=201&trade_no=20200324174843966268&amount=208.00&notify_url=http://d.jinhua101.com/moneyNotice&sign=5faaa743d61453a94c73168b1cd69771"
#     url_quote(url)
#     import urlparse
#     url = "?memberid=200548655&orderid=20200526010536421765&transaction_id=2020052601054052505210&amount=1.0000&datetime=20200526014629&returncode=00&sign=2B8486FE274BAC4DDED66ED45D6223CA&attach="
#     query = urlparse.urlparse(url).query
#     print dict([(k, v[0]) for k, v in urlparse.parse_qs(query).items()])
    print get_pay_info("")
    