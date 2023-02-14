#coding: utf8

import json
from libs.database import Database, GetSingleLine
from libs.utils import DT2TMS, TM, T2S, TMN, RandCode, DT, DateOffset, LastDay
from libs.log import L
from login import getAccount
from common.key import KEY
from common.tools import level2point
from libs.redisEx2 import MyRedis as rs
import login as lg
from mInit import get_default_dividend
from mReport import summary_report_team, searchReportEx

'''-------------------------------------------------------------------------'''

class DividendDay():
    
    def __init__(self, sTime = None, eTime = None):
        self.sTime = sTime if sTime else LastDay(DT()) # LastDay DT
        self.eTime = eTime if eTime else DateOffset(1, self.sTime)
        self.issue = (self.sTime + "~" + self.eTime).replace("-", "") 
        print self.sTime, self.eTime, self.issue
    
    def get_issues(self):
        db = Database()
        sql = "select a.id from dividend_admin a \
            join dividend_config c on a.ruleid=c.id where runDate='day' and \
            status=1 and isFixed=1 and dayCount=1"
        return [self.issue + "_" + str(id_) for (id_, ) in db.select(sql, ())] 
            
    def calc(self, write_status = 0):
        db = Database()
        keys = ['userGroup', 'pointLimit1', 'pointLimit2', 'activeUser', 'scalePoint', 'extraRules']
        sql = "select a.id, " + ','.join(keys) + " from dividend_admin a \
            join dividend_config c on a.ruleid=c.id where runDate='day' and \
            status=1 and isFixed=1 and dayCount=1"
        rKeys = ['username', 'totalConsume', 'totalLoss', 'activeUser', 'amount', 'scalePoint', 'startDate', 'endDate', \
                    'issue', 'configId', 'status']
        
        for item in db.select(sql, ()):
            line = dict((k, item[i + 1]) for i, k in enumerate(keys))
            line['id'] = item[0]
            issue = self.issue + "_" + str(line['id']) 
            
            commands, sum_money = [], 0.0
            users = self.calc_dividend(line['userGroup'], line['pointLimit1'], line['pointLimit2'], db)
            for user, point, consume, loss in users:
                if loss <= 0: continue
                print '\t', user, point, consume, loss
                amount, mPoint  = self.calc_person_money(line, loss)
                sum_money += amount 
                
                sql = "insert into dividend_log (" + ','.join(rKeys) + ") values (" + ','.join(map(lambda x:'%s', rKeys)) + ")"
                params = [user, consume, loss, -1, amount, mPoint, self.sTime, self.eTime, issue, line['id'], write_status]
                commands.append([sql, params])
            L.log("Run Dividend Day For Rule: {}".format(line['id']))
            self.record_all(line['id'], issue, commands, sum_money, db)
            
            
    '''最终入库'''
    def record_all(self, _id, issue, commands, sum_money, db):
        '''运行日志'''
        sql = "insert into sys_log (category, money, users, lastTime, runTime, configId, info, issue, mark) values \
            (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        commands.append([sql, ['dividend', sum_money, len(commands), self.sTime, self.eTime, \
            _id, '', issue, 0]])
        flag, rst = db.Transaction(commands)
        message = '本次分红信息: 总额 - ' + str(sum_money) + "元, 总人数 - " + str(len(commands) - 1)
        L.dbLog(flag, rst)
        L.log(message, flag)
        return message if flag else '运行错误'
    
    '''根据规则和亏损额计算分红'''
    def calc_person_money(self, line, loss):
        base, p = loss * float(line['scalePoint']) / 100.0, line['scalePoint']
        extraRules = json.loads(line['extraRules'])
        for item in extraRules:
            limit_loss, point = float(item['totalLoss']) * 10000.0, float(item['scalePoint'])
            if limit_loss > loss: continue
            base, p = 1.0 * loss * point / 100.0, point 
            print 'extra rules active: ', loss, limit_loss, point, base 
        return base, p
    
    '''获取某条分红规则下所有满足条件的用户信息'''        
    def calc_dividend(self, userGroup, pointLimit1, pointLimit2, db=None):
        if not db: db = None
        p1, p2 = level2point(pointLimit1), level2point(pointLimit2)
        sql = "select username, point from user where dividendGroup=%s and point>=%s and point<=%s"
        for (user, p) in db.select(sql, (userGroup, p1, p2)):
            consume, loss = self.loss_report_team(user, self.sTime, self.eTime)
            yield user, p, consume, loss 
    
    '''计算以某用户为首的团队亏损，含该用户自身'''        
    def loss_report_team(self, user, bTime, sTime, db = None):
        if not db: db = Database()
        sqlU = "select child from relation where parent='{}' union select username from user \
            where username='{}'".format(user, user)
        sql = "select IFNULL(sum(case when type='1300' then amount end), 0), \
            IFNULL(sum(case when type='1301' then amount end), 0), \
            IFNULL(sum(case when type='1400' then amount end), 0), \
            IFNULL(sum(case when type='1900' then amount end), 0) \
            from (select type, amount from book b join (" + sqlU + ") u \
                on b.account=child where b.status=2 and b.updateTime between %s and %s \
            ) a"
        res = db.selectEx(sql, (bTime, sTime))
        if len(res) == 0: return 0, 0
        
        consume, win, rebate, dividend = res[0]
        return consume, consume - win - rebate - dividend

