$(document).ready(function () {

    var thisPanel = $('.main-panel');

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

    // 搜索条件
    var initReqData = function () {
        var p = thisPanel.find('.form-search');
        reqData.username = p.find('input[name="username"]').val();
		reqData.type = p.find('select[name="type"]').val();
    };

    // 查询
    var doSearch = function () {
        initReqData();
        AgentCtrl.request('LIST_TEAM_ACCOUNT', {
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

    // 构建空数据
    var buildEmptyData = function () {
        if (resData.list.length > 0) {
            thisPanel.find('.table-responsive').removeClass('hide');
            thisPanel.find('.empty-data').addClass('hide');
        } else {
            thisPanel.find('.table-responsive').addClass('hide');
            thisPanel.find('.empty-data').removeClass('hide');
        }
    };

    var url_username = Tools.getUrl('username');

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var formatUsername = '<a href="?username=' + v.username + '">' + v.username + '</a>';
                if (url_username && i == 0) {
                    formatUsername = '<a data-command="back" class="static-link"><i class="fa fa-hand-o-left"></i> ' + v.username + '</a>';
                }
                var btnAction = '';
                if (v.type != 0) {
                    if (v.isNeedQuota) {
                        btnAction += '<a data-command="quota" class="static-link">配额</a>';
                    }
                }
                if (v.isMyDirect) {
                    if (v.isNeedQuota) {
                        btnAction += '<a data-command="select-point" class="static-link">升点选择</a>';
                    } else {
                        btnAction += '<a data-command="change-point" class="static-link">修改返点</a>';
                    }
                }
                if (v.allowTransfer) {
                    btnAction += '<a data-command="transfer" class="static-link">转账</a>';
                }
                var formatLoginTime = '从未登录过';
                if (v.loginTime) {
                    formatLoginTime = moment(v.loginTime).format('YYYY-MM-DD HH:mm:ss');
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">' + formatUsername + '</td>\
                        <td class="text-center">' + DataFormat.Account.type(v.type) + '</td>\
                        <td class="text-center">' + v.lotteryBalance.toFixed(2) + '</td>\
                        <td class="text-center">' + v.lotteryPoint.toFixed(1) + '</td>\
                        <td class="text-center">' + formatLoginTime + '</td>\
                        <td class="text-center btn-gp">' + btnAction + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('[data-command="back"]').click(function () {
                    window.history.go(-1);
                });
                $thisRow.find('[data-command="transfer"]').click(function () {
                    AgentTransferModal.init({
                        username: v.username
                    }, reloadPage);
                });
                $thisRow.find('[data-command="quota"]').click(function () {
                    AgentEditQuotaModal.init({
                        username: v.username
                    });
                });
                $thisRow.find('[data-command="change-point"]').click(function () {
                    AgentEditPointByQuotaModal.init({
                        username: v.username
                    });
                });
                $thisRow.find('[data-command="select-point"]').click(function () {
                    AlertUtils.confirm({
                        title: '升点选择',
                        content: '请选择用户升点方式',
                        confirmText: '配额升点',
                        confirmFn: function(index) {
                            layer.close(index);
                            AgentEditPointByQuotaModal.init({
                                username: v.username
                            });
                        },
                        cancelText: '按量升点',
                        cancelFn: function() {
                            AgentEditPointByAmountModal.init({
                                username: v.username
                            });
                        }
                    });
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyData();
    };

    // 搜索按钮
    thisPanel.find('[data-command="search"]').click(function () {
        easyPage.init();
    });

    // 初始化搜索
    var initSearchForm = function () {
        var p = thisPanel.find('.form-search');
        if (url_username) {
            p.find('input[name="username"]').val(url_username);
        }
    };

    // 初始化
    initSearchForm();
    initPage();

});