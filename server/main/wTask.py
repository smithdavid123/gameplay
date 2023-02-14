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

Games = {}
# ThreadR, ThreadC = None, None
# q = Queue.Queue()

def init():
    for item in S.values():
        game = item['class']()
        Games[item['name']] = game
    '''End For'''

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
def Request():
    L.sys("Worker Request Start...")
    
    init()
    last = -1
    while True:
        time.sleep(1)
#         mn = int(time.strftime("%M")) % 10
#         '''分钟遇0或5重新请求数据'''
#         # if mn != 0 and mn != 5 and mn != 1 and mn != 6 and mn != 2 and mn != 7 or last==mn: continue
#         if last==mn: continue
#         last = mn
        L.log("Read API data now...")
        for name in Games:
            # print name, Games[name].stop
            if Games[name].stop: continue
            if CheckTime(name): continue
            if URL.Lotterys[name] != '':
                Games[name].getData()
                # print Games[name].data
            else:
                Games[name].createData()
                # print Games[name].data
                
            Games[name].updateData()
            '''End For''' 
    '''End If'''  

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
        

# def startWorker():
#     if ThreadR: ThreadR.join()
#     ThreadR = threading.Thread( None, Request, "Thread-Request" )
#     ThreadR.start()
    
#     if ThreadC: ThreadC.join()
#     ThreadC = threading.Thread( None, MT.Collect, "Thread-Collect" )
#     ThreadC.start()
       
                
if __name__ == '__main__':
    Request()        
#     Collect()
    pass
    
