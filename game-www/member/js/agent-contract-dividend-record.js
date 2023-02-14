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
        ContractCtrl.request('LIST_DIVIDEND_RECORD', {
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

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var btnStatus = '';
                if (v.status == -1) {
                    btnStatus = '<span style="color: #FB5D6A">已拒绝</span>';
                }
                if (v.status == 1) {
                    btnStatus = '<span style="color: #519B3B">已发放</span>';
                }
                if (v.status == 0) {
                    btnStatus = '<span style="color: #EF8B26">未发放</span>';
                }
                if (i > 0) {
                    if (v.status == 0) {
                        btnStatus = '<a data-command="draw" style="color: #EF8B26" class="static-link">[发放分红]</a>';
                    }
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">' + v.username + '</td>\
                        <td class="text-center">' + v.totalConsume.toFixed(3) + '</td>\
                        <td class="text-center">' + v.totalLoss.toFixed(3) + '</td>\
                        <td class="text-center">' + v.activeUser + '</td>\
                        <td class="text-center">' + v.scalePoint + '%</td>\
                        <td class="text-center">' + v.amount.toFixed(3) + '</td>\
                        <td class="text-center">' + moment(v.startDate).format('MM-DD') + '~' + moment(v.endDate).format('MM-DD') + '</td>\
                        <td class="text-center">' + btnStatus + '</td>\
                        <!--<td class="text-center">' + v.accumulationTotalAmount.toFixed(3) + '</td>-->\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('[data-command="draw"]').click(function () {
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '确认发放下级分红？',
                        confirmFn: function () {
                            doDraw({
                                id: v.id
                            });
                        }
                    });
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyBody();
    };

    var doDraw = function (data) {
        ContractCtrl.request('DRAW_DIVIDEND_RECORD', {
            data: data,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '分红发放成功！'
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
    };

    initSearchForm();
    initPage();
});