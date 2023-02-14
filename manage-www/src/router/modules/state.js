import Layout from '@/layout';

export default [{
    path: '/stateCenter',
    name: 'stateCenter',
    meta: {
        title: '统计管理',
        icon: 'linechart',
        level: 1
    },
    component: Layout,
    children: [{
        path: 'state',
        name: 'state',
        component: () =>
            import ('@/views/stateCenter/state/index.vue'),
        meta: {
            title: '统计管理',
            icon: 'piechart',
            level: 1
        }
    }]
}];