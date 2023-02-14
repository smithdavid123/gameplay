#coding:utf8
'''
'''
import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

# import socketio
# import eventlet.wsgi
from flask import Flask, request, current_app, g, render_template, redirect
from flask_cors import *
from functools import wraps
from config import Config as C
# import crawler as worker
import json
import login as lg
from libs.log import L
from libs.utils import TMSS, TM, P2C, getIpAddr
from mCode import getOpenCode, getOpenTime, getGameLottery, getLoopPage, getBalance, preMoneyOut, getOpenTimes
from mChase import addChase, searchChase, getChase, cancelChase
import mOrder as MO
import mBill as MB
import mReport as MR
import mSystem as MS
import mInit as MI
import mUser as MU
import mPlan as MP
from mUser import addUser, getChildren, getAccountList, setAccountInfo, setAccount, createAccount, \
    delAccount, setParentTo, getPassword

from mCache import RequestCache
from libs.utils import RandCode
from libs.authCode import create_validate_code
from libs.redisEx2 import MyRedis as rs
from mTeam import getTeamOverview, searchOnlineUser, preAddAccount
import mTeam
import mTrend
import mUpload
import mContract as MC
import common.tools as Tool
from common.key import KEY
import money_auto as MA


# sio = socketio.Server()
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'AreUOK'
app.config['TOKEN_EXPIRATION'] = 7200

from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()


'''Users存Hash及用户信息，TKS存Hash及对应Token'''
# Users = {'foo@bar.tld': {'password': 'secret'}}
# TKS = {}
    
def get_token(username, level = 0, scope = "1"):
    expiration = current_app.config['TOKEN_EXPIRATION']
    s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
    token = s.dumps({ 'user': username, 'level': level, 'scope': scope })
    return token.decode('ascii')

'''其实未使用该装饰器'''
@auth.verify_password
def verify_password(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except BadSignature:
        return False, "温馨提示：登录超时，请重新登陆！" # 'token is invalid'
    except SignatureExpired:
        raise False, 'token is expired'
    '''End try'''
     
    g.user = {'user': data['user'], 'level': data['level'], 'scope': data['scope']}
    return True, "OK"

def authRequired(level):
    def wrapper(func):
        @wraps(func)
        def inner_wrapper(*args, **kwargs):
            R = request.form if request.method=='POST' else request.args
            token, lc = R.get('tk', ''), R.get('lc', '')
            
            '''未提供token'''
            if token=='':
                return ErrorResponseJson("温馨提示：登录超时，请重新登陆！", None, '110') # 116-06
            flag, message = verify_password(token)
            '''token无效'''
            if not flag: 
                user = R.get('user', '')
                L.log(user + " auth failed")
                return ErrorResponseJson(message, None, '110')
            '''二次验证'''
            info = rs.hget('TKS', lc)
            
            # if lc not in TKS or TKS[lc]['tk']!=token: 
            if not info or info['tk']!=token:
                return ErrorResponseJson("登录超期，请重新登陆!", None, '110')
            
            '''权限检查'''
            U = rs.hget('UserInfo', info['user'])
            if not U or U['level'] < int(level[2:]): return ErrorResponseJson("权限不够或需要重新登陆！")
            
            '''此处可以优化，由装饰器控制返回结果'''
            res = RequestCache(func, info['user'], request, *args, **kwargs)
            # res = RequestCache(func, TKS[lc]['user'], request, *args, **kwargs)
            return res
            # return func(TKS[lc]['user'], *args, **kwargs)
        return inner_wrapper
    return wrapper    


'''--------------------------------------业务接口部分------------------------------------------'''
@app.route('/')
def index():
    return "Welcome..."

def getClientIP(request):
    ips = request.headers.get('X-Forwarded-For', '')
    return ips.split(',')[0].strip()

@app.route('/webLoginApp', methods=['GET', 'POST'])
def webLoginApp():
    return webLoginCommon(request, 1)
    
@app.route('/webLogin', methods=['GET', 'POST'])    
def webLogin(app = None):
    return webLoginCommon(request)


def webLoginCommon(request, app = None):
    R = request.form if request.method=='POST' else request.args
    securityCode, codeTms = str(R.get('securityCode', '')), str(R.get('tms', ''))
    correctCode = str(rs.hget('securityCode', codeTms, False))

    if not app and (codeTms=='' or securityCode=='' or correctCode!=securityCode): 
        return ErrorResponseJson('验证码有误， 请重新输入！', None, '103-02')
    
    username, password = R.get('username', ''), R.get('password', '')
    ip = getClientIP(request)
    address = getAddr(ip)
    data = lg.com_login(username, password, ip, address, app)
    if data['error']: return ErrorResponseData(data)
    
    L.log('User Login:', username, ip)
    token = get_token(username)
    uKey = str(abs(hash(token)) + 3456)
    
    '''TODO: 定期删除TKS或设置redis过期时间，防止太长'''
    U = data['data']
    userInfo = {'name': username, 'level': U['level'], 'point': U['point'], 'type': U['type'], 
                'allowTransfer': U['allowTransfer'], 'allowWithdraw': U['allowWithdraw'], 'id': U['id']}
    info = rs.hget('Users', uKey)
    if info and info['name'] != username: uKey += RandCode(6)
    rs.hset('TKS', uKey, {'tk': token, 'user': username, 'time': TM()})
    rs.hset('Users', uKey, userInfo)
    rs.hset(KEY.UserInfo, username, userInfo)

    data = {'tk': token, 'lc': uKey, 'lv': U['level'], 'address': address, "ip": ip, "client": "Win", "loginTime": TMSS() }
    
    print data
    
    # data = {'tk': token, 'lc': uKey, "ip":"117.139.249.56","address":"[中国, 四川, 成都]","client":"Win","loginTime":1545926779810}
    
    return NormalResponseJson(request, data)

'''根据IP获取地区信息'''
def getAddr(ip):
    address = "" # "[中国, 四川, 成都]"
    if ip != '127.0.0.1': 
        addrCache = rs.hget(KEY.IPCache, ip, False)
        if not addrCache: 
            address = addrCache
        else:
            address = getIpAddr(ip)
            if address != '': rs.hset(KEY.IPCache, ip, address)
    return address


@app.route('/isLogin', methods=['GET', 'POST'])
@authRequired('lv0')
def isLogin(user):
    print "Request isLogin", user
    return NormalResponseJson(request, {})

@app.route('/logout', methods=['GET', 'POST'])
@authRequired('lv0')
def logout(user):
    uKey = request.form.get('lc', '')
    rs.hdel('TKS', uKey)
    rs.hdel('Users', uKey)
    ip = getClientIP(request)
    address = getAddr(ip)
    lg.loginOut(user, ip, address)
    
    return NormalResponseJson(request, {})

@app.route('/listAllGames', methods=['GET', 'POST'])
@authRequired("lv0")
def listAllGames(user):
    data = {"gameList":[{"id":1,"code":"AG","name":"AG视讯","status":-1,"platformName":"AG视讯"},{"id":2,"code":"PT","name":"PT视讯","status":-1,"platformName":"PT视讯"},{"id":3,"code":"KY","name":"KY开元棋牌","status":-1,"platformName":"KY开元棋牌"},{"id":4,"code":"FT","name":"CMD368体育","status":-1,"platformName":"CMD368体育"},{"id":5,"code":"GG","name":"GG捕鱼","status":-1,"platformName":"GG捕鱼"},{"id":6,"code":"DG","name":"DG视讯","status":-1,"platformName":"DG视讯"}]}
    
    return NormalResponseJson(request, data)

@app.route('/game/queryBalance', methods=['GET', 'POST'])
@authRequired('lv0')
def queryBalance(user):
    gameId = int(request.form.get('gameId', 1))
    if gameId > 0:
        return ErrorResponseJson('你没有开通该游戏平台', None, '124-02') 
    info = getBalance(user)
    data = {"account_balance": info[0], "balanceDeposit": info[1], 
            'balanceAll': info[0] + info[1] }
    
    return NormalResponseJson(request, data)

@app.route('/game/cancelOrder', methods=['GET', 'POST'])
@authRequired('lv0')
def cancelOrder(user):
    billno = request.form.get('billno', '')
    
    flag, data = MO.cancelOrder(user, billno)
    if not flag: return ErrorResponseJson(data, None)
    
    return NormalResponseJson(request, {})

@app.route('/game/cancelChase', methods=['GET', 'POST'])
@authRequired('lv0')
def _cancelChase(user):
    billno = request.form.get('billno', '')
    
    flag, data = cancelChase(user, billno)
    if not flag: return ErrorResponseJson(data, None)
    
    return NormalResponseJson(request, {})

@app.route('/game/staticChaseTime', methods=['GET', 'POST'])
@authRequired('lv0')
def staticChaseTime(user):
    name = request.form.get('name', '')
    
    data = getOpenTimes(name)
    
    return json.dumps(data, ensure_ascii=False)

@app.route('/game/addChase', methods=['GET', 'POST'])
@authRequired('lv0')
def addChaseM(user):
    txt = request.form.get('text', {})
    ps = json.loads(txt, encoding = "utf8")
    orderList, planList, winStop = ps['orderList'], ps['planList'], ps['winStop']
    
    flag, data = addChase(user, orderList, planList, winStop)
    if not flag: return ErrorResponseJson(data, None)
    
    return NormalResponseJson(request, data)

@app.route('/game/searchChase', methods=['GET', 'POST'])
@authRequired('lv0')
def searchChaseM(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    lottery = request.form.get('lottery', '')
    status = request.form.get('status', '')
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    
    data = searchChase(user, lottery, status, page, size, sTime, eTime)
        
    return NormalResponseJson(request, data)

@app.route('/game/getChase', methods=['GET', 'POST'])
@authRequired('lv0')    
def getOrderM(user):
    billno = request.form.get('billno', 0)
    
    data = getChase(user, billno)
    
    return NormalResponseJson(request, data)

@app.route('/initData', methods=['GET', 'POST']) 
@authRequired('lv0')   
def initData(user):
    data = MI.getInitData()
    data["account"] = lg.getAccount(user)
    
    data['gameLotteryAccount']['availableBalance'] = data["account"]['balance']
    data['gameLotteryAccount']['balanceDeposit'] = data["account"]['balanceDeposit']
    data['gameLotteryAccount']['balanceAll'] = data["account"]['balance'] + data["account"]['balanceDeposit']
    data['gameLotteryAccount']['point'] = data["account"]['point']
    data['gameLotteryAccount']['code'] = P2C(data["account"]['point']) 
    # data['gameLotteryAccount']['isDividendAccount'] = data["account"]['isDividend']
    
    return NormalResponseJson(request, data)

@app.route('/system/listNotice', methods=['GET', 'POST'])  
@authRequired('lv0')  
def listNotice(user):
    U = rs.hget('UserInfo', user)
    if not U: return []
    tp = U['type'] if U['level'] == 0 else U['level'] + 1 
    data = MS.listNotice(user, tp, U['level'] > 0)
    
    return json.dumps(data, ensure_ascii = False)
    
@app.route('/system/getNotice', methods=['GET', 'POST'])  
@authRequired('lv0')  
def getNotice(user):
    _id = request.form.get('id', '-1')
    if _id == '-1': return ErrorResponseJson("ID错误！")
    data = MS.getNotice(user, _id)
    
    return NormalResponseJson(request, data)

@app.route('/system/changePayStatus', methods=['GET', 'POST'])  
@authRequired('lv2')  
def changePayStatus(user):
    status = request.form.get('status', '')
    _id = request.form.get('id', '-1')
    if status == '' or _id == '-1': return ErrorResponseJson("参数错误！")
    flag = mUpload.changePayStatus(user, _id, status)
    
    if not flag: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, "OK")

@app.route('/system/changePayDefault', methods=['GET', 'POST'])  
@authRequired('lv2')  
def changePayDefault(user):
    _id = request.form.get('id', '-1')
    if _id == '-1': return ErrorResponseJson("参数错误！")
    flag = mUpload.changePayDefault(user, _id)
    
    if not flag: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, "OK")

