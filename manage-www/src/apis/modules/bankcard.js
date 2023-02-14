/** ****银行卡管理*******/

export default [
    // 平台银行卡列表
    {
        name: 'bankCardList',
        url: '/system/getCards',
        method: 'post'
    },
    // 用户银行卡列表
    {
        name: 'userBankCardList',
        url: '/withdrawal/bank/list',
        method: 'post'
    },
    // 更改状态
    {
        name: 'updateBankCardStatus',
        url: '/system/setCardStatus',
        method: 'post'
    },
    // 用户转账银行更改状态
    {
        name: 'updateUserBankCardStatus',
        url: '/system/setBankInfo',
        method: 'post'
    },
    // 新增公告
    {
        name: 'addBankCard',
        url: '/system/saveCard',
        method: 'post'
    },
    // 删除公告
    {
        name: 'delBankCard',
        url: '/system/delCard',
        method: 'post'
    }
];