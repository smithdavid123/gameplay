#coding:utf8

from base import Lottery

'''因规则特殊停用'''
'''开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。'''
class TaiWan(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'twssc')
        self.beginTime = "09:00"
        self.stopTime = "23:55"
        self.interval = 5
        self.times = 203
        self.stop = True
        self.openTimeMode = 3
        self.baseIssue = 109053390
        self.baseDate = "2023-09-20"
    
        
'''End Class'''

if __name__ == '__main__':        
    cq = TaiWan()
    print cq.getOpenTime("2023-02-25 23:49:00")
    print cq.getOpenTime("2023-02-25 23:50:00")
    print cq.getOpenTime("")
    