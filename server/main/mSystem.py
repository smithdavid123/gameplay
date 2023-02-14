#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

import json
import threading
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import TM, DateOffset, DT, TMN, RandCode
from libs.code import BookMark as BM, BookStatus as BS
from libs.log import L
from common.key import KEY
import mInit as MI
from config import Config as C

'''默认数据库会有记录'''
def setActivity(id_, label, content, status):
    db = Database()
    sql = "update activity set label = %s, content = %s, status = %s where id = %s"
    flag = db.execute(sql, (label, content, status, id_))
    print sql, flag, (label, content, status, id_)
    return flag

def getActivity(db = None):
    if not db: db = Database()
    sql = "select id, label, content, status from activity where category='money'"
    data = None
    for (id_, label, content, status) in db.select(sql, ()):
        data = {'id': id_, 'label': label, 'content': content, 'status': status}
        break
    
    return data

def getServiceUrl(client = 0):
    db = Database()
    sql = "select name, value, mark from config where category = 'serviceUrl'"
    line = {}
    for item in db.select(sql, ()):
        if int(item[1]) == client: line = {'title': item[0], 'url': item[2]}
    
    return line['url']

def getDownloadUrlsTitle():
    db = Database()
    sql = "select name, value, mark from config where category = 'download'"
    lines = []
    for item in db.select(sql, ()):
        lines.append({'title': item[0], 'url': item[2]})
    
    return lines

def getDomainUrls():
    db = Database()
    sql = "select name, mark from config where category = 'onlineUrls'"
    lines = []
    for item in db.select(sql, ()):
        lines.append({'name': item[0], 'domain': item[1]})
    
    if len(lines) < 6 and len(lines) > 0: 
        for i in range(6 - len(lines)): lines.append(lines[-1])
    
    return [line['domain'] for line in lines]

def changeGameConfig(user, name, key, value):
    db = Database()
    gameList, methods = [], []
    
    keysM = ["id", "type", "groupName", "name", "methodName", "minRecord", "maxRecord", "totalRecord", "sort", 
             "status", "bonus", "oooNums", "oooBonus"]
    
#     sql = "select " + ",".join(keysM) + " from game_method"
#     cursor = db.select(sql, ())
#     for item in cursor:
#         line = dict((keysM[i], item[i]) for i in range(len(keysM))) 
#         line['group'] = line['groupName']
#         del line['groupName']
#         methods.append(line)
#         
#     keysG = ["id", "showName", "shortName", "frequency", "type", "times", "stopDelay", "downCode", "fenDownCode", 
#              "liDownCode", "floatBonus", "maxBonus", "sort", "status", "description"]
#     sql = "select " + ",".join(keysG) + " from game_config"
#     items = db.select(sql, (), cursor)
#     for item in items:
#         line = dict((keysG[i], item[i]) for i in range(len(keysG))) 
#         gameList.append(line)
#      
#     return gameList, methods

'''-------------------------------------------分红-----------------------------------------------'''

def clearDividend():
    db = Database()
    sql1 = "update user set dividendStatus = null"
    sql2 = "delete from dividend_config where id not in (select id from  \
        (select c.id from dividend_admin a join dividend_config c on a.ruleId = c.id) t)"
    flag, rst = db.Transaction([[sql1, ()], [sql2, ()]])
    L.dbLog(flag, rst)
    
    return flag, '失败'

def requestDividend(user, _id):
    flag = rs.hget(KEY.TaskDividend, _id) 
    print 'Status:', flag
    if flag and str(flag) == '1': return False
    
    ThreadR = threading.Thread( None, executeDividend, "Thread-Request", (_id, user) )
    ThreadR.start()
    
    return ThreadR

def executeDividend(_id, user):
    db = Database()
    L.log('start task of execute dividend...')
    sql, params = "insert into operation (user, rfTable, rfField, srcValue, content, mark) values (%s, \
        'dividend', 'run', 'id', %s, '手动执行分红程序')", (user, _id)
    db.execute(sql, params)
    
    Dividend(_id)
    L.log('dividend finished!', _id)


