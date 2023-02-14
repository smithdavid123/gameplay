var GameLoop = function () {
    var g_lottery; // 彩票游戏

    var loadData = function () {
        var url = AppRoute.PATH + AppRoute.WebAjax.PATH + AppRoute.WebAjax.LOOP_GAME_LOTTERY;
        var data = { lottery: g_lottery };
        HttpRequest({
            url: url,
            data: data,
            success: function (res) {
                // var res = {"error":0,"code":null,"message":"Yêu cầu thành công","data":{"lotteryBalance":0.005,"baccaratBalance":0.0,"totalBaccaratBalance":0.0,"msgCount":0,"gameOpenCode":{"id":6366768,"lottery":"qqmin","issue":"20200110-1134","code":"5,0,8,0,0","code1":null,"code2":null,"openTime":1578653641000,"clearStatus":1,"clearTime":1578653644000},"hasNewNotice":false}}
                if (res.error == 0) {
                    handleData(res.data);
                }
            }
        });
    };

    var handleData = function (data) {
        store.transact('PRIVATE:MsgCount', function (value) {
            value = data.msgCount;
        });
        store.transact('PRIVATE:GameLotteryAccount', function (value) {
            value.availableBalance = data.lotteryBalance + data.balanceDeposit;
        });
        updateLoopData();

        if (data.gameOpenCode) {
            LotteryOpenCode.refresh(data.gameOpenCode);
        }
        if (data.hasNewNotice) {
            LotteryOpenNotice.refresh();
        }
        setTimeout(loadData, 5000);
    };

    var init = function (lottery) {
        g_lottery = lottery;
        setTimeout(loadData, 5000);
    };

    return {
        init: init
    }

}();

var getLotteryType = function (v) {
    if (v.type == 1 || v.type == 2) return 'lottery-ssc';
    if (v.type == 3) return 'lottery-11x5';
    if (v.type == 4) return 'lottery-k3';
    if (v.type == 5) return 'lottery-kl8';
    if (v.type == 6) return 'lottery-pk10 ' + v.shortName;
    if (v.type == 7) return 'lottery-3d';
    if (v.type == 8) return 'lottery-lhc';
};

var lotteryName = location.search.substring(1);
if (!lotteryName) {
    lotteryName = 'cqssc';
}

var GameLotteryInfoList = store.get('PUBLIC:GameLotteryInfoList');
$.each(GameLotteryInfoList, function (i, v) {
    if (v.shortName == lotteryName) {
        // 初始化循环数据
        GameLoop.init(lotteryName);
        // 初始化开奖号码
        LotteryOpenCode.init(v);
        // 初始化开奖时间
        LotteryOpenTime.init(v);
        // 初始化彩种信息
        lottery_data.showName = v.showName;
        lottery_data.shortName = v.shortName;
        lottery_data.type = v.type;
        lottery_data.downCode = v.downCode;
        lottery_data.fenDownCode = v.fenDownCode;
        lottery_data.liDownCode = v.liDownCode;
        // 1.这里更新浮动奖金
        lottery_data.floatBonus = v.floatBonus;
        // 初始化页面信息
        $('body').addClass(getLotteryType(v));
        $('[data-field="global-name"]').html(v.showName);
        $('[data-command="trend"]').click(function () {
            window.open('trend.html?' + v.shortName);
        });
    }
});

var GameLotteryMethodList = store.get('PUBLIC:GameLotteryMethodList');
$.each(GameLotteryMethodList, function (i, v) {
    // if (v.type == lottery_data.type) { // 開發用 TODO
    if (v.lottery == lottery_data.shortName) {
        method_data[v.methodName] = v;
    }
});

var GameLotteryConfig = store.get('PUBLIC:GameLotteryConfig');
// console.log("GameLotteryConfig", GameLotteryConfig);
config_data.lotteryCode = GameLotteryConfig.sysCode;
config_data.lotteryPoint = GameLotteryConfig.sysPoint;
config_data.unitMoney = GameLotteryConfig.sysUnitMoney;

