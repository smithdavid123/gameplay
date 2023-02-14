#coding:utf8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import itertools

class Win11X5():
    '''
    classdocs
    '''
    
    def __init__(self):
        '''
        Constructor
        [
            "sanmzhixfsq", "sanmzhixdsq", "sanmzuxfsq", "sanmzuxdsq", "ermzhixfsq", "ermzhixdsq", "ermzuxfsq", \
            "ermzuxdsq", "bdw", "dwd", "dds", "czw", "rx1fs", "rx1ds", "rx2fs", "rx2ds", "rx3fs", "rx3ds", "rx4fs", \
            "rx4ds", "rx5fs", "rx5ds", "rx6fs", "rx6ds", "rx7fs", "rx7ds", "rx8fs", "rx8ds"
        ]
        '''

    
    '''直选复式'''
    def zhixfs(self, m, code, content):
        ps = content.split(",")
        for i, c in enumerate(code):
            if ps[i] == "-": continue
            p = set(ps[i].split(" "))
            if c not in p: return False
        
        return True
    
    '''直选单式'''
    def zhixds(self, m, openCode, content):
        rng = {'sanmzhixdsq': [0, 3], 'ermzhixdsq': [0, 2]}[m]
        code = ' '.join(openCode[rng[0]:rng[1]])
        for line in content.split(';'):
            if line == code: return True
        
        return False
    
    '''组选单式'''
    def zuxds(self, m, openCode, content):
        rng = {'sanmzuxdsq': [0, 3], 'ermzuxdsq': [0, 2]}[m]
        code = frozenset(openCode[rng[0]:rng[1]])
        flag = 0
        for line in content.split(';'):
            cs = line.split(' ')
            if len(cs) != len(code): continue
            if frozenset(cs) == code: flag += 1
        
        return flag
    
    def zux(self, m, openCode, content):
        rng = {'sanmzuxfsq': [0, 3], 'ermzuxfsq': [0, 2]}[m]
        src = set(list(content.split(",")))
        code = openCode[rng[0]:rng[1]]
        for c in code:
            if c not in src: return False
        
        return True
    
    def bdw(self, m, openCode, content):
        rng = {'bdw': [0, 3]}[m]
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
            p = set(ps[i].split(' '))
            if c in p: flag += 1
            
        return len(list(itertools.combinations(range(flag), cfg[m])))
    
    def rxfs(self, m, code, content):
        cfg = {'rx1fs': 1, 'rx2fs': 2, "rx3fs": 3, "rx4fs": 4, "rx5fs": 5, "rx6fs": 5, \
               "rx7fs": 5, "rx8fs": 5}
        cache = set(content.split(","))
        flag = 0
        for i, c in enumerate(code):
            if c in cache: flag += 1 
        
        return len(list(itertools.combinations(range(flag), cfg[m])))
    
    '''任选单式'''
    def rxds(self, m, code, content):
        cfg = {'rx1ds': 1, 'rx2ds': 2, "rx3ds": 3, "rx4ds": 4, "rx5ds": 5, "rx6ds": 5, \
               "rx7ds": 5, "rx8ds": 5}
        cache = set(code) 
        flag = 0
        for p in content.split(";"):
            cp = set(p.split(" "))
            if len(cp) != cfg[m] and (cfg[m] < 5 or m == 'rx5ds'): continue
            if len(cp & cache) == cfg[m]: flag += 1

        return flag
    
    # 定单双
    def dds(self, m, openCode, content):
        ps = set(c.encode('utf8') for c in content.split("|"))
        ds = [0, 0]
        for c in openCode:
            ds[1 - int(c) % 2] += 1
        tar = str(ds[0]) + "单" + str(ds[1]) + "双"
        
        indexs = {'5单0双': 0, '4单1双': 1, '3单2双': 2, '2单3双': 3, '1单4双': 4, '0单5双': 5}
        
        # 区间赔率特殊情况，原：return tar in ps
        return [tar in ps, indexs[tar]]
    
    # 猜中位
    def czw(self, m, openCode, content):
        tar = sorted([int(c) for c in openCode])[2]
        src = set([int(c) for c in content.split(",")])
        
        # indexs = {'3': 0, '4': 1, '5': 2, '6': 3, '7': 4, '8': 5, '9': 6}
        # 区间赔率特殊情况，原：return tar in src
        # 因数据库配置项不能一一对应，暂不处理，终： return [tar in src, indexs[str(tar)]]
        return tar in src
    
    def Detection(self, m, openCode, content):
        content = content.encode('utf8')
        code = openCode.split(",")
        
        if m in set(['sanmzhixfsq', 'ermzhixfsq']):
            return self.zhixfs(m, code, content)
        elif m in set(['sanmzuxfsq', 'ermzuxfsq']):
            return self.zux(m, code, content)
        elif m in set(['bdw']):
            return self.bdw(m, code, content)
        elif m in set(['dwd']):
            return self.dwd(m, code, content)
        elif m in set(['dds']):
            return self.dds(m, code, content)
        elif m in set(['czw']):
            return self.czw(m, code, content)
        elif m in set(['rx1fs', 'rx2fs', "rx3fs", "rx4fs", "rx5fs", "rx6fs", "rx7fs", "rx8fs"]):
            return self.rxfs(m, code, content)
        elif m in set(["rx1ds", "rx2ds", "rx3ds", "rx4ds", "rx5ds", "rx6ds", "rx7ds", "rx8ds"]):
            return self.rxds(m, code, content)
        elif m in set(['sanmzhixdsq', 'ermzhixdsq']):
            return self.zhixds(m, code, content)
        elif m in set(['sanmzuxdsq', 'ermzuxdsq']):
            return self.zuxds(m, code, content)
        
        print 'No Hit'
        return False
        
