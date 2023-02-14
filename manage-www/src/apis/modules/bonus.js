/** ****契约分红管理*******/

export default [
    // 分红组列表
    {
        name: 'getUserGroup',
        url: '/system/getUserGroup',
        method: 'post'
    },
    // 新增分红组
    {
        name: 'addUserGroup',
        url: '/system/setUserGroup',
        method: 'post'
    },
    // 删除分红组
    {
        name: 'delUserGroup',
        url: '/system/delUserGroup',
        method: 'post'
    },
    // 契约分红列表
    {
        name: 'getDividendList',
        url: '/system/getDividendList',
        method: 'post'
    },
    // 新增契约前查询用户 
    {
        name: 'preAddDividend',
        url: '/system/preAddDividend',
        method: 'post'
    },
    // 新增契约分红
    {
        name: 'setDividend',
        url: '/system/setDividend',
        method: 'post'
    },
    // 删除契约分红
    {
        name: 'delDividend',
        url: '/system/delDividend',
        method: 'post'
    },
    // 契约分红记录
    {
        name: 'getIssueRecord',
        url: '/imp/getIssueRecord',
        method: 'post'
    },
    // 获取配置
    {
        name: 'listSystemDividend',
        url: '/imp/listSystemDividend',
        method: 'post'
    },
    // 保存分红设置
    {
        name: 'changeConfigDividend',
        url: '/imp/changeConfigDividend',
        method: 'post'
    }
];