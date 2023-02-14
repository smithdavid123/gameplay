import Layout from '@/layout';

export default [{
    path: '/dashboard',
    component: Layout,
    children: [{
        path: '',
        component: () =>
            import ('@/views/dashboard/index.vue'),
        name: 'index',
        meta: {
            title: '首页',
            level: 1
        }
    }]
}];