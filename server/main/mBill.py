#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

import time
import json
import random
from libs.database import Database
from libs.utils import DT2TMS, TM, DT, T2S, TMN, RandCode, DateOffset, CardR4
from libs.code import Money, Play, BookMark as BM, BookStatus as BS
from libs.common import GetWhr, SqlUser
from libs.log import L
from mCode import _preMoneyOut
from common.key import KEY
from common.balance import Balance
from libs.redisEx2 import MyRedis as rs
from config import Config as C
from mSystem import getActivity
from common.tools import common_operate

def CalcMoney(content, game = "ssc"):
    times, ps = 1, content.split(",")
    for p in ps: times *= len(p)
    return times

def modifyAvatar(user, avatar):
    db = Database()
    sql, params = "update user set avatar = %s where username = %s", (avatar, user)

    flag = db.execute(sql, params)
    return flag
 
'''用户充值'''
def getBillMoneyIn(billno, user = "Lucy"):
    db = Database()
    sql, params = ("select amount, payType, mark, account, pid from money_in where billno = %s"), (billno, )
    rs = db.selectEx(sql, params)
    if len(rs) != 1: return None
    return {'amount': rs[0][0], 'payType': rs[0][1], 'mark': rs[0][2], 'user': rs[0][3], 'pid': rs[0][4]}
    

def getUserToday(user):
    db = Database()
    sql = "select COALESCE(sum(case when b.type='1000' or b.type='1600' then amount end), 0) moneyIn, \
            COALESCE(sum(case when b.type='1300' then amount end), 0) consume, \
            COALESCE(sum(case when b.type='1301' then amount end), 0) bonus, \
            COALESCE(sum(case when b.type='1400' or b.type='1900' then amount end), 0) wage, \
            COALESCE(sum(case when b.type='1303' then amount end), 0) cancel \
            from book b where b.account=%s and status = 2 and updateTime between %s and %s"
    res = db.selectEx(sql, (user, DT(), DateOffset(1)))
    item = res[0]
    dt = {'moneyIn': item[0], 'consume': item[1], 'bonus': item[2], 
          'profit': item[2] + item[3] + item[4] - item[1] }
    
    return dt


def getTransferConfig(id_="", db = None):
    if not db: db = Database()
    keys = ['bankName', 'bankBranch', 'bankCardName', 'bankCardId', 'mark']
    # sql = "select " + ','.join(keys) + " from pay_transfer t join pay_method m on t.uuid=m.uuid where m.id = %s"
    sql = "select " + ','.join(keys) + " from pay_transfer where isStop=0" #  and payType=1 
    res = db.selectEx(sql, ())
    if len(res) == 0: return {}
    '''有多张卡启用时随机选一张'''
    idx = random.randint(0, len(res) - 1)
    
    return dict((k, res[idx][i]) for i, k in enumerate(keys))

    
'''充值请求'''   
def moneyIn(user, amount, pid, payType = '', userInfo = ''):
    db = Database()
    sql = "select feeRate, method, paySource from pay_method where id = %s"
    res = db.selectEx(sql, (pid, ))
    feeRate = 0.1 if len(res) == 0 else res[0][0] 
    '''三方Transfer表单无payType'''
    transfer = {}
    isTransfer = False
    if payType == '':
        isTransfer = True
        if len(res) > 0: payType = res[0][1] 
        transfer = getTransferConfig(pid, db)

    data = {
        'pid': pid,
        'account': user,
        "payType": payType,
        "amount": amount,
        "feeRate": feeRate,
        "feeAmount": feeRate * int(amount) / 100,
        "actualAmount": int(amount) - feeRate * int(amount) / 100,
        "billTime": TM(),
        "billno": TMN() + RandCode(3),
        "mark": RandCode(6),
        "userInfo": userInfo,
        "offLine": 1 if transfer else 0
    }
    '''目标卡信息需要入库'''
    if transfer: data["bankName"], data["bankCardId"] = transfer['bankName'], transfer['bankCardId'] 
    keys = data.keys()
    sql = ("insert into money_in (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")")
    params = tuple([data[k] for k in keys])
    
    db.execute(sql, params)
    '''写入缓存'''
    rs.hset(KEY.PayBill, data['billno'], user)
    for k in transfer: data[k] = transfer[k]
    
    '''防止用户输入过长'''
    if isTransfer: data['billno'] = data['billno'][C.MARK_BILLNO_LENGTH:]
    data["paySource"] = res[0][2]
    
    return data

