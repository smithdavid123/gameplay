#coding:utf8
import sys
reload(sys)
sys.path.append('..')
sys.setdefaultencoding('utf-8') 


from libs.log import L
from api import URL
import urllib2
import json
import random
import time
import datetime
from base import Lottery
from libs.utils import MU, F0, F00, S2T, DT, S2TS, NextDay, S2DT, LastDay, after30s
from libs.redisEx2 import MyRedis as rs

class ChongQing(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'cqssc')
        self.beginTime = "00:10"
        self.pauseTime = "03:10"
        self.recoverTime = "07:10"
        self.stopTime = "23:50"
        
    def getData(self):
        dt = self.baseGetData()
        dt = self.createOpenCode()
            
        for key in dt:
            dt[key]['time'] = S2TS(dt[key]['dateline'])
            dt[key]['issue'] = key[0:-3] + "-" + key[-3:]
            
        self.data = dt

#         self.requestTimes += 1
#         dt = {}
#         # if 1:
#         try:
# #             opener = urllib2.build_opener()
# #             response = opener.open(URL.cqssc, timeout = 3500)
# #             rst = response.read()
# #             dt = json.loads(rst, encoding = "utf8")
# #              
# #             if 'status' in dt: 
# #                 L.debug('Error When Request Third Open Data: ', dt)
# #                 return
#             
#             dt = self.createOpenCode()
#             
#             for key in dt:
#                 dt[key]['time'] = S2TS(dt[key]['dateline'])
#                 dt[key]['issue'] = key[0:-3] + "-" + key[-3:]
#                 
#             self.data = dt
#             self.newMsg = True
#             self.error = False
#             self.successTimes += 1
#             self.lastSuccessTime = time.time()
#         except Exception as e:
#             L.error(e)
#             self.error = True
#             self.errorTimes += 1
#             L.error(self.name + " request data")
#         '''End Try'''
#        
#         L.debug("{} request api for score, {} records.".format(self.name, len(dt)))
#     '''End def'''    
    
    '''系统生成开奖信息'''
    def createOpenCode(self, timeStr = ""):
        info = self.getOpenTime(timeStr)
        currentIssue, openTime = info['issue'], after30s(info['openTime'])
        d, p = str(currentIssue)[0:-4], int(str(currentIssue)[-3:])
        issue = d + "" + F00(p - 1)
        print d, p, issue, info['issue']
        if p == 24:
            openTime = d[:4] + "-" + d[4:6] + "-" + d[6:8] + " 02:00:00"
        '''上一天'''
        if p == 0: 
            issue = LastDay(d).replace("-", "")[:8] + "120"
        opencode = ','.join([str(random.randint(0, 9)) for i in range(5)])
        
        return {issue: {'dateline': openTime, 'number': opencode}}
        
    
    def getNextPhase(self):
        ''' self.lastPhase = 20181230120 '''
        d, p = str(self.lastPhase)[0:-3], int(str(self.lastPhase)[-3:])
        '''新的一天'''
        if p == 120: 
            dt = datetime.datetime.strptime(d[:8], "%Y%m%d") 
            return str(dt + datetime.timedelta(days=1)).replace("-", "")[:8] + "-001"
        return d + "-" + F00(p + 1)
    
    def getOpenTime(self, timeStr = ""):  
        '''Argument For Test'''
        return self.baseGetOpenTime(timeStr)
