#coding: utf8
import json
import sys
 
reload(sys) 
sys.setdefaultencoding('utf-8')

import time

print str(100).find(".") == -1
    
# 
# def addBonus():
#     db = Database()
#     config = {}
#     sql = "select type, methodName, bonus from game_method"
#     for (type, methodName, bonus) in db.select(sql, ()):
#         config[methodName] = bonus
#     
#     sql = "select type, method, bonus from game_method_limit"
#     for (type, method, bonus) in db.select(sql, ()):
# #         print method, bonus
#         sql = "update game_method_limit set bonus={} where method='{}'".format(config[method], method)
#         print sql
# 
# def test_callback():
#     url = "http://localhost:8007/moneyNotice"
#     url = "http://d.xinyong002.com/moneyNotice"
#     adata = {
# #             "tk": "eyJhbGciOiJIUzI1NiIsImV4cCI6MTU4NTQyMDIwNywiaWF0IjoxNTg1NDEzMDA3fQ.eyJzY29wZSI6IjEiLCJ1c2VyIjoidGVzdDAwMiIsImxldmVsIjowfQ.MBQGB9nxq_VfsurOistuF6fSmHEUzUp7H0qfpJvHoHQ", 
# #             "lc": "7178789754736588732",
#             "billno": 'sasn21212312312wedwsdw2eed3d3d3e3',
#             'username': 123
#     }
#     headers = {'Content-Type': 'application/json'}
#     response = requests.post(url, headers=headers, data = json.dumps(adata))
#     
#     print response.text
# 
# # test_callback()
#     
# def test_interface():
#     url = "http://localhost:8007/order/append/list"
#     adata = {"tk": "eyJhbGciOiJIUzI1NiIsImV4cCI6MTU4NTQyMDIwNywiaWF0IjoxNTg1NDEzMDA3fQ.eyJzY29wZSI6IjEiLCJ1c2VyIjoidGVzdDAwMiIsImxldmVsIjowfQ.MBQGB9nxq_VfsurOistuF6fSmHEUzUp7H0qfpJvHoHQ", 
#              "lc": "7178789754736588732",
#              "pageNumber": 1
#     }
#     headers = {'Content-Type': 'application/json'}
#     response = requests.post(url, headers=headers, data = json.dumps(adata))
#     print response.text
# 
# # test_interface()
# 
# 
# def addRegIP():
#     db = Database()
#     sql = "select DISTINCT user u, createTime, ip from logs l right join ( \
#             select user u, min(createTime) tm from logs group by user) a on a.u=user and l.createTime=a.tm"
#     command = [] 
#     for (u, c, ip) in db.select(sql, ()):
#         sql = "update user set regIp=%s where username=%s"
#         command.append([sql, [ip, u]])
#     print 'write'
#     db.Transaction(command)
#     
#     
# # addRegIP()    
# # addBonus()
# 
# def remove_repeat():
#     db = Database()
#     command = []    
# #     sql = "SELECT id, account, amount, balanceAfter FROM `book` where type='1900' order by account, createTime"
# #     idx = 0
# #     users = {}
# #     for id_, u, a, b in db.select(sql, ()):
# #         sql = "select balance from user where username=%s" #  for update
# #         balance = db.selectEx(sql, (u, ))[0][0]
# #         if (idx % 2) == 0:
# #             users[u] = b
# #         else: 
# #             if users[u] == balance - a:
# #                 command.append(["delete from book where id = %s", (id_, )])
# #                 command.append(["update user set balance=%s where username = %s", (users[u], u)])
# #             else:
# #                 print u, a, b, balance, b == balance, users[u] == balance - a
# #         idx += 1
#     sql = "SELECT username FROM `dividend_log` where status=1"
#     for (u, ) in db.select(sql, ()):
#         sql = "select b.id, b.type, amount, balanceDeposit, balanceBefore, balanceAfter from book b join user u on u.username=b.account where \
#             account=%s order by b.id desc limit 2"
#         idx = 0
#         line = None
#         for (id_, tp, amount, bD, bB, bA) in db.select(sql, (u, )):
#             if idx == 0: 
#                 line = [id_, tp, amount, bD, bB, bA] 
#                 if str(tp) != '1900':
#                     print 'Error:', u, id_, tp, amount, bD, bB, bA
#                     break
#             else:
#                 bm = bA - bD
#                 bm = '%.3f' % bm
#                 bam = '%.3f' % line[4]
#                 if bm == '-0.000': bm = '0.000'
#                 if bam == '-0.000': bam = '0.000'
#                 command.append(["delete from book where id = %s", (line[0], )])
#                 command.append(["update user set balance=%s where username = %s", (bm, u)])
# #                 print '\t', bm, bam, bm == bam, 
#             idx += 1     
# #             print u, id_, tp, amount, bD, bB, bA
#         
#     db.Transaction(command)
# # remove_repeat()



