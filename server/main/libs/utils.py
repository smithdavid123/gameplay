#coding:utf8
import _strptime
import time
import datetime
import random
import urllib2
import json
import types
import md5
import hmac
import urllib
import hashlib   
import threading
# from pyquery import PyQuery as pq


def hmac_sha256(secret_key, content):
    signature = hmac.new(secret_key.encode('utf-8'), 
                         content.encode('utf-8'), digestmod=hashlib.sha256).hexdigest().upper()    
    return signature

def MD5_(txt):
    m1 = hashlib.md5()   
    m1.update(txt)   
    return m1.hexdigest()

def MD5(txt):
    m1 = md5.new()   
    m1.update(txt)   
    return m1.hexdigest()


'''获取当前时间字符串'''
def TM():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

'''获取当前日期字符串'''
def DT():
    return time.strftime("%Y-%m-%d", time.localtime())

'''获取当前时间小时字符串'''
def DTH():
    return time.strftime("%Y-%m-%d %H", time.localtime())


'''获取当前日期戳'''
def TMS():
    return time.time() * 1000

'''获取当前日期戳'''
def TMSL():
    return long(time.time() * 1000)

'''获取当前日期戳字符串'''
def TMSS():
    return str(long(time.time() * 1000))

'''时间字符串·纯数字'''
def TMN():
    return datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')[:-3]

'''时间转字符串时间'''
def T2S(tm):
    return time.strftime("%Y-%m-%d %H:%M:%S", tm.timetuple()) if tm else ''

'''时间戳转字符串时间'''
def TS2S(stamp):
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(stamp))

'''字符串转时间'''
def S2T(s):
    c = threading.RLock()
    with c:
        if len(s) > 19: s = s[:19]
        return time.strptime(s, "%Y-%m-%d %H:%M:%S")

'''字符串转时间'''
def S2DT(s):
    return datetime.datetime.strptime(s, "%Y-%m-%d %H:%M:%S") 

'''字符串转datetime时间'''
def S2D(s = ''):
    if s == '': return datetime.datetime.now()
    return datetime.datetime.strptime(s, "%Y-%m-%d") 
    
def DT2TMS(dt):
    if not dt: return None
    return int(time.mktime(dt.timetuple())) * 1000

def F0(n):
    n = str(int(n))
    return n if len(n) > 1 else "0" + n

def F00(n):
    n = str(int(n))
    if len(n) < 3: n = "0" + n
    return n if len(n) > 2 else "0" + n

def F000(n):
    n = str(int(n))
    for i in range(4 - len(n)): n = "0" + n
    return n

def FLOAT(n):
    if not n: return 0
    return float(n)

def CardR4(c):
    if not c: return "****"
    return c[-4:]
    
# def TJS(stamp):
#     return TS(stamp/1000)

def MU():
    return int(time.strftime("%M")) % 10

def DateOffset(n = 0, dt = ''):
    sf = '%Y%m%d' if len(dt) == 8 else '%Y-%m-%d' 
    dt = datetime.datetime.now() if dt == '' else datetime.datetime.strptime(dt, sf) 
    return str(dt + datetime.timedelta(days=n)).split(" ")[0]

'''params - seconds'''
def TimeOffset(n = 60, tm = ''):
    sf = '%Y-%m-%d %H:%M:%S' 
    tm = datetime.datetime.now() if tm == '' else datetime.datetime.strptime(tm, sf) 
    return str(tm + datetime.timedelta(seconds=n))

'''params - seconds'''
def TimeOffsetS(n = 60, tm = ''):
    sf = '%Y-%m-%d %H:%M:%S' 
    tm = datetime.datetime.now() if tm == '' else datetime.datetime.strptime(tm, sf) 
    st = (tm + datetime.timedelta(seconds=n)).strftime(sf)
    return long(time.mktime(time.strptime(st, sf)) * 1000)
    

