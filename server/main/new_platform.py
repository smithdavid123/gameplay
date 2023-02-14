#coding: utf8

import json
from libs.utils import TM, T2S
from libs.database import Database
from mInit import getConfig, get_default_dividend, set_method_config_cache
from mBill import get_bank_list
from common.tools import level2point
from config import Config as C
from common.tools import point2level, common_operate
from mUser import get_user_group


def get_lottery_code_range():
    data = {"gameLotteryCodeRange": {
        "codeMax": getConfig("sysCodeMax"), "codeMin": getConfig("sysCodeMin")}
    } 
    
    return data

def get_data_summary():
    db = Database()
    tps = {'1301': 'bonus', '1300': 'consume', '1000': 'recharge', '1600': 'recharge', '1001': 'withdraw'}
    sql = 'select type, sum(amount) from book where status=2 and type in (' + \
        ','.join(tps.keys()) + ') group by type union select "1234", count(*) from user'
    
    tps['1234'] = 'reg' 
    items = {}
    for v in tps.values(): items[v] = 0.0 
    for (tp, v) in db.selectEx(sql, ()):
        items[tps[tp]] += round(float(v), 2)
    
    items['reg'] = int(items['reg']) 
    items['time'] = TM()
    return items

def get_data_today():
    db = Database()
    tps = {'1301': 'bonus', '1300': 'consume', '1000': 'recharge', '1600': 'recharge', '1001': 'withdraw'}
    sql = 'select type, sum(amount) from book where status=2 and date(updateTime)=CURDATE() and type in (' + \
        ','.join(tps.keys()) + ') group by type'
    
    items = {}
    for v in tps.values(): items[v] = 0.0 
    for (tp, v) in db.selectEx(sql, ()):
        items[tps[tp]] += round(float(v), 2)
    
    items['time'] = TM()
    return items


'''获取充值接口'''
def get_pay_source(db=None):
    if not db: db = Database()
    sql = "select name, mark, desp from config where category='paySource' and status=1"
    pms = []
    for (name, mark, desp) in db.select(sql, ''):
        for item in mark.split("|"):
            ps = item.split("-")
            pms.append({'name': name + ps[0], 'value': ps, 'desp': desp, 'paySource': name})
    return pms

'''获取充值方法列表'''    
def manage_pay_methods():
    db = Database()
    pms = get_pay_source(db)
    sql = "select * from pay_method"
    data = db.selectData(sql, (), False)
    
    return {'list': data, 'paySource': pms}


