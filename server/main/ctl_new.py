#coding:utf8
'''
===================================================
Description：
===================================================
'''
import sys
from main.app import ErrorResponse
sys.path.append("..")

from flask import request, Blueprint
system = Blueprint('new_platform', __name__)
from auth import authRequired
from common.response import NormalResponseJson, ErrorResponseJson
import new_platform as NP
import new_puser as NPU
import mBill as MB
import mOrder as MO
import mReport as MR
import mInit as MI
import mUser as MU
from mTeam import getRegistLink, delRegistLink
from new_platform import manage_pay_methods, save_pay_method, find_abnormal, find_user_abnormal


@system.route('/system/get-lottery-code-range')
@authRequired('lv0')
def _get_lottery_code_range():
    data = NP.get_lottery_code_range()
    
    return NormalResponseJson(data)

@system.route('/system/get-data-today', methods=['POST'])
@authRequired('lv2')
def _get_data_today(user):
    data = NP.get_data_today()
    
    return NormalResponseJson(data)
    
@system.route('/system/get-data-summary', methods=['POST'])
@authRequired('lv3')
def _get_data_summary(user):
    data = NP.get_data_summary()
    
    return NormalResponseJson(data)

@system.route('/system/get-user-info', methods=['POST'])
@authRequired('lv2')
def _get_user_info(u):
    user = request.form.get('username')
    data = NPU.get_user_info(user)
    
    return NormalResponseJson(data)

@system.route('/system/get-user-cards', methods=['POST'])
@authRequired('lv2')
def _get_user_cards(u):
    user = request.form.get('username')
    data = NPU.get_user_cards(user)
    
    return NormalResponseJson(data)


#'''查询账变记录'''