def drawDividendRecordAll(user, issue, db = None):
    flag = rs.hget(KEY.TaskDividendRecord, issue) 
    if flag and str(flag) == '1': return False, "有进程执行未结束，若此状态持续十分钟以上则表明发生执行错误"
    
    if not db: db = Database()
    
    sql = "select u.parentName, d.id from dividend_log d join user u on d.username=u.username \
            where issue = %s and d.status = 1"
    cnx, cursor = db.Query(sql, (issue, ))
    
    '''设置运行中状态'''
    rs.hset(KEY.TaskDividendRecord, issue, 1)
    error, errorCount = None, 0
    for item in cursor:
        L.log('Draw Dividend Record For User: ', item[0], item[1])
        res = drawDividendRecord(item[0], item[1], db, False)
        if not res[0]: 
            error, errorCount = True, errorCount + 1
            print res[1]
    
    sql, param = "update sys_log set status = 2, info = %s where issue = %s", ("e:" + str(errorCount), issue)
    sqlO = "insert into operation (user, content, rfTable, rfField, mark, tarValue) values (%s, %s, %s, %s, %s, %s)"
    paramO = (user, issue, 'dividend_log', 'issue', '执行分红', errorCount) 
    
    flag, rst = db.Transaction([[sql, param], [sqlO, paramO]], cnx, cursor, False)
    L.dbLog(flag, rst)
    
    '''设置运行结束状态'''
    rs.hset(KEY.TaskDividendRecord, issue, 2)
    
    return not error, "有{}条记录执行错误".format(errorCount)
    
def drawDividendRecordSys(user, issue, db = None):
    return drawDividendRecordAll(user, issue)

'''管理员删除分红·为发放之前'''
def delDividendRecordSys(user, issue):
    flag = rs.hget(KEY.TaskDividendRecord, issue) 
    if flag and str(flag) == '1': return False, "有进程执行未结束，若此状态持续十分钟以上则表明发生执行错误"
    
    db = Database()
    sql = "select id from sys_log where issue = %s and category = 'dividend' and status = 0"
    res = db.selectEx(sql, (issue, ))
    if len(res) == 0: return False, "删除失败，该分红已执行，请刷新页面重新核实"
    
    sql, param = "delete from dividend_log where issue = %s", (issue, )
    sqlL, paramL = "delete from sys_log where issue = %s", (issue, )
    sqlO = "insert into operation (user, content, rfTable, rfField, mark, tarValue) values (%s, %s, %s, %s, %s, %s)"
    paramO = (user, issue, 'dividend_log', 'issue', '删除分红', '') 
    
    flag, rst = db.Transaction([[sql, param], [sqlO, paramO], [sqlL, paramL]])
    L.dbLog(flag, rst)
    
    return flag, rst


'''TODO: 分红操作'''
def drawDividendRecord(user, _id, db = None, fromParent = True):
    if not db: db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks"]
    sql, params = "select username, id, amount from dividend_log where id = %s and status = 1 for update", (_id, )
    cnx, cursor = db.Query(sql, params)
    res = cursor.fetchall()
    if len(res) == 0: return False, '分红信息有误！'
    account, _id, amount = res[0][0], res[0][1], res[0][2]
    
    sqlU, paramsU = "select type, balance, parentName, balanceDeposit from user where username = %s for update", (account, ) 
    cursor = db.select(sqlU, paramsU, cursor)
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    accountType, balanceV, parent, balanceD = res[0]
    balance = balanceV + balanceD
    balanceAfter = balance + amount
    
    command = []
    '''
           取消上级分钱模式
    if fromParent:
        if parent != user: return False, '上下级信息不符！'
        flag, command = parentDividend(kBook, user, amount, _id, db, cursor)
        if not flag: return flag, command
    '''
    
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': balance, 'balanceAfter': balanceAfter, 
            'reference': _id, 'amount': amount, 'type': '1900'}
    item['remarks'] = BM[item['type']]
    item['billno'] = TMN() + RandCode(8)
    
    '''核心事务处理'''
    sqlD, paramsD = "update dividend_log set status = 2, drawTime = %s where id = %s", (TM(), _id)
    sqlM, paramsM = ("update user set balanceDeposit = %s where username = %s"), (balanceD + amount, account)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    
    command += [[sqlM, paramsM], [sqlD, paramsD], [sqlB, paramsB]]
    flag, rst = db.Transaction(command, cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag, '失败'

'''上级给下级分红'''
def parentDividend(kBook, account, amount, _id, db = None, cursor = None):
    if not db: db = Database()
    
    sqlU, paramsU = "select type, balance from user where username = %s for update", (account, ) 
    cursor = db.select(sqlU, paramsU, cursor)
    res = cursor.fetchall()
    if len(res) == 0: return False, '用户信息有误！'
    accountType, balance = res[0][0], res[0][1]
    balanceAfter = balance - amount
    
    if balanceAfter < 0.0: return False, '余额不足， 无法给下级分红'
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': balance, 'balanceAfter': balanceAfter, 
            'reference': _id, 'amount': amount, 'type': '1102', 'status': BS.INIT}
    item['remarks'] = BM[item['type']]
    item['billno'] = TMN() + RandCode(8)
    
    '''核心事务处理'''
    sqlM, paramsM = ("update user set balance = %s where username = %s"), (balanceAfter, account)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    return True, [[sqlM, paramsM], [sqlB, paramsB]]
    
    
