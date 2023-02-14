import request from '@/utils/request'
import { getToken  ,getCookie} from '@/utils/auth' // 验权
import baseURL from '@/utils/conf';
import axios from 'axios';

function ajaxData (key, data, _callbackS, _callbackE) {
  data['tk'] = getToken()
  data['lc'] = getCookie();
  axios.get(baseURL + key, {params: data})
    .then(function (rst) {
      if (rst.data.error) {
        // console.log(rst.data.message);
        return;
      }
      if (_callbackS)_callbackS(rst.data);
    })
    .catch(function (rst) {
      if (_callbackE) _callbackE(rst);
    });
};

export function initDataAll (calback) {
  let fc0 = new Promise((resolve, reject) => {
    ajaxData('/system/getInitBase', {}, (res) => {
      resolve(res.data);
    });
  });
  
  let fc1 = new Promise((resolve, reject) => {
    ajaxData('/system/getMethodPart0', {}, (res) => {
      resolve(res.data);
    });
  });

  // let fc2 = new Promise((resolve, reject) => {
  //   ajaxData('/system/getMethodPart1', {}, (res) => {
  //     resolve(res.data);
  //   });
  // });

  // let fc3 = new Promise((resolve, reject) => {
  //   ajaxData('/system/getMethodPart2', {}, (res) => {
  //     resolve(res.data);
  //   });
  // });

  return Promise.all([fc0, fc1]).then((result) => {
    if (calback) calback(result);
  }, (e) => {
    console.log(e);
  }).catch((error) => {
      console.log(error);
  });

};


/*dengl*/
export function loginByUsername(param) {
  return request({
    url: '/webLoginApp',
    method: 'post',
    data:param
  })
}

export function getAppVersion(param) {
  return request({
    url: '/getAppVersion',
    method: 'post',
    data:param
  })
}

/*dengl*/
export function isLogin(param) {
  return request({
    url: '/isLogin',
    method: 'post',
    data:param
  })
}

/*个人信息*/
export function getUserInfo(param) {
  return request({
    url: '/loopPage',
    method: 'post',
    data:param
  })
}
/*dengl*/
export function logout(param) {
  return request({
    url: '/logout',
    method: 'post',
    data:param
  })
}
/*dengl*/
export function listNotice(param) {
  return request({
    url: '/system/listNotice',
    method: 'post',
    data:param
  })
}
/*个人报表*/
export function reportGameLottery(param) {
  return request({
    url: '/account/reportGameLottery',
    method: 'post',
    data:param
  })
}
/*投注记录*/
export function searchOrder(param) {
  return request({
    url: '/game/searchOrder',
    method: 'post',
    data:param
  })
}
/*追号记录*/
export function loadContractStatus(param) {
  return request({
    url: '/game/searchChase',
    method: 'post',
    data:param
  })
}
/*追号记录 撤单*/
export function cancelChase(param) {
  return request({
    url: '/game/cancelChase',
    method: 'post',
    data:param
  })
}
/*资金明显*/
export function searchBill(param) {
  return request({
    url: '/account/searchBill',
    method: 'post',
    data:param
  })
}/*充值记录 - 存取款记录*/
export function searchRecharge(param) {
  return request({
    url: '/account/searchRecharge',
    method: 'post',
    data:param
  })
}
/*提现记录 - 存取款记录*/
export function searchWithdraw(param) {
  return request({
    url: '/account/searchWithdraw',
    method: 'post',
    data:param
  })
}

/*团队管理*/
export function listTeamAccount(param) {
  return request({
    url: '/agent/listTeamAccount',
    method: 'post',
    data:param
  })
}

/*团队管理-转账到下级*/
export function prepareTransfer(param) {
  return request({
    url: '/agent/prepareTransfer',
    method: 'post',
    data:param
  })
}

