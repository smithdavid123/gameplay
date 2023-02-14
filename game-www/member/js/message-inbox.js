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
        reqData.username = p.find('input[name="username"]').val();
        reqData.sTime = p.find('input[name="sDate"]').val();
        reqData.eTime = p.find('input[name="eDate"]').val();
    };

    // 查询
    var doSearch = function () {
        initReqData();
        AccountCtrl.request('LIST_MESSAGE', {
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

    // 更新所有选中行
    var updateTotalSelect = function () {
        var p = thisPanel.find('.form-search');
        var $thisTable = thisPanel.find('table');
        var totalSelectCount = $thisTable.find('tbody').find('input[type="checkbox"]:checked').length;
        p.find('[data-command="delete"]').find('span').html(totalSelectCount);
    };

    // 获取所有选中的id
    var getSelectIds = function () {
        var $thisTable = thisPanel.find('table');
        var ids = [];
        $thisTable.find('tbody').find('input[type="checkbox"]:checked').each(function () {
            ids.push($(this).val());
        });
        return ids;
    };

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var formatForm = v.fromAccount;
                if (v.type == 0) {
                    if (v.isFromUp) {
                        formatForm = '上级';
                    }
                }
                if (v.type == 1) {
                    formatForm = '系统';
                }
                if (v.type == 2) {
                    formatForm = '管理员';
                }
                var tpl =
                    '<tr">\
                        <td class="text-center"><input type="checkbox" value="' + v.id + '"></td>\
                        <td class="text-center">' + formatForm + '</td>\
                        <td class="text-center">' + v.subject + '</td>\
                        <td class="text-center">' + moment(v.time).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                        <td class="text-center">' + DataFormat.AccountMessage.status(v.status) + '</td>\
                        <td class="text-center">\
                            <a data-command="details" class="static-link">详情</a>\
                            <a data-command="delete" class="static-link">删除</a>\
                        </td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('input[type="checkbox"]').click(function () {
                    updateTotalSelect();
                });
                $thisRow.find('[data-command="details"]').click(function () {
					readMessage(v.id);
                    AccountMessageModal.init(v, {
                        onDelete: function () {
                            easyPage.reload();
							
                        }
                    });
                });
                $thisRow.find('[data-command="delete"]').click(function () {
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '确定要删除消息？',
                        confirmFn: function() {
                            var ids = [v.id];
                            doDelete({
                                ids: ids.toString()
                            });
                        }
                    });
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyData();
    };

    // 删除操作
    var doDelete = function (data) {
        AccountCtrl.request('DELETE_MESSAGE', {
            data: data,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '删除消息成功！'
                    });
                    easyPage.reload();
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
	//读取消息
	var readMessage = function (id) {
        AccountCtrl.request('READ_MESSAGE', {
			data:{ids:id},
            success: function (res) {
				doSearch()
            }
        });
    };
    // 初始化函数
    var initEvent = function () {
        var p = thisPanel.find('.form-search');
        var $thisTable = thisPanel.find('table');
        p.find('[data-command="delete"]').click(function () {
            var ids = getSelectIds();
            if (ids.length == 0) {
                AlertUtils.alert({
                    icon: 'info',
                    content: '请先选择要删除的消息！'
                });
                return;
            }
            AlertUtils.confirm({
                icon: 'question',
                content: '确定要删除这' + ids.length + '条消息？',
                confirmFn: function() {
                    doDelete({
                        ids: ids.toString()
                    });
                }
            });
        });
        $thisTable.find('thead').find('input[type="checkbox"]').click(function () {
            if ($(this).is(':checked')) {
                $thisTable.find('tbody').find('input[type="checkbox"]').each(function () {
                    if (!$(this).is(':checked')) {
                        $(this).trigger('click');
                    }
                });
            } else {
                $thisTable.find('tbody').find('input[type="checkbox"]').each(function () {
                    if ($(this).is(':checked')) {
                        $(this).trigger('click');
                    }
                });
            }
        });
    };

    // 初始化
    initEvent();
    initPage();

});