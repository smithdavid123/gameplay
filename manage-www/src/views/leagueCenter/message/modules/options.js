// 转账类型
export const type = [{
        value: 1,
        label: '人工充值'
    },
    {
        value: 2,
        label: '人工提款'
    }
];

// 明细
export const detail = [{
        value: 1,
        label: '充值'
    },
    {
        value: 2,
        label: '活动'
    },
    {
        value: 3,
        label: '修正'
    },
    {
        value: 4,
        label: '提款'
    },
    {
        value: 5,
        label: '转账'
    },
];

// 状态
export const status = [{
        value: 0,
        label: '待确认'
    },
    {
        value: 1,
        label: '已确认'
    },
    {
        value: -1,
        label: '拒绝'
    }
];

// 是否含前台
export const noBefore = [{
        value: 0,
        label: '全部'
    },
    {
        value: 1,
        label: '不含前台'
    }
];