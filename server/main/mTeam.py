#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

import datetime
import random
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import DT2TMS, RandCode, TMN, DiffDay, TM
from libs.code import BookMark as BM, BookStatus as BS
from login import getAccount
from common.balance import Balance
from libs.log import L
from config import Config as C
from common.tools import common_operate

'''TODO: 根据级别设置可开户数量，及剩余名额'''
def preAddAccount(user):
    info = rs.hget('UserInfo', user)
    point = info['point']
    '''级别差别限制'''
    maxLevelDiff = rs.hget('config', 'maxLevelDiff')
    if not maxLevelDiff: maxLevelDiff = 9.0
    maxLevelDiff = float(maxLevelDiff) 
    if maxLevelDiff > 10: maxLevelDiff = maxLevelDiff / 20
    minPoint = point - maxLevelDiff
    point -= 0 if info['allowEqualCode'] else 0.1
    print 'ready for add account:', minPoint, point, maxLevelDiff
    
    res = {"lotteryAgentRange":{
            "minPoint": round(minPoint, 1) if minPoint > 0.0 else 0.0,
            "maxPoint": round(point, 1) if point <= C.MAX_POINT else C.MAX_POINT
        }, 'lotteryPlayerRange': {
            'minPoint': round(minPoint, 1) if minPoint > 0.0 else 0.0,
            'maxPoint': round(point, 1) if point <= C.MAX_POINT else C.MAX_POINT,
        }, 'lotteryCodeQuotaList': [],
           'totalAmountAll': 100,
           "surplusAmountAll": 100,
           "isNeedQuota": True
    }
    return res

'''生成邀请码'''
def getCode(db = None):
    if db == None: db = Database()
    sql = "select max(id) from links"
    ids = db.selectEx(sql, ())[0]
    newId = 0 if ids[0] == None else ids[0] + 1
    lts, lns = list('qwertyuioplkjhgfdsazxcvbnm'), list('qwertyuioplkjhgfdsazxcvbnm0123456789')
    nums = [random.randint(0, 9), random.choice(lts), newId, random.choice(lts)]
    code = ''.join([str(n) for n in nums])
    for i in range(9 - len(code)): code += random.choice(lns)
    
    return code
    
def createRegistLink(user, _type, tm, amount, lotteryPoint):
    db = Database()
    userInfo = rs.hget('UserInfo', user)
    if float(lotteryPoint) > userInfo['point']: return None
    
    days = tm.replace("days", '').strip()
    expireTime = None if days == "" else str(datetime.datetime.now() + datetime.timedelta(days = int(days)))
    code = getCode(db)
    
    keys = ['accountId', 'type', 'expireTime', 'code', 'amount', 'point']
    sql = ("insert into links (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")")
    item = {'accountId': user, 'type': _type, 'expireTime': expireTime, 'amount': amount, 
            'code': code, 'point': lotteryPoint}
    params = tuple([item[k] for k in keys])
    
    flag = db.execute(sql, params)
    
    if flag: return code

def delRegistLink(user, id_, own=True):
    db = Database()
    sql, params = "delete from links where id = %s", [id_]
    if own: 
        sql += " and accountId = %s"
        params.append(user)
    flag = db.execute(sql, tuple(params))
    
    if flag: return {}
    
def getRegistLink(username="", page = 0, size = 10, code="", status="", isDel=""):
    db = Database()
    keys = ["id", "code", "accountId", "point", "type", "expireTime", "visited", "amount", "addTime", "status", "isDel", "mark"]
    sql = "select " + ",".join(keys) + " from links where 1"
    params = []
    if username!="": 
        sql += " and accountId=%s"
        params.append(username)
    if code!="":
        sql += " and code=%s"
        params.append(code)
    if status!="":
        sql += " and status=%s"
        params.append(status)
    if isDel!="":
        sql += " and isDel=%s"
        params.append(isDel)
    
    L.debug(sql, params)
    lines = []
    host = C.MAIN_WEB_URL 
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line["addTime"] = DT2TMS(line["addTime"])
        if line["expireTime"]: line["expireTime"] = DT2TMS(line["expireTime"])
        line["url"] = host + "/reg.html?" + line['code']
        lines.append(line)
        
    return { "totalCount": count, "list": lines }
    
