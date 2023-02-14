$(document).ready(function () {
	
    var thisPanel = $('.main-panel');

    // 初始化选项卡
    var initTab = function () {
        var items = thisPanel.find('.tab > .item');
        items.click(function () {
            if ($(this).hasClass('active')) return;
            items.removeClass('active');
            $(this).addClass('active');
            var dataTab = $(this).attr('data-tab');
            thisPanel.find('.content > .item').removeClass('active');
            thisPanel.find('.content > .item[data-content="' + dataTab + '"]').addClass('active');
        });
    };

    // 准备工作
    var doPrepare = function () {
        AgentCtrl.request('PREPARE_ADD_ACCOUNT', {
            success: function (res) {
                if (res.error == 0) {
                    initType(res.data);
                    buildQuota(res.data);
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

    var initType = function (data) {
        var rangeData = [{
            minPoint: data.lotteryPlayerRange.minPoint,
            maxPoint: data.lotteryPlayerRange.maxPoint
        }, {
            minPoint: data.lotteryAgentRange.minPoint,
            maxPoint: data.lotteryAgentRange.maxPoint
        }];
        var typeGroup = thisPanel.find('[data-init="type"]');
        typeGroup.find('input[name="type"]').click(function () {
            var val = parseInt($(this).val());
            var thisForm = $(typeGroup).parents('form');
            var helpSpan = thisForm.find('[data-help="lotteryPoint"]');
            var minPoint = rangeData[val].minPoint;
            var maxPoint = rangeData[val].maxPoint;
            if (minPoint < maxPoint) {
                helpSpan.html('可分配返点范围：' + minPoint + '~' + maxPoint);
            } else {
                helpSpan.html('无法开户，请联系上级代理调整返点');
            }
        });
        typeGroup.find('input[name="type"]').trigger('click');
    };

    var buildQuota = function (data) {
        var t = thisPanel.find('[data-table="quota"]');
        if (data.isNeedQuota == false) {
            t.hide();
            return;
        }
        t.find('tbody').empty();
        var list = data.lotteryCodeQuotaList;
        if (list.length == 0) {
            t.hide();
            return;
        }
        $.each(list, function (i, v) {
            var formatPoint = v.minPoint.toFixed(1);
            if (v.minPoint != v.maxPoint) {
                formatPoint += ' ~ ' + v.maxPoint.toFixed(1);
            }
            var innerHtml =
                '<tr>\
                    <td class="text-center">' + formatPoint + '</td>\
                    <td class="text-center">' + v.totalAmount + '</td>\
                    <td class="text-center">' + (v.totalAmount - v.surplusAmount) + '</td>\
                    <td class="text-center">' + v.surplusAmount + '</td>\
                </tr>';
            t.find('tbody').append(innerHtml);
        });
        t.show();
    };

    var initCreateAccount = function () {
        var p = thisPanel.find('[data-content="add-account"]');
        var testForm = function (data) {
            if (data.username == '') {
                AlertUtils.alert({
                    icon: 'info',
                    content: '用户名不能为空！'
                });
                return false;
            }
            if (data.lotteryPoint == '' ||
                isNaN(parseFloat(data.lotteryPoint)) ||
                data.lotteryPoint < 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '请填写正确的返点数字！'
                });
                return false;
            }
            return true;
        };
        p.find('[data-command="create"]').click(function () {
            var type = p.find('input[name="type"]:checked').val();
            var username = p.find('input[name="username"]').val();
            var lotteryPoint = p.find('input[name="lotteryPoint"]').val();
            var data = {
                type: type,
                username: username,
                lotteryPoint: lotteryPoint
            };
            if (testForm(data)) {
                doSubmit(data);
            }
        });
        var doSubmit = function (data) {
            AgentCtrl.request('ADD_ACCOUNT', {
                data: data,
                success: function (res) {
                    if (res.error == 0) {
                        AlertUtils.alert({
                            icon: 'success',
                            content: '创建用户成功！<br/>用户名：' + data.username + '<br/>初始密码：a123456'
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
    };

    var initCreateLink = function () {
        var p = thisPanel.find('[data-content="add-link"]');
        var testForm = function (data) {
            if (data.amount == '' ||
                isNaN(parseInt(data.amount)) ||
                data.amount < 1) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '链接使用次数必须为大于0的整数！'
                });
                return false;
            }
            if (data.lotteryPoint == '' ||
                isNaN(parseFloat(data.lotteryPoint)) ||
                data.lotteryPoint < 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '请填写正确的返点数字！'
                });
                return false;
            }
            return true;
        };
        p.find('[data-command="create"]').click(function () {
            var type = p.find('input[name="type"]:checked').val();
            var time = p.find('select[name="time"]').val();
            var amount = p.find('input[name="amount"]').val();
            var lotteryPoint = p.find('input[name="lotteryPoint"]').val();
            var data = {
                type: type,
                time: time,
                amount: amount,
                lotteryPoint: lotteryPoint
            };
            if (testForm(data)) {
                doSubmit(data);
            }
        });
        var doSubmit = function (data) {
            AgentCtrl.request('ADD_REGIST_LINK', {
                data: data,
                success: function (res) {
                    if (res.error == 0) {
                        AlertUtils.alert({
                            icon: 'success',
                            content: '创建链接成功'
                        });
                        ManageLink.reload();
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
        ManageLink.init();
    };

    // 初始化
    initTab();
    doPrepare();
    initCreateAccount();
    initCreateLink();

    ManageLink.init();
});

var ManageLink = function () {

    var thisPanel = $('#manager-link');

    // 请求数据
    var reqData = {
        page: 0,
        size: 10
    };

    // 接受数据
    var resData = {};

    // 初始化分页
    var easyPage;
    var initPage = function () {
        var element = thisPanel.find('.easy-page');
        if (easyPage) return; // 已经初始化过的不能初始化
        easyPage = element.EasyPage({
            showPage: 6,
            pageSize: reqData.size,
            onPage: function (page) {
                reqData.page = page - 1;
                doSearch(); // 调用搜索
            }
        });
        easyPage.init();
    };

    // 更新分页
    var updatePage = function () {
        easyPage.update(resData.totalCount, reqData.page + 1);
    };

    // 重载分页
    var reloadPage = function () {
        easyPage.reload();
    };

    // 查询
    var doSearch = function () {
        AgentCtrl.request('LIST_REGIST_LINK', {
            data: reqData,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    resData = res.data;
                    buildData();
                    updatePage();
                }
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };

    // 构建空数据
    var buildEmptyBody = function () {
        if (resData.list.length > 0) {
            thisPanel.removeClass('hide');
        } else {
            thisPanel.addClass('hide');
        }
    };

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var url = Tools.getDomain() + '/reg.html?' + v.code;
                var formatTime = '永不过期';
                if (v.expireTime) {
                    formatTime = moment(v.expireTime).format('YYYY-MM-DD');
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">' + (i + 1) + '</a></td>\
                        <td class="text-center">\
                            <a target="_black" href="' + url + '">' + v.code + '</a>\
                        </td>\
                        <td class="text-center">' + DataFormat.Account.type(v.type) + '</td>\
                        <td class="text-center">' + v.point.toFixed(1) + '</td>\
                        <td class="text-center">' + formatTime + '</td>\
                        <td class="text-center">' + v.amount + '</td>\
						<td id="fzlj' + (i + 1) + '" style="width:1px; overflow:hidden" >' + url + '</td>\
                        <td class="text-center">\
                            <a data-command="delete" class="static-link">删除</a>\
							<a class="copy-btn" data-clipboard-action="copy" data-clipboard-target="#fzlj' + (i + 1) + '" class="static-link">复制链接</a>\
                        </td>\
                    </tr>';
                var $thisRow = $(tpl);
				var clipboard = new Clipboard('.copy-btn');

					clipboard.on('success', function(e) {
						console.log(e);
					});

					clipboard.on('error', function(e) {
						console.log(e);
				});
                $thisRow.find('[data-command="delete"]').click(function () {
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '确定要删除该注册链接？',
                        confirmFn: function () {
                            doDelete({id: v.id});
                        }
                    });
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyBody();
    };

    // 删除
    var doDelete = function (data) {
        AgentCtrl.request('DELETE_REGIST_LINK', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '成功删除注册链接'
                    });
                    reloadPage();
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
    var init = function () {
        initPage();
    };

    // 重新加载
    var reload = function () {
        reloadPage();
    };

    return {
        init: init,
        reload: reload
    }

}();