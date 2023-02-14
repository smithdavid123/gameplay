#coding:utf8
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from games.setting import services as Games
from libs.utils import DT2TMS, DateOffset

def queryTrend(name, query, time = ''):
    if name not in Games: return None
    db = Database()
    ps = query.split("-")
    keys = ['id', 'name', 'issue', 'openCode', 'openTime', 'clearTime']
    sql, params = "select " + ",".join(keys) + " from open_code where name = %s", None
    if len(ps) == 2: 
        sql, params =  sql + " order by openTime desc limit %s", (name, int(ps[1]))    
    else:
        if query[0] != 'd': return None
        dayTime = time
        '''老版请求格式'''
        if query != 'date':
            offset = int(query[1])
            dayTime = DateOffset(-offset)
        sql += " and dayTime = %s order by openTime desc"
        params = (name, dayTime)
    print sql, params
    lines = []
    for item in db.select(sql, params):
        line = dict((k, item[i]) for i, k in enumerate(keys))
        line["openTime"] = DT2TMS(line["openTime"])
        line["clearTime"] = line["openTime"]
        line['lottery'], line['code'] = line['name'], line['openCode']
        line["clearStatus"], line["code1"], line["code2"] = 1, None, None
        del line['name'], line['openCode']
        lines.append(line)
    
    lottery = rs.hget('games', name)
    
    return {'result': lines, 'lottery': lottery, 'notAppear': getNotAppear(name, db)}    

def getNotAppear(name, db = None):
    if not db: db = Database()
    sql = "select openCode from open_code where name = %s order by openTime desc limit 100"
    nums = {}
    idx = 0
    for (code, ) in db.select(sql, (name, )):
        for c in code.split(','):
            if c not in nums: nums[c] = idx
        idx += 1
    
    return nums
    
if __name__ == '__main__':
    print queryTrend('cqssc', 'lastest-30')
#     print queryTrend('cqssc', 'd0')
#     getNotAppear('cqssc')
    