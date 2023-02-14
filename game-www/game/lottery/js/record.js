// 订单详情
var LotteryOrderModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div class="modal-table-wrapper lottery-order-details">\
                <table class="table table-bordered">\
                    <tbody>\
                        <tr>\
                            <td width="20%" class="text-center">订单号：</td>\
                            <td width="30%" data-field="billno"></td>\
                            <td width="20%" class="text-center">用户名：</td>\
                            <td width="30%" data-field="username"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">彩种：</td>\
                            <td data-field="lotteryName"></td>\
                            <td class="text-center">期号：</td>\
                            <td data-field="issue"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">玩法：</td>\
                            <td data-field="methodName"></td>\
                            <td class="text-center">注数：</td>\
                            <td data-field="nums"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">资金模式：</td>\
                            <td data-field="model"></td>\
                            <td class="text-center">倍数：</td>\
                            <td data-field="multiple"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">奖金模式：</td>\
                            <td data-field="bonusModel"></td>\
                            <td class="text-center">订单状态：</td>\
                            <td data-field="status"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">投注金额：</td>\
                            <td data-field="money"></td>\
                            <td class="text-center">中奖金额：</td>\
                            <td data-field="winMoney"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">加入时间：</td>\
                            <td data-field="orderTime"></td>\
                            <td class="text-center">截止时间：</td>\
                            <td data-field="stopTime"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">开奖号码：</td>\
                            <td colspan="3" data-field="openCode"></td>\
                        </tr>\
                        <tr>\
                            <td class="text-center">投注内容：</td>\
                            <td colspan="3">\
                                <textarea name="content" readonly="readonly" class="order-content" style="height: 100px; padding: 2px 4px;"></textarea>\
                            </td>\
                        </tr>\
                    </tbody>\
                </table>\
                <div data-hidden="readOnly" class="actions">\
                    <a data-command="print" class="btn-default">打印订单</a>\
                    <a data-command="cancel" class="btn-cancel">撤销订单</a>\
                    <a data-command="back" class="btn-return">返回列表</a>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initContent = function (data, opts) {
        var content = getContent();

        var t = content.find('table');
        var bonusModel = data.code;
        if (data.point > 0) {
            bonusModel += ' + 返点' + data.point.toFixed(1) + '%';
        }
        t.find('[data-field="billno"]').html(data.billno);
        t.find('[data-field="username"]').html(data.account);
        t.find('[data-field="lotteryName"]').html(data.lottery);
        t.find('[data-field="issue"]').html(data.issue);
        t.find('[data-field="methodName"]').html(data.method);
        t.find('[data-field="nums"]').html(data.nums);
        t.find('[data-field="model"]').html(DataFormat.GameLotteryOrder.model(data.model));
        t.find('[data-field="multiple"]').html(data.multiple);
        t.find('[data-field="bonusModel"]').html(bonusModel);
        t.find('[data-field="status"]').html(DataFormat.GameLotteryOrder.status(data.status));
        t.find('[data-field="money"]').html(data.money.toFixed(3));
        t.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
        t.find('[data-field="orderTime"]').html(moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss'));
        t.find('[data-field="stopTime"]').html(moment(data.stopTime).format('YYYY-MM-DD HH:mm:ss'));
        t.find('[data-field="openCode"]').html(data.openCode == null ? '无' : data.openCode);
        t.find('textarea[name="content"]').html(data.content);

        if (opts.readOnly) {
            content.find('[data-hidden="readOnly"]').remove();
        }

        if (data.allowCancel) {
            content.find('.btn-default').remove();
        } else {
            content.find('.btn-cancel').remove();
        }

        // 取消按钮事件
        content.find('[data-command="cancel"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确认撤销该订单吗？',
                confirmFn: function () {
                    doCancel(data.billno);
                }
            });
        });
		content.find('[data-command="print"]').click(function () {
            var printOrder = $('#print-order');
            printOrder.find('[data-field="openCode"]').html(data.openCode == null ? '无' : data.openCode);
			printOrder.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
			printOrder.find('[data-field="status"]').html(DataFormat.GameLotteryOrder.status(data.status));
			printOrder.find('[data-field="bonusModel"]').html(bonusModel);
			printOrder.find('[data-field="username"]').html(data.account);
            printOrder.find('[data-field="billno"]').html(data.billno);
            printOrder.find('[data-field="lotteryName"]').html(data.lottery);
            printOrder.find('[data-field="issue"]').html(data.issue);
            printOrder.find('[data-field="methodName"]').html(data.method);
            printOrder.find('[data-field="nums"]').html(data.nums);
            printOrder.find('[data-field="model"]').html(DataFormat.GameLotteryOrder.model(data.model));
            printOrder.find('[data-field="multiple"]').html(data.multiple);
            printOrder.find('[data-field="money"]').html(data.money.toFixed(3));
            printOrder.find('[data-field="orderTime"]').html(moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss'));
            printOrder.find('[data-field="stopTime"]').html(moment(data.stopTime).format('YYYY-MM-DD HH:mm:ss'));
			printOrder.find('[data-field="purchase"]').html(data.content);
            printJS('print-order', 'html');
        });
        // 返回按钮事件
        content.find('[data-command="back"]').click(function () {
            ModalBoxUtils.close();
        });

        return content;
    };

    // 回调函数
    var callback = {};
    // 撤销订单
    var doCancel = function (billno) {
        GameLotteryCtrl.request('CANCEL_ORDER', {
            data: {
                billno: billno
            },
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的订单已成功撤销'
                    });
                    callback.onCancel && callback.onCancel();
                }
                if (res.error == 1) {
                    if (noAlertMsg(res)) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: res.message
                        });
                    }
                }
            }
        });
    };

    // 初始化
    var init = function (data, opts) {
        var content = initContent(data, opts);
        ModalBoxUtils.init({
            width: 800,
            title: '订单详情',
            addClass: 'title-center',
            content: content
        });
        if (opts.onCancel) {
            callback.onCancel = opts.onCancel;
        }
    };

    return {
        init: init
    }
}();

