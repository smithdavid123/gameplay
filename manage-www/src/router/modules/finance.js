import Layout from '@/layout';

export default [{
    path: '/financeCenter',
    name: 'financeCenter',
    meta: {
        title: '财务管理',
        icon: 'jpy',
        level: 1
    },
    component: Layout,
    children: [{
        path: 'recharge',
        name: 'recharge',
        component: () =>
            import ('@/views/financeCenter/recharge/index.vue'),
        meta: {
            title: '充值管理',
            icon: 'jpy',
            level: 1
        }
    }, {
        path: 'withdrawal',
        name: 'withdrawal',
        component: () =>
            import ('@/views/financeCenter/withdrawal/index.vue'),
        meta: {
            title: '提现管理',
            icon: 'usd',
            level: 1
        }
    }, {
        path: 'manual',
        name: 'manual',
        component: () =>
            import ('@/views/financeCenter/manual/index.vue'),
        meta: {
            title: '人工转账',
            icon: 'money',
            level: 1
        }
    }]
}];