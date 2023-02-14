/** ****人工转账记录*******/

export default [
    // 人工转账记录列表
    {
        name: 'getOperateMoney',
        url: '/system/getOperateMoney',
        method: 'post'
    },
    // 审核
    {
        name: 'operateConfirm',
        url: '/system/operateConfirm',
        method: 'post'
    },
    // 拒绝
    {
        name: 'operateRefuse',
        url: '/system/operateRefuse',
        method: 'post'
    }
];