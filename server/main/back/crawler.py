#coding:utf8
'''
Created on 2018年4月29日

@author: liuna
'''
import time
import urllib
import urllib2
import cookielib
import urlparse
import json
import readHtml as rh
from redisEx2 import MyRedis as rs
import threading
from config import Config as C
from socketIO_client import SocketIO, LoggingNamespace  
from log import L
import common as com

class T(): 
    def isAlive(self): return False
    
thread1 = T()
thread2 = T()    
timeLastStart = time.time()     
client = None
serverModel = False


def Conn():
    global client
    try:
        L.sys('connect to core server...')
        client = SocketIO(C.socketHost, C.socketPort, LoggingNamespace, False) 
        L.sys( 'connect to core server successfully!' )
    except:
        L.sys('Cannot connect to the core Server!')
    '''End try'''
def sendAliveMessage(index=0):
    global client
    params = [['crawlerAlive', 'crawler'], ['workerAlive', 'worker']][index]
    if serverModel and client: client.emit(params[0], {'name':params[1], 'id':10086})
    
    
'''主动发送数据·仅限最新一期数据'''
def updateData(*data):
    if serverModel: client.emit('updateData', data)
'''主动发送数据·最新期号'''    
def updatePeriodNewest(pid):
    global client
    if serverModel: client.emit('updatePeriodNewest', pid)    
    
    

