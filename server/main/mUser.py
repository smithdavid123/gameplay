#coding: utf8

import json
from libs.redisEx2 import MyRedis as rs
from libs.database import Database, GetSingleLine
from libs.utils import DT2TMS, TM, T2S, TMN, RandCode, S2TS, TMS, DiffSecond
from libs.log import L
from common.card import getBanks
from common.tools import getAddr
from common.tools import point2level, get_user_level, common_operate

def get_user_group(db = None):
    if not db: db = Database()
    sql = "select * from user_group order by level"
    res = db.selectData(sql, (), False)
    return res

def getFullInfo(user, showLottery=True, showBaccarat=True, showLoginLog=True, showInfo=True):
    db = Database()
    keys = ['ip', 'address', 'createTime', 'client', 'username', 'type', 'point', 'balance', 'status',
            'bindStatus', 'lockTime', 'parentName', 'nickname', 'registTime', 'onlineStatus', 'avatar']
    sql, params = ("select " + ",".join(keys) + " from logs a join user b on a.user=b.username and \
        a.user = %s order by createTime desc limit 1"), (user, ) 
    res = db.selectEx(sql, params)
    if len(res) == 0: return None

    R = dict((k, res[0][i]) for i, k in enumerate(keys))
    accountLottery = {'availableBalance': R['balance'], 'blockedBalance': 0, 'point': R['point'], 
            'codeType': 0, 'extraPoint': 0, 'playStatus': 0, 'allowEqualCode': True, 'isDividendAccount': False}
    aKeys = ['username', 'nickname', 'type', 'status', 'onlineStatus', 'bindStatus']
    account = {'registTime': DT2TMS(R['registTime']), 'loginTime': DT2TMS(R['createTime']), 
               'lockTime': DT2TMS(R['lockTime'])}
    for k in aKeys: account[k] = R[k]
    
    accountLoginLog = {'ip': R['ip'], 'address': R['address'], 'client': R['client'], 'loginTime': account['loginTime']}
    accountInfo = {'avatar': R['avatar'], 'gender': 0, 'navigate': 0}
    
    tp, tpn = getPointName(R['point'], R['type'])
    accountType = {'code': tp, 'name': tpn}
    accountLottery['code'] = 1.0 * R['point'] * 10 * 2 + 1800
    
    return {'accountLottery': accountLottery, 'accountLoginLog': accountLoginLog, 'accountType': accountType,
          'account': account, 'accountBaccarat': None, 'accountInfo': accountInfo }

def getPointName(point, _type):
    '''账户类型'''
    tps = {"0001": '创始人', '0002': '合伙人', '0003': '大老板', "0004": '老板', '0005': '股东', '0006': '内部', \
           'agent': '代理', 'player': '玩家'}
    st = {'10.2': '0001', '10.1': '0002', '10.0': '0003', '9.9': '0004', '9.8': '0005', '9.7': '0006'}
    p = str(round(point, 1))
    tp = st[p] if p in st else {'1': 'agent', '0': 'player'}[str(_type)]
    
    return tp, tps[tp]
    
def getBindStatus(user):
    sql = "select realName, withdrawPassword, bindStatus, securityStatus from user where username = %s"
    res = GetSingleLine(sql, (user, ))
    if len(res) == 0: return None
    
    return { "isBindWithdrawName": bool(res[0][0]), "isBindWithdrawPassword": bool(res[0][1]),
            "isBindCard": bool(res[0][2]),
            "isBindSecurity": bool(res[0][3]),
            "isBindGoogleAuthenticator": False,
    "isBindBirthday": False, "isBindCellphone": False, "isBindQQ": False, "isBindEmail": False }