def checkMoneyOut(user, amount, bankCardId, withdrawPassword, info, password):
    hour = time.localtime().tm_hour
    C, U = info['withdrawConfig'], info['myAccountStatus']
    cards = set([str(c['id']) for c in info['accountCardList']])
    feeAmount = 0 if U['dailyCount'] < C['freeDailyCount'] else  max(C['feeRate'] * amount, C['maxFee'])
    
    uInfo = rs.hget(KEY.UserInfo, user)
    if not uInfo['allowWithdraw']: return "0-0", "本用户为限制提现用户，如有疑问请联系客服或管理员！"
    
    if hour > 1 and hour < 9: return "1-0", "02:00 ~ 09:00暂停处理提现"
    if password != withdrawPassword: return "1-1", "提现密码错误"
    if U['dailyCount'] >= C['maxDailyCount']: return "1-2", "当日提现次数已达到上限" 
    if U['dailyAmount'] >= C['maxDailyAmount']: return "1-3", "当日提现总额达到上限" 
    if amount < C['minUnitAmount']: return "1-4", "提现金额小于单笔最小值" 
    if (amount + feeAmount) > U['availableBalance']: return "1-5", "金额超出当前可提上限"
    if amount > C['maxUnitAmount']: return "1-6", "金额超出单笔上限"
    if (amount + U['dailyAmount']) > C['maxDailyAmount']: return "1-7", "总金额超出本日上限"
    if str(bankCardId) not in cards: return "1-8", "银行卡有误！"
    
    return None, None

