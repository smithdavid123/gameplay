import $ from 'jquery'
import {account_data, config_data, lotterys, methods, lottery_methods} from "./global"
import {LotteryUtils, GameUtils} from './utils'
import {NumberUtils, RandomUtils} from '../tools'

const SscUtils = GameUtils.SSC;
const X511Utils = GameUtils.X511;
const K3Utils = GameUtils.K3;
const D3Utils = GameUtils.D3;
const Kl8Utils = GameUtils.Kl8;
const PK10Utils = GameUtils.PK10;

export let LotteryPlay = function () {

    // 重置投注数据
    var resetPlayAreaData = function () {
        playList.find('[data-method="' + order_data.method + '"]').trigger('click');
    };
    // 获取注数
    var getInputNumbers = function (method, datasel, type) {
        // var method = order_data.method;
        // var datasel = getPlayAreaData(); // 获取投注内容
        let lottery_data = {'type': type};
        if (lottery_data.type == 1) {
            let flag = SscUtils.inputNumbers(method, datasel);
            if (flag > 0) console.log([flag, method, JSON.stringify(datasel)]);
            return flag;
            return SscUtils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 2) {
            return X511Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 3) {
            return K3Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 4) {
            return D3Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 5) {
            return Kl8Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 6) {
            return PK10Utils.inputNumbers(method, datasel);
        }
        return 0;
    };
    // 获取内容
    var getInputContent = function (method, datasel, type) {
        // var method = order_data.method;
        // var datasel = getPlayAreaData(); // 获取投注内容
        let lottery_data = {'type': type};
        if (lottery_data.type == 1) {
            return SscUtils.inputFormat(method, datasel);
        }
        if (lottery_data.type == 2) {
            return X511Utils.inputFormat(method, datasel);
        }
        if (lottery_data.type == 3) {
            return K3Utils.inputFormat(method, datasel);
        }
        if (lottery_data.type == 4) {
            return D3Utils.inputFormat(method, datasel);
        }
        if (lottery_data.type == 5) {
            return Kl8Utils.inputFormat(method, datasel);
        }
        if (lottery_data.type == 6) {
            return PK10Utils.inputFormat(method, datasel);
        }
        return [];
    };
    // 获取彩票奖级
    var getLotteryCode = function (point) {
        return parseInt(config_data.lotteryCode - (config_data.lotteryPoint - point) * 20);
    };
    // 获取彩票返点
    var getLotteryPoint = function (code) {
        return parseFloat(config_data.lotteryPoint - (config_data.lotteryCode - code) / 20).toFixed(1);
    };

    // 刷新奖级
    var refreshCode = function (game, _model, order_data) {
        let lottery_data = lotterys[game];
        var downCode = lottery_data.downCode; // 彩种的最高返点
        var fenDownCode = lottery_data.fenDownCode; // 分模式的最高返点
        var liDownCode = lottery_data.liDownCode; // 厘模式的最高返点

        // 彩票的奖级和返点，为用户的奖级和返点
        var lotteryMaxCode = account_data.lotteryCode;
        var lotteryMaxPoint = account_data.lotteryPoint;
        var lotteryMinCode = getLotteryCode(0);

        // 如果彩票的奖级大于彩票设置的奖级，则以彩票设置的奖级为准
        if (downCode != 0 && lotteryMaxCode > downCode) {
            lotteryMaxCode = downCode;
            lotteryMaxPoint = getLotteryPoint(lotteryMaxCode);
        }

        // 当前选中的模式
        var model = PlayOptions.model(_model).val;
        if ('fen' == model) {
            if (fenDownCode != 0 && lotteryMaxCode > fenDownCode) {
                lotteryMaxCode = fenDownCode;
                lotteryMaxPoint = getLotteryPoint(lotteryMaxCode);
            }
        }
        if ('li' == model) {
            if (liDownCode != 0 && lotteryMaxCode > liDownCode) {
                lotteryMaxCode = liDownCode;
                lotteryMaxPoint = getLotteryPoint(lotteryMaxCode);
            }
        }
        order_data.minCode = lotteryMinCode;
        order_data.maxCode = lotteryMaxCode;
        order_data.maxPoint = lotteryMaxPoint;
        return;
    };

    // 备忘录：因版本更新和数据压缩要求，特作此优化。
    // 根据最新版改动，支持单独配置彩种和玩法赔率。
    function get_lottery_method_bonus (game, type, method) {
        if (game in lottery_methods) {
            if (method in lottery_methods[game]) return lottery_methods[game][method].bonus;
        }
        let method_data = methods[parseInt(type) - 1];
        return method_data[method].bonus;
    }

    // 更新奖金
    var updateBonus = function (game, type, method, _code, _model) {
        let method_data = methods[parseInt(type) - 1];
        let order_data = {'method': method};
        let lottery_data = lotterys[game];
        
        if (method_data && order_data.method) {
            if (method_data[order_data.method]) {
                // var bonus = method_data[order_data.method].bonus;
                var bonus = get_lottery_method_bonus (game, type, method);
                var unitMoney = config_data.unitMoney;
                var modelMoney = PlayOptions.model(_model).money;
                var code = parseInt(_code);
				// 3.这里更新浮动奖金
				if (lottery_data.floatBonus) {
				    code += lottery_data.floatBonus;
				}
                var bonusArray = LotteryUtils.getBonus({
                    bonus: bonus,
                    unitMoney: unitMoney,
                    modelMoney: modelMoney,
                    code: code
                });

                let result = [bonusArray[0].toFixed(3)];
                if (bonusArray.length > 1) {
                    result.push(bonusArray[bonusArray.length - 1].toFixed(3));
                };
                return result;
            }
        }
    };
    // 游戏选项
    var PlayOptions = function () {
        // 倍数
        var multiple = function (val) {
            // var val = playOptions.find('.multiple > input').val();
            if (val == '') val = 0;
            return parseInt(val);
        };
        // 模式
        var model = function (val) {
            // var item = playOptions.find('.model > .item.selected');
            // var val = item.attr('data-val');
            if (val == 'yuan') {
                return {
                    name: '元',
                    val: val,
                    money: 1
                }
            }
            if (val == 'jiao') {
                return {
                    name: '角',
                    val: val,
                    money: 0.1
                }
            }
            if (val == 'fen') {
                return {
                    name: '分',
                    val: val,
                    money: 0.01
                }
            }
            if (val == 'li') {
                return {
                    name: '厘',
                    val: val,
                    money: 0.001
                }
            }
        };
        // 更新
        var update = function (method, datasel, type, _model, _multi) {
            var nums = getInputNumbers(method, datasel, type);
            var total = nums * multiple(_multi) * config_data.unitMoney * model(_model).money;
            total = NumberUtils.toFixed(total, 3);
            return {'nums': nums, 'total': total};
        };

        return {
            multiple: multiple,
            model: model,
            update: update,
        }
    }();

    // 获取金额
    var getMoney = function (data) {
        var total = data.nums * data.multiple * config_data.unitMoney * data.model.money;
        total = NumberUtils.toFixed(total, 3);
        return total;
    };
    // 获取总计
    var getTotal = function (order_list) {
        var total = 0;
        var l = order_list.length;
        for (var i = 0; i < l; i++) {
            total += getMoney(order_list[i]);
        }
        return total;
    };
    // 获取数据
    var getData = function (name, _code, _point, order_data, datasel, _model, _mulit) {
        var id = RandomUtils.uuid(24);
        var lottery = name;
        var type = lotterys[name].type;

        var issue = ''; // 暂时没有期号
        var method = order_data.method;
        var compress = order_data.compress ? true : false;
        var nums = getInputNumbers(method, datasel, type);
        var content = getInputContent(method, datasel, type);
        var code = parseInt(_code);
        var point = parseFloat(_point);
        var multiple = PlayOptions.multiple(_mulit);
        var model = PlayOptions.model(_model);
        return {
            id: id,
            lottery: lottery,
            issue: issue,
            method: method,
            compress: compress,
            nums: nums,
            content: content,
            code: code,
            point: point,
            multiple: multiple,
            model: model,
            type: type
        }
    };



    // 重置
    var reset = function () {
        resetPlayAreaData();
    };
    return {
        // init: init,
        getTotal: getTotal,
        getMoney: getMoney,
        getData: getData,
        reset: reset,
        PlayOptions: PlayOptions,
        updateBonus: updateBonus,
        getLotteryPoint: getLotteryPoint,
        refreshCode: refreshCode
    }
}();

