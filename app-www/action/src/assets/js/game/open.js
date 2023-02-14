import $ from 'jquery'
import {staticOpenTime} from '@/api/login'
// 彩票开奖时间
export let LotteryOpenTime = function () {
    var g_lottery; // 彩票游戏
    var g_timer; // 定时器
    let openTime = {};
    // 获取数据
    var loadData = function (init) {
        var data = {name: g_lottery.shortName};
        // ajax请求，暂时屏蔽
        // 模拟返回结果
       // let res = {"openTime": "2023-03-21 11:30:00", "stopTime": "2023-03-21 11:30:00", "issue": "20190321-022", "surplusTime": 493, "startTime": "2023-03-21 11:10:00"}
      staticOpenTime(data).then(res=>{
        res && handleData(res);
      })
        // GameLotteryCtrl.request('STATIC_OPEN_TIME', {
        //     data: data,
        //     success: function (res) {
          //      res && handleData(res);
        //     }
        // });
    };
    // 格式化时间
    var formatTime = function (seconds) {
        var s = 1, m = 60 * s, h = m * 60;
        var ss = 0, mm = 0, hh = 0;
        if (s > 0) {
            hh = Math.floor(seconds / h);
            mm = Math.floor(seconds % h / m);
            ss = Math.floor(seconds % h % m / s);
        }
        var p = function (t) {
            return t < 10 ? '0' + t : t;
        };
        return [p(hh), p(mm), p(ss)];
    };
    // 播放声音
    var audio = function () {
        // console.log(cookie_data.audioTimeStatus);
        // if (cookie_data.audioTimeStatus == 'on') {
        //     var els = $('audio#time');
        //     if (els.length == 0) {
        //         var audio = $('<audio id="time" autoplay="autoplay">');
        //         audio.attr('src', 'audio/time.mp3');
        //         $('body').append(audio);
        //         setTimeout(function () {
        //             audio.remove();
        //         }, 6000);
        //     }
        // }
    };
    // 设置时间
    var setTime = function (issue, seconds) {
        var time = formatTime(seconds);
        // $('[data-field="global-issue"]').html(issue);
        // $('[data-field="global-surplus-time1"]   .hh').html(String(time[0]));
        // $('[data-field="global-surplus-time1"]   .mm').html(String(time[1]));
        // $('[data-field="global-surplus-time1"]   .ss').html(String(time[2]));
        // $('[data-field="global-surplus-time2"]').html(time[0] + ':' + time[1] + ':' + time[2]);

        openTime.issue = issue;
        openTime.hh = String(time[0]);
        openTime.mm = String(time[1]);
        openTime.ss = String(time[2]);

        if (seconds > 0 && seconds <= 6) {
            audio();
        }
        if (seconds <= 0) {
            clearTimeout(g_timer);
            // 弹框，UI组件，暂无
            // AlertUtils.confirm({
            //     time: 3000,
            //     icon: 'question',
            //     content: '第 ' + issue + ' 期已过销售期，确认要清除投注列表吗？',
            //     confirmFn: function (index) {
            //         layer.close(index);
            //         LotteryRecord.clear();
            //     }
            // });
            setTimeout(loadData, 1000);
        }
    };

    function moment () {
        return new Date();
    }
    // 处理数据
    var handleData = function (data) {
        if (g_timer) {
            clearTimeout(g_timer);
        }
        var issue = data.issue;
        var surplusTime = data.surplusTime;
        if (surplusTime < 0) {
            setTimeout(loadData, 1000);
        }
        var newSec = function () {
            return parseInt(moment().valueOf() / 1000);
        };
        var gOpenTime = newSec() + surplusTime;
        var calcSec = function () {
            return gOpenTime - newSec();
        };
        setTime(issue, calcSec());
        g_timer = setInterval(function () {
            setTime(issue, calcSec());
        }, 1000);
        // $('.lottery-open-info > .loading').remove();
    };
    // 初始化
    var init = function (lottery, _openTime) {
        g_lottery = lottery;
        openTime = _openTime;
        loadData(true);
    };
    // 重新加载
    var reload = function () {
        loadData(false);
    };
    return {
        init: init,
        reload: reload
    }
}();

