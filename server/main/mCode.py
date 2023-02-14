#coding:utf8
import sys
reload(sys)
sys.path.append('..')
sys.setdefaultencoding('utf-8') 

import re
import time
import random
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import DT, TM, FLOAT, DateOffset, TimeOffset, DiffDay, S2TS, DiffSecond, TMS
from games.setting import services as Games
from common.key import KEY
import mUser as MU


'''TODO: test'''
'''以一定概率清理缓存，防止占用内存过大'''
def clearStopTime():
    if random.random() < 0.8: return
    if rs.hlen(KEY.StopTime) < 5000: return
    dts = rs.hgetall(KEY.StopTime, False)
    for (k, v) in dts.items():
        if DiffSecond(v) < -50000: rs.hdel(KEY.StopTime, k)
    
def getOpenTimes(name, count = 20):
    if name not in Games: return None
    ntm = TM()
    g = Games[name]['class']()
    lines, cache = [], set()
    tm = ntm
    while True:
        line = g.getOpenTime(tm)
        if DiffDay(ntm, line['stopTime']) > 0: break
        if line['issue'] not in cache: 
            cache.add(line['issue'])
            line['surplusTime'] = int((S2TS(line['stopTime']) - S2TS(ntm)) / 1000)
            lines.append(line)
            
            '''缓存备用'''
            KEY.setStopTime(name, line['issue'], line['stopTime'])
        '''不跨天'''
        if len(lines) >= count: break
        tm = TimeOffset(g.interval * 60, tm)
        if DiffDay(ntm, tm) > 0: break
    
    clearStopTime()
    return lines 

def getOpenTime(name):
    if name not in Games: return None
    result = Games[name]['class']().getOpenTime()
    # 暂时弃用该种获取当前期的方式，改为直接计算
    rs.hset("current", name, result) 
    
    return result 
    
    
def getBalance(user):
    db = Database()
    sql, params = ("select balance, balanceDeposit from user where username = %s"), (user, ) 
    balance = db.selectEx(sql, params)
    # if len(balance) == 0: balance = 0
    if len(balance) == 0: return 0, 0
    balance, dBalance = balance[0][0], balance[0][1]
    return balance, dBalance

def checkConsume(user, db = None):
    if not db: db = Database()
    sql = "select sum(amount) from book where account = %s and type = '1300' and status > 0 \
        and createTime > %s"
    money = db.selectEx(sql, (user, DateOffset(-30)))
    
    return FLOAT(money[0][0])

def preMoneyOut(user, db = None):
    info = rs.hget(KEY.UserInfo, user)
    if not info['allowWithdraw']: return False
    
    dts = _preMoneyOut(user, db = None)
    return dts[0] 

'''获取附加提现额度'''
def getOtherMoney(user, db = None):
    if not db: db = Database()
    sql = "select b.type, sum(amount), moneyRebateOut from book b right join user u on username=account \
        where account = %s and b.type = '1900' or b.type = '1400' group by b.type"
    sums, moneyRebateOut = 0, 0
    for (tp, m, rebateOut) in db.select(sql, (user, )):
        sums += m
        moneyRebateOut = rebateOut
    
    return sums - moneyRebateOut


'''----------------------------TODO: 未完成-------------------------------'''
def calcMoneyOut(last_recharge, all_recharge, consumption_since_last_recharge, all_consumption,\
                 rebate, balance, ratio):
    quota = rebate
    if all_consumption > all_recharge * ratio and consumption_since_last_recharge > last_recharge * ratio:
        quota = balance
    return quota

'''return tm1 > tm2'''
def time_cmp(tm1, tm2):    
    hmb, hme = re.split(":|：", tm1), re.split(":|：", tm2)
    if int(hmb[0]) > int(hme[0]): 
        return True
    elif int(hmb[0]) == int(hme[0]):
        return int(hmb[1]) > int(hme[1])
    else:
        return False

'''提现开放时间检测'''
def check_withdraw_status(conf):
    content = conf['withdrawTime'].strip()
    if content == '' or content == '-1': return True
    tms = content.split("~")
    if len(tms) == 1: tms = content.split("-")
    if len(tms) == 1: return True
    bt, et = tms
    current = time.localtime()
    tms = "{}:{}".format(current.tm_hour, current.tm_min)
    tms = "10:03"
    if time_cmp(bt, et):
        return (time_cmp(tms, bt) or time_cmp(et, tms)) 
    else:
        return (time_cmp(tms, bt) and time_cmp(et, tms)) 

'''提现相关配置'''
def get_withdraw_conf(db = None):
    if not db: db = Database()
    sql = "select name, value from config where name='withdrawTime' or name='percLimitWithdraw'"
    info = {}
    for (name, value) in db.select(sql, ()):
        info[name] = value
    
    return info
        