'''------------------------------Class-------------------------------------'''
class DataCollect():
    maxPeriod = 0
    stopCrawler = False
    stopWorker = False
    lastTime = { 'crawler': time.time(), 'worker': time.time() }
    
    
    '''模拟登陆·数据采集准备'''
    @staticmethod          
    def checkTime(index):
        key = ['crawler', 'worker'][index]
        if (time.time() - DataCollect.lastTime[key]) > 3600: 
            L.sys( key + ' should be restart' )
            DataCollect.lastTime[key] = time.time()
            return True
        return False
    
    '''模拟登陆·数据采集准备'''
    @staticmethod          
    def preRequest():
        opener = None
        while not DataCollect.stopCrawler:
            try:
                opener = DataCollect.getRequestOpener()
                break
            except:
                L.sys('open error in preRequest, retry...')
                time.sleep(2)
        '''End while'''
        return opener
        
    '''模拟登陆·数据采集准备'''
    @staticmethod          
    def getRequestOpener():
        urlIndex = "http://www.songshufushi.cn/srdb_index/index?srcFrom=SRDB-0395-000"
        userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.691.400 QQBrowser/9.0.2524.400"
        
        '''第一次请求·获取cookie及参数code, Referer '''
        cookie = cookielib.CookieJar()
        handler = urllib2.HTTPCookieProcessor(cookie)
        opener = urllib2.build_opener(handler)
        opener.addheaders = [('User-agent', userAgent)]
        response = opener.open(urlIndex, timeout = 3500)
        # 分析响应消息
        urlRes = urllib2.unquote(response.geturl())
        urlRef = urlRes.split('redirect_uri=')[1];
        params = urlparse.parse_qs(urlparse.urlparse(urlRes).query)
        flag = params['flag'][0]
        urlReal = urlIndex + "&selfOpenId=oJSXAwL4JSNTyZAKQ_8ZHW94WdWM&code=" + flag;
        
        '''第二次请求'''
        opener.addheaders.append(("Referer", urlRef))
        response = opener.open(urlReal, timeout = 3500)
        # print response.read()
        
        '''第三次请求'''
        urlDetail = "http://www.songshufushi.cn/srdb_good/newDetail?srcFrom=SRDB-0395-000";
        
        '''
        opener.addheaders[1] = ('Referer', urlIndex)
        response = opener.open(urlDetail, timeout = 3500)
        print response.read()
        '''
        
        '''核心数据请求准备'''
        opener.addheaders[1] = ('Referer', urlDetail)
        opener.addheaders.append(('Content-Type', "application/json"));
        return opener
    
    '''用户详情专用头'''
    @staticmethod       
    def getRecordOpener():
        opener = DataCollect.preRequest()
        urlJoin = "http://www.songshufushi.cn/srdb_index/joinListNew"
        values = {'srcFrom': 'SRDB-0395-000'}
        opener.open(urlJoin, urllib.urlencode(values), timeout = 3500)
        return opener
        
    '''请求用户购买列表·具体事务'''
    @staticmethod       
    def RequestList(opener):
        urlJoin = "http://www.songshufushi.cn/srdb_index/joinListNew"
        values = {'srcFrom': 'SRDB-0395-000'}
        while 1:
            if DataCollect.stopCrawler: return {}
            try:
                response = opener.open(urlJoin, urllib.urlencode(values), timeout = 3500)
                res = response.read()
                break
            except:
                L.sys('open error in RequestList, retry...')
                opener = DataCollect.preRequest()
        '''End while'''
        dataList = json.loads(res)['data']
        L.debug("read new join list length is {} ".format(len(dataList)))
        return dataList
    
    
    '''★★★★生产者：新加入用户列表'''
    @staticmethod    
    def getDataJoin():
        opener = DataCollect.preRequest()
        while not DataCollect.stopCrawler:
            '''check login'''
            if DataCollect.checkTime(0): opener = DataCollect.preRequest()
            joinList = DataCollect.RequestList(opener)
            for item in joinList:
                userId = str(item['userId'])
                key = userId + "_" + str(item['createTime'])
                ip = item['ip'].strip().split(']')[1]
                rs.hset('ips', userId, ip)
                
                if not rs.hexists('users', userId): 
                    newUser = { 'userId':item['userId'], 'userName':item['nickname'],
                        'time':com.TJS(item['createTime']), 'ip':ip }
                    rs.hset('users', userId, newUser)
                    com.addUser(newUser)
                    '''find new special user'''
                    if rs.hexists('ipsEx', ip) and not rs.hexists('specialUsers', userId): 
                        rs.hset('specialUsers', userId, 1)
                '''End if'''
                if not rs.hexists('joinList', key): 
                    L.log(key)
                    rs.hset('joinList', key, userId)    
                    rs.hset('readyList', key, userId)
                '''End If'''
            '''End for'''
            '''Send message for alive'''
            sendAliveMessage()
            L.cout('sleep {} seconds in get new joinList'.format(C.waitTimeJoin))
            time.sleep(C.waitTimeJoin)
        '''End While'''
        L.sys( 'Thread Crawler will stop...' )
    '''End def'''
        
    
    '''请求详细用户数据·具体事务'''
    @staticmethod          
    def RequestRecord(opener, listKey = "readyList"):  
        urlRecord = "http://www.songshufushi.cn/account/record"  
        readyList = rs.hkeys(listKey)
        L.debug('the join list length is {}'.format( len(readyList) ))
        for key in readyList:
            joinTime = key.split('_')[1]
            userId = str(rs.hget('readyList', key))
            urlUser = urlRecord + "?userId="+ userId +"&srcFrom=SRDB-0395-000"
            while 1:
                if DataCollect.stopWorker: return
                try:
                    response = opener.open(urlUser, timeout = 3500)
                    break
                except:
                    L.cout('open error in RequestRecord, retry...')
                    time.sleep(1)
                    opener = DataCollect.getRecordOpener()
                '''End try'''
            '''End while'''
            html = response.read()
            line = rh.getUserPeriod(html)
            if line!=None and len(line.keys())>0:
                rs.hdel(listKey, key)
                
                flag = combineData(line, joinTime)
                if not flag: L.cout('join time not in user records!' + userId)
            '''End if'''
            time.sleep(1)
        '''End For'''
        return
    
    '''重点监控对象'''
    @staticmethod
    def addReadyList():
        if not rh.isPeriodTail(): return
        users = rs.hkeys('specialUsers')
        for userId in users:
            key = userId + "_" + '1525616698000'
            rs.hset('readyList', key, userId)
        
    '''★★★★主要数据处理模块'''
    @staticmethod
    def getDataRecord():
        opener = DataCollect.preRequest()  
        while not DataCollect.stopWorker:
            '''check login'''
            if DataCollect.checkTime(1): opener = DataCollect.getRecordOpener()
            
            DataCollect.RequestRecord(opener)
            
            DataCollect.addReadyList()
            
            sendAliveMessage(1)
            
            L.cout( 'sleep {} seconds in getDataRecord...'.format(C.waitTimeRecord) )
            time.sleep(C.waitTimeRecord)
        L.sys( 'Thread Worker will stop...' )
        
