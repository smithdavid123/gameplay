// 用户类型
export const memberGroup = [{
    value: 'JJ001',
    label: '平台主号'
}, {
    value: 'JJ002',
    label: '特权号'
}, {
    value: 'JJ003',
    label: '老板'
}, {
    value: 'JJ004',
    label: '股东'
}, {
    value: 'JJ005',
    label: '线路负责人'
}, {
    value: 'Agent',
    label: '代理'
}, {
    value: 'Player',
    label: '会员'
}];

// 状态
export const status = [{
    value: 0,
    label: '待确认'
}, {
    value: 1,
    label: '已签订'
}, {
    value: -1,
    label: '拒绝分红'
}, {
    value: null,
    label: '未签订'
}];

export const status2 = [{
    value: 0,
    label: '待处理'
}, {
    value: 1,
    label: '已发放'
}, {
    value: 2,
    label: '已拒绝'
}];