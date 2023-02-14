#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import copy
import math
import random
import os
import threading
import base64
from datetime import datetime
from libs.utils import TM, S2DT, S2TS, T2S, DT2TMS, P2C
from libs.database import Database
from libs.redisEx2 import MyRedis as rs
from libs.log import L
from games.api import URL
from common.key import KEY
from mGame import get_game_types
import login as lg
from common.tools import get_user_level
# import mSystem as MS
 
 
ThreadC = None
gameList = []
methods = []
gameMethods = []
 
 
'''游戏列表·方法列表'''
def getGameConfig():
    db = Database()
    gameList, methods = [], []
    keysM = ["id", "type", "groupName", "name", "methodName", "minRecord", "maxRecord", "totalRecord", "sort", 
             "status", "bonus", "oooNums", "oooBonus", "rebate"]
    sql = "select " + ",".join(keysM) + " from game_method"
    cursor = db.select(sql, ())
    for item in cursor:
        line = dict((keysM[i], item[i]) for i in range(len(keysM))) 
        line['group'] = line['groupName']
        del line['groupName']
        methods.append(line)
         
    keysG = ["id", "lottery", "showName", "shortName", "frequency", "type", "showType", "times", "stopDelay", "downCode", 
             "fenDownCode", "liDownCode", "floatBonus", "maxBonus", "sort", "status", "description", "openMode"]
    sql = "select " + ",".join(keysG) + " from game_config"
    items = db.select(sql, (), cursor)
    for item in items:
        line = dict((keysG[i], item[i]) for i in range(len(keysG))) 
        line['shortName'] = line['lottery']
        del line['lottery']
        gameList.append(line)
    
    loadGameInfo(db)
    
    return gameList, methods


'''新版平台玩法列表返回的是所有彩票和玩法的组合'''
def getGameMethods(gameList, methodList):
    db = Database()
    gmcs = {key: conf for key, conf in get_method_config(db)}
    
    games = {}
    methods = []
    for g in gameList:
        if g['type'] not in games: games[g['type']] = []
        games[g['type']].append(g)
    for m in methodList:
        if m['type'] not in games: continue 
        for g in games[m['type']]:
            d = m.copy()
            d['lottery'] = g['shortName']
            
            '''取自定义配置数据'''
            k = d['lottery'] + "_" + d['methodName']
            c = gmcs.get(k, None)
            if c != None: d['bonus'], d['rebate'], c['status'] = c['bonus'], c['rebate'], c['status'] 
            
            methods.append(d)
    
    return methods
        

def set_method_config_cache(lottery, method, bonus, rebate):
    conf = {'status': 0, 'bonus': bonus, 'rebate': rebate, 'lottery': lottery, 
                'method': method, 'bonusDiff': 1}
    rs.hset(KEY.MethodConfig, lottery + "_" + method, conf)
    get_game_methods()

def get_method_config(db):
    sql = "SELECT lottery, method, status, bonus, rebate, bonusDiff FROM `game_method_limit`"
    for (lottery, method, status, bonus, rebate, bonusDiff) in db.select(sql, ()):
        conf = {'status': status, 'bonus': bonus, 'rebate': rebate, 'lottery': lottery, 
                'method': method, 'bonusDiff': bonusDiff}
        yield lottery + "_" + method, conf 

'''获取玩法黑名单 、白名单'''
def loadGameInfo(db):
    rs.delete(KEY.StopMethods)
    rs.delete(KEY.AllowMethods)
    rs.delete(KEY.ApiGames)
    for key, conf in get_method_config(db): rs.hset(KEY.MethodConfig, key, conf)
    
    sql = "SELECT lottery, apiSrc, apiUrl FROM game_config where apiStatus=1"
    for (lottery, apiSrc, apiUrl) in db.select(sql, ()):
        rs.hset(KEY.ApiGames, lottery, apiSrc)
        rs.hset(KEY.ApiGames, lottery + "_url", apiUrl)
    