@system.route('/system/account/searchBill', methods=['GET', 'POST'])
@authRequired('lv2')    
def searchBill(u):
    user = request.form.get('username', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    _type = request.form.get('type', '')
    issue = request.form.get('issue', '')
    
    if user == '': user = ['ALL']
    data = MB.searchBill(user, sTime, eTime, _type, issue, page, size)
    
    return NormalResponseJson(data)

'''提现查询'''
@system.route('/system/account/searchWithdraw', methods=['GET', 'POST']) 
@authRequired('lv2') 
def searchWithdraw(u):
    user = request.form.get('username')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    method = request.form.get('method', '')
    billno = request.form.get('billno', '')
    
    data = MB.searchMoneyOut(user, sTime, eTime, method, page, size, billno)
    
    return NormalResponseJson(data)  

'''充值查询'''
@system.route('/system/account/searchRecharge', methods=['GET', 'POST']) 
@authRequired('lv2') 
def searchRecharge(user):
    user = request.form.get('username')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    method = request.form.get('method', '')
    billno = request.form.get('billno', '')
    
    data = MB.searchMoneyIn(user, sTime, eTime, method, page, size, billno)
    
    return NormalResponseJson(data)  

'''查询投注记录'''
@system.route('/system/searchOrderAll', methods=['POST'])
@authRequired('lv2')    
def searchOrderAll(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    status = request.form.get('status', '')
    page = request.form.get('page', 0)
    size = request.form.get('size', 100)
    if sTime=='': sTime = request.form.get('sTime', '')
    if eTime=='': eTime = request.form.get('eTime', '')
    
    users = ['ALL', user] if username=='' else ['SELF', username]
    data = MO.searchTeamOrder(users, sTime, eTime, '', status, '', page, size)
    
    return NormalResponseJson(data)

@system.route('/system/managePayMethod', methods=['POST'])
@authRequired('lv3')
def _manage_pay_methods(user):
    return NormalResponseJson(manage_pay_methods())

@system.route('/system/savePayMethod', methods=['POST'])
@authRequired('lv3')
def _save_pay_method(user):
    content = request.form.get('content', '')
    try:
        flag, data = save_pay_method(user, content)
        if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    except Exception as e:
        print e
        return ErrorResponseJson("操作失败，请检查配置！")
    return NormalResponseJson(data)

@system.route('/system/findAbnormal', methods=['POST'])
@authRequired('lv2')
def _find_abnormal(user):
    atype = request.form.get('type', 'realName')
    username = request.form.get('username', '')
    repeat = request.form.get('repeat', '')
    page = request.form.get('page', 0)
    size = request.form.get('size', 50)
    if username != '':
        data = find_user_abnormal(username, page, size)
    else:
        data = find_abnormal(atype, repeat, page, size, username)
    
    return NormalResponseJson(data)
    

@system.route('/contract/loadContractStatus', methods=['POST'])
@authRequired('lv0')
def _load_contract_status(user):
    
    data = {'salaryStatus': 1, 'dividendStatus': 1}
    
    return NormalResponseJson(data)

'''查询银行卡列表'''
@system.route('/system/getCards', methods=['POST'])
@authRequired('lv2')    
def getCards(user):
    data = NP.get_cards()
    
    return NormalResponseJson(data)

'''修改银行卡'''
@system.route('/system/saveCard', methods=['POST'])
@authRequired('lv3')    
def _saveCard(user):
    id_ = request.form.get('id', '-1')
    bankId = request.form.get('bankId', '')
    branch = request.form.get('branch', '')
    cardName = request.form.get('cardName', '')
    cardId = request.form.get('cardId', '')
    feeRate = request.form.get('feeRate', 0)
    payType = request.form.get('payType', 0)
    platform = request.form.get('platform', 0)
    forUsers = request.form.get('forUsers', '')
    mark = request.form.get('mark', 0)
    
    flag, data = NP.save_card(user, id_, bankId, branch, cardName, cardId, feeRate, forUsers, platform, mark, payType)
    if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    
    return NormalResponseJson(data)

'''设置银行卡状态'''
@system.route('/system/setCardStatus', methods=['POST'])
@authRequired('lv3')    
def _set_card_status(user):
    id_ = request.form.get('id')
    status = request.form.get('status')
    flag, rst = NP.set_card_status(user, id_, status)
    
    if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    
    return NormalResponseJson(rst)

'''删除银行卡'''
@system.route('/system/delCard', methods=['POST'])
@authRequired('lv2')    
def _del_card(user):
    bid = request.form.get('id')
    cid = request.form.get('bankCardNo')
    flag, rst = NP.del_cards(user, bid, cid)
    
    if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    
    return NormalResponseJson(rst)

'''新增修改用户组'''
@system.route('/system/setUserGroup', methods=['POST'])
@authRequired('lv6')    
def _set_user_group(user):
    id_ = request.form.get('id')
    code = request.form.get('code', '')
    name = request.form.get('name', '')
    level = request.form.get('level')
    pointLimit1 = request.form.get('pointLimit1')
    pointLimit2 = request.form.get('pointLimit2')
    agent = request.form.get('agent', -1)
    allowEqualCode = request.form.get('allowEqualCode', 1)
    
    flag, rst = NP.set_user_group(user, id_, code, name, level, pointLimit1, pointLimit2, agent, allowEqualCode)
    
    if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    
    return NormalResponseJson(rst)

'''删除用户组'''
@system.route('/system/delUserGroup', methods=['POST'])
@authRequired('lv6')    
def _del_user_group(user):
    id_ = request.form.get('id')
    
    flag = NP.del_user_group(user, id_)
    
    if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    
    return NormalResponseJson(flag) 

'''删除用户组'''
@system.route('/system/getUserGroup', methods=['POST'])
@authRequired('lv2')    
def _get_user_group(user):
    data = NP.get_user_group()
    
    return NormalResponseJson(data) 


@system.route('/system/getDividendList', methods=['POST'])
@authRequired('lv2')
def _get_dvidend_list(user):
    username = request.form.get('username', "")
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    parent = request.form.get('parent', "")
    status = request.form.get('status', "")
    limit1 = request.form.get('limit1', '')
    limit2 = request.form.get('limit2', '')
    withPlatform = request.form.get('withPlatform', "")
    data = NP.get_dvidend_list(username, parent, status, limit1, limit2, withPlatform, page, size)
    
    return NormalResponseJson(data)
    
@system.route('/system/setDividend', methods=['POST'])
@authRequired('lv3')
def _set_dvidend(user):
    id_ = request.form.get('id', '-1')
    username = request.form.get('username')
    accountFrom = request.form.get('accountFrom', 0)
    accountTo = request.form.get('accountTo', 0)
    activeUser = request.form.get('activeUser', 0)
    scalePoint = request.form.get('scalePoint', 0.0)
    extraRules = request.form.get('extraRules', '[]')
    flag, data = NP.set_dvidend(user, username, id_, accountFrom, accountTo, activeUser, scalePoint, extraRules)
    if not flag: return ErrorResponseJson("保存失败，请检查配置！")
    
    return NormalResponseJson(data)

@system.route('/system/addDividend', methods=['POST'])
@authRequired('lv3')
def _add_dvidend(user):
    username = request.form.get('username')
    data = NP.add_dividend(user, username)
    return NormalResponseJson(data) 

@system.route('/system/delDividend', methods=['POST'])
@authRequired('lv3')
def _del_dvidend(user):
    id_ = request.form.get('id', '-1')
    data = NP.del_dividend(user, id_)
    return NormalResponseJson(data) 
    
@system.route('/system/preAddDividend', methods=['POST'])
@authRequired('lv2')
def _pre_add_dvidend(user):
    username = request.form.get('username')
    data = NP.pre_add_dvidend(username)
    return NormalResponseJson(data) 

@system.route('/system/getMethodPart0', methods=['POST', 'GET'])
@authRequired('lv0')
def _get_method_part0(user):
    data = MI.getMethodPart(0)
    return NormalResponseJson(data) 
@system.route('/system/getMethodPart1', methods=['POST', 'GET'])
@authRequired('lv0')
def _get_method_part1(user):
    data = MI.getMethodPart(1)
    return NormalResponseJson(data)
@system.route('/system/getMethodPart2', methods=['POST', 'GET'])
@authRequired('lv0')
def _get_method_part2(user):
    data = MI.getMethodPart(2)
    return NormalResponseJson(data) 

@system.route('/system/getInitBase', methods=['POST', 'GET'])
@authRequired('lv0')
def _get_init_base(user):
    data = MI.getInitBase(user)
    return NormalResponseJson(data) 

'''后台账户列表'''
@system.route('/system/listAccountAdm', methods=['GET', 'POST'])
@authRequired('lv2')      
def _list_account_adm(user):    
    username = request.form.get('username', '')
    level = request.form.get('level', '')
    status = request.form.get('status', '')
    data = NPU.list_account_adm(username, level, status)
    
    return NormalResponseJson(data)

'''账户权限设定'''
@system.route('/system/setAccountPower', methods=['GET', 'POST'])
@authRequired('lv2')      
def _setAccountPower(user):
    username = request.form.get('username', '')
    level = request.form.get('level')
    
    flag, data = NPU.set_account_power(user, username, level)
    if not flag: return ErrorResponseJson("修改失败，请检查权限配置！")
    
    return NormalResponseJson(data)

'''彩票·玩法列表'''
@system.route('/system/listGameMethod', methods=['GET', 'POST'])
@authRequired('lv0')      
def _list_game_method(user):
    data = NPU.list_game_method()
    
    return NormalResponseJson(data)

'''列出黑名单列表'''
@system.route('/system/listForbid', methods=['POST'])
@authRequired('lv2')
def _list_forbid(user):
    username = request.form.get('username', '')
    page = request.form.get('page', 0)
    size = request.form.get('size', 20)
    third = request.form.get('thirdParty', '')
    lottery = request.form.get('lottery', '')
    method = request.form.get('method', '')
    
    data = NPU.list_forbid_user(username, page, size, third, lottery, method)
    
    return NormalResponseJson(data)

'''增加黑名单'''
@system.route('/system/addForbidUser', methods=['GET', 'POST'])
@authRequired('lv2')      
def _add_forbid_user(user):
    username = request.form.get('username', '')
    third = request.form.get('third', '')
    thirdName = request.form.get('thirdName', '')
    lottery = request.form.get('lottery', '')
    method = request.form.get('method', '')
    type_ = request.form.get('type', None)
    
    flag, data = NPU.add_forbid_user(user, username, third, lottery, method, thirdName, type_)
    if not flag: return ErrorResponseJson("修改失败，请检查权限配置！")
    
    return NormalResponseJson(data)

@system.route('/system/delForbidUser', methods=['POST'])
@authRequired('lv2')
def _del_forbid_user(user):
    id_ = request.form.get('id')
    data = NPU.del_forbid_user(user, id_)
    return NormalResponseJson(data) 

@system.route('/system/listRegistLink', methods=['GET', 'POST'])  
@authRequired('lv2')
def list_regist_link(user):
    username = request.form.get('username', '')
    page = request.form.get('page', 0)
    size = request.form.get('size', 20)
    code = request.form.get('code', '')
    status = request.form.get('status', '')
    isDel = request.form.get('isDel', '')
    
    data = getRegistLink(username, page, size, code, status, isDel)
    
    return NormalResponseJson(data)  

@system.route('/system/setLinkStatus', methods=['POST'])
@authRequired('lv2')
def _set_link_status(user):
    id_ = request.form.get('id')
    status = request.form.get('status')
    data = NPU.set_link_status(user, id_, status)
    
    return NormalResponseJson(data) 

@system.route('/system/deleteRegistLink', methods=['GET', 'POST'])  
@authRequired('lv2')
def _delete_regist_link(user):
    _id = request.form.get('id', '')
    data = delRegistLink(user, _id, False)
    
    return NormalResponseJson(data)  

@system.route('/system/summaryUserToday', methods=['GET', 'POST'])  
@authRequired('lv2')
def _summary_user_today(user):
    page = request.form.get('page', 0)
    size = request.form.get('size', 20)
    sTime = request.form.get('sTime')
    eTime = request.form.get('eTime')
    byHour = request.form.get('byHour', 1)
    
    data = NPU.summary_user_today(sTime, eTime, page, size, byHour)
    return NormalResponseJson(data)


'''提现订单锁定与解锁：1 - 锁定，0 - 解锁'''
@system.route('/system/lockMoneyOut', methods=['GET', 'POST'])
@authRequired('lv3')      
def _lock_money_out(user):
    billno = request.form.get('billno', '')
    status = int(request.form.get('status'))
    
    flag, data = NPU.lock_money_out(user, billno, status)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)    
    
'''风控审核状态：1 - 通过，-1 - 拒绝'''
@system.route('/system/riskMoneyOut', methods=['GET', 'POST'])
@authRequired('lv2')    
def _risk_money_out(user):
    billno = request.form.get('billno')
    status = int(request.form.get('status'))
    refuseReason = request.form.get('refuseReason', "")
    
    flag, data = NPU.risk_money_out(user, billno, status, refuseReason)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

'''财务审核状态：2 - 通过，-2 - 拒绝'''        
@system.route('/system/financeMoneyOut', methods=['GET', 'POST'])
@authRequired('lv3')        
def _finance_money_out(user):
    billno = request.form.get('billno', '')
    status = int(request.form.get('status'))
    payType = request.form.get('payType', -1)
    refuseReason = request.form.get('refuseReason', "")
    
    flag, data = NPU.finance_money_out(user, billno, status, payType, refuseReason)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

@system.route('/system/summaryMoneyOutType', methods=['GET', 'POST'])  
@authRequired('lv3')
def _summary_money_out_type(user):
    payType = request.form.get('payType', '')
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')    
    
    data = NPU.summary_money_out_type(payType, sTime, eTime)
    
    return NormalResponseJson(data)  
        
@system.route('/system/initUserPasswd', methods=['GET', 'POST'])
@authRequired('lv2')        
def _init_user_passwd(user):
    username = request.form.get('username', '')        
    flag, data = NPU.init_user_passwd(user, username)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

@system.route('/system/initUserWithdrawPasswd', methods=['GET', 'POST'])
@authRequired('lv2')        
def _init_user_withdraw_password(user):
    username = request.form.get('username', '')        
    flag, data = NPU.init_user_withdraw_password(user, username)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

@system.route('/system/initUserSecurity', methods=['GET', 'POST'])
@authRequired('lv2')        
def _init_user_security(user):
    username = request.form.get('username', '')        
    flag, data = NPU.init_user_security(user, username)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

@system.route('/system/getMoneyOutLimit', methods=['GET', 'POST'])  
@authRequired('lv2')
def _get_money_out_limit(user):
    username = request.form.get('username', '')    
    data = NPU.get_money_out_limit(username)
    
    return NormalResponseJson(data)  

@system.route('/system/setMoneyOutLimit', methods=['GET', 'POST'])
@authRequired('lv2')        
def _set_money_out_limit(user):
    username = request.form.get('username', '')
    id_ = request.form.get('id')
    content = request.form.get('content', '{}')
    flag, data = NPU.set_money_out_limit(user, username, id_, content)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

@system.route('/system/changeUserInfo', methods=['GET', 'POST'])
@authRequired('lv2')        
def _change_user_info(user):
    username = request.form.get('username', '')
    content = request.form.get('content', '{}')
    flag, data = NPU.change_user_info(user, username, content)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

'''用户输赢报表'''
@system.route('/system/reportLotteryUser', methods=['POST'])
@authRequired('lv2')    
def _report_lottery_user(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    team = request.form.get('isTeam', 0)
    data = NPU.report_lottery_user(username, sTime, eTime, team)
    
    return NormalResponseJson(data)

'''第三方报表'''
@system.route('/system/reportThirdUser', methods=['POST'])
@authRequired('lv2')    
def _report_third_user(user):
    username = request.form.get('username', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    team = request.form.get('isTeam', 0)
    thirdParty = request.form.get('thirdParty', '')
    data = NPU.report_third_user(sTime, eTime, username, team, thirdParty)
    
    return NormalResponseJson(data)

'''查询账变记录'''
@system.route('/system/searchBill', methods=['GET', 'POST'])
@authRequired('lv2')    
def _search_bill(user):
    username = request.form.get('username', '')    
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sTime', '')
    eTime = request.form.get('eTime', '')
    _type = request.form.get('type', '')    
    issue = request.form.get('issue', '')
    
    users = ['ALL', username] if username=='' else ['SELF', username]
    data = MB.searchBill(users, sTime, eTime, _type, issue, page, size)
    
    return NormalResponseJson(data)          

'''用户输赢报表'''
@system.route('/system/reportLotteryUserNew', methods=['POST'])
@authRequired('lv2')    
def _report_lottery_user_ex(user):
    username = request.form.get('username', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    type_ = request.form.get('type', '')
    team = request.form.get('isTeam', 0)
    data = MR.searchReportEx(user, sTime, eTime, page, size, type_, username, team)
    
    return NormalResponseJson(data)

'''整点统计报表'''
@system.route('/system/reportByHour', methods=['POST'])
@authRequired('lv2')    
def _report_by_hour(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    byHour = int(request.form.get('type', 1))

    data = MR.summary_by_hour(sTime, eTime, page, size, byHour)
    
    return NormalResponseJson(data)

'''总报表'''
@system.route('/system/summaryReportAll', methods=['POST'])
@authRequired('lv2')
def _summary_report_all(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 10))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    data = MR.summary_report_all(sTime, eTime, page, size)
    
    return NormalResponseJson(data)

'''第三方报表'''
@system.route('/system/reportThirdUserNew', methods=['POST'])
@authRequired('lv2')    
def summary_report_third_user(user):
    username = request.form.get('username', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    team = request.form.get('isTeam', 0)
    thirdParty = request.form.get('thirdParty', '')
    data = MR.summary_report_third(sTime, eTime, page, size, username, team, thirdParty)
    
    return NormalResponseJson(data)

'''游戏输赢报表'''
@system.route('/system/summaryGameReport', methods=['POST'])
@authRequired('lv2')    
def _summary_game_report(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    thirdParty = request.form.get('thirdParty', '')
    data = MR.summary_game_report(sTime, eTime, page, size, thirdParty)
    
    return NormalResponseJson(data)

'''团队报表'''
@system.route('/system/summaryReportTeam', methods=['POST'])
@authRequired('lv2')    
def _summary_report_team(user):
    username = request.form.get('username', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    data = MR.summary_report_team(sTime, eTime, page, size, username)
    
    return NormalResponseJson(data)

'''彩票赔率'''
@system.route('/system/lotteryMethodLossList', methods=['POST'])
@authRequired('lv2')    
def _lottery_method_loss_list(user):
    lottery = request.form.get('lottery')
    data = NP.lottery_method_loss_list(lottery)
    
    return NormalResponseJson(data)

'''彩票赔率设定'''
@system.route('/system/setLotteryMethodLoss', methods=['POST'])
@authRequired('lv5')    
def _set_lottery_method_loss(user):
    lottery = request.form.get('lottery', '')
    method = request.form.get('method', '')
    type_ = request.form.get('type')
    bonus = request.form.get('bonus')
    rebate = request.form.get('rebate')
    showOrder = request.form.get('showOrder')
    id_ = request.form.get('id')
    
    if str(bonus).find(".") == -1 and str(bonus).find(",") == -1: 
        return ErrorResponseJson("提示：赔率请参考原数值微调（并非终端直接显示的奖金数字），必须包含小数点！")
    flag, data = NP.set_lottery_method_loss(user, lottery, method, type_, bonus, rebate, showOrder, id_)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)


'''彩种日分析报表'''
@system.route('/system/lotteryReportDay', methods=['POST'])
@authRequired('lv2')    
def _lottery_report_day(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    lottery = request.form.get('lottery', '')
    method = request.form.get('method', '')
    byDay = request.form.get('byDay', 0)
    data = NP.lottery_report_day(sTime, eTime, page, size, lottery, method, byDay, "lottery")
    
    return NormalResponseJson(data)

'''玩法日分析报表'''
@system.route('/system/methodReportDay', methods=['POST'])
@authRequired('lv2')    
def _method_report_day(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    lottery = request.form.get('lottery', '')
    method = request.form.get('method', '')
    byDay = request.form.get('byDay', 0)
    data = NP.lottery_report_day(sTime, eTime, page, size, lottery, method, byDay, "method")
    
    return NormalResponseJson(data)

'''个人彩种分析'''
@system.route('/system/lotteryReportUser', methods=['POST'])
@authRequired('lv2')    
def _lottery_report_user(user):
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    lottery = request.form.get('lottery', '')
    method = request.form.get('method', '')
    byDay = request.form.get('byDay', 0)
    data = NP.lottery_report_user(sTime, eTime, page, size, lottery, method, byDay)
    
    return NormalResponseJson(data)

'''个人游戏分析'''
@system.route('/system/summaryGameUser', methods=['POST'])
@authRequired('lv2')    
def _summary_game_user(u):
    user = request.form.get('username', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    team = int(request.form.get('team', 0))
    byDay = int(request.form.get('byDay', 0))
    thirdParty = request.form.get('thirdParty', '')
    data = MR.summary_game_user(sTime, eTime, page, size, user, team, thirdParty, byDay)
    
    return NormalResponseJson(data)

'''后台消息提醒'''
@system.route('/system/manageNotice', methods=['POST'])
@authRequired('lv2')    
def _manage_notice(u):
    data = NPU.manage_notice()
    return NormalResponseJson(data)
    
'''总金额'''
@system.route('/system/summaryMoney', methods=['POST'])
@authRequired('lv2')    
def _summary_manage(u):
    data = NPU.summary_manage()
    return NormalResponseJson(data)    

@system.route('/system/cancelOrder', methods=['GET', 'POST'])
@authRequired('lv2')        
def _cancel_order(user):
    username = request.form.get('username')
    billno = request.form.get('billno')
    # flag, data = MO.cancelOrder(username, billno)
    flag, data = MO.systemCancelOrder(user, username, billno)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

@system.route('/system/cancelBill', methods=['GET', 'POST'])
@authRequired('lv2')        
def _cancel_bill(user):
    username = request.form.get('username')
    billno = request.form.get('billno')
    flag, data = MO.systemCancelOrder(user, username, billno)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

''' 系统变量获取'''
@system.route('/system/getSysConfig', methods=['GET', 'POST'])
@authRequired('lv3')        
def _get_config(user):
    name = request.form.get('name')
    data = MI.get_system_config(name)
    
    return NormalResponseJson(data)

''' 系统变量变更'''
@system.route('/system/changeSysConfig', methods=['GET', 'POST'])
@authRequired('lv3')        
def _change_config(user):
    name = request.form.get('name')
    value = request.form.get('value')
    flag, data = MI.set_system_config(user, name, value)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

'''个人流水限制列表'''
@system.route('/system/listListConsume', methods=['POST'])
@authRequired('lv2')    
def _list_limit_consume(u):
    user = request.form.get('username', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    data = MU.list_limit_consume(user, page, size)
    
    return NormalResponseJson(data)
  
'''个人流水限制设置'''
@system.route('/system/setListConsume', methods=['GET', 'POST'])
@authRequired('lv2')
def _set_limit_consume(user):
    username = request.form.get('username')
    amount = request.form.get('amount')
    beginTime = request.form.get('beginTime')
    mark = request.form.get('mark')
    id_ = request.form.get('id', '-1')
    
    flag, data = MU.set_limit_consume(user, username, amount, beginTime, mark, id_)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)

''' 设置银行状态'''
@system.route('/system/setBankInfo', methods=['GET', 'POST'])
@authRequired('lv3')        
def _set_bank_info(user):
    content = request.form.get('content')
    flag, data = MB.set_bank_info(user, content)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

'''发送消息'''
@system.route('/system/sendMessageSys', methods=['GET', 'POST'])
@authRequired('lv2')        
def _send_message(user):
    title = request.form.get('title')
    isSys = request.form.get('isSys')
    toUsers = request.form.get('toUser')
    content = request.form.get('content')
    flag, data = NP.send_message(user, isSys, title, content, toUsers)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

'''消息列表'''
@system.route('/system/listMessageSys', methods=['POST'])
@authRequired('lv2')    
def _get_message_list(u):
    fromUser = request.form.get('fromUser', '')
    title = request.form.get('title', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    data = NP.get_message_list(sTime, eTime, title, fromUser, page, size)
    
    return NormalResponseJson(data)

'''删除消息'''
@system.route('/system/delMessage', methods=['POST'])
@authRequired('lv2')    
def _del_message(user):
    id_ = request.form.get('id')
    flag, data = NP.del_message(user, id_)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)

'''保存活动配置'''
@system.route('/system/saveActivity', methods=['GET', 'POST'])
@authRequired('lv2')        
def _save_activity(user):
    content = request.form.get('content')
    flag, data = NP.save_activity(user, content)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)  

'''活动列表'''
@system.route('/system/listActivityConf', methods=['POST'])
@authRequired('lv2')    
def get_activity_list(u):
    name = request.form.get('name', '')
    type_ = request.form.get('type', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    data = NP.get_activity_list(name, type_, page, size)
    
    return NormalResponseJson(data)

'''删除活动'''
@system.route('/system/delActivity', methods=['POST'])
@authRequired('lv2')    
def _del_activity(user):
    id_ = request.form.get('id')
    flag, data = NP.del_activity(user, id_)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)

'''活动奖金记录'''
@system.route('/system/listActivityRecords', methods=['POST'])
@authRequired('lv2')
def _get_activity_records(u):
    name = request.form.get('name', '')
    user = request.form.get('username', '')
    type_ = request.form.get('type', '')
    status = request.form.get('status', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    data = NP.get_activity_records(user, name, type_, status, page, size)
    
    return NormalResponseJson(data)

'''人工操作记录'''
@system.route('/system/getOperateMoney', methods=['POST'])
@authRequired('lv2')
def _get_operate_money(u):
    userIn = request.form.get('userIn', '')
    userOut = request.form.get('userOut', '')
    transType = request.form.get('transType', '')
    remarks = request.form.get('remarks', '')
    status = request.form.get('status', '')
    sTime = request.form.get('sDate', '')
    eTime = request.form.get('eDate', '')
    page = int(request.form.get('page', 0))
    size = int(request.form.get('size', 20))
    data = NP.get_operate_money(userIn, userOut, transType, remarks, status, page, size, sTime, eTime)
    
    return NormalResponseJson(data)

'''人工·同意'''
@system.route('/system/operateConfirm', methods=['POST'])
@authRequired('lv2')    
def operate_confirm(u):
    user = request.form.get('username', '')
    issue = request.form.get('issue', '')
    transType = int(request.form.get('transType'))
    if transType == 0:
        flag, data = MB.manageMoney(u, user, issue, 0, tbName = 'money_in'), "操作失败"
    else:
        flag, data = MB.manageMoneySetOut(u, user, issue, 1)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)

'''人工·拒绝'''
@system.route('/system/operateRefuse', methods=['POST'])
@authRequired('lv2')    
def operate_refuse(u):
    user = request.form.get('username', '')
    issue = request.form.get('issue', '')
    transType = int(request.form.get('transType'))
    if transType == 0:
        flag, data = MB.manageMoney(u, user, issue, 1, tbName = 'money_in'), "操作失败"
    else:
        flag, data = MB.manageMoneySetOut(u, user, issue, 0)
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data)


'''变量列表请求'''
@system.route('/sys/getSystemValueList', methods=['POST'])
@authRequired('lv2')
def _get_system_values(u):
    idx = int(request.form.get('index', 0))
    
    data = [['RECHARGE_CASH_MIN', 'RECHARGE_TIME', 'RECHARGE_CASH_MAX'], 
            ['DRAWINF_LIMIT_PERCENT', 'WITHDRAW_TIME', 'WITHDRAW_MAX_COUNT', 
             'WITHDRAW_FREE_COUNT', 'WITHDRAW_MAX_AMOUNT_DAILY', 'WITHDRAW_MAX_AMOUNT_UNIT', 
             'WITHDRAW_MIN_AMOUNT_UNIT', 'WITHDRAW_MAX_FREE'
            ], 
            ['PLATFORM_REBATES_MAX', 'PLATFORM_REBATES_MIN', 'MAX_BONUS_ONCE', 'MAX_BONUS_ISSUE', 
             'PLATFORM_DRAW_WATER'], 
            ['NICKNAME_FLAG', 'USER_VIP_LEVEL'], 
            [], []
        ][idx]
    
    return NormalResponseJson(data)

'''转移·线路'''
@system.route('/system/changeTeamParent', methods=['POST'])
@authRequired('lv2')    
def _change_team_parent(u):
    fromUser = request.form.get('from', '')
    toUser = request.form.get('to', '')
    _type = int(request.form.get('type'))
    flag, data = MU.setParentTo(u, fromUser, toUser)
    
    if not flag: return ErrorResponseJson(data)
    
    return NormalResponseJson(data) 

@system.route('/getAppVersion', methods=['POST'])
def _get_version():
    code = int(request.form.get('mcode', 0))
    data = MI.get_version(code)
    return NormalResponseJson(data) 

if __name__ == '__main__':
    pass