#coding:utf8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import itertools

class WinK8():
    '''
    classdocs
    '''
    
    def __init__(self):
        '''
            ["hezhids", "趣味", "和值单双"]
            ["hezhidx", "趣味", "和值大小"]
            ["jopan", "趣味", "奇偶盘"]
            ["sxpan", "趣味", "上下盘"]
            ["hzdxds", "趣味", "和值大小盘"]
            ["rx1", "任选", "任选1"]
            ["rx2", "任选", "任选2"]
            ["rx3", "任选", "任选3"]
            ["rx4", "任选", "任选4"]
            ["rx5", "任选", "任选5"]
            ["rx6", "任选", "任选6"]
            ["rx7", "任选", "任选7"]
            ["hezhiwx", "五行", "五行"]
        '''
    
    def Detection(self, m, openCode, content):
        content = content.encode('utf8')
        code = openCode.split(",")
        sumNum = sum([int(c) for c in code])
        stop = set(["ebthds", "ethds", "sbthds", "", "", "", ""])
        if m in stop: return False
        
        if m in set(['hezhids']):
            '''和值单双'''
            flag = '单' if sumNum % 2 else '双'
            return flag in set(c.encode('utf8') for c in content.split("|"))
        elif m in set(['hezhidx']):
            '''和值大小'''
            flag = '大' if sumNum > 810 else ('和' if sumNum == 810 else '小')
            return flag in set(c.encode('utf8') for c in content.split("|"))
        elif m in set(['jopan']):
            '''奇偶'''
            cj = len([c for c in code if int(c) % 2])
            co = len(code) - cj
            flag = '奇' if cj > co else ('和' if cj == co else '偶')
            return flag in set(c.encode('utf8') for c in content.split("|"))
        elif m in set(['sxpan']):
            '''上下'''
            cu = len([c for c in code if int(c) < 41])
            cd = len(code) - cu
            flag = '上' if cu > cd else ('和' if cu == cd else '下')
            return flag in set(c.encode('utf8') for c in content.split("|"))
        elif m in set(['hzdxds']):
            '''和值大小'''
            dx = '大' if sumNum > 810 else ('和' if sumNum == 810 else '小')
            ds = '单' if sumNum % 2 else '双'
            return (dx + ds) in set(c.encode('utf8') for c in content.split("|"))
        elif m in set(['rx1', 'rx2', 'rx3', 'rx4', 'rx5', 'rx6', 'rx7']):
            '''任选'''
            cfg = {'rx1': 1, 'rx2': 2, 'rx3': 3, 'rx4': 4, 'rx5': 5, 'rx6': 6, 'rx7': 7}
            cache = set(code)
            flag = len([c for c in content.split(",") if c in cache])
            return len(list(itertools.combinations(range(flag), cfg[m])))
        elif m in set(['hezhiwx']):
            '''五行'''
            flag = '金'
            if sumNum > 695 and sumNum < 764:
                flag = '木'
            elif sumNum >= 764 and sumNum < 856:
                flag = '水'
            elif sumNum >= 856 and sumNum < 923:
                flag = '火'
            elif sumNum >= 924:
                flag = '土'
            return flag in set(c.encode('utf8') for c in content.split("|"))
        
        print 'No Hit', m, openCode, content
        return False
        
        
def test():
    w = WinK8()
    
    [
        ['hezhids', '单|双'], ['hezhidx', '小|和'], ['jopan', '和|偶'],
        ['sxpan', '下|上'], ['hzdxds', '大单|大双'], 
        ['rx1', '06,07,08,09,24,47,48,49,50,51'], 
        ['rx2', '06,07,08,09,24,47,48,49,50,51'], 
        ['rx3', '06,07,08,09,24,47,48,49,50,51'], 
        ['rx7', '06,07,08,09,24,47,48,49,50,51'], 
        ['hezhiwx', '金|木']
    ]
    print True, w.Detection("hezhids", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "单|双")
    print True, w.Detection("hezhidx", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "小|和")
    print True, w.Detection("jopan", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "和|偶")
    print False, w.Detection("jopan", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "奇")
    print True, w.Detection("sxpan", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "下|上")
    print False, w.Detection("hzdxds", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "大单|大双")
    print True, w.Detection("hzdxds", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "小单|小双")
    print 2, w.Detection("rx1", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "06,07,08,09,24,50,51")
    print 1, w.Detection("rx2", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "06,07,08,09,24,53")
    print 1, w.Detection("rx3", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "06,07,12,09,24,53")
    print 5, w.Detection("rx4", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "06,07,12,18,22,53")
    print 1, w.Detection("rx5", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "06,07,12,18,22,53")
    print 1, w.Detection("rx6", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "06,07,12,18,22,53,78")
    print 8, w.Detection("rx7", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "03,07,12,18,22,53,60,78")
    print True, w.Detection("hezhiwx", "01,03,07,12,18,21,22,32,36,41,45,48,49,50,52,53,56,58,60,78", "木|火")
    
    
if __name__ == '__main__':
    test()