'''加载缓存'''
def updateConfig():
    global gameList, methods, gameMethods
    # gameList, methods = getGameConfig()
    gameList, methods, gameMethods = get_game_methods()
    updateCache()
    loadConfig()
    L.log("Finished!")

'''玩法自定义数据'''
def getMethodConfigDiff():
    MethodConfig = rs.hvals(KEY.MethodConfig)
    lines = []
    for item in MethodConfig:
        if not item.get('bonusDiff', 0): continue
        lines.append([item['lottery'], item['method'], item['bonus']])
    
    return lines

def get_game_config_diff():
    gc = rs.hget(KEY.Config, KEY.GameConfig)
    if not gc:
        gc = _get_game_config_diff()
        rs.hset(KEY.Config, KEY.GameConfig, gc) 
    return gc

'''获取采种更新时间晚于指定时间节点的配置数据'''    
def _get_game_config_diff(db = None):
    if not db: db = Database()
    lastTime = rs.hget(KEY.Config, "gameConfigTime", False)
    if not lastTime: lastTime = TM() 
    lines = []
    sql = "select lottery, floatBonus, stopDelay from game_config where updateTime > %s"
    for (g, b, t) in db.select(sql, (lastTime, )): lines.append([g, b, t])
    return lines
    
'''新版App整改，将初始化信息放到登录接口直接返回'''
def get_init_data_for_login(user):
    info = getInitBase(user)
    conf = getMethodConfigDiff()
    gConf = get_game_config_diff()
    return info, conf, gConf 
    
def getMethodPart(idx=0):
    return getMethodConfigDiff()
        
def getMethodPart_v0(idx=0):
    key = "MethodListPart" + str(idx)
    part = rs.get(key)
    if not part:
        part = _getMethodPart(idx)
        rs.set(key, part)
    return part
    
def _getMethodPart(part=0):
    methods, keys = getMethodParts()
    ps = int(math.ceil(1.0 * len(methods) / 3))
    h, t = part * ps, (part + 1) * ps
    methods = methods[h: t]
    return {'keys': keys, 'methods': methods}

def getMethodParts():
    methods, keys = rs.get(KEY.MethodListParts), rs.get(KEY.MethodKeys)
    if not methods:
        gameList, methods, gameMethods = getGameLotteryMethodList()
        keys = gameMethods[0].keys()
        methods = [[item[k] for k in keys] for item in gameMethods]
        rs.set(KEY.MethodKeys, keys)
        rs.set(KEY.MethodListParts, methods)
    return methods, keys

def getInitBase(user):
    data = getInitData()    
    data["account"] = lg.getAccount(user)
    data['gameLotteryAccount']['availableBalance'] = data["account"]['balance']
    data['gameLotteryAccount']['balanceDeposit'] = data["account"]['balanceDeposit']
    data['gameLotteryAccount']['balanceAll'] = data["account"]['balance'] + data["account"]['balanceDeposit']
    data['gameLotteryAccount']['point'] = data["account"]['point']
    data['gameLotteryAccount']['code'] = P2C(data["account"]['point']) 

    del data['gameLotteryMethodList']
    del data['gameLotteryInfoList']
    del data['gameLotteryTypeList']
    del data['gameLotteryShowTypeList']
    
    return data

def get_game_methods():
    global gameList, methods, gameMethods
    gameList, methods = getGameConfig()
    gameMethods = getGameMethods(gameList, methods)
    
    global ThreadC
    if ThreadC: ThreadC.join()
    ThreadC = threading.Thread( None, updateCache, "Thread-Update" )
    ThreadC.start()
    
    return gameList, methods, gameMethods
    
def getGameLotteryMethodList():
    global gameList, methods, gameMethods
    
    if checkTime("initData", 1200): 
        gameList, methods = rs.hvals(KEY.Games), rs.hvals(KEY.Methods)
        gameMethods = rs.hvals(KEY.LotteryMethods)
        
    else:    
        gameList, methods, gameMethods = get_game_methods()
        
    return gameList, methods, gameMethods
 
    