'''本次修改：
    增加moneyReadyOut字段，提交提现申请时直接减余额，同时待提现的钱入该字段，并入账本表，状态为0
    待提现确认时 ，减该字段，账本表状态改为1
    (注：可能是因为不知道blockedBalance的确切用途)
'''    
'''提现请求'''   
def applyWithdraw(user, amount, cardId, withdrawPassword):
    db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", 
             "reference", "remarks", "actualAmount", "bankCardId", "mark", "status", "information"]
    
    info, password, cnx, cursor = _preMoneyOut(user, db)
    if not int(info['myAccountStatus']['allowWithdraw']):
        return False, "本账户提现功能暂时无法使用，请联系客服或管理员！" 
    flag = checkMoneyOut(user, amount, cardId, withdrawPassword, info, password)
    if flag[0]: return flag
    
    C, U = info['withdrawConfig'], info['myAccountStatus']
    cards = dict((str(c['id']), c) for c in info['accountCardList'])
    bankCardId = cards[str(cardId)]['bankCardId']
    
    amount = float(amount)
    feeAmount = 0 if U['dailyCount'] < C['freeDailyCount'] else  max(C['feeRate'] * amount, C['maxFee'])
    
    bl = Balance(U['balanceV'], U['balanceD'], U['blockedBalance'])
    bl.apply_withdraw(amount)
    
    data = {
        'account': user,
        'bankCardId': bankCardId,
        "cardId": cardId,
        "amount": amount,
        "feeRate": C['feeRate'],
        "feeAmount": feeAmount,
        "actualAmount": amount - feeAmount,
        "orderTime": TM(),
        "billno": TMN() + RandCode(16),
        "mark": RandCode(6),
        "status": BS.MONEY_OUT,
        "mDeposit": bl.deposit_out,
        "mVirtual": bl.virtual_out,
    }
    keys = data.keys()
    sqlM = "insert into money_out (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")"
    paramsM = tuple([data[k] for k in keys])
    
    '''余额表更新'''
    moneyReadyOutAfter = U['moneyReadyOut'] + amount
    sqlU = "update user set balance = %s, balanceDeposit = %s, moneyReadyOut = %s, blockedBalance = %s where username = %s"
    paramsU = (bl.virtual_after, bl.deposit_after, moneyReadyOutAfter, bl.blocked_after, user)
    
    '''财务记录'''
    itemB = {'account': user, 'accountType': U['type'], 'balanceBefore': bl.balance_before, 
             'balanceAfter': bl.balance_after, 'reference': data['billno'], 'amount': amount, 
             'type': '1001', 'actualAmount': amount - feeAmount, 'mark': feeAmount, 'bankCardId': bankCardId, 
             'status': 0, 'information': bl.info()}
    itemB['remarks'], itemB['billno'] = BM[itemB['type']], TMN() + RandCode(8)
    sqlB = "insert into book (" + ','.join(kBook) + ") VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"
    paramsB = tuple([itemB[k] for k in kBook])
    
    flag, rst = db.Transaction([[sqlM, paramsM], [sqlU, paramsU], [sqlB, paramsB]], cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, None if flag else "请求错误！"


'''获取团队充值记录'''
def searchMoneyInTeam(user, sTime, eTime, method, page, size, billno = "", username = ""):
    users = ['PARENT', user] if username == "" else ['PARENT', user, username]
    lines = _searchMoneyIn(users, sTime, eTime, method, page, size, 'money_in', billno)
    
    return { "totalCount": len(lines), "list": lines}

'''获取团队充值记录'''
def searchMoneyOutTeam(user, sTime, eTime, method, page, size, billno = "", username = ""):
    users = ['PARENT', user] if username == "" else ['PARENT', user, username]
    lines = _searchMoneyOut(users, sTime, eTime, method, page, size, 'money_out', billno)
    
    return { "totalCount": len(lines), "list": lines}

def getPayTypes(db = None):
    if not db: db = Database()
    sql = "select id, type from pay_method"
    cache = {}
    for (id_, type_) in db.select(sql, ()): cache[id_] = type_
    
    return cache
    
'''获取充值记录'''
def manageMoneyIn(user='', status='', page=0, size=50, billno='', utype='', payMethod='', bTime="", eTime="", online=""):
    db = Database()
    cache = getPayTypes(db)
    keys = ["account", "billno", "amount", "payType", "confirmTime", "createTime", "mark", 
            "readIt", "pid", "userInfo"]
    params = []
    sql = "select " + ",".join(keys) + ", m.status, u.type, p.paySource src, p.payMethodName method from money_in m \
        join user u on u.username=account join pay_method p on p.id=m.pid where isSys=0"
    if user!='':
        sql += " and m.account = %s"
        params.append(user)
    if utype!='':
        sql += " and u.type = %s"
        params.append(utype)
    if bTime != "": 
        sql += " and m.confirmTime >= %s"
        params.append(bTime)
    if eTime != "": 
        sql += " and m.confirmTime <= %s"
        params.append(eTime)        
    if billno!='':
        sql += " and m.billno = %s"
        params.append(billno)   
    if status!='': 
        sql += " and m.status = %s"
        params.append(status)
    if payMethod!='': 
        sql += " and p.payMethodName = %s"
        params.append(payMethod)
    if online != "": sql += " and m.offLine = 0"
        
    sql += " order by createTime desc"
    
    L.debug(sql)
    lines, count = [], len(keys)
    totalCount, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['createTime'] = T2S(line['createTime'])
        line['confirmTime'] = T2S(line['confirmTime'])
        line['status'] = item[count]
        line['type'] = item[count + 1]
        line['pay_name'] = item[count + 2] + item[count + 3]
        if cache.get(line['pid'], 1) != 1: line['mark'] = line['billno'][C.MARK_BILLNO_LENGTH:]
        lines.append(line)
    
    return {'totalCount': totalCount, 'list': lines}

'''获取线下充值记录'''
def listMoneyInTransfor(user='', status='', page=0, size=50, billno='', realName='', payMethod='', \
                        mark="", bTime="", eTime="", bank="", cardId=""):
    db = Database()
    keys = ["account", "billno", "amount", "payType", "confirmTime", "createTime", "mark", 
            "readIt", "feeRate", "bankName", "bankCardId", "confirmUser", "transforMethod", "userInfo"]
    params = []
    sql = "select " + ",".join(keys) + ", m.status, u.type, u.realName from money_in m \
        join user u on u.username=account where m.offLine = 1 and isSys=0"
    if user!='':
        sql += " and m.account = %s"
        params.append(user)
    if mark!='':
        sql += " and m.mark = %s"
        params.append(mark)
    if billno!='':
        sql += " and m.billno = %s"
        params.append(billno)   
    if status!='': 
        sql += " and m.status = %s"
        params.append(status)
    if payMethod!='': 
        sql += " and m.transforMethod = %s"
        params.append(payMethod)
    if realName != "": 
        sql += " and u.realName = %s"
        params.append(realName)
    if bTime != "": 
        sql += " and m.createTime >= %s"
        params.append(bTime)
    if eTime != "": 
        sql += " and m.createTime <= %s"
        params.append(eTime)
    if bank != '': 
        sql += " and m.bankName = %s"
        params.append(bank)
    if cardId != '': 
        sql += " and m.bankCardId = %s"
        params.append(cardId)
    
    sql += " order by createTime desc"
    
    L.debug(sql)
    lines, count = [], len(keys)
    totalCount, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['createTime'] = T2S(line['createTime'])
        line['confirmTime'] = T2S(line['confirmTime'])
        line['status'] = item[count]
        line['type'] = item[count + 1]
        line['realName'] = item[count + 2]
        lines.append(line)
    
    return {'totalCount': totalCount, 'list': lines}

'''获取提现记录'''
def manageMoneyOut(user, status, page, size = 10):
    db = Database()
    keys = ["account", "billno", "amount", "payAction", "payType", "bankName", "bankBranch", "c.bankCardId", 
            "confirmTime", "createTime"]
    sql = "select " + ",".join(keys) + ", m.status, u.type, u.realName from money_out m join user u on \
        u.username=account join card c on m.cardId = c.id"
    sql += " and m.status = 0" if str(status)=='0' else " and m.status <> 0"
    sql += " order by createTime desc"
    params = []
    # L.debug(sql)
    lines, count = [], len(keys)
    totalCount, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['bankCardId'] = line['c.bankCardId']
        line['createTime'] = T2S(line['createTime'])
        line['confirmTime'] = T2S(line['confirmTime'])
        line['status'] = item[count]
        line['type'] = item[count + 1]
        line['realName'] = item[count + 2]
        
        del line['c.bankCardId']
        lines.append(line)
    
    return {'totalCount': totalCount, 'list': lines}


''' 获取提现记录 新 '''
def manageMoneyOutExt(account='',
                        status='',
                        page=0,
                        size=10,
                        billno='',
                        condition=1,
                        amount='',
                        bankName='',
                        bankCardName='',
                        createTime_s='',
                        createTime_e='',
                        confirmTime_s='',
                        confirmTime_e='',
                        checkTime_s='',
                        checkTime_e='',
                        checkStatus='',
                        forCaiwu = False
                      ):
    db = Database()
    keys = ["account", "billno", "amount", "feeAmount", "payAction", "payType", "bankName","bankCardName", "bankBranch", "c.bankCardId",
            "confirmTime", "createTime","checkStatus","checkTime","checkUser", "lockUser", "finishTime"]
    sql = "select " + ",".join(keys) + ", m.status, u.type, u.realName from money_out m join user u on \
        u.username=account left join card c on m.cardId = c.id where isSys = 0 "

    params = []
    if status!='':
        params.append(status)
        sql += " and m.status = %s"
    else:
        if forCaiwu: sql += "" # " and (m.checkStatus>0 or m.checkStatus=-2)"
        
    if account.strip() != "":
        params.append(account)
        sql += " and m.account = %s"

    if billno.strip() != "":
        params.append(billno)
        sql += " and m.billno = %s"

    if condition == 1 and amount.strip() != "":
        params.append(amount)
        sql += " and m.amount >= %s"
    elif condition == 2 and amount.strip() != "":
        params.append(amount)
        sql += " and m.amount <= %s"

    if bankName.strip() != "":
        params.append(bankName)
        sql += " and c.bankName = %s"

    if bankCardName.strip() != "":
        params.append(bankCardName)
        sql += " and c.bankCardName = %s"

    if createTime_s.strip() != "":
        params.append(createTime_s)
        sql += " and m.createTime >= %s"

    if createTime_e.strip() != "":
        params.append(createTime_e)
        sql += " and m.createTime <= %s"

    if confirmTime_s.strip() != "":
        params.append(confirmTime_s)
        sql += " and m.confirmTime >= %s"

    if confirmTime_e.strip() != "":
        params.append(confirmTime_e)
        sql += " and m.confirmTime <= %s"

    if checkTime_s.strip() != "":
        params.append(checkTime_s)
        sql += " and m.checkTime >= %s"
    if checkTime_e.strip() != "":
        params.append(checkTime_e)
        sql += " and m.checkTime <= %s"
    if checkStatus != "":
        params.append(checkStatus)
        sql += " and m.checkStatus = %s"

    sql += " order by createTime desc"
    
    L.debug(sql)
    lines, count = [], len(keys)
    totalCount, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['bankCardId'] = line['c.bankCardId']
        line['finishTime'] = T2S(line['finishTime'])
        line['confirmTime'] = T2S(line['confirmTime'])
        line['checkTime'] = T2S(line['checkTime'])
        line['createTime'] = T2S(line['createTime'])
        line['status'] = item[count]
        line['type'] = item[count + 1]
        line['realName'] = item[count + 2]
        line['payTime'] = ""
         
        del line['c.bankCardId']
        lines.append(line)

    return {'totalCount': totalCount, 'list': lines}

'''获取 银行卡列表 新'''
def get_bank_list(db = None, isAll=False):
    if not db: db = Database()
    keys = ['id','name','code','url','allowBindCard','withdrawStatus']
    sql = "select " + ",".join(keys) + " from bank where allowBindCard=1"
    if not isAll: sql += " and withdrawStatus=0"
    bank_list = db.read_all(sql)
    return bank_list

def set_bank_info(user, content):
    params = json.loads(content, encoding="utf8")
    db = Database()
    comands, id_ = [], params['id']
    del params['id'] 
    keys = params.keys()
    values = [params[k] for k in keys]
    sql = "update bank set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
    values.append(id_)
            
    '''操作日志'''    
    line = common_operate(user, 'banks', content, "")
    comands += [[sql, values], line]
    rst = db.Transaction(comands)
    
    return rst

"""获取充值统计"""
def rechargeCountList(recharge_type='',payName='',sTime='',eTime='',page=0,size=20):
    db = Database()
    sql = """
        select
           m.id,
           m.method,
           m.payMethodName as name,
           count(mi.billno) as count,
           ifnull(sum(mi.amount),0)  as amount,
           ifnull(sum(mi.actualAmount),0) as actualAmount,
           ifnull(sum(mi.feeAmount),0) as feeAmount
        from pay_method as m
        left join money_in as mi on m.id=mi.pid
        where mi.status=2 
    """
    params = []
    if recharge_type!='':
        sql += " and m.isTransfer=%s"
        params.append(recharge_type)
    if sTime.strip() != "" and eTime.strip() != "":
        params.append(sTime)
        params.append(eTime)
        sql += " and mi.confirmTime between %s and %s "

    if payName.strip() != "":
        params.append(payName)
        sql += " and m.paySource=%s "
    sql += " group by m.id"
    L.debug(sql)

    totalCount,lines = db.selectPageExt(sql,params=params,page=page,size=size)
    return {'totalCount': totalCount, 'list': lines}

"""风控审核TODO"""
def risk_check(user, name, _type, key, value):
    pass
    # db = Database()
    # sql = "update game_method set {} = %s where methodName = %s and type = %s".format(key)
    # keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    # sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    # paramsO = (user, 'game_config', key, name, value)
    #
    # comands = [[sql, (value, name, _type)], [sqlO, paramsO]]
    # rst = db.Transaction(comands)
    #
    # '''刷新缓存'''
    # if rst[0]:
    #     k = name + "_" + str(_type)
    #     line = rs.hget(KEY.Methods, k)
    #     line[key] = value
    #     print line
    #     print k, value
    #     rs.hset(KEY.Methods, k, line)
    #
    # return rst[0]

'''
取款时仅处理checkStatus为 2 或 -2 的订单
确认入账时checkStatus必须为 2, status 可为0或-1
拒绝时, checkStatus必须为 -2, 仅处理status为-1的单子, -1为财务审核后的结果
'''
# TODO: 申请时加了  moneyReadyOut 字段，此处未处理
'''param: bl - Balance对象'''
def refuseMoneyOut(user, username, billno, bl, db, cnx, cursor):
    '''变更充值表状态'''
    sqlM, paramsM = "update money_out set confirmUser = %s, confirmTime = %s, finishTime = %s, balanceAfter = %s, \
        status=-1 where billno = %s and status <> -1", (user, TM(), TM(), bl.balance_after, billno)
    
    '''余额更新'''
    sqlU = "update user set balance = %s, balanceDeposit = %s, blockedBalance = %s where username = %s"
    paramsU = (bl.virtual_after, bl.deposit_after, bl.blocked_after, username)
    sqlB = "update book set status = %s, updateTime = %s where reference = %s and account = %s"
    paramsB = (BS.MONEY_OUT_REFUSE, TM(), billno, username)
    
    commands = [[sqlM, paramsM], [sqlU, paramsU], [sqlB, paramsB]]
    
    return commands
    
'''取现管理'''
'''
param:    status: 1 - 确认, 0 - 拒绝
'''
def manageMoneySetOut(user, username, billno, status, firstRefuse=False):
    db = Database()
    tbName = "money_out"
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", 
             "reference", "remarks", "actualAmount", "mark", "status", "information"]
    
    '''用户表余额·获取并锁定余额'''
    sql = "select balance, balanceDeposit, blockedBalance, type from user where username = %s for update" 
    cnx, cursor = db.Query(sql, (username, ))
    userInfo = cursor.fetchall()
    if len(userInfo) == 0: return None, "用户信息有误"
    bl = Balance(userInfo[0][0], userInfo[0][1], userInfo[0][2])
    account, accountType = username, userInfo[0][3]
    
    '''表查询并锁定'''
    sqlBill = "select amount, mDeposit, mVirtual, actualAmount, feeAmount, checkStatus, lockUser, status, isSys from {} \
        where billno = %s and account = %s for update"    
    res = db.QueryLine(cursor, sqlBill.format(tbName), (billno, username))
    if not res: return None, "订单信息有误"
    checkStatus, checkUser, oStatus, isSys = int(res[5]), res[6], int(res[7]), int(res[8])
    
    if not isSys and not firstRefuse:
        if checkUser and checkUser != user: return None, "该订单被其它用户锁定，您无法操作！"
        if checkStatus != 2 and checkStatus != -2: return None, "订单为未审核或已完成状态，无法操作！"
    if (oStatus == -1 or oStatus == 2) and not firstRefuse: return None, "订单为已入账状态，操作失败！"
    bl.withdraw(res[1], res[2])
    
    commands = []
    '''拒绝'''
    if str(status) == '0' and (checkStatus == -2 or isSys or firstRefuse): 
        if (oStatus == -1 or oStatus == 2): return None, "订单为已入账状态，操作失败！"
        '''恢复余额'''
        bl.withdraw_cancel()
        commands = refuseMoneyOut(user, username, billno, bl, db, cnx, cursor)
        
        '''财务记录'''
        itemB = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
                 'balanceAfter': bl.balance_after, 'reference': billno, 'amount': bl.money_change, 
                 'type': '1002', 'actualAmount': bl.money_change, 'mark': '已拒绝', 
                 'status': BS.MONEY_OUT_REFUSE, 'information': bl.info()}
        itemB['remarks'], itemB['billno'] = BM[itemB['type']], TMN() + RandCode(8)
        sqlR, paramsR = ("insert into book (" + ','.join(kBook) + ") VALUES (" + \
                         ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([itemB[k] for k in kBook])
               
        commands += [[sqlR, paramsR]]
        print 'refuse money out', commands
    elif str(status) == '1' and (checkStatus == 2 or isSys):
        '''变更提现表状态'''
        sqlM = "update {} set confirmUser = %s, confirmTime = %s, finishTime = %s, balanceAfter = %s, checkStatus = 3, \
                status = 2 where billno = %s".format(tbName)
        paramsM = (user, TM(), TM(), bl.balance_before, billno)
        '''余额更新'''
        sqlU, paramsU = ("update user set blockedBalance = %s where username = %s"), (bl.blocked_after, account)
        
        sqlB = "update book set status = %s, updateTime = %s where reference = %s and account = %s"
        paramsB = (BS.MONEY_OUT_OK, TM(), billno, account)
        
        commands = [[sqlM, paramsM], [sqlU, paramsU], [sqlB, paramsB]]
        print commands 
    '''End If'''
    
    '''综合事务处理'''
    flag, rst = db.Transaction(commands, cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, "操作失败！"

def calcActivity(money, db = None):
    if not db: db = Database()
    addition = 0
    res = getActivity(db)
    if not res: return addition
    if int(res['status']) == 0: return addition
    lines = json.loads(res['content'])
    lines.sort(key=lambda x: int(x['base']))
    if len(lines) == 0 or int(lines[0]['base']) > money: return addition
    idx = -1
    for item in lines:
        if int(item['base']) > money: break
        idx += 1
    
    return int(lines[idx]['additional'])


'''充值确认: 1-拒绝，0-同意'''
def manageMoney(user, username, billno, status, tbName = 'money_in', db = None, refuseReason=''):
    if not db: db = Database()
    '''拒绝'''
    if str(status) == '1':
        sql = "update {} set status = -1, confirmUser = %s, confirmTime = %s, refuseReason=%s where billno = %s \
            and status = 0".format(tbName)
        db.execute((sql), (user, TM(), refuseReason, billno))
        return True
    
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", 
             "reference", "remarks", "actualAmount", "mark", "status", "information"]
    
    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (username, ) 
    cnx, cursor = db.Query(sql, params)
    userInfo = cursor.fetchall()
    if len(userInfo) == 0: return None
    
    bl = Balance(userInfo[0][0], userInfo[0][1])
    account, accountType = username, userInfo[0][2]
    
    '''充值表查询并锁定'''
    sqlBill = "select amount, actualAmount, feeAmount from {} where billno = %s and account = %s \
            and status = 0 for update"    
    res = db.QueryLine(cursor, sqlBill.format(tbName), (billno, username))
    print sqlBill.format(tbName), billno, username
    
    if not res: return None
    money, actualAmount, feeAmount = res[0], res[1], res[2]
    '''优惠活动附加金额'''
    additional = calcActivity(actualAmount, db) 
    
    '''余额更新'''
    bl.deposit(actualAmount, additional)
    
    sqlU, paramsU = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (bl.virtual_after, bl.deposit_after, account)

    '''变更充值表状态'''
    sqlM = "update {} set status = 2, confirmUser = %s, confirmTime = %s, balanceAfter = %s where \
            billno = %s".format(tbName)
    paramsM = (user, TM(), bl.balance_after, billno)
    
    '''财务记录'''
    itemB = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
             'balanceAfter': bl.balance_after, 'reference': billno, 'amount': money, 'type': '1000', 
             'actualAmount': actualAmount, 'mark': feeAmount, "information": bl.info(), "status": BS.INIT}
    itemB['remarks'], itemB['billno'] = BM[itemB['type']], TMN() + RandCode(8)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([itemB[k] for k in kBook])
           
    commands = [[sqlM, paramsM], [sqlB, paramsB], [sqlU, paramsU]]
    
    '''综合事务处理'''
    rst = db.Transaction(commands, cnx, cursor, False)
    
    return rst[0]
            
