$(document).ready(function () {

    var thisPanel = $('.main-panel');

    // 列出所有支付
    var listAllPayment = function () {
        PaymentCtrl.request('REQUEST_ALL_METHOD', {
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                // res.data = {
                //     "transferList": [
                //         {
                //             "id": 2,
                //             "name": "转账汇款",
                //             "type": 1,
                //             "minUnitRecharge": 100,
                //             "maxUnitRecharge": 50000
                //         }
                //     ],
                //     "thridList": [
                //         {
                //             "id": 4,
                //             "name": "测试网银支付01",
                //             "code": "jiajia",
                //             "minUnitRecharge": 100,
                //             "maxUnitRecharge": 50000,
                //             "link": "https://shenghai.skypay02.com",
                //             "methodList": [
                //                 {
                //                     "id": 255,
                //                     "type": 111,
                //                     "method": "BANK_DIRECT",
                //                     "minUnitRecharge": 50,
                //                     "maxUnitRecharge": 2000,
                //                     "feeRate": 0,
                //                     "status": 0
                //                 }
                //             ],
                //             "banklist": [
                //                 {
                //                     "id": 1179,
                //                     "type": 111,
                //                     "bankId": 1,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1180,
                //                     "type": 111,
                //                     "bankId": 2,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1181,
                //                     "type": 111,
                //                     "bankId": 3,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1182,
                //                     "type": 111,
                //                     "bankId": 4,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1183,
                //                     "type": 111,
                //                     "bankId": 5,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1184,
                //                     "type": 111,
                //                     "bankId": 6,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1185,
                //                     "type": 111,
                //                     "bankId": 7,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1186,
                //                     "type": 111,
                //                     "bankId": 8,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1187,
                //                     "type": 111,
                //                     "bankId": 9,
                //                     "code": "1",
                //                     "status": 0
                //                 },
                //                 {
                //                     "id": 1188,
                //                     "type": 111,
                //                     "bankId": 10,
                //                     "code": "1",
                //                     "status": 0
                //                 }
                //             ]
                //         }
                //     ],
                //     "rechargeConfig": {
                //         "isOpen": true,
                //         "serviceMsg": "充值服务正在维护中",
                //         "serviceTime": "00:00~23:59"
                //     }
                // };

                if (res.error == 0) {
                    buildAllPayment(res.data);
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

    // 构建所有支付
    var buildAllPayment = function (data) {

        if (data.rechargeConfig.isOpen == false) {
            var msgText = data.rechargeConfig.serviceMsg;
            if (!msgText) {
                msgText = '服务器充值服务已关闭';
            }
            thisPanel.find('.step-msg').html(msgText).show();
            thisPanel.find('.panel-body').hide();
            return;
        }
        var tab = thisPanel.find('.tab');
        tab.find('.item').remove();
        // 第三方列表
        if (data.thridList) {
            buildThrid(data.thridList);
        }
        // 转账列表
        if (data.transferList) {
            buildTransfer(data.transferList);
        }
        tab.find('.item').eq(0).trigger('click');
    };

    // 第三方
    var buildThrid = function (list) {
        var tab = thisPanel.find('.tab');
        $.each(list, function (i, v) {
            var thridName = v.name;
            var thisItem = $('<div class="item">');
            thisItem.attr('data-href', 'third');
            thisItem.html(thridName);
            thisItem.click(function () {
                tab.find('.item').removeClass('active');
                thisPanel.find('.content > .item').hide();
                thisItem.addClass('active');
                initThridStep(v);
            });
            tab.append(thisItem);
        });
    };

    // 初始化第三方步骤
    var initThridStep = function (data) {
        var thridItem = thisPanel.find('[data-name="thrid"]');
        var step1 = thridItem.find('[data-step="1"]');
        var step2 = thridItem.find('[data-step="2"]');

        var pid = data.id; // 支付id
        var defaultMinAmount = data.minUnitRecharge; // 默认最低充值
        var defaultMaxAmount = data.maxUnitRecharge; // 默认最高充值
        var minAmount = defaultMinAmount; // 最低充值
        var maxAmount = defaultMaxAmount; // 最高充值
        var feeRate = 0; // 手续费率

        thridItem.find('[data-field="min"]').html(minAmount);
        thridItem.find('[data-field="max"]').html(maxAmount);

        // 设置步骤
        var setStepList = function (index) {
            // style2 以progressBar展示進度
            // thridItem.find('.step-list > .progressBar').width(`${(index+1)*196}px`);
            // style4 只顯示一個item展示進度
            thridItem.find('.step-list > .item').each(function (i, v) {
                if (i == index) { // 因應style只需一個item active，小於index者不需再加active
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        };

        // 下一步按钮
        step1.find('[data-command="next"]').unbind('click').click(function () {
            var selectItem = step1.find('.bank-list > .item.selected');
            var method = selectItem.attr('data-method');
            var bankco = selectItem.attr('data-bankco');
            var amount = Number(step1.find('input[name="amount"]').val());
            if (isNaN(amount)) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '请填写正确的充值金额！'
                });
                return;
            }
            if (amount == 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '充值金额必须大于0元！'
                });
                return;
            }
            if (amount < minAmount) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '单笔最低充值金额为' + minAmount + '元！'
                });
                return;
            }
            if (amount > maxAmount) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '单笔最高充值金额为' + maxAmount + '元！'
                });
                return;
            }
            var data = {
                pid: pid,
                method: method,
                bankco: bankco,
                amount: amount
            };
			var amounttest =amount / 10;
			if ((/^(\+|-)?\d+$/.test( amounttest))) {
                AlertUtils.confirm({
                    icon: 'question',
                    content: '本次充值金额' + amount + '为整数，是否继续充值？',
                    confirmFn: function(index) {
						layer.close(index);
                        doRequestPay(data);
                    }
                });
                return;
            }
            doRequestPay(data);
        });

        // 第一步
        var initStep1 = function () {
            step1.show();
            step2.hide();

            setStepList(0);

            var bankList = step1.find('.bank-list');
            bankList.empty();

            // 初始化银行列表
            var initBankList = function (payMethod) {
                $.each(data.banklist, function (i, v) {
                    var thisBank = $('<div class="item">');
                    thisBank.attr('data-method', 'BANK_DIRECT');
                    thisBank.attr('data-bankco', v.code);
                    thisBank.click(function () {
                        if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                            minAmount = payMethod.minUnitRecharge; // 最低充值
                            maxAmount = payMethod.maxUnitRecharge; // 最高充值
                        } else {
                            minAmount = defaultMinAmount; // 最低充值
                            maxAmount = defaultMaxAmount; // 最高充值
                        }
                        thridItem.find('[data-field="min"]').html(minAmount);
                        thridItem.find('[data-field="max"]').html(maxAmount);
                        thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                    });
                    thisBank.append('<div class="bank-code b' + v.bankId + '">');
                    bankList.append(thisBank);
                });
            };

            // 初始化方法
            var initPayEvent = function () {
                // 选中效果
                bankList.find('.item').click(function () {
                    bankList.find('.item').removeClass('selected');
                    bankList.find('.item > i').remove();
                    $(this).addClass('selected');
                    $(this).append('<i class="icon-check"></i>');
                }).eq(0).trigger('click');
            };

            // 支付宝
            var initAlipay = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'ALIPAY');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code alipay">');
                bankList.append(thisBank);
            };

            // 微信
            var initWxpay = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'WXPAY');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code wxpay">');
                bankList.append(thisBank);
            };

            // 无卡支付
            var initNoCard = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'NO_CARD');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code nocard">');
                bankList.append(thisBank);
            };
			
            // QQ钱包
            var initQQPay = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'QQPAY');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code qqpay">');
                bankList.append(thisBank);
            };
			// 京东钱包
            var initJDPay = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'JDPAY');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code jdpay">');
                bankList.append(thisBank);
            };
			// 银联扫码支付
            var initUNIONPAY = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'UNIONPAY');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code unionpay">');
                bankList.append(thisBank);
            };
			// 快捷支付
            var initQUICKPAY = function (payMethod) {
                $.each(data.banklist, function (i, v) {
					
                    var thisBank = $('<div class="item">');
                    thisBank.attr('data-method', 'QUICK_PAY');
                    thisBank.attr('data-bankco', v.code);
                    thisBank.click(function () {
                        if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                            minAmount = payMethod.minUnitRecharge; // 最低充值
                            maxAmount = payMethod.maxUnitRecharge; // 最高充值
                        } else {
                            minAmount = defaultMinAmount; // 最低充值
                            maxAmount = defaultMaxAmount; // 最高充值
                        }
                        thridItem.find('[data-field="min"]').html(minAmount);
                        thridItem.find('[data-field="max"]').html(maxAmount);
                        thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                    });
                    thisBank.append('<div class="bank-code b' + v.bankId + '">');
                    bankList.append(thisBank);
                });
            };
			// 支付宝H5
            var initALIPAYH5 = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'ALIPAYH5');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code alipay">');
                bankList.append(thisBank);
            };
			// OTC支付
            var initDCBUY = function (payMethod) {
                var thisBank = $('<div class="item">');
                thisBank.attr('data-method', 'DCBUY');
                thisBank.click(function () {
                    if (payMethod.minUnitRecharge != 0 && payMethod.maxUnitRecharge != 0) {
                        minAmount = payMethod.minUnitRecharge; // 最低充值
                        maxAmount = payMethod.maxUnitRecharge; // 最高充值
                    } else {
                        minAmount = defaultMinAmount; // 最低充值
                        maxAmount = defaultMaxAmount; // 最高充值
                    }
                    thridItem.find('[data-field="min"]').html(minAmount);
                    thridItem.find('[data-field="max"]').html(maxAmount);
                    thridItem.find('[data-field="feeRate"]').html(payMethod.feeRate);
                });
                thisBank.append('<div class="bank-code dcbuy">');
                bankList.append(thisBank);
            };
            $.each(data.methodList, function (i, v) {
                if (v.method == 'WXPAY') {
                    initWxpay(v);
                }
                if (v.method == 'ALIPAY') {
                    initAlipay(v);
                }
                if (v.method == 'NO_CARD') {
                    initNoCard(v);
                }
                if (v.method == 'QQPAY') {
                    initQQPay(v);
                }
				if (v.method == 'JDPAY') {
                    initJDPay(v);
                }
                if (v.method == 'BANK_DIRECT') {
                    initBankList(v);
                }
				if (v.method == 'UNIONPAY') {
                    initUNIONPAY(v);
                }
				if (v.method == 'QUICK_PAY') {
                    initQUICKPAY(v);
                }
				if (v.method == 'ALIPAYH5') {
                    initALIPAYH5(v);
                }
				if (v.method == 'DCBUY') {
                    initDCBUY(v);
                }
            });

            initPayEvent();
        };

        // 第二步
        var payBillno;
        var initStep2 = function (payData) {
            step1.hide();
            step2.show();
            setStepList(1);

            var form = step2.find('form');
            form.attr('action', payData.link);
            form.find('input[name="text"]').val(payData.text);

            var result = step2.find('.request-result');
            var bankCodeClass = step1.find('.bank-list > .item.selected > .bank-code').attr('class');
            result.find('.bank-code').attr('class', bankCodeClass);
            result.find('[data-field="amount"]').html(Number(payData.amount).toFixed(2));
            result.find('[data-field="feeAmount"]').html(Number(payData.feeAmount).toFixed(2));
            result.find('[data-field="actualAmount"]').html(Number(payData.actualAmount).toFixed(2));
            result.find('[data-field="billno"]').html(payData.billno);

            step2.find('[data-command="back"]').click(function () {
                step1.show();
                step2.hide();
                setStepList(0);
            });

            step2.find('[data-command="pay"]').unbind('click').click(function () {
                if (payBillno != payData.billno) {
                    step2.find('form').attr('target', '_blank_' + new Date().getTime()).submit();
                    payBillno = payData.billno;
                } else {
                    AlertUtils.alert({
                        icon: 'info',
                        content: '请在新窗口中完成支付，或者重新生成订单支付。'
                    });
                }
            });
            step2.find('[data-command="record"]').click(function () {
                window.location.href = 'funds.html?recharge-record';
            });
        };

        // 请求支付
        var doRequestPay = function (data) {
            PaymentCtrl.request('REQUEST_THRID_PAY', {
                data: data,
                success: function (res) {
                    // res = {"error":0,"code":null,"message":"请求成功","data":{"feeAmount":0.0,"amount":108.0,"actualAmount":108.0,"link":"https://b014.skypay02.com/pay","text":"TU51SUI5djVwcFBWYzJNVFVZbG1UamtNR0x6R2RNQnlEc3RkTU56OVd4Z2hwY3MzTEVTYjgrVnF4VmpiVHRSZXp4b0l0MFJia1dBTgoyYmFyVFpHM0NSdDVwK3kwYWdTOEo3TlNlbVp5dFlNdnFPYzRDVTh5NTQvZHJrOGVkQkM3Y2M5eE5VVVNONnRlU1N4bTg0THN6S09HCi9HU0hXVlpXWnVxUjAzU1JYTjdxbmZXVlY1Q2x2QT09","billno":"2019100266656604","feeRate":0.0}};

                    if (res.error == 0) {
                        initStep2(res.data);
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

        initStep1();
        thridItem.show();
    };

    // 转账
    var buildTransfer = function (list) {
        var tab = thisPanel.find('.tab');
        $.each(list, function (i, v) {
            var thisItem = $('<div class="item">转账汇款</div>');
            thisItem.attr('data-href', 'transfer');
			thisItem.html(v.name);
            thisItem.click(function () {
                tab.find('.item').removeClass('active');
                thisPanel.find('.content > .item').hide();
                thisItem.addClass('active');
                initTransferStep(v);
            });
            tab.append(thisItem);
        });
    };

    var initTransferStep = function (data) {
        var transferItem = thisPanel.find('[data-name="transfer"]');
        var step1 = transferItem.find('[data-step="1"]');
        var step2 = transferItem.find('[data-step="2"]');

        var pid = data.id; // 支付id
        var minAmount = data.minUnitRecharge; // 最低充值
        var maxAmount = data.maxUnitRecharge; // 最高充值

        transferItem.find('[data-field="min"]').html(minAmount);
        transferItem.find('[data-field="max"]').html(maxAmount);

        // 设置步骤
        var setStepList = function (index) {
            // style2 以progressBar展示進度
            // transferItem.find('.step-list > .progressBar').width(`${(index+1)*196}px`);
            // style4 只顯示一個item展示進度
            transferItem.find('.step-list > .item').each(function (i, v) {
                if (i == index) { // 因應style只需一個item active，小於index者不需再加active
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        };

        // 下一步按钮
        step1.find('[data-command="next"]').unbind('click').click(function () {
            var amount = Number(step1.find('input[name="amount"]').val());
            var postscript = $('.postscript input').val()
            if (isNaN(amount)) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '请填写正确的充值金额！'
                });
                return;
            }
            if (amount == 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '充值金额必须大于0元！'
                });
                return;
            }
            if (amount < minAmount) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '单笔最低充值金额为' + minAmount + '元！'
                });
                return;
            }
            if (amount > maxAmount) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '单笔最高充值金额为' + maxAmount + '元！'
                });
                return;
            }
            var data = {
                pid: pid,
                amount: amount,
                postscript:postscript
            };
            doRequestPay(data);
        });

        // 第一步
        var initStep1 = function () {
            step1.show();
            step2.hide();
            setStepList(0);
        };

        // 第二步
        var initStep2 = function (payData) {
            step1.hide();
            step2.show();
            setStepList(1);
            
            var result = step2.find('.request-result');
			
			// 清空
            result.find('input[name="billno"]').val('');
            result.find('input[name="amount"]').val('');
            result.find('input[name="bankName"]').val('');
            result.find('input[name="bankBranch"]').val('');
            result.find('input[name="bankCardName"]').val('');
            result.find('input[name="bankCardId"]').val('');
            result.find('#paycode').empty();
			
            // 赋值
            result.find('input[name="billno"]').val(payData.billno);
            result.find('input[name="amount"]').val(Number(payData.amount).toFixed(2));
            result.find('input[name="bankName"]').val(payData.bankName);
			result.find('input[name="bankBranch"]').val(payData.bankBranch);
            result.find('input[name="bankCardName"]').val(payData.bankCardName);
            result.find('input[name="bankCardId"]').val(payData.bankCardId);
			
			
            if (data.type == 1 || (data.methodList.length > 0 && data.methodList[0].method === 'BANK_DIRECT')) {
				 result.find('[data-visible="1"]').show();
				if(payData.bankName){
					$('[name="bankName"]').parents('[data-visible="1"]').show();
				}else{
					$('[name="bankName"]').parents('[data-visible="1"]').hide();
				};
				if(payData.bankBranch){
					$('[name="bankBranch"]').parents('[data-visible="1"]').show();
				}else{
					$('[name="bankBranch"]').parents('[data-visible="1"]').hide();
				};
                result.find('[data-visible="2"]').hide();
				$('[data-prompt="alplay"]').html('');
            } else {
                result.find('[data-visible="1"]').hide();
                result.find('[data-visible="2"]').show();
				jQuery(function(){
					jQuery('#paycode').qrcode(payData.base64Code);

				});
				$('[data-prompt="alplay"]').html('和【支付宝认证名】');
            }
        };

        step2.find('[data-command="back"]').click(function () {
            step1.show();
            step2.hide();
            setStepList(0);
        });

        // 请求支付
        var doRequestPay = function (data) {
            PaymentCtrl.request('REQUEST_TRANSFER_PAY', {
                data: data,
                success: function (res) {
                    // res = {"error":0,"code":null,"message":"请求成功","data":{"feeAmount":0.0,"amount":108.0,"actualAmount":108.0,"link":"https://b014.skypay02.com/pay","text":"TU51SUI5djVwcFBWYzJNVFVZbG1UamtNR0x6R2RNQnlEc3RkTU56OVd4Z2hwY3MzTEVTYjgrVnF4VmpiVHRSZXp4b0l0MFJia1dBTgoyYmFyVFpHM0NSdDVwK3kwYWdTOEo3TlNlbVp5dFlNdnFPYzRDVTh5NTQvZHJrOGVkQkM3Y2M5eE5VVVNONnRlU1N4bTg0THN6S09HCi9HU0hXVlpXWnVxUjAzU1JYTjdxbmZXVlY1Q2x2QT09","billno":"2019100266656604","feeRate":0.0}};

                    if (res.error == 0) {
                        initStep2(res.data);
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

        initStep1();
        transferItem.show();
    };

    listAllPayment();
});