$(document).ready(function () {
    $(".agreement a").click(function () {
        $(".terms").addClass("active");
    })
    $('#choice').click(function () {
        if ($('[data-command="choice"]').attr("data-command2") == "yes") {
            $('[data-command="choice"]').click();
        }
    })
    $('[data-command="choice"]').click(function () {
        if ($(this).attr("data-command2") == "yes") {
            $(this).attr("data-command2", "no");
            $(this).addClass('active');
        }
        else {
            $(this).attr("data-command2", "yes");

            $(this).removeClass('active');
        }
    })
    $(".termsbtnbox").click(function () {
        $(".terms").removeClass("active");
    })
    // 初始化变量
    var thisPanel = $('.reg-form');
    var inputUsername = thisPanel.find('input[name="username"]');
    var inputNickname = thisPanel.find('input[name="username"]');
    var inputPassword1 = thisPanel.find('input[name="password1"]');
    var inputPassword2 = thisPanel.find('input[name="password2"]');
    var inputSecurityCode = thisPanel.find('input[name="securityCode"]');
    var imgSecurityCode = thisPanel.find('.security-code');
    var submitBtn = thisPanel.find('[data-command="submit"]');

    // 显示错误信息
    var errorMsg = function (element) {
        var formGroup = $(element).closest('.form-group');
        formGroup.removeClass('has-success').addClass('has-error');
        formGroup.find('.help-block').html('<i class="no"></i>');
    };

    // 显示提示信息
    var errorText = function (element, text) {
        var formGroup = $(element).closest('.form-group');
        formGroup.removeClass('has-success').addClass('has-error');
        formGroup.find('.help-block').html(text);
    };

    // 显示正确信息
    var successMsg = function (element) {
        var formGroup = $(element).closest('.form-group');
        formGroup.removeClass('has-error').addClass('has-success');
        formGroup.find('.help-block').html('<i class="yes"></i>');
    };

    // 计算字符长度
    var len = function (s) {
        var l = 0;
        for (var i = 0; i < s.length; i++) {
            l += s.charCodeAt(i) > 255 ? 2 : 1;
        }
        return l;
    };

    // 验证昵称
    var testNickname = function (s) {
        var l = len(s);
        if (l >= 4 && l <= 12) {
            return true;
        }
        return false;
    };

    // 检查用户名是否存在
    var checkNameExist = function (s) {
        errorText(inputUsername, '正在检测中...');
        var data = {
            username: s
        };
        AccountCtrl.request('CHECK_USERNAME_EXIST', {
            data: data,
            success: function (res) {
                if (res === true) {
                    errorText(inputUsername, '用户名已存在！');
                } else {
                    successMsg(inputUsername);
                }
            }
        });
    };

    // 验证用户名
    var testUsername = function (s) {
        var regex = /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){5,11}$/;
        if (regex.test(s)) {
            return true;
        }
        return false;
    };

    // 验证密码
    var testPassword = function (s) {
        var regex = /^(\w){6,20}$/;
        if (regex.test(s)) {
            return true;
        }
        return false;
    };

    // 验证用户名
    var validateUsername = function () {
        var thisVal = inputUsername.val();
        if (!thisVal) {
            errorMsg(inputUsername);
            return false;
        }
        if (!testUsername(thisVal)) {
            errorMsg(inputUsername);
            return false;
        }
        checkNameExist(thisVal);
        return true;
    };

    inputUsername.bind('blur', function () {
        validateUsername();
    });

    // 验证昵称
    var validateNickname = function () {
        var thisVal = inputNickname.val();
        if (!thisVal) {
            errorMsg(inputNickname);
            return false;
        }
        if (!testNickname(thisVal)) {
            errorMsg(inputNickname);
            return false;
        }
        successMsg(inputNickname);
        return true;
    };

    inputNickname.bind('blur', function () {
        validateNickname();
    });

    // 验证密码
    var validatePwd1 = function () {
        var thisVal1 = inputPassword1.val();
        if (thisVal1 == '') {
            errorMsg(inputPassword1);
            return false;
        }
        if (!testPassword(thisVal1)) {
            errorMsg(inputPassword1);
            return false;
        }
        successMsg(inputPassword1);
        return true;
    };

    inputPassword1.bind('blur', function () {
        validatePwd1();
    });

    // 验证重复密码
    var validatePwd2 = function () {
        var thisVal1 = inputPassword1.val();
        var thisVal2 = inputPassword2.val();
        if (!thisVal2) {
            errorMsg(inputPassword2);
            return false;
        }
        if (thisVal1 != thisVal2) {
            errorMsg(inputPassword2);
            return false;
        }
        successMsg(inputPassword2);
        return true;
    };

    inputPassword2.bind('blur', function () {
        validatePwd2();
    });

    inputPassword2.bind('paste', function () {
        return false;
    });

    // 验证验证码
    var validateSecurityCode = function () {
        var thisVal = inputSecurityCode.val();
        if (!thisVal) {
            errorMsg(inputSecurityCode);
            return false;
        }
        successMsg(inputSecurityCode);
        return true;
    };

    inputSecurityCode.bind('blur', function () {
        validateSecurityCode();
    });

    // 刷新验证码
    var refreshCode = function () {
        let tms = new Date().getTime();
        var src = '/api/utils/regist-security-code?' + tms;
        imgSecurityCode.html('<img src="' + src + '">');
        Cookie.setCookie('codeTms', tms, 24);
    };

    // 验证码点击事件
    imgSecurityCode.click(function () {
        refreshCode();
    });

    // 注册按钮点击事件
    submitBtn.click(function () {
        // var agree = thisPanel.find('input[name="agree"]');
        var bool = $('[data-command="choice"]').attr("data-command2") == "yes"
        if (bool) {
            AlertUtils.alert({
                icon: 'info',
                content: '请同意并愿意遵守用户协议和隐私条款'
            });
            return;
        }
        if (!validateUsername()) {
            return;
        }
        if (!validateNickname()) {
            return;
        }
        if (!validatePwd1()) {
            return;
        }
        if (!validatePwd2()) {
            return;
        }
        if (!validateSecurityCode()) {
            return;
        }
        doSubmit();
    });

    var getRegCode = function () {
        var locSearch = window.location.search;
        if (locSearch) {
            return locSearch.substring(1);
        }
    };

    // 跳转到首页
    var goIndex = function () {
        window.location.href = "/";
    };

    // 注册操作
    var doSubmit = function () {
        var data = {
            username: inputUsername.val(),
            nickname: inputNickname.val(),
            password: inputPassword1.val(),
            registCode: getRegCode(),
            securityCode: inputSecurityCode.val(),
            tms: Cookie.getCookie('codeTms')
        };
        MainCtrl.regist({
            data: data,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '注册成功，是否立即登录？',
                        confirmFn: function () {
                            if (isLogin) {
                                MainCtrl.logout({
                                    success: function () {
                                        goIndex();
                                    }
                                });
                            } else {
                                goIndex();
                            }
                        }
                    });
                }
                if (res.error == 1) {
                    AlertUtils.alert({
                        icon: 'error',
                        content: res.message
                    });
                }
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };

    refreshCode();

    // 線路檢測
    linesBuilder({
        targetDom: $('.nl-lines-box'),
        itemTpl: function (v) {
            return `<div class="item">
                <!--<div class="doughnut"></div>-->
                <div class="speed">${v.ping}ms</div>
                <a class="go_internet hover" href="${v.url}" target="_blank" title="${v.url}">访 问</a>
                <div class="urlText textAuto" title="${v.url}">${v.url}</div>
            </div>`;
        },
        repingDom: $('.re-ping')
    });
    buildQRCodeList();
});