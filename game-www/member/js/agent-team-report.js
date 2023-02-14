$(document).ready(function () {

    var thisPanel = $('.main-panel');

    // 请求数据
    var reqData = {};

    // 接受数据
    var resData = [];

    // 搜索条件
    var initReqData = function () {
        var p = thisPanel.find('.form-search');
        reqData.username = p.find('input[name="username"]').val();
        reqData.sDate = p.find('input[name="sDate"]').val();
        reqData.eDate = p.find('input[name="eDate"]').val();
    };

    // 查询
    var doSearch = function (init) {
        initReqData();
        AgentCtrl.request('REPORT_GAME_LOTTERY', {
            data: reqData,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    resData = res.data;
                    buildData();
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

    var url_username = Tools.getUrl('username');

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.length > 0) {
            $.each(resData, function (i, v) {
                var linkField = v.field;
                var sIndex = url_username ? 0 : 1;
                if (i > sIndex) {
                    var sHref = '?username=' + v.field + '&sDate=' + reqData.sDate + '&eDate=' + reqData.eDate;
                    linkField = '<a href="' + sHref + '" class="static-link">' + v.field + '</a>';
                }
                if (url_username && i == (sIndex + 1)) {
                    linkField = '<a data-command="back" class="static-link"><i class="fa fa-hand-o-left"></i> ' + v.field + '</a>';
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">' + linkField + '</td>\
                        <td class="text-center">' + v.recharge.toFixed(3) + '</td>\
                        <td class="text-center">' + v.withdraw.toFixed(3) + '</td>\
                        <td class="text-center">' + v.consume.toFixed(3) + '</td>\
                        <td class="text-center">' + v.bonus.toFixed(3) + '</td>\
                        <td class="text-center">' + (v.rebateConsume + v.rebateAgent).toFixed(3) + '</td>\
                        <td class="text-center">' + v.activity.toFixed(3) + '</td>\
						<td class="text-center">' + v.feeAmount.toFixed(3) + '</td>\
                        <td class="text-center">' + v.profit.toFixed(3) + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('[data-command="back"]').click(function () {
                    window.history.go(-1);
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
    };

    // 搜索按钮
    thisPanel.find('[data-command="search"]').click(function () {
        doSearch();
    });

    // 初始化搜索
    var initSearchForm = function () {
        var p = thisPanel.find('.form-search');
        if (url_username) {
            p.find('input[name="username"]').val(url_username);
        }
        var sDate = Tools.getUrl('sDate');
        if (sDate) {
            p.find('input[name="sDate"]').val(sDate);
        } else {
            p.find('input[name="sDate"]').val(moment().format('YYYY-MM-DD'));
        }
        var eDate = Tools.getUrl('eDate');
        if (eDate) {
            p.find('input[name="eDate"]').val(eDate);
        } else {
            p.find('input[name="eDate"]').val(moment().add(1, 'days').format('YYYY-MM-DD'));
        }
        initDatePicker(p);
    };

    // 初始化
    initSearchForm();
    doSearch(true);

});