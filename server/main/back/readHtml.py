#coding:utf8
'''
Created on 2018��4��29��

@author: liuna
'''
from pyquery import PyQuery as PQ
import urlparse
import time
import datetime

def getUrlParams(url):
    params = urlparse.parse_qs(urlparse.urlparse(url).query)
    return dict((k, params[k][0]) for k in params)


def getUserPeriod(html):
    dts = {}
    lis = PQ(html)("ul.buyItem>li.buyList").items()
    for li in lis:
        line = { 'winTime':None, 'winNumber':None }
        status = li('div.buyList-w-left>p.bl-w-l-txt').text().encode('utf8')
        content = li("a.buyList-w-right")
        params = getUrlParams(content.attr('href'))
        
        line['status'] = status
        line['id'], line['userId'] = params['id'], params['userId']
        line['goodName'] = content('h3').eq(0).text()
        
        '''[ 等待开战, 恭喜获胜, 已失败 ]'''
        ps = content('div.widw>p') if status=="恭喜获胜" else content('p')
        tmElement = ps.eq(2)    # 第3个p标签
        numElement = ps.eq(3)   # 第4个p标签
        
        line['name'] = ps.eq(0)('span').eq(0).text().strip()
        line['time'] = tmElement.html().encode('utf8').split('：')[1].strip()
        line['number'] = numElement('span').eq(0).text()
        line['count'] = numElement('span').eq(2).text()
        line['pid'] = getPeriodID(line['time'])
         
        if status!="等待开战":
            line['winTime'] = ps.eq(4).html().encode('utf8').split('：')[1]
            line['winNumber'] = ps.eq(5)('span').text()
        
        key = line['time'] # line['pid'] + 
        if key in dts:
            print 'Error: period and time could not be the single key'
            return None
        dts[key] = line
    '''End For'''
        
    return dts
'''End Def'''        

def f0(n): 
    return str(n) if n>9 else '0' + str(n) 

'''
 input - 2022-05-03 00:02:00
 test - 10:00:00 10:00:01 10:10:00 10:10:01
 output - 05030005
'''
def getPeriodID(tm):
    t = datetime.datetime.strptime(tm.strip(), "%Y-%m-%d %H:%M:%S")
    interval = 10 if t.hour>=10 and t.hour<22 else 5
    '''
    if t.tm_hour>=10 and t.tm_hour<22:
        h, m = t.tm_hour, (t.tm_min / 10 + 1)
        if (t.tm_min % 10 + t.tm_sec)==0: m-=1 
        if m>5: h, m = h + 1, 0
        return md + f0(h) + f0(m * 10)
    '''
    h, m = t.hour, (t.minute / interval + 1)
    if (t.minute % interval + t.second)==0: m-=1 
    if m > (60 / interval - 1): h, m = h + 1, 0
    if h==24: h, t = 0, t + datetime.timedelta(days=1)
    return f0(t.month) + f0(t.day) + f0(h) + f0(m * interval)
    
'''判断是否是最后35秒'''    
def isPeriodTail(tm=''):
    t = datetime.datetime.strptime(tm.strip(), "%Y-%m-%d %H:%M:%S") if tm!='' else datetime.datetime.now()
    interval = 10 if t.hour>=10 and t.hour<22 else 5
    if (t.minute % interval)==(interval - 1) and t.second >24: return True
    return False 
    

'''未使用'''
# 获取当期ID
def _getPeriodID(html):
    jq = PQ(html)
    d = jq("ul.buyItem>li.buyList").eq(0)
    url = d("div.buyList-w>a").attr('href')
    # "/account/record/detail?id=7129476&userId=195344&srcFrom=SRDB-0395-000"
    pid = getUrlParams(url)['id']
    return pid
    
    
if __name__ == '__main__':
#     getPeriodID('')
    pass
    print getPeriodID("2022-05-03 15:19:40")
#     print isPeriodTail("2022-05-03 12:14:30")
    
#     import datetime
#     d1 = datetime.datetime.now()
#     d3 = d1 + datetime.timedelta(days=-1)
#     print d3.ctime()
#     print d1
#     print type(datetime.datetime.strptime("2022-05-03 15:19:40", "%Y-%m-%d %H:%M:%S"))
#     print d1.hour, d1.minute, d1.second
    
    
    