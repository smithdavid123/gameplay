#coding: utf8
import json
import sys
 
reload(sys) 
sys.setdefaultencoding('utf-8')

import time
from libs.utils import TMN,  RandCode
from libs.database import Database
from common.balance import Balance
import threading

'''Now Test Database Library'''
''' 结论：连接池若设定 自动提交，在初始化时操作'''

def do_some_thing():
    db = Database()
    cnx = db.get_connection()
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    
    
    account = 'test1994'
    sql = "select balance, balanceDeposit from user where username=%s for update"
    params = (account, )
    # db.set_auto_commit(cnx, 0)
    cursor = db.Query(sql, params, cnx)[1]
    res = cursor.fetchall()
    
    bl = Balance(res[0][0], res[0][1])
    money = 100
    bl.consume(money)
    
    print 'test1 setp into sleep!'
    time.sleep(5)
    
    '''账单表'''
    item = {'account': account, 'accountType': 1, 'balanceBefore': bl.balance_before, 
            'balanceAfter': bl.balance_after, 'mDeposit': bl.deposit_out, 'mVirtual': bl.virtual_out, 
            'reference': "01234567891", 'amount': money, 
            'type': '1300', 'status': 2, 'information': bl.info()}
    item['remarks'] = "测试啊"
    item['billno'] = TMN() + RandCode(8)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(map(lambda x: '%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    
    sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
            (bl.virtual_after, bl.deposit_after, account)
            
    command = [[sqlM, paramsM], [sqlB, paramsB]]
    flag, rst = db.Transaction(command, cnx, cursor, False)
    # db.set_auto_commit(cnx, 1)
    print 'test1', flag, rst
    

def do_some_thing2():
    db = Database()
    cnx = db.get_connection()
    
    kBook = ["billno", "account", "accountType", "type", "amount", "balanceBefore", "balanceAfter", "reference", 
                 "remarks", 'status', 'information']
    
    
    account = 'test1994'
    sql = "select balance, balanceDeposit from user where username=%s for update"
    params = (account, )
    # db.set_auto_commit(cnx, 0)
    cursor = db.Query(sql, params, cnx)[1]
    res = cursor.fetchall()
    
    bl = Balance(res[0][0], res[0][1])
    money = 200
    bl.consume(money)
    
    print 'test2 setp into sleep!'
    time.sleep(3)
    
    '''账单表'''
    item = {'account': account, 'accountType': 1, 'balanceBefore': bl.balance_before, 
            'balanceAfter': bl.balance_after, 'mDeposit': bl.deposit_out, 'mVirtual': bl.virtual_out, 
            'reference': "9876543210", 'amount': money, 
            'type': '1300', 'status': 2, 'information': bl.info()}
    item['remarks'] = "测试2"
    item['billno'] = TMN() + RandCode(8)
    sqlB, paramsB = ("insert into book (" + ','.join(kBook) + ")" 
               " VALUES (" + ','.join(map(lambda x: '%s', kBook)) + ")"), tuple([item[k] for k in kBook])
    
    sqlM, paramsM = ("update user set balance = %s, balanceDeposit = %s where username = %s"), \
            (bl.virtual_after, bl.deposit_after, account)
            
    command = [[sqlM, paramsM], [sqlB, paramsB]]
    flag, rst = db.Transaction(command, cnx, cursor, False)
    # db.set_auto_commit(cnx, 1)
    print 'test2', flag, rst
    
    
def testC():
    db = Database()
    keys = ['id', "account", 'content', 'method', 'code', 'billno', 'point', 'money', 'multiple', 'orderTime', 
                'bonus', 'isChase', 'model']
    sql, params = ("select " + ",".join(keys) + " from game_order"
               " where issue = %s and status = 0 and lottery = %s and code != -1"), ("20200611-0657", "qumin")
    '''个人投注信息汇总·用于通知'''
    Summary = {}
    cnx, cursor = db.Query(sql, params)
    for fs in cursor:
        line = dict((k, fs[i]) for i, k in enumerate(keys))
        print line
        continue
        account = line['account']
        '''用户表余额·获取并锁定余额'''
        sql, params = ("select balance, balanceDeposit, type from user where username = %s for update"), (account, ) 
        cnx, cursor = db.Query(sql, params, cnx, cursor)
        userInfo = cursor.fetchall()
        print userInfo 
        
    print 'Ok'
    
    
# ThreadR = threading.Thread( None, do_some_thing, "Thread-do_some_thing" )
# ThreadR.start()
# do_some_thing2()    