@app.route('/system/delPay', methods=['GET', 'POST'])  
@authRequired('lv2')  
def delPay(user):
    _id = request.form.get('id', '-1')
    if _id == '-1': return ErrorResponseJson("参数错误！")
    flag = mUpload.delPay(user, _id)
    
    if not flag: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, "OK")

@app.route('/system/uploadImage', methods=['GET', 'POST'])  
@authRequired('lv2')  
def uploadImage(user):
    R = request.form
    imgFile = request.files.get('codeImage')
    _id = R.get('id', '-1')
    name = R.get('name', '')
    method = R.get('method', '')
    fee = R.get('fee', '')
    minOnce = R.get('minOnce', '')
    maxOnce = R.get('maxOnce', '')
    isDefault = R.get('isDefault', 0)
    type_ = R.get('type', 1)
    
    trans = {'id': R.get('tid', ''), 'bankName': R.get('bankName', ''), 
             'bankBranch': R.get('bankBranch', ''),
             'bankCardName': R.get('bankCardName', ''),
             'bankCardId': R.get('bankCardId', ''),
    }
    
    params = [_id, name, method, fee, minOnce, maxOnce, isDefault, type_]
    flag, data = mUpload.upload(user, imgFile, params, trans)
    
    if not flag: return ErrorResponseJson("保存错误，请检查配置！")
    return NormalResponseJson(request, data[0])

'''计划配置相关'''
@app.route('/system/setPlane', methods=['GET', 'POST'])  
@authRequired('lv2')  
def setPlane(user):
    lottery = request.form.get('lottery', '')
    issue = request.form.get('issue', '')
    number = request.form.get('number', '')
    
    flag, data = MP.setPlane(lottery, issue, number)
    if not flag: return ErrorResponseJson(data)

    return NormalResponseJson(request, data)

@app.route('/system/getPlane', methods=['GET', 'POST'])  
@authRequired('lv2')  
def getPlane(user):
    lottery = request.form.get('lottery', '')
    
    data = MP.getPlane(lottery)

    return NormalResponseJson(request, data)

@app.route('/system/delPlane', methods=['GET', 'POST'])  
@authRequired('lv2')  
def delPlane(user):
    lottery = request.form.get('lottery', '')
    issue = request.form.get('issue', '')
    data = MP.delPlane(lottery, issue)

    return NormalResponseJson(request, data)


@app.route('/loopPage', methods=['GET', 'POST'])
@authRequired('lv0')    
def loopPage(user):
    # data = {"lotteryBalance":99.0,"baccaratBalance":0.0,"totalBaccaratBalance":0.0,"msgCount":0, 'username':'Lucy'}
    data = getLoopPage(user)
    
    return NormalResponseJson(request, data)

'''契约用户'''
@app.route('/agent/loadContractStatus', methods=['GET', 'POST'])
@authRequired('lv0')    
def loadContractStatus(user):
    data = MC.loadContractStatus(user)
    
    return NormalResponseJson(request, data)

'''契约'''
@app.route('/agent/loadDividendContract', methods=['GET', 'POST'])
@authRequired('lv0')    
def loadDividendContract(user):
    data = MC.loadDividendContract(user)
    
    return NormalResponseJson(request, data)

'''契约'''
@app.route('/agent/confirmDividendContract', methods=['GET', 'POST'])
@authRequired('lv0')    
def confirmDividendContract(user):
    content = request.form.get('confirm', 'agree')
    data = MC.confirmDividendContract(user, content)
    
    return NormalResponseJson(request, data)


'''契约'''
@app.route('/agent/listContractAccount', methods=['GET', 'POST'])
@authRequired('lv0')    
def listContractAccount(user):
    page = request.form.get('page', 0)
    size = request.form.get('size', 10)
    data = MC.listContractAccount(user, int(page), int(size))
    
    return NormalResponseJson(request, data)

'''契约'''
@app.route('/agent/prepareEditDividendContract', methods=['GET', 'POST'])
@authRequired('lv0')    
def prepareEditDividendContract(user):
    username = request.form.get('username', 0)
    data = MC.prepareEditDividendContract(user, username)
    
    return NormalResponseJson(request, data)

'''契约'''
@app.route('/agent/applyEditDividendContract', methods=['GET', 'POST'])
@authRequired('lv0')    
def applyEditDividendContract(user):
    username = request.form.get('username', 0)
    scalePoint = request.form.get('scalePoint', None)
    activeUser = request.form.get('activeUser', None)
    extraTxt = request.form.get('extraRules', '[]') 
    extraRules = json.loads(extraTxt, encoding="utf8");
    
    data = MC.applyEditDividendContract(user, username, scalePoint, activeUser, extraRules)
    if not data: return ErrorResponseJson('契约分红规则验证失败', data, '123-02')
        
    return NormalResponseJson(request, data)



'''契约用户'''
@app.route('/agent/loadSalaryContract', methods=['GET', 'POST'])
@authRequired('lv0')    
def loadSalaryContract(user):
    data = MC.loadSalaryContract(user)
    
    return NormalResponseJson(request, data)

