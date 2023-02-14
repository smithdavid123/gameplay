#coding:utf8

from base import Lottery


'''广东'''
class GuangDong115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'gd11x5')
        self.beginTime = "09:10"
        self.stopTime = "23:10"
        self.times = 42
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''    
    
    
'''江西'''    
class JiangXi115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'jx11x5')
        self.beginTime = "09:10"
        self.stopTime = "23:10"
        self.times = 42
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''
   
   
'''上海'''    
class ShangHai115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'sh11x5')
        self.beginTime = "09:00"
        self.stopTime = "23:59"
        self.times = 45
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''
   
   
'''安徽'''    
class AnHui115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'ah11x5')
        self.beginTime = "08:40"
        self.stopTime = "22:00"
        self.times = 40
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''            
            
            
'''山东'''    
class ShanDong115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'sd11x5')
        self.beginTime = "08:40"
        self.stopTime = "23:00"
        self.times = 43
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''
   
   
'''辽宁'''    
class LiaoNing115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'ln11x5')
        self.beginTime = "08:49"
        self.stopTime = "22:29"
        self.times = 41
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''
   

'''加拿大'''    
class JiaNaDa115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't2s90')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 1.5
        self.bits = 4
        self.times = 960
        self.type = 2
        
'''----------------------------------------------------End Class----------------------------------------------------'''
   

'''纽约'''    
class NiuYue115(Lottery):
    def __init__(self):
        Lottery.__init__(self, 't2s30')
        self.beginTime = "00:00"
        self.stopTime = "23:59"
        self.interval = 0.5
        self.bits = 4
        self.times = 2880
        self.type = 2

'''----------------------------------------------------End Class----------------------------------------------------'''        
        
        
if __name__ == '__main__':        
    cq = GuangDong115()
    print cq.getOpenTime("2022-12-31 01:57:00")
    