def getInitData():
    game_types = get_game_types()
    config = { "gameLotteryTypeList": game_types, 
              "gameLotteryConfig":{"sysQuotaRange":[],"sysAmountRange":[] }, 
              "gameLotteryAccount":{"availableBalance": 0.0,"blockedBalance":0.0,"code":1998,"point":9.9,"codeType":0,
                    "extraPoint":0.0,"playStatus":0,"allowEqualCode":True,"isDividendAccount":False},"msgCount":0,
              "gameLotteryInfoList": 
              []
              ,"systemNoticeList":[
                # {"id":8,"title":"【时尚娱乐】新用户通知","content":None,"time":"2022-11-22","status":0}
              ],
              "gameLotteryMethodList": [],
              "gameLotteryShowTypeList": game_types
    }
    glcs = ["sysCode", "sysCodeMax", "sysCodeMin", "sysPoint", "sysUnitMoney"]
    for k in glcs: config['gameLotteryConfig'][k] = getConfig(k)
    
    gameList, methods, gameMethods = getGameLotteryMethodList()
    config['gameLotteryInfoList'] = gameList
    '''新版改为取所有游戏和相应玩法的排列组合，不知对原APP业务是否产生影响'''
    config['gameLotteryMethodList'] = gameMethods # methods
    
    return config
 
'''检查缓存时间'''
def checkTime(key, cacheTime = 600, update=True):
    lastTime, seconds = rs.hget(KEY.Times, key, False), 0
    if lastTime!=None: seconds = (datetime.now() - S2DT(lastTime)).seconds
    if seconds > 0 and seconds < cacheTime: return True
    if update: rs.hset(KEY.Times, key, TM())
 
    return False
 
def updateCache():
    L.log('update initData cache...')
    global gameList, methods, gameMethods

    for line in gameList:
        rs.hset(KEY.Games, line['shortName'], line)
    '''所有玩法加入缓存，用于查询'''
    for line in methods:
        k = str(line['methodName']) + "_" + str(line['type'])
        rs.hset(KEY.Methods, k, line)
    
    '''所有游戏-玩法组合加入缓存，用于查询'''
    for line in gameMethods:
        k = str(line['methodName']) + "_" + str(line['lottery'])
        rs.hset(KEY.LotteryMethods, k, line)
        
    L.log('Update Cache, Games: {},  Play Methods: {}'.format(len(gameList), ',', len(methods)))
    
    # rs.set(KEY.Methods, methods)
    # for line in methods:
    #     rs.hset('methods', line['methodName'], line)
 
def loadConfig():
    db = Database()
    sql = "select name, value, isNumb from config"
    cursor = db.selectEx(sql, ())
    cfg = {}
    for (key, value, isNumb) in cursor:
        cfg[key] = value 
        if isNumb: cfg[key] = int(value) if isNumb > 1 else float(value)    
    for key in cfg: rs.hset(KEY.Config, key, cfg[key])
    rs.hset(KEY.Times, "config", TM())
 
def getConfig(key, toDict = True):
    if checkTime("config", 600, False):
        return rs.hget(KEY.Config, key, toDict)
    else:    
        loadConfig()
        return rs.hget(KEY.Config, key, toDict)
    
def get_system_config(name):
    db = Database()
    names = name.split(",")
    ns = ','.join(["'" + str(n) + "'" for n in names])
    sql = "select variableName, value, mark from config where variableName in ({})".format(ns)
    item = {}
    for (n, value, mark) in db.select(sql, ()):
        item[n] = {'value': value, 'mark': mark}
    return item

def set_system_config(user, name, value):
    db = Database()
    sql = "update config set value=%s where variableName = %s"
    flag = db.execute(sql, (value, name))
    sql = "select name, value, category from config where variableName = %s"
    res = db.selectEx(sql, (name, ))
    if len(res) != 0: 
        if res[0][2] == "other": rs.hset(KEY.Config, res[0][0], res[0][1])         
            
    return flag != -1, "操作失败！"
     