def save_pay_method(user, content):
    params = json.loads(content, encoding="utf8")
    db = Database()
    comands, id_ = [], params['id']
    isUpdate = str(id_) != '-1'
    del params['id'] 
    keys = params.keys()
    values = [params[k] for k in keys]
    sql = "insert into pay_method (" + ",".join(keys) + ") values (" + ",".join(map(lambda x:'%s', keys)) + ")"
    if isUpdate:
        sql = "update pay_method set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
        values.append(id_)
            
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    p = params
    label = ','.join([str(p['status']), p['paySource'], p['name'], p['method'], str(p['appId'])])
    paramsO = (user, 'pay_method', 'all', str(id_) + "-" + str(params['status']), label)
    
    comands += [[sql, values], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    return rst


'''
套利查询
atype - realName, , loginTime, regIp, lastIP
'''
def find_abnormal(atype="realName", repeat='', page = 0, size = 50, username=""):
    db = Database()
    fields = ['username', 'type', 'realName', 'password', 'regIp', 'registTime', 'loginTime', 'lastIP', 'status']
    keys = [f for f in fields if f != atype]
    
    whr = " where ct> 1 "
    lines, params = [], []
    if repeat != '':
        whr += ' and u.{}=%s'.format(atype)
        params.append(repeat)
    sql = ("select " + ','.join(keys) + ", u.{} from user u join (select {}, count(*) ct from user group by {}) r \
        on u.{}=r.{} and u.{}!=''" + whr + " order by u.{}").format(atype, atype, atype, atype, atype, atype, atype)
        
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line[atype] = item[-1]
        line['loginTime'] = str(line['loginTime'])
        line['registTime'] = str(line['registTime'])
        line['repeatType'] = "realName"
        lines.append(line)
        
    return {'totalCount': count, 'list': lines}

'''
用户套利查询: realName, password, regIp, lastIP
'''
def find_user_abnormal(username="", page = 0, size = 50):
    db = Database()
    keys = ['username', 'type', 'realName', 'password', 'regIp', 'registTime', 'loginTime', 'lastIP', 'status']
    lines = []
    sql = "select realName, regIp, lastIP, password from user where username=%s"
    U = db.selectData(sql, (username, ))
    sqls, params = [], []  
    if U['password'] != 'a123456': 
        sqls.append(['password', "select * from user where password=%s"])
    if U['realName'] and U['realName'] != '': 
        sqls.append(['realName', "select * from user where realName=%s"])
    if U['regIp'] and U['regIp'] != '': 
        sqls.append(['regIp', "select * from user where regIp=%s"])
    if U['lastIP'] and U['lastIP'] != '': 
        sqls.append(['lastIP', "select * from user where lastIP=%s"])
    
    if len(sqls) == 0: return {'totalCount': 0, 'list': []}
    alias = ['a', 'b', 'c', 'd']
    for i in range(len(sqls)): 
        sqls[i][1] = ("select " + ','.join(keys) + ", '_{}' from (" + sqls[i][1] + ") {}").format(sqls[i][0], alias[i])
        params.append(U[sqls[i][0]]) 
    sql = ' union '.join([s[1] for s in sqls])
    selfOnce = False
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        if line['username'] == username:
            if not selfOnce: 
                selfOnce = True
            else:
                continue 
        line['loginTime'] = str(line['loginTime'])
        line['registTime'] = str(line['registTime'])
        line['repeatType'] = item[len(keys)][1:]
        lines.append(line)
        
    return {'totalCount': count, 'list': lines}

'''删除银行卡'''
def del_cards(user, bid, cid):
    db = Database()
    sql = "select bankCardId, user from card where user in (select user from card where bankId=%s and bankCardId=%s)"
    comands = []
    ctx, owner = 0, None 
    for (_id, account) in db.select(sql, (bid, cid)):
        owner = account
        if _id != str(cid): ctx += 1
    if ctx == 0:
        sqlU = "update user set bindStatus=0 where username=%s"
        comands.append([sqlU, [owner]])
    sql, params = "delete from card where bankCardId=%s", [cid]
    
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    paramsO = (user, 'card', 'del', str(cid) + "- delete", '')
    
    comands += [[sql, params], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    return rst

'''后台管理获取银行卡列表'''
def get_cards():
    db = Database()
    banks = get_bank_list(db)
    res = db.selectData("select * from pay_transfer where 1 or payType=1", (), False)
    for line in res:
        line['createTime'] = str(line['createTime'])
    return {'banks': banks, 'list': res}

def set_card_status(user, id_, status):
    db = Database()
    sql = "update pay_transfer set isStop=%s where id=%s"
    params = [status, id_]
    
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    paramsO = (user, 'pay_transfer', 'all', str(id_) + "-" + str(status), '')
    
    comands = [[sql, params], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    return rst

def save_card(user, id_, bankId, branch, cardName, cardId, feeRate=0, forUsers='', platform=0, mark='', payType=0):    
    db = Database()
    banks = get_bank_list(db)
    bankNames = dict((b['id'], b['name']) for b in banks)
    bankId = int(bankId)
    bankName = bankNames.get(bankId, '')
    if bankName=='': return False, "银行信息有误"
    
    fields = {'bankId': bankId, 'bankName': bankName, 'bankBranch': branch, 'bankCardName': cardName, 'bankCardId': cardId, 
              'fee': feeRate, 'forUsers': forUsers, 'platform': platform, 'mark': mark, 'payType': payType}
    comands = []
    isUpdate = str(id_) != '-1'
    keys = fields.keys()
    values = [fields[k] for k in keys]
    sql = "insert into pay_transfer (" + ",".join(keys) + ") values (" + ",".join(map(lambda x:'%s', keys)) + ")"
    if isUpdate:
        sql = "update pay_transfer set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
        values.append(id_)
            
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    label = ','.join([branch, cardName, str(cardId), str(payType), str(feeRate)])
    paramsO = (user, 'pay_transfer', 'all', str(id_) + "-" + str(bankId), label)
    
    comands += [[sql, values], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    return rst

def del_user_group(user, id_):
    db = Database()
    sql = "delete from user_group where id=%s"
    rst = db.execute(sql, (id_, ))
    
    return rst != -1

def set_user_group(user, id_, code, name, level, pointLimit1, pointLimit2, agent=-1, allowEqualCode=True):
    db = Database()
    fields = {'code': code, 'name': name, 'level': level, 'pointLimit1': pointLimit1, 
              'pointLimit2': pointLimit2, 'agent': agent, 'allowEqualCode': allowEqualCode} 
    comands = []
    isUpdate = str(id_) != '-1'
    keys = fields.keys()
    values = [fields[k] for k in keys]
    sql = "insert into user_group (" + ",".join(keys) + ") values (" + ",".join(map(lambda x:'%s', keys)) + ")"
    if isUpdate:
        sql = "update user_group set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
        values.append(id_)
    
    '''级别同步更新，原则上级别限定应该使用外键'''
    sqlD = "update dividend_admin set pointLimit1=%s, pointLimit2=%s where userGroup=%s"
    paramD = [pointLimit1, pointLimit2, code]
    
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    label = ','.join([code, name, str(level), str(pointLimit1), str(pointLimit2)])
    paramsO = (user, 'user_group', 'all', str(id_) + "-" + str(agent), label)
    
    comands += [[sql, values], [sqlD, paramD], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    return rst

'''针对系统默认级别分红,在此生成记录,用于分页请求和个性化修改'''
'''TODO: 因逻辑未名了, 以后再启用此功能,暂不支持查看和修改'''
def sql_dvidend_system(username=""):
    sql = "select 0 accountFrom, id, 0 accountTo, 0 activeUser, 'system', name, 1 withPlatform, -1 rid, '平台', 1 from ( \
        select c.id cid, u1.username name, u1.id id, u2.point pt from user u1 left join user u2 on \
            u1.parentName=u2.username left join dividend_config c on u1.username=c.uSecond \
            where u1.point={} and IFNULL(u1.dividendStatus, '')<>-2 \
        ) u where pt={} and cid is null"
    if username!="": sql += " and name='{}'".format(username)
    p = level2point(C.SYS_DIVIDEND_POINT)
    pp = '%.1f' % (p + 0.1)
    sql = sql.format(p, pp)
    
    return sql
    

'''获取所有契约'''
def get_dvidend_list(user="", parent="", status="",  limit1="", limit2="", withPlatform="", page=0, size=20):
    db = Database()
    keys = ['accountFrom', 'accountTo', 'activeUser', 'scalePoint', 'extraRules', 'uSecond', 'withPlatform']
    sql = "select " + ','.join(keys) + ", c.id as id, username as parent, dividendStatus from dividend_config c \
        left join user u on u.id=accountTo"
    whr, params = " where accountTo<>0", []
    flag, cfg = True, get_default_dividend(db)
    if user != "":
        whr += " and uSecond=%s"
        params.append(user)
    if parent != "":
        whr += " and parentName=%s"
        params.append(parent)
        flag = False
    if status != "":
        whr += " and dividendStatus=%s"
        params.append(status)
    if limit1 != "":
        whr += " and scalePoint>%s"
        params.append(limit1)
        if float(limit1) >= float(cfg['scalePoint']): flag = False 
    if limit2 != "":
        whr += " and scalePoint<%s"
        params.append(limit2)
        if float(limit2) <= float(cfg['scalePoint']): flag = False
    if str(withPlatform) == '1':
        whr += " and withPlatform=%s"
        params.append(withPlatform)
    if flag: sql = sql_dvidend_system(user) + " union " + sql
    
    lines = []
    keys2 = ['id', 'parent', 'status']
    count, cursor = db.selectPage((sql + whr), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        for i, k in enumerate(keys2): line[k] = item[i + len(keys)]
        '''默认级别有分红, 标准规则未入表'''
        if line['extraRules'] == "system":
            for k in ['activeUser', 'scalePoint', 'extraRules']: line[k] = cfg[k]
        if int(line['withPlatform']): line['parent'] = "平台"
        lines.append(line)
    
    return { "totalCount": count, "list": lines }

    items = db.selectData(sql + whr, tuple(params), False)
    
    return items

'''新增、修改契约'''
def set_dvidend(user, username, id_ = -1, accountFrom=0, accountTo=0, activeUser=0, scalePoint=0, extraRules='[]', log=True):
    db = Database()
    fields = {'uSecond': username, 'accountFrom': accountFrom, 'accountTo': accountTo, 'activeUser': activeUser, 
              'scalePoint': scalePoint, 'extraRules': extraRules, 'withPlatform': 0} 
    isUpdate = str(id_) != '-1'
    if int(accountFrom)==0: fields['withPlatform'] = 1
    keys = fields.keys()
    values = [fields[k] for k in keys]
    sql = "insert into dividend_config (" + ",".join(keys) + ") values (" + ",".join(map(lambda x:'%s', keys)) + ")"
    if isUpdate:
        sql = "update dividend_config set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
        values.append(id_)
    comands = [[sql, values]]
    
    '''对于管理员新增契约情况'''
    if not log: return comands
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    label = ','.join([username, str(accountFrom), str(activeUser), str(scalePoint)])
    paramsO = (user, 'user_group', 'all', str(id_), label)
    comands += [[sqlO, paramsO]]
        
    rst = db.Transaction(comands)
    
    return rst
        
def del_dividend(user, id_):
    db = Database()
    sql, params = "delete from dividend_config where id=%s", (id_, )
    sqlU = "update user set dividendStatus=-2 where username in (select uSecond from dividend_config where id=%s)"
    line = common_operate(user, "", "add dividend", "change dividendStatus", 'dividendStatus')
    flag, data = db.Transaction([[sqlU, params], [sql, params], line])
    
    return flag, "保存失败"

def add_dividend(user, username):
    db = Database()
    res = db.selectEx("select id, dividendStatus, point from user where username=%s", (username, ))
    if len(res) == 0: return False, "用户不存在！"
    id_, status, point = res[0]
    level = point2level(point)
    
    if (status!=None or level==C.SYS_DIVIDEND_POINT) and int(status)!=-2: return False, "该用户已存在契约，无法添加！"
    
    sql = "update user set dividendStatus=0 where username=%s"
    params = (username, )
    
    cfg = get_default_dividend(db)
    command = set_dvidend(user, username, -1, 0, id_, cfg['activeUser'], cfg['scalePoint'], cfg['extraRules'], False)
    
    line = common_operate(user, 'user', username, "add dividend", 'dividendStatus')
    command += [[sql,params], line]
    flag, data = db.Transaction(command)
    
    return flag, "保存失败"

'''操作日志'''
def common_operate(user, table, content="", label="", field=""):
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    paramsO = (user, table, field, content, label)
    return [sqlO, paramsO]
    

def pre_add_dvidend(user, username):
    return add_dividend(user, username)
    
    '''
    db = Database()
    keys = ['userId', "parentId", "parent", "dividendStatus"]
    sql = "select uid, u.id, parent, ds from user u join ( \
        select id uid, parentName parent, dividendStatus ds from user where username=%s) \
        a on a.parent=u.username"
    item = {}
    for item in db.select(sql, (username, )):
        item = dict((k, item[i]) for i, k in enumerate(keys))
        break
    return item
    '''

def lottery_method_loss_list(lottery="cqssc"): 
    db = Database()
    sql = "select m.type, groupName, name, methodName, bonus, rebate, m.sort, hitRate from game_method m \
        left join game_config g on m.type=g.type where g.lottery=%s"
    lines = {}
    keys = ['type', 'groupName', 'name', 'methodName', 'bonus', 'rebate', 'showOrder', 'hitRate']
    for item in db.select(sql, (lottery, )):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['id'] = -1
        lines[item[3]] = line
        
    sqlL = "select id, method, bonus, rebate, showOrder from game_method_limit where lottery=%s"
    for (id_, method, bonus, rebate, showOrder) in db.select(sqlL, (lottery, )):
        lines[method]['id'] = id_
        lines[method]['bonus'] = bonus
        lines[method]['rebate'] = rebate
        lines[method]['showOrder'] = showOrder
    
    return lines

def set_lottery_method_loss(user, lottery, method, type_, bonus, rebate, showOrder, id_):
    db = Database()
    sql = "update game_method_limit set bonus=%s, rebate=%s, showOrder=%s, bonusDiff=1 where id = %s"
    params = [bonus, rebate, showOrder, id_]
    if str(id_) == '-1':
        info = {'user': user, 'lottery': lottery, 'method': method, 'type': type_, 'bonus': bonus,
            'rebate': rebate, 'showOrder': showOrder, 'bonusDiff': 1}
        keys = info.keys()
        sql = "insert into game_method_limit (" + ",".join(k for k in keys) + ") values \
        (" + ",".join('%s' for k in keys) + ")"
        params = [info[k] for k in keys]
        
    line = common_operate(user, 'user', "change bonus", lottery + "_" + method, 
                          str(bonus) + "_" + str(rebate) + "_" + str(showOrder))
    command = [[sql,params], line]
    flag, data = db.Transaction(command)
    if flag: set_method_config_cache(lottery, method, bonus, rebate)
    
    return flag, data
    
'''彩种日分析报表·玩法日分析报表'''     
def lottery_report_day(sTime, eTime, page=0, size=20, lottery="", method="", byDay=1, field="lottery"):
    db = Database()
    ftm = "'%Y-%m-%d'" if byDay else "'%Y-%m'"
    whr = "status>0 and (openTime between %s and %s)"
    if lottery != '': whr += " and lottery='{}'".format(lottery)
    if method != '': whr += " and o.method='{}'".format(method)
    '''field为lottery和method时使用辅助表和字段不同'''
    name, tb, tbf = "g.showName", "game_config", "lottery" 
    if field != "lottery": name, tb, tbf = "g.name", "game_method", "methodName" 
    sql = "select {}, uc, b.{}, b.time, consume, win, po, pa from \
        (select {}, time, count(*) uc from \
            (select DISTINCT {}, DATE_FORMAT(openTime, " + ftm + ") as time, account from game_order o where " + \
            whr + ") w group by {}, time \
        ) a join \
        (select {}, DATE_FORMAT(openTime, " + ftm + ") as time, sum(money) consume, sum(winMoney) win from \
            game_order o where " + whr + " group by {}, time \
        ) b on a.{}=b.{} and a.time=b.time \
        left join ( \
            select o.{} {}, DATE_FORMAT(openTime, " + ftm + ") as time, IFNULL(sum(case when type='1302' then amount end), 0) po, \
            IFNULL(sum(case when type='1400' then amount end), 0) pa \
            from game_order o join book k on k.reference=o.billno where (type='1302' or type='1400') \
            and o." + whr + " group by {}, time \
        ) c on c.{}=b.{} and c.time=b.time \
        join {} g on g.{}=b.{}"
    sql = sql.format(name, field, field, field, field, field, field, field, field, field, field, field, field, field, \
                     tb, tbf, field)
    lines = []
    keys = ['category', 'betCount', 'lottery', 'time', 'consume', 'bonus', 'orderRebate', 'agentRebate']
    count, cursor = db.selectPage((sql), (sTime, eTime, sTime, eTime, sTime, eTime), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['profit'] = line['consume'] - line['bonus']
        for k in ['profit', 'consume', 'bonus', 'orderRebate', 'agentRebate']: line[k] = '%.3f' % line[k] if line[k] else 0
        lines.append(line)
    return { "totalCount": count, "list": lines } 
    

'''个人彩种分析'''     
def lottery_report_user(sTime, eTime, page=0, size=20, lottery="", method="", byDay=1):
    db = Database()
    ftm = "'%Y-%m-%d'" if byDay else "'%Y-%m'"
    whr = "status>0 and (openTime between %s and %s)"
    if lottery != '': whr += " and lottery='{}'".format(lottery)
    if method != '': whr += " and o.method='{}'".format(method)
    sql = "select b.{}, b.time, IFNULL(consume, 0), IFNULL(win, 0), IFNULL(po, 0), IFNULL(pa, 0) from \
        (select {}, DATE_FORMAT(openTime, " + ftm + ") as time, sum(money) consume, sum(winMoney) win from \
            game_order o where " + whr + " group by {}, time \
        ) b \
        left join ( \
            select o.{} {}, DATE_FORMAT(openTime, " + ftm + ") as time, IFNULL(sum(case when type='1302' then amount end), 0) po, \
            IFNULL(sum(case when type='1400' then amount end), 0) pa \
            from game_order o join book k on k.reference=o.billno where (type='1302' or type='1400') \
            and o." + whr + " group by {}, time \
        ) c on c.{}=b.{} and c.time=b.time"
    field = "account"
    sql = sql.format(field, field, field, field, field, field, field, field)
    print sql
    lines = []
    keys = ['account', 'time', 'consume', 'bonus', 'orderRebate', 'agentRebate']
    count, cursor = db.selectPage((sql), (sTime, eTime, sTime, eTime), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['profit'] = line['consume'] - line['bonus']
        for k in ['profit', 'consume', 'bonus', 'orderRebate', 'agentRebate']: line[k] = '%.3f' % line[k] if line[k] else 0
        lines.append(line)
    return { "totalCount": count, "list": lines }     
    
def send_message(user, isSys, title, content, toUsers):
    db = Database()
    items = {'fromUser': user, 'isSys': isSys, 'title': title, 'content': content, 'toUsers': toUsers}
    keys = items.keys() 
    sql = "insert into message (" + ','.join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")"
    params = tuple([items[k] for k in items]) 
    '''操作日志'''    
    line = common_operate(user, 'message', "{}:{}".format(isSys, title), toUsers[:16])
    commands = [[sql, params], line]
    
    rst = db.Transaction(commands)
    
    return rst

'''获取消息列表'''
def get_message_list(sTime, eTime, title = "", fromUser = "", page = 0, size = 20):
    db = Database()
    keys = ['id', 'title', 'fromUser', 'toUser', 'isSys', 'content', 'userCount', 'createTime', 'readStatus', 'isDel']
    sql = "select * from message where (createTime between %s and %s) "
    params = [sTime, eTime]
    if title != '':
        sql += " and title=%s"
        params.append(title)
    if fromUser != '':
        sql += " and fromUser=%s"
        params.append(fromUser)
    sql += " order by createTime desc"
    lines = []
    count, cursor = db.selectPage((sql), params, page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['createTime'] = str(line['createTime'])
        lines.append(line)
        
    return { "totalCount": count, "list": lines }

def del_message(user, id_):
    db = Database()
    sql, params = "delete from message where id=%s", (id_, )
    line = common_operate(user, "message", "delete message:{}".format(id_), str(id_))
    flag, data = db.Transaction([[sql, params], line])
    
    return flag, data    

'''活动列表'''
def get_activity_list(name, type_, page = 0, size = 20):
    db = Database()
    sql = "select * from activity_conf where 1"
    msg_list = db.read_all(sql)
    for item in msg_list:
        item['createTime'] = str(item['createTime']) 
        item['beginTime'] = str(item['beginTime'])
        item['endTime'] = str(item['endTime'])
    return { "totalCount": 10, "list": msg_list }
    
def save_activity(user, content):
    params = json.loads(content, encoding="utf8")
    db = Database()
    comands, id_ = [], params['id']
    isUpdate = str(id_) != '-1'
    del params['id'] 
    params['optUser'] = user
    keys = params.keys()
    params['content'] = json.dumps(params['content'], ensure_ascii=False)
    values = [params[k] for k in keys]
    sql = "insert into activity_conf (" + ",".join(keys) + ") values (" + ",".join(map(lambda x:'%s', keys)) + ")"
    if isUpdate:
        sql = "update activity_conf set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
        values.append(id_)
            
    '''操作日志'''
    line = common_operate(user, "activity_conf", content, str(id_))
    
    comands += [[sql, values], line]
    rst = db.Transaction(comands)
    
    return rst

def del_activity(user, id_):
    db = Database()
    sql, params = "delete from activity_conf where id=%s", (id_, )
    line = common_operate(user, "activity_conf", "change activity:{}".format(id_), str(id_))
    flag, data = db.Transaction([[sql, params], line])
    
    return flag, data  

def get_activity_records(user = '', name = '', type_ = '', status = '', page = 0, size = 20):
    db = Database()
    keys = ['startDate', 'endDate', 'activeUser', 'amount', 'scalePoint', 'totalConsume', 'totalLoss', 'username', 
            'totalRecharge', 'applyTime', 'paySource']
    sql = "select " + ','.join(keys) + ", d.id, d.status, a.name, a.atype from dividend_log d left join activity_conf a \
        on d.configId=a.id where 1"
    params = []
    if name != '':
        sql += " and a.name=%s"
        params.append(name)
    if user != '':
        sql += " and username=%s"
        params.append(user)
    if type_ != '':
        sql += " and a.atype=%s"
        params.append(type_)
    if status != '':
        sql += " and d.status=%s"
        params.append(status)
        
    sql += " order by d.createTime desc"
    lines = []
    count, cursor = db.selectPage((sql), params, page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['id'] = item[len(keys)]
        line['status'] = item[len(keys) + 1]
        line['name'] = item[len(keys) + 2]
        line['atype'] = item[len(keys) + 3]
        for k in ['startDate', 'endDate', 'applyTime']: line[k] = str(line[k])
        lines.append(line)
        
    return { "totalCount": count, "list": lines }
    

'''人工转账列表查看'''    
def get_operate_money (userIn = '', userOut = '', transType = '', remarks = '', status = '', 
                       page = 0, size = 20, sDate='', eDate=''):
    db = Database()
    keys = ['account', 'billno', 'amount', 'mark', 'userInfo', 'status', 'confirmTime', 'confirmUser', 'createTime']
    sql1 = "select 0 as transType, " + ','.join(keys) + " from money_in where isSys = 1"
    sql2 = "select 1 as transType, " + ','.join(keys) + " from money_out where isSys = 1"
    sql = "select * from (" + sql1 + " union " + sql2 + ") a where createTime between %s and %s"
    params = [sDate, eDate]
    if userIn != '':
        sql += " and account=%s and transType=0"
        params.append(userIn)
    if userOut != '':
        sql += " and account=%s and transType=1"
        params.append(userOut)
    if transType != '':
        sql += " and transType=%s"
        params.append(transType)
    if remarks != '':
        sql += " and userInfo=%s"
        params.append(remarks)
    if status != '':
        sql += " and status=%s"
        params.append(status)
    print sql
    lines = []
    count, cursor = db.selectPage((sql), params, page, size)
    for item in cursor:
        line = dict((k, item[i + 1]) for i, k in enumerate(keys))
        line['transType'] = item[0]
        line['userIn'] = line['account'] if line['transType'] == 0 else '-'
        line['userOut'] = line['account'] if line['transType'] == 1 else '-'
        for k in ['confirmTime', 'createTime']: line[k] = str(line[k])
        lines.append(line)
        
    return { "totalCount": count, "list": lines }


    
    
if __name__ == '__main__':
#     print get_operate_money(sDate='2023-02-18', eDate='2023-06-18')
    del_cards('sys', 1)
    
    