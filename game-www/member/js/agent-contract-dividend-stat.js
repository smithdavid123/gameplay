$(document).ready(function () {

    var thisPanel = $('.main-panel');

    var resData = [];

    // 加载数据
    var loadData = function () {
        ContractCtrl.request('STAT_DIVIDEND_RECORD', {
            beforeSend: function () {
                $(thisPanel).ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    resData.list = res.data;
                    buildData(res.data);
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
                $(thisPanel).ajaxLoading(false);
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

    // 构建契约分红
    var buildData = function (data) {
        var $thisTable = $(thisPanel).find('table');
        $thisTable.find('tbody').empty();
        $.each(data, function (i, v) {
            var tpl =
                '<tr>\
                    <td class="text-center">' + v.username + '</td>\
                    <td class="text-center">' + v.totalConsume.toFixed(3) + '</td>\
                    <td class="text-center">' + v.totalLoss.toFixed(3) + '</td>\
                    <td class="text-center">' + v.activeUser + '</td>\
                    <td class="text-center">' + v.scalePoint + '%</td>\
                    <td class="text-center">' + v.amount.toFixed(3) + '</td>\
                    <td class="text-center">' + moment(v.startDate).format('MM-DD') + '~' + moment(v.endDate).format('MM-DD') + '</td>\
                    <!--<td class="text-center">' + v.accumulationTotalAmount.toFixed(3) + '</td>-->\
                </tr>';
            var $thisRow = $(tpl);
            $thisTable.find('tbody').append($thisRow);
        });
        buildEmptyBody();
    };

    loadData();
});