'''提现所需流水检测'''    
def check_limit_consume(user, db = None):
    if not db: db = Database()
    sql = "select amount, beginTime from consume_limit where username=%s"
    res = db.selectEx(sql, (user, ))
    if len(res) == 0: return 0
    amount, beginTime = res[0]
    sql = "select IFNULL(sum(amount), 0) consume from book where status=2 and type='1300' and account=%s and createTime>%s"
    info = db.selectData(sql, (user, beginTime))
    if info['consume'] >= amount: return 0
    return amount - info['consume']


'''获取历史计算结果和用户信息'''
def preAnalysisWithdraw(user, rate, db = None):
    if not db: db = Database()
    sql = "select c.id, IFNULL(amount, 0), beginTime, IFNULL(u.balance, 0), IFNULL(u.balanceDeposit, 0) \
        from consume_limit c right join user u \
        on u.username=c.username and c.username=%s order by beginTime desc limit 1"
    res = db.selectEx(sql, (user, ))
    block = res[0][1] / rate if res[0][1] else 0.0  
    return res[0][0] if res[0][0] else -1, block, res[0][2], res[0][3] + res[0][4]     
    
'''核心部分·限制提现额度'''    
def analysisWithdraw(user, db = None):
    if not db: db = Database()
    rate = float(rs.hget(KEY.Config, "percLimitWithdraw", False)) / 100.0
    cid, block, lastTime, balance = preAnalysisWithdraw(user, rate, db)
    param, whr = [user], ""
    if lastTime: param, whr = [user, lastTime], " and updateTime > %s " 
    
    sql = "select amount, type, balanceAfter from book where account = %s and status=2 and (type='1000' \
        or type='1300' or type='1600' or type='1100') " + whr + " order by updateTime"
    tps = {'1000': 0, '1600': 0, '1100': 0, '1300': 1, '1001': 2, '1101': 2}
    
    info = {'block': block, 'lastRecharge': 0, 'summary': [0, 0], 'balance': balance}
    
    '''暂不处理1001'''
    def calc(info, amount, left):
        block, lastRecharge, summary = info['block'], info['lastRecharge'], info['summary']
        fv = summary[1] / rate 
        if not lastRecharge:
            block = 0 if (block < fv or block == 0) else block - fv   
        else:
            b = lastRecharge - fv
            block = 0 if block < -b else block + b 
        if block > left: block = left
        info['lastRecharge'], info['block'], info['summary'] = amount, block, [0, 0]
        
    for (amount, _type, left) in db.select(sql, param):
        if tps[_type] != 0: 
            info['summary'][tps[_type]] += amount
        else:
            calc(info, amount, left)
        # print amount, left, '--->', tps[_type], info['block']
    print info, balance
    calc(info, 0, balance)
    info['lConsume'] = info['block'] * rate
    '''写入消费限制表'''
    MU.set_limit_consume('sys', user, info['lConsume'], TM(), "来自系统自动计算", cid)
    
    return info

def FM(v): return 0 if not v else float('%.3f' % v)     
    
def _preMoneyOut(user, db = None):
    if not db: db = Database()
    conf = get_withdraw_conf()
    
    sql = ('''select balance, balanceDeposit, blockedBalance, withdrawPassword, sum(m.amount), \
        count(m.amount), u.type, u.moneyReadyOut, allowWithdraw from user u left join money_out m \
        on username=m.account and orderTime >= %s where u.username = %s for update''')
    params = (DT(), user)
    cnx, cursor = db.Query(sql, params)
    info = cursor.fetchall()
    if len(info) == 0: 
        cursor.close()
        cnx.close()
        return (None, )
    
    balanceV, balance, bBalance, withdrawPassword, allowWithdraw = info[0][0], info[0][1], \
        info[0][2], info[0][3], info[0][8] 
    dailyAmount, dailyCount = FLOAT(info[0][4]), info[0][5]
    userType, moneyReadyOut = info[0][6], info[0][7]
    feeRate = rs.hget(KEY.Config, 'feeRate')
    '''时间检测'''
    isOpen = check_withdraw_status(conf)
    
    # perc = rs.hget(KEY.Config, 'percWithdraw')
    # if perc == None: perc = 0.33
    # 新规则
    # moneyAll = balance + balanceV * perc
    # limit = check_limit_consume(user, db)
    limit = analysisWithdraw(user, db)
    block, balanceAll = limit['block'], limit['balance']
    availableBalance = balanceAll if balanceAll < block else balanceAll - block 
    
    def C(name): return rs.hget(KEY.Config, name, False)
    data = {
        "accountCardList": MU.listCard(user),
        "myAccountStatus":{
            "totalBalance": FM(balanceAll),
            "blockedBalance": FM(block),
            "lotteryLimitAmount": limit['lConsume'], # (balance - bBalance) / 3.333, # 0.0,
            "baccaratLimitAmount": 0,
            "dailyAmount": dailyAmount,
            "hasWithdarwPwd": bool(withdrawPassword),
            "availableBalance":  FM(availableBalance),
            "dailyCount": dailyCount,
            "type": userType,
            "moneyReadyOut": FM(moneyReadyOut),
            "balanceV": FM(balanceV),
            "balanceD": FM(balance),
            "allowWithdraw": allowWithdraw
        },
        "withdrawConfig":{
            "freeDailyCount": int(C("freeDailyCount")),
            "maxDailyCount": int(C("maxDailyCount")),
            "isOpen": isOpen,
            "maxDailyAmount": eval(C("maxDailyAmount")),
            "maxUnitAmount": eval(C("maxUnitAmount")),
            "maxFee": eval(C("maxFee")),
            "serviceMsg":"",
            "serviceTime": C("withdrawTime"),
            "minUnitAmount": eval(C("minUnitAmount")),
            "feeRate": 0.1 if feeRate == None else feeRate,
        },
        "otcRemit":[

        ]
    }
    
    return data, withdrawPassword, cnx, cursor


