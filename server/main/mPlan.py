#coding: utf8
from libs.redisEx2 import MyRedis as rs
from games.setting import services as S
from mCode import getOpenTimes
import random

def getCurrentIssue(name):
    instance = S[name]['class']()
    current = instance.getOpenTime()
    return long(current['issue'].replace('-', '')) 

def checkCache(name):
    kp = 'pre' + name
    count = rs.hlen(kp)
    if count < 120: return
    
    keys = rs.hkeys(kp)
    keys.sort()
    for i in range(20): 
        rs.hdel(kp, keys[i]) 

def setPlanes(name, items):
    if name not in S: return False, '参数错误'
    currentIssue = getCurrentIssue(name)
    
    for item in items:
        issue = str(item['issue']).replace('-', '')
        if long(issue) < currentIssue: return False, '第' + item['issue'] + '期可能已结束'
        item['pass'] = 0
        rs.hset('pre' + name, issue, item)
    
    return True, 'OK'

def setPlane(name, issue, number):
    if name not in S: return False, '参数错误'
    currentIssue = getCurrentIssue(name)
    
    issue = str(issue).replace('-', '')
    print number, number == ''
    if number == '' or number == None:
        rs.hdel('pre' + name, issue)
    else: 
        if long(issue) < currentIssue: return False, '第' + issue + '期可能已结束'
        item = {'pass': 0, 'issue': issue, 'number': number}
        rs.hset('pre' + name, issue, item)
    
    if random.random() > 0.5: checkCache(name)
    return True, 'OK'
        
def getPlane(name):
    # currentIssue = getCurrentIssue(name)
    plans = getOpenTimes(name, 50)
    items = rs.hgetall('pre' + name)
    
    lines = []
    for p in plans:
        issue = str(p['issue']).replace('-', '')
        
        p['number'] = items[issue]['number'] if issue in items else ''
        
        # if long(issue) < currentIssue: continue
        lines.append(p)
        
    return lines

"""h获取一天的彩期"""
def getPlaneExt(name):
    # currentIssue = getCurrentIssue(name)
    plans = getOpenTimes(name, 100000)
    items = rs.hgetall('pre' + name)

    lines = []
    for p in plans:
        issue = str(p['issue']).replace('-', '')

        p['number'] = items[issue]['number'] if issue in items else ''

        # if long(issue) < currentIssue: continue
        lines.append(p)

    return lines

def delPlane(name, issue):
    issue = str(issue).replace('-', '')
    rs.hdel('pre' + name, issue)
    
    return True

if __name__ == '__main__':
#     setPlane('cqssc', [])
#     print rs.hlen('cqssc')
#     keys = rs.hkeys('cqssc')
#     keys.sort()
#     print keys
#     print getOpenTimes('cqssc')
    print rs.hkeys('pret1s60')
    print rs.hget('pret1s60', '201906180017')
    