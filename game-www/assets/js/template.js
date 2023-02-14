/** 會員中心選單menu */
var member_menu_list = [
    {
        category: 1, name_ch: '个人中心', name_en: 'MEMBER', icon: 'personal', childs: [
            { name: '帐户总览', href: '/member/member-home.html' },
            { name: '银行卡列表', href: '/member/member-card.html' },
        ]
    },
    {
        category: 2, name_ch: '报表中心', name_en: 'REPORT', icon: 'report', childs: [
            { name: '投注记录', href: '/member/member-order.html' },
            { name: '追号记录', href: '/member/member-chase.html' },
            { name: '账变记录', href: '/member/member-bill.html' },
            { name: '盈亏报表', href: '/member/member-report.html' },
        ]
    },
    {
        category: 3, name_ch: '财务管理', name_en: 'FINANCIAL', icon: 'funds', childs: [
            { name: '我要充值', href: '/member/funds-apply-recharge.html' },
            { name: '我要提现', href: '/member/funds-apply-withdraw.html' },
            { name: '充值记录', href: '/member/funds-recharge-record.html' },
            { name: '提现记录', href: '/member/funds-withdraw-record.html' },
        ]
    },
    {
        category: 4, name_ch: '百家乐帐户', name_en: 'BACCARAT', icon: 'baccarat', childs: [
            { name: '百家乐游戏', href: '/member/funds-transfer-wallet.html' },
            { name: '游戏记录', href: '/member/funds-transfer-gameorder.html' },
            { name: '游戏报表', href: '/member/funds-transfer-gamelist.html' },
        ]
    },
    {
        category: 5, name_ch: '代理中心', name_en: 'AGENT', icon: 'agent', visible: 'agent', childs: [
            { name: '团队总览', href: '/member/agent-team-overview.html' },
            { name: '开户中心', href: '/member/agent-open-account.html' },
            { name: '会员列表', href: '/member/agent-team-list.html' },
            { name: '在线会员', href: '/member/agent-team-online.html' },
            { name: '投注记录', href: '/member/agent-team-order.html' },
            { name: '充值记录', href: '/member/agent-team-recharge.html' },
            { name: '取款记录', href: '/member/agent-team-withdraw.html' },
            { name: '账变记录', href: '/member/agent-team-bill.html' },
            { name: '盈亏报表', href: '/member/agent-team-report.html' },
            { name: '彩票报表', href: '/member/agent-team-report-detail.html' },
        ]
    },
    {
        category: 6, name_ch: '契约中心', name_en: 'CONTRACT', icon: 'contract', visible: 'contract', childs: [
            { name: '我的契约', href: '/member/agent-contract-mime-list.html', visible: 'contract' }, // 因global.js變數isShowContractAlert無法判別，暫不判別子選單
            { name: '契约下级', href: '/member/agent-contract-lower-list.html', visible: 'contract-lower' },
            { name: '契约工资', href: '/member/agent-contract-salary-record.html', visible: 'salary-contract' },
            { name: '契约分红', href: '/member/agent-contract-dividend-stat.html', visible: 'dividend-contract' },
            { name: '分红处理', href: '/member/agent-contract-dividend-record.html', visible: 'dividend-contract' },
        ]
    },
    {
        category: 7, name_ch: '棋牌契约', name_en: 'SIMULATION CONTRACT', icon: 'simulation', visible: 'simulation', childs: [
            { name: '工资契约下级', href: '/member/simulation-contract-lower-list.html', visible: 'simulation-lower' },
            { name: '棋牌契约工资', href: '/member/simulation-contract-salary-record.html', visible: 'salary-simulation' },
            { name: '我的棋牌契约', href: '/member/simulation-contract-mime-list.html', visible: 'simulation' },
        ]
    },
    {
        category: 8, name_ch: '消息中心', name_en: 'MAIL', icon: 'mail', visible: 'message', childs: [
            { name: '收件箱', href: '/member/message-inbox.html' },
            { name: '发消息', href: '/member/message-send.html' },
        ]
    },
    // {
    //     category: 9, name_ch: '系统公告', name_en: 'NOTICE', icon: 'notice', childs: [
    //         { name: '系统公告', href: '/member/notice.html' },
    //     ]
    // },
    // {
    //     category: 10, name_ch: '优惠活动', childs: [
    //         { name: '优惠活动', href: '/view/activity/index.html' },
    //     ]
    // },
    // {
    //     category: 11, name_ch: '帮助中心', name_en: 'HELP CENTER', icon: 'help', childs: [
    //         { name: '帮助中心', href: '/member/help-center.html?0' },
    //         { name: '11选5', href: '/member/help-center.html?1' },
    //         { name: '快3', href: '/member/help-center.html?2' },
    //         { name: '福彩3D、排列3', href: '/member/help-center.html?3' },
    //         { name: '北京快乐8', href: '/member/help-center.html?4' },
    //         { name: '北京PK10', href: '/member/help-center.html?5' },
    //     ]
    // },
    // {
    //     category: 12, name_ch: '关于我们', name_en: 'ABOUT', icon: 'about', childs: [
    //         { name: '关于我们', href: '/member/about-us.html?0' },
    //         { name: '服务条款', href: '/member/about-us.html?1' },
    //     ]
    // },
    // {
    //     category: 13, name_ch: '快速入口', name_en: 'ENTRY', icon: 'entry', visible: 'entry', childs: [
    //         { name: '关于我们', href: '/member/about-us.html' },
    //         { name: '系统公告', href: '/member/notice.html' },
    //         { name: '帮助中心', href: '/member/help-center.html' },
    //     ]
    // },
];
/** 快速入口選單menu */
var fast_menu_list = [
    {
        category: 1, name_ch: '系统公告', name_en: 'ANNOUNCEMENT', icon: 'notice', childs: [
            { name: '系统公告', href: '/member/notice.html' },
        ]
    },
    {
        category: 2, name_ch: '关于我们', name_en: 'ABOUT', icon: 'about', childs: [
            { name: '关于我们', href: '/member/about-us.html?0' },
            { name: '服务条款', href: '/member/about-us.html?1' },
        ]
    },
    {
        category: 3, name_ch: '帮助中心', name_en: 'HELP', icon: 'help', childs: [
            { name: '时时彩', href: '/member/help-center.html?0' },
            { name: '11选5', href: '/member/help-center.html?1' },
            { name: '快3', href: '/member/help-center.html?2' },
            { name: '福彩3D、排列3', href: '/member/help-center.html?3' },
            { name: '北京快乐8', href: '/member/help-center.html?4' },
            { name: '北京PK10', href: '/member/help-center.html?5' },
        ]
    },
    {
        category: 4, name_ch: '优惠活动', name_en: 'PROMOTIONS', icon: 'activity', childs: [
            { name: '关于我们', href: '/view/activity/index.html' },
        ]
    },
];