def loadCode(tm = 6000, gm = ''):
    if checkTime("loadCode", tm): return
    L.log("Load open code...")
    db = Database()
    cursor = None
    for name in URL.Lotterys:
        if gm != '' and name != gm: continue
        sql = '''SELECT name, issue, openCode, openTime FROM open_code where name=%s order by issue desc limit 120'''
        cursor = db.select(sql, (name, ), cursor)   
        rs.delete(name) 
        for (name, issue, openCode, openTime) in cursor:
            key = issue.replace('-', '')
            item = {'issue': issue, 'number': openCode, 'pass': 1,
                    'dateline': T2S(openTime), 'time': DT2TMS(openTime) }
            rs.hset(name, key, item)
            # print item['issue'], rs.hexists('cqssc', key)
            
        L.log('Load Game ' + name + ' Open Code OK.')
        '''End For 2'''    
    '''End For 1'''


'''获取转账银行卡'''    
def getTransferCard(db = None, user = ""):
    if not db: db = Database()
    lv = "" 
    if user != "": lv = get_user_level(db, user)
    keysT = ['bankName', 'bankBranch', 'bankCardName', 'bankCardId']
    sqlT = "select id, " + ",".join(keysT) + " from pay_transfer where isStop=0 \
        and (forUsers like '%{}%' or forUsers='')".format(lv)
    lines = []
    for item in db.select(sqlT, ()):
        line = {'tid': item[0]}
        for i, k in enumerate(keysT): line[k] = item[i + 1]
        lines.append(line)
    return None if len(lines) == 0 else lines[random.randint(0, len(lines) - 1)]
    
def loadPayMethods(isAll = False, user = ""):
    db = Database()
    keys = ['type', 'method', 'minUnitRecharge', 'maxUnitRecharge', 'feeRate', 'status', 'image', 'name', 
            'code', 'link', 'isDefault', 'isTransfer']
    # 下一步才会请求
    # card = getTransferCard(db, user)
    
    sql = "select m.id, " + ",".join(keys) + " from pay_method m" + ("" if isAll else " where status = 0")
    sql += " order by isDefault desc"
    cursor = db.select(sql, ())
    
    idx = 0
    lsThrid, lsTransfer = [], []
    for item in cursor:
        M = dict((keys[i], item[i + 1]) for i in range(len(keys)))
        M['id'], M['tid'] = item[0], 0
        line = {"id": M['id'], "name": M['name'], "code": M['code'], 'label': M['name'], 
                'img': '' if not M['image'] else '/static/images/' + M['image'],
                "minUnitRecharge": M['minUnitRecharge'], "maxUnitRecharge": M['maxUnitRecharge'], "link": M['link'], 
                'methodList': [{"id": M['id'], "type": M['type'], "method": M['method'], "status": M['status'],
                                'isDefault': M['isDefault'],
                                "feeRate": M['feeRate'], 'image': M['image'], "minUnitRecharge": M['minUnitRecharge'], 
                                "maxUnitRecharge": M['maxUnitRecharge']}], 
                "banklist":[],
                'type': M['type'],
                "transfer": {}
        }
        idx += 1
        '''暂时用处不大'''
        rs.hset(KEY.PayMethods, M['method'], line['methodList'][0])
        lines = lsThrid if M['isTransfer'] == 0 else lsTransfer   # M['type']
        lines.append(line)
    
    return lsThrid, lsTransfer


def getPayMethods(user):
    lsThrid, lsTransfer = loadPayMethods(False, user)
    lsThrid.insert(0, {'name': "请选择"})
    return {
        "thridList": lsThrid,
        "transferList": lsTransfer,
        "rechargeConfig": {
            "isOpen":1,
            "serviceMsg":"充值服务正在维护中",
            "serviceTime":"00:00~23:59"
        }
    }

