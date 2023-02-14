#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

import time
from libs.database import Database
from libs.utils import DT2TMS, TM, T2S, TMN, RandCode, FLOAT, DTH, TimeOffset
from libs.common import GetWhr, SqlUser2
from libs.log import L

TPS = {'dividend': '1900', 'activity': '1200', 'rebateAgent': '1400', 'bonus': '1301', 
       'feeAmount': '1209', 'consume': '1300', 'cancelOrder': '1303', 'rebateConsume': '1302', 
       'recharge': '1000', 'withdraw': '1001', '_recharge': '1600', 'refuseWithdraw': '1002',
       'rebate': '1409' }

'''有username则查个人，否则查下线'''        
def searchReportLottery(user, sTime, eTime, username = ""):
    db = Database()
    
    whr = " join relation on parent='{}' and child=b.account".format(user) if username == "" else " and b.account = '{}'".format(username)
    sql = "select c.showName, consume, bonus, rebateConsume, rebateAgent, cancelOrder from (select o.lottery cp, \
            sum(case when b.type='1300' then b.amount end) consume, \
            sum(case when b.type='1303' then b.amount end) cancelOrder, \
            sum(case when b.type='1301' then b.amount end) bonus, \
            sum(case when b.type='1302' then b.amount end) rebateConsume, \
            sum(case when b.type='1400' then b.amount end) rebateAgent \
            from book b join game_order o on b.reference=o.billno " + whr + \
            " where b.status=2 and b.updateTime between %s and %s group by o.lottery) a \
            join game_config c on c.lottery=a.cp"
    params = [sTime, eTime]
    
    lines = []
    keys = ['consume', 'bonus', 'rebateConsume', 'rebateAgent', 'cancelOrder', 'profit']
    Summary = dict((k, 0.0) for k in keys)
    Summary['field'] = '总计'
    
    L.debug(sql, params)
    for item in db.select((sql), params):
        line = {'field': item[0]}
        for i in range(0, len(keys) - 1):
            v = item[i + 1] if item[i + 1] else 0
            line[keys[i]] = v 
            Summary[keys[i]] += v
        
        Summary['consume'] -= line['cancelOrder']
        line['consume'] -= line['cancelOrder']
        line['profit'] = line['bonus'] - (line['consume'] + line['rebateConsume'] + line['rebateAgent'])
        Summary['profit'] += line['profit']
        lines.append(line)
        
    lines.insert(0, Summary)
    
    return lines

'''
        分类汇总类似如下语句：
        sum(case when b.type='1300' then b.amount end) consume, \
        sum(case when b.type='1301' then b.amount end) bonus, \
        sum(case when b.type='1302' then b.amount end) dividend, \
        sum(case when b.type='1900' then b.amount end) rebateConsume, \
        sum(case when b.type='1200' then b.amount end) activity, \
        sum(case when b.type='1400' then b.amount end) rebateAgent, \
        sum(case when b.type='1209' then b.amount end) feeAmount, \
        sum(case when b.type='1000' then b.amount end) recharge, \
        sum(case when b.type='1001' then b.amount end) withdraw \
        解释：
    select parent, child from \
        (select parent, child from relation join \
            (select '', username from user where parentName=%s) p on p.username = parent \
                union select username, username from user where username=%s or parentName=%s \
        ) d join (select child rc from relation where parent=%s) r on r.rc = child
    1、内层的语句是为了梳理查询用户的直属下级的所有下级，以及直属下级本身，并完成统计层次标注，为后边group奠定基础
    2、最后后边的join语句是为了限定查询范围，防止查询非自己下属的团队数据，否则该句是多余的
        注：以上两点纯属猜测，原最后为left join，可能有误，改为join
'''