def searchOnlineUser(user, db = None, page = 0, size = 10):
    if db==None: db = Database()
    sql = '''select username, balance, balanceDeposit, baccaratBalance, loginTime  from user a join relation b
        on a.username=b.child and parent=%s and onlineStatus=1 and loginTime > %s'''
    tm = str(datetime.datetime.now() + datetime.timedelta(hours = -3))

    lines = []
    for (u, balance, dBalance, bBalance, tm) in db.select((sql), (user, tm)):
        lines.append({'username': u, 'lotteryBalance': balance + dBalance, 'baccaratBalance': bBalance, 
                      'loginTime': str(tm), 'relationships': [user]})
    sql = '''update user set onlineStatus=0 where onlineStatus=1 and loginTime < %s'''
    db.execute(sql, (tm, ))
    
    return { "totalCount": len(lines),"list": lines }
    
def getTeamOverview(user, sTime, eTime):
    db = Database()
    res = {'totalAccount': 0, 'totalAgent': 0, 'totalPlayer': 0, 'totalOnline': 0, 'lotteryBalance': 0.0,
           'totalBaccaratBalance': 0, 'baccaratBalance': 0}
    sql = '''select type, count(*), sum(balance), sum(balanceDeposit) from user a join relation b on \
        a.username=b.child and parent=%s group by a.type'''
    tps = {'0': 'totalPlayer', '1': 'totalAgent', '6': 'manager'}
    for (tp, ct, money, dMoney) in db.select((sql), (user, )):
        res[tps[tp]] = ct
        res['lotteryBalance'] += money + dMoney
        res['totalAccount'] += ct
    res['totalBalance'] = res['totalBaccaratBalance'] + res['lotteryBalance']
    res['totalOnline'] = searchOnlineUser(user, db)['totalCount']
    
    if DiffDay(sTime, eTime) > 31: return False, "你不能查询31天以前的数据"
    
    chart = getChartData(user, sTime, eTime, db)
    for k in chart: res[k] = chart[k]
        
    return True, res

def getChartData(user, sTime, eTime, db):
    if not db: db = Database()
    sql = '''
        select d, sum(case when b.type='1300' then amount end) consume, 
            sum(case when b.type='1301' then amount end) bonus, 
            sum(case when b.type='1000' or b.type='1600' then amount end) moneyIn, 
            sum(case when b.type='1001' then amount end) moneyOut, 
            sum(case when b.type='1400' or b.type='1302' then amount end) rebate, 
            sum(case when b.type='1200' then amount end) activity, sum(case when b.type='1234' then amount end) users 
        from (
            (select type, DATE_FORMAT(updateTime,'%Y%m%d') d, amount from book join relation r on account=r.child 
                and parent=%s where status=1 and updateTime between %s and %s) union all
            (SELECT '1234', DATE_FORMAT(registTime,'%Y%m%d') d, count(*) amount FROM `user` u join relation r on 
                u.username=r.child where r.parent=%s and registTime between %s and %s group by d)
        ) b group by d
    '''
    keys = ['uConsumeChart', 'uBonusChart', 'uRechargeChart', 'uWithdrawChart', 'uRebateChart', 'uActivityChart', 
            'uRegistChart']
    xAxis = []
    dts = dict((k, {'xAxis': xAxis, 'yAxis': [[]]}) for k in keys)
    params = (user, sTime, eTime, user, sTime, eTime)
    for item in db.select(sql, params):
        d = item[0]
        xAxis.append(d[0:4] + '-' + d[4:6] + '-' + d[6:8])
        for i in range(len(keys)):
            value = item[i + 1] if item[i + 1] else 0
            dts[keys[i]]['yAxis'][0].append(round(value, 2))
        '''End For 2'''
    '''End For 1'''
    
    return dts
    
    
def getSecurity(user, db = None):
    if not db: db = Database()
    sql = "select id, question from security where user = %s"
    res = db.selectEx(sql, (user,))
    
    if len(res) == 0: return None
    idx =  random.randint(0, len(res) - 1)
    return {'id': res[idx][0], 'question': res[idx][1]}

def checkSecurity(user, _id, answer, db = None):
    if not db: db = Database()
    sql = "select answer from security where user = %s and id = %s"
    res = db.selectEx(sql, (user, _id))
    
    if len(res) == 0: return False
    return answer == res[0][0]
    
def prepareTransfer(user, username):
    db = Database()
    keys = ['bindStatus', 'lockTime', 'loginTime', 'nickname', 'onlineStatus', 'registTime', 'type', 'username', 'status']
    mAccount = getAccount(user)
    uAccount = getAccount(username)
    accountM = dict((k, mAccount[k]) for k in keys)
    accountU = dict((k, uAccount[k]) for k in keys)
    security = getSecurity(user, db)
    
    return {'mAccount': accountM, 'security': security,'uAccount': accountU}