/*团队管理-确定转账到下级*/
export function applyTransfer(param) {
  return request({
    url: '/agent/applyTransfer',
    method: 'post',
    data:param
  })
}
/*团队管理-配额*/
export function prepareeditquota(param) {
  return request({
    url: '/agent/prepare-edit-quota',
    method: 'post',
    data:param
  })
}
/*团队管理-配额升点*/
export function prepareEditPointByQuota(param) {
  return request({
    url: '/agent/prepareEditPointByQuota',
    method: 'post',
    data:param
  })
}
/*团队管理-确定配额升点*/
export function editPointByQuota(param) {
  return request({
    url: '/agent/editPointByQuota',
    method: 'post',
    data:param
  })
}

/*团队报表*/
export function reportGameLotteryTeam(param) {
  return request({
    url: '/agent/reportGameLotteryTeamApp',
    method: 'post',
    data:param
  })
}
/*团队投资记录*/
export function searchGameLotteryOrder(param) {
  return request({
    url: '/agent/searchGameLotteryOrder',
    method: 'post',
    data:param
  })
}

/*团队投资记录*/
export function teamloadContractStatus(param) {
  return request({
    url: '/agent/loadContractStatus',
    method: 'post',
    data:param
  })
}

/*开户*/
export function addAccount(param) {
  return request({
    url: '/agent/addAccount',
    method: 'post',
    data:param
  })
}

/*消息列表*/
export function getListMessage(param) {
  return request({
    url: '/account/list-message',
    method: 'post',
    data:param
  })
}

/*发送消息*/
export function sendMessage(param) {
  return request({
    url: '/account/send-message',
    method: 'post',
    data:param
  })
}
/*修改昵称*/
export function modifyNickname(param) {
  return request({
    url: '/account/modifyNickname',
    method: 'post',
    data:param
  })
}
/*修改登录密码*/
export function modifyPassword(param) {
  return request({
    url: '/account/modifyPassword',
    method: 'post',
    data:param
  })


}
/*修改资金密码*/
export function modifyWithdrawPassword(param) {
  return request({
    url: '/account/modifyWithdrawPassword',
    method: 'post',
    data:param
  })
}
/*银行卡列表*/
export function listCard(param) {
  return request({
    url: '/account/listCard',
    method: 'post',
    data:param
  })
}
/*设置默认银行卡*/
export function setDefaultCard(param) {
  return request({
    url: '/account/setDefaultCard',
    method: 'post',
    data:param
  })
}

/*开户行*/
export function prepareBindCard(param) {
  return request({
    url: '/account/prepareBindCard',
    method: 'post',
    data:param
  })
}

/*确定添加银行卡*/
export function bindCard(param) {
  return request({
    url: '/account/bindCard',
    method: 'post',
    data:param
  })
}
/*游戏列表*/
export function listAllGames(param) {
  return request({
    url: '/listAllGames',
    method: 'post',
    data:param
  })
}

/*开奖号码*/
export function staticOpenCode(param) {
  return request({
    url: '/game/staticOpenCode',
    method: 'post',
    data:param
  })
}
/*走势*/
export function queryTrend(param) {
  return request({
    url: '/game/queryTrend',
    method: 'post',
    data:param
  })
}

/*投注*/
export function addOrder(param) {
  return request({
    url: '/game/addOrder',
    method: 'post',
    data:param
  })
}

/*开奖时间*/
export function staticOpenTime(param) {
  return request({
    url: '/game/staticOpenTime',
    method: 'post',
    data:param
  })
}

/*基础数据*/
export function initData(param) {
  return request({
    url: '/initData',
    method: 'post',
    data:param
  })
}

/*契约中心 契约下级*/
export function listContractAccount(param) {
  return request({
    url: '/agent/listContractAccount',
    method: 'post',
    data:param
  })
}


/*契约中心 契约分红*/
export function statDividendRecord(param) {
  return request({
    url: '/agent/statDividendRecord',
    method: 'post',
    data:param
  })
}

/*契约中心 分红处理*/
export function listDividendRecord(param) {
  return request({
    url: '/agent/listDividendRecord',
    method: 'post',
    data:param
  })
}

