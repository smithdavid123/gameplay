#coding:utf8
from libs.common import GetWhr, SqlUser
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import LaterNow, TM, T2S, TMN, S2TS, RandCode, KV2Dict, DT2TMS, DT, NextDay, PreNow
from games.gameList import GameList as S
from libs.code import Money, Play, BookMark as BM, BookStatus as BS
from common.play import GetTool
from common.utils import Bonus
from common.key import KEY
from common.balance import Balance
from libs.log import L
import copy
import json
from mOrder import getOrder, checkMethodLimit

'''
game_chase 存储主体追单信息

{
    "orderList":[{"lottery":"cqssc","method":"sxzhixfsz","content":"-,8,6,5,-","model":"li","code":1996,"compress":false}],
    "planList":[{"issue":"20190521-037","multiple":1},{"issue":"20190521-038","multiple":1}],
    "winStop":true
}
'''


'''billno为表game_order中某记录的订单号'''
def stopAfterWin(account, billno, db = None):
    if not db: db = Database()
    sql = "select c.billno from game_order o join game_chase c on o.chaseId=c.billno where o.billno = %s \
        and c.account=%s and c.status=0 and o.status=2 and c.isWinStop=1"
    res = db.selectEx(sql, (billno, account))
    if len(res) == 0: return False
    
    cBillno = res[0][0]
    
    return cancelChase(account, cBillno, db)
    
def checkCancel(billno, db = None):
    if not db: db = Database()
    sql = "select o.lottery, issue, stopTime from game_order o join game_chase c on chaseId=c.billno \
        where o.chaseId = %s and c.status = 0 and o.status = 0"
    res = db.selectEx(sql, (billno, ))
    if len(res) == 0: return False
    for (lottery, issue, stopTime) in res:
        if not PreNow(stopTime): return True
        if checkOpenHistory(lottery, issue): return True
        
    return False

def cancelChase(account, billno, db = None):
    if not db: db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    if not checkCancel(billno, db):
        return False, "撤销失败，订单已撤销或已追号完毕！"
    
    '''查询订单信息'''
    whr = "c.status = 0 and c.billno=%s and c.account = %s"
    sql = "select o.id, o.lottery, issue, o.money, stopTime, mVirtual, mDeposit from game_order o join game_chase \
        c on chaseId=c.billno where o.account = %s and o.status = 0 and " + whr + " for update"
    cnx, cursor = db.Query(sql, (account, billno, account))
    ids, sumMoney, oDeposit, oVirtual = [], 0.0, 0.0, 0.0
    for (_id, lottery, issue, money, stopTime, v, d) in cursor:
        if not PreNow(stopTime) or checkOpenHistory(lottery, issue):
            oVirtual, oDeposit, sumMoney = oVirtual + v, oDeposit + d, sumMoney + money
            ids.append(_id)
        print issue, money, stopTime
    
    if len(ids) == 0: return False, "撤销失败，订单已撤销或已追号完毕！"

    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (account, ) 
    result = db.Query(sql, params, cnx, cursor)
    res = result[1].fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    accountType = res[0][2]
    bl = Balance(res[0][0], res[0][1])
    bl.order_cancel(oVirtual, oDeposit)
    
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
            'balanceAfter': bl.balance_after, 'reference': billno, 'amount': sumMoney, 'type': '1303', 
            'status': BS.CHASE_CANCEL, 'information': bl.info(), 'billno': TMN() + RandCode(8)}
    item['remarks'] = BM[item['type']]
    
    '''核心事务处理'''
    sqlM, paramsM = "update user set balance = %s, balanceDeposit = %s where username = %s", \
        (bl.virtual_after, bl.deposit_after, account)
    sqlC, paramsC = 'update game_chase c set status = -1 where ' + whr, (billno, account)
    # 会将总单和分订单一并取消
    sqlS, paramsS = 'update book set status = %s, updateTime = %s where reference = %s and account = %s', \
        (BS.CHASE_CANCEL, TM(), billno, account)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    sqlO, paramsO = "update game_order set status = -1 where id in (" + ','.join([str(e) for e in ids]) + ")" , \
            tuple()
    
    command = [[sqlM, paramsM], [sqlO, paramsO], [sqlC, paramsC], [sqlB, paramsB], [sqlS, paramsS]] 
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.dbLog(command)
    L.dbLog(flag, rst)
    
    return flag, rst

    
