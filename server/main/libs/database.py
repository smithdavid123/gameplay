#coding:utf8

import sys
sys.path.append("..")


from config import Config as cfg
import mysql.connector
from mysql.connector import pooling, Error
from DBUtils.PooledDB import PooledDB
from log import L

def GetSingleValue(sql):
    db = Database()
    for d in db.select(sql):
        return d[0]
    return None

def GetSingleLine(sql, params, db = None):
    if db == None: db = Database()
    return db.selectEx(sql, params)

        
class Database(object):
    ''' for query data in only one code '''
    initFlag = False
    objCount = 0
    dbconfig = { "host":cfg.msHost, "port":cfg.msPort, "user":cfg.msUser, "password":cfg.msPasswd, "database":cfg.msName }
    pool = None
   
    
    def __init__(self):
        self.objIndex = Database.objCount
        Database.objCount += 1
        self.lsConn = []
        self.lsCurs = []
        
    def getConnection(self):
        '''检查是否初始化'''
        if not Database.pool:
            Database.pool = PooledDB(mysql.connector, cfg.pool_size, host=cfg.msHost, port=cfg.msPort, 
                    user=cfg.msUser, passwd=cfg.msPasswd, db=cfg.msName, use_unicode=True, charset='utf8')
        cnx = None
        try:
            # cnx = self.pool.get_connection()
            cnx = Database.pool.connection()
            self.lsConn.append(cnx)
        except:
#             self.pool._remove_connections()
#             self.pool = None
#             self.pool = self.getPool()
#             cnx = self.pool.get_connection()
            L.error('pool error:' + str(len(self.lsConn)))
        return cnx
    
    def selectLine(self, sql, params):
        res = self.selectEx(sql, params)
        if not res or len(res) == 0: return None
        return res[0]
    
    def selectEx(self, sql, params, cursor=None):
        if cursor==None:
            cnx = self.getConnection()
            cursor = cnx.cursor()
        cursor.execute(sql, params)
        dt = cursor.fetchall()
        cursor.close()
        cnx.close()
        
        return dt

    def read_all(self, sql, params=None, cursor=None):
        cnx = self.getConnection()
        if cursor == None:
            cursor = cnx.cursor(cursor_class=mysql.connector.cursor.MySQLCursorDict)
        cursor.execute(sql, params)
        dt = cursor.fetchall()
        cursor.close()
        cnx.close()

        return dt

    def read_one(self, sql, params=None, cursor=None):
        cnx = self.getConnection()
        if cursor == None:
            cursor = cnx.cursor(cursor_class=mysql.connector.cursor.MySQLCursorDict)
        cursor.execute(sql, params)
        dt = cursor.fetchone()
        cursor.close()
        cnx.close()

        return dt

    def read_value(self, sql, params=None, cursor=None):
        cnx = self.getConnection()
        if cursor == None:
            cursor = cnx.cursor()
        cursor.execute(sql, params)
        dt = cursor.fetchone()
        cursor.close()
        cnx.close()

        return dt[0]

    def select(self, sql, params, cursor = None):
        # self.checkConnection()
        if cursor==None:
            cnx = self.getConnection()
            cursor = cnx.cursor()
            self.lsCurs.append(cursor)
        
        cursor.execute(sql, params)
        
        return cursor
    
    def selectData(self, sql, params, one=True):
        return self._selectDataAll(sql, params, one)
    
    def _selectDataAll(self, sql, params, one=True):
        cnx = self.getConnection()
        cursor = cnx.cursor(dictionary=True)
        self.lsCurs.append(cursor)
        
        cursor.execute(sql, params)
        dt = cursor.fetchone() if one else cursor.fetchall()
        cursor.close()
        return dt
    
    def selectPage(self, sql, params, page, size, cursor = None):
        sqlEx = "select count(*) from (" + sql + ") sc"
        if cursor==None:
            cnx = self.getConnection()
            cursor = cnx.cursor()
            self.lsCurs.append(cursor)
        cursor.execute(sqlEx, params)
        res = cursor.fetchall()
        
        sql += " limit %s, %s"
        args = list(params) + [int(page) * int(size), int(size)]
        cursor.execute(sql, tuple(args))
        # print sql, page * size, size
        
        return res[0][0], cursor

    def selectPageExt(self, sql, params, page, size, cursor=None):
        sqlEx = "select count(*) from (" + sql + ") sc"
        count = self.read_value(sqlEx,params)
        sql += " limit %s, %s"
        args = list(params) + [int(page) * int(size), int(size)]
        data = self.read_all(sql,params=args)
        return count, data
    
    def execute(self, sql, params):
        # self.checkConnection()
        cnx = self.getConnection()
        cursor = cnx.cursor()
        
        emp_no = 0
        try:
            cursor.execute(sql, params)
            emp_no = cursor.lastrowid
            cnx.commit()
        except Exception as e:
            emp_no = -1
            print "Run Error: ", sql
            print e
        '''End Try'''    
        cursor.close()
        cnx.close()
        return emp_no
    
    def run(self, sql):
        # self.checkConnection()
        cnx = self.getConnection()
        cursor = cnx.cursor()
        
        emp_no = 0
        try:
            cursor.execute(sql)
            emp_no = cursor.lastrowid
            cnx.commit()
        except Exception as e:
            emp_no = -1
            print "Run Error: ", sql
            print e
        '''End Try'''  
        cursor.close()
        cnx.close()
        return emp_no
    
    def Query(self, sql, params, cnx = None, cursor = None):
        # self.checkConnection()
        if not cnx: cnx = self.getConnection()
        if not cursor: 
            cursor = cnx.cursor()
            cursor.execute("BEGIN;")
        
        self.lsCurs.append(cursor)
        
        cursor.execute(sql, params)
        
        return cnx, cursor
    
    def begin(self):
        cnx = self.getConnection()
        cursor = cnx.cursor()
        cursor.execute("BEGIN;")
        return cnx, cursor
        
    '''似乎仅适用于原生连接'''
    def set_auto_commit(self, cnx, status):
        try:
            cnx.autocommit = True if status else False 
        except:
            print("Error when set autocommit=0")
    
    def QueryLine(self, cursor, sql, params):    
        cursor.execute(sql, params)
        res = cursor.fetchall()
        if not res or len(res) == 0: return None
        return res[0]
    
    def Transaction(self, lines, cnx = None, cursor = None, with_begin = True):
        # self.checkConnection()
        if cnx==None: cnx = self.getConnection()
        if cursor==None: 
            cursor = cnx.cursor()
            self.lsCurs.append(cursor)
        flag, lsRst = True, []
        '''开启事务'''
        if with_begin: cursor.execute("BEGIN;")
        try:
            for line in lines:
                cursor.execute(line[0], line[1])
                lsRst.append(cursor.lastrowid )
            cnx.commit()
        except Error as e:
            cnx.rollback()
            flag = False                
            print 'Error: ', e
        '''End For'''
        
        cursor.close()
        cnx.close()
        return flag, lsRst 
     
    def getKeys(self, tbName):
        return [info[0] for info in self.select("SHOW FULL COLUMNS FROM {}".format(tbName), ())]
    
