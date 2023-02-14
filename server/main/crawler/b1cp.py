#coding: utf8

import sys
sys.path.append('..')
from libs.utils import TM, F0, F00, F000, S2TS
from common.tools import request_url_get
from common.open_code import Code, ISSUE_DATE_LENGTH


'''b1cp.com'''
class B1CP():
    def __init__(self, g, url = ""):
        self.name = g.name
        self.bits = g.bits
        self.type = g.type
        self.time_mode = g.openTimeMode
        self.url = url
        
    def format(self, item):
        F = [F0, F00, F000][self.bits - 2]
        if self.time_mode < 3:
            item.issue = item.issue.replace('-', '')
            item.issue = item.issue[:8] + '-' + F(item.issue[8:])
        if self.type == 3:
            item.open_code = ','.join([F0(c) for c in item.open_code.split(',')])
    
    def request_api(self):
        res = request_url_get(self.url)
        if not res: return None
        lines = res.get('data', [])
        if not lines: return None
        data = {}
        for d in lines:
            key = d['expect'].replace("-", "")
            item = Code(self.name, d['expect'], d['opencode'], d['opentime'])
            self.format(item)
            data[key] = item.output_base()
        return data
        
        
if __name__ == '__main__':
    g = B1CP('a', 1, 'http://api.81p.net/api?p=json&t=xyft&token=CACF6A3A06EDFE4A&limit=5')
    print g.request_api()
    
    
