$(document).ready(function () {

    var thisPanel = $('.main-panel');

    var initChart = function (name, date, data) {
        var docChart = thisPanel.find('.chart > .instance')[0];
        var thisChart = echarts.init(docChart, 'macarons');
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: false
            },
            calculable: false,
            grid: {x: 80, y: 30, x2: 80, y2: 50},
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: date
            }],
            yAxis: [{
                type: 'value',
                boundaryGap: [0, 0.1]
            }],
            series: [{
                name: name,
                type: 'line',
                data: data,
                markLine: {
                    data: [{
                        type: 'average',
                        name: '平均值'
                    }]
                }
            }]
        };
        thisChart.setOption(option);
    };

    var thisData;
    var doLoadData = function (data) {
        AgentCtrl.request('TEAM_OVERVIEW', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    thisData = res.data;
                    buildData();
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

    var formatSumValue = function (list) {
        var totalValue = 0;
        for (var i = 0; i < list.length; i++) {
            totalValue += list[i];
        }
        if (totalValue >= 100 * 10000) {
            return (totalValue / 10000).toFixed(0) + 'w';
        }
        if (totalValue >= 10000) {
            return (totalValue / 10000).toFixed(2) + 'w';
        }
        return totalValue.toFixed(2);
    };

    var buildData = function (data) {
        thisPanel.find('[data-field="totalUser"]').html(thisData.totalAccount);
        thisPanel.find('[data-field="totalAgent"]').html(thisData.totalAgent);
        thisPanel.find('[data-field="totalPlayer"]').html(thisData.totalPlayer);
        thisPanel.find('[data-field="totalOnline"]').html(thisData.totalOnline);
        thisPanel.find('[data-field="totalBalance"]').html(thisData.totalBalance.toFixed(3));
        thisPanel.find('[data-field="lotteryBalance"]').html(thisData.lotteryBalance.toFixed(3));
        thisPanel.find('[data-field="baccaratBalance"]').html(thisData.baccaratBalance.toFixed(3));

        thisPanel.find('[data-field="uRechargeChart"]').html(formatSumValue(thisData.uRechargeChart.yAxis[0]));
        thisPanel.find('[data-field="uWithdrawChart"]').html(formatSumValue(thisData.uWithdrawChart.yAxis[0]));
        thisPanel.find('[data-field="uConsumeChart"]').html(formatSumValue(thisData.uConsumeChart.yAxis[0]));
        thisPanel.find('[data-field="uBonusChart"]').html(formatSumValue(thisData.uBonusChart.yAxis[0]));
        thisPanel.find('[data-field="uRebateChart"]').html(formatSumValue(thisData.uRebateChart.yAxis[0]));
        thisPanel.find('[data-field="uActivityChart"]').html(formatSumValue(thisData.uActivityChart.yAxis[0]));
        thisPanel.find('[data-field="uRegistChart"]').html(formatSumValue(thisData.uRegistChart.yAxis[0]));

        thisPanel.find('input[name="stat"]').eq(0).trigger('click');
    };

    var initEvent = function () {
        var p = thisPanel.find('.search-params');
        p.find('.days > .btn').click(function () {
            var className = "clicked";
            p.find('.days > .btn').removeClass(className);
            $(this).addClass(className);
            var thisVal = $(this).attr('data-val');
            var sDate = p.find('input[name="sDate"]');
            var eDate = p.find('input[name="eDate"]');
            if (thisVal == 'last3d') {
                sDate.val(moment().add(1, 'days').subtract(3, 'days').format('YYYY-MM-DD'));
                eDate.val(moment().add(1, 'days').format('YYYY-MM-DD'));
            }
            if (thisVal == 'last7d') {
                sDate.val(moment().add(1, 'days').subtract(7, 'days').format('YYYY-MM-DD'));
                eDate.val(moment().add(1, 'days').format('YYYY-MM-DD'));
            }
            if (thisVal == 'last1m') {
                sDate.val(moment().add(1, 'days').subtract(1, 'months').format('YYYY-MM-DD'));
                eDate.val(moment().add(1, 'days').format('YYYY-MM-DD'));
            }
        });
        p.find('.days > .btn').eq(0).trigger('click');

        thisPanel.find('input[name="stat"]').click(function () {
            var thisVal = $(this).val();
            if (thisVal == 'uRechargeChart') {
                initChart('充值', thisData.uRechargeChart.xAxis, thisData.uRechargeChart.yAxis[0]);
            }
            if (thisVal == 'uWithdrawChart') {
                initChart('取款', thisData.uWithdrawChart.xAxis, thisData.uWithdrawChart.yAxis[0]);
            }
            if (thisVal == 'uConsumeChart') {
                initChart('消费', thisData.uConsumeChart.xAxis, thisData.uConsumeChart.yAxis[0]);
            }
            if (thisVal == 'uBonusChart') {
                initChart('派奖', thisData.uBonusChart.xAxis, thisData.uBonusChart.yAxis[0]);
            }
            if (thisVal == 'uRebateChart') {
                initChart('返点', thisData.uRebateChart.xAxis, thisData.uRebateChart.yAxis[0]);
            }
            if (thisVal == 'uActivityChart') {
                initChart('活动', thisData.uActivityChart.xAxis, thisData.uActivityChart.yAxis[0]);
            }
            if (thisVal == 'uRegistChart') {
                initChart('注册', thisData.uRegistChart.xAxis, thisData.uRegistChart.yAxis[0]);
            }
        });

        p.find('[data-command="search"]').click(function () {
            var sDate = p.find('input[name="sDate"]').val();
            var eDate = p.find('input[name="eDate"]').val();
            var data = {sTime: sDate, eTime: eDate};
            doLoadData(data);
        }).trigger('click');

        initDatePicker(p);
    };

    // 初始化
    initEvent();

});