#     
#     def __del__(self):  
#         print 'DB pool size:', Database.pool._cnx_queue.qsize()
#         # L.debug('--del--', self.objIndex, len(self.lsCurs), len(self.lsConn))
#         for i in range(0, len(self.lsConn)):
#             try:
#                 self.lsCurs[i].close()
#                 self.lsConn[i].close()
#                 # L.debug('close...', i)
#             except:
#                 pass
#                 # L.debug('error when __del__')
#             '''End Try'''
#         '''End For'''


def dbTest1():
    db = Database()
    for item in db.select("select id from sys_log where category='dividend'", ()):
        print '\t', item[0]
    for item in db.select("select id from sys_log where category='dividend'", ()):
        print '\t', item[0]
    for item in db.select("select id from sys_log where category='dividend'", ()):
        print '\t', item[0]
    for item in db.select("select id from sys_log where category='dividend'", ()):
        print '\t', item[0]
        

if __name__ == '__main__':
#     for i in range(3): dbTest1()
    db = Database()
#     sql = "select a.id,billno,account,accountType,type,amount,balanceBefore,balanceAfter,reference,createTime,remarks from book a where createTime BETWEEN %s and %s and account = %s order by createTime desc"
#     ps = [u'2023-05-27', u'2023-05-30', u'xiao8888']
#     for item in db.select(sql, ps):
#         print item
        
#     print Database.pool._cnx_queue.qsize()
    print db.getKeys("card")
    
#     print Database.pool._cnx_queue.qsize()
#     
#     print(sys._getframe(0).f_code.co_name)
#     print(sys._getframe(1).f_code.co_name)
#     print(sys._getframe(2).f_code.co_name)
#     p = list((2, 1))
#     print p.extend([3, 4])
#     print tuple(p)
#     for i in range(0, 15):
#         d = db.select("select * from md_person")
#         print 'pool size', Database.pool._cnx_queue.qsize()
#         d.fetchall()
#         #print '\t\t', db.lsConn[i].
#         print 'pool size', Database.pool._cnx_queue.qsize()
#         
#         print "\t","\t",i
     
        
        
    
    
    # dbTest3()
    # dbTest2()
    pass
    
