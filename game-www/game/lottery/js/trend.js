$(document).ready(function () {
    var thisContent = $('.trend-content');
    var lotteryName = window.location.search.substr(1);
    var defaultQuery = 'latest-30';
    var loadData = function (data) {
        GameLotteryCtrl.request('QUERY_TREND', {
            data: data,
            beforeSend: function () {
                thisContent.ajaxLoading(true);
            },
            success: function (res) {
                if (res.error == 0) {
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
                thisContent.ajaxLoading(false);
            }
        });
    };
    var buildData = function (data) {
        var tmpLottery = data.lottery;
        $('.lottery-nav > .lottery-name').html(tmpLottery.showName);
        var tmpResult = data.result;
        tmpResult.reverse(); // 反转函数
        if (tmpResult.length == 0) {
            AlertUtils.alert({
                icon: 'info',
                content: '没有可以展示的开奖数据'
            });
            return;
        }
        if (tmpLottery.type == 1 || tmpLottery.type == 2) {
            TrendSSC.init(0, tmpResult);
        }
        if (tmpLottery.type == 3) {
            TrendSSC.init(1, tmpResult);
        }
        // 快3
        if (tmpLottery.type == 4) {
            TrendK3.init(0, tmpResult);
        }
        //快樂彩(快8)
        if (tmpLottery.type == 5) {
            TrendKLC.init(0, tmpResult);
        }
        //赛车
        if (tmpLottery.type == 6) {
            TrendRacing.init(0, tmpResult);
        }
        //低频彩
        if (tmpLottery.type == 7) {
            TrendDPC.init(0, tmpResult);
        }
        //六合彩
        if (tmpLottery.type == 8) {
            TrendLHC.init(0, tmpResult);
        }
    };
    loadData({ name: lotteryName, query: defaultQuery });
    // 初始化控制栏
    var initQuery = function () {
        var trendControl = $('.trend-control');
        trendControl.find('.query > a').click(function () {
            var val = $(this).attr('data-val');
            var queryData = {
                name: lotteryName
            };
            if (val == 'latest-30') {
                queryData.query = 'latest-30';
            }
            if (val == 'latest-50') {
                queryData.query = 'latest-50';
            }
            if (val == 'latest-100') {
                queryData.query = 'latest-50';
            }
            if (val == 'd0') {
                queryData.query = 'date';
                queryData.time = moment().format('YYYY-MM-DD');
            }
            if (val == 'd1') {
                queryData.query = 'date';
                queryData.time = moment().subtract(1, 'days').format('YYYY-MM-DD');
            }
            if (val == 'd2') {
                queryData.query = 'date';
                queryData.time = moment().subtract(2, 'days').format('YYYY-MM-DD');
            }
            loadData(queryData);
        });
    };
    initQuery();
});

var TrendSSC = function () {

    var addnum = 0;

    var trendMethod = $('.trend-method');
    var trendControl = $('.trend-control');
    var trendWrapper = $('.trend-wrapper');

    var isInit = false; // 是否已经初始化

    var ThisData = []; // 号码数据

    var DataTmpLost = []; // 当前累计遗漏
    var DataTotalCount = []; // 出现总次数
    var DataSumLost = []; // 总的遗漏
    var DataMaxLost = []; // 最大遗漏

    var clearData = function () {
        DataTmpLost = [];
        DataTotalCount = [];
        DataSumLost = [];
        DataMaxLost = [];
    };

    // 格式化号码
    var formatCode = function (thisRow, tmpCode) {
        $.each(tmpCode, function (i, v) {
            if (!DataTotalCount[i]) {
                DataTotalCount[i] = [];
            }
            if (!DataTmpLost[i]) {
                DataTmpLost[i] = [];
            }
            if (!DataSumLost[i]) {
                DataSumLost[i] = [];
            }
            if (!DataMaxLost[i]) {
                DataMaxLost[i] = [];
            }
            for (var j = 0; j <= (9 + addnum); j++) {
                if (!DataTotalCount[i][j]) {
                    DataTotalCount[i][j] = 0;
                }
                if (!DataTmpLost[i][j]) {
                    DataTmpLost[i][j] = 0;
                }
                if (!DataSumLost[i][j]) {
                    DataSumLost[i][j] = 0;
                }
                if (!DataMaxLost[i][j]) {
                    DataMaxLost[i][j] = 0;
                }
                var thisCell = $('<td class="code">');
                thisCell.attr('data-idx', i);
                var showJ = j + addnum;
                var numShow = formatNum(showJ);
                if (v.indexOf(numShow) != -1) {
                    var regex = eval('/' + numShow + '/g');
                    DataTotalCount[i][j] += 1;
                    DataTmpLost[i][j] = 0;
                    thisCell.addClass('open');
                    if (v.match(regex).length > 1) {
                        thisCell.addClass('double');
                    }
                    thisCell.append('<i>' + showJ + '</i>');
                } else {
                    DataTmpLost[i][j] += 1;
                    DataSumLost[i][j] += DataTmpLost[i][j];
                    if (DataTmpLost[i][j] > DataMaxLost[i][j]) {
                        DataMaxLost[i][j] = DataTmpLost[i][j];
                    }
                    thisCell.append(DataTmpLost[i][j]);
                }
                if (j == (9 + addnum)) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        });
    };

    var formatNum = function (num) {
        if (addnum == 0) {
            return num;
        }
        if (num < 10) {
            return '0' + num;
        }
        else {
            return '' + num;
        }
    };

    // 构建总的出现次数
    var buildTotalCount = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">出现总次数</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataTotalCount.length; i++) {
            for (var j = 0; j < DataTotalCount[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataTotalCount[i][j]);
                if (j == (9 + addnum) && i != DataTotalCount.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建平均遗漏值
    var buildAvgLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">平均遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataSumLost.length; i++) {
            for (var j = 0; j < DataSumLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(Math.round(DataSumLost[i][j] / ThisData.length));
                if (j == (9 + addnum) && i != DataSumLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建最大遗漏值
    var buildMaxLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">最大遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataMaxLost.length; i++) {
            for (var j = 0; j < DataMaxLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataMaxLost[i][j]);
                if (j == (9 + addnum) && i != DataMaxLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 初始化走势
    var initTrendLine = function () {
        var thisTable = trendWrapper.find('table');
        var thisCanvas = trendWrapper.find('canvas');
        if (thisCanvas.length > 0) {
            thisCanvas.remove();
        }
        thisCanvas = $('<canvas class="trend-canvas">');
        thisCanvas.attr('width', thisTable.width());
        thisCanvas.attr('height', thisTable.height());
        trendWrapper.append(thisCanvas);
        // 构建走势图
        var context = thisCanvas[0].getContext('2d');
        context.lineWidth = 1;
        context.strokeStyle = '#c32b2b';
        for (var i = 0; i < 5; i++) {
            var paths = thisTable.find('[data-idx="' + i + '"].open');
            $.each(paths, function (j) {
                var x = $(this).position().left;
                var y = $(this).position().top;
                if (j == 0) {
                    context.moveTo(x + (9 + addnum), y + 15);
                } else {
                    context.lineTo(x + (9 + addnum), y + 15);
                }
            });
            context.stroke();
        }
    };

    // 初始化遗漏
    var initLostLine = function () {
        var table = trendWrapper.find('table');
        var head = table.find('thead');
        var len = head.find('td.code').length;
        var body = table.find('tbody');
        var thisRows = body.find('tr');
        for (var i = 0; i < len; i++) {
            var cells = [];
            $.each(thisRows, function () {
                cells.push($(this).find('td.code').eq(i));
            });
            for (var j = cells.length; j > 0; j--) {
                if ($(cells[j - 1]).hasClass('open')) {
                    break;
                } else {
                    $(cells[j - 1]).addClass('lost');
                }
            }
        }
    };

    // 初始化控制功能
    var initControl = function () {
        var tools = trendControl.find('.tools');
        // 辅助线功能
        tools.find('input[name="guides"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-guides');
            } else {
                t.addClass('hide-guides');
            }
        });
        // 遗漏功能
        tools.find('input[name="lostNum"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-lost');
            } else {
                t.addClass('hide-lost');
            }
        });
        // 遗漏条功能
        tools.find('input[name="lostLine"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                initLostLine();
            } else {
                t.find('tbody > tr > td').removeClass('lost');
            }
        });
        // 走势功能
        tools.find('input[name="trendLine"]').change(function () {
            var c = trendWrapper.find('canvas');
            if ($(this).is(':checked')) {
                initTrendLine();
            } else {
                c.remove();
            }
        });
    };

    // 检查工具
    var checkTools = function (thisTable) {
        var tools = trendControl.find('.tools');
        var isShowGuides = tools.find('input[name="guides"]').is(':checked');
        if (isShowGuides) {
            thisTable.removeClass('hide-guides');
        } else {
            thisTable.addClass('hide-guides');
        }
        var isShowLostNum = tools.find('input[name="lostNum"]').is(':checked');
        if (isShowLostNum) {
            thisTable.removeClass('hide-lost');
        } else {
            thisTable.addClass('hide-lost');
        }
        var isShowLostLine = tools.find('input[name="lostLine"]').is(':checked');
        if (isShowLostLine) {
            initLostLine();
        }
        var isShowTrendLine = tools.find('input[name="trendLine"]').is(':checked');
        if (isShowTrendLine) {
            initTrendLine();
        }
    };

    // 初始化方法
    var initMethod = function () {
        trendMethod.append('<a data-val="WuXing">五星</a>');
        if (addnum != 1) {
            trendMethod.append('<a data-val="HouSan">后三</a>');
            trendMethod.append('<a data-val="ZhongSan">中三</a>');
        }
        trendMethod.append('<a data-val="QianSan">前三</a>');
        if (addnum != 1) {
            trendMethod.append('<a data-val="HouEr">后二</a>');
        }
        trendMethod.append('<a data-val="QianEr">前二</a>');

        trendMethod.find('a').click(function () {
            if (!$(this).hasClass('active')) {
                trendMethod.find('a').removeClass('active');
                $(this).addClass('active');
                var method = $(this).attr('data-val');
                initTable(method);
            }
        });
        trendMethod.find('a').eq(0).addClass('active');
    };

    // 获取方法
    var getMethod = function () {
        return trendMethod.find('a.active').attr('data-val');
    };

    // 初始化五星
    var initWuXing = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            var colspanNum = 10 + addnum;
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">万位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">千位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">个位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="location">号码分布</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 6; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                tmpCode.push(v.code.replace(',', ','));
                formatCode(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    // 初始化三星
    var initSanXing = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 大小
            var bigChar = '大';
            var smallChar = '小';
            if (1 == addnum) {//11选5不显示大小
                var bigChar = '';
                var smallChar = '';
            }
            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                //if ($.inArray(val, ['0', '2', '4', '6', '8']) != -1) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);
            // 组三
            var cell_zs = $('<td class="type">');
            if (addnum != 1 && (thisCode[0] == thisCode[1] || thisCode[1] == thisCode[2] || thisCode[0] == thisCode[2])) {
                cell_zs.append('<i class="checked">');
            }
            thisRow.append(cell_zs);
            // 组六
            var cell_zl = $('<td class="type">');
            if (addnum != 1 && (thisCode[0] != thisCode[1] && thisCode[1] != thisCode[2] && thisCode[0] != thisCode[2])) {
                cell_zl.append('<i class="checked">');
            }
            thisRow.append(cell_zl);
            // 豹子
            var cell_bz = $('<td class="type">');
            if (addnum != 1 && (thisCode[0] == thisCode[1] && thisCode[1] == thisCode[2])) {
                cell_bz.append('<i class="checked">');
            }
            thisRow.append(cell_bz);
            // 直选和值
            var cell_hz = $('<td class="type bg-red">');
            var hzVal = 0;
            $.each(thisCode, function (i, val) {
                hzVal += parseInt(val);
            });
            cell_hz.append(hzVal);
            thisRow.append(cell_hz);
        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 10 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">个位</td>');
            }
            if (type == 'middle') {
                row1.append('<td colspan="' + colspanNum + '" class="position">千位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
            }
            if (type == 'before') {
                row1.append('<td colspan="' + colspanNum + '" class="position">万位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">千位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
            }
            row1.append('<td width="8%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="8%" rowspan="2" class="type">单双形态</td>');
            row1.append('<td width="4%" rowspan="2" class="type">组三</td>');
            row1.append('<td width="4%" rowspan="2" class="type">组六</td>');
            row1.append('<td width="4%" rowspan="2" class="type">豹子</td>');
            row1.append('<td width="8%" rowspan="2" class="type">直选和值</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 3; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'before') {
                    tmpCode.splice(3, 2);
                }
                if (type == 'middle') {
                    tmpCode.splice(0, 1);
                    tmpCode.splice(3, 1);
                }
                if (type == 'after') {
                    tmpCode.splice(0, 2);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(6));
            foot.append(buildAvgLost(6));
            foot.append(buildMaxLost(6));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    // 初始化二星
    var initErXing = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 对子
            var cell_dz = $('<td class="type">');
            if (addnum != 1 && (thisCode[0] == thisCode[1])) {
                cell_dz.append('<i class="checked">');
            }
            thisRow.append(cell_dz);
            // 大小
            var bigChar = '大';
            var smallChar = '小';
            if (1 == addnum) {//11选5
                var bigChar = '';
                var smallChar = '';
            }
            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                //if ($.inArray(val, ['0', '2', '4', '6', '8']) != -1) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);
            // 直选和值
            var cell_hz = $('<td class="type bg-red">');
            var hzVal = 0;
            $.each(thisCode, function (i, val) {
                hzVal += parseInt(val);
            });
            cell_hz.append(hzVal);
            thisRow.append(cell_hz);
        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 10 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
                row1.append('<td colspan="' + colspanNum + '"class="position">个位</td>');
            }
            if (type == 'before') {
                row1.append('<td colspan="' + colspanNum + '" class="position">万位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">千位</td>');
            }
            row1.append('<td width="6%" rowspan="2" class="type">对子</td>');
            row1.append('<td width="10%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="10%" rowspan="2" class="type">单双形态</td>');
            row1.append('<td width="10%" rowspan="2" class="type">直选和值</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 2; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'before') {
                    tmpCode.splice(2, 3);
                }
                if (type == 'after') {
                    tmpCode.splice(0, 3);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(4));
            foot.append(buildAvgLost(4));
            foot.append(buildMaxLost(4));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    var initTable = function (method) {
        if (method == 'WuXing') {
            initWuXing();
        }
        if (method == 'HouSan') {
            initSanXing('after');
        }
        if (method == 'ZhongSan') {
            initSanXing('middle');
        }
        if (method == 'QianSan') {
            initSanXing('before');
        }
        if (method == 'HouEr') {
            initErXing('after');
        }
        if (method == 'QianEr') {
            initErXing('before');
        }
    };

    var init = function (addNumPrarm, data) {
        addnum = addNumPrarm;
        ThisData = data;
        if (!isInit) {
            isInit = true;
            initMethod();
            initControl();
        }
        initTable(getMethod());
    };

    return {
        init: init
    }

}();