'''End Class'''
'''------------------------------------------------------------------------------'''   


'''数据过滤整合'''
def combineData(line, srcTime):
    flag = False
    srcTM = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(long(srcTime)/1000))
    for tm in line:
        if tm==srcTM: flag = True
        pid, userId = line[tm]['pid'], line[tm]['userId']
        line[tm]['ip'] = rs.hget('ips', userId, False)
        # 发现新的一期
        if pid > DataCollect.maxPeriod:
            DataCollect.maxPeriod = pid
            updatePeriodNewest(pid)
        pKey = 'p_' + pid
        
        if not rs.hexists('period', pid): rs.hset('period', pid, pKey)
        if not rs.hexists(pKey, userId): rs.hset(pKey, userId, {})
        userData = rs.hget(pKey, userId)
        L.log( pid, tm, userId )
        if tm in userData: 
            ''' 是否可以直接 return flag #项目已结束，暂不调试优化 '''
            continue
        if pid==DataCollect.maxPeriod:
            updateData(line[tm])
        
        userData[tm] = line[tm]
        rs.hset(pKey, userId, userData)
        
    return flag    
    
    
def getPeriodList():
    keys = rs.hkeys('period')
    keys.sort(reverse=True)
    limit = 20 if len(keys)>20 else len(keys) 
    return keys[0:limit]

def getPeriodData(pid):
    return rs.hgetall('p_' + pid)
    

def init(model = 'normal'):
    if model=='fast': return
    '''重点监控IP列表'''
    rs.delete('ipsEx')
    ips, ipCache = com.getIPList('admin', 'add'), {} 
    for item in ips: 
        rs.hset('ipsEx', item[0], 1)
        ipCache[item[0]] = 1
        
    '''用户信息'''
    rs.delete('users')
    users = com.getUserList()
    for (uid, name, ip, tm) in users:
        newUser = { 'userId':uid, 'userName':name, 'time':com.TF(tm), 'ip':ip }
        rs.hset('users', uid, newUser)
        if ip in ipCache: rs.hset('specialUsers', uid, 1)
        
    '''重点监控用户'''
    
    
def Start(model = 'normal'):
    init(model)
    
    DataCollect.stopCrawler = False
    DataCollect.stopWorker = False
    global thread1, thread2, timeLastStart
    thread1 = threading.Thread( None, DataCollect.getDataJoin, "Thread-1" )
    thread2 = threading.Thread( None, DataCollect.getDataRecord, "Thread-2" )

    # thread1.setDaemon(True)
    # thread2.setDaemon(True)

    thread1.start()
    thread2.start()
    
    timeLastStart = time.time()
    L.sys( 'crawler start on time' )
    
def ConnectServer():
    global serverModel
    serverModel = True
    time.sleep(2)
    Conn()
        
def Run(_serverModel = False):
    ConnectServer()
    Start()

def Stop():
    global thread1, thread2
    DataCollect.stopCrawler = True
    DataCollect.stopWorker = True
    while thread1.isAlive() and thread2.isAlive(): 
        L.cout( thread1.isAlive(), thread2.isAlive() )
        time.sleep(1)
    
    L.sys( 'Crawler and Worker stop on time' )
    return True
      
def reStart():
    global timeLastStart
    if (time.time() - timeLastStart) < 12: 
        info = "sorry, retry after several seconds!"
        L.sys(info)
        return info
    '''End if'''
    Stop()
    Run()    

    return "The restart command successfully!"
    


if __name__ == '__main__':
    
    Start()
