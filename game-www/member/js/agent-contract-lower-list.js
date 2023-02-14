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
    };

    // 查询
    var doSearch = function () {
        initReqData();

        ContractCtrl.request('LIST_CONTRACT_ACCOUNT', {
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
    var buildEmptyBody = function () {
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
                if (resData.list[i].type == 1) {
                    var btnAction = '';
                    if (i == 0) {
                        btnAction = '<a data-command="team-report" class="static-link">[团队报表]</a>';
                        // 全按鈕測試
                        // btnAction += '<a data-command="lower-report" class="static-link">[报表]</a>';
                        // btnAction += '<a data-command="salary-contract" class="static-link">[签订工资]</a>';
                        // btnAction += '<a data-command="salary-contract" style="color: #EF8B26" class="static-link">[待确认工资]</a>';
                        // btnAction += '<a data-command="salary-contract" style="color: #519B3B" class="static-link">[已签订工资]</a>';
                        // btnAction += '<a data-command="salary-contract" style="color: #FB5D6A" class="static-link">[拒签工资]</a>';
                        // btnAction += '<a data-command="dividend-contract" class="static-link">[签订分红]</a>';
                        // btnAction += '<a data-command="dividend-contract" style="color: #EF8B26" class="static-link">[待确认分红]</a>';
                        // btnAction += '<a data-command="dividend-contract" style="color: #519B3B" class="static-link">[已签订分红]</a>';
                        // btnAction += '<a data-command="dividend-contract" style="color: #FB5D6A" class="static-link">[拒签分红]</a>';

                    } else {
                        btnAction += '<a data-command="lower-report" class="static-link">[报表]</a>';
                        if (v.mSalaryStatus != null) {
                            if (v.mSalaryStatus == 1) {
                                if (v.uSalaryStatus == null) {
                                    btnAction += '<a data-command="salary-contract" class="static-link">[签订工资]</a>';
                                }
                            }
                            if (v.uSalaryStatus == 0) {
                                btnAction += '<a data-command="salary-contract" style="color: #EF8B26" class="static-link">[待确认工资]</a>';
                            }
                            if (v.uSalaryStatus == 1) {
                                btnAction += '<a data-command="salary-contract" style="color: #519B3B" class="static-link">[已签订工资]</a>';
                            }
                            if (v.uSalaryStatus == -1) {
                                btnAction += '<a data-command="salary-contract" style="color: #FB5D6A" class="static-link">[拒签工资]</a>';
                            }
                        }
                        if (v.mDividendStatus != null) {
                            if (v.mDividendStatus == 1) {
                                if (v.uDividendStatus == null) {
                                    btnAction += '<a data-command="dividend-contract" class="static-link">[签订分红]</a>';
                                }
                            }
                            if (v.uDividendStatus == 0) {
                                btnAction += '<a data-command="dividend-contract" style="color: #EF8B26" class="static-link">[待确认分红]</a>';
                            }
                            if (v.uDividendStatus == 1) {
                                btnAction += '<a data-command="dividend-contract" style="color: #519B3B" class="static-link">[已签订分红]</a>';
                            }
                            if (v.uDividendStatus == -1) {
                                btnAction += '<a data-command="dividend-contract" style="color: #FB5D6A" class="static-link">[拒签分红]</a>';
                            }
                        }
                    }


                    var formatLoginTime = '从未登录过';
                    if (v.loginTime) {
                        formatLoginTime = moment(v.loginTime).format('YYYY-MM-DD');
                    }
                    var tpl =
                        '<tr>\
                        <td class="text-center">' + v.username + '</td>\
                        <td class="text-center">' + v.teamBalance.toFixed(2) + '</td>\
                        <td class="text-center">' + v.teamCount + '</td>\
                        <td class="text-center">' + v.lotteryPoint.toFixed(1) + '</td>\
                        <td class="text-center">' + DataFormat.Account.type(v.type) + '</td>\
                        <td class="text-center">' + formatLoginTime + '</td>\
                        <td class="text-center">' + DataFormat.Account.onlineStatus(v.onlineStatus) + '</td>\
                        <td class="text-center btn-gp">' + btnAction + '</td>\
                    </tr>';
                    var $thisRow = $(tpl);
                    // 签订契约工资
                    $thisRow.find('[data-command="salary-contract"]').click(function () {

                        if (store.get('PRIVATE:salaryType') == 1) {
                            AgentEditSalaryModal.init({
                                username: v.username
                            }, reloadPage);
                        } else if (store.get('PRIVATE:salaryType') == 2) {
                            AgentEditSalaryModal2.init({
                                username: v.username
                            }, reloadPage);
                        } else if (store.get('PRIVATE:salaryType') == 3) {
                            AgentEditSalaryModal3.init({
                                username: v.username
                            }, reloadPage);
                        };
                    });
                    // 签订契约分红
                    $thisRow.find('[data-command="dividend-contract"]').click(function () {

                        if (store.get('PRIVATE:dividendType') == 1) {
                            AgentEditDividendContractModal.init({
                                username: v.username
                            }, reloadPage);
                        } else if (store.get('PRIVATE:dividendType') == 2) {
                            AgentEditDividendContractModal2.init({
                                username: v.username
                            }, reloadPage);
                        } else if (store.get('PRIVATE:dividendType') == 3) {
                            AgentEditDividendContractModal3.init({
                                username: v.username
                            }, reloadPage);
                        } else if (store.get('PRIVATE:dividendType') == 4) {
                            AgentEditDividendContractModal4.init({
                                username: v.username
                            }, reloadPage);
                        };
                    });
                    // 团队报表
                    $thisRow.find('[data-command="team-report"]').click(function () {
                        window.location.href = 'agent-team-report.html';
                    });
                    // 下级报表
                    $thisRow.find('[data-command="lower-report"]').click(function () {
                        window.location.href = 'agent-team-report.html?username=' + v.username;
                    });
                    $thisTable.find('tbody').append($thisRow);
                }
            });
        }
        buildEmptyBody();
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

    initSearchForm();
    initPage();
});