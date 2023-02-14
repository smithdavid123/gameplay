/** ****充值管理*******/

export default [
    // 线上充值订单
    {
        name: 'thirdPartyRecharge',
        url: '/recharge/thirdPartyRecharge/list',
        method: 'post'
    },
    // 线下充值订单
    {
        name: 'bankcardtransfer',
        url: '/recharge/bankcardtransfer/list',
        method: 'post'
    },
    // 确认入账和拒绝
    {
        name: 'setMoneyIn',
        url: '/imp/setMoneyIn',
        method: 'post'
    },
    // 线下充值订单
    {
        name: 'rechargeCount',
        url: '/recharge/rechargeCount/list',
        method: 'post'
    },
    // 人工转账记录
    {
        name: 'changeBalance',
        url: '/imp/changeBalance',
        method: 'post'
    }
];