#coding:utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')


from mUser import get_online_user, get_rg_lg_ac_num
from mManageUtils import authRequired, NormalResponseJson, ErrorResponseJson
import mBill as MB
import mOrder as MO
from mChase import adminSearchChase
import mInit as MI
import mPlan as MP
import math
from flask import Blueprint,request

manage = Blueprint("manage",__name__)

################################财务管理#############################################
'''充值管理-线上查询'''
@manage.route('/recharge/thirdPartyRecharge/list', methods=['GET', 'POST'])
@authRequired('lv2')
def thirdPartyRecharge(u):
    page = int(request.form.get('pageNumber', 1))-1
    if page <= 0: page = 0
    size = int(request.form.get('pageSize', 20))
    status = request.form.get('status', '')
    user = request.form.get('username', '')
    billno = request.form.get('billno', '')
    utype = request.form.get('utype', '')
    bTime = request.form.get('beginFinishTime', '')
    eTime = request.form.get('endFinishTime', '')
    payMethod = request.form.get('pay_name', '')
    
    data = MB.manageMoneyIn(user, status, page, size, billno, utype, payMethod, bTime, eTime, online=True)

    return NormalResponseJson(request, data)

'''充值管理-线下查询'''
@manage.route('/recharge/bankcardtransfer/list', methods=['GET', 'POST'])
@authRequired('lv1')
def bankcardtransfer(u):
    page = int(request.form.get('pageNumber', 1)) - 1
    if page <= 0: page = 0
    size = int(request.form.get('pageSize', 10))
    user = request.form.get('username', '')
    status = request.form.get('status', '')
    billno = request.form.get('billno', '')
    realName = request.form.get('realName', '')
    payMethod = request.form.get('payMethod', '')
    mark = request.form.get('mark', '')
    bTime = request.form.get('beginTime', '')
    eTime = request.form.get('endTime', '')
    bank = request.form.get('bank', '')
    cardId = request.form.get('cardId', '')
    
    data = MB.listMoneyInTransfor(user, status, page, size, billno, realName, payMethod, \
                                  mark, bTime, eTime, bank, cardId)

    return NormalResponseJson(request, data)

'''  
财务管理- 提现风控管理 
pageSize: 100
pageNumber: 1
memberName: 用户名
withdrawCode: 订单号
withdrawCashInput: 大于小于的金额
beginApplyTime: 
endApplyTime: 
beginVerifyTime: 
endVerifyTime: 
beginFinishTime: 
endFinishTime: 
cardholder: 开户名
withdrawCashCon: 1 大于小于
withdrawFlag: 2  状态
bankName: 银行名
'''
@manage.route('/withdrawal/withdrawaladuitrisk/list',methods=["POST"])
@authRequired('lv2')
def withdrawaladuitrisk(user):
    page = int(request.form.get('pageNumber', 1))-1
    if page <= 0: page = 0
    size = int(request.form.get('pageSize', 10))
    account = request.form.get('memberName', '')
    billno = request.form.get('withdrawCode', '')
    condition = int(request.form.get('withdrawCashCon', 1)) # 1大于 2小于
    amount = request.form.get('withdrawCashInput', "")
    bankName = request.form.get('bankName', '')
    bankCardName = request.form.get('cardholder', '')
    createTime_s = request.form.get('beginApplyTime', '')
    createTime_e = request.form.get('endApplyTime', '')
    confirmTime_s = request.form.get('beginVerifyTime', '')
    confirmTime_e = request.form.get('endVerifyTime', '')
    checkTime_s = request.form.get('beginFinishTime', '')
    checkTime_e = request.form.get('endFinishTime', '')
    checkStatus = request.form.get('withdrawFlag', '')
    
    data = MB.manageMoneyOutExt(account,
                                '',
                                page,
                                size,
                                billno,
                                condition,
                                amount,
                                bankName,
                                bankCardName,
                                createTime_s,
                                createTime_e,
                                confirmTime_s,
                                confirmTime_e,
                                checkTime_s,
                                checkTime_e,
                                checkStatus=checkStatus
                                )

    return NormalResponseJson(request, data)


