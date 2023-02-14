$(document).ready(function () {

    var thisPanel = $('.main-panel');

    AccountCtrl.request('GET_BIND_STATUS', {
        success: function (res) {
            if (res.error == 0) {
                if (res.data.isBindWithdrawName == false) {
                    thisPanel.find('.step-msg').html('您还没有绑定提现姓名，立即绑定请<a href="member-home.html">点击此处</a>').show();
                    thisPanel.find('.bank-card-list').hide();
                    return;
                }
                if (res.data.isBindWithdrawPassword == false) {
                    thisPanel.find('.step-msg').html('您还没有绑定提现密码，立即绑定请<a href="member-home.html">点击此处</a>').show();
                    thisPanel.find('.bank-card-list').hide();
                    return;
                }
                listCard();
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

    // 列出银行卡
    var listCard = function () {
        AccountCtrl.request('LIST_CARD', {
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    buildCard(res.data);
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

    // 列出卡片
    var buildCard = function (list) {
        var element = thisPanel.find('.bank-card-list');
        element.empty();
        $.each(list, function (i, v) {
            var $thisRow = $(`<div class="item">
                                <div class="bank-code b${v.bankId}" style="margin-left: 20px;"></div>
                                <div class="info">
                                    <div class="card-info">${v.bankCardId}</div>
                                    <div class="card-info">${v.bankCardName}</div>
                                </div>
                            </div>`);
            if (v.isDefault) {
                $thisRow.addClass('default');
                $thisRow.append('<div class="button default"><span>默认</span></div>');
            } else {
                $thisRow.attr('data-command', 'set-default');
                $thisRow.click(() => { doSetDefault({ id: v.id }); });
            }
            element.append($thisRow);
        });
        if (list.length < 5) { // 最大顯示5張卡
            var $thisRow = $(`<div class="item-add" data-command="add" class="button">
                                <img src="/member/images/card_add_icon.png" />
                                <span>添加银行卡</span>
                            </div>`);
            $thisRow.click(function () {
                BindWithdrawCardModal.init(function () {
                    listCard();
                });
            });
            element.append($thisRow);
        }
    };

    /** 設置一張卡為默認 */
    var doSetDefault = function (data) {
        AccountCtrl.request('SET_DEFAULT_CARD', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '该卡片已成功设为默认卡片！'
                    });
                    listCard();
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
});

