/** ****用户管理*******/

export default [
    // 用户列表
    {
        name: 'memberloginList',
        url: '/imp/accountList',
        method: 'post'
    },
    // 添加用户
    {
        name: 'accountCreate',
        url: '/imp/accountCreate',
        method: 'post'
    },
    // 重置密码
    {
        name: 'initUserPasswd',
        url: '/system/initUserPasswd',
        method: 'post'
    },
    // 重置资金密码
    {
        name: 'initUserWithdrawPasswd',
        url: '/system/initUserWithdrawPasswd',
        method: 'post'
    },
    // 重置密保
    {
        name: 'initUserSecurity',
        url: '/system/initUserSecurity',
        method: 'post'
    },
    // 获取个人提款信息
    {
        name: 'getMoneyOutLimit',
        url: '/system/getMoneyOutLimit',
        method: 'post'
    },
    // 个人提款设置
    {
        name: 'setMoneyOutLimit',
        url: '/system/setMoneyOutLimit',
        method: 'post'
    },
    // 转移线路
    {
        name: 'changeTeamParent',
        url: '/system/changeTeamParent',
        method: 'post'
    },
    // 编辑个人信息
    {
        name: 'changeUserInfo',
        url: '/system/changeUserInfo',
        method: 'post'
    },
    // 获取分红工资组
    {
        name: 'getUserGroup',
        url: '/system/getUserGroup',
        method: 'post'
    },
    // 个人信息---提现查询
    {
        name: 'searchWithdraw',
        url: '/system/account/searchWithdraw',
        method: 'post'
    },
    // 个人信息---存款查询
    {
        name: 'searchRecharge',
        url: '/system/account/searchRecharge',
        method: 'post'
    },
    // 个人信息---银行卡
    {
        name: 'getUserBankcard',
        url: '/system/get-user-cards',
        method: 'post'
    },
    // 个人信息---删除银行卡
    {
        name: 'delUserBankcard',
        url: '/system/delCard',
        method: 'post'
    },
    // 个人信息---彩票投注记录
    {
        name: 'searchOrderAll',
        url: '/imp/searchOrderAll',
        method: 'post'
    },
    // 个人信息---用户输赢报表
    {
        name: 'reportLotteryUser',
        url: '/system/reportLotteryUser',
        method: 'post'
    },
    // 个人信息---第三方报表
    {
        name: 'reportThirdUser',
        url: '/system/reportThirdUser',
        method: 'post'
    },
    // 套利查询
    {
        name: 'findAbnormal',
        url: '/system/findAbnormal',
        method: 'post'
    },
    // 黑名单列表
    {
        name: 'listForbid',
        url: '/system/listForbid',
        method: 'post'
    },
    // 黑名单列表---查询条件-彩种和玩法
    {
        name: 'listGameMethod',
        url: '/system/listGameMethod',
        method: 'post'
    },
    // 新增黑名单
    {
        name: 'addForbidUser',
        url: '/system/addForbidUser',
        method: 'post'
    },
    // 删除黑名单
    {
        name: 'delForbidUser',
        url: '/system/delForbidUser',
        method: 'post'
    },
    // 限制流水列表
    {
        name: 'listListConsume',
        url: '/system/listListConsume',
        method: 'post'
    },
    // 新增修改限制流水
    {
        name: 'setListConsume',
        url: '/system/setListConsume',
        method: 'post'
    },
    // 推广链接列表
    {
        name: 'listRegistLink',
        url: '/system/listRegistLink',
        method: 'post'
    },
    // 停用/启用推广链接
    {
        name: 'setLinkStatus',
        url: '/system/setLinkStatus',
        method: 'post'
    },
    // 删除推广链接
    {
        name: 'deleteRegistLink',
        url: '/system/deleteRegistLink',
        method: 'post'
    },
    // 当日会员概要
    {
        name: 'summaryUserToday',
        url: '/system/summaryUserToday',
        method: 'post'
    },
];