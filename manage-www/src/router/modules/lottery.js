import Layout from '@/layout';

export default [{
    path: '/lotteryCenter',
    name: 'lotteryCenter',
    meta: {
        title: '彩票管理',
        icon: 'yelp',
        level: 1
    },
    component: Layout,
    children: [{
        path: 'leaguelottery',
        name: 'leaguelottery',
        component: () =>
            import ('@/views/lotteryCenter/leaguelottery/index.vue'),
        meta: {
            title: '加盟商彩票管理',
            icon: 'asterisk',
            level: 1
        }
    }, {
        path: 'report',
        name: 'lotteryReport',
        component: () =>
            import ('@/views/lotteryCenter/report/index.vue'),
        meta: {
            title: '彩票报表',
            icon: 'piechart',
            level: 1
        }
    }]
}];