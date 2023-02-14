var noAlertMsg = function (res) {
    if (res.code == '0-1') {
        alert(res.message);
        window.top.location.href = '/login.html';
        return false;
    }
    if (res.code == '0-3') {
        alert(res.message);
        window.top.location.href= '/login.html';
        return false;
    }
    if (res.code == '0-4') {
        alert(res.message);
        window.top.location.href = '/login.html';
        return false;
    }
    // 投注超时的情况
    if (res.code == '116-05') {
        alert('请检查网路情况后重新重试');
        return false;
    }
    // 投注掉线的情况
    if (res.code == '116-06') {
        window.top.location.href = '/login.html';
        return false;
    }
    return true;
};

// 数据格式化
var DataFormat = {
    Account: {
        valueOf: function (code) {
            if (code == 1) {
                return '彩票账户';
            }
            if (code == 2) {
                return '百家乐账户';
            }
        },
        type: function (code) {
            if (code == 0) {
                return '玩家';
            }
            if (code == 1) {
                return '代理';
            }
        },
        status: function (code) {
            if (code == 0) {
                return '正常';
            }
            if (code == -1) {
                return '禁用';
            }
        },
        onlineStatus: function (code) {
            if (code == 0) {
                return '离线';
            }
            if (code == 1) {
                return '在线';
            }
        },
        bindStatus: function (code) {
            if (code == 0) {
                return '未绑定';
            }
            if (code == 1) {
                return '已绑定';
            }
        },
        pids: function (list) {
            if (list.length == 0) {
                return '无';
            }
            var rs = '';
            $.each(list, function (i, v) {
                if (i != 0) {
                    rs += ' &gt; ';
                }
                rs += v;
            });
            return rs;
        }
    },
    AccountCard: {
        cardStatus: function (code) {
            if (code == 0) {
                return '正常';
            }
            if (code == -1) {
                return '禁用';
            }
        }
    },
    AccountBill: {
        type: function (code) {
            if (code == 1000) {
                return '存款';
            }
            if (code == 1001) {
                return '取款';
            }
            if (code == 1002) {
                return '取款退回';
            }
            if (code == 1100) {
                return '转入';
            }
            if (code == 1101) {
                return '转出'
            }
            if (code == 1102) {
                return '上下级转账';
            }
            if (code == 1200) {
                return '优惠活动';
            }
            if (code == 1300) {
                return '消费';
            }
            if (code == 1301) {
                return '派奖';
            }
            if (code == 1302) {
                return '消费返点';
            }
            if (code == 1303) {
                return '取消订单';
            }
            if (code == 1400) {
                return '代理返点';
            }
            if (code == 1500) {
                return '分红';
            }
            if (code == 1600) {
                return '管理员增';
            }
            if (code == 1601) {
                return '管理员减';
            }
            if (code == 1700) {
                return '积分兑换';
            }
            if (code == 1800) {
                return '支付佣金';
            }
            if (code == 1801) {
                return '获得佣金';
            }
            if (code == 1900) {
                return '会员返水';
            }
			if (code == 1103) {
                return '百家乐账户到AG平台账户';
            }
			if (code == 1104) {
                return 'AG平台账户到百家乐账户';
            }
			if (code == 1105) {
                return '彩票账户转到百家乐账户';
            }
			if (code == 1106) {
                return '百家乐账户转到彩票账户';
            }
        }
    },
    AccountRecharge: {
        method: function (code) {
            if (code == 0) {
                return '系统充值';
            }
            if (code == 1) {
                return '第三方支付';
            }
            if (code == 2) {
                return '转账汇款';
            }
        },
        orderStatus: function (code) {
            if (code == 0) {
                return '等待支付';
            }
            if (code == 1) {
                return '支付完成';
            }
            if (code == -1) {
                return '已取消';
            }
        }
    },
    AccountWithdraw: {
        orderStatus: function (code) {
            if (code == 0) {
                return '待处理';
            }
            if (code == 1) {
                return '已完成';
            }
            if (code == -1) {
                return '已拒绝';
            }
        }
    },
    AccountMessage: {
        type: function (code) {
            if (code == 0) {
                return '普通';
            }
            if (code == 1) {
                return '系统';
            }
            if (code == 2) {
                return '管理员';
            }
        },
        status: function (code) {
            if (code == 0) {
                return '未读';
            }
            if (code == 1) {
                return '已读';
            }
            if (code == 2) {
                return '已删除';
            }
        }
    },
    GameLotteryOrder: {
        type: function (code) {
            if (code == 0) {
                return '普通订单';
            }
            if (code == 1) {
                return '追号订单';
            }
            if (code == 2) {
                return '计划订单';
            }
        },
        status: function (code) {
            if (code == 0) {
                return '未开奖';
            }
            if (code == 1) {
                return '未中奖';
            }
            if (code == 2) {
                return '已中奖';
            }
            if (code == -1) {
                return '已撤单';
            }
        },
        model: function (code) {
            if (code == 'yuan') {
                return '元';
            }
            if (code == 'jiao') {
                return '角';
            }
            if (code == 'fen') {
                return '分';
            }
            if (code == 'li') {
                return '厘';
            }
        }
    },
    GameLotteryChase: {
        status: function (code) {
            if (code == 0) {
                return '未开始';
            }
            if (code == 1) {
                return '追号中';
            }
            if (code == 2) {
                return '已完成';
            }
            if (code == -1) {
                return '已撤单';
            }
        }
    },
    PaymentThridType: {
        valueOf: function (code) {
            if (code == 'baofoo') {
                return '宝付支付';
            }
            if (code == 'yimadai') {
                return '一麻袋支付';
            }
            if (code == 'gopay') {
                return '国付宝支付';
            }
            if (code == 'ips') {
                return '环迅支付';
            }
            if (code == 'mobao') {
                return '摩宝支付';
            }
            if (code == 'newpay') {
                return '新生支付';
            }
            if (code == 'tonghui') {
                return '通汇支付';
            }
            if (code == 'yeepay') {
                return '易宝支付';
            }
            if (code == 'newips') {
                return '新环迅支付';
            }
            if (code == 'chinapnr') {
                return '汇付支付';
            }
            if (code == 'qianhai') {
                return '钱海支付';
            }
            if (code == 'youmpay') {
                return '优付支付';
            }
        }
    }
};

