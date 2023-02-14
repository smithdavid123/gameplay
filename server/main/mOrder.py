#coding:utf8

from datetime import datetime
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import PreNow, LaterNow, TM, T2S, TMN, RandCode, DT2TMS, DT, NextDay
from games.setting import services as S
from games.setting import GameInfoList, GAME_INSTANCE
from libs.code import Money, Play, BookMark as BM, BookStatus as BS
from libs.common import GetWhr, SqlUser
from common.play import GetTool
from common.utils import Bonus
from common.key import KEY
from common.balance import Balance
from common.tools import common_operate
from libs.log import L
from config import Config as C


def CalcMoney(content, game = "ssc"):
    times, ps = 1, content.split(",")
    for p in ps: times *= len(p)
    return times

'''检查系统开奖延迟，判断开奖源是否出了问题'''
def checkOpenHistory(game, issue):
    lastOpen = rs.hget(KEY.LastOpen, game, False)
    if lastOpen: 
        lastOpen = long(str(lastOpen).replace('-', ''))
        issue = long(str(issue).replace('-', ''))
        if (issue - lastOpen) > 3: return True
    return False

'''检查未开奖期和当前期相差数，判断是否可以取消'''
def checkCancel(name, issue):
    game = GAME_INSTANCE[name]
    currentIssue = game.getOpenTime()['issue']
    dist = 3 if game.times > 100 else 2
    
    if str(issue).find('-') != -1:
        dtc, numbC = currentIssue.split('-')
        dto, numbO = issue.split('-')
        days = (datetime.strptime(dtc, "%Y%m%d") - datetime.strptime(dto, "%Y%m%d")).days
        return (int(numbC) + days * game.times - int(numbO)) > dist
    else:
        return (long(str(currentIssue).replace('-', '')) - long(str(issue).replace('-', ''))) > dist  


def cancelOrder(user, billno):
    db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    whr = "o.billno = %s and o.account = %s and o.status = 0"
    '''查询订单信息''' 
    sql = "select account, money, stopTime, lottery, issue, mDeposit, mVirtual from game_order o where " + whr
    params = (billno, user)
    res = db.selectEx(sql, params)
    if len(res) == 0: return False, '撤销失败，订单已撤销或系统已清算，若此订单半小时内未开奖请联系管理员！'
    if user != res[0][0]: 
        L.log("Find cancel order bug!")
        return False, '撤销失败，请重新登录！'
    account, money, stopTime, lottery, issue, mDeposit, mVirtual = res[0]
    
    '''超过截止时间'''
    # if PreNow(stopTime) and not checkCancel(lottery, issue): return False, '撤销失败，已超过当期截止时间！'
    if PreNow(stopTime): return False, '撤销失败，已超过当期截止时间！'
    
    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (account, ) 
    cnx, cursor = db.Query(sql, params)
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    accountType = res[0][2]
    
    bl = Balance(res[0][0], res[0][1])
    bl.order_cancel(mVirtual, mDeposit)
    L.log(account, billno)
    
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
            'balanceAfter': bl.balance_after, 'reference': billno, 'amount': money, 'type': '1303', 
            'status': BS.ORDER_CANCEL, 'information': bl.info()}
    item['remarks'] = BM[item['type']]
    item['billno'] = TMN() + RandCode(8)
    
    '''核心事务处理'''
    sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (bl.virtual_after, bl.deposit_after, account)
    sqlO, paramsO = 'update game_order o set status = -1 where ' + whr, (billno, account)
    sqlS, paramsS = 'update book set status = %s, updateTime = %s where reference = %s and account = %s', \
        (BS.ORDER_CANCEL, TM(), billno, account)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x: '%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    
    command = [[sqlM, paramsM], [sqlO, paramsO], [sqlS, paramsS], [sqlB, paramsB]] 
    L.dbLog(command)
    
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, rst