'''检查系统开奖延迟，判断开奖源是否出了问题'''
def checkOpenHistory(game, issue):
    lastOpen = rs.hget(KEY.LastOpen, game, False)
    if lastOpen: 
        lastOpen = long(str(lastOpen).replace('-', ''))
        issue = long(str(issue).replace('-', ''))
        if (issue - lastOpen) > 3: return True
    return False


'''封装计算注数和奖金工具准备'''
def subProc(gameObj, cBonus, name):
    if name not in gameObj:
        if name not in S: return None, None, None
        instance = S[name]['class']()
        gameObj[name] = { 'instance': instance, 'current': instance.getOpenTime() }
    
    current, gameType = gameObj[name]['current'], gameObj[name]['instance'].type
    if name not in cBonus: cBonus[name] = Bonus(name)
    
    '''计算注数工具'''
    Util = GetTool(name)
    
    return current, gameType, Util

def checkMaxNum(lottery, method, gameType, times):
    mk = str(method) + "_" + str(gameType)
    methodConfig = rs.hget(KEY.Methods, mk)
    maxNum = int(methodConfig['maxRecord'])
    if not checkMethodLimit(lottery, method, methodConfig['status']):
        return False, "玩法 " + methodConfig['name'] + " 正在维护中，请见谅，您可尝试其它玩法"
    if maxNum > 0 and int(times) >= maxNum: 
        return False, "[" + methodConfig['name'] + "]已经超出最大" + str(maxNum) + "注的投注限制"
    return True, 'check ok'

