#coding:utf8

from base import Lottery


'''安徽'''
class AnHuiK3(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'ahk3')
        self.beginTime = "08:30"
        self.stopTime = "22:10"
        self.times = 40
        self.type = 3
        
'''----------------------------------------------------End Class----------------------------------------------------'''    
    
'''江苏'''    
class JiangSuK3(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'jsk3')
        self.beginTime = "08:30"
        self.stopTime = "22:10"
        self.times = 41
        self.type = 3
        
'''----------------------------------------------------End Class----------------------------------------------------'''

   
'''湖北'''    
class HuBeiK3(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'hbk3')
        self.beginTime = "09:00"
        self.stopTime = "22:00"
        self.times = 39
        self.type = 3
        
'''----------------------------------------------------End Class----------------------------------------------------'''

'''吉林·停用'''    
class JiLinK3(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'jlk3')
        self.beginTime = "08:20"
        self.stopTime = "22:00"
        self.times = 41
        self.type = 3
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''吉隆坡'''    
class T3S90(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't3s90')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        self.type = 3
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   
'''新西兰'''    
class T3S120(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't3s120')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 2
        self.bits = 4
        self.times = 720
        self.type = 3
        
'''----------------------------------------------------End Class----------------------------------------------------'''

        
        
if __name__ == '__main__':        
    cq = T3S120()
    print cq.getOpenTime("2022-12-31 01:57:00")
    