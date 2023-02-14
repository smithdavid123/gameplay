import Vue from 'vue';

const filters = {
    // 用户类型
    formatterMemberType: val => {
        if (val === '0' || val === 0) {
            return '会员';
        } else if (val === '1' || val === 1) {
            return '代理';
        } else {
            return '管理员';
        }
    },
    // 后台用户类型
    formatterAccountType: val => {
        if (val < 2) {
            return '无权限';
        } else if (val === 2) {
            return '风控';
        } else if (val === 3) {
            return '财务';
        } else if (val > 4) {
            return '管理员';
        }
    },
    formatterMemberTypeTagClass: val => {
        if (val === '0' || val === 0) {
            return 'tag-green';
        } else if (val === '1' || val === 1) {
            return 'tag-aqua';
        } else {
            return 'tag-red';
        }
    },
    // 订单状态
    formatteOrderStatus: val => ['已撤单', '未开奖', '未中奖', '已中奖'][val + 1],
    formatteOrderStatusTagClass: val => ['tag-gray', 'tag-blue', 'tag-orange', 'tag-green'][val + 1],
    // 投注类型
    formatterAppendType: val => {
        if (val === 1) {
            return '利润率追号';
        } else if (val === 2) {
            return '同倍追号';
        } else if (val === 3) {
            return '翻倍追号';
        } else {
            return '出错';
        }
    },
    // 追号状态
    formatteAppendStatus: val => {
        if (val === 0) {
            return '未开始';
        } else if (val === -1) {
            return '已撤单';
        } else if (val === 1) {
            return '追号中';
        } else if (val === 2) {
            return '已完成';
        } else {
            return '出错';
        }
    },
    formatteAppendStatusTagClass: val => {
        if (val === 0) {
            return 'tag-blue';
        } else if (val === -1) {
            return 'tag-gray';
        } else if (val === 1) {
            return 'tag-orange';
        } else if (val === 2) {
            return 'tag-green';
        } else {
            return 'tag-aqua';
        }
    },
    // 结算状态
    formatterFlag: val => {
        if (val === '1') {
            return '已结算';
        } else if (val === '0') {
            return '未结算';
        } else if (val === '-8') {
            return '取消指定局';
        } else if (val === '-9') {
            return '取消指定单';
        } else {
            return '-';
        }
    },
    formatterFlagTagClass: val => {
        if (val === '1') {
            return 'tag-green';
        } else if (val === '0') {
            return 'tag-gray';
        } else if (val === '-8') {
            return 'tag-blue';
        } else if (val === '-9') {
            return 'tag-orange';
        } else {
            return 'tag-aqua';
        }
    },
    // 平台类型
    formatterPlatformType: val => {
        if (val === '1') {
            return '真人';
        } else if (val === '2') {
            return '电子';
        } else if (val === '3') {
            return '彩票';
        } else if (val === '4') {
            return '体育';
        } else if (val === '5') {
            return '棋牌';
        } else if (val === '6') {
            return '其他';
        } else {
            return '-';
        }
    },
    formatterPlatformTypeTagClass: val => {
        if (val === '1') {
            return 'tag-green';
        } else if (val === '2') {
            return 'tag-gray';
        } else if (val === '3') {
            return 'tag-blue';
        } else if (val === '4') {
            return 'tag-orange';
        } else if (val === '5') {
            return 'tag-orange';
        } else {
            return 'tag-aqua';
        }
    },
    formatterLoginStatus: val => {
        return {
            pc: '电脑',
            app: 'APP'
        }[val];
    },
    formatterLoginStatusTagClass: val => {
        return {
            pc: 'tag-aqua',
            app: 'tag-green'
        }[val];
    },
    formatterAllowAgent: val => ['锁定', '正常'][1 - val],
    formatterMemberStatus: val => ['锁定', '正常'][1 - val],
    formatterSpreadStatus: val => ['启用', '停用'][val],
    formatterIsTransfer: val => ['不允许', '', '允许'][val + 1],
    formatterDelStatus: val => ['正常', '已删除'][val],
    formatterValidityMode: val => ['永久', '一天', '两天', '三天'][val],
    formatterValidityModeTagClass: val => ['tag-blue', 'tag-green', 'tag-aqua', 'tag-orange'][val],
    formatterChangeType: val => {
        if (val === '1300') {
            return '彩票游戏订单投注';
        } else if (val === '1301') {
            return '彩票游戏订单派奖';
        } else if (val === '1302') {
            return '彩票游戏账户订单消费返点';
        } else if (val === '1000') {
            return '存款';
        } else if (val === '1001') {
            return '取款';
        } else if (val === '1002') {
            return '取款退回';
        } else if (val === '1100') {
            return '转入';
        } else if (val === '1101') {
            return '转出';
        } else if (val === '1102') {
            return '上下级转账';
        } else if (val === '1200') {
            return '优惠活动';
        } else if (val === '1400') {
            return '代理返点';
        } else if (val === '1303') {
            return '取消订单';
        } else if (val === '1900') {
            return '分红';
        } else if (val === '1600') {
            return '管理员增';
        } else if (val === '1601') {
            return '管理员减';
        } else if (val === '1700') {
            return '积分兑换';
        } else if (val === '1209') {
            return '手续费';
        } else if (val === '1409') {
            return '系统返水';
        } else if (val === '1989') {
            return '平台抽水';
        }
    },
    formatterChangeTypeTagClass: val => {
        if (val === '1002') { // 提现退回
            return 'tag-red';
        } else {
            return 'tag-aqua';
        }
    },
    formatterPlushType: val => ['未发布', '发布'][1 - val],
    formatterApplyFlag: val => ['自动参与', '需要申请'][val],
    formatterActivityType: val => {
        if (val === 0) { // 提现退回
            return '官会活动';
        } else if (val === 1) {
            return '通用代理';
        } else if (val === 2) {
            return '专用代理';
        } else if (val === 9) {
            return '通用活动';
        }
    },
    formatterActType: val => {
        try {
            return ['首次充值送', '充值送', '消费送', '佣金', '注册送', '签到送', '签到抽奖', '三级亏损佣金', '幸运抽奖'][val.replace('a', '') - 1];
        } catch (error) {
            return '其他';
        }
    },
    formatterStatus: val => ['取消', '待确认', '未发放', '已完成'][val + 1],
    formatterStatusTagClass: val => ['tag-red', 'tag-aqua', 'tag-orange', 'tag-green'][val + 1],
    formatterDividendStatus: val => {
        if (val === 0) { // 提现退回
            return '待确认';
        } else if (val === 1) {
            return '已签订';
        } else if (val === -1) {
            return '拒绝分红';
        } else if (val === null) {
            return '未签订';
        }
    },
    formatterDividendStatus2: val => ['待处理', '已发放', '已拒绝'][val],
    formatterDividendStatusTagClass: val => {
        if (val === 0) { // 提现退回
            return 'tag-blue';
        } else if (val === 1) {
            return 'tag-green';
        } else if (val === -1) {
            return 'tag-red';
        } else if (val === null) {
            return 'tag-gray';
        }
    },
    formatterRechargeStatus: val => ['待确认', '已拒绝', '已成功'][val],
    formatterRechargeStatusTagClass: val => ['tag-gray', 'tag-red', 'tag-green', 'tag-red'][val],
    formatterRechargeStatus2: val => ['待确认', '成功', '失败'][val],
    formatterRechargeStatusTagClass2: val => ['tag-gray', 'tag-green', 'tag-red'][val],
    formatterRechargeWay: val => '网银转账',
    formatterWithdrawFlag: val => {
        if (val === 0) {
            return '待审核';
        } else if (val === 1) {
            return '审核通过';
        } else if (val === 2) {
            return '提现处理中';
        } else if (val === -2) {
            return '财务拒绝';
        } else if (val === 3) {
            return '提现完成';
        } else if (val === -1) {
            return '审核拒绝';
        }
    },
    formatterWithdrawFlagTagClass: val => {
        if (val === 0) {
            return 'tag-blue';
        } else if (val === 1) {
            return 'tag-green';
        } else if (val === 2) {
            return 'tag-gray';
        } else if (val === -2) {
            return 'tag-red';
        } else if (val === 3) {
            return 'tag-green';
        } else if (val === -1) {
            return 'tag-red';
        }
    },
    formatterWithdrawFlag2: val => {
        if (val === 1) {
            return '待处理';
        } else if (val === 3) {
            return '已完成';
        } else if (val === 2) {
            return '待确认';
        } else if (val === -2) {
            return '已拒绝';
        }
    },
    formatterWithdrawFlagTagClass2: val => {
        if (val === 1) {
            return 'tag-blue';
        } else if (val === 3) {
            return 'tag-green';
        } else if (val === 2) {
            return 'tag-orange';
        } else if (val === -2) {
            return 'tag-red';
        }
    },
    formatterTransferType: val => {
        if (val === 0) {
            return '人工充值';
        } else if (val === 1) {
            return '人工提款';
        } else {
            return '类型出错';
        }
    },
    formatterTransferTypeTagClass: val => {
        if (val === 0) {
            return 'tag-aqua';
        } else if (val === 1) {
            return 'tag-aqua';
        } else {
            return 'tag-red';
        }
    },
    formatterTransferDetail: val => {
        if (val === 1) {
            return '充值';
        } else if (val === 2) {
            return '活动';
        } else if (val === 3) {
            return '修正';
        } else if (val === 4) {
            return '提款';
        } else if (val === 5) {
            return '转账';
        } else {
            return '明细出错';
        }
    },
    formatterTransferDetailTagClass: val => {
        if (val === 1) {
            return 'tag-aqua';
        } else if (val === 2) {
            return 'tag-aqua';
        } else if (val === 3) {
            return 'tag-aqua';
        } else if (val === 4) {
            return 'tag-aqua';
        } else if (val === 5) {
            return 'tag-aqua';
        } else {
            return 'tag-red';
        }
    },
    formatterTransferStatus: val => {
        if (val === 0) {
            return '待确认';
        } else if (val === 2) {
            return '已确认';
        } else if (val === -1) {
            return '拒绝';
        } else {
            return '状态出错';
        }
    },
    formatterTransferStatusTagClass: val => {
        if (val === 0) {
            return 'tag-orange';
        } else if (val === 2) {
            return 'tag-green';
        } else if (val === -1) {
            return 'tag-gray';
        } else {
            return 'tag-red';
        }
    },
    formatterPlatform: val => {
        if (val === 0) {
            return '电脑/手机';
        } else if (val === 1) {
            return '电脑';
        } else if (val === 2) {
            return '手机';
        } else {
            return '未知';
        }
    },
    formatterTerminal: val => {
        if (val === 1) {
            return '电脑端';
        } else if (val === 2) {
            return '移动端';
        } else {
            return '所有';
        }
    },
    formatterPayType: val => {
        if (val === 1) {
            return '银行卡转账';
        } else if (val === 2) {
            return '银联扫码';
        } else if (val === 3) {
            return '支付宝';
        } else if (val === 4) {
            return '微信';
        } else {
            return '-';
        }
    },
    formatterNoticeType: val => {
        if (val === 0) {
            return '官方公告';
        } else if (val === 1) {
            return '代理公告';
        } else if (val === 2) {
            return '专用代理';
        } else if (val === 9) {
            return '通用公告';
        }
    },
    formatterBlackType: val => {
        if (val === 1) {
            return '[注册/绑定]IP黑名单';
        } else if (val === 2) {
            return '[注册/绑定]会员姓名黑名单';
        } else if (val === 3) {
            return '[注册/绑定]银行卡号黑名单';
        } else if (val === 4) {
            return '[注册/绑定]会员姓名IP归属地黑名单';
        } else if (val === 5) {
            return '[注册/绑定]会员姓名银行卡号黑名单';
        } else if (val === 6) {
            return '[注册/绑定]会员姓名银行卡号IP归属地黑名单';
        } else {
            return '[注册/绑定]IP归属地黑名单';
        }
    }
};

// 注册过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});