'''
在此记录业务逻辑
1、数据入game_chase表，所追期号信息入planList字段
2、直接将所有期数下注game_order，置isChase标志，以chaseId关联

'''
def addChase(user, orderList, planList, winStop):
    db = Database()
    kPlay = ['lottery', 'issue', 'account', 'method', 'content', 'model', 'code', 'compress', 'billno', 'money', 'nums', 
             'multiple', 'point', 'stopTime', 'orderTime', 'bonus', 'isChase', 'chaseId', 'mDeposit', 'mVirtual']
    kChase = ['lottery', 'account', 'method', 'content', 'model', 'code', 'compress', 'billno', 'startIssue', 'endIssue', 
             'planList', 'totalMoney', 'totalCount', 'isWinStop', 'nums', 'point', 'orderTime', 'bonus', 'money']
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    
    planListTxt = json.dumps(planList, ensure_ascii=False)
    cBonus, gameObj = {}, {}
    account, accountType = user, 1

    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, point from user where username = %s for update"), (account, ) 
    cnx, cursor = db.Query(sql, params)
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    point = res[0][2]
    bl = Balance(res[0][0], res[0][1])
    
    command = []
    for line in orderList:
        name, nums = line['lottery'], int(line.get('nums', 1))
        current, gameType, Util = subProc(gameObj, cBonus, name)
        if not current: continue
        
        '''计算注数'''
        times = Util.CalcBetTimes(line['method'], line['content'])
        if nums != times:
            L.error('calc Bet Times:' + str(times) + ' - ' + str(nums))
            L.error("下注计算错误，暂时忽略此注: " + line['method'] + ", " + line['content'])
            continue
        
        '''最大注数检测'''
        flag, msg = checkMaxNum(name, line['method'], gameType, times)
        if not flag: return False, msg
        
        _line = { 
            'account': account, 'point': point, 'money': 1.0 * Money[line['model']] * times, 
            'startIssue': planList[0]['issue'], 'endIssue': planList[-1]['issue'], 'nums': times,  
            'billno': TMN() + str(S[name]['id']) + RandCode(10), 'orderTime': TM(), 'totalMoney': 0.0,  
            'bonus': cBonus[name].updateBonus(line['method'], int(line['code']), line['model']),
            'planList': planListTxt, 'totalCount': len(planList), 'isWinStop': int(winStop)
        }
        for k in _line: line[k] = _line[k]
         
        '''当前期数'''
        issue = long(str(current['issue']).replace('-', ''))
        
        blc = Balance(bl.virtual_after, bl.deposit_after)
        '''直接按计划下注'''
        for plan in planList:
            p = copy.deepcopy(line)
            if long(str(plan['issue']).replace('-', '')) < issue: 
                return False, '您所投注的第 ' + plan['issue'] + ' 期已过销售期！' 
            p['money'] = line['money'] * plan['multiple']
            blc.consume(p['money'])
            
            p.update({'issue': plan['issue'], 'multiple': plan['multiple'], 'isChase': 1, 'chaseId': line['billno'],
                    'billno': TMN() + str(S[name]['id']) + RandCode(10), 'stopTime': KEY.getStopTime(name, plan['issue']),
                    'mVirtual': blc.virtual_out, 'mDeposit': blc.deposit_out  
                })
            
            if not p['stopTime']: return False, "请求错误，请刷新页面重试！"
            line['totalMoney'] += p['money']
            
            sqlO, paramsO = ("insert into game_order (" + ','.join(kPlay) + ") VALUES (" + \
                             ','.join(map(lambda x:'%s', kPlay)) + ")"), tuple([p[k] for k in kPlay])
            command += [[sqlO, paramsO]]
            
            '''TODO: test'''
            '''★★★☆追号订单追增消费记录，用于统一统计，实现只计算开奖后订单★★★★'''
            itemC = {'account': account, 'accountType': accountType, 'balanceBefore': blc.balance_before, 
                     'balanceAfter': blc.balance_after, 'reference': p['billno'], 'amount': p['money'], 'type': '1300', 
                     'status': BS.ORDER_ADD, 'isChaseSub': 1, 'information': blc.info()}
            itemC['remarks'] = BM[itemC['type']]
            itemC['billno'] = TMN() + RandCode(8)
            sqlC, paramsC = ("insert into book (" + ','.join(kBook) + ") VALUES (" + \
                             ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([itemC[k] for k in kBook])
            command += [[sqlC, paramsC]]
            '''重新加载，用于计算'''
            blc.reload()
            
        bl.consume(line['totalMoney'])
        if bl.balance_after <= 0.0: return False, '温馨提示：下注失败，余额不足请充值！'
        
        '''账单表·可能总单状态恒为0，不参与统计'''
        item = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
                'balanceAfter': bl.balance_after, 'reference': line['billno'], 'amount': line['totalMoney'], 
                'amount_chase': 0, 'type': '1300', 'status': BS.CHASE_ADD, 'isChase': 1, 'information': bl.info()}
        item['remarks'] = BM[item['type']]
        item['billno'] = TMN() + RandCode(8)
        
        '''核心事务处理'''
        sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([item[k] for k in kBook])
        sqlP, paramsP = ("insert into game_chase (" + ','.join(kChase) + ")" 
               " VALUES (" + ','.join(map(lambda x:'%s', kChase)) + ")"), tuple([line[k] for k in kChase])
        sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
            (bl.virtual_after, bl.deposit_after, account)
        command += [[sqlM, paramsM], [sqlP, paramsP], [sqlB, paramsB]]
        bl.reload()
        
    print command
    flag, rst = db.Transaction(command, cnx, cursor)
    L.dbLog(flag, rst)
    
    return flag, '下注失败'


def searchChase(user, lottery = "", status = "", page = 0, size = 5, sTime = '', eTime = ''):
    db = Database()
    keys = ["id", "billno", "account", "lottery", "method", "content", "compress", "nums", "model", "code", "point", 
            "status", "startIssue", "endIssue", "totalMoney", "totalCount", "clearCount", "orderTime", "winMoney"]
    
    sql = "SELECT " + ",".join(keys) + " FROM game_chase c join (select chaseId, sum(winMoney) winMoney, \
        COALESCE(sum(case when status!=0 then 1 end), 0) clearCount from game_order group by chaseId) o on \
        c.billno = o.chaseId and account = %s "
    
    params = [user]
    if sTime!='':
        sql += " and orderTime between %s and %s"
        params += [sTime, eTime]
    if str(lottery).strip()!='':
        sql += " and lottery = %s"
        params.append(status)
    if str(status).strip()!='':
        ws = ['status = -1', 'clearCount = 0', 'clearCount < totalCount', 'clearCount = totalCount']
        sql += " where " + ws[int(status) - 1]
    
    # print sql
    sql += " order by orderTime desc"
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = buildOrder(item, keys, db)
        
        lines.append(line)
    return { "totalCount": count, "list": lines }

