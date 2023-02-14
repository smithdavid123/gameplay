#coding:utf8
import sys
import code
sys.path.append('..')

import time
from datetime import datetime
import json
import urllib
import urllib2
from libs.log import L
from libs.utils import TM, TMSL, S2TS, TS2S, S2TSL, TimeOffsetS, PreNow, DiffSecond
from games.setting import services as S
from libs.heap import Heap
from libs.timeout import Timer


import  threading   
Lock = threading.Lock()

Normals = set(["cqssc", "tjssc", "xjssc", "gd11x5", "jx11x5", "ah11x5", "sh11x5", "sd11x5", "ln11x5", "jsk3", 
        "ahk3", "hbk3", "jlk3", "fc3d", "pl3",
        "t1s600", "qq10fen", "bjpk10", "qq5fen", "bjssc", "t1s300", "twssc", "t6s300", "twkl8", "t1s300a", "bjkl8"
    ])
Hots = set(['qqmin'])

'''预请求时间列表'''
TimeList = Heap('tm', 'name')

Games = {}
CacheNextTimes = set()

def init():
    for item in S.values():
        game = item['class']()
        Games[item['name']] = game
    '''End For'''


'''
----------------------------------------------------------- Producer ----------------------------------------------------
生产者
两种机制
'''    
def producer():
    init()
    Timer.Run()
    
    '''常规定期请求时间控制'''
    def addTime(args):
        global Lock
        param, seconds = args[0], args[1]
        if Lock.acquire():
            TimeList.push(param)
            Lock.release()
        
        p = {'name': param['name'], 'tm': TMSL(), 'issue': ''}
        
        Timer.setTimeout(addTime, seconds, p, seconds)
    
    '''精准时间控制，获取下次开奖时间，在该时间附近增加多次请求'''
    def addQuestTime(args):
        n = args[0]
        res = getNewData(n)
        '''若请求结果有误'''
        if res == [] or 'NextOpenTime' not in res:
            return Timer.setTimeout(addQuestTime, 10, n)
        
        '''时间合理性判断'''
        ntm, seconds = res['NextOpenTime'], [7, 12, 16, 30, 45, 70] 
        ds = DiffSecond(ntm)
        if ds < 0: ntm = TM()
        if ds < -200: seconds = [100, 200]
        
        tms = [TimeOffsetS(t, ntm) for t in seconds]
        for t in tms:
            param = {'name': n, 'tm': t, 'issue': res['Term']}
            TimeList.push(param)
         
        Timer.setTimeout(addQuestTime, tms[1], n)
        
    for n in Games:
        game = Games[n]
        seconds = game.interval * 60 / 4 
        param = {'name': n, 'tm': TMSL(), 'issue': ''}
        addQuestTime([n])
        Timer.setTimeout(addTime, seconds, param, seconds)

#----------------------------------------------------------- Consumer ----------------------------------------------------

def consumer():
    
    '''最终开奖信息数据格式·for getDataList'''    
    def formatDataList(name, res):
        if 'data' not in res or res == []:
            L.error('API Request Error:', res, name)
            return False
        
        dt = {}
        lines = res['data']
        for item in lines:
            if item['lottery'] != name: continue
            issue, key = item['issue'], item['issue'].replace("-", "") 
            dt[key] = {'issue': issue, 'dateline': item['timeStr'], 'number': item['code'], 
                       'time': S2TS(item['timeStr']) 
            }
        return dt     
    
    '''最终开奖信息数据格式·for getNewData'''    
    def formatDataNew(name, item):
        dt = {}
        if len(item) == 0: return None
        if item['LotteryText'] != name: return None
        
        issue, key = item['Term'], item['Term'].replace("-", "") 
        dt[key] = {'issue': issue, 'dateline': item['OpenTime'], 'number': item['KaiJiHao'], 
                   'time': S2TS(item['OpenTime']) 
        }
        return dt   
    
    def getData(name, style = 0):
        if Games[name].stop: return
        '''不同接口和不同数据转换方式'''
        config = [[getDataList, formatDataList], [getNewData, formatDataNew]]
        func, fmt = config[style][0], config[style][1]  
        res = func(name)
        
        # print json.dumps(res, ensure_ascii=False)
        
        '''统一数据格式'''
        data = fmt(name, res)
        Games[name].getDataEx(data)
        Games[name].updateData()
        
        
    while True:
        time.sleep(0.1)
        if TimeList.isEmpty(): 
            time.sleep(1)
            continue
        t = TimeList.first()
        if not t: 
            time.sleep(1)
            continue 
        if t > TMSL(): continue
        
        e = TimeList.pop()
        for item in e:
            getData(item['name'], 1) 
            L.log('left job count:', TimeList.length())
        # print e, t < TMSL(), datetime.fromtimestamp(t / 1000.0), datetime.now()


#----------------------------------------------------------- End ----------------------------------------------------

'''主要请求过程'''    
def requestUrl(url, param):
    res = {}    
    try:
        req = urllib2.Request(url)  
        param = urllib.urlencode(param)  
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())  
        response = opener.open(req, param, timeout = 3500)  
        rst = response.read()  
        res = json.loads(rst, encoding = "utf8")
        
    except Exception as e:
        L.error(e, param['name'])

#     print rst
    return res 


def getNewData(name):
    url = "http://47.244.4.22:8080/web/lottery/getNewData"
    param = {'lottery': name}
    res = requestUrl(url, param)
         
    return res
    
def getDataList(name):
    url = 'http://47.244.4.22:8080/web/lottery/list'
    param = {'lottery': name, 'num': 1, 'pageSize': 10}
    res = requestUrl(url, param)
    
    return res
    
if __name__ == '__main__':
    producer()
    consumer()
#     print getDataList('t1s90d')
#     print getNewData('t1s90d')
    
    
    