#coding:utf8

from datetime import datetime
from libs.redisEx2 import MyRedis as rs
from libs.log import L
from libs.utils import TM, TMS

'''缓存'''
CacheData = {}
CacheFuncList = dict((item[0], {'args': item[1], 'seconds': item[2]}) for item in [
    ["queryBalance", ["user"], 60], ["loopGameLottery", ["lottery", "user"], 4], 
    ["loopPage", ["user"], 60],
    ["staticOpenCode", ["name"], 8], ["queryTrend", ['name', 'query'], 300], 
    ['listMoneyIn', ["name", "status"], 10]
    # ["preMoneyOut", ["user"], 120]
    # , ["staticOpenTime", ["lottery"]]
])

count = 0

def RequestCache(func, user, request, *args, **kwargs):    
    global count
    fn = func.__name__
    if fn not in CacheFuncList: 
        return func(user, *args, **kwargs)
    
    R = request.form if request.method=='POST' else request.args
    fnKey, params, seconds = fn, CacheFuncList[fn]['args'], CacheFuncList[fn]['seconds']
    for p in params: fnKey += "_" + (user if p == "user" else R.get(p, ''))
    
    count += 1
    res = None
    # print fnKey, 'entry...', count
    
    ## if fnKey not in CacheData:
    if not rs.hexists('CacheData', fnKey):
        res = func(user, *args, **kwargs)
        ## CacheData[fnKey] = {'time': datetime.now(), 'data': res}
        rs.hset('CacheData', fnKey, {'time': TMS(), 'data': res})
        # L.debug('Cache not hits', fnKey)
    else:
        ## ca = CacheData[fnKey]
        ca = rs.hget('CacheData', fnKey)
        if (TMS() - ca['time']) / 1000 < seconds: 
            # L.debug('Cache hits!', fnKey)
            count -= 1
            # print fnKey, 'out!', count
            return ca['data']  
        res = func(user, *args, **kwargs)
        rs.hset('CacheData', fnKey, {'time': TMS(), 'data': res})
        ## CacheData[fnKey]['time'] = datetime.now()
        ## CacheData[fnKey]['data'] = res
        # L.debug('Cache timeout with', fnKey)
    
    count -= 1
    # print fnKey, 'out!', count
    ## return CacheData[fnKey]['data']
    return res
               



if __name__ == '__main__':
    rs.delete("CacheData")
    print rs.hvals("CacheData")
    print long(TMS())
#     print 