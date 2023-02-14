#coding: utf8

import json
import datetime
from libs.database import Database
from mUser import formatLog
from libs.log import L
from libs.utils import TM
import mReport as MR
import mBill as MB

def get_user_info(user):
    db = Database()
    sql = "select * from user where username=%s"
    res = db.selectData(sql, (user, ))
    items = {}
    for k, v in res.items():
        items[k] = v if type(v)!=datetime.datetime else str(v)
        
    return items

def get_user_cards(user):
    db = Database()
    # 'uid': 'memberId', 'utype': 'memberType', 
    keys = {'bankCardName': 'cardholder', 'addTime': 'createDate', 'isDel': 'state',
            'id': 'cardId', 'bankId': 'bankId', 
            'bankName': 'bankName', 'bankCardId': 'bankCardNo', 'bankBranch': 'bankDeposit'}
    sql = "select " + ",".join(keys) + " from card where user=%s"    
    lines = []
    for item in db.select(sql, (user, )):
        line = dict((keys[k], item[i]) for i, k in enumerate(keys))
        line['createDate'] = str(line['createDate'])
        line['bankProvince'] = ''
        line['bankCity'] = ''
        lines.append(line)
    
    return lines 

def list_account_adm(username="", level="", status=""):
    db = Database()
    keys = ['username', 'realName', 'registTime', 'parentName', 'level', 'tel', 'status']
    sql, params = "select " + ",".join(keys) + " from user where type=6", []
    if username!="":
        sql += " and username=%s"
        params.append(username)
    if level!="":
        sql += " and level=%s" if int(level) < 5 else " and level>=%s" 
        params.append(level)
    if status!="":
        sql += " and status=%s"
        params.append(status)
    
    lines = []
    for item in db.select(sql, tuple(params)):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line["registTime"] = str(line["registTime"])
        lines.append(line)
    return lines
    
def set_account_power(user, username, level):
    db = Database()
    sql = "update user set level=%s where username=%s"
    params = [level, username]
    command = formatLog(user, username, {'chenge_level': json.dumps(params, ensure_ascii = False)}, 'user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, "操作失败"

def list_forbid_user(username="", page=0, size=20, third="", lottery="", method=""):
    db = Database()
    keys = ['username', 'thirdParty', 'thirdPartyName', 'lottery', 'method', 'groupName', 'name']
    sql = "SELECT f.id as id, " + ",".join(keys) + " FROM forbid_user f left join game_method m on f.method=m.methodName where 1"
    params = []
    if username!="": sql += " and username like '%{}%'".format(username)
    if third!="":
        sql += " and thirdParty=%s"
        params.append(third)
    if lottery!="":
        sql += " and lottery=%s"
        params.append(lottery)
    if method!="":
        sql += " and method=%s"
        params.append(method)
    
    L.debug(sql, params)
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i + 1]) for i, k in enumerate(keys))
        line['id'] = item[0]
        if not line['groupName']: line['groupName'] = ""
        if not line['name']: line['name'] = ""
        line['name'] += line['groupName'] + line['name']
        del line['groupName']
        lines.append(line)
        
    return { "totalCount": count, "list": lines }