'''分红核心程序集'''
class Dividend():
    
    def __init__(self, _id):
        self.roots = {}
        '''存储核心基础用户信息'''
        self.users = {}
        '''存储用户符合规则信息'''
        self.accounts = {}
        self.activeUsers = set()
        self.tree = {}
        self.commands = []
        self.beginTime = None
        self.endTime = TM()
        self.issue = TMN() + RandCode(10)
        self.sumMoney = 0.0
        self.id = _id
        self.config = []
        if self.loadConfig(): 
            self.Calculate()
        
    def loadConfig(self):
        db = Database()
        keys = ['dayCount', 'consumeAmount', 'lossAmount', 'consumeDays', 'lossDays', 'pointLimit1', 'pointLimit2', 'isDefault']
        sql = "select " + ','.join(keys) + ", b.runTime from dividend_admin a left join (select runTime, configId \
            from sys_log where configId = %s order by runTime desc limit 1) b on b.configId = a.id where id = %s"
        res = db.selectEx(sql, (self.id, self.id))
        if len(res) == 0: return
        
        self.config = list(res[0])
        self.config[5] = [self.config[5], self.config[6]]
        self.beginTime = self.config[-1]
        self.isDefault = self.config[7]
        dayCount = self.config[0]
        if not self.beginTime: self.beginTime = DateOffset(-dayCount)
        L.log('Dividend begin time:', self.beginTime, 'dayCount', dayCount)
        
        return True
    
    '''唯一入口，内部区分分红类别'''
    def Calculate(self):
        c = self.config
        flag = rs.hget(KEY.TaskDividend, self.id) 
        if flag and str(flag) == '1': 
            L.log('There is a task is running or exited abnormal, job will not executed this time!')
            return 
        rs.hset(KEY.TaskDividend, self.id, 1)
        
        if int(self.isDefault) == 1: 
            self.run(c[1], c[2], c[3], c[4], c[5])
        else:
            self.runCommon(c[1], c[2], c[3], c[4], c[5])
            '''执行分红'''
            # drawDividendRecordAll('sys', self.issue)
        
        rs.hset(KEY.TaskDividend, self.id, 2)
    
    '''加载基础信息，获取users, tree, activeUsers'''
    def loadBaseInfo(self, consumeAmount, lossAmount, consumeDays, lossDays, pointLimits, db = None):
        if not db: db = Database()
        
        '''TODO: 后期优化，限制用户范围·周期内不登陆则无分红 and createTime > %s'''
        sqlU = "select username, point, type, parents, parentName, lastIP, count(distinct ip) from \
            user join logs l on l.user=username group by user"
        relations, tree = {}, {}
        for (account, point, uType, parents, parentName, lastIP, ct) in db.select(sqlU, ()):
            parentList = [] if not parents else parents.split(">")
            relations[account] = {
                'point': point,
                'parentName': parentName,
                'parents': parentList,
                'type': uType,
                'lastIP': lastIP,
                'ipCount': ct
            } 
            if account not in tree: tree[account] = {'children':{}}
            if parentName not in tree: tree[parentName] = {'children':{}}
            tree[parentName]['children'][account] = tree[account]
            
        '''汇总消费记录'''
        users, cacheCL = {}, {}
        sqlB = "select account, consume, cancel, bonus, rebate from (select account, DATE_FORMAT(updateTime,'%Y%m%d') d, \
            COALESCE(sum(case when b.type='1300' then amount end), 0) consume, \
            COALESCE(sum(case when b.type='1303' then amount end), 0) cancel, \
            COALESCE(sum(case when b.type='1301' then amount end), 0) bonus, \
            COALESCE(sum(case when b.type='1400' then amount end), 0) rebate \
            from book b where b.status=1 and updateTime between %s and %s group by account, d) c \
            where consume > 0 or bonus > 0"
        for (account, consume, cancel, bonus, rebate) in db.select(sqlB, (self.beginTime, self.endTime)):
            if account not in relations: continue
            '''
            if not consume: consume = 0.0
            if not bonus: bonus = 0.0
            if not cancel: cancel = 0.0
            '''
            consume = consume - cancel 
            loss = consume - bonus
            '''可能满足活跃条件'''
            flag = consume > consumeAmount or loss > lossAmount
            
            for u in relations[account]['parents']:
                if u not in relations: continue
                '''后2存储满足的用户名及对应天数'''
                if u not in users: users[u] = [0.0, 0.0, set(), 0.0]
                '''同级别的不算'''
                if relations[u]['point'] == relations[account]['point']: continue
                users[u][0] += consume
                users[u][1] += loss
                users[u][3] += rebate
                if flag: users[u][2].add(account)
            
            if flag: 
                if account not in cacheCL: cacheCL[account] = [0, 0]
                if consume > consumeAmount: cacheCL[account][0] += 1
                if loss > lossAmount: cacheCL[account][1] += 1
        
        '''识别活跃用户'''
        activeUsers = set([u for u in cacheCL if cacheCL[u][0] >= consumeDays and cacheCL[u][1] >= lossDays])
        self.users, self.tree, self.activeUsers = users, tree, activeUsers
        '''暂存数据以备后用'''
        self.relations = relations
        L.log('active user count:' + str(len(self.activeUsers)))
        
        return True
    
    '''根据规则配置，计算该用户对应分红信息'''
    def analysisAmounts(self, activeLimit, scalePoint, extraRules, u, scale = None):
        '''非固定分红配置只计算一次配置，基础配置所有用户相同'''
        if scale == None:
            extraRules = json.loads(extraRules, encoding = 'utf8')
            '''保底分红'''
            scale = float(self.checkBaseDividend(activeLimit, scalePoint, extraRules))
            '''无保底分红时，无活动记录人员直接处理'''
            '''TODO: Testing, 原来为 and '''
            if u not in self.users:
                if scale == 0: self.accounts[u] = {'scalePoint': scale, 'activeUser': 0}
                return

        '''基础规则'''
        activeUser = len(self.activeUsers & self.users[u][2])
        if activeUser >= activeLimit: scale = scalePoint
        '''附加规则'''
        for rule in extraRules:
            for k in rule: rule[k] = float(rule[k])
            '''比较注意亏损的符号'''
            # print ':', self.users[u][0], rule['totalConsume'] * 10000, self.users[u][1], rule['totalLoss'] * 10000, activeUser < rule['activeUser']
            if self.users[u][0] < (rule['totalConsume'] * 10000) or self.users[u][1] < (rule['totalLoss'] * 10000) \
                or activeUser < rule['activeUser']: break
            scale = rule['scalePoint']
        
        self.accounts[u] = {'scalePoint': scale, 'activeUser': activeUser}
        # print u, activeUser, scale
        
    '''★★★★'''
    def run(self, consumeAmount, lossAmount, consumeDays, lossDays, pointLimits):
        db = Database()
        '''加载基础信息，获取users, tree, activeUsers'''
        self.loadBaseInfo(consumeAmount, lossAmount, consumeDays, lossDays, pointLimits, db)
        pointLimits = [(float(pointLimits[0]) - 1800) / 20.0, (float(pointLimits[1]) - 1800) / 20.0]
        
        sql = '''select uSecond, u.point, activeUser, scalePoint, extraRules, 0 from dividend_config 
            left join user u on accountTo=u.id where dividendStatus = 1 
            union 
            select username, point, activeUser, scalePoint, extraRules, 1 from user join dividend_admin a 
                join dividend_config c on a.isDefault=1 and ((pointLimit1-1800)/20.0)=point and a.ruleId = c.id
            '''
        for (u, point, activeLimit, scalePoint, _extraRules, isRoot) in db.select(sql, ()):
            '''根节点'''
            if isRoot: 
                self.roots[u] = scalePoint
                # continue
            
            # print u, point, activeLimit, scalePoint, _extraRules, isRoot
            
            '''级别过滤'''
            if point < pointLimits[0] or point > pointLimits[1] or point > C.MAX_POINT: continue
            '''计算用户根据配置应得分红信息'''    
            self.analysisAmounts(activeLimit, scalePoint, _extraRules, u)
            
        '''按层级遍历'''
        for r in self.roots: self.traverse(self.tree, r, self.handle)
        
        self.recordAll(db)

        
    '''最终入库'''
    def recordAll(self, db):
        '''运行日志'''
        sql = "insert into sys_log (category, money, users, lastTime, runTime, configId, info, issue, mark) values \
            (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        self.commands.append([sql, ['dividend', self.sumMoney, len(self.commands), self.beginTime, self.endTime, \
            self.id, '', self.issue, self.isDefault]])
        flag, rst = db.Transaction(self.commands)
        message = '本次分红信息: 总额 - ' + str(self.sumMoney) + "元, 总人数 - " + str(len(self.commands) - 1)
        L.dbLog(flag, rst)
        L.log(message, flag)
        return message if flag else '运行错误'
        
    '''根据分红比例，获取分配信息并生成sql'''
    def readyForRecord(self, u, uPoint):
        info, amount, activeUser = [0, 0], 0, 0
        if u in self.users: 
            info, activeUser = self.users[u], self.accounts[u]['activeUser']
            L.log(u, info[0], info[1], info[3])
            '''计算亏损额时把返点减去'''
            amount = 1.0 * (info[1] - info[3]) * uPoint / 100
            if amount < 0: amount = 0
        
        keys = ['username', 'totalConsume', 'totalLoss', 'activeUser', 'amount', 'scalePoint', 'startDate', 'endDate', \
                'issue']
        sql = "insert into dividend_log (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")"
        params = [u, info[0], info[1], activeUser, amount, uPoint, self.beginTime, self.endTime, self.issue]
        self.commands.append([sql, params])
        self.sumMoney += amount
    
    def handle(self, p, u): 
        accounts = self.accounts
        '''
                     撤销根据上级具体分红点数限制下级分红点数，因为可能有Bug
        if p not in accounts and p not in self.roots: return
        pPoint = self.roots[p] if p in self.roots else accounts[p]['scalePoint']
        uPoint = min(accounts[u]['scalePoint'], pPoint)
        accounts[u]['scalePoint'] = uPoint
        '''
        
        self.readyForRecord(u, accounts[u]['scalePoint'])
        
    '''树按层级遍历'''
    def traverse(self, tree, root, func):
        # print root, root in tree, len(tree)
        if root not in tree: return
        children = []
        '''核心遍历'''
        func('', root)
        for c in tree[root]['children']: 
            '''节点不在分红列表则所有下级终止遍历'''
            if c in self.accounts:
                # func(root, c)
                children.append(c)
        for c in children:
            self.traverse(tree[root]['children'], c, func)
    
    '''先检查基础分红，再检查第一条附加规则，判断有无无条件分红规则'''
    def checkBaseDividend(self, activeUser, scalePoint, extraRules):
        if activeUser == 0 and scalePoint > 0: return scalePoint
        if len(extraRules) == 0: return 0
        emptys = [k for k in extraRules[0] if float(extraRules[0][k]) > 0] 
        if len(emptys) == 1 and emptys[0] == 'scalePoint': return extraRules[0]['scalePoint']
        
        return 0
    
    
    '''★★★ 针对普通分红，从原分红（现为半月固定分红）提取整合而来'''
    def runCommon(self, consumeAmount, lossAmount, consumeDays, lossDays, pointLimits):
        db = Database()
        self.loadBaseInfo(consumeAmount, lossAmount, consumeDays, lossDays, pointLimits, db)
        self.pointLimits = [(float(pointLimits[0]) - 1800) / 20.0, (float(pointLimits[1]) - 1800) / 20.0]
        
        sql = "select c.id, c.activeUser, c.scalePoint, c.extraRules from dividend_config c \
            join dividend_admin a on a.ruleId=c.id and a.id=%s"
        res = db.selectEx(sql, (self.id, ))
        if len(res) == 0:
            L.log('rules config not found for dividend id ', self.id)
        
        self.ruleId, activeLimit, scalePoint, _extraRules = res[0] 
        L.log('activeLimit, scalePoint:', activeLimit, scalePoint)
                
        extraRules = json.loads(_extraRules, encoding = 'utf8')
        '''保底分红'''
        scale = float(self.checkBaseDividend(activeLimit, scalePoint, extraRules))
        
        for u in self.users:
            point = self.relations[u]['point']
            if point < self.pointLimits[0] or point > self.pointLimits[1] or point > C.MAX_POINT: continue
            self.analysisAmounts(activeLimit, scalePoint, extraRules, u, scale)
            
        for u in self.accounts:
            self.readyForRecord(u, self.accounts[u]['scalePoint'])
        
        return self.recordAll(db) 