// 追号详情
var LotteryChaseModal = function () {
    // 获取内容
    var getContent = function () {
        var tpl =
            '<div class="modal-table-wrapper lottery-order-details">\
                <div class="modal-tab">\
                    <div data-href="order" class="item active">订单详情</div>\
                    <div data-href="list" class="item">追号列表</div>\
                </div>\
                <div class="tab-content">\
                    <div data-tab="order" class="content-panel active">\
                        <table class="table table-bordered">\
                            <tbody>\
                                <tr>\
                                    <td width="20%" class="text-center">订单号：</td>\
                                    <td width="30%" data-field="billno"></td>\
                                    <td width="20%" class="text-center">用户名：</td>\
                                    <td width="30%" data-field="username"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">彩种：</td>\
                                    <td data-field="lotteryName"></td>\
                                    <td class="text-center">玩法：</td>\
                                    <td data-field="methodName"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">开始期号：</td>\
                                    <td data-field="startIssue"></td>\
                                    <td class="text-center">结束期号：</td>\
                                    <td data-field="endIssue"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">总期数：</td>\
                                    <td data-field="totalCount"></td>\
                                    <td class="text-center">已追期数：</td>\
                                    <td data-field="clearCount"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">注数：</td>\
                                    <td data-field="nums"></td>\
                                    <td class="text-center">资金模式：</td>\
                                    <td data-field="model"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">奖金模式：</td>\
                                    <td data-field="bonusModel"></td>\
                                    <td class="text-center">订单状态：</td>\
                                    <td data-field="status"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">总金额：</td>\
                                    <td data-field="totalMoney"></td>\
                                    <td class="text-center">总中奖：</td>\
                                    <td data-field="winMoney"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">下单时间：</td>\
                                    <td data-field="orderTime"></td>\
                                    <td class="text-center">中奖后停止追号：</td>\
                                    <td data-field="isWinStop"></td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">投注内容：</td>\
                                    <td colspan="3">\
                                        <textarea name="content" readonly="readonly" class="order-content" style="height: 100px; padding: 2px 4px;"></textarea>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        <div data-hidden="readOnly" class="actions">\
                            <a class="btn-default">无操作</a>\
                            <a data-command="cancel-chase" class="btn-cancel">撤销追单</a>\
                            <a data-command="back" class="btn-return">返回列表</a>\
                        </div>\
                    </div>\
                    <div data-tab="list" class="content-panel">\
                        <table class="table table-bordered table-data">\
                            <thead>\
                                <tr>\
                                    <td width="120px" class="text-center">期号</td>\
                                    <td class="text-center">倍数</td>\
                                    <td width="150px" class="text-center">开奖时间</td>\
                                    <td class="text-center">投注金额</td>\
                                    <td class="text-center">中奖金额</td>\
                                    <td class="text-center">状态</td>\
                                    <td width="100px" class="text-center">开奖号码</td>\
                                    <td width="60px" class="text-center">操作</td>\
                                </tr>\
                            </thead>\
                            <tbody></tbody>\
                        </table>\
                    </div>\
                </div>\
            </div>';
        return $(tpl);
    };
    // 初始化表格
    var initContent = function (data, opts) {
        var content = getContent();

        var modalTab = content.find('.modal-tab');
        var tabContent = content.find('.tab-content');

        // 初始化点击方法
        modalTab.find('.item').click(function () {
            if (!$(this).hasClass('active')) {
                modalTab.find('.item').removeClass('active');
                $(this).addClass('active');
                var dataHref = $(this).attr('data-href');
                tabContent.find('.content-panel').removeClass('active');
                tabContent.find('[data-tab="' + dataHref + '"]').addClass('active');
            }
        });

        var tabOrder = tabContent.find('[data-tab="order"]');
        var tabList = tabContent.find('[data-tab="list"]');

        // 构建订单详情
        var bonusModel = data.code;
        if (data.point > 0) {
            bonusModel += ' + 返点' + data.point.toFixed(1) + '%';
        }
        tabOrder.find('[data-field="billno"]').html(data.billno);
        tabOrder.find('[data-field="username"]').html(data.account);
        tabOrder.find('[data-field="lotteryName"]').html(data.lottery);
        tabOrder.find('[data-field="methodName"]').html(data.method);
        tabOrder.find('[data-field="startIssue"]').html(data.startIssue);
        tabOrder.find('[data-field="endIssue"]').html(data.endIssue);
        tabOrder.find('[data-field="totalCount"]').html(data.totalCount);
        tabOrder.find('[data-field="clearCount"]').html(data.clearCount);
        tabOrder.find('[data-field="nums"]').html(data.nums);
        tabOrder.find('[data-field="model"]').html(DataFormat.GameLotteryOrder.model(data.model));
        tabOrder.find('[data-field="bonusModel"]').html(bonusModel);
        tabOrder.find('[data-field="status"]').html(DataFormat.GameLotteryChase.status(data.status));
        tabOrder.find('[data-field="isWinStop"]').html(data.isWinStop ?　'是' : '否');
        tabOrder.find('[data-field="totalMoney"]').html(data.totalMoney.toFixed(3));
        tabOrder.find('[data-field="winMoney"]').html(data.winMoney.toFixed(3));
        tabOrder.find('[data-field="orderTime"]').html(moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss'));
        tabOrder.find('textarea[name="content"]').html(data.content);

        if (opts.readOnly) {
            tabOrder.find('[data-hidden="readOnly"]').remove();
        }

        if (data.allowCancel) {
            tabOrder.find('.btn-default').remove();
        } else {
            tabOrder.find('.btn-cancel').remove();
        }

        // 取消按钮事件
        tabOrder.find('[data-command="cancel-chase"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确认撤销该追单吗？',
                confirmFn: function () {
                    doCancelChase(data.billno);
                }
            });
        });

        // 返回按钮事件
        tabOrder.find('[data-command="back"]').click(function () {
            ModalBoxUtils.close();
        });

        // 构建追单列表
        $.each(data.chaseList, function (i, v) {
            var btnAction = '无操作';
            if (v.allowCancel) {
                btnAction = '<a data-command="cancel">撤单</a>';
            }
            var tmp =
                '<tr>\
                    <td class="text-center">' + v.issue + '</td>\
                    <td class="text-center">' + v.multiple + '</td>\
                    <td class="text-center">' + moment(v.openTime).format('YYYY-MM-DD HH:mm:ss') + '</td>\
                    <td class="text-center">' + v.money.toFixed(3) + '</td>\
                    <td class="text-center">' + v.winMoney.toFixed(3) + '</td>\
                    <td data-field="status" class="text-center">' + DataFormat.GameLotteryOrder.status(v.status) + '</td>\
                    <td class="text-center">' + (v.openCode ? v.openCode : '无') + '</td>\
                    <td data-field="action" class="text-center">' + btnAction + '</td>\
                </tr>';
            var $thisRow = $(tmp);
            $thisRow.find('[data-command="cancel"]').click(function () {
                AlertUtils.confirm({
                    icon: 'question',
                    content: '确定要撤销订单？',
                    confirmFn: function () {
                        doCancelOrder(v.billno, function () {
                            $thisRow.find('[data-field="status"]').html('已撤单');
                            $thisRow.find('[data-field="action"]').html('无操作');
                        });
                    }
                });
            });
            tabList.find('tbody').append($thisRow);
        });

        return content;
    };

    // 回调函数
    var callback = {};
    // 撤销订单
    var doCancelChase = function (billno) {
        GameLotteryCtrl.request('CANCEL_CHASE', {
            data: {
                billno: billno
            },
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的追单已成功撤销'
                    });
                    callback.onCancel && callback.onCancel();
                }
                if (res.error == 1) {
                    if (noAlertMsg(res)) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: res.message
                        });
                    }
                }
            }
        });
    };

    // 撤掉追单
    var doCancelOrder = function (billno, cb) {
        GameLotteryCtrl.request('CANCEL_ORDER', {
            data: {
                billno: billno
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您的订单已成功撤销'
                    });
                    cb && cb();
                }
                if (res.error == 1) {
                    if (noAlertMsg(res)) {
                        AlertUtils.alert({
                            icon: 'error',
                            content: res.message
                        });
                    }
                }
            }
        });
    };

    // 初始化
    var init = function (data, opts) {
        var content = initContent(data, opts);
        ModalBoxUtils.init({
            width: 800,
            title: '订单详情',
            addClass: 'title-center',
            content: content
        });
        if (opts.onCancel) {
            callback.onCancel = opts.onCancel;
        }
    };

    return {
        init: init
    }
}();

