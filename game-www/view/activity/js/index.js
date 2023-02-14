
$(document).ready(function () {
    /*** 是否显示活动 ***/
    function loadConfig() {
        const targetDom = $('.activity-list');
        $.ajax({
            type: 'post',
            url: '/api/activity/get-turntable-config',
            data: {
                code: 'jl8cQ4Wx'
            },
            dataType: 'json',
            success: function (res) {
                // var res= {}
                /*** 模拟数据 ***/
                // var res = {"error":0,"code":null,"message":"请求成功","data":{"hasReceived":false,"config":{"id":37,"code":"jl8cQ4Wx","uniqueCode":null,"title":"幸运大转盘","accountType":1,"activityType":8,"playerType":"player,agent,0001,0002,0003,0004","playerBan":null,"targetType":1,"cycleType":1,"drawType":1,"drawScope":1,"schedule":null,"rules":"{\"rechargeAmount\":200,\"randomRules\":[{\"amount\":88,\"probability\":0},{\"amount\":68,\"probability\":0.1},{\"amount\":58,\"probability\":0.2},{\"amount\":38,\"probability\":0.3},{\"amount\":28,\"probability\":0.4},{\"amount\":18,\"probability\":0.5},{\"amount\":8.8,\"probability\":30},{\"amount\":0,\"probability\":68.5}]}","maxMoney":0.0,"startTime":1489593600000,"endTime":1598889600000,"status":0},"hasCount":false}}
                if (res.error == 0) {
                    if (res.data&&res.data.config&&res.data.config.status==0) {
                        $(".activity_item").show();
                        targetDom.find('.item.activity').css("display", "flex");
                        targetDom.find('.item.none').css("display", "flex");
                        return;
                    }
                }else if (res.error == 1) {
                    if (noAlertMsg(res)) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: res.message
                        });
                    }
                };
                $(".none_activity").show();
                targetDom.find('.item.none').css("display", "flex");
            }
        });
    };

    loadConfig();
});