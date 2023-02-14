$(document).ready(function () {

    var thisPanel = $('.main-panel');

    // 请求数据
    var reqData = {};

    // 接受数据
    var resData = {};

    // 搜索条件
    var initReqData = function () {
        var p = $(thisPanel).find('.form-search');
		//var day2 = new Date();
  		//day2.setTime(day2.getTime());
  		//var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
        reqData.sDate = p.find('input[name="sDate"]').val();
        reqData.eDate = p.find('input[name="eDate"]').val();
    };

    // 查询
    var doSearch = function () {
        initReqData();
        AccountCtrl.request('REPORT_GAME_LOTTERY', {
            data: reqData,
            beforeSend: function () {
                $(thisPanel).ajaxLoading(true);
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
                $(thisPanel).ajaxLoading(false);
            }
        });
    };

    // 构建数据
    var buildData = function () {
        var $thisTable = $(thisPanel).find('table');
		var Account = store.get('PRIVATE:Account');
		
        $thisTable.find('tbody').empty();
        if (resData.length > 0) {
            $.each(resData, function (i, v) {
                
				if (Account.type == 1) {
        			var tpl =
                    '<tr>\
                        <td class="text-center">' + v.field + '</td>\
                        <td class="text-center">' + v.recharge.toFixed(3) + '</td>\
                        <td class="text-center">' + v.withdraw.toFixed(3) + '</td>\
                        <td class="text-center">' + v.consume.toFixed(3) + '</td>\
                        <td class="text-center">' + v.bonus.toFixed(3) + '</td>\
                        <td class="text-center">' + (v.rebateConsume + v.rebateAgent).toFixed(3) + '</td>\
                        <td class="text-center">' + v.activity.toFixed(3) + '</td>\
						<td class="text-center">' + v.feeAmount.toFixed(3) + '</td>\
                        <td class="text-center">' + v.profit.toFixed(3) + '</td>\
                    </tr>';
				}else{
					var tpl =
                    '<tr>\
                        <td class="text-center">' + v.field + '</td>\
                        <td class="text-center">' + v.recharge.toFixed(3) + '</td>\
                        <td class="text-center">' + v.withdraw.toFixed(3) + '</td>\
                        <td class="text-center">' + v.consume.toFixed(3) + '</td>\
                        <td class="text-center">' + v.bonus.toFixed(3) + '</td>\
                        <td class="text-center">' + (v.rebateConsume + v.rebateAgent).toFixed(3) + '</td>\
                        <td class="text-center">' + v.activity.toFixed(3) + '</td>\
                        <td class="text-center">' + v.profit.toFixed(3) + '</td>\
                    </tr>';
				}
                var $thisRow = $(tpl);
                $thisTable.find('tbody').append($thisRow);
            });
        }
    };

    // 搜索按钮
    $(thisPanel).find('[data-command="search"]').click(function () {
        doSearch();
    });

    // 初始化搜索
    var initSearchForm = function () {
        var p = $(thisPanel).find('.form-search');
        p.find('input[name="sDate"]').val(moment().subtract(6, 'days').format('YYYY-MM-DD'));
        p.find('input[name="eDate"]').val(moment().add(1, 'days').format('YYYY-MM-DD'));
        initDatePicker(p);
    };

    // 初始化
    initSearchForm();
    doSearch();
});