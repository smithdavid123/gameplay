/** ****站点配置*******/

export default [
    // 充值配置
    {
        name: 'managePayMethod',
        url: '/system/managePayMethod',
        method: 'post'
    },
    // 新增&编辑充值配置
    {
        name: 'savePayMethod',
        url: '/system/savePayMethod',
        method: 'post'
    },
    // 开启与停用
    {
        name: 'changePayMethodStatus',
        url: '/system/changePayStatus',
        method: 'post'
    },
    // 删除公告
    {
        name: 'delPayMethod',
        url: '/system/delPay',
        method: 'post'
    },
    // 站点配置-变量请求
    {
        name: 'getSystemValueList',
        url: '/sys/getSystemValueList',
        method: 'post'
    },
    // 站点配置-变量请求
    {
        name: 'getSysConfig',
        url: '/system/getSysConfig',
        method: 'post'
    },
    // 站点配置-变量设置
    {
        name: 'changeSysConfig',
        url: '/system/changeSysConfig',
        method: 'post'
    },
];