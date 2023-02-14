#coding: utf8
import sys
reload(sys)
sys.path.append('..')
sys.setdefaultencoding('utf8') 

import ssl
ssl._create_default_https_context = ssl._create_unverified_context
import json
import urllib
import urllib2
from libs.log import L
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.utils import getIpAddr, TMN, RandCode
from libs.code import Money, Play, BookMark as BM, BookStatus as BS
from common.key import KEY
from common.balance import Balance


def weak_passwd(user):
    U = rs.hget(KEY.UserInfo, user)
    if U and U.get('defaultPasswd', 0): return True
    return False

'''账户新增款项通用流程'''
def common_book_in(account, money, refBillno, _type, db, cnx, cursor):
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", 
             "reference", "remarks", 'status', 'information']
    '''用户表余额·获取并锁定余额'''
    sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (account, )
    db.Query(sql, params, cnx, cursor)[1]
    userInfo = cursor.fetchall()
    if len(userInfo) == 0: 
        L.log("Error: user not found", account)
        return []
    accountType = userInfo[0][2] 
    bl = Balance(userInfo[0][0], userInfo[0][1])
    bl.money_add(money)
    
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': bl.balance_before, 
            'balanceAfter': bl.balance_after, 'mVirtual': money, 'reference': refBillno, 
            'amount': money, 'type': _type, 'status': BS.ORDER_OK, 'information': bl.info()}
    item['remarks'] = BM[item['type']]
    item['billno'] = TMN() + RandCode(8)
    
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(map(lambda x:'%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    
    '''余额更新'''
    sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
        (bl.virtual_after, bl.deposit_after, account)
    
    return [[sqlB, paramsB], [sqlM, paramsM]]

'''操作日志'''
def common_operate(user, table, content="", label="", field=""):
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    paramsO = (user, table, field, content, label)
    return [sqlO, paramsO]

'''
params: 若 user 为数组，返回字典
'''
def get_user_level(db = None, user = ""):
    if not db: db = Database()
    mulit = False 
    if type(user) == type([]): mulit, user = True, "', '".join(user)
    sql = "select username, IFNULL(sum(amount), 0) from book b right join user on username=account \
        and (b.type='1000' or b.type='1600') where username in ('{}') group by username".format(user)
    levels = get_level_conf()
    users = {}
    for (u, money) in db.select(sql, ()):
        users[u] = get_level_by_money(money, levels)

    return users if mulit else users[user] 

def get_level_by_money(money = 0, levels = None):
    if levels == None: levels = get_level_conf()
    level = "0"
    for p in levels:
        if money <= p[1]: break 
        level = p[0]
    return level
    
def get_level_conf():
    conf = rs.hget(KEY.Config, "userLevelConf", False)
    levels = []
    for e in conf.split("|"):
        p = e.split(":")
        try:
            levels.append([p[0], int(p[1])])
        except:
            pass
    levels.sort(key=lambda x: x[1])
    return levels

def point2level(p):
    if p > 11: return p
    return int(p * 20 + 1800)

def level2point(l):
    if l < 11: return l
    return (l - 1800) / 20.0        

'''根据IP获取地区信息'''
def getAddr(ip):
    if not ip or ip == '' or len(str(ip)) < 7: return "" 
    address = ""
    if ip != '127.0.0.1': 
        addrCache = rs.hget(KEY.IPCache, ip, False)
        if addrCache and str(addrCache) != '': 
            address = addrCache
        else:
            address = getIpAddr(ip)
            if address != '': rs.hset(KEY.IPCache, ip, address)
    return address

def setField(user, tbName, key, value, wKey, wValue, db = None):
    if not db: db = Database()
    
    sql = ("update {} set {} = %s where {} = %s".format(tbName, key, wKey))
    flag = db.execute(sql, (value, wValue))
    
    return flag

def setFieldEx(user, lines, db = None):
    if not db: db = Database()
    command = []
    for line in lines:
        tbName, key, value, wKey, wValue = line
        sql = ("update {} set {} = %s where {} = %s".format(tbName, key, wKey))
        command.append([sql, (value, wValue)])
    flag, rst = db.Transaction(command)
    
    return flag, rst


'''主要请求过程'''    
def request_url(url, param = {}):
    res = {}    
    try:
        req = urllib2.Request(url)
        param = urllib.urlencode(param)  
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())  
        opener.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36')]
        response = opener.open(req, param, timeout = 5)  
        rst = response.read()  
        res = json.loads(rst, encoding = "utf8")
        # print(rst)
    except Exception as e:
        L.error(str(e) + url)
        
    return res 

def request_url_get(url, to_json = True):
    res = {}
    try:
        opener = urllib2.build_opener()
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        response = opener.open(url, timeout = 5)
        rst = response.read()
        res = json.loads(rst, encoding = "utf8") if to_json else rst
        
    except Exception as e:
        L.error(str(e) + url)
        return None
    
    return res


if __name__ == '__main__':
#     print level2point(1998)
#     print point2level(9.7)
#     print rs.hget('games', 't1s60')
    pass
#     print sorted([int(k) for k in ['12', '23', '15']])[-1]
    import urlparse
#     R = "?" + d
#     query = urlparse.urlparse(d).query
    query = "signatureMethod=HmacSHA256&signatureVersion=1&merchantId=4493ef72abc214347143fb52d72 58aa3&timestamp=1559046373712&signature=7E8C7A788E36B57A79EE84A4FB21E6F00166BFC 198033FD4C75BA2310C3E4012&orderId=9999999&status=3&jOrderId=1234567890&notifyUrl=http s://net8.testqu.com/i1/callback/deposit&orderType=1&amount=300.00&currency=CNY&actualAmount =300.00&fee=1.00&payWay=WechatPay&payTime=1559046373712&jExtra=exampleorder"
    R =  dict([(k, v[0]) for k, v in urlparse.parse_qs(query).items()])
    print R
#     print dict([(k, v[0]) for k, v in urlparse.parse_qs(request.query).items()])
    