#         tm = time.localtime() if timeStr=="" else S2T(timeStr)
#         tms, startTime, stopTime, issue = time.mktime(tm) * 1000, "", "", 0
#         h, m, s, dt = tm.tm_hour, tm.tm_min, tm.tm_sec, time.strftime("%Y-%m-%d", tm)
#         secs = h * 3600 + m * 60 + s
#         
#         # if h < 10 and h > 1 or (h == 1 and m >= 54 and s >= 30): 
#         if secs >= 6870 and secs < 36000:
#             startTime, stopTime, issue = dt + " 01:55:00", dt + " 09:59:30", 24
#         else:
#             ds = 10 if secs > 35370 and secs < 79170 else 5
#             lmu = 9 if ds == 10 else 4    
#             
#             m1, m2, secs = h * 60 + (m / ds) * ds + lmu, h * 60 + (m / ds) * ds + lmu, h * 3600 + m * 60 + s            
#             if (m % ds) == lmu and s >= 30:
#                 m2 += ds
#             else:
#                 m1 -= ds
#             
#             startTime = dt + " " + F0(m1 / 60) + ":" + F0(m1 % 60) + ":30"
#             stopTime = dt + " " + F0(m2 / 60) + ":" + F0(m2 % 60) + ":30"
#             
#             '''23:54:30'''
#             if secs >= 86370:
#                 startTime, stopTime = dt + " 23:59:30", NextDay(dt) + " 00:04:30"
#                 issue = -1
#             elif secs < 270:
#                 startTime, stopTime = dt + " 23:59:30", dt + " 00:04:30"
#                 issue = 1
#             elif secs < 6870:
#                 issue = m2 / ds + 1
#             elif secs > 36000 and secs < 79170:
#                 issue = 24 + (m2 - 600) / ds + 1  
#             else:
#                 issue = 95 + (m2 - 1319) / ds + 1  
#         '''End If'''
#                 
#         surplusTime = int((S2TS(stopTime) - tms) / 1000)
#         if issue == -1:
#             issue = NextDay(dt).replace("-", "") + "-001"
#         else: 
#             issue = dt.replace("-", "") + "-" + F00(issue)
#         '''End If'''
#         
#         return { "issue": issue, "startTime": startTime, "stopTime": stopTime, "openTime": stopTime, 
#                 "surplusTime": surplusTime if surplusTime > 0 else 0}
                         
    def getOpenCode(self):
        return self.baseGetOpenCode()
#         # TODO 可能每次重新请求好些
#         item = {}
#         if self.lastPhase==0:
#             keys = rs.hkeys(self.name)
#             keys.sort()
#             key = keys[-1]
#             item = rs.hget(self.name, key)
#             self.lastPhase = key
#         else:
#             key = str(self.lastPhase)
#             item = rs.hget(self.name, key)
#         if item==None: return None
#         # print self.lastPhase, item
#         openCode = {'openTime': item['time'], 'code': item['number'], 'code1': None, 'code2': None,
#                         'lottery': self.name}
#         openCode['issue'] = str(self.lastPhase)[0:-3] + "-" + str(self.lastPhase)[-3:]
#         openCode['clearStatus'] = 1
#         openCode['clearTime'] = item['time']
#         openCode['id'] = 1515454
#         
#         return openCode
    
        
        
'''End Class'''

def TestTime():
    cq = ChongQing()
    ts = [
#         "2022-12-31 00:01:39",
#         "2022-12-30 23:59:29",
#         "2022-12-30 23:59:30",
#         "2022-12-31 01:54:29",
#         "2022-12-31 01:54:30",
#         "2022-12-31 09:59:59",
#         "2022-12-31 10:00:00",
#         "2022-12-31 10:09:00",
#         "2022-12-31 10:09:30",
#         "2022-12-31 10:59:35",
#         "2022-12-31 21:59:29",
#         "2022-12-31 21:59:30",
#         "2022-12-31 22:09:30",
        "2022-12-31 23:54:00",
        "2022-12-31 02:04:00"
    ]
    for s in ts:
        line = cq.getOpenTime(s)
        print s, line['startTime'], line['stopTime'], line['issue']
        
        
if __name__ == '__main__':        
    cq = ChongQing()
    print cq.createOpenCode()
#     print cq.getOpenCode()
#     TestTime()
#     print cq.getOpenTime("2022-12-31 01:57:00")
    
#     cq.getData()  
#     print cq.data
    # print cq.createOpenCode("2022-12-31 01:57:00")
    d = "20140516"
    print d[:4] + "-" + d[4:6] + "-" + d[6:8]
#     cq.updateData()
#     print cq.data
#     print cq.lastPhase
         
#     print cq.getOpenCode()      
#     
    
#     tm = time.localtime()
#     print tm

#     d = "201812302"
#     print d[:4], d[4:6], d[6:8]
#     print d[:8]
#     print datetime.datetime.strptime(d[:8], "%Y%m%d")
#     print time.time()
#     print datetime.datetime(2018, 12, 30, 24, 59, 39, 10)
    