def DiffDay(s1, s2):
    t1 = datetime.datetime.strptime(s1.split(" ")[0], "%Y-%m-%d")
    t2 = datetime.datetime.strptime(s2.split(" ")[0], "%Y-%m-%d")
    return (t2 - t1).days

'''时间差，s1比s2大的秒数'''
def DiffSecond(t1, t2 = None):
    if type(t1) == types.LongType:
        t1 = datetime.datetime.fromtimestamp(t1 / 1000.0)
    else:
        t1 = datetime.datetime.strptime(t1, "%Y-%m-%d %H:%M:%S")
        
    if t2:
        t2 = datetime.datetime.strptime(t2, "%Y-%m-%d %H:%M:%S")
    else:
        t2 = datetime.datetime.now()
    
    # return long((t2 - t1).seconds) * (1 if t2 < t1 else -1) 
    return long((t1 - t2).seconds + (t1 - t2).days * 86400) 

def NextDay(dt = None):
    if not dt: dt = DT()
    dt = datetime.datetime.strptime(dt, "%Y-%m-%d") 
    return str(dt + datetime.timedelta(days=1)).split(" ")[0]

def LastDay(dt):
    dt = datetime.datetime.strptime(dt, "%Y-%m-%d") 
    return str(dt + datetime.timedelta(days=-1)).split(" ")[0]

def pre30s(s):
    dt = datetime.datetime.strptime(s, "%Y-%m-%d %H:%M:%S") 
    return str(dt + datetime.timedelta(seconds = 30))

def after30s(s):
    dt = datetime.datetime.strptime(s, "%Y-%m-%d %H:%M:%S") 
    return str(dt + datetime.timedelta(seconds = -30))

def dayTime(s):
    return str(datetime.datetime.strptime(s[:8], "%Y%m%d")) 

def time2second(s):    
    if s == '': return 0
    ps = s.split(":")
    return int(ps[0]) * 3600 + int(ps[1]) * 60

def second2time(s):    
    if s >= 86400: s -= 86400 # 43200
    return F0(s / 3600) + ':' + F0(s % 3600 / 60) + ':' + F0(s % 3600 % 60) 
        
    
'''字符串转时间戳'''
def S2TS(s):
    timeArray = time.strptime(s, "%Y-%m-%d %H:%M:%S")
    return int(time.mktime(timeArray)) * 1000

'''字符串转时间戳'''
def S2TSL(s):
    timeArray = time.strptime(s, "%Y-%m-%d %H:%M:%S")
    return long(time.mktime(timeArray) * 1000)


def PreNow(tm):
    tn = datetime.datetime.now()
    if type(tm) != type(tn): tm = S2DT(tm)
    return tm < tn

def LaterNow(tm):
    tn = datetime.datetime.now()
    if type(tm) != type(tn): tm = S2DT(tm)
    return tm > tn

def RandCode(length = 10):
    txt = str(random.random())[2:]
    return txt[:length] if len(txt) > length else txt + str(random.random())[2:length - len(txt) + 2]

def KV2Dict(keys, values):    
    return dict((keys[i], values[i]) for i in range(len(keys)))
    
    return 

def P2C(p):
    return float(p) * 20 + 1800

def getIpAddr_taobao(ip):
    url = "http://ip.taobao.com/service/getIpInfo.php?ip=" + ip
    addr = ['', '', '']
    try:
        opener = urllib2.build_opener()
        response = opener.open(url, timeout = 3500)
        rst = response.read()
        res = json.loads(rst, encoding = "utf8")
        addr = [res['data']['country'], res['data']['region'], res['data']['city']]
        return '[' + ', '.join(addr) + ']'
    except:
        pass
    return ''

def getIpAddr_gaode(ip):
    url = "https://restapi.amap.com/v3/ip?key=f245398145c63564fc08be755022aadf&ip=" + ip
    addr = ['', '', '']
    try:
        opener = urllib2.build_opener()
        response = opener.open(url, timeout = 3500)
        rst = response.read()
        res = json.loads(rst, encoding = "utf8")
        addr = [res['province'], res['city'], res['rectangle']]
        return '[' + ', '.join(addr) + ']'
    except:
        pass
    return ''

