#coding:utf8

HOST = "ddyule10087.com"

class Config(object):
    # seconds
    waitTimeJoin = 10
    waitTimeRecord = 3
    '''0 - develop, 1 - production'''
    runMode = 0
    # Redis 相关配置 
    dbHost = ''
    dbPort = 6379
    dbName = '2'
    dbPasswd = ''
    
    # Mysql 相关配置
    msHost = '127.0.0.1'
    msPort = 3306
    msName = 'game' # 数据库名称
    msUser = 'root'
    msPasswd = 'dffadadas'
    
    pool_size = 6
    
    
    ''' 非开发人员慎改 '''
    socketPort = 8007 #7999
    socketHost = "127.0.0.1"
    waitTimeConnectCrawler = 15
    ''''''
    
    '''业务配置'''
    MAX_POINT = 11
    MAX_POINT_VALUE = 2020
    MARK_BILLNO_LENGTH = -10
    # 提前进入下一期的秒数
    GAME_TIME_ADVANCE = 2
    MAIN_HOST_NAME = HOST
    MAIN_WEB_URL = "http://" + HOST
    SYS_DIVIDEND_POINT = 1994
    ROOT_USER = "yonxin01"
    
    PAY_URL = "http://" + HOST + "/pay"
    PAY_URL_ZLY = "http://" + HOST + "/api/zlypay"
    FAST_GAMES = set(['qumin'])
    
    def __init__(self, env = "develop"):
        pass
    
    @staticmethod
    def develop():
        Config.dbHost = "127.0.0.1"
        Config.dbPasswd = "ssss2019"
        Config.dbPort = 63789

Config.develop()