@app.route('/game/staticOpenCode', methods=['GET', 'POST'])
@authRequired('lv0')    
def staticOpenCode(user):
    name = request.form.get('name', 'cqssc')
    # L.log("request staticOpenCode: ", name)
    
    data = getOpenCode(name)
    # data = '''[{"lottery":"cqssc","issue":"20181228-021","code":"6,4,5,7,7","code1":null,"code2":null,"time":1545932757000},{"lottery":"cqssc","issue":"20181228-020","code":"6,8,7,9,7","code1":null,"code2":null,"time":1545932435000},{"lottery":"cqssc","issue":"20181228-019","code":"5,9,8,2,5","code1":null,"code2":null,"time":1545932153000},{"lottery":"cqssc","issue":"20181228-018","code":"9,8,1,8,0","code1":null,"code2":null,"time":1545931858000},{"lottery":"cqssc","issue":"20181228-017","code":"2,5,7,1,1","code1":null,"code2":null,"time":1545931558000},{"lottery":"cqssc","issue":"20181228-016","code":"4,7,5,0,3","code1":null,"code2":null,"time":1545931243000},{"lottery":"cqssc","issue":"20181228-015","code":"9,6,3,0,0","code1":null,"code2":null,"time":1545930952000},{"lottery":"cqssc","issue":"20181228-014","code":"9,5,2,5,9","code1":null,"code2":null,"time":1545930658000},{"lottery":"cqssc","issue":"20181228-013","code":"9,2,0,4,2","code1":null,"code2":null,"time":1545930357000},{"lottery":"cqssc","issue":"20181228-012","code":"0,9,2,8,3","code1":null,"code2":null,"time":1545930072000},{"lottery":"cqssc","issue":"20181228-011","code":"9,9,4,4,6","code1":null,"code2":null,"time":1545929759000},{"lottery":"cqssc","issue":"20181228-010","code":"9,0,0,0,2","code1":null,"code2":null,"time":1545929458000},{"lottery":"cqssc","issue":"20181228-009","code":"8,1,8,4,5","code1":null,"code2":null,"time":1545929157000},{"lottery":"cqssc","issue":"20181228-008","code":"0,2,1,4,4","code1":null,"code2":null,"time":1545928857000},{"lottery":"cqssc","issue":"20181228-007","code":"3,8,4,2,4","code1":null,"code2":null,"time":1545928556000},{"lottery":"cqssc","issue":"20181228-006","code":"3,9,0,7,3","code1":null,"code2":null,"time":1545928258000},{"lottery":"cqssc","issue":"20181228-005","code":"5,9,7,4,3","code1":null,"code2":null,"time":1545927958000},{"lottery":"cqssc","issue":"20181228-004","code":"5,1,7,8,2","code1":null,"code2":null,"time":1545927660000},{"lottery":"cqssc","issue":"20181228-003","code":"2,0,3,9,4","code1":null,"code2":null,"time":1545927358000},{"lottery":"cqssc","issue":"20181228-002","code":"6,9,3,2,1","code1":null,"code2":null,"time":1545927088000},{"lottery":"cqssc","issue":"20181228-001","code":"5,3,9,5,6","code1":null,"code2":null,"time":1545926756000},{"lottery":"cqssc","issue":"20181227-120","code":"5,8,4,0,9","code1":null,"code2":null,"time":1545926459000},{"lottery":"cqssc","issue":"20181227-119","code":"1,6,5,9,6","code1":null,"code2":null,"time":1545926188000},{"lottery":"cqssc","issue":"20181227-118","code":"1,9,7,6,7","code1":null,"code2":null,"time":1545925859000},{"lottery":"cqssc","issue":"20181227-117","code":"2,1,9,8,5","code1":null,"code2":null,"time":1545925556000},{"lottery":"cqssc","issue":"20181227-116","code":"6,9,8,1,6","code1":null,"code2":null,"time":1545925258000},{"lottery":"cqssc","issue":"20181227-115","code":"1,7,3,5,9","code1":null,"code2":null,"time":1545924957000},{"lottery":"cqssc","issue":"20181227-114","code":"9,7,4,6,8","code1":null,"code2":null,"time":1545924661000},{"lottery":"cqssc","issue":"20181227-113","code":"8,4,3,0,7","code1":null,"code2":null,"time":1545924358000},{"lottery":"cqssc","issue":"20181227-112","code":"6,9,6,7,0","code1":null,"code2":null,"time":1545924075000},{"lottery":"cqssc","issue":"20181227-111","code":"6,2,7,8,3","code1":null,"code2":null,"time":1545923757000},{"lottery":"cqssc","issue":"20181227-110","code":"7,1,9,8,1","code1":null,"code2":null,"time":1545923461000},{"lottery":"cqssc","issue":"20181227-109","code":"2,9,3,2,4","code1":null,"code2":null,"time":1545923202000},{"lottery":"cqssc","issue":"20181227-108","code":"5,7,3,2,8","code1":null,"code2":null,"time":1545922872000},{"lottery":"cqssc","issue":"20181227-107","code":"1,5,1,6,6","code1":null,"code2":null,"time":1545922562000},{"lottery":"cqssc","issue":"20181227-106","code":"4,5,2,7,6","code1":null,"code2":null,"time":1545922256000},{"lottery":"cqssc","issue":"20181227-105","code":"6,2,7,4,3","code1":null,"code2":null,"time":1545921961000},{"lottery":"cqssc","issue":"20181227-104","code":"3,2,3,5,1","code1":null,"code2":null,"time":1545921661000},{"lottery":"cqssc","issue":"20181227-103","code":"4,4,7,3,3","code1":null,"code2":null,"time":1545921375000},{"lottery":"cqssc","issue":"20181227-102","code":"5,3,2,1,7","code1":null,"code2":null,"time":1545921058000},{"lottery":"cqssc","issue":"20181227-101","code":"2,8,9,3,2","code1":null,"code2":null,"time":1545920775000},{"lottery":"cqssc","issue":"20181227-100","code":"3,2,3,1,0","code1":null,"code2":null,"time":1545920475000},{"lottery":"cqssc","issue":"20181227-099","code":"4,4,1,4,9","code1":null,"code2":null,"time":1545920157000},{"lottery":"cqssc","issue":"20181227-098","code":"8,1,5,3,0","code1":null,"code2":null,"time":1545919877000},{"lottery":"cqssc","issue":"20181227-097","code":"3,8,6,9,8","code1":null,"code2":null,"time":1545919565000},{"lottery":"cqssc","issue":"20181227-096","code":"7,0,0,9,9","code1":null,"code2":null,"time":1545919261000},{"lottery":"cqssc","issue":"20181227-095","code":"2,2,6,9,4","code1":null,"code2":null,"time":1545918672000},{"lottery":"cqssc","issue":"20181227-094","code":"6,3,2,9,9","code1":null,"code2":null,"time":1545918060000},{"lottery":"cqssc","issue":"20181227-093","code":"3,7,5,6,9","code1":null,"code2":null,"time":1545917461000},{"lottery":"cqssc","issue":"20181227-092","code":"3,6,6,9,4","code1":null,"code2":null,"time":1545916857000},{"lottery":"cqssc","issue":"20181227-091","code":"8,7,7,2,4","code1":null,"code2":null,"time":1545916261000},{"lottery":"cqssc","issue":"20181227-090","code":"0,4,1,1,9","code1":null,"code2":null,"time":1545915664000},{"lottery":"cqssc","issue":"20181227-089","code":"0,3,6,5,9","code1":null,"code2":null,"time":1545915074000},{"lottery":"cqssc","issue":"20181227-088","code":"1,6,0,7,2","code1":null,"code2":null,"time":1545914471000},{"lottery":"cqssc","issue":"20181227-087","code":"9,0,9,4,2","code1":null,"code2":null,"time":1545913888000},{"lottery":"cqssc","issue":"20181227-086","code":"7,8,7,4,0","code1":null,"code2":null,"time":1545913258000},{"lottery":"cqssc","issue":"20181227-085","code":"9,0,5,7,7","code1":null,"code2":null,"time":1545912662000},{"lottery":"cqssc","issue":"20181227-084","code":"5,4,8,9,8","code1":null,"code2":null,"time":1545912075000},{"lottery":"cqssc","issue":"20181227-083","code":"3,8,6,8,6","code1":null,"code2":null,"time":1545911458000},{"lottery":"cqssc","issue":"20181227-082","code":"7,7,5,0,9","code1":null,"code2":null,"time":1545910859000},{"lottery":"cqssc","issue":"20181227-081","code":"4,7,9,2,3","code1":null,"code2":null,"time":1545910273000},{"lottery":"cqssc","issue":"20181227-080","code":"6,1,5,5,7","code1":null,"code2":null,"time":1545909687000},{"lottery":"cqssc","issue":"20181227-079","code":"5,6,4,2,6","code1":null,"code2":null,"time":1545909058000},{"lottery":"cqssc","issue":"20181227-078","code":"0,8,1,0,8","code1":null,"code2":null,"time":1545908459000},{"lottery":"cqssc","issue":"20181227-077","code":"5,6,5,1,6","code1":null,"code2":null,"time":1545907874000},{"lottery":"cqssc","issue":"20181227-076","code":"7,9,6,9,6","code1":null,"code2":null,"time":1545907272000},{"lottery":"cqssc","issue":"20181227-075","code":"3,0,7,8,1","code1":null,"code2":null,"time":1545906686000},{"lottery":"cqssc","issue":"20181227-074","code":"4,9,6,1,2","code1":null,"code2":null,"time":1545906061000},{"lottery":"cqssc","issue":"20181227-073","code":"8,3,9,9,8","code1":null,"code2":null,"time":1545905463000},{"lottery":"cqssc","issue":"20181227-072","code":"7,4,0,8,4","code1":null,"code2":null,"time":1545904876000},{"lottery":"cqssc","issue":"20181227-071","code":"7,3,9,8,9","code1":null,"code2":null,"time":1545904274000},{"lottery":"cqssc","issue":"20181227-070","code":"8,3,1,7,8","code1":null,"code2":null,"time":1545903656000},{"lottery":"cqssc","issue":"20181227-069","code":"6,3,3,4,9","code1":null,"code2":null,"time":1545903056000},{"lottery":"cqssc","issue":"20181227-068","code":"9,7,7,3,5","code1":null,"code2":null,"time":1545902457000},{"lottery":"cqssc","issue":"20181227-067","code":"3,5,7,0,8","code1":null,"code2":null,"time":1545901860000},{"lottery":"cqssc","issue":"20181227-066","code":"9,5,2,8,9","code1":null,"code2":null,"time":1545901257000},{"lottery":"cqssc","issue":"20181227-065","code":"5,5,5,6,3","code1":null,"code2":null,"time":1545900659000},{"lottery":"cqssc","issue":"20181227-064","code":"3,4,6,7,2","code1":null,"code2":null,"time":1545900057000},{"lottery":"cqssc","issue":"20181227-063","code":"6,7,7,0,7","code1":null,"code2":null,"time":1545899474000},{"lottery":"cqssc","issue":"20181227-062","code":"8,0,8,4,0","code1":null,"code2":null,"time":1545898891000},{"lottery":"cqssc","issue":"20181227-061","code":"2,7,4,0,8","code1":null,"code2":null,"time":1545898260000},{"lottery":"cqssc","issue":"20181227-060","code":"0,4,7,7,2","code1":null,"code2":null,"time":1545897661000},{"lottery":"cqssc","issue":"20181227-059","code":"8,4,2,9,0","code1":null,"code2":null,"time":1545897075000},{"lottery":"cqssc","issue":"20181227-058","code":"2,8,8,1,9","code1":null,"code2":null,"time":1545896460000},{"lottery":"cqssc","issue":"20181227-057","code":"9,9,8,2,6","code1":null,"code2":null,"time":1545895863000},{"lottery":"cqssc","issue":"20181227-056","code":"6,3,5,2,6","code1":null,"code2":null,"time":1545895257000},{"lottery":"cqssc","issue":"20181227-055","code":"6,8,1,5,5","code1":null,"code2":null,"time":1545894656000},{"lottery":"cqssc","issue":"20181227-054","code":"8,4,5,7,6","code1":null,"code2":null,"time":1545894072000},{"lottery":"cqssc","issue":"20181227-053","code":"4,9,5,5,1","code1":null,"code2":null,"time":1545893475000},{"lottery":"cqssc","issue":"20181227-052","code":"2,9,0,0,4","code1":null,"code2":null,"time":1545892877000},{"lottery":"cqssc","issue":"20181227-051","code":"1,6,3,2,6","code1":null,"code2":null,"time":1545892272000},{"lottery":"cqssc","issue":"20181227-050","code":"1,4,2,6,0","code1":null,"code2":null,"time":1545891687000},{"lottery":"cqssc","issue":"20181227-049","code":"1,0,4,0,4","code1":null,"code2":null,"time":1545891077000},{"lottery":"cqssc","issue":"20181227-048","code":"7,5,1,6,8","code1":null,"code2":null,"time":1545890472000},{"lottery":"cqssc","issue":"20181227-047","code":"3,4,9,4,4","code1":null,"code2":null,"time":1545889916000},{"lottery":"cqssc","issue":"20181227-046","code":"4,2,4,3,1","code1":null,"code2":null,"time":1545889272000},{"lottery":"cqssc","issue":"20181227-045","code":"8,1,6,9,5","code1":null,"code2":null,"time":1545888671000},{"lottery":"cqssc","issue":"20181227-044","code":"2,6,1,0,7","code1":null,"code2":null,"time":1545888074000},{"lottery":"cqssc","issue":"20181227-043","code":"6,3,5,0,8","code1":null,"code2":null,"time":1545887472000},{"lottery":"cqssc","issue":"20181227-042","code":"1,9,0,6,9","code1":null,"code2":null,"time":1545886872000}]'''

    return json.dumps(data, ensure_ascii=False)
 