'''  
财务管理- 出款管理
pageSize: 100
pageNumber: 1
memberName: 用户名
withdrawCode: 订单号
withdrawCashInput: 大于小于的金额
beginApplyTime: 
endApplyTime: 
beginVerifyTime: 
endVerifyTime: 
beginFinishTime: 
endFinishTime: 
cardholder: 开户名
withdrawCashCon: 1 大于小于
withdrawFlag: 2  状态
bankName: 银行名
'''
@manage.route('/withdrawal/withdrawaladuit/list',methods=["POST"])
@authRequired('lv2')
def withdrawaladuit(user):
    page = int(request.form.get('pageNumber', 1))-1
    if page <= 0: page = 0
    size = int(request.form.get('pageSize', 10))
    account = request.form.get('memberName', '')
    billno = request.form.get('withdrawCode', '')
    condition = int(request.form.get('withdrawCashCon', 1)) # 1大于 2小于
    amount = request.form.get('withdrawCashInput', "")
    bankName = request.form.get('bankName', '')
    bankCardName = request.form.get('cardholder', '')
    createTime_s = request.form.get('beginApplyTime', '')
    createTime_e = request.form.get('endApplyTime', '')
    confirmTime_s = request.form.get('beginVerifyTime', '')
    confirmTime_e = request.form.get('endVerifyTime', '')
    checkTime_s = request.form.get('beginFinishTime', '')
    checkTime_e = request.form.get('endFinishTime', '')
    checkStatus = request.form.get('withdrawFlag', '')
    
    data = MB.manageMoneyOutExt(account,
                                '',
                                page,
                                size,
                                billno,
                                condition,
                                amount,
                                bankName,
                                bankCardName,
                                createTime_s,
                                createTime_e,
                                confirmTime_s,
                                confirmTime_e,
                                checkTime_s,
                                checkTime_e,
                                checkStatus,
                                True
                                )

    return NormalResponseJson(request, data)

'''查询银行列表'''
@manage.route('/withdrawal/bank/list',methods=["POST"])
@authRequired('lv1')
def bank_list(user):
    isAll = int(request.form.get("isAll", 0))
    data = MB.get_bank_list(None, isAll)
    return NormalResponseJson(request, data)


"""
充值接口统计
/recharge/rechargeCount/list
"""
'''查询银行卡列表'''
@manage.route('/recharge/rechargeCount/list',methods=["POST"])
@authRequired('lv1')
def rechargeCountList(user):
    size = int(request.form.get("pageSize",10))
    page = int(request.form.get("pageNumber",1))-1
    if page <= 0: page = 0
    recharge_type = request.form.get("rechargeType", '')
    
    payName = request.form.get("payName","")
    sTime = request.form.get("beginTime","")
    eTime = request.form.get("endTime","")
    if sTime == "" or eTime == "":
        return ErrorResponseJson("请选择日期！", None, '110')

    data = MB.rechargeCountList(recharge_type=recharge_type,payName=payName,sTime=sTime,eTime=eTime,page=page,size=size)
    return NormalResponseJson(request, data)


################################财务管理#############################################

'''在线用户统计'''
@manage.route("/stat/onlines",methods=['GET', 'POST'])
@authRequired('lv1')
def user_onlines(user):
    data,num = get_online_user()
    context = {
        'count':num,
        'list':data
    }
    return NormalResponseJson(request, context)

'''首页在线用户情况统计'''
@manage.route("/stat/home/statTodayReg",methods=['GET', 'POST'])
@authRequired('lv1')
def statTodayReg(user):
    data = get_rg_lg_ac_num()
    return NormalResponseJson(request, data)


'''
查询订单记录查询
订单状态
未开奖 0
未中奖 1 
已中奖 2 
已撤单 -1 
全部 ''
'''
@manage.route('/order/order/list', methods=['POST'])
@authRequired('lv2')
def order_list(user):
    username = request.form.get('memberName', '')
    sTime = request.form.get('beginTime', '')
    eTime = request.form.get('endTime', '')
    status = request.form.get('orderStatus', '')
    page = int(request.form.get('pageNumber', 1)) - 1
    issue = request.form.get('orderCode', '')
    
    if page <= 0: page = 0
    size = request.form.get('pageSize', 10)
    
    users = ['ALL', user] if username == '' else ['SELF', username]
    data = MO.searchTeamOrder(users, sTime, eTime, '', status, issue, page, size)

    return NormalResponseJson(request, data)

'''
查看追号订单记录
'''
@manage.route('/order/append/list', methods=['GET', 'POST'])
@authRequired('lv2')
def searchOrderChaseM(user):
    page = int(request.form.get('pageNumber', 1)) - 1
    if page <= 0: page = 0
    size = int(request.form.get('pageSize', 10))
    lottery = request.form.get('lotteryCode', '')
    status = request.form.get('appendStatus', '')
    sTime = request.form.get('beginTime', '')
    eTime = request.form.get('endTime', '')
    billno = request.form.get('appendCode', '')
    memberName = request.form.get('memberName', '')

    users = ['ALL', user] if memberName == '' else ['SELF', memberName]
    # print users
    data = adminSearchChase(users=users,
                            lottery=lottery,
                            status=status,
                            page=page,
                            size=size,
                            sTime=sTime,
                            eTime=eTime,
                            billno=billno)
    return NormalResponseJson(request, data)

###########################彩票管理-彩票配置###############################
'''游戏列表'''
@manage.route('/league/leaguelottery/list', methods=['POST'])
@authRequired('lv2')
def leaguelottery_list(user):
    status = request.form.get("state","")
    isShow = request.form.get("enableFlag","")
    is_self = request.form.get("selfOpenEnable","")
    openMode = request.form.get("killNumberEnable","")
    data = MI.deal_games_list(status,isShow,is_self,openMode)

    return NormalResponseJson(request, data)


