#coding:utf8

from base import Lottery


'''台湾·计算有误'''
class TaiWanK8(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'twkl8')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 5
        self.openTimeMode = 3
        self.baseIssue = 107084819
        self.times = 203
        self.type = 5
        
'''----------------------------------------------------End Class----------------------------------------------------'''    
    
    
'''韩国·计算有误'''    
class HanGuoK8(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'hgkl8')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.openTimeMode = 3
        self.baseIssue = 2423285
        self.times = 880
        self.type = 5
        
'''----------------------------------------------------End Class----------------------------------------------------'''

   
'''东京'''    
class DongJingK8(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'jpkl8')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.type = 5
        
'''----------------------------------------------------End Class----------------------------------------------------'''

'''北京·停用'''    
'''baseDate 与 baseIssue 取某日日期及当日第一期期号即可，例     2023-02-23 : 937517'''
class BeiJingK8(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'bjkl8')
        self.beginTime = "09:00"
        self.stopTime = "23:59"
        self.type = 5
        self.openTimeMode = 3
        self.interval = 5
        self.times = 179
        self.baseIssue = 938949 
        self.baseDate = "2023-03-03"
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''新加坡'''    
class SingaporeK8(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'sgkl8')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 2
        self.times = 720
        self.openTimeMode = 3
        self.baseIssue = 3155508
        self.type = 5
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
        
        
if __name__ == '__main__':        
    cq = BeiJingK8()
    print cq.getOpenTime("2023-03-03 09:00:00")
    print cq.getOpenTime("2023-03-03 22:38:01")
    print cq.getOpenTime("")
    