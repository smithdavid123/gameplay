#coding: utf8
import sys
sys.path.append('../')

import time
from games.base import Lottery
from games.setting import services as S
from libs.redisEx2 import MyRedis as rs
from libs.database import Database
from common.key import KEY
from crawler.b1cp import B1CP
from libs.utils import TM
from mOrder import systemCancelOrder

Games = {}
SOURCE = {'b1cp': B1CP}

def init():
    for item in S.values():
        game = item['class']()
        Games[item['name']] = game
    '''End For'''

'''
    函数说明：缺失开奖记录彩种追爬程序，默认追爬近100期
    若爬虫中断过，部分期数开奖号码可能缺失，运行此程序针对缺失的彩种进行追爬
    多个彩种记录缺失可在此函数内顺序添加即可
    注：彩种对应英文名可参考 main/games/setting.py
'''
def repaireOpenCode():
    repaireData("qqmin")    # 腾讯分分彩
    repaireData("t1s60a")   # 幸运分分彩
    repaireData("t1s300a")  # 幸运五分彩


'''****数据爬取后补程序  · 全天****'''
def repaireDataDay():
    init()
    db = Database()
    whr = " where status=0 and createTime > '2023-06-05'"
    sql = "SELECT lottery, issue, count(*) FROM `game_order` " + whr + " group by lottery, issue"
    dts = {}
    for (name, issue, ct) in db.select(sql, ()):
        if name not in dts: dts[name] = {}
        dts[name][issue] = 1
    
    for name in dts:
        if name != 'qumin': continue
        gm = Games[name]
        print "request day: lottery: {}".format(name), dts[name]
        data = {}
        '''统一Api方式'''
        apiKey = KEY.ApiGames if name != 'qumin' else KEY.ApiGamesEx
        apiSrc = rs.hget(apiKey, name, False)
        '''自营'''
        if not apiSrc or apiSrc not in SOURCE: 
            print 'system game: ', name
            for k in dts[name]:
                gm.createData()
                data[k] = gm.data.values()[0]
                data[k]['issue'] = k
        else:
            apiUrl = rs.hget(apiKey, name + "_url", False)
            if not apiUrl: continue
            apiUrl = apiUrl.replace('limit=5', 'limit=20')
            apiUrl += "&date=20200605"
            data = SOURCE[apiSrc](gm, apiUrl).request_api()
        if not data or len(data) == 0: continue
        print data
        for k in data:
            issue = data[k]['issue']
            if issue not in dts[name]: continue
            print 'line: ', data[k]
            gm.Save(data[k])
        
        time.sleep(20)

    return

    
def repaireDataNow():
    init()
    db = Database()
    sql = "SELECT lottery, issue, count(*) FROM `game_order` where status=0 group by lottery, issue"
    for (name, issue, ct) in db.select(sql, ()):
        print "request: lottery: {}, issue: {}".format(name, issue)
        
        '''统一Api方式'''
        apiSrc = rs.hget(KEY.ApiGames, name, False)
        if not apiSrc or apiSrc not in SOURCE: continue
        apiUrl = rs.hget(KEY.ApiGames, name + "_url", False)
        if not apiUrl: continue
        apiUrl = apiUrl.replace('limit=5', 'limit=20')
        
        data = SOURCE[apiSrc](Games[name], apiUrl).request_api()
        for k in data: Games[name].Save(data[k])
        time.sleep(1)

    return     


def change_error_order(lottery='', issue=''):
    Games = {}
    for item in S.values(): Games[item['name']] = item['class']()
    for g in Games:
        print Games[g].openMode
        
    return
    gm = Games['t6s300'] 
    item = {'issue':'20200605-039', 'dateline': TM(), 'number':'08,06,01,04,05,02,10,03,09,07'}
    print gm.Open(item)
    
def cancel_order_all():
    db = Database()
    sql = "select account, billno from game_order where status=0 and createTime between %s and %s"
    for (account, billno) in db.select(sql, ('2023-06-27 15:00:00', '2023-06-28 02:00:00')):
        print account, billno
        # systemCancelOrder('sys', account, billno)
        

'''
    函数说明：手动开所有未开记录
    未开奖记录可使用如下sql语句查询：
        SELECT * FROM 'game_order' where status=0
'''
def openAll():
    Lottery.OpenAll()
    
    
if __name__ == '__main__':
#     repaireData()
    repaireDataDay()
#     openAll()
#     change_error_order()
    

