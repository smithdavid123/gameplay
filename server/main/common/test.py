#coding:utf8
import sys
sys.path.append('..')

import math
from libs.redisEx2 import MyRedis as rs

import re
import math
import random 
from key import KEY

def s(a, b):
    flag = (1 == random.randint(1, 2))
    print flag
    return flag


if __name__ == '__main__':
    # pattern = re.compile('^([0-9]{2}\\s{1}){2}[0-9]{2}$')
    # print re.search(pattern, '01 12 10')
    # dt = [1, '2', '3']
    # print [1, 23] + [2, 3]
    # print ','.join(dt)
#     ary = [1, 2, 5, 3, 0]
#     d = sorted(ary, s)
#     
#     print d
    
    import json
    print json.dumps(rs.get(KEY.Methods), ensure_ascii=False)
#     print rs.hget(KEY.Games, "cqssc")
    pass