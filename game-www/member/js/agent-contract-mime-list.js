$(document).ready(function () {

    var thisPanel = $('.main-panel');

    // 加载契约分红
    var loadDividendContract = function () {
        ContractCtrl.request('LOAD_DIVIDEND_CONTRACT', {
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                
                /*
                *百分比返
                */
                //var res = {"error":0,"code":null,"message":"请求成功","data":{"id":77,"accountTo":17,"accountFrom":0,"scalePoint":4,"activeUser":3,"extraRules":"[{\"totalConsume\":0.5,\"activeUser\":3,\"scalePoint\":0.3},{\"totalConsume\":150,\"activeUser\":4,\"scalePoint\":0.6},{\"totalConsume\":200,\"activeUser\":5,\"scalePoint\":0.9},{\"totalConsume\":250,\"activeUser\":6,\"scalePoint\":1.2}]","status":1}}
                /*
                *间隙返
                */
                //var res = {"error":0,"code":null,"message":"请求成功","data":{"id":78,"accountTo":17,"accountFrom":0,"scalePoint":25,"activeUser":2,"extraRules":"[{\"totalConsume\":1000,\"totalLoss\":110,\"activeUser\":2,\"scalePoint\":25}]","status":1}}
                /*
                *原始平台
                */
                //var res = {"error":0,"code":null,"message":"请求成功","data":{"id":79,"accountTo":17,"accountFrom":0,"scalePoint":25,"activeUser":4,"extraRules":"[{\"totalConsume\":1000,\"totalLoss\":0,\"activeUser\":15,\"dailyLoss\":0,\"lossDay\":0,\"scalePoint\":26},{\"totalConsume\":1500,\"totalLoss\":0,\"activeUser\":20,\"dailyLoss\":0,\"lossDay\":0,\"scalePoint\":27},{\"totalConsume\":2000,\"totalLoss\":0,\"activeUser\":30,\"dailyLoss\":0,\"lossDay\":0,\"scalePoint\":28}]","status":1}}

                if (res.error == 0) {
                    if (res.data) {
                        if (res.data) {
                            if (store.get('PRIVATE:dividendType') == 1) {
                                buildDividendContract(res.data);
                            }else if ( store.get('PRIVATE:dividendType') == 2) {
                                buildDividendContract2(res.data);
                            }else if ( store.get('PRIVATE:dividendType') == 3||store.get('PRIVATE:dividendType') == 4) {
                                buildDividendContract3(res.data);
                            };
                        }
                    }
                }
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };
    // 构建契约分红--(第一套:百分比返)
    var buildDividendContract = function (data) {
        var thisItem = $('#dividend-contract');
        var baseInfo = thisItem.find('[data-table="baseInfo"]');
        var extraRules = thisItem.find('[data-table="extraRules"]');
        if (data.status == 0) {
            baseInfo.find('[data-field="status"]').html('待确认分红').css('color', '#00faed');
            thisItem.find('[data-type="action"]').show();
        } else {
            thisItem.find('[data-type="action"]').hide();
        }
        if (data.status == 1) {
            baseInfo.find('[data-field="status"]').html('已签订分红').css('color', '#f8ef08');
        }
        if (data.status == -1) {
            baseInfo.find('[data-field="status"]').html('拒签分红').css('color', '#e41010');
        }
        baseInfo.find('[data-field="scalePoint"]').html(data.scalePoint.toFixed(1));
        baseInfo.find('[data-field="activeUser"]').html(data.activeUser);

        var initExtraRules = function (rules) {
            extraRules.find('tbody').empty();
            $.each(rules, function(i, v) {
                var tmpRule =
                    '<tr>\
                        <td class="text-center">' + v.totalConsume + '</td>\
                        <td class="text-center">' + v.activeUser + '</td>\
                        <td class="text-center">' + v.scalePoint + ' %</td>\
                    </tr>';
                extraRules.find('tbody').append(tmpRule);
            });
        };

        if (data.extraRules) {
            var rules = JSON.parse(data.extraRules);
            if (rules.length > 0) {
                initExtraRules(rules);
                extraRules.show();
            } else {
                extraRules.hide();
            }
        } else {
            extraRules.hide();
        }

        thisItem.find('[data-command="agree"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定同意签订契约分红？',
                confirmFn: function () {
                    doConfirmDividendContract({
                        confirm: 'agree'
                    });
                }
            });
        });
        thisItem.find('[data-command="refuse"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定拒绝签订契约分红？',
                confirmFn: function () {
                    doConfirmDividendContract({
                        confirm: 'refuse'
                    });
                }
            });
        });
        thisItem.show();
    };
    // 构建契约分红--(第二套)
    var buildDividendContract2 = function (data) {
        var thisItem = $('#dividend-contract2');
        var baseInfo = thisItem.find('[data-table="baseInfo"]');
        var extraRules = thisItem.find('[data-table="extraRules"]');
        if (data.status == 0) {
            baseInfo.find('[data-field="status"]').html('待确认分红').css('color', '#EF8B26');
            thisItem.find('[data-type="action"]').show();
        } else {
            thisItem.find('[data-type="action"]').hide();
        }
        if (data.status == 1) {
            baseInfo.find('[data-field="status"]').html('已签订分红').css('color', '#519B3B');
        }
        if (data.status == -1) {
            baseInfo.find('[data-field="status"]').html('拒签分红').css('color', '#FB5D6A');
        }
        baseInfo.find('[data-field="scalePoint"]').html(data.scalePoint.toFixed(1));
        baseInfo.find('[data-field="activeUser"]').html(data.activeUser);

        var initExtraRules = function (rules) {
            extraRules.find('tbody').empty();
            $.each(rules, function(i, v) {
                var tmpRule =
                    '<tr>\
                        <td class="text-center">' + v.totalConsume + '</td>\
						<td class="text-center">' + v.totalLoss + '</td>\
                        <td class="text-center">' + v.activeUser + '</td>\
                        <td class="text-center">' + v.scalePoint + ' %</td>\
                    </tr>';
                extraRules.find('tbody').append(tmpRule);
            });
        };

        if (data.extraRules) {
            var rules = JSON.parse(data.extraRules);
            if (rules.length > 0) {
                initExtraRules(rules);
                extraRules.show();
            } else {
                extraRules.hide();
            }
        } else {
            extraRules.hide();
        }

        thisItem.find('[data-command="agree"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定同意签订契约分红？',
                confirmFn: function () {
                    doConfirmDividendContract({
                        confirm: 'agree'
                    });
                }
            });
        });
        thisItem.find('[data-command="refuse"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定拒绝签订契约分红？',
                confirmFn: function () {
                    doConfirmDividendContract({
                        confirm: 'refuse'
                    });
                }
            });
        });
        thisItem.show();
    };
    // 构建契约分红--(第一套:百分比返 第三套:原始平台)
    var buildDividendContract3 = function (data) {
        var thisItem = $('#dividend-contract3');
        var baseInfo = thisItem.find('[data-table="baseInfo"]');
        var extraRules = thisItem.find('[data-table="extraRules"]');
        if (data.status == 0) {
            baseInfo.find('[data-field="status"]').html('待确认分红').css('color', '#EF8B26');
            thisItem.find('[data-type="action"]').show();
        } else {
            thisItem.find('[data-type="action"]').hide();
        }
        if (data.status == 1) {
            baseInfo.find('[data-field="status"]').html('已签订分红').css('color', '#519B3B');
        }
        if (data.status == -1) {
            baseInfo.find('[data-field="status"]').html('拒签分红').css('color', '#FB5D6A');
        }
        baseInfo.find('[data-field="scalePoint"]').html(data.scalePoint.toFixed(1));
        baseInfo.find('[data-field="activeUser"]').html(data.activeUser);

        var initExtraRules = function (rules) {
            extraRules.find('tbody').empty();
            $.each(rules, function(i, v) {
                var tmpRule =
                    '<tr>\
                        <td class="text-center">' + v.totalConsume + '</td>\
						<td class="text-center">' + v.totalLoss + '</td>\
                        <td class="text-center">' + v.activeUser + '</td>\
                        <td class="text-center">' + v.scalePoint + ' %</td>\
                    </tr>';
                extraRules.find('tbody').append(tmpRule);
            });
        };

        if (data.extraRules) {
            var rules = JSON.parse(data.extraRules);
            if (rules.length > 0) {
                initExtraRules(rules);
                extraRules.show();
            } else {
                extraRules.hide();
            }
        } else {
            extraRules.hide();
        }

        thisItem.find('[data-command="agree"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定同意签订契约分红？',
                confirmFn: function () {
                    doConfirmDividendContract({
                        confirm: 'agree'
                    });
                }
            });
        });
        thisItem.find('[data-command="refuse"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定拒绝签订契约分红？',
                confirmFn: function () {
                    doConfirmDividendContract({
                        confirm: 'refuse'
                    });
                }
            });
        });
        thisItem.show();
    };

    var doConfirmDividendContract = function (data) {
        ContractCtrl.request('CONFIRM_DIVIDEND_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '操作成功',
                        callback: function () {
                            window.location.reload();
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
            }
        });
    };

    // 加载契约工资
    var loadSalaryContract = function () {
        ContractCtrl.request('LOAD_SALARY_CONTRACT', {
            beforeSend: function () {
                thisPanel.ajaxLoading(true);
            },
            success: function (res) {
                /*
                *百分比返
                */
                //var res = {"error":0,"code":null,"message":"请求成功","data":{"id":83,"accountTo":17,"accountFrom":0,"scalePoint":0.2,"activeUser":3,"extraRules":"[{\"totalConsume\":10,\"activeUser\":1,\"scalePoint\":0.05},{\"totalConsume\":20,\"activeUser\":1,\"scalePoint\":0.1},{\"totalConsume\":30,\"activeUser\":3,\"scalePoint\":0.15},{\"totalConsume\":50,\"activeUser\":3,\"scalePoint\":0.2}]","status":1}}
                /*
                *间隙返
                */
                //var res = {"error":0,"code":null,"message":"请求成功","data":{"id":82,"accountTo":17,"accountFrom":0,"scalePoint":0,"activeUser":0,"extraRules":"{\"unitConsume\":10000,\"unitAmount\":21}","status":1}}
                
                /*
                *原始平台
                */
                //var  res = {"error":0,"code":null,"message":"请求成功","data":{"id":81,"accountTo":17,"accountFrom":0,"scalePoint":1.6,"activeUser":1,"extraRules":"[{\"totalConsume\":10,\"activeUser\":2,\"scalePoint\":1.8},{\"totalConsume\":20,\"activeUser\":2,\"scalePoint\":1.9}]","status":1}}
                if (res.error == 0) {
                    if (res.data) {
                        if (store.get('PRIVATE:salaryType') == 2) {
                            buildSalaryContract2(res.data);
                        }
                        if ( store.get('PRIVATE:salaryType') == 3||store.get('PRIVATE:salaryType') == 1) {
                            buildSalaryContract(res.data);
                        }
                    }
                }
            },
            complete: function () {
                thisPanel.ajaxLoading(false);
            }
        });
    };
    // 构建契约工资（第二套:间隙返）
    var buildSalaryContract2 = function (data) {
        var thisItem = $('#salary-contract2');
        var baseInfo = thisItem.find('[data-table="baseInfo"]');
        if (data.status == 0) {
            thisItem.find('[data-field="status"]').html('待确认工资').css('color', '#EF8B26');
            thisItem.find('[data-type="action"]').show();
        } else {
            thisItem.find('[data-type="action"]').hide();
        }
        if (data.status == 1) {
            thisItem.find('[data-field="status"]').html('已签订工资').css('color', '#519B3B');
        }
        if (data.status == -1) {
            thisItem.find('[data-field="status"]').html('拒签工资').css('color', '#FB5D6A');
        }
        if (data.extraRules) {
            var extraRules = JSON.parse(data.extraRules);
            thisItem.find('[data-field="unitConsume"]').html(extraRules.unitConsume);
            thisItem.find('[data-field="unitAmount"]').html(extraRules.unitAmount);
        }
        thisItem.find('[data-command="agree"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定同意签订契约工资？',
                confirmFn: function () {
                    doConfirmSalaryContract({
                        confirm: 'agree'
                    });
                }
            });
        });
        thisItem.find('[data-command="refuse"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定拒绝签订契约工资？',
                confirmFn: function () {
                    doConfirmSalaryContract({
                        confirm: 'refuse'
                    });
                }
            });
        });
        thisItem.show();
    };
    // 构建契约工资（第一套:百分比返， 第三套:原始平台）
    var buildSalaryContract = function (data) {
        var thisItem = $('#salary-contract');
        var baseInfo = thisItem.find('[data-table="baseInfo"]');
        var extraRules = thisItem.find('[data-table="extraRules"]');
        if (data.status == 0) {
            baseInfo.find('[data-field="status"]').html('待确认工资').css('color', '#EF8B26');
            thisItem.find('[data-type="action"]').show();
        } else {
            thisItem.find('[data-type="action"]').hide();
        }
        if (data.status == 1) {
            baseInfo.find('[data-field="status"]').html('已签订工资').css('color', '#519B3B');
        }
        if (data.status == -1) {
            baseInfo.find('[data-field="status"]').html('拒签工资').css('color', '#FB5D6A');
        }
        baseInfo.find('[data-field="scalePoint"]').html(data.scalePoint.toFixed(1));
        baseInfo.find('[data-field="activeUser"]').html(data.activeUser);

        var initExtraRules = function (rules) {
            extraRules.find('tbody').empty();
            $.each(rules, function(i, v) {
                var tmpRule =
                    '<tr>\
                        <td class="text-center">' + v.totalConsume + '</td>\
                        <td class="text-center">' + v.activeUser + '</td>\
                        <td class="text-center">' + v.scalePoint + ' %</td>\
                    </tr>';
                extraRules.find('tbody').append(tmpRule);
            });
        };

        if (data.extraRules) {
            var rules = JSON.parse(data.extraRules);
            if (rules.length > 0) {
                initExtraRules(rules);
                extraRules.show();
            } else {
                extraRules.hide();
            }
        } else {
            extraRules.hide();
        }

        thisItem.find('[data-command="agree"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定同意签订契约工资？',
                confirmFn: function () {
                    doConfirmSalaryContract({
                        confirm: 'agree'
                    });
                }
            });
        });
        thisItem.find('[data-command="refuse"]').click(function () {
            AlertUtils.confirm({
                icon: 'question',
                content: '确定拒绝签订契约工资？',
                confirmFn: function () {
                    doConfirmSalaryContract({
                        confirm: 'refuse'
                    });
                }
            });
        });
        thisItem.show();
    };
    //确认签订契约工资
    var doConfirmSalaryContract = function (data) {
        ContractCtrl.request('CONFIRM_SALARY_CONTRACT', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    ModalBoxUtils.close();
                    AlertUtils.alert({
                        icon: 'success',
                        content: '操作成功',
                        callback: function () {
                            window.location.reload();
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
            }
        });
    };

    loadDividendContract();
    loadSalaryContract();
});