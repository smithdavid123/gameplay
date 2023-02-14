/** ***********全局option***************/

// 彩种
export const lotteryCode = [{
    label: '时时彩',
    options: [{
        value: 'ssc_cq',
        label: '重庆时时彩'
    }, {
        value: 'ssc_tw5',
        label: '台湾5分彩'
    }]
}, {
    label: '11选5',
    options: [{
        value: 'x5_jx',
        label: '江西11选5'
    }, {
        value: 'x5_nmg',
        label: '内蒙古11选5'
    }]
}, {
    label: '快三',
    options: [{
        value: 'k3_sh',
        label: '上海快3'
    }, {
        value: 'k3_bj',
        label: '北京快3'
    }]
}, {
    label: '快乐彩',
    options: [{
        value: 'k8_bj',
        label: '北京快乐8'
    }, {
        value: 'pk10_bj',
        label: '北京赛车'
    }]
}];

// 玩法
export const lotteryBetName = [{
    value: '五星龙虎和',
    label: '五星龙虎和'
}, {
    value: '五星总和大小单双',
    label: '五星总和大小单双'
}, {
    value: '两面盘整合',
    label: '两面盘整合'
}, {
    value: '两面盘和数单双',
    label: '两面盘和数单双'
}];

// 彩票种类
export const lotteryCategoryCode = [{
    value: 1,
    label: '时时彩'
}, {
    value: 2,
    label: '全天彩'
}, {
    value: 3,
    label: '11选5'
}, {
    value: 4,
    label: '快3'
}, {
    value: 5,
    label: '快8'
}, {
    value: 6,
    label: '其它彩种'
}];

// 订单状态
export const orderStatus = [{
    value: 0,
    label: '未开奖'
}, {
    value: 1,
    label: '未中奖'
}, {
    value: 2,
    label: '已中奖'
}, {
    value: -1,
    label: '已撤单'
}];

// 追号状态
export const appendStatus = [{
    value: 0,
    label: '未开始'
}, {
    value: 1,
    label: '追号中'
}, {
    value: 2,
    label: '已完成'
}, {
    value: -1,
    label: '已撤单'
}];

// 第三方记录状态
export const flag = [{
    value: 0,
    label: '未结算'
}, {
    value: 1,
    label: '已结算'
}, {
    value: -9,
    label: '取消指定单'
}, {
    value: -8,
    label: '取消指定局'
}];

// 统计方式
export const totalPattern = [{
    value: 0,
    label: '按日统计'
}, {
    value: 1,
    label: '按月统计'
}];

// 第三方
export const thirdParty = [{
    value: 'SGPOKE_5',
    label: '双赢棋牌'
}, {
    value: 'IBC_4',
    label: '沙巴体育'
}, {
    value: 'CP138_3',
    label: '彩票中心'
}, {
    value: 'AG_5',
    label: 'AG捕鱼'
}, {
    value: 'AG_1',
    label: 'AG视讯'
}, {
    value: 'AG_2',
    label: 'AG电子'
}, {
    value: 'AG_4',
    label: 'AG体育'
}];