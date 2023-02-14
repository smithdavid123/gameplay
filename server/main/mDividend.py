#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

import json
import threading
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import TM, DateOffset, DT, TMN, RandCode, DiffSecond
from libs.code import BookMark as BM, BookStatus as BS
from common.tools import level2point
from libs.log import L
from common.key import KEY
import mInit as MI
from config import Config as C


'''分红核心程序集'''
class Dividend():
    
    def __init__(self, _id, begin_time = None, end_time = None, notRun = True):
        self.roots = {}
        '''存储核心基础用户信息'''
        self.users = {}
        '''存储用户符合规则信息'''
        self.accounts = {}
        self.activeUsers = set()
        self.dividend_users = {}
        self.tree = {}
        self.commands = []
        self.beginTime = begin_time
        self.endTime = end_time
        self.issue = TMN() + RandCode(10)
        self.sumMoney = 0.0
        self.id = _id
        self.config = []
        self.rules = {}
        self.notRun = notRun 
        if self.loadConfig(): 
            pass
            self.Calculate()
        
    def loadConfig(self):
        db = Database()
        keys = ['dayCount', 'consumeAmount', 'lossAmount', 'consumeDays', 'lossDays', 'pointLimit1', 'pointLimit2', 
                'userGroup', 'isDefault']
        sql = "select " + ','.join(keys) + ", c.activeUser, c.scalePoint, c.extraRules, b.lastTime from dividend_admin a \
            join dividend_config c on a.ruleId=c.id left join (select lastTime, configId \
            from sys_log where configId = %s and status=2 order by lastTime desc limit 1) b on b.configId = a.id where a.id = %s"
            
        res = db.selectEx(sql, (self.id, self.id))
        if len(res) == 0: return
        
        l = len(keys)
        c = self.config = list(res[0])
        self.config[5] = [self.config[5], self.config[6]]
        self.userGroup = self.config[7]
        self.isDefault = self.config[8]
        self.rules = {'activeUser': c[l], 'scalePoint': c[l + 1], 'extraRules': c[l + 2]}
        last_time = str(c[-1]) 
        dayCount = c[0]
        '''未指定时间时，从上次最后一次执行时间为准'''
        if not self.beginTime:
            '''上次时间''' 
            if last_time:
                self.beginTime = last_time 
            else:
                self.beginTime = DateOffset(-dayCount)
            '''End If 2'''
        else:
            '''所指定起始时间早于上次截至时间'''
            if not last_time and DiffSecond(str(self.beginTime), str(last_time)) <= 0:
                L.error("Error: beginTime before than last endTime:{}".format(last_time))
                return False
            '''End If 2'''
        '''End If 1'''
            
        if not self.endTime: self.endTime = DT()
        
        L.log('Dividend begin time: {}，end time: {}, dayCount: {}'.format(self.beginTime, self.endTime, dayCount))
        
        return True
    
    '''唯一入口，内部区分分红类别'''
    def Calculate(self):
        c = self.config
        flag = rs.hget(KEY.TaskDividend, self.id) 
        if flag and str(flag) == '1': 
            L.error('There is a task is running or exited abnormal, job will not executed this time!')
            return 
        rs.hset(KEY.TaskDividend, self.id, 1)
        
        '''仅处理固定分红'''
        if int(self.isDefault) == 1: 
            self.run(c[1], c[2], c[3], c[4], c[5])
        
        rs.hset(KEY.TaskDividend, self.id, 2)
    
    '''第二次修改，仅列出分红用户组成员'''
    def load_dividend_users(self, pointLimits, db = None):
        if not db: db = Database()
        dividend_users = {}
        pointLimits = [level2point(pointLimits[0]), level2point(pointLimits[1])]
        sql = "select username, point from user u where allowDividend=1 and dividendGroup=%s"
        for (username, pt) in db.select(sql, (self.userGroup, )):
            username = username.strip().lower()
            if pt < pointLimits[0] or pt > pointLimits[1] or pt > C.MAX_POINT: continue
            dividend_users[username] = {'point': pt, 'active_user': 0, 'consume': 0.0, 'loss': 0.0, 'rule': None}

        self.dividend_users = dividend_users
        
    '''加载基础信息，获取users, tree, activeUsers'''
    def loadSummaryInfo(self, consumeAmount, lossAmount, consumeDays, lossDays, pointLimits, db = None):
        if not db: db = Database()
        '''
        sqlU = "select username, point, type, parents, parentName from \
            user u join (SELECT DISTINCT account FROM `book` WHERE status=2 and update_date BETWEEN %s and %s) b \
            on u.username=b.account"
        '''
        '''sql优化'''
        sqlU = "select DISTINCT account, u.point, u.type, parents, parentName from user u \
            left join book b on u.username=b.account where b.status=2 and \
            b.update_date BETWEEN %s and %s" 
        
        accounts = {}
        '''User Info Summary'''
        for (account, point, uType, parents, parentName) in db.select(sqlU, (self.beginTime, self.endTime)):
            account = account.strip().lower()
            parentList = [] if not parents else parents.split(">")
            accounts[account] = {
                'point': point, 'type': uType, 'parentName': parentName, 'parents': parentList, 
                'dps': [], 'sums': [0.0, 0.0, [0, 0]]
            }
            for p in parentList:
                if p in self.dividend_users: accounts[account]['dps'].append(p.strip().lower())
            '''自身数据也需纳入统计的话'''
            if account in self.dividend_users: accounts[account]['dps'].append(account)
        '''End For 1'''
                    
        '''汇总消费记录'''
        sqlB = "select account, consume, bonus, rebate, dividend from (select account, update_date d, \
            IFNULL(sum(case when b.type='1300' then amount end), 0) consume, \
            IFNULL(sum(case when b.type='1301' then amount end), 0) bonus, \
            IFNULL(sum(case when b.type='1400' then amount end), 0) rebate, \
            IFNULL(sum(case when b.type='1900' then amount end), 0) dividend \
            from book b where b.status=2 and update_date between %s and %s group by account, d) c \
            where consume > 0 or bonus > 0"
        for (account, consume, win, rebate, dividend) in db.select(sqlB, (self.beginTime, self.endTime)):
            account = account.strip().lower()
            if account not in accounts: 
                L.log('summary user error: {} not included'.format(account))
                continue
            loss = consume - win - rebate - dividend
            '''原来这段可能有误'''
            accounts[account]['sums'][0] += consume
            accounts[account]['sums'][1] += loss
            '''可能满足活跃条件'''
            if consume > consumeAmount: accounts[account]['sums'][2][0] += 1
            if loss > lossAmount: accounts[account]['sums'][2][0] += 1
                
        for account in accounts:
            info = accounts[account]['sums']
            flag = info[2][0] >= consumeDays and info[2][1] >= lossDays
            for p in accounts[account]['dps']:
                self.dividend_users[p]['consume'] += info[0]
                self.dividend_users[p]['loss'] += info[1]
                if flag: self.dividend_users[p]['active_user'] += 1
            '''End For 1'''
        '''End For 2'''
        L.log('Load Summary Info finished from user count:' + str(len(accounts)))
        
        return True
    
    '''根据规则配置，计算该用户对应分红信息'''
    def analysisAmounts(self, activeLimit, scalePoint, extraRules, u, scale = None):
        '''非固定分红配置只计算一次配置，基础配置所有用户相同'''
        activeUser, consume, loss = self.dividend_users[u]['active_user'], \
            self.dividend_users[u]['consume'], self.dividend_users[u]['loss'] 
        if scale == None:
            extraRules = json.loads(extraRules, encoding = 'utf8')
            '''保底分红'''
            scale = float(self.checkBaseDividend(activeLimit, scalePoint, extraRules))
            '''无保底分红时，无活动记录人员直接处理'''
            '''TODO: Testing, 原来为 and '''
            if activeUser == 0:
                if scale == 0: self.dividend_users[u]['rule'] = {'scalePoint': scale, 'activeUser': 0}
                return 0
        '''End If'''
        '''基础规则'''
        if activeUser >= activeLimit: scale = scalePoint
        '''附加规则'''
        for rule in extraRules:
            for k in rule: rule[k] = float(rule[k])
            '''比较注意亏损的符号'''
            if consume < (rule['totalConsume'] * 10000) or loss < (rule['totalLoss'] * 10000) \
                or activeUser < rule['activeUser']: break
            scale = rule['scalePoint']
        
        self.dividend_users[u]['rule'] = {'scalePoint': scale, 'activeUser': activeUser}
        
        return scale
        
    '''★★★★'''
    def run(self, consumeAmount, lossAmount, consumeDays, lossDays, pointLimits):
        db = Database()
        self.load_dividend_users(pointLimits, None)
        
        '''加载基础信息，获取users, tree, activeUsers'''
        self.loadSummaryInfo(consumeAmount, lossAmount, consumeDays, lossDays, pointLimits, db)
        activeLimit, scalePoint, extraRules = self.rules['activeUser'], \
                    self.rules['scalePoint'], self.rules['extraRules']
        
        for user in self.dividend_users:
            info = self.dividend_users[user]
            '''计算用户根据配置应得分红信息'''    
            scale = self.analysisAmounts(activeLimit, scalePoint, extraRules, user)
            amount = self.readyForRecord(user, scale)
            L.log("user: {}, active user: {}, loss : {}, scale: {}, money: {}".format(user, \
                        info['active_user'], info['loss'], scale, amount))
            
        self.recordAll(db)
    
        
    '''根据分红比例，获取分配信息并生成sql'''
    def readyForRecord(self, u, scale):
        info = self.dividend_users[u]
        activeUser, loss = info['active_user'], info['loss']
        
        '''计算亏损额时把返点减去'''
        amount = 1.0 * loss * float(scale) / 100
        if amount < 0: amount = 0
        '''为0的结果不记录'''
        if amount <= 0: return 0
        print u, info['active_user'], info['loss'], amount, info['consume'], info['rule'] 
        
        keys = ['username', 'totalConsume', 'totalLoss', 'activeUser', 'amount', 'scalePoint', 'startDate', 'endDate', \
                'issue']
        sql = "insert into dividend_log (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")"
        params = [u, info['consume'], info['loss'], activeUser, amount, scale, self.beginTime, self.endTime, self.issue]
        self.commands.append([sql, params])
        self.sumMoney += amount
        
        return amount
        
    '''最终入库'''
    def recordAll(self, db):
        '''运行日志'''
        sql = "insert into sys_log (category, money, users, lastTime, runTime, configId, info, issue, mark) values \
            (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        self.commands.append([sql, ['dividend', self.sumMoney, len(self.commands), self.beginTime, self.endTime, \
            self.id, '', self.issue, self.isDefault]])
        flag, rst = True, 1
        
        if not self.notRun: flag, rst = db.Transaction(self.commands)
        message = '本次分红信息: 总额 - ' + str(self.sumMoney) + "元, 总人数 - " + str(len(self.commands) - 1)
        L.dbLog(flag, rst)
        L.log(message, flag)
        return message if flag else '运行错误'
    
    '''先检查基础分红，再检查第一条附加规则，判断有无无条件分红规则'''
    def checkBaseDividend(self, activeUser, scalePoint, extraRules):
        if activeUser == 0 and scalePoint > 0: return scalePoint
        if len(extraRules) == 0: return 0
        emptys = [k for k in extraRules[0] if float(extraRules[0][k]) > 0] 
        if len(emptys) == 1 and emptys[0] == 'scalePoint': return extraRules[0]['scalePoint']
        
        return 0
    

'''----------------------------------End Class--------------------------------------'''    

def clearDividendStatus():
    db = Database()
    sql = "select id from dividend_admin"
    res = db.selectEx(sql, ())
    for p in res:
        rs.hset(KEY.TaskDividend, p[0], None)

if __name__ == '__main__':
    pass
#     agentFilter()
#     Dividend(2).Calculate()
#     clearDividendStatus()
    Dividend(7, '2023-05-28 00:00:00', '2023-06-13 00:00:00', notRun = True)

#     print DiffSecond('2023-06-05 00:00:00', TM())
    
#     print json.dumps(listConfigDividend(None, 1), ensure_ascii=False)
    