def prepareBindCard(user):
    sql = '''select u.realName, withdrawPassword, count(c.id) from user u left join card c 
        on c.user = username where username = %s group by c.user'''
    res = GetSingleLine(sql, (user, ))
    if len(res) == 0: return None
    
    withdrawName = None if not res[0][0] else res[0][0][0] + ''.join(['*' for i in range(len(res[0][0]) - 1)])
    return {
        "count": res[0][2], "maxCount":5, "hasWithdrawPwd": bool(res[0][1]),
        "withdrawName": withdrawName,
        'bankList': getBanks()
    }

'''绑定密保问题'''
def bindSecurity(user, lines):    
    db = Database()
    sql = 'insert into security (user, question, answer, idx) values (%s, %s, %s, %s)'    
    command = [[sql, (user, line[0], line[1], i)] for i, line in enumerate(lines)]
    command.append(["update user set securityStatus = 1 where username = %s", (user, )])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag

def listCard(user):
    db = Database()
    keys = ["c.id", "bankId", "bankBranch", "bankCardName", "bankCardId", "addTime", 
            "cardStatus", "lockTime", "isDefault", "b.name"]
    sql = ("select " + ",".join(keys) + " from card c join bank b on b.id = bankId where user = %s \
            order by isDefault desc")
    lines = []
    for item in db.select(sql, (user, ) ):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        
        line['id'], line['bankName'] = line['c.id'], line['b.name']
        line['addTime'] = DT2TMS(line['addTime'])
        line['lockTime'] = DT2TMS(line['lockTime'])
        line['isDefault'] = bool(line['isDefault'])
        line['bankCardName'] = line['bankCardName'][0] + '*' * (len(line['bankCardName']) - 1)
        line['bankCardId'] = line['bankCardId'][0:4] + ' **** **** ' + line['bankCardId'][-4:]
        del line['c.id'], line['b.name']
        lines.append(line)
    
    return lines

def bindCard(user, bankId, bankBranch, bankCardId, withdrawPassword, bankName = ''):
    db = Database()
    sql = ("select withdrawPassword, bindStatus, realName from user where username = %s for update")
    res = GetSingleLine(sql, (user, ), db)
    if len(res) == 0: return '100', "用户不存在"
    
    password, bindStatus, realName = res[0][0], res[0][1], res[0][2]
    if password != withdrawPassword: return '0-12', "资金密码错误，请重新输入！"
    if bindStatus >= 5: return '0-13', "绑定卡数量已达到上限！"
    
    sql = 'insert into card (user, bankId, bankName, bankBranch, bankCardId, bankCardName) values (%s, \
        %s, %s, %s, %s, %s)'
    params = (user, bankId, bankName, bankBranch, bankCardId, realName)
    command= [['update user set bindStatus = %s where username = %s', (bindStatus + 1, user)],
              [sql, params]]
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, None

def clearCards(user, username):
    db = Database()
    sql, params = "delete from card where user=%s", (username, )
    sqlC, paramsC = 'update user set bindStatus = 0 where username = %s', (username, )
    keys = ['user', 'username', 'rfTable', 'rfField', 'mark']
    sqlO = "insert into operation (" + ",".join(keys) + ") values (" \
        + ','.join(['%s' for i in keys]) + ")"
    paramsO = [user, username, "user", 'bindStatus', "clear bind cards"]
    command = [[sql, params], [sqlC, paramsC], [sqlO, paramsO]]
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, None
    
    
def setupWithdrawName(user, username, name = ''):
    sql, params = ("select password, realName from user where username = %s"), (username, )
    res = GetSingleLine(sql, params)
    if len(res) == 0: return '100', "用户不存在"
    
    password, realName = res[0][0], res[0][1]
    if password == 'a123456': return '0-9', "您的登录密码为初始密码，请先修改后再继续操作"
    if realName != None and realName != '': return '0-10', "已经设置过取款人，无法更改！"
    if name == '': return '0-11', "取款人不能为空！"
    
    return setAccountInfo(user, username, 'realName', name), None