def getPay(billno, data):  
    fPath = os.path.dirname(__file__) + "/static/images/"
    payType = data['payType'] if data['payType'] != '' else 'OTHER'
    base64_data, fName = "", rs.hget(KEY.PayMethods, payType)['image']
    print fName
    try:
        with open(fPath + fName, "rb") as f:
            base64_data = base64.b64encode(f.read())
    except:
        print 'Error Image', fName
    context = {
        "amount": data['amount'],
        "codeUrl": "data:image/png;base64," + base64_data,
        "payType": data['payType'],
        "urlType": 'Base64',
        "billno": billno,
        "mark": data['mark']
    }
    
    return context

# 获取默认固定分红配置
def loadDefaultDividend(db = None):
    if not db: db = Database()
    keys = ['dayCount', 'ruleId', 'lossAmount', 'lossDays', 'consumeAmount', 'consumeDays', 'pointLimit1',
            'activeUser', 'scalePoint', 'extraRules']
    sql = "select " + ','.join(keys) + " from dividend_admin a join dividend_config c on \
        ruleId = c.id and isDefault = 1 "
    line = None
    for item in db.select(sql, ()):
        line = dict((k, item[i]) for i, k in enumerate(keys))
    
    rs.set(KEY.DividendSyetem, line)
    
    return line    

def get_default_dividend(db=None):
    dividend = rs.get(KEY.DividendSyetem)
    if dividend:
        return dividend
    else:
        return loadDefaultDividend(db)


    
def changeConfigOther(user, dts):
    db = Database()
    command = []
    for key in dts:
        sql = "update config set value = %s, updateTime = %s where name = '{}' and category = 'other'".format(key)
        command.append([sql, (dts[key], TM())])
    keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = (user, 'config', 'other', ','.join(dts.keys()), ','.join([str(v) for v in dts.values()]))

    command.append([sqlO, paramsO])
    rst = db.Transaction(command)
    
    '''刷新缓存'''
    if rst[0]: 
        for key in dts: rs.hset(KEY.Config, key, dts[key])
        
    return rst[0]

def getOtherSetting(db = None):
    if not db: db = Database()
    sql = "select name, value, isNumb from config where category = 'other'"
    res = {}
    for (name, value, isNumb) in db.select(sql, ()):
        res[name] = float(value) if isNumb else value
    
    return res   

