#coding:utf8

import sys
sys.path.append('..')
from utils import ComNum, ComVal, intersect
from games.gameList import GameList

from common.tSSC import SscUtils
from common.t11X5 import X511Utils
from common.tK3 import K3Utils
from common.tD3 import D3Utils
from common.tK8 import K8Utils
from common.tPK10 import PK10Utils


def _HHZXCheck_Num(n, l):
    a = []
    if l == 2: # 两位
        a = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99']
    else: # 三位[默认]
        a = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999']
    
    return n not in a

def checkAllNum(txt):
    s = str(txt)
    tp = dict((i, 1) for i in range(10))
    for e in s:
        if e not in tp: return False
    return True
    
def _True(): return True
    

class Length():
    def __init__(self, ary):
        self.length = len(ary)
        return len(ary)


def GetTool(name):        
    tp = GameList[name]['type']
    return [SscUtils, X511Utils, K3Utils, D3Utils, K8Utils, PK10Utils][tp - 1]

'''        

    
'''

 
if __name__ == '__main__':
#     print len([e for e in [1, 2, 3] if e > 1])
#     print range(8, 10)
#   
#     print ComNum(9, 3)
    test = [['sxzhixfsz', '-,5,7,3,-'], ['sxzhixfsz', '-,5,76,3,-'], ['sxzhixfsz', '-,5,76,3,-'],
            ['rx2zx', '[-,-,-,√,√]4,5,6,7'], ['lhwq', '龙|虎'], ['qwyffs', '1,2,5'], ['dw', '6,-,7,-,-']]
    # print test[0][1].split(",")
    
    idx = len(test)
    
    for i in range(idx):
        print CalcBetTimes(test[i][0], test[i][1])
    
    
    