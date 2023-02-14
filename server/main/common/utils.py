#coding:utf8
import sys
sys.path.append('..')
from key import KEY
import math
from libs.redisEx2 import MyRedis as rs
from config import Config as C




class LotteryConfig():
    unitMoney = 1
    code = C.MAX_POINT_VALUE # 1998
    codeMax = C.MAX_POINT_VALUE
    codeMin = 1800
    point = C.MAX_POINT
    unitMoney = 1

class LotteryInfo():
    def __init__(self, line):
        self.id = line['id']
        self.showName = line['showName']
        self.shortName = line['shortName']
        self.frequency = line['frequency']
        self.type = line['type']
        self.times = line['times']
        self.stopDelay = line['stopDelay']
        self.downCode = line['downCode']
        self.fenDownCode = line['fenDownCode']
        self.liDownCode = line['liDownCode']
        self.floatBonus = line['floatBonus']
        self.maxBonus = line['maxBonus']
        self.sort = line['sort']
        self.status = line['status']
        self.description = line['description']
    '''
        "id":101,
        "showName":"重庆时时彩",
        "shortName":"cqssc",
        "frequency":"high",
        "type":1,
        "times":120,
        "stopDelay":0,
        "downCode":0,
        "fenDownCode":0,
        "liDownCode":0,
        "floatBonus":-10,
        "maxBonus":200000,
        "sort":0,
        "status":0,
        "description":"开奖时间"
    '''

class MethodInfoConfig():
    def __init__(self, line):
        self.status = line['status']
        self.bonus = line['bonus']
        self.rebate = line['rebate']

class MethodInfo():
    def __init__(self, line):
        self.id = line['id']
        self.type = line['type']
        self.group = line['group']
        self.name = line['name']
        self.methodName = line['methodName']
        self.minRecord = line['minRecord']
        self.maxRecord = line['maxRecord']
        self.totalRecord = line['totalRecord']
        self.sort = line['sort']
        self.status = line['status']
        self.bonus = line['bonus']
        self.oooNums = line['oooNums']
        self.oooBonus = line['oooBonus']
        self.rebate = line['rebate']
    '''
        "id":1,
        "type":1,
        "group":"五星",
        "name":"直选复式",
        "methodName":"wxzhixfs",
        "minRecord":1,
        "maxRecord":80000,
        "totalRecord":100000,
        "sort":0,
        "status":0,
        "bonus":"0.01",
        "oooNums":10000,
        "oooBonus":20000
    '''

         
class Bonus():
    methods = []
    ''' {lottery: LotteryInfo} '''
    Lotterys = {}
    Units = {'yuan': 1, 'jiao': 0.1, 'fen': 0.01, 'li': 0.001}
    cacheMethod = {}
    '''额外单独配置'''
    LotteryMethod = {}
    
    @staticmethod
    def getMethodLabel(t, m):
        if len(Bonus.methods) == 0:
            Bonus.methods = rs.hvals(KEY.Methods) 
        if len(Bonus.cacheMethod) == 0:
            for item in Bonus.methods: 
                if item['type'] not in Bonus.cacheMethod: Bonus.cacheMethod[item['type']] = {}
                Bonus.cacheMethod[item['type']][item['methodName']] = item
        if t not in Bonus.cacheMethod: return ''
        if m not in Bonus.cacheMethod[t]: return ''
        return Bonus.cacheMethod[t][m]['name']
        
    def __init__(self, lottery):
        if len(Bonus.Lotterys) == 0:
            games = rs.hvals(KEY.Games) 
            for line in games: Bonus.Lotterys[line['shortName']] = LotteryInfo(line)
            Bonus.methods = rs.hvals(KEY.Methods) 
            '''支持彩种玩法单独赔率设置'''
            MethodConfig = rs.hvals(KEY.MethodConfig)
            for line in MethodConfig:
                if line['lottery'] not in Bonus.LotteryMethod: Bonus.LotteryMethod[line['lottery']] = {}
                Bonus.LotteryMethod[line['lottery']][line['method']] = MethodInfoConfig(line)
                
        self.method_data = {}
        for line in Bonus.methods:
            if line['type'] != Bonus.Lotterys[lottery].type: continue
            self.method_data[line['methodName']] = MethodInfo(line)
            
        self.lottery = lottery
        self.lottery_data = Bonus.Lotterys[lottery]
        
    def updateBonus(self, method, code, model, useRange = False):
        if not self.method_data or not method: return None
        if method not in self.method_data: return None
        bonus = self.method_data[method].bonus
        '''单独赔率检查'''
        if self.lottery in Bonus.LotteryMethod:
            if method in Bonus.LotteryMethod[self.lottery]: 
                bonus = Bonus.LotteryMethod[self.lottery][method].bonus 
                
        unitMoney = LotteryConfig.unitMoney
        modelMoney = Bonus.Units[model]
        code = int(code)
        if code > LotteryConfig.codeMax: code = LotteryConfig.codeMax
        # 这里更新浮动奖金
        if self.lottery_data.floatBonus:
            code += self.lottery_data.floatBonus
            
        bonusArray = LotteryUtils.getBonus({
            'bonus': bonus,
            'unitMoney': unitMoney,
            'modelMoney': modelMoney,
            'code': code
        });
        minBonus = round(bonusArray[0], 3)

        if len(bonusArray) > 1:
            maxBonus = round(bonusArray[len(bonusArray) - 1], 3)
            '''暂时把最小赔率追加到最后，用于兼容暂时情况'''
            if useRange: return [round(e, 3) for e in bonusArray] + [minBonus]
        return minBonus