'''--------------------------------------------------------------------------------------------'''
'''['ALL'] - 查所有, ['SELF', user] - 查自己, ['PARENT', user, username] - 查下线'''
def _searchMoneyOut(users, sTime, eTime, method, page, size, tbName, billno = ""):
    db = Database()
    keys = ["account", "billno", "amount", "actualAmount", "balanceAfter", "status", 
            "bankCardId", "createTime", "mark"]
    sql = "select " + ",".join(keys) + " from " + tbName + ""
    '''判断是否为下线查询'''
    sql += GetWhr(users)
    
    '''财务表筛选'''
    if tbName == 'book': sql += " and (type = '1001' or type = '1601')"
    print sql
    lines = moneyLines(users, sTime, eTime, method, page, size, billno, sql, keys, db, 'out')
    
    return lines

def moneyLines(users, sTime, eTime, method, page, size, billno, sql, keys, db, style = 'in'):
    params = [sTime, eTime]
    if method.strip()!='':
        sql += " and method = %s"
        params.append(method)
    if billno.strip()!='':
        sql += " and billno = %s"
        params.append(billno)
    sql = SqlUser(users, sql, params)
    
    #  print sql, params
    lines = []
    for item in db.select((sql), tuple(params)):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['orderStatus'] = line['status']
        # line['orderTime'] = DT2TMS(line['createTime'])
        line['payTime' if style=='in' else 'orderTime'] = DT2TMS(line['createTime'])
        line['infos'] = line['mark']
        if 'bankCardId' in line: line['bankCardId'] = CardR4(line['bankCardId'])
        del line['createTime']
        del line['mark']
        del line['status']
        
        lines.append(line)
    
    return lines
   
