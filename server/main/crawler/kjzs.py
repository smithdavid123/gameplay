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
from pyquery import PyQuery as pq
import re

'''kjh.55128.cn'''
class KaiJiangHao():
    def __init__(self, name, type_ = 1):
        self.name = name
        self.parent = name
        self.key = name
        self.bits = 3
        self.type = type_
        self.time_mode = 1
        self.base_url = "https://kjh.55128.cn/"
    
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
        item.open_time += ":00"
        
    def request(self):
        url = self.base_url + "/xq_{}.aspx".format(urllib.quote(self.key))
        res = request_url_get(url, False)
        if not res: return None
        item = None
        try:
            doc = pq(res)
            section = doc("body>div.main>section.mainContent")
            str_title = section.find('div.kaij-title').remove('ul').text().encode('utf8')
            str_number = section.find('.kaij-data>div.kaij-cartoon').text().encode('utf8')
            issue = re.split("第|期", str_title)[1].strip().replace('\n', '')
            open_time = re.split("开奖时间：|\|", str_title)[1]
            open_code = ','.join(str_number.strip().split(' '))
            
            item = Code(self.name, issue, open_code, open_time)
            self.format(item)
        except:
            pass
        # item.output()
        return item
    '''End If'''
   

CONFIG = [
    {'code': "cqssc", 'type': 1, 'name': '重庆时时彩', 'key': 'chongqingssc'}, 
    {'code': "tjssc", 'type': 1, 'name': '天津时时彩'}, 
    {'code': "xjssc", 'type': 1, 'name': '新疆时时彩'}, 
    {'code': "ynssc", 'type': 1, 'name': '云南时时彩', 'key': 'yunnanssc'}, 
    {'code': "shssl", 'type': 1, 'name': '上海时时乐'}, 
    
    {'code': "js11x5", 'type': 3, 'name': '江苏11选5'}, 
    # {'code': "hub11x5", 'type': 3, 'name': '湖北11选5'}, 
    {'code': "zj11x5", 'type': 3, 'name': '浙江11选5'}, 
    {'code': "jx11x5", 'type': 3, 'name': '江西11选5'}, 
    {'code': "xj11x5", 'type': 3, 'name': '新疆11选5'}, 
    {'code': "ah11x5", 'type': 3, 'name': '安徽11选5'}, 
    {'code': "gx11x5", 'type': 3, 'name': '广西11选5', 'key': 'guangxi11x5'}, 
    {'code': "gd11x5", 'type': 3, 'name': '广东11选5'}, 
    {'code': "sd11x5", 'type': 3, 'name': '山东11选5'}, 
    {'code': "tj11x5", 'type': 3, 'name': '天津11选5', 'key': 'tj11选5'}, 
    {'code': "sh11x5", 'type': 3, 'name': '上海11选5'}, 
    {'code': "bj11x5", 'type': 3, 'name': '北京11选5'}, 
    {'code': "jl11x5", 'type': 3, 'name': '吉林11选5'}, 
    {'code': "ln11x5", 'type': 3, 'name': '辽宁11选5'}, 
    {'code': "fj11x5", 'type': 3, 'name': '福建11选5'}, 
    {'code': "gs11x5", 'type': 3, 'name': '甘肃11选5'}, 
    {'code': "gz11x5", 'type': 3, 'name': '贵州11选5', 'key': 'guizhou11x5'}, 
    # {'code': "hn11x5", 'type': 3, 'name': '河南11选5'}, 
    # {'code': "nx11x5", 'type': 3, 'name': '宁夏11选5'}, 
    # {'code': "qh11x5", 'type': 3, 'name': '青海11选5'}, 
    {'code': "sxr11x5", 'type': 3, 'name': '山西11选5', 'key': 'sxtaiyuan11x5'}, 
    {'code': "sxl11x5", 'type': 3, 'name': '陕西11选5', 'key': 'sxxa11x5'}, 
    {'code': "yn11x5", 'type': 3, 'name': '云南11选5'}, 
    {'code': "hlj11x5", 'type': 3, 'name': '黑龙江11选5'}, 
    {'code': "nmg11x5", 'type': 3, 'name': '内蒙古11选5'},
]   
   
   
class CommonGame(KaiJiangHao):
    def __init__(self, cfg):
        KaiJiangHao.__init__(self, cfg['code'], cfg['type'])
        if 'key' in cfg: self.key = cfg['key']

def request_api(name):
    games = {
        'cqssc': {'code': "cqssc", 'type': 1, 'name': '重庆时时彩', 'key': 'chongqingssc'}, 
        'tjssc': {'code': "tjssc", 'type': 1, 'name': '天津时时彩'}, 
        'xjssc': {'code': "xjssc", 'type': 1, 'name': '新疆时时彩'}, 
        'ynssc': {'code': "ynssc", 'type': 1, 'name': '云南时时彩', 'key': 'yunnanssc'}
    }
    if name not in games: return None
    item = CommonGame(games[name]).request()
    if not item: return None
    return {'Term': item.issue, 'OpenTime': item.open_time, 'KaiJiHao': item.open_code, 
            'NextOpenTime': item.next_time, 'LotteryText': name }
        
if __name__ == '__main__':
#     for item in CONFIG:
#         if item['code'] == 'tj11x5' or 1: CommonGame(item).request()
    print request_api('cqssc')
    print request_api('tjssc')
    print request_api('xjssc')
    print request_api('ynssc')
    
    
