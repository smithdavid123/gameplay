// 线上充值状态
export const onLinestate = [
    { value: 0, label: '待确认' },
    { value: 1, label: '已拒绝' },
    { value: 2, label: '已成功' }
];

// 线下充值状态
export const outLinestate = [
    { value: 0, label: '待确认' },
    { value: 1, label: '成功' },
    { value: 2, label: '失败' }
];

// 用户类型
export const memberType = [
    { value: 0, label: '会员' },
    { value: 1, label: '代理' },
    { value: 6, label: '管理员' },
];

// 存款方式
export const rechargeType = [
    { value: 'ALIPAY1', label: '云闪付线下支付' },
    { value: 'ALIPAY2', label: 'ATM入款' },
    { value: 'ALIPAY3', label: '银行柜台' },
    { value: 'BANK_DIRECT', label: '网银转账' },
    { value: 'ALIPAY4', label: '第三方平台充值' },
    { value: 'ALIPAY5', label: '微信线下支付' },
    { value: 'ALIPAY6', label: '支付宝线下支付' }
];

// 线上或者线下
export const lineType = [
    { value: 1, label: '线上充值' },
    { value: 2, label: '线下充值' }
];