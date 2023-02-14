/** ****彩种报表*******/

export default [
    // 彩种报表列表
    {
        name: 'lotteryReportList',
        url: '/system/lotteryReportDay',
        method: 'post'
    },
    // 玩法日报表列表
    {
        name: 'methodReportDay',
        url: '/system/methodReportDay',
        method: 'post'
    },
    // 个人彩种分析列表
    {
        name: 'lotteryReportUser',
        url: '/system/lotteryReportUser',
        method: 'post'
    },
    // 个人游戏分析列表
    {
        name: 'summaryGameUser',
        url: '/system/summaryGameUser',
        method: 'post'
    }
];