'''
充值的余额只能普通转账0，其它可以工资转账
    普通转账 -> 入deposit账户
    工资转账 -> 入virtual账户
:
A1            B1
    -     -
                普通
    -     -  
A2            B2

'''
def checkTransfer(user, bInfo, amount, transType):
    if transType == 0:
        '''若virtual账户可转出至对方deposit账户，则此大分支无需限定'''
        value = bInfo.deposit_before + bInfo.virtual_before
        if value < amount: return False, "当前用于普通转账的最高金额为{}".format(value)
    else:
        if bInfo.virtual_before < amount: return False, "当前用于工资转账的最高金额为{}".format(bInfo.virtual_before)
        
    return True, "OK"

'''正式转账'''
def applyTransfer(user, person, transType, amount, securityId, answer, withdrawPassword):
    db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", "mark", "status", "information"]
    if user.lower() == person.lower(): return False, "温馨提示：不可给自己转账！"
    if not checkSecurity(user, securityId, answer, db):
        return False, "密保答案输入错误！"
    
    '''查询用户信息'''
    types = {}
    users, balanceAfter = {user: None, person: None}, {user: None, person: None}
    amount = float(amount)
    sql = "select username, balance, balanceDeposit, withdrawPassword, type from user where username in (" + \
        ','.join(map(lambda x:'%s', users.keys())) + ") for update"
    cnx, cursor = db.Query(sql, tuple(users))
    for (name, balance, dBalance, password, tp) in cursor:
        if name == user and str(password) != str(withdrawPassword): return False, "资金密码输入错误！"
        if name in users: users[name] = Balance(balance, dBalance) # balance + dBalance
        types[name] = tp
    
    if users[user] == None or users[person] == None: return False, "用户信息有误！"
    
    '''两种转账的限制检测'''
    ck = checkTransfer(user, users[user], amount, transType)
    if not ck[0]: return ck
    
    sFlag = users[user].money_send(amount, transType)
    users[person].money_receive(amount, transType)
    if not sFlag: return False, "转账金额超过上限！" 
    
    if amount < 0: return False, "服务器后端不可能有这样低级的漏洞，谢谢！"
    if users[user].balance_after < 0: return False, "余额不足！"
    
    '''账单表'''
    pType = ['1100', '1102'][transType]
    mItem = {'account': user, 'accountType': types[user], 'balanceBefore': users[user].balance_before, 
             'balanceAfter': users[user].balance_after, 'reference': '', 'amount': amount, 'type': '1101',
             'mark': person, 'information': users[user].info(), 'billno': TMN() + RandCode(8), "status": BS.INIT}
    mItem['remarks'] = BM[mItem['type']]
    
    uItem = {'account': person, 'accountType': types[person], 'balanceBefore': users[person].balance_before, 
             'balanceAfter': users[person].balance_after, 'reference': '', 'amount': amount, 'type': pType,
             'mark': user, 'information': users[person].info(), 'billno': TMN() + RandCode(8), "status": BS.INIT}
    uItem['remarks'] = BM[uItem['type']]
    
    '''核心事务处理'''
    sqlM0, paramsM0 = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (users[user].virtual_after, users[user].deposit_after, user)
    sqlU0, paramsU0 = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (users[person].virtual_after, users[person].deposit_after, person)
    sqlM1, paramsM1 = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([mItem[k] for k in kBook])
    sqlU1, paramsU1 = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([uItem[k] for k in kBook])
    
    flag, rst = db.Transaction([[sqlM0, paramsM0], [sqlU0, paramsU0], [sqlM1, paramsM1], 
                                [sqlU1, paramsU1]], cnx, cursor, False)
    L.dbLog(flag, rst)
    return flag, rst
    
'''若为提现，需动余额表'''    
def preOperate(db, user, amount):
    sql = 'select balance, balanceDeposit, blockedBalance, moneyReadyOut, type from user where username = %s for update'
    params = (user, )
    cnx, cursor = db.Query(sql, params)
    info = cursor.fetchall()
    if len(info) == 0: 
        cursor.close()
        cnx.close()
        return None, "用户不存在" 
    
    balanceV, balance, bBalance, uType = info[0][0], info[0][1], info[0][2], info[0][4]
    # if (balanceV + balance) < amount: return None, '余额不足' 
    bl = Balance(balanceV, balance, bBalance)
    bl.apply_withdraw(amount)
    
    '''余额表更新'''
    moneyReadyOutAfter = bBalance + amount
    sqlU = "update user set balance = %s, balanceDeposit = %s, moneyReadyOut = %s, blockedBalance = %s where username = %s"
    paramsU = (bl.virtual_after, bl.deposit_after, moneyReadyOutAfter, bl.blocked_after, user)
    return True, [sqlU, paramsU, cnx, cursor, bl, uType] 
    