/*
// 彩票开奖号码
var LotteryOpenCode = function () {
    var g_lottery; // 彩票游戏
    var g_lastIssue; // 上一期的开奖号码
    var loadData = function () {
        var data = {name: g_lottery.shortName, history: true};
        GameLotteryCtrl.request('STATIC_OPEN_CODE', {
            data: data,
            success: function (res) {
                res && handleData(res);
            }
        });
    };
    var handleData = function (data) {
        if ($.isArray(data)) {
            buildCode(data[0]);
            buildList(data);
        } else {
            buildCode(data);
        }
    };
    // 格式化时时彩号码
    var formatSsc = function (code) {
        // 处理快乐彩超出的数字部分
        code = code.substr(0, 9);
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化11选5号码
    var formatX511 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化快3号码
    var formatK3 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            var car = $('<div class="dice"></div>');
            car.addClass('NO' + array[i]);
            result.append(car);
        };
        result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化3D号码
    var formatD3 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化快乐8号码
    var formatKl8 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化PK拾号码
    var formatPK10 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            var car = $('<div class="car"></div>');
            car.addClass('NO' + array[i]);
            result.append(car);
        };
        result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 播放声音
    var audio = function () {
        if (cookie_data.audioOpenStatus == 'on') {
            var els = $('audio#open');
            if (els.length == 0) {
                var audio = $('<audio id="open" autoplay="autoplay">');
                audio.attr('src', 'audio/open.mp3');
                $('body').append(audio);
                setTimeout(function () {
                    audio.remove();
                }, 3000);
            }
        }
    };
    var buildCode = function (data) {
        // 如果不是第一次获取数据
        if (g_lastIssue) {
            audio();
        }
        g_lastIssue = data.issue; // 储存到缓冲区
        var $element = $('.lottery-open-code');
        $element.find('.issue > span').html(data.issue);
        if (g_lottery.type == 1) {
            $element.find('.code').html(formatSsc(data.code));
        }
        if (g_lottery.type == 2) {
            $element.find('.code').html(formatX511(data.code));
        }
        if (g_lottery.type == 3) {
            $element.find('.code').html(formatK3(data.code));
        }
        if (g_lottery.type == 4) {
            $element.find('.code').html(formatD3(data.code));
        }
        if (g_lottery.type == 5) {
            $element.find('.code').html(formatKl8(data.code));
        }
        if (g_lottery.type == 6) {
            $element.find('.code').html(formatPK10(data.code));
        }
        $element.find('.loading').remove();
        scratch();
    };

    //开奖号码--刮奖初始化
    var scratch = function(){
        $('#redux').eraser( {
			size: 20,   //设置橡皮擦大小
			completeRatio: .6, //设置擦除面积比例
			//completeFunction: showResetButton   //大于擦除面积比例触发函数
        });
        if(localStorage.scratch=='open'){
            $('#redux').eraser('reset');
        }else{
            $('#redux').eraser('clear')
        };

    };

    //刮奖功能开关--css效果
    var scratchSwitch = function(){
        var str = localStorage.scratch;
        if( str=='open' ){
            $('[data-name="scratch"]').addClass('active');
        }else{
            $('[data-name="scratch"]').removeClass('active');
        };
    }

    //刮奖功能开关--切换
    $('[data-name="scratch"]').click(function(){
        if(localStorage.scratch=='open'){
            localStorage.scratch = 'close';
        }else{
            localStorage.scratch = 'open';
        };
        scratchSwitch();
        scratch();
    });

    scratchSwitch();



    var buildList = function (data) {
        var $element = $('.lottery-open-list');
        $element.find('.list').empty();
        $.each(data, function (i, v) {
            var tmp =
                '<div class="item">\
                    <div class="issue">' + v.issue + '</div>\
                    <div class="code">' + v.code + '</div>\
                </div>';
            var $thisRow = $(tmp);
            if (g_lottery.type == 5) {
                $thisRow.find('.code').html(v.code.substr(0, 29) + '<br/>' + v.code.substr(30));
            }
            $element.find('.list').append($thisRow);
        });
        $element.find('.loading').remove();
    };
    var init = function (lottery) {
        g_lottery = lottery;
        loadData();
    };
    var refresh = function (data) {
        if (data.issue != g_lastIssue) {
            loadData();
        }
    };
    return {
        init: init,
        refresh: refresh
    }
}();
*/

/*彩票开奖提示*/
var LotteryOpenNotice = function () {
    var thisPanel = $('.lottery-notice');

    var loadData = function () {
        GameLotteryCtrl.request('PULL_OPEN_NOTICE', {
            success: function (res) {
                if (res.error == 0) {
                    if (res.data) show(res.data);
                }
            }
        });
    };
    var clearData = function () {
        GameLotteryCtrl.request('CLEAR_OPEN_NOTICE', {});
    };
    var g_timer;
    var show = function (data) {
        thisPanel.find('.name').html(data.lottery);
        thisPanel.find('[data-field="issue"]').html(data.issue);
        thisPanel.find('[data-field="money"]').html(data.money.toFixed(3));
        thisPanel.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
        thisPanel.find('[data-field="profit"]').html(data.profit.toFixed(3));
        thisPanel.find('.msg-auto').show();
        thisPanel.find('.msg-tips').hide();
        thisPanel.show().animateCss('bounceInDown');
        var count = 5; // 自动关闭
        g_timer = setInterval(function () {
            count--;
            thisPanel.find('[data-field="count"]').html(count);
            if (count <= 0) {
                hide();
            }
        }, 1000);
        RecordOrder.reload();
        RecordChase.reload();
    };
    var hide = function () {
        clearInterval(g_timer);
        thisPanel.hide();
    };
    var refresh = function () {
        if (thisPanel.is(':hidden')) {
            loadData();
        }
    };
    thisPanel.find('[data-command="close"]').click(function () {
        hide();
    });
    thisPanel.find('[data-command="wait"]').click(function () {
        thisPanel.find('.msg-auto').hide();
        thisPanel.find('.msg-tips').show();
        clearInterval(g_timer);
    });
    thisPanel.find('[data-command="clear"]').click(function () {
        hide();
        clearData();
    });
    return {
        show: show,
        refresh: refresh
    }
}();
