#coding:utf8
'''
===================================================
Description：
===================================================
'''
import sys
sys.path.append("..")

from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from common.key import KEY

def get_pay_method(pid, billno):
    db = Database()
    keys = ['feeRate', 'timesDay', 'autoMoney', 'secretKey', 'appId', 'payUserId', 'paySource', 'payMethod', 
            'remark', 'payMethodName', 'paySource']
    sql = "select " + ",".join(keys) +  ", value, message, info from pay_method p left join config c \
        on p.paySource=c.name where (c.category='paySource' or p.isTransfer=1) and p.id = %s and p.status=0"
    res = db.selectEx(sql, (pid, ))
    print sql
    if len(res) == 0: return
    dt = dict((keys[i], res[0][i]) for i in range(len(keys)))
    dt['server'], dt['notifyUrl'], dt['returnUrl'] = res[0][-3:] 
    dt['payMethod'] = dt['payMethod'].split("-")[-1]
    
    rs.hset(KEY.BillPay, billno, dt['secretKey'])
    rs.hset(KEY.PayFeeRate, billno, dt['feeRate'])
    rs.hset(KEY.BillPaySource, billno, dt['paySource'])
    
    return dt


if __name__ == '__main__':
    print get_pay_method(30)