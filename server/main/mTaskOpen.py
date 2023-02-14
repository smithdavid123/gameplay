#coding: utf8
import sys
sys.path.append('../')

import time
from datetime import datetime
from games.setting import services as S
from libs.redisEx2 import MyRedis as rs
from libs.log import L
from libs.utils import TM, S2DT
from games.api import URL
from common.key import KEY
import threading
from mWage import runWage
from mChase import stopAfterWin

Games = {}


def init():
    for item in S.values():
        game = item['class']()
        Games[item['name']] = game
    '''End For'''



def RequestWage():
    L.sys("Worker Request Wage Start...")
    subWage = rs.subscribe(KEY.ChannelWage)
    while True:
        time.sleep(1)
        line = rs.getMessage(subWage)
        # L.log("Get Open Message...", line)
        if line[2] != 'stopAfterWin':
            runWage(line[0], line[1], line[2], line[3], None)
        else:
            stopAfterWin(line[0], line[1])

'''接收开奖消息'''        
def Run():
    L.sys("Worker GameOpen Start...")
    
    init()
    rs.subscribe(None, True)
    
    ThreadR = threading.Thread( None, RequestWage, "Thread-Request-Wage" )
    ThreadR.start()

    while True:
        time.sleep(1)
        item = rs.getMessage()
        # L.log("Get Open Message...", item['name'])
        Games[item['name']].Save(item['data'])
        
        
        
                
if __name__ == '__main__':
    Run()        
    pass
    # print stopAfterWin("system", "20190701013613165139802130829")
