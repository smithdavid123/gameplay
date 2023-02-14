#coding: utf8

from utils import ComNum, ComVal, intersect, _HHZXCheck_Num, _True, checkAllNum, Length, unique, toString
import re

class X511Utils():
    # 输入框类型检测
    @staticmethod
    def _inputCheck_Num(datasel, l, fun = _True):
        newsel = []  # 新的号码
        print datasel
        datasel = unique(datasel) # 去除重复
        pattern = re.compile('^([0-9]{2}\\s{1}){' + str(l - 1) + '}[0-9]{2}$');
        
        for n in datasel:
            if re.search(pattern, n) and fun(n, l):
                newsel.append(n)
            
        return Length(newsel)
    
    # 输入框号码检测
    @staticmethod
    def _numberCheck_Num(n, l = 1): 
        ts = n.split(' ')
        for t in ts:
            if (int(t) > 11 or int(t) < 1): return False
        
        if len(set(ts)) != len(ts): return False

        return True
    
    # 多少注计算
    @staticmethod
    def _inputNumbers(_type, datasel):
        nums = 0
        # 这里验证输入框类型
        if _type == 'sanmzhixdsq' or _type == 'sanmzuxdsq':
            return X511Utils._inputCheck_Num(datasel, 3, X511Utils._numberCheck_Num).length
        elif _type == 'ermzhixdsq' or _type == 'ermzuxdsq':
            return X511Utils._inputCheck_Num(datasel, 2, X511Utils._numberCheck_Num).length
        elif _type == 'rx1ds':
            return X511Utils._inputCheck_Num(datasel, 1, X511Utils._numberCheck_Num).length
        elif _type == 'rx2ds':
            return X511Utils._inputCheck_Num(datasel, 2, X511Utils._numberCheck_Num).length
        elif _type == 'rx3ds':
            return X511Utils._inputCheck_Num(datasel, 3, X511Utils._numberCheck_Num).length
        elif _type == 'rx4ds':
            return X511Utils._inputCheck_Num(datasel, 4, X511Utils._numberCheck_Num).length
        elif _type == 'rx5ds':
            return X511Utils._inputCheck_Num(datasel, 5, X511Utils._numberCheck_Num).length
        elif _type == 'rx6ds':
            return X511Utils._inputCheck_Num(datasel, 6, X511Utils._numberCheck_Num).length
        elif _type == 'rx7ds':
            return X511Utils._inputCheck_Num(datasel, 7, X511Utils._numberCheck_Num).length
        elif _type == 'rx8ds':
            return X511Utils._inputCheck_Num(datasel, 8, X511Utils._numberCheck_Num).length
        
        # 这里验证选号类型
        elif _type == 'sanmzhixfsq':
            if (len(datasel[0]) > 0 and len(datasel[1]) > 0 and len(datasel[2]) > 0): 
                for i in range(len(datasel[0])): 
                    for j in range(len(datasel[1])): 
                        for k in range(len(datasel[2])): 
                            if (datasel[0][i] != datasel[1][j] and datasel[0][i] != datasel[2][k] \
                                and datasel[1][j] != datasel[2][k]): 
                                nums += 1
                            '''End If'''
                        '''End For k'''
            '''End If'''
        elif _type == 'sanmzuxfsq':
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 2): 
                    nums += s * (s - 1) * (s - 2) / 6
            '''End For'''
        elif _type == 'ermzhixfsq':
            if (len(datasel[0]) > 0 and len(datasel[1]) > 0): 
                for i in range(len(datasel[0])): 
                    for j in range(len(datasel[1])): 
                        if (datasel[0][i] != datasel[1][j]): 
                            nums += 1
        elif _type == 'ermzuxfsq':
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 1): 
                    nums += s * (s - 1) / 2
        elif _type == 'bdw' or _type == 'dwd' or _type == 'dds' or _type == 'czw' or _type == 'rx1fs': # 任选1中1
            maxplace = 0
            if ('bdw' == _type or 'dds' == _type or 'czw' == _type or 'rx1fs' == _type): 
                maxplace = 1
            if ('dwd' == _type): 
                maxplace = 3
            for i in range(maxplace): 
                nums += len(datasel[i])
        elif _type == 'rx2fs': # 任选2中2
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 1): 
                    nums += s * (s - 1) / 2
        elif _type == 'rx3fs': # 任选3中3
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 2): 
                    nums += s * (s - 1) * (s - 2) / 6
        elif _type == 'rx4fs': # 任选4中4
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 3): 
                    nums += s * (s - 1) * (s - 2) * (s - 3) / 24
        elif _type == 'rx5fs': # 任选5中5
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 4): 
                    nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) / 120
        elif _type == 'rx6fs': # 任选6中6
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 5): 
                    nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) * (s - 5) / 720
        elif _type == 'rx7fs': # 任选7中7
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 6): 
                    nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) * (s - 5) * (s - 6) / 5040
        elif _type == 'rx8fs': # 任选8中8
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                if (s > 7): 
                    nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) * (s - 5) * (s - 6) * (s - 7) / 40320
        return nums
    '''End Def'''
    
    @staticmethod
    def _formatSelect_Num(datasel, m, n): 
        newsel = []
        if (not m): m = 0
        if (not n): n = 0
        for i in range(m): 
            newsel.append('-')
        for i in range(len(datasel)): 
            
            f = toString(datasel[i]).replace(',', ' ')
            if (f == ''): 
                newsel.append('-')
            else: 
                newsel.append(f)
        for i in range(n): 
            newsel.append('-')

        return toString(newsel)
    '''End Def'''
   
    @staticmethod
    def _formatTextarea_Num(_type, datasel): 
        if _type == 'sanmzhixdsq' or _type == 'sanmzuxdsq':
            datasel = X511Utils._inputCheck_Num(datasel, 3, X511Utils._numberCheck_Num)
        elif _type == 'ermzhixdsq' or _type == 'ermzuxdsq':
            datasel = X511Utils._inputCheck_Num(datasel, 2, X511Utils._numberCheck_Num)
        elif _type == 'rx1ds':
            datasel = X511Utils._inputCheck_Num(datasel, 1, X511Utils._numberCheck_Num)
        elif _type == 'rx2ds':
            datasel = X511Utils._inputCheck_Num(datasel, 2, X511Utils._numberCheck_Num)
        elif _type == 'rx3ds':
            datasel = X511Utils._inputCheck_Num(datasel, 3, X511Utils._numberCheck_Num)
        elif _type == 'rx4ds':
            datasel = X511Utils._inputCheck_Num(datasel, 4, X511Utils._numberCheck_Num)
        elif _type == 'rx5ds':
            datasel = X511Utils._inputCheck_Num(datasel, 5, X511Utils._numberCheck_Num)
        elif _type == 'rx6ds':
            datasel = X511Utils._inputCheck_Num(datasel, 6, X511Utils._numberCheck_Num)
        elif _type == 'rx7ds':
            datasel = X511Utils._inputCheck_Num(datasel, 7, X511Utils._numberCheck_Num)
        elif _type == 'rx8ds':
            datasel = X511Utils._inputCheck_Num(datasel, 8, X511Utils._numberCheck_Num)
        
        return toString(datasel).replace(',', '')

    @staticmethod
    def _inputFormat(_type, datasel): 
        if _type == 'sanmzhixfsq' or _type == 'dwd':
            return X511Utils._formatSelect_Num(datasel, 0, 2)
        elif _type == 'ermzhixfsq':
            return X511Utils._formatSelect_Num(datasel, 0, 3)
        elif _type == 'sanmzuxfsq' or _type == 'ermzuxfsq' or _type == 'bdw' or _type == 'rx1fs' or _type == 'rx2fs' or _type == 'rx3fs' or _type == 'rx4fs' or _type == 'rx5fs' or _type == 'rx6fs' or _type == 'rx7fs' or _type == 'rx8fs':
            return toString(datasel[0])
        elif _type == 'sanmzhixdsq' or _type == 'sanmzuxdsq' or _type == 'ermzhixdsq' or _type == 'ermzuxdsq' or _type == 'rx1ds' or _type == 'rx2ds' or _type == 'rx3ds' or _type == 'rx4ds' or _type == 'rx5ds' or _type == 'rx6ds' or _type == 'rx7ds' or _type == 'rx8ds':
            return X511Utils._formatTextarea_Num(_type, datasel)
        elif _type == 'dds':
            return toString(datasel[0]).replace(',', '|')
        elif _type == 'czw':
            return toString(datasel[0])
    
    @staticmethod
    def CalcBetTimes(method, content):
        datasel = []
        if method in set(['sanmzhixfsq', 'ermzhixfsq', 'dwd']):
            # datasel = [p.split(' ') for p in content.split(",") if p != "-"]
            datasel = [[] if p == '-' else p.split(" ") for p in content.split(",")]
        elif method in set(['sanmzuxfsq', 'ermzuxfsq', 'bdw', 'czw', 'rx1fs', 'rx2fs', 'rx3fs', 'rx4fs', 'rx5fs', \
                            'rx6fs', 'rx7fs', 'rx8fs']):
            datasel.append(content.split(","))
        elif method in set(['dds']):
            datasel.append(content.split("|"))
        elif method in set(['rx1ds', 'rx2ds', 'rx3ds', 'rx4ds', 'rx5ds', 'rx6ds', 'rx7ds', 'rx8ds',
                            'sanmzhixdsq', 'ermzhixdsq', 'sanmzuxdsq', 'ermzuxdsq']):
            datasel = content.split(";")
        else:
            return 0
        # print datasel
        
        return int(X511Utils._inputNumbers(method, datasel))

if __name__ == '__main__':
    td = [['sanmzhixfsq', '06,07,08 09,-,-'], ['sanmzuxfsq', '05,06,07,08'], ['ermzhixfsq', '02,04 05,-,-,-'],
          ['ermzuxfsq', '04,05,06'], ['bdw', '02,03,04'], ['dwd', '02,03,04,-,-'], ['dds', '5单0双|4单1双'],
          ['czw', '05,06'], ['rx1fs', '03,04'], ['rx2fs', '04,06,08'], ['rx3fs', '05,06,07'],
          ['rx5fs', '05,06,07,08,10,11'], ['rx8fs', '03,04,05,06,07,08,09,10,11'],
          ['rx1ds', '01;02'], ['rx2ds', '01 02;02 01'], ['rx7ds', '01 02 03 04 05 06 07;01 02 03 04 05 06 08'],
          ['sanmzhixdsq', '01 02 03;01 02 05'], ['sanmzuxdsq', '01 02 03;01 02 05'],
          ['ermzhixdsq', '01 02;01 02'], ['ermzuxdsq', '01 02;02 01;01 02 05']
          ]
    for d in td:
        print X511Utils.CalcBetTimes(d[0], d[1])
        
    pass


