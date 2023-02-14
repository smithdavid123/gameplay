#coding:utf8

import time
from datetime import datetime
from base import Lottery
from libs.utils import S2T, S2TS, DateOffset, time2second

def getOpenTime(stopTime, timeStr = "", advance = 0):  
    sSeconds = time2second(stopTime)
    tm = time.localtime() if timeStr=="" else S2T(timeStr)
    dt = time.strftime("%Y-%m-%d", tm)
    secs = tm.tm_hour * 3600 + tm.tm_min * 60 + tm.tm_sec
    
    num = 0 if secs < sSeconds else 1
    startTime = DateOffset(num - 1, dt) + " " + stopTime + ":00"
    stopTime = DateOffset(num, dt) + " " + stopTime + ":00"
    
    days = int((datetime.now() - datetime.strptime("2023-09-19", "%Y-%m-%d")).days)
    issue = 2020214 + days + num - advance
    surplusTime = int((S2TS(stopTime) - time.mktime(tm) * 1000) / 1000)
    
    return { "issue": str(issue), "startTime": startTime, "stopTime": stopTime, "openTime": stopTime, 
            "surplusTime": surplusTime if surplusTime > 0 else 0}
    
'''福彩3D'''
class FC3D(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'fc3d')
        self.beginTime = "00:00"
        self.stopTime = "21:06"
        self.times = 1
        self.type = 4
        self.openTimeMode = 3
        
    def getOpenTime(self, timeStr = "", advance = 0):  
        return getOpenTime(self.stopTime)
    
'''----------------------------------------------------End Class----------------------------------------------------'''    
    
    
'''体彩排列3'''
class PL3(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'pl3')
        self.beginTime = "00:00"
        self.stopTime = "20:05"
        self.times = 1
        self.type = 4
        self.openTimeMode = 3
        
    def getOpenTime(self, timeStr = "", advance = 0):  
        return getOpenTime(self.stopTime, "", 1)
    
'''----------------------------------------------------End Class----------------------------------------------------'''

   
'''北京'''    
class BeiJingPK10(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'bjpk10')
        self.beginTime = "09:10"
        self.stopTime = "23:50"
        self.interval = 20
        self.times = 44
        self.openTimeMode = 3
        self.baseIssue = 724992# 729920-4928
        self.type = 6
        
'''----------------------------------------------------End Class----------------------------------------------------'''

   
'''PC蛋蛋幸运28'''    
class PCDD(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'pcdd')
        self.beginTime = "09:00"
        self.stopTime = "23:55"
        self.interval = 5
        self.times = 179
        self.openTimeMode = 3
        self.baseDate = "2023-10-15"
        self.baseIssue = 978150
        self.type = 4
        
'''----------------------------------------------------End Class----------------------------------------------------'''


'''英国120'''    
class England120(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't6s120')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 2
        self.bits = 4
        self.times = 720
        self.type = 6

'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''英国180'''    
class England180(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't6s180')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 3
        self.bits = 4
        self.times = 480
        self.type = 6
         
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''老幸运飞艇'''    
class _Lucky300(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't6s300')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 5
        self.bits = 4
        self.times = 288
        self.type = 6

'''----------------------------------------------------End Class----------------------------------------------------'''    
   
'''幸运飞艇'''
class Lucky300(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't6s300')
        self.beginTime = "13:04"
        self.stopTime = "04:04"
        self.openTimeMode = 2
        self.times = 48
        self.interval = 5
        self.type = 6
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
        
        
if __name__ == '__main__':        
    cq = FC3D()
    
#     print cq.getOpenTime("2023-10-17 23:55:00")
#     print cq.getOpenTime("")
    print cq.getOpenTime('')
    