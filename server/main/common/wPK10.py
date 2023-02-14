#coding:utf8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import itertools

class WinPK10():
    '''
    classdocs
    '''
    
    def __init__(self):
        '''
        '''
    
    def dwd(self, m, openCode, content):
        rng = {'dwqian': [0, 5], 'dwhou': [5, 10]}[m]
        code = openCode[rng[0]:rng[1]]
        ps = content.split(",")
        flag = 0
        
        for i, c in enumerate(code):            
            if ps[i] == "-": continue
            p = set(ps[i].split(' '))
            if c in p: flag += 1
            
        return len(list(itertools.combinations(range(flag), 1)))
    
    def qianhz(self, m, openCode, content):
        rng = {'qianerhz': [0, 2], 'qiansanhz': [0, 3]}[m]
        code = openCode[rng[0]:rng[1]]
        sumO = sum(int(c) for c in code)
        
        return str(sumO) in set(content.split(","))
    
    def qian(self, m, openCode, content):
        rng = {'qianyi': [0, 1], 'qianerzxfs': [0, 2], 'qiansanzxfs': [0, 3], 'qiansizxfs': [0, 4],
               'qianwuzxfs': [0, 5]}[m]
        code = openCode[rng[0]:rng[1]]
        '''特殊情况'''
        if m == 'qianyi': content = content.replace(',', ' ')
        ps = content.split(",")
        for i, c in enumerate(code):    
            p = set(ps[i].split(' '))
            if c not in p: return False
        
        return True
    
    # 定单双
    def dds(self, m, openCode, content):
        cfg = dict(('dsd' + str(i + 1), i) for i in range(10))
        c = openCode[cfg[m]]
        flag = '单' if int(c) % 2 else '双'
        
        return flag in set(c.encode('utf8') for c in content.split("|"))
        
    # 定大小
    def ddx(self, m, openCode, content):
        cfg = dict(('dxd' + str(i + 1), i) for i in range(10))
        c = openCode[cfg[m]]
        flag = '大' if int(c) > 5 else '小'
        
        return flag in set(c.encode('utf8') for c in content.split("|"))
    
    # 龙虎
    def lh(self, m, openCode, content):
        cfg = {'lhd1': 0, 'lhd2': 1, 'lhd3': 2, 'lhd4': 3, 'lhd5': 4}
        c1, c2 = openCode[cfg[m]], openCode[9 - cfg[m]]
        flag = '龙' if int(c1) > int(c2) else '虎'
        
        return flag in set(c.encode('utf8') for c in content.split("|"))
    
        
    
    def Detection(self, m, openCode, content):
        content = content.encode('utf8')
        code = openCode.split(",")
        stop = set(["qianerzxds", "qiansanzxds", "qiansizxds", "qianwuzxds"])
        if m in stop: return False
        
        if m in set(['dwqian', 'dwhou']):
            return self.dwd(m, code, content)
        elif m in set(['qianyi', 'qianerzxfs', 'qiansanzxfs', 'qiansizxfs', 'qianwuzxfs']):
            return self.qian(m, code, content)
        elif m in set(['qianerhz', 'qiansanhz']):
            return self.qianhz(m, code, content)
        elif m in set(['dxd1', 'dxd2', "dxd3", "dxd4", "dxd5", "dxd6", "dxd7", "dxd8", "dxd9", "dxd10"]):
            return self.ddx(m, code, content)
        elif m in set(['dsd1', 'dsd2', "dsd3", "dsd4", "dsd5", "dsd6", "dsd7", "dsd8", "dsd9", "dsd10"]):
            return self.dds(m, code, content)
        elif m in set(['lhd1', 'lhd2', 'lhd3', 'lhd4', 'lhd5']):
            return self.lh(m, code, content)
        
        print 'No Hit'
        return False
        
def test():
    w = WinPK10()
    
    [
        ['dwqian', '03,04,06 07,-,-'], ['dwhou', '06 08,08,09,-,-'], ['qianyi', '04,05'],
        ['qianerzxfs', '04,04 05'], ['qianerhz', '9,13'], 
        ['qiansanzxfs', '05 06,05,04 05'], ['qiansanhz', '11,12'], 
        ['qiansizxfs', '06 08,08,09,08 10'], ['qianwuzxfs', '01 02 03 04 05,06,04,03,05'], 
        ['dxd6', '大|小'], ['dxd10', '大|小'],
        ['dsd1', '单|双'], ['dsd8', '单|双'],
        ['lhd1', '龙|虎'], ['lhd2', '龙|虎'], ['lhd5', '龙|虎']
    ]
    
    print 2, w.Detection("dwqian", "09,08,04,01,06,02,07,05,03,10", "09,07,01 04,-,-")
    print 2, w.Detection("dwhou", "09,08,04,01,06,02,07,05,03,10", "-,07,08,07,06 10")
    print True, w.Detection("qianyi", "09,08,04,01,06,02,07,05,03,10", "02,09")
    print True, w.Detection("qianerzxfs", "09,08,04,01,06,02,07,05,03,10", "02 09,03 08")
    print True, w.Detection("qiansanzxfs", "09,08,04,01,06,02,07,05,03,10", "05 09,08,04 05")
    print False, w.Detection("qiansizxfs", "09,08,04,01,06,02,07,05,03,10", "06 08,08,04,01 10")
    print True, w.Detection("qianwuzxfs", "09,08,04,01,06,02,07,05,03,10", "01 02 03 04 09,08,04,01,06")
    print True, w.Detection("qianerhz", "09,08,04,01,06,02,07,05,03,10", "9,17")
    print True, w.Detection("qiansanhz", "09,08,04,01,06,02,07,05,03,10", "11,21")
    print True, w.Detection("dsd1", "09,08,04,01,06,02,07,05,03,10", "单|双")
    print False, w.Detection("dsd5", "09,08,04,01,06,02,07,05,03,10", "单")
    print True, w.Detection("dxd1", "09,08,04,01,06,02,07,05,03,10", "大|小")
    print False, w.Detection("dxd5", "09,08,04,01,06,02,07,05,03,10", "小")
    print False, w.Detection("lhd1", "09,08,04,01,06,02,07,05,03,10", "龙")
    print True, w.Detection("lhd5", "09,08,04,01,06,02,07,05,03,10", "龙")
    
    
    
if __name__ == '__main__':
    test()
    