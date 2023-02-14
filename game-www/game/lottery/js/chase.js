var LotteryChase = function () {

    var callback = {}; // 回调函数

    // 加载投注期号
    var g_issue_list = [];
    var loadIssue = function (callback) {
        var data = {
            name: lottery_data.shortName
        };
        GameLotteryCtrl.request('STATIC_CHASE_TIME', {
            data: data,
            success: function (res) {
                g_issue_list = res;
                if (res.length > 0) {
                    callback && callback();
                }
            }
        });
    };

    /**
     * 计算利润率追号算法
     *
     * num 追号期数
     * startMultiple 开始倍数
     * maxMultiple 最大倍投
     * minProfit 最低利润率（百分比）
     * unitMoney 单倍金额
     * bonus 单倍奖金
     */
    var getProfitChase = function (num, startMultiple, maxMultiple, minProfit, money, bonus) {
        var result = []; // 结果
        var totalMoney = 0;
        var multiple = startMultiple;
        for (var i = 0; i < num; i++) {
            var thisMoney = 0;
            var thisBonus = 0;
            var thisProfit = 0;
            while (true) {
                thisMoney = money * multiple;
                thisBonus = bonus * multiple;
                var tempTotal = totalMoney + thisMoney;
                thisProfit = (thisBonus - tempTotal) / tempTotal;
                thisProfit = thisProfit * 100;
                if (thisProfit >= minProfit) break;
                if (multiple > maxMultiple) return result;
                multiple++;
            }
            totalMoney += thisMoney; // 累计投入
            result.push(multiple);
        }
        return result;
    };

    // 获取奖金
    var getBonus = function (data) {
        if (method_data && data.method) {
            if (method_data[data.method]) {
                var bonus = method_data[data.method].bonus;
                var unitMoney = config_data.unitMoney;
                var modelMoney = data.model.money;
                var code = data.code;
                var bonusArray = LotteryUtils.getBonus({
                    bonus: bonus,
                    unitMoney: unitMoney,
                    modelMoney: modelMoney,
                    code: code
                });
                if (bonusArray.length > 1) {
                    return 0;
                }
                return bonusArray[0];
            }
        }
    };

    // 初始化选项卡
    var initTab = function (content) {
        var thisItems = content.find('.tab > .item');
        thisItems.click(function () {
            var dataHref = $(this).attr('data-href');
            if ($(this).hasClass('active')) return;
            thisItems.removeClass('active');
            $(this).addClass('active');
            content.find('.content > .item').removeClass('active');
            content.find('.content > .item[data-name="' + dataHref + '"]').addClass('active');
        });
    };

    var initContent = function (content) {

        var headTable = content.find('table[data-table="head"]');
        var bodyTable = content.find('table[data-table="body"]');
        var total = content.find('.total');

        // 获取投注金额
        var getMultipleMoney = function (multiple) {
            var total = 0;
            for (var i = 0; i < order_list.length; i++) {
                var v = order_list[i];
                total += v.nums * multiple * config_data.unitMoney * v.model.money;
            }
            return NumberUtils.toFixed(total, 3);
        };

        // 获取总计金额
        var getTotalMoney = function () {
            var totalMultiple = 0;
            var planList = getPlanList();
            $.each(planList, function (i, v) {
                totalMultiple += v.multiple;
            });
            return getMultipleMoney(totalMultiple);
        };

        // 更新总计金额
        var updateTotal = function () {
            var planList = getPlanList();
            var totalCount = planList.length;
            var totalMoney = getTotalMoney();
            total.find('[data-field="count"]').html(totalCount);
            total.find('[data-field="money"]').html(totalMoney);
        };

        // 初始化head的事件
        var initHeadEvent = function () {
            headTable.find('thead > tr').each(function () {
                $(this).find('input[type="checkbox"]').change(function () {
                    var checked = $(this).is(':checked');
                    bodyTable.find('tbody > tr').each(function () {
                        var checkbox = $(this).find('input[type="checkbox"]');
                        if (checkbox.is(':checked') != checked) {
                            checkbox.trigger('click');
                        }
                    });
                });
            });
        };

        // 初始化body事件
        var initBodyEvent = function () {
            bodyTable.find('tbody > tr').each(function () {
                var thisRow = $(this);
                var checkbox = thisRow.find('input[type="checkbox"]');
                var multiple = thisRow.find('input[name="multiple"]');
                checkbox.change(function () {
                    var checked = $(this).is(':checked');
                    if (checked) {
                        multiple.val(1);
                        multiple.trigger('change');
                        multiple.removeAttr('disabled');
                    } else {
                        multiple.val(0);
                        multiple.trigger('change');
                        multiple.attr('disabled', true);
                    }
                });
                InputUtils.integerOnly(multiple, 1); // 最低1倍
                multiple.change(function () {
                    var finalMoney = getMultipleMoney(multiple.val());
                    thisRow.find('.amount').html(finalMoney);
                    updateTotal();
                });
            });
        };

        // 获得订单列表
        var getOrderList = function () {
            var orderList = [];
            $.each(order_list, function (i, v) {
                orderList.push({
                    lottery: v.lottery,
                    method: v.method,
                    content: v.content,
                    model: v.model.val,
                    nums: v.nums,
                    code: v.code,
                    compress: v.compress,
                    methodType:1,
                });
            });
            return orderList;
        };

        // 获得计划列表
        var getPlanList = function () {
            var planList = [];
            bodyTable.find('tbody > tr').each(function () {
                var thisRow = $(this);
                var issue = thisRow.find('.issue > span').html();
                var checked = thisRow.find('input[type="checkbox"]').is(':checked');
                var multiple = parseInt(thisRow.find('input[name="multiple"]').val());
                if (checked) {
                    planList.push({
                        issue: issue,
                        multiple: multiple
                    });
                }
            });
            return planList;
        };

        // 获取是否中奖停止追号
        var getWinStop = function () {
            return total.find('input[name="winStop"]').is(':checked');
        };

        // 初始化滚动条
        var initScroll = function () {
            var list = content.find('.result > .list');
            list.perfectScrollbar();
        };

        // 更新滚动条
        var updateScroll = function () {
            var list = content.find('.result > .list');
            list.scrollTop(0);
        };

        // 初始化默认列表
        var initDefaultList = function () {
            bodyTable.find('tbody').empty();
            for (var i = 0; i < 10; i++) {
                if (i > g_issue_list.length - 1) break;
                var v = g_issue_list[i];
                var tpl =
                    '<tr>\
                        <td class="id">' + (i + 1) + '</td>\
                        <td class="issue">\
                            <input type="checkbox"> <span>' + v.issue + '</span>\
                        </td>\
                        <td class="multiple">\
                            <input name="multiple" type="text" value="0" disabled="disabled"> 倍\
                        </td>\
                        <td class="amount">0</td>\
                        <td class="time">' + v.stopTime + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                bodyTable.find('tbody').append($thisRow);
            }
            initBodyEvent();
            updateTotal();
        };

        // 初始化普通追号
        var initNormal = function () {
            var thisItem = content.find('.content > .item[data-name="normal"]');
            var thisSettings = thisItem.find('.settings');
            // 表单
            var inputNum = thisSettings.find('input[name="num"]');
            var inputMultiple = thisSettings.find('input[name="multiple"]');
            InputUtils.integerOnly(inputNum, 1, 100); // 最低追1期，最高追100期
            InputUtils.integerOnly(inputMultiple, 1); // 最低1倍
            // 期号快速选择
            var quickIssueItems = thisSettings.find('.item-issue > .list > a');
            quickIssueItems.click(function () {
                quickIssueItems.removeClass('selected');
                $(this).addClass('selected');
                var thisVal = parseInt($(this).attr('data-val'));
                inputNum.val(thisVal);
            });
            // 生成追单按钮
            thisItem.find('[data-command="generate"]').click(function () {
                doGenerate();
            });
            // 生成方法
            var doGenerate = function () {
                var num = inputNum.val();
                var multiple = inputMultiple.val();
                var finalMoney = getMultipleMoney(multiple);
                bodyTable.find('tbody').empty();
                for (var i = 0; i < num; i++) {
                    if (i > g_issue_list.length - 1) break;
                    var v = g_issue_list[i];
                    var tpl =
                        '<tr>\
                            <td class="id">' + (i + 1) + '</td>\
                            <td class="issue">\
                                <input type="checkbox" checked="checked"> <span>' + v.issue + '</span>\
                            </td>\
                            <td class="multiple">\
                                <input name="multiple" type="text" value="' + multiple + '"> 倍\
                            </td>\
                            <td class="amount">' + finalMoney + '</td>\
                            <td class="time">' + v.stopTime + '</td>\
                        </tr>';
                    var $thisRow = $(tpl);
                    bodyTable.find('tbody').append($thisRow);
                }
                initBodyEvent();
                updateTotal();
                updateScroll();
            };
        };

        // 初始化翻倍追号
        var initMultiple = function () {
            var thisItem = content.find('.content > .item[data-name="multiple"]');
            var thisSettings = thisItem.find('.settings');
            // 表单
            var inputNum = thisSettings.find('input[name="num"]');
            var inputMultiple = thisSettings.find('input[name="multiple"]');
            var inputInterval = thisSettings.find('input[name="interval"]');
            var inputIncrease = thisSettings.find('input[name="increase"]');
            InputUtils.integerOnly(inputNum, 1, 100); // 最低追1期，最高追100期
            InputUtils.integerOnly(inputMultiple, 1); // 最低1倍
            InputUtils.integerOnly(inputInterval, 1); // 最低输入1
            InputUtils.integerOnly(inputIncrease, 2); // 最低输入2
            // 生成追单按钮
            thisItem.find('[data-command="generate"]').click(function () {
                doGenerate();
            });
            // 生成方法
            var doGenerate = function () {
                var num = inputNum.val();
                var multiple = inputMultiple.val();
                var interval = inputInterval.val();
                var increase = inputIncrease.val();
                bodyTable.find('tbody').empty();
                for (var i = 0; i < num; i++) {
                    if (i > g_issue_list.length - 1) break;
                    var v = g_issue_list[i];
                    var finalMultiple = i < interval ? multiple : multiple * Math.pow(increase, Math.floor(i / interval));
                    var finalMoney = getMultipleMoney(finalMultiple);
                    var tpl =
                        '<tr>\
                            <td class="id">' + (i + 1) + '</td>\
                            <td class="issue">\
                                <input type="checkbox" checked="checked"> <span>' + v.issue + '</span>\
                            </td>\
                            <td class="multiple">\
                                <input name="multiple" type="text" value="' + finalMultiple + '"> 倍\
                            </td>\
                            <td class="amount">' + finalMoney + '</td>\
                            <td class="time">' + v.stopTime + '</td>\
                        </tr>';
                    var $thisRow = $(tpl);
                    bodyTable.find('tbody').append($thisRow);
                }
                initBodyEvent();
                updateTotal();
                updateScroll();
            };
        };

        // 初始化高级追号
        var initAdvanced = function () {
            var thisItem = content.find('.content > .item[data-name="advanced"]');
            var thisSettings = thisItem.find('.settings');
            // 表单
            var inputNum = thisSettings.find('input[name="num"]');
            var inputStartMultiple = thisSettings.find('input[name="startMultiple"]');
            var inputMaxMultiple = thisSettings.find('input[name="maxMultiple"]');
            var inputMinProfit = thisSettings.find('input[name="minProfit"]');
            InputUtils.integerOnly(inputNum, 1, 100); // 最低追1期，最高追100期
            InputUtils.integerOnly(inputStartMultiple, 1); // 最低1倍
            InputUtils.integerOnly(inputMaxMultiple, 1); // 最低1倍
            InputUtils.integerOnly(inputMinProfit, 1, 1000); // 最低输入1，最高输入1000
            // 生成追单按钮
            thisItem.find('[data-command="generate"]').click(function () {
                doGenerate();
            });
            // 生成方法
            var doGenerate = function () {
                if (order_list.length > 1) {
                    AlertUtils.alert({
                        icon: 'info',
                        content: '多个订单不支持利润率追号'
                    });
                    return;
                }
                var num = inputNum.val();
                var startMultiple = inputStartMultiple.val();
                var maxMultiple = inputMaxMultiple.val();
                var minProfit = inputMinProfit.val();
                var money = getMultipleMoney(1);
                var bonus = getBonus(order_list[0]);
                if (bonus == 0) {
                    AlertUtils.alert({
                        icon: 'info',
                        content: '该玩法不支持利润率追号'
                    });
                    return;
                }
                var list = getProfitChase(num, startMultiple, maxMultiple, minProfit, money, bonus);
                bodyTable.find('tbody').empty();
                for (var i = 0; i < list.length; i++) {
                    if (i > g_issue_list.length - 1) break;
                    var v = g_issue_list[i];
                    var finalMultiple = list[i];
                    var finalMoney = getMultipleMoney(finalMultiple);
                    var tpl =
                        '<tr>\
                            <td class="id">' + (i + 1) + '</td>\
                            <td class="issue">\
                                <input type="checkbox" checked="checked"> <span>' + v.issue + '</span>\
                            </td>\
                            <td class="multiple">\
                                <input name="multiple" type="text" value="' + finalMultiple + '"> 倍\
                            </td>\
                            <td class="amount">' + finalMoney + '</td>\
                            <td class="time">' + v.stopTime + '</td>\
                        </tr>';
                    var $thisRow = $(tpl);
                    bodyTable.find('tbody').append($thisRow);
                }
                initBodyEvent();
                updateTotal();
                updateScroll();
            };
        };

        // 提交追单
        var submit = function () {
            var orderList = getOrderList();
            var planList = getPlanList();
            var winStop = getWinStop();
            var text = {
                orderList: orderList,
                planList: planList,
                winStop: winStop
            };
            var data = {text: $.toJSON(text)};
            GameLotteryCtrl.request('ADD_CHASE', {
                data: data,
                success: function (res) {
                    if (res.error == 0) {
                        LotteryRecord.clear(); // 清空投注列表
                        ModalBoxUtils.close();
                        AlertUtils.alert({
                            icon: 'success',
                            content: '您的追号订单已投注成功'
                        });
                        callback.submit && callback.submit();
                    }
                    if (res.error == 1) {
                        if (noAlertMsg(res)) {
                            AlertUtils.alert({
                                icon: 'error',
                                content: res.message
                            });
                        }
                    }
                }
            });
        };

        // 提交按钮
        total.find('[data-command="submit"]').click(function () {
            var orderList = getOrderList();
            if (orderList.length == 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '投注列表为空，请先添加投注内容'
                });
                return;
            }
            var planList = getPlanList();
            if (planList.length == 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '您没有勾选任何追号计划'
                });
                return;
            }
            var totalMoney = getTotalMoney();
            AlertUtils.confirm({
                icon: 'question',
                content: '本次追号共需要花费' + totalMoney + '元，确认继续投注？',
                confirmFn: function () {
                    submit();
                }
            });
        });

        initNormal();
        initMultiple();
        initAdvanced();
        initHeadEvent();

        // 默认初始化
        initDefaultList();
        initScroll();
    };

    // 初始化
    var init = function () {
        if (order_list.length == 0) {
            AlertUtils.alert({
                icon: 'info',
                content: '订单列表为空，请先添加号码'
            });
            return;
        }

        var tpl = $('#lottery-chase').html();
        var content = $(tpl);

        initTab(content);

        ModalBoxUtils.init({
            width: 800,
            title: '<i class="fa fa-tasks"></i> 设置追号 <span>（当前销售第<span data-field="global-issue">20160101-001</span>期，距离投注截止时间还有<span data-field="global-surplus-time2">00:00:55</span>）</span>',
            content: content
        });

        loadIssue(function () {
            initContent(content);
        });
    };

    // 添加回调函数
    var addCallback = function (opts) {
        if (opts.submit) {
            callback.submit = opts.submit;
        }
    };

    return {
        init: init,
        addCallback: addCallback
    }
}();

$(document).ready(function () {
    LotteryRecord.addCallback({
        chase: function () {
            LotteryChase.init();
        }
    });
});