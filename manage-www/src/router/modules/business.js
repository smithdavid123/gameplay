import Layout from '@/layout';

export default [{
    path: '/businessCenter',
    name: 'businessCenter',
    meta: {
        title: '业务管理',
        icon: 'ticket',
        level: 1
    },
    component: Layout,
    children: [{
            path: 'order',
            name: 'order',
            component: () =>
                import ('@/views/businessCenter/order/index.vue'),
            meta: {
                title: '投注记录',
                icon: 'stack-overflow',
                level: 1
            }
        }, {
            path: 'member',
            name: 'member',
            component: () =>
                import ('@/views/businessCenter/member/index.vue'),
            meta: {
                title: '用户管理',
                icon: 'member',
                level: 1
            }
        }, {
            path: 'report',
            name: 'businessReport',
            component: () =>
                import ('@/views/businessCenter/report/index.vue'),
            meta: {
                title: '报表管理',
                icon: 'piechart',
                level: 1
            }
        }, {
            path: 'activity',
            name: 'activity',
            component: () =>
                import ('@/views/businessCenter/activity/index.vue'),
            meta: {
                title: '活动管理',
                icon: 'gg',
                level: 1
            }
        }, {
            path: 'bonus',
            name: 'bonus',
            component: () =>
                import ('@/views/businessCenter/bonus/index.vue'),
            meta: {
                title: '契约分红',
                icon: 'paypal',
                level: 1
            }
        },
        //  {
        //     path: 'history',
        //     name: 'history',
        //     component: () =>
        //         import ('@/views/businessCenter/history/index.vue'),
        //     meta: {
        //         title: '历史数据',
        //         icon: 'cloud',
        //         level: 1
        //     }
        // }
    ]
}];