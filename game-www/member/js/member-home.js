$(document).ready(function () {

    const thisPanel = $('.main-panel');

    /** 產生Security List內容 */
    function buildSecurityList() {
        const targetDom = thisPanel.find('.security-list');

        // 所有item的設定資料
        const settings = [
            {
                dataType: '', class: 'item safe', img: 'member_home_icon_1', title: '登录密码', entitle: 'PASSWORD', wbd: '未设置', ybd: '已设置',
                description: '建议您使用字母和数字组合、混合大小写在组合中加入下划线等符号。',
                buttons: [
                    { dataCommand: 'mod-login-pwd', class: 'btn', text: '修改', icon: 'edit' },
                ]
            },
            {
                dataType: 'withdrawPassword', class: 'item', img: 'member_home_icon_2', title: '资金密码', entitle: 'WITHDRAWAL', wbd: '未设置', ybd: '已设置',
                description: '在进行银行卡绑定，转账等资金操作时需要进行安全密码确认，以提高资金安全性。',
                buttons: [
                    { dataCommand: 'setup-withdraw-pwd', class: 'btn', text: '设置', icon: 'setting' },
                    { dataCommand: 'mod-withdraw-pwd', class: 'btn disabled', text: '修改', icon: 'edit' },
                ]
            },
            {
                dataType: 'card', class: 'item', img: 'member_home_icon_3', title: '绑定银行卡', entitle: 'BINDING CARD', wbd: '未绑定', ybd: '已绑定',
                description: '绑定银行卡之后就可以取款了，一张银行卡只能绑定一个账号，一个账号可以绑定5张同姓名银行卡。',
                buttons: [
                    { dataCommand: 'bind-withdraw-card', class: 'btn', text: '绑定', icon: 'bind' },
                    { dataCommand: 'add-withdraw-card', class: 'btn disabled', text: '添加', icon: 'edit' },
                ]
            },
            {
                dataType: 'withdrawName', class: 'item', img: 'member_home_icon_4', title: '绑定取款人', entitle: 'BINDING PAYER', wbd: '未绑定', ybd: '已绑定',
                description: '绑定取款人后您可以绑定银行卡，并且只能绑定与取款人相同的银行卡资料。',
                buttons: [
                    { dataCommand: 'setup-withdraw-name', class: 'btn', text: '绑定', icon: 'bind' },
                ]
            },
            {
                dataType: 'security', class: 'item', img: 'member_home_icon_5', title: '密保问题', entitle: 'VERIFICATION', wbd: '未设置', ybd: '已设置',
                description: '绑定密保答案后可以通过密保答案和资金密码进行上下级转账功能。',
                buttons: [
                    { dataCommand: 'bind-security', class: 'btn', text: '设置', icon: 'setting' },
                ]
            },
            {
                dataType: 'googleVerify', class: 'item', img: 'member_home_icon_6', title: '谷歌验证', entitle: 'VERIFICATION', wbd: '未设置', ybd: '已设置',
                description: '绑定谷歌验证可以极大的提高账户安全性，强烈建议您绑定。',
                buttons: [
                    { dataCommand: 'switch-googleVerify' },
                ]
            },
        ];

        /** Security Item template */
        function itemTpl(setting) {
            return $(`
                <div data-type="${setting.dataType}" class="${setting.class}">
                <div class="flex-column flex-align-start" style="width: 200px;">
                        <div class="title">
                            <img class="item-icon" src="./images/${setting.img}.png" />
                            <div style="margin-right:8px;">${setting.title}</div>
                            <span class="wbd">[${setting.wbd}]</span><span class="ybd">[${setting.ybd}]</span>
                        </div>
                        <div class="eng-title" style="color:#d3d3d3">${setting.entitle}</div>
                        <div class="details">
                            <div class="description">${setting.description}</div>
                        </div>
                    </div>
                    <div class="button-groups"></div>
                </div>)
            `);
        }

        /** Security Item's button template */
        function buttonTpl(btnSetting) {
            let $btn = $(`<a data-command="${btnSetting.dataCommand}"</a>`);
            if (btnSetting.dataCommand == 'switch-googleVerify') { // 谷歌驗證switch
                $btn.attr('google-state', 'close');
                $btn.append($('<i>'));
            }
            if (btnSetting.class) $btn.attr('class', btnSetting.class);
            // if (btnSetting.icon) $btn.append(`<img src="/member/images/member_home_btn_${btnSetting.icon}.png" />`);
            if (btnSetting.text) $btn.append(btnSetting.text);
            return $btn;
        }

        /** 綁定按鈕事件 */
        function setEvents() {
            thisPanel.find('[data-command="mod-login-pwd"]').click(function () {
                ModLoginPwdModal.init(function () {
                    MainCtrl.logout({
                        success: function (res) {
                            if (res.error == 0) {
                                window.location.href = '/login.html';
                            }
                        }
                    });
                });
            });

            thisPanel.find('[data-command="bind-security"]').click(function () {
                BindSecurityModal.init(function () {
                    getBindStatus();
                });
            });

            thisPanel.find('[data-command="setup-withdraw-name"]').click(function () {
                SetupWithdrawNameModal.init(function () {
                    getBindStatus();
                });
            });

            thisPanel.find('[data-command="setup-withdraw-pwd"]').click(function () {
                SetupWithdrawPwdModal.init(function () {
                    getBindStatus();
                });
            });

            thisPanel.find('[data-command="mod-withdraw-pwd"]').click(function () {
                ModWithdrawPwdModal.init();
            });
            //绑定谷歌验证器
            thisPanel.find('[data-command="bind-googleVerify"]').click(function () {
                BindGoogleModal.init(function () {
                    googleReg();
                });
            });
            //开启、关闭谷歌验证器
            thisPanel.find('[data-command="switch-googleVerify"]').click(function () {
                var state = $(this).attr("google-state");

                if (state == "bind") {
                    BindGoogleModal.init(function () {
                        googleReg();
                    });
                } else if (state == "close") {
                    ChangeGoogleStateModal.init(function () {
                        googleReg();
                    }, true);
                } else {
                    ChangeGoogleStateModal.init(function () {
                        googleReg();
                    }, false);
                };

            });

            thisPanel.find('[data-command="bind-withdraw-card"]').click(function () {
                BindWithdrawCardModal.init(function () {
                    getBindStatus();
                });
            });

            thisPanel.find('[data-command="add-withdraw-card"]').click(function () {
                BindWithdrawCardModal.init();
            });
        }

        settings.forEach(setting => {
            let $item = itemTpl(setting);
            setting.buttons.forEach(btn => {
                $item.find('.button-groups').append(buttonTpl(btn));
            });
            targetDom.append($item);
        });

        setEvents();
    };

    /** 獲取Security List目前狀態 */
    function getBindStatus() {
        AccountCtrl.request('GET_BIND_STATUS', {
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    updateSecurityListStatus(res.data);
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

    /** 更新Security List顯示狀態 */
    function updateSecurityListStatus(data) {
        var t = $(thisPanel).find('.security-list');

        if (data.isBindWithdrawPassword) { // 資金密碼
            let wdpw = t.find('[data-type="withdrawPassword"]');
            wdpw.addClass('safe');
            // wdpw.find('[data-command="setup-withdraw-pwd"]').html(`<img src="/member/images/member_home_btn_setting_ok.png" />已设置`).addClass('disabled');
            wdpw.find('[data-command="setup-withdraw-pwd"]').html(`已设置`).addClass('disabled');
            wdpw.find('[data-command="mod-withdraw-pwd"]').removeClass('disabled');
        }

        if (data.isBindCard) { // 綁定銀行卡
            let bindCard = t.find('[data-type="card"]');
            bindCard.addClass('safe');
            // bindCard.find('[data-command="bind-withdraw-card"]').html(`<img src="/member/images/member_home_btn_bind.png" />已绑定`).addClass('disabled');
            bindCard.find('[data-command="bind-withdraw-card"]').html(`已绑定`).addClass('disabled');
            bindCard.find('[data-command="add-withdraw-card"]').removeClass('disabled');
        }

        if (data.isBindWithdrawName) { // 綁定取款人
            let wdn = t.find('[data-type="withdrawName"]');
            wdn.addClass('safe');
            // wdn.find('[data-command="setup-withdraw-name"]').html(`<img src="/member/images/member_home_btn_bind.png" />已绑定`).addClass('disabled');
            wdn.find('[data-command="setup-withdraw-name"]').html(`已绑定`).addClass('disabled');
        }

        if (data.isBindSecurity) { // 密保問題
            let security = t.find('[data-type="security"]');
            security.addClass('safe');
            // security.find('.btn').html(`<img src="/member/images/member_home_btn_setting_ok.png" />已设置`).addClass('disabled');
            security.find('.btn').html(`已设置`).addClass('disabled');
        }
    };

    /** 取得並更新谷歌驗證目前狀態 */
    function googleReg() {
        
        //获取是否绑定谷歌验证
        var getGoogleBindState = function () {
            AccountCtrl.request('GET_GOOGLE_BIND_STATUS', {
                success: function (res) {
                    
                    // var res = {"error":0,"code":null,"message":"Yêu cầu thành công","data":{"googleBind":true}}
                    if (res.error == 0) {
                       
                        if (!res.data.googleBind) {
                            $('[data-command="switch-googleVerify"]').attr("google-state", 'bind');
                        } else {
                            getGoogleState();
                        };

                    } else if (res.error == 1) {
                        if (noAlertMsg(res)) {
                            AlertUtils.alert({
                                icon: 'error',
                                content: res.message
                            });
                        };
                    };
                }
            });
        };
        //获取是否开启谷歌验证状态
        var getGoogleState = function () {
            var t = $(thisPanel).find('.security-list');
           
            AccountCtrl.request('GET_GOOGLE_LOGIN_STATUS', {
                success: function (res) {
                    // console.log('获取是否开启谷歌验证状态')
                    // var res = {"error":0,"code":null,"message":"Yêu cầu thành công","data":{"googleLogin":false}}
                    if (res.error == 0) {
                        if (res.data.googleLogin) {
                            $('[data-command="switch-googleVerify"]').attr("google-state", 'open');
                            let googleVerify = t.find('[data-type="googleVerify"]');
                            googleVerify.addClass('safe');

                        } else {
                            $('[data-command="switch-googleVerify"]').attr("google-state", 'close');
                            let googleVerify = t.find('[data-type="googleVerify"]');
                            googleVerify.removeClass('safe');
                        };

                    } else if (res.error == 1) {
                        if (noAlertMsg(res)) {
                            AlertUtils.alert({
                                icon: 'error',
                                content: res.message
                            });
                        };
                    };
                }
            });
        };

        getGoogleBindState();
    };

    buildSecurityList();
    getBindStatus();
    googleReg();
});