'''--------------------------------------End Class-----------------------------------------------'''

def loadContractStatus(user):
    db = Database()
    info = lg.getAccount(user, db)
    if info['dividendStatus'] != None:
        if int(info['dividendStatus']) == -2: info['dividendStatus'] = None
        return {'dividendContract': {'status': info['dividendStatus']}, 'dividendStatus': info['dividendStatus']}
    
    if checkDividendSyetemUser(user, info): 
        rst = {'dividendContract': {'status': 1}, 'dividendStatus': 1} 
        return rst

# 判断是否是默认固定分红用户
def checkDividendSyetemUser(user, userInfo = None, db = None):
    if not userInfo: userInfo = lg.getAccount(user, db)
    if userInfo['dividendStatus'] and int(userInfo['dividendStatus']) == -2: return False
    return userInfo["dividendGroup"] == 'Business'
    
    point = userInfo['point'] * 20 + 1800
    item = get_default_dividend()
    if not item: return False
    pointLimit = item.get('pointLimit1', 2048)
    return int(point) == int(pointLimit)    

def confirmDividendContract(user, content):
    db = Database()
    sql = "update user set dividendStatus = %s where username = %s"
    status = {'refuse': -1, 'agree': 1}[content]
    flag = db.execute(sql, (status, user))
    
    return flag

def loadDividendContract(user, db = None):
    infos = loadDividendContracts([user])
    if user in infos and infos[user]: return infos[user]
    
    if checkDividendSyetemUser(user, None, db):
        item = rs.get(KEY.DividendSyetem)
        # userInfo = rs.hget(KEY.UserInfo, user)
        userInfo = lg.getAccount(user, db)
        info = {'activeUser': item['activeUser'], 'scalePoint': item['scalePoint'], 
                'extraRules': item['extraRules'], 'accountFrom': 1, 'accountTo': userInfo['id'],
                'status': 1, 'id': -1, 'uSecond': user
        }
        return  info
    print infos
    return None 
    
'''分红配置'''
def loadDividendContracts(users, db = None):
    if not db: db = Database()
    keys = ['accountFrom', 'accountTo', 'activeUser', 'extraRules', 'scalePoint', 'uSecond']
    sql = "select d.id, " + ','.join(keys) + ", u.dividendStatus from dividend_config d join user u on username=uSecond and \
        uSecond in ("+ ','.join(['%s' for u in users]) +")"
    data = {}
    for u in users: data[u] = None 
    for item in db.select(sql, tuple(users)):
        line = dict((k, item[i + 1]) for i, k in enumerate(keys))
        line['id'] = item[0]
        line['status'] = item[-1]
        data[line['uSecond']] = line
    
    '''顶级用户使用统一契约，故需要特殊处理'''
    parent = users[0] 
    if data[parent] == None and checkDividendSyetemUser(parent, None, db):
        item = rs.get(KEY.DividendSyetem)
        userInfo = lg.getAccount(parent, db)
        info = {'accountFrom': 1, 'accountTo': userInfo['id'], 'activeUser': item['activeUser'], 
                'extraRules': item['extraRules'], 'scalePoint': item['scalePoint'], 
                'uSecond': parent, 'status': 1, 'id': -1
        }
        data[parent] = info
    return data

''''''
def loadSalaryContract(user):
    db = Database()
    keys = ['id', 'username', 'scalePoint', 'amount', 'activeUser', 'totalConsume', 'totalLoss', 'status', 'startDate', 'endDate']
    sql = "select " + ",".join(keys) + " from dividend where username "
    
    '''
    activeUser: 0
    amount: 0
    drawTime: 1553270695000
    endDate: "2023-03-23"
    id: 72529
    scalePoint: 0
    startDate: "2023-03-09"
    status: 1
    totalConsume: 1.11
    totalLoss: -1.00122
    username: "zm888888"

    activeUser: 0
    amount: 0
    drawTime: 1553592758741
    endDate: 1554739200000
    id: 0
    scalePoint: 0
    startDate: 1553270400000
    status: 1
    totalConsume: 0
    totalLoss: 0
    username: "zm888888"
    '''
    return None

