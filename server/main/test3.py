#coding:utf8


# from libs.database import Database
from libs.code import BookMark
from libs.utils import TM, TMN, RandCode
# from aifc import data
from libs.database import Database

def CheckWin(content, openCode):
    ps, code = content.split(","), openCode.strip().split(",")
    flag, bit = True, 0
    for i, p in enumerate(ps):
        if p == '-': continue
        bit += 1
        fp = False
        for e in p:
            if e==code[i]: fp = True
        if not fp: flag = False
    money = [0, 9.990, 99.900, 999.000, 9999.000, 99999.000][bit]
    return flag, money

def test1():
    name = 'cqssc'
    # keys = rs.hkeys(name)
    keys = [i for i in range(10, 130)]
    data = dict((i, 'test') for i in range(0, 60))
    
    source = set(keys)
    comb = source | set(data.keys())
    target = list(comb)
    target.sort()
    
    print target
    for c in target[-119:]:
        if c not in source:
            print c
            # rs.hset(name, c, item)  
            # self.Save(item)
    
    print 'del'
    if len(target) > 119:
        for k in target[:len(target) - 119]: 
            if k in source: 
                print k
                # rs.hdel(self.name, k) 

def initBanks():
    from libs.database import Database
    import common.card as Card
    db = Database()
    keys = ["id", "name", "code", "url", "allowBindCard", "withdrawStatus", "withdrawMessage"]
    command = []
    for line in Card.getBanks():
        sqlP, paramsP = ("insert into bank (" + ','.join(keys) + ")" 
               " VALUES (" + ','.join(['%s' for i in keys]) + ")"), tuple([line[k] for k in keys])
        command.append([sqlP, paramsP])
    print db.Transaction(command)
    

def initConfig():    
    db = Database()
    keys = [['ratio', 10], ['days', 15], ['point', 1994], ['number', 15], ['consume', 200000],
            ['deficit', 100000], ['perDeficit', 10000], ['perConsume', 20000], ['activeUser', 10], 
            ['activeUserAfterIP', 8], ['perDeficit2', 10000], ['deficitUser', 10], 
            ['consumeUser', 12], ['perConsume2', 20000]
        ]
    command = []
    for k in keys:
        sql = "insert into config (name, value, category) values (%s, %s, 'dividend')"
        print sql
        command.append([sql, (k[0], k[1])])
    print db.Transaction(command)
        
def test2():
    db = Database()
    sql = "select showName from game_config"
    for item in db.select(sql, ()):
        print item[0] 

import time
class T():
    data = 1
    
def test3():
    while 1:
        time.sleep(100)
        print T.data

def test4():
    db = Database()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                "remarks"]
    
    sql = "SELECT billno, money FROM `game_order` where account='lei6888' and createTime>'2023-06-04' order by id desc"
    balance = 845.2778000000078
    command = []
    for billno, money in db.select(sql, ()):
        m = money / 21.0
        balanceAfter = balance + m
        '''账单表'''
        item = {'account': 'yujie6888', 'accountType': 1, 'balanceBefore': balance, 'balanceAfter': balanceAfter, 
                'reference': billno, 'amount': m, 'type': '1400'}
        item['remarks'] = BookMark[item['type']]
        item['billno'] = TMN() + RandCode(8)
        
        '''核心事务处理'''
        # sqlM, paramsM = ("update user set balance = %s where username = %s"), (balanceAfter, account)
        sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(['%s' for i in kBook]) + ")"), tuple([item[k] for k in kBook])
        balance = balanceAfter
        command.append([sqlB, paramsB])
        print paramsB
    print db.Transaction(command)
    print balance

def F0(n):
    n = str(int(n))
    return n if len(n) > 1 else "0" + n

def TestMoney():
    db = Database()
#     sql = "SELECT id, k.status, m.status  FROM book k join `money_out` m on m.billno=k.reference where k.status<>m.status"
#     lines = []    
#     for item in db.select(sql, ()):
#         sql = "update book set status = {} where id = {}".format(item[2], item[0])
#         print sql
#         print db.run(sql)
    
    sql = "SELECT id, m.bankCardId FROM book k join `money_out` m on m.billno=k.reference where k.bankCardId is null"
    lines = []    
    for item in db.select(sql, ()):
#         print item
        sql = "update book set bankCardId = '{}' where id = {}".format(item[1], item[0])
        
        print sql
        print db.run(sql)
    
if __name__ == '__main__':
    TestMoney()
#     print CheckWin('-,43,9,8,-', '5,3,9,8,1')
#     s = (12121, )
#     q = [1]
#     if len(q)>0 and q[0]==1:
#         print 'ok'
#     s[0] = 12
#     s.(12)
#     test1()
#     initConfig()
#     test3()
#     test4()
    pass    
#     import random
#     print random.sample([F0(n) for n in range(1, 12)], 5)
#     print random.sample([F0(n) for n in range(1, 12)], 5)
#     print random.sample([F0(n) for n in range(1, 12)], 5)
#     print random.sample([F0(n) for n in range(1, 12)], 5)
#     print random.sample([F0(n) for n in range(1, 12)], 5)
#     
#     ls = [{'field': 'a12'}, {'field': 'z5'}, {'field': 'b10'}]
#     print ls.indexof('a12')
#     c = ls[1]
#     ls[1] = ls[2]
#     ls[2] = c
#     print ls
    
