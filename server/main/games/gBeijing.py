#coding:utf8

from base import Lottery
from libs.utils import S2TS

'''因规则特殊停用'''
"开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。"
class BeiJing(Lottery):
    def __init__(self):
        Lottery.__init__(self, 'bjssc')
        self.beginTime = "09:00"
        self.stopTime = "23:55"
        self.interval = 5
        self.times = 179
        self.openTimeMode = 3
        self.baseIssue = 1020394
        self.baseDate = "2023-09-20"
        
        
'''End Class'''

if __name__ == '__main__':        
    cq = BeiJing()
    print cq.getOpenTime()
    
#     print cq.getOpenTime("2023-09-21 23:54:00")
#     print cq.getOpenTime("2023-02-25 23:55:00")
#     print cq.getOpenTime("2023-02-25 23:56:00")
#     print cq.getOpenTime("2023-02-26 00:01:00")
    