'''获取自身提现记录'''
def searchMoneyOut(user, sTime, eTime, method, page, size, billno = ""):
#     lines = _searchMoneyOut(['SELF', user], sTime, eTime, method, page, size, 'money_out', billno)
    lines2 = _searchMoneyOut(['SELF', user], sTime, eTime, method, page, size, 'book', billno)
    
#     return { "totalCount": len(lines) + len(lines2),"list": lines + lines2}
    return { "totalCount": len(lines2),"list": lines2}

'''获取自身充值记录'''
def searchMoneyIn(user, sTime, eTime, method, page, size, billno = ""):
#     lines = _searchMoneyIn(['SELF', user], sTime, eTime, method, page, size, 'money_in', billno)
    lines2 = _searchMoneyIn(['SELF', user], sTime, eTime, method, page, size, 'book', billno)
    
#     return { "totalCount": len(lines) + len(lines2),"list": lines + lines2}
    return { "totalCount": len(lines2),"list": lines2}

'''['ALL'] - 查所有, ['SELF', user] - 查自己, ['PARENT', user, username] - 查下线'''
def _searchMoneyIn(users, sTime, eTime, method, page, size, tbName, billno = ""):
    db = Database()
    keys = ["account", "billno", "amount", "actualAmount", "method", "balanceAfter", "status", "createTime", "mark"]
    sql = "select " + ",".join(keys) + " from " + tbName
    '''判断是否为下线查询'''
    sql += GetWhr(users)
    
    '''财务表筛选'''
    if tbName == 'book': sql += " and (type = '1000' or type = '1600')"
    if tbName == 'money_in': sql += " and status = 0"
    
    lines = moneyLines(users, sTime, eTime, method, page, size, billno, sql, keys, db)
    
    return lines;
    
    
