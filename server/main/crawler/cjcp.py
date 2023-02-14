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

'''cjcp.com.cn'''
class CaiJing():
    def __init__(self, name, type_ = 1):
        self.name = name
        self.parent = name
        self.key = name
        self.bits = 3
        self.type = type_
        self.time_mode = 1
        self.base_url = "https://www.cjcp.com.cn/kaijiang/"
    
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
        
    def get_img_number(self, name):
        imgs = {
            '201808200329021430': 0,
            '201808200329022908': 1,
            '201808200329023852': 2,
            '201808200329024582': 3,
            '201808200329025833': 4,
            '201808200329026188': 5,
            '201808200329027351': 6,
            '201808200329028495': 7,
            '201808200329029838': 8,
            '2018082003290210496': 9
        }
        return imgs[name]
        
    def request(self):
        url = self.base_url + "/{}".format(urllib.quote(self.key))
        res = request_url_get(url, False)
        if not res: return None
        item = None
        try:
            doc = pq(res)
            result = doc("div.result_l>div.result_con")
            info = result.find('.result_infol>div.info_list>dl>dd')
            ps = info.children("p")
            issue = re.split("第|期", ps.eq(0).text().encode('utf8'))[1]
            open_time = re.split("开奖时间：", ps.eq(1).text().encode('utf8'))[1].strip()
            nums = []
            for img in info(".kj_num>img").items():
                file_name = re.split("img/|.png", img.attr("src").encode('utf8'))[1]
                nums.append(str(self.get_img_number(file_name)))
            open_code = ','.join(nums)
            
            item = Code(self.name, issue, open_code, open_time)
            self.format(item)
        except:
            pass
        
        return item
    '''End If'''
   

CONFIG = [
    {'code': "cqssc", 'type': 1, 'name': '重庆时时彩'}, 
    {'code': "tjssc", 'type': 1, 'name': '天津时时彩'}, 
    {'code': "xjssc", 'type': 1, 'name': '新疆时时彩'}, 
    {'code': "ynssc", 'type': 1, 'name': '云南时时彩'}, 
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
   
   
class CommonGame(CaiJing):
    def __init__(self, cfg):
        CaiJing.__init__(self, cfg['code'], cfg['type'])
        if 'key' in cfg: self.key = cfg['key']

def request_api(name):
    games = {
        'cqssc': {'code': "cqssc", 'type': 1, 'name': '重庆时时彩'}, 
        'tjssc': {'code': "tjssc", 'type': 1, 'name': '天津时时彩'}, 
        'xjssc': {'code': "xjssc", 'type': 1, 'name': '新疆时时彩'}, 
        'ynssc': {'code': "ynssc", 'type': 1, 'name': '云南时时彩'}
    }
    if name not in games: return None
    item = CommonGame(games[name]).request()
    if not item: return None
    return {'Term': item.issue, 'OpenTime': item.open_time, 'KaiJiHao': item.open_code, 
            'NextOpenTime': item.next_time, 'LotteryText': name }
    
            
if __name__ == '__main__':
#     for item in CONFIG:
#         if item['code'] == 'tjssc': CommonGame(item).request()
        
    print request_api("xjssc")
    print request_api("tjssc")
    
    
