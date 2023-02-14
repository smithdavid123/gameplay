#coding:utf8
import os
import time
import logging
import json
import traceback
import sys
sys.path.append('..')


class LOG():
    DEFINED_LOG = None
        
    '''本地日志配置'''
    @staticmethod
    def init(): 
        if LOG.DEFINED_LOG: return LOG.DEFINED_LOG
        '''
        logging.basicConfig(level=logging.DEBUG,
            format = '%(message)s - %(filename)s[line:%(lineno)d] - %(levelname)s: %(asctime)s',
            datefmt = '%Y-%m-%d %H:%M:%S',
            )
        '''
        logger = logging.getLogger('simple_example')
        
        log_path = os.path.dirname(os.path.dirname(__file__)) + '/logs/log_'
        log_name = log_path + time.strftime("%Y-%m-%d_%p", time.localtime()) + '.txt'
        f_handle = logging.FileHandler(log_name)
        f_handle.setLevel(logging.DEBUG)
        
        c_handle = logging.StreamHandler()
        c_handle.setLevel(logging.DEBUG)
        
        datefmt = '%Y-%m-%d %H:%M:%S'
        
        f_formatter = logging.Formatter('%(asctime)s - %(levelname)s: %(message)s')
        c_formatter = logging.Formatter('%(message)s - %(levelname)s: %(asctime)s', datefmt)
        
        c_handle.setFormatter(c_formatter)
        f_handle.setFormatter(f_formatter)
        
        logger.addHandler(c_handle)
        logger.addHandler(f_handle)
    
        # logging.config.fileConfig('logging.conf')
        logger.setLevel(logging.ERROR)
        
        LOG.DEFINED_LOG = logger
        
        return logger
     

class L():
    if not LOG.DEFINED_LOG: LOG.init()
    
    @staticmethod
    def cout(*args):
        content = collect_params(args)   
        LOG.DEFINED_LOG.info(content)
    
    @staticmethod    
    def out(*args):
        content = collect_params(args)   
        LOG.DEFINED_LOG.info(content)
    
    @staticmethod
    def debug(*args):
        content = "Debug: " + collect_params(args)
        LOG.DEFINED_LOG.debug(content)
    
    @staticmethod
    def sys(obj):
        content = str(obj)
        LOG.DEFINED_LOG.error(content)
    
    @staticmethod
    def error(*args):
        content = 'Error Found: ' + collect_params(args)
        LOG.DEFINED_LOG.error(content)
        
    @staticmethod
    def log(*args):
        content = collect_params(args)
        LOG.DEFINED_LOG.info(content)
    
    @staticmethod
    def info(*args):
        content = collect_params(args)
        LOG.DEFINED_LOG.info(content)
    
    @staticmethod
    def dbLog(*args):
        content = 'DB Log: ' + collect_params(args)
        LOG.DEFINED_LOG.info(content)
    
def collect_params(*args):
    path = traceback.extract_stack()[-3]
    mark = ' _ ' + os.path.basename(path[0]) + "[line:{}]".format(path[1])
    return ' '.join([json.dumps(a, ensure_ascii=False) if isinstance(a, dict) \
                     else str(a) for a in args]) + mark

def test():
    L.debug('Hello, World')
    L.info('Hello, 世界')
    L.dbLog({'Hello': '世界'})
    L.out({'Hello': '世界'})
    L.cout(123, "156")
    
if __name__ == '__main__':
    test()
    
    