//赛车
var TrendRacing = function () {

    var addnum = 0;

    var trendMethod = $('.trend-method');
    var trendControl = $('.trend-control');
    var trendWrapper = $('.trend-wrapper');

    var isInit = false; // 是否已经初始化

    var ThisData = []; // 号码数据

    var DataTmpLost = []; // 当前累计遗漏
    var DataTotalCount = []; // 出现总次数
    var DataSumLost = []; // 总的遗漏
    var DataMaxLost = []; // 最大遗漏

    var clearData = function () {
        DataTmpLost = [];
        DataTotalCount = [];
        DataSumLost = [];
        DataMaxLost = [];
    };

    // 格式化号码
    var formatCode = function (thisRow, tmpCode) {
        $.each(tmpCode, function (i, v) {

            if (!DataTotalCount[i]) {
                DataTotalCount[i] = [];
            }
            if (!DataTmpLost[i]) {
                DataTmpLost[i] = [];
            }
            if (!DataSumLost[i]) {
                DataSumLost[i] = [];
            }
            if (!DataMaxLost[i]) {
                DataMaxLost[i] = [];
            }
            for (var j = 0; j <= (9 + addnum); j++) {
                if (!DataTotalCount[i][j]) {
                    DataTotalCount[i][j] = 0;
                }
                if (!DataTmpLost[i][j]) {
                    DataTmpLost[i][j] = 0;
                }
                if (!DataSumLost[i][j]) {
                    DataSumLost[i][j] = 0;
                }
                if (!DataMaxLost[i][j]) {
                    DataMaxLost[i][j] = 0;
                }
                var thisCell = $('<td class="code">');
                thisCell.attr('data-idx', i);
                var showJ = "0" + (j + addnum);
                var numShow = formatNum(showJ);
                if (v.indexOf(numShow) != -1) {
                    var regex = eval('/' + numShow + '/g');
                    DataTotalCount[i][j] += 1;
                    DataTmpLost[i][j] = 0;
                    thisCell.addClass('open');
                    if (v.match(regex).length > 1) {
                        thisCell.addClass('double');
                    }
                    thisCell.append('<i>' + showJ + '</i>');
                } else {
                    DataTmpLost[i][j] += 1;
                    DataSumLost[i][j] += DataTmpLost[i][j];
                    if (DataTmpLost[i][j] > DataMaxLost[i][j]) {
                        DataMaxLost[i][j] = DataTmpLost[i][j];
                    }
                    thisCell.append(DataTmpLost[i][j]);
                }
                if (j == (9 + addnum)) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        });
    };

    var formatNum = function (num) {
        if (addnum == 0) {
            return num;
        }
        if (num < 10) {
            return '0' + num;
        }
        else {
            return '' + num;
        }
    };

    // 构建总的出现次数
    var buildTotalCount = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">出现总次数</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataTotalCount.length; i++) {
            for (var j = 0; j < DataTotalCount[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataTotalCount[i][j]);
                if (j == (9 + addnum) && i != DataTotalCount.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建平均遗漏值
    var buildAvgLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">平均遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataSumLost.length; i++) {
            for (var j = 0; j < DataSumLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(Math.round(DataSumLost[i][j] / ThisData.length));
                if (j == (9 + addnum) && i != DataSumLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建最大遗漏值
    var buildMaxLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">最大遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataMaxLost.length; i++) {
            for (var j = 0; j < DataMaxLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataMaxLost[i][j]);
                if (j == (9 + addnum) && i != DataMaxLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 初始化走势
    var initTrendLine = function () {
        var thisTable = trendWrapper.find('table');
        var thisCanvas = trendWrapper.find('canvas');
        if (thisCanvas.length > 0) {
            thisCanvas.remove();
        }
        thisCanvas = $('<canvas class="trend-canvas">');
        thisCanvas.attr('width', thisTable.width());
        thisCanvas.attr('height', thisTable.height());
        trendWrapper.append(thisCanvas);
        // 构建走势图
        var context = thisCanvas[0].getContext('2d');
        context.lineWidth = 1;
        context.strokeStyle = '#c32b2b';
        for (var i = 0; i < 5; i++) {
            var paths = thisTable.find('[data-idx="' + i + '"].open');
            $.each(paths, function (j) {
                var x = $(this).position().left;
                var y = $(this).position().top;
                if (j == 0) {
                    context.moveTo(x + (9 + addnum), y + 15);
                } else {
                    context.lineTo(x + (9 + addnum), y + 15);
                }
            });
            context.stroke();
        }
    };

    // 初始化遗漏
    var initLostLine = function () {
        var table = trendWrapper.find('table');
        var head = table.find('thead');
        var len = head.find('td.code').length;
        var body = table.find('tbody');
        var thisRows = body.find('tr');
        for (var i = 0; i < len; i++) {
            var cells = [];
            $.each(thisRows, function () {
                cells.push($(this).find('td.code').eq(i));
            });
            for (var j = cells.length; j > 0; j--) {
                if ($(cells[j - 1]).hasClass('open')) {
                    break;
                } else {
                    $(cells[j - 1]).addClass('lost');
                }
            }
        }
    };

    // 初始化控制功能
    var initControl = function () {
        var tools = trendControl.find('.tools');
        // 辅助线功能
        tools.find('input[name="guides"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-guides');
            } else {
                t.addClass('hide-guides');
            }
        });
        // 遗漏功能
        tools.find('input[name="lostNum"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-lost');
            } else {
                t.addClass('hide-lost');
            }
        });
        // 遗漏条功能
        tools.find('input[name="lostLine"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                initLostLine();
            } else {
                t.find('tbody > tr > td').removeClass('lost');
            }
        });
        // 走势功能
        tools.find('input[name="trendLine"]').change(function () {
            var c = trendWrapper.find('canvas');
            if ($(this).is(':checked')) {
                initTrendLine();
            } else {
                c.remove();
            }
        });
    };

    // 检查工具
    var checkTools = function (thisTable) {
        var tools = trendControl.find('.tools');
        var isShowGuides = tools.find('input[name="guides"]').is(':checked');
        if (isShowGuides) {
            thisTable.removeClass('hide-guides');
        } else {
            thisTable.addClass('hide-guides');
        }
        var isShowLostNum = tools.find('input[name="lostNum"]').is(':checked');
        if (isShowLostNum) {
            thisTable.removeClass('hide-lost');
        } else {
            thisTable.addClass('hide-lost');
        }
        var isShowLostLine = tools.find('input[name="lostLine"]').is(':checked');
        if (isShowLostLine) {
            initLostLine();
        }
        var isShowTrendLine = tools.find('input[name="trendLine"]').is(':checked');
        if (isShowTrendLine) {
            initTrendLine();
        }
    };

    // 初始化方法
    var initMethod = function () {
        if (addnum == 0) {
            trendMethod.append('<a data-val="QianYi">前一</a>');
            trendMethod.append('<a data-val="QianEr">前二</a>');
            trendMethod.append('<a data-val="QianSan">前三</a>');
        };

        trendMethod.find('a').click(function () {
            if (!$(this).hasClass('active')) {
                trendMethod.find('a').removeClass('active');
                $(this).addClass('active');
                var method = $(this).attr('data-val');
                initTable(method);
            }
        });
        trendMethod.find('a').eq(0).addClass('active');
    };

    // 获取方法
    var getMethod = function () {
        return trendMethod.find('a.active').attr('data-val');
    };

    // 初始化前一
    var initQianYi = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 大小
            var bigChar = '大';
            var smallChar = '小';
            if (1 == addnum) {//11选5不显示大小
                var bigChar = '';
                var smallChar = '';
            }
            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                //if ($.inArray(val, ['0', '2', '4', '6', '8']) != -1) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);

        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 10 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">第一位</td>');
            }

            row1.append('<td width="8%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="8%" rowspan="2" class="type">单双形态</td>');

            var row2 = $('<tr>');
            for (var j = 1; j <= 1; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html("0" + (i + addnum));
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'after') {
                    tmpCode.splice(1, tmpCode.length);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(6));
            foot.append(buildAvgLost(6));
            foot.append(buildMaxLost(6));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    // 初始化前二
    var initQianEr = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 大小
            var bigChar = '大';
            var smallChar = '小';
            if (1 == addnum) {//11选5不显示大小
                var bigChar = '';
                var smallChar = '';
            }
            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                //if ($.inArray(val, ['0', '2', '4', '6', '8']) != -1) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);

        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 10 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">第一位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">第二位</td>');
            }

            row1.append('<td width="8%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="8%" rowspan="2" class="type">单双形态</td>');

            var row2 = $('<tr>');
            for (var j = 1; j <= 2; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html("0" + (i + addnum));
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'after') {
                    tmpCode.splice(2, tmpCode.length);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(6));
            foot.append(buildAvgLost(6));
            foot.append(buildMaxLost(6));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    // 初始化前三
    var initQianSan = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 大小
            var bigChar = '大';
            var smallChar = '小';
            if (1 == addnum) {//11选5不显示大小
                var bigChar = '';
                var smallChar = '';
            }
            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                //if ($.inArray(val, ['0', '2', '4', '6', '8']) != -1) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);

        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 10 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">第一位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">第二位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">第三位</td>');
            }

            row1.append('<td width="8%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="8%" rowspan="2" class="type">单双形态</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 3; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html("0" + (i + addnum));
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'after') {
                    tmpCode.splice(3, tmpCode.length);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(6));
            foot.append(buildAvgLost(6));
            foot.append(buildMaxLost(6));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    var initTable = function (method) {
        if (method == 'QianYi') {
            initQianYi('after');
        };
        if (method == 'QianEr') {
            initQianEr('after');
        };
        if (method == 'QianSan') {
            initQianSan('after');
        };
    };

    var init = function (addNumPrarm, data) {
        addnum = addNumPrarm;
        ThisData = data;
        if (!isInit) {
            isInit = true;
            initMethod();
            initControl();
        }
        initTable(getMethod());
    };

    return {
        init: init
    }

}();