'''----------------------------------End Class--------------------------------------'''    

   
   
def getRecordDividend():
    db = Database()
    sql = "select issue, money, users, lastTime, runTime, dayCount, name, s.status from sys_log s left join dividend_admin a \
        on a.id = configId where category = 'dividend' order by runTime desc limit 20"
    lines = []
    for (issue, money, users, bTime, eTime, dayCount, name, status) in db.select(sql, ()):
        lines.append({'issue': issue, 'money': money, 'beginTime': str(bTime), 'endTime': str(eTime), \
                      'dayCount': dayCount, 'userCount': users, 'name': name, 'status': status})
    records = [] if len(lines) == 0 else getIssueRecord(lines[0]['issue'], 0, 15, db)
    
    return {'issues': lines, 'records': records}

#-------------------------------------------------------------------------------

def getIssueRecord(issue="", page = 0, size = 15, db = None, status="", username="", parent="", 
            bTime="", sTime="", consume1="", consume2="", amount1="", amount2=""):
    if not db: db = Database()
    keys = ['username', 'totalConsume', 'totalLoss', 'activeUser', 'amount', 'scalePoint', 'startDate', 'endDate', \
                'issue', 'status', 'parent', 'createTime', 'drawTime']
    whr, params = " where 1", []
    if issue!="":
        whr += " and issue = %s"
        params.append(issue)
    if username!="":
        whr += " and username = %s"
        params.append(username)
    if parent!="":
        whr += " and parent = %s"
        params.append(parent)
    if status!="":
        whr += " and status = %s"
        params.append(status)
    if bTime!="":
        whr += " and issueTime >= %s"
        params.append(bTime)
    if sTime!="":
        whr += " and issueTime <= %s"
        params.append(sTime)
    if consume1!="":
        whr += " and totalConsume >= %s"
        params.append(consume1)
    if consume2!="":
        whr += " and totalConsume <= %s"
        params.append(consume2)
    if amount1!="":
        whr += " and amount >= %s"
        params.append(amount1)
    if amount2!="":
        whr += " and amount <= %s"
        params.append(amount2)
                        
    sql = "select " + ','.join(keys) + " from dividend_log " + whr + " order by amount desc, username"
    lines = []
    count, cursor = db.selectPage(sql, tuple(params), page, size)
    for item in cursor:
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line['startDate'] = str(line['startDate'])
        line['endDate'] = str(line['endDate'])
        line['createTime'] = str(line['createTime'])
        del line['endDate']
        del line['startDate']
        lines.append(line)
    
    return {'totalCount': count, 'list': lines}

