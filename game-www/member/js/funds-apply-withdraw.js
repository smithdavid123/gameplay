$(document).ready(function () {
    
        var thisPanel = $('.main-panel');

        // 全部提款功能 btn
        $('.withdraw-all').click(function(e){
            e.preventDefault();
            let availableBalance = Number($('[data-field="availableBalance"]').eq(0).text());
            let maxUnitAmount = Number($('[data-field="maxUnitAmount"]').text());
            let allWithdrawAmount = function(){
                if( availableBalance > maxUnitAmount ) return maxUnitAmount;
                return availableBalance;
            };
            $('input[name="amount"]').val(allWithdrawAmount());
        });
    
        var doPrepareWithdraw = function () {
            AccountCtrl.request('PREPARE_WITHDRAW', {
                beforeSend: function () {
                    thisPanel.ajaxLoading(true);
                },
                success: function (res) {
                    if (res.error == 0) {
                        buildWithdraw(res.data);
                    }
                    if (res.error == 1) {
                        if (noAlertMsg(res)) {
                            AlertUtils.alert({
                                icon: 'error',
                                content: res.message
                            });
                        }
                    }
                },
                complete: function () {
                    thisPanel.ajaxLoading(false);
                }
            });
        };
    
        // 构建提现
        var buildWithdraw = function (data) {
            var stepMsg = thisPanel.find('.step-msg');
            var thisContent = thisPanel.find('.panel-content');
    
            if (data.withdrawConfig.isOpen == false) {
                var msgText = data.withdrawConfig.serviceMsg;
                if (!msgText) {
                    msgText = '服务器提现服务已关闭';
                }
                stepMsg.html(msgText);
                stepMsg.show();
                return;
            }
    
            if (data.myAccountStatus.hasWithdarwPwd == false) {
                stepMsg.html('您还没有设置提现密码，立即设置请<a href="member-home.html">点击此处</a>');
                stepMsg.show();
                return;
            }
    
            if (data.accountCardList.length == 0) {
                stepMsg.html('您还没有绑定银行卡，立即绑定请<a href="member-card.html">点击此处</a>');
                stepMsg.show();
                return;
            }
    
            buildForm(data);
            buildTable(data);
            buildCardList(data);
            buildRemitMerchant(data);
    
            thisContent.show();
        };
    
        // 构建表单
        var buildForm = function (data, init) {
            var form = thisPanel.find('form');
    
            form.find('[data-field="availableBalance"]').html(data.myAccountStatus.availableBalance.toFixed(2));
            form.find('[data-field="minUnitAmount"]').html(data.withdrawConfig.minUnitAmount);
            form.find('[data-field="maxUnitAmount"]').html(data.withdrawConfig.maxUnitAmount);
    
            if (data.myAccountStatus.dailyCount >= data.withdrawConfig.freeDailyCount) {
                form.find('[data-init="noFreeCount"]').show();
            } else {
                form.find('[data-init="noFreeCount"]').hide();
            }
    
            if (!form.attr('data-init')) {
                var feeRate = data.withdrawConfig.feeRate;
                var maxFee = data.withdrawConfig.maxFee;
                form.find('input[name="amount"]').change(function () {
                    var amount = Number($(this).val());
                    if (isNaN(amount)) {
                        form.find('[data-field="feeAmount"]').html(0);
                    } else {
                        var feeAmount = amount * feeRate;
                        if (feeAmount > maxFee) {
                            feeAmount = maxFee;
                        }
                        form.find('[data-field="feeAmount"]').html(feeAmount.toFixed(2));
                    }
                });
    
                thisPanel.find('[data-command="apply"]').click(function () {
                    var amount = Number(form.find('input[name="amount"]').val());
                    var cardId = form.find('.select-card > .item.selected').attr('data-id');
                    var withdrawPassword = form.find('input[name="withdrawPassword"]').val();
                    if (isNaN(amount)) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '请输入正确的提现金额！'
                        });
                        return;
                    }
                    if (amount <= 0) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '提现金额必须大于0元！'
                        });
                        return;
                    }
                    if (!withdrawPassword) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '请输入您的资金密码！'
                        });
                        return;
                    }
                    var data = {
                        amount: amount,
                        cardId: cardId,
                        withdrawPassword: withdrawPassword
                    };
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '本次提现金额为' + amount + '，是否继续提现？',
                        confirmFn: function() {
                            doApplyWithdraw(data);
                        }
                    });
                });
            }
        };
    
        // 构建表格
        var buildTable = function (data) {
            var thisTable = thisPanel.find('table');
    
            thisTable.find('[data-field="totalBalance"]').html(data.myAccountStatus.totalBalance.toFixed(2));
            thisTable.find('[data-field="availableBalance"]').html(data.myAccountStatus.availableBalance.toFixed(2));
    
            thisTable.find('[data-field="serviceTime"]').html(data.withdrawConfig.serviceTime);
            thisTable.find('[data-field="freeDailyCount"]').html(data.withdrawConfig.freeDailyCount);
    
            thisTable.find('[data-field="maxDailyAmount"]').html(data.withdrawConfig.maxDailyAmount);
            thisTable.find('[data-field="maxDailyCount"]').html(data.withdrawConfig.maxDailyCount);
    
            thisTable.find('[data-field="lotteryLimitAmount"]').html(data.myAccountStatus.lotteryLimitAmount.toFixed(2));
            thisTable.find('[data-field="baccaratLimitAmount"]').html(data.myAccountStatus.baccaratLimitAmount.toFixed(2));
            thisTable.find('[data-field="dailyAmount"]').html(data.myAccountStatus.dailyAmount);
            thisTable.find('[data-field="dailyCount"]').html(data.myAccountStatus.dailyCount);
    
            thisTable.find('[data-field="feeRate"]').html(data.withdrawConfig.feeRate * 100);
            thisTable.find('[data-field="maxFee"]').html(data.withdrawConfig.maxFee);
        };
    
        // 绑定卡片列表
        var buildCardList = function (data) {
            var form = thisPanel.find('form');
            var selectCard = form.find('.select-card');
            selectCard.empty();
            $.each(data.accountCardList, function (i, v) {
                var tpl =
                    '<div class="item">\
                        <div class="bank-code b' + v.bankId + '"></div>\
                        <div class="card-info">' + v.bankCardName + '&emsp;' + v.bankCardId + '</div>\
                    </div>';
                var $thisRow = $(tpl);
                $thisRow.attr('data-id', v.id);
                if (v.isDefault) {
                    $thisRow.addClass('selected');
                    $thisRow.append('<i class="icon-check"></i>');
                }
                $thisRow.click(function () {
                    selectCard.find('.item').removeClass('selected');
                    selectCard.find('.item > i').remove();
                    $thisRow.addClass('selected');
                    $thisRow.append('<i class="icon-check"></i>');
                });
                selectCard.append($thisRow);
            });
            if (selectCard.find('.item.selected').length == 0) {
                selectCard.find('.item').eq(0).trigger('click');
            }
        };
    
        // 申请提现
        var doApplyWithdraw = function (data) {
            AccountCtrl.request('APPLY_WITHDRAW', {
                data: data,
                success: function (res) {
                    if (res.error == 0) {
                        AlertUtils.alert({
                            icon: 'success',
                            content: '您的提现已提交申请成功，请耐心等待到账通知！'
                        });
                        doPrepareWithdraw();
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
    
        // otc提现商户列表
        var buildRemitMerchant = function (data) {
            var form = thisPanel.find('form');
            var buttonRow = form.find('div[name="buttonRow"]');
            buttonRow.empty();
            $.each(data.otcRemit, function (i, v) {
            if ( null != v.method ){
                var tpl ='<a data-command="remit' + v.id + 'button" class="btn btn-primary" style="margin-right:5px;" type="button">OTC提现</a>';
                $('.form-horizontal').find('[data-command="apply"]').addClass('hide');
                var $thisRow = $(tpl);
                $thisRow.attr('remit-id', v.id);
                $thisRow.click(function () {
                    var amount = Number(form.find('input[name="amount"]').val());
                                    var cardId = form.find('.select-card > .item.selected').attr('data-id');
                    var withdrawPassword = form.find('input[name="withdrawPassword"]').val();
                    
                    var requestData = {
                        pid: v.id,
                        method: v.method,
                        amount: amount,
                        cardId: cardId,
                        withdrawPassword: withdrawPassword
                    };
                    
                    PaymentCtrl.request('REQUEST_THRID_WITHDRAW', {
                        data: requestData,
                        success: function (res) {
                            if (res.error == 0) {
                                AlertUtils.alert({
                                    icon: 'success',
                                    content: '请在弹出窗口中完成卖币操作'
                                });
                                var formRemit = thisPanel.find('form[name="otcRemitForm"]');
                                formRemit.attr('action', res.data.link);
                                formRemit.find('input[name="text"]').val(res.data.text);
                                formRemit.attr('target', '_blank_' + new Date().getTime());
                                formRemit.submit();
                                
                                // doPrepareWithdraw();
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
                });
                buttonRow.append($thisRow);
            }
            if ( null != v.qryMethod ){
                var tplQuery ='<a data-command="query' + v.id + 'button" class="btn btn-primary" type="button">OTC提现-查询' + '</a>';
                var $thisRowQuery = $(tplQuery);
                $thisRowQuery.attr('remit-id', v.id);
                $thisRowQuery.click(function () {
                    var withdrawPassword = form.find('input[name="withdrawPassword"]').val();
                    
                    var requestData = {
                        pid: v.id,
                        method: v.qryMethod,
                        withdrawPassword: withdrawPassword
                    };
                    
                    PaymentCtrl.request('REQUEST_THRID_QUERY', {
                        data: requestData,
                        success: function (res) {
                            if (res.error == 0) {
                                AlertUtils.alert({
                                    icon: 'success',
                                    content: '请在弹出窗口中对已收到的订单进行确认操作'
                                });
                                var formRemit = thisPanel.find('form[name="otcRemitForm"]');
                                formRemit.attr('action', res.data.link);
                                formRemit.find('input[name="text"]').val(res.data.text);
                                formRemit.attr('target', '_blank_' + new Date().getTime());
                                formRemit.submit();
                                
                                // doPrepareWithdraw();
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
                });
                buttonRow.append($thisRowQuery);
            }
            });
        };
    
        // 初始化
        doPrepareWithdraw();
    
    });
    