var GameLotteryAccount = store.get('PRIVATE:GameLotteryAccount');
account_data.lotteryCode = GameLotteryAccount.code;
account_data.lotteryPoint = GameLotteryAccount.point;

// 初始化游戏
LotteryPlay.init();

// 初始化菜单
$(document).ready(function () {
    var lotteryMenu = $('.lottery-menu');
    var lotteryList = lotteryMenu.find('.list');
    var lotteryItem = lotteryList.find('.item');
    var toggleMenu = $('[data-toggle="lottery-menu"]');
    var thisTimer; // 鼠标滑动定时器


    lotteryItem.click(function () {
        var dataName = $(this).attr('data-name');
        if (dataName) {
            window.location.href = 'play.html?' + dataName;
        }
    });
});

// 初始化皮肤
// $(document).ready(function () {
//     var lightControl = $('.skin');
//     var themeName = store.get('ThemeName');
//     if (themeName != 'forest') {
//          store.set('ThemeName', 'default');
//     } 
//     lightControl.click(function () {
//         var themeStyle = $('#theme-style');
//         var thisTheme = $(this).attr("data-name")    
//         var themeHref = 'themes/' + thisTheme + '/css/style.css';
//         if (themeStyle.length > 0) {
//             themeStyle.attr('href', themeHref);
//         } else {
//             $('head').append('<link rel="stylesheet" type="text/css" href="' + thisTheme + '" id="theme-style"/>');
//         }
//         store.set('ThemeName', thisTheme);
//     });
// });

// 初始化声音
$(document).ready(function () {
    var navStatus = 1;

    var lotteryMenu = $('.lottery-menu');
    var lotteryList = lotteryMenu.find('.list');
    var lotteryItem = lotteryList.find('.item');
    var toggleMenu = $('[data-field="global-name"]');
    var thisTimer; // 鼠标滑动定时器
    toggleMenu.hover(function () {
        if (thisTimer) {
            clearTimeout(thisTimer);
        }
        lotteryMenu.stop().show().animate({
            left: 0,
            opacity: 1
        }, 200);
    }, function () {
        thisTimer = setTimeout(function () {
            lotteryMenu.css({
                left: 10,
                opacity: 0
            }).hide();
        }, 300);
    });
    lotteryMenu.hover(function () {
        if (thisTimer) {
            clearTimeout(thisTimer);
        }
    }, function () {
        lotteryMenu.css({
            left: 0,
            opacity: 0
        }).hide();
    });
    lotteryItem.click(function () {
        var dataName = $(this).attr('data-name');
        if (dataName) {
            window.location.href = 'play.html?' + dataName;
        }
    });


    var audioOpenStatus = store.get('SysConfig:AudioOpenStatus');
    var audioTimeStatus = store.get('SysConfig:AudioTimeStatus');
    if (audioOpenStatus) {
        cookie_data.audioOpenStatus = audioOpenStatus;
    }
    if (audioTimeStatus) {
        cookie_data.audioTimeStatus = audioTimeStatus;
    }
    var soundBtn = $(' .sound');
    soundBtn.addClass(cookie_data.audioTimeStatus);
    soundBtn.click(function () {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $(this).addClass('off');
            cookie_data.audioOpenStatus = 'off';
            cookie_data.audioTimeStatus = 'off';
            store.set('SysConfig:AudioOpenStatus', 'off');
            store.set('SysConfig:AudioTimeStatus', 'off');
        } else if ($(this).hasClass('off')) {
            $(this).removeClass('off');
            $(this).addClass('on');
            cookie_data.audioOpenStatus = 'on';
            cookie_data.audioTimeStatus = 'on';
            store.set('SysConfig:AudioOpenStatus', 'on');
            store.set('SysConfig:AudioTimeStatus', 'on');
        }
    });
});