'''['ALL'] - 查所有, ['SELF', user] - 查自己, ['PARENT', user, username] - 查下线'''
def searchBill(users, sTime, eTime, _type = '', issue = '', page = 0, size = 10):
    db = Database()
    '''方便个人查询'''
    if type(users) != type([]): users = ['SELF', users]
    keys = ["a.id", "billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", 
            "reference", "remarks", "updateTime"]
    sql = "select " + ",".join(keys) + " from book a"
    sql += GetWhr(users, "updateTime") + " and isChaseSub = 0"
    
    params = [sTime, eTime]
    if _type.strip()!='':
        sql += " and type = %s"
        params.append(_type)
    if issue.strip()!='':
        sql += " and issue = %s"
        params.append(issue)
    
    lines, sql = [], SqlUser(users, sql, params)
    L.debug(sql, params)
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line["time"] = DT2TMS(line["updateTime"])
        line["amount"] = float('%.3f' % line["amount"])
        line["balanceBefore"] = float('%.3f' % line["balanceBefore"])
        line["balanceAfter"] = float('%.3f' % line["balanceAfter"])
        del line["updateTime"]
        lines.append(line)
    
    return { "totalCount": count, "list": lines }
    
    
if __name__ == '__main__':
#     print rechargeCountList()
#     print len(TMN())
#     print manageMoneyIn('', '2', 0, 50, '', 1, '支付宝扫码')
#     print rechargeCountList()
#     print getTransferConfig()
    