// 低频彩
var TrendDPC = function () {

    var addnum = 0;

    var trendMethod = $('.trend-method');
    var trendControl = $('.trend-control');
    var trendWrapper = $('.trend-wrapper');

    var isInit = false; // 是否已经初始化

    var ThisData = []; // 号码数据

    var DataTmpLost = []; // 当前累计遗漏
    var DataTotalCount = []; // 出现总次数
    var DataSumLost = []; // 总的遗漏
    var DataMaxLost = []; // 最大遗漏

    var clearData = function () {
        DataTmpLost = [];
        DataTotalCount = [];
        DataSumLost = [];
        DataMaxLost = [];
    };

    // 格式化号码
    var formatCode = function (thisRow, tmpCode) {
        $.each(tmpCode, function (i, v) {
            if (!DataTotalCount[i]) {
                DataTotalCount[i] = [];
            }
            if (!DataTmpLost[i]) {
                DataTmpLost[i] = [];
            }
            if (!DataSumLost[i]) {
                DataSumLost[i] = [];
            }
            if (!DataMaxLost[i]) {
                DataMaxLost[i] = [];
            }
            for (var j = 0; j <= (9 + addnum); j++) {
                if (!DataTotalCount[i][j]) {
                    DataTotalCount[i][j] = 0;
                }
                if (!DataTmpLost[i][j]) {
                    DataTmpLost[i][j] = 0;
                }
                if (!DataSumLost[i][j]) {
                    DataSumLost[i][j] = 0;
                }
                if (!DataMaxLost[i][j]) {
                    DataMaxLost[i][j] = 0;
                }
                var thisCell = $('<td class="code">');
                thisCell.attr('data-idx', i);
                var showJ = j + addnum;
                var numShow = formatNum(showJ);
                if (v.indexOf(numShow) != -1) {
                    var regex = eval('/' + numShow + '/g');
                    DataTotalCount[i][j] += 1;
                    DataTmpLost[i][j] = 0;
                    thisCell.addClass('open');
                    if (v.match(regex).length > 1) {
                        thisCell.addClass('double');
                    }
                    thisCell.append('<i>' + showJ + '</i>');
                } else {
                    DataTmpLost[i][j] += 1;
                    DataSumLost[i][j] += DataTmpLost[i][j];
                    if (DataTmpLost[i][j] > DataMaxLost[i][j]) {
                        DataMaxLost[i][j] = DataTmpLost[i][j];
                    }
                    thisCell.append(DataTmpLost[i][j]);
                }
                if (j == (9 + addnum)) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        });
    };

    var formatNum = function (num) {
        if (addnum == 0) {
            return num;
        }
        if (num < 10) {
            return '0' + num;
        }
        else {
            return '' + num;
        }
    };

    // 构建总的出现次数
    var buildTotalCount = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">出现总次数</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataTotalCount.length; i++) {
            for (var j = 0; j < DataTotalCount[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataTotalCount[i][j]);
                if (j == (9 + addnum) && i != DataTotalCount.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建平均遗漏值
    var buildAvgLost = function (blankCells) {
        console.log('ThisData.length', ThisData.length);
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">平均遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataSumLost.length; i++) {
            for (var j = 0; j < DataSumLost[i].length; j++) {
                var thisCell = $('<td>');
                console.log(i, j, DataSumLost[i][j]);
                thisCell.html(Math.round(DataSumLost[i][j] / ThisData.length));
                if (j == (9 + addnum) && i != DataSumLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建最大遗漏值
    var buildMaxLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">最大遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataMaxLost.length; i++) {
            for (var j = 0; j < DataMaxLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataMaxLost[i][j]);
                if (j == (9 + addnum) && i != DataMaxLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 初始化走势
    var initTrendLine = function () {
        var thisTable = trendWrapper.find('table');
        var thisCanvas = trendWrapper.find('canvas');
        if (thisCanvas.length > 0) {
            thisCanvas.remove();
        }
        thisCanvas = $('<canvas class="trend-canvas">');
        thisCanvas.attr('width', thisTable.width());
        thisCanvas.attr('height', thisTable.height());
        trendWrapper.append(thisCanvas);
        // 构建走势图
        var context = thisCanvas[0].getContext('2d');
        context.lineWidth = 1;
        context.strokeStyle = '#c32b2b';
        for (var i = 0; i < 3; i++) {
            var paths = thisTable.find('[data-idx="' + i + '"].open');
            $.each(paths, function (j) {
                var x = $(this).position().left;
                var y = $(this).position().top;
                if (j == 0) {
                    context.moveTo(x + (9 + addnum), y + 15);
                } else {
                    context.lineTo(x + (9 + addnum), y + 15);
                }
            });
            context.stroke();
        }
    };

    // 初始化遗漏
    var initLostLine = function () {
        var table = trendWrapper.find('table');
        var head = table.find('thead');
        var len = head.find('td.code').length;
        var body = table.find('tbody');
        var thisRows = body.find('tr');
        for (var i = 0; i < len; i++) {
            var cells = [];
            $.each(thisRows, function () {
                cells.push($(this).find('td.code').eq(i));
            });
            for (var j = cells.length; j > 0; j--) {
                if ($(cells[j - 1]).hasClass('open')) {
                    break;
                } else {
                    $(cells[j - 1]).addClass('lost');
                }
            }
        }
    };

    // 初始化控制功能
    var initControl = function () {
        var tools = trendControl.find('.tools');
        // 辅助线功能
        tools.find('input[name="guides"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-guides');
            } else {
                t.addClass('hide-guides');
            }
        });
        // 遗漏功能
        tools.find('input[name="lostNum"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-lost');
            } else {
                t.addClass('hide-lost');
            }
        });
        // 遗漏条功能
        tools.find('input[name="lostLine"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                initLostLine();
            } else {
                t.find('tbody > tr > td').removeClass('lost');
            }
        });
        // 走势功能
        tools.find('input[name="trendLine"]').change(function () {
            var c = trendWrapper.find('canvas');
            if ($(this).is(':checked')) {
                initTrendLine();
            } else {
                c.remove();
            }
        });
    };

    // 检查工具
    var checkTools = function (thisTable) {
        var tools = trendControl.find('.tools');
        var isShowGuides = tools.find('input[name="guides"]').is(':checked');
        if (isShowGuides) {
            thisTable.removeClass('hide-guides');
        } else {
            thisTable.addClass('hide-guides');
        }
        var isShowLostNum = tools.find('input[name="lostNum"]').is(':checked');
        if (isShowLostNum) {
            thisTable.removeClass('hide-lost');
        } else {
            thisTable.addClass('hide-lost');
        }
        var isShowLostLine = tools.find('input[name="lostLine"]').is(':checked');
        if (isShowLostLine) {
            initLostLine();
        }
        var isShowTrendLine = tools.find('input[name="trendLine"]').is(':checked');
        if (isShowTrendLine) {
            initTrendLine();
        }
    };

    // 初始化方法
    var initMethod = function () {
        trendMethod.append('<a data-val="SanMa">三码</a>');
        trendMethod.append('<a data-val="HouEr">后二码</a>');
        trendMethod.append('<a data-val="QianEr">前二码</a>');

        trendMethod.find('a').click(function () {
            if (!$(this).hasClass('active')) {
                trendMethod.find('a').removeClass('active');
                $(this).addClass('active');
                var method = $(this).attr('data-val');
                initTable(method);
            }
        });
        trendMethod.find('a').eq(0).addClass('active');
    };

    // 获取方法
    var getMethod = function () {
        return trendMethod.find('a.active').attr('data-val');
    };

    // 初始化三码
    var initSanMa = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            var colspanNum = 10 + addnum;
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">个位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="location">号码分布</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 4; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                tmpCode.push(v.code.replace(',', ','));
                formatCode(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    // 初始化二星
    var initErXing = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 对子
            var cell_dz = $('<td class="type">');
            if (addnum != 1 && (thisCode[0] == thisCode[1])) {
                cell_dz.append('<i class="checked">');
            }
            thisRow.append(cell_dz);
            // 大小
            var bigChar = '大';
            var smallChar = '小';
            if (1 == addnum) {//11选5
                var bigChar = '';
                var smallChar = '';
            }
            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                //if ($.inArray(val, ['0', '2', '4', '6', '8']) != -1) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);
            // 直选和值
            var cell_hz = $('<td class="type bg-red">');
            var hzVal = 0;
            $.each(thisCode, function (i, val) {
                hzVal += parseInt(val);
            });
            cell_hz.append(hzVal);
            thisRow.append(cell_hz);
        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 10 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
                row1.append('<td colspan="' + colspanNum + '"class="position">个位</td>');
            }
            if (type == 'before') {
                row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
            }
            row1.append('<td width="6%" rowspan="2" class="type">对子</td>');
            row1.append('<td width="10%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="10%" rowspan="2" class="type">单双形态</td>');
            row1.append('<td width="10%" rowspan="2" class="type">直选和值</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 2; j++) {
                for (var i = 0; i <= (9 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (9 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'before') {
                    tmpCode.splice(2, 1);
                }
                if (type == 'after') {
                    tmpCode.splice(0, 1);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(4));
            foot.append(buildAvgLost(4));
            foot.append(buildMaxLost(4));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    var initTable = function (method) {
        if (method == 'SanMa') {
            initSanMa();
        }
        if (method == 'HouEr') {
            initErXing('after');
        }
        if (method == 'QianEr') {
            initErXing('before');
        }
    };

    var init = function (addNumPrarm, data) {
        addnum = addNumPrarm;
        ThisData = data;
        if (!isInit) {
            isInit = true;
            initMethod();
            initControl();
        }
        initTable(getMethod());
    };

    return {
        init: init
    }

}();

// 快3
var TrendK3 = function () {

    var addnum = 0;

    var trendMethod = $('.trend-method');
    var trendControl = $('.trend-control');
    var trendWrapper = $('.trend-wrapper');

    var isInit = false; // 是否已经初始化

    var ThisData = []; // 号码数据

    var DataTmpLost = []; // 当前累计遗漏
    var DataTotalCount = []; // 出现总次数
    var DataSumLost = []; // 总的遗漏
    var DataMaxLost = []; // 最大遗漏

    var clearData = function () {
        DataTmpLost = [];
        DataTotalCount = [];
        DataSumLost = [];
        DataMaxLost = [];
    };

    // 格式化号码
    var formatCode = function (thisRow, tmpCode) {
        $.each(tmpCode, function (i, v) {
            if (!DataTotalCount[i]) {
                DataTotalCount[i] = [];
            }
            if (!DataTmpLost[i]) {
                DataTmpLost[i] = [];
            }
            if (!DataSumLost[i]) {
                DataSumLost[i] = [];
            }
            if (!DataMaxLost[i]) {
                DataMaxLost[i] = [];
            }
            for (var j = 1; j <= (6 + addnum); j++) {
                if (!DataTotalCount[i][j]) {
                    DataTotalCount[i][j] = 0;
                }
                if (!DataTmpLost[i][j]) {
                    DataTmpLost[i][j] = 0;
                }
                if (!DataSumLost[i][j]) {
                    DataSumLost[i][j] = 0;
                }
                if (!DataMaxLost[i][j]) {
                    DataMaxLost[i][j] = 0;
                }
                var thisCell = $('<td class="code">');
                thisCell.attr('data-idx', i);
                var showJ = j + addnum;
                var numShow = formatNum(showJ);
                if (v.indexOf(numShow) != -1) {
                    var regex = eval('/' + numShow + '/g');
                    DataTotalCount[i][j] += 1;
                    DataTmpLost[i][j] = 0;
                    thisCell.addClass('open');
                    if (v.match(regex).length > 1) {
                        thisCell.addClass('double');
                    }
                    thisCell.append('<i>' + showJ + '</i>');
                } else {
                    DataTmpLost[i][j] += 1;
                    DataSumLost[i][j] += DataTmpLost[i][j];
                    if (DataTmpLost[i][j] > DataMaxLost[i][j]) {
                        DataMaxLost[i][j] = DataTmpLost[i][j];
                    }
                    thisCell.append(DataTmpLost[i][j]);
                }
                if (j == (6 + addnum)) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        });
    };

    var formatNum = function (num) {
        if (addnum == 0) {
            return num;
        }
        if (num < 10) {
            return '0' + num;
        }
        else {
            return '' + num;
        }
    };

    // 构建总的出现次数
    var buildTotalCount = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">出现总次数</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataTotalCount.length; i++) {
            for (var j = 1; j < DataTotalCount[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataTotalCount[i][j]);
                if (j == (6 + addnum) && i != DataTotalCount.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建平均遗漏值
    var buildAvgLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">平均遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataSumLost.length; i++) {
            for (var j = 1; j < DataSumLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(Math.round(DataSumLost[i][j] / ThisData.length));
                if (j == (6 + addnum) && i != DataSumLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建最大遗漏值
    var buildMaxLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">最大遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');

        for (var i = 0; i < DataMaxLost.length; i++) {
            for (var j = 1; j < DataMaxLost[i].length; j++) {
                var thisCell = $('<td>');
                thisCell.html(DataMaxLost[i][j]);
                if (j == (6 + addnum) && i != DataMaxLost.length - 1) {
                    thisCell.addClass('border-right');
                }
                thisRow.append(thisCell);
            }
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 初始化走势
    var initTrendLine = function () {
        var thisTable = trendWrapper.find('table');
        var thisCanvas = trendWrapper.find('canvas');
        if (thisCanvas.length > 0) {
            thisCanvas.remove();
        }
        thisCanvas = $('<canvas class="trend-canvas">');
        thisCanvas.attr('width', thisTable.width());
        thisCanvas.attr('height', thisTable.height());
        trendWrapper.append(thisCanvas);
        // 构建走势图
        var context = thisCanvas[0].getContext('2d');
        context.lineWidth = 1;
        context.strokeStyle = '#c32b2b';
        for (var i = 0; i < 3; i++) {
            var paths = thisTable.find('[data-idx="' + i + '"].open');
            $.each(paths, function (j) {
                var x = $(this).position().left;
                var y = $(this).position().top;
                if (j == 0) {
                    context.moveTo(x + (6 + addnum), y + 15);
                } else {
                    context.lineTo(x + (6 + addnum), y + 15);
                }
            });
            context.stroke();
        }
    };

    // 初始化遗漏
    var initLostLine = function () {
        var table = trendWrapper.find('table');
        var head = table.find('thead');
        var len = head.find('td.code').length;
        var body = table.find('tbody');
        var thisRows = body.find('tr');
        for (var i = 0; i < len; i++) {
            var cells = [];
            $.each(thisRows, function () {
                cells.push($(this).find('td.code').eq(i));
            });
            for (var j = cells.length; j > 0; j--) {
                if ($(cells[j - 1]).hasClass('open')) {
                    break;
                } else {
                    $(cells[j - 1]).addClass('lost');
                }
            }
        }
    };

    // 初始化控制功能
    var initControl = function () {
        var tools = trendControl.find('.tools');
        // 辅助线功能
        tools.find('input[name="guides"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-guides');
            } else {
                t.addClass('hide-guides');
            }
        });
        // 遗漏功能
        tools.find('input[name="lostNum"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-lost');
            } else {
                t.addClass('hide-lost');
            }
        });
        // 遗漏条功能
        tools.find('input[name="lostLine"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                initLostLine();
            } else {
                t.find('tbody > tr > td').removeClass('lost');
            }
        });
        // 走势功能
        tools.find('input[name="trendLine"]').change(function () {
            var c = trendWrapper.find('canvas');
            if ($(this).is(':checked')) {
                initTrendLine();
            } else {
                c.remove();
            }
        });
    };

    // 检查工具
    var checkTools = function (thisTable) {
        var tools = trendControl.find('.tools');
        var isShowGuides = tools.find('input[name="guides"]').is(':checked');
        if (isShowGuides) {
            thisTable.removeClass('hide-guides');
        } else {
            thisTable.addClass('hide-guides');
        }
        var isShowLostNum = tools.find('input[name="lostNum"]').is(':checked');
        if (isShowLostNum) {
            thisTable.removeClass('hide-lost');
        } else {
            thisTable.addClass('hide-lost');
        }
        var isShowLostLine = tools.find('input[name="lostLine"]').is(':checked');
        if (isShowLostLine) {
            initLostLine();
        }
        var isShowTrendLine = tools.find('input[name="trendLine"]').is(':checked');
        if (isShowTrendLine) {
            initTrendLine();
        }
    };

    // 初始化方法
    var initMethod = function () {
        trendMethod.append('<a data-val="SanMa">三码</a>');
        trendMethod.append('<a data-val="HouEr">后二码</a>');
        trendMethod.append('<a data-val="QianEr">前二码</a>');

        trendMethod.find('a').click(function () {
            if (!$(this).hasClass('active')) {
                trendMethod.find('a').removeClass('active');
                $(this).addClass('active');
                var method = $(this).attr('data-val');
                initTable(method);
            }
        });
        trendMethod.find('a').eq(0).addClass('active');
    };

    // 获取方法
    var getMethod = function () {
        return trendMethod.find('a.active').attr('data-val');
    };

    // 初始化三码
    var initSanMa = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            var colspanNum = 6 + addnum;
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="position">个位</td>');
            row1.append('<td colspan="' + colspanNum + '" class="location">号码分布</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 4; j++) {
                for (var i = 1; i <= (6 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (6 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                tmpCode.push(v.code.replace(',', ','));
                formatCode(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    // 初始化二星
    var initErXing = function (type) {
        // 格式化类型
        var formatType = function (thisRow, thisCode) {
            // 对子
            var cell_dz = $('<td class="type">');
            if (addnum != 1 && (thisCode[0] == thisCode[1])) {
                cell_dz.append('<i class="checked">');
            }
            thisRow.append(cell_dz);
            // 大小
            var bigChar = '大';
            var smallChar = '小';

            var cell_dx = $('<td class="type bg-blue">');
            $.each(thisCode, function (i, val) {
                cell_dx.append(val < (5 + addnum) ? smallChar : bigChar);
            });
            thisRow.append(cell_dx);
            // 单双
            var cell_ds = $('<td class="type bg-green">');
            $.each(thisCode, function (i, val) {
                if ((val % 2) != 1) {
                    cell_ds.append('双');
                } else {
                    cell_ds.append('单');
                }
            });
            thisRow.append(cell_ds);
            // 直选和值
            var cell_hz = $('<td class="type bg-red">');
            var hzVal = 0;
            $.each(thisCode, function (i, val) {
                hzVal += parseInt(val);
            });
            cell_hz.append(hzVal);
            thisRow.append(cell_hz);
        };

        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td rowspan="2" class="issue">期号</td>');
            row1.append('<td rowspan="2" class="result">开奖号码</td>');
            var colspanNum = 6 + addnum;
            if (type == 'after') {
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
                row1.append('<td colspan="' + colspanNum + '"class="position">个位</td>');
            }
            if (type == 'before') {
                row1.append('<td colspan="' + colspanNum + '" class="position">百位</td>');
                row1.append('<td colspan="' + colspanNum + '" class="position">十位</td>');
            }
            row1.append('<td width="6%" rowspan="2" class="type">对子</td>');
            row1.append('<td width="10%" rowspan="2" class="type">大小形态</td>');
            row1.append('<td width="10%" rowspan="2" class="type">单双形态</td>');
            row1.append('<td width="10%" rowspan="2" class="type">直选和值</td>');
            var row2 = $('<tr>');
            for (var j = 1; j <= 2; j++) {
                for (var i = 1; i <= (6 + addnum); i++) {
                    var tmpCell = $('<td class="code">');
                    if (i == (6 + addnum)) {
                        tmpCell.addClass('border-right');
                    }
                    tmpCell.html(i + addnum);
                    row2.append(tmpCell);
                }
            }
            head.append(row1);
            head.append(row2);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                if (type == 'before') {
                    tmpCode.splice(2, 1);
                }
                if (type == 'after') {
                    tmpCode.splice(0, 1);
                }
                formatCode(tmpRow, tmpCode);
                formatType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount(6));
            foot.append(buildAvgLost(6));
            foot.append(buildMaxLost(6));
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData();
        buildTable();
    };

    var initTable = function (method) {
        if (method == 'SanMa') {
            initSanMa();
        }
        if (method == 'HouEr') {
            initErXing('after');
        }
        if (method == 'QianEr') {
            initErXing('before');
        }
    };

    var init = function (addNumPrarm, data) {
        addnum = addNumPrarm;
        ThisData = data;
        if (!isInit) {
            isInit = true;
            initMethod();
            initControl();
        }
        initTable(getMethod());
    };

    return {
        init: init
    }

}();

// 快樂彩(快8)
var TrendKLC = function () {

    var addnum = 0;

    var trendMethod = $('.trend-method');
    var trendControl = $('.trend-control');
    var trendWrapper = $('.trend-wrapper');

    var isInit = false; // 是否已经初始化

    var ThisData = []; // 号码数据

    var DataTmpLost = []; // 当前累计遗漏
    var DataTotalCount = []; // 出现总次数
    var DataSumLost = []; // 总的遗漏
    var DataMaxLost = []; // 最大遗漏

    var clearData = function (len) {
        DataTmpLost = Array(len).fill();
        DataTotalCount = Array(len).fill();
        DataSumLost = Array(len).fill();
        DataMaxLost = Array(len).fill();
    };

    // 构建总的出现次数
    var buildTotalCount = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">出现总次数</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataTotalCount.length; i++) {
            let thisCell = $(`<td>${DataTotalCount[i] != undefined ? DataTotalCount[i] : '-'}</td>`);
            if (i != DataTotalCount.length - 1) thisCell.addClass("border-right");
            thisRow.append(thisCell);
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建平均遗漏值
    var buildAvgLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">平均遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataSumLost.length; i++) {
            let thisCell = $(`<td>${DataSumLost[i] != undefined ? Math.round(DataSumLost[i] / ThisData.length) : '-'}</td>`);
            if (i != DataSumLost.length - 1) thisCell.addClass("border-right");
            thisRow.append(thisCell);

        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 构建最大遗漏值
    var buildMaxLost = function (blankCells) {
        var thisRow = $('<tr>');
        thisRow.append('<td class="border-right">最大遗漏值</td>');
        thisRow.append('<td class="border-right">-</td>');
        for (var i = 0; i < DataMaxLost.length; i++) {
            let thisCell = $(`<td>${DataMaxLost[i] != undefined ? DataMaxLost[i] : '-'}</td>`);
            if (i != DataMaxLost.length - 1) thisCell.addClass("border-right");
            thisRow.append(thisCell);
        }
        if (blankCells) {
            thisRow.append('<td colspan="' + blankCells + '" class="border-left"></td>');
        }
        return thisRow;
    };

    // 初始化遗漏
    var initLostLine = function () {
        var table = trendWrapper.find('table');
        var head = table.find('thead');
        var len = head.find('td.kl8Type').length;
        var body = table.find('tbody');
        var thisRows = body.find('tr');
        for (var i = 0; i < len; i++) {
            var cells = [];
            $.each(thisRows, function () {
                cells.push($(this).find('td.kl8Type').eq(i));
            });
            for (var j = cells.length; j > 0; j--) {
                if ($(cells[j - 1]).hasClass('bg-blue')) {
                    break;
                } else {
                    $(cells[j - 1]).addClass('lost');
                }
            }
        }
    };

    // 初始化控制功能
    var initControl = function () {
        var tools = trendControl.find('.tools');
        // 辅助线功能
        tools.find('input[name="guides"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-guides');
            } else {
                t.addClass('hide-guides');
            }
        });
        // 遗漏功能
        tools.find('input[name="lostNum"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                t.removeClass('hide-lost');
            } else {
                t.addClass('hide-lost');
            }
        });
        // 遗漏条功能
        tools.find('input[name="lostLine"]').change(function () {
            var t = trendWrapper.find('table');
            if ($(this).is(':checked')) {
                initLostLine();
            } else {
                t.find('tbody > tr > td').removeClass('lost');
            }
        });
        // 走势功能
        tools.find('input[name="trendLine"]').parent().addClass("hide");
    };

    // 检查工具
    var checkTools = function (thisTable) {
        var tools = trendControl.find('.tools');
        var isShowGuides = tools.find('input[name="guides"]').is(':checked');
        if (isShowGuides) {
            thisTable.removeClass('hide-guides');
        } else {
            thisTable.addClass('hide-guides');
        }
        var isShowLostNum = tools.find('input[name="lostNum"]').is(':checked');
        if (isShowLostNum) {
            thisTable.removeClass('hide-lost');
        } else {
            thisTable.addClass('hide-lost');
        }
        var isShowLostLine = tools.find('input[name="lostLine"]').is(':checked');
        if (isShowLostLine) {
            initLostLine();
        }
    };

    // 初始化方法
    var initMethod = function () {
        trendMethod.append('<a data-val="DanShuang">大小单双</a>');
        trendMethod.append('<a data-val="WuXing">五行</a>');
        trendMethod.append('<a data-val="GSB">个数比</a>');

        trendMethod.find('a').click(function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings().removeClass('active');
                initTable($(this).attr('data-val'));
            }
        });
        trendMethod.find('a').eq(0).addClass('active');
    };

    // 获取方法
    var getMethod = function () {
        return trendMethod.find('a.active').attr('data-val');
    };

    /** 添加一個td至thisRow */
    function addOneCell(thisRow, text, highlight) {
        let cell = $(`<td class="kl8Type">${text}</td>`);
        if (highlight) {
            cell.addClass("bg-blue");
        }
        thisRow.append(cell);
    }

    function initBeforeSet(arr, i) {
        if (!arr[i]) arr[i] = 0;
    }

    /** 指定index在thisRow有值 */
    function setPlus(index) {
        initBeforeSet(DataTmpLost, index);
        initBeforeSet(DataTotalCount, index);

        DataTmpLost[index] = 0; // 當前累計遺漏 歸零
        DataTotalCount[index]++; // 出現總次數+1
    }
    /** 指定index在thisRow沒有值 */
    function setLost(index) {
        initBeforeSet(DataTmpLost, index);
        initBeforeSet(DataSumLost, index);
        initBeforeSet(DataMaxLost, index);

        DataTmpLost[index]++; // 當前累計遺漏+1
        DataSumLost[index] += DataTmpLost[index]; // 遺漏總次數加上當前累計
        DataMaxLost[index] = (DataTmpLost[index] > DataMaxLost[index]) ? DataTmpLost[index] : DataMaxLost[index]; // 判斷當前遺漏是否大於最大遺漏值並覆寫
    }

    // 初始化大小单双table
    var initDanShuang = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td class="issue">期号</td>');
            row1.append('<td class="result">开奖号码</td>');
            row1.append('<td class="kl8Type">和值</td>');
            row1.append('<td class="kl8Type">单</td>');
            row1.append('<td class="kl8Type">双</td>');
            row1.append('<td class="kl8Type">大</td>');
            row1.append('<td class="kl8Type">小</td>');
            row1.append('<td class="kl8Type">和</td>');
            row1.append('<td class="kl8Type">大单</td>');
            row1.append('<td class="kl8Type">大双</td>');
            row1.append('<td class="kl8Type">小单</td>');
            row1.append('<td class="kl8Type">小双</td>');
            head.append(row1);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            /** 格式化和值判斷 */
            var formatDanShuangType = function (thisRow, tmpCode) {

                // 和值
                const total = tmpCode.reduce((a, b) => parseInt(a) + parseInt(b));
                addOneCell(thisRow, total, true);

                const isSingle = total % 2 == 1;
                const isLarge = total > 810 && total <= 1410;
                const isEqual = total == 810;

                // 組合設定
                const settings = [
                    {
                        indexs: [1, 2],
                        text: ['单', '双'],
                        judgeFunc: [
                            function () { return isSingle },
                            function () { return !isSingle }
                        ]
                    },
                    {
                        indexs: [3, 4, 5],
                        text: ['大', '小', '和'],
                        judgeFunc: [
                            function () { return isLarge && !isEqual },
                            function () { return !isLarge && !isEqual },
                            function () { return isEqual }
                        ]
                    },
                    {
                        indexs: [6, 7, 8, 9],
                        text: ['大单', '小单', '大双', '小双'],
                        judgeFunc: [
                            function () { return isLarge && isSingle },
                            function () { return !isLarge && isSingle },
                            function () { return isLarge && !isSingle },
                            function () { return !isLarge && !isSingle }
                        ]
                    },
                ]

                settings.forEach(setting => {
                    const plusIndex = setting.judgeFunc.findIndex(x => x() == true);
                    for (let i = 0; i < setting.indexs.length; i++) {
                        if (i == plusIndex) {
                            setPlus(setting.indexs[i]);
                            addOneCell(thisRow, setting.text[plusIndex], true);
                        } else {
                            setLost(setting.indexs[i]);
                            addOneCell(thisRow, DataTmpLost[setting.indexs[i]]);
                        }
                    }
                });
            };

            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                formatDanShuangType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $(`<table class="trend-table"></table>`);
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData(10);
        buildTable();
    };

    // 初始化五行table
    var initWuXing = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td class="issue">期号</td>');
            row1.append('<td class="result">开奖号码</td>');
            row1.append('<td class="kl8Type">和值</td>');
            row1.append('<td class="kl8Type">金210~695</td>');
            row1.append('<td class="kl8Type">木696~763</td>');
            row1.append('<td class="kl8Type">水764~855</td>');
            row1.append('<td class="kl8Type">火856~923</td>');
            row1.append('<td class="kl8Type">土924~1410</td>');
            head.append(row1);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            /** 格式化和值五行判斷 */
            var formatWuXingType = function (thisRow, tmpCode) {

                // 和值
                const total = tmpCode.reduce((a, b) => parseInt(a) + parseInt(b));
                addOneCell(thisRow, total, true);

                // 組合設定
                const settings = [
                    {
                        indexs: [1, 2, 3, 4, 5],
                        text: ['金', '木', '水', '火', '土'],
                        judgeFunc: [
                            function () { return total > 209 && total <= 695 },
                            function () { return total > 695 && total <= 763 },
                            function () { return total > 763 && total <= 855 },
                            function () { return total > 855 && total <= 923 },
                            function () { return total > 923 && total <= 1410 },
                        ]
                    },
                ]

                settings.forEach(setting => {
                    const plusIndex = setting.judgeFunc.findIndex(x => x() == true);
                    for (let i = 0; i < setting.indexs.length; i++) {
                        if (i == plusIndex) {
                            setPlus(setting.indexs[i]);
                            addOneCell(thisRow, setting.text[plusIndex], true);
                        } else {
                            setLost(setting.indexs[i]);
                            addOneCell(thisRow, DataTmpLost[setting.indexs[i]]);
                        }
                    }
                });
            };

            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                formatWuXingType(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $(`<table class="trend-table"></table>`);
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData(6);
        buildTable();
    }

    // 初始化個數比table
    var initGSB = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            row1.append('<td class="issue">期号</td>');
            row1.append('<td class="result">开奖号码</td>');
            row1.append('<td class="kl8Type">奇偶个数</td>');
            row1.append('<td class="kl8Type">奇</td>');
            row1.append('<td class="kl8Type">和</td>');
            row1.append('<td class="kl8Type">偶</td>');
            row1.append('<td class="kl8Type">上下个数</td>');
            row1.append('<td class="kl8Type">上</td>');
            row1.append('<td class="kl8Type">中</td>');
            row1.append('<td class="kl8Type">下</td>');
            head.append(row1);
            return head;
        };

        // 构建中间
        var buildBody = function () {
            /** 格式化奇偶個數比判斷 */
            var formatGSBType1 = function (thisRow, tmpCode) {
                // 奇偶個數
                let oddCount = tmpCode.filter(x => (parseInt(x) % 2) == 1).length;
                let evenCount = tmpCode.length - oddCount;
                addOneCell(thisRow, `${oddCount}:${evenCount}`, true);

                // 組合設定
                const settings = [
                    {
                        indexs: [1, 2, 3],
                        text: ['奇', '和', '偶'],
                        judgeFunc: [
                            function () { return oddCount > evenCount },
                            function () { return oddCount == evenCount },
                            function () { return oddCount < evenCount },
                        ]
                    },
                ]

                settings.forEach(setting => {
                    const plusIndex = setting.judgeFunc.findIndex(x => x() == true);
                    for (let i = 0; i < setting.indexs.length; i++) {
                        if (i == plusIndex) {
                            setPlus(setting.indexs[i]);
                            addOneCell(thisRow, setting.text[plusIndex], true);
                        } else {
                            setLost(setting.indexs[i]);
                            addOneCell(thisRow, DataTmpLost[setting.indexs[i]]);
                        }
                    }
                });
            };
            /** 格式化上下個數比判斷 */
            var formatGSBType2 = function (thisRow, tmpCode) {
                // 上下個數
                let largeCount = tmpCode.filter(x => (parseInt(x) > 40)).length;
                let smallCount = tmpCode.length - largeCount;
                addOneCell(thisRow, `${largeCount}:${smallCount}`, true)

                // 組合設定
                const settings = [
                    {
                        indexs: [5, 6, 7],
                        text: ['上', '中', '下'],
                        judgeFunc: [
                            function () { return largeCount > smallCount },
                            function () { return largeCount == smallCount },
                            function () { return largeCount < smallCount },
                        ]
                    },
                ]

                settings.forEach(setting => {
                    const plusIndex = setting.judgeFunc.findIndex(x => x() == true);
                    for (let i = 0; i < setting.indexs.length; i++) {
                        if (i == plusIndex) {
                            setPlus(setting.indexs[i]);
                            addOneCell(thisRow, setting.text[plusIndex], true);
                        } else {
                            setLost(setting.indexs[i]);
                            addOneCell(thisRow, DataTmpLost[setting.indexs[i]]);
                        }
                    }
                });
            };

            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                formatGSBType1(tmpRow, tmpCode);
                formatGSBType2(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $(`<table class="trend-table"></table>`);
            var head = buildHead();
            var body = buildBody();
            var foot = buildFoot();
            foot.append(head.html());
            table.append(head);
            table.append(body);
            table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            checkTools(table);
        };

        clearData(8);
        buildTable();
    }

    var initTable = function (method) {
        if (method == 'DanShuang') { // 大小單雙
            initDanShuang();
        }
        if (method == 'WuXing') { // 五行
            initWuXing();
        }
        if (method == 'GSB') { // 個數比
            initGSB();
        }
    };

    var init = function (addNumPrarm, data) {
        addnum = addNumPrarm;
        ThisData = data;
        if (!isInit) {
            isInit = true;
            initMethod();
            initControl();
        }
        initTable(getMethod());
    };

    return {
        init: init
    }

}();

