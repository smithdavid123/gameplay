#coding:utf8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import itertools

class WinK3():
    '''
    classdocs
    '''
    
    def __init__(self):
        '''
        ["标准选号", "ebthdx"]
        ["手动选号", "ebthds"]
        ["胆施选号", "ebthdt"]
        ["标准选号", "ethdx"]
        ["手动选号", "ethds"]
        ["二同号复选", "ethfx"]
        ["标准选号", "sbthdx"]
        ["手动选号", "sbthds"]
        ["单选", "sthdx"]
        ["通选", "sthtx"]
        ["通选", "slhtx"]
        ["和值", "hezhi"]
        '''
    
    def Detection(self, m, openCode, content):
        code = openCode.split(",")
        stop = set(["ebthds", "ethds", "sbthds", "", "", "", ""])
        if m in stop: return False
        
        if m in set(['ebthdx']):
            cache = set(code)
            flag = len([c for c in content.split(",") if c in cache])
            return len(list(itertools.combinations(range(flag), 2)))
        elif m in set(['ebthdt']):
            '''二不同·胆拖选号'''
            cache = set(code)
            ps = content.split(",")
            if ps[0] not in cache: return False
            flag = len([c for c in list(ps[1]) if c in cache])
            return flag
        elif m in set(['ethdx']):
            '''二同·单选'''
            times, semit = {}, {}
            ps = content.split(",")
            dfs = set(list(ps[1]))
            for c in code: times[c] = 1 if c not in times else times[c] + 1
            for c in times: 
                if times[c] not in semit: semit[times[c]] = []
                semit[times[c]].append(c)
            if len(times) != 2: return False
            return times.get(ps[0], 0) == 2 and len(semit[1]) == 1 and semit[1][0] in dfs
        elif m in set(['ethfx']):
            '''二不同·复选'''
            times, semit = {}, {}
            cache = set(content.split(","))
            for c in code: times[c] = 1 if c not in times else times[c] + 1
            for c in times: 
                if times[c] not in semit: semit[times[c]] = []
                semit[times[c]].append(c)
            return 2 in semit and semit[2][0] in cache
        elif m in set(['sbthdx']):
            '''三不同·单选'''
            cache = set(code)
            flag = len([c for c in content.split(",") if c in cache])
            return flag > 2
        elif m in set(['sthdx']):
            '''三同·单选'''
            cache = set(content.split(","))
            return code[0] == code[1] and code[1] == code[2] and code[0] in cache 
        elif m in set(['sthtx']):
            '''三同·通选'''
            return code[0] == code[1] and code[1] == code[2]
        elif m in set(['slhtx']):
            '''三连号'''
            return ''.join(code) in set(['123', '234', '345', '456'])
        elif m in set(['hezhi']):
            '''和值'''
            sumNum = sum([int(c) for c in code])
            return str(sumNum) in set(content.split(","))
        
        print 'No Hit', m, openCode, content
        return False
        
        
def test():
    w = WinK3()
    
    [
        ['ebthdx', '2,3,4'], ['ebthdt', '3,1245'], ['ethdx', '3,124'],
        ['ethfx', '2,3,4'], ['sbthdx', '2,3,4,5'], ['sthdx', '1,2'], 
        ['sthtx', '111,222,333,444,555,666'], ['slhtx', '123,234,345,456'],
        ['hezhi', '8,9']
    ]
    print 3, w.Detection("ebthdx", "2,3,5", "2,3,4,5")
    print 2, w.Detection("ebthdt", "2,3,5", "2,345")
    print True, w.Detection("ethdx", "2,2,5", "2,345")
    print True, w.Detection("ethfx", "2,2,5", "2,3,5")
    print True, w.Detection("sbthdx", "2,3,5", "2,3,4,5")
    print True, w.Detection("sthdx", "2,2,2", "2,3")
    print True, w.Detection("sthtx", "2,2,2", "111,222,333,444,555,666")
    print True, w.Detection("slhtx", "2,3,4", "111,222,333,444,555,666")
    print True, w.Detection("hezhi", "2,2,2", "6,8,9")
    
    
if __name__ == '__main__':
    test()
