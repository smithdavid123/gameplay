import Layout from '@/layout';

export default [{
    path: '/leagueCenter',
    name: 'leagueCenter',
    meta: {
        title: '站点管理',
        icon: 'editFull',
        level: 1
    },
    component: Layout,
    children: [{
        path: 'config',
        name: 'hostConfig',
        component: () =>
            import ('@/views/leagueCenter/config/index.vue'),
        meta: {
            title: '站点配置',
            icon: 'home',
            level: 1
        }
    }, {
        path: 'bankcard',
        name: 'bankcard',
        component: () =>
            import ('@/views/leagueCenter/bankcard/index.vue'),
        meta: {
            title: '站点银行管理',
            icon: 'cc-paypal',
            level: 1
        }
    }, {
        path: 'notice',
        name: 'notice',
        component: () =>
            import ('@/views/leagueCenter/notice/index.vue'),
        meta: {
            title: '公告管理',
            icon: 'commenting',
            level: 1
        }
    }, {
        path: 'message',
        name: 'message',
        component: () =>
            import ('@/views/leagueCenter/message/index.vue'),
        meta: {
            title: '消息管理',
            icon: 'info',
            level: 1
        }
    }]
}];