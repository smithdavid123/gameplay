#coding:utf8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import itertools
import json

class WinSSC():
    '''
    classdocs
    '''

    def __init__(self):
        '''
        Constructor
        '''
    
    def zux(self, m, openCode, content):
        # dict((d[0], d) for d in [[
        cfg = {'wxzux60': [[0, 5], [[2, 1]]], 'wxzux30': [[0, 5], [[2, 2]]], 'wxzux20': [[0, 5], [[3, 1]]], 
             'wxzux10': [[0, 5], [[3, 1], [2, 1]]], 'wxzux5': [[0, 5], [[4, 1]]], 'wxzux120': [[0, 5], []],
             'sixzux24h': [[1, 5], []], 'sixzux24q': [[0, 4], []], 
             'sixzux12h': [[1, 5], [[2, 1]]], 'sixzux12q': [[0, 4], [[2, 1]]], 
             'sixzux6h': [[1, 5], [[2, 2]]], 'sixzux6q': [[0, 4], [[2, 2]]], 
             'sixzux4h': [[1, 5], [[3, 1]]], 'sixzux4q': [[0, 4], [[3, 1]]],
             'sxzuxzlq': [[0, 3], []], 'sxzuxzlz': [[1, 4], []], 'sxzuxzlh': [[2, 5], []],
             'exzuxfsq': [[0, 2], []], 'exzuxfsh': [[3, 5], []],
             
             # 'sxzhixfsh'
        }
        rng, parts = cfg[m][0], cfg[m][1]
        code, left = openCode[rng[0]:rng[1]], rng[1] - rng[0]
        '''开奖信息缓存'''
        target, cache = {}, {}
        for c in code: target[c] = 1 if c not in target else target[c] + 1 
        for c in target: 
            if target[c] not in cache: cache[target[c]] = set()
            cache[target[c]].add(c)    
        '''投注信息缓存'''
        cacheL, cacheR = set(), set()
        if len(parts) == 0: 
            cacheR = set(content.split(","))
        elif m in set(['sixzux6h', 'sixzux6q']): 
            cacheL = set(content.split(","))
        else:
            cacheL, cacheR = set(list(content.split(",")[0])), set(list(content.split(",")[1]))
        cacheLR = [cacheL, cacheR]
        '''重号部分'''
        for i, p in enumerate(parts):
            '''先判断模式是否一致'''
            if p[0] not in cache or len(cache[p[0]]) != p[1]: return False
            '''判断开奖号码是否全被覆盖'''
            for e in cache[p[0]]:
                if e not in cacheLR[i]: return False
            left -= p[0] * p[1]
        '''剩余部分'''
        once = cache.get(1, set())
        if left != len(once): return False
        # print once, content, cacheR
        for e in once:
            if e not in cacheR: return False
        
        return True
    
    '''组三'''
    def sxzs(self, m, openCode, content):
        cfg = {'sxzuxzsh': [[2, 5]], 'sxzuxzsz': [[1, 4]], 'sxzuxzsq': [[0, 3]]}
        rng = cfg[m][0]
        code = openCode[rng[0]:rng[1]]
        target, cache = {}, set(content.split(","))
        for c in code: target[c] = 1 if c not in target else target[c] + 1 
        if len(target) != 2: return False
        for c in target:
            if c not in cache: return False
            
        return True
        
        
    def bdw(self, m, openCode, content):
        cfg = {'wxbdw1m': [[0, 5], 1], 'wxbdw2m': [[0, 5], 2], 'wxbdw3m': [[0, 5], 3], 
               'bdw1mh': [[2, 5], 1], 'bdw2mh': [[2, 5], 2], 'bdw1mz': [[1, 4], 1], 
               'bdw2mz': [[1, 4], 2], 'bdw1mq': [[0, 3], 1], 'bdw2mq': [[0, 3], 2]}
        rng = cfg[m][0]
        code = openCode[rng[0]:rng[1]]
        count, cache = 0, set(content.split(","))
        
        '''开奖号码有重复不算'''
        for c in set(code):
            if c in cache: count += 1
            
        return len(list(itertools.combinations(range(count), cfg[m][1])))
    
    '''直选复式'''
    def zhixfs(self, m, code, content):
        ps = content.split(",")
        for i, c in enumerate(code):
            if ps[i] == "-": continue
            p = set(list(ps[i]))
            if c not in p: return False
        
        return True
    
    '''直选和值'''
    def zhixhz(self, m, openCode, content):
        cfg = {'sxzhixhzh': [[2, 5]], 'sxzhixhzz': [[1, 4]], 'sxzhixhzq': [[0, 3]], 
                'exzhixhzh': [[3, 5]], 'exzhixhzq': [[0, 2]]}
        rng = cfg[m][0]
        code = openCode[rng[0]:rng[1]]
        sumO = sum(int(c) for c in code)
        for c in content.split(","):
            if int(c) == sumO: return True
        
        return False
    
    '''大小单双'''
    def dxds(self, m, code, content):
        cfg = {'wxhzdxds': [[-1], 23], 'dxdsh': [[3, 4], 5], 'dxdsq': [[0, 1], 5]}
        parts = cfg[m][0]
        sumO = sum(int(c) for c in code)
        flag, ps = 1, content.split(",")
        for i, b in enumerate(parts):
            f, cache = 0, set([c.encode("utf8") for c in ps[i].decode('utf8')])
            norm = int(code[b]) if b!=-1 else sumO
            f1 = "小" if norm < cfg[m][1] else "大"
            f2 = "单" if norm % 2 else "双"
            if f1 in cache: f += 1
            if f2 in cache: f += 1
            flag *= f
            
        return flag
    
    def dw(self, m, code, content):
        cfg = {'dw': 1, 'rx2fs': 2, 'rx3fs': 3, 'rx4fs': 4}
        ps = content.split(",")
        flag = 0
        for i, c in enumerate(code):
            if ps[i] == "-": continue
            p = set(list(ps[i]))
            if c in p: flag += 1
            
        return len(list(itertools.combinations(range(flag), cfg[m])))
    
    def rxzx(self, m, openCode, content):
        cfg = {'rx2zx': [2, 2], 'rx3z3': [3, 2], 'rx3z6': [3, 3]}
        ps, flag = content.split(']'), 0
        cl, cr = ps[0][1:].split(','), set(ps[1].split(','))
        code = [openCode[i] for i in range(5) if cl[i]=='√']
        
        for cm in itertools.combinations(code, cfg[m][0]):
            if len(set(cm)) != cfg[m][1]: continue
            if len(set(cm) & cr) == len(set(cm)): flag += 1
            
        return flag
    
    '''跨度'''
    def kd(self, m, openCode, content):
        cfg = {'kdqs': [0, 3], 'kdzs': [1, 4], 'kdhs': [2, 5], 'kdqe': [0, 2], 'kdhe': [3, 5]}
        rng = cfg[m]
        code = [int(c) for c in openCode[rng[0]:rng[1]]]
        diff = max(code) - min(code)
        cache = set(content.split(','))
        
        return str(diff) in cache
    
    '''趣味'''
    def qw(self, m, openCode, content):
        cfg = {'qwyffs': 1, 'qwhscs': 2, 'qwsxbx': 3, 'qwsjfc': 4}
        flag = 0
        target, cache = {}, set(content.split(","))
        for c in openCode: target[c] = 1 if c not in target else target[c] + 1
        for c in target:
            if target[c] >= cfg[m] and c in cache: flag += 1
        
        return flag
    
    '''龙虎和'''
    def lh(self, m, code, content):
        cfg = {'lhwq': [0, 1], 'lhwb': [0, 2], 'lhws': [0, 3], 'lhwg': [0, 4], 'lhqb': [1, 2], 
               'lhqs': [1, 3], 'lhqg': [1, 4], 'lhbs': [2, 3], 'lhbg': [2, 4], 'lhsg': [3, 4]}
        n1, n2 = code[cfg[m][0]], code[cfg[m][1]]
        flag = '和' if n1 == n2 else ('龙' if n1 > n2 else '虎')
        cache = set(content.split("|"))
        
        indexs = {'龙': 0, '虎': 1, '和': 2}
        
        # 区间赔率特殊情况，原：return flag in cache
        return [flag in cache, indexs[flag]]
        
    
    '''任选单式'''
    def rxds(self, m, openCode, content):
        cfg = {'rx1ds': 1, 'rx2ds': 2, "rx3ds": 3, "rx4ds": 4, "rx5ds": 5, "rx6ds": 5, \
               "rx7ds": 5, "rx8ds": 5}
        ps, flag = content.split(']'), 0
        cl, cr = ps[0][1:].split(','), set(ps[1].split(','))
        code = [openCode[i] for i in range(5) if cl[i] == '√']
        for cm in itertools.combinations(code, cfg[m]):
            if ''.join(cm) in cr: flag += 1
        
        return flag
    
    '''直选单式'''
    def zhixds(self, m, openCode, content):
        cfg = {'sxzhixdsh': [2, 5], 'sxzhixdsz': [1, 4], 'sxzhixdsq': [0, 3], "sixzhixdsh": [1, 5], 
               "sixzhixdsq": [0, 4], "wxzhixds": [0, 5], "exzhixdsh": [3, 5], "exzhixdsq": [0, 2]}
        flag, ps = 0, set(content.split(' '))
        cache = openCode[cfg[m][0]: cfg[m][1]]
        for cs in ps:
            if len(cs) != len(cache): continue
            num = [i for i in range(len(cache)) if cache[i] == cs[i]]
            if len(num) == len(cache): flag += 1 
        
        # 相同投注号码金额只算一次
        return True if flag > 0 else False
    
    
    # ★☆★ 混合组选通用检测判断过程
    def _check_hhzx(self, code, parts):
        flag, target = 0, {}
        for c in code: target[c] = target.get(c, 0) + 1
        cache = set()
        for cs in parts:
            if len(cs) != len(code): continue
            source = {}
            for c in cs: source[c] = source.get(c, 0) + 1
            if len(source) == 1: continue
            '''防止不同次序的重复'''
            key = json.dumps(source).encode('utf8') 
            if key in cache: 
                continue
            else:
                cache.add(key)
            
            '''组三和组六，所有位号码数量必须一致'''
            f = [e for e in target if target[e] != source.get(e, 0)] 
            if len(f) == 0: flag += 1
            
        return flag
    
    '''混合组选、二星组选'''
    def sxhhzx(self, m, openCode, content):
        cfg = {'sxhhzxh': [[2, 5]], 'sxhhzxz': [[1, 4]], 'sxhhzxq': [[0, 3]],
               'exzuxdsh': [[3, 5]], 'exzuxdsq': [[0, 2]]
        }
        rng = cfg[m][0] 
        code = openCode[rng[0]: rng[1]]
        ps = set(content.split(' '))

        return self._check_hhzx(code, ps)
    
    '''任三混合组选'''
    def rx3hh(self, m, openCode, content):
        ps, flag = content.split(']'), 0
        cl, cr = ps[0][1:].split(','), set(ps[1].split(','))
        code = [openCode[i] for i in range(5) if cl[i] == '√']
        
        for cm in itertools.combinations(code, 3):
            flag += self._check_hhzx(cm, cr)
        
        return flag
    
    
    def Detection(self, m, openCode, content):
        content = content.encode('utf8')
        code = openCode.split(",")
        
        # 直选单式
        if m in set(['sxzhixdsh', 'sxzhixdsz', 'sxzhixdsq', "sixzhixdsh", "sixzhixdsq", "wxzhixds",
                            "exzhixdsh", "exzhixdsq"]):
            return self.zhixds(m, code, content)
        # 三星混合组选, 二星组选单式
        if m in set(["sxhhzxh", "sxhhzxz", "sxhhzxq", "exzuxdsh", "exzuxdsq"]):
            return self.sxhhzx(m, code, content) 
        
        # 1二重号，2二重号, 1三重号，1三重号1二重号，1四重号
        if m in set(['wxzux60', 'wxzux30', 'wxzux20', 'wxzux10', 'wxzux5', 'wxzux120', 'sixzux24h', 'sixzux24q',
                     'sixzux12h', 'sixzux12q', 'sixzux6h', 'sixzux6q', 'sixzux4h', 'sixzux4q',
                     'sxzuxzlq', 'sxzuxzlz', 'sxzuxzlh', 'exzuxfsq', 'exzuxfsh']):
            return self.zux(m, code, content)
        elif m in set(["rx2ds", "rx3ds", "rx4ds"]):
            return self.rxds(m, code, content)
        # 任选3混合组选
        elif m in set(["rx3hh"]):
            return self.rx3hh(m, code, content)
        
        # 定位胆
        if m in set(['dw', 'rx2fs', 'rx3fs', 'rx4fs']):
            return self.dw(m, code, content)
            
        # 不定胆
        if m in set(['wxbdw1m', 'wxbdw2m', 'wxbdw3m', 'bdw1mh', 'bdw2mh', 
                     'bdw1mz', 'bdw2mz', 'bdw1mq', 'bdw2mq']):
            return self.bdw(m, code, content)
        
        # 和值总和0-22为小，23-45为大，单双
        if m in set(['wxhzdxds', 'dxdsh', 'dxdsq']):
            return self.dxds(m, code, content)
            
        # 直选复式
        if m in set(['wxzhixfs', 'sixzhixfsh', 'sixzhixfsq', 'sxzhixfsh', 'sxzhixfsz', 'sxzhixfsq',
                     'exzhixfsh', 'exzhixfsq']):
            return self.zhixfs(m, code, content)
        
        # 组三
        if m in set(['sxzuxzsh', 'sxzuxzsz', 'sxzuxzsq']):
            return self.sxzs(m, code, content)
        
        # 和值
        if m in set(['sxzhixhzz', 'sxzhixhzh', 'sxzhixhzq', 'exzhixhzh', 'exzhixhzq']):
            return self.zhixhz(m, code, content)
        
        # 任选组选
        if m in set(['rx2zx', 'rx3z3', 'rx3z6', '']):
            return self.rxzx(m, code, content) 
        
        # 跨度
        if m in set(['kdqs', 'kdzs', 'kdhs', 'kdqe', 'kdhe']):
            return self.kd(m, code, content)
        
        # 趣味
        if m in set(['qwyffs', 'qwhscs', 'qwsxbx', 'qwsjfc']):
            return self.qw(m, code, content)
        
        # 龙虎和
        if m in set(['lhwq', 'lhwb', 'lhws', 'lhwg', 'lhqb', 'lhqs', 'lhqg', 'lhbs', 'lhbg', 'lhsg']):
            return self.lh(m, code, content)
        
        '''
        set(['sxzhixdsh', 'sxzhixdsz', 'sxzhixdsq', "sixzhixdsh", "sixzhixdsq", "wxzhixds",
                            "exzhixdsh", "exzhixdsq", 
                            "sxhhzxh", "sxhhzxz", "sxhhzxq",
                            "exzuxdsh", "exzuxdsq"])
        '''
        
