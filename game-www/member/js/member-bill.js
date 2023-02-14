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
        reqData.accountType = p.find('select[name="accountType"]').val();
        reqData.type = p.find('select[name="type"]').val();
        reqData.sTime = p.find('input[name="sDate"]').val();
        reqData.eTime = p.find('input[name="eDate"]').val();
    };

    // 查询
    var doSearch = function () {
        initReqData();
        AccountCtrl.request('SEARCH_BILL', {
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
                var btnDetails = '';
                if ($.inArray(v.type, ['1300', '1301', '1302', '1303', '1304', '1400'])) {
                    btnDetails = '<a data-command="details">' + v.billno.substring(16) + '</a>';
                }
                var btnRemarks = '无';
                if (v.remarks) {
                    btnRemarks = '<a title="' + v.remarks + '">备注</a>';
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">' + btnDetails + '</td>\
                        <td class="text-center">' + DataFormat.Account.valueOf(v.accountType) + '</td>\
                        <td class="text-center">' + DataFormat.AccountBill.type(v.type) + '</td>\
                        <td class="text-center">' + Tools.formatMoney(v.amount) + '</td>\
                        <td class="text-center">' + Tools.formatMoney(v.balanceBefore) + '</td>\
                        <td class="text-center">' + Tools.formatMoney(v.balanceAfter) + '</td>\
                        <td class="text-center">' + moment(v.time).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                        <td class="text-center">' + btnRemarks + '</td>\
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
        AccountCtrl.request('GET_BILL_DETAILS', {
            data: {
                billno: billno
            },
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    if (res.data.type == 'GameLotteryOrder') {
                        LotteryOrderModal.init(res.data.result, {
                            onCancel: function () {
                                easyPage.reload();
                            }
                        });
                    }
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
        p.find('input[name="sDate"]').val(moment().subtract(2, 'days').format('YYYY-MM-DD'));
        p.find('input[name="eDate"]').val(moment().add(1, 'days').format('YYYY-MM-DD'));
        initDatePicker(p);
    };

    // 初始化
    initSearchForm();
    initPage();
});