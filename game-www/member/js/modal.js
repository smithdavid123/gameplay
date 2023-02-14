
$(document).ready(function () {
    var initPersonalInfo = function () {
        var t = $('.personal-info');
        t.find('[data-command="mod-avatar"]').click(function () {
            ModAvatarModal.init(function (data) {
                t.find('.avatar > img').attr('src', 'images/avatar/' + data + '.jpg');
                $(".user_img").find("img").attr('src', '/member/images/avatar/' + data + '.jpg');
            });
        });
        $('[data-command="mod-nickname"]').click(function () {
            var nickname = t.find('[data-field="nickname"]');
            ModNicknameModal.init(nickname.html(), function (data) {
                nickname.html(data);
            });
        });
    };
    initPersonalInfo();
});

// 修改登录密码
var ModLoginPwdModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-login-pwd">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-12">请输入旧密码</label>\
                            <div class="col-sm-12">\
                                <input name="oldPassword" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-12">请输入新密码</label>\
                            <div class="col-sm-12">\
                                <input name="newPassword" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span data-default="提示：请输入字母加数字组合的密码，必须包含特殊字符，长度必须在8到20个字符之间" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-12">请重复新密码</label>\
                            <div class="col-sm-12">\
                                <input name="repeatPwd" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认修改</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                oldPassword: 'required',
                newPassword: 'required',
                repeatPwd: {
                    required: true,
                    equalTo: 'input[name="newPassword"]'
                }
            },
            messages: {
                oldPassword: '请输入旧密码',
                newPassword: '请输入新密码',
                repeatPwd: {
                    required: '请重复输入上面的密码',
                    equalTo: '两次密码输入不一致'
                }
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var oldPassword = form.find('input[name="oldPassword"]');
                var newPassword = form.find('input[name="newPassword"]');
                doSubmit({
                    oldPassword: oldPassword.val(),
                    newPassword: newPassword.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('MODIFY_PASSWORD', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改登录密码成功，请重新登录',
                        callback: function () {
                            callback && callback();
                        }
                    });
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
        console.log(data);
    };
    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = initForm();
        ModalBoxUtils.init({
            width: 560,
            title: '修改登录密码',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 设置资金密码
var SetupWithdrawPwdModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-withdraw-pwd">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">请输入新密码</label>\
                            <div class="col-sm-8">\
                                <input name="newPassword" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span data-default="提示：新密码不能与旧密码和登录密码相同" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">请重复新密码</label>\
                            <div class="col-sm-8">\
                                <input name="repeatPwd" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认修改</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                newPassword: 'required',
                repeatPwd: {
                    required: true,
                    equalTo: 'input[name="newPassword"]'
                }
            },
            messages: {
                newPassword: '请输入新密码',
                repeatPwd: {
                    required: '请重复输入上面的密码',
                    equalTo: '两次密码输入不一致'
                }
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var newPassword = form.find('input[name="newPassword"]');
                doSubmit({
                    password: newPassword.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('SETUP_WITHDRAW_PASSWORD', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改资金密码成功'
                    });
                    callback && callback();
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
    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = initForm();
        ModalBoxUtils.init({
            width: 560,
            title: '修改资金密码',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 修改资金密码
var ModWithdrawPwdModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-withdraw-pwd">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">请输入旧密码</label>\
                            <div class="col-sm-8">\
                                <input name="oldPassword" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">请输入新密码</label>\
                            <div class="col-sm-8">\
                                <input name="newPassword" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span data-default="提示：请输入字母加数字组合的密码，必须包含特殊字符，长度必须在8到20个字符之间" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">请重复新密码</label>\
                            <div class="col-sm-8">\
                                <input name="repeatPwd" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认修改</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                oldPassword: 'required',
                newPassword: 'required',
                repeatPwd: {
                    required: true,
                    equalTo: 'input[name="newPassword"]'
                }
            },
            messages: {
                oldPassword: '请输入旧密码',
                newPassword: '请输入新密码',
                repeatPwd: {
                    required: '请重复输入上面的密码',
                    equalTo: '两次密码输入不一致'
                }
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var oldPassword = form.find('input[name="oldPassword"]');
                var newPassword = form.find('input[name="newPassword"]');
                doSubmit({
                    oldPassword: oldPassword.val(),
                    newPassword: newPassword.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('MODIFY_WITHDRAW_PASSWORD', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改资金密码成功！'
                    });
                    callback && callback();
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
    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = initForm();
        ModalBoxUtils.init({
            width: 560,
            title: '修改资金密码',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();
//绑定谷歌验证
var BindGoogleModal = function () {
    // 获取内容
    var Tel = function () {
        var tpl =
            `<div class="content_google">
        <div class="title">绑定谷歌验证二维码</div>
        <div><img data-img="googleCode" src="#" alt=""></div>
        <div class="text">(提示：用谷歌验证器扫码，获取谷歌验证码)</div>
        <form class="form-horizontal">
            <div class="form-body">
                <div class="form-group">
                    <label class="col-sm-3 control-label">谷歌验证码</label>
                    <div class="col-sm-8">
                        <input name="googleCode" type="text" class="form-control" readonly onfocus="this.removeAttribute('readonly');">
                        <div class="form-help">
                            <span class="help-block"></span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">资金密码</label>
                    <div class="col-sm-8">
                        <input name="zjPwd" type="password" class="form-control" readonly onfocus="this.removeAttribute('readonly');">
                        <div class="form-help">
                            <span class="help-block"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <a data-command="submit" class="btn btn-primary btn-block">确认</a>
                <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>    
            </div>
        </form>
    </div>`;
        return $(tpl);
    };

    var getContent = function () {
        var content = Tel();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {

            rules: {
                googleCode: 'required',
                zjPwd: 'required',
                repeatPwd: {
                    required: true,
                    equalTo: 'input[name="zjPwd"]'
                }
            },
            messages: {
                googleCode: '请输入谷歌验证码',
                zjPwd: '请输入资金密码',
                repeatPwd: {
                    required: '请输入谷歌验证码',
                    equalTo: '请输入资金密码'
                }
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {

            if (form.validate().form()) {
                var googleKey = form.find('input[name="googleCode"]').val();
                var withdrawPassword = form.find('input[name="zjPwd"]').val();
                doSubmit({
                    googleKey: googleKey,
                    withdrawPassword: withdrawPassword
                });
            }
        });
        AccountCtrl.request('GOOGLE_BIND_REQUEAT_PICTURE', {
            success: function (res) {
                if (res.error == 0) {
                    content.find('[data-img="googleCode"]').attr('src', res.data.googleBindImg);
                    ModalBoxUtils.init({
                        width: 560,
                        title: '绑定谷歌验证',
                        addClass: 'title-center',
                        content: content
                    });
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
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('GOOGLE_BIND_CONFIRM', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '谷歌验证器绑定成功！',
                    });
                    doSubmit2({
                        withdrawPassword: data.withdrawPassword,
                        googleLogin: true
                    });
                }
                callback && callback();
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

    var doSubmit2 = function (data) {
        AccountCtrl.request('MODIFY_GOOGLE_LOGIN_STATUS', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
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

    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = getContent();

    };
    return {
        init: init
    }
}();
//开启与关闭谷歌验证
var ChangeGoogleStateModal = function () {
    // 获取内容
    var Tel = function () {
        var tpl =
            `<div class="content_google">
        <form class="form-horizontal">
            <div class="form-body">
                <div class="form-group">
                    <label class="col-sm-3 control-label">资金密码</label>
                    <div class="col-sm-8">
                        <input name="zjPwd" type="password" class="form-control">
                        <div class="form-help">
                            <span class="help-block"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <a data-command="submit" class="btn btn-primary">确认</a>
                <a data-command="cancel" class="btn btn-cancel">取消</a>
            </div>
        </form>
    </div>`;
        return $(tpl);
    };
    var getContent = function (state) {
        var content = Tel();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {

            rules: {
                zjPwd: 'required',
                repeatPwd: {
                    required: true,
                    equalTo: 'input[name="zjPwd"]'
                }
            },
            messages: {
                zjPwd: '请输入资金密码',
                repeatPwd: {
                    equalTo: '请输入资金密码'
                }
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {

            if (form.validate().form()) {
                var withdrawPassword = form.find('input[name="zjPwd"]').val();
                doSubmit({
                    withdrawPassword: withdrawPassword,
                    googleLogin: state
                });
            }
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('MODIFY_GOOGLE_LOGIN_STATUS', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    if (data.googleLogin) {
                        AlertUtils.alert({
                            icon: 'success',
                            content: '您开通了谷歌验证器！',
                        });
                    } else {
                        AlertUtils.alert({
                            icon: 'success',
                            content: '您关闭了谷歌验证器！',
                        });
                    };
                    callback && callback();
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
    // 初始化
    var init = function (cb, state) {
        callback = cb;
        if (state) {
            var title = '开通谷歌验证';
        } else {
            var title = '关闭谷歌验证';
        };
        var content = getContent(state);
        ModalBoxUtils.init({
            width: 560,
            title: title,
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();
// 绑定密保
var BindSecurityModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="bind-security">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group" data-validate="false">\
                            <label class="col-sm-3 control-label">密保问题1</label>\
                            <div class="col-sm-8">\
                                <select name="question1" class="form-control"></select>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">密保答案1</label>\
                            <div class="col-sm-8">\
                                <input name="answer1" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group" data-validate="false">\
                            <label class="col-sm-3 control-label">密保问题2</label>\
                            <div class="col-sm-8">\
                                <select name="question2" class="form-control"></select>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">密保答案2</label>\
                            <div class="col-sm-8">\
                                <input name="answer2" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group" data-validate="false">\
                            <label class="col-sm-3 control-label">密保问题3</label>\
                            <div class="col-sm-8">\
                                <select name="question3" class="form-control"></select>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">密保答案3</label>\
                            <div class="col-sm-8">\
                                <input name="answer3" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认绑定</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 列出密保问题
    var listQuestion = function () {
        var list = [];
        list.push('我最爱看哪部美剧？');
        list.push('我最喜欢吃的美食是？');
        list.push('我最喜欢哪个球队？');
        list.push('我最喜欢玩的游戏是？');
        list.push('我最喜欢的颜色是？');
        list.push('我最爱看的电影是？');
        list.push('我的座右铭是？');
        list.push('我的幸运数字是？');
        list.push('我父亲的姓名是？');
        list.push('我母亲的姓名是？');
        list.push('我配偶的名字是？');
        list.push('我的出生地是？');
        list.push('我毕业的学校是？');
        list.push('我父亲的生日是？');
        list.push('我母亲的生日是？');
        list.push('我配偶的生日是？');
        list.push('你的初中班主任名字是什么？');
        list.push('你的初恋叫什么名字？');
        list.push('你小时候最喜欢哪一本书？');
        list.push('你的理想工作是什么？');
        list.push('你童年时代的绰号是什么？');
        list.push('你拥有的第一辆车是什么型号？');
        list.push('你最喜欢哪个歌手或乐队？');
        list.push('你最喜欢哪个电影明星或角色？');
        list.push('你的第一个上司叫什么名字？');
        list.push('你的父母是在哪里认识的？');
        list.push('你的第一个宠物叫什么名字？');
        list.push('你最好的朋友叫什么名字？');
        list.push('你学会做的第一道菜是什么？');
        list.push('你上小学时最喜欢的老师姓什么？');
        list.push('你第一次坐飞机是去哪里？');
        list.push('您从小长大的那条街叫什么？');
        list.push('你去过的第一个海滨浴场是哪一个？');
        list.push('你购买的第一张专辑是什么？');
        return list;
    };
    // 初始化密保问题
    var initQuestion = function (list, element) {
        for (var i = 0; i < 8; i++) {
            var index = parseInt(Math.random() * list.length);
            element.append('<option>' + list[index] + '</option>');
            list.splice(index, 1);
        }
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                answer1: 'required',
                answer2: 'required',
                answer3: 'required'
            }
        });
        var list = listQuestion();
        var question1 = form.find('select[name="question1"]');
        initQuestion(list, question1);
        var question2 = form.find('select[name="question2"]');
        initQuestion(list, question2);
        var question3 = form.find('select[name="question3"]');
        initQuestion(list, question3);
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var answer1 = form.find('input[name="answer1"]');
                var answer2 = form.find('input[name="answer2"]');
                var answer3 = form.find('input[name="answer3"]');
                doSubmit({
                    question1: question1.val(),
                    answer1: answer1.val(),
                    question2: question2.val(),
                    answer2: answer2.val(),
                    question3: question3.val(),
                    answer3: answer3.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('BIND_SECURITY', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '绑定密保问题成功！'
                    });
                    callback && callback();
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
        console.log(data);
    };
    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = initForm();
        ModalBoxUtils.init({
            width: 600,
            title: '绑定密保问题',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 修改昵称
var ModNicknameModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-nickname">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">昵称</label>\
                            <div class="col-sm-8">\
                                <input name="nickname" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span data-default="起一个碉堡的昵称吧，例如：我是赌神~" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认修改</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 设置数据
    var setData = function (form, data) {
        form.find('input[name="nickname"]').val(data);
    };
    // 初始化表单
    var initForm = function (data) {
        var content = getContent();
        var form = content.find('form');
        setData(form, data);
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                nickname: 'required'
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var nickname = form.find('input[name="nickname"]');
                doSubmit({
                    nickname: nickname.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('MODIFY_NICKNAME', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改昵称成功！'
                    });
                    callback && callback(data.nickname);
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
    // 初始化
    var init = function (data, cb) {
        callback = cb;
        var content = initForm(data);
        ModalBoxUtils.init({
            width: 600,
            title: '修改昵称',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 修改头像
var ModAvatarModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-avatar">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="avatar-list"></div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认修改</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 初始化头像列表
    var imgPath = 'images/avatar/';
    var initAvatarList = function (element) {
        for (var i = 0; i < 21; i++) {
            var thisItem = $('<div class="item">');
            thisItem.attr('data-id', i);
            thisItem.append('<img src="' + (imgPath + i) + '.jpg">');
            thisItem.click(function () {
                var index = parseInt($(this).attr('data-id'));
                setAvatarSelected(element, index);
            });
            element.append(thisItem);
        }
    };
    // 设置头像为选中状态
    var setAvatarSelected = function (element, index) {
        $(element).find('.item.selected > i').remove();
        $(element).find('.item.selected').removeClass('selected');
        var newElement = $(element).find('.item').eq(index);
        newElement.append('<i class="fa fa-check-circle"></i>');
        newElement.addClass('selected');
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化头像列表
        var avatarList = form.find('.avatar-list');
        initAvatarList(avatarList);
        setAvatarSelected(avatarList, 0);
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                nickname: 'required'
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var id = parseInt(avatarList.find('.item.selected').attr('data-id'));
                doSubmit({ avatar: id });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('MODIFY_AVATAR', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改头像成功'
                    });
                    callback && callback(data.avatar);
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
    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = initForm();
        ModalBoxUtils.init({
            width: 860,
            title: '修改头像',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 绑定取款人
var SetupWithdrawNameModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-withdraw-name">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">取款人</label>\
                            <div class="col-sm-8">\
                                <input name="withdrawName" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span data-default="提示：取款人姓名绑定后无法修改，并且只能绑定姓名为取款人的银行卡" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <div class="form-group">\
                            <a data-command="submit" class="btn btn-primary">确认绑定</a>\
                            <a data-command="cancel" class="btn btn-cancel">取消</a>\
                        </div>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                withdrawName: 'required'
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var withdrawName = form.find('input[name="withdrawName"]');
                doSubmit({
                    name: withdrawName.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('SETUP_WITHDRAW_NAME', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '绑定提现取款人成功！'
                    });
                    callback && callback();
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
    // 初始化
    var init = function (cb) {
        callback = cb;
        var content = initForm();
        ModalBoxUtils.init({
            width: 560,
            title: '绑定取款人',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 绑定邮箱
var BindEmailModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="mod-withdraw-name">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">邮箱地址</label>\
                            <div class="col-sm-6">\
                                <input name="email" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span data-default="输入邮箱地址，然后点击旁边的发送验证码" class="help-block"></span>\
                                </div>\
                            </div>\
                            <div class="col-sm-3">\
                                <a data-command="send" class="btn btn-link no-padding">发送验证码</a>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">验证码</label>\
                            <div class="col-sm-6">\
                                <input name="code" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span data-default="请登录邮箱然后输入收到的验证码信息" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确认绑定</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 初始化表单
    var initForm = function () {
        var content = getContent();
        var form = content.find('form');
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                email: {
                    required: true,
                    email: true
                },
                code: 'required'
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var withdrawName = form.find('input[name="withdrawName"]');
                doSubmit({
                    withdrawName: withdrawName.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var doSubmit = function (data) {
        console.log(data);
    };
    // 初始化
    var init = function () {
        var content = initForm();
        ModalBoxUtils.init({
            width: 600,
            title: '修改取款人',
            addClass: 'title-center',
            content: content
        });
    };
    return {
        init: init
    }
}();

// 绑定提现银行卡
var BindWithdrawCardModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="bind-withdraw-card">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group" data-validate="false">\
                            <label class="col-sm-3 control-label">选择开户行</label>\
                            <div class="col-sm-8">\
                                <select name="bank" class="form-control"></select>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">支行名称</label>\
                            <div class="col-sm-8">\
                                <input name="bankBranch" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">持卡人姓名</label>\
                            <div class="col-sm-8">\
                                <p data-field="withdrawName" class="form-control-static"></p>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">银行卡号</label>\
                            <div class="col-sm-8">\
                                <input name="bankCardId" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">重复银行卡号</label>\
                            <div class="col-sm-8">\
                                <input name="repeatCardId" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span data-default="请重复输入上面的卡号，复制粘贴无效" class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">输入资金密码</label>\
                            <div class="col-sm-8">\
                                <input name="withdrawPwd" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确定添加</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 设置数据
    var setData = function (form, data) {
        var bank = form.find('select[name="bank"]');
        $.each(data.bankList, function (i, v) {
            bank.append('<option value="' + v.id + '">' + v.name + '</option>');
        });
        form.find('[data-field="withdrawName"]').html(data.withdrawName);
        form.find('input[name="repeatCardId"]').bind('paste', function () {
            return false;
        });
    };
    // 初始化表单
    var initForm = function (data) {
        var content = getContent();
        var form = content.find('form');
        setData(form, data);
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                bankBranch: 'required',
                bankCardId: {
                    required: true,
                    creditcard: true
                },
                repeatCardId: {
                    required: true,
                    equalTo: 'input[name="bankCardId"]'
                },
                withdrawPwd: 'required'
            },
            messages: {
                bankCardId: {
                    required: '请输入您的银行卡号',
                    creditcard: '请输入正确的银行卡号'
                },
                repeatCardId: {
                    required: '请重复输入上面的银行卡',
                    equalTo: '两次输入的银行卡不一致'
                }
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var bank = form.find('select[name="bank"]');
                var bankBranch = form.find('input[name="bankBranch"]');
                var bankCardId = form.find('input[name="bankCardId"]');
                var withdrawPwd = form.find('input[name="withdrawPwd"]');
                doSubmit({
                    bankId: bank.val(),
                    bankBranch: bankBranch.val(),
                    bankCardId: bankCardId.val(),
                    withdrawPassword: withdrawPwd.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交
    var callback;
    var doSubmit = function (data) {
        AccountCtrl.request('BIND_CARD', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '添加银行卡成功！'
                    });
                    callback && callback();
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
    // 准备工作
    var doPrepare = function (callback) {
        AccountCtrl.request('PREPARE_BIND_CARD', {
            success: function (res) {
                if (res.error == 0) {
                    if (!res.data.withdrawName) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '您还没有绑定取款人！'
                        });
                        return;
                    }
                    if (!res.data.hasWithdrawPwd) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '您还没有设置资金密码！'
                        });
                        return;
                    }
                    callback && callback(res.data);
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
    // 初始化
    var init = function (cb) {
        callback = cb;
        doPrepare(function (data) {
            var content = initForm(data);
            ModalBoxUtils.init({
                width: 600,
                title: '添加银行卡',
                addClass: 'title-center',
                content: content
            });
        });
    };
    return {
        init: init
    }
}();

// 订单详情
var LotteryOrderModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div class="modal-table-wrapper lottery-order-details">\
                <table class="table table-bordered">\
                    <tbody>\
                        <tr>\
                            <td width="20%" class="text-center">订单号：</td>\
                            <td width="30%" data-field="billno"></td>\
                            <td width="20%" class="text-center">用户名：</td>\
                            <td width="30%" data-field="username"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">彩种：</td>\
                            <td data-field="lotteryName"></td>\
                            <td class="text-center">期号：</td>\
                            <td data-field="issue"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">玩法：</td>\
                            <td data-field="methodName"></td>\
                            <td class="text-center">注数：</td>\
                            <td data-field="nums"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">资金模式：</td>\
                            <td data-field="model"></td>\
                            <td class="text-center">倍数：</td>\
                            <td data-field="multiple"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">奖金模式：</td>\
                            <td data-field="bonusModel"></td>\
                            <td class="text-center">订单状态：</td>\
                            <td data-field="status"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">投注金额：</td>\
                            <td data-field="money"></td>\
                            <td class="text-center">中奖金额：</td>\
                            <td data-field="winMoney"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">加入时间：</td>\
                            <td data-field="orderTime"></td>\
                            <td class="text-center">截止时间：</td>\
                            <td data-field="stopTime"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">开奖号码：</td>\
                            <td colspan="3" data-field="openCode"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">投注内容：</td>\
                            <td colspan="3">\
                                <textarea name="content" readonly="readonly" class="order-content" style="height: 100px; padding: 2px 4px;"></textarea>\
                            </td>\
                        </tr>\
                    </tbody>\
                </table>\
                <div data-hidden="readOnly" class="actions">\
                    <a data-command="none" class="btn">无操作</a>\
                    <a data-command="cancel" class="btn btn-primary">撤销订单</a>\
                    <a data-command="back" class="btn btn-cancel">返回列表</a>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initContent = function (data, opts) {
        var content = getContent();

        var t = content.find('table');
        var bonusModel = data.code;
        if (data.point > 0) {
            bonusModel += ' + 返点' + data.point.toFixed(1) + '%';
        }
        t.find('[data-field="billno"]').html(data.billno);
        t.find('[data-field="username"]').html(data.account);
        t.find('[data-field="lotteryName"]').html(data.lottery);
        t.find('[data-field="issue"]').html(data.issue);
        t.find('[data-field="methodName"]').html(data.method);
        t.find('[data-field="nums"]').html(data.nums);
        t.find('[data-field="model"]').html(DataFormat.GameLotteryOrder.model(data.model));
        t.find('[data-field="multiple"]').html(data.multiple);
        t.find('[data-field="bonusModel"]').html(bonusModel);
        t.find('[data-field="status"]').html(DataFormat.GameLotteryOrder.status(data.status, true));
        t.find('[data-field="money"]').html(data.money.toFixed(3));
        t.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
        t.find('[data-field="orderTime"]').html(moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss'));
        t.find('[data-field="stopTime"]').html(moment(data.stopTime).format('YYYY-MM-DD HH:mm:ss'));
        t.find('[data-field="openCode"]').html(data.openCode == null ? '无' : data.openCode);
        t.find('textarea[name="content"]').html(data.content);

        if (opts.readOnly) {
            content.find('[data-hidden="readOnly"]').remove();
        }

        if (data.allowCancel) {
            content.find('[data-command="none"]').remove();
        } else {
            content.find('[data-command="cancel"]').remove();
        }

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确认撤销该订单吗？',
                confirmFn: function () {
                    doCancel(data.billno);
                }
            });
        });

        // 返回按钮事件
        content.find('[data-command="back"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };

    // 回调函数
    var callback = {};
    // 撤销订单
    var doCancel = function (billno) {
        GameLotteryCtrl.request('CANCEL_ORDER', {
            data: {
                billno: billno
            },
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的订单已成功撤销！'
                    });
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

    // 初始化
    var init = function (data, opts) {
        var content = initContent(data, opts);
        ModalBoxUtils.init({
            width: 800,
            title: '订单详情',
            addClass: 'title-center',
            content: content
        });
        if (opts.onCancel) {
            callback.onCancel = opts.onCancel;
        }
    };

    return {
        init: init
    }
}();

// 追号详情
var LotteryChaseModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div class="modal-table-wrapper lottery-order-details">\
                <div class="modal-tab">\
                    <div data-href="order" class="item active">订单详情</div>\
                    <div data-href="list" class="item">追号列表</div>\
                </div>\
                <div class="tab-content">\
                    <div data-tab="order" class="content-panel active">\
                        <table class="table table-bordered">\
                            <tbody>\
                                <tr>\
                                    <td width="20%" class="text-center">订单号：</td>\
                                    <td width="30%" data-field="billno"></td>\
                                    <td width="20%" class="text-center">用户名：</td>\
                                    <td width="30%" data-field="username"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">彩种：</td>\
                                    <td data-field="lotteryName"></td>\
                                    <td class="text-center">玩法：</td>\
                                    <td data-field="methodName"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">开始期号：</td>\
                                    <td data-field="startIssue"></td>\
                                    <td class="text-center">结束期号：</td>\
                                    <td data-field="endIssue"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">总期数：</td>\
                                    <td data-field="totalCount"></td>\
                                    <td class="text-center">已追期数：</td>\
                                    <td data-field="clearCount"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">注数：</td>\
                                    <td data-field="nums"></td>\
                                    <td class="text-center">资金模式：</td>\
                                    <td data-field="model"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">奖金模式：</td>\
                                    <td data-field="bonusModel"></td>\
                                    <td class="text-center">订单状态：</td>\
                                    <td data-field="status"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">总金额：</td>\
                                    <td data-field="totalMoney"></td>\
                                    <td class="text-center">总中奖：</td>\
                                    <td data-field="winMoney"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">下单时间：</td>\
                                    <td data-field="orderTime"></td>\
                                    <td class="text-center">中奖后停止追号：</td>\
                                    <td data-field="isWinStop"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">投注内容：</td>\
                                    <td colspan="3">\
                                        <textarea name="content" readonly="readonly" class="order-content" style="height: 100px; padding: 2px 4px;"></textarea>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        <div data-hidden="readOnly" class="actions">\
                            <a data-command="none" class="btn">无操作</a>\
                            <a data-command="cancel" class="btn btn-primary">撤销追单</a>\
                            <a data-command="back" class="btn btn-cancel">返回列表</a>\
                        </div>\
                    </div>\
                    <div data-tab="list" class="content-panel">\
                        <table class="table table-bordered table-data no-margin">\
                            <thead>\
                                <tr>\
                                    <td width="15%" class="text-center">期号</td>\
                                    <td width="10%" class="text-center">倍数</td>\
                                    <td width="20%" class="text-center">开奖时间</td>\
                                    <td width="10%" class="text-center">投注金额</td>\
                                    <td width="10%" class="text-center">中奖金额</td>\
                                    <td width="10%" class="text-center">状态</td>\
                                    <td width="15%" class="text-center">开奖号码</td>\
                                    <td width="10%" class="text-center">操作</td>\
                                </tr>\
                            </thead>\
                        </table>\
                        <div class="scroll-list">\
                            <table data-table="list" class="table table-bordered table-data no-margin">\
                                <tbody></tbody>\
                            </table>\
                        </div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initContent = function (data, opts) {
        var content = getContent();

        var modalTab = content.find('.modal-tab');
        var tabContent = content.find('.tab-content');

        // 初始化点击方法
        modalTab.find('.item').click(function () {
            if (!$(this).hasClass('active')) {
                modalTab.find('.item').removeClass('active');
                $(this).addClass('active');
                var dataHref = $(this).attr('data-href');
                tabContent.find('.content-panel').removeClass('active');
                tabContent.find('[data-tab="' + dataHref + '"]').addClass('active');
            }
        });

        var tabOrder = tabContent.find('[data-tab="order"]');
        var tabList = tabContent.find('[data-tab="list"]');

        // 构建订单详情
        var bonusModel = data.code;
        if (data.point > 0) {
            bonusModel += ' + 返点' + data.point.toFixed(1) + '%';
        }
        tabOrder.find('[data-field="billno"]').html(data.billno);
        tabOrder.find('[data-field="username"]').html(data.account);
        tabOrder.find('[data-field="lotteryName"]').html(data.lottery);
        tabOrder.find('[data-field="methodName"]').html(data.method);
        tabOrder.find('[data-field="startIssue"]').html(data.startIssue);
        tabOrder.find('[data-field="endIssue"]').html(data.endIssue);
        tabOrder.find('[data-field="totalCount"]').html(data.totalCount);
        tabOrder.find('[data-field="clearCount"]').html(data.clearCount);
        tabOrder.find('[data-field="nums"]').html(data.nums);
        tabOrder.find('[data-field="model"]').html(DataFormat.GameLotteryOrder.model(data.model));
        tabOrder.find('[data-field="bonusModel"]').html(bonusModel);
        tabOrder.find('[data-field="status"]').html(DataFormat.GameLotteryChase.status(data.status));
        tabOrder.find('[data-field="isWinStop"]').html(data.isWinStop ? '是' : '否');
        tabOrder.find('[data-field="totalMoney"]').html(data.totalMoney.toFixed(3));
        tabOrder.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
        tabOrder.find('[data-field="orderTime"]').html(moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss'));
        tabOrder.find('textarea[name="content"]').html(data.content);

        if (opts.readOnly) {
            tabOrder.find('[data-hidden="readOnly"]').remove();
        }

        if (data.allowCancel) {
            tabOrder.find('[data-command="none"]').remove();
        } else {
            tabOrder.find('[data-command="cancel"]').remove();
        }

        // 取消按钮事件
        tabOrder.find('[data-command="cancel"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确认撤销该追单吗？',
                confirmFn: function () {
                    doCancelChase(data.billno);
                }
            });
        });

        // 返回按钮事件
        tabOrder.find('[data-command="back"]').click(function () {
            ModalBoxUtils.close();
        });

        var listTable = tabList.find('[data-table="list"]');
        // 构建追单列表
        $.each(data.chaseList, function (i, v) {
            var btnAction = '无操作';
            if (v.allowCancel) {
                btnAction = '<a data-command="cancel">撤单</a>';
            }
            var tmp =
                '<tr>\
                    <td width="15%" class="text-center">' + v.issue + '</td>\
                    <td width="10%" class="text-center">' + v.multiple + '</td>\
                    <td width="20%" class="text-center">' + moment(v.openTime).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                    <td width="10%" class="text-center">' + v.money.toFixed(3) + '</td>\
                    <td width="10%" class="text-center">' + v.winMoney.toFixed(3) + '</td>\
                    <td width="10%" data-field="status" class="text-center">' + DataFormat.GameLotteryOrder.status(v.status, true) + '</td>\
                    <td width="15%" class="text-center">' + (v.openCode ? v.openCode : '无') + '</td>\
                    <td width="10%" data-field="action" class="text-center">' + btnAction + '</td>\
                </tr>';
            var $thisRow = $(tmp);
            $thisRow.find('[data-command="cancel"]').click(function () {
                AlertUtils.confirm({
                    icon: 'question',
                    content: '确定要撤销订单？',
                    confirmFn: function () {
                        doCancelOrder(v.billno, function () {
                            $thisRow.find('[data-field="status"]').html('已撤单');
                            $thisRow.find('[data-field="action"]').html('无操作');
                        });
                    }
                });
            });
            listTable.find('tbody').append($thisRow);
        });

        content.find('.scroll-list').perfectScrollbar();

        return content;
    };

    // 回调函数
    var callback = {};
    // 撤销订单
    var doCancelChase = function (billno) {
        GameLotteryCtrl.request('CANCEL_CHASE', {
            data: {
                billno: billno
            },
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的追单已成功撤销'
                    });
                    callback.onCancel && callback.onCancel();
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

    // 撤掉追单
    var doCancelOrder = function (billno, cb) {
        GameLotteryCtrl.request('CANCEL_ORDER', {
            data: {
                billno: billno
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的订单已成功撤销'
                    });
                    cb && cb();
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

    // 初始化
    var init = function (data, opts) {
        var content = initContent(data, opts);
        ModalBoxUtils.init({
            width: 800,
            height: 600,
            title: '订单详情',
            addClass: 'title-center',
            content: content
        });
        if (opts.onCancel) {
            callback.onCancel = opts.onCancel;
        }
    };

    return {
        init: init
    }
}();

// 代理转账
var AgentTransferModal = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-transfer">\
                <form class="form-horizontal">\
                    <div class="form-body">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">收款用户</label>\
                            <div class="col-sm-8">\
                                <p data-field="username" class="form-control-static"></p>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">转账类型</label>\
                            <div class="col-sm-8">\
                                <select name="transType" class="form-control">\
                                    <option value="0">普通转账</option>\
                                    <option value="1">工资转账</option>\
                                </select>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">转账金额</label>\
                            <div class="col-sm-8">\
                                <input name="amount" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">密保问题</label>\
                            <div class="col-sm-8">\
                                <input name="sid" type="hidden">\
                                <p data-field="question" class="form-control-static"></p>\
                                <div class="form-help"></div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">密保答案</label>\
                            <div class="col-sm-8">\
                                <input name="answer" type="text" class="form-control" autocomplete="off">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">输入资金密码</label>\
                            <div class="col-sm-8">\
                                <input name="withdrawPwd" type="password" class="form-control">\
                                <div class="form-help">\
                                    <span class="help-block"></span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="form-actions">\
                        <a data-command="submit" class="btn btn-primary">确定添加</a>\
                        <a data-command="cancel" class="btn btn-cancel">取消</a>\
                    </div>\
                </form>\
            </div>';
        return $(tpl);
    };
    // 设置数据
    var setData = function (form, data) {
        if (!data.security) alert("转帐前请先至“个人中心”设置密保问题！");
        form.find('[data-field="username"]').html(data.uAccount.username);
        form.find('input[name="sid"]').val(data.security.id);
        form.find('[data-field="question"]').html(data.security.question);
    };
    // 初始化内容
    var initContent = function (data) {
        var content = getContent();
        var form = content.find('form');
        setData(form, data);
        // 初始化验证
        ValidateFormUtils.init(form, {
            rules: {
                amount: {
                    required: true,
                    number: true,
                    min: 0.01
                },
                answer: 'required',
                withdrawPwd: 'required'
            },
            messages: {
                amount: {
                    required: '请输入转账金额',
                    number: '请输入正确的转账金额',
                    min: '转账金额必须大于0'
                },
                answer: '请输入密保答案',
                withdrawPwd: '请输入您的资金密码'
            }
        });
        // 提交按钮事件
        form.find('[data-command="submit"]').click(function () {
            if (form.validate().form()) {
                var username = form.find('[data-field="username"]');
                var transType = form.find('select[name="transType"]');
                var amount = form.find('input[name="amount"]');
                var sid = form.find('input[name="sid"]');
                var answer = form.find('input[name="answer"]');
                var withdrawPwd = form.find('input[name="withdrawPwd"]');
                doTransfer({
                    username: username.html(),
                    transType: transType.val(),
                    amount: amount.val(),
                    securityId: sid.val(),
                    answer: answer.val(),
                    withdrawPassword: withdrawPwd.val()
                });
            }
        });
        // 取消按钮事件
        form.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交请求
    var callback;
    var doTransfer = function (data) {
        AgentCtrl.request('APPLY_TRANSFER', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您已成功转账到下级用户！'
                    });
                    callback && callback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        AgentCtrl.request('PREPARE_TRANSFER', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        callback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 560,
                title: '转账到下级',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();

// 代理编辑配额
var AgentEditQuotaModal = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-quota">\
                <div class="modal-table-wrapper">\
                    <table data-table="account" class="table table-bordered">\
                    <tbody>\
                        <tr>\
                            <td width="25%" class="text-center">用户名：<span data-field="username"></span></td>\
                            <td width="25%" class="text-center">昵称：<span data-field="nickname"></span></td>\
                            <td width="25%" class="text-center">彩票返点：<span data-field="lotteryPoint"></span></td>\
                            <td width="25%" class="text-center">彩票余额：<span data-field="lotteryBalance"></span></td>\
                        </tr>\
                    </tbody>\
                    </table>\
                    <table data-table="quota" class="table table-bordered table-data">\
                    <thead>\
                        <tr>\
                            <td width="25%" class="text-center">开户区间</td>\
                            <td width="25%" class="text-center">我的剩余数量</td>\
                            <td width="25%" class="text-center">下级剩余数量</td>\
                            <td width="25%" class="text-center">增减下级数量</td>\
                        </tr>\
                    </thead>\
                    <tbody></tbody>\
                    </table>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定修改</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initTable = function (content, data) {
        var tableAccount = content.find('[data-table="account"]');
        var tableQuota = content.find('[data-table="quota"]');

        // 设置表格
        tableAccount.find('[data-field="username"]').html(data.uAccount.username);
        tableAccount.find('[data-field="nickname"]').html(data.uAccount.nickname);
        tableAccount.find('[data-field="lotteryPoint"]').html(data.uGameLotteryAccount.point.toFixed(1));
        tableAccount.find('[data-field="lotteryBalance"]').html(data.uGameLotteryAccount.availableBalance.toFixed(3));

        // 设置配额
        var uQuotaList = data.uLotteryCodeQuotaList; // 下级的配额
        var mQuotaList = data.mLotteryCodeQuotaList; // 自己的配额
        $.each(uQuotaList, function (i, v) {
            var tpl =
                '<tr class="with-input">\
                    <td class="text-center">' + v.minPoint.toFixed(1) + ' ~ ' + v.maxPoint.toFixed(1) + '</td>\
                    <td class="text-center">' + mQuotaList[i].surplusAmount + '</td>\
                    <td class="text-center">' + v.surplusAmount + '</td>\
                    <td class="text-center">\
                        <input type="text" class="form-control input-sm" value="0" autocomplete="off">\
                    </td>\
                </tr>';
            var $thisRow = $(tpl);
            tableQuota.append($thisRow);
        });
    };
    // 获得配额
    var getEditAmounts = function (content) {
        var array = [];
        var tableQuota = content.find('[data-table="quota"]');
        tableQuota.find('tbody > tr').each(function () {
            var val = Number($(this).find('input').val());
            val = isNaN(val) ? 0 : val;
            array.push(val);
        });
        return array;
    };
    // 初始化内容
    var initContent = function (data) {
        var content = getContent();
        initTable(content, data);
        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var amounts = getEditAmounts(content).toString();
            doSubmit({
                username: username,
                amounts: amounts
            });
        });
        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交请求
    var doSubmit = function (data) {
        AgentCtrl.request('EDIT_QUOTA', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改下级开户额成功！'
                    });
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
    // 准备工作
    var doPrepare = function (data, callback) {
        AgentCtrl.request('PREPARE_EDIT_QUOTA', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    if (res.data.uLotteryCodeQuotaList.length == 0) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '该用户无法分配配额！'
                        });
                        return;
                    }
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data) {
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '增减开户额',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();

// 代理配额升点
var AgentEditPointByQuotaModal = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-point-by-quota">\
                <div class="modal-table-wrapper">\
                    <table data-table="account" class="table table-bordered">\
                    <tbody>\
                        <tr>\
                            <td width="25%" class="text-center">用户名：<span data-field="username"></span></td>\
                            <td width="25%" class="text-center">昵称：<span data-field="nickname"></span></td>\
                            <td width="25%" class="text-center">彩票返点：<span data-field="lotteryPoint"></span></td>\
                            <td width="25%" class="text-center">彩票余额：<span data-field="lotteryBalance"></span></td>\
                        </tr>\
                    </tbody>\
                    </table>\
                    <form class="form-horizontal m-b-20">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">调整返点</label>\
                            <div class="col-sm-6">\
                                <input name="point" type="text" class="form-control" autocomplete="off">\
                            </div>\
                            <div class="col-sm-3">\
                                <span data-help="point" class="help-block"></span>\
                            </div>\
                        </div>\
                    </form>\
                    <table data-table="quota" class="table table-bordered table-data">\
                    <thead>\
                        <tr>\
                            <td width="25%" class="text-center">开户区间</td>\
                            <td width="25%" class="text-center">总数量</td>\
                            <td width="25%" class="text-center">已使用</td>\
                            <td width="25%" class="text-center">剩余</td>\
                        </tr>\
                    </thead>\
                    <tbody></tbody>\
                    </table>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定修改</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initTable = function (content, data) {
        var tableAccount = content.find('[data-table="account"]');
        var tableQuota = content.find('[data-table="quota"]');

        // 设置表格
        tableAccount.find('[data-field="username"]').html(data.uAccount.username);
        tableAccount.find('[data-field="nickname"]').html(data.uAccount.nickname);
        tableAccount.find('[data-field="lotteryPoint"]').html(data.uGameLotteryAccount.point.toFixed(1));
        tableAccount.find('[data-field="lotteryBalance"]').html(data.uGameLotteryAccount.availableBalance.toFixed(3));

        // 设置返点
        content.find('input[name="point"]').val(data.uGameLotteryAccount.point.toFixed(1));

        if (data.isNeedQuota) {
            // 设置配额
            var mQuotaList = data.mLotteryCodeQuotaList; // 自己的配额
            $.each(mQuotaList, function (i, v) {
                var formatPoint = v.minPoint.toFixed(1);
                if (v.minPoint != v.maxPoint) {
                    formatPoint += ' ~ ' + v.maxPoint.toFixed(1);
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">' + formatPoint + '</td>\
                        <td class="text-center">' + v.totalAmount + '</td>\
                        <td class="text-center">' + (v.totalAmount - v.surplusAmount) + '</td>\
                        <td class="text-center">' + v.surplusAmount + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                tableQuota.append($thisRow);
            });
        } else {
            tableQuota.hide();
        }
    };
    // 初始化帮助
    var initHelp = function (content, data) {
        var minPoint = data.uGameLotteryAccount.point;
        var maxPoint = data.mGameLotteryAccount.point;
        if (!data.mGameLotteryAccount.allowEqualCode) {
            maxPoint = maxPoint - 0.1;
        }
        var helpSpan = content.find('[data-help="point"]');
        if (minPoint < maxPoint) {
            helpSpan.html('调整区间：' + minPoint.toFixed(1) + '~' + maxPoint.toFixed(1));
        } else {
            helpSpan.html('无法调整该用户返点');
            content.find('input[name="point"]').attr('disabled', true);
        }
    };
    // 初始化内容
    var initContent = function (data) {
        var content = getContent();
        initTable(content, data);
        initHelp(content, data);
        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var point = Number(content.find('input[name="point"]').val());
            if (isNaN(point) || point < 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '请填写正确的返点！'
                });
                return false;
            }
            doSubmit({
                username: username,
                point: point
            });
        });
        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交请求
    var doSubmit = function (data) {
        AgentCtrl.request('EDIT_POINT_BY_QUOTA', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改下级返点成功！'
                    });
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
    // 准备工作
    var doPrepare = function (data, callback) {
        AgentCtrl.request('PREPARE_EDIT_POINT_BY_QUOTA', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data) {
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '配额升点',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();

// 代理按量升点
var AgentEditPointByAmountModal = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-point-by-amount">\
                <div class="modal-table-wrapper">\
                    <table data-table="account" class="table table-bordered">\
                    <tbody>\
                        <tr>\
                            <td width="25%" class="text-center">用户名：<span data-field="username"></span></td>\
                            <td width="25%" class="text-center">昵称：<span data-field="nickname"></span></td>\
                            <td width="25%" class="text-center">彩票返点：<span data-field="lotteryPoint"></span></td>\
                            <td width="25%" class="text-center">彩票余额：<span data-field="lotteryBalance"></span></td>\
                        </tr>\
                    </tbody>\
                    </table>\
                    <form class="form-horizontal m-b-20">\
                        <div class="form-group">\
                            <label class="col-sm-3 control-label">调整返点</label>\
                            <div class="col-sm-6">\
                                <select name="point" class="form-control"></select>\
                            </div>\
                            <div class="col-sm-3">\
                                <span class="help-block">按量升点不占配额</span>\
                            </div>\
                        </div>\
                    </form>\
                    <table data-table="quota" class="table table-bordered table-data">\
                    <thead>\
                        <tr>\
                            <td width="30%" class="text-center">返点</td>\
                            <td width="35%" class="text-center">3天量</td>\
                            <td width="35%" class="text-center">7天量</td>\
                        </tr>\
                    </thead>\
                    <tbody></tbody>\
                    </table>\
                    <div class="row">\
                        <div class="col-md-12 text-center m-b-20">该会员近一个月团队3天量为：<span data-field="amount3">0.000</span>；7天量为：<span data-field="amount7">0.000</span></div>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定修改</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initTable = function (content, data) {
        var tableAccount = content.find('[data-table="account"]');
        var tableQuota = content.find('[data-table="quota"]');

        // 设置表格
        tableAccount.find('[data-field="username"]').html(data.uAccount.username);
        tableAccount.find('[data-field="nickname"]').html(data.uAccount.nickname);
        tableAccount.find('[data-field="lotteryPoint"]').html(data.uGameLotteryAccount.point.toFixed(1));
        tableAccount.find('[data-field="lotteryBalance"]').html(data.uGameLotteryAccount.availableBalance.toFixed(3));

        // 设置配额
        var uPoint = data.uGameLotteryAccount.point;
        var selectPoint = content.find('select[name="point"]');
        $.each(data.uAmountList, function (i, v) {
            var tpl =
                '<tr>\
                    <td class="text-center">' + v.point.toFixed(1) + '</td>\
                    <td class="text-center">' + v.amount3 + '</td>\
                    <td class="text-center">' + v.amount7 + '</td>\
                </tr>';
            var $thisRow = $(tpl);
            tableQuota.append($thisRow);
            if (v.point > uPoint) {
                selectPoint.append('<option value="' + v.point.toFixed(1) + '">' + v.point.toFixed(1) + '</option>');
            }
        });

        // 团队消费量
        content.find('[data-field="amount3"]').html(data.uTeamMaxAmount[0].toFixed(3));
        content.find('[data-field="amount7"]').html(data.uTeamMaxAmount[1].toFixed(3));
    };
    // 初始化内容
    var initContent = function (data) {
        var content = getContent();
        initTable(content, data);
        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var point = Number(content.find('select[name="point"]').val());
            doSubmit({
                username: username,
                point: point
            });
        });
        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 提交请求
    var doSubmit = function (data) {
        AgentCtrl.request('EDIT_POINT_BY_AMOUNT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '修改下级返点成功！'
                    });
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
    // 准备工作
    var doPrepare = function (data, callback) {
        AgentCtrl.request('PREPARE_EDIT_POINT_BY_AMOUNT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    if (res.data.uAmountList.length == 0) {
                        AlertUtils.alert({
                            icon: 'info',
                            content: '该用户无法进行按量升点！'
                        });
                        return;
                    }
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data) {
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '配额升点',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();

// 代理签订工资契约
var AgentEditSalaryModal = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-salary-contract">\
                <div class="modal-table-wrapper">\
                    <div data-field="title" class="text-center f-16 m-b-20"></div>\
                    <table style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td>契约状态：<span data-field="status">未签订契约</span></td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <table data-table="baseRules" style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td width="30%">工资比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                        <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="3"> 人</td>\
                        <td style="line-height: 34px">（设置范围：<span data-field="baseMinPoint">0</span>% ~ <span data-field="baseMaxPoint">0</span>%）</td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <div class="scroll-list always-visible with-margin-30" style="position: relative; max-height: 255px;overflow-y: auto;">\
                        <table data-table="extraRules" style="margin: 0" class="table table-contract">\
                        <tbody>\
                        </tbody>\
                        </table>\
                    </div>\
                    <div style="height: 10px; clear: both;"></div>\
                    <div class="tips" style="border: 1px solid #eee; text-align: center; padding: 10px 20px; margin-bottom: 20px;">\
                        （附加工资比例设置范围：<span data-field="extraMinPoint">0</span>% ~ <span data-field="extraMaxPoint">0</span>%） <a data-command="add" class="btn btn-primary btn-xs btn-mini">增加规则</a>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        var baseRules = content.find('[data-table="baseRules"]');
        var extraRules = content.find('[data-table="extraRules"]');

        // 代理契约
        var mContract = data.mContract;
        // 下级契约
        var uContract = data.uContract;

        var scrollList = content.find('.scroll-list');
        scrollList.perfectScrollbar();

        var updateScrollList = function () {
            scrollList.perfectScrollbar('update');
        };

        var getRowTpl = function () {
            var tpl =
                '<tr>\
                    <td width="30%">周期消费：<input name="totalConsume" type="text" class="form-control input-half"> 万</td>\
                    <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="3"> 人</td>\
                    <td width="30%">工资比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                    <td width="10%"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
                </tr>';
            var $thisRow = $(tpl);
            $thisRow.find('[data-command="del"]').click(function () {
                $(this).parents('tr').remove();
                updateScrollList();
            });
            var activeUser = $thisRow.find('input[name="activeUser"]');
            activeUser.bind('input', function () {//给文本框绑定input事件
                setTimeout(function () {
                    if (activeUser.val() < 1) {
                        activeUser.val("1");
                        AlertUtils.alert({
                            icon: 'error',
                            content: '最小值为1'
                        });
                    };
                }, 3000);
            });
            return $thisRow;
        };

        var initExtraRules = function (rules) {
            if (rules) {
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(parseInt(v.scalePoint * 100) / 100).attr('disabled', true);
                    $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            } else {
                for (var i = 0; i < 3; i++) {
                    var $thisRow = getRowTpl();
                    extraRules.find('tbody').append($thisRow);
                }
            }
        };

        content.find('[data-command="add"]').click(function () {
            var $thisRow = getRowTpl();
            extraRules.find('tbody').append($thisRow);
            updateScrollList();
        });

        if (uContract != null) {
            content.find('[data-field="title"]').html('已经与下级代理【' + data.uUsername + '】签订契约工资');
            baseRules.find('input[name="scalePoint"]').val(parseInt(uContract.scalePoint * 100) / 100).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(uContract.activeUser).attr('disabled', true);
            if (uContract.extraRules) {
                initExtraRules(uContract.extraRules);
            }
            content.find('.tips').hide();
            if (uContract.status == 0) {
                content.find('[data-field="status"]').html('待确定工资').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                content.find('[data-field="status"]').html('已签订工资').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                content.find('[data-field="status"]').html('拒签工资').css('color', '#FB5D6A');
                baseRules.find('input[name="scalePoint"]').attr('disabled', false);
                baseRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="totalConsume"]').attr('disabled', false);
                extraRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="scalePoint"]').attr('disabled', false);
                extraRules.find('[data-command="del"]').removeClass('disabled');
                content.find('.tips').show();
            }
        } else {
            content.find('[data-field="title"]').html('正在与下级代理【' + data.uUsername + '】签订契约工资');
            content.find('[data-field="status"]').html('未签订契约');
            initExtraRules();
            content.find('.tips').show();
        }

        var activeUser = baseRules.find('input[name="activeUser"]');
        activeUser.bind('input', function () {//给文本框绑定input事件
            setTimeout(function () {
                if (activeUser.val() < 1) {
                    activeUser.val("1");
                    AlertUtils.alert({
                        icon: 'error',
                        content: '最小值为1'
                    });
                };
            }, 3000);
        });

        // 契约范围
        var baseMinPoint = 0.1;
        var baseMaxPoint = mContract.scalePoint;
        var extraMinPoint = 0.1;
        var extraMaxPoint = mContract.scalePoint;

        content.find('[data-field="baseMinPoint"]').html(baseMinPoint);
        content.find('[data-field="baseMaxPoint"]').html(baseMaxPoint);

        var refreshExtraPoint = function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            if (!isNaN(scalePoint) && scalePoint >= baseMinPoint && scalePoint <= baseMaxPoint) {
                var thisMinPoint = (scalePoint + 0.1).toFixed(1);
                if (thisMinPoint > extraMaxPoint) {
                    content.find('[data-field="extraMinPoint"]').html(extraMaxPoint);
                } else {
                    content.find('[data-field="extraMinPoint"]').html(thisMinPoint);
                }
            } else {
                content.find('[data-field="extraMinPoint"]').html(extraMinPoint);
            }
            content.find('[data-field="extraMaxPoint"]').html(extraMaxPoint);
        };

        refreshExtraPoint();

        baseRules.find('input[name="scalePoint"]').blur(function () {
            refreshExtraPoint();
        });

        var getExtraRules = function () {
            var array = [];
            extraRules.find('tbody > tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (totalConsume != 0 && activeUser != 0 && scalePoint != 0) {
                    array.push({
                        totalConsume: totalConsume,
                        activeUser: activeUser,
                        scalePoint: scalePoint
                    });
                }
            });
            return array;
        };

        // 提交按钮事件
        var username = data.uUsername;
        content.find('[data-command="submit"]').click(function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            var activeUser = parseInt(baseRules.find('input[name="activeUser"]').val());
            var extraRules = JSON.stringify(getExtraRules());
            doSubmit({
                username: username,
                extraRules: extraRules
            });
        });

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    var sCallback;
    // 提交请求
    var doSubmit = function (data) {
        ContractCtrl.request('APPLY_EDIT_SALARY_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约工资签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        ContractCtrl.request('PREPARE_EDIT_SALARY_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    // 0.1的用户无法签约下级契约
                    if (res.data.mContract.scalePoint <= 0.1) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: '您无法签订契约工资'
                        });
                        return false;
                    }
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '签订契约工资',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();
// 代理签订工资契约（第二套：间隙返）
var AgentEditSalaryModal2 = function () {

    // 获取内容
    var getContent = function () {
        var tpl = `    <div class="modal-table-wrapper">
                        <div data-field="title" class="text-center f-16 m-b-20"></div>
                        <table style="margin: 0" class="table table-contract">
                            <tbody>
                                <tr>
                                    <td>契约状态：<span data-field="status">未签订契约</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="extra-rules">
                            <div class="table-title">
                                <table data-table="head" class="table table-contract">
                                    <thead>
                                    <tr>
                                        <td class="input-field text-center">日消费金额</td>
                                        <td class="input-field text-center">日工资金额</td>
                                        <td class="input-field text-center">日活跃用户</td>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-list">
                                <table data-table="body" class="table">
                                    <tbody>
                                    <tr>
                                        <td class="input-field text-center">每 <input name="unitConsume" type="text" disabled="disabled"> 元</td>
                                        <td class="input-field text-center">返 <input name="unitAmount" type="text"> 元</td>
                                        <td class="input-field text-center"> <input name="activeUser" type="text"> 人</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tips">
                            工资金额设置范围：<span data-field="minAmount">0</span> ~ <span data-field="maxAmount">0</span> 元
                        </div>
                        <div class="row">
                            <div class="col-md-3"></div>
                            <div class="col-md-3">
                                <a data-command="submit" class="btn btn-success btn-block">确定</a>
                            </div>
                            <div class="col-md-3">
                                <a data-command="cancel" class="btn btn-primary btn-block">取消</a>
                            </div>
                            <div class="col-md-3"></div>
                        </div>
                    </div>`;
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();
        // 最小工资金额
        var minAmount = data.minAmount;
        // 最大工资金额
        var maxAmount = data.maxAmount;
        // 单位消费比例
        var unitConsume = data.unitConsume;
        // 自己的用户名
        var mUsername = data.mUsername;
        // 下级的用户名
        var uUsername = data.uUsername;
        // 自己的契约
        var mContract = data.mContract;
        // 下级的契约
        var uContract = data.uContract;
        // 标题
        var thisTitle = content.find('[data-field="title"]');
        // 状态
        var thisStatus = content.find('[data-field="status"]');
        // 初始化帮助
        content.find('.tips').find('[data-field="minAmount"]').html(minAmount);
        content.find('.tips').find('[data-field="maxAmount"]').html(maxAmount);
        // 判断下级契约是否存在
        
        if (uContract != null) {
            // 设置标题
            thisTitle.html('已经与下级代理【' + uUsername + '】签订契约日工资');
            // 根据状态，来设置状态
            if (uContract.status == 0) {
                thisStatus.html('待确定工资').css('color', '#ff7825');
            }
            if (uContract.status == 1) {
                thisStatus.html('已签订工资').css('color', '#3f9b9c');
            }
            if (uContract.status == -1) {
                thisStatus.html('拒签工资').css('color', '#ff0000');
            }
            // 初始化规则
            if (uContract.extraRules) {
                // 设置值
                var extraRulesValue = JSON.parse(uContract.extraRules);
                content.find('input[name="unitConsume"]').val(extraRulesValue.unitConsume);
                content.find('input[name="unitAmount"]').val(extraRulesValue.unitAmount);
                content.find('input[name="activeUser"]').val(uContract.activeUser);
            }
            // 下级用户拒绝后，才可以修改
            if (uContract.status == -1) {
                content.find('input[name="unitAmount"]').attr('disabled', false);
                content.find('input[name="activeUser"]').attr('disabled', false);
            } else {
                // 反之则不可以修改
                content.find('input[name="unitAmount"]').attr('disabled', true);
                content.find('input[name="activeUser"]').attr('disabled', true);
            }
        } else {
            // 设置标题
            thisTitle.html('正在与下级代理【' + uUsername + '】签订契约日工资');
            // 设置状态
            thisStatus.find('span').html('未签订契约');
            // 设置值
            content.find('input[name="unitConsume"]').val(unitConsume);

        }
        // 提交按钮事件
        content.find('[data-command="submit"]').click(function () {
            var username = uUsername;
            var unitConsume = parseFloat(content.find('input[name="unitConsume"]').val());
            if (isNaN(unitConsume) || unitConsume <= 0) {
                return false;
            }
            var unitAmount = parseInt(content.find('input[name="unitAmount"]').val());
            if (isNaN(unitAmount) || unitAmount <= 0) {
                return false;
            }
            var activeUser = parseInt(content.find('input[name="activeUser"]').val());
            if (isNaN(activeUser) || activeUser <= 0) {
                return false;
            }
            var extraRules = JSON.stringify({
                unitConsume: unitConsume,
                unitAmount: unitAmount,
            });
            doSubmit({
                username: username,
                extraRules: extraRules,
                activeUser: activeUser
            });
        });
        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    var sCallback;
    // 提交请求
    var doSubmit = function (data) {
        ContractCtrl.request('APPLY_EDIT_SALARY_CONTRACT2', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约工资签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        ContractCtrl.request('PREPARE_EDIT_SALARY_CONTRACT2', {
            data: data,
            success: function (res) {
                //var res = {"error":0,"code":null,"message":"请求成功","data":{"minAmount":10,"uUsername":"xiaocao1","uContract":{"id":19077,"accountTo":4543,"accountFrom":11,"scalePoint":0.0,"activeUser":0,"extraRules":"{\"unitAmount\":\"60\",\"unitConsume\":\"10000\"}","status":0},"mUsername":"kefuboss","unitConsume":10000,"maxAmount":220,"mContract":{"id":14197,"accountTo":11,"accountFrom":1,"scalePoint":0.0,"activeUser":0,"extraRules":"{\"unitConsume\":10000,\"unitAmount\":220}","status":1}}}
                if (res.error == 0) {

                    var minAmount = res.data.minAmount;
                    var mContract = res.data.mContract;
                    var extraRules = JSON.parse(mContract.extraRules);
                    if (extraRules.unitAmount <= minAmount) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: '您无法签订契约日工资'
                        });
                        return false;
                    }

                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 640,
                title: '签订契约工资',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();
// 代理签订工资契约(第三套：老平台)
var AgentEditSalaryModal3 = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-salary-contract">\
                <div class="modal-table-wrapper">\
                    <div data-field="title" class="text-center f-16 m-b-20"></div>\
                    <table style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td>契约状态：<span data-field="status">未签订契约</span></td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <table data-table="baseRules" style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td width="30%">工资比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                        <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="1"> 人</td>\
                        <td style="line-height: 34px">（设置范围：<span data-field="baseMinPoint">0</span>% ~ <span data-field="baseMaxPoint">0</span>%）</td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <div class="scroll-list always-visible with-margin-30" style="position: relative; max-height: 255px;overflow-y: auto;">\
                        <table data-table="extraRules" style="margin: 0" class="table table-contract">\
                        <tbody>\
                        </tbody>\
                        </table>\
                    </div>\
                    <div style="height: 10px; clear: both;"></div>\
                    <div class="tips" style="border: 1px solid #eee; text-align: center; padding: 10px 20px; margin-bottom: 20px;">\
                        （附加工资比例设置范围：<span data-field="extraMinPoint">0</span>% ~ <span data-field="extraMaxPoint">0</span>%） <a data-command="add" class="btn btn-primary btn-xs btn-mini">增加规则</a>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        var baseRules = content.find('[data-table="baseRules"]');
        var extraRules = content.find('[data-table="extraRules"]');

        // 代理契约
        var mContract = data.mContract;
        // 下级契约
        var uContract = data.uContract;

        var scrollList = content.find('.scroll-list');
        scrollList.perfectScrollbar();

        var updateScrollList = function () {
            scrollList.perfectScrollbar('update');
        };

        var getRowTpl = function () {
            var tpl =
                '<tr>\
                    <td width="30%">周期消费：<input name="totalConsume" type="text" class="form-control input-half"> 万</td>\
                    <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="1"> 人</td>\
                    <td width="30%">工资比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                    <td width="10%"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
                </tr>';
            var $thisRow = $(tpl);
            $thisRow.find('[data-command="del"]').click(function () {
                $(this).parents('tr').remove();
                updateScrollList();
            });
            var activeUser = $thisRow.find('input[name="activeUser"]');
            activeUser.bind('input', function () {//给文本框绑定input事件
                setTimeout(function () {
                    if (activeUser.val() < 1) {
                        activeUser.val("1");
                        AlertUtils.alert({
                            icon: 'error',
                            content: '最小值为1'
                        });
                    };
                }, 3000);
            });
            return $thisRow;
        };

        var initExtraRules = function (rules) {
            if (rules) {
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(parseInt(v.scalePoint * 100) / 100).attr('disabled', true);
                    $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            } else {
                for (var i = 0; i < 3; i++) {
                    var $thisRow = getRowTpl();
                    extraRules.find('tbody').append($thisRow);
                }
            }
        };

        content.find('[data-command="add"]').click(function () {
            var $thisRow = getRowTpl();
            extraRules.find('tbody').append($thisRow);
            updateScrollList();
        });

        if (uContract != null) {
            content.find('[data-field="title"]').html('已经与下级代理【' + data.uAccount.username + '】签订契约工资');
            baseRules.find('input[name="scalePoint"]').val(parseInt(uContract.scalePoint * 100) / 100).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(uContract.activeUser).attr('disabled', true);
            if (uContract.extraRules) {
                initExtraRules(uContract.extraRules);
            }
            content.find('.tips').hide();
            if (uContract.status == 0) {
                content.find('[data-field="status"]').html('待确定工资').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                content.find('[data-field="status"]').html('已签订工资').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                content.find('[data-field="status"]').html('拒签工资').css('color', '#FB5D6A');
                baseRules.find('input[name="scalePoint"]').attr('disabled', false);
                baseRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="totalConsume"]').attr('disabled', false);
                extraRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="scalePoint"]').attr('disabled', false);
                extraRules.find('[data-command="del"]').removeClass('disabled');
                content.find('.tips').show();
            }
        } else {
            content.find('[data-field="title"]').html('正在与下级代理【' + data.uAccount.username + '】签订契约工资');
            content.find('[data-field="status"]').html('未签订契约');
            initExtraRules();
            content.find('.tips').show();
        }

        var activeUser = baseRules.find('input[name="activeUser"]');
        activeUser.bind('input', function () {//给文本框绑定input事件
            setTimeout(function () {
                if (activeUser.val() < 1) {
                    activeUser.val("1");
                    AlertUtils.alert({
                        icon: 'error',
                        content: '最小值为1'
                    });
                };
            }, 3000);
        });

        // 契约范围
        var baseMinPoint = 0.1;
        var baseMaxPoint = mContract.scalePoint;
        var extraMinPoint = 0.1;
        var extraMaxPoint = mContract.scalePoint;

        content.find('[data-field="baseMinPoint"]').html(baseMinPoint);
        content.find('[data-field="baseMaxPoint"]').html(baseMaxPoint);

        var refreshExtraPoint = function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            if (!isNaN(scalePoint) && scalePoint >= baseMinPoint && scalePoint <= baseMaxPoint) {
                var thisMinPoint = (scalePoint + 0.1).toFixed(1);
                if (thisMinPoint > extraMaxPoint) {
                    content.find('[data-field="extraMinPoint"]').html(extraMaxPoint);
                } else {
                    content.find('[data-field="extraMinPoint"]').html(thisMinPoint);
                }
            } else {
                content.find('[data-field="extraMinPoint"]').html(extraMinPoint);
            }
            content.find('[data-field="extraMaxPoint"]').html(extraMaxPoint);
        };

        refreshExtraPoint();

        baseRules.find('input[name="scalePoint"]').blur(function () {
            refreshExtraPoint();
        });

        var getExtraRules = function () {
            var array = [];
            extraRules.find('tbody > tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (activeUser != 0) {
                    array.push({
                        totalConsume: totalConsume,
                        activeUser: activeUser,
                        scalePoint: scalePoint
                    });
                }
            });
            return array;
        };

        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            var activeUser = parseInt(baseRules.find('input[name="activeUser"]').val());
            var extraRules = JSON.stringify(getExtraRules());
            doSubmit({
                username: username,
                scalePoint: scalePoint,
                activeUser: activeUser,
                extraRules: extraRules
            });
        });

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    var sCallback;
    // 提交请求
    var doSubmit = function (data) {
        //console.log(data);
        ContractCtrl.request('APPLY_EDIT_SALARY_CONTRACT3', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约工资签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        ContractCtrl.request('PREPARE_EDIT_SALARY_CONTRACT3', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    // 0.1的用户无法签约下级契约
                    if (res.data.mContract.scalePoint <= 0.1) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: '您无法签订契约工资'
                        });
                        return false;
                    }
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '签订契约工资',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();

// 代理签订棋牌工资契约
var SimulationEditSalaryModal = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-salary-contract">\
                <div class="modal-table-wrapper">\
                    <div data-field="title" class="text-center f-16 m-b-20"></div>\
                    <table style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td>棋牌契约状态：<span data-field="status">未签订棋牌契约</span></td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <table data-table="baseRules" style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td width="30%">棋牌工资比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                        <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="1"> 人</td>\
                        <td style="line-height: 34px">（设置范围：<span data-field="baseMinPoint">0</span>% ~ <span data-field="baseMaxPoint">0</span>%）</td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <div class="scroll-list always-visible with-margin-30" style="position: relative; max-height: 255px;overflow-y: auto;">\
                        <table data-table="extraRules" style="margin: 0" class="table table-contract">\
                        <tbody>\
                        </tbody>\
                        </table>\
                    </div>\
                    <div style="height: 10px; clear: both;"></div>\
                    <div class="tips" style="border: 1px solid #eee; text-align: center; padding: 10px 20px; margin-bottom: 20px;">\
                        （附加棋牌工资比例设置范围：<span data-field="extraMinPoint">0</span>% ~ <span data-field="extraMaxPoint">0</span>%） <a data-command="add" class="btn btn-primary btn-xs btn-mini">增加规则</a>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        var baseRules = content.find('[data-table="baseRules"]');
        var extraRules = content.find('[data-table="extraRules"]');

        // 代理契约
        var mContract = data.mContract;
        // 下级契约
        var uContract = data.uContract;

        var scrollList = content.find('.scroll-list');
        scrollList.perfectScrollbar();

        var updateScrollList = function () {
            scrollList.perfectScrollbar('update');
        };

        var getRowTpl = function () {
            var tpl =
                '<tr>\
                    <td width="30%">周期消费：<input name="totalConsume" type="text" class="form-control input-half"> 万</td>\
                    <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="1"> 人</td>\
                    <td width="30%">棋牌工资比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                    <td width="10%"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
                </tr>';
            var $thisRow = $(tpl);
            $thisRow.find('[data-command="del"]').click(function () {
                $(this).parents('tr').remove();
                updateScrollList();
            });
            var activeUser = $thisRow.find('input[name="activeUser"]');
            activeUser.bind('input', function () {//给文本框绑定input事件
                setTimeout(function () {
                    if (activeUser.val() < 1) {
                        activeUser.val("1");
                        AlertUtils.alert({
                            icon: 'error',
                            content: '最小值为1'
                        });
                    };
                }, 3000);
            });
            return $thisRow;
        };

        var initExtraRules = function (rules) {
            if (rules) {
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(parseInt(v.scalePoint * 100) / 100).attr('disabled', true);
                    $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            } else {
                for (var i = 0; i < 3; i++) {
                    var $thisRow = getRowTpl();
                    extraRules.find('tbody').append($thisRow);
                }
            }
        };

        content.find('[data-command="add"]').click(function () {
            var $thisRow = getRowTpl();
            extraRules.find('tbody').append($thisRow);
            updateScrollList();
        });

        if (uContract != null) {
            content.find('[data-field="title"]').html('已经与下级代理【' + data.uAccount.username + '】签订棋牌契约工资');
            baseRules.find('input[name="scalePoint"]').val(parseInt(uContract.scalePoint * 100) / 100).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(uContract.activeUser).attr('disabled', true);
            if (uContract.extraRules) {
                initExtraRules(uContract.extraRules);
            }
            content.find('.tips').hide();
            if (uContract.status == 0) {
                content.find('[data-field="status"]').html('待确定棋牌工资').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                content.find('[data-field="status"]').html('已签订棋牌工资').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                content.find('[data-field="status"]').html('拒签棋牌工资').css('color', '#FB5D6A');
                baseRules.find('input[name="scalePoint"]').attr('disabled', false);
                baseRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="totalConsume"]').attr('disabled', false);
                extraRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="scalePoint"]').attr('disabled', false);
                extraRules.find('[data-command="del"]').removeClass('disabled');
                content.find('.tips').show();
            }
        } else {
            content.find('[data-field="title"]').html('正在与下级代理【' + data.uAccount.username + '】签订棋牌契约工资');
            content.find('[data-field="status"]').html('未签订棋牌契约');
            initExtraRules();
            content.find('.tips').show();
        }

        var activeUser = baseRules.find('input[name="activeUser"]');
        activeUser.bind('input', function () {//给文本框绑定input事件
            setTimeout(function () {
                if (activeUser.val() < 1) {
                    activeUser.val("1");
                    AlertUtils.alert({
                        icon: 'error',
                        content: '最小值为1'
                    });
                };
            }, 3000);
        });

        // 契约范围
        var baseMinPoint = 0.1;
        var baseMaxPoint = mContract.scalePoint;
        var extraMinPoint = 0.1;
        var extraMaxPoint = mContract.scalePoint;

        content.find('[data-field="baseMinPoint"]').html(baseMinPoint);
        content.find('[data-field="baseMaxPoint"]').html(baseMaxPoint);

        var refreshExtraPoint = function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            if (!isNaN(scalePoint) && scalePoint >= baseMinPoint && scalePoint <= baseMaxPoint) {
                var thisMinPoint = (scalePoint + 0.1).toFixed(1);
                if (thisMinPoint > extraMaxPoint) {
                    content.find('[data-field="extraMinPoint"]').html(extraMaxPoint);
                } else {
                    content.find('[data-field="extraMinPoint"]').html(thisMinPoint);
                }
            } else {
                content.find('[data-field="extraMinPoint"]').html(extraMinPoint);
            }
            content.find('[data-field="extraMaxPoint"]').html(extraMaxPoint);
        };

        refreshExtraPoint();

        baseRules.find('input[name="scalePoint"]').blur(function () {
            refreshExtraPoint();
        });

        var getExtraRules = function () {
            var array = [];
            extraRules.find('tbody > tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (totalConsume != 0 && activeUser != 0 && scalePoint != 0) {
                    array.push({
                        totalConsume: totalConsume,
                        activeUser: activeUser,
                        scalePoint: scalePoint
                    });
                }
            });
            return array;
        };

        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            var activeUser = parseInt(baseRules.find('input[name="activeUser"]').val());
            var extraRules = JSON.stringify(getExtraRules());
            doSubmit({
                username: username,
                scalePoint: scalePoint,
                activeUser: activeUser,
                extraRules: extraRules
            });
        });

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    var sCallback;
    // 提交请求
    var doSubmit = function (data) {
        console.log(data);
        SimulationCtrl.request('APPLY_EDIT_SALARY_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '棋牌契约工资签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        SimulationCtrl.request('PREPARE_EDIT_SALARY_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    // 0.1的用户无法签约下级契约
                    if (res.data.mContract.scalePoint <= 0.1) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: '您无法签订棋牌契约工资'
                        });
                        return false;
                    }
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '签订棋牌契约工资',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();
var AgentEditDividendContractModal = function () {
    // 回调函数
    var sCallback;
    // 准备工作
    var doPrepare = function (data, callback) {
        HttpRequest({
            url: '/api/agent/prepareEditDividendContract',
            data: data,
            success: function (res) {
                // var res = {"error":0,"code":null,"message":"请求成功","data":{"minPoint":0.1,"maxPoint":4,"uUsername":"x11113","uContract":null,"mUsername":"x11112","mContract":{"id":77,"accountTo":17,"accountFrom":0,"scalePoint":4,"activeUser":3,"extraRules":"[{\"totalConsume\":0.5,\"activeUser\":3,\"scalePoint\":0.3},{\"totalConsume\":150,\"activeUser\":4,\"scalePoint\":0.6},{\"totalConsume\":200,\"activeUser\":5,\"scalePoint\":0.9},{\"totalConsume\":250,\"activeUser\":6,\"scalePoint\":1.2},{\"totalConsume\":300,\"activeUser\":7,\"scalePoint\":1.5},{\"totalConsume\":350,\"activeUser\":8,\"scalePoint\":1.8},{\"totalConsume\":400,\"activeUser\":9,\"scalePoint\":2.1},{\"totalConsume\":500,\"activeUser\":10,\"scalePoint\":2.4},{\"totalConsume\":600,\"activeUser\":11,\"scalePoint\":2.7},{\"totalConsume\":750,\"activeUser\":12,\"scalePoint\":3}]","status":1},"unitPoint":0.1}}
                if (res.error == 0) {
                    var unitPoint = res.data.unitPoint;
                    var mContract = res.data.mContract;
                    if (mContract.scalePoint <= unitPoint) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: '您无法签订契约分红'
                        });
                        return false;
                    }
                    callback && callback(res.data);
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
    // 提交请求
    var doSubmit = function (data) {

        ContractCtrl.request('APPLY_EDIT_DIVIDEND_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约分红签订成功'
                    });
                    sCallback && sCallback();
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
    // 新增操作模板
    var getNewRowTpl = function () {
        var tpl =
            '<tr>\
                <td class="input-field"><input name="totalConsume" type="text"> 万</td>\
                <td class="input-field"><input name="activeUser" type="text"> 人</td>\
                <td class="input-field"><input name="scalePoint" type="text"> %</td>\
                <td class="actions"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
            </tr>';
        var $thisRow = $(tpl);
        $thisRow.find('[data-command="del"]').click(function () {
            $(this).parents('tr').remove();
        });
        return $thisRow;
    };
    // 获取内容
    var getContent = function () {
        var tpl = `<div class="modal-table-wrapper">
                        <div data-field="title" class="text-center f-16 m-b-20">正在与下级代理【test2233】签订契约分红</div>
                        <table style="margin: 0" class="table table-contract">
                            <tbody>
                                <tr>
                                    <td>契约状态：<span data-field="status">未签订契约</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="extra-rules">
                            <div class="table-title">
                                <table data-table="head" class="table">
                                    <thead>
                                    <tr>
                                        <td class="input-field">周期消费（万）</td>
                                        <td class="input-field">活跃用户（人）</td>
                                        <td class="input-field">分红比例（%）</td>
                                        <td class="actions"><a data-command="add" class="btn btn-success btn-xs btn-mini">新增</a></td>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-list">
                                <table data-table="body" class="table">
                                    <tbody>
                                    <tr>
                                        <td class="input-field"><input name="totalConsume" type="text"> 万</td>
                                        <td class="input-field"><input name="activeUser" type="text"> 人</td>
                                        <td class="input-field"><input name="scalePoint" type="text"> %</td>
                                        <td class="actions"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>
                                    </tr>
                                    <tr>
                                        <td class="input-field"><input name="totalConsume" type="text"> 万</td>
                                        <td class="input-field"><input name="activeUser" type="text"> 人</td>
                                        <td class="input-field"><input name="scalePoint" type="text"> %</td>
                                        <td class="actions"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>
                                    </tr>
                                    <tr>
                                        <td class="input-field"><input name="totalConsume" type="text"> 万</td>
                                        <td class="input-field"><input name="activeUser" type="text"> 人</td>
                                        <td class="input-field"><input name="scalePoint" type="text"> %</td>
                                        <td class="actions"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tips">
                            契约比例设置范围：<span data-field="minPoint">0</span>% ~ <span data-field="maxPoint">0</span>%（最小间隔单位<span data-field="unitPoint">0</span>%）
                        </div>
                        <div class="row">
                            <div class="col-md-3"></div>
                            <div class="col-md-3">
                                <a data-command="submit" class="btn btn-primary btn-block">确定</a>
                            </div>
                            <div class="col-md-3">
                                <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>
                            </div>
                            <div class="col-md-3"></div>
                        </div>
                    </div>`;
        return $(tpl);
    };
    // 初始化内容
    var initContent = function (resData) {
        var content = getContent();
        // 最小比例
        var minPoint = resData.minPoint;
        // 最大比例
        var maxPoint = resData.maxPoint;
        // 单位比例
        var unitPoint = resData.unitPoint;
        // 自己的用户名
        var mUsername = resData.mUsername;
        // 下级的用户名
        var uUsername = resData.uUsername;
        // 自己的契约
        var mContract = resData.mContract;
        // 下级的契约
        var uContract = resData.uContract;

        // 标题
        var thisTitle = content.find('[data-field="title"]');
        // 状态
        var thisStatus = content.find('[data-field="status"]');
        // 附加规则
        var extraRules = content.find('.extra-rules');
        // 附加规则内容
        var eRulesBody = extraRules.find('[data-table="body"]');
        // 新增按钮
        content.find('[data-command="add"]').click(function () {
            var newRow = getNewRowTpl();
            eRulesBody.append(newRow);
        });
        // 初始化帮助
        content.find('.tips').find('[data-field="minPoint"]').html(minPoint);
        content.find('.tips').find('[data-field="maxPoint"]').html(maxPoint);
        content.find('.tips').find('[data-field="unitPoint"]').html(unitPoint);
        // 判断下级契约是否存在

        if (uContract != null) {
            // 设置标题
            thisTitle.html('已经与下级代理【' + uUsername + '】签订契约分红');
            // 根据状态，来设置状态
            if (uContract.status == 0) {
                thisStatus.html('待确定分红').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                thisStatus.html('已签订分红').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                thisStatus.html('拒签分红').css('color', '#FB5D6A');
            }
            // 初始化规则
            if (uContract.extraRules) {
                eRulesBody.empty();
                $.each(JSON.parse(uContract.extraRules), function (i, v) {
                    var newRow = getNewRowTpl();
                    newRow.find('input[name="totalConsume"]').val(v.totalConsume);
                    newRow.find('input[name="activeUser"]').val(v.activeUser);
                    newRow.find('input[name="scalePoint"]').val(v.scalePoint);
                    eRulesBody.append(newRow);
                });
            }
            // 下级用户拒绝后，才可以修改
            if (uContract.status == -1) {
                content.find('[data-command="add"]').attr('disabled', false);
                extraRules.find('input[name="totalConsume"]').attr('disabled', false);
                extraRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="scalePoint"]').attr('disabled', false);
                extraRules.find('[data-command="del"]').removeClass('disabled');
            } else {
                // 反之则不可以修改
                extraRules.find('td.actions').remove();
                extraRules.find('input[name="totalConsume"]').attr('disabled', true);
                extraRules.find('input[name="activeUser"]').attr('disabled', true);
                extraRules.find('input[name="scalePoint"]').attr('disabled', true);
                extraRules.find('[data-command="del"]').addClass('disabled');
            }
        } else {
            // 设置标题
            thisTitle.html('正在与下级代理【' + uUsername + '】签订契约分红');
            // 设置状态
            thisStatus.html('未签订契约');
            // 初始化规则个数，默认6个
            eRulesBody.empty();
            for (var i = 0; i < 6; i++) {
                var newRow = getNewRowTpl();
                eRulesBody.append(newRow);
            }
        }
        // 获取规则值
        var getExtraRulesValue = function () {
            var array = [];
            eRulesBody.find('tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (isNaN(totalConsume) == false && isNaN(activeUser) == false && isNaN(scalePoint) == false) {
                    if (totalConsume > 0 && activeUser > 0 && scalePoint > 0) {
                        array.push({
                            totalConsume: totalConsume,
                            activeUser: activeUser,
                            scalePoint: scalePoint
                        });
                    }
                }
            });
            return array;
        };
        // 提交按钮事件
        content.find('[data-command="submit"]').click(function () {
            var username = uUsername;
            var extraRules = JSON.stringify(getExtraRulesValue());
            doSubmit({
                username: username,
                extraRules: extraRules
            });
        });
        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });
        return content;
    };
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            var box = ModalBoxUtils.init({
                width: 800,
                title: '签订契约分红',
                addClass: 'title-center',
                content: content
            });
        });
    };
    return {
        init: init
    }
}();
// 代理签订分红契约(原平台日分红)
var AgentEditDividendContractModal2 = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-dividend-contract">\
                <div class="modal-table-wrapper">\
                    <div data-field="title" class="text-center f-16 m-b-20"></div>\
                    <table style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td>契约状态：<span data-field="status">未签订契约</span></td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <table data-table="baseRules" style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td width="30%">分红比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                        <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="1"> 人</td>\
                        <td style="line-height: 34px">（设置范围：<span data-field="baseMinPoint">0</span>% ~ <span data-field="baseMaxPoint">0</span>%）</td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <div class="scroll-list always-visible with-margin-30" style="position: relative; max-height: 255px;overflow-y: auto;">\
                        <table data-table="extraRules" style="margin: 0" class="table table-contract">\
                        <tbody>\
                        </tbody>\
                        </table>\
                    </div>\
                    <div style="height: 10px; clear: both;"></div>\
                    <div class="tips" style="border: 1px solid #eee; text-align: center; padding: 10px 20px; margin-bottom: 20px;">\
                        （附加分红比例设置范围：<span data-field="extraMinPoint">0</span>% ~ <span data-field="extraMaxPoint">0</span>%） <a data-command="add" class="btn btn-primary btn-xs btn-mini">增加规则</a>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        var baseRules = content.find('[data-table="baseRules"]');
        var extraRules = content.find('[data-table="extraRules"]');

        // 代理契约
        var mContract = data.mContract;
        // 下级契约
        var uContract = data.uContract;

        var scrollList = content.find('.scroll-list');
        scrollList.perfectScrollbar();

        var updateScrollList = function () {
            scrollList.perfectScrollbar('update');
        };

        var getRowTpl = function () {
            var tpl =
                '<tr>\
                    <td width="23%">每日消费：<input name="totalConsume" type="text" class="form-control input-half"> 万</td>\
					<td width="23%">每日亏损：<input name="totalLoss" type="text" class="form-control input-half"> 万</td>\
                    <td width="23%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="1"> 人</td>\
                    <td width="23%">分红比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                    <td width="8%"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
                </tr>';
            var $thisRow = $(tpl);
            $thisRow.find('[data-command="del"]').click(function () {
                $(this).parents('tr').remove();
                updateScrollList();
            });
            var activeUser = $thisRow.find('input[name="activeUser"]')
            activeUser.bind('input', function () {//给文本框绑定input事件
                setTimeout(function () {
                    if (activeUser.val() < 1) {
                        activeUser.val("1");
                        AlertUtils.alert({
                            icon: 'error',
                            content: '最小值为1'
                        });
                    };
                }, 3000);
            })
            return $thisRow;
        };

        var initExtraRules = function (rules) {
            var state = uContract && uContract.status;
            if ((state != -1) && rules) {
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="totalLoss"]').val(v.totalLoss).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(v.scalePoint).attr('disabled', true);
                    $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            } else {
                var rules = mContract.extraRules;
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="totalLoss"]').val(v.totalLoss).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(v.scalePoint).attr('disabled', true);
                    // $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            }
        };

        content.find('[data-command="add"]').click(function () {
            var $thisRow = getRowTpl();
            extraRules.find('tbody').append($thisRow);
            updateScrollList();
        });

        if (uContract != null) {
            content.find('[data-field="title"]').html('已经与下级代理【' + data.uAccount.username + '】签订契约分红');
            baseRules.find('input[name="scalePoint"]').val(uContract.scalePoint).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(uContract.activeUser).attr('disabled', true);
            if (uContract.extraRules) {
                initExtraRules(uContract.extraRules);
            }
            content.find('.tips').hide();
            if (uContract.status == 0) {
                content.find('[data-field="status"]').html('待确定分红').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                content.find('[data-field="status"]').html('已签订分红').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                content.find('[data-field="status"]').html('拒签分红').css('color', '#FB5D6A');
                baseRules.find('input[name="scalePoint"]').attr('disabled');
                baseRules.find('input[name="activeUser"]').attr('disabled');
                extraRules.find('input[name="totalLoss"]').attr('disabled');
                extraRules.find('input[name="totalConsume"]').attr('disabled');
                extraRules.find('input[name="activeUser"]').attr('disabled');
                extraRules.find('input[name="scalePoint"]').attr('disabled');
                extraRules.find('[data-command="del"]').removeClass('disabled');
                content.find('.tips').show();
                content.find('.tips').find('[data-command="add"]').hide();
            }
        } else {
            content.find('[data-field="title"]').html('正在与下级代理【' + data.uAccount.username + '】签订契约分红');
            content.find('[data-field="status"]').html('未签订契约');
            baseRules.find('input[name="scalePoint"]').val(mContract.scalePoint).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(mContract.activeUser).attr('disabled', true);
            initExtraRules();
            content.find('.tips').show();
            content.find('[data-command="add"]').hide();
        }

        var activeUser = baseRules.find('input[name="activeUser"]');
        activeUser.bind('input', function () {//给文本框绑定input事件
            setTimeout(function () {
                if (activeUser.val() < 1) {
                    activeUser.val("1");
                    AlertUtils.alert({
                        icon: 'error',
                        content: '最小值为1'
                    });
                };
            }, 3000);
        });

        // 契约范围
        var rangeConfig = data.rangeConfig && JSON.parse(data.rangeConfig);
        var baseMinPoint = rangeConfig.minPoint;
        var baseDownPoint = rangeConfig.downPoint;
        var extraDownPoint = rangeConfig.extraDownPoint;
        var baseMaxPoint = mContract.scalePoint - baseDownPoint;
        var extraMinPoint = baseMinPoint + 1;
        var extraMaxPoint = mContract.scalePoint - extraDownPoint;

        content.find('[data-field="baseMinPoint"]').html(baseMinPoint);
        content.find('[data-field="baseMaxPoint"]').html(baseMaxPoint);

        var refreshExtraPoint = function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            if (!isNaN(scalePoint) && scalePoint >= baseMinPoint && scalePoint <= baseMaxPoint) {
                content.find('[data-field="extraMinPoint"]').html(scalePoint + 1);
            } else {
                content.find('[data-field="extraMinPoint"]').html(extraMinPoint);
            }
            content.find('[data-field="extraMaxPoint"]').html(extraMaxPoint);
        };

        refreshExtraPoint();

        baseRules.find('input[name="scalePoint"]').blur(function () {
            refreshExtraPoint();
        });

        var getExtraRules = function () {
            var array = [];
            extraRules.find('tbody > tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var totalLoss = parseFloat($(this).find('input[name="totalLoss"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (activeUser != 0) {
                    array.push({
                        totalConsume: totalConsume,
                        activeUser: activeUser,
                        scalePoint: scalePoint,
                        totalLoss: totalLoss
                    });
                }
            });
            return array;
        };

        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            var activeUser = parseInt(baseRules.find('input[name="activeUser"]').val());
            var extraRules = JSON.stringify(getExtraRules());
            doSubmit({
                username: username,
                scalePoint: scalePoint,
                activeUser: activeUser,
                extraRules: extraRules
            });
        });

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    // 提交请求
    var sCallback;
    var doSubmit = function (data) {
        ContractCtrl.request('APPLY_EDIT_DIVIDEND_CONTRACT2', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约分红签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        ContractCtrl.request('PREPARE_EDIT_DIVIDEND_CONTRACT2', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '签订契约分红',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();
// 代理签订分红契约(原平台日分红)
var AgentEditDividendContractModal3 = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-dividend-contract">\
                <div class="modal-table-wrapper">\
                    <div data-field="title" class="text-center f-16 m-b-20"></div>\
                    <table style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td>契约状态：<span data-field="status">未签订契约</span></td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <table data-table="baseRules" style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td width="30%">分红比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                        <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="3"> 人</td>\
                        <td style="line-height: 34px">（设置范围：<span data-field="baseMinPoint">0</span>% ~ <span data-field="baseMaxPoint">0</span>%）</td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <div class="scroll-list always-visible with-margin-30" style="position: relative; max-height: 255px;overflow-y: auto;">\
                        <table data-table="extraRules" style="margin: 0" class="table table-contract">\
                        <tbody>\
                        </tbody>\
                        </table>\
                    </div>\
                    <div style="height: 10px; clear: both;"></div>\
                    <div class="tips" style="border: 1px solid #eee; text-align: center; padding: 10px 20px; margin-bottom: 20px;">\
                        （附加分红比例设置范围：<span data-field="extraMinPoint">0</span>% ~ <span data-field="extraMaxPoint">0</span>%） <a data-command="add" class="btn btn-primary btn-xs btn-mini">增加规则</a>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        var baseRules = content.find('[data-table="baseRules"]');
        var extraRules = content.find('[data-table="extraRules"]');

        // 代理契约
        var mContract = data.mContract;
        // 下级契约
        var uContract = data.uContract;

        var scrollList = content.find('.scroll-list');
        scrollList.perfectScrollbar();

        var updateScrollList = function () {
            scrollList.perfectScrollbar('update');
        };

        var getRowTpl = function () {
            var tpl =
                '<tr>\
                    <td width="23%">周期消费：<input name="totalConsume" type="text" class="form-control input-half"> 万</td>\
                    <td width="23%">周期亏损：<input name="totalLoss" type="text" class="form-control input-half"> 万</td>\
                    <td width="23%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="3"> 人</td>\
                    <td width="23%">分红比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                    <td width="8%"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
                </tr>';
            var $thisRow = $(tpl);
            $thisRow.find('[data-command="del"]').click(function () {
                $(this).parents('tr').remove();
                updateScrollList();
            });
            var activeUser = $thisRow.find('input[name="activeUser"]')
            activeUser.bind('input', function () {//给文本框绑定input事件
                setTimeout(function () {
                    if (activeUser.val() < 1) {
                        activeUser.val("1");
                        AlertUtils.alert({
                            icon: 'error',
                            content: '最小值为1'
                        });
                    };
                }, 3000);
            })
            return $thisRow;
        };

        var initExtraRules = function (rules) {
            if (rules) {
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="totalLoss"]').val(v.totalLoss).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(v.scalePoint).attr('disabled', true);
                    $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            } else {
                for (var i = 0; i < 5; i++) {
                    var $thisRow = getRowTpl();
                    extraRules.find('tbody').append($thisRow);
                }
            }
        };

        content.find('[data-command="add"]').click(function () {
            var $thisRow = getRowTpl();
            extraRules.find('tbody').append($thisRow);
            updateScrollList();
        });

        if (uContract != null) {
            content.find('[data-field="title"]').html('已经与下级代理【' + data.uAccount.username + '】签订契约分红');
            baseRules.find('input[name="scalePoint"]').val(uContract.scalePoint).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(uContract.activeUser).attr('disabled', true);
            if (uContract.extraRules) {
                initExtraRules(uContract.extraRules);
            }
            content.find('.tips').hide();
            if (uContract.status == 0) {
                content.find('[data-field="status"]').html('待确定分红').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                content.find('[data-field="status"]').html('已签订分红').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                content.find('[data-field="status"]').html('拒签分红').css('color', '#FB5D6A');
                baseRules.find('input[name="scalePoint"]').attr('disabled', false);
                baseRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="totalLoss"]').attr('disabled', false);
                extraRules.find('input[name="totalConsume"]').attr('disabled', false);
                extraRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="scalePoint"]').attr('disabled', false);
                extraRules.find('[data-command="del"]').removeClass('disabled');
                content.find('.tips').show();
            }
        } else {
            content.find('[data-field="title"]').html('正在与下级代理【' + data.uAccount.username + '】签订契约分红');
            content.find('[data-field="status"]').html('未签订契约');
            initExtraRules();
            content.find('.tips').show();
        }

        var activeUser = baseRules.find('input[name="activeUser"]');
        activeUser.bind('input', function () {//给文本框绑定input事件
            setTimeout(function () {
                if (activeUser.val() < 1) {
                    activeUser.val("1");
                    AlertUtils.alert({
                        icon: 'error',
                        content: '最小值为1'
                    });
                };
            }, 3000);
        });

        // 契约范围
        var rangeConfig = data.rangeConfig && JSON.parse(data.rangeConfig);
        var baseMinPoint = rangeConfig.minPoint;
        var baseDownPoint = rangeConfig.downPoint;
        var extraDownPoint = rangeConfig.extraDownPoint;
        var baseMaxPoint = mContract.scalePoint - baseDownPoint;
        var extraMinPoint = baseMinPoint + 1;
        var extraMaxPoint = mContract.scalePoint - extraDownPoint;

        content.find('[data-field="baseMinPoint"]').html(baseMinPoint);
        content.find('[data-field="baseMaxPoint"]').html(baseMaxPoint);

        var refreshExtraPoint = function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            if (!isNaN(scalePoint) && scalePoint >= baseMinPoint && scalePoint <= baseMaxPoint) {
                content.find('[data-field="extraMinPoint"]').html(scalePoint + 1);
            } else {
                content.find('[data-field="extraMinPoint"]').html(extraMinPoint);
            }
            content.find('[data-field="extraMaxPoint"]').html(extraMaxPoint);
        };

        refreshExtraPoint();

        baseRules.find('input[name="scalePoint"]').blur(function () {
            refreshExtraPoint();
        });

        var getExtraRules = function () {
            var array = [];
            extraRules.find('tbody > tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var totalLoss = parseFloat($(this).find('input[name="totalLoss"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (activeUser != 0) {
                    array.push({
                        totalConsume: totalConsume,
                        activeUser: activeUser,
                        scalePoint: scalePoint,
                        totalLoss: totalLoss
                    });
                }
            });
            return array;
        };

        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            var activeUser = parseInt(baseRules.find('input[name="activeUser"]').val());
            var extraRules = JSON.stringify(getExtraRules());
            doSubmit({
                username: username,
                scalePoint: scalePoint,
                activeUser: activeUser,
                extraRules: extraRules
            });
        });

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    // 提交请求
    var sCallback;
    var doSubmit = function (data) {
        ContractCtrl.request('APPLY_EDIT_DIVIDEND_CONTRACT3', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约分红签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        ContractCtrl.request('PREPARE_EDIT_DIVIDEND_CONTRACT3', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '签订契约分红',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();
var AgentEditDividendContractModal4 = function () {

    // 获取内容
    var getContent = function () {
        var tpl =
            '<div id="agent-edit-dividend-contract">\
                <div class="modal-table-wrapper">\
                    <div data-field="title" class="text-center f-16 m-b-20"></div>\
                    <table style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td>契约状态：<span data-field="status">未签订契约</span></td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <table data-table="baseRules" style="margin: 0" class="table table-contract">\
                    <tbody>\
                    <tr>\
                        <td width="30%">分红比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                        <td width="30%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="3"> 人</td>\
                        <td style="line-height: 34px">（设置范围：<span data-field="baseMinPoint">0</span>% ~ <span data-field="baseMaxPoint">0</span>%）</td>\
                    </tr>\
                    </tbody>\
                    </table>\
                    <hr style="margin: 10px 0">\
                    <div class="scroll-list always-visible with-margin-30" style="position: relative; max-height: 255px;overflow-y: auto;">\
                        <table data-table="extraRules" style="margin: 0" class="table table-contract">\
                        <tbody>\
                        </tbody>\
                        </table>\
                    </div>\
                    <div style="height: 10px; clear: both;"></div>\
                    <div class="tips" style="border: 1px solid #eee; text-align: center; padding: 10px 20px; margin-bottom: 20px;">\
                        （附加分红比例设置范围：<span data-field="extraMinPoint">0</span>% ~ <span data-field="extraMaxPoint">0</span>%） <a data-command="add" class="btn btn-primary btn-xs btn-mini">增加规则</a>\
                    </div>\
                    <div class="row">\
                        <div class="col-md-3"></div>\
                        <div class="col-md-3">\
                            <a data-command="submit" class="btn btn-primary btn-block">确定</a>\
                        </div>\
                        <div class="col-md-3">\
                            <a data-command="cancel" class="btn btn-cancel btn-block">取消</a>\
                        </div>\
                        <div class="col-md-3"></div>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        var baseRules = content.find('[data-table="baseRules"]');
        var extraRules = content.find('[data-table="extraRules"]');

        // 代理契约
        var mContract = data.mContract;
        // 下级契约
        var uContract = data.uContract;

        var scrollList = content.find('.scroll-list');
        scrollList.perfectScrollbar();

        var updateScrollList = function () {
            scrollList.perfectScrollbar('update');
        };

        var getRowTpl = function () {
            var tpl =
                '<tr>\
                    <td width="23%">周期消费：<input name="totalConsume" type="text" class="form-control input-half"> 万</td>\
					<td width="23%">周期亏损：<input name="totalLoss" type="text" class="form-control input-half"> 万</td>\
                    <td width="23%">活跃用户：<input name="activeUser" type="text" class="form-control input-half" value="3"> 人</td>\
                    <td width="23%">分红比例：<input name="scalePoint" type="text" class="form-control input-half"> %</td>\
                    <td width="8%"><a data-command="del" class="btn btn-danger btn-xs btn-mini">删除</a></td>\
                </tr>';
            var $thisRow = $(tpl);
            $thisRow.find('[data-command="del"]').click(function () {
                $(this).parents('tr').remove();
                updateScrollList();
            });
            var activeUser = $thisRow.find('input[name="activeUser"]')
            activeUser.bind('input', function () {//给文本框绑定input事件
                setTimeout(function () {
                    if (activeUser.val() < 1) {
                        activeUser.val("1");
                        AlertUtils.alert({
                            icon: 'error',
                            content: '最小值为1'
                        });
                    };
                }, 3000);
            })
            return $thisRow;
        };

        var initExtraRules = function (rules) {
            if (rules) {
                extraRules.find('tbody').empty();
                $.each(JSON.parse(rules), function (i, v) {
                    var $thisRow = getRowTpl();
                    $thisRow.find('input[name="totalConsume"]').val(v.totalConsume).attr('disabled', true);
                    $thisRow.find('input[name="totalLoss"]').val(v.totalLoss).attr('disabled', true);
                    $thisRow.find('input[name="activeUser"]').val(v.activeUser).attr('disabled', true);
                    $thisRow.find('input[name="scalePoint"]').val(v.scalePoint).attr('disabled', true);
                    $thisRow.find('[data-command="del"]').addClass('disabled');
                    extraRules.find('tbody').append($thisRow);
                });
            } else {
                for (var i = 0; i < 5; i++) {
                    var $thisRow = getRowTpl();
                    extraRules.find('tbody').append($thisRow);
                }
            }
        };

        content.find('[data-command="add"]').click(function () {
            var $thisRow = getRowTpl();
            extraRules.find('tbody').append($thisRow);
            updateScrollList();
        });

        if (uContract != null) {
            content.find('[data-field="title"]').html('已经与下级代理【' + data.uAccount.username + '】签订契约分红');
            baseRules.find('input[name="scalePoint"]').val(uContract.scalePoint).attr('disabled', true);
            baseRules.find('input[name="activeUser"]').val(uContract.activeUser).attr('disabled', true);
            if (uContract.extraRules) {
                initExtraRules(uContract.extraRules);
            }
            content.find('.tips').hide();
            if (uContract.status == 0) {
                content.find('[data-field="status"]').html('待确定分红').css('color', '#EF8B26');
            }
            if (uContract.status == 1) {
                content.find('[data-field="status"]').html('已签订分红').css('color', '#519B3B');
            }
            if (uContract.status == -1) {
                content.find('[data-field="status"]').html('拒签分红').css('color', '#FB5D6A');
                baseRules.find('input[name="scalePoint"]').attr('disabled', false);
                baseRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="totalLoss"]').attr('disabled', false);
                extraRules.find('input[name="totalConsume"]').attr('disabled', false);
                extraRules.find('input[name="activeUser"]').attr('disabled', false);
                extraRules.find('input[name="scalePoint"]').attr('disabled', false);
                extraRules.find('[data-command="del"]').removeClass('disabled');
                content.find('.tips').show();
            }
        } else {
            content.find('[data-field="title"]').html('正在与下级代理【' + data.uAccount.username + '】签订契约分红');
            content.find('[data-field="status"]').html('未签订契约');
            initExtraRules();
            content.find('.tips').show();
        }

        var activeUser = baseRules.find('input[name="activeUser"]');
        activeUser.bind('input', function () {//给文本框绑定input事件
            setTimeout(function () {
                if (activeUser.val() < 1) {
                    activeUser.val("1");
                    AlertUtils.alert({
                        icon: 'error',
                        content: '最小值为1'
                    });
                };
            }, 3000);
        });

        // 契约范围
        var rangeConfig = data.rangeConfig && JSON.parse(data.rangeConfig);
        var baseMinPoint = rangeConfig.minPoint;
        var baseDownPoint = rangeConfig.downPoint;
        var extraDownPoint = rangeConfig.extraDownPoint;
        var baseMaxPoint = mContract.scalePoint - baseDownPoint;
        var extraMinPoint = baseMinPoint + 1;
        var extraMaxPoint = mContract.scalePoint - extraDownPoint;

        content.find('[data-field="baseMinPoint"]').html(baseMinPoint);
        content.find('[data-field="baseMaxPoint"]').html(baseMaxPoint);

        var refreshExtraPoint = function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            if (!isNaN(scalePoint) && scalePoint >= baseMinPoint && scalePoint <= baseMaxPoint) {
                content.find('[data-field="extraMinPoint"]').html(scalePoint + 1);
            } else {
                content.find('[data-field="extraMinPoint"]').html(extraMinPoint);
            }
            content.find('[data-field="extraMaxPoint"]').html(extraMaxPoint);
        };

        refreshExtraPoint();

        baseRules.find('input[name="scalePoint"]').blur(function () {
            refreshExtraPoint();
        });

        var getExtraRules = function () {
            var array = [];
            extraRules.find('tbody > tr').each(function () {
                var totalConsume = parseFloat($(this).find('input[name="totalConsume"]').val());
                var totalLoss = parseFloat($(this).find('input[name="totalLoss"]').val());
                var activeUser = parseInt($(this).find('input[name="activeUser"]').val());
                var scalePoint = parseFloat($(this).find('input[name="scalePoint"]').val());
                if (activeUser != 0) {
                    array.push({
                        totalConsume: totalConsume,
                        activeUser: activeUser,
                        scalePoint: scalePoint,
                        totalLoss: totalLoss
                    });
                }
            });
            return array;
        };

        // 提交按钮事件
        var username = data.uAccount.username;
        content.find('[data-command="submit"]').click(function () {
            var scalePoint = parseFloat(baseRules.find('input[name="scalePoint"]').val());
            var activeUser = parseInt(baseRules.find('input[name="activeUser"]').val());
            var extraRules = JSON.stringify(getExtraRules());
            doSubmit({
                username: username,
                scalePoint: scalePoint,
                activeUser: activeUser,
                extraRules: extraRules
            });
        });

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };
    // 提交请求
    var sCallback;
    var doSubmit = function (data) {
        ContractCtrl.request('APPLY_EDIT_DIVIDEND_CONTRACT4', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '契约分红签订成功'
                    });
                    sCallback && sCallback();
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
    // 准备工作
    var doPrepare = function (data, callback) {
        ContractCtrl.request('PREPARE_EDIT_DIVIDEND_CONTRACT4', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    callback && callback(res.data);
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
    // 初始化
    var init = function (data, cb) {
        sCallback = cb;
        doPrepare(data, function (resData) {
            var content = initContent(resData);
            ModalBoxUtils.init({
                width: 800,
                title: '签订契约分红',
                addClass: 'title-center',
                content: content
            });
        });
    };
    // 返回方法
    return {
        init: init
    }
}();

// 用户消息
var AccountMessageModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div class="modal-table-wrapper account-message-details">\
                <table class="table table-bordered">\
                    <tbody>\
                        <tr>\
                            <td width="25%" class="text-right">发件人：</td>\
                            <td width="75%" data-field="fromUser"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-right">主题：</td>\
                            <td data-field="subject"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-right">发送时间：</td>\
                            <td data-field="time"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-right">消息内容：</td>\
                            <td colspan="3">\
                                <textarea name="content" readonly="readonly" class="message-content" style="height: 300px; padding: 2px 4px;"></textarea>\
                            </td>\
                        </tr>\
                    </tbody>\
                </table>\
                <div class="actions">\
                    <a data-command="reply" class="btn btn-primary">回复消息</a>\
                    <a data-command="delete" class="btn btn-success">删除消息</a>\
                    <a data-command="back" class="btn btn-cancel">返回列表</a>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initContent = function (data) {
        var content = getContent();

        var t = content.find('table');

        var formatFromUser = data.fromAccount;
        var allowReply = true, replyTarget, replyUsername;
        if (data.type == 0) {
            if (data.isFromUp) {
                formatFromUser = '上级';
                replyTarget = 'up';
            } else {
                replyTarget = 'down';
                replyUsername = data.fromAccount;
            }
        }
        if (data.type == 2) {
            formatFromUser = '管理员';
            replyTarget = 'admin';
        }
        if (data.type == 1) {
            formatFromUser = '系统';
            allowReply = false;
        }

        t.find('[data-field="fromUser"]').html(formatFromUser);
        t.find('[data-field="subject"]').html(data.subject);
        t.find('[data-field="time"]').html(moment(data.time).format('YYYY-MM-DD HH:mm:ss'));
        t.find('textarea[name="content"]').html(data.content);

        if (allowReply) {
            content.find('[data-command="reply"]').click(function () {
                var replyUrl = '?nav=message&tab=send';

                if (replyTarget) {
                    replyUrl += '&target=' + replyTarget;
                }
                if (replyUsername) {
                    replyUrl += '&username=' + replyUsername;
                }
                window.location.href = '/member/message-send.html' + replyUrl;
            });
        } else {
            t.find('.btn-reply').remove();
        }

        content.find('[data-command="delete"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定要删除消息？',
                confirmFn: function () {
                    var ids = [data.id];
                    doDelete({
                        ids: ids.toString()
                    });
                }
            });
        });

        content.find('[data-command="back"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };

    // 回调函数
    var callback = {};
    // 撤销订单
    var doDelete = function (data) {
        AccountCtrl.request('DELETE_MESSAGE', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的消息已成功删除！'
                    });
                    callback.onDelete && callback.onDelete();
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

    // 初始化
    var init = function (data, opts) {
        var content = initContent(data, opts);
        ModalBoxUtils.init({
            width: 800,
            title: '消息详情',
            addClass: 'title-center',
            content: content
        });
        if (opts.onDelete) {
            callback.onDelete = opts.onDelete;
        }
    };

    return {
        init: init
    }
}();

// 用户列表选择
var AccountListSelectModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div class="account-list-select">\
                <div class="list"></div>\
                <div class="actions">\
                    <span data-command="check-all" class="btn btn-primary">全选</span>\
                    <span data-command="uncheck-all" class="btn btn-primary">取消全选</span>\
                    <a data-command="ok" class="btn btn-primary">确定已选择(<span>0</span>)</a>\
                    <a data-command="back" class="btn btn-cancel">返回列表</a>\
                </div>\
            </div>';
        return $(tpl);
    };

    // 回调函数
    var callback = {};

    // 初始化内容
    var initContent = function (data) {
        var content = getContent();

        $.each(data, function (i, v) {
            var tmp = '<div class="item"><label><input value="' + v + '" type="checkbox">' + v + '</label></div>';
            content.find('.list').append(tmp);
        });

        var getSelectList = function () {
            var list = [];
            content.find('.list').find('input[type="checkbox"]:checked').each(function () {
                list.push($(this).val());
            });
            return list;
        };

        var updateSelectCount = function () {
            var totalCount = content.find('.list').find('input[type="checkbox"]:checked').length;
            content.find('[data-command="ok"] > span').html(totalCount);
        };

        content.find('.list').find('input[type="checkbox"]').click(function () {
            updateSelectCount();
        });

        content.find('[data-command="uncheck-all"]').click(function () {
            content.find('.list').find('input[type="checkbox"]').prop('checked', false);
            updateSelectCount();
        });

        content.find('[data-command="check-all"]').click(function () {
            content.find('.list').find('input[type="checkbox"]').prop('checked', true);
            updateSelectCount();
        });

        content.find('[data-command="ok"]').click(function () {
            var list = getSelectList();
            ModalBoxUtils.close();
            callback.onSelect & callback.onSelect(list);
        });

        content.find('[data-command="back"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };

    // 初始化
    var init = function (data, opts) {
        var content = initContent(data, opts);
        ModalBoxUtils.init({
            width: 600,
            title: '用户选择',
            addClass: 'title-center',
            content: content
        });
        if (opts.onSelect) {
            callback.onSelect = opts.onSelect;
        }
    };

    return {
        init: init
    }
}();