#coding:utf8

from base import Lottery

'''重庆'''
class ChongQing(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'cqssc')
        self.beginTime = "00:10"
        self.pauseTime = "03:10"
        self.recoverTime = "07:10"
        self.stopTime = "23:50"
        self.times = 59
        
'''----------------------------------------------------End Class----------------------------------------------------'''    
    
'''天津'''
class TianJin(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'tjssc')
        self.beginTime = "09:00"
        self.stopTime = "23:00"
        self.openTimeMode = 2
        self.times = 42
        
'''----------------------------------------------------End Class----------------------------------------------------'''    
   
'''新疆'''
class XinJiang(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'xjssc')
        self.beginTime = "09:59"
        self.stopTime = "01:59"
        self.openTimeMode = 2
        self.times = 48

        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''腾讯分分彩'''
class Tencent(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'qqmin')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1
        self.bits = 4
        self.times = 1440
                
'''----------------------------------------------------End Class----------------------------------------------------'''    
'''奇趣分分彩'''
class QiQu(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'qumin')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1
        self.bits = 4
        self.times = 1440

'''----------------------------------------------------End Class----------------------------------------------------'''    

'''奇趣5分彩'''
class QiQu5(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'qu5fen')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 5
        self.times = 288
        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''奇趣十分彩'''
class QiQu10(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'qu10fen')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 10
        self.times = 144
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''河内分分彩'''
class HeNei1(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s60h')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1
        self.times = 1440
        self.bits = 4

'''----------------------------------------------------End Class----------------------------------------------------'''    

'''河内5分彩'''
class HeNei5(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s300')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 5
        self.times = 288
        self.bits = 4
        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''幸运十分彩'''
class Lucky10(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s600')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 10
        self.times = 144
        self.bits = 4

'''----------------------------------------------------End Class----------------------------------------------------'''    

'''幸运5分彩'''
class Lucky5(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s300a')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.bits = 4
        self.interval = 5
        self.times = 288
        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''快乐2分彩'''
class Happy2(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s120')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.bits = 4
        self.interval = 2
        self.times = 720
        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''幸运分分彩'''
class Lucky1(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s60a')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.bits = 4
        self.interval = 1
        self.times = 1440
        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''幸运三分彩'''
class Lucky3(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s180a')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.bits = 4
        self.interval = 3
        self.times = 480
        
'''----------------------------------------------------End Class----------------------------------------------------'''    

'''韩国·无'''    
class HanGuo(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'hgssc')
        self.beginTime = "09:10"
        self.stopTime = "23:10"
        
'''----------------------------------------------------End Class----------------------------------------------------'''

   
'''韩国1.5分'''    
class T1S90(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s90')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        
'''----------------------------------------------------End Class----------------------------------------------------'''

'''新德里1.5分'''    
class T1S90A(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s90a')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''俄罗斯1.5分'''    
class T1S90B(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s90b')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''印度1.5分'''    
class T1S90C(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s90c')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''东京1.5分'''    
class T1S90D(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s90d')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''美国1分'''    
class T1S60(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s60')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1
        self.bits = 4
        self.times = 1440
'''----------------------------------------------------End Class----------------------------------------------------'''   
   
'''缅甸3分'''    
class T1S180(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s180')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 3
        self.bits = 4
        self.times = 480
'''----------------------------------------------------End Class----------------------------------------------------'''            
            
            
'''新加坡30秒'''    
class T1S30(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't1s30')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 0.5
        self.bits = 4
        self.times = 2880
        
'''----------------------------------------------------End Class----------------------------------------------------'''
            
            
'''新加坡2分'''    
class Singapore(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'sgssc')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 2
        self.times = 720
        self.openTimeMode = 3
        self.baseIssue = 3155508
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
        
        
if __name__ == '__main__':        
    # cq = Singapore()
    cq = ChongQing()
    print cq.getOpenTime("2022-12-31 23:59:00")
    # cq = TianJin()
#     import datetime
#     print datetime.datetime.now()
#     cq = T1S90D()
#     cq.getData()
#     print cq.updateData()
    # cq.lastPhase = 0
    # print cq.getOpenTime("2022-12-31 21:57:00")
    # print cq.getOpenTime('2023-03-02 23:49:00')
    # cq.getData()
    # cq.updateData()
    # print cq.createOpenCode("2023-03-02 23:49:00")
    
    # print datetime.datetime.now()
    