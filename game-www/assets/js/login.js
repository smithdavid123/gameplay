$(document).ready(function () {
    var loginForm = $('.login-form');
    
    var imgSecurityCode = loginForm.find('.security-code');

    var loginBtn = loginForm.find('[data-command="login"]');

    // 初始化数据
    var initData = function (callback) {
        store.clear(); // 清空数据
        WebAjaxCtrl.request('INIT_DATA', {
            async: false,
            success: function (res) {
                if (res.error == 0) {
                    // 私人信息
                    store.set('PRIVATE:Account', res.data.account);
                    store.set('PRIVATE:GameLotteryAccount', res.data.gameLotteryAccount);
                    store.set('PRIVATE:MsgCount', res.data.msgCount);
                    store.set('PRIVATE:MessageEnabled', res.data.messageEnabled);
                    // 公共信息
                    store.set('PUBLIC:GameLotteryTypeList', res.data.gameLotteryTypeList);
                    store.set('PUBLIC:GameLotteryShowTypeList', res.data.gameLotteryShowTypeList);
                    store.set('PUBLIC:GameLotteryInfoList', res.data.gameLotteryInfoList);
                    store.set('PUBLIC:GameLotteryMethodList', res.data.gameLotteryMethodList);
                    store.set('PUBLIC:GameLotteryConfig', res.data.gameLotteryConfig);
                    // 系统信息
                    store.set('SYSTEM:SystemNoticeList', res.data.systemNoticeList);
                    // 初始化完成
                    store.set('INIT_DATA', true);
                    callback && callback();
                }
            }
        });
    };

    loginBtn.click(function () {
        var username = loginForm.find('input[name="username"]').val();
        var password = loginForm.find('input[name="password"]').val();
        var securityCode = loginForm.find('input[name="securityCode"]').val();
        var googleCode = $('body').find('[name="googleCode"]').val()
        var agree = loginForm.find('[name="agree"]').attr('data-command2');
        if (!username) {
            AlertUtils.alert({
                icon: 'info',
                content: '请输入您的用户名'
            });
            return;
        }
        if (!password) {
            AlertUtils.alert({
                icon: 'info',
                content: '请输入您的密码'
            });
            return;
        }
        if (!securityCode) {
            AlertUtils.alert({
                icon: 'info',
                content: '请输入验证码'
            });
            return;
        }
		if (agree=='yes') {
            AlertUtils.alert({
                icon: 'info',
                content: '请阅读并同意游戏协议'
            });
            return;
        }

        var data = {
            username: username,
            password: password,
            securityCode: securityCode,
            tms: Cookie.getCookie('codeTms')
        };
        if(googleCode){
            data.googleKey = googleCode;
        }
        MainCtrl.webLogin({
            data: data,
            beforeSend: function () {
                loginForm.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    CodeRange();
                    shengxiao();
                    Cookie.setCookie('token', res.data.tk, 3);
                    Cookie.setCookie('licence', res.data.lc, 3);
                    Cookie.setCookie('username', data.username, 3);
                    console.log(res.data);
                    initData(function () {
                        window.location.href = '/';
                    });
                }
                if (res.error == 1) {
                    if (res.code == '103-02') {
                        refreshCode();
                    }else if( res.code == '102-05' ){
                        AlertUtils.confirm({
                            icon: 'question',
                            title:"请输入谷歌验证码",
                            btn:['登录','取消'],
                            content: '<div><input name="googleCode" type="text" class="form-control" placeholder="请输入谷歌验证码"></div>',
                            confirmFn: function () {
                                loginBtn.trigger('click');
                            }
                        });
                        return
                    };
                    AlertUtils.alert({
                        icon: 'error',
                        content: res.message
                    });
                }
            },
            complete: function () {
                loginForm.ajaxLoading(false);
            }
        });
    });

    loginForm.keydown(function (e) {
        if (e.keyCode == 13) {
            loginBtn.trigger('click');
        }
    });

    // 刷新验证码
    var refreshCode = function () {
        let tms = new Date().getTime();
        var src = '/api/utils/login-security-code?' + tms;
        imgSecurityCode.html('<img src="' + src + '">');
        Cookie.setCookie('codeTms', tms, 24);
    };

    // 验证码点击事件
    imgSecurityCode.click(function () {
        refreshCode();
    });

    //获取玩法最高奖级的
    var CodeRange = function () {
        SystemCtrl.request('GET_LOTTERY_CODE_RANGE', {
            success: function (res) {
                if( res.data&&res.data.gameLotteryCodeRange ){
                    store.set('PRIVATE:codeMax', res.data.gameLotteryCodeRange.codeMax);
                    store.set('PRIVATE:codeMin', res.data.gameLotteryCodeRange.codeMin);
                };
            },
        });
    };
    //获取生肖数据
    var shengxiao = function(){
        GameLotteryCtrl.request('LIST_SHENGXIAO_BALLS', {
            success: function (res) {
                if (res.data) {
                    store.set('PRIVATE:shengxiao', res.data);
                };
            },
        });
    };
    refreshCode();
});

$(document).ready(function () {
    var preloadImg = function (list) {
        $.each(list, function () {
            $('<img/>')[0].src = this;
        });
    };
});