'''团队盈亏报表'''
def searchReportTeam(user, sTime, eTime, username = ""):
    db = Database()
    if username == '': username = user
    tps = {'dividend': '1900', 'activity': '1200', 'rebateAgent': '1400', 'bonus': '1301', 
           'feeAmount': '1209', 'consume': '1300', 'cancelOrder': '1303', 'rebateConsume': '1302', 
           'recharge': '1000', 'withdraw': '1001', '_recharge': '1600', 'refuseWithdraw': '1002'}
    keys = tps.keys()
    Summary = dict((k, 0.0) for k in keys)
    Summary['field'], Summary['profit'] = '汇总', 0.0
    
    sql = "select parent, child, " + \
            ','.join("IFNULL(sum(case when type='" + tps[keys[i]] + "' then amount end), 0) " + \
                     keys[i] for i in range(len(keys))) + ", uType, parents, level  from  \
            ( select parent, child, b.type type, amount, d.type uType, parents, level from book b \
                right join \
                ( select parent, child, type, parents, level from \
                     ( select parent, child, type, parents, level  from relation \
                        join (select * from user  where parentName=%s) b on b.username=parent \
                     union (select username, username, type, parents, level  from user \
                        where username=%s or parentName=%s) \
                    ) c \
                    join (select child rc from relation where parent=%s union select %s) r on r.rc = child \
                ) d on child=account where b.status = 2 and (b.updateTime between %s and %s)\
            ) a group by parent order by consume desc"
    params = [username, username, username, user, username, sTime, eTime]
    print sql, params
    
    rst, idx = [], -1
    for item in db.select(sql, params):
        line = {'field': item[0] }
        flag = True
        for i in range(len(keys)):
            line[keys[i]] = round(FLOAT(item[i + 2]), 2)
            Summary[keys[i]] += line[keys[i]]
            if line[keys[i]] != 0.0: flag = False
        '''全为空的行舍弃'''
        if flag and item[0] != username: continue
        
        # Summary['consume'] -= line['cancelOrder']
        Summary['recharge'] += line['_recharge']
        Summary['withdraw'] -= Summary['refuseWithdraw']
        # line['consume'] -= line['cancelOrder']
        line['recharge'] += line['_recharge']
        line['withdraw'] -= line['refuseWithdraw']
        
        line['profit'] = line['bonus'] + line['rebateAgent'] + line['rebateConsume'] \
            + line['dividend'] - line['consume'] - line['feeAmount']
        Summary['profit'] += line['profit']
        
        rst.append(line)
        if item[0] == username: idx = len(rst) - 1
    '''所查本人需放第一位'''
    if idx != -1:
        temp = rst[idx]
        rst[idx] = rst[0]
        rst[0] = temp
    rst.insert(0, Summary)
    
    return rst

'''老接口，不敢随便改'''      
'''['ALL'] - 查所有, ['SELF', user] - 查自己, ['PARENT', user, username] - 查下线'''
def searchReport(users, sTime, eTime, key = "account"):
    db = Database()
    '''唯有查个人不使用数组'''
    if type(users) != type([]): users, key = ['SELF', users], 'date(updateTime)'
    '''查所有亦使用date'''
    if key != 'account': key = 'date(updateTime)'
    sql = 'select ' + key + ', type, sum(amount) from book bk '

    sql += GetWhr(users, "updateTime") + " and status = 2"
    params = [sTime, eTime]
    
    lines = {}
    tps = {'1900': 'dividend', '1200': 'activity', '1400': 'rebateAgent', '1301': 'bonus', '1209': 'feeAmount',
           '1300': 'consume', '1303': 'cancelOrder', '1302': 'rebateConsume', '1000': 'recharge', '1001': 'withdraw',
           '1600': 'recharge', '1002': 'refuseWithdraw'}
    Summary = dict((k, 0.0) for k in tps.values())
    Summary['field'], Summary['profit'] = '汇总', 0.0
    
    sql = SqlUser2(users, sql, params, key)
    L.debug(sql, params)
    for (tm, tp, money) in db.select((sql), params):
        tm = str(tm)
        if tm not in lines: lines[tm] = dict((k, 0.0) for k in tps.values())
        if tp not in tps: continue
        # print tm, tp, money
        lines[tm][tps[tp]] += round(FLOAT(money), 2)
        Summary[tps[tp]] += round(FLOAT(money), 2)
        
    for tm in lines:
        lines[tm]['consume'] -= lines[tm]['cancelOrder']
        Summary['consume'] -= lines[tm]['cancelOrder']
        lines[tm]['withdraw'] -= lines[tm]['refuseWithdraw']
        Summary['withdraw'] -= lines[tm]['refuseWithdraw']
        
        lines[tm]['profit'] = lines[tm]['bonus'] + lines[tm]['rebateAgent'] + lines[tm]['rebateConsume'] \
            + lines[tm]['dividend'] - lines[tm]['consume'] - lines[tm]['feeAmount']
        lines[tm]['field'] = tm
        Summary['profit'] += lines[tm]['profit']
        
    rst = lines.values()
    rst.sort(key = lambda d: d['field'], reverse=True)
    rst.insert(0, Summary)
    
    return rst