def listConfigDividend_bk(db = None):
    if not db: db = Database()
    sql = "select id, name, value, status from config where category = 'dividend'"
    res = {}
    for (_id, name, value, status) in db.select(sql, ()):
        res[name] = [_id, value, status]
    
    return res    

'''管理员分红配置'''
'''all 为 False 则仅加载系统分红'''
def listConfigDividend(db = None, get_all = True):
    if not db: db = Database()
    keys = ['name', 'status', 'dayCount', 'pointLimit1', 'pointLimit2', 'consumeAmount', 'consumeDays', \
            'lossAmount', 'lossDays', 'isDefault', 'ruleId', 'runDate', 'userGroup']
    sql = "select a.id, " + ','.join(keys) + ", rtm from dividend_admin a left join \
            (select configId, max(runTime) rtm from sys_log where category = 'dividend' group by configId) b \
        on configId=a.id"
    if not get_all: sql += " where isDefault=1"
    lines, cache = [], {}
    for item in db.select(sql, ()):
        line = dict((k, item[i + 1]) for i, k in enumerate(keys))
        line['id'], line['rules'] = item[0], {}
        line['lastTime'] = str(item[-1]) if item[-1] else '未运行过'
        flag = rs.hget(KEY.TaskDividend, line['id']) 
        if str(flag) == '1': line['lastTime'] = "running"
        '''记录规则配置ID'''
        if line['ruleId']: cache[line['ruleId']] = len(lines)
        lines.append(line)
    
    if len(cache) == 0: return lines
    
    '''TODO: 未测试'''
    keysR = ['id', 'accountFrom', 'accountTo', 'activeUser', 'extraRules', 'scalePoint', 'uSecond']
    sql = "select " + ','.join(keysR) + " from dividend_config where id in ("+ \
        ','.join(['%s' for k in cache]) +")"
    for item in db.select(sql, tuple(cache.keys())):
        line = dict((k, item[i]) for i, k in enumerate(keysR))
        lines[cache[item[0]]]['rules'] = line
    
    return lines
    
