#coding:utf8
import sys
import code
sys.path.append('..')
reload(sys)
sys.setdefaultencoding('utf-8')

import time
from datetime import datetime
import json
import urllib
import urllib2
from libs.log import L
from libs.utils import TM, S2T, TMSL, S2TS, TS2S, S2TSL, TimeOffsetS, TimeOffset, PreNow, DiffSecond, F00, F000
from libs.redisEx2 import MyRedis as rs
from games.setting import services as S, CREATE_GAMES
from common.key import KEY
from libs.heap import Heap
from libs.timeout import Timer


import  threading   
Lock = threading.Lock()

Normals = set(["cqssc", "tjssc", "xjssc", "gd11x5", "jx11x5", "ah11x5", "sh11x5", "sd11x5", "ln11x5", "jsk3", 
        "ahk3", "hbk3", "jlk3", "fc3d", "pl3",
        "t1s600", "qq10fen", "bjpk10", "qq5fen", "bjssc", "twssc", "t6s300", "twkl8", "t1s300a", "bjkl8"
        "t1s300", "t1s60h"
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
    rs.delete(KEY.RequestJob)
    
    '''常规定期请求时间控制'''
    def addTime(args):
        global Lock
        param, seconds = args[0], args[1]
        if Lock.acquire():
            # TimeList.push(param)
            rs.zadd(KEY.RequestJob, param, param['tm'])
            Lock.release()
        
        p = {'name': param['name'], 'tm': TMSL(), 'issue': ''}
        
        Timer.setTimeout(addTime, seconds, p, seconds)
    
    '''精准时间控制，获取下次开奖时间，在该时间附近增加多次请求'''
    def addQuestTime(args):
        n = args[0]
        res = getNewData(n)
        '''若请求结果有误'''
        if not res or res == [] or 'NextOpenTime' not in res:
            '''此处第二个参数过小可能导致请求任务队列大量积压'''
            return Timer.setTimeout(addQuestTime, 60, n)
        
        '''时间合理性判断'''
        ntm, seconds = res['NextOpenTime'], [7, 12, 16, 30, 45, 70] 
        ds = DiffSecond(ntm)
        if ds < 0: ntm = TM()
        if ds < -200: seconds = [100, 200]
        
        tms = [TimeOffsetS(t, ntm) for t in seconds]
        for t in tms:
            param = {'name': n, 'tm': t, 'issue': res['Term']}
            # TimeList.push(param)
            rs.zadd(KEY.RequestJob, param, param['tm'])
            
        Timer.setTimeout(addQuestTime, tms[1], n)
        
    for n in Games:
        '''系统生成号码，不请求'''
        if n in CREATE_GAMES: continue
        game = Games[n]
        seconds = game.interval * 60 / 4 
        param = {'name': n, 'tm': TMSL(), 'issue': ''}
        addQuestTime([n])
        Timer.setTimeout(addTime, seconds, param, seconds)

#----------------------------------------------------------- Consumer ----------------------------------------------------

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

def consumer():
    if len(Games) == 0: init()   
    
    '''最终开奖信息数据格式·for getNewData'''    
    def formatDataNew(name, item):
        dt = {}
        if not item: return None
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
        
    times = 0
    while True:
        time.sleep(0.5)
        res = rs.zRangeRemByScore(KEY.RequestJob)
        for item in res:
            '''离当前较早的爬取任务直接放弃'''
            if DiffSecond(item['tm']) < -500: continue
            getData(item['name'], 1)
        
        if (times % 100) == 0: L.log('left job count:', rs.zcard(KEY.RequestJob))
        times += 1
        
        # print e, t < TMSL(), datetime.fromtimestamp(t / 1000.0), datetime.now()

#----------------------------------------------------------- End ----------------------------------------------------

'''主要请求过程'''    
def requestUrl(url, param):
    res = {}    
    try:
        req = urllib2.Request(url)
        param = urllib.urlencode(param)  
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())  
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        response = opener.open(req, param, timeout = 3.5)  
        rst = response.read()  
        res = json.loads(rst, encoding = "utf8")
        # print rst
    except Exception as e:
        L.error(e, param)

    return res 

def requestUrlGet(url, sig = False):
    res = {}
    try:
        opener = urllib2.build_opener()
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        response = opener.open(url, timeout = 3.5)
        rst = response.read()
        if sig: rst = rst.decode("utf-8-sig")
        res = json.loads(rst, encoding = "utf8")
        
    except Exception as e:
        L.error(e, url)
    
    return res
        

'''主要入口'''
def getNewData(name):
    cfg = {'qumin': 1, 'qu5fen': 5, 'qu10fen': 10}
    if name in cfg:
        return getNewData_qq(cfg[name])
    if name in set(['t1s60h', 't1s300']):
        return getNewData_henei(name)
    
    url = "http://47.90.106.14:8088/api/lottery/newDate?lottery=" + name
    res = requestUrlGet(url)
    
    return res

    
def getDataList(name):
    url = 'http://47.244.4.22:8080/web/lottery/list'
    param = {'lottery': name, 'num': 1, 'pageSize': 10}
    res = requestUrl(url, param)
    
    return res

    

def testTime():
    n = 'cqssc'
    NextOpenTime = '2023-06-30 23:43:09'
    '''时间合理性判断'''
    ntm, seconds = NextOpenTime, [7, 12, 16, 30, 45, 70] 
    ds = DiffSecond(ntm)
    print ds
    if ds < 0: ntm = TM()
    if ds < -200: seconds = [100, 200]
    
    tms = [TimeOffsetS(t, ntm) for t in seconds]
    for t in tms:
        param = {'name': n, 'tm': t}
        print TS2S(param['tm'] / 1000)


'''三个计算型彩种: 1, 5, 10'''
def getNewData_qq(minute = 1):
    method = {'1': 'qumin', '5': 'qu5fen', '10': 'qu10fen'}[str(minute)]
    url = "http://qniupin.com/api/tencent/onlineim"
    res = requestUrlGet(url)
    if type(res) != type([]) or len(res) != 10 or ('onlinenumber' not in res[0]): return None
    
    src = res[0]
    for line in res:
        m = S2T(line['onlinetime']).tm_min
        if m % minute == 0: 
            src = line
            break 
    
    Func0 = F000 if minute == 1 else F00
    tmNow = S2T(src['onlinetime'])
    openTime, nextOpenTime = src['onlinetime'], TimeOffset(60 * minute, src['onlinetime'])[:19]
    issue = time.strftime("%Y%m%d", tmNow) + '-' + Func0(int((tmNow.tm_hour * 60 + tmNow.tm_min) / minute)) 
    pre =  str(sum(int(c) for c in str(src['onlinenumber'])))[-1:]
    openCode = ','.join(list(pre + str(src['onlinenumber'])[-4:]))
    
    item = {'Term': issue, 'OpenTime': openTime, 'KaiJiHao': openCode, 'NextOpenTime': nextOpenTime,
            'LotteryText': method }
    
    return item

'''河内二彩种: 1, 5'''
def getNewData_henei(method):
    php = {'t1s60h': 'draw_ffc.php', 't1s300': 'draw.php'}[method]
    url = "http://draw.vietlotto.org/others/" + php
    src = requestUrlGet(url, True)
    if 'latest_num' not in src: return None
    
    Func0 = F000
    openTime, nextOpenTime = TM(), src['next_time']
    issue, openCode = src['latest'][:9] + Func0(int(src['latest'][9:])), src['latest_num']
    
    item = {'Term': issue, 'OpenTime': openTime, 'KaiJiHao': openCode, 'NextOpenTime': nextOpenTime,
            'LotteryText': method }
    
    return item


# -------------------------------测完删除-------------------------------------
'''最终开奖信息数据格式·for getNewData'''    
def formatDataNew(name, item):
    dt = {}
    if not item: return None
    if len(item) == 0: return None
    if item['LotteryText'] != name: return None
    
    issue, key = item['Term'], item['Term'].replace("-", "") 
    dt[key] = {'issue': issue, 'dateline': item['OpenTime'], 'number': item['KaiJiHao'], 
               'time': S2TS(item['OpenTime']) 
    }
    return dt   
    
def test(name, style):
    config = [[getDataList, formatDataList], [getNewData, formatDataNew]]
    func, fmt = config[style][0], config[style][1]  
    res = func(name)
    # print json.dumps(res, ensure_ascii=False)
    
    '''统一数据格式'''
    
    data = fmt(name, res)
    Games[name].getDataEx(data)
    Games[name].updateData()
    
    
    
if __name__ == '__main__':
#     producer()
#     consumer()
#     repaireData('t1s300a')
#     test1()
    pass
#     print getDataList('t1s90d')
#     print getNewData('t1s90d')
#     print getNewData_qq(1)
#     print getNewData_qq(5)
#     print getNewData_qq(10)
#     print test2()
#     print getNewData('t1s300')
#     a, b ='1,2,3'.split(',')
#     print a, b
#     print getNewData_henei('t1s60h')
#     print getNewData_henei('t1s300')
    init()
    test('t1s60h', 1)
    
    