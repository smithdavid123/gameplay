#coding:utf8
from utils import ComNum, ComVal, intersect, _HHZXCheck_Num, _True, checkAllNum, Length
import re




class SscUtils():
    @staticmethod
    def _inputCheck_Num(datasel, l, fun = _True):
        newsel = []  #  新的号码
        datasel = list(set(datasel))
        pattern = re.compile('^[0-9]{' + str(l) + '}$')
        for n in datasel:
            if re.search(pattern, n) and fun(n, l): newsel.append(n)
        
        return Length(newsel)
    
    @staticmethod
    def _inputNumbers(method, datasel): 
        nums, tmp_nums = 0, 1
        if method =='rx3z3': 
            maxplace = 1
            if len(datasel) > 1: 
                place = len([e for e in datasel[0] if e == '√'])
                newsel = datasel[1]
                m = 3
                #  任选3必须大于选了3位以上才能组成组合
                if place >= m: 
                    h = ComNum(place, m)
                    if h > 0: #  组合数必须大于0
                        for i in range(maxplace): 
                            s = len(newsel)
                            #  组三必须选两位或者以上
                            if s > 1: 
                                nums += s * (s - 1)
                        nums *= h
            return nums
        if method =='rx3z6': 
            maxplace = 1
            if len(datasel) > 1: 
                place = len([e for e in datasel[0] if e == '√'])
                newsel = datasel[1]
                m = 3
                #  任选3必须大于选了3位以上才能组成组合
                if place >= m: 
                    h = ComNum(place, m)
                    if h > 0: #  组合数必须大于0
                        for i in range(maxplace): 
                            s = len(newsel)
                            #  组六必须选三位或者以上
                            if s > 2: 
                                nums += s * (s - 1) * (s - 2) / 6
                        nums *= h
            return nums
        if method =='rx2zx': 
            maxplace = 1
            if len(datasel) > 1: 
                place = len([e for e in datasel[0] if e == '√'])
                newsel = datasel[1]
                m = 2
                #  任选2必须大于选了2位以上才能组成组合
                if place >= m: 
                    h = ComNum(place, m)
                    if h > 0: #  组合数必须大于0
                        for i in range(maxplace): 
                            s = len(newsel)
                            #  二码不定位必须选两位或者以上
                            if s > 1: 
                                nums += s * (s - 1) / 2
                            
                        nums *= h
            return nums
        if method =='rx2ds' or method =='rx3ds' or method =='rx4ds': 
            if len(datasel) > 1: 
                place = len([e for e in datasel[0] if e == '√'])
                newsel = [e for e in datasel[1:]] 
                m = {"rx2ds": 2, "rx3ds": 3, "rx4ds": 4}[method]
                
                #  任选2必须大于选了2位以上才能组成组合
                if place >= m: 
                    h = ComNum(place, m)
                    if h > 0: #  组合数必须大于0
                        nums += SscUtils._inputCheck_Num(newsel, m).length
                        nums *= h
            return nums
        if method =='rx3hh': 
            if len(datasel) > 1: 
                place = len([e for e in datasel[0] if e == '√'])
                newsel = [e for e in datasel[1:]] 
                
                m = 3
                #  任选3必须大于选了3位以上才能组成组合
                if place >= m: 
                    h = ComNum(place, m)
                    if h > 0: #  组合数必须大于0
                        nums = SscUtils._inputCheck_Num(newsel, 3, _HHZXCheck_Num).length
                        nums *= h
            return nums
        if method =='wxzhixds': 
            nums = SscUtils._inputCheck_Num(datasel, 5).length
            return nums
        if method =='sixzhixdsh' or method =='sixzhixdsq': 
            nums = SscUtils._inputCheck_Num(datasel, 4).length
            return nums
        if method =='sxzhixdsh' or method =='sxzhixdsz' or method =='sxzhixdsq': 
            nums = SscUtils._inputCheck_Num(datasel, 3).length
            return nums
        if method =='sxhhzxh' or method =='sxhhzxz' or method =='sxhhzxq': 
            nums = SscUtils._inputCheck_Num(datasel, 3, _HHZXCheck_Num).length
            return nums
        if method =='exzhixdsh' or method =='exzhixdsq': 
            nums = SscUtils._inputCheck_Num(datasel, 2).length
            return nums
        if method =='exzuxdsh' or method =='exzuxdsq': 
            nums = SscUtils._inputCheck_Num(datasel, 2, _HHZXCheck_Num).length
            return nums
        if method =='wxzux120': 
            s = len(datasel[0])
            if s > 4: 
                nums += ComNum(s, 5)
            
            return nums
        if method =='wxzux60' or method =='wxzux30' or method =='wxzux20' or method =='wxzux10' or method =='wxzux5': 
            minchosen = []
            if method == 'wxzux60': 
                minchosen = [1, 3]
            
            if method == 'wxzux30': 
                minchosen = [2, 1]
            
            if method == 'wxzux20': 
                minchosen = [1, 2]
            
            if method == 'wxzux10' or method == 'wxzux5': 
                minchosen = [1, 1]
            
            if len(datasel[0]) >= minchosen[0] and len(datasel[1]) >= minchosen[1]: 
                h = len(intersect(datasel[0], datasel[1]))
                tmp_nums = ComNum(len(datasel[0]), minchosen[0]) * ComNum(len(datasel[1]), minchosen[1])
                if h > 0: 
                    if method == 'wxzux60': 
                        tmp_nums -= ComNum(h, 1) * ComNum(len(datasel[1]) - 1, 2)
                    
                    if method == 'wxzux30': 
                        tmp_nums -= ComNum(h, 2) * ComNum(2, 1)
                        if len(datasel[0]) - h > 0: 
                            tmp_nums -= ComNum(h, 1) * ComNum(len(datasel[0]) - h, 1)
                        
                    
                    if method == 'wxzux20': 
                        tmp_nums -= ComNum(h, 1) * ComNum(len(datasel[1]) - 1, 1)
                    
                    if method == 'wxzux10' or method == 'wxzux5': 
                        tmp_nums -= ComNum(h, 1)
                nums += tmp_nums
            return nums
        if method =='wxbdw2m': 
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                #  二码不定位必须选两位或者以上
                if s > 1: 
                    nums += s * (s - 1) / 2
                
            return nums
        if method =='wxbdw3m': 
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                #  组六必须选三位或者以上
                if s > 2: 
                    nums += s * (s - 1) * (s - 2) / 6
            
            return nums
        if method =='sixzux24h' or method =='sixzux24q': 
            s = len(datasel[0])
            if s > 3: 
                nums += ComNum(s, 4)
            
            return nums
        if method =='sixzux6h' or method =='sixzux6q': 
            minchosen = [2]
            if len(datasel[0]) >= minchosen[0]: 
                nums += ComNum(len(datasel[0]), minchosen[0])
            
            return nums
        if method =='sixzux12h' or method =='sixzux12q' or method =='sixzux4h' or method =='sixzux4q': 
            minchosen = []
            if method == 'sixzux12h' or method == 'sixzux12q': 
                minchosen = [1, 2]
            
            if method == 'sixzux4h' or method == 'sixzux4q': 
                minchosen = [1, 1]
            
            if len(datasel[0]) >= minchosen[0] and len(datasel[1]) >= minchosen[1]: 
                h = len(intersect(datasel[0], datasel[1]))
                tmp_nums = ComNum(len(datasel[0]), minchosen[0]) * ComNum(len(datasel[1]), minchosen[1])
                if h > 0: 
                    if method == 'sixzux12h' or method == 'sixzux12q': 
                        tmp_nums -= ComNum(h, 1) * ComNum(len(datasel[1]) - 1, 1)
                    
                    if method == 'sixzux4h' or method == 'sixzux4q': 
                        tmp_nums -= ComNum(h, 1)
                nums += tmp_nums
            return nums
        if method =='sxzuxzsh' or method =='sxzuxzsz' or method =='sxzuxzsq': 
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                #  组三必须选两位或者以上
                if s > 1: 
                    nums += s * (s - 1)
            return nums
        if method =='sxzuxzlh' or method =='sxzuxzlz' or method =='sxzuxzlq': 
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                #  组六必须选三位或者以上
                if s > 2: 
                    nums += s * (s - 1) * (s - 2) / 6
            return nums
        if method =='wxzhixzh' or method =='sixzhixzhh' or method =='sixzhixzhq': 
            maxplace = 0
            if 'wxzhixzh' == method: 
                maxplace = 5
            
            if 'sixzhixzhh' == method or 'sixzhixzhq' == method: 
                maxplace = 4
            
            for i in range(maxplace): 
                #  有位置上没有选择
                if len(datasel[i]) == 0: 
                    tmp_nums = 0
                    break
                tmp_nums *= len(datasel[i])
            nums += tmp_nums * maxplace
            return nums
        if method =='sxzhixhzh' or method =='sxzhixhzz' or method =='sxzhixhzq' or \
            method =='exzhixhzh' or method =='exzhixhzq': 
            cc = { 0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55, 
                  10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63, 18: 55, 
                  19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1
            }
            if method == 'exzhixhzh' or method == 'exzhixhzq': 
                cc = {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 
                      10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1}
                
            for d in datasel[0]: 
                nums += cc[int(d, 10)]
            
            return nums
        if method =='rx2fs' or method =='rx3fs' or method =='rx4fs': 
            minplace = 0
            if method == 'rx2fs': 
                minplace = 2
            
            if method == 'rx3fs': 
                minplace = 3
            
            if method == 'rx4fs': 
                minplace = 4
            
            newsel = [datasel[i] for i in range(len(datasel)) if len(datasel[i]) != 0]
            #  最少位数
            if len(newsel) >= minplace: 
                l = ComNum(len(newsel), minplace)
                for i  in range(l): 
                    tmp_nums = 1
                    data = ComVal(newsel, minplace, i)
                    for d in data: 
                        tmp_nums *= len(d)
                    nums += tmp_nums
            return nums
        if method =='dw': # 定位胆所有在一起特殊处理
            maxplace = 5
            for i in range(maxplace): 
                nums += len(datasel[i])
            
            return nums
        if method =='bdw2mh' or method =='bdw2mz' or method =='bdw2mq' or method =='exzuxfsh' or method =='exzuxfsq': 
            maxplace = 1
            for i in range(maxplace): 
                s = len(datasel[i])
                #  二码不定位必须选两位或者以上
                if s > 1: 
                    nums += s * (s - 1) / 2
            return nums
        if method =='kdqs' or method =='kdzs' or method =='kdhs' or method =='kdqe' or method =='kdhe': 
            cc = { 0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54 }
            if method == 'kdqe' or method == 'kdhe': 
                cc = { 0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2 }
            
            for d in datasel[0]: 
                nums += cc[int(d, 10)]
            
            return nums
        maxplace = {'wxzhixfs': 5, 'sixzhixfsh': 4, 'sixzhixfsq': 4, 'sxzhixfsh': 3, 'sxzhixfsz': 3, 'sxzhixfsq': 3, 
                'exzhixfsh': 2, 'exzhixfsq': 2, 'dxdsh': 2, 'dxdsq': 2, 'wxhzdxds': 1, 'wxbdw1m': 1, 'bdw1mh': 1, 
                'bdw1mz': 1, 'bdw1mq': 1, 'qwyffs': 1, 'qwhscs': 1, 'qwsxbx': 1, 'qwsjfc': 1, 'lhwq': 1, 'lhwb': 1, 
                'lhws': 1, 'lhwg': 1, 'lhqb': 1, 'lhqs': 1, 'lhqg': 1, 'lhbs': 1, 'lhbg': 1, 'lhsg': 1}[method]
        
        if len(datasel) == maxplace: 
            for i in range(maxplace): 
                #  有位置上没有选择
                if len(datasel[i]) == 0: 
                    tmp_nums = 0
                    return nums
                
                tmp_nums *= len(datasel[i])
            nums += tmp_nums
    
        return nums
    
    @staticmethod
    def CalcBetTimes(method, content):
        datasel = []
        if method in set(['wxhzdxds', 'lhwq']) or content.find("|") != -1: 
            datasel.append(content.split("|"))
        elif method in set(['sxzhixdsh', 'sxzhixdsz', 'sxzhixdsq', "sixzhixdsh", "sixzhixdsq", "wxzhixds",
                            "exzhixdsh", "exzhixdsq", 
                            "sxhhzxh", "sxhhzxz", "sxhhzxq",
                            "exzuxdsh", "exzuxdsq"]):
            datasel = content.split(' ')
        
        elif method in set(['rx2ds', 'rx3ds', 'rx4ds', 'rx3hh']):
            eIdx = content.find(']')
            datasel.append(content[1:eIdx].split(","))
            content = content.split("]")[1]
            for e in content.split(","): datasel.append(e)
        elif content[0] == '[': 
            eIdx = content.find(']')
            datasel.append(content[1:eIdx].split(","))
            content = content.split("]")[1]
            datasel.append(content.split(","))
        elif method=='dw':
            datasel = [list(p.replace('-', '')) for p in content.split(",")]
            
        elif method in set(["wxzux120", "wxhzdxds", "wxbdw1m", "wxbdw2m", "wxbdw3m", "sixzux24h", "sixzux6h", 
                            "sixzux24q", "sixzux6q", "sxzhixhzh", "sxzuxzsh", "sxzuxzlh", "sxzhixhzz", "sxzuxzsz", 
                            "sxzuxzlz", "sxzhixhzq", "sxzuxzsq", "sxzuxzlq", "exzhixhzh", "exzuxfsh", "exzhixhzq", 
                            "exzuxfsq", "bdw1mh", "bdw2mh", "bdw1mz", "bdw2mz", "bdw1mq", "bdw2mq", 
                            "kdqs", "kdzs", "kdhs", "kdqe", "kdhe", "qwyffs", "qwhscs", "qwsxbx", 
                            "qwsjfc", "lhwq", "lhwb", "lhws", "lhwg", "lhqb", "lhqs", "lhqg", "lhbs", "lhbg", "lhsg"]): 
            datasel.append(content.split(","))
        else:
            datasel = [list(p) for p in content.split(",") if p != "-"]
            # for p in content.split(","):
            #    if p != "-": datasel.append(list(p))
            
        # print method, content, datasel
        
        return SscUtils._inputNumbers(method, datasel)
    
    
if __name__ == '__main__':
#     print len([e for e in [1, 2, 3] if e > 1])
#     print range(8, 10)
#   
#     print ComNum(9, 3)
    test = [['sxzhixfsz', '-,5,7,3,-'], ['sxzhixfsz', '-,5,76,3,-'], ['sxzhixfsz', '-,5,76,3,-'],
            ['rx2zx', '[-,-,-,√,√]4,5,6,7'], 
            ['rx2ds', '[-,-,-,√,√]04,05'], 
            ['lhwq', '龙|虎'], ['qwyffs', '1,2,5'], ['dw', '-,01234,02468,13579,56789'],
            ['sxzhixdsh', '123 450'], ['sxhhzxh', '113 121'],
            ['rx3hh', '[-,-,√,√,√]112,123']
    ]
    # print test[0][1].split(",")
    
    idx = len(test)
    for i in range(idx):
        print SscUtils.CalcBetTimes(test[i][0], test[i][1])
    
    
    