'''团队盈亏报表·增强版 (用户输赢报表、第三方报表)'''
def searchReportEx(user, sTime, eTime, page=0, size=10, type_="", username = "", team=0):
    db = Database()
    keys = TPS.keys()
    '''用户表相关字段'''
    uKeys = ['parents', 'userLevel', 'balance', 'balanceDeposit', 'blockedBalance', 'balanceThird']
    uFields = ", " + ','.join(uKeys) + " "
    '''用户表条件筛选'''
    whr, userFilter = "where 1", " order by loginTime desc"
    if username != "": whr += " and username='{}'".format(username)
    if type_ != "": whr += " and type={}".format(type_)
    if whr != "where 1": userFilter = whr + userFilter
    
    '''根据是否包含下级决定查询用户范围'''
    sqlU = "select parent, child, type " + uFields + " from \
            ( select parent, child, type " + uFields + " from relation \
                    join (select * from user " + userFilter + ") b on b.username=parent \
                union (select username, username, type " + uFields +  " from user " + userFilter + ") \
            ) c "
    if not team: sqlU = "select username parent, username child, type " + uFields + " from user " + userFilter
    
    sql = "select * from \
        (select parent, child, " + ','.join(['IFNULL(sum(' + k + '), 0) _' + k for k in keys]) + ", d.type " + uFields + \
            " from (select account, " + \
                ','.join("IFNULL(sum(case when type='" + TPS[keys[i]] + "' then amount end), 0) " + \
                     keys[i] for i in range(len(keys))) + \
                " from book b where status = 2 and (updateTime between %s and %s) group by account \
            ) a right join \
            ( " + sqlU + \
            ") d on child=account group by parent order by consume desc \
        ) al where _consume>0"
    params = [sTime, eTime]
    
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i + 2]) for i, k in enumerate(keys))
        line['username'] = item[0]
        line['type'] = item[len(keys) + 2]
        for i, k in enumerate(uKeys): line[k] = item[i + len(keys) + 3]
        line['layer'] = (len(line['parents'].split(">")) + 1) if line['parents'] else 1
        line['balanceAll'] = line['balance'] + line['balanceDeposit'] + line['blockedBalance']
        format_report_line(line)
        lines.append(line)
    return { "totalCount": count, "list": lines }        


'''总报表'''    
def summary_report_all(bTime, eTime, page = 0, size = 20):
    db = Database()
    keys = TPS.keys()
    sql = "select DATE_FORMAT(createTime,'%Y-%m-%d') as time, " + ','.join("IFNULL(sum(case when type='" + TPS[keys[i]] + "' then amount end), 0) " + \
                 keys[i] for i in range(len(keys))) + " from book b where (status = 2 \
             or (status = -1 and type = '1303')) and (createTime between %s and %s) group by time"
    lines = []
    count, cursor = db.selectPage((sql), (bTime, eTime), page, size)
    for item in cursor:
        line = dict((k, item[i + 1]) for i, k in enumerate(keys))
        line['time'] = str(item[0])
        format_report_line(line)
        lines.append(line)
    return { "totalCount": count, "list": lines }


'''第三方报表·在上边用户输赢报表基础上稍改'''
def summary_report_third(sTime, eTime, page=0, size=20, username="", team=0, thirdParty="CP138_3"):
    dts = {'list': [], 'summary': {}}
    if thirdParty!="CP138_3" and thirdParty!="": return dts
    
    db = Database()
    keys = TPS.keys()
    '''用户表相关字段'''
    uKeys = ['balance', 'balanceDeposit', 'balanceThird']
    uFields = ", " + ','.join(uKeys) + " "
    '''用户表条件筛选'''
    whr, userFilter = "where 1", " order by loginTime desc"
    if username != "": whr += " and username='{}'".format(username)
    if whr != "where 1": userFilter = whr + userFilter
    
    '''根据是否包含下级决定查询用户范围'''
    sqlU = "select parent, child, type " + uFields + " from \
            ( select parent, child, type " + uFields + " from relation \
                    join (select * from user " + userFilter + ") b on b.username=parent \
                union (select username, username, type " + uFields +  " from user " + userFilter + ") \
            ) c "
    if not team: sqlU = "select username parent, username child, type " + uFields + " from user " + userFilter
    
    sql = "select * from ( \
            select parent, child, time, " + ','.join(['IFNULL(sum(' + k + '), 0) _' + k for k in keys]) + ", d.type " + uFields + \
            " from (select account, DATE_FORMAT(createTime,'%Y-%m-%d') as time, " + \
                ','.join("IFNULL(sum(case when type='" + TPS[keys[i]] + "' then amount end), 0) " + \
                     keys[i] for i in range(len(keys))) + \
                " from book b where status = 2 and (updateTime between %s and %s) group by account, time \
            ) a right join \
            ( " + sqlU + \
            ") d on child=account group by parent order by consume desc \
        ) al where _consume > 0"
    params = [sTime, eTime]
    
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i + 3]) for i, k in enumerate(keys))
        line['username'] = item[0]
        line['time'] = str(item[2])
        line['type'] = int(item[len(keys) + 3])
        for i, k in enumerate(uKeys): line[k] = item[i + len(keys) + 4]
        format_report_line(line)
        line['thirdParty'], line['balanceIn'], line['balanceOut'] = 'CP138_3', 0, 0
        '''TODO: 前端写错了，这里用balance代替总销量'''
        line['balanceThird'] = '%.3f' % line['balance']
        line['balance'] = float(line['cancelOrder']) + float(line['consume'])
        
        lines.append(line)
    return { "totalCount": count, "list": lines } 

