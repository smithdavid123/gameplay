/** ****报表管理*******/

export default [
    // 账变记录
    {
        name: 'accountChangeList',
        url: '/system/account/searchBill',
        method: 'post'
    },
    // 人工存取款
    {
        name: 'accountChangeBalance',
        url: '/imp/changeBalance',
        method: 'post'
    },
    // 用户输赢报表
    {
        name: 'reportLotteryUserNew',
        url: '/system/reportLotteryUserNew',
        method: 'post'
    },
    // 整点统计报表
    {
        name: 'reportByHour',
        url: '/system/reportByHour',
        method: 'post'
    },
    // 总报表
    {
        name: 'summaryReportAll',
        url: '/system/summaryReportAll',
        method: 'post'
    },
    // 第三方报表
    {
        name: 'reportThirdUserNew',
        url: '/system/reportThirdUserNew',
        method: 'post'
    },
    // 游戏输赢报表
    {
        name: 'summaryGameReport',
        url: '/system/summaryGameReport',
        method: 'post'
    },
    // 团队报表
    {
        name: 'summaryReportTeam',
        url: '/system/summaryReportTeam',
        method: 'post'
    }
];