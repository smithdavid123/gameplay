// 彩票开奖时间
var LotteryOpenTime = function () {
    var g_lottery; // 彩票游戏
    var g_timer; // 定时器
    // 获取数据
    var loadData = function (init) {
        var data = { name: g_lottery.shortName };
        GameLotteryCtrl.request('STATIC_OPEN_TIME', {
            data: data,
            success: function (res) {
                res && handleData(res);
            }
        });
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
        if (cookie_data.audioTimeStatus == 'on') {
            var els = $('audio#time');
            if (els.length == 0) {
                var audio = $('<audio id="time" autoplay="autoplay">');
                audio.attr('src', 'audio/time.mp3');
                $('body').append(audio);
                setTimeout(function () {
                    audio.remove();
                }, 6000);
            }
        }
    };
    // 设置时间
    var setTime = function (issue, seconds) {
        var time = formatTime(seconds);
        $('[data-field="global-issue"]').html(issue);
        $('[data-field="global-surplus-time1"] .hh span').html(String(time[0]));
        $('[data-field="global-surplus-time1"] .mm span').html(String(time[1]));
        $('[data-field="global-surplus-time1"] .ss span').html(String(time[2]));
        $('[data-field="global-surplus-time2"]').html(time[0] + ':' + time[1] + ':' + time[2]);
        if (seconds > 0 && seconds <= 6) {
            audio();
        }
        if (seconds <= 0) {
            clearTimeout(g_timer);
            AlertUtils.confirm({
                time: 3000,
                icon: 'question',
                content: '第 ' + issue + ' 期已过销售期，确认要清除投注列表吗？',
                confirmFn: function (index) {
                    layer.close(index);
                    LotteryRecord.clear();
                }
            });
            setTimeout(loadData, 1000);
        }
    };
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
        $('.lottery-open-info > .loading').remove();
    };
    // 初始化
    var init = function (lottery) {
        g_lottery = lottery;
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

// 彩票开奖号码
var LotteryOpenCode = function () {
    var g_lottery; // 彩票游戏
    var g_lastIssue; // 上一期的开奖号码
    var loadData = function () {
        var data = { name: g_lottery.shortName, history: true };
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
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化11选5号码
    var formatX511 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
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
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化3D号码
    var formatD3 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化快乐8号码
    var formatKl8 = function (code) {
        var array = code.split(',');
        var result = $('<div class="list clear">');
        for (var i = 0; i < array.length; i++) {
            result.append('<div class="ball">' + array[i] + '</div>');
        };
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
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
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化飞艇
    var formatFT = function (code) {
        var array = code.split(',');
        var result = $('<div class="list">');
        for (var i = 0; i < array.length; i++) {
            result.append(`<div class="airship NO${array[i]}">${array[i]}</div>`);
        }
        // result.append(`<img id="redux" src="./images/scratch.png" alt="">`);
        return result;
    };
    // 格式化六合彩
    var formatLHC = function (code) {
        var shengxiao = localStorage['PRIVATE:shengxiao']&&JSON.parse(localStorage['PRIVATE:shengxiao']);
        var Rgb = {
            '红':'01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46',
            '绿':'05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49',
            '蓝':'03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48',
        };
        var array = code.split(',');
        var result = $('<div class="list">');
        //返回生肖
        var sxName = function (str){
            for (j in shengxiao){
                var bool = shengxiao[j].indexOf(str);
                if( bool>=0 ){
                    return j
                };
            };
        };
        //返回红、绿、蓝球
        var ballColor = function (str){
            for (z in Rgb){
                var bool = Rgb[z].indexOf(str);
                if( bool>=0 ){
                    if( z==='红' ){
                        return 'red';
                    }else if( z==='绿' ){
                        return 'green';
                    }else if( z==='蓝' ){
                        return 'blue';
                    }
                };
            };
        };

        for (var i = 0; i < array.length; i++) {

            var text = sxName(array[i]);
            var cls = ballColor(array[i]);
 
            result.append(`<div class="ball"> <div class='n ${cls}'>${array[i]}</div><div class='sx'>${text}</div> </div>`);
        }
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
        if (g_lottery.type == 5) {
            $element.find('.code').html(formatKl8(data.code));
        }
        if (g_lottery.type == 6) {
            if (data.lottery == "t6s300") {
                $element.find('.code').html(formatFT(data.code));
            } else {
                $element.find('.code').html(formatPK10(data.code));
            };
        }
        if (g_lottery.type == 4) {
            $element.find('.code').html(formatD3(data.code));
        }
        if (g_lottery.type == 8) {
            $element.find('.code').html(formatLHC(data.code));
        }

        $element.find('.loading').remove();
        // scratch();
    };
    //生肖球号
    var initShengXiaoBall = function(){
        var shengxiao = localStorage['PRIVATE:shengxiao']&&JSON.parse(localStorage['PRIVATE:shengxiao']);
        var Rgb = {
            '红':'01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46',
            '绿':'05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49',
            '蓝':'03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48',
        };
        //返回生肖
        var sxName = function (str){
            for (j in shengxiao){
                var bool = shengxiao[j].indexOf(str);
                if( bool>=0 ){
                    return j
                };
            };
        };
        //返回红、绿、蓝球
        var ballColor = function (str){
            for (z in Rgb){
                var bool = Rgb[z].indexOf(str);
                if( bool>=0 ){
                    if( z==='红' ){
                        return 'red';
                    }else if( z==='绿' ){
                        return 'green';
                    }else if( z==='蓝' ){
                        return 'blue';
                    }
                };
            };
        };
        var init = function(str){
            var text = sxName(str);
            var cls = ballColor(str);
            return {
                text:text,
                cls:cls
            }
        }
        return {
            init: init
        }
    }();
    var buildList = function (data) {
        var $element = $('.lottery-open-list');
        $element.find('.list').empty();
        $.each(data, function (i, v) {
            if (g_lottery.type == 8){
                var text = initShengXiaoBall.init(v).text
                var cls = initShengXiaoBall.init(v).cls

                var ballTmp = '';
                var code = v.code.split(',');
                $.each(code,(i2,v2)=>{
                    var text = initShengXiaoBall.init(v2).text;
                    var cls = initShengXiaoBall.init(v2).cls;
                    ballTmp += `<div class="ball lf">
                                    <div class='n ${cls}'>${v2}</div>
                                    <div class='sx'>${text}</div>
                                </div>`
                }); 
                var tmp =   
                    `<div class="item">
                        <div class="issue">${v.issue}</div>
                        <div class="code">${ballTmp}</div>
                    </div>`;
                var $thisRow = $(tmp);   
            }else{
                var tmp =
                    '<div class="item">\
                        <div class="issue">' + v.issue + '</div>\
                        <div class="code">' + v.code + '</div>\
                    </div>';
                var $thisRow = $(tmp);                
            }
            let tmpHtml = '';
            // 每5個數字換行
            const codeArr = v.code.split(',');
            const seqArr = [];
            for (let i = 0; i < codeArr.length; i+=10) {
                seqArr.push(codeArr.slice(i, i+10));
            }
            seqArr.forEach(function(seq) {
                if (tmpHtml.length > 0) tmpHtml += '<br />';
                tmpHtml += seq.join(',');
            });
            $thisRow.find('.code').html(tmpHtml);
            // 舊方法
            // if (g_lottery.type == 5) {
            //     $thisRow.find('.code').html(v.code.substr(0, 29) + '<br/>' + v.code.substr(30));
            // }
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

/*彩票开奖提示*/
var LotteryOpenNotice = function () {
    var thisPanel = $('.lottery-notice');

    var loadData = function () {
        GameLotteryCtrl.request('PULL_OPEN_NOTICE', {
            success: function (res) {
                if (res.error == 0) {
                    show(res.data);
                }
            }
        });
    };
    var clearData = function () {
        GameLotteryCtrl.request('CLEAR_OPEN_NOTICE', {});
    };
    var g_timer;
    var show = function (data) {
        let openLottery = searchLottery({ name: data.lottery });
        if (openLottery) {
            thisPanel.find('.current-open-name > img').attr('src', `./images/${openLottery.keyword}.png`);
        }
        thisPanel.find('.name').html(data.lottery);
        thisPanel.find('[data-field="issue"]').html(data.issue);
        thisPanel.find('[data-field="money"]').html(data.money.toFixed(3));
        thisPanel.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
        thisPanel.find('[data-field="profit"]').html(data.profit.toFixed(3));
        thisPanel.find('.msg-auto').show();
        thisPanel.find('.msg-tips').hide();
        thisPanel.show().animateCss('fadeIn');
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
        // 新增以下兩行
        RecordOrderSM.reload();
        RecordChaseSM.reload();
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