/** Header共用內容 */
var headerTpl = function () {
    /** 建立Header選單 */
    var buildHeaderMenuList = function () {
        var list = [
            { name_ch: '首页', name_en: 'HOME', class: 'home', href: '/home.html' },
            { name_ch: '彩票中心', name_en: 'LOTTERY', class: 'lottery', type: 'lottery', href: '/lottery-hall.html', isHot: true },
            { name_ch: '游戏中心', name_en: 'BACCARAT', class: 'baccarat', type: 'baccarat', isHot: true },
            { name_ch: '服务中心', name_en: 'SERVICE', class: 'help', type: 'menu-list' },
            { name_ch: '个人中心', name_en: 'PERSONAL', class: 'member', type: 'menu-list' },
            { name_ch: '优惠活动', name_en: 'PROMOTIONS', class: 'activity', href: '/view/activity/index.html' },
            // { name_ch: 'APP下载', name_en: 'DOWNLOAD', class: 'download', type: 'download', isHot: true },
            // { name_ch: '线路检测', name_en: 'LINES', class: 'lines', type: 'lines' },
            // { name_ch: '在线客服', name_en: 'SERVICE', class: 'service', href: '/service.html', target: '_blank' },
        ];
        let $headerList = $(`<div class="header_list"></div>`);
        $.each(list, function (i, v) {
            if (i == 3) {
                $headerList.append($(`<a class="header_logo" href="/home.html"><img src="/assets/images/logo2.png" style="max-width: 179px; margin: 0 36px;transform: translateY(-25px);" /></a>`));
            }
            let $newItem = $(`<div class="item ${v.class}">
                            <a class="item-row">
                                <i class="icon"></i>
                                <div class="text_area">
                                    <div class="name_ch">${v.name_ch}</div>
                                    <div class="name_en">${v.name_en}</div>
                                </div>
                            </a>
                        </div>`);

            if (v.href) { $newItem.find('.item-row').attr("href", v.href); }
            if (v.target) { $newItem.find('.item-row').attr("target", v.target); }
            // if (v.isHot) { $newItem.append('<div class="icon hot"></div>'); }
            if (window.location.href.indexOf(v.href) > -1) { $newItem.addClass("active"); }

            // 特殊type處理
            if (v.type == "menu-list") { // 一般選單
                $newItem.append(`<div class="sub_menu_area"></div>`);
            } else if (v.type == "baccarat") { // 百家樂
                $newItem.append(`<div class="side-container">
                <div class="baccarat_content"></div>
            </div>`)
            } else if (v.type == "lottery") {
                $newItem.addClass("game");
                $newItem.append(`<div class="lottery_list">
                <div class="lottery_content"></div>
            </div>`);
            } else if (v.type == "download") { // 下載
                $newItem.append(`<div class="side-container">
                <div class="qrcode-items">
                    <div class="qrcode-item android hide">
                        <div class="title"><img src="/assets/images/reg/android_icon.png" />安卓</div>
                        <div id="header-code" class="code"></div>
                    </div>
                    <div class="qrcode-item ios hide">
                        <div class="title"><img src="/assets/images/reg/ios_icon.png" />苹果</div>
                        <div id="header-code2" class="code"></div>
                    </div>
                    <div class="qrcode-item variable hide">
                        <div class="title"></div>
                        <div id="header-code3" class="code"></div>
                    </div>
                </div>
            </div>`);
            } else if (v.type == "lines") { // 線路檢測
                $newItem.append(`<div class="side-container force-width">
                <div class="side-lines-box"></div>
                <div class="re-ping">重新检测</div>
            </div>`);
            }
            $headerList.append($newItem);
        });
        $headerList.append($headerList);

        return $headerList[0].outerHTML;
    }

    if (isLogin) {
        return `<div class="page-header">
            <div class="header" id="toolbar">
                <div class="data_row">
                    <div class="flex-row">
                        <div class="user_data_box">
                            <!--<div class="user_img">
                                <img data-field="userImg" src="/member/images/avatar/default.png" alt="">
                            </div>-->
                            <div class="user_info">
                                <div style="color:#ffb37b">欢迎回来&nbsp;</div>
                                <div data-global="username">加载中</div>
                                <a class="hide" data-global="msgCount" href="/member/message-inbox.html">
                                    <div>0</div>
                                </a>
                            </div>
                        </div>
                        <div class="safety-info">
                            <div class="star-box">
                                <div class="small-title">安全指数</div>
                                <div class="star-row">
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                    <div class="star"></div>
                                </div>
                            </div>
                            <span class="safetyLevel m-l-5"></span>
                        </div>
                    </div>
                    <div class="top-btns">
                        <div class="moneyBox">
                            <div class="balance">
                                <span">余额</span">
                                <div class="money_bg">
                                    <div class="money textAuto" data-global="lotteryBalance">0</div>
                                    <span class="money_hide hide">*** </span>
                                </div>
                                <span class="money_unit">元</span>
                                <a data-command="refresh"><img src="/assets/images/toolbar/icon_refresh.png" /></a>
                                <!--<span class="money_switch pointer">隐藏</span>-->
                                <div class="wallet"></div>
                            </div>
                        </div>

                        <a class="top-btn recharge hover" href="/member/funds-apply-recharge.html">
                            <img src="/assets/images/header/recharge.png" />
                        </a>
                        <a class="top-btn withdraw hover" href="/member/funds-apply-withdraw.html">
                            <img src="/assets/images/header/withdraw.png" />
                        </a>
                        <a class="top-btn transfer hover" href="/member/funds-transfer-wallet.html">
                            <img src="/assets/images/header/transfer.png" />
                        </a>
                        <a class="hover" data-command="logout">
                            <!--<img src="/assets/images/header/logout.png" />-->
                            退出
                        </a>
                    </div>
                </div>
                <div class="menu_row">
                    <div class="inner">
                        ${buildHeaderMenuList()}
                    </div>
                </div>
            </div>
        </div>
        <div class="rightMenu animated bounceInRight">
            <div class="links">
                <a class="link lines">
                    <img src="/assets/images/header/right_icon_lines.png" />
                    <!--<span>线路检测</span>-->
                    <div class="side-container">
                        <div class="title">线路检测</div>
                        <div class="side-lines-box"></div>
                        <div class="re-ping">重新检测</div>
                    </div>
                </a>
                <a class="link" href="/service.html" target="_blank">
                    <img src="/assets/images/header/right_icon_service.png" />
                    <!--<span>在线客服</span>-->
                </a>
                <a class="link qrcode-tab">
                    <img src="/assets/images/header/right_icon_download.png" />
                    <!--<span>APP下载</span>-->
                    <div class="qrcodes">
                        <div class="qrcode-item android hide">
                            <div class="title">Android</div>
                            <div id="right-code" class="code"></div>
                        </div>
                        <div class="qrcode-item ios hide">
                            <div class="title">iOS</div>
                            <div id="right-code2" class="code"></div>
                        </div>
                        <div class="qrcode-item variable hide">
                            <div class="title"></div>
                            <div id="right-code3" class="code"></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>`;
    } else {
        return ``;
    }
}

