#coding:utf8

from libs.database import Database
from libs.utils import DT2TMS, TM, T2S, PreNow
from mUser import addUser
from libs.log import L
import md5


def checkUsername(username):
    db = Database()
    sql = ("select * from user where username = %s")
    dt = db.selectEx(sql, (username, ))
    
    return len(dt) == 0

def regist(username, password, registCode = "", ip=""):
    db = Database()
    errors = ['', '用户名不规范', '本用户账户异常！', '本用户类型错误', '本用户权限不足', '用户已存在']
    if registCode != "":    
        keys = ['accountId', 'type', 'expireTime', 'code', 'amount', 'point']
        sql = "select " + ','.join(keys) + " from links where code = %s for update"
        res = db.selectEx(sql, (registCode, ))
        if len(res) == 0: return 1, "邀请码无效，请联系该链接的发布者！"
        
        item = dict((k, res[0][i]) for i, k in enumerate(keys))
        if item['amount'] <= 0: return 2, "注册失败，该链接的注册名额已到上限！"
        if item['expireTime'] != None:
            if not PreNow(item['expireTime']): return 3, "注册失败，该链接已失效！"
        
        sql, params = '''update links set amount = %s where code = %s''', (item['amount'] - 1, item['code'])
        db.execute(sql, params)
    else:
        item = {'accountId': '', 'type': 0, 'point': 9.0}
        
    flag = addUser(item['accountId'], username, item['type'], item['point'], password, ip)    
    if flag != 0: return flag, errors[flag]
    
    return 0, '注册成功！'   
    
def getAccount(user, db = None):
    if not db: db = Database()
    keys = ["id", "username", "nickname", "type", "balance", "balanceDeposit", "point", "registTime", "loginTime", \
            "status", "onlineStatus", "bindStatus", "dividendStatus", "allowEqualCode", "allowWithdraw", \
            "blockedBalance", "lockTime", "dividendGroup"]
    sql = "select " + ','.join(keys) + " from user where username = %s"
    params = (user, )
    res = db.selectEx(sql, params)
    if len(res) != 1: return {}
    
    tmfs = {'registTime': 1,  'loginTime': 1, 'lockTime': 1}
    line = dict((keys[i], DT2TMS(res[0][i]) if keys[i] in tmfs else res[0][i]) for i in range(len(keys)))  
    
    return line

def com_login(user, passwd, ip, address = '', isApp = None):
    db = Database()
    sql = ("select password, status, level, nickname, point, type, allowTransfer, allowWithdraw, id, allowEqualCode \
         from user where username = %s and isDel!=1")
    params = (user, )
    print user, passwd, ip
    dt = db.selectEx(sql, params)
    L.log("user {} login from {} use {}".format(user, ip, passwd))
    rst = {'error':1, 'message':'success', 'data':{}}
    if len(dt)==0:
        rst['message'] = '用户不存在'
    elif dt[0][0]!=passwd and getMd5(dt[0][0])!=passwd:
        rst['message'] = '密码错误'
    else:
        if dt[0][1]!=0:
            rst['message'] = '用户登陆受限'
        else:
            rst['error'] = 0
            rst['data'] = {'level': dt[0][2], 'point': dt[0][4], 'type': dt[0][5], 'allowTransfer': dt[0][6],
                           'allowWithdraw': dt[0][7], 'id': dt[0][8], 'allowEqualCode': dt[0][9],
                           'nickname': dt[0][3].encode("utf8") if dt[0][3] else '未命名', 
                           'defaultPasswd': dt[0][0] == 'a123456' or dt[0][0] == '888888'   
            }
    '''End If'''
    
    '''登陆成功'''
    if rst['error'] == 0:
        client = 'app' if isApp else 'pc'
        sqlU, paramsU = ("update user set loginTime = %s, onlineStatus = %s, lastIP = %s, loginClient = %s where \
            username = %s"), (TM(), 1, ip, client, user)
        sqlL, paramsL = ("insert into logs (user, ip, address, client) values (%s, %s, %s, %s)"), \
            (user, ip, address, client)
        db.Transaction([[sqlU, paramsU], [sqlL, paramsL]])

    return rst

def loginOut(user, ip = '', address = ''):
    db = Database()
    
    sqlU, paramsU = ("update user set onlineStatus = %s where userName = %s"), (0, user)
    sqlL, paramsL = ("insert into logs (user, ip, style, createTime, address) values (%s, %s, 1, %s, %s)"), \
        (user, ip, TM(), address)
    db.Transaction([[sqlU, paramsU], [sqlL, paramsL]])

    return {}


def getMd5(st):
    m1 = md5.new()
    m1.update(st)
    return m1.hexdigest()



if __name__ == '__main__':
    getAccount("Lucy")


