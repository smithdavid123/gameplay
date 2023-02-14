/** ****活动管理*******/

export default [
    // 活动列表
    {
        name: 'listActivityConf',
        url: '/system/listActivityConf',
        method: 'post'
    },
    // 新增活动
    {
        name: 'saveActivity',
        url: '/system/saveActivity',
        method: 'post'
    },
    // 删除活动
    {
        name: 'delActivity',
        url: '/system/delActivity',
        method: 'post'
    },
    // 活动奖金记录
    {
        name: 'listActivityRecords',
        url: '/system/listActivityRecords',
        method: 'post'
    }
];