'''现更改为均需要确认才能入账'''    
def changeBalance(user, username, transType, amount, _remarks=None, _mark=''):
    db = Database()
    command = []
    cnx, cursor, bl, uType = None, None, None, 1
    if transType == 1:
        flag, rst = preOperate(db, username, amount)
        if not flag: return False, rst
        command.append(rst[:2])
        cnx, cursor, bl, uType = rst[2], rst[3], rst[4], rst[5]
        
    tbName = 'money_out' if transType == 1 else 'money_in'
    billno = TMN() + RandCode(3)
    data = {
        'account': username,
        "amount": amount,
        "feeRate": 0,
        "feeAmount": 0,
        "actualAmount": amount,
        "billno": billno,
        "mark": _mark,
        "userInfo": _remarks,
        "isSys": 1
    }
    if transType: 
        kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", 
             "reference", "remarks", "actualAmount", "bankCardId", "mark", "status", "information"]
        
        data['mDeposit'], data['mVirtual'] = bl.deposit_out, bl.virtual_out,
        '''财务记录'''
        itemB = {'account': username, 'accountType': uType, 'balanceBefore': bl.balance_before, 
                 'balanceAfter': bl.balance_after, 'reference': data['billno'], 'amount': amount, 
                 'type': '1001', 'actualAmount': amount, 'mark': '', 'bankCardId': '', 
                 'status': 0, 'information': bl.info()}
        itemB['remarks'], itemB['billno'] = BM[itemB['type']], TMN() + RandCode(8)
        sqlB = "insert into book (" + ','.join(kBook) + ") VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"
        paramsB = tuple([itemB[k] for k in kBook])
        command.append([sqlB, paramsB]);
        
    data["orderTime" if transType else "billTime"] = TM() 
    keys = data.keys()
    sql = "insert into " + tbName + " (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")"
    params = tuple([data[k] for k in keys])
    
    '''操作日志'''
    txt = "admin change balance, transType:{}, amount:{}, billno: {}".format(billno, amount, billno)
    line = common_operate(user, tbName, txt, username)
    command += [[sql, params], line]
    
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, rst

        
def _changeBalance(user, username, transType, amount, _remarks=None, _mark=''):
    db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", "status", "information", "mark"]
    sql = "select balance, balanceDeposit, type from user where username=%s for update"
    cnx, cursor = db.Query(sql, (username, ))
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    uType = res[0][2]
    bl = Balance(res[0][0], res[0][1])
    
    bType = '1600' if transType == 0 else '1601'
    if transType == 1: amount = -amount
    bl.money_add(amount)
    if bl.balance_after < 0: return False, "操作余额不能小于0！"
    
    '''账单表'''
    mItem = {'account': username, 'accountType': uType, 'balanceBefore': bl.balance_before, 
             'balanceAfter': bl.balance_after, "information": bl.info(), 'reference': '', 
             'amount': amount, 'type': bType, "status": BS.INIT, 'billno': TMN() + RandCode(8)}
    mItem['remarks'] = _remarks if _remarks else BM[mItem['type']]
    mItem['mark'] = _mark
    
    '''核心事务处理'''
    sqlU0, paramsU0 = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (bl.virtual_after, bl.deposit_after, username)
    sqlM1, paramsM1 = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([mItem[k] for k in kBook])
    
    flag, rst = db.Transaction([[sqlU0, paramsU0], [sqlM1, paramsM1]], cnx, cursor, False)
    L.dbLog(flag, rst)
    
    if flag: rst = {'balance': bl.balance_after}
    return flag, rst

if __name__ == '__main__':
    pass
    # print DiffDay('2023-01-04', '2023-02-07')
    # getChartData('Lucy', '2023-01-04', '2023-04-07')
#     print preAddAccount("Lucy")
#     print rs.hdel('bjpk10', '736039')
#     print getTeamOverview('Lucy', '2023-01-04', '2023-02-07')
#     print getCode()
    #createRegistLink('Lucy', 0, '', 100, 9.7)
    # print rs.hget('config', 'maxLevelDiff')
#     for i in range(5): print getSecurity('Lucy')
#     print searchOnlineUser('Lucy')
#     changeBalance("sys", 'test006', 0, 300, '充值', '')
#     changeBalance("sys", 'test006', 1, 350, '提现', '')
#     applyTransfer('a244173096', '', transType, amount, securityId, answer, withdrawPassword)
    