'''游戏玩法列表'''
@manage.route('/lottery/onetoone/list', methods=['POST'])
@authRequired('lv2')
def onetoone_list(user):
    lotteryCode = request.form.get("lotteryCode",'ssc')
    data = MI.get_methods(lotteryCode)

    return NormalResponseJson(request, data)

'''游戏玩法列表 游戏类型'''
@manage.route('/lottery/type/list', methods=['POST'])
@authRequired('lv1')
def type_llist(user):
    data = MI.get_type_list()
    return NormalResponseJson(request, data)


@manage.route("/lottery/lotterynavigation/list",methods=['POST',"GET"])
@authRequired('lv1')
def lotterynavigation(user):
    lottery_type = request.form.get("lotteryCategoryCode","ssc")
    data = MI.navigate_lottery(lottery_type)
    return NormalResponseJson(request, data)


'''自营彩期管理'''
@manage.route('/league/leaguedraw/list',methods=['GET','POST'])
@authRequired('lv1')
def leaguedraw(user):
    # 获取彩种类型
    context = {}
    lottery_list = MI.deal_games_list(status="0", isShow="1", is_self='1', openMode='1')
    context['nav'] = lottery_list

    return NormalResponseJson(request, context)

'''平台彩期管理'''
@manage.route('/league/leaguenotselfdraw/list',methods=['GET','POST'])
@authRequired('lv1')
def leaguenotselfdraw(user):
    # 获取彩种类型
    context = {}
    lottery_list = MI.deal_games_list(status="0", isShow="1", is_self='2', openMode='1')
    context['nav'] = lottery_list

    return NormalResponseJson(request, context)


'''综合 彩期查询管理'''
@manage.route('/league/league_lottery/list',methods=['GET','POST'])
@authRequired('lv1')
def league_lottery_list(user):
    lotteryCode = request.form.get('lotteryCode', '-1')
    selfOpenEnable = request.form.get('selfOpenEnable', '-1')

    try:
        page = int(request.form.get('pageNumber', 1)) - 1
        if page <= 0:
            page = 0
    except:
        page = 0

    try:
        size = int(request.form.get('pageSize', 10))
    except:
        size = 10

    game_config = MI.get_lottery(lotteryCode,selfOpenEnable)
    context = {}

    if game_config is not None:

        data = MP.getPlaneExt(lotteryCode)
        length = len(data)

        total = int((length//size) + 1) if length % size > 0 else int(length//size)
        if page >= total:
            page = total-1
        # print total,page,page * size,(page + 1) * size
        data = data[int(page * size):int((page + 1) * size)]
        for v in data:
            v['name'] = game_config['showName']
            v['code'] = lotteryCode

        context['lottery'] = data
        context['totalCount'] = length
        context['pageNumber'] = page+1
    else:
        context['lottery'] = {}

    return NormalResponseJson(request, context)



'''
彩种 编辑
lottery,showName, status, isShow,selfOpenEnable,openMode,stopDelay
'''
@manage.route('/league/lottery/edit', methods=['POST'])
@authRequired('lv2')
def setGameMode(user):
    lottery = request.form.get('lottery', '-1')
    showName = request.form.get('showName', '')
    status = request.form.get('status', '')
    isShow = request.form.get('isShow', '')
    selfOpenEnable = request.form.get('selfOpenEnable', '')
    openMode = request.form.get('openMode', '')
    stopDelay = request.form.get('stopDelay', '')

    data = MI.editGameConfigExt(user=user,
                                lottery=lottery,
                                showName=showName,
                                status=status,
                                isShow=isShow,
                                selfOpenEnable=selfOpenEnable,
                                openMode=openMode,
                                stopDelay=stopDelay
                                )
    return NormalResponseJson(request, data)

"""热门彩票列表"""
@manage.route('/lotteryhot/lotteryhot/list',methods=["POST","GET"])
@authRequired('lv1')
def lotteryHotList(user):
    try:
        page = int(request.form.get('pageNumber', 1)) - 1
        if page <= 0:
            page = 0
    except:
        page = 0

    try:
        size = int(request.form.get('pageSize', 100))
    except:
        size = 100

    showName = request.form.get("name","")
    data = MI.get_games_hot(showName=showName,page=page,size=size)
    return NormalResponseJson(request, data)

"""
热门彩票编辑
lottery, sort, frequency
"""
@manage.route('/lotteryhot/lotteryhot/edit',methods=["POST","GET"])
@authRequired('lv2')
def lotteryHotEdit(user):
    lotteryCode = request.form.get("lotteryCode","-1")
    sort = request.form.get("sort","")
    frequency = request.form.get("frequency","-1")
    data = MI.editGameHotExt(user=user,lottery=lotteryCode,sort=sort,frequency=frequency)
    return NormalResponseJson(request, data)


###########################彩票管理-彩票配置###############################