/** ****统计管理*******/

export default [
    // 今日用户统计
    {
        name: 'statTodayUser',
        url: '/stat/home/statTodayReg',
        method: 'post'
    },
    // 在线用户实时统计
    {
        name: 'statOnlineUser',
        url: '/stat/onlines',
        method: 'post'
    },
    // 审核统计
    {
        name: 'statAudit',
        url: '/system/manageNotice',
        method: 'post'
    },
    // 总金额
    {
        name: 'statBalance',
        url: '/system/summaryMoney',
        method: 'post'
    },
    // 统计数据
    {
        name: 'statAll',
        url: '/system/get-data-summary',
        method: 'post'
    },
    // 今日数据
    {
        name: 'statToday',
        url: '/system/get-data-today',
        method: 'post'
    }
];