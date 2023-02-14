/** ****后台用户管理*******/

export default [
    // 用户列表
    {
        name: 'listAccountAdm',
        url: '/system/listAccountAdm',
        method: 'post'
    },
    // 新增用户
    {
        name: 'accountCreate',
        url: '/imp/accountCreate',
        method: 'post'
    },
    // 修改用户
    {
        name: 'accountChange',
        url: '/imp/accountChange',
        method: 'post'
    },
    // 删除用户
    {
        name: 'accountRemove',
        url: '/imp/accountRemove',
        method: 'post'
    },
    // 权限设定
    {
        name: 'setAccountPower',
        url: '/system/setAccountPower',
        method: 'post'
    }
];