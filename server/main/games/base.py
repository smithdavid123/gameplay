#coding:utf8
import sys
import code
sys.path.append('..')

import random
import time
import urllib2
import json
from api import URL
from libs.redisEx2 import MyRedis as rs
from libs.utils import S2TS, pre30s, dayTime, S2DT, T2S, KV2Dict, F0, F00, F000, DateOffset, S2D, TM, DT, TimeOffset, NextDay
from libs.database import Database
from libs.log import L
from libs.code import Money, Play, BookMark as BM, BookStatus as BS
from libs.utils import TMN, RandCode, S2T, time2second, second2time
from common.wSSC import WinSSC
from common.w11X5 import Win11X5
from common.wK3 import WinK3
from common.wK8 import WinK8
from common.wD3 import WinD3
from common.wPK10 import WinPK10
from common.key import KEY
from common.utils import Bonus
from common.balance import Balance
from common.tools import common_book_in
from config import Config as C
from mInit import getConfig


class Lottery(object):
    '''
    classdocs
    '''
    Bonus = {}
    
    def __init__(self, name):
        self.name = name
        self.data = {}
        self.error = False
        self.errorTimes = 0
        self.successTimes = 0
        self.requestTimes = 0
        self.lastSuccessTime = None
        self.newMsg = False
        self.lastPhase = 0
        self.init = False
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.pauseTime = ""
        self.recoverTime = ""
        self.interval = 20
        self.bits = 3
        self.times = 0
        self.autoOpen = False
        self.type = 1
        self.label = "彩票"
        self.openMode = 0
        '''下注时延'''
        self.stopDelay = None
        '''是否停用'''
        self.stop = False
        
        '''重要参数·请慎重修改'''
        self.openTimeMode = 1
        '''用户计算型彩种'''
        self.baseDate = "2023-02-23"
        
    
    '''新开发的统一爬取整合程序'''
    def getDataEx(self, result):
        self.requestTimes += 1
        
        if result:
            self.error = False
            self.successTimes += 1
            self.lastSuccessTime = time.time()
        else:
            self.error = True
            self.errorTimes += 1
            return
        
        self.data = result
        L.debug("{} request api for score, {} records, issue: {}, ".format(self.name, len(result), result.keys()[0]))
        return result
    
    
    '''针对以前的网站API爬取形式'''
    def getData(self, auto = True):
        self.requestTimes += 1
        res = {}
        try:
            opener = urllib2.build_opener()
            response = opener.open(URL.Lotterys[self.name], timeout = 3500)
            rst = response.read()
            
            res = json.loads(rst, encoding = "utf8")
            
            self.newMsg = True
            self.error = False
            self.successTimes += 1
            self.lastSuccessTime = time.time()
        except Exception as e:
            self.error = True
            self.errorTimes += 1
            L.error(e, self.name)
        '''End Try'''
        
        if 'data' not in res:
            L.error('API Request Error:', res, self.name)
            return False
        dt = res['data']
        
        '''统一数据格式'''
        if auto: self.data = self.formatData(res['data'])
            
        L.debug("{} request api for score, {} records.".format(self.name, len(dt)))
        return dt

    '''最终开奖信息数据格式'''    
    def formatData(self, lines):
        dt = {}
        F = [F0, F00, F000][self.bits - 2]
        for item in lines:
            key = item['expect']
            issue = key if self.openTimeMode == 3 else key[:8] + "-" + F(key[-self.bits:])
            dt[key] = {'issue': issue, 'dateline': item['opentime'], 'number': item['opencode'], 
                       'time': S2TS(item['opentime']) 
            }
        return dt
        
    def createData(self, timeStr = ''):
        opt = self.createOpenCode(timeStr)
        key = opt['expect'] 
        if self.openTimeMode != 3: key = key[:8] + "-" + key[-self.bits:]
        '''理论上讲不会出现此种情况'''
        if key in self.data: return
        
        self.data = self.formatData([opt])
        # L.debug("{} system create score, {} records.".format(self.name, 1))
    
    '''TODO: 若后期后台管理系统可编辑，改为每次请求缓存'''
    def updateStopDelay(self):
        if self.stopDelay != None: return
        gameInfo = rs.hget(KEY.Games, self.name)
        if gameInfo:
            self.stopDelay = gameInfo.get('stopDelay', 0) 
        
    '''开奖时间入口'''
    def getOpenTime(self, timeStr = "", advance = 0):
        funcs = [None, self.baseGetOpenTime, self.baseGetOpenTime2, self.baseGetOpenTime3]
        rst = {}
        self.updateStopDelay()
        '''提前n秒进入下一期'''
        if advance !=0 and self.stopDelay == 0: self.stopDelay = advance
        
        if self.stopDelay == None: self.stopDelay = 0
        if self.stopDelay != 0 :
            timeStr = TimeOffset(int(self.stopDelay), timeStr).split('.')[0]
        
        if self.openTimeMode == 3: 
            rst = funcs[self.openTimeMode](timeStr, self.baseIssue)
        else:
            rst = funcs[self.openTimeMode](timeStr)
        
        return rst
        
    def preOpenTime(self, timeStr = ""):
        bSeconds, sSeconds = time2second(self.beginTime), time2second(self.stopTime)
        tm = time.localtime() if timeStr=="" else S2T(timeStr)
        sInterval, dt = int(self.interval * 60), time.strftime("%Y-%m-%d", tm)

        startTime, stopTime = dt + " 00:00:00", dt + " " + second2time(bSeconds + sInterval)
        secs = tm.tm_hour * 3600 + tm.tm_min * 60 + tm.tm_sec

        return bSeconds, sSeconds, sInterval, dt, secs, tm, startTime, stopTime
        
    '''适用情况：当日使用当日期号'''
    '''params: bTime - 07:20'''
    def baseGetOpenTime(self, timeStr = ""):
        bSeconds, sSeconds, sInterval, dt, secs, tm, startTime, stopTime = self.preOpenTime(timeStr)
        pTime, rTime = time2second(self.pauseTime), time2second(self.recoverTime)
        
        '''
            7:30    3:10    27000    11400
        '''
        # if self.pauseTime == '' and self.recoverTime == '':
        num = secs / sInterval
        if secs < bSeconds:
            num = 0
        elif secs >= bSeconds and secs < pTime:
            '''凌晨至暂停'''
            num = (secs - bSeconds) / sInterval
            startTime = dt + " " + second2time(bSeconds + num * sInterval)
            stopTime = dt + " " + second2time(bSeconds + (num + 1) * sInterval)  
        elif secs >= pTime and secs < rTime:
            '''暂停时间'''
            startTime = dt + " " + self.pauseTime + ":00"
            stopTime = dt + " " + second2time(rTime + sInterval)
            num = (pTime - bSeconds) / sInterval
        elif secs >= rTime and secs < sSeconds:
            # print 'There is a Bug Here'
            '''白天正常时间'''
            num = (secs - rTime + pTime - bSeconds) / sInterval
            '''无暂停情况'''
            if rTime == 0 and rTime != bSeconds: rTime = bSeconds
            s1 = rTime + (secs - rTime) / sInterval * sInterval
            s2 = rTime + ((secs - rTime) / sInterval + 1) * sInterval
            
            startTime = dt + " " + second2time(s1)
            '''修复午夜时分崩溃'''
            stopTime = (dt if s2 != 86400 else NextDay(dt))+ " " + second2time(s2)
        elif secs >= sSeconds:
            '''当日终止后，Next Day'''
            if self.stopTime == '23:59' and secs >= 86340:
                '''最后一期'''
                num = (secs - rTime + pTime - bSeconds) / sInterval
                s1 = rTime + (secs - rTime) / sInterval * sInterval
                startTime = dt + " " + second2time(s1)
                stopTime = DateOffset(1, dt) + " 00:00:00"
            else:
                startTime = dt + " " + self.stopTime + ":00"
                dt, num = DateOffset(1, dt), 0
                stopTime = dt + " " + second2time(bSeconds + sInterval)
        else:
            print 'Not Hit'
        
        F = [F0, F00, F000][self.bits - 2]
        issue = dt.replace('-', '') + '-' + F(num + 1)
        surplusTime = int((S2TS(stopTime) - time.mktime(tm) * 1000) / 1000)
        # print issue, secs, startTime, stopTime, surplusTime
        
        return { "issue": issue, "startTime": startTime, "stopTime": stopTime, "openTime": stopTime, 
                "surplusTime": surplusTime if surplusTime > 0 else 0}
    
    '''适用情况：凌晨延续昨日期号、当日终止'''
    '''params: beginTime - 10:00, stopTime - 02:00'''
    def baseGetOpenTime2(self, timeStr = ""):
        bSeconds, sSeconds, sInterval, dt, secs, tm, startTime, stopTime = self.preOpenTime(timeStr)
        startTime = dt + " " + self.stopTime + ":00"
        num = secs / sInterval
        if secs < bSeconds and (secs >= sSeconds or sSeconds > bSeconds):
            '''白天正式开始前的时间'''
            num = 0
        elif sSeconds > bSeconds and secs >= sSeconds:
            '''当天终止情况'''
            nDt = DateOffset(1, dt)
            startTime = dt + " " + self.stopTime + ":00"
            stopTime = nDt + " " + second2time(bSeconds + sInterval) 
            num, dt = 0, nDt
        elif secs >= bSeconds:
            '''白天正式期数·结束时间可能跨天'''
            num = (secs - bSeconds) / sInterval
            ss, sDt = bSeconds + (num + 1) * sInterval, dt
            if ss >= 86400: ss, sDt = ss - 86400, DateOffset(1, dt)
            startTime = dt + " " + second2time(bSeconds + num * sInterval)
            stopTime = sDt + " " + second2time(ss)  
        elif secs < sSeconds:
            '''凌晨终止'''
            num = (86400 + secs - bSeconds) / sInterval
            startTime = dt + " " + second2time(bSeconds + num * sInterval)
            stopTime = dt + " " + second2time(bSeconds + (num + 1) * sInterval)  
            dt = DateOffset(-1, dt)
        else:
            print 'Error: Not Hit'
        
        F = [F0, F00, F000][self.bits - 2]
        issue = dt.replace('-', '') + '-' + F(num + 1)
        surplusTime = int((S2TS(stopTime) - time.mktime(tm) * 1000) / 1000)
        # print issue, secs, startTime, stopTime, surplusTime
        
        return { "issue": issue, "startTime": startTime, "stopTime": stopTime, "openTime": stopTime, 
                "surplusTime": surplusTime if surplusTime > 0 else 0}
    
    '''适用情况：连续型期号'''
    '''params: beginTime - 09:00, stopTime - 23:55'''
    def baseGetOpenTime3(self, timeStr = "", baseNum = 937517):
        bSeconds, sSeconds, sInterval, dt, secs, tm, startTime, stopTime = self.preOpenTime(timeStr)
        stopS = ':59' if self.stopTime == '23:59' else ':00'
        num, offsetDay = 0, 0 
        
        if secs < bSeconds:
            '''白天正式开始前的时间'''
            num = 0
            startTime = DateOffset(-1, dt) + " " + self.stopTime + stopS
        elif secs >= bSeconds and secs < sSeconds:
            '''白天正式期数'''
            num = (secs - bSeconds) / sInterval
            ss, sDt = bSeconds + (num + 1) * sInterval, dt
            if ss >= 86400: ss, sDt = ss - 86400, DateOffset(1, dt)
            startTime = dt + " " + second2time(bSeconds + num * sInterval)
            stopTime = sDt + " " + second2time(ss)  
        elif secs >= sSeconds:
            if self.stopTime == '23:59' and secs >= 86340:
                '''最后一期'''
                num = (secs - bSeconds) / sInterval
                s1 = (secs - bSeconds) / sInterval * sInterval
                startTime = dt + " " + second2time(s1)
                stopTime = DateOffset(1, dt) + " 00:00:00"
            else:
                '''当天结束后'''
                startTime = dt + " " + self.stopTime + stopS
                stopTime = DateOffset(1, dt) + " " + second2time(bSeconds + sInterval)
                offsetDay = 1
        
        days = int((S2D(dt) - S2D(self.baseDate)).days)
        issue = str(baseNum + (days + offsetDay) * self.times + num)
        surplusTime = int((S2TS(stopTime) - time.mktime(tm) * 1000) / 1000)
        # print issue, secs, startTime, stopTime, surplusTime
        
        return { "issue": issue, "startTime": startTime, "stopTime": stopTime, "openTime": stopTime, 
                "surplusTime": surplusTime if surplusTime > 0 else 0}
    
    '''此处有必要记录一下逻辑：
        1、此处仅处理爬虫数据并更新入缓存列表，并默认未开奖标示
        2、客户端取开奖数据时应有所区分，只取本服务器已开奖数据
        3、自定义开奖计划数据仅存缓存，且与此队列区分，仅在开奖时取代爬虫数据，然后入正式列表
    '''           
    def updateData(self):
        '''检测最新期数'''
        for key in self.data:
            if long(key) > self.lastPhase: self.lastPhase = long(key)
        if self.init and rs.hexists(self.name, self.lastPhase): return
    
        '''清除多余缓存期数'''
        keys = rs.hkeys(self.name)
        source = set(keys)
        comb = source | set(self.data.keys())
        target = list(comb)
        target.sort()
        for c in target[-120:]:
            if c not in source:
                item = self.data[c]
                item['pass'] = 1 if self.name in C.FAST_GAMES else 0 
                L.debug(self.name, ': add new issue: ', c, item['number'])
                rs.hset(self.name, c, item)  
                '''原为单线程， 现使用消息队列优化'''
                # self.Save(item)
                rs.sendMessage({'name': self.name, 'data': item})
                
        '''需防止为负导致误删'''
        delStop = len(target) - 120
        if delStop > 0:
            for k in target[:delStop]:
                # L.debug('del old issue: ', k) 
                if k in source: rs.hdel(self.name, k) 
        self.init = True
              
        '''End For'''
    '''End Def'''
    
    
    '''系统生成开奖信息'''
    def createOpenCode(self, timeStr = ""):
        if timeStr == "": timeStr = TM()
        opt = self.getOpenTime(timeStr)
        key, issue = opt['issue'], int(opt['issue'][-self.bits:])
        
        '''累加型期号 和 非第一期情况'''
        if self.openTimeMode != 3 and issue == 1: 
            dt = DateOffset(-1, key[:-self.bits - 1])
            F = [F0, F00, F000][self.bits - 2]
            issue = dt.replace("-", "") + F(self.times)
        else:
            issue = str(long(key.replace("-", "")) - 1) 
        
        codes = [str(random.randint(0, 9)) for i in range(5)]
        if self.type == 2:
            codes = random.sample([F0(n) for n in range(1, 12)], 5)
        elif self.type == 3:
            '''快3'''
            codes = sorted([random.randint(1, 6) for i in range(3)])
        elif self.type == 4:
            codes = [random.randint(0, 9) for i in range(3)]
        elif self.type == 5:
            '''快8'''
            nums = {}
            while len(nums) < 20: nums[random.randint(1, 80)] = 1
            codes = [F0(c) for c in sorted(nums.keys())]
        elif self.type == 6:
            codes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
            random.shuffle(codes)
                
        return {'expect': issue, 'opencode': ','.join([str(c) for c in codes]), 'opentime': timeStr }
    
    '''获取开奖信息'''   
    def baseGetOpenCode(self, length = 3):
        length = self.bits
        item, key = {}, str(self.lastPhase)
        '''一般走第一分支'''
        if self.lastPhase==0:
            # keys = rs.hkeys(self.name)
            # TODO：后续采用堆存储，避免排序问题
            dts = rs.hgetall(self.name)
            keys = [k for k in dts if dts[k].get('pass', 1)]
            keys.sort()
            '''彩种未启用或无记录'''
            if len(keys) == 0: return {}
            
            key = keys[-1]
            item = rs.hget(self.name, key)
            self.lastPhase = key[0:-length] + "-" + key[-length:]
        else:
            item = rs.hget(self.name, key)
        if item==None: return None
        # print self.lastPhase, item
        openCode = {'openTime': item['time'], 'code': item['number'], 'code1': None, 'code2': None,
                        'lottery': self.name}
        openCode['issue'] = key[0:-length] + "-" + key[-length:]
        openCode['clearStatus'] = 1
        openCode['clearTime'] = item['time']
        openCode['id'] = 1515454
        if self.openTimeMode == 3: openCode['issue'] = openCode['issue'].replace('-', '')
        
        return openCode
    
    def getOpenCode(self):
        return self.baseGetOpenCode()
    
    
    
    
    '''--------------------------------- 华丽丽的分割线 -------------------------------------------'''
    def Save(self, item):
        db = Database()
        sql = ("select id, openCode, oldCode, status from open_code where name = %s and issue = %s")
        params = (self.name, item['issue'])
        rst = db.selectEx(sql, params)
        if len(rst)!=0:
            _id, openCode, setCode, status = rst[0][0], rst[0][1], rst[0][2], rst[0][3]
            '''已开奖'''
            if status != 0 or setCode != None: return
            '''此部分逻辑可能导致开奖号码多重不一致'''
            L.error("Test Important Error For Open Code: {}, {}".format(self.name, item['issue']))
            item['number'] = openCode
            
            # openCode, openTime = item['number'], item['dateline']            
            # sql = ("update open_code set openCode = %s, openTime = %s where id = %s")
            # db.execute(sql, (openCode, openTime, _id))
        else:
            day = dayTime(item['issue']) if self.openTimeMode != 3 else DT()
            line = {'name': self.name, 'issue': item['issue'], 'openCode': item['number'], 
                    'openTime': item['dateline'], 'dayTime': day, 
                    'stopTime': pre30s(item['dateline']) 
                }
            
            keys = ["name", "issue", "openCode", "openTime", "dayTime", "stopTime"]
            sql = ("insert into open_code (" + ','.join(keys) + ") values (" + ','.join(map(lambda x:'%s', keys)) + ")")
            params = tuple([line[k] for k in keys])
            db.execute(sql, params)
        '''End If'''
        
        self.Open(item, db)
        
    '''所有未开的'''
    @staticmethod
    def OpenAll():
        L.log('Open All unOpen Lottery...')
        db = Database()
        sql = '''SELECT a.issue, a.lottery, b.openCode, b.openTime FROM `game_order` a join open_code b on a.status=0 and 
            a.lottery=b.name and a.issue=b.issue group by lottery, issue'''
        lines = []
        for (issue, name, number, dateline) in db.selectEx(sql, ()):
            item = {'issue': issue, 'name': name, 'number': number, 'dateline': T2S(dateline)}
            lines.append(item)
        
        objs = {}
        for item in lines:
            name = item['name']
            if name not in objs: objs[name] = Lottery(name)
            Lottery(name).Open(item)

        print lines

    
    def changeOpencode(self, issue, code):
        issue = issue.replace('-', '')
        info = rs.hget(self.name, issue)
        info['number'] = code
        rs.hset(self.name, issue, info)
        
    '''开奖前盈亏检测'''
    def preOpen(self, item, db = None):
        # L.log('Check Before Open...', item['issue'])
        if not db: db = Database()
        openTime, openCode = S2DT(item['dateline']), item['number']
        '''订单表'''
        keys = ['id', "account", 'content', 'method', 'code', 'billno', 'point', 'money', 'model', \
                'multiple', 'orderTime', 'bonus']
        sql, params = ("select " + ",".join(keys) + " from game_order"
               " where status = 0 and lottery = %s and code != -1 and issue = %s"), (self.name, item['issue'])
        res = db.selectEx(sql, params)
        if len(res)==0: return None
        
        lines = []
        for fs in res:
            line = dict((k, fs[i]) for i, k in enumerate(keys))
            if line['orderTime'] >= openTime: continue
            lines.append(line)
        
        '''获取游戏配置信息，用于判断开奖模式和最大奖金'''
        maxBonus = getConfig("maxBonus")
        winMoney = self.calcSumBonus(openCode, lines)
        L.log('official open code pay money sum, openMode, maxBonus, maxGameBonus', \
              winMoney, openCode, self.openMode, maxBonus, self.name)
        
        '''0为正常开奖'''
        '''TODO: test, 注：原 and winMoney < maxGameBonus'''
        if int(self.openMode) == 0 or winMoney < maxBonus: return openCode
        if winMoney < maxBonus: return openCode
        
        '''重新生成开奖号码'''
        newCode, newMoney = openCode, winMoney
        for i in range(5):
            code = self.createOpenCode()['opencode']
            money = self.calcSumBonus(code, lines)
            if money < newMoney:
                newCode, newMoney = code, money
        '''天意如此'''
        if newCode == openCode: return openCode
        '''更新缓存信息'''
        self.changeOpencode(item['issue'], newCode)
        sql, params = "update open_code set openCode = %s, oldCode = %s where name = %s and issue = %s", \
            (newCode, openCode, self.name, item['issue'])
        db.execute(sql, params)
        
        L.log('Create New Opencode', newCode, ', Pay money', newMoney, ' from ', winMoney)
        return newCode
        
    '''TODO: 设计一种最少赔付金额号码生成算法'''
    def calcSumBonus(self, openCode, lines):
        winMoney = 0.0
        for line in lines:
            flag = self.CheckWin(line['method'], openCode, line['content'], line['code'], line['model'])
            if not flag: continue        
            winMoney += 1.0 * line['multiple'] * flag # * int(flag) * float(line['bonus'])
        return winMoney
        
    '''确认最终结果'''
    def Confirm(self, item, code = None):
        '''设置pass状态'''
        item['pass'] = 1
        if code: item['number'] = code
        issue = str(item['issue']).replace('-', '')
        '''正常开奖模式下不使用开奖计划'''
        if int(self.openMode) != 0:
            kp = 'pre' + self.name
            line = rs.hget(kp, issue)
            if line and line.get('number', '') != '': 
                item['number'] = line['number']    
                line['pass'] = 1
                rs.hset(kp, issue, line)
        '''更新缓存信息'''
        rs.hset(self.name, issue, item)
        '''记录最新开奖期数'''
        lastOpen = rs.hget(KEY.LastOpen, self.name, False)
        flag = lastOpen
        if lastOpen: lastOpen = long(str(lastOpen).replace('-', ''))
        if flag == None or long(issue) > lastOpen: 
            rs.hset(KEY.LastOpen, self.name, item['issue'])
        return item
        
    def Open(self, item, db = None):
        if not db: db = Database()
        '''开奖前盈亏检测'''
        gameInfo = rs.hget(KEY.Games, self.name)
        self.openMode, maxGameBonus = int(gameInfo.get('openMode', 0)), gameInfo['maxBonus']
        code = None
        if self.openMode != 0:
            code = self.preOpen(item, db)
            '''无投注记录，但要记得置开奖确认状态'''
            if not code: 
                self.Confirm(item)
                return
        
        item = self.Confirm(item, code)
        '''获取消费返点比例、平台抽水比例'''
        rebateConsumeRatio = getConfig('pointConsume')
        sysDrawWater = getConfig('sysDrawWater')
        maxBonusOnce = getConfig('maxBonusOnce')
        maxBonusIssue = getConfig('maxBonusIssue')
        rootSysAccount = getConfig('rootSysAccount', False)
        if sysDrawWater == None: sysDrawWater = 0.0
        sysDrawWater = float(sysDrawWater) / 100.0
        if not rebateConsumeRatio: rebateConsumeRatio = 0
        
        L.log('Ready To Open...', self.name, item['issue'])
        openTime, openCode = S2DT(item['dateline']), item['number']
        '''订单表'''
        keys = ['id', "account", 'content', 'method', 'code', 'billno', 'point', 'money', 'multiple', 'orderTime', 
                'bonus', 'isChase', 'model']
        '''账单表'''
        kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                "remarks", "status", "information"]
        
        sql, params = ("select " + ",".join(keys) + " from game_order"
               " where issue = %s and status = 0 and lottery = %s and code != -1"), (item['issue'], self.name)
        '''个人投注信息汇总·用于通知'''
        Summary = {}
        cursor1 = db.Query(sql, params)[1]
        orders = cursor1.fetchall()
        for fs in orders:
            line = dict((k, fs[i]) for i, k in enumerate(keys))
            flag, sCode, winMoney, cancel = False, 1, 0.000, 0
            account = line['account']
            if account not in Summary: Summary[account] = {'money': 0.0, 'winMoney':0.0, 'profit': 0.0}
            
            if line['orderTime'] >= openTime:
                L.log("Important Error: orderTime after openTime:", line['id'])
                '''每天应有定时任务来取消非法订单·cancel为1，退单后改为2'''
                '''sCode现在改为0，有问题用户自己取消'''
                sCode, cancel = 0, 1
            else:
                '''TODO: 增加了后两个参数，未测试……'''
                flag = self.CheckWin(line['method'], openCode, line['content'], line['code'], line['model'])
                if flag: sCode, winMoney = 2, 1.0 * line['multiple'] * flag # * int(flag) * float(line['bonus'])
                '''彩种最高奖金'''
                if winMoney > maxGameBonus: winMoney = maxGameBonus
                '''单挑最高奖金'''
                # if winMoney > maxBonusOnce: winMoney = maxBonusOnce
            keysU = ['status', 'winMoney', 'cancel', 'openCode', 'openTime']
            '''更新订单状态'''
            sqlP = ("update game_order set " + ','.join([k + ' = %s' for k in keysU]) + " where id = %s")
            paramsP = (sCode, winMoney, cancel, openCode, openTime, line['id'])
            
            '''更新账单状态'''
            sqlBU = ("update book set status = %s, updateTime = %s where reference = %s and account = %s and type = %s")
            paramsBU = (BS.ORDER_OK, TM(), line['billno'], account, '1300')
            
            '''用户表余额·获取并锁定余额'''
            sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (account, ) 
            cnx, cursor = db.Query(sql, params)
            userInfo = cursor.fetchall()
            if len(userInfo) == 0: 
                L.log("Error: user not found", account)
                continue
            
            #balance, balanceAfter, 
            accountType = userInfo[0][2]
            bl = Balance(userInfo[0][0], userInfo[0][1])
            commands = [[sqlP, paramsP], [sqlBU, paramsBU]]
            
            '''消费返点'''
            if rebateConsumeRatio > 0:
                pointMoney = line['money'] * rebateConsumeRatio
                bl.profit(pointMoney)
                # balanceAfter = balance + pointMoney
                itemB = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
                         'balanceAfter': bl.balance_after, 'reference': line['billno'], 'amount': pointMoney, 
                         'type': '1302', 'status': BS.INIT, "information": bl.info()}
                itemB['remarks'] = BM[itemB['type']]
                itemB['billno'] = TMN() + RandCode(8)
                sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ") VALUES (" + \
                                 ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([itemB[k] for k in kBook])
                commands.append([sqlB, paramsB])
                
            Summary[account]['money'] += line['money']
            '''派奖'''
            if flag:
                Summary[account]['winMoney'] += winMoney
                '''抽水计算'''
                if sysDrawWater > 0:
                    water = 1.0 * winMoney * sysDrawWater
                    winMoney -= water
                    print '进入抽水模式：', sysDrawWater, winMoney, water  
                    commands += common_book_in(rootSysAccount, water, line['billno'], '1989', db, cnx, cursor)
                bl.reload()
                bl.profit(winMoney)
                # balanceBefore = balanceAfter
                # balanceAfter = balanceAfter + winMoney
                itemW = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
                         'balanceAfter': bl.balance_after, "information": bl.info(),
                    'reference': line['billno'], 'amount': winMoney, 'type': '1301', 'status': BS.INIT}
                itemW['remarks'] = BM[itemW['type']]
                itemW['billno'] = TMN() + RandCode(8)
                sqlW, paramsW = ("insert into book (" + ','.join(kBook) + ")" 
                   " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([itemW[k] for k in kBook])
                commands.append([sqlW, paramsW])                    
            '''余额更新'''
            sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
                (bl.virtual_after, bl.deposit_after, account)
            commands.append([sqlM, paramsM])
            
            '''核心事务处理'''
            flag2, rst = db.Transaction(commands, cnx, cursor, False)
            L.dbLog(flag2, rst)
            
            '''发送消息·工资发放'''
            rs.sendMessage([account, line['code'], line['money'], line['billno'], line['point']], KEY.ChannelWage)
            
            '''追号订单需判断是否停止追单·借用追号频道处理'''
            if line['isChase'] and flag2 and flag:
                rs.sendMessage([account, line['billno'], 'stopAfterWin'], KEY.ChannelWage)
            
        '''消息通知'''
        for u in Summary:
            Summary[u]['profit'] = Summary[u]['winMoney'] - Summary[u]['money']
            Summary[u]['issue'] = item['issue']
            rs.hset('openNotice', u, Summary[u])
        
        '''TODO: 异步优化'''
        
        return         
    
      
    def CheckWin(self, m, openCode, content, code = 1900, model = 'fen'):
        # if self.type > 2: return False
        winner = [WinSSC, Win11X5, WinK3, WinD3, WinK8, WinPK10][self.type - 1]()
        res = winner.Detection(m, openCode, content)
        flag = res if type(res) != type([]) else res[0]
        if not flag: return 0 
        
        if self.name not in Lottery.Bonus: Lottery.Bonus[self.name] = Bonus(self.name)
        bonus = Lottery.Bonus[self.name].updateBonus(m, code, model, True)
        
        if type(res) == type([]):
            '''此处中奖判断会返回所中的龙虎和的索引012'''
            flag = bonus[res[1]] 
        else:
            '''兼容临时情况，正常情况下，此种情况不会发生'''
            if type(bonus) == type([]): bonus = bonus[-1]
            flag = 1.0 * int(flag) * bonus
        return flag


if __name__ == '__main__':        
    cq = Lottery('bjpk10') #qumin
    
#     cq.type = 2
#     cq.interval = 5
#     print cq.CheckWin('exzuxfsh', '1,2,0,8,0', '0,2,4,6,8', '1990', 'yuan')

    txt = "2023-06-04 13:20:40"
    print cq.getOpenTime(txt)
#     gameInfo = rs.hget(KEY.Games, 'cqssc')
#     print rs.hkeys(KEY.Games)
#     print cq.baseGetOpenCode()
#     print cq.Confirm({'issue': '123-1'}, '1,2,3,4,5')
#     print rs.hgetall('cqssc')
#     print rs.hgetall('cqssc')
#     print int("02")
#     print sorted([int(c) for c in ['08', '11', '10', '02', '05']])[2]
    item = {'issue':'20200602-0294', 'dateline': TM(), 'number':'6,1,3,4,2'}
    # code = cq.preOpen(item)
    # print code
    # if code: item['number'] = code
'''手动开代码'''    
#     print cq.Open(item)
#     print gameInfo['maxBonus']
#     print rs.hget(KEY.Games, 'qumin')
#     Lottery.OpenAll()
    
#     print rs.hkeys("cqssc")
    
#     print cq.CheckWin('lhwg', '8,3,2,5,5', '龙|虎|和', 1994, 'yuan')
#     print cq.CheckWin('dds', '06,04,01,08,07', '2单3双', 1994, 'yuan')
#     print cq.CheckWin('dds', '05,04,01,08,07', '3单2双', 1994, 'yuan')
#     print cq.CheckWin('czw', '06,04,01,08,07', '06', 1994, 'yuan')
#     print cq.CheckWin('czw', '02,03,01,08,07', '03', 1994, 'yuan')
    
    