def changeConfigDividend(user, dts):
    db = Database()
    command = []
    hasDefalut = False
    for dt in dts:
        if dt.get('isDefault', 0): hasDefalut = True
        command += _changeConfigDividend(user, dt)
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    '''刷新缓存'''
    if flag and hasDefalut: MI.loadDefaultDividend()
    
    return flag


def changeDividendConfig(user, rule, db = None):
    if not db: db = Database()
    
    sql = "insert into dividend_config (accountFrom, accountTo, activeUser, scalePoint, extraRules, uSecond) \
        values (%s, %s, %s, %s, %s, %s)"
    params = [0, 0, rule['activeUser'], rule['scalePoint'], json.dumps(rule['extraRules'], ensure_ascii = False), rule['uSecond']]
    
    if str(rule['id']) != '-1':
        sql = "update dividend_config set accountFrom = %s, accountTo = %s, activeUser = %s, scalePoint = %s, \
                extraRules = %s, uSecond = %s where id = %s"
        params.append(rule['id'])
    
    return db.execute(sql, params) 
    

'''单个配置修改'''
def _changeConfigDividend(user, dt, db = None):
    if not db: db = Database()

    keys = ['name', 'status', 'dayCount', 'pointLimit1', 'pointLimit2', 'consumeAmount', 'consumeDays', 'lossAmount', 'lossDays', 
            'ruleId', 'runDate', 'userGroup']
    command = []
    
    sql = "insert into dividend_admin (" + ','.join(keys) + ") values" + "(" + ','.join(map(lambda x:'%s', keys)) + ")"
    dt['pointLimit1'], dt['pointLimit2'] = dt['pointLimit'][0], dt['pointLimit'][1] 
    values = [dt[k] for k in keys]
    
    nId = changeDividendConfig(user, dt['rules'], db)
    if str(dt['id']) != '-1': 
        '''暂时不能放开系统默认契约对应级别,否则后果不可设想'''
        values[3] = values[4] = C.SYS_DIVIDEND_POINT
        sql = "update dividend_admin set " + ",".join([k + "=%s" for k in keys]) + " where id = %s"
        values.append(dt['id'])    
    else:
        '''非固定分红配置在新增时需同时插入规则配置'''
        if not dt['isDefault']:
            if nId != -1: values[-3] = nId   
        
    command.append([sql, values])
    
    '''操作日志'''
    sqlO, paramsO = "insert into operation (user, rfTable, rfField, content, srcValue) values (%s, \
        'dividend_admin', 'id', %s, %s)", (user, json.dumps(dt, ensure_ascii = False), dt['id'])
    command.append([sqlO, paramsO])
    
    return command


