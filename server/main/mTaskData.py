#coding: utf8
import sys
sys.path.append('../')

import time
from datetime import datetime
from games.setting import services as S, GAME_INSTANCE as Games, CREATE_GAMES
from libs.redisEx2 import MyRedis as rs
from libs.log import L
from libs.utils import TM, S2DT, TimeOffset
from games.api import URL
import threading
ThreadR, ThreadC = None, None
# q = Queue.Queue()


# Games = {}
def init():
    pass
#     for item in S.values():
#         game = item['class']()
#         Games[item['name']] = game
#     '''End For'''


'''检查缓存时间'''
def CheckTime(name, update = True):
    cacheTime = Games[name].interval * 60 / 2
    '''正规彩种尽量多请求'''
    if Games[name].interval > 1: cacheTime = 1  
    lastTime, seconds = rs.hget('taskTimes', name, False), 0
    if lastTime != None: seconds = (datetime.now() - S2DT(lastTime)).seconds
    if seconds > 0 and seconds < cacheTime: return True
    
    # L.log(name, '\tDistance From Last Request Time: ', seconds)
    if update: rs.hset('taskTimes', name, TM())
    
    return False

'''定期请求程序'''        
def Request(index=0):
    L.sys("Worker Request Start...")
    init()
    
    keys, mid = Games.keys(), int(len(Games) / 2)
    keys = keys[:mid] if index ==0 else keys[mid:] 
    while True:
        time.sleep(1)
        # L.log("Read API data now...")
        for name in keys:
            # print name, Games[name].stop
            if Games[name].stop: continue
            # if CheckTime(name): continue        
            if name not in CREATE_GAMES: continue
            flag = True
            if URL.Lotterys[name] != '' and 0:
                flag = Games[name].getData()
                # print Games[name].data
            else:
                # 自动开奖太快，此处针对某些彩种做延迟
                timeStr = TimeOffset(-20)[:19] if name in set(['qqmin']) else ''
                Games[name].createData(timeStr)
                # print Games[name].data
                
            if flag: Games[name].updateData()

        '''End For''' 
    '''End While'''  
        
'''-------------------------------------------------------------------------------'''

def Collect():
    time.sleep(5)
    last = -1
    L.sys("Worker Collect Start...")
    while True:
        time.sleep(5)
        # L.log("collect data now...")
        for name in Games:
            g = Games[name]
            if g.newMsg: g.updateData()
            if g.error: g.getData()
            # L.log("collect records:", g.name, len(rs.hkeys(g.name)))
        
            '''分钟为1时再次请求'''
            mn = int(time.strftime("%M")) % 10
            if mn != 1 or last==mn: continue
            last = mn
            g.getData()
            
        '''End For'''
    '''End While'''
        
def startWorker():
    global ThreadR, ThreadC
    if ThreadR: ThreadR.join()
    ThreadR = threading.Thread( None, Request, "Thread-Request1", args=(0, ))
    ThreadR.start()
    
    if ThreadC: ThreadC.join()
    ThreadC = threading.Thread( None, Request, "Thread-Request2", args=(0, ))
    ThreadC.start()
        

# def startWorker():
#     if ThreadR: ThreadR.join()
#         ThreadR = threading.Thread( None, Request, "Thread-Request" )
#     ThreadR.start()
    
#     if ThreadC: ThreadC.join()
#     ThreadC = threading.Thread( None, MT.Collect, "Thread-Collect" )
#     ThreadC.start()
       
                
if __name__ == '__main__':
    startWorker()
    print TimeOffset(-3)
#     Request()        
#     Collect()
    pass
    