'''查询直属用户账户信息'''
def listDirectAccount(user, db = None):
    if not db: db = Database()
    '''字段替换'''
    fs = [['point', 'lotteryPoint'], ['dividendStatus', 'mDividendStatus'], 
          ['dailyDividendStatus', 'mDailyDividendStatus'], ['salaryStatus', 'mSalaryStatus']]
    keys = ['username', 'type', 'loginTime', 'onlineStatus']
    for f in fs: keys.append(f[0])
    
    sql = "select teamCount, teamBalance," + ",".join(keys) + " from (select count(*) teamCount, sum(balance) teamBalance \
        from user where parentName=%s) a, user where username=%s"
    res = {}
    
    for item in db.select(sql, (user, user)):
        res = dict((k, item[i + 2]) for i, k in enumerate(keys))
        res['loginTime'] = str(res['loginTime'])
        res['teamCount'], res['teamBalance'] = item[0], item[1]
        res["lotteryPoint"] = res["point"]
        for f in fs:
            res[f[1]] = res[f[0]]
            del res[f[0]]
            
        res["mDividendStatus"] = 1        
    return res

'''查询下级列表'''
def listContractAccount(user, page = 0, size = 10):
    '''字段替换'''
    fs = [['point', 'lotteryPoint'], ['dividendStatus', 'uDividendStatus'], 
          ['dailyDividendStatus', 'uDailyDividendStatus'], ['salaryStatus', 'uSalaryStatus']]
    
    db = Database()
    sql = '''select parent, count(child) teamCount, sum(balance) teamBalance from \
        (select parent, child, balance from relation join user on username=child and \
            (parent in (select username from user where parentName=%s))) a group by parent
        union
        select username, 0, 0 from user where parentName=%s and username not in (select parent from relation)
    '''
    keys = ['teamCount', 'teamBalance', 'loginTime', 'balance', 'onlineStatus', 'type']
    for f in fs: keys.append(f[0])
    sql = "select parent," + ','.join(keys) + " from (" + sql + ") r join user u on username=parent"
    
    dividendSyetem = rs.get(KEY.DividendSyetem)
    info = listDirectAccount(user, db)
    lines = [info]
    count, cursor = db.selectPage((sql), (user, user, ), page, size)
    for item in cursor:
        line = dict((k, item[i + 1]) for i, k in enumerate(keys))
        line["username"] = item[0]
        line["loginTime"] = str(line["loginTime"]) if line["loginTime"] else None
        line["mDividendStatus"] = lines[0]['mDividendStatus']
        line["mDailyDividendStatus"] = lines[0]['mDailyDividendStatus']
        line["mSalaryStatus"] = lines[0]['mSalaryStatus']
        if line["teamBalance"]: lines[0]['teamBalance'] += line["teamBalance"]
        for f in fs:
            line[f[1]] = line[f[0]]
            del line[f[0]]
        
        '''判断是否系统固定分红·可能不需要，因为这些的上级不会有契约中心'''
        point = line['lotteryPoint'] * 20 + 1800
        if int(point) == int(dividendSyetem['pointLimit1']): line['dividendStatus'] = 1
        
        lines.append(line)
    
    if not lines[0]['teamBalance']: lines[0]['teamBalance'] = 0 
    return { "totalCount": count,"list": lines }
    
def prepareEditDividendContract(user, username, db = None):
    if not db: db = Database()
    userInfo = getAccount(user, db)
    uInfo = getAccount(username, db)
    userInfo['availableBalance'] = userInfo['balance'] - userInfo['blockedBalance']
    userInfo['extraPoint'], userInfo['codeType'], userInfo['playStatus'] = 0, 0, 0
    uInfo['availableBalance'] = uInfo['balance'] - uInfo['blockedBalance']
    uInfo['extraPoint'], uInfo['codeType'], uInfo['playStatus'] = 0, 0, 0
    userInfo['isDividendAccount'], uInfo['isDividendAccount'] = False, False
    contracts = loadDividendContracts([user, username], db)
    data = {'mAccount': userInfo,
            'uAccount': uInfo,
            'rangeConfig': {
                'baseDownPoint': 0,
                'baseMinPoint': 0,
                'extraDownPoint': -30
            },
            'mGameLotteryAccount': userInfo,
            'uGameLotteryAccount': uInfo,
            'mGameLotteryDividendContract': contracts[user],
            'uGameLotteryDividendContract': contracts[username],
            'mContract': contracts[user],
            'uContract': contracts[username],
            'uUsername': username,
            'unitPoint': 0.1,
            'minPoint': 0.1,
            'maxPoint': 4,
    }
    
    return data