'''团队报表·在上边用户输赢报表基础上稍改'''
def summary_report_team(sTime, eTime, page=0, size=20, username=""):
    db = Database()
    keys = TPS.keys()
    
    '''用户表相关字段'''
    uKeys = ['parents', 'level']
    uFields = ", " + ','.join(uKeys) + " "
    '''用户表条件筛选'''
    userFilter = " where username='{}' or parentName='{}'".format(username, username) if username != "" \
        else " where parentName is null or parentName='{}'".format(username)
    uFilter2 = " where parentName='{}'".format(username) if username != "" else ' where parentName is null'
    
    '''根据是否包含下级决定查询用户范围'''
    sqlU = "select parent, child, type " + uFields + " from \
            ( select parent, child, type " + uFields + " from relation \
                    join (select * from user " + uFilter2 + ") b on b.username=parent \
                union (select username, username, type " + uFields +  " from user " + userFilter + ") \
            ) c "
    sql = "select parent, child, " + \
            ','.join("IFNULL(sum(case when type='" + TPS[keys[i]] + "' then amount end), 0) " + \
                    keys[i] for i in range(len(keys))) + ", uType, parents, level"\
            " from ( \
                select parent, child, b.type type, amount, d.type uType, parents, level from book b \
                right join (" + sqlU + ") d on child=account \
                where b.status = 2 and (b.updateTime between %s and %s) \
            ) al group by parent order by consume desc"
            
    params = [sTime, eTime]
    
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i + 2]) for i, k in enumerate(keys))
        line['username'] = item[0]
        line['parents'] = item[len(keys) + 3]
        line['level'] = item[len(keys) + 4]
        line['layer'] = (len(line['parents'].split(">")) + 1) if line['parents'] else 1
        line['group'] = "管理员" if line['level'] > 1 else ("代理" if line['level'] == 1 else "会员") 
        format_report_line(line)
        
        lines.append(line)
    return { "totalCount": count, "list": lines } 

def summary_by_hour(sTime, eTime, page=0, size=20, byHour=1):
    db = Database()
    info = {'hour': 'time', 'balance': 'balanceAll', 'balanceDeposit': 'balanceDeposit', 'balanceThird': 'balanceThird', 
            'balanceBlocked': 'blockedBalance', 'login': 'login', 'active': 'active', 'reg': 'reg', 'online': 'online', 
            'moneyIn': 'recharge', 'moneyOut': 'withdraw', 'consume': 'consume', 'consumeReal': 'consumeReal', 
            'bonus': 'bonus', 'commission': 'commission'}
    keys = info.keys()
    sql = "select " + ','.join(keys) + " from summary_hours where hour between %s and %s order by hour desc"
    count, cursor = db.selectPage((sql), tuple((sTime, eTime)), page, size)
    lines = []
    if page == 0: lines.append(summary_report(False, db))
    for item in cursor:
        ds = dict((k, item[i]) for i, k in enumerate(keys))
        line = dict((info[k], ds[k]) for k in info)
        line['time'] = str(line['time'])
        lines.append(line)

    return { "totalCount": count + (1 if page == 0 else 0), "list": lines }

