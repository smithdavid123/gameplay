#coding:utf8

from mOrder import addOrder 
import threading

    
def startWorker():
    ThreadR = threading.Thread( None, testAddOrder, "Thread-Request" )
    ThreadR.start()

def testAddOrder():
    txt = [{"lottery":"t1s300a","issue":"","method":"exzuxfsh","content":"5,6,7,8,9","model":"yuan","multiple":1,"code":1996,"compress":False,"nums":10}]
    addOrder('test1', txt)
    
    
if __name__ == '__main__':
    for i in range(10): startWorker()