def getIpAddr_baidu(ip):
    url = get_key_url(ip)
    try:
        opener = urllib2.build_opener()
        response = opener.open(url, timeout = 3500)
        rst = response.read()
        res = json.loads(rst, encoding = "utf8")
        return '-'.join(res['address'].split("|")[:3])
    except:
        pass
    return ''

def get_key_url(ip):
    queryStr = '/location/ip?ak=hOwhByDNiZZ0XqkNQFZGcRa2&coor=bd09ll&ip=' + ip
    encodedStr = urllib.quote(queryStr, safe="/:=&?#+!$,;'@()*[]")
    rawStr = encodedStr + 'XwlG0vbOzRq12kpNyo1uPNG1gk5Eq0Ni'
    sn= hashlib.md5(urllib.quote_plus(rawStr)).hexdigest()
    return "http://api.map.baidu.com" + queryStr + "&sn=" + sn 



def getIpAddr_138(ip):
    url = "https://www.ip138.com/iplookup.asp?action=2&ip=" + ip
    addr = ['', '', '']
    try:
        opener = urllib2.build_opener()
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        response = opener.open(url, timeout = 3)
        res = response.read()
        # doc = pq(res)
    except:
        pass
    return ''



def getIpAddr(ip):
    
    return getIpAddr_baidu(ip)


    
    
    
def test():
    return 1, 3    
    
if __name__ == '__main__':
    # https://api.map.baidu.com/location/ip?ak=hOwhByDNiZZ0XqkNQFZGcRa2&coor=bd09ll&ip=103.113.156.247
#     print get_key_url("103.113.156.247")
#     print getIpAddr("103.113.156.247")
#     print DTH()
#     print getIpAddr_gaode("103.113.156.247")
#     getIpAddr_138("103.113.156.247")
#     print TimeOffset()
#     print time.strptime("2023-05-28 23:26:39", "%Y-%m-%d %H:%M:%S")
#     print DiffSecond(1557919140000)
    pass
#     print S2TS("2022-12-29 23:35:59")
#     print APM()
#     t2 = "2022-12-30 01:54:39"
#     t = time.strptime(date_str, "%Y-%m-%d %H:%M:%S")
#     print PreNow("2023-08-12 23:40:00")
#     print type((datetime.datetime.strptime('20190302', "%Y%m%d") - \
#                 datetime.datetime.strptime('20190302', "%Y%m%d")).days) 
#     print TimeOffset(-20)[:19]
#     t1 = "2023-12-30 01:54:39"
#     print LaterNow(t1)
#     print type(1111111111111) == types.LongType
#     print RandCode(5)
# #     print time.strftime("%Y%m%d%H%M%S", time.localtime())
#     print time.time()
#     print datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')
#     print time.mktime(datetime.datetime.now().timetuple())
#     
#     print (datetime.datetime.now() - datetime.datetime.now()).seconds
#     print (datetime.datetime.now() - datetime.datetime.strptime("2023-02-23", "%Y-%m-%d")).days
#     
#     print str(random.random())
#     print DateOffset(1)
    # dt = datetime.datetime.strptime("2023-01-06", "%Y-%m-%d %H:%M:%S") 
    # return str(dt + datetime.timedelta(days=-1)).split(" ")[0]
    # print dt
#     print getIpAddr("114.114.114.112")
#     print datetime.datetime.now()
#     a = test()
#     a = b = 2
#     a = c = a - 1
#     print a, b, c
#     print "12".split()
#     print TMN()
#     print pre30s("2023-01-06 01:55:46")
#     print dayTime("201901060")
#     print 56 / 10
#     print TS(time.mktime(t2))
#     print TimeOffset(-3600, "2023-04-05 00:00:00")
    print S2T("2023-06-19 06:30:30")
    
