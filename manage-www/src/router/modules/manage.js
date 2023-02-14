import Layout from '@/layout';

export default [{
    path: '/manageCenter',
    name: 'manageCenter',
    meta: {
        title: '系统管理',
        icon: 'setting',
        level: 1
    },
    component: Layout,
    children: [{
            path: 'permission',
            name: 'permission',
            component: () =>
                import ('@/views/manageCenter/permission/index.vue'),
            meta: {
                title: '权限管理',
                icon: 'diamond',
                level: 1
            }
        }
        //   , {
        //     path: 'ipconfig',
        //     name: 'ipConfig',
        //     component: () =>
        //         import ('@/views/manageCenter/ipconfig/index.vue'),
        //     meta: {
        //         title: 'IP管理',
        //         icon: 'list',
        //         level: 1
        //     }
        // }, {
        //     path: 'log',
        //     name: 'log',
        //     component: () =>
        //         import ('@/views/manageCenter/log/index.vue'),
        //     meta: {
        //         title: '日志',
        //         icon: 'list-alt',
        //         level: 1
        //     }
        //   }
    ]
}];