'''按小时统计，定时任务'''
def summary_report(prev=False, db=None):
    if not db: db = Database()
    bTime, eTime = DTH() + ":00:00", TM()
    if prev: bTime, eTime = TimeOffset(-3600, DTH() + ":00:00"), DTH() + ":00:00"
    keys = TPS.keys()
    uKeys = ['balance', 'blockedBalance', 'balanceDeposit', 'balanceThird']
    sql1 = "select count(*) reg, 0 login, 0 online, 0 active from user where registTime between %s and %s"
    sql2 = "select 0 reg, count(*) login, 0 online, 0 active from user where loginTime between %s and %s"
    sql3 = "select 0 reg, 0 login, count(*) online, 0 active from user where loginTime between %s and %s"
    sql4 = "select 0 reg, 0 login, 0 online, count(*) active from \
        (select count(*) active from book where createTime between  %s and %s group by account) a"
    sqlL = "select sum(reg) reg, sum(login) login, sum(online) online, sum(active) active from (" + \
        (sql1 + " union " + sql2 + " union " + sql3 + " union " + sql4) + ") b"
    sqlU = "select " + ','.join(['IFNULL(sum(' + k + '), 0) ' + k for k in uKeys]) + \
        ", reg, login, online, active from user join (" + sqlL + ") c"
    
    sql = "select " + ','.join("IFNULL(sum(case when type='" + TPS[keys[i]] + "' then amount end), 0) " + \
                 keys[i] for i in range(len(keys))) + ", balance, blockedBalance, balanceDeposit, balanceThird,  \
             reg, login, online, active from book b join (" + sqlU + ") d where (status = 2 \
             or (status = -1 and type = '1303')) and updateTime between %s and %s"
    line, lKeys = {}, ['reg', 'login', 'online', 'active']
    for item in db.select(sql, (bTime, eTime, bTime, eTime, bTime, eTime, bTime, eTime, bTime, eTime)):
        for i in range(len(keys)): line[keys[i]] = item[i]
        for i in range(len(uKeys)): line[uKeys[i]] = item[i + len(keys)]
        for i in range(len(lKeys)): line[lKeys[i]] = int(item[i + len(keys) + len(uKeys)])
        break
    line['balanceAll'] = line['balance'] + line['balanceDeposit'] + line['blockedBalance']
    line['rebate'] = line['rebateAgent'] + line['dividend']
    line['recharge'] += line['_recharge']
    line['consumeReal'] = line['consume']
    line['consume'] += line['cancelOrder']
    line['commission'] = line['dividend']
    line['time'], line['bTime'], line['eTime'] = bTime, bTime, eTime
    
    for k in keys + ['balanceAll']: line[k] = float('%.3f' % line[k])
    
    return line

'''报表统一加工'''
def format_report_line(line):
    keys = ['dividend', 'activity', 'rebateAgent', 'bonus', 'feeAmount', 'consume', 'cancelOrder', 
            'rebateConsume', 'recharge', 'withdraw', '_recharge', 'refuseWithdraw',
            'balanceAll', 'profit', 'profitUser', 'rebate']
    line['recharge'] += line['_recharge']
    line['rebate'] = line['rebateAgent'] + line['rebateConsume']
    line['profitUser'] = line['bonus'] - line['consume'] - line['feeAmount']
    line['profit'] = line['consume'] + line['feeAmount'] - line['bonus'] - line['rebateAgent'] \
        - line['rebateConsume'] - line['dividend']
    line['commission'] = line['dividend']
    line['actualConsume'] = line['consume'] - line['rebateConsume']
    del line['_recharge']
    
    for k in keys: 
        if k in line: line[k] = float('%.3f' % line[k])
    