/** Footer共用內容 */
var footerTpl = function () {
    if (isLogin) {
        const isHome = window.location.href.indexOf('/home.html') > -1;
        let homeFooter = `
        <div class="home-footer w-100 flex-row">
            <div class="advantage">
                <div class="title">平台优势</div>
                <div class="content flex-row flex-warp flex-start">
                    <div class="item"><img src="assets/images/footer/adv_1.png"></div>
                    <div class="item"><img src="assets/images/footer/adv_2.png"></div>
                    <div class="item"><img src="assets/images/footer/adv_3.png"></div>
                    <div class="item"><img src="assets/images/footer/adv_4.png"></div>
                    <div class="item"><img src="assets/images/footer/adv_5.png"></div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="about-us">
                <div class="title">关于我们</div>
                <div class="content">
                壹佰娱乐由壹佰娱乐人拥有及经营，为大中华地区领先的娱乐场博彩度假酒店发展商，屡获殊荣的顶级综合博彩度假酒店，2020年与亚洲最大博彩软件提供商进行技术合作，正式进军网络博彩业，成立「壹佰娱乐赌场」线上博彩网站。
                </div>
            </div>
            <div class="divider"></div>
            <div class="tools">
                <div class="payment">
                    <div class="text flex-row flex-start">
                        <div class="title" style="margin-right: 10px;">支付方式</div>
                        <div class="pay-list">
                            <span class="item"><img src="/assets/images/reg/alipay.png"></span>
                            <span class="item"><img src="/assets/images/reg/wechatpay.png"></span>
                            <span class="item"><img src="/assets/images/reg/unionpay.png"></span>
                        </div>
                    </div>
                </div>
                <div class="browser">
                    <div class="text flex-row flex-start">
                        <div class="title" style="margin-right: 10px;">浏览器下载</div>
                        <div class="browser-list">
                            <a class="item hover" target="_blank" href="http://www.firefox.com.cn/"><img
                                    src="/assets/images/reg/ff.png"></a>
                            <a class="item hover" target="_blank" href="https://oomake.com/download/chrome"><img
                                    src="/assets/images/reg/chrome.png"></a>
                            <a class="item hover" target="_blank"
                                href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads"><img
                                    src="/assets/images/reg/ie.png"></a>
                            <a class="item hover" target="_blank" href="https://ie.sogou.com/"><img
                                    src="/assets/images/reg/sogo.png"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        return `<div class="page-footer">
            ${isHome ? homeFooter : ''}
            <div class="footer-copyright-row">
                copyright © 壹佰娱乐 Lottery Entertainment 2019 Reserved
            </div>
        </div>`;
    } else {
        return `<div class="page-footer">
            <div class="footer-copyright-row">
                copyright © 壹佰娱乐 Lottery Entertainment 2019 Reserved
            </div>
        </div>`;
    }
}

/** Footer共用內容 */
var footersSingleTpl = function () {
    return `<div class="page-footer-single">
        <div class="footer-copyright-row">
            copyright © 壹佰娱乐 Lottery Entertainment 2019 Reserved
        </div>
    </div>`;
}

/** 全局共用layout，自動獲取id為global-slot的內容 */
var globalSharedTpl = function (contents) {
    return `
        ${headerTpl()}
        ${contents ? contents : document.getElementById("global-slot").innerHTML}
        ${footerTpl()}
    `;
}

/** 註冊、登入共用layout，自動獲取id為global-slot的內容 */
var globalLoginSharedTpl = function (contents) {
    return `
        ${contents ? contents : document.getElementById("global-slot").innerHTML}
    `;
}

/** single page共用layout，自動獲取id為global-slot的內容 */
var globalSingleSharedTpl = function (contents) {
    return `
        ${headerTpl()}
        ${contents ? contents : document.getElementById("global-slot").innerHTML}
        ${footersSingleTpl()}
    `;
}

/** 會員中心所有頁面共用layout，自動獲取id為member-slot的內容 
 * param: {
 *  isSingle: boolean 是否為「關於我們」等獨立頁
 * }
*/
var memberSharedTpl = function (param) {
    /** 會員中心PersonalInfo */
    var buildPersonalInfo = function () {
        var $personalInfo =
            $(`<div class="personal-info">
        <div class="avatar">
            <img data-field="userImg" src="images/avatar/default.png">
            <!--<a class="hover" data-command="mod-avatar">修改头像</a>-->
        </div>
        <div class="details">
            <div class="greeting">
                <div><span data-field="nickname"></span></div>
                <!--<div>余额<span class="textAuto" data-global="lotteryBalance">加载中</span></div>-->
                <div class="flex-row w-100">
                    <a class="hover" data-command="mod-nickname">修改昵称</a>
                </div>
            </div>
        </div>
        <!-- <div class="details">
            <div class="greeting">
                <div class="m-b-5">您好！<span data-field="nickname"></span></div>
                <a class="hover" data-command="mod-nickname">修改昵称</a>
                <div class="accountType" data-field="accountType">加载中</div>
            </div>
        </div>
        <div class="wallets">
            <div class="title">帐户余额</div>
            <div class="balance">
                ¥<div class="textAuto" data-global="lotteryBalance">加载中</div>
                <a data-command="refresh"><img src="/member/images/left_panel_refresh.png"></a>
            </div>
            <div class="wallet-btns">
                <a class="item hover" href="/member/funds-apply-recharge.html"><img src="/member/images/recharge.png" /></a>
                <a class="item hover" href="/member/funds-apply-withdraw.html"><img src="/member/images/withdraw.png" /></a>
                <a class="item hover" href="/member/funds-transfer-wallet.html"><img src="/member/images/transfer.png" /></a>
            </div>
            <div class="wallet-today">
                <div class="item">
                    今日充值
                    <span class="textAuto todayNum" data-wallet="rechargeToday"></span>
                </div>
                <div class="item">
                    今日提现
                    <span class="textAuto todayNum" data-wallet="withdrawToday"></span>
                </div>
                <div class="item">
                    今日盈利
                    <span class="textAuto todayNum" data-wallet="profitToday"></span>
                </div>
            </div>
        </div>
        <div class="login-info">
            <div>
                <span>IP位置：</span>
                <span data-field="lastLoginIp">加载中</span>
            </div>
            <div>
                <span>注册时间：</span>
                <span data-field="registTime">加载中</span>
            </div>
            <div>
                <span>登录时间：</span>
                <span data-field="lastLoginTime">加载中</span>
            </div>
            <!--<div>
                <span>用户名：</span>
                <span data-global="username">加载中</span>
            </div>
            <div>
                <span>账户类型：</span>
                <span data-field="accountType">加载中</span>
            </div>-->
        </div>
        
        <div class="wallet-info-row">
            <div class="personal-wallets"></div>
        </div>
        <div class="link-btns">
            <a class="link-btns-recharge hover" href="/member/funds-apply-recharge.html">
                <img src="/member/images/icon_recharge.png" />
                充值
            </a>
            <a class="link-btns-withdraw hover" href="/member/funds-apply-withdraw.html">
                <img src="/member/images/icon_withdraw.png" />
                取款
            </a>
            <a class="link-btns-transfer hover" href="/member/funds-transfer-wallet.html">
                <img src="/member/images/icon_transfer.png" />
                转帐
            </a>
        </div> -->
    </div>`);
        return $personalInfo[0].outerHTML;
    }

    /** 會員中心主選單 */
    var buildMainMenu = function (param) {
        var $mainMenu = $('<div />', { "class": 'main-menu' });

        /** 取得個人中心各大項目的連結選單 單階層版本，與buildMainMenu分開寫是為了保留彈性 */
        var memberMenuItems = function () {
            var result = '';
            let dataSource = (param && param.isSingle) ? fast_menu_list : member_menu_list;
            dataSource.forEach(x => {
                var $newLink = $(`<a href="${x.childs[0].href}" class="item">
                                    <img class="icon-normal" src="/member/images/main_menu_${x.icon}_icon.png">
                                    <!--<img class="icon-active" src="/member/images/main_menu_${x.icon}_icon_active.png">-->
                                    ${x.name_ch}
                                    <!--<i class="icon-arrow"></i>-->
                                </a>`);
                var isActive = x.childs.some(child => window.location.href.indexOf(child.href) > -1);
                if (isActive) {
                    $newLink.addClass("active");
                    document.title = x.name_ch;
                }
                if (x.visible) {
                    $newLink.addClass("hide");
                    $newLink.attr("data-visible", x.visible);
                }
                result += $newLink[0].outerHTML;
            });
            return result;
        }

        $mainMenu.append($(memberMenuItems())); // 單階層
        return $mainMenu[0].outerHTML;
    }

    /** 會員中心子選單 */
    var buildSubMenu = function () {
        var current_category = member_menu_list.find((x) => {
            return x.childs.some(child => window.location.href.indexOf(child.href) > -1);
        });
        if (!current_category) return '';

        var $subMenu = $('<div />', { "class": 'sub-menu' });
        // $upperMenu.append(`<div class="list-title">${current_category.name_ch}</div>`); // 子選單需要顯示類別時才使用
        var $newLink;
        current_category.childs.forEach((child) => {
            $newLink = $(`<a href="${child.href}" class="item">${child.name}</a>`);
            if (window.location.href.indexOf(child.href) > -1) $newLink.addClass("active");
            if (child.visible) {
                $newLink.addClass("hide");
                $newLink.attr("data-visible", child.visible);
            }
            $subMenu.append($newLink);
        });
        return $subMenu[0].outerHTML;
    }

    /** 會員中心 info + 百家樂錢包 */
    var buildInfoAndBaccarat = function () {
        var $personalInfoAndBaccarat =
            $(`<div class="personal-info-baccarat flex-row">
                <div class="login-info">
                    <div style="color:#c04d1e;">欢迎回来!</div>
                    <div>
                        <span>账户类型：</span>
                        <span data-field="accountType">加载中</span>
                    </div>
                    <div>
                        <span>上次登入时间：</span>
                        <span data-field="lastLoginTime">加载中</span>
                    </div>
                    <div>
                        <span>上次登入地点：</span>
                        <span data-field="country">加载中</span>
                    </div>
                    <div>
                        <span>注册时间：</span>
                        <span data-field="registTime">加载中</span>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="wallets flex-column">
                    <div class="balance flex-row">
                        <div class="title">帐户余额</div>
                        <span style="color:#ff0006">¥</span>
                        <div class="textAuto" data-global="lotteryBalance">加载中</div>
                        <a data-command="refresh"><img src="/member/images/left_panel_refresh.png"></a>
                    </div>
                    <div class="wallet-btns">
                        <a class="item hover" href="/member/funds-apply-recharge.html">充值</a>
                        <a class="item hover" href="/member/funds-apply-withdraw.html">取款</a>
                        <a class="item hover" href="/member/funds-transfer-wallet.html">转帐</a>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="wallet-info-row">
                    <div class="personal-wallets"></div>
                </div>

            </div>`);
        return $personalInfoAndBaccarat[0].outerHTML;
    }

    return globalSingleSharedTpl(`
        <div class="page-container">
            <div class="page-content">
                <div class="page-content-top">
                    ${buildPersonalInfo()}
                    ${buildMainMenu(param)}
                </div>
                <div class="page-content-bottom">
                    ${buildInfoAndBaccarat()}
                    ${(param && param.isSingle) ? '' : buildSubMenu()}
                    <div class="main-panel">
                        ${document.getElementById("member-slot").innerHTML}
                    </div>
                </div>
            </div>
        </div>
    `);
}

$(document).ready(function () {
    if (isLogin) {

        // 百家樂
        buildBaccaratList({
            targetDom: $('.header_list .item.baccarat .baccarat_content'),
            activeTpl: function (v) { return $(`<a class="item hover" data-id="${v.id}" data-href="link" target="_blank" href="#">${v.name}</a>`); },
            notActiveTpl: function (v) { return $(`<a class="item hover" data-id="${v.id}" data-name="${v.name}" data-result="open">${v.name}</a>`); },
            noGameTpl: function() { return $(`<a class="item hover">敬请期待</a>`) }
        });
        // 線路檢測
        linesBuilder({
            targetDom: $('.rightMenu .link.lines .side-container .side-lines-box'),
            itemTpl: function (v) {
                return `<div class="item">
                    <!--<div class="doughnut"></div>-->
                    <div class="speed">${v.ping}ms</div>
                    <a class="go_internet hover" href="${v.url}" target="_blank" title="${v.url}">访问</a>
                    <div class="urlText textAuto" title="${v.url}">${v.url}</div>
                </div>`;
            },
            repingDom: $('.rightMenu .link.lines .side-container .re-ping')
        });
        // App下載
        buildQRCodeList();

        /** header或彩票大廳的彈出式彩票選單 */
        (function lotteryHTML() {
            /** 取得彩票資料 */
            const categories = lotteryCategories();
            const game = buildLotteryList();

            var keyword = '';
            if (location.href.indexOf("play.html") > 0) {
                var keyword = location.href.split("?")[1] || 'cqssc';
            }

            /** 建立一種遊戲的連結 */
            var buildOneLink = function (item) {
                var $newItem = $(`<a class="item" href="/game/lottery/play.html?${item.keyword}">
                                ${item.name} <i class="icon ${item.status}"></i>
                            </a>`);
                if (item.keyword == keyword) {
                    $newItem.addClass("active");
                }
                return $newItem;
            }

            /** 建立一組遊戲清單 */
            var buildOneList = function (category, list) {
                let $newList = $(`<div class="lottery_category">
                <div class="category_name"><img src="/game/lottery/images/lottery_${category.id}.png" />${category.name}</div>
                <div class="list"></div>
            </div>`);

                list.forEach(item => {
                    $newList.find('.list').append(buildOneLink(item));
                });
                return $newList[0].outerHTML;
            }

            var html = '';
            for (let i = 0; i < categories.length; i++) {
                html += buildOneList(categories[i], game[i]);
            }

            $(".lottery_list .lottery_content").html(html);
        })();

        /** 首页金额下显示与隐藏 */
        (function moneySwitch() {
            function numSwitch() {
                if (localStorage.moneySwitch != 'hide') {
                    $(".moneyBox .money").removeClass("hide");
                    $(".moneyBox .money_hide").addClass("hide");
                    $(".money_switch").text("隐藏");
                } else {
                    $(".moneyBox .money").addClass("hide");
                    $(".moneyBox .money_hide").removeClass("hide");
                    $(".money_switch").text("显示");
                };
            }

            numSwitch();
            $(".money_switch").click(function () {

                if (localStorage.moneySwitch != 'hide') {
                    localStorage.moneySwitch = 'hide'
                } else {
                    localStorage.moneySwitch = 'show'
                };
                numSwitch();
            });
        })();

        /** 選單SubArea的子選單 */
        (function buildMenuSubArea() {
            /** Header SubArea(快速入口與會員中心)選單內容Item */
            var buildHeaderChildMenuList = function (list) {
                let result = '';
                list.forEach(x => {
                    var $newLink = $(`<a href="${x.childs[0].href}" class="sub_menu_item">${x.name_ch}</a>`);
                    var isActive = x.childs.some(child => window.location.href.indexOf(child.href) > -1);
                    if (isActive) {
                        $newLink.addClass("active");
                    }
                    if (x.visible) {
                        $newLink.addClass("hide");
                        $newLink.attr("data-visible", x.visible);
                    }
                    result += $newLink[0].outerHTML;
                });
                return result;
            };

            // 服務中心(快速入口)
            $('.header_list .item.help .sub_menu_area').html(buildHeaderChildMenuList(fast_menu_list));
            // 個人中心
            $('.header_list .item.member .sub_menu_area').html(buildHeaderChildMenuList(member_menu_list));
        })();

        /** 安全等級 */
        buildSafetyInfo({
            targetDom: $('.safety-info')
        });

        /** 登入位置 */
        buildPositionInfo({ targetDom: $('.personal-info-baccarat .safetyTest') });

        /** 左選單收展事件 */
        // $(".header_list .side-toggle").click(function () {
        //     $(this).parent().toggleClass("active");
        // });
    }
});