def changeConfigDividend_bk(user, dt):
    db = Database()
    command, values = [], dt.values()
    for line in values:
        sql = "update config set value = %s, status = %s where id = %s and category = 'dividend'"
        command.append([sql, (line[1], line[2], line[0])])
    
    sqlO, paramsO = "insert into operation (user, rfTable, rfField) values (%s, \
        'config', 'dividend')", (user, )
    command.append([sqlO, paramsO])
    
    flag, rst = db.Transaction(command)
    L.log(flag, rst)
    
    return flag

def listNotice(user, _type = 0, All = False):
    db = Database()
    status = int(_type)
    keys, whr = ['id', 'title', 'status', 'content', 'power', 'showOrder'], ''
    if not All: 
        whr = " and status = 0"
    else:
        keys.append('username')
    sql = "select " + ','.join(keys) + ", updateTime from notice where power <= %s" + whr + \
        " order by showOrder desc, updateTime desc"
    
    lines = []
    for item in db.select(sql, (status, )):
        line = {'time': str(item[-1])}
        for i, k in enumerate(keys): line[k] = item[i]
        lines.append(line)

    return lines

def getNotice(user, _id):
    db = Database()
    sql = "select title, status, content, power, updateTime from notice where id = %s"
    
    line = {}
    for (title, status, content, power, tm) in db.select(sql, (_id, )):
        line = {'id': _id, 'title': title, 'content': content, 'status': status, 'power': power, 'time': str(tm)}
        
    return line