'''后台查询追号记录'''
def adminSearchChase(users="", lottery="", status="", page=0, size=10, sTime='', eTime='',billno=''):
    db = Database()
    keys = ["id", "billno", "account", "lottery", "method", "content", "compress", "nums", "model", "code", "point",
            "status", "startIssue", "endIssue", "totalMoney", "totalCount", "clearCount", "orderTime", "winMoney"]

    sql = "SELECT " + ",".join(keys) + " FROM game_chase c join (select chaseId, sum(winMoney) winMoney, \
        COALESCE(sum(case when status!=0 then 1 end), 0) clearCount from game_order group by chaseId) o on \
        c.billno = o.chaseId "

    params = [sTime, eTime]
    '''判断是否为下线查询'''
    sql += GetWhr(users, 'orderTime')

    if str(billno).strip() != '':
        params.append(billno)
        sql += " and c.billno = %s "

    if str(lottery).strip() != '':
        sql += " and lottery = %s"
        params.append(lottery)

    if str(status).strip() != '':
        ws = ['status = -1', 'clearCount = 0', 'clearCount < totalCount', 'clearCount = totalCount']
        sql += " and " + ws[int(status) + 1]

    sql = SqlUser(users, sql, params, 'orderTime')
    # sql += " order by orderTime desc"
    L.debug(sql, params)

    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = buildOrder(item, keys, db, True)

        lines.append(line)
    return {"totalCount": count, "list": lines}

'''构造订单信息·复用'''
def buildOrder(item, keys, db, info = False):
    line = dict((k, item[i]) for i, k in enumerate(keys))
    line["method"] = Bonus.getMethodLabel(S[line["lottery"]]['type'], line["method"])
    line["lotteryCode"] = line["lottery"]
    line["lottery"] = S[line["lottery"]]['label']
    line["allowCancel"] = False
    line["allowCancel"] = checkCancel(line['billno'], db)
    line["orderTime"] = T2S(line["orderTime"])
    line["clearCount"] = int(line["clearCount"])
    if 'money' in line: line['money'] = round(line['money'], 4)
    if len(line['content']) > 28: line['content'] = line['content'][:28] + "..."
    
    '''已撤单'''
    if str(line['status']) == '-1': 
        line["allowCancel"] = False
    else:
        line["status"] = 0 if line["clearCount"] == 0 else (1 if line["clearCount"] < line["totalCount"] else 2)
    if not info:
        line["content"], line["chaseList"] = None, []
    
    return line

'''查询订单详情'''
def getChase(user, billno):
    db = Database()
    keys = ["id", "billno", "account", "lottery", "method", "content", "compress", "nums", "model", "code", "point", 
            "status", "startIssue", "endIssue", "totalMoney", "totalCount", "clearCount", "orderTime", "winMoney"]
    sql = "SELECT " + ",".join(keys) + " FROM game_chase c join (select chaseId, sum(winMoney) winMoney, \
        COALESCE(sum(case when status!=0 then 1 end), 0) clearCount from game_order group by chaseId) o on \
        c.billno = o.chaseId and billno = %s and account = %s"
    
    res = db.selectEx(sql, (billno, user))
    if len(res) == 0: return None
    line = buildOrder(res[0], keys, db, True)
    line['chaseList'] = getOrder(user, billno, True)
    for o in line['chaseList']: o['openTime'] = S2TS(o['openTime']) if o['openTime'] else S2TS(o['stopTime'])
    
    return line 


if __name__ == '__main__':
#     print searchChase('system')
#     cancelChase('system', '')
#     print getChase('system', '20190624221537711135869969292')
#     print checkCancel('20190630190430751115700668795')
    pass
    