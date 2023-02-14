/** ****投注记录*******/

export default [
    // 订单列表
    {
        name: 'orderList',
        url: '/order/order/list',
        method: 'post'
    },
    // 订单统计
    {
        name: 'orderTotal',
        url: '/order/order/total',
        method: 'post'
    },
    // 系统撤单
    {
        name: 'systemCancelOrder',
        url: '/system/cancelOrder',
        method: 'post'
    },
    // 手动撤单
    {
        name: 'userCancelOrder',
        url: '/system/cancelBill',
        method: 'post'
    },
    // 追号列表
    {
        name: 'appendList',
        url: '/order/append/list',
        method: 'post'
    },
    // 追号统计
    {
        name: 'appendTotal',
        url: '/order/append/total',
        method: 'post'
    },
    // 第三方记录列表
    {
        name: 'agList',
        url: '/order/ag/list',
        method: 'post'
    },
    // 第三方记录统计
    {
        name: 'agTotal',
        url: '/order/ag/total',
        method: 'post'
    },
    // 无效处理
    {
        name: 'invalid',
        url: '/order/ag/invalid',
        method: 'post'
    },
    // 撤未结算订单
    {
        name: 'cancelUnsettleOrder',
        url: '/order/ag/cancelUnsettleOrder',
        method: 'post'
    },
];