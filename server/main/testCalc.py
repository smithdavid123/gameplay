#coding: utf8

from libs.database import Database
from libs.code import BookMark as B 
import math

def test():
    db = Database()
    sql = "select DISTINCT account from book where (type='1400' or type='1302') and createTime>'2023-05-28'"
    users = {}
    for (u, ) in db.select(sql, ()):
        lines, i = [], 0
        last, abnormal = None, 0.0 
        sql = "select amount, balanceBefore, balanceAfter, createTime, b.type, markPerson from book b join user u \
            on u.username=b.account where account=%s and createTime>'2023-05-28' order by createTime"
        for (amount, m1, m2, createTime, tp, mark) in db.select(sql, (u, )):
            i += 1
#             print '\t', amount, m1, m2, createTime
            lines.append(",".join(str(e) for e in [i, amount, B[tp], m1, m2, createTime]))
            if last == None: 
                last = m2 
                continue
            if math.fabs(last - m1) > 0.01:
                users[u] = {'mark': mark, 'lines': lines}
                abnormal += 1
                lines.append(",".join(str(e) for e in [i, 'Error', m1 - last, last, m1, m2]))
#                 print '\t', 'error: ', last, m1, m2, createTime
                if m1 < last: print '--------', u, m1 - last  
            last = m2 
    
    print '-------------Abnormal List'
    for u in users:
        print u
        for line in users['lines']: 
            print line
         
#     command = []
#     for u in users:
#         sql = "update user set markPerson=%s where username=%s"
#         command.append([sql, [users[u] + ":Error"], u])
        # print u, users[u]
#     db.Transaction(command)
#     sql = "update "
    
if __name__ == '__main__':
    test()
    
    
    