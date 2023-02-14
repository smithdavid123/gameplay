#coding: utf8

from utils import ComNum, ComVal, intersect, _HHZXCheck_Num, _True, checkAllNum, Length, unique, toString, uniquelize
import re

class PK10Utils(): 
    # PK拾工具类
    # 输入框类型检测
    @staticmethod
    def _inputCheck_Num(datasel, l, fun = _True):
        newsel = []; # 新的号码
        datasel = unique(datasel); # 去除重复
        
        pattern = re.compile('^([0-9]{2}\\s{1}){' + (l - 1) + '}[0-9]{2}$');
        
        for n in datasel:
            if re.search(pattern, n) and fun(n, l):
                newsel.append(n)
            
        return Length(newsel)
    
    # 号码检测
    @staticmethod
    def _numberCheck_Num(n):
        t = n.split(' ');
        l = len(t);
        for i in range(l):
            if (int(t[i]) > 10 and int(t[i]) < 1):
                return False;
            for j in range(i + 1, l):
                if (int(t[i]) == int(t[j])):
                    return False;
        return True;

    # 检查号码是否不重复
    @staticmethod
    def _numberCheck_NoRepeat(array):
        oldLength = len(array);
        newLength = len(uniquelize(array));
        return oldLength == newLength;
    
    # 多少注计算
    @staticmethod
    def _inputNumbers(_type, datasel):
        nums, tmp_nums = 0, 1;
        # 输入号
        if _type == 'qianerzxds':
            return PK10Utils._inputCheck_Num(datasel, 2, PK10Utils._numberCheck_Num).length;
        elif _type == 'qiansanzxds':
            return PK10Utils._inputCheck_Num(datasel, 3, PK10Utils._numberCheck_Num).length;
        elif _type == 'qiansizxds':
            return PK10Utils._inputCheck_Num(datasel, 4, PK10Utils._numberCheck_Num).length;
        elif _type == 'qianwuzxds':
            return PK10Utils._inputCheck_Num(datasel, 5, PK10Utils._numberCheck_Num).length;
        # 选号
        elif _type == 'qianwuzxfs':
            if (len(datasel[0]) > 0 and len(datasel[1]) > 0 and len(datasel[2]) > 0 and \
                len(datasel[3]) > 0 and len(datasel[4]) > 0):
                for i in range(len(datasel[0])):
                    for j in range(len(datasel[1])):
                        for k in range(len(datasel[2])):
                            for l in range(len(datasel[3])):
                                for m in range(len(datasel[4])):
                                    if (PK10Utils._numberCheck_NoRepeat([datasel[0][i], datasel[1][j], datasel[2][k], \
                                                                    datasel[3][l], datasel[4][m]])):
                                        nums += 1;
        elif _type == 'qiansizxfs':
            if (len(datasel[0]) > 0 and len(datasel[1]) > 0 and len(datasel[2]) > 0 and len(datasel[3]) > 0):
                for i in range(len(datasel[0])):
                    for j in range(len(datasel[1])):
                        for k in range(len(datasel[2])):
                            for l in range(len(datasel[3])):
                                if (PK10Utils._numberCheck_NoRepeat([datasel[0][i], datasel[1][j], datasel[2][k], datasel[3][l]])):
                                    nums += 1;
        elif _type == 'qiansanzxfs':
            if (len(datasel[0]) > 0 and len(datasel[1]) > 0 and len(datasel[2]) > 0):
                for i in range(len(datasel[0])):
                    for j in range(len(datasel[1])):
                        for k in range(len(datasel[2])):
                            if (PK10Utils._numberCheck_NoRepeat([datasel[0][i], datasel[1][j], datasel[2][k]])):
                                    nums += 1;
        elif _type == 'qianerzxfs':
            if (len(datasel[0]) > 0 and len(datasel[1]) > 0):
                for i in range(len(datasel[0])):
                    for j in range(len(datasel[1])):
                        if (PK10Utils._numberCheck_NoRepeat([datasel[0][i], datasel[1][j]])):
                            nums += 1;
        elif _type == 'qianerhz' or _type == 'qiansanhz':
            cc = {
                6: 6, 7: 6, 8: 12, 9: 18, 10: 24, 11: 30, 12: 42, 13: 48, 14: 54, 15: 60, \
                16: 60, 17: 60, 18: 60, 19: 54, 20: 48, 21: 42, 22: 30, 23: 24, 24: 18, 25: 12, 26: 6, 27: 6
            }
            if (_type == 'qianerhz'):
                cc = {
                    3: 2, 4: 2, 5: 4, 6: 4, 7: 6, 8: 6, 9: 8, 10: 8, 11: 10, 12: 8, 13: 8, 14: 6, 15: 6, \
                    16: 4, 17: 4, 18: 2, 19: 2
            }
            for i in range(len(datasel[0])):
                nums += cc[int(datasel[0][i], 10)];
        elif _type == 'dingweidan':
            maxplace = 3;
            for i in range(maxplace):
                nums += len(datasel[i]);
        elif _type == 'dwqian' or _type == 'dwhou':
            maxplace = 5;
            for i in range(maxplace):
                nums += len(datasel[i]);
        else:
            maxplace = 0;
            if _type == 'qianyi' or _type == 'qianerhz' or _type == 'qiansanhz' or _type == 'dxd1' or \
                    _type == 'dxd2' or _type == 'dxd3' or _type == 'dxd4' or _type == 'dxd5' or _type == 'dxd6' \
                    or _type == 'dxd7' or _type == 'dxd8' or _type == 'dxd9' or _type == 'dxd10' \
                    or _type == 'dsd1' or _type == 'dsd2' or _type == 'dsd3' or _type == 'dsd4' or _type == 'dsd5' \
                    or _type == 'dsd6' or _type == 'dsd7' or _type == 'dsd8' or _type == 'dsd9' or _type == 'dsd10' \
                    or _type == 'lhd1' or _type == 'lhd2' or _type == 'lhd3' or _type == 'lhd4' or _type == 'lhd5':
                    maxplace = 1;
            if (len(datasel) == maxplace):
                for i in range(maxplace):
                    # 有位置上没有选择
                    if (len(datasel[i]) == 0):
                        tmp_nums = 0;
                    tmp_nums *= len(datasel[i]);
                nums += tmp_nums;
        return nums;

    @staticmethod
    def _formatSelect_Num(datasel, m, n):
        newsel = [];
        if (not m): m = 0;
        if (not n): n = 0;
        for i in range(m):
            newsel.append('-');
        for i in range(len(datasel)):
            f = toString(datasel[i]).replace(',', ' ');
            if (f == ''):
                newsel.append('-');
            else:
                newsel.append(f);
        for i in range(n):
            newsel.append('-');
        return toString(newsel);
    
    @staticmethod
    def _formatTextarea_Num(_type, datasel):
        if _type == 'qianerzxds':
            datasel = PK10Utils._inputCheck_Num(datasel, 2, PK10Utils._numberCheck_Num);
        elif _type == 'qiansanzxds':
            datasel = PK10Utils._inputCheck_Num(datasel, 3, PK10Utils._numberCheck_Num);
        elif _type == 'qiansizxds':
            datasel = PK10Utils._inputCheck_Num(datasel, 4, PK10Utils._numberCheck_Num);
        elif _type == 'qianwuzxds':
            datasel = PK10Utils._inputCheck_Num(datasel, 5, PK10Utils._numberCheck_Num);
        return toString(datasel).replace(',', ';');
    
    @staticmethod
    def _inputFormat(_type, datasel):
        if _type == 'qianyi' or _type == 'qianerhz' or _type == 'qiansanhz':
            return toString(datasel[0]);
        elif _type == 'qianerzxfs' or _type == 'qiansanzxfs' or _type == 'qiansizxfs' or _type == 'qianwuzxfs' \
            or _type == 'dingweidan' or _type == 'dwqian' or _type == 'dwhou':
            return PK10Utils._formatSelect_Num(datasel);
        elif _type == 'qianerzxds' or _type == 'qiansanzxds' or _type == 'qiansizxds' or _type == 'qianwuzxds':
            return PK10Utils._formatTextarea_Num(_type, datasel);
        elif _type == 'dxd1' or _type == 'dxd2' or _type == 'dxd3' or _type == 'dxd4' or _type == 'dxd5' \
            or _type == 'dxd6' or _type == 'dxd7' or _type == 'dxd8' or _type == 'dxd9' or _type == 'dxd10' \
            or _type == 'dsd1' or _type == 'dsd2' or _type == 'dsd3' or _type == 'dsd4' or _type == 'dsd5' \
            or _type == 'dsd6' or _type == 'dsd7' or _type == 'dsd8' or _type == 'dsd9' or _type == 'dsd10' \
            or _type == 'lhd1' or _type == 'lhd2' or _type == 'lhd3' or _type == 'lhd4' or _type == 'lhd5':
            return toString(datasel[0]).replace(',', '|');
    
    @staticmethod
    def CalcBetTimes(method, content):
        datasel = []
        if method in set(['dwqian', 'dwhou', 'qianerzxfs', 'qiansanzxfs', 'qiansizxfs', 'qianwuzxfs']):
            datasel = [[] if p == '-' else p.split(" ") for p in content.split(",")]
        elif method in set(['qianyi', 'qianerhz', 'qiansanhz']):
            datasel.append(content.split(","))
        elif method in set(['dxd1', 'dxd2', 'dxd3', 'dxd4', 'dxd5', 'dxd6', 'dxd7', 'dxd8', 'dxd9', 'dxd10', \
                            'dsd1', 'dsd2', 'dsd3', 'dsd4', 'dsd5', 'dsd6', 'dsd7', 'dsd8', 'dsd9', 'dsd10',
                            'lhd1', 'lhd2', 'lhd3', 'lhd4', 'lhd5']):
            datasel.append(content.split("|"))
        '''End If'''
        # print datasel
        
        return int(PK10Utils._inputNumbers(method, datasel))
        
    '''End Def'''
