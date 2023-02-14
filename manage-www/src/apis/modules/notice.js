/** ****公告管理*******/

export default [
    // 公告列表
    {
        name: 'noticeList',
        url: '/system/listNotice',
        method: 'post'
    },
    // 更改状态
    {
        name: 'updateStatue',
        url: '/imp/changeNotice',
        method: 'post'
    },
    // 新增公告
    {
        name: 'addNotice',
        url: '/imp/saveNotice',
        method: 'post'
    },
    // 删除公告
    {
        name: 'delNotice',
        url: '/imp/delNotice',
        method: 'post'
    }
];