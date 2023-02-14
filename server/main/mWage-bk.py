#coding:utf8

from libs.log import L
from libs.database import Database
from mInit import getConfig
from libs.code import BookMark
from libs.utils import TM, TMN, RandCode

def Wage(beginTime):
    wageRatio = getConfig("wageRatio")
    if wageRatio==None or wageRatio <= 0.0: 
        L.log('工资比例未设定，无法进行工资分配！')
        return
    
    db = Database()
    sqlU = '''select account, b.parents, b.point, b.parentName, b.type from game_order a join user b on \
        a.account = b.username and a.status > 0 and orderTime > %s group by account'''
    sql = '''select account, sum(money) from game_order where status > 0 and orderTime > %s group by account'''
    params = (beginTime, )
    '''获取用户关联信息'''
    relations, users = {}, {}
    for (account, parents, point, parentName, uType) in db.selectEx(sqlU, params):
        relations[account] = {
            'point': 9.9 if point > 9.9 else point,
            'parentName': parentName,
            'parents': [] if not parents else parents.split(">"),
            'type': uType
        }
        print account, relations[account]
    sumConsume = 0.0
    for (account, money) in db.select(sql, params):
        if account not in relations: continue
        for u in relations[account]['parents']:
            if u not in relations: continue
            if u not in users: users[u] = {'self': 0.0, 'sameLevel': 0.0}
            k = 'self' if relations[u]['point'] > relations[account]['point'] else 'sameLevel'
            users[u][k] += money
        sumConsume += money
        print account, money
    
    print 'User consume Summary:', users
    p, moneySum = wageRatio / 100.0 / 10.0, 0.0
    lines = []
    for u in users:
        m = relations[account]['point'] * p * users[u]['self']
        moneySum += m
        print u, ' get money: ', m
        lines.append([u, m, relations[account]['type']])    
    print sumConsume, sumConsume * wageRatio / 100.0, moneySum
    
    '''发放时间作为账单标识'''
    grantTime = TM()
    if preGrant(beginTime, grantTime, moneySum, len(lines), db) > 0: Grant(grantTime, lines, db)

'''联合唯一索引·防止重入'''
def preGrant(beginTime, grantTime, money, userCount, db=None):    
    sql = "insert into sys_log (category, runTime, lastTime, money, users) values ('wage', %s, %s, %s, %s)"
    params = (grantTime, beginTime, money, userCount)
    return db.execute(sql, params)

'''资金发放·单独执行有风险'''
'''params: grantTime, lines - [[name, money, type], ...]'''
def Grant(grantTime, lines, db=None):
    if db==None: db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks"]
    for line in lines:
        account, money, accountType = line[0], line[1], line[2]
        if money <= 0.0: continue
        
        '''用户表余额·获取并锁定余额'''
        sql, params = ("select balance from user where username = %s for update"), (account, ) 
        cnx, cursor = db.Query(sql, params)
        balance = cursor.fetchall()
        if len(balance) == 0: continue
        balance = balance[0][0]
        balanceAfter = balance + money
        
        '''账单表'''
        item = {'account': account, 'accountType': accountType, 'balanceBefore': balance, 'balanceAfter': balanceAfter, 
                'reference': grantTime, 'amount': money, 'type': '1400'}
        item['remarks'] = BookMark[item['type']]
        item['billno'] = TMN() + RandCode(8)
        
        '''核心事务处理'''
        sqlM, paramsM = ("update user set balance = %s where username = %s"), (balanceAfter, account)
        sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(['%s' for i in kBook]) + ")"), tuple([item[k] for k in kBook])
        
        flag, rst = db.Transaction([[sqlM, paramsM], [sqlB, paramsB]], cnx, cursor, False)
        L.dbLog(flag, rst)
        
    
    

if __name__ == '__main__':
    Wage('2022-02-02')
    # db = Database()
    # preGrant('2022-08-25', TM(), 100.1, 1, db)
          
          