/**
 * 路由器设置
 */
var AppRoute = {
    PATH: "/api",
    // 网页登录
    Module: "/module",
    //新契约
    WEB_LOGIN: "/web-login",
    // APP登录
    APP_LOGIN: "/app-login",
    // 用户退出
    LOGOUT: "/logout",
    // 用户注册
    REGIST: "/regist",
    Account: {
        PATH: "/account",
        // 获取账户类型
        GET_ACCOUNT_TYPE: "/get-account-type",
        // 列出完整的用户信息
        LIST_FULL_INFO: "/list-full-info",
        // 检查用户名是否存在
        CHECK_USERNAME_EXIST: "/check-username-exist",
        // 修改用户昵称
        MODIFY_NICKNAME: "/modify-nickname",
        // 修改用户密码
        MODIFY_PASSWORD: "/modify-password",
        // 修改头像
        MODIFY_AVATAR: "/modify-avatar",
        // 设置用户提现姓名
        SETUP_WITHDRAW_NAME: "/setup-withdraw-name",
        // 设置用户资金密码
        SETUP_WITHDRAW_PASSWORD: "/setup-withdraw-password",
        // 修改用户资金密码
        MODIFY_WITHDRAW_PASSWORD: "/modify-withdraw-password",
        // 准备绑定
        PREPARE_BIND: "/prepare-bind",
        // 请求绑定
        APPLY_BIND: "/apply-bind",
        // 获取绑定状态
        GET_BIND_STATUS: "/get-bind-status",
        // 获取绑定信息
        GET_BIND_INFO: "/get-bind-info",
        // 列出卡片
        LIST_CARD: "/list-card",
        // 准备绑定卡片
        PREPARE_BIND_CARD: "/prepare-bind-card",
        // 绑定卡片
        BIND_CARD: "/bind-card",
        // 设置默认卡片
        SET_DEFAULT_CARD: "/set-default-card",
        // 获取随机密保问题
        GET_RANDOM_SECURITY: "/get-random-security",
        // 绑定密保问题
        BIND_SECURITY: "/bind-security",
        // 搜索账单
        SEARCH_BILL: "/search-bill",
        // 获取账单详情
        GET_BILL_DETAILS: "/get-bill-details",
        // 搜索充值
        SEARCH_RECHARGE: "/search-recharge",
        // 准备提现
        PREPARE_WITHDRAW: "/prepare-withdraw",
        // 提现申请
        APPLY_WITHDRAW: "/apply-withdraw",
        // 搜索提现
        SEARCH_WITHDRAW: "/search-withdraw",
        // 准备平台转账
        PREPARE_TRANSFER: "/prepare-transfer",
        // 申请平台转账
        APPLY_TRANSFER: "/apply-transfer",
        // 搜索转账
        SEARCH_TRANSFER: "/search-transfer",
        // 彩票账户报表
        REPORT_GAME_LOTTERY: "/report-game-lottery",
        // 百家乐账户报表
        REPORT_GAME_BACCARAT: "/report-game-baccarat",
        // 获取消息列表
        LIST_MESSAGE: "/list-message",
        // 发送消息
        SEND_MESSAGE: "/send-message",
        // 读取消息
        READ_MESSAGE: "/read-message",
        // 删除消息
        DELETE_MESSAGE: "/delete-message",
        // 列出系统消息
        LIST_SYSTEM_MESSAGE: "/list-system-message",
        // 清空系统消息
        CLEAR_SYSTEM_MESSAGE: "/clear-system-message",



        //获取是否开启谷歌验证状态
        GET_GOOGLE_LOGIN_STATUS:"/get-google-login-status",
        //开启/关闭谷歌验证
        MODIFY_GOOGLE_LOGIN_STATUS:"/modify-google-login-status",
        //请求绑定谷歌验证2
        GOOGLE_BIND_REQUEAT_PICTURE:"/google-bind-request-picture",
        //谷歌验证绑定成功确认
        GOOGLE_BIND_CONFIRM:"/google-bind-confirm",
        //获取是否绑定谷歌验证状态
        GET_GOOGLE_BIND_STATUS:"/get-google-bind-status",




    },
    Agent: {
        PATH: "/agent",
        // 团队总览
        TEAM_OVERVIEW: "/team-overview",
        // 准备添加新用户
        PREPARE_ADD_ACCOUNT: "/prepare-add-account",
        // 添加新的用户
        ADD_ACCOUNT: "/add-account",
        // 添加注册衔接
        ADD_REGIST_LINK: "/add-regist-link",
        // 列出注册衔接
        LIST_REGIST_LINK: "/list-regist-link",
        // 删除注册衔接
        DELETE_REGIST_LINK: "/delete-regist-link",
        // 准备修改用户配额
        PREPARE_EDIT_QUOTA: "/prepare-edit-quota",
        // 修改用户配额
        EDIT_QUOTA: "/edit-quota",
        // 准备根据配额编辑返点
        PREPARE_EDIT_POINT_BY_QUOTA: "/prepare-edit-point-by-quota",
        // 根据配额编辑返点
        EDIT_POINT_BY_QUOTA: "/edit-point-by-quota",
        // 准备根据消费编辑返点
        PREPARE_EDIT_POINT_BY_AMOUNT: "/prepare-edit-point-by-amount",
        // 根据消费编辑返点
        EDIT_POINT_BY_AMOUNT: "/edit-point-by-amount",
        // 准备平台转账
        PREPARE_TRANSFER: "/prepare-transfer",
        // 申请平台转账
        APPLY_TRANSFER: "/apply-transfer",
        // 显示契约状态
        LOAD_CONTRACT_STATUS: "/loadContractStatus",
        // 准备编辑工资
        PREPARE_EDIT_SALARY_CONTRACT: "/prepare-edit-salary-contract",
        // 编辑契约工资
        APPLY_EDIT_SALARY_CONTRACT: "/apply-edit-salary-contract",
        // 加载契约工资
        LOAD_SALARY_CONTRACT: "/load-salary-contract",
        // 确认签订契约工资
        CONFIRM_SALARY_CONTRACT: "/confirm-salary-contract",
        // 列出工资数据
        LIST_SALARY_RECORD: "/list-salary-record",
        // 准备编辑契约工资
        PREPARE_EDIT_DIVIDEND_CONTRACT: "/prepare-edit-dividend-contract",
        // 申请签订契约分红
        APPLY_EDIT_DIVIDEND_CONTRACT: "/apply-edit-dividend-contract",
        // 加载契约分红
        LOAD_DIVIDEND_CONTRACT: "/load-dividend-contract",
        // 确认签订契约分红
        CONFIRM_DIVIDEND_CONTRACT: "/confirm-dividend-contract",
        // 统计分红数据
        STAT_DIVIDEND_RECORD: "/stat-dividend-record",
        // 列出分红数据
        LIST_DIVIDEND_RECORD: "/list-dividend-record",
        // 发放分红数据
        DRAW_DIVIDEND_RECORD: "/draw-dividend-record",
        // 列出直属下级用户
        LIST_DIRECT_ACCOUNT: "/list-direct-account",
        // 列出来团队账号
        LIST_TEAM_ACCOUNT: "/list-team-account",
        // 列出来契约账号
        LIST_CONTRACT_ACCOUNT: "/list-contract-account",
        // 列出在线用户
        LIST_ONLINE_ACCOUNT: "/list-online-account",
        // 搜索彩票游戏订单
        SEARCH_GAME_LOTTERY_ORDER: "/search-game-lottery-order",
        // 搜索账户账单
        SEARCH_ACCOUNT_BILL: "/search-account-bill",
        // 搜索账户充值
        SEARCH_ACCOUNT_RECHARGE: "/search-account-recharge",
        // 搜索账户取款
        SEARCH_ACCOUNT_WITHDRAW: "/search-account-withdraw",
        // 获取彩票订单
        GET_LOTTERY_ORDER: "/get-lottery-order",
        // 获取账单详情
        GET_BILL_DETAILS: "/get-bill-details",
        // 彩票账户报表
        REPORT_GAME_LOTTERY: "/report-game-lottery",
		// 彩票账户详细报表
		REPORT_GAME_LOTTERY_DETAIL: "/report-game-lottery-detail",
        // 百家乐账户报表
        REPORT_GAME_BACCARAT: "/report-game-baccarat",
        // 加载分红数据
        LOAD_DIVIDEND_DATA: "/load-dividend-data",
        // 领取分红金额
        RECEIVE_DIVIDEND_DATA: "/receive-dividend-data"
    },
    Contract: {
        PATH: "/contract",
        //显示契约类型
        LOAD_CONTRACT_TYPE: "/load-contract-type",
        // 显示契约状态
        LOAD_CONTRACT_STATUS: "/load-contract-status",
        // 列出来契约账号
        LIST_CONTRACT_ACCOUNT: "/list-contract-account",
        // 加载契约工资
        LOAD_SALARY_CONTRACT: "/load-salary-contract",
        // 加载契约分红
        LOAD_DIVIDEND_CONTRACT: "/load-dividend-contract",
        // 确认签订契约工资
        CONFIRM_SALARY_CONTRACT: "/confirm-salary-contract",
        // 确认签订契约分红
        CONFIRM_DIVIDEND_CONTRACT: "/confirm-dividend-contract",
        // 列出工资数据
        LIST_SALARY_RECORD: "/list-salary-record",
        // 准备编辑契约工资(第一套 百分比返)
        PREPARE_EDIT_SALARY_CONTRACT: "/prepare-edit-salary-contract",
        // 准备编辑契约工资(第二套 间隙返)
        PREPARE_EDIT_SALARY_CONTRACT2: "/prepare-edit-salary-contract2",
        // 准备编辑契约工资(第三套 原平台)
        PREPARE_EDIT_SALARY_CONTRACT3: "/prepare-edit-salary-contract3",
        //申请签订契约工资(第一套 百分比返)
        APPLY_EDIT_SALARY_CONTRACT:"/apply-edit-salary-contract",
        //申请签订契约工资(第二套 间隙返)
        APPLY_EDIT_SALARY_CONTRACT2:"/apply-edit-salary-contract2",
        //申请签订契约工资(第三套 原平台)
        APPLY_EDIT_SALARY_CONTRACT3:"/apply-edit-salary-contract3",
        // 准备编辑契约分红
        PREPARE_EDIT_DIVIDEND_CONTRACT: "/prepare-edit-dividend-contract",
        // 准备编辑契约分红 (原平台日分红)
        PREPARE_EDIT_DIVIDEND_CONTRACT2: "/prepare-edit-dividend-contract2",
        // 准备编辑契约分红 (原平台契约分红)
        PREPARE_EDIT_DIVIDEND_CONTRACT3: "/prepare-edit-dividend-contract3",
        // 准备编辑契约分红(累计分红)
        PREPARE_EDIT_DIVIDEND_CONTRACT4: "/prepare-edit-dividend-contract4",
        // 申请签订契约分红
        APPLY_EDIT_DIVIDEND_CONTRACT:"/apply-edit-dividend-contract",
        // 申请签订契约分红(原平台日分红)
        APPLY_EDIT_DIVIDEND_CONTRACT2:"/apply-edit-dividend-contract2",
        // 申请签订契约分红(原平台契约分红)
        APPLY_EDIT_DIVIDEND_CONTRACT3:"/apply-edit-dividend-contract3",
        // 申请签订契约分红(累计分红)
        APPLY_EDIT_DIVIDEND_CONTRACT4:"/apply-edit-dividend-contract4",
        // 列出分红数据
        LIST_DIVIDEND_RECORD: "/list-dividend-record",
        // 统计分红数据
        STAT_DIVIDEND_RECORD: "/stat-dividend-record",
        // 发放分红数据
        DRAW_DIVIDEND_RECORD: "/draw-dividend-record",

    },
    Simulation: {
        PATH: "/simulation/simulation-contract",
        // 显示契约状态
        LOAD_CONTRACT_STATUS: "/load-contract-status",
        // 列出来契约账号
        LIST_CONTRACT_ACCOUNT: "/list-contract-account",
         // 准备编辑契约工资
         PREPARE_EDIT_SALARY_CONTRACT: "/prepare-edit-salary-contract3",
         //申请签订契约工资
        APPLY_EDIT_SALARY_CONTRACT:"/apply-edit-salary-contract3",
        // 加载契约工资
        LOAD_SALARY_CONTRACT: "/load-salary-contract",
        // 确认签订契约工资
        CONFIRM_SALARY_CONTRACT: "/confirm-salary-contract",
       // 列出工资数据
       LIST_SALARY_RECORD: "/list-salary-record",
    },
    GameLottery: {
        PATH: "/game-lottery",
        // 彩票游戏信息
        STATIC_INFO: "/static-info",
        // 彩票游戏开奖号码
        STATIC_OPEN_CODE: "/static-open-code",
        // 彩票游戏开奖时间
        STATIC_OPEN_TIME: "/static-open-time",
        // 彩票游戏追号时间
        STATIC_CHASE_TIME: "/static-chase-time",
        // 彩票游戏玩法规则
        STATIC_METHOD: "/static-method",
        // 走势图
        QUERY_TREND: "/query-trend",
        // 添加订单
        ADD_ORDER: "/add-order",
        // 添加追号
        ADD_CHASE: "/add-chase",
        // 撤销订单
        CANCEL_ORDER: "/cancel-order",
        // 撤销追号
        CANCEL_CHASE: "/cancel-chase",
        // 获取订单
        GET_ORDER: "/get-order",
        // 获取追号
        GET_CHASE: "/get-chase",
        // 搜索订单
        SEARCH_ORDER: "/search-order",
        // 搜索追号
        SEARCH_CHASE: "/search-chase",
        // 拉取开奖通知
        PULL_OPEN_NOTICE: "/pull-open-notice",
        // 清空开奖通知
        CLEAR_OPEN_NOTICE: "/clear-open-notice",
        //生肖
        LIST_SHENGXIAO_BALLS:"/list-shengxiao-balls"
    },
    GameBaccarat: {
        PATH: "/game-baccarat"
    },
    Payment: {
        PATH: "/payment",
        // 列出银行
        STATIC_LIST_BANK: "/static-list-bank",
        // 列出所有可用支付方式
        REQUEST_ALL_METHOD: "/request-all-method",
        // 请求第三方支付
        REQUEST_THRID_PAY: "/request-thrid-pay",
		// 请求第三方提现GTO
		REQUEST_THRID_WITHDRAW:"/request-thrid-withdraw",
		// 请求第三方查询GTO
		REQUEST_THRID_QUERY:"/request-thrid-query",
        // 请求转账支付
        REQUEST_TRANSFER_PAY: "/request-transfer-pay"
    },
    System: {
        PATH: "/system",
        // 列出系统公告
        LIST_NOTICE: "/list-notice",
        // 获取公告详情
        GET_NOTICE_DETAILS: "/get-notice-details",
        //获取玩法最高奖级的接口
        GET_LOTTERY_CODE_RANGE:"/get-lottery-code-range",
        //app下载地址
        GRT_DOWNLOAD_URLS_TITLE:'/get-download-urls-title',
        //超级签名二维码
        GET_VARIABLE_URL:"/get-variable-url",
    },
    Utils: {
        PATH: "/utils",
        // 列出域名地址
        DOMAIN_URLS: "/domain-urls",
        // 获取客服地址
        SERVICE_URL: "/service-url",
        // 登录验证码
        LOGIN_SECURITY_CODE: "/login-security-code",
        // 注册验证码
        REGIST_SECURITY_CODE: "/regist-security-code"
    },
    Activity: {
        PATH: "/activity",
        // 列出活动访问权限
        LIST_ACCESS: "/list-access",
        // 获取活动配置信息
        GET_CONFIG: "/get-config",
        // 领取活动奖励
        DO_DRAW: "/do-draw",
        // 添加签到记录
        ADD_SIGN_RECORD: "/add-sign-record",
        // 获取红包配置
        GET_PACKET_CONFIG: "/get-packet-config",
        // 领取红包金额
        DRAW_PACKET: "/draw-packet",
        //判断是否有活动
        GET_TURNTABLE_CONFIG:"/get-turntable-config",
        //获取抽奖次数
        DO_DRAW_TURNTABLE:"/do-draw-turntable",
    },
    WebAjax: {
        PATH: "/web-ajax",
        // 是否登录
        IS_LOGIN: "/is-login",
        // 轮询页面
        LOOP_PAGE: "/loop-page",
        // 初始化页面
        INIT_PAGE: "/init-page",
        // 初始化彩票页面
        INIT_GAME_LOTTERY: "/init-game-lottery",
        // 轮询彩票游戏
        LOOP_GAME_LOTTERY: "/loop-game-lottery",
        // 初始化数据
        INIT_DATA: "/init-data"
    },
	Gamesimulation: {
        PATH: "/game-simulation",
        // 列出所有游戏
        LIST_ALL_GAMES: "/list-all-games",
        // 开通游戏
        REGISTER_GAME: "/register-game",
        // 获取进入游戏url
        ENTER_GAME: "/enter-game",
        // 查询账户余额
        QUERY_BALANCE: "/query-balance",
        // 转账记录查询
        SEARCH_TRANSFER: "/search-transfer",
        // 查询游戏记录
        SEARCH_PLAYRECORD: "/search-playrecord",
		//查询游戏记录报表
		SEARCH_PLAYRECORD_REPORT: "/search-playrecord-report",
		//彩票账户充钱到游戏账户
		TRANSFER_LOTTERY_TO_GAME: "/transfer-lottery-to-game",
		//从游戏账户提现到彩票账户
		TRANSFER_GAME_TO_LOTTERY: "/transfer-game-to-lottery"
    }
};