/*契约中心 我的契约*/
export function loadDividendContract(param) {
  return request({
    url: '/agent/loadDividendContract',
    method: 'post',
    data:param
  })
}
/*契约中心 发放分红*/
export function drawDividendRecord(param) {
  return request({
    url: '/agent/drawDividendRecord',
    method: 'post',
    data:param
  })
}

/*契约中心 签订分红*/
export function prepareEditDividendContract(param) {
  return request({
    url: '/agent/prepareEditDividendContract',
    method: 'post',
    data:param
  })
}
/*契约中心 queding签订分红*/
export function applyEditDividendContract(param) {
  return request({
    url: '/agent/applyEditDividendContract',
    method: 'post',
    data:param
  })
}
/*充值*/
  export function requestAllMethod(param) {
    return request({
      url: '/payment/requestAllMethod',
      method: 'post',
      data:param
    })
  }
  /*充值*/
  export function requestThridPay(param) {
    return request({
      url: '/payment/requestThridPay',
      method: 'post',
      data:param
    })
  }  /*充值 zidingy*/
  export function requestTransferPay(param) {
    return request({
      url: '/payment/requestTransferPay',
      method: 'post',
      data:param
    })
  }

  /*提现*/
  export function prepareWithdraw(param) {
    return request({
      url: '/account/prepareWithdraw',
      method: 'post',
      data:param
    })
  }
/*确认提现*/
  export function applyWithdraw(param) {
    return request({
      url: '/account/applyWithdraw',
      method: 'post',
      data:param
    })
  }

  /*是否可以提现*/
  export function getBindStatus(param) {
    return request({
      url: '/account/getBindStatus',
      method: 'post',
      data:param
    })
  }
/*今日收益*/
  export function accountToday(param) {
    return request({
      url: '/account/today',
      method: 'post',
      data:param
    })
  }

  /*同意签约*/
  export function confirmDividendContract(param) {
    return request({
      url: '/agent/confirmDividendContract',
      method: 'post',
      data:param
    })
  }
  /*二维码*/
  export function getdownloadurlstitle(param) {
    return request({
      url: '/system/get-download-urls-title',
      method: 'post',
      data:param
    })
  }

  /*上期开奖*/
  export function loopGameLottery(param) {
    return request({
      url: '/loopGameLottery',
      method: 'post',
      data:param
    })
  }

   /*取消订单*/
   export function cancelOrder(param) {
    return request({
      url: '/game/cancelOrder',
      method: 'post',
      data:param
    })
  }
  /*修改资金密码 一个*/
   export function setupWithdrawPassword(param) {
    return request({
      url: '/account/setupWithdrawPassword',
      method: 'post',
      data:param
    })
  }

  /*绑定取款人 一个*/
   export function setupWithdrawName(param) {
    return request({
      url: '/account/setupWithdrawName',
      method: 'post',
      data:param
    })
  }
  /* 绑定密保*/
   export function bindSecurity(param) {
    return request({
      url: '/account/bindSecurity',
      method: 'post',
      data:param
    })
  }
/*返点范围 */
export function prepareAddAccount(params) {
  return request({
    url: '/agent/prepareAddAccount',
    method: 'post',
    params
  })
}
/*chax */
export function getOrderGame(params) {
  return request({
    url: '/game/getOrder',
    method: 'post',
    data:params
  })
}
/*客服 */
export function getService() {
  return request({
    url: '/utils/serviceUrlApp',
    method: 'get',

  })
}

/*追号 */
export function staticChaseTime(params) {
  return request({
    url: '/game/staticChaseTime',
    method: 'post',
    data:params
  })
}

/*确定追号 */
export function addChase(params) {
  return request({
    url: '/game/addChase',
    method: 'post',
    data:params
  })
}
/*开奖中心 */
export function openCode(params) {
  return request({
    url: '/game-lottery/static-open-code',
    method: 'post',
    data:params
  })
}

