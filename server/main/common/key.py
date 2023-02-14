#coding: utf8

from libs.redisEx2 import MyRedis as rs


class KEY():
    Games = "games"
    Methods = "methods"
    LotteryMethods = "LotteryMethods"
#     Methods = "methodCache"
    MethodCache = "methodCache"
    PayMethods = "PayMethods"
    Times = "times"
    Config = "config"
    IPCache = "IPS"
    TaskDividend = "taskDividend"
    TaskDividendRecord = "taskDividendRecord"
    ChannelWage = "channelWage"
    RequestJob = "requestJob"
    UserInfo = "UserInfo"
    LastOpen = "LastOpen"
    StopTime = "StopTime"
    '''hkey: name + '_' + issue '''
    DividendSyetem = "DividendSyetem"
    UserInfo = "UserInfo"
    PayUrl = "PayUrl"
    PayBill = "PayBill"
    StopMethods = "stopMethods"     # lottery_method
    AllowMethods = "allowMethods"     # lottery_method
    MethodConfig = "MethodConfig"     # lottery_method
    ApiGames = "ApiGames"
    ApiGamesEx = "ApiGamesEx"
    
    BillPay = "BillPay"
    PayFeeRate = "PayFeeRate"
    MethodListParts = "MethodListParts"
    MethodKeys = "MethodKeys"
    UserLevel = "userLevelConf"
    UserKey = "userKey"
    GameConfig = "gameConfig"
    IPLimit = "ipForbidList"
    RunDividendDay = "runDividendDay"
    BillPaySource = "BillPaySource"
    
    
    @staticmethod
    def setStopTime(name, issue, value):
        rs.hset(KEY.StopTime, name + '_' + issue, value)
    
    @staticmethod
    def getStopTime(name, issue):
        return rs.hget(KEY.StopTime, name + '_' + issue, False)
    
if __name__ == '__main__':

    pass