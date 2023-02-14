#coding:utf8
import time
from datetime import datetime, timedelta
import threading
from heapq import heappush, heappop, nsmallest, nlargest
Lock = threading.Lock()

class Timer():
    ThreadR = None
    Todo = []
    
    def __init__(self):
        pass
    
    '''function, seconds'''
    @staticmethod
    def setTimeout(func, second, *args):
        if Lock.acquire():
            runTime = datetime.fromtimestamp(second / 1000.0) if second > 12345678 else \
                datetime.now() + timedelta(seconds=second) 
            if datetime.now() < runTime: heappush(Timer.Todo, (runTime, func, args))
            Lock.release()
    
    @staticmethod    
    def execute():
        while True:
            time.sleep(0.1)
            if len(Timer.Todo) == 0: continue
            e = Timer.Todo[0]
            if datetime.now() > e[0]:
                e = heappop(Timer.Todo)
                e[1](e[2])
                    
    @staticmethod
    def Run():
        if Timer.ThreadR: return
        Timer.ThreadR = threading.Thread( None, Timer.execute, "Thread-Timer-R" )
        Timer.ThreadR.start()
        
def execute(s):
    print s

def add():      
    Timer.setTimeout(execute, 1, 7, 5)
    time.sleep(3)
    Timer.setTimeout(execute, 1, 8, 6)

def test():
    Timer.setTimeout(execute, 1, 2, 5)
    Timer.setTimeout(execute, 0, 0, 6)
    
    Timer.Run()
    
    ThreadA = threading.Thread( None, add, "Thread-A" )
    ThreadA.start()
    
if __name__ == '__main__':
    
    # test()
    print time.time()
    print time.time()
    
    