def saveNotice(user, _id, title, content, power = 0, showOrder=0, status = 0, mark = ''):
    db = Database()
    sql, params = "update notice set title = %s, content = %s, power = %s, showOrder = %s, mark = %s, \
        username = %s, updateTime = %s where id = %s", (title, content, power, showOrder, mark, user, TM(), _id)
    if str(_id) == "-1":
        sql, params = "insert into notice (title, content, power, showOrder, mark, username, updateTime) \
            values (%s, %s, %s, %s, %s, %s, %s)", (title, content, power, showOrder, mark, user, TM())
    sqlO, paramsO = "insert into operation (user, rfTable, rfField) values (%s, 'notice', 'content')", (user, )
    
    flag, rst = db.Transaction([[sql, params], [sqlO, paramsO]])
    L.log(flag, rst)
    
    return flag, rst

def delNotice(user, _id):
    db = Database()
    sql, params = "delete from notice where id = %s", (_id, )
    sqlO, paramsO = "insert into operation (user, username, rfTable) values (%s, %s, 'notice')", (user, _id)
    
    flag, rst = db.Transaction([[sql, params], [sqlO, paramsO]])
    L.log(flag, rst)
    
    return flag

def changeNotice(user, _id, key, value):
    db = Database()
    sql, params = "update notice set " + key + " = %s, updateTime = %s where id = %s", (value, TM(), _id)
    sqlO, paramsO = "insert into operation (user, username, rfTable, rfField, tarValue) values (%s, %s, \
        'notice', %s, %s)", (user, _id, key, value)

    flag, rst = db.Transaction([[sql, params], [sqlO, paramsO]])
    L.log(flag, rst)
    
    return flag, rst

def clearDividendStatus():
    db = Database()
    sql = "select id from dividend_admin"
    res = db.selectEx(sql, ())
    for p in res:
        rs.hset(KEY.TaskDividend, p[0], None)

def draw_dividend_yesterday():
    from mContract import DividendDay
    dd = DividendDay()
    for issue in dd.get_issues(): print drawDividendRecordAll('sys', issue)[1]
 

if __name__ == '__main__':
    pass
#     agentFilter()
#     Dividend(2).Calculate()
#     clearDividendStatus()
#     Dividend(10)
#     print json.dumps(listConfigDividend(None, 1), ensure_ascii=False)
#     print getIssueRecord(amount1=23, amount2=23, consume2=100, bTime="2023-04-01")
    
#     print getServiceUrl()
#     clearDividend()

    draw_dividend_yesterday()
#     print drawDividendRecordAll('sys', '20200528_20200613')[1]
    
    
#     rs.hset(KEY.TaskDividendRecord, '20200607~2020070610', 2)
#     rs.hset(KEY.TaskDividendRecord, '20200607~2020070611', 2)
#     rs.hset(KEY.TaskDividendRecord, '20200607~2020070612', 2)
#     executeDividend(7)
#     Dividend(10)
#     listConfigDividend()
    
#     requestDividend('David', 2)
#     drawDividendRecord('system', 'a123456', 143)
    
#     print getRecordDividend()