def getLoopPage(user = "Lucy"):
    balance, dBalance = getBalance(user)
    data = {"lotteryBalance": balance, "balanceDeposit": dBalance, "balanceAll": balance + dBalance,
            "baccaratBalance":0.0,"totalBaccaratBalance":0.0, "msgCount":0, 'username':user}
    
    return data
    
def getGameLottery(name, user):
    balance, dBalance = getBalance(user)
    hasNewNotice = rs.hget('openNotice', user)
    if not hasNewNotice: 
        hasNewNotice = False
    data = {'lotteryBalance': balance, "balanceDeposit": dBalance, "balanceAll": balance + dBalance,
            'baccaratBalance': 0, 'msgCount': 0, 'totalBaccaratBalance': 0, 'hasNewNotice': hasNewNotice }
    if name in Games: data['gameOpenCode'] = Games[name]['class']().getOpenCode()        
    
    return data
    
def getOpenCode(name):
    if name in Games:
        records = rs.hgetall(name)
        items = records.items()
        items.sort(reverse=True)
        lines, items = [], items[:100]

        for (k, item) in items:
            _tms = item['time'] if 'time' in item else TMS()  
            line = { "lottery": name, "issue": item['issue'], "code": item['number'],
                    "code1": None, "code2": None, "time": _tms }
            lines.append(line)
        '''End For'''
        # print lines
        return lines
    return []


"""
新增的代码 开始
"""
def getIssueAndOpenCode():
    """
    获取所有的lottery信息
    :return:
    """
    res = {}
    for name in Games:
        records = rs.hgetall(name)
        if len(records) == 0:
            continue
        items = records.items()
        items.sort(reverse=True)
        lines, item = [], items[0]
        if len(item) == 0:
            continue
        item = item[-1]
        line = {"lottery": name, "issue": item['issue'], "code": item['number'],
                "code1": None, "code2": None, "time": item['time']}
        res.update({name:line})

    return res
"""
新增的代码 结束
"""






if __name__ == '__main__':
#     print getIssueAndOpenCode()
#     print check_withdraw_status()
#     print check_limit_consume("test004")
    analysisWithdraw("ceshi009")
#     print _preMoneyOut("test1994")
    pass
    # print getOpenCode('ah11x5')
#     print getOpenCode("qumin")
    
#     print getOpenCode("qqmin")
#     print float(None)
#     print time.localtime().tm_hour
#     def t():
#         return 1, 2
#     print t()[1]
#     print getGameLottery('cqssc', 'Lucy')
#     txt = '''
#         '''
#     print txt
#     import json
#     data = json.loads(txt.strip(), encoding="utf8")
    
#     for name in Games:
#         lines = getOpenTimes(name)
#         print lines
#     print getOpenTimes('bjssc')
#     print getOtherMoney('qq123')
#     print DiffSecond('2023-06-09 22:29:22', '2023-06-10 23:29:22')
#     print DiffSecond('2023-07-01 23:29:22')
#     print DiffSecond('2023-06-30 22:29:22')
    
    # print saveStopTime('qqmin', {'issue': '234570', 'stopTime':'2023-06-30 20:29:22'})
    # print rs.hget(KEY.Config, 'feeRate')
    