def F(s):
    return 0 if not s else float(s)

def FS(s):
    return '' if not s else str(s)

'''获取用户ID'''
def getUserId(users, db = None):
    if not db: db = Database()
    sql = "select id, username from user where username in ("+ ','.join(['%s' for u in users]) +")"
    data = {}
    for (_id, username) in db.select(sql, tuple(users)):
        data[username] = _id
    
    return data
        
'''
    在此有必要记录一下业务逻辑：
    用户的字段表明用户和上级签订的状态，是u开头的几个字段
'''    
def applyEditDividendContract(user, username, scalePoint, activeUser, extraRules):
    if scalePoint == None or activeUser == None: return 
    lines = []
    '''规则验证'''
    for i, line in enumerate(extraRules):
        if line['totalConsume'] == None: return
        if line['scalePoint'] == None: return
        for k in line: line[k] = F(line[k])
        if i > 0:
            if line['totalConsume'] <= lines[i - 1]['totalConsume']: return
            if line['scalePoint'] <= lines[i - 1]['scalePoint']: return
        lines.append(line)
    db = Database()
    ids = getUserId([user, username], db)
    if len(ids) != 2: return 
    
    params = [ids[user], ids[username], activeUser, scalePoint, json.dumps(extraRules, ensure_ascii = False), username]
    sql = "select id from dividend_config where uSecond = %s for update"
    cnx, cursor = db.Query(sql, (username, ))
    res = cursor.fetchall()
    
    '''判断是插入还是更新'''
    sql = "insert into dividend_config (accountFrom, accountTo, activeUser, scalePoint, extraRules, uSecond) \
        values (%s, %s, %s, %s, %s, %s)"
    if len(res) > 0:
        sql = "update dividend_config set accountFrom = %s, accountTo = %s, activeUser = %s, scalePoint = %s, \
            extraRules = %s, uSecond = %s where id = %s"
        params.append(res[0][0])
    sqlU, paramsU = "update user set dividendStatus = 0 where username = %s", [username]    
    
    flag, rst = db.Transaction([[sql, params], [sqlU, paramsU]], cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag

def statDividendRecord(user):
    db = Database()
    keys = ['activeUser', 'amount', 'id', 'scalePoint', 'status', 'totalConsume', 'totalLoss', 'username']
    sql = "select startDate, endDate, " + ','.join(keys) + " from dividend_log where username = %s order by \
        createTime desc limit 1"
    lines = []
    for item in db.select(sql, (user, )):
        line = dict((k, item[i + 2]) for i, k in enumerate(keys))
        line['startDate'] = str(item[0])
        line['endDate'] = str(item[1])
        lines.append(line)
    
    return lines

def listDividendRecord(user, page = 0, size = 10):
    db = Database()
    keys = ['activeUser', 'amount', 'scalePoint', 'totalConsume', 'totalLoss']
    sql = "select * from (select startDate, endDate, d.username username, d.id, d.status, " + ",".join(keys) + \
        " from user u join dividend_log d on u.username = d.username and parentName = %s order by endDate desc) a \
        group by username"
    count, cursor = db.selectPage(sql, (user, ), page, size)
    lines = collectRecord(cursor, keys)
    
    '''自身'''
    sqlS = "select startDate, endDate, u.username, d.id, d.status, " + ",".join(keys) + " from dividend_log d \
        right join user u on u.username = d.username where u.username = %s order by endDate desc limit 1"
    lineSelf = collectRecord(db.select(sqlS, (user, )), keys)
    if lineSelf[0]['id'] == None:
        if len(lines) > 0: lineSelf[0] = buildSelfRecord(user, lines[0], keys)
        if len(lines) == 0: return {'totalCount': 0, 'list': []}
    
    return {'totalCount': count, 'list': lineSelf + lines}


def buildSelfRecord(user, item, keys):
    line = {'username': user, 'startDate': item['startDate'], 'endDate': item['endDate']}
    for k in keys: line[k] = 0
    return line

def collectRecord(cursor, keys):
    lines = []
    keys = ['activeUser', 'amount', 'scalePoint', 'totalConsume', 'totalLoss']
    for item in cursor:
        line = dict((k, item[i + 5]) for i, k in enumerate(keys))
        line['startDate'] = FS(item[0])
        line['endDate'] = FS(item[1])
        line['username'] = item[2]
        line['id'] = item[3]
        line['status'] = item[4]
        lines.append(line)
    
    return lines


def prepareEditPointByQuota(user, username):
    info = prepareEditDividendContract(user, username)
    mP, uP = info['mGameLotteryAccount']['point'], info['uGameLotteryAccount']['point']
    info['isNeedQuota'] = True if float(mP) > float(uP) else False
    info['lotteryCodeRange'] = {'minPoint': uP, 'maxPoint': mP}
    
    return info

'''修改下级返点'''
def editPointByQuota(user, username, point):
    db = Database()
    users = [user, username]
    point, sPoint = float(point), -1
    if point > 9.9 or point < 0: return False, "调整后返点区间有误！"

    sql = "select username, point, type from user where username in ("+ ','.join(['%s' for u in users]) \
        + ") for update"
    cnx, cursor = db.Query(sql, tuple(users))
    for (name, pt, tp) in cursor:
        if name == user:
            if str(tp) == '0': return False, "账户类型有误！"
            if float(point) > float(pt): return False, "调整后的下级返点不能高于上级返点！"
        if name == username: 
            if float(point) <= float(pt): return False, "调整后的下级返点必须高于当前返点！"
            sPoint = point
    if sPoint == -1: return False, "用户信息有误！"
    
    '''更新'''
    keys = ['user', 'username', 'rfTable', 'rfField', 'tarValue', 'srcValue']
    sqlU = "update user set point = %s where username = %s"
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = [user, username, 'user', 'point', point, sPoint]
    
    flag, rst = db.Transaction([[sqlU, [point, username]], [sqlO, paramsO]], cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, ''

        
        
        
def initDividend():
    db = Database()
    users = {}
    sql = "select id, username from user where username in ('admin', 'Lucy')"
    for (_id, username) in db.select(sql, ()): users[username] = _id
    
    sqlU = "update user set dividendStatus = 1 where username in ('admin', 'Lucy', 'system')"
    sql = "insert into dividend_config (accountFrom, accountTo, activeUser, scalePoint, extraRules, uSecond, status) \
        values (%s, %s, %s, %s, %s, %s, %s)"
    extraRules = '[{"totalConsume":0,"totalLoss":0,"activeUser":3,"dailyLoss":0,"lossDay":0,"scalePoint":12},{"totalConsume":50,"totalLoss":0,"activeUser":3,"dailyLoss":0,"lossDay":0,"scalePoint":15},{"totalConsume":100,"totalLoss":0,"activeUser":5,"dailyLoss":0,"lossDay":0,"scalePoint":20},{"totalConsume":600,"totalLoss":0,"activeUser":12,"dailyLoss":0,"lossDay":0,"scalePoint":25},{"totalConsume":1000,"totalLoss":0,"activeUser":25,"dailyLoss":0,"lossDay":0,"scalePoint":30},{"totalConsume":2000,"totalLoss":0,"activeUser":30,"dailyLoss":0,"lossDay":0,"scalePoint":32},{"totalConsume":3000,"totalLoss":0,"activeUser":40,"dailyLoss":0,"lossDay":0,"scalePoint":35}]'
    
    db.execute(sql, (0, users.get('Lucy', 0), 0, 0, extraRules, 'Lucy', 1))
    db.execute(sql, (0, users.get('admin', 0), 0, 0, extraRules, 'admin', 1))
    db.execute(sql, (0, users.get('system', 0), 0, 0, extraRules, 'system', 1))
    
    newId = db.execute(sql, (0, 0, 1, 0, '[]', 'common', 1))
    sql = "insert into dividend_admin (name, dayCount, pointLimit1, pointLimit2, isDefault, ruleId) values \
        ('半月分红', 15, 1990, 1998, 1, %s)"
    db.execute(sql, (newId, ))
    
    db.execute(sqlU, tuple())


if __name__ == '__main__':
    # print addUser('Lily01', 'Lily001', 1, 9)
#     print getChildren('Lucy')
#     print getFullInfo('Lucy')
#     print bool('')
#     print prepareBindCard('Lucy')
#     print type('*' * 4)
#     print listCard("Lucy")
#     print listDirectAccount('Lucy')
    # print listContractAccount('Lucy')
#     initDividend()
#     print listDividendRecord('a123456')
#     print loadDividendContract("test1994") # test1
#     print get_default_dividend()
    dd = DividendDay()
    dd.calc(1)
#     print dd.get_issues()
    
#     loss_report_team("test1994", '2023-06-05', '2023-06-06')
#     loadDividendContract("qq12345")
#     print prepareEditDividendContract('qq123', 'fanshilin')
    
    