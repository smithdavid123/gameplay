// 会员分类
export const type = [{
        value: 1,
        label: '银行卡转账'
    },
    {
        value: 2,
        label: '银联扫码'
    },
    {
        value: 3,
        label: '支付宝'
    },
    {
        value: 4,
        label: '微信'
    },
];

// 状态
export const enableFlag = [{
        value: 1,
        label: '启用'
    },
    {
        value: -1,
        label: '停用'
    }
];

// 状态
export const state = [{
        value: 0,
        label: '启用'
    },
    {
        value: 1,
        label: '停用'
    }
];

// 平台显示
export const displayTerminal = [{
        value: 0,
        label: '所有'
    }, {
        value: 1,
        label: '电脑端'
    },
    {
        value: 2,
        label: '移动端'
    }
];

// 应用位置
export const bindCard = [{
        value: -1,
        label: '充值'
    },
    {
        value: 0,
        label: '充值/提现'
    },
    {
        value: 1,
        label: '提现'
    }
];