// 投注订单
var RecordOrder = function () {

    // 声明元素
    var thisPanel = $('[order-type="1"]').find('[data-name="order"]');

    // 请求数据
    var reqData = {
        page: 0,
        size: 5,
        methodType:1
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
    var reloadPage = function() {
        if (easyPage) {
            easyPage.reload();
        }
    };

    // 查询
    var doSearch = function () {
        GameLotteryCtrl.request('SEARCH_ORDER', {
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
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };

    // 撤销订单
    var doCancelOrder = function (data) {
        GameLotteryCtrl.request('CANCEL_ORDER', {
            data: data,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您已成功撤销订单'
                    });
                    reload();
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
        var lastRows = reqData.size;
        if (resData.list) {
            lastRows -= resData.list.length;
        }
        var cells = thisPanel.find('table > thead > tr > td').length;
        var tmpHtml = Tools.buildEmptyBody(lastRows, cells);
        thisPanel.find('table > tbody').append(tmpHtml);
    };

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var btnAction = '无操作';
                if (v.allowCancel) {
                    btnAction = '<a data-command="cancel">撤单</a>';
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">\
                            <a data-command="details" class="static-link">' + v.billno.substring(16) + '</a>\
                        </td>\
                        <td class="text-center">' + v.lottery + '</td>\
                        <!-- <td class="text-center">' + v.method + '</td>\
                        <!-- <td class="text-center">' + v.issue + '</td> -->\
                        <!-- <td class="text-center">' + v.money.toFixed(3) + '</td> -->\
                        <td class="text-center">' + DataFormat.GameLotteryOrder.status(v.status) + '</td>\
                        <td class="text-center">' + (v.winMoney ? v.winMoney : 0).toFixed(3) + '</td>\
                        <!-- <td class="text-center">' + moment(v.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td> -->\
                        <td class="text-center">' + btnAction + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('[data-command="details"]').click(function () {
                    doShowDetails(v.billno);
                });
                $thisRow.find('[data-command="cancel"]').click(function () {
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '确定要撤销订单？',
                        confirmFn: function () {
                            doCancelOrder({
                                billno: v.billno
                            });
                        }
                    });
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyBody();
    };

    var doShowDetails = function (billno) {
        GameLotteryCtrl.request('GET_ORDER', {
            data: {
                billno: billno
            },
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    LotteryOrderModal.init(res.data, {
                        onCancel: function () {
                            reload();
                        }
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

    // 初始化
    var init = function () {
        if (!thisPanel.attr('data-init')) {
            buildEmptyBody();
            initPage();
        }
        thisPanel.attr('data-init', true);
    };

    // 重载
    var reload = function() {
        reloadPage();
    };

    return {
        init: init,
        reload: reload
    }

}();

// 追号订单
var RecordChase = function () {

    // 声明元素
    var thisPanel = $('[order-type="1"]').find('[data-name="chase"]');

    // 请求数据
    var reqData = {
        page: 0,
        size: 5,
        methodType:1
    };

    // 接受数据
    var resData = {};

    // 初始化分页
    var easyPage;
    var initPage = function () {
        var element = thisPanel.find('.easy-page');
        if (easyPage) return; // 已经初始化过的不能初始化
        easyPage = element.EasyPage({
            showPage: 3,
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
    var reloadPage = function() {
        if (easyPage) {
            easyPage.reload();
        }
    };

    // 查询
    var doSearch = function () {
        GameLotteryCtrl.request('SEARCH_CHASE', {
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
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };

    // 撤销追单
    var doCancelChase = function (data) {
        GameLotteryCtrl.request('CANCEL_CHASE', {
            data: data,
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        icon: 'success',
                        content: '您已成功撤销追单'
                    });
                    reload();
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
        var lastRows = reqData.size;
        if (resData.list) {
            lastRows -= resData.list.length;
        }
        var cells = thisPanel.find('table > thead > tr > td').length;
        var tmpHtml = Tools.buildEmptyBody(lastRows, cells);
        thisPanel.find('table > tbody').append(tmpHtml);
    };

    // 构建数据
    var buildData = function () {
        var $thisTable = thisPanel.find('table');
        $thisTable.find('tbody').empty();
        if (resData.list.length > 0) {
            $.each(resData.list, function (i, v) {
                var btnAction = '无操作';
                if (v.allowCancel) {
                    btnAction = '<a data-command="cancel">撤单</a>';
                }
                var tpl =
                    '<tr>\
                        <td class="text-center">\
                            <a data-command="details">' + v.billno.substring(16) + '</a>\
                        </td>\
                        <td class="text-center">' + v.lottery + '</td>\
                        <!-- <td class="text-center">' + v.method + '</td> -->\
                        <!-- <td class="text-center">' + v.startIssue + '</td> -->\
                        <!-- <td class="text-center">' + v.clearCount + '/' + v.totalCount + '</td> -->\
                        <!-- <td class="text-center">' + v.totalMoney.toFixed(3) + '</td> -->\
                        <td class="text-center">' + v.winMoney.toFixed(3) + '</td>\
                        <td class="text-center">' + DataFormat.GameLotteryChase.status(v.status) + '</td>\
                        <td class="text-center">' + btnAction + '</td>\
                    </tr>';
                var $thisRow = $(tpl);
                $thisRow.find('[data-command="details"]').click(function () {
                    doShowDetails(v.billno);
                });
                $thisRow.find('[data-command="cancel"]').click(function () {
                    AlertUtils.confirm({
                        icon: 'question',
                        content: '确定要撤销追号？',
                        confirmFn: function () {
                            doCancelChase({
                                billno: v.billno
                            });
                        }
                    });
                });
                $thisTable.find('tbody').append($thisRow);
            });
        }
        buildEmptyBody();
    };

    // 显示详情
    var doShowDetails = function (billno) {
        GameLotteryCtrl.request('GET_CHASE', {
            data: {
                billno: billno
            },
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
                    LotteryChaseModal.init(res.data, {
                        onCancel: function () {
                            easyPage.reload();
                        }
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

    // 初始化
    var init = function () {
        if (!thisPanel.attr('data-init')) {
            buildEmptyBody();
            initPage();
        }
        thisPanel.attr('data-init', true);
    };

    // 重载
    var reload = function() {
        reloadPage();
    };

    return {
        init: init,
        reload: reload
    }

}();

$(document).ready(function () {
    var thisPanel = $('[order-type="1"]');
    var thisItems = thisPanel.find('.tab > .item');
    thisItems.click(function() {
        var dataHref = $(this).attr('data-href');
        if ($(this).hasClass('active')) return;
        thisItems.removeClass('active');
        $(this).addClass('active');
        thisPanel.find('.content > .item').removeClass('active');
        thisPanel.find('.content > .item[data-name="' + dataHref + '"]').addClass('active');
        if (dataHref == 'order') {
            RecordOrder.init();
        }
        if (dataHref == 'chase') {
            RecordChase.init();
        }
    });
    // 添加投注成功回调函数
    LotteryRecord.addCallback({
        submit: function() {
            RecordOrder.reload();
        }
    });
    // 添加追号成功回调函数
    LotteryChase.addCallback({
        submit: function () {
            RecordChase.reload();
        }
    });
    // 默认初始化订单
    RecordOrder.init();
});