@app.route('/game/staticOpenTime', methods=['GET', 'POST'])
@authRequired('lv0')    
def staticOpenTime(user):
    name = request.form.get('name', 'cqssc')
    L.log("request staticOpenTime: ", name)
    
    data = getOpenTime(name)
    # data = '''{"issue":"20181228-024","startTime":"2022-12-28 01:55:00","stopTime":"2022-12-28 09:59:30","openTime":"2022-12-28 09:59:30","surplusTime":28903}'''
    
    return json.dumps(data, ensure_ascii=False)



@app.route('/game/queryTrend', methods=['GET', 'POST'])
@authRequired('lv0')    
def queryTrend(user):
    name = request.form.get('name', 'cqssc')
    query = request.form.get('query', 'latest-30')
    date = request.form.get('time', '')
    
    data = mTrend.queryTrend(name, query, date)
    
    return NormalResponseJson(request, data)


@app.route('/game/pullOpenNotice', methods=['GET', 'POST'])
@authRequired('lv0')    
def pullOpenNotice(user):
    data = rs.hget('openNotice', user)
    if data: 
        data['rebateMoney'] = 0.0
        rs.hset('openNotice', user, None)
        
    return NormalResponseJson(request, data)

@app.route('/game/clearOopenNotice', methods=['GET', 'POST'])
@authRequired('lv0')    
def clearOopenNotice(user):
    rs.hset('openNotice', user, None)

    return NormalResponseJson(request, {})

@app.route('/loopGameLottery', methods=['GET', 'POST'])
@authRequired('lv0')    
def loopGameLottery(user):
    name = request.form.get('lottery', 'cqssc')
    # L.log("request loopGameLottery: ", name)
    
    data = getGameLottery(name, user)
    # data = {"lotteryBalance":0.0,"baccaratBalance":0.0,"totalBaccaratBalance":0.0,"msgCount":0,"gameOpenCode":{"id":1402146,"lottery":"cqssc","issue":"20181228-017","code":"2,5,7,1,1","code1":None,"code2":None,"openTime":1545931558000,"clearStatus":0,"clearTime":1545931558000},"hasNewNotice":False}
    
    return NormalResponseJson(request, data)

@app.route('/game/addOrder', methods=['GET', 'POST'])
@authRequired('lv0')    
def addOrder(user):
    text = request.form.get('text', '').encode('utf8')
    lines = json.loads(text, encoding = "utf8")
    
    stop = set([])
    for line in lines:
        lottery = rs.hget('games', line['lottery'])
        if lottery['status'] != 0:
            return ErrorResponseJson("温馨提示：" + lottery['showName'] + "正在维护中，请使用其它彩种！")
        continue
        if line['method'] in stop:
            return ErrorResponseJson("温馨提示：手动输入号码 相关玩法正在维护中，请使用其它玩法！")
    print len(lines), text
    
    flag, data = MO.addOrder(user, lines)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(request, True)