// 六合彩
var TrendLHC = function () {
    var addnum = 0;

    var trendMethod = $('.trend-method');
    var trendControl = $('.trend-control');
    var trendWrapper = $('.trend-wrapper');

    var isInit = false; // 是否已经初始化

    var ThisData = []; // 号码数据

    var DataTmpLost = []; // 当前累计遗漏
    var DataTotalCount = []; // 出现总次数
    var DataSumLost = []; // 总的遗漏
    var DataMaxLost = []; // 最大遗漏
    var DataLiftingTM = []; //升降特码
    var DataLiftingTot = []; //升降和值

    var clearData = function () {
        DataTmpLost = [];
        DataTotalCount = [];
        DataSumLost = [];
        DataMaxLost = [];
        DataLiftingTM = [];
        DataLiftingTot = [];
    };
    //生肖球号
    var initShengXiaoBall = function(){
        var shengxiao = localStorage['PRIVATE:shengxiao']&&JSON.parse(localStorage['PRIVATE:shengxiao']);
        var Rgb = {
            '红':'01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46',
            '绿':'05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49',
            '蓝':'03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48',
        };
        //返回生肖
        var sxName = function (str){
            for (j in shengxiao){
                var bool = shengxiao[j].indexOf(str);
                if( bool>=0 ){
                    return j
                };
            };
        };
        //返回红、绿、蓝球
        var ballColor = function (str){
            for (z in Rgb){
                var bool = Rgb[z].indexOf(str);
                if( bool>=0 ){
                    if( z==='红' ){
                        return 'red';
                    }else if( z==='绿' ){
                        return 'green';
                    }else if( z==='蓝' ){
                        return 'blue';
                    }
                };
            };
        };
        var init = function(str){
            var text = sxName(str);
            var cls = ballColor(str);
            return {
                text:text,
                cls:cls
            }
        }
        return {
            init: init
        }
    }();
    // 格式化号码
    var formatCode = function (thisRow, tmpCode) {


        var total = 0;
        $.each(tmpCode, function (i, v) {
           
            var text = initShengXiaoBall.init(v).text
            var cls = initShengXiaoBall.init(v).cls
            var thisCell = $('<td class="ball border-right">');
            thisCell.append(`<div class='n ${cls}'>${v}</div>`);
            thisCell.append(`<div class='sx'>${text}</div>`);
            thisRow.append(thisCell);
            total += parseInt(v);
        });

        var tm = parseInt(tmpCode[tmpCode.length-1]);
        DataLiftingTM.push(tm);
        DataLiftingTot.push(total);
        // 大、小、和
        if( tm>0&&tm<=24 ){
            thisRow.append(`<td class="ball border-right">小</td>`);
        }else if( tm>24&&tm<=48 ){
            thisRow.append(`<td class="ball border-right">大</td>`);
        }else if( tm==49 ){
            thisRow.append(`<td class="ball border-right">和</td>`);
        };
        // 单、双
        if( tm%2 ){
            thisRow.append(`<td class="ball border-right">单</td>`);
        }else{
            thisRow.append(`<td class="ball border-right">双</td>`);
        };
        // 升、降
        if(DataLiftingTM.length>1){
            if( DataLiftingTM[DataLiftingTM.length-1] > DataLiftingTM[DataLiftingTM.length-2] ){
                thisRow.append(`<td class="ball border-right">升</td>`);
            }else if( DataLiftingTM[DataLiftingTM.length-1] == DataLiftingTM[DataLiftingTM.length-2] ){
                thisRow.append(`<td class="ball border-right">平</td>`);
            }else{
                thisRow.append(`<td class="ball border-right">降</td>`);
            };
        }else{
            thisRow.append(`<td class="ball border-right">--</td>`);
        };


        // 大、小、和
        if( total>0&&total<=168 ){
            thisRow.append(`<td class="ball border-right">小</td>`);
        }else if( total>24&&total<=336 ){
            thisRow.append(`<td class="ball border-right">大</td>`);
        }else if( total==343 ){
            thisRow.append(`<td class="ball border-right">和</td>`);
        };
        // 单、双
        if( total%2 ){
            thisRow.append(`<td class="ball border-right">单</td>`);
        }else{
            thisRow.append(`<td class="ball border-right">双</td>`);
        };
       
        // 升、降
        if(DataLiftingTot.length>1){
            if( DataLiftingTot[DataLiftingTot.length-1] > DataLiftingTot[DataLiftingTot.length-2] ){
                thisRow.append(`<td class="ball">升</td>`);
            }else if( DataLiftingTot[DataLiftingTot.length-1] == DataLiftingTot[DataLiftingTot.length-2] ){
                thisRow.append(`<td class="ball">平</td>`);
            }else{
                thisRow.append(`<td class="ball">降</td>`);
            };
        }else{
            thisRow.append(`<td class="ball">--</td>`);
        };

        thisRow.append(`<td class="ball">${total}</td>`);


    };
    // 初始化方法
    var initMethod = function () {
        trendMethod.append('<a data-val="zm1">生肖</a>');

        trendMethod.find('a').click(function () {
            if (!$(this).hasClass('active')) {
                trendMethod.find('a').removeClass('active');
                $(this).addClass('active');
                var method = $(this).attr('data-val');
                initTable(method);
            }
        });
        trendMethod.find('a').eq(0).addClass('active');
    };

    // 获取方法
    var getMethod = function () {
        return trendMethod.find('a.active').attr('data-val');
    };
    // 初始化生肖走势
    var initShengxiao = function () {
        // 构建头部
        var buildHead = function () {
            var head = $('<thead>');
            var row1 = $('<tr>');
            var colspanNum = 48 + addnum;
            row1.append('<td class="issue">期号</td>');
            row1.append('<td class="result">开奖号码</td>');
            row1.append('<td class="result">正1</td>');
            row1.append('<td class="result">正2</td>');
            row1.append('<td class="result">正3</td>');
            row1.append('<td class="result">正4</td>');
            row1.append('<td class="result">正5</td>');
            row1.append('<td class="result">正6</td>');
            row1.append('<td class="result">特码</td>');
            row1.append('<td class="result" colspan="3">特码</td>');
            row1.append('<td class="result" colspan="4">和值</td>');

            head.append(row1);
  
            return head;
        };

        // 构建中间
        var buildBody = function () {console.log( ThisData )
            var body = $('<tbody>');
            $.each(ThisData, function (i, v) {
                var tmpRow = $('<tr>');
                if ((i + 1) % 5 == 0) {
                    tmpRow.addClass('border-bottom');
                }
                tmpRow.append('<td class="issue">' + v.issue + '</td>');
                tmpRow.append('<td class="result">' + v.code + '</td>');
                var tmpCode = v.code.split(',');
                formatCode(tmpRow, tmpCode);
                body.append(tmpRow);
            });
            return body;
        };

        // 构建底部
        var buildFoot = function () {
            var foot = $('<tfoot>');
            foot.append(buildTotalCount());
            foot.append(buildAvgLost());
            foot.append(buildMaxLost());
            return foot;
        };

        var buildTable = function () {
            var table = $('<table>');
            table.addClass('trend-table');
            table.addClass('ssc');
            var head = buildHead();
            var body = buildBody();
            // var foot = buildFoot();
            // foot.append(head.html());
            table.append(head);
            table.append(body);
            // table.append(foot);
            // 填充内容
            trendWrapper.html(table);
            // checkTools(table);
        };

        // clearData();
        buildTable();
    };

    var initTable = function (method) {
        if (method == 'zm1') {
            initShengxiao();
        }
    };

    var init = function (addNumPrarm, data) {
        addnum = addNumPrarm;
        ThisData = data;
        if (!isInit) {
            isInit = true;
            initMethod();
            trendControl.find('.tools').hide();
        }
        initTable(getMethod());
    };

    return {
        init: init
    }


}();


