import time
import datetime
from gSSC import Tencent, HeNei1


def TM():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

'''params - seconds'''
def TimeOffset(n = 60, tm = ''):
    sf = '%Y-%m-%d %H:%M:%S' 
    tm = datetime.datetime.now() if tm == '' else datetime.datetime.strptime(tm, sf) 
    return str(tm + datetime.timedelta(seconds=n))


def test():
    cq = HeNei1() # Tencent()
    
    item = cq.getOpenTime('2023-09-09 22:54:57', 2)
    print item
    
    item = cq.getOpenTime('2023-09-09 22:55:00', 1)
    print item
    
    item = cq.getOpenTime('2023-09-09 22:55:01')
    print item
                
if    __name__    ==    "__main__":    
    test()
    
    