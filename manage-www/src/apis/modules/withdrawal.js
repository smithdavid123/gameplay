/** ****提现管理*******/

export default [
    // 风控审核列表
    {
        name: 'withdrawaladuitrisk',
        url: '/withdrawal/withdrawaladuitrisk/list',
        method: 'post'
    },
    // 风控审核--拒绝与通过
    {
        name: 'riskMoneyOut',
        url: '/system/riskMoneyOut',
        method: 'post'
    },
    // 出款审核
    {
        name: 'withdrawaladuit',
        url: '/withdrawal/withdrawaladuit/list',
        method: 'post'
    },
    // 解锁与锁定
    {
        name: 'lockMoneyOut',
        url: '/system/lockMoneyOut',
        method: 'post'
    },
    // 审核
    {
        name: 'financeMoneyOut',
        url: '/system/financeMoneyOut',
        method: 'post'
    },
    // 对账与退款
    {
        name: 'setMoneyOut',
        url: '/imp/setMoneyOut',
        method: 'post'
    },
    // 出款接口统计
    {
        name: 'summaryMoneyOutType',
        url: '/system/summaryMoneyOutType',
        method: 'post'
    }
];