def add_forbid_user(user, username="", third="", lottery="", method="", thirName="", _type=None):
    db = Database()
    items = {'username': username, 'thirdParty': third, 'thirdPartyName': thirName, 
              'lottery': lottery, 'method': method, 'type': _type}
    sql = "insert into forbid_user (" + ",".join(items.keys()) + ") values (" + \
        ",".join(['%s' for k in items]) + ")"
    params = [items[k] for k in items.keys()]
    command = formatLog(user, username, {'add_forbid': json.dumps(params, ensure_ascii = False)}, 'forbid_user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, "操作失败"    

def del_forbid_user(user, id_):
    db = Database()
    sql = "delete from forbid_user where id=%s"
    params = [id_]
    command = formatLog(user, str(id_), {'del_forbid': json.dumps(params, ensure_ascii = False)}, 'forbid_user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, "操作失败"  
    
'''游戏列表·方法列表'''
def list_game_method():
    db = Database()
    lotterys, methods = [], {}
    keysM = ["id", "type", "groupName", "name", "methodName"]
    sql = "select " + ",".join(keysM) + " from game_method"
    cursor = db.select(sql, ())
    for item in cursor:
        line = dict((keysM[i], item[i]) for i in range(len(keysM))) 
        line['name'] = line['groupName'] + line['name']
        del line['groupName']
        if line['type'] not in methods: methods[line['type']] = []
        methods[line['type']].append(line)
    
    keysG = ["id", "lottery", "showName", "shortName", "type"]
    sql = "select " + ",".join(keysG) + " from game_config"
    for item in db.select(sql, (), cursor):
        line = dict((keysG[i], item[i]) for i in range(len(keysG))) 
        lotterys.append(line)
    
    return {'lotterys': lotterys, 'methods': methods}

def set_link_status(user, id_, status):
    db = Database()
    sql = "update links set status=%s where id=%s"
    params = [status, id_]
    command = formatLog(user, str(id_), {'set_link_status': json.dumps(params, ensure_ascii = False)}, 'links')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, "操作失败"  

def summary_user_today(sTime='', eTime='', page=0, size=20, byHour=1):
    db = Database()
    ftm = "'%Y-%m-%d %H:00:00'" if byHour else "'%Y-%m-%d'"
    whrb = " and b.updateTime between %s and %s "
    sql1 = "select tm, 0 reg, 0 click, IFNULL(sum(case when type='1000' or type='1600' then ct end), 0) moneyIn1, \
        IFNULL(sum(case when type='1001' then ct end), 0) moneyOut1, \
        IFNULL(sum(case when type='1300' then ct end), 0) consume1, 0 moneyIn2, 0 moneyOut2, 0 consume2 from \
        (select type, tm, count(account) ct from \
            (SELECT b.type as type, DATE_FORMAT(b.updateTime, " + ftm + ") as tm, account FROM book b \
            join user u on username=b.account where (b.type='1000' or b.type='1600' or b.type='1300' or b.type='1001') \
            and b.status=2 " + whrb + " and date(registTime) = DATE_FORMAT(b.updateTime, '%Y-%m-%d') \
            group by b.type, tm, account \
            ) a group by type, tm \
        ) c group by tm"
    
    sql2 = "select tm, 0 reg, 0 click, 0 moneyIn1, 0 moneyOut1, 0 consume1, \
        IFNULL(sum(case when type='1000' or type='1600' then ct end), 0) moneyIn2, \
        IFNULL(sum(case when type='1001' then ct end), 0) moneyOut2, \
        IFNULL(sum(case when type='1300' then ct end), 0) consume2 from \
        (select type, tm, count(account) ct from \
            (SELECT b.type as type, DATE_FORMAT(b.updateTime, " + ftm + ") as tm, account FROM book b \
            join user u on username=b.account where (b.type='1000' or b.type='1600' or b.type='1300' or b.type='1001') \
            and b.status=2 " + whrb + "  and date(registTime) < DATE_FORMAT(b.updateTime, '%Y-%m-%d') \
            group by b.type, tm, account \
            ) a group by type, tm \
        ) c group by tm"
    
    fs = "0 moneyIn1, 0 moneyOut1, 0 consume1, 0 moneyIn2, 0 moneyOut2, 0 consume2"
    sql3 = "SELECT DATE_FORMAT(loginTime, " + ftm + ") as tm, 0 reg, count(*) click," + fs + " FROM user where \
        loginTime between %s and %s and date(registTime) =  DATE_FORMAT(loginTime, '%Y-%m-%d') group by tm"
    sql4 = "SELECT DATE_FORMAT(registTime, " + ftm + ") as tm, count(*) reg, 0 click," + fs + \
        " FROM user where registTime between %s and %s group by tm"
    
    sql = "select tm, sum(reg) creg, sum(click) cclk, sum(moneyIn1) mi1, sum(moneyIn2) mi2, sum(moneyOut1) mo1, sum(moneyOut2) mo2, \
        sum(consume1) cm1, sum(consume2) cm2 from (" + sql1 + " union " + sql2 + " union " + sql3 + " union " + sql4 + \
        ") g group by tm order by tm desc"
    
    lines = []
    params = [sTime, eTime, sTime, eTime, sTime, eTime, sTime, eTime]
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    keys = ['tm', 'reg', 'click', 'moneyIn1', 'moneyIn2', 'moneyOut1', 'moneyOut2', 'consume1', 'consume2']
    for item in cursor:
        line = dict((k, item[i] if k=='tm' else int(item[i])) for i, k in enumerate(keys))
        lines.append(line)
    
    return { "totalCount": count, "list": lines }

'''提现订单锁定与解锁：1 - 锁定，0 - 解锁'''
def lock_money_out(user, billno, status):
    db = Database()
    sql = "select account, lockUser, checkStatus from money_out where billno = %s for update"
    cnx, cursor = db.Query(sql, (billno, ))
    res = cursor.fetchall()
    if len(res) == 0: return False, '订单信息有误！'
    username, lcUser, flag = res[0] 
    if status and lcUser == user: return True, "已锁定"
    if status and lcUser: return False, '该订单已被其它用户锁定！'
    if (flag!=1 and flag!=2 and flag!=-2): return False, '状态为待处理或待确认的订单才能被锁定！'
    
    sql = "update money_out set lockUser=%s where billno = %s"
    params = [user if status else None, billno]
    command = formatLog(user, username, {'lock_money_out': json.dumps(params, ensure_ascii = False)}, 'money_out')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.log(flag, rst)
    return flag, "操作失败"  

'''-------------------------------------华丽丽-----------------------------------------
checkStatus: 真实含义
    0     -     待处理
    -1     -    风控拒绝
    1     -    风控通过 
    2     -    财务通过 
    -2     -    财务拒绝 
    3     -    提现完成
    
风控审核页：
    0    -    待审核
    1    -    审核通过
    -1    -    审核拒绝
    2    -    提现处理中
    3     -    提现完成
    
出款审核页
    1    -    待处理
    2    -    待确认
    3    -    提现完成
    -2    -    提现拒绝
'''

'''
    风控审核状态：1 - 通过，-1 - 拒绝
    param:    status    1 - 通过, 0 - 拒绝 
'''
def risk_money_out(user, billno, status, refuseReason=""):
    db = Database()
    sql = "select account, checkStatus from money_out where billno = %s for update"
    cnx, cursor = db.Query(sql, (billno, ))
    res = cursor.fetchall()
    if len(res) == 0: return False, '订单信息有误！'
    username, flag = res[0] 
    print flag, flag==2, flag==3, flag==-2
    if (flag==2 or flag==3 or flag==-2): return False, '订单已被审核，不能重复处理！'
    
    sql = "update money_out set checkUser=%s, checkTime=%s, checkStatus=%s, refuseReason=%s where billno = %s"
    params = [user, TM(), 1 if status else -1, refuseReason, billno]
    command = formatLog(user, username, {'risk_money_out': json.dumps(params, ensure_ascii = False)}, 'money_out')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command, cnx, cursor, False)
    
    '''直接拒绝'''
    if flag and int(status) == 0: flag, rst = MB.manageMoneySetOut(user, username, billno, 0, True)
    
    L.log(flag, rst)
    return flag, rst  

'''
    财务审核状态：2 - 通过，-2 - 拒绝
    param:    status    1 - 通过, 0 - 拒绝 
'''
def finance_money_out(user, billno, status, payType=0, refuseReason=""):
    db = Database()
    sql = "select account, lockUser, checkStatus from money_out where billno = %s for update"
    cnx, cursor = db.Query(sql, (billno, ))
    res = cursor.fetchall()
    if len(res) == 0: return False, '订单信息有误！'
    username, checkUser, flag = res[0]
    if checkUser and checkUser!=user: return False, '订单已被其它人员锁定，不能处理！'
    if flag!=1 and flag!=2 and flag!=-2: return False, '订单不是待处理状态，不能被审核！'
    
    sql = "update money_out set lockUser=%s, confirmUser=%s, confirmTime=%s, checkStatus=%s, payType=%s, \
        confirmReason=%s where billno = %s"
    params = [user, user, TM(), 2 if status else -2, payType, refuseReason, billno]
    command = formatLog(user, username, {'finance_money_out': json.dumps(params, ensure_ascii = False)}, 'money_out')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.log(flag, rst)
    return flag, "操作失败"  

def summary_money_out_type(payType="", sTime="", eTime=""):
    db = Database()
    sql = "select payType, sum(amount), sum(actualAmount), sum(feeAmount), count(*) from money_out where checkStatus=3"
    params = []
    if payType!="":
        sql += " and payType=%s"
        params.append(payType)
    if sTime!="":
        sql += " and confirmTime>=%s"
        params.append(sTime)
    if eTime!="":
        sql += " and confirmTime<=%s"
        params.append(eTime)
    sql += " group by payType"
    lines = []
    keys = ['type', 'amount', 'actualAmount', 'feeAmount', 'count']
    for item in  db.select(sql, tuple(params)):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        lines.append(line)
    
    return lines

def init_user_passwd(user, username):
    db = Database()
    sql = "update user set password=%s where username = %s"
    params = ['888888', username]
    command = formatLog(user, username, {'init_password': json.dumps(params, ensure_ascii = False)}, 'user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    return flag, "操作失败"  

def init_user_withdraw_password(user, username):
    db = Database()
    sql = "update user set withdrawPassword=%s where username = %s"
    params = ['888888', username]
    command = formatLog(user, username, {'init_withdrawPassword': json.dumps(params, ensure_ascii = False)}, 'user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    return flag, "操作失败"  

def init_user_security(user, username):
    db = Database()
    sql = "update user set securityStatus=null where username = %s"
    params = [username]
    command = formatLog(user, username, {'init_user_security': json.dumps(params, ensure_ascii = False)}, 'user')
    sqlS = "delete from security where user=%s"
    command.append([sql, params])
    command.append([sqlS, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    return flag, "操作失败"  

'''操作日志'''
def common_operate(user, table, content="", label="", field=""):
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    paramsO = (user, table, field, content, label)
    return [sqlO, paramsO]

def get_money_out_limit(username):
    db = Database()
    sql = "select * from money_out_limit where username=%s"
    res = db.selectData(sql, (username, ))
    
    return res

'''设置用户提款限制'''
def set_money_out_limit(user, username, id_=-1, content=""):
    params = json.loads(content, encoding="utf8")
    db = Database()
    isUpdate = str(id_) != '-1'
    if id in params: del params['id'] 
    keys = params.keys()
    values = [params[k] for k in keys]
    sql = "insert into money_out_limit (" + ",".join(keys) + ") values (" + ",".join(map(lambda x:'%s', keys)) + ")"
    if isUpdate:
        sql = "update money_out_limit set " + ",".join([(k + " = %s") for k in keys]) + " where id = %s"
        values.append(id_)
    
    txt = ','.join(['' if v==None else str(v) for v in values])
    line = common_operate(user, 'money_out_limit', txt, username)
    comands = [[sql, values], line]
    rst = db.Transaction(comands)
    
    return rst

'''检查修改后的点位是否合法'''
def check_point_change(user, point, db = None):
    if not db: db = Database()
    sql = "select point from user where username = %s"
    info = db.selectData(sql, (user, ))
    if ('%.1f' % info['point']) == ('%.1f' % point): return True
    
    sql = "select max(point) mp from user where username in (select child from relation where parent = %s)"
    info = db.selectData(sql, (user, ))
    return float(point) >= info['mp']

def change_team_status(user, key, status):
    sql = "update user set {}=%s where username in (select child from relation where parent=%s)".format(key)
    params = [status, user]
    return [sql, params]

'''修改用户基本信息'''    
def change_user_info(user, username, content=""):
    params = json.loads(content, encoding="utf8")
    db = Database()
    keys = ['agentPercent', 'email', 'weixin', 'tel', 'markPerson', 'markTeam', 'status', 'allowWithdraw', 
            'allowOrder', 'allowDividend', 'allowAgent', 'abnormal', 'allowTransfer', 'allowTeamLogin', 
            'allowTeamWithdraw', 'allowTeamTransfer', 'dividendGroup', 'point', 'realName', 'userLevel']
    sql = "update user set " + ",".join([k + "=%s"  for k in keys]) + " where username=%s"
    comands = []
    '''特殊处理'''
    if params['realName'] == '': params['realName'] = None
    if str(params['cardId']) != '-1': 
        sqlC = "update card set bankCardId = %s where id = %s"
        comands.append([sqlC, [params['bankCardId'], params['cardId']]])
    if not check_point_change(username, params['point']): return False, "用户点位不能低于下级！"
    
    values = [params[k] for k in keys] + [username]
    txt = ','.join(['' if v==None else str(v) for v in values])
    line = common_operate(user, 'change_user_info', txt, username)
    
    comands += [[sql, values], line]
    comands.append(change_team_status(username, 'status', 1 - int(params['allowTeamLogin'])))
    
    rst = db.Transaction(comands)
    
    return rst

def report_lottery_user(username, sTime, eTime, team=0):
    db = Database()
    sql = "select type, parents, userLevel, balance, balanceDeposit, balanceThird from user where username=%s"
    info = db.selectData(sql, (username, ))
    
    if team:
        res = MR.searchReportTeam(username, sTime, eTime)
    else:
        res = MR.searchReport(['SELF', username], sTime, eTime, 'date')
        
    keys = ['recharge', 'rebateAgent', 'consume', 'bonus', 'profit', 'rebateConsume', 'withdraw', 
            'activity', 'dividend', 'feeAmount']
    dts = dict((k, 0.0) for k in keys)
    for item in res:
        for k in keys: dts[k] += item[k]
    
    for k in info: dts[k] = info[k]
    dts['layer'] = len(dts['parents'].split(">"))
    dts['balanceAll'] = dts['balance'] + dts['balanceDeposit']
    dts['rebate'] = dts['rebateAgent'] + dts['dividend']
    
    return dts


def report_third_user(sTime, eTime, username="", team=0, thirdParty="CP138_3"):
    dts = {'list': [], 'summary': {}}
    if thirdParty!="CP138_3" and thirdParty!="": return dts
    
    if team:
        res = MR.searchReportTeam(username, sTime, eTime)
    else:
        res = MR.searchReport(username, sTime, eTime)
    
    keys = ['commission', 'rebate', 'consume', 'bonus', 'actualConsume', 'rebateConsume',
            'balanceIn', 'balanceOut', 'profit']
    for k in keys: dts['summary'][k] = 0.0
    for item in res:
        item['commission'] = item['dividend']
        item['rebate'] = item['rebateAgent'] + item['rebateConsume']
        item['actualConsume'] = item['consume'] - item['rebateConsume']
        item['balanceThird'] = 0.0
        item['balanceIn'] = 0.0
        item['balanceOut'] = 0.0
        item['thirdParty'] = 'CP138_3'
        for k in keys: dts['summary'][k] += item[k]
        dts['list'].append(item)
        
    return dts
 
'''后台消息提醒'''    
def manage_notice():
    db = Database()
    sql = 'select recharge, IFNULL(sum(case when checkStatus=0 then 1 end), 0) risk, \
        IFNULL(sum(case when checkStatus=1 then 1 end), 0) finance from money_out join \
        (select count(*) recharge from money_in where status=0) a'
    res = db.selectData(sql, ())
    res['count'] = 0
    for k in res: 
        res[k] = int(res[k])
        res['count'] += res[k]
    return res
    
def summary_manage():    
    db = Database()
    sql = "select sum(a) m1, sum(b) m2, sum(c) m3, sum(d) m4 from ( \
            select 0 a, 0 b, sum(balance) c, sum(balanceDeposit) d from user where status=0 union \
            select sum(balance) a, sum(balanceDeposit) b, 0 c, 0 d from user where status<>0 \
        ) e"
    res = db.selectData(sql, ())
    data = {'moneyAvaiable': res['m3'] + res['m3'], 'moneyBlocked': res['m1'] + res['m2']}
    data['money'] = data['moneyAvaiable'] + data['moneyBlocked']
    for k in data: data[k] = '%.3f' % data[k]
    
    return data
    
if __name__ == '__main__':
#     print get_user_info("test002")
#     get_user_cards("hdl825")
#     print list_account_adm()
#     print list_forbid_user()
#     add_forbid_user("sys", "test004", 3, "cqssc", "zxfs", "彩票中心")
#     list_game_method()
#     del_forbid_user('sys', 1)
#     print list_forbid_user()
#     summary_user_today("2023-02-01", "2023-05-01")
#     print risk_money_out("sys", "202004051929042701144855427595089", 1, "")[1]
#     print lock_money_out("sys", "202004051929042701144855427595089", 0)[1]
#     print finance_money_out("sys", "202004051929042701144855427595089", 1, 0, "OK")[1]
#     print summary_money_out_type()
#     print init_user_passwd("sys", "test0001")
#     print init_user_security("sys", "test0001")
#     print get_money_out_limit("test0001")
#     print change_user_info("sys", "test0001", "")
#     print report_lottery_user("test004", "2023-01-01", "2023-05-01", 0)
#     print report_lottery_user("test004", "2023-01-01", "2023-05-01", 1)
#     print json.dumps(report_third_user("2023-04-01", "2023-05-01", "test004", 0), ensure_ascii=False)
#     print json.dumps(report_third_user("2023-04-01", "2023-05-01", "test002", 1), ensure_ascii=False)
#     print manage_notice()
#     summary_manage()
    check_point_change('test001', 9.8)
    
    