def test():
    w = Win11X5()
    
    [
        ['sanmzhixfsq', '06,07,08 09,-,-'], ['sanmzuxfsq', '05,06,07,08'], ['ermzhixfsq', '02,04 05,-,-,-'],
        ['ermzuxfsq', '04,05,06'], ['bdw', '02,03,04'], ['dwd', '02,03,04,-,-'], ['dds', '5单0双|4单1双'],
        ['czw', '05,06'], ['rx1fs', '03,04'], ['rx2fs', '04,06,08'], ['rx3fs', '05,06,07'],
        ['rx5fs', '05,06,07,08,10,11'], ['rx8fs', '03,04,05,06,07,08,09,10,11']
    ]
    # print list(itertools.combinations(range(3), 3))
    '''注：以下测试用例有不一致的地方不影响实际应用，因为开奖结果5个数不会重复'''
    print True, w.Detection("sanmzhixfsq", "06,07,09,01,05", "06,07,08 09,-,-")
    print True, w.Detection("sanmzuxfsq", "07,05,06,08,06", "05,06,07,08")
    print False, w.Detection("ermzhixfsq", "04,05,02,02,05", "02,04 05,-,-,-")
    print True, w.Detection("ermzhixfsq", "02,05,02,02,05", "02,04 05,-,-,-")
    print True, w.Detection("ermzuxfsq", "04,05,07,06,05", "04,05,06")
    print True, w.Detection("ermzuxfsq", "05,04,06,06,05", "04,05,06")
    print 2, w.Detection("bdw", "02,02,04,02,02", "02,03,04")
    print 2, w.Detection("dwd", "02,03,03,07,02", "02,03,04,-,-")
    print True, w.Detection("dds", "07,07,07,01,02", "5单0双|4单1双")
    print False, w.Detection("czw", "07,05,08,09,02", "05,06")
    print 1, w.Detection("rx1fs", "07,05,06,06,06", "03,06")
    print 3, w.Detection("rx2fs", "07,01,01,06,04", "04,06,01")
    print 1, w.Detection("rx3fs", "07,01,05,06,02", "05,06,07")
    print 1, w.Detection("rx5fs", "07,07,02,01,05", "05,02,07,01,10,11")
    print 1, w.Detection("rx8fs", "07,07,02,01,05", "02,01,05,06,07,08,09,10,11")
    print 2, w.Detection("rx1ds", "07,03,02,01,05", "07;02")
    print 1, w.Detection("rx1ds", "07,06,02,01,05", "03 02;02")
    print 2, w.Detection("rx5ds", "07,08,02,01,05", "07 08 02 01 05;08 07 02 01 05")
    print 1, w.Detection("rx8ds", "07,08,02,01,05", "07 08 02 01 05 06 03;01 02 03 04 05 06 07")
    print 2, w.Detection("rx8ds", "07,08,02,01,05", "07 08 02 01 05 06 03 11;01 02 03 04 05 06 07 08")
    print True, w.Detection("sanmzhixdsq", "07,08,02,01,05", "07 08 02;01 05 06;01 02 03")
    print False, w.Detection("sanmzhixdsq", "07,08,02,01,05", "07 02 08;01 05 06;01 02 03")
    print True, w.Detection("ermzhixdsq", "07,08,02,01,05", "02 03;07 08")
    print 0, w.Detection("sanmzuxdsq", "07,08,02,01,05", "02 01 05;07 08")
    print 2, w.Detection("sanmzuxdsq", "07,08,02,01,05", "07 02 08;07 08 02")
    print 0, w.Detection("ermzuxdsq", "07,08,02,01,05", "02 03;02 08")
    print 1, w.Detection("ermzuxdsq", "07,08,02,01,05", "08 07;07 08 02;02 01")
    print 1, w.Detection("ermzuxdsq", "07,08,02,01,05", "08 07;07 08 08;02 01")
    
if __name__ == '__main__':
    test()
#     print frozenset([1, 2]) == frozenset([2, 1, 0])
    