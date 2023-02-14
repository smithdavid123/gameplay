#coding: utf8
import sys
reload(sys)
sys.setdefaultencoding('utf8')

import threading
import urllib2
import time
import json
from libs.database import Database 

import csv

def test():
    db = Database()
    with open('pw.csv', "w", ) as f:
        writer = csv.writer(f)
        sql = "select username, password from user"
        for (user, passwd) in db.select(sql, ()):
            writer.writerow([user, passwd])
        f.close()

def test2():
    pass

test2()


# 
# def authRequired(level):
#     def wrapper(func):
#         def inner_wrapper(*args, **kwargs):
#             
#             return func(*args, **kwargs)
#         return inner_wrapper
#     return wrapper
# 
# @authRequired(level='INFO')
# def say(something):
#     print "say {}!".format(something)
# 
# @authRequired(level='DEBUG')
# def do(something):
#     print "do {}...".format(something)
# 
# 
# def func(num):
#     for i in range(5):
#         URL = "http://localhost:7999/init?user=user" + str(num) + "_i" + str(i)
#         opener = urllib2.build_opener()
#         response = opener.open(URL, timeout = 3500)
#         rst = response.read()
#         dt = json.loads(rst[1: -1], encoding = "utf8")
#         print "user" + str(num) + "_i" + str(i) + "," +  dt['data']['u']
#     
# def testRequest(count = 2):
#     for i in range(count):
#         ThreadW = threading.Thread( None, func, "Thread-Worker" + str(i), (i,))
#         ThreadW.start()
#         time.sleep(0.001)
#         
# def test(post):
#     s2 = post[1]
#     s1 = id(post[0])
#     s1 = 13
#     post[1] = 34
# 
# def logFile(s):
#     f = open('log-print.txt', 'a')
#     f.write('\n' + s)
#     f.close()
#     
# if __name__ == '__main__':
#     cache = set()
#     a = {'2': 1, '1': 2, '3': 4}
#     b = {'1': 2, '2': 1, '3': 4}
#     import json
#     print json.dumps(b).encode('utf8') == json.dumps(b).encode('utf8')
#     
#     logFile("Hello")
#     logFile("Hello2")
#     say('hello')
#     do("my work")
#     func()
#     testRequest(50)
#     func(1)
#     print list(set([1, 2, 3, 6, 3]))
#     import re
#     pattern = re.compile('^[0-9]{3}')
#     match = pattern.match("1282")
# 
#     print match
#     ary = [1, 4]
#     test(ary)
#     print ary