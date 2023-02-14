#coding:utf8
import sys
sys.path.append('../')

import os
import time
# import database
import json
from config import Config as C
from utils import TM


def DTAP():
    return time.strftime("%Y-%m-%d_%p", time.localtime())

class Log():
        
    def __init__(self):
        self.key = DTAP()
        self.count = 0
        # print os.path.dirname(__file__)
        self.FP = open(os.path.dirname(__file__) + '//logs//log-print' + self.key + '.txt', 'a')
        '''
        Constructor
        '''
    
    def logPrint(self, s, newLine = False):
        '''防止启动后一直写一个日志文件'''
        self.count += 1
        if (self.count % 100) == 0:
            if DTAP() != self.key:
                self.FP.close()
                self.key = DTAP() 
                self.FP = open(os.path.dirname(__file__) + '//logs//log-print' + self.key + '.txt', 'a')
        '''End If'''
        
        if type(s) == type([]) or type(s) == type({}):
            s = json.dumps(s, ensure_ascii=False)
        self.FP.write(str(s) + ("\r\n" if newLine else '\t'))
        
    def cout(self, *arg):
        # print arg, TM()
        pass
    
    def out(self, obj):
        print json.dumps(obj, ensure_ascii=False), TM()
    
    def debug(self, *args):
        print "Debug: ",
        self.logPrint("Debug: ")
        for a in args: 
            print a,
            self.logPrint(a)
        print TM()
        self.logPrint(TM(), True)
            
    def sys(self, obj):
        print obj, TM()
    
    def error(self, *args):
        print 'Error Found: ', 
        self.logPrint("Error Found: ")
        for a in args: 
            print a,
            self.logPrint(a)
        print TM()
        self.logPrint(TM(), True)
        
    def log(self, *args):
        if C.runMode > 0: return
        print "Log: ",
        self.logPrint("Log: ")
        for a in args: 
            print a,
            self.logPrint(a)
        print TM()
        self.logPrint(TM(), True)
    
    def dbLog(self, *args):
        return
        print "DB Log: ",
        self.logPrint("DB Log: ")
        for a in args: 
            print a,
            self.logPrint(a)
        print TM()
        self.logPrint(TM(), True)
        
    def __del__(self):
        self.FP.close()
  
    
L = Log()

if __name__ == '__main__':    
#     l = Log()
#     l.cout({'k1':'单文件'})
#     L.debug({'k1':'单文件'})
#     L.debug({'k1':'单文件'})
    print DTAP()
    print C.runMode
    pass