@app.route('/game/searchOrder', methods=['GET', 'POST'])
@authRequired('lv0')    
def searchOrder(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    status = request.form.get('status', '')
    issue = request.form.get('issue', '')
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    
    data = MO.searchOrder(user, status, issue, page, size, sTime, eTime)
        
    return NormalResponseJson(request, data)

@app.route('/game/getOrder', methods=['GET', 'POST'])
@authRequired('lv0')    
def getOrder(user):
    billno = request.form.get('billno', 0)
    
    data = MO.getOrder(user, billno)
    
    return NormalResponseJson(request, data)

'''查询当日概况'''
@app.route('/account/today', methods=['GET', 'POST'])
@authRequired('lv0')    
def getUserToday(user):
    data = MB.getUserToday(user)
    
    return NormalResponseJson(request, data)

'''查询账变记录'''
@app.route('/account/searchBill', methods=['GET', 'POST'])
@authRequired('lv0')    
def searchBill(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    _type = request.form.get('type', '')
    issue = request.form.get('issue', '')
    data = MB.searchBill(user, sTime, eTime, _type, issue, page, size)
    
    return NormalResponseJson(request, data)

'''查询账变记录'''
@app.route('/account/reportGameLottery', methods=['GET', 'POST'])
@authRequired('lv0')    
def reportGameLottery(user):
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    
    data = MR.searchReport(user, sTime, eTime)
    
    return NormalResponseJson(request, data)

'''查询账变记录'''
@app.route('/agent/reportGameLotteryTeam', methods=['POST'])
@authRequired('lv0')    
def reportGameLotteryTeam(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    
    users = ['PARENT', user] if username=='' else ['PARENT', user, username]
    data = MR.searchReport(users, sTime, eTime)
    
    return NormalResponseJson(request, data)

'''查询团队报表'''
@app.route('/agent/reportGameLotteryTeamApp', methods=['POST'])
@authRequired('lv0')    
def reportGameLotteryTeamApp(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    
    data = MR.searchReportTeam(user, sTime, eTime, username)
    
    return NormalResponseJson(request, data)

'''查询彩票报表'''
@app.route('/agent/reportGameLotteryDetail', methods=['POST'])
@authRequired('lv0')    
def reportGameLotteryDetail(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    
    data = MR.searchReportLottery(user, sTime, eTime, username)
    
    return NormalResponseJson(request, data)

@app.route('/imp/drawDividendRecord', methods=['POST'])
@authRequired('lv2')    
def drawDividendRecordSys(user):
    issue = request.form.get('issue', '')
    flag, data = MS.drawDividendRecordSys(user, issue)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(request, data)

@app.route('/imp/delDividendRecord', methods=['POST'])
@authRequired('lv2')    
def delDividendRecord(user):
    issue = request.form.get('issue', '')
    flag, data = MS.delDividendRecordSys(user, issue)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(request, data)

@app.route('/agent/drawDividendRecord', methods=['POST'])
@authRequired('lv0')    
def drawDividendRecord(user):
    return ErrorResponseJson("分红暂改为系统按时统一发放！")

    _id = request.form.get('id', -1)
    flag, data = MS.drawDividendRecord(user, _id)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(request, data)


@app.route('/agent/statDividendRecord', methods=['POST'])
@authRequired('lv0')    
def statDividendRecord(user):
    data = MC.statDividendRecord(user)
    
    return NormalResponseJson(request, data)

@app.route('/agent/listDividendRecord', methods=['POST'])
@authRequired('lv0')    
def listDividendRecord(user):
    page = request.form.get('page', 0)
    size = request.form.get('size', 10)
    data = MC.listDividendRecord(user, page, size)
    
    return NormalResponseJson(request, data)

@app.route('/imp/requestDividend', methods=['POST'])
@authRequired('lv3')    
def requestDividend(user):
    _id = request.form.get('id', '-1')
    data = MS.requestDividend(user, _id)
    if not data: return ErrorResponseJson("执行失败，该分红任务正在执行中 或 存在执行异常的任务！")
    
    return NormalResponseJson(request, {'status': True})

@app.route('/imp/getRecordDividend', methods=['POST'])
@authRequired('lv3')    
def getRecordDividend(user):
    data = MS.getRecordDividend()
    
    return NormalResponseJson(request, data)

@app.route('/imp/getIssueRecord', methods=['POST'])
@authRequired('lv3')    
def getIssueRecord(user):
    issue = request.form.get('issue', '')
    page = request.form.get('page', 0)
    data = MS.getIssueRecord(issue, page)
    
    return NormalResponseJson(request, data)

'''查询账变记录'''
@app.route('/imp/reportGameLotteryAll', methods=['POST'])
@authRequired('lv2')    
def reportGameLotteryAll(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    
    users = ['ALL', user] if username=='' else ['SELF', username]
    data = MR.searchReport(users, sTime, eTime, 'date')
    
    return NormalResponseJson(request, data)

'''查询账变记录'''
@app.route('/imp/searchOrderAll', methods=['POST'])
@authRequired('lv2')    
def searchOrderAll(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    status = request.form.get('status', '')
    page = request.form.get('page', 0)
    size = request.form.get('size', 100)
    
    users = ['ALL', user] if username=='' else ['SELF', username]
    data = MO.searchTeamOrder(users, sTime, eTime, '', status, '', page, size)

    return NormalResponseJson(request, data)

'''保存公告'''
@app.route('/imp/saveNotice', methods=['POST'])
@authRequired('lv2')    
def saveNotice(user):    
    _id = request.form.get('id', '-1')
    title = request.form.get('title', '')
    content = request.form.get('content', '')
    power = request.form.get('power', '')
    status = request.form.get('status', '')
    mark = request.form.get('mark', '')
    
    flag, data = MS.saveNotice(user, _id, title, content, power, status, mark)
    if not flag: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, data)

'''游戏列表'''
@app.route('/imp/getGameList', methods=['POST'])
@authRequired('lv2')    
def getGameList(user):  
    data, method = MI.getGameConfig()
    
    return NormalResponseJson(request, data)

'''游戏列表'''
@app.route('/imp/getMethodList', methods=['POST'])
@authRequired('lv2')    
def getMethodList(user):  
    game, data = MI.getGameConfig()
    
    return NormalResponseJson(request, data)

@app.route('/imp/setGameStatus', methods=['POST'])
@authRequired('lv2')    
def setGameStatus(user):   
    lottery = request.form.get('lottery', '-1')
    status = request.form.get('status', '')
    data = MI.setGameStatus(user, lottery, status)
    
    return NormalResponseJson(request, data)

@app.route('/imp/setMethodStatus', methods=['POST'])
@authRequired('lv2')    
def setMethodStatus(user):   
    method = request.form.get('method', '')
    _type = request.form.get('type', '-1')
    status = request.form.get('status', '')
    
    data = MI.setMethodInfo(user, method, _type, 'status', status)
    
    return NormalResponseJson(request, data)

@app.route('/imp/setMethodLimit', methods=['POST'])
@authRequired('lv2')    
def setMethodLimit(user):   
    method = request.form.get('method', '')
    _type = request.form.get('type', '-1')
    maxRecord = request.form.get('maxRecord', '-1')
    if int(maxRecord) < 0: return ErrorResponseJson("请求错误！") 
    
    data = MI.setMethodInfo(user, method, _type, 'maxRecord', maxRecord)
    
    return NormalResponseJson(request, data)

@app.route('/imp/setGameMode', methods=['POST'])
@authRequired('lv2')    
def setGameMode(user):  
    lottery = request.form.get('lottery', '-1')
    mode = request.form.get('mode', '')    
    data = MI.setGameMode(user, lottery, mode)
    
    return NormalResponseJson(request, data)

@app.route('/imp/getOtherSetting', methods=['POST'])
@authRequired('lv2')    
def getOtherSetting(user):  
    data = MI.getOtherSetting()
    
    return NormalResponseJson(request, data)

@app.route('/imp/setOtherSetting', methods=['POST'])
@authRequired('lv2')    
def setOtherSetting(user): 
    # dts = {'maxBonus': maxBonus, 'maxBetting':maxBetting, 'maxLevelDiff': maxLevelDiff, 'perConsume': perConsume}
    txt = request.form.get('item', '')
    if txt == '': return 'error'
    dts = json.loads(txt, encoding = 'utf8')
    
    data = MI.changeConfigOther(user, dts)
    
    return NormalResponseJson(request, data)


'''删除公告'''
@app.route('/imp/delNotice', methods=['POST'])
@authRequired('lv2')    
def delNotice(user):    
    _id = request.form.get('id', '-1')
    
    data = MS.delNotice(user, _id)
    if not data: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, data)

'''保存公告'''
@app.route('/imp/changeNotice', methods=['POST'])
@authRequired('lv0')    
def changeNotice(user):
    _id = request.form.get('id', '-1')
    key = request.form.get('key', '')
    value = request.form.get('value', '')
    
    flag, data = MS.changeNotice(user, _id, key, value)
    if not flag: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, data)

'''保存分红设置'''
@app.route('/imp/listConfigDividend', methods=['POST'])
@authRequired('lv2')    
def listConfigDividend(user):
    data = MS.listConfigDividend()
    
    return NormalResponseJson(request, data)

'''保存分红设置'''
@app.route('/imp/changeConfigDividend', methods=['POST'])
@authRequired('lv2')    
def changeConfigDividend(user):
    content = request.form.get('content', '{}')
    dt = json.loads(content.strip(), encoding="utf8")
    
    flag = MS.changeConfigDividend(user, dt)
    if not flag: return ErrorResponseJson("请求错误！")
    
    return NormalResponseJson(request, flag)

'''代理筛选'''
@app.route('/imp/agentFilter', methods=['POST'])
@authRequired('lv2')    
def agentFilter(user):
    # TODO: 有误否
    data = MS.agentFilter()
    
    return NormalResponseJson(request, data)


'''查询团队账变记录'''
@app.route('/agent/searchBillTeam', methods=['GET', 'POST'])
@authRequired('lv0')    
def searchBillTeam(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    _type = request.form.get('type', '')
    username = request.form.get('username', '')
    
    users = ['PARENT', user] if username=='' else ['PARENT', user, username]
    data = MB.searchBill(users, sTime, eTime, _type, '', page, size)
    
    return NormalResponseJson(request, data)

'''充值方式管理'''
@app.route('/payment/requestPayMethod', methods=['GET', 'POST'])
@authRequired('lv2')    
def requestPayMethod(user):
    lsThrid, lsTransfer = MI.loadPayMethods(True)
    
    data = {"thridList": lsThrid + lsTransfer}
    
    return NormalResponseJson(request, data)
    
'''充值方式'''
@app.route('/payment/requestAllMethod', methods=['GET', 'POST'])
@authRequired('lv0')    
def requestAllMethod(user):
    data = MI.getPayMethods()
    
    return NormalResponseJson(request, data)

'''充值请求'''
@app.route('/payment/requestThridPay', methods=['GET', 'POST'])  
@authRequired('lv0')
def requestThridPay(user):
    pid = request.form.get('pid', '')
    method = request.form.get('method', '')
    amount = request.form.get('amount', 0)
    
    data = MB.moneyIn(user, amount, pid, method)
    billno = data['billno']
    data['text'] = "TU51SUI5djVwcE44Wmc4bkR"
    
    '''非第三方充值'''
    if method.upper() == "OTHER":
        data['link'] = C.payUrl + "?mark=" + data['mark'] + "&user=" + billno
    else:
        ip = getClientIP(request)
        params = {'payType': method, 'amount': amount, 'user': user}
        data['link'] = MA.getThirdPay(billno, params, ip)
    '''End If'''
    return NormalResponseJson(request, data)


'''*************************对接第三方充值，接收并处理支付结果******************************'''
@app.route('/moneyNotice', methods=['GET', 'POST'])  
def moneyNotice():
    # R = request.form if request.method=='POST' else request.args
    # if request.headers['Content-Type']
    R = request.json
    flag = MA.callback(R, request.url)
    
    return "success" if flag else "error"
    

'''充值页面·传统'''
@app.route('/pay', methods=['GET', 'POST'])  
def pay():
    billno = request.args.get('user', '')
    data = MB.getBillMoneyIn(billno)
    context = MI.getPay(billno, data)
    
    return render_template('pay.html', **context)

'''转账请求'''
@app.route('/payment/requestTransferPay', methods=['GET', 'POST'])
@authRequired('lv0')    
def requestTransferPay(user):
    pid = request.form.get('pid', '')
    postscript = request.form.get('postscript', '')
    amount = request.form.get('amount', 0)
    
    data = MB.moneyIn(user, amount, pid, '', postscript)
    
    return NormalResponseJson(request, data)
    
'''充值查询'''
@app.route('/account/searchRecharge', methods=['GET', 'POST']) 
@authRequired('lv0') 
def searchRecharge(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    method = request.form.get('method', '')
    billno = request.form.get('billno', '')
    
    data = MB.searchMoneyIn(user, sTime, eTime, method, page, size, billno)
    
    return NormalResponseJson(request, data)    

'''提现查询'''
@app.route('/account/searchWithdraw', methods=['GET', 'POST']) 
@authRequired('lv0') 
def searchWithdraw(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    method = request.form.get('method', '')
    billno = request.form.get('billno', '')
    
    data = MB.searchMoneyOut(user, sTime, eTime, method, page, size, billno)
    
    return NormalResponseJson(request, data)  


'''团队充值查询'''
@app.route('/agent/searchAccountRecharge', methods=['GET', 'POST']) 
@authRequired('lv0') 
def searchAccountRecharge(user):
    username = request.form.get('username', 0)
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    method = request.form.get('method', '')
    billno = request.form.get('billno', '')
    
    data = MB.searchMoneyInTeam(user, sTime, eTime, method, page, size, billno, username)
    
    return NormalResponseJson(request, data)    

'''团队提现查询'''
@app.route('/agent/searchAccountWithdraw', methods=['GET', 'POST']) 
@authRequired('lv0') 
def searchAccountWithdraw(user):
    username = request.form.get('username', 0)
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    method = request.form.get('method', '')
    billno = request.form.get('billno', '')
    
    data = MB.searchMoneyOutTeam(user, sTime, eTime, method, page, size, billno, username)
    
    return NormalResponseJson(request, data)    

'''提现'''
@app.route('/account/prepareWithdraw', methods=['GET', 'POST'])  
@authRequired('lv0')
def prepareWithdraw(user):
    data = preMoneyOut(user)
    if not data: return ErrorResponseJson("本用户为限制提现用户，如有疑问请联系客服或管理员！")
    
    data['withdrawConfig']['isOpen'] = True
    return NormalResponseJson(request, data)  


'''团队总览'''
@app.route('/agent/teamOverview', methods=['GET', 'POST'])  
@authRequired('lv0')
def teamOverview(user):
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    
    flag, data = getTeamOverview(user, sTime, eTime)
    if not flag: return ErrorResponseJson(data)

    return NormalResponseJson(request, data)  


@app.route('/agent/listOnlineAccount', methods=['GET', 'POST'])  
@authRequired('lv0')
def listOnlineAccount(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    
    data = searchOnlineUser(user, None, page, size)

    return NormalResponseJson(request, data)  


@app.route('/account/checkUsernameExist', methods=['GET', 'POST'])  
def checkUsernameExist():
    username = request.form.get('username', '')
    data = lg.checkUsername(username)
    
    return str(data) 

@app.route('/regist', methods=['GET', 'POST'])  
def regist():
    R = request.form if request.method=='POST' else request.args
    securityCode, codeTms = str(R.get('securityCode', '')), str(R.get('tms', ''))
    correctCode = str(rs.hget('securityCode', codeTms))
    if codeTms=='' or securityCode=='' or correctCode!=securityCode: 
        return ErrorResponseJson('验证码有误， 请重新输入！', None, '103-02')
    
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    registCode = request.form.get('registCode', '')
    securityCode = request.form.get('securityCode', '')
    
    flag, info = lg.regist(username, password, registCode)
    if flag!=0: return ErrorResponseJson(info)
        
    return NormalResponseJson(request, None)  
          

'''开户准备'''
@app.route('/agent/prepareAddAccount', methods=['GET', 'POST'])  
@authRequired('lv0')
def prepareAddAccount(user):
    data = preAddAccount(user)
    
    return NormalResponseJson(request, data)  

'''开户'''
@app.route('/agent/addAccount', methods=['GET', 'POST'])  
@authRequired('lv0')
def addAccount(user):
    _type = request.form.get('type', 0)
    username = request.form.get('username', '')
    lotteryPoint = request.form.get('lotteryPoint', '')

    en = addUser(user, username, int(_type), float(lotteryPoint))
    if en > 0: return ErrorResponseJson(['', '用户名不规范', '本用户账户异常！', '本用户类型错误', 
                                         '本用户权限不足（返点应低于上级用户）', '超过最大级别差', '用户已存在'][en])
    return NormalResponseJson(request, None)  

@app.route('/agent/listRegistLink', methods=['GET', 'POST'])  
@authRequired('lv0')
def listRegistLink(user):
    data = mTeam.getRegistLink(user)
    
    return NormalResponseJson(request, data)  

@app.route('/agent/deleteRegistLink', methods=['GET', 'POST'])  
@authRequired('lv0')
def deleteRegistLink(user):
    _id = request.form.get('id', '')
    data = mTeam.delRegistLink(user, _id)
    
    return NormalResponseJson(request, data)  

@app.route('/agent/addRegistLink', methods=['GET', 'POST'])  
@authRequired('lv0')
def addRegistLink(user):
    _type = request.form.get('type', 0)
    tm = request.form.get('time', '')
    amount = request.form.get('amount', 0)
    lotteryPoint = request.form.get('lotteryPoint', 0)
    
    data = mTeam.createRegistLink(user, _type, tm, amount, lotteryPoint)
    if not data: return ErrorResponseJson("请检查返点配置和其它配置是否正确！")
    
    return NormalResponseJson(request, data)  


'''++++++++++++++++++++++++++++++个人账户设置++++++++++++++++++++++++++++++++++++++++'''
@app.route('/account/modifyAvatar', methods=['POST'])
@authRequired('lv0')      
def modifyAvatar(user):
    avatar = request.form.get('avatar', '')
    data = MB.modifyAvatar(user, avatar)
    
    return NormalResponseJson(request, data)

@app.route('/account/applyWithdraw', methods=['POST'])
@authRequired('lv0')      
def applyWithdraw(user):
    amount = float(request.form.get('amount', ''))
    bankCardId = request.form.get('cardId', '')
    withdrawPassword = request.form.get('withdrawPassword', '')
    
    data, err = MB.applyWithdraw(user, amount, bankCardId, withdrawPassword)
    if err: return ErrorResponseJson(err, None, data)
    
    return NormalResponseJson(request, data)

@app.route('/account/listCard', methods=['POST'])
@authRequired('lv0')      
def listCard(user):
    data = MU.listCard(user)

    return NormalResponseJson(request, data)

@app.route('/account/setDefaultCard', methods=['GET', 'POST'])
@authRequired('lv0')      
def setDefaultCard(user):
    _id = request.form.get('id', '')
    
    flag, data = Tool.setFieldEx(user, [('card', 'isDefault', 0, 'user', user),
                                    ('card', 'isDefault', 1, 'id', _id)])
    if not flag: return ErrorResponseJson()
        
    return NormalResponseJson(request, None)
    
@app.route('/account/prepareBindCard', methods=['POST'])
@authRequired('lv0')      
def prepareBindCard(user):
    data = MU.prepareBindCard(user)

    return NormalResponseJson(request, data)

@app.route('/account/getBindStatus', methods=['POST'])
@authRequired('lv0')      
def getBindStatus(user):
    data = MU.getBindStatus(user)

    return NormalResponseJson(request, data)

'''通用修改密码'''
def comModifyPassword(request, user, key = 'password'):
    oldPasswd = request.form.get('oldPassword', '')
    newPasswd = request.form.get('newPassword', '')
    if oldPasswd == newPasswd: return ErrorResponseJson("新密码不能和旧密码相同！", None, '108-01')
    
    data = MU.changePassword(user, user, oldPasswd, newPasswd, key)
    if not data: return ErrorResponseJson("旧密码输入错误，请重新输入！", None, '102-03')

    return NormalResponseJson(request, data)

@app.route('/account/bindSecurity', methods=['POST'])
@authRequired('lv0')      
def bindSecurity(user):
    q1 = request.form.get('question1', '')
    q2 = request.form.get('question2', '')
    q3 = request.form.get('question3', '')
    a1 = request.form.get('answer1', '')
    a2 = request.form.get('answer2', '')
    a3 = request.form.get('answer3', '')
    
    data = MU.bindSecurity(user, [[q1, a1], [q2, a2], [q3, a3]])
    
    return NormalResponseJson(request, data)

@app.route('/account/bindCard', methods=['POST'])
@authRequired('lv0')      
def bindCard(user):
    bankName = request.form.get('bankName', '')
    bankId = request.form.get('bankId', '')
    bankBranch = request.form.get('bankBranch', '')
    bankCardId = request.form.get('bankCardId', '')
    withdrawPassword = request.form.get('withdrawPassword', '')
    
    data, err = MU.bindCard(user, bankId, bankBranch, bankCardId, withdrawPassword, bankName)
    if err: return ErrorResponseJson(err, None, data)
    if not data: return ErrorResponseJson("请检查卡号和银行是否有误或重复！", None)
    
    return NormalResponseJson(request, data)

@app.route('/account/modifyPassword', methods=['POST'])
@authRequired('lv0')      
def modifyPassword(user):
    return comModifyPassword(request, user)

@app.route('/account/modifyWithdrawPassword', methods=['POST'])
@authRequired('lv0')      
def modifyWithdrawPassword(user):
    return comModifyPassword(request, user, 'withdrawPassword')


@app.route('/account/setupWithdrawName', methods=['POST'])
@authRequired('lv0')      
def setupWithdrawName(user):
    name = request.form.get('name', '')
    
    data, err = MU.setupWithdrawName(user, user, name)
    if err: return ErrorResponseJson(err, None, data)
    
    return NormalResponseJson(request, data)

@app.route('/account/setupWithdrawPassword', methods=['GET', 'POST'])
@authRequired('lv0')      
def setupWithdrawPassword(user):
    password = request.form.get('password', '')
    
    data = MU.setAccountInfo(user, user, 'withdrawPassword', password)
    
    return NormalResponseJson(request, data)

@app.route('/account/modifyNickname', methods=['GET', 'POST'])
@authRequired('lv0')      
def modifyNickname(user):
    nickname = request.form.get('nickname', '')
    
    data = MU.setAccountInfo(user, user, 'nickname', nickname)
    
    return NormalResponseJson(request, data)

@app.route('/account/listFullInfo', methods=['GET', 'POST'])
@authRequired('lv0')      
def listFullInfo(user):
    showLottery = request.form.get('showLottery', True)
    showBaccarat = request.form.get('showBaccarat', True)
    showLoginLog = request.form.get('showLoginLog', True)
    showInfo = request.form.get('showInfo', True)
    
    data = MU.getFullInfo(user, showLottery, showBaccarat, showLoginLog, showInfo)
    
    return NormalResponseJson(request, data)

@app.route('/agent/listTeamAccount', methods=['GET', 'POST'])
@authRequired('lv0')      
def listTeamAccount(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    username = request.form.get('username', '')

    data = getChildren(user, page, size, username)
    
    return NormalResponseJson(request, data)  

'''准备平台转账'''
@app.route('/agent/prepareTransfer', methods=['GET', 'POST'])
@authRequired('lv0')      
def prepareTransfer(user):
    username = request.form.get('username', '')
    data = mTeam.prepareTransfer(user, username)
    
    return NormalResponseJson(request, data)  

'''准备调整返点'''
@app.route('/agent/prepareEditPointByQuota', methods=['GET', 'POST'])
@authRequired('lv0')      
def prepareEditPointByQuota(user):
    username = request.form.get('username', '')
    data = MC.prepareEditPointByQuota(user, username)
    
    return NormalResponseJson(request, data)  

'''准备调整返点'''
@app.route('/agent/editPointByQuota', methods=['GET', 'POST'])
@authRequired('lv0')      
def editPointByQuota(user):
    username = request.form.get('username', '')
    point = request.form.get('point', '')
    flag, data = MC.editPointByQuota(user, username, point)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(request, data)  


'''平台转账'''
@app.route('/agent/applyTransfer', methods=['GET', 'POST'])
@authRequired('lv0')      
def applyTransfer(user):
    username = request.form.get('username', '')
    transType = request.form.get('transType', '')
    amount = request.form.get('amount', '')
    securityId = request.form.get('securityId', '')
    answer = request.form.get('answer', '')
    withdrawPassword = request.form.get('withdrawPassword', '')
    
    flag, data = mTeam.applyTransfer(user, username, transType, amount, securityId, answer, withdrawPassword)
    if not flag: return ErrorResponseJson(data, data, '')
    
    return NormalResponseJson(request, data)  

'''管理员增减'''
@app.route('/imp/changeBalance', methods=['POST'])
@authRequired('lv4')      
def changeBalance(user):
    username = request.form.get('username', '')
    transType = int(request.form.get('transType', -1))
    amount = float(request.form.get('value', '0'))
    if transType not in set([0, 1]) or amount <= 0.0: return ErrorResponseJson('参数错误', None)
    
    flag, data = mTeam.changeBalance(user, username, transType, amount)
    if not flag: return ErrorResponseJson(data, None, '')
    
    return NormalResponseJson(request, data)  

@app.route('/agent/searchGameLotteryOrder', methods=['GET', 'POST'])
@authRequired('lv0')          
def searchGameLotteryOrder(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    status = request.form.get('status', 0)
    lottery = request.form.get('lottery', '')
    issue = request.form.get('issue', '')
    username = request.form.get('username', '')
    
    users = ['PARENT', user] if username=='' else ['PARENT', user, username]
    data = MO.searchTeamOrder(users, sTime, eTime, lottery, status, issue, page, size)

    return NormalResponseJson(request, data)  
        


'''++++++++++++++++++++++++++++++++++++Manage+++++++++++++++++++++++++++++++++++++++++++++'''
@app.route('/imp/accountList', methods=['GET', 'POST'])
@authRequired('lv2')
def listAccount(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 50))
    username = request.form.get('username', '')
    parentNull = request.form.get('parent', '')
    
    data = getAccountList(username, parentNull, page, size)
    
    return NormalResponseJson(request, data)  

'''账户冻结·解冻'''
@app.route('/imp/accountFreeze', methods=['GET', 'POST'])
@authRequired('lv2')      
def accountFreeze(user):
    username = request.form.get('username', '')
    status = request.form.get('status', '')
    
    data = setAccountInfo(user, username, 'status', status)
    
    return NormalResponseJson(request, data)  

@app.route('/imp/changeTransfer', methods=['GET', 'POST'])
@authRequired('lv2')      
def changeTransfer(user):
    username = request.form.get('username', '')
    status = request.form.get('status', '')
    
    data = setAccountInfo(user, username, 'allowTransfer', status)
    
    return NormalResponseJson(request, data)  

@app.route('/imp/changeWithdraw', methods=['GET', 'POST'])
@authRequired('lv2')      
def changeWithdraw(user):
    username = request.form.get('username', '')
    status = request.form.get('status', '')
    
    data = setAccountInfo(user, username, 'allowWithdraw', status)
    
    return NormalResponseJson(request, data)  

'''账户删除'''
@app.route('/imp/accountRemove', methods=['GET', 'POST'])
@authRequired('lv2')      
def accountRemove(user):
    username = request.form.get('username', '')
    
    # data = setAccountInfo(user, username, 'isDel', 1)
    data = delAccount(user, username)
    
    return NormalResponseJson(request, data)

'''修改账户归属·高能操作'''
@app.route('/imp/changeAccountParent', methods=['GET', 'POST'])
@authRequired('lv2')      
def changeAccountParent(user):
    userC = request.form.get('child', '')
    userP = request.form.get('parent', '')
    
    flag, data = setParentTo(user, userC, userP)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(request, data)

'''账户修改准备'''
@app.route('/imp/preAccountChange', methods=['GET', 'POST'])
@authRequired('lv2')      
def preAccountChange(user):
    username = request.form.get('username', '')
    
    data = getPassword(user, username)
    
    return NormalResponseJson(request, data)

'''账户修改'''
@app.route('/imp/accountChange', methods=['GET', 'POST'])
@authRequired('lv2')      
def accountChange(user):
    username = request.form.get('username', '')
    password = request.form.get('pw', '')
    _type = request.form.get('type', '')
    point = request.form.get('point', '')
    money = request.form.get('money', '')
    preMoney = request.form.get('preMoney', '')
    prePoint = request.form.get('prePoint', '')
    withdrawPassword = request.form.get('wpw', '')
    realName = request.form.get('rn', '')
    
    data = setAccount(user, username, password, _type, point, money, preMoney, prePoint, \
                    withdrawPassword, realName)
    
    return NormalResponseJson(request, data)

'''账户新增'''
@app.route('/imp/accountCreate', methods=['GET', 'POST'])
@authRequired('lv2')      
def accountCreate(user):
    username = request.form.get('username', '')
    password = request.form.get('pw', '')
    _type = request.form.get('type', '')
    point = request.form.get('point', '')
    money = request.form.get('money', '')
    
    print user, username, password, _type, point, money
    flag, data = createAccount(user, username, password, _type, point, money)
    
    if not flag: return ErrorResponseJson("请检查表单数据是否有误或用户名是否重复！")
    
    return NormalResponseJson(request, data)

'''账户新增'''
@app.route('/imp/getLoginInfo', methods=['GET', 'POST'])
@authRequired('lv2')      
def getLoginInfo(user):
    username = request.form.get('username', '')
    
    data = MU.getLoginInfo(username)
    
    return NormalResponseJson(request, data)


'''充值管理-查询'''
@app.route('/imp/listMoneyIn', methods=['GET', 'POST'])
@authRequired('lv1')  
def listMoneyIn(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    status = request.form.get('status', 0)
    
    data = MB.manageMoneyIn(user, status, page, size)
    
    return NormalResponseJson(request, data)

'''充值管理-查询'''
@app.route('/imp/listMoneyOut', methods=['GET', 'POST'])
@authRequired('lv1')  
def listMoneyOut(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    status = request.form.get('status', 0)
    
    data = MB.manageMoneyOut(user, status, page, size)
    
    return NormalResponseJson(request, data)
    
'''充值管理-操作'''
@app.route('/imp/setMoneyIn', methods=['GET', 'POST'])
@authRequired('lv1')  
def setMoneyIn(user):
    username = request.form.get('username', '')
    billno = request.form.get('billno', '')
    status = request.form.get('status', 0)
    
    if user=='' or billno=='': return ErrorResponseJson("请求的参数有误！")
    
    flag = MB.manageMoney(user, username, billno, status)
    if not flag: return ErrorResponseJson()
    
    return NormalResponseJson(request, {})  
  
'''提现管理-操作'''
@app.route('/imp/setMoneyOut', methods=['GET', 'POST'])
@authRequired('lv1')  
def setMoneyOut(user):
    username = request.form.get('username', '')
    billno = request.form.get('billno', '')
    status = request.form.get('status', 0)
    
    if user=='' or billno=='': return ErrorResponseJson("请求的参数有误！")
    
    flag = MB.manageMoneySetOut(user, username, billno, status)
    if not flag: return ErrorResponseJson("请求错误，请联系管理员！")
    
    return NormalResponseJson(request, {}) 

@app.route('/imp/setActivity', methods=['GET', 'POST'])
@authRequired('lv3')  
def setActivity(user):
    label = request.form.get('label', '')
    content = request.form.get('content', '')
    id_ = int(request.form.get('id', -1))
    status = request.form.get('status', 0)
    if id==-1: return ErrorResponseJson("请求的参数有误！")
    
    flag = MS.setActivity(id_, label, content, status)
    
    return NormalResponseJson(request, flag) 
    
@app.route('/imp/getActivity', methods=['GET', 'POST'])
@authRequired('lv3')  
def getActivity(user):
    data = MS.getActivity()
    
    return NormalResponseJson(request, data) 
        
    
'''客服服务'''
@app.route('/utils/serviceUrl', methods=['GET', 'POST'])
def serviceUrl():
    # data = 'http://' + C.webIp + ":" + C.webPort + "/service/index.html"
    # data = "https://tb.53kf.com/code/client/svsvssd/1"
    data = MS.getServiceUrl()
    
    return data

'''App客服服务'''
@app.route('/utils/serviceUrlApp', methods=['GET', 'POST'])
def serviceUrlApp():
    data = MS.getServiceUrl(1)
    
    return data

'''线路检测'''
@app.route('/utils/domainUrls', methods=['GET', 'POST'])
def domainUrls():
    # data = ['http://' + C.webIp + ":" + C.webPort for i in range(6)]
    data = MS.getDomainUrls()
    
    return json.dumps(data, encoding='utf8')  

'''线路检测'''
@app.route('/system/get-download-urls-title', methods=['GET', 'POST'])
def getDownloadUrlsTitle():
    data = MS.getDownloadUrlsTitle()
    return json.dumps(data, encoding='utf8')  
    
'''验证码'''
@app.route('/utils/login-security-code')
def get_code():
    params = request.args.items()
    if len(params)==0: return ''
    tms = params[0][0]
    bufStr, codeStr = create_validate_code()
#     buf = BytesIO()
#     codeImg.save(buf, 'jpeg')
#     bufStr = buf.getvalue()
    response = app.make_response(bufStr)
    response.headers['Content-Type'] = 'image/png'
    '''存储待验证'''
    rs.hset('securityCode', tms, codeStr)

    return response    
    
'''验证码'''
@app.route('/utils/regist-security-code')
def get_regist_code():
    params = request.args.items()
    if len(params)==0: return ''
    tms = params[0][0]
    bufStr, codeStr = create_validate_code()

    response = app.make_response(bufStr)
    response.headers['Content-Type'] = 'image/png'
    '''存储待验证'''
    rs.hset('securityCode', tms, codeStr)

    return response      
    
'''请求错误返回格式'''
def ErrorResponse(request, message = "请求错误！", data = {}):
    callback = request.args.get('callback', '')
    rst = { 'error': True, 'message': message, 'data': data }
    
    return callback + "(" + json.dumps(rst, ensure_ascii = False) + ")"

'''请求错误返回格式'''
def ErrorResponseJson(message = "请求错误！", data = {}, errCode = '001'):
    rst = { 'error': True, 'message': message, 'data': data, 'code': errCode }
    
    return json.dumps(rst, ensure_ascii = False)

'''请求错误返回格式'''
def ErrorResponseData(data = {}):
    return json.dumps(data, ensure_ascii = False)

'''请求标准返回格式'''
def NormalResponseJson(request, data):
    rst = { 'error': 0, 'code':None, 'message': "请求成功", 'data': data }
    
    return json.dumps(rst, ensure_ascii = False)

'''请求标准返回格式'''
def NormalResponse(request, data):
    callback = request.args.get('callback', '')
    rst = { 'error': False, 'message': "OK", 'data': data }
    
    return callback + "(" + json.dumps(rst, ensure_ascii = False) + ")"

'''-------------------------------------socket.io---------------------------------------------'''
# 
# @sio.on('login', namespace='/')
# def login(sid, data):
#     # 客户端信息记录
#     lsUser[data['id']] = {"name":data['name'], "id":data['id'], "time":TM()}
#     print "login success", data['name'], data['id'], TM()
#     
#     sio.emit('login', {"msgId":1}, room=sid)
# 
# '''接收爬虫活动信息，并转发给客户端''' 
# @sio.on('crawlerAlive', namespace='/')
# def crawlerAlive(sid, data):
#     # print "crawler is alive", TM()
#     for c in lsClient:
#         sio.emit('crawlerAlive', {"time":TM()}, room=c)
#         
# '''接收爬虫活动信息，并转发给客户端''' 
# @sio.on('workerAlive', namespace='/')
# def workerAlive(sid, data):
#     # print "worker is alive", TM()
#     for c in lsClient:
#         sio.emit('workerAlive', {"time":TM()}, room=c)
# 
# 
# '''接收主动数据，并转发给客户端''' 
# @sio.on('updateData', namespace='/')
# def updateData(sid, *data):
#     for c in lsClient:
#         sio.emit('updateData', {"time":TM(), 'data':data[0][0]}, room=c)
# 
# '''接收主动数据，并转发给客户端''' 
# @sio.on('updatePeriodNewest', namespace='/')
# def updatePeriodNewest(sid, pid):
#     for c in lsClient:
#         sio.emit('updatePeriodNewest', {"time":TM(), 'data':pid}, room=c)
# 
# @sio.on('connect', namespace='/')
# def connect(sid, environ):
#     lsClient[sid] = {}
#     
# @sio.on('disconnect', namespace='/')
# def disconnect(sid):
#     lsClient.pop(sid)
       
    
def Init():
    MI.getInitData()
    MI.loadCode()
    MI.loadDefaultDividend()
    
def sigint_handler(signum, frame):
    print 'catched interrupt signal!'
    # worker.Stop()
    sys.exit(0)
    print 'kill the worker thread'
    
if __name__ == '__main__':
    # signal.signal(signal.SIGINT, sigint_handler)
    # signal.signal(signal.SIGTERM, sigint_handler)
    # app = socketio.Middleware(sio, app)
    Init()
    
    print 'server start on: {} !'.format(C.socketPort)
    # app.run('0.0.0.0', C.socketPort, threaded=True)
    # threaded=True, processes = 5
    
    # eventlet.wsgi.server(eventlet.listen(('', C.socketPort)), app, log_output=False)
    # http_server = WSGIServer(('0.0.0.0', C.socketPort), app)
    # http_server.serve_forever()
    app.run()
    
    
    