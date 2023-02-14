#coding:utf8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import itertools
from wSSC import WinSSC


class WinD3():
    '''
    classdocs
    '''
    
    def __init__(self):
        '''
        '''

    
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
        cfg = {'sanxzhixhz': [[0, 3]], 'exzhixhzh': [[1, 3]], 'exzhixhzq': [[0, 2]]}
        rng = cfg[m][0]
        code = openCode[rng[0]:rng[1]]
        sumO = sum(int(c) for c in code)
        
        return str(sumO) in set(content.split(","))
    
    '''直选单式'''
    def zhixds(self, m, openCode, content):
        cfg = {'sanxzhixds': [0, 3], 'exzhixdsh': [1, 3], 'exzhixdsq': [0, 2]}
        flag, ps = 0, set(content.split(' '))
        cache = openCode[cfg[m][0]: cfg[m][1]]
        for cs in ps:
            if len(cs) != len(cache): continue
            num = [i for i in range(len(cache)) if cache[i] == cs[i]]
            if len(num) == len(cache): flag += 1 
            
        # 相同投注号码金额只算一次
        return True if flag > 0 else False
        
    def zux(self, m, openCode, content):
        rng = {'sanxzs': [0, 3], 'sanxzl': [0, 3], 'exzuxfsh': [1, 3], 'exzuxfsq': [0, 2]}[m]
        src = set(list(content.split(",")))
        code = openCode[rng[0]:rng[1]]
        for c in code:
            if c not in src: return False
        
        return True
    
    def bdw(self, m, openCode, content):
        rng = {'yimabdw': [0, 3]}[m]
        code = openCode[rng[0]:rng[1]]
        count, cache = 0, set(content.split(","))
        
        for c in set(code):
            if c in cache: count += 1
            
        return count
    
    def dwd(self, m, code, content):
        cfg = {'dwd': 1}
        ps = content.split(",")
        flag = 0
        
        for i, c in enumerate(code):            
            if ps[i] == "-": continue
            p = set(list(ps[i]))
            if c in p: flag += 1
            
        return len(list(itertools.combinations(range(flag), cfg[m])))
      
    '''混合组选、二星组选'''
    def hhzx(self, m, openCode, content):
        cfg = {'sanxhhzx': [[0, 3]], 'exzuxdsh': [[1, 3]], 'exzuxdsq': [[0, 2]]}
        rng = cfg[m][0] 
        code = openCode[rng[0]: rng[1]]
        ps = set(content.split(' '))
        
        return WinSSC()._check_hhzx(code, ps)
    
    def Detection(self, m, openCode, content):
        code = openCode.split(",")
        
        if m in set(['sanxzhixfs', 'exzhixfsh', 'exzhixfsq']):
            return self.zhixfs(m, code, content)
        if m in set(['sanxzhixhz', 'exzhixhzh', 'exzhixhzq']):
            return self.zhixhz(m, code, content)
        elif m in set(['sanxzs', 'sanxzl', 'exzuxfsq', 'exzuxfsh']):
            return self.zux(m, code, content)
        elif m in set(['dwd']):
            return self.dwd(m, code, content)
        elif m in set(['yimabdw']):
            return self.bdw(m, code, content)
        elif m in set(["sanxzhixds", 'exzhixdsh', 'exzhixdsq']):
            return self.zhixds(m, code, content)
        elif m in set(["sanxhhzx", 'exzuxdsh', 'exzuxdsq']):
            return self.hhzx(m, code, content)
        print 'No Hit', m, openCode, content
        return False
        
def test():
    w = WinD3()
    
    print False, w.Detection("sanxzhixfs", "5,0,6", "4,5,67")
    print True, w.Detection("exzhixfsh", "5,6,8", "-,67,78")
    print False, w.Detection("exzhixfsq", "5,3,4", "3,34,-")
    print True, w.Detection("exzhixfsq", "3,3,4", "3,34,-")
    print True, w.Detection("sanxzhixhz", "5,0,6", "4,11,23")
    print True, w.Detection("exzhixhzh", "5,0,6", "4,5,6")
    print False, w.Detection("exzhixhzq", "1,0,6", "4,5,6")
    
    print True, w.Detection("sanxzs", "5,5,6", "5,6,7")
    print False, w.Detection("sanxzl", "5,0,6", "5,6,8")
    print True, w.Detection("sanxzl", "5,0,6", "5,6,0")
    print True, w.Detection("exzuxfsq", "2,0,7", "0,2,6,9")
    print True, w.Detection("exzuxfsh", "1,0,6", "6,0")
    print 1, w.Detection("dwd", "5,1,6", "3,14,-")
    print 2, w.Detection("yimabdw", "5,0,6", "0,2,5")
    
    print 0, w.Detection("sanxzhixds", "5,0,6", "108 112 223")
    print 1, w.Detection("sanxzhixds", "5,0,6", "506 112 506")
    
    print 0, w.Detection("exzhixdsh", "5,0,6", "10 12 23")
    print 1, w.Detection("exzhixdsh", "5,0,6", "06 11 506")
    print 0, w.Detection("exzhixdsq", "5,0,6", "06 12 23")
    print 1, w.Detection("exzhixdsq", "5,0,6", "50 12 506")
    
    print '-------------------Test for 混合组选-----------------'
    print 0, w.Detection("sanxhhzx", "1,3,3", "711 713 13")
    print 1, w.Detection("sanxhhzx", "1,3,3", "133")
    print 1, w.Detection("sanxhhzx", "1,3,3", "711 331 313")
    print 1, w.Detection("sanxhhzx", "1,3,3", "331 133 331")
    print 1, w.Detection("sanxhhzx", "1,2,3", "3211 213 123")
    print 1, w.Detection("sanxhhzx", "1,2,3", "321 213 123")
    
    print 0, w.Detection("exzuxdsh", "1,2,3", "31 123 123")
    print 1, w.Detection("exzuxdsh", "1,2,3", "32 23 123")
    print 1, w.Detection("exzuxdsq", "1,2,3", "21 21 12")
    
    
if __name__ == '__main__':
    test()
