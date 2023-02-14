#coding: utf8
'''
-----------------------------------------------------------
User
Date:       2019年8月29日
-----------------------------------------------------------
'''
import sys
sys.path.append('..')
from libs.log import L
from libs.utils import TM, F0, F00, F000
from common.tools import request_url_get
from common.open_code import Code, ISSUE_DATE_LENGTH
import urllib

'''
0: "1680100.com"
1: "1680101kai.co"
2: "1680102kai.co"
3: "1680103kai.co"
4: "1680104kai.co"
5: "1680105kai.co"
6: "1683990.com"
7: "1685080.com"
8: "1685110.com"
9: "1685150.com"
10: "1685180.com"
11: "1685200.com"
12: "1685220.com"
13: "1685250.com"
14: "1685280.com"
15: "1685300.com"
'''

'''kjh.55128.cn'''
class PkKai():
    def __init__(self, name, type_ = 1, url = "", time_mode = 1):
        self.name = name
        self.parent = name
        self.key = name
        self.bits = 3
        self.type = type_
        self.time_mode = time_mode
        self.base_url = "https://api.api861861.com"
        self.url = url if url != '' else "/pks/getPksDoubleCount.do?date=&lotCode="
        
    
    def issue_lack(self, item):
        return len(item.issue) < (ISSUE_DATE_LENGTH + self.bits)
        
    def format(self, item):
        if self.time_mode == 1:
            '''日期位不足'''
            if self.issue_lack(item): item.issue = '20' + item.issue
            '''数字位不足'''
            if self.issue_lack(item): 
                item.issue = item.issue[:8] + [F00, F000][self.bits - 3](item.issue[8:])
        
        if self.type == 3:
            item.open_code = ','.join([F0(c) for c in item.open_code.split(',')])
        
        item.issue = item.issue[:8] + "-" + F00(item.issue[8:])
        
    def request(self):
        url = self.base_url + self.url + "{}".format(urllib.quote(self.key))
        res = request_url_get(url)
        if not res: return None
        item = None
        try:
            if res['errorCode']: return None
            src = res['result']['data']
            open_code = src['preDrawCode']
            issue = src['preDrawIssue']
            open_time = src['preDrawTime']
            item = Code(self.name, issue, open_code, open_time)
            self.format(item)
        except:
            pass
        
        return item
    '''End If'''
   
   
class CommonGame(PkKai):
    def __init__(self, cfg):
        PkKai.__init__(self, cfg['code'], cfg['type'], cfg['url'], cfg['time_mode'])
        if 'key' in cfg: self.key = cfg['key']
        
        
def request_api(name):
    games = {
        'ln11x5': {'url': "/ElevenFive/getElevenFiveInfo.do?issue=&lotCode=", 'code': "10019", 'type': 1,
                   'name': 'ln11x5', 'time_mode': 1},
        't6s300': {'url': "", 'code': "10057", 'type': 1, 'name': '幸运飞艇', 'time_mode': 1},
        'pcdd': {'url': "/LuckTwenty/getPcLucky28.do?", 'code': '10046', 'type': 1, 'name': 'PC蛋蛋', 
                 'time_mode': 3}
    }
    if name not in games: return None
    item = CommonGame(games[name]).request()
    if not item: return None
    return {'Term': item.issue, 'OpenTime': item.open_time, 'KaiJiHao': item.open_code, 
            'NextOpenTime': item.next_time, 'LotteryText': name }
        
if __name__ == '__main__':
    item = request_api('t6s300')
    print(item)
    
