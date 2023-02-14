$(document).ready(function () {
    var thisCode = 'jl8cQ4Wx'; // 活动编码

    /** 讀取可開獎次數 */
    (function loadConfig () {
        $.ajax({
            type: 'post',
            url: '/api/activity/get-turntable-config',
            data: {
                code: thisCode
            },
            dataType: 'json',
            success: function (res) {
                /*** 模拟数据 ***/
                // var res = {"error":0,"code":null,"message":"请求成功","data":{"hasReceived":false,"config":{"id":37,"code":"jl8cQ4Wx","uniqueCode":null,"title":"幸运大转盘","accountType":1,"activityType":8,"playerType":"player,agent,0001,0002,0003,0004","playerBan":null,"targetType":1,"cycleType":1,"drawType":1,"drawScope":1,"schedule":null,"rules":"{\"rechargeAmount\":200,\"randomRules\":[{\"amount\":88,\"probability\":0},{\"amount\":68,\"probability\":0.1},{\"amount\":58,\"probability\":0.2},{\"amount\":38,\"probability\":0.3},{\"amount\":28,\"probability\":0.4},{\"amount\":18,\"probability\":0.5},{\"amount\":8.8,\"probability\":30},{\"amount\":0,\"probability\":68.5}]}","maxMoney":0.0,"startTime":1489593600000,"endTime":1598889600000,"status":0},"hasCount":true}}
                if (res.error == 0) {
                    if (res.data.hasCount) {
                        if (!res.data.hasReceived) {
                            $('[data-field="count"]').html(1);
                            $('.bingo-box').removeClass('disable');
                        }
                    }
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
    })();

    /** 綁定事件 */
    (function(){
        // 關閉中獎彈窗
        $(".box .model_close").click(function(){
            $(".model_1 ").add('.model_2').hide();
        });

        // 點擊抽獎
        $(".drawBtn").click(function(){
            if (!canDraw()) return;
            window.index = $(this).index();
            doDraw();
        });
    })();

    /** 判斷是否可抽獎，若可抽則數字減1 */
    function canDraw () {
        var remainCount = $('[data-field="count"]').html();
        if (remainCount < 1) return false;
        $('[data-field="count"]').html(--remainCount);
        if (remainCount == 0) {
            $('.bingo-box').addClass('disable');
        }
        return true;
    }

    /** 執行抽獎 */
    function doDraw () {
        $.ajax({
            type: 'post',
            url: '/api/activity/do-draw-turntable',
            data: {
                code: thisCode
            },
            dataType: 'json',
            success: function (res) {
                // var res = {
                //     error:0,
                //     data:0
                // };

                if (res.error == 0) {
                    openProcess(res.data);
                }else if (res.error == 1) {
                    
                    AlertUtils.alert({
                        icon: 'error',
                        content: res.message
                    });

                }
            }
        });
    };

    /** 開獎流程 */
    function openProcess (num) {
        var num = num || 0;
        animation(num);
        prizeMess(num);
    }

    /** 展示動畫 */
    function animation(num){
        const target = $('.bingo-box .card:eq('+ window.index +')');
        // target.addClass('active').find(".back").html(`<div class="drawNum"><span>${num}</span>元</div>`);
        target.addClass("animated jello");
        setTimeout(() => {
            target.removeClass("jello").addClass("zoomOut");
        }, 1000);
    };

    /** 中獎彈窗 */
    function prizeMess(num){  
        setTimeout(() => {
            if(num){
                $(".model_1").find('.Jeprice').text(num)
                $(".model_1").fadeIn();
            }else{
                $(".model_2").fadeIn();
            };    
        }, 1000);
    };
});