def test():
    w = WinSSC()
    print False, w.Detection("wxzux60", "7,7,0,1,5", "7,2345")
    print False, w.Detection("wxzux60", "7,7,2,1,5", "67,2345")
    print False, w.Detection("wxzux30", "7,7,2,2,5", "72,234")
    print False, w.Detection("wxzux20", "7,7,7,1,5", "72,2345")
    print False, w.Detection("wxzux10", "7,7,7,2,2", "72,345")
    print False, w.Detection("wxzux5", "7,7,7,7,2", "72,345")
    print False, w.Detection("wxzux120", "7,7,7,1,2", "7,1,2,5,3")
    print False, w.Detection("sixzux12h", "7,5,5,6,2", "45,61")
    print False, w.Detection("sixzux12q", "7,5,6,6,6", "56,67")
    print False, w.Detection("sixzux24h", "7,1,1,6,2", "2,1,4,7,6")
    print False, w.Detection("sixzux24q", "7,0,5,5,2", "0,7,2,5,6")
    
    print True, w.Detection("wxzux60", "7,7,0,1,5", "7,015")
    print True, w.Detection("wxzux60", "7,7,2,1,5", "67,215")
    print True, w.Detection("wxzux30", "7,7,2,2,5", "72,2345")
    print True, w.Detection("wxzux20", "7,7,7,1,5", "72,21345")
    print True, w.Detection("wxzux10", "7,7,7,2,2", "7,12345")
    print True, w.Detection("wxzux5", "7,7,7,7,2", "72,2345")
    print True, w.Detection("wxzux120", "7,0,5,1,2", "0,1,2,7,5")
    print True, w.Detection("sixzux12h", "7,5,5,6,2", "45,62")
    print True, w.Detection("sixzux12q", "7,5,5,6,6", "56,67")
    print True, w.Detection("sixzux24h", "7,5,1,6,2", "2,1,4,5,6")
    print True, w.Detection("sixzux24q", "7,0,5,1,2", "0,7,1,5,6")
    
    
    print False, w.Detection("wxzhixfs", "7,7,1,1,2", "7,7,0,1,2")
    print False, w.Detection("sixzhixfsh", "7,7,1,1,2", "-,7,0,1,2")
    print False, w.Detection("sixzhixfsq", "7,7,1,1,2", "7,7,02,1,-")
    
    print True, w.Detection("wxzhixfs", "7,7,1,1,2", "7,7,01,1,2")
    print True, w.Detection("sixzhixfsh", "7,7,1,1,2", "-,7,01,1,2")
    print True, w.Detection("sixzhixfsq", "7,7,1,1,2", "7,7,1,1,-")
       
    print True, w.Detection("sixzux6h", "0,7,1,1,7", "7,1,2")
    print True, w.Detection("sixzux6q", "7,7,1,1,7", "7,1,2")
    print True, w.Detection("sixzux4h", "7,7,1,1,1", "17,72")
    print True, w.Detection("sixzux4q", "1,6,6,6,6", "67,124")
    
    print False, w.Detection("sixzux6h", "1,7,0,1,7", "7,1,0")
    print False, w.Detection("sixzux6q", "7,7,1,2,7", "7,1,2")
    print False, w.Detection("sixzux4h", "7,7,1,0,1", "17,72")
    print False, w.Detection("sixzux4q", "6,6,6,6,6", "67,124")
    
    print False, w.Detection("sxzhixfsh", "6,6,1,3,2", "-,-,1,2,3")
    print False, w.Detection("sxzuxzsh", "6,6,1,2,3", "1,2,3")
    print False, w.Detection("sxzuxzsz", "6,6,1,1,2", "1,2")
    print False, w.Detection("sxzuxzsq", "6,1,2,1,2", "1,6")
    
    print True, w.Detection("sxzhixfsh", "6,6,1,2,3", "-,-,1,2,3")
    print True, w.Detection("sxzuxzsh", "6,6,1,1,2", "1,2,3")
    print True, w.Detection("sxzuxzsz", "6,6,1,1,2", "1,6")
    print True, w.Detection("sxzuxzsq", "6,6,1,1,2", "1,6")
    
    print False, w.Detection("sxzuxzlh", "6,6,3,3,4", "3,4,5,6")
    print False, w.Detection("sxzuxzlz", "6,6,3,3,4", "3,4,5,6")
    print False, w.Detection("sxzuxzlq", "6,6,3,3,4", "3,4,6")
    
    print True, w.Detection("sxzuxzlh", "6,6,3,5,4", "3,4,5,6")
    print True, w.Detection("sxzuxzlz", "6,6,5,3,4", "3,4,5,6")
    print True, w.Detection("sxzuxzlq", "6,4,3,3,4", "3,4,6")
    
    print False, w.Detection("sxzhixfsq", "6,4,3,3,4", "3,4,56,-,-")
    print False, w.Detection("sxzhixfsz", "6,4,3,3,4", "-,3,3,46,-")
    print False, w.Detection("sxzhixfsh", "6,4,3,3,4", "-,-,3,3,56")
    
    print True, w.Detection("sxzhixfsq", "6,4,3,3,4", "6,4,43,-,-")
    print True, w.Detection("sxzhixfsz", "6,4,3,3,4", "-,4,3,43,-")
    print True, w.Detection("sxzhixfsh", "6,4,3,3,4", "-,-,3,3,4")
    
    print False, w.Detection("sxzhixhzq", "6,4,3,3,4", "20,3")
    print False, w.Detection("sxzhixhzz", "6,0,1,3,4", "7,6")
    print False, w.Detection("sxzhixhzh", "6,0,3,3,4", "16,9")
    
    print True, w.Detection("sxzhixhzq", "6,4,3,3,4", "20,13")
    print True, w.Detection("sxzhixhzz", "6,0,1,3,4", "6,4")
    print True, w.Detection("sxzhixhzh", "6,4,3,3,4", "10")
    
    print False, w.Detection("exzhixfsh", "6,4,3,3,2", "-,-,-,23,3")
    print False, w.Detection("exzhixfsq", "6,3,3,3,2", "23,3,-,-,-")
    print False, w.Detection("exzhixhzh", "6,3,3,3,2", "17,6")
    print False, w.Detection("exzhixhzq", "6,3,3,3,2", "17")
    
    print True, w.Detection("exzhixfsh", "6,4,3,3,2", "-,-,-,23,23")
    print True, w.Detection("exzhixfsq", "2,3,3,3,2", "23,3,-,-,-")
    print True, w.Detection("exzhixhzh", "6,3,3,3,2", "17,5")
    print True, w.Detection("exzhixhzq", "6,3,3,3,2", "9")
    
    print False, w.Detection("wxhzdxds", "7,7,5,1,2", "单|大")
    print False, w.Detection("wxhzdxds", "7,7,7,6,2", "双|小")
    
    print 1, w.Detection("wxhzdxds", "7,7,5,1,2", "单|小")
    print 1, w.Detection("wxhzdxds", "7,7,7,6,2", "双|大")
    print 2, w.Detection("wxhzdxds", "7,7,7,6,2", "单|大")
    print 2, w.Detection("wxhzdxds", "7,7,1,1,2", "双|小")
    
    print 4, w.Detection("dxdsh", "7,7,1,1,2", "小单,小双")
    print 2, w.Detection("dxdsh", "7,7,1,1,2", "小双,小双")
    print 1, w.Detection("dxdsh", "7,7,1,1,2", "小双,大双")    
    print 0, w.Detection("dxdsh", "7,7,1,1,2", "小双,大单")
    print 0, w.Detection("dxdsh", "7,7,1,1,2", "双,大")
    
    print 4, w.Detection("dxdsq", "7,8,1,1,2", "大单,大双")
    print 2, w.Detection("dxdsq", "7,7,1,1,2", "小单,大双")
    print 1, w.Detection("dxdsq", "7,7,1,1,2", "大双,大双")    
    print 0, w.Detection("dxdsq", "7,7,1,1,2", "大双,小双")
    print 0, w.Detection("dxdsq", "7,7,1,1,2", "小,单")
    
    print False, w.Detection("exzuxfsq", "3,7,5,1,2", "3,4")
    print False, w.Detection("exzuxfsh", "3,7,5,1,2", "3,2,5")
    print True, w.Detection("exzuxfsq", "3,7,5,1,2", "3,4,7")
    print True, w.Detection("exzuxfsh", "3,7,5,1,2", "3,1,2")
    
    
    print False, w.Detection("wxbdw1m", "7,7,7,7,2", "1,3,4,5")
    print False, w.Detection("wxbdw2m", "7,7,7,1,2", "7,3,4,5")
    print False, w.Detection("wxbdw3m", "7,7,7,1,2", "7,2,4,5")
    
    print 2, w.Detection("wxbdw1m", "7,7,7,7,2", "2,7,4,5")
    print 3, w.Detection("wxbdw2m", "7,7,7,1,2", "7,1,2,5")
    print 1, w.Detection("wxbdw3m", "7,7,7,1,2", "7,1,2,5")
    
    print 0, w.Detection("bdw1mh", "7,7,7,1,2", "5,3")
    print 0, w.Detection("bdw2mh", "7,7,7,1,2", "4,1")
    print 0, w.Detection("bdw1mz", "7,7,7,1,2", "5,2")
    print 0, w.Detection("bdw2mz", "7,7,7,1,2", "3,1")
    print 0, w.Detection("bdw1mq", "7,7,7,1,2", "6,1,9")
    print 0, w.Detection("bdw2mq", "7,7,1,1,2", "7,2,5")
    print 0, w.Detection("bdw2mq", "7,5,1,1,2", "1,3")
    
    print 2, w.Detection("bdw1mh", "7,7,7,1,2", "7,1")
    print 1, w.Detection("bdw2mh", "7,7,7,1,2", "7,1")
    print 2, w.Detection("bdw1mz", "7,7,7,1,2", "7,1")
    print 1, w.Detection("bdw2mz", "7,7,7,1,2", "7,1")
    print 1, w.Detection("bdw1mq", "7,7,7,1,2", "7,1")
    print 1, w.Detection("bdw2mq", "7,7,1,1,2", "7,1")
    print 3, w.Detection("bdw2mq", "7,5,1,1,2", "7,1,5,2,3,4")

    print 0, w.Detection("rx2fs", "7,5,1,1,2", "5,7,-,-,-")
    print 0, w.Detection("rx3fs", "7,5,1,1,2", "6,75,3,1,-")
    print 0, w.Detection("rx4fs", "7,5,1,1,2", "6,75,1,1,0")
    print 0, w.Detection("dw", "3,7,5,1,2", "45,6,7,-,-")
    
    print 1, w.Detection("dw", "3,7,5,1,2", "3,1,2,-,-")
    print 1, w.Detection("rx2fs", "7,5,1,1,2", "7,75,-,-,-")
    print 1, w.Detection("rx3fs", "7,5,1,1,2", "6,58,1,1,-")
    print 3, w.Detection("dw", "3,7,5,1,2", "3,17,-,13,-")
    print 3, w.Detection("rx2fs", "7,5,1,1,2", "7,75,-,-,2")    
    print 4, w.Detection("rx3fs", "7,5,1,1,2", "56,5,1,18,82")
    print 5, w.Detection("rx4fs", "7,5,1,1,2", "7,5,1,18,82")
    
    print 0, w.Detection("rx2zx", "7,5,1,1,2", "[-,-,√,√,√]1,5")
    print 1, w.Detection("rx2zx", "7,5,1,2,0", "[-,-,√,√,√]1,2,5")    
    print 2, w.Detection("rx2zx", "7,5,1,1,2", "[-,-,√,√,√]1,2,5")
    print 3, w.Detection("rx2zx", "7,5,1,0,2", "[-,-,√,√,√]1,0,2")
    print 2, w.Detection("rx3z3", "7,5,1,1,3", "[-,√,√,√,√]5,1,0,2,3")
    print 3, w.Detection("rx3z3", "7,5,1,1,3", "[√,√,√,√,√]5,1,0,7,3")
    print 6, w.Detection("rx3z3", "7,7,1,1,3", "[√,√,√,√,√]5,1,0,7,3")
    print 0, w.Detection("rx3z6", "7,7,1,1,3", "[-,-,√,√,√]5,1,0,7,3")
    print 1, w.Detection("rx3z6", "7,2,1,0,3", "[-,√,√,√,√]5,1,0,7,3")
    print 3, w.Detection("rx3z6", "7,2,1,1,1", "[√,√,√,√,√]2,1,5,7,3")
    print 4, w.Detection("rx3z6", "7,2,1,0,3", "[√,√,√,√,√]2,1,5,7,3")
    print 7, w.Detection("rx3z6", "7,0,1,1,3", "[√,√,√,√,√]5,1,0,7,3")

    print False, w.Detection("kdqs", "7,0,1,1,3", "6,1")
    print False, w.Detection("kdzs", "9,9,9,1,3", "0")
    print False, w.Detection("kdhs", "9,9,9,0,3", "8")
    print False, w.Detection("kdqe", "9,8,9,1,3", "0")
    print False, w.Detection("kdhe", "9,9,9,0,3", "0")
    
    print True, w.Detection("kdqs", "9,9,1,1,3", "8,1")
    print True, w.Detection("kdqs", "9,9,9,1,3", "0")
    print True, w.Detection("kdzs", "9,9,1,1,3", "8,1")
    print True, w.Detection("kdzs", "9,9,9,1,3", "8")
    print True, w.Detection("kdhs", "9,9,9,0,3", "9")
    print True, w.Detection("kdhs", "9,9,9,3,3", "8,6")
    print True, w.Detection("kdqe", "9,8,9,1,3", "1,0")
    print True, w.Detection("kdqe", "9,9,9,0,3", "0")
    print True, w.Detection("kdhe", "9,8,9,1,3", "0,2")
    print True, w.Detection("kdhe", "9,9,9,0,3", "3")
    
    print 0, w.Detection("qwyffs", "7,7,1,1,3", "2,0,6")
    print 1, w.Detection("qwyffs", "7,7,1,1,3", "2,0,3")
    print 2, w.Detection("qwyffs", "7,7,1,1,3", "2,1,3")
    print 0, w.Detection("qwhscs", "7,7,1,1,3", "2,0,3")
    print 1, w.Detection("qwhscs", "7,7,1,1,3", "2,1,3")
    print 1, w.Detection("qwhscs", "7,7,7,7,3", "7,1,3")
    print 2, w.Detection("qwhscs", "7,7,1,1,3", "7,1,3")
    print 0, w.Detection("qwsxbx", "7,7,1,1,3", "1")
    print 1, w.Detection("qwsxbx", "7,7,7,7,3", "7,1,3")
    print 1, w.Detection("qwsxbx", "7,7,7,7,7", "7")
    print 0, w.Detection("qwsjfc", "1,1,3,3,3", "3")
    print 0, w.Detection("qwsjfc", "1,3,3,3,3", "1")
    print 1, w.Detection("qwsjfc", "7,7,7,7,3", "7,3")
    print 1, w.Detection("qwsjfc", "7,7,7,7,7", "7")
    
    print False, w.Detection("lhwq", "7,7,1,1,3", "龙|虎")
    print False, w.Detection("lhwb", "7,7,1,1,3", "和|虎")
    print False, w.Detection("lhws", "7,7,1,1,3", "和")
    print False, w.Detection("lhwg", "7,7,1,1,9", "龙|和")
    print False, w.Detection("lhqb", "7,7,7,1,3", "龙|虎")
    print False, w.Detection("lhqs", "7,7,1,1,3", "和|虎")
    print False, w.Detection("lhqg", "7,7,1,1,8", "和")
    print False, w.Detection("lhbs", "7,7,1,1,3", "龙|虎")
    print False, w.Detection("lhbg", "7,7,1,1,3", "和")
    print False, w.Detection("lhsg", "7,7,1,3,3", "龙|虎")
    
    print True, w.Detection("lhwq", "7,7,1,1,3", "龙|和")
    print True, w.Detection("lhwb", "7,7,1,1,3", "龙|虎")
    print True, w.Detection("lhws", "7,7,1,1,3", "龙|和")
    print True, w.Detection("lhwg", "7,7,1,1,9", "虎")
    print True, w.Detection("lhqb", "7,7,7,1,3", "和")
    print True, w.Detection("lhqs", "7,7,1,1,3", "龙|虎")
    print True, w.Detection("lhqg", "7,7,1,1,8", "虎|和")
    print True, w.Detection("lhbs", "7,7,1,1,3", "和|龙|虎")
    print True, w.Detection("lhbg", "7,7,1,1,3", "龙|虎")
    print True, w.Detection("lhsg", "7,7,1,3,3", "龙|和")
    print '-------------------Test for 龙虎和-----------------'
    
    print 0, w.Detection("rx2ds", "7,2,0,0,3", "[-,-,-,√,√]02")
    print 1, w.Detection("rx2ds", "7,2,0,0,3", "[-,-,-,√,√]03")
    print 2, w.Detection("rx2ds", "7,2,0,0,3", "[-,-,√,√,√]03,01,02,17,23")
    print 9, w.Detection("rx2ds", "7,0,0,0,1", "[√,√,√,√,√]00,70,01")
    print 3, w.Detection("rx3ds", "7,2,1,1,1", "[√,√,√,√,√]211,112,511,710,310")
    print 2, w.Detection("rx4ds", "7,2,1,1,1", "[√,√,√,√,√]2121,1112,7111,2111")

    print 0, w.Detection("wxzhixds", "7,7,1,3,3", "77130 23146 771331")
    print 1, w.Detection("wxzhixds", "7,7,1,3,3", "77133 23146 771331")
    print 0, w.Detection("sxzhixdsq", "7,7,1,3,3", "777 231 177")
    print 1, w.Detection("sxzhixdsq", "7,7,1,3,3", "771 231 177")
    print 1, w.Detection("sxzhixdsq", "7,7,1,3,3", "771 771 177")
    print 0, w.Detection("sxzhixdsh", "7,7,1,3,3", "771 771 177")
    print 1, w.Detection("sxzhixdsh", "7,7,1,3,3", "771 771 133")
    print 0, w.Detection("sxzhixdsz", "7,7,1,3,3", "771 771 177")
    print 1, w.Detection("sxzhixdsz", "7,7,1,3,3", "771 713 177")
    print 1, w.Detection("sxzhixdsz", "7,7,1,3,3", "713 713 133")
    print 0, w.Detection("exzhixdsq", "7,7,1,3,3", "71 713 133")
    print 1, w.Detection("exzhixdsq", "7,7,1,3,3", "77 777 133")
    print 0, w.Detection("exzhixdsh", "7,7,1,3,3", "77 13 333")
    print 1, w.Detection("exzhixdsh", "7,7,1,3,3", "71 33 33")
    
    print '-------------------Test for 混合组选-----------------'
    print 0, w.Detection("sxhhzxh", "7,7,1,3,3", "711 713 13")
    print 1, w.Detection("sxhhzxh", "7,7,1,3,3", "133")
    print 1, w.Detection("sxhhzxh", "7,7,1,3,3", "711 331 313")
    print 1, w.Detection("sxhhzxh", "7,7,1,3,3", "331 133 331")
    print 1, w.Detection("sxhhzxh", "7,7,1,2,3", "3211 213 123")
    print 1, w.Detection("sxhhzxh", "7,7,1,2,3", "321 213 123")
    print 1, w.Detection("sxhhzxq", "7,7,1,2,3", "771 213 177")
    '''此处省略其余两种同类玩法详细测试"sxhhzxz", "sxhhzxq"'''
    
    print 0, w.Detection("exzuxdsh", "7,7,1,2,3", "71 231 22")
    print 0, w.Detection("exzuxdsh", "7,7,1,2,2", "71 22 23")
    print 1, w.Detection("exzuxdsh", "7,7,1,2,3", "71 32 32")
    print 1, w.Detection("exzuxdsh", "7,7,1,2,3", "71 22 23")
    print 1, w.Detection("exzuxdsh", "7,7,1,2,3", "71 23 32")
    print 0, w.Detection("exzuxdsh", "7,7,1,3,3", "71 23 32")
    print 0, w.Detection("exzuxdsq", "7,7,1,3,3", "71 11 17")
    print 0, w.Detection("exzuxdsq", "7,7,1,3,3", "71 77 17")
    print 1, w.Detection("exzuxdsq", "7,3,1,3,3", "73 37 73")
    print 1, w.Detection("exzuxdsq", "7,3,1,3,3", "73 37 137")
    
    print 0, w.Detection("rx3hh", "7,3,1,2,3", "[-,√,√,√,-]112,3122,313")
    print 1, w.Detection("rx3hh", "7,3,1,2,3", "[-,-,√,√,√]112,231,313")
    print 1, w.Detection("rx3hh", "7,3,1,3,3", "[-,-,√,√,√]112,123,313")
    print 3, w.Detection("rx3hh", "7,3,1,3,3", "[-,√,√,√,√]112,123,313")
    print 1, w.Detection("rx3hh", "7,3,1,2,3", "[-,-,√,√,√]112,123,312")
    
    
if __name__ == '__main__':
#     test()
#     w = WinSSC()
    print str([12, 32])