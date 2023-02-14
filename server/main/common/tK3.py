#coding: utf8

from utils import ComNum, ComVal, intersect, _HHZXCheck_Num, _True, checkAllNum, Length, unique, toString
import re

class K3Utils(): 
    # 输入框类型检测
    @staticmethod
    def _inputCheck_Num (datasel, l, fun = _True):
        newsel = []; # 新的号码
        datasel = unique(datasel) # 去除重复
        
        pattern = re.compile('^[0-6]{' + l + '}$')
        for n in datasel:
            if re.search(pattern, n) and fun(n, l):
                newsel.append(n)
            
        return Length(newsel)
    
    # 2排不重复检测
    @staticmethod
    def _uniqueCheck (a, b):
        return True if len(intersect(a, b)) == 0 else False
    
    # 二同号单式
    @staticmethod
    def _ethdsCheck (n, l):
        if (l != 3): return False;
        first = n[0:1]
        second = n[1:2]
        third = n[2:3]
        if (first == second and second == third): return False;
        if (first == second or second == third or third == first): return True;
        return False;

    # 二不同号单式
    @staticmethod
    def _ebthdsCheck (n, l):
        if (l != 2): return False;
        first = n[0: 1];
        second = n[1: 2];
        if (first == second): return False;
        return True;

    # 三不同号单式
    @staticmethod
    def _sbthdsCheck (n, l):
        if (l != 3): return False;
        first = n[0: 1];
        second = n[1: 2];
        third = n[2: 3];
        if (first != second and second != third and third != first): return True;
        return False;

    # 多少注计算
    @staticmethod
    def _inputNumbers (_type, datasel):
        nums = 0;
        # 输入号
        if _type == 'ebthds':
            return K3Utils._inputCheck_Num(datasel, 2, K3Utils._ebthdsCheck).length;
        elif _type == 'ethds':
            return K3Utils._inputCheck_Num(datasel, 3, K3Utils._ethdsCheck).length;
        elif _type == 'sbthds':
            return K3Utils._inputCheck_Num(datasel, 3, K3Utils._sbthdsCheck).length;
        # 选号
        elif _type == 'ebthdx': # 二不同号，标准选号
            if (len(datasel[0]) >= 2):
                nums += ComNum(len(datasel[0]), 2);
        elif _type == 'ebthdt':
            maxplace = 2;
            if (len(datasel) == maxplace):
                if (K3Utils._uniqueCheck(datasel[0], datasel[1])):
                    for i in range(maxplace):
                        s = len(datasel[i]);
                        if (s > 0):
                            if (i > 0):
                                nums = len(datasel[i]);
                        else:
                            nums = 0;
        elif _type == 'ethdx':
            s = len(datasel);
            if (s > 1):
                a = len(datasel[0]);
                b = len(datasel[1]);
                if (a > 0 and b > 0):
                    if (K3Utils._uniqueCheck(datasel[0], datasel[1])):
                        nums = a * b;
        elif _type == 'ethfx':
            nums = len(datasel[0]);
        elif _type == 'sbthdx': # 三不同号单选
            if (len(datasel[0]) >= 3):
                nums += ComNum(len(datasel[0]), 3);
        elif _type == 'sthdx' or _type == 'hezhi': # 三同号单选， # 和值
            nums = len(datasel[0])
        elif _type == 'sthtx' or _type == 'slhtx': # 三同号通选，# 三连号通选
            nums = 1 if len(datasel[0]) > 0 else 0

        return nums
    '''End Def'''
    
    @staticmethod
    def _formatSelect_Num (datasel, m, n):
        newsel = [];
        if (not m): m = 0;
        if (not n): n = 0;
        for i in range(m):
            newsel.append('-');
        for i in range(len(datasel)):
            f = toString(datasel[i]).replace(',', '')
            if (f == ''):
                newsel.append('-');
            else:
                newsel.append(f);
        for i in range(n):
            newsel.append('-');
        
        return toString(newsel)
    
    @staticmethod
    def _formatTextarea_Num (_type, datasel):
        if _type == 'ebthds':
            datasel = K3Utils._inputCheck_Num(datasel, 2, K3Utils._ebthdsCheck);
        elif _type == 'ethds':
            datasel = K3Utils._inputCheck_Num(datasel, 3, K3Utils._ethdsCheck);
        elif _type == 'sbthds':
            datasel = K3Utils._inputCheck_Num(datasel, 3, K3Utils._sbthdsCheck);
        
        return toString(datasel).replace(',', ' ')
    
    @staticmethod
    def _inputFormat (_type, datasel):
        if _type == 'ebthds' or _type == 'ethds' or _type == 'sbthds':
            return K3Utils._formatTextarea_Num(_type, datasel);
        elif _type == 'ebthdx' or _type == 'ethfx' or _type == 'sbthdx' or _type == 'sthdx' or \
                _type == 'sthtx' or _type == 'slhtx' or _type == 'hezhi':
            return toString(datasel[0]);
        elif _type == 'ebthdt' or _type == 'ethdx':
            return K3Utils._formatSelect_Num(datasel);
    
    @staticmethod
    def CalcBetTimes(method, content):
        datasel = []
        if method in set(['ebthdx', 'ethfx', 'sbthdx', 'sthdx', 'sthtx', 'slhtx', 'hezhi']):
            datasel.append(content.split(","))
        elif method in set(['ebthdt', 'ethdx']):
            datasel = [list(p) for p in content.split(",")]
        # print datasel
        
        return int(K3Utils._inputNumbers(method, datasel))
    
    '''End Def'''
'''End Class'''

if __name__ == '__main__':
    td = [
        [3, "ebthdx", "2,3,4"],
        [3, "ebthdt", "5,12346"],
        [3, "ethdx", "4,356"],
        [3, "ethfx", "2,3,4"],
        [3, "sbthdx", "3,4,5,6"],
        [3, "sthdx", "1,2,3"],
        [3, "sthtx", "111,222,333,444,555,666"],
        [3, "slhtx", "123,234,345,456"],
        [3, "hezhi", "7,8,9,10"]
    ]
    for d in td:
        print K3Utils.CalcBetTimes(d[1], d[2])
    
    pass