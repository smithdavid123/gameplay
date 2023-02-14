// 活动范围
export const activityType = [{
    value: 0,
    label: '官会活动'
}, {
    value: 1,
    label: '通用代理'
}, {
    value: 2,
    label: '专用代理'
}, {
    value: 9,
    label: '通用活动'
}];

// 发布状态
export const publishFlag = [{
    value: -1,
    label: '未发布'
}, {
    value: 1,
    label: '已发布'
}];

export const publishFlag2 = [{
    value: -1,
    label: '不发布'
}, {
    value: 1,
    label: '发布'
}];

export const topFlag = [{
    value: -1,
    label: '非置顶'
}, {
    value: 1,
    label: '置顶'
}];
topFlag;

// 统计类型
export const thirdType = [{
        value: 1,
        label: '真人'
    },
    {
        value: 2,
        label: '电子'
    },
    {
        value: 3,
        label: '彩票'
    },
    {
        value: 4,
        label: '体育'
    },
    {
        value: 5,
        label: '棋牌'
    },
    {
        value: 6,
        label: '其他'
    }
];

// 需要申请
export const applyFlag = [{
    value: 0,
    label: '自动参与'
}, {
    value: 1,
    label: '需要申请'
}];

// 绑定活动
export const actId = [{
    value: 16,
    label: ' 股东日亏损佣金'
}, {
    value: 15,
    label: ' 老板日亏损金额的1%佣金'
}, {
    value: 14,
    label: '特权号日0.05%消费流水'
}];

// 活动类型
export const actType = [{
        value: 'a1',
        label: '首次充值送'
    },
    {
        value: 'a2',
        label: '充值送'
    },
    {
        value: 'a3',
        label: '消费送'
    },
    {
        value: 'a4',
        label: '佣金'
    },
    {
        value: 'a5',
        label: '注册送'
    },
    {
        value: 'a6',
        label: '签到送'
    },
    {
        value: 'a7',
        label: '签到抽奖'
    },
    {
        value: 'a8',
        label: '三级亏损佣金'
    },
    {
        value: 'a9',
        label: '幸运抽奖'
    }
];

// 活动是否发布
export const actStatus = [{
    value: 0,
    label: ' 启用'
}, {
    value: 1,
    label: ' 停用'
}];

// 活动完成状态
export const actCompleteStatus = [{
    value: 0,
    label: ' 待确认'
}, {
    value: 1,
    label: ' 未发放'
}, {
    value: 2,
    label: ' 已完成'
}, {
    value: -1,
    label: ' 取消'
}];