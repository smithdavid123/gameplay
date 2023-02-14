#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

import time
from libs.database import Database
from libs.utils import TM, TS2S, DateOffset, TimeOffsetS, TimeOffset, DTH, DT, DiffSecond
from mUser import delAccount
from mReport import summary_report
from libs.redisEx2 import MyRedis as rs
from common.key import KEY
from mContract import DividendDay
from mSystem import draw_dividend_yesterday
import threading
from libs.log import L

LAST_REPORT_TIME = None

def check_users():
    db = Database()
    last_date = DateOffset(-15)
    print 'Lock users limit date: ', str(last_date)
    sql = 'update `user` set lockTime = %s, status = 1 where loginTime < %s and level < 1'
    flag = db.execute(sql, (TM(), last_date))
    print 'lock users:', flag
    

def clean_history():
    db = Database()
    last_date = DateOffset(-33)
    print 'Clean data limit date: ', str(last_date)
    
    tables = ['book', 'game_order', 'sys_log', 'dividend_log', 'operation', 'money_in', 'money_out', 'logs']
    for tb in tables:
        sql = "DELETE FROM {} WHERE `createTime` < %s".format(tb)
        flag = db.execute(sql, (last_date, ))
        print tb, flag
    
    '''
    启用，通过外键直接完成操作
    sql = 'update user set parentName = NNLL where parentName in (select * from (select username FROM `user` \
        where loginTime < %s and level < 1) a)'
    flag = db.execute(sql, (last_date, ))
    print 'set parent to null for children of the users deleted', flag
    '''
        
    sql = 'SELECT username FROM `user` where loginTime < %s and level < 1 '
    for (user, ) in db.select(sql, (last_date, )):
        delAccount('system', user)
    
    sql = "DELETE FROM open_code where `createTime` < %s"
    flag = db.execute(sql, (DateOffset(-62), ))
    print 'open_code', flag
    
    print 'Clean Finished!'


def DB_Relation():
    db = Database()
    tbs = [
        ['dividend_log', 'username'], ['game_order', 'account'], ['book', 'account'], ['game_chase', 'account'],
        ['money_in', 'account'], ['money_out', 'account'], ['links', 'accountId'], ['logs', 'user'],
        ['operation', 'user'], ['operation', 'username'], 
        ['relation', 'child'], ['relation', 'parent'], # , 'SET NULL'
        ['security', 'user'],
        ['user', 'parentName', 'SET NULL'] 
    ]
    
    sql_ref = "ALTER TABLE {} ADD FOREIGN KEY ({}) REFERENCES `hunan`.`user`(`username`) ON DELETE {} ON UPDATE CASCADE;"
    sql_index = "ALTER TABLE {} ADD INDEX({});"
    
    whr = "(select * from (SELECT {} FROM {} where {} not in (select username from user)) a)"
    sql_del = "delete from {} where {} in " + whr
    sql_update = "update {} set {} = NULL where {} in " + whr
    
    for item in tbs:
        tb, field = item[0], item[1]
        ref = 'CASCADE' if len(item) == 2 else item[2]
        sql1 = sql_del.format(tb, field, field, tb, field) if len(item) == 2 else sql_update.format(tb, field, field, field, tb, field)  
        sql2 = sql_index.format(tb, field)
        sql3 = sql_ref.format(tb, field, ref)
           
        print sql1
        print sql2
        print sql3
        # print db.Transaction([[sql1, []], [sql2, []], [sql3, []]])
    

'''定时58执行统计任务'''    
def summary_by_hour():
    tm = time.localtime()
    m, s = tm.tm_min, tm.tm_sec
    num = (60 - m) * 60 + 1
    if m < 3: 
        print "Summary By Hour: Run Now!"
        calc_summary()
    print 'Summary By Hour， Next Run Time： {}'.format(TS2S(TimeOffsetS(num) / 1000.0))
    time.sleep(num)

def calc_summary():
    global LAST_REPORT_TIME
    hour = TimeOffset(-3600, DTH() + ":00:00")
    if LAST_REPORT_TIME == hour: return "Nothing Done."
    
    db = Database()
    data = summary_report(True, db)
    item = {'hour': data['time'], 'balance': data['balanceAll'], 'balanceDeposit': data['balanceDeposit'], 
            'balanceThird': data['balanceThird'], 'balanceBlocked': data['blockedBalance'], 'login': data['login'], 
            'active': data['active'], 'reg': data['reg'], 'online': data['online'], 'moneyIn': data['recharge'], 
            'moneyOut': data['withdraw'], 'consume': data['consume'], 'consumeReal': data['consumeReal'], 
            'bonus': data['bonus'], 'commission': data['commission'], 'beginTime': data['bTime'], 'endTime': data['eTime']}
    keys = item.keys()
    params = [item[k] for k in keys]
    sql = "insert into summary_hours (" + ','.join(keys) + ") values (" + ','.join('%s' for k in keys) + ")"
    flag = db.execute(sql, params)
    LAST_REPORT_TIME = item['hour']
    print 'Report write to db: {}'.format(flag)
    
def run_summary():
    while True:
        try:
            calc_summary()
        except:
            print "Error when summary by hour"

def execute_dividend():
    L.sys("Step Into Dividend Testing!")
    HOUR = 2
    day = DT()
    tm = time.localtime()
    h = int(tm.tm_hour)
    status = rs.hget(KEY.RunDividendDay, day, False)
    if h == HOUR and not status:
        rs.hset(KEY.RunDividendDay, day, TM())
        '''计算'''
        L.info("Dividend {}: Step Into Analysis!".format(day))
        dd = DividendDay()
        dd.calc(1)
        L.info("Dividend {}: Analysis OK And Step Into Draw!".format(day))
        '''分发'''
        draw_dividend_yesterday()
        L.sys("Dividend {}: All Jobs Finished!".format(day))
        
    next_time = (DT() if h < HOUR else DateOffset(1) ) + " 0{}:00:00".format(HOUR) 
    num = DiffSecond(next_time)
    L.sys('Dividend， Next Run Time： {}, left seconds {}'.format(next_time, num))
    time.sleep(num)
    
    
'''定时2点执行分红任务'''    
def run_dividend_task():
    L.sys("Dividend Task Run Now!")
    while True:
        try:
            execute_dividend()
        except:
            print "Error when summary by hour"
    
    
def run():
    ThreadR = threading.Thread( None, run_summary, "Thread-Summary-Report" )
    ThreadR.start()
    ThreadD = threading.Thread( None, run_dividend_task, "Thread-Dividend-Day" )
    ThreadD.start()    
    while True:
        clean_history()
        check_users()
        time.sleep(3600 * 24)

    
    
if __name__ == '__main__':
    pass
#     run()
    run_dividend_task()
#     execute_dividend()
    
    
    # check_users()
#     clean_history()
#     print summary_report()
#     print calc_summary()
#     print calc_summary()
#     DB_Relation()
    