def changePassword(user, username, oldPasswd, newPasswd, key = "password"):
    sql, params = ("select * from user where username = %s and " + key + " = %s"), (username, oldPasswd)
    res = GetSingleLine(sql, params)
    if len(res) == 0: return None
    
    return setAccountInfo(user, username, key, [newPasswd, oldPasswd])

def getPassword(user, username):
    sql, params = ("select password, withdrawPassword, realName from user where username = %s"), (username, )
    res = GetSingleLine(sql, params)
    if len(res) == 0: return None
    
    return [res[0][0], res[0][1], res[0][2]]

def setAccountInfo(user, username, key, value):
    db = Database()
    sql = ("update user set {} = %s where username = %s".format(key))
    params = (value[0] if type(value)==type([]) else value, username)
    
    command = formatLog(user, username, {key: value}, 'user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag


'''格式化日志'''
def formatLog(user, username, dts, tbName = 'user'):
    keys = ['user', 'username', 'rfTable', 'rfField', 'tarValue', 'srcValue']
    lines = []
    for (key, value) in dts.items():
        sql = ("insert into operation (" + ",".join(keys) + ") values (" + 
               ','.join(['%s' for i in keys]) + ")")
        params = [user, username, tbName, key, value, ""]
        if type(value)==type([]):
            params[4], params[5] = value[0], value[1]  
        lines.append([sql, tuple(params)])
    
    return lines 

def filterParams(user, username, passwd = "", _type = "", point = "", money = "", preMoney = "", prePoint = "", \
                 withdrawPassword = "", realName = "", tel="", status=0, nickname=None, d_group=''):
    dts = {'username': username, 'password': passwd, 'type': _type, 'money': money, 'point': point, 
           'parents': user, 'parentName': user, 'nickname': nickname if nickname else username, 
           'dividendGroup': d_group,
           'withdrawPassword': withdrawPassword, 'realName': realName, "tel": tel, "status": status}
    items = dict((k, dts[k]) for k in dts if dts[k]!="" and dts[k])
    if str(_type) == '6': items['level'] = 2
    keys = items.keys() 
    
    return items, keys

'''检测分红工资组'''
def check_user_group(parent, type_, point, db, gs=None):
    if not gs: gs = get_user_group(db)
    level = point2level(point)
    pg, idx, com_idx = None, 0, 0
    for i, g in enumerate(gs): 
        if parent['dividendGroup'] == g['code']: 
            pg, idx = g, i
        if g['pointLimit1'] < 1860:
#             print '\t->', i, level, g['pointLimit1'], g
            com_idx = i
            break
#     print parent['dividendGroup'], pg, pg['allowEqualCode']#, g['pointLimit2'], level
    if not pg: return ''
    if not pg['allowEqualCode'] and pg['pointLimit2'] <= level: return None
#     print idx, com_idx
    
    if com_idx == 0: return ""
    '''判断父级是否为特殊账号'''
    if idx <= (com_idx - 2): 
        if gs[idx + 1]['pointLimit1'] <= level and gs[idx + 1]['pointLimit2'] >= level:
            return gs[idx + 1]['code']
        
    '''理论上讲此时开的都是普通号'''
    if int(type_) == 1: return gs[com_idx]['code']
    '''第一个1800起始级别是否为最后一个'''
    if (com_idx + 1) == len(gs): return ""
    if int(type_) == 0: return gs[com_idx + 1]['code']
    
    return ''


'''创建新用户·管理员'''
def createAccount(user, username, passwd = "", _type = "", point = "", money = "", tel="", status=0, nickname=None):
    db = Database()
    sql, params = ("select point, type, parents, allowAgent, dividendGroup from user where username = %s"), (user, ) 
    res = db.selectData(sql, params)
    if point > res['point']: return False, "下级用户级别不能高于当前用户！"
    '''TODO: 为所有新建用户安排对应分组，用户登陆时显示对应分组'''
    
    d_group = check_user_group(res, _type, point, db)
    if d_group == None: return False, "根据系统设置，无法平级开户！"
    
    items, keys = filterParams(user, username, passwd, _type, point, money, "", "", "", "", tel, status, nickname, d_group)
    sql = "insert into user (" + ','.join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")"
    params = tuple([items[k] for k in items]) 
    
    command = formatLog(user, username, {'create_user': json.dumps(items, ensure_ascii = False)}, 'user')
    command.append([sql, params])
    
    sqlR, paramsR = "insert into relation (parent, child) values (%s, %s)", (user, username)
    command.append([sqlR, paramsR])
    
    flag, rst = db.Transaction(command)
    if not flag: return flag, "请检查表单数据是否有误或用户名是否重复！"
    L.log(flag, rst)
    
    return flag, {'id': rst[1] if flag else -1}


'''按树层级修复用户分组等级'''
def repaire_tree_group(root):
    db = Database()
    groups = get_user_group(db)
    sql = "select username, parentName, dividendGroup, type, point from user where username in \
        (select child from relation where parent=%s) or username=%s"
    users = {}
    for (u, p, g, tp, point) in db.select(sql, (root, root)):
        if u not in users: users[u] = {'dividendGroup': None, 'children': []}
        if p not in users: users[p] = {'dividendGroup': None, 'children': []}
        users[u]['dividendGroup'], users[u]['alive'] = g if g != '' else None, True
        users[u]['type'], users[u]['point'] = tp, point
        users[p]['children'].append(u)
    
    def view(node):
        for c in node['children']: 
            if not users[c]['alive']: continue
            if not users[c]['dividendGroup'] and node['dividendGroup']: 
                d_group = check_user_group(node, users[c]['type'], users[c]['point'], db, groups)
                if d_group: users[c]['dividendGroup'], users[c]['update'] = d_group, True
                print c, d_group
            view(users[c])
            
    view(users[root])
    # users['xinlong05']['dividendGroup'] = 'Boss'
    # print ':', check_user_group(users['xinlong05'], users['asdddd11']['type'], users['asdddd11']['point'], db)
    # print json.dumps(users, ensure_ascii=False)
    
    command = []
    ges = dict((d['code'], int(d['allowEqualCode'])) for d in groups)
    for u in users:
        if 'update' not in users[u]: continue
        if users[u]['dividendGroup'] == '': continue
        sql = "update user set dividendGroup=%s, allowEqualCode=%s where username=%s"
        param = (users[u]['dividendGroup'], ges[users[u]['dividendGroup']], u)
        command.append([sql, param])
    db.Transaction(command)
    
    
def getLoginInfo(username):
    db = Database()
    keys = ['ip', 'createTime', 'style', 'address', 'client']
    sql = "select " + ",".join(keys) + " from logs where user = %s order by createTime desc limit 50"
    lines = []
    for item in db.select(sql, (username, )):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['createTime'] = str(line['createTime'])
        lines.append(line)
    
    return lines
        
'''修改账户信息'''
def setAccount(user, username, passwd = "", _type = "", point = "", money = "", preMoney = "", prePoint = "", \
               withdrawPassword = "", realName = "", tel="", status=""):
    db = Database()
    items, _keys = filterParams(user, username, passwd, _type, point, money, preMoney, prePoint, \
                                withdrawPassword, realName, tel, status)
    keys, params = [], []
    rms = set(['nickname', 'username', 'parents', 'parentName'])
    for key in _keys:
        if key in rms:
            del items[key]
        else:
            keys.append(key)
            params.append(items[key]) 
            
    if len(keys) == 0: return
    params.append(username)
    
    '''更新数据'''
    st = ','.join((keys[i] + "=%s") for i in range(len(keys)))
    sql = ("update user set {} where username = %s".format(st))
    
    '''入库事务'''
    if 'money' in items: items['money'] = [money, preMoney]
    if 'point' in items: items['point'] = [point, prePoint]
    command = formatLog(user, username, items, 'user')
    command.append([sql, params])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag


def getChildren(user, page = 0, size = 10, username = ''):
    db = Database()
    '''获取自身信息'''
    info = rs.hget('UserInfo', user)
    
    keys = ['username', 'type', 'point', 'balance', 'parentName', 'loginTime', 'onlineStatus', 'allowTransfer', 
            'balanceV', 'balanceD']
    '''
            查询结果：指定用户直接下级团队余额(直接下级人加下线)，及该用户自身余额
    ''' 
    sql = '''
        select parent, count(child) teamCount, sum(balance) balanceV, sum(b2) balanceD from (
            select parent, child, balance, balanceDeposit b2 from relation join user on username=child and 
            (parent in (select username from user where parentName=%s)) 
            union select username, username, balance, balanceDeposit b2 from user where parentName=%s) a group by parent
            union select username, 1, balance, balanceDeposit b2 from user where username=%s
        '''
    sql = "select " + ",".join(keys) + " from user u join (" + sql \
           + ") a on a.parent = u.username where (username = %s or parentName = %s)"
    params = [user, user, user, user, user]
    '''限定只可查询自身团队下级用户'''
    if username != '':
        sql += " and username in (select child from relation where parent = %s)"
        params = [username, username, username, username, username, user]

    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor: # db.select(sql, tuple(params)):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['lotteryPoint']= line['point']
        line['baccaratBalance'], line['baccaratPoint'], line['liveWater'] = 0, 0, 0
        line['athleticWater'], line['recreationWater'] = 0, 0
        line['isNeedQuota'] = True
        line['isMyDirect'] = ((line['parentName'] if line['parentName'] else '').encode("utf8") == user)
        line['loginTime'] = DT2TMS(line['loginTime']) if line['loginTime'] else ""
        line['allowTransfer'] = info['allowTransfer']
        line['lotteryBalance'] = float('%.3f' % (line['balanceV'] + line['balanceD']))
        del line['point']
        del line['balance']
        lines.append(line)
    return {'totalCount': count, 'list': lines}

def getAccountList(username='', parentNull = '', page = 0, size = 50, realName='', cardId='', tel='', email='', utype=''):
    db = Database()
    keys = ['username', 'isDel', 'point', 'balance', 'balanceDeposit', 'parentName', 'parents', 'loginTime', 'lastIp', \
            'allowTransfer', "allowWithdraw", "vipLevel", "allowAgent", "balanceThird", "onlineStatus", "realName",
            'registTime', 'regIp', 'nickname', 'level', 'dividendGroup', 'markPerson', 'markTeam', 'dividendStatus', 
            'allowOrder', 'abnormal', 'allowTeamLogin', 'allowTeamWithdraw', 'allowTeamTransfer', 'allowDividend', 'agentPercent',
            'tel', 'weixin', 'email', 'userLevel', 'regSource']
    keys2 = ['id', 'type', 'status', 'consume', 'moneyIn', 'moneyOut', 'client', 'teamCount', 'bankCardId', 'bankName', 'cardId']
    whr, params = ' where 1', []
    if username != '': 
        whr += " and username like " + ("'{}%'".format(username) if username[0] == 's' else "'%{}%'".format(username)) 
    if parentNull != '': whr += " and parentName is null and level = 0"
    ps = {'realName': realName, 'cid': cardId, 'tel': tel, 'email': email, 'u.type': utype} 
    for k, v in ps.items():
        if v != '':
            whr += " and " + k + "=%s"
            params.append(v)
    
    sql = ("select " + ",".join(keys) + ", u.id, u.type, u.status, \
        sum(case when b.type='1300' then amount end) consume, \
        sum(case when b.type='1000' or b.type='1600' then amount end) moneyIn, \
        sum(case when b.type='1001' then amount end) moneyOut, client, IFNULL(teamCount, 0), cid, bankName, cdid from user u \
        left join book b on username=b.account and b.status=2 \
        left join (select DISTINCT l.user u, l.createTime, client from logs l join ( \
            select user, max(createTime) tm from logs group by user) a on a.user=l.user and l.createTime=a.tm \
        ) lg on username=lg.u \
        left join (select parent p, count(*) teamCount from relation group by parent) r on username=r.p  \
        left join (select user, bankCardId cid, bankName, id cdid from card right join ( \
            select user u, max(isDefault) dft from card group by user) c on user=c.u and isDefault=c.dft \
        ) cd on username=cd.user"
        + whr + " group by username order by point desc")
    print sql
    
    lines, idx = [], len(keys)
    count, cursor = db.selectPage((sql), params, page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        for i, k2 in enumerate(keys2): line[k2] = item[idx + i]
        line['loginTime'] = str(line['loginTime'])
        line['registTime'] = str(line['registTime'])
        # line['balance'] = line['balance'] + line['balanceDeposit']
        if line['onlineStatus']: line['onlineStatus'] = isOnline(line['loginTime'])
        line['regAddr'] = getAddr(line['regIp'])
        line['loginAddr'] = getAddr(line['lastIp'])
        line['balance'] = float('%.3f' % line['balance'])
        line['balanceDeposit'] = float('%.3f' % line['balanceDeposit'])
        if not line['cardId']: line['cardId'] = -1
        lines.append(line)
    
    '''VIP级别'''
    users = [u['username'] for u in lines] 
    uLevels = get_user_level(db, users)
    for line in lines: line['vipLevel'] = uLevels[line['username']]
    
    return {'totalCount': count, 'list': lines}

'''param: datetime str'''
def isOnline(tm):
    if not tm: return False
    return DiffSecond(tm) > -7200    

def addUser(user, username, type_, point, passwd = "", ip=""):
    if len(username) < 5: return 1
    if passwd == '' or not passwd: passwd = "a123456"
    db = Database()
    sql, params = ("select point, type, parents, allowAgent, dividendGroup from user where username = %s"), (user, ) 
    res = db.selectEx(sql, params)
    if len(res) == 0: return 2
    uPoint, uType, parents, allowAgent, dividendGroup = res[0]
    if not allowAgent: return 7
    '''用户体系·获取分红用户组'''
    info = {'dividendGroup': dividendGroup, 'allowAgent': allowAgent}
    d_group = check_user_group(info, type_, point, db)
    if d_group == None: return 8
    
    '''非代理用户'''
    print 'Create User:', uType, point, uPoint, point > uPoint
    if uType < 1: return 3
    
    if point > uPoint: return 4
    
    maxLevelDiff = rs.hget('config', 'maxLevelDiff')
    if not maxLevelDiff: maxLevelDiff = 198
    
    if (uPoint - point) > (maxLevelDiff / 20): return 5
    
    parents = user if not parents else parents + ">" + user
    
    keys = ['username', 'nickname', 'type', 'point', 'parentName', 'parents', 'password', 'regIp', 'dividendGroup']
    sqlN = "insert into user (" + ','.join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")"
    paramsN = (username, username, type_, point, user, parents, passwd, ip, d_group)
    
    comands = [[sqlN, paramsN]]
    
    for p in parents.split(">"):
        sqlR, paramsR = "insert into relation (parent, child) values (%s, %s)", (p, username)
        comands.append([sqlR, paramsR])
    
    flag, rst = db.Transaction(comands)
    L.log(flag, rst)
    
    return 0 if flag else 6

'''----------------------------------------高端操作---------------------------------------------'''

'''获取删除关系Sql语句'''
def delRelation(user, username, db = None, delUser = False, containSelf=True):
    if not db: db = Database()
    db = Database()
    sql = "select parentName, parents from user where username = %s"
    res = db.selectEx(sql, (username,))
    if len(res) == 0: return False
    
    parentName, pre = res[0][0], res[0][1]
    if not pre: pre = ""
    '''若只删除关系，且该用户父属关系为空，则无需操作'''
    if pre == "" and not delUser: return []
    command = []
    
    '''适用于只移出下级用户情况，保留自身'''
    if containSelf:
        sqlR, paramsR = "delete from relation where parent = %s and child = %s", (parentName, username) 
        command = [[sqlR, paramsR]]
    
    if delUser: pre = username if pre == "" else (pre + '>' + username) 
    preParents = pre.split('>')
    print 'pre:', pre
    
    '''从子孙用户上级关系链中删除前缀无效关系'''
    sql = "select username, parents from user join relation on username = child and parent = %s"
    for (u, ps) in db.select(sql, (username, )): 
        parents = '' if not ps else ps.replace(pre, '')
        if len(parents) > 1 and parents[0] == '>': parents = parents[1:] 
        # TODO: parents = parents.replace(">>", ">")
        sql, params = "update user set parents = %s where username = %s", (parents, u)
        print u, ps, parents 
        print '\t', sql, params
        command.append([sql, params])
        '''当前以上每一层父级需删除关系'''
        for p in preParents:
            sqlR, paramsR = "delete from relation where parent = %s and child = %s", (p, u) 
            command.append([sqlR, paramsR])
            print '\t', sqlR, paramsR 
    return command

'''
1、relation中直接新增记录，因删除用户时该表其它关联记录都自动删除
2、user表中修改直属用户parentName
3、user表中修改所有下属用户parents
'''
def setParentTo(user, userC, userP):
    db = Database()
    
    sql = "select username, parents, point from user where username in (%s, %s)" 
    cache = {userC: [-1, ''], userP: [-1, '']}
    for (username, parents, point) in db.select(sql, (userP, userC)): 
        cache[username.strip()] = [point, parents]
        print username, parents, point
    
    if cache[userC][0] == -1 or cache[userP][0] == -1: return False, '用户信息有误！'
    if cache[userC][0] >= cache[userP][0]: return False, '父级用户级别必须大于子级用户！'
    
    '''清除关系'''    
    sqls = delRelation(user, userC, db, False)
    flag, rst = db.Transaction(sqls)
    if not flag:
        L.log("Error found in clear Relations before change user belong：", userC, userP, rst)
        return flag, rst 
    
    '''正式开始'''
    pre = cache[userP][1]
    if not pre: pre = ""
    pre = userP if pre == "" else pre + '>' + userP 
    preParents = pre.split('>')
    
    '''下级用户本身'''
    sql, params = "update user set parentName = %s, parents = %s, updateTime = %s where \
        username = %s", (userP, pre, TM(), userC)
    sqlR, paramsR = "insert into relation (parent, child) values (%s, %s)", (userP, userC) 
            
    print sql, params
    print sqlR, paramsR
    command = [[sql, params], [sqlR, paramsR]]
    '''所有子级用户'''
    sql = "select username, parents from user join relation on username = child and parent = %s"
    for (u, ps) in db.select(sql, (userC, )): 
        if not ps: ps = ""
        parents = pre + ">" + ps  
        sql, params = "update user set parents = %s where username = %s", (parents, u)
        print u, ps
        print '\t', sql, params
        command.append([sql, params])
        
        '''当前以上每一层父级均建立关系'''
        for p in preParents:
            sqlR, paramsR = "insert into relation (parent, child) values (%s, %s)", (p, u) 
            command.append([sqlR, paramsR])
            print '\t', sqlR, paramsR 
            
    command += formatLog(user, userC, {'parentName': userP}, 'change parent') 
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag, rst

'''彻底删除'''
def delAccount(user, username):
    db = Database()
    command = delRelation(user, username, db, True)
     
    sql, params = "delete from user where username = %s", (username, )
    command.append([sql, params])
    
    command += formatLog(user, username, {'remove': 'all'}, 'delete user') 
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag


'''获取在线用户数量'''
def get_online_user():
    try:
        tks = rs.hgetall("TKS", toDict=True)
        users = {}
        for k, v in tks.items():
            if S2TS(v['time']) + 7200000 > TMS():
                if users.get(str(v['user'])) and S2TS(v['time']) > S2TS(users.get(str(v['user']))):
                    users[str(v['user'])] = v['time']
                elif not users.get(str(v['user'])):
                    users[str(v['user'])] = v['time']
        users_list = [{'user': k, 'time': i} for k, i in users.items()]
    except:
        users_list = []
    return users_list,len(users_list)


'''获取注册，登录，活跃，在线用户数量'''
def get_rg_lg_ac_num():
    db = Database()
    sql_lg = "select count(*) lg_num from user where date(loginTime) = CURDATE()"
    sql_rg = "select count(*) rg_num from user where date(registTime) = CURDATE()"
    sql_ac = "select count(distinct user,client) ac_num from logs where date(createTime) = curdate()"
    
    lg_num = db.read_value(sql_lg)
    rg_num = db.read_value(sql_rg)
    ac_num = db.read_value(sql_ac)

    # {"todayReg":16,"todayLogin":0,"todayOnline":0,"todayActive":0}
    data, num = get_online_user()
    data = {
        'todayLogin':lg_num,
        'todayReg':rg_num,
        'todayActive':ac_num,
        'todayOnline':num,
    }
    return data

def list_limit_consume(user="", page=0, size=20):
    db = Database()
    keys = ['id', 'username', 'amount', 'beginTime', 'optUser']
    sql = "select " + ",".join(keys) + " from consume_limit where 1 "
    params = []
    if user != "":
        sql += " and username=%s"
        params.append(user)
    sql += " order by updateTime desc"
    lines = []
    count, cursor = db.selectPage((sql), tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['beginTime'] = str(line['beginTime'])
        lines.append(line)
    
    return { "totalCount": count,"list": lines }


def set_limit_consume(user, username, amount, beginTime, mark="", id_=-1):
    db = Database()
    update = False if str(id_) == '-1' else True 
    sql = "insert into consume_limit (username, amount, beginTime, mark) values (%s, %s, %s, %s)"
    params = [username, amount, beginTime, mark]
    if update:
        sql = "update consume_limit set amount=%s, beginTime=%s, mark=%s where id=%s"
        params = [amount, beginTime, mark, id_]
    line = common_operate(user, 'consume_limit', '{},{}'.format(amount, beginTime), username)
    camands = [[sql, params], line]
    flag, data = db.Transaction(camands)
    
    return flag, "添加失败，请检查是否已存在该用户记录 ！" 


if __name__ == '__main__':
    # print addUser('Lily01', 'Lily001', 1, 9)
#     print getChildren('Lucy')
#     print getFullInfo('Lucy')
#     print bool('')
#     print prepareBindCard('Lucy')
#     print type('*' * 4)
#     print listCard("Lucy")
    print getAccountList()
#     print json.dumps(getChildren('system', 0, 10, username = 'xiao8888'))
#     repaire_tree_group("xinlong01")
    
#     delAccount('Lucy', 'test01')
#     print delRelation('Lucy', 'qwer1234')
#     getAccountList("test1994", parentNull = '', page = 0, size = 50, realName='', cardId='', tel='', email='', utype='')
#     print setParentTo('sys', 'wei520', 'kaka888')[1]
#     clearCards("admin", "dvid")
#     print json.dumps(getAccountList("sj", '', 0, 50, realName='', cardId='', tel='', email='', utype=''), ensure_ascii=False)
#     addUser("test002", "test0002", 1, 9.7, None, "61.139.2.69")
#     print createAccount("yong", "abc123", "", 0, 9.9, 0, "", 0, "nickname")[1]
#     print set_limit_consume("sys", "test4", 1000, "2023-04-29", "Test", 2)
#     print list_limit_consume()
    
    