def changeGameConfig(user, name, key, value):
    db = Database()
    sql = "update game_config set {} = %s where lottery = %s".format(key)
    keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = (user, 'game_config', key, name, value)

    comands = [[sql, (value, name)], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    '''刷新缓存'''
    if rst[0]: 
        line = rs.hget(KEY.Games, name)
        line[key] = value
        print line
        print name
        rs.hset(KEY.Games, name, line)
        
    return rst[0]

""" 彩种编辑配置 """
def editGameConfigExt(user,lottery,showName, status, isShow,selfOpenEnable,openMode,stopDelay):
    if (str(lottery).strip() == ''
            or str(showName).strip() == ''
            or str(status).strip() not in ['0','1']
            or str(isShow).strip() not in ['1','-1']
            or str(selfOpenEnable).strip() not in ['1','2']
            or str(openMode).strip() not in ['', '0','1']
            or not str(stopDelay).isdigit()
    ):
        return False
    params = {'showName': showName, 'status': status, 'isShow': isShow, 
              'selfOpenEnable': selfOpenEnable, 'stopDelay': stopDelay}
    
    if openMode != '': params['openMode'] = openMode
    keys = params.keys()
    sts = ','.join(k + "=%s" for k in keys)
    values = [params[k] for k in keys]
    db = Database()
    sql = "update game_config set " + sts + " where lottery = %s"
    values.append(lottery)
    
    keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = (user, 'game_config', "lottery,showName, status, isShow,selfOpenEnable,openMode,stopDelay.{}".format(openMode), 
               lottery, "showName ={},status={},isShow={},selfOpenEnable={},stopDelay={},lottery={}".format(*values))

    comands = [[sql, values], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    '''刷新缓存'''
    if rst[0]:
        line = rs.hget(KEY.Games, lottery)
        line['showName'] = showName
        line['status'] = status
        line['isShow'] = isShow
        line['selfOpenEnable'] = selfOpenEnable
        line['stopDelay'] = stopDelay
        print line
        print lottery
        rs.hset(KEY.Games, lottery, line)

    return rst[0]

def changeMethodConfig(user, name, _type, key, value):
    db = Database()
    sql = "update game_method set {} = %s where methodName = %s and type = %s".format(key)
    keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = (user, 'game_config', key, name, value)

    comands = [[sql, (value, name, _type)], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    '''刷新缓存'''
    if rst[0]: 
        k = name + "_" + str(_type)
        line = rs.hget(KEY.Methods, k)
        line[key] = value
        print line
        print k, value
        rs.hset(KEY.Methods, k, line)
        
    return rst[0]

def setGameStatus(user, name, status):
    return changeGameConfig(user, name, 'status', status)
    
def setGameMode(user, name, mode):
    return changeGameConfig(user, name, 'openMode', mode)
    
def setMethodStatus(user, method, _type, status):
    return changeMethodConfig(user, method, _type, 'status', status)

def setMethodInfo(user, method, _type, key, value):
    return changeMethodConfig(user, method, _type, key, value)


'''游戏列表·方法列表'''
def get_games_and_methods(status="",isShow="",is_self="",openMode="",lottery_type=""):
    db = Database()
    gameList = []

    # 查询所有的游戏
    keysG = ["id", "lottery", "showName", "shortName", "frequency", "type", "times", "stopDelay", "downCode",
             "fenDownCode",
             "liDownCode", "floatBonus", "maxBonus", "sort", "status", "description", "openMode", "selfOpenEnable",
             "isShow", "killNumberEnable", "killRate"]
    sql = "select " + ",".join(keysG) + " from game_config"

    params = []
    sql += " where 1=1 "
    if str(status).strip() != "" and status in ['0','1']:
        params.append(status)
        sql += " and status = %s"

    if str(isShow).strip() != "" and isShow in ['-1','1']:
        params.append(isShow)
        sql += " and isShow = %s"

    if str(is_self).strip() != "" and is_self in ['1','2']:
        params.append(is_self)
        sql += " and selfOpenEnable = %s"

    if str(openMode).strip() != "" and openMode in ['0','1']:
        params.append(openMode)
        sql += " and openMode = %s"

    if str(lottery_type).strip() != "":
        params.append(lottery_type)
        sql += " and type = %s"

    gameList_res = db.read_all(sql,params=params)
    if len(gameList_res) > 0:
        gameList = gameList_res

    loadGameInfo(db)

    return gameList


'''游戏列表·方法列表'''
def get_games_hot(showName="", frequency="", page=0, size=20):
    db = Database()
    gameList = []

    # 查询所有的游戏
    keysG = ["id", "lottery", "showName", "shortName", "frequency","sort","openMode", "selfOpenEnable",
             "isShow"]
    sql = "select " + ",".join(keysG) + " from game_config"

    params = []
    sql += " where 1=1 "
    if str(showName).strip() != "":
        showName = '%' + showName + '%'
        params.append(showName)
        sql += " and showName like %s"

    if str(frequency).strip() != "" and frequency in ['self','high',"low"]:
        params.append(frequency)
        sql += " and frequency = %s"

    sql += " order by sort desc"
    gameList_res = db.selectPageExt(sql,params=params,page=page,size=size)
    if len(gameList_res) > 0:
        gameList = gameList_res

    return gameList


""" 彩种编辑配置 """
def editGameHotExt(user,lottery, sort, frequency):

    if (str(lottery).strip() == ''
            or str(lottery).strip() == ''
            or str(frequency).strip() not in ['self','low',"high"]
    ):
        return False
    try:
        sort = int(sort)
    except:
        return False

    db = Database()
    sql = "update game_config set sort = %s,frequency=%s where lottery = %s"
    params = (sort, frequency, lottery)

    keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = (user, 'game_config', "sort, frequency", lottery, "sort={},frequency={}".format(sort, frequency))

    comands = [[sql, params], [sqlO, paramsO]]
    rst = db.Transaction(comands)

    '''刷新缓存'''
    if rst[0]:
        line = rs.hget(KEY.Games, lottery)
        line['sort'] = sort
        line['frequency'] = frequency
        print line
        # print lottery
        rs.hset(KEY.Games, lottery, line)

    return rst[0]

def get_lottery_by_type(type,gameList,code):
    """
    根据类信息获取游戏
    :param type: 类型
    :param gameList: 游戏
    :return:
    """
    res = []
    for g in gameList:
        if g['type'] == type:
            g['parentCode'] = code
            g['code'] = g['lottery']
            del g['lottery']
            g['state'] = g['status']
            del g['status']
            g['enableFlag'] = g['isShow']
            del g['isShow']
            g['name'] = g['showName']
            del g['showName']

            res.append(g)
    return res

def deal_games_list(status="",isShow="",is_self="",openMode=""):
    """
    获取彩种列表
    :return:
    """
    config = getInitData()
    lottery_types = config['gameLotteryTypeList']
    gameList = get_games_and_methods(status,isShow,is_self,openMode)

    context = []
    for type in lottery_types:
        if type['status'] == 0:
            type['parentCode'] = 0
            type['isParent'] = True
            context.append(type)
            res = get_lottery_by_type(type['id'],gameList,type['code'])
            if len(res) > 0 :
                context.extend(res)

    return context


'''获取彩票数据'''
def get_lottery(lottery,selfOpenEnable):
    db = Database()
    sql = "select * from game_config where lottery=%s and selfOpenEnable=%s"
    params = (lottery,selfOpenEnable)
    return db.read_one(sql,params)

def get_methods(lotteryCode='ssc'):
    """
    获取所有的玩儿法
    :param lotteryCode:
    :return:
    """
    db = Database()
    methods = []
    keysM = ["id", "type", "groupName", "name", "methodName", "maxRecord","sort",
             "status"]
    sql = "select " + ",".join(keysM) + " from game_method where 1=1 "

    config = getInitData()
    lottery_types = config['gameLotteryTypeList']

    lottery_type = ""

    for l in lottery_types:
        if l['code'] == lotteryCode and l['status'] == 0:
            lottery_type = str(l['id'])
            break
    else:
        return []

    try:
        params = []
        if str(lottery_type).strip() != "":
            sql += " and type=%s"
            params.append(lottery_type)

        # 获取所有的方法
        sql += " order by id"
        methods = db.read_all(sql,params)

        # 获取所有的分组
        groups = set()

        def dispatch_group(group_name,methods):
            res = []
            for m in methods:
                if m['groupName'] == group_name:
                    res.append(m)
            return res

        def get_groups(methods,groups):
            for m in methods:
                groups.add(m['groupName'])

        get_groups(methods,groups=groups)
        groups = list(groups)

        context = []
        for g in groups:
            context.append({"groupName":g,"data": dispatch_group(g,methods)})

        methods = context
    except:
        methods = []

    loadGameInfo(db)
    # 获取所有的方法
    return methods

def get_type_list():
    """
    获取所有的彩种
    :return:
    """
    config = getInitData()
    lottery_types = config['gameLotteryTypeList']
    res = []
    for t in lottery_types:
        if t['status'] == 0:
            res.append(t)
    return res

"""彩票导航"""
def navigate_lottery(type_name='ssc'):
    config = getInitData()
    lottery_types = config['gameLotteryTypeList']
    for t in lottery_types:
        if t['code'] == type_name:
            type_id = t['id']
            gameList = get_games_and_methods(lottery_type=type_id)
            res = []
            for g in gameList:
                g['code'] = g['lottery']
                del g['lottery']
                g['state'] = g['status']
                del g['status']
                g['enableFlag'] = g['isShow']
                del g['isShow']
                g['killNumberEnable'] = g['openMode']
                g['name'] = g['showName']
                del g['showName']
                res.append(g)
            return res
    else:
        return []

def get_version(mcode):
    v = rs.hget(KEY.Config, "appVersion", False)
    return {'force': 1,  'version': v, 'desp': ''}

if __name__ == '__main__':
#     print get_lottery(lottery='t1s30')
#     manage_pay_methods()
#     loadDefaultDividend()
    
#     print getPay("12039")
    import json
#     print get_system_config("NICKNAME_FLAG")
    
#     item = rs.hget(KEY.MethodConfig, "t1s30_lhsg")
#     item['bonus'] = ""
#     rs.hset(KEY.MethodConfig, "t1s30_lhsg", item)
#     print rs.hget(KEY.MethodConfig, "t1s30_lhsg")
#     print float(rs.hget(KEY.Config, "percLimitWithdraw", False)) / 100.0
    
#     rs.hset(KEY.Config, KEY.GameConfig, [['t1s30', -4, 0]])
#     print rs.hget(KEY.Config, KEY.GameConfig)
    rs.hset(KEY.IPLimit, '218.201.232.126', TM())
    print rs.hget(KEY.IPLimit, '218.201.232.126', False)
#     print rs.hget(KEY.IPLimit, '61.183.15.184', False)
#     print rs.hkeys(KEY.IPLimit)
    
#     print getMethodConfigDiff()
#     print rs.hvals(KEY.MethodConfig)
    
#     issue = "20190208-0145"
#     info = rs.hget("qqmin", issue.replace('-', ''))
#     loadDefaultDividend()
#     print rs.hkeys(KEY.PayMethods)
#     loadCode(1, 'cqssc')
#     db = Database()
#     updateCache()
#     gc = _get_game_config_diff()
#     print gc
#     rs.hset(KEY.Config, KEY.GameConfig, gc) 
#     print rs.hset(KEY.Config, "gameConfigTime", "2023-06-04 02:41:00")
#     print rs.hget(KEY.Config, "gameConfigTime", False)
    
#     getTransferCard(db, "test004")
#     get_user_level(None, ["test004", "yong"])
#     get_level_by_money(10000)
#     db = Database()
#     loadGameInfo(db)
#     getGameConfig()
#     print editGameConfigExt("abc","t1s30","新加坡30秒彩", 1, 1,1, '',0)   
    
    '''重新加载配置'''
#     updateConfig()
#     loadDefaultDividend()
#     getInitData()
#     loadConfig()
#     print rs.hget('times', 'config', False)
#     print checkTime('config', 50)
#     print getConfig("maxBonus")
#     keys = rs.hkeys('cqssc')
#     loadCode()
#     print keys
#     print rs.hget(KEY.Config, "minRebates", False)
#     print rs.hget(KEY.Config, "minRebates")
#     print rs.hget(KEY.Config, "rootSysAccount", False)
#     print rs.hget(KEY.Config, "maxGameBonus", False)
#     print rs.hvals(KEY.Games) 
#     print rs.hset(KEY.Config, "appVersion", 199)
#     print rs.hget(KEY.Config, "appVersion", False)
#=============================================================================
#     db = Database()
#     sql = "SELECT lottery, apiSrc, apiUrl FROM game_config where apiStatus=1"
#     for (lottery, apiSrc, apiUrl) in db.select(sql, ()):
#         print rs.hget(KEY.ApiGames, lottery + "_url", False)


#     print get_game_config_diff()
#     print rs.hdel('cqssc', '202023-042')
#     print rs.hget('cqssc', keys[1])
#     print "%s《手续费%s%%》" % (1, 2)
#     getInitData()
#     loadConfig()
#     print rs.hget(KEY.Config, 'payDesp', False)
#     print rs.hget(KEY.Config, 'payServer', False)
#     print json.dumps(rs.get(KEY.Methods), ensure_ascii=False)
#     print rs.hget(KEY.MethodCache, "wxzhixfs_1")
#     print rs.hvals(KEY.Games), rs.get(KEY.Methods)

#     rs.hset('times', "initData", TM())
#     print (datetime.now() - S2DT(rs.hget('times', "initData", False))).seconds
#     print getPayMethods()
#     print getConfig("sysCodeMin")