'''管理员撤单，允许撤销已结算订单'''
def systemCancelOrder(user, username, billno):
    db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    whr = "o.billno = %s and o.account = %s"
    '''查询订单信息''' 
    sql = "select account, money, winMoney, mDeposit, mVirtual, status from game_order where billno=%s and account = %s"
    params = (billno, username)
    res = db.selectEx(sql, params)
    if len(res) == 0: return False, '撤销失败，订单不存在！'
    
    account, money, winMoney, mDeposit, mVirtual, order_status = res[0] 
    if order_status == -1: return False, '撤销失败，该订单为已撤销状态！'
    
    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (account, ) 
    cnx, cursor = db.Query(sql, params)
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    accountType = res[0][2]
    
    bl = Balance(res[0][0], res[0][1])
    bl.order_cancel(mVirtual, mDeposit, winMoney)
    money -= winMoney
    L.log(account, billno)
    
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
            'balanceAfter': bl.balance_after, 'reference': billno, 'amount': money, 'type': '1303', 
            'status': BS.ORDER_CANCEL, 'information': bl.info()}
    item['remarks'] = BM[item['type']]
    item['billno'] = TMN() + RandCode(8)
    
    '''核心事务处理'''
    sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (bl.virtual_after, bl.deposit_after, account)
    sqlO, paramsO = 'update game_order o set status = -1 where ' + whr, (billno, account)
    sqlS, paramsS = 'update book set status = %s, updateTime = %s where reference = %s and account = %s', \
        (BS.ORDER_CANCEL, TM(), billno, account)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x: '%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    '''操作日志'''
    txt = "cancel order, billno:{}, status:{}, money: {}".format(billno, order_status, money)
    line = common_operate(user, 'game_order', txt, username)
    
    command = [[sqlM, paramsM], [sqlO, paramsO], [sqlS, paramsS], [sqlB, paramsB], line] 
    L.dbLog(command)
    
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, rst

'''-------------------------------------------------------------------------------------------------------'''

'''Return: True - 正常，False - 禁止'''
def checkMethodLimit(lottery, method, mStatus):
    # 玩法总表，0 为正常
    k = lottery + "_" + method
    if not rs.hexists(KEY.MethodConfig, k): return int(mStatus) == 0 
    info = rs.hget(KEY.MethodConfig, k) 
    
    return int(info['status']) == 0 
    
'''Important Core Code'''    
def addOrder(user, lines):
    db = Database()
    cBonus = {}
    kPlay = ['lottery', 'issue', 'account', 'method', 'content', 'model', 'code', 'compress', 'billno', 'money', 
                'nums', 'multiple', 'point', 'stopTime', 'orderTime', 'bonus', 'mDeposit', 'mVirtual']
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    account, accountType = user, 1
    
    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, point, allowOrder from user where username = %s for update"), (account, ) 
    cnx, cursor = db.Query(sql, params)
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    if not res[0][3]: return False, '投注功能已锁定，请联系客服或管理员！'
    point = float(res[0][2]) * 20 + 1800
    bl = Balance(res[0][0], res[0][1])
    
    command = []
    for line in lines:
        name, nums, code = line['lottery'], int(line.get('nums', 1)), int(line['code'])
        '''获取当前期数信息'''
        current, gameType = GAME_INSTANCE[name].getOpenTime('', C.GAME_TIME_ADVANCE), GAME_INSTANCE[name].type
        if name not in cBonus: cBonus[name] = Bonus(name)
        
        '''计算注数'''
        Util = GetTool(name)
        
        times = Util.CalcBetTimes(line['method'], line['content'])
        if nums != times:
            L.error('calc Bet Times:' + str(times) + ' - ' + str(nums))
            L.error("下注计算错误，暂时忽略此注: " + line['method'] + ", " + line['content'])
            continue
        
        '''最大注数检测'''
        mk = str(line['method']) + "_" + str(gameType)
        methodConfig = rs.hget(KEY.Methods, mk)
        maxNum = int(methodConfig['maxRecord'])
        if not checkMethodLimit(name, line['method'], methodConfig['status']):
            return False, "玩法 " + methodConfig['name'] + " 正在维护中，请见谅，您可尝试其它玩法"
        
        if maxNum > 0 and int(times) >= maxNum: 
            return False, "[" + methodConfig['name'] + "]已经超出最大" + str(maxNum) + "注的投注限制"
        
        '''下注表'''
        if line['issue'] == '': line['issue'] = current['issue']
        line['money'] = 1.0 * line['multiple'] * Money[line['model']] * times
        line['code'] = code if (code > 1799 and code < C.MAX_POINT_VALUE) else point
        
        if line['money'] <= 0: return False, "严重警告：发现异常，请勿使用外挂程序，否则后果自负！"
        
        bl.consume(line['money'])
        
        '''单注奖金'''
        line['bonus'] = cBonus[name].updateBonus(line['method'], line['code'], line['model'])
        print 'Bet test:', line['bonus'], line['method'], line['code'], line['model']
        
        line.update({'point': point, 'account': account, 'orderTime': TM(), 'stopTime': current['stopTime'],
                    'billno': TMN() + str(S[name]['id']) + RandCode(10), 
                    'mVirtual': bl.virtual_out, 'mDeposit': bl.deposit_out
        })
        
        if bl.balance_after <= 0.0: return False, '温馨提示：下注失败，余额不足请充值！'
        
        '''账单表'''
        item = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
                'balanceAfter': bl.balance_after, 'mDeposit': bl.deposit_out, 'mVirtual': bl.virtual_out, 
                'reference': line['billno'], 'amount': line['money'], 
                'type': '1300', 'status': BS.ORDER_ADD, 'information': bl.info()}
        item['remarks'] = BM[item['type']]
        item['billno'] = TMN() + RandCode(8)
        '''修复重大BUG，一次投多注仅扣一注的钱'''
        bl.init(bl.virtual_after, bl.deposit_after)

        '''核心事务处理'''
        sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
            (bl.virtual_after, bl.deposit_after, account)
        sqlP, paramsP = ("insert into game_order (" + ','.join(kPlay) + ")" 
               " VALUES (" + ','.join(map(lambda x: '%s', kPlay)) + ")"), tuple([line[k] for k in kPlay])
        sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(map(lambda x: '%s', kBook)) + ")"), tuple([item[k] for k in kBook])
        
        command += [[sqlM, paramsM], [sqlP, paramsP], [sqlB, paramsB]]
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.dbLog(flag, rst)
      
    return flag, '下注失败'

def searchOrder(user, status = "", issue = "", page = 0, size = 2, sTime = '', eTime = ''):
    db = Database()
    keys = ["billno", "account", "lottery", "method", "content", "compress", "multiple", "nums", "model", 
            "code", "point", "money", "orderTime", "winMoney"]
    keys2 = ['id', 'issue', 'stopTime', 'openTime', 'status', 'clearTime']
    sql = "select o.openCode, " + ",".join(['g.' + k for k in keys2]) + "," + ",".join(keys) + " from \
        game_order g left join open_code o on lottery=o.name and g.issue=o.issue where account = %s and isChase = 0 \
        and orderTime >= %s and orderTime <= %s"
    if sTime == '': sTime, eTime = DT(), NextDay()
    
    params = [user, sTime, eTime]
    if str(status).strip()!='':
        sql += " and g.status = %s"
        params.append(status)
    if str(issue).strip()!='':
        sql += " and g.issue = %s"
        params.append(issue)
            
    sql += " order by orderTime desc"
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = buildOrder(item, keys, keys2)
        
        lines.append(line)
    return { "totalCount": count,"list": lines }

'''构造订单信息·复用'''
def buildOrder(item, keys, keys2):
    line = dict((k, item[i + len(keys2) + 1]) for i, k in enumerate(keys))
    for i, k in enumerate(keys2): line[k] = item[i + 1]
    name = line["lottery"]
    line["type"] = 0 
    line['openCode'] = item[0]
    line["method"] = Bonus.getMethodLabel(S[line["lottery"]]['type'], line["method"])
    line["lottery"] = S[line["lottery"]]['label']
    line["allowCancel"] = LaterNow(line["stopTime"]) or checkCancel(name, line["issue"])
    line["stopTime"], line["clearTime"] = T2S(line["stopTime"]), T2S(line["clearTime"])
    line["openTime"], line["orderTime"] = T2S(line["openTime"]), T2S(line["orderTime"])
    '''已撤单'''
    if str(line['status']) != '0': line["allowCancel"] = False
    line['money'] = float('%.3f' % line.get('money', 0))
    line['winMoney'] = float('%.3f' % line.get('winMoney', 0))
    if len(line['content']) > 28: line['content'] = line['content'][:28] + "..."
    
    return line


def summary_by_sql(sql, params, keys, db=None):
    if not db: db = Database()
    sql = "select " + ','.join(('sum(' + k + ') ' + k + 'Sum')  for k in keys) + " from (" + sql + ") s"
    res = db.selectData(sql, params)
    return res
    

'''搜索: ['ALL'] - 查所有, ['SELF', user] - 查自己, ['PARENT', user, username] - 查下线'''
def searchTeamOrder(users, sTime, eTime, lottery = '', status = '', issue = '', page = 0, size = 100):
    db = Database()
    keys = ['billno', 'account', 'lottery', 'method', 'issue', 'content', 'money', 'winMoney', 'status', 'orderTime',
            'nums', 'multiple']
    sql = "select " + ",".join(keys) + " from game_order"
    params = [sTime, eTime]
    '''判断是否为下线查询'''
    sql += GetWhr(users, 'orderTime')
    
    if status!='':
        sql += " and status = %s"
        params.append(status)
    else:
        sql += " and status > 0"
    if lottery!='':
        sql += " and lottery = %s"
        params.append(lottery)
    if issue!='':
        sql += " and issue = %s"
        params.append(issue)
    sql = SqlUser(users, sql, params, 'orderTime')
    
    L.debug(sql, params)
    
    '''目前管理端查询使用分页'''
    res = db.selectPage(sql, tuple(params), page, size) # if users[0] == 'ALL' else db.select(sql, tuple(params))
    cursor = res[1] # if users[0] == 'ALL' else res
    lines =  []
    
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['lottery'] = GameInfoList[line['lottery']]['label']
        line["method"] = Play[line["method"]]
        line["orderTime"] = DT2TMS(line["orderTime"])
        line["money"] = float('%.3f' % line['money'])
        line["winMoney"] = float('%.3f' % line['winMoney'])
        
        lines.append(line)
    
    data = { "totalCount": res[0], "list": lines }
    '''获取汇总数据'''
    summary = summary_by_sql(sql, params, ['money', 'winMoney'], db)
    for k, v in summary.items(): data[k] = v  
    
    return data 

'''查询订单详情'''
def getOrder(user, billno, isChase = False):
    db = Database()
    field = "chaseId" if isChase else "billno"
    keys = ["billno", "account", "lottery", "method", "content", "compress", "multiple", "nums", "model", 
            "code", "point", "money", "orderTime", "winMoney"]
    keys2 = ['id', 'issue', 'stopTime', 'openTime', 'status', 'clearTime']
    sql = "select o.openCode, " + ",".join(['g.' + k for k in keys2]) + "," + ",".join(keys) + " from \
        game_order g left join open_code o on lottery=o.name and g.issue=o.issue where " + field + " = %s"
    
    lines = []
    for item in db.select(sql, (billno, )):
        line = buildOrder(item, keys, keys2)
        line['money'] = float('%.3f' % line['money'])
        lines.append(line)
    return lines if isChase else (lines[0] if len(lines) > 0 else {})

    
if __name__ == '__main__':
    lines = [{"lottery":"t6s300","issue":"","method":"qianyi","content":"01,03,05,07,09", "nums": 5, "model":"yuan","multiple":1,"code":1994,"compress":False},
             {"lottery":"qqmin","issue":"","method":"sxzhixfsz","content":"-,0,1,2,-", "nums": 1, "model":"jiao","multiple":200,"code":1996,"compress":False}]
#     print addOrder('test001', lines)[1]
#     print systemCancelOrder('sys', 'test004', '202004131850225076098936501952')[1]
    
#     checkMethodLimit()
#     print searchTeamOrder(['SELF', 'test004'], '2023-01-29', '2023-03-29', '', '')
    
#     print rs.hset(KEY.MethodConfig, 't6s300_qianyi', {'status': 0, 'bonus': u'99', 'lottery': u't6s300', 'method': u'qianyi', 'rebate': 0.1})
#     print rs.hget(KEY.MethodConfig, 't6s300_qianyi')
    
#     print rs.hget('games', 'xjssc')['status']
    
#     rs.delete(KEY.LastOpen)
#     print rs.hkeys(KEY.LastOpen)
#     print rs.hget(KEY.LastOpen, 't1s60')
#     lottery = rs.hget('games', 'cqssc')
#     print lottery
#     print searchOrder("system")
#     a = []
#     a.append(1)
#     print rs.hget('games', 'cqssc')
    print cancelOrder('test1994', '202005220251232831097238739700')[1]
    
#     print round(0.12345, 3)
#     print checkCancel('cqssc', '20190818-045')
#     print checkCancel('qqmin', '20190819-0846')
#     line = {'stopTime': '2023-08-27 09:19:00', 'lottery': 'qqmin', 'issue': '20190827-0559'}
#     print LaterNow(line["stopTime"]) or checkCancel(line["lottery"], line["issue"])
    