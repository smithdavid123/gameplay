$(document).ready(function () {
	GamesimulationCtrl.request('LIST_ALL_GAMES', {
            success: function (res) {
                if (res.error == 0){
					var data = sortBaccarat(res.data.gameList);
					var search_list = $('[name="lottery"]')
					$.each(data, function (i, v) {
					var search_con = '<option value="'+v.id+'">'+v.name+'</option>'
					search_list.append(search_con);
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
        });

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
		
        reqData.gameId = p.find('select[name="lottery"]').val();
        reqData.sDate = p.find('input[name="sDate"]').val();
        reqData.eDate = p.find('input[name="eDate"]').val();
    };
	
    // 查询
    var doSearch = function () {
        initReqData();
        GamesimulationCtrl.request('SEARCH_PLAYRECORD_REPORT', {
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
                        <td class="text-center">' + v.gameName + '</td>\
                        <td class="text-center">' + v.depositAmount.toFixed(3) + '</td>\
                        <td class="text-center">' + v.withdrawAmount.toFixed(3) + '</td>\
                        <td class="text-center">' + v.betAmount.toFixed(3) + '</td>\
						<td class="text-center">' + v.bonusAmount.toFixed(3) + '</td>\
                        <td width="160px" class="text-center">' + moment(v.reportDate).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyData();
    };

    // 显示详情
    

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