def GetRangeBonus():
    pass
    
# 彩票工具类
class LotteryUtils():
    @staticmethod
    def getCode(sysCode, sysPoint, point):
        return int(sysCode - (sysPoint - point) * 20);
    
    @staticmethod
    def getPoint(sysCode, sysPoint, code):
        return round(float(sysPoint - (sysCode - code) / 20), 1)
    
    @staticmethod
    def getBonus(opts):
        bonus = opts['bonus'];
        unitMoney = opts['unitMoney'];
        modelMoney = opts['modelMoney'];
        code = opts['code'];
        bonusArray = bonus.split(',');
        result = [];
        for d in bonusArray:
            tmpBonus = (code / float(d)) * (unitMoney / 2.0) * modelMoney;
            result.append(tmpBonus);
        
        result.sort();
        return result;
    
    
class Length():
    def __init__(self, ary):
        self.length = len(ary)
        # return len(ary)


def uniquelize(ary):
    return list(set(ary))        

def unique(ary):
    dt = list(set(ary))
    return sorted(dt)

def ComNum (n, m):
    m, n = int(m), int(n)
    if m < 0 or n < 0: 
        return 0
    
    if m == 0 or n == 0: 
        return 1
    
    if m > n: 
        return 0
    
    if m > (n / 2.0): 
        m = n - m
    
    result = 0.0
    for i in range(n - m + 1, n + 1):
        result += math.log(i)

    for i in range(1, m + 1): 
        result -= math.log(i)
    
    result = math.exp(result)
    return int(round(result))

# 组合值
def ComVal(source, m, x):
    n, lines, start = len(source), [], 0
    while m > 0:
        if m == 1: 
            lines.append(source[start + x])
            break
        
        for i in range(0, n - m + 1):
            cnm = ComNum(n - 1 - i, m - 1)
            if x <= cnm - 1:
                lines.append(source[start + i])
                start = start + (i + 1)
                n = n - (i + 1)
                m -= 1
                break
            else: 
                x = x - cnm
    return lines

# 求两个集合的交集
def intersect(a, b):
    return list(set(a) & set(b))

def checkAllNum(txt):
    s = str(txt)
    tp = dict((i, 1) for i in range(10))
    for e in s:
        if e not in tp: return False
    return True
    
def _True(n = 0, l = 0): 
    return True
    
def _HHZXCheck_Num(n, l):
    a = []
    if l == 2: # 两位
        a = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99']
    else: # 三位[默认]
        a = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999']
        
    return n not in a    

def toString(ary):
    if type(ary) == type(""): return str(ary)
    return ','.join([str(a) for a in ary])

    
if __name__ == '__main__':
    pass
    ssc = Bonus("t1s30")
    print ssc.updateBonus('sixzhixfsh', 1994, 'yuan')
#     print ssc.updateBonus('lhwq', 1996, 'fen')
#     print ssc.updateBonus('lhwq', 1996, 'fen', True)
#     print rs.hvals(KEY.MethodConfig)
    
    