#     searchBill('Lucy', '2023-01-04', '2023-02-07', '1300')
    # print manageMoneyIn('', 0, 0, 0)
#     print manageMoney('sys', 'test006', '20200520010904551684', 0, tbName = 'money_in')
     
#     print manageMoneySetOut('sys', 'test006', '20200520010912205011', 1)[1]
    # print manageMoneySetOut('sys', 'test1992', '202005311659579288608086343192654', 0)[1]
    print json.dumps(searchBill("wyc002", "2023-06-11", "2023-06-12", "", "", 0, 100), ensure_ascii=False)
    
#     searchOrder("Lucy")
#     applyWithdraw("Lucy", 1000, '1', '123456')
    
#     print manageMoneyOut("Lucy", 0, 0, 10)
#     print getUserToday('yiming')
 
#     print manageMoneyIn('', 0, 0, 50)
#     correctCode = str(rs.hget('securityCode', 1567797650877, False))
#     print correctCode
    
#     print calcActivity(50)
#     print calcActivity(500)
#     print calcActivity(1000)
#     users = ['SELF', "test1994"]
#     users = ['ALL', '']
#     data = searchBill('', "2023-01-01", "2023-05-01", "", '', 0, 20)
#     data = searchMoneyIn("test1994", "2023-04-01", "2023-05-01", "", 0, 20, "")
#     print json.dumps(data, ensure_ascii=False) 
#     print rechargeCountList('', '', "2023-05-02", "2023-05-03")
    