'''End Class'''

if __name__ == '__main__':
    td = [
        [30, "dwqian", "01 02 03 04 05 06 07 08 09 10,06 07 08 09 10,01 02 03 04 05,01 03 05 07 09,02 04 06 08 10"],
        [25, "dwhou", "06 07 08 09 10,01 02 03 04 05,01 03 05 07 09,02 04 06 08 10,01 03 05 07 09"],
        [3, "qianyi", "01,02,03"],
        [3, "qianerzxfs", "02 04,03 04"],
        [16, "qianerhz", "6,7,8"],
        [100, "qiansanzxfs", "06 07 08 09 10,01 02 03 04 05,01 03 05 07 09"],
        [162, "qiansanhz", "12,15,17"],
        [388, "qiansizxfs", "06 07 08 09 10,01 02 03 04 05,01 03 05 07 09,02 04 06 08 10"],
        [1164, "qianwuzxfs", "06 07 08 09 10,01 02 03 04 05,01 03 05 07 09,02 04 06 08 10,02 04 06 08 10"],
        [2, "dxd1", "大|小"],
        [2, "dxd2", "大|小"],
        [2, "dxd5", "大|小"],
        [2, "dsd2", "单|双"],
        [2, "dsd1", "单|双"],
        [2, "dsd10", "单|双"],
        [2, "dsd9", "单|双"],
        [2, "dxd10", "大|小"],
        [2, "lhd1", "龙|虎"],
        [2, "lhd2", "龙|虎"],
        [2, "lhd3", "龙|虎"],
        [2, "lhd4", "龙|虎"],
        [2, "lhd5", "龙|虎"],
        [5, "dwqian", "06 07 08 09 10,-,-,-,-"]
    ]
    for d in td:
        print PK10Utils.CalcBetTimes(d[1], d[2])
    pass