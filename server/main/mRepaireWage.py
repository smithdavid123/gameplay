#coding:utf8

from libs.log import L
from libs.database import Database
from mInit import getConfig
from libs.code import  BookMark as BM, BookStatus as BS
from libs.utils import TM, TMN, RandCode
from config import Config as C
from mWage import runWage

PassUserList = set(['wjs59888', 'ttz59888', 'ttz51888', 'ttz5118', 'xks888888', 'lszd200293', 'ying1314', 'ying8999', 'dmx333'])

# 候补程序
def addWage():
    db = Database()
    sTime = "2023-06-07 08:00:00" 
    sql = "select account, code, money, billno from game_order where status>0 and createTime>%s and \
        billno not in (select DISTINCT reference from book where createTime>%s and type='1400')"
    
    for (account, point, money, billno) in db.select(sql, (sTime, sTime)):
        try:
            runWage(account, point, money, billno)
        except:
            print 'error: ', billno, account	

'''point：0~10'''
def __runWage(user, point, money, billId = '', userPoint=None):
    L.log("wage params: ", user, point, money, billId)
    wageRatio = getConfig("wageRatio")
    maxPoint = getConfig("wageMaxPoint")
    if not maxPoint: maxPoint = C.MAX_POINT
    if wageRatio==None or wageRatio <= 0.0: 
        L.log('工资比例未设定，无法进行工资分配！')
        return
    
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                "remarks", "status"]
    commands, sumM, perL = [], 0.0, money * wageRatio / 100
    db = Database()
    '''获取用户基本信息'''
    userInfo = db.selectLine("select parents, point from user where username=%s", (user, ))
    if not userInfo: return
    parents = userInfo[0] 
    if not userPoint: userPoint = userInfo[1] 
    
    sql = "select username, point, type, balance, balanceDeposit, dividendGroup from user join relation r on r.parent = username" \
        " and type = 1 where r.child = %s order by point asc for update"
    
    '''防止传递的point为2000制'''
    if point >= 1800: point = (point - 1800.0) / 20.0
    if userPoint >= 1800: userPoint = (userPoint - 1800.0) / 20.0
    lastPoint = userPoint
    
    '''原从数据库取父级并排序的方式可能由于点位一样造成排序错乱'''
    cnx, cursor = db.Query(sql, (user, ))
    pInfos = {}
    for (account, p, accountType, balanceV, balanceD, group) in cursor:
        pInfos[account.strip()] = (account, p, accountType, balanceV, balanceD, group)
    ps = parents.split(">")
    ps.reverse()
    
    for p in ps:
        p = p.strip()
        if p not in pInfos:
            print 'ps: ', account 
            continue
        
        account, p, accountType, balanceV, balanceD, group = pInfos[p]
        if group in set(['Bttr', 'Root', 'Ttrr']): continue
        if p > maxPoint: continue
        if not p: p = 0
        diff = p - lastPoint
        m = perL if diff == 0.1 else diff * 10 * perL  
        lastPoint = p
        diff = 0 if not p else (p - point) * 10
        if group == 'Line': m = perL 
        sumM += m
        print account, p, m
        
        '''似乎没必要'''
        if m <= 0.0: continue
        balance = balanceV + balanceD
        if not balance: balance = 0.0
        balanceAfter = balance + m
        
        if account in PassUserList: continue
        '''账单表'''
        item = {'account': account, 'accountType': accountType, 'balanceBefore': balance, 'balanceAfter': balanceAfter, 
                'reference': billId, 'amount': m, 'type': '1400', 'status': BS.INIT}
        item['remarks'] = BM[item['type']]
        item['billno'] = TMN() + RandCode(8)
        
        '''核心事务处理'''
        sqlM, paramsM = ("update user set balanceDeposit = %s where username = %s"), (balanceD + m, account)
        sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(['%s' for i in kBook]) + ")"), tuple([item[k] for k in kBook])
        
        commands += [[sqlM, paramsM], [sqlB, paramsB]]
    
    sql = "insert into sys_log (category, runTime, lastTime, money, users, mark, issue) values ('wage', %s, %s, %s, %s, %s, %s)"
    params = (TM(), TM(), sumM, len(commands) / 2, str(wageRatio), billId)
    commands.append([sql, params])
    
    '''奖金调节'''
    commands += selfWage(db, cnx, cursor, user, point, perL, billId, kBook)
        
    flag, rst = db.Transaction(commands, cnx, cursor, False)
    L.dbLog(flag, rst)
    
    return flag

def selfWage(db, cnx, cursor, account, point, perL, billId, kBook):
    sql = "select point, type, balance, balanceDeposit from user where username=%s"
    cnx, cursor = db.Query(sql, (account, ), cnx, cursor)
    res = None
    for item in cursor: res = item
    if not res: return []
    selfPoint, accountType, balanceV, balanceD = res
    balance = balanceV + balanceD
    diff = selfPoint - point
    print diff
    if diff <= 0: return []
    m = perL if diff == 0.1 else diff * 10 * perL  
    balanceAfter = balance + m
    
    '''账单表'''
    item = {'account': account, 'accountType': accountType, 'balanceBefore': balance, 'balanceAfter': balanceAfter, 
            'reference': billId, 'amount': m, 'type': '1302', 'status': BS.INIT}
    item['remarks'] = BM[item['type']]
    item['billno'] = TMN() + RandCode(8)
    
    '''核心事务处理'''
    sqlM, paramsM = ("update user set balanceDeposit = %s where username = %s"), (balanceD + m, account)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
           " VALUES (" + ','.join(['%s' for i in kBook]) + ")"), tuple([item[k] for k in kBook])
    return [[sqlM, paramsM], [sqlB, paramsB]]


if __name__ == '__main__':
#     print getConfig("wageRatio")
    # Wage('2022-02-02')
    
#     runWage('asd67889', 1914, 10, '202006051054543636037272965608')

    addWage()
    
    # db = Database()
    # preGrant('2022-08-25', TM(), 100.1, 1, db)