def summary_game_report(sTime, eTime, page=0, size=20, thirdParty="CP138_3"):
    dts = {'list': [], 'summary': {}}
    if thirdParty!="CP138_3" and thirdParty!="": return dts
    
    db = Database()
    whr = " and (updateTime between %s and %s)"
    sql = "select count(account) users, ct, IFNULL(money, 0), IFNULL(rebate, 0), IFNULL(bonus, 0), d1, d2, d3 from \
        (SELECT DISTINCT account FROM `book` where 1" + whr + ") a \
        join (select count(*) ct, sum(amount) money from book where type='1300' " + whr + ") b \
        join (select sum(case when type='1409' then amount end) rebate, \
            sum(case when type='1301' then amount end) bonus from book where (type='1301' or type='1409')" \
            + whr + ") c \
        join (select sum(balance) d1, sum(blockedBalance) d2, sum(balanceDeposit) d3 from user) d"
    lines = []
    keys = ['userCount', 'betCount', 'consume', 'rebate', 'bonus', 'balance', 'blockedBalance', 'balanceDeposit']
    count, cursor = db.selectPage((sql), (sTime, eTime, sTime, eTime, sTime, eTime), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['pcMoney'] = 0 if line['userCount'] == 0 else line['consume'] / line['userCount']
        line['pcCount'] = 0 if line['userCount'] == 0 else line['betCount'] / line['userCount']
        line['profit'] = line['consume'] - line['bonus']
        line['balanceAll'] = line['balance'] + line['balanceDeposit'] + line['blockedBalance']
        line['balanceOut'], line['balanceIn'] = 0, 0
        for k in ['pcMoney', 'balanceAll', 'consume', 'bonus', 'rebate', 'profit']: line[k] = float('%.3f' % line[k])
        lines.append(line)
    return { "totalCount": count, "list": lines } 

'''个人游戏分析·在上边用户输赢报表基础上稍改'''
def summary_game_user(sTime, eTime, page=0, size=20, username="", team=0, thirdParty="CP138_3", byDay=1):
    dts = {'list': [], 'summary': {}}
    if thirdParty!="CP138_3" and thirdParty!="": return dts
    
    db = Database()
    keys = TPS.keys()
    '''用户表条件筛选'''
    whr, userFilter = "where 1", " order by loginTime desc"
    if username != "": whr += " and username='{}'".format(username)
    if whr != "where 1": userFilter = whr + userFilter
    ftm = "'%Y-%m-%d'" if byDay else "'%Y-%m'"
    
    '''根据是否包含下级决定查询用户范围'''
    sqlU = "select parent, child, type from \
            ( select parent, child, type from relation \
                    join (select * from user " + userFilter + ") b on b.username=parent \
                union (select username, username, type from user " + userFilter + ") \
            ) c "
    if not team: sqlU = "select username parent, username child, type from user " + userFilter
    
    sql = "select * from \
        (select parent, time, " + ','.join(['IFNULL(sum(' + k + '), 0) _' + k for k in keys]) + ", d.type " + \
            " from (select account, DATE_FORMAT(createTime," + ftm + ") as time, " + \
                ','.join("IFNULL(sum(case when type='" + TPS[keys[i]] + "' then amount end), 0) " + \
                     keys[i] for i in range(len(keys))) + \
                " from book b where status = 2 and (updateTime between %s and %s) group by account, time \
            ) a right join \
            ( " + sqlU + \
            ") d on child=account group by parent, time order by consume desc \
        ) al where _consume>0"
    print sql
    params = [sTime, eTime]
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i + 2]) for i, k in enumerate(keys))
        line['username'] = item[0]
        line['time'] = str(item[1]) if item[1] else (sTime + "-" + eTime[:10])
        line['type'] = int(item[len(keys) + 2])
        format_report_line(line)
        line['thirdParty'], line['balanceIn'], line['balanceOut'] = 'CP138_3', 0, 0
        
        lines.append(line)
    return { "totalCount": count, "list": lines } 


if __name__ == '__main__':
    #searchBill('Lucy', '2023-01-04', '2023-02-07')
#     print searchReport('qq123', '2023-08-07', '2023-08-08')
#     print searchReport(['PARENT', 'Lucy', 'qq123'], '2023-01-04', '2023-06-07')
#     print searchReport(['ALL', ''], '2023-07-20', '2023-07-28', 'date')
#     print searchReportLottery('zz88888', '2023-08-27', '2023-08-28')
    import json
    print json.dumps(searchReportTeam('test1994', '2023-06-05', '2023-06-10', ''), ensure_ascii=False)
#     print json.dumps(searchReportEx('', '2023-01-01', '2023-05-01', 0, 10, 1, ""), ensure_ascii=False)
#     print json.dumps(summary_by_hour())
#     print json.dumps(summary_report_all("2023-04-10", "2023-04-15"))
#     print json.dumps(summary_report_third("2023-04-10", "2023-04-15"))
#     print json.dumps(summary_game_report("2023-04-10", "2023-04-15"))
#     print json.dumps(summary_report_team("2023-06-05", "2023-06-15", 0, 20, "test1994")) # test002
#     print json.dumps(summary_game_user("2023-04-17", "2023-04-17", 0, 20, "test002", team=1, byDay=1))
#     print json.dumps(summary_by_hour("2023-04-18", "2023-04-20", 0, 20))
    
#     a = {}
#     a[123] = 156
#     print a['123']
    # print manageMoneyIn('', 0, 0, 0)
#     print manageMoney('Lucy', 'Lucy', '201901112039412248168266436651672', 0, tbName = 'money_in')
    
#     searchOrder("Lucy")
    pass

