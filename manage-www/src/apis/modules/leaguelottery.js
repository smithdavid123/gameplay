/** ****加盟商彩票管理*******/

export default [
    // 彩票配置列表
    {
        name: 'lotteryList',
        url: '/league/leaguelottery/list',
        method: 'post'
    },
    // 彩票配置编辑
    {
        name: 'lotteryEdit',
        url: '/league/lottery/edit',
        method: 'post'
    },
    // 玩法列表
    {
        name: 'lotterybetList',
        url: '/system/lotteryMethodLossList',
        method: 'post'
    },
    // 修改赔率
    {
        name: 'setLotteryMethodLoss',
        url: '/system/setLotteryMethodLoss',
        method: 'post'
    },
    // 彩种分类
    {
        name: 'lotteryCategoryList',
        url: '/lottery/type/list',
        method: 'post'
    },
    // 單挑模式
    {
        name: 'onetooneList',
        url: '/lottery/onetoone/list',
        method: 'post'
    },
    // 编辑注数
    {
        name: 'setMethodLimit',
        url: '/imp/setMethodLimit',
        method: 'post'
    },
    // 單挑模式--状态
    {
        name: 'setMethodStatus',
        url: '/imp/setMethodStatus',
        method: 'post'
    },
    // 热门
    {
        name: 'lotteryhotList',
        url: '/lotteryhot/lotteryhot/list',
        method: 'post'
    },
    // 热门--编辑
    {
        name: 'editLotteryHot',
        url: '/lotteryhot/lotteryhot/edit',
        method: 'post'
    },
    // 彩种导航--列表
    {
        name: 'lotterynavList',
        url: '/lottery/lotterynavigation/list',
        method: 'post'
    },
    // 彩种导航--上下架
    {
        name: 'saveUpDown',
        url: '/imp/setGameStatus',
        method: 'post'
    },
    // 彩种导航--开奖模式
    {
        name: 'setGameMode',
        url: '/imp/setGameMode',
        method: 'post'
    },
    // 自营彩种---筛选条件
    {
        name: 'lotteryQueryList',
        url: '/league/leaguedraw/list',
        method: 'post'
    },
    // 平台彩种---筛选条件
    {
        name: 'platLotteryQueryList',
        url: '/league/leaguenotselfdraw/list',
        method: 'post'
    },
    // 自营彩期--列表 && 平台彩期--列表
    {
        name: 'leaguedrawList',
        url: '/league/league_lottery/list',
        method: 'post'
    },
    // 设置开奖号码
    {
        name: 'setLotteryNumber',
        url: '/system/setPlane',
        method: 'post'
    },
    // 自营彩期--停止销售
    {
        name: 'leaguedrawStop',
        url: '/league/leaguedraw/stop',
        method: 'post'
    },
    // 自营彩期--回复销售
    {
        name: 'leaguedrawreSumeSales',
        url: '/league/leaguedraw/resumeSales',
        method: 'post'
    },
    // 自营彩期--人工结算
    {
        name: 'resettleSave',
        url: '/resettleSave',
        method: 'post'
    },
    // 自营彩期--取消
    {
        name: 'leaguedrawCancel',
        url: '/league/leaguedraw/cancel',
        method: 'post'
    },
    // 自营彩期--跳开
    {
        name: 'leaguedrawJump',
        url: '/league/leaguedraw/jump',
        method: 'post'
    }
];