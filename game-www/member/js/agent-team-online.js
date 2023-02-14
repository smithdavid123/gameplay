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

    // 查询
    var doSearch = function () {
        AgentCtrl.request('LIST_ONLINE_ACCOUNT', {
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

    var formatUser = function(list) {
        var result = '';
        $.each(list, function(i, val) {
            if (i != 0) {
                result += ' &gt; ';
            }
            result += val;
        });
        return result;
    };

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        var lastRows = reqData.size;
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var btnAction = '<a href="agent-team-order.html?username=' + v.username + '" class="static-link">订单</a>';
                btnAction += '<a href="agent-team-bill.html?username=' + v.username + '" class="static-link">账单</a>';
                btnAction += '<a href="agent-team-report.html?username=' + v.username + '" class="static-link">报表</a>';
                var tpl =
                    '<tr>\
                        <td class="text-center">' + v.username + '</td>\
                        <td class="text-center">' + v.lotteryBalance.toFixed(2) + '</td>\
                        <td class="text-center">' + v.baccaratBalance.toFixed(2) + '</td>\
                        <td class="text-center">' + formatUser(v.relationships) + '</td>\
                        <td class="text-center">' + moment(v.loginTime).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                        <td class="text-center btn-gp">' + btnAction + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyData();
    };

    // 初始化
    initPage();

});