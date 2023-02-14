#coding: utf8

from utils import ComNum, ComVal, intersect, _HHZXCheck_Num, _True, checkAllNum, Length, unique, toString
import re

class D3Utils(): 
    # 3D系列工具类
    # 输入框类型检测
    @staticmethod
    def _inputCheck_Num (datasel, l, fun = _True, sort = False):
        newsel = []; # 新的号码
        if (sort): # 如果需要号码排序
            sortsel = [];
            for n in datasel:
                sortsel.append(toString(sorted([int(c) for c in list(n)])).replace(',', ''))
            datasel = sortsel;

        datasel = unique(datasel); # 去除重复
        pattern = re.compile('^[0-9]{' + str(l) + '}$');
        for n in datasel:
            if re.search(pattern, n) and fun(n, l):
                newsel.append(n)
                
        return Length(newsel)
    
    # 和值检测
    @staticmethod
    def _HHZXCheck_Num (n, l):
        a = [];
        if (l == 2):#两位
            a = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
        else: #三位[默认]
            a = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
        
        return True if n not in a else False

    # 多少注计算
    @staticmethod
    def _inputNumbers (_type, datasel):
        nums, tmp_nums = 0, 1;
        # 输入号
        if _type == 'sanxzhixds':
            nums = D3Utils._inputCheck_Num(datasel, 3).length;
        elif _type == 'sanxhhzx':
            nums = D3Utils._inputCheck_Num(datasel, 3, _HHZXCheck_Num, True).length;
        elif _type == 'exzhixdsh' or _type == 'exzhixdsq':
            nums = D3Utils._inputCheck_Num(datasel, 2).length;
        elif _type == 'exzuxdsh' or _type == 'exzuxdsq':
            nums = D3Utils._inputCheck_Num(datasel, 2, _HHZXCheck_Num, True).length;
        elif _type == 'sanxzs':
            maxplace = 1;
            for i in range(maxplace):
                s = len(datasel[i]);
                # 组三必须选两位或者以上
                if (s > 1):
                    nums += s * (s - 1);
        elif _type == 'sanxzl':
            maxplace = 1;
            for i in range(maxplace):
                s = len(datasel[i]);
                # 组六必须选三位或者以上
                if (s > 2):
                    nums += s * (s - 1) * (s - 2) / 6;
        elif _type == 'sanxzhixhz' or _type == 'exzhixhzh' or _type == 'exzhixhzq':
            cc = {
                0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, \
                10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, \
                19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1
            };
            if (_type == 'exzhixhzh' or _type == 'exzhixhzq'):
                cc = {
                    0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, \
                    10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1
                };
            for i in range(len(datasel[0])):
                nums += cc[int(datasel[0][i], 10)];
        elif _type == 'dwd': #定位胆所有在一起特殊处理
            maxplace = 3;
            for i in range(maxplace):
                nums += len(datasel[i]);
        elif _type == 'exzuxfsh' or _type == 'exzuxfsq':
            maxplace = 1;
            for i in range(maxplace):
                s = len(datasel[i]);
                # 二码不定位必须选两位或者以上
                if (s > 1):
                    nums += s * (s - 1) / 2;
        else:
            maxplace = 0;
            if _type == "sanxzhixfs":
                maxplace = 3;
            elif _type == "exzhixfsh" or _type == "exzhixfsq":
                maxplace = 2;
            elif _type == "yimabdw":
                maxplace = 1;
            if (len(datasel) == maxplace):
                for i in range(maxplace):
                    # 有位置上没有选择
                    if (len(datasel[i]) == 0):
                        tmp_nums = 0;
                        break;
                    tmp_nums *= len(datasel[i]);
                nums += tmp_nums;
        return nums;

    @staticmethod
    def _formatSelect_Num (datasel, m, n):
        newsel = [];
        if (not m): m = 0;
        if (not n): n = 0;
        for i in range(m):
            newsel.append('-');
        for i in range(len(datasel)):
            f = toString(datasel[i]).replace(',', '');
            if (f == ''):
                newsel.append('-');
            else:
                newsel.append(f);
        for i in range(n):
            newsel.append('-');

        return toString(newsel);
    
    @staticmethod
    def _formatTextarea_Num (_type, datasel):
        if _type == 'sanxzhixds':
            datasel = D3Utils._inputCheck_Num(datasel, 3);
        elif _type == 'sanxhhzx':
            datasel = D3Utils._inputCheck_Num(datasel, 3, _HHZXCheck_Num, True);
        elif _type == 'exzhixdsh' or _type == 'exzhixdsq':
            datasel = D3Utils._inputCheck_Num(datasel, 2);
        elif _type == 'exzuxdsh' or _type == 'exzuxdsq':
            datasel = D3Utils._inputCheck_Num(datasel, 2, _HHZXCheck_Num, True);
        
        return toString(datasel).replace(',', ' ');
    
    @staticmethod
    def _inputFormat (_type, datasel):
        if _type == 'sanxzhixds' or _type == 'sanxhhzx' or _type == 'exzhixdsh' or _type == 'exzhixdsq' or _type == 'exzuxdsh' or _type == 'exzuxdsq':
            return D3Utils._formatTextarea_Num(_type, datasel);
        elif _type == 'sanxzs' or _type == 'sanxzl' or _type == 'exzuxfsh' or _type == 'exzuxfsq' or _type == 'yimabdw' or _type == 'sanxzhixhz' or _type == 'exzhixhzh' or _type == 'exzhixhzq':
            return toString(datasel);
        elif _type == 'sanxzhixfs':
            return D3Utils._formatSelect_Num(datasel);
        elif _type == 'exzhixfsh':
            return D3Utils._formatSelect_Num(datasel, 1);
        elif _type == 'exzhixfsq':
            return D3Utils._formatSelect_Num(datasel, 0, 1);
        else:
            return D3Utils._formatSelect_Num(datasel);
    
    @staticmethod
    def CalcBetTimes(method, content):
        datasel = []
        if method in set(['sanxzhixfs', 'dwd']):
            datasel = [list(p) for p in content.split(",")]
        elif method in set(['sanxzhixhz', 'sanxzs', 'sanxzl', 'exzuxfsh',
                            'exzhixhzh', 'exzhixhzq', "exzuxfsq", 'yimabdw']):
            datasel.append(content.split(","))
        elif method in set(['sanxzhixds', 'sanxhhzx', 'exzhixdsh', 'exzuxdsh', 'exzhixdsq',
                            'exzuxdsq']):
            datasel = content.split(" ")
        elif method in set(['exzhixfsh', 'exzhixfsq']):
            datasel = [list(p) for p in content.split(",") if p != "-"]
            
        return int(D3Utils._inputNumbers(method, datasel))
    
    
    '''End Def'''
'''End Class'''


if __name__ == '__main__':
    td = [
        [4, "sanxzhixfs", "7,67,59"],
        [3, "sanxzhixhz", "6,7,8,9"],
        [12, "sanxzs", "2,3,4,5"],
        [1, "sanxzl", "3,4,5,6"],
        [3, "sanxhhzx", "123 345 346"],
        [4, "exzhixfsh", "-,67,23"],
        [3, "exzhixdsh", "12 44 65"],
        [27, "exzhixhzh", "7,9,10"],
        [3, "exzuxfsh", "1,5,7"],
        [2, "exzuxdsh", "12 23"],
        [4, "exzhixfsq", "67,35,-"],
        [2, "exzhixdsq", "12 13"],
        [32, "exzhixhzq", "6,7,8,11"],
        [6, "exzuxfsq", "4,5,6,9"],
        [2, "exzuxdsq", "12 36"],
        [6, "dwd", "68,45,16"],
        
        [4, "yimabdw", "3,4,6,8"],
        
        
        
    ]
    for d in td:
        print d[0], D3Utils.CalcBetTimes(d[1], d[2])
        
        
        
