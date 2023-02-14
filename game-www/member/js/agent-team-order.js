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

    // 搜索条件
    var initReqData = function () {
        var p = thisPanel.find('.form-search');
        reqData.lottery = p.find('select[name="lottery"]').val();
        reqData.status = p.find('select[name="status"]').val();
        reqData.username = p.find('input[name="username"]').val();
        reqData.issue = p.find('input[name="issue"]').val();
        reqData.sTime = p.find('input[name="sDate"]').val();
        reqData.eTime = p.find('input[name="eDate"]').val();
    };

    // 查询
    var doSearch = function () {
        initReqData();
        AgentCtrl.request('SEARCH_GAME_LOTTERY_ORDER', {
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

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var tpl =
                    '<tr>\
                        <td class="text-center">\
                            <a data-command="details">' + v.billno.substr(16) + '</a>\
                        </td>\
                        <td class="text-center">' + v.account + '</td>\
                        <td class="text-center">' + v.lottery + '</td>\
                        <td class="text-center">' + v.method + '</td>\
                        <td class="text-center">' + v.issue + '</td>\
                        <td class="text-center">' + v.money.toFixed(3) + '</td>\
                        <td class="text-center">' + (v.winMoney ? v.winMoney : 0).toFixed(3) + '</td>\
                        <td class="text-center">' + DataFormat.GameLotteryOrder.status(v.status, true) + '</td>\
                        <td class="text-center">' + moment(v.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('[data-command="details"]').click(function () {
                    doShowDetails(v.billno);
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyData();
    };

    // 显示详情
    var doShowDetails = function (billno) {
        AgentCtrl.request('GET_LOTTERY_ORDER', {
            data: {
                billno: billno
            },
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    LotteryOrderModal.init(res.data, {
                        readOnly: true
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
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };

    // 搜索按钮
    thisPanel.find('[data-command="search"]').click(function () {
        easyPage.init();
    });

    // 初始化搜索
    var initSearchForm = function () {
        var p = thisPanel.find('.form-search');
        var username = Tools.getUrl('username');
        if (username) {
            p.find('input[name="username"]').val(username);
        }
        p.find('input[name="sDate"]').val(moment().format('YYYY-MM-DD'));
        p.find('input[name="eDate"]').val(moment().add(1, 'days').format('YYYY-MM-DD'));
        initDatePicker(p);
    };

    // 初始化
    initSearchForm();
    initPage();

    initLottery();

});