/**
 * HTTP请求
 */
var HttpRequest = function (options) {
    var defaults = {
        type: 'post',
        data: {},
        dataType: 'json',
        async: true,
        cache: false,
        beforeSend: null,
        success: null,
        complete: null
    };
    var o = $.extend({}, defaults, options);
    var ajaxRequest = $.ajax({
        type: 'post',
        url: o.url,
        data: o.data,
        dataType: 'json',
        async: o.async,
        beforeSend: function () {
            o.beforeSend && o.beforeSend();
        },
        success: function (res) {
            if (res.error && parseInt(res.code) === 110) {
                window.top.location.href = '/login.html';
            }
            o.success && o.success(res);
        },
        complete: function () {
            o.complete && o.complete();
        }
    });
    // setTimeout(() => {
    //     if (ajaxRequest) ajaxRequest.abort();
    // }, 10000);
};

var MainCtrl = function () {

    /**
     * 网页登录方法
     */
    var webLogin = function (options) {
        options.url = AppRoute.PATH + AppRoute.WEB_LOGIN;
        HttpRequest(options);
    };

    /**
     * APP登录方法
     */
    var appLogin = function (options) {
        options.url = AppRoute.PATH + AppRoute.APP_LOGIN;
        HttpRequest(options);
    };

    /**
     * 退出方法
     */
    var logout = function (options) {
        options.url = AppRoute.PATH + AppRoute.LOGOUT;
        HttpRequest(options);
    };

    /**
     * 注册方法
     */
    var regist = function (options) {
        options.url = AppRoute.PATH + AppRoute.REGIST;
        HttpRequest(options);
    };

    return {
        webLogin: webLogin,
        appLogin: appLogin,
        logout: logout,
        regist: regist
    }

}();

var AccountCtrl = function () {

    var thisScope = 'Account';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

var AgentCtrl = function () {

    var thisScope = 'Agent';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

//新工资、分红契约
var ContractCtrl = function () {

    var thisScope = 'Contract';

    var getScopeUrl = function (key) {
        return AppRoute.Module + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();
//棋牌契约
var SimulationCtrl = function () {

    var thisScope = 'Simulation';

    var getScopeUrl = function (key) {
        return AppRoute.Module + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();




var GameLotteryCtrl = function () {

    var thisScope = 'GameLottery';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

var PaymentCtrl = function () {

    var thisScope = 'Payment';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

var SystemCtrl = function () {

    var thisScope = 'System';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

var ActivityCtrl = function () {

    var thisScope = 'Activity';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

var WebAjaxCtrl = function () {

    var thisScope = 'WebAjax';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();

var GamesimulationCtrl = function () {

    var thisScope = 'Gamesimulation';

    var getScopeUrl = function (key) {
        return AppRoute.PATH + AppRoute[thisScope].PATH + AppRoute[thisScope][key];
    };

    var request = function (key, options) {
        options.url = getScopeUrl(key);
        HttpRequest(options);
    };

    return {
        request: request
    }

}();
