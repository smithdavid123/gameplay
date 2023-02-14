#coding: utf8

from utils import ComNum, ComVal, intersect, _HHZXCheck_Num, _True, checkAllNum, Length, unique, toString


class K8Utils(): 
    # 快乐8工具类
    # 多少注计算
    @staticmethod
    def _inputNumbers (_type, datasel):
        nums, tmp_nums = 0, 1;
        # 选号
        if _type == 'rx1':
            nums = len(datasel[0]) + len(datasel[1]);
        elif _type == 'rx2':
            l = len(datasel[0]) + len(datasel[1]);
            if (l >= 2 and l <= 8):
                nums = ComNum(l, 2);
        elif _type == 'rx3':
            l = len(datasel[0]) + len(datasel[1]);
            if (l >= 3 and l <= 8):
                nums = ComNum(l, 3);
        elif _type == 'rx4':
            l = len(datasel[0]) + len(datasel[1]);
            if (l >= 4 and l <= 8):
                nums = ComNum(l, 4);
        elif _type == 'rx5':
            l = len(datasel[0]) + len(datasel[1]);
            if (l >= 5 and l <= 8):
                nums = ComNum(l, 5);
        elif _type == 'rx6':
            l = len(datasel[0]) + len(datasel[1]);
            if (l >= 6 and l <= 8):
                nums = ComNum(l, 6);
        elif _type == 'rx7':
            l = len(datasel[0]) + len(datasel[1]);
            if (l >= 7 and l <= 8):
                nums = ComNum(l, 7);
        else:
            maxplace = 0;
            if _type == 'hezhids' or _type == 'hezhidx' or _type == 'jopan' or _type == 'sxpan' or _type == 'hzdxds' \
                or _type == 'hezhiwx':
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
    def _inputFormat (_type, datasel):
        if _type == 'rx1' or _type == 'rx2' or _type == 'rx3' or _type == 'rx4' or _type == 'rx5' \
            or _type == 'rx6' or _type == 'rx7':
            return toString(datasel[0] + datasel[1]);
        elif _type == 'hezhids' or _type == 'hezhidx' or _type == 'jopan' or _type == 'sxpan' or _type == 'hzdxds' \
            or _type == 'hezhiwx':
            return toString(datasel[0]).replace(',', '|')
    
    @staticmethod
    def CalcBetTimes(method, content):
        datasel = []
        if method in set(['hezhids', 'hezhidx', 'jopan', 'sxpan', 'hzdxds', 'hezhiwx']):
            datasel.append(content.split("|"))
        elif method in set(['rx1', 'rx2', 'rx3', 'rx4', 'rx5', 'rx6', 'rx7', 'rx8']):
            datasel = [[], []]
            for p in content.split(","):
                datasel[0 if int(p) < 41 else 1 ].append(p)
        
        '''End If'''
        # print datasel
        
        return int(K8Utils._inputNumbers(method, datasel))
        

    '''End Def'''
'''End Class'''

if __name__ == '__main__':
    td = [
            [2, "hezhids", "单|双"],
            [3, "hezhidx", "小|和|大"],
            [3, "jopan", "奇|和|偶"],
            [3, "sxpan", "上|中|下"],
            [4, "hzdxds", "大单|大双|小单|小双"],
            [8, "rx1", "02,21,22,23,40,46,65,66"],
            [10, "rx2", "05,24,48,65,66"],
            [35, "rx3", "08,09,10,49,68,69,70"],
            [15, "rx4", "06,07,08,48,49,50"],
            [21, "rx5", "26,27,28,29,68,69,70"],
            [28, "rx6", "27,28,29,31,50,51,52,72"],
            [8, "rx7", "01,02,03,04,05,06,07,48"],
            [5, "hezhiwx", "金|木|水|火|土"]
    ]
    for d in td:
        print K8Utils.CalcBetTimes(d[1], d[2])
    pass

