import $ from 'jquery'
// 数组工具类
var ArrayUtils = function () {
  // 组合数
  var ComNum = function (n, m) {
    m = parseInt(m);
    n = parseInt(n);
    if (m < 0 || n < 0) {
      return 0;
    }
    if (m == 0 || n == 0) {
      return 1;
    }
    if (m > n) {
      return 0;
    }
    if (m > n / 2.0) {
      m = n - m;
    }
    var result = 0.0;
    for (var i = n; i >= (n - m + 1); i--) {
      result += Math.log(i);
    }
    for (var i = m; i >= 1; i--) {
      result -= Math.log(i);
    }
    result = Math.exp(result);
    return Math.round(result);
  };
  // 组合值
  var ComVal = function (source, m, x) {
    var n = source.length;
    var list = [];
    var start = 0;
    while (m > 0) {
      if (m == 1) {
        list.push(source[start + x]);
        break;
      }
      for (var i = 0; i <= n - m; i++) {
        var cnm = ComNum(n - 1 - i, m - 1);
        if (x <= cnm - 1) {
          list.push(source[start + i]);
          start = start + (i + 1);
          n = n - (i + 1);
          m--;
          break;
        } else {
          x = x - cnm;
        }
      }
    }
    return list;
  };
  // 判断是否存在
  var inArray = function (e, data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i] == e) return true;
    }
    return false;
  };
  // 数组去重复
  var uniquelize = function (data) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
      if (!inArray(data[i], array)) {
        array.push(data[i]);
      }
    }
    return array;
  };
  //求两个集合的并集
  var union = function (a, b) {
    return uniquelize(a.concat(b));
  };
  //求两个集合的差集
  var minus = function (a, b) {
    var array = [];
    var ua = uniquelize(a);
    for (var i = 0; i < ua.length; i++) {
      if (!inArray(ua[i], b)) {
        array.push(ua[i]);
      }
    }
    return array;
  };
  //求两个集合的交集
  var intersect = function (a, b) {
    var array = [];
    var ua = uniquelize(a);
    for (var i = 0; i < ua.length; i++) {
      if (inArray(ua[i], b)) {
        array.push(ua[i]);
      }
    }
    return array;
  };
  //求两个集合的补集
  var complement = function (a, b) {
    return minus(union(a, b), intersect(a, b));
  };
  // 去除重复，最快速方法，会排序
  var unique = function (data) {
    data.sort();
    var re = [data[0]];
    for (var i = 1; i < data.length; i++) {
      if (data[i] !== re[re.length - 1]) {
        re.push(data[i]);
      }
    }
    return re;
  };
  // 根据下标删除
  var remove = function (data, idx) {
    if (data.length > idx) {
      data.splice(idx, 1);
    }
    return data;
  };
  return {
    ComNum: ComNum,
    ComVal: ComVal,
    unique: unique,
    uniquelize: uniquelize,
    intersect: intersect,
    complement: complement,
    remove: remove
  }
}();
// 压缩工具类
var LZMAUtils = function () {
  var toHex = function (byte_arr) {
    var hex_str = '', i, len, tmp_hex;
    len = byte_arr.length;
    for (i = 0; i < len; ++i) {
      if (byte_arr[i] < 0) {
        byte_arr[i] = byte_arr[i] + 256;
      }
      tmp_hex = byte_arr[i].toString(16);
      if (tmp_hex.length === 1) {
        tmp_hex = '0' + tmp_hex;
      }
      hex_str += tmp_hex;
    }
    return hex_str.trim();
  };
  return {
    toHex: toHex
  }
}();
// 彩票工具类
export let LotteryUtils = function () {
  var getCode = function (sysCode, sysPoint, point) {
    return parseInt(sysCode - (sysPoint - point) * 20);
  };
  var getPoint = function (sysCode, sysPoint, code) {
    return parseFloat(sysPoint - (sysCode - code) / 20).toFixed(1);
  };
  var getBonus = function (opts) {
    var bonus = opts.bonus;
    var unitMoney = opts.unitMoney;
    var modelMoney = opts.modelMoney;
    var code = opts.code;
    var bonusArray = bonus.split(',');
    var result = [];
    for (var i = 0; i < bonusArray.length; i++) {
      var tmpBonus = (code / Number(bonusArray[i])) * (unitMoney / 2) * modelMoney;
      result.push(tmpBonus);
    }
    result.sort(function (a, b) {
      return Number(a) > Number(b) ? 1 : -1;
    });
    return result;
  };
  return {
    getCode: getCode,
    getPoint: getPoint,
    getBonus: getBonus
  }
}();
// 时时彩工具类
var SscUtils = function () {
  // 输入框类型检测
  var _inputCheck_Num = function (datasel, l, fun, sort) {
    fun = $.isFunction(fun) ? fun : function (n, l) {
      return true;
    };
    var newsel = []; // 新的号码
    if (sort) { // 如果需要号码排序
      var sortsel = [];
      $.each(datasel, function (i, n) {
        sortsel.push(n.split('').sort().toString().replace(/,/g, ''));
      });
      datasel = sortsel;
    }
    datasel = ArrayUtils.unique(datasel); // 去除重复
    var regex = new RegExp('^[0-9]{' + l + '}$');
    $.each(datasel, function (i, n) {
      if (regex.test(n) && fun(n, l)) {
        newsel.push(n);
      }
    });
    return newsel;
  };
  // 和值检测
  var _HHZXCheck_Num = function (n, l) {
    var a = [];
    if (l == 2) {//两位
      a = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
    } else {//三位[默认]
      a = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
    }
    return $.inArray(n, a) == -1 ? true : false;
  };
  // 多少注计算
  var _inputNumbers = function (type, datasel) {
    var nums = 0, tmp_nums = 1;
    switch (type) {
      case 'rx3z3':
        var maxplace = 1;
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = datasel[1];
          var m = 3;
          // 任选3必须大于选了3位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              for (var i = 0; i < maxplace; i++) {
                var s = newsel.length;
                // 组三必须选两位或者以上
                if (s > 1) {
                  nums += s * (s - 1);
                }
              }
              nums *= h;
            }
          }
        }
        break;
      case 'rx3z6':
        var maxplace = 1;
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = datasel[1];
          var m = 3;
          // 任选3必须大于选了3位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              for (var i = 0; i < maxplace; i++) {
                var s = newsel.length;
                // 组六必须选三位或者以上
                if (s > 2) {
                  nums += s * (s - 1) * (s - 2) / 6;
                }
              }
              nums *= h;
            }
          }
        }
        break;
      case 'rx2zx':
        var maxplace = 1;
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = datasel[1];
          var m = 2;
          // 任选2必须大于选了2位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              for (var i = 0; i < maxplace; i++) {
                var s = newsel.length;
                // 二码不定位必须选两位或者以上
                if (s > 1) {
                  nums += s * (s - 1) / 2;
                }
              }
              nums *= h;
            }
          }
        }
        break;
      case 'rx2ds':
      case 'rx3ds':
      case 'rx4ds':
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = [];
          for (var i = 1; i < datasel.length; i++) {
            newsel.push(datasel[i]);
          }
          var m = 0;
          if (type == 'rx2ds') {
            m = 2;
          }
          if (type == 'rx3ds') {
            m = 3;
          }
          if (type == 'rx4ds') {
            m = 4;
          }
          // 任选2必须大于选了2位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              nums += _inputCheck_Num(newsel, m).length;
              nums *= h;
            }
          }
        }
        break;
      case 'rx3hh':
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = [];
          for (var i = 1; i < datasel.length; i++) {
            newsel.push(datasel[i]);
          }
          var m = 3;
          // 任选3必须大于选了3位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              nums = _inputCheck_Num(newsel, 3, _HHZXCheck_Num, true).length;
              nums *= h;
            }
          }
        }
        break;
      case 'wxzhixds':
        nums = _inputCheck_Num(datasel, 5).length;
        break;
      case 'sixzhixdsh':
      case 'sixzhixdsq':
        nums = _inputCheck_Num(datasel, 4).length;
        break;
      case 'sxzhixdsh':
      case 'sxzhixdsz':
      case 'sxzhixdsq':
        nums = _inputCheck_Num(datasel, 3).length;
        break;
      case 'sxhhzxh':
      case 'sxhhzxz':
      case 'sxhhzxq':
        nums = _inputCheck_Num(datasel, 3, _HHZXCheck_Num, true).length;
        break;
      case 'exzhixdsh':
      case 'exzhixdsq':
        nums = _inputCheck_Num(datasel, 2).length;
        break;
      case 'exzuxdsh':
      case 'exzuxdsq':
        nums = _inputCheck_Num(datasel, 2, _HHZXCheck_Num, true).length;
        break;
      case 'wxzux120':
        var s = datasel[0].length;
        if (s > 4) {
          nums += ArrayUtils.ComNum(s, 5);
        }
        break;
      case 'wxzux60':
      case 'wxzux30':
      case 'wxzux20':
      case 'wxzux10':
      case 'wxzux5':
        var minchosen = [];
        if (type == 'wxzux60') {
          minchosen = [1, 3];
        }
        if (type == 'wxzux30') {
          minchosen = [2, 1];
        }
        if (type == 'wxzux20') {
          minchosen = [1, 2];
        }
        if (type == 'wxzux10' || type == 'wxzux5') {
          minchosen = [1, 1];
        }
        if (datasel[0].length >= minchosen[0] && datasel[1].length >= minchosen[1]) {
          var h = ArrayUtils.intersect(datasel[0], datasel[1]).length;
          tmp_nums = ArrayUtils.ComNum(datasel[0].length, minchosen[0]) * ArrayUtils.ComNum(datasel[1].length, minchosen[1]);
          if (h > 0) {
            if (type == 'wxzux60') {
              tmp_nums -= ArrayUtils.ComNum(h, 1) * ArrayUtils.ComNum(datasel[1].length - 1, 2);
            }
            if (type == 'wxzux30') {
              tmp_nums -= ArrayUtils.ComNum(h, 2) * ArrayUtils.ComNum(2, 1);
              if (datasel[0].length - h > 0) {
                tmp_nums -= ArrayUtils.ComNum(h, 1) * ArrayUtils.ComNum(datasel[0].length - h, 1);
              }
            }
            if (type == 'wxzux20') {
              tmp_nums -= ArrayUtils.ComNum(h, 1) * ArrayUtils.ComNum(datasel[1].length - 1, 1);
            }
            if (type == 'wxzux10' || type == 'wxzux5') {
              tmp_nums -= ArrayUtils.ComNum(h, 1);
            }
          }
          nums += tmp_nums;
        }
        break;
      case 'wxbdw2m':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 二码不定位必须选两位或者以上
          if (s > 1) {
            nums += s * (s - 1) / 2;
          }
        }
        break;
      case 'wxbdw3m':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 组六必须选三位或者以上
          if (s > 2) {
            nums += s * (s - 1) * (s - 2) / 6;
          }
        }
        break;
      case 'sixzux24h':
      case 'sixzux24q':
        var s = datasel[0].length;
        if (s > 3) {
          nums += ArrayUtils.ComNum(s, 4);
        }
        break;
      case 'sixzux6h':
      case 'sixzux6q':
        var minchosen = [2];
        if (datasel[0].length >= minchosen[0]) {
          nums += ArrayUtils.ComNum(datasel[0].length, minchosen[0]);
        }
        break;
      case 'sixzux12h':
      case 'sixzux12q':
      case 'sixzux4h':
      case 'sixzux4q':
        var minchosen = [];
        if (type == 'sixzux12h' || type == 'sixzux12q') {
          minchosen = [1, 2];
        }
        if (type == 'sixzux4h' || type == 'sixzux4q') {
          minchosen = [1, 1];
        }
        if (datasel[0].length >= minchosen[0] && datasel[1].length >= minchosen[1]) {
          var h = ArrayUtils.intersect(datasel[0], datasel[1]).length;
          tmp_nums = ArrayUtils.ComNum(datasel[0].length, minchosen[0]) * ArrayUtils.ComNum(datasel[1].length, minchosen[1]);
          if (h > 0) {
            if (type == 'sixzux12h' || type == 'sixzux12q') {
              tmp_nums -= ArrayUtils.ComNum(h, 1) * ArrayUtils.ComNum(datasel[1].length - 1, 1);
            }
            if (type == 'sixzux4h' || type == 'sixzux4q') {
              tmp_nums -= ArrayUtils.ComNum(h, 1);
            }
          }
          nums += tmp_nums;
        }
        break;
      case 'sxzuxzsh':
      case 'sxzuxzsz':
      case 'sxzuxzsq':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 组三必须选两位或者以上
          if (s > 1) {
            nums += s * (s - 1);
          }
        }
        break;
      case 'sxzuxzlh':
      case 'sxzuxzlz':
      case 'sxzuxzlq':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 组六必须选三位或者以上
          if (s > 2) {
            nums += s * (s - 1) * (s - 2) / 6;
          }
        }
        break;
      case 'wxzhixzh':
      case 'sixzhixzhh':
      case 'sixzhixzhq':
        var maxplace = 0;
        if ('wxzhixzh' == type) {
          maxplace = 5;
        }
        if ('sixzhixzhh' == type || 'sixzhixzhq' == type) {
          maxplace = 4;
        }
        for (var i = 0; i < maxplace; i++) {
          // 有位置上没有选择
          if (datasel[i].length == 0) {
            tmp_nums = 0;
            break;
          }
          tmp_nums *= datasel[i].length;
        }
        nums += tmp_nums * maxplace;
        break;
      case 'sxzhixhzh':
      case 'sxzhixhzz':
      case 'sxzhixhzq':
      case 'exzhixhzh':
      case 'exzhixhzq':
        var cc = {
          0: 1,
          1: 3,
          2: 6,
          3: 10,
          4: 15,
          5: 21,
          6: 28,
          7: 36,
          8: 45,
          9: 55,
          10: 63,
          11: 69,
          12: 73,
          13: 75,
          14: 75,
          15: 73,
          16: 69,
          17: 63,
          18: 55,
          19: 45,
          20: 36,
          21: 28,
          22: 21,
          23: 15,
          24: 10,
          25: 6,
          26: 3,
          27: 1
        };
        if (type == 'exzhixhzh' || type == 'exzhixhzq') {
          cc = {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6,
            6: 7,
            7: 8,
            8: 9,
            9: 10,
            10: 9,
            11: 8,
            12: 7,
            13: 6,
            14: 5,
            15: 4,
            16: 3,
            17: 2,
            18: 1
          };
        }
        for (var i = 0; i < datasel[0].length; i++) {
          nums += cc[parseInt(datasel[0][i], 10)];
        }
        break;
      case 'rx2fs':
      case 'rx3fs':
      case 'rx4fs':
        var minplace = 0;
        if (type == 'rx2fs') {
          minplace = 2;
        }
        if (type == 'rx3fs') {
          minplace = 3;
        }
        if (type == 'rx4fs') {
          minplace = 4;
        }
        var newsel = [];
        for (var i = 0; i < datasel.length; i++) {
          if (datasel[i].length != 0) {
            newsel.push(datasel[i]);
          }
        }
        // 最少位数
        if (newsel.length >= minplace) {
          var l = ArrayUtils.ComNum(newsel.length, minplace);
          for (var i = 0; i < l; i++) {
            tmp_nums = 1;
            var data = ArrayUtils.ComVal(newsel, minplace, i);
            for (var j = 0; j < data.length; j++) {
              tmp_nums *= data[j].length;
            }
            nums += tmp_nums;
          }
        }
        break;
      case 'dw': //定位胆所有在一起特殊处理
        var maxplace = 5;
        for (var i = 0; i < maxplace; i++) {
          nums += datasel[i].length;
        }
        break;
      case 'bdw2mh':
      case 'bdw2mz':
      case 'bdw2mq':
      case 'exzuxfsh':
      case 'exzuxfsq':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 二码不定位必须选两位或者以上
          if (s > 1) {
            nums += s * (s - 1) / 2;
          }
        }
        break;
      case 'kdqs':
      case 'kdzs':
      case 'kdhs':
      case 'kdqe':
      case 'kdhe':
        var cc = {0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54};
        if (type == 'kdqe' || type == 'kdhe') {
          cc = {0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2};
        }
        for (var i = 0; i < datasel[0].length; i++) {
          nums += cc[parseInt(datasel[0][i], 10)];
        }
        break;
      default:
        var maxplace = 0;
        switch (type) {
          case 'wxzhixfs':
            maxplace = 5;
            break;
          case 'sixzhixfsh':
          case 'sixzhixfsq':
            maxplace = 4;
            break;
          case 'sxzhixfsh':
          case 'sxzhixfsz':
          case 'sxzhixfsq':
            maxplace = 3;
            break;
          case 'exzhixfsh':
          case 'exzhixfsq':
          case 'dxdsh':
          case 'dxdsq':
            maxplace = 2;
            break;
          case 'wxhzdxds':
          case 'wxbdw1m':
          case 'bdw1mh':
          case 'bdw1mz':
          case 'bdw1mq':
          case 'qwyffs':
          case 'qwhscs':
          case 'qwsxbx':
          case 'qwsjfc':
          case 'lhwq':
          case 'lhwb':
          case 'lhws':
          case 'lhwg':
          case 'lhqb':
          case 'lhqs':
          case 'lhqg':
          case 'lhbs':
          case 'lhbg':
          case 'lhsg':
            maxplace = 1;
            break;
        }
        if (datasel.length == maxplace) {
          for (var i = 0; i < maxplace; i++) {
            // 有位置上没有选择
            if (datasel[i].length == 0) {
              tmp_nums = 0;
              break;
            }
            tmp_nums *= datasel[i].length;
          }
          nums += tmp_nums;
        }
    }
    return nums;
  };
  var _formatSelect_Num = function (datasel, m, n) {
    var newsel = [];
    if (!m) m = 0;
    if (!n) n = 0;
    for (var i = 0; i < m; i++) {
      newsel.push('-');
    }
    for (var i = 0; i < datasel.length; i++) {
      var f = datasel[i].toString().replace(/,/g, '');
      if (f == '') {
        newsel.push('-');
      } else {
        newsel.push(f);
      }
    }
    for (var i = 0; i < n; i++) {
      newsel.push('-');
    }
    return newsel.toString();
  };
  var _formatTextarea_Num = function (type, datasel) {
    switch (type) {
      case 'wxzhixds':
        datasel = _inputCheck_Num(datasel, 5);
        break;
      case 'sixzhixdsh':
      case 'sixzhixdsq':
        datasel = _inputCheck_Num(datasel, 4);
        break;
      case 'sxzhixdsh':
      case 'sxzhixdsz':
      case 'sxzhixdsq':
        datasel = _inputCheck_Num(datasel, 3);
        break;
      case 'sxhhzxh':
      case 'sxhhzxz':
      case 'sxhhzxq':
        datasel = _inputCheck_Num(datasel, 3, _HHZXCheck_Num, true);
        break;
      case 'exzhixdsh':
      case 'exzhixdsq':
        datasel = _inputCheck_Num(datasel, 2);
        break;
      case 'exzuxdsh':
      case 'exzuxdsq':
        datasel = _inputCheck_Num(datasel, 2, _HHZXCheck_Num, true);
        break;
      case 'rx2ds':
      case 'rx3ds':
      case 'rx4ds':
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = [];
          for (var i = 1; i < datasel.length; i++) {
            newsel.push(datasel[i]);
          }
          var m = 0;
          if (type == 'rx2ds') {
            m = 2;
          }
          if (type == 'rx3ds') {
            m = 3;
          }
          if (type == 'rx4ds') {
            m = 4;
          }
          // 任选2必须大于选了2位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              return '[' + datasel[0] + ']' + _inputCheck_Num(newsel, m);
            }
          }
        }
        break;
      case 'rx3hh':
        if (datasel.length > 1) {
          var place = 0;
          for (var i = 0; i < datasel[0].length; i++) {
            if (datasel[0][i] == '√') place++;
          }
          var newsel = [];
          for (var i = 1; i < datasel.length; i++) {
            newsel.push(datasel[i]);
          }
          var m = 3;
          // 任选3必须大于选了3位以上才能组成组合
          if (place >= m) {
            var h = ArrayUtils.ComNum(place, m);
            if (h > 0) {// 组合数必须大于0
              return '[' + datasel[0] + ']' + _inputCheck_Num(newsel, 3, _HHZXCheck_Num, true);
            }
          }
        }
        break;
      default:
        break;
    }
    return datasel.toString().replace(/,/g, ' ');
  };
  var _inputFormat = function (type, datasel) {
    switch (type) {
      case 'wxzhixds':
      case 'sixzhixdsh':
      case 'sixzhixdsq':
      case 'sxzhixdsh':
      case 'sxzhixdsz':
      case 'sxzhixdsq':
      case 'sxhhzxh':
      case 'sxhhzxz':
      case 'sxhhzxq':
      case 'exzhixdsh':
      case 'exzhixdsq':
      case 'exzuxdsh':
      case 'exzuxdsq':
      case 'rx2ds':
      case 'rx3ds':
      case 'rx3hh':
      case 'rx4ds':
        return _formatTextarea_Num(type, datasel);
      case 'rx3z3':
      case 'rx3z6':
      case 'rx2zx':
        var space = datasel[0];
        return '[' + space + ']' + ArrayUtils.remove(datasel, 0).toString();
      case 'wxzux120':
      case 'wxbdw1m':
      case 'wxbdw2m':
      case 'wxbdw3m':
      case 'sixzux24h':
      case 'sixzux24q':
      case 'sixzux6h':
      case 'sixzux6q':
      case 'sxzuxzsh':
      case 'sxzuxzsz':
      case 'sxzuxzsq':
      case 'sxzuxzlh':
      case 'sxzuxzlz':
      case 'sxzuxzlq':
      case 'exzuxfsh':
      case 'exzuxfsq':
      case 'bdw1mh':
      case 'bdw1mz':
      case 'bdw1mq':
      case 'bdw2mh':
      case 'bdw2mz':
      case 'bdw2mq':
      case 'qwyffs':
      case 'qwhscs':
      case 'qwsxbx':
      case 'qwsjfc':
      case 'sxzhixhzh':
      case 'sxzhixhzz':
      case 'sxzhixhzq':
      case 'exzhixhzh':
      case 'exzhixhzq':
      case 'kdqs':
      case 'kdzs':
      case 'kdhs':
      case 'kdqe':
      case 'kdhe':
        return datasel.toString();
      case 'wxhzdxds':
      case 'lhwq':
      case 'lhwb':
      case 'lhws':
      case 'lhwg':
      case 'lhqb':
      case 'lhqs':
      case 'lhqg':
      case 'lhbs':
      case 'lhbg':
      case 'lhsg':
        return datasel[0].toString().replace(/,/g, '|');
      case 'sixzhixfsh':
      case 'sixzhixzhh':
        return _formatSelect_Num(datasel, 1);
      case 'sixzhixfsq':
      case 'sixzhixzhq':
        return _formatSelect_Num(datasel, 0, 1);
      case 'sxzhixfsh':
        return _formatSelect_Num(datasel, 2);
      case 'sxzhixfsz':
        return _formatSelect_Num(datasel, 1, 1);
      case 'sxzhixfsq':
        return _formatSelect_Num(datasel, 0, 2);
      case 'exzhixfsh':
        return _formatSelect_Num(datasel, 3);
      case 'exzhixfsq':
        return _formatSelect_Num(datasel, 0, 3);
      default:
        return _formatSelect_Num(datasel);
    }
  };
  return {
    inputNumbers: _inputNumbers,
    inputFormat: _inputFormat
  }
}();
// 11选五工具类
var X511Utils = function () {
  // 输入框类型检测
  var _inputCheck_Num = function (datasel, l, fun) {
    fun = $.isFunction(fun) ? fun : function (n, l) {
      return true;
    };
    var newsel = []; // 新的号码
    datasel = ArrayUtils.unique(datasel); // 去除重复
    var regex = new RegExp('^([0-9]{2}\\s{1}){' + (l - 1) + '}[0-9]{2}$');
    $.each(datasel, function (i, n) {
      if (regex.test(n) && fun(n, l)) {
        newsel.push(n);
      }
    });
    return newsel;
  };
  // 输入框号码检测
  var _numberCheck_Num = function (n) {
    var t = n.split(' ');
    var l = t.length;
    for (var i = 0; i < l; i++) {
      if (Number(t[i]) > 11 || Number(t[i]) < 1) {
        return false;
      }
      for (var j = i + 1; j < l; j++) {
        if (Number(t[i]) == Number(t[j])) {
          return false;
        }
      }
    }
    return true;
  };
  //多少注计算
  var _inputNumbers = function (type, datasel) {
    var nums = 0;
    switch (type) {
      // 这里验证输入框类型
      case 'sanmzhixdsq':
      case 'sanmzuxdsq':
        return _inputCheck_Num(datasel, 3, _numberCheck_Num).length;
      case 'ermzhixdsq':
      case 'ermzuxdsq':
        return _inputCheck_Num(datasel, 2, _numberCheck_Num).length;
      case 'rx1ds':
        return _inputCheck_Num(datasel, 1, _numberCheck_Num).length;
      case 'rx2ds':
        return _inputCheck_Num(datasel, 2, _numberCheck_Num).length;
      case 'rx3ds':
        return _inputCheck_Num(datasel, 3, _numberCheck_Num).length;
      case 'rx4ds':
        return _inputCheck_Num(datasel, 4, _numberCheck_Num).length;
      case 'rx5ds':
        return _inputCheck_Num(datasel, 5, _numberCheck_Num).length;
      case 'rx6ds':
        return _inputCheck_Num(datasel, 6, _numberCheck_Num).length;
      case 'rx7ds':
        return _inputCheck_Num(datasel, 7, _numberCheck_Num).length;
      case 'rx8ds':
        return _inputCheck_Num(datasel, 8, _numberCheck_Num).length;
      // 这里验证选号类型
      case 'sanmzhixfsq':
        if (datasel[0].length > 0 && datasel[1].length > 0 && datasel[2].length > 0) {
          for (var i = 0; i < datasel[0].length; i++) {
            for (var j = 0; j < datasel[1].length; j++) {
              for (var k = 0; k < datasel[2].length; k++) {
                if (datasel[0][i] != datasel[1][j] && datasel[0][i] != datasel[2][k] && datasel[1][j] != datasel[2][k]) {
                  nums++;
                }
              }
            }
          }
        }
        break;
      case 'sanmzuxfsq':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 2) {
            nums += s * (s - 1) * (s - 2) / 6;
          }
        }
        break;
      case 'ermzhixfsq':
        if (datasel[0].length > 0 && datasel[1].length > 0) {
          for (var i = 0; i < datasel[0].length; i++) {
            for (var j = 0; j < datasel[1].length; j++) {
              if (datasel[0][i] != datasel[1][j]) {
                nums++;
              }
            }
          }
        }
        break;
      case 'ermzuxfsq':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 1) {
            nums += s * (s - 1) / 2;
          }
        }
        break;
      case 'bdw':
      case 'dwd':
      case 'dds':
      case 'czw':
      case 'rx1fs': // 任选1中1
        var maxplace = 0;
        if ('bdw' == type || 'dds' == type || 'czw' == type || 'rx1fs' == type) {
          maxplace = 1;
        }
        if ('dwd' == type) {
          maxplace = 3;
        }
        for (var i = 0; i < maxplace; i++) {
          nums += datasel[i].length;
        }
        break;
      case 'rx2fs': // 任选2中2
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 1) {
            nums += s * (s - 1) / 2;
          }
        }
        break;
      case 'rx3fs': // 任选3中3
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 2) {
            nums += s * (s - 1) * (s - 2) / 6;
          }
        }
        break;
      case 'rx4fs': // 任选4中4
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 3) {
            nums += s * (s - 1) * (s - 2) * (s - 3) / 24;
          }
        }
        break;
      case 'rx5fs': // 任选5中5
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 4) {
            nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) / 120;
          }
        }
        break;
      case 'rx6fs': // 任选6中6
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 5) {
            nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) * (s - 5) / 720;
          }
        }
        break;
      case 'rx7fs': // 任选7中7
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 6) {
            nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) * (s - 5) * (s - 6) / 5040;
          }
        }
        break;
      case 'rx8fs': // 任选8中8
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          if (s > 7) {
            nums += s * (s - 1) * (s - 2) * (s - 3) * (s - 4) * (s - 5) * (s - 6) * (s - 7) / 40320;
          }
        }
        break;
      default:
        break;
    }
    return nums;
  };
  var _formatSelect_Num = function (datasel, m, n) {
    var newsel = [];
    if (!m) m = 0;
    if (!n) n = 0;
    for (var i = 0; i < m; i++) {
      newsel.push('-');
    }
    for (var i = 0; i < datasel.length; i++) {
      var f = datasel[i].toString().replace(/,/g, ' ');
      if (f == '') {
        newsel.push('-');
      } else {
        newsel.push(f);
      }
    }
    for (var i = 0; i < n; i++) {
      newsel.push('-');
    }
    return newsel.toString();
  };
  var _formatTextarea_Num = function (type, datasel) {
    switch (type) {
      case 'sanmzhixdsq':
      case 'sanmzuxdsq':
        datasel = _inputCheck_Num(datasel, 3, _numberCheck_Num);
        break;
      case 'ermzhixdsq':
      case 'ermzuxdsq':
        datasel = _inputCheck_Num(datasel, 2, _numberCheck_Num);
        break;
      case 'rx1ds':
        datasel = _inputCheck_Num(datasel, 1, _numberCheck_Num);
        break;
      case 'rx2ds':
        datasel = _inputCheck_Num(datasel, 2, _numberCheck_Num);
        break;
      case 'rx3ds':
        datasel = _inputCheck_Num(datasel, 3, _numberCheck_Num);
        break;
      case 'rx4ds':
        datasel = _inputCheck_Num(datasel, 4, _numberCheck_Num);
        break;
      case 'rx5ds':
        datasel = _inputCheck_Num(datasel, 5, _numberCheck_Num);
        break;
      case 'rx6ds':
        datasel = _inputCheck_Num(datasel, 6, _numberCheck_Num);
        break;
      case 'rx7ds':
        datasel = _inputCheck_Num(datasel, 7, _numberCheck_Num);
        break;
      case 'rx8ds':
        datasel = _inputCheck_Num(datasel, 8, _numberCheck_Num);
        break;
      default:
        break;
    }
    return datasel.toString().replace(/,/g, ';');
  };
  var _inputFormat = function (type, datasel) {
    switch (type) {
      case 'sanmzhixfsq':
      case 'dwd':
        return _formatSelect_Num(datasel, 0, 2);
      case 'ermzhixfsq':
        return _formatSelect_Num(datasel, 0, 3);
      case 'sanmzuxfsq':
      case 'ermzuxfsq':
      case 'bdw':
      case 'rx1fs':
      case 'rx2fs':
      case 'rx3fs':
      case 'rx4fs':
      case 'rx5fs':
      case 'rx6fs':
      case 'rx7fs':
      case 'rx8fs':
        return datasel[0].toString();
      case 'sanmzhixdsq':
      case 'sanmzuxdsq':
      case 'ermzhixdsq':
      case 'ermzuxdsq':
      case 'rx1ds':
      case 'rx2ds':
      case 'rx3ds':
      case 'rx4ds':
      case 'rx5ds':
      case 'rx6ds':
      case 'rx7ds':
      case 'rx8ds':
        return _formatTextarea_Num(type, datasel);
      case 'dds':
        return datasel[0].toString().replace(/,/g, '|');
      case 'czw':
        return datasel[0].toString();
      default:
        break;
    }
  };
  return {
    inputNumbers: _inputNumbers,
    inputFormat: _inputFormat
  }
}();
// 快三工具类
var K3Utils = function () {
  // 输入框类型检测
  var _inputCheck_Num = function (datasel, l, fun) {
    fun = $.isFunction(fun) ? fun : function (n, l) {
      return true;
    };
    var newsel = []; // 新的号码
    datasel = ArrayUtils.unique(datasel); // 去除重复
    var regex = new RegExp('^[0-6]{' + l + '}$');
    $.each(datasel, function (i, n) {
      if (regex.test(n) && fun(n, l)) {
        newsel.push(n);
      }
    });
    return newsel;
  };
  // 2排不重复检测
  var _uniqueCheck = function (a, b) {
    return ArrayUtils.intersect(a, b).length == 0 ? true : false;
  };
  // 二同号单式
  var _ethdsCheck = function (n, l) {
    if (l != 3) return false;
    var first = n.substring(0, 1);
    var second = n.substring(1, 2);
    var third = n.substring(2, 3);
    if (first == second && second == third) return false;
    if (first == second || second == third || third == first) return true;
    return false;
  };
  // 二不同号单式
  var _ebthdsCheck = function (n, l) {
    if (l != 2) return false;
    var first = n.substring(0, 1);
    var second = n.substring(1, 2);
    if (first == second) return false;
    return true;
  };
  // 三不同号单式
  var _sbthdsCheck = function (n, l) {
    if (l != 3) return false;
    var first = n.substring(0, 1);
    var second = n.substring(1, 2);
    var third = n.substring(2, 3);
    if (first != second && second != third && third != first) return true;
    return false;
  };
  // 多少注计算
  var _inputNumbers = function (type, datasel) {
    var nums = 0;
    // 输入号
    switch (type) {
      case 'ebthds':
        return _inputCheck_Num(datasel, 2, _ebthdsCheck).length;
      case 'ethds':
        return _inputCheck_Num(datasel, 3, _ethdsCheck).length;
      case 'sbthds':
        return _inputCheck_Num(datasel, 3, _sbthdsCheck).length;
      // 选号
      case 'ebthdx': // 二不同号，标准选号
        if (datasel[0].length >= 2) {
          nums += ArrayUtils.ComNum(datasel[0].length, 2);
        }
        break;
      case 'ebthdt':
        var maxplace = 2;
        if (datasel.length == maxplace) {
          if (_uniqueCheck(datasel[0], datasel[1])) {
            for (var i = 0; i < maxplace; i++) {
              var s = datasel[i].length;
              if (s > 0) {
                if (i > 0) {
                  nums = datasel[i].length;
                }
              } else {
                nums = 0;
                break;
              }
            }
          }
        }
        break;
      case 'ethdx':
        var s = datasel.length;
        if (s > 1) {
          var a = datasel[0].length;
          var b = datasel[1].length;
          if (a > 0 && b > 0) {
            if (_uniqueCheck(datasel[0], datasel[1])) {
              nums = a * b;
            }
          }
        }
        break;
      case 'ethfx':
        nums = datasel[0].length;
        break;
      case 'sbthdx': // 三不同号单选
        if (datasel[0].length >= 3) {
          nums += ArrayUtils.ComNum(datasel[0].length, 3);
        }
        break;
      case 'sthdx': // 三同号单选
      case 'hezhi': // 和值
        nums = datasel[0].length;
        break;
      case 'sthtx': // 三同号通选
      case 'slhtx': // 三连号通选
        nums = datasel[0].length > 0 ? 1 : 0;
        break;
      default:
        break;
    }
    return nums;
  };
  var _formatSelect_Num = function (datasel, m, n) {
    var newsel = [];
    if (!m) m = 0;
    if (!n) n = 0;
    for (var i = 0; i < m; i++) {
      newsel.push('-');
    }
    for (var i = 0; i < datasel.length; i++) {
      var f = datasel[i].toString().replace(/,/g, '');
      if (f == '') {
        newsel.push('-');
      } else {
        newsel.push(f);
      }
    }
    for (var i = 0; i < n; i++) {
      newsel.push('-');
    }
    return newsel.toString();
  };
  var _formatTextarea_Num = function (type, datasel) {
    switch (type) {
      case 'ebthds':
        datasel = _inputCheck_Num(datasel, 2, _ebthdsCheck);
        break;
      case 'ethds':
        datasel = _inputCheck_Num(datasel, 3, _ethdsCheck);
        break;
      case 'sbthds':
        datasel = _inputCheck_Num(datasel, 3, _sbthdsCheck);
        break;
      default:
        break;
    }
    return datasel.toString().replace(/,/g, ' ');
  };
  var _inputFormat = function (type, datasel) {
    switch (type) {
      case 'ebthds':
      case 'ethds':
      case 'sbthds':
        return _formatTextarea_Num(type, datasel);
      case 'ebthdx':
      case 'ethfx':
      case 'sbthdx':
      case 'sthdx':
      case 'sthtx':
      case 'slhtx':
      case 'hezhi':
        return datasel[0].toString();
      case 'ebthdt':
      case 'ethdx':
        return _formatSelect_Num(datasel);
      default:
        break;
    }
  };
  return {
    inputNumbers: _inputNumbers,
    inputFormat: _inputFormat
  }
}();
// 3D系列工具类
var D3Utils = function () {
  // 输入框类型检测
  var _inputCheck_Num = function (datasel, l, fun, sort) {
    fun = $.isFunction(fun) ? fun : function (n, l) {
      return true;
    };
    var newsel = []; // 新的号码
    if (sort) { // 如果需要号码排序
      var sortsel = [];
      $.each(datasel, function (i, n) {
        sortsel.push(n.split('').sort().toString().replace(/,/g, ''));
      });
      datasel = sortsel;
    }
    datasel = ArrayUtils.unique(datasel); // 去除重复
    var regex = new RegExp('^[0-9]{' + l + '}$');
    $.each(datasel, function (i, n) {
      if (regex.test(n) && fun(n, l)) {
        newsel.push(n);
      }
    });
    return newsel;
  };
  // 和值检测
  var _HHZXCheck_Num = function (n, l) {
    var a = [];
    if (l == 2) {//两位
      a = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
    } else {//三位[默认]
      a = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
    }
    return $.inArray(n, a) == -1 ? true : false;
  };
  // 多少注计算
  var _inputNumbers = function (type, datasel) {
    var nums = 0, tmp_nums = 1;
    // 输入号
    switch (type) {
      case 'sanxzhixds':
        nums = _inputCheck_Num(datasel, 3).length;
        break;
      case 'sanxhhzx':
        nums = _inputCheck_Num(datasel, 3, _HHZXCheck_Num, true).length;
        break;
      case 'exzhixdsh':
      case 'exzhixdsq':
        nums = _inputCheck_Num(datasel, 2).length;
        break;
      case 'exzuxdsh':
      case 'exzuxdsq':
        nums = _inputCheck_Num(datasel, 2, _HHZXCheck_Num, true).length;
        break;
      case 'sanxzs':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 组三必须选两位或者以上
          if (s > 1) {
            nums += s * (s - 1);
          }
        }
        break;
      case 'sanxzl':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 组六必须选三位或者以上
          if (s > 2) {
            nums += s * (s - 1) * (s - 2) / 6;
          }
        }
        break;
      case 'sanxzhixhz':
      case 'exzhixhzh':
      case 'exzhixhzq':
        var cc = {
          0: 1,
          1: 3,
          2: 6,
          3: 10,
          4: 15,
          5: 21,
          6: 28,
          7: 36,
          8: 45,
          9: 55,
          10: 63,
          11: 69,
          12: 73,
          13: 75,
          14: 75,
          15: 73,
          16: 69,
          17: 63,
          18: 55,
          19: 45,
          20: 36,
          21: 28,
          22: 21,
          23: 15,
          24: 10,
          25: 6,
          26: 3,
          27: 1
        };
        if (type == 'exzhixhzh' || type == 'exzhixhzq') {
          cc = {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6,
            6: 7,
            7: 8,
            8: 9,
            9: 10,
            10: 9,
            11: 8,
            12: 7,
            13: 6,
            14: 5,
            15: 4,
            16: 3,
            17: 2,
            18: 1
          };
        }
        for (var i = 0; i < datasel[0].length; i++) {
          nums += cc[parseInt(datasel[0][i], 10)];
        }
        break;
      case 'dwd': //定位胆所有在一起特殊处理
        var maxplace = 3;
        for (var i = 0; i < maxplace; i++) {
          nums += datasel[i].length;
        }
        break;
      case 'exzuxfsh':
      case 'exzuxfsq':
        var maxplace = 1;
        for (var i = 0; i < maxplace; i++) {
          var s = datasel[i].length;
          // 二码不定位必须选两位或者以上
          if (s > 1) {
            nums += s * (s - 1) / 2;
          }
        }
        break;
      default:
        var maxplace = 0;
        switch (type) {
          case "sanxzhixfs":
            maxplace = 3;
            break;
          case "exzhixfsh":
          case "exzhixfsq":
            maxplace = 2;
            break;
          case "yimabdw":
            maxplace = 1;
            break;
        }
        if (datasel.length == maxplace) {
          for (var i = 0; i < maxplace; i++) {
            // 有位置上没有选择
            if (datasel[i].length == 0) {
              tmp_nums = 0;
              break;
            }
            tmp_nums *= datasel[i].length;
          }
          nums += tmp_nums;
        }
    }
    return nums;
  };
  var _formatSelect_Num = function (datasel, m, n) {
    var newsel = [];
    if (!m) m = 0;
    if (!n) n = 0;
    for (var i = 0; i < m; i++) {
      newsel.push('-');
    }
    for (var i = 0; i < datasel.length; i++) {
      var f = datasel[i].toString().replace(/,/g, '');
      if (f == '') {
        newsel.push('-');
      } else {
        newsel.push(f);
      }
    }
    for (var i = 0; i < n; i++) {
      newsel.push('-');
    }
    return newsel.toString();
  };
  var _formatTextarea_Num = function (type, datasel) {
    switch (type) {
      case 'sanxzhixds':
        datasel = _inputCheck_Num(datasel, 3);
        break;
      case 'sanxhhzx':
        datasel = _inputCheck_Num(datasel, 3, _HHZXCheck_Num, true);
        break;
      case 'exzhixdsh':
      case 'exzhixdsq':
        datasel = _inputCheck_Num(datasel, 2);
        break;
      case 'exzuxdsh':
      case 'exzuxdsq':
        datasel = _inputCheck_Num(datasel, 2, _HHZXCheck_Num, true);
        break;
      default:
        break;
    }
    return datasel.toString().replace(/,/g, ' ');
  };
  var _inputFormat = function (type, datasel) {
    switch (type) {
      case 'sanxzhixds':
      case 'sanxhhzx':
      case 'exzhixdsh':
      case 'exzhixdsq':
      case 'exzuxdsh':
      case 'exzuxdsq':
        return _formatTextarea_Num(type, datasel);
      case 'sanxzs':
      case 'sanxzl':
      case 'exzuxfsh':
      case 'exzuxfsq':
      case 'yimabdw':
      case 'sanxzhixhz':
      case 'exzhixhzh':
      case 'exzhixhzq':
        return datasel.toString();
      case 'sanxzhixfs':
        return _formatSelect_Num(datasel);
      case 'exzhixfsh':
        return _formatSelect_Num(datasel, 1);
      case 'exzhixfsq':
        return _formatSelect_Num(datasel, 0, 1);
      default:
        return _formatSelect_Num(datasel);
    }
  };
  return {
    inputNumbers: _inputNumbers,
    inputFormat: _inputFormat
  }
}();
// 快乐8工具类
var Kl8Utils = function () {
  // 多少注计算
  var _inputNumbers = function (type, datasel) {
    var nums = 0, tmp_nums = 1;
    // 选号
    switch (type) {
      case 'rx1':
        nums = datasel[0].length + (datasel[1]).length;
        break;
      case 'rx2':
        var l = datasel[0].length + (datasel[1]).length;
        if (l >= 2 && l <= 8) {
          nums = ArrayUtils.ComNum(l, 2);
        }
        break;
      case 'rx3':
        var l = datasel[0].length + (datasel[1]).length;
        if (l >= 3 && l <= 8) {
          nums = ArrayUtils.ComNum(l, 3);
        }
        break;
      case 'rx4':
        var l = datasel[0].length + (datasel[1]).length;
        if (l >= 4 && l <= 8) {
          nums = ArrayUtils.ComNum(l, 4);
        }
        break;
      case 'rx5':
        var l = datasel[0].length + (datasel[1]).length;
        if (l >= 5 && l <= 8) {
          nums = ArrayUtils.ComNum(l, 5);
        }
        break;
      case 'rx6':
        var l = datasel[0].length + (datasel[1]).length;
        if (l >= 6 && l <= 8) {
          nums = ArrayUtils.ComNum(l, 6);
        }
        break;
      case 'rx7':
        var l = datasel[0].length + (datasel[1]).length;
        if (l >= 7 && l <= 8) {
          nums = ArrayUtils.ComNum(l, 7);
        }
        break;
      default:
        var maxplace = 0;
        switch (type) {
          case 'hezhids':
          case 'hezhidx':
          case 'jopan':
          case 'sxpan':
          case 'hzdxds':
          case 'hezhiwx':
            maxplace = 1;
            break;
        }
        if (datasel.length == maxplace) {
          for (var i = 0; i < maxplace; i++) {
            // 有位置上没有选择
            if (datasel[i].length == 0) {
              tmp_nums = 0;
              break;
            }
            tmp_nums *= datasel[i].length;
          }
          nums += tmp_nums;
        }
    }
    return nums;
  };
  var _inputFormat = function (type, datasel) {
    switch (type) {
      case 'rx1':
      case 'rx2':
      case 'rx3':
      case 'rx4':
      case 'rx5':
      case 'rx6':
      case 'rx7':
        return datasel[0].concat(datasel[1]).toString();
      case 'hezhids':
      case 'hezhidx':
      case 'jopan':
      case 'sxpan':
      case 'hzdxds':
      case 'hezhiwx':
        return datasel[0].toString().replace(/,/g, '|');
      default:
        break;
    }
  };
  return {
    inputNumbers: _inputNumbers,
    inputFormat: _inputFormat
  }
}();
// PK拾工具类
var PK10Utils = function () {
  // 输入框类型检测
  var _inputCheck_Num = function (datasel, l, fun) {
    fun = $.isFunction(fun) ? fun : function (n, l) {
      return true;
    }
    var newsel = []; // 新的号码
    datasel = ArrayUtils.unique(datasel); // 去除重复
    var regex = new RegExp('^([0-9]{2}\\s{1}){' + (l - 1) + '}[0-9]{2}$');
    $.each(datasel, function (i, n) {
      if (regex.test(n) && fun(n, l)) {
        newsel.push(n);
      }
    });
    return newsel;
  };
  // 号码检测
  var _numberCheck_Num = function (n) {
    var t = n.split(' ');
    var l = t.length;
    for (var i = 0; i < l; i++) {
      if (Number(t[i]) > 10 || Number(t[i]) < 1) {
        return false;
      }
      for (var j = i + 1; j < l; j++) {
        if (Number(t[i]) == Number(t[j])) {
          return false;
        }
      }
    }
    return true;
  };
  // 检查号码是否不重复
  var _numberCheck_NoRepeat = function(array) {
    var oldLength = array.length;
    var newLength = ArrayUtils.uniquelize(array).length;
    return oldLength == newLength;
  }
  // 多少注计算
  var _inputNumbers = function (type, datasel) {
    var nums = 0, tmp_nums = 1;
    // 输入号
    switch (type) {
      case 'qianerzxds':
        return _inputCheck_Num(datasel, 2, _numberCheck_Num).length;
      case 'qiansanzxds':
        return _inputCheck_Num(datasel, 3, _numberCheck_Num).length;
      case 'qiansizxds':
        return _inputCheck_Num(datasel, 4, _numberCheck_Num).length;
      case 'qianwuzxds':
        return _inputCheck_Num(datasel, 5, _numberCheck_Num).length;
      // 选号
      case 'qianwuzxfs':
        if (datasel[0].length > 0 && datasel[1].length > 0 && datasel[2].length > 0 && datasel[3].length > 0 && datasel[4].length > 0) {
          for (var i = 0; i < datasel[0].length; i++) {
            for (var j = 0; j < datasel[1].length; j++) {
              for (var k = 0; k < datasel[2].length; k++) {
                for (var l = 0; l < datasel[3].length; l++) {
                  for (var m = 0; m < datasel[4].length; m++) {
                    if (_numberCheck_NoRepeat([datasel[0][i], datasel[1][j], datasel[2][k], datasel[3][l], datasel[4][m]])) {
                      nums++;
                    }
                  }
                }
              }
            }
          }
        }
        break;
      case 'qiansizxfs':
        if (datasel[0].length > 0 && datasel[1].length > 0 && datasel[2].length > 0 && datasel[3].length > 0) {
          for (var i = 0; i < datasel[0].length; i++) {
            for (var j = 0; j < datasel[1].length; j++) {
              for (var k = 0; k < datasel[2].length; k++) {
                for (var l = 0; l < datasel[3].length; l++) {
                  if (_numberCheck_NoRepeat([datasel[0][i], datasel[1][j], datasel[2][k], datasel[3][l]])) {
                    nums++;
                  }
                }
              }
            }
          }
        }
        break;
      case 'qiansanzxfs':
        if (datasel[0].length > 0 && datasel[1].length > 0 && datasel[2].length > 0) {
          for (var i = 0; i < datasel[0].length; i++) {
            for (var j = 0; j < datasel[1].length; j++) {
              for (var k = 0; k < datasel[2].length; k++) {
                if (_numberCheck_NoRepeat([datasel[0][i], datasel[1][j], datasel[2][k]])) {
                  nums++;
                }
              }
            }
          }
        }
        break;
      case 'qianerzxfs':
        if (datasel[0].length > 0 && datasel[1].length > 0) {
          for (var i = 0; i < datasel[0].length; i++) {
            for (var j = 0; j < datasel[1].length; j++) {
              if (_numberCheck_NoRepeat([datasel[0][i], datasel[1][j]])) {
                nums++;
              }
            }
          }
        }
        break;
      case 'qianerhz':
      case 'qiansanhz':
        var cc = {
          6: 6,
          7: 6,
          8: 12,
          9: 18,
          10: 24,
          11: 30,
          12: 42,
          13: 48,
          14: 54,
          15: 60,
          16: 60,
          17: 60,
          18: 60,
          19: 54,
          20: 48,
          21: 42,
          22: 30,
          23: 24,
          24: 18,
          25: 12,
          26: 6,
          27: 6
        };
        if (type == 'qianerhz') {
          var cc = {
            3: 2,
            4: 2,
            5: 4,
            6: 4,
            7: 6,
            8: 6,
            9: 8,
            10: 8,
            11: 10,
            12: 8,
            13: 8,
            14: 6,
            15: 6,
            16: 4,
            17: 4,
            18: 2,
            19: 2
          };
        }
        for (var i = 0; i < datasel[0].length; i++) {
          nums += cc[parseInt(datasel[0][i], 10)];
        }
        break;
      case 'dingweidan':
        var maxplace = 3;
        for (var i = 0; i < maxplace; i++) {
          nums += datasel[i].length;
        }
        break;
      case 'dwqian':
      case 'dwhou':
        var maxplace = 5;
        for (var i = 0; i < maxplace; i++) {
          nums += datasel[i].length;
        }
        break;
      default:
        var maxplace = 0;
        switch (type) {
          case 'qianyi':
          case 'qianerhz':
          case 'qiansanhz':
          case 'dxd1':
          case 'dxd2':
          case 'dxd3':
          case 'dxd4':
          case 'dxd5':
          case 'dxd6':
          case 'dxd7':
          case 'dxd8':
          case 'dxd9':
          case 'dxd10':
          case 'dsd1':
          case 'dsd2':
          case 'dsd3':
          case 'dsd4':
          case 'dsd5':
          case 'dsd6':
          case 'dsd7':
          case 'dsd8':
          case 'dsd9':
          case 'dsd10':
          case 'lhd1':
          case 'lhd2':
          case 'lhd3':
          case 'lhd4':
          case 'lhd5':
            maxplace = 1;
            break;
        }
        if (datasel.length == maxplace) {
          for (var i = 0; i < maxplace; i++) {
            // 有位置上没有选择
            if (datasel[i].length == 0) {
              tmp_nums = 0;
              break;
            }
            tmp_nums *= datasel[i].length;
          }
          nums += tmp_nums;
        }
    }
    return nums;
  };
  var _formatSelect_Num = function (datasel, m, n) {
    var newsel = [];
    if (!m) m = 0;
    if (!n) n = 0;
    for (var i = 0; i < m; i++) {
      newsel.push('-');
    }
    for (var i = 0; i < datasel.length; i++) {
      var f = datasel[i].toString().replace(/,/g, ' ');
      if (f == '') {
        newsel.push('-');
      } else {
        newsel.push(f);
      }
    }
    for (var i = 0; i < n; i++) {
      newsel.push('-');
    }
    return newsel.toString();
  };
  var _formatTextarea_Num = function (type, datasel) {
    switch (type) {
      case 'qianerzxds':
        datasel = _inputCheck_Num(datasel, 2, _numberCheck_Num);
        break;
      case 'qiansanzxds':
        datasel = _inputCheck_Num(datasel, 3, _numberCheck_Num);
        break;
      case 'qiansizxds':
        datasel = _inputCheck_Num(datasel, 4, _numberCheck_Num);
        break;
      case 'qianwuzxds':
        datasel = _inputCheck_Num(datasel, 5, _numberCheck_Num);
        break;
      default:
        break;
    }
    return datasel.toString().replace(/,/g, ';');
  };
  var _inputFormat = function (type, datasel) {
    switch (type) {
      case 'qianyi':
      case 'qianerhz':
      case 'qiansanhz':
        return datasel[0].toString();
      case 'qianerzxfs':
      case 'qiansanzxfs':
      case 'qiansizxfs':
      case 'qianwuzxfs':
      case 'dingweidan':
      case 'dwqian':
      case 'dwhou':
        return _formatSelect_Num(datasel);
      case 'qianerzxds':
      case 'qiansanzxds':
      case 'qiansizxds':
      case 'qianwuzxds':
        return _formatTextarea_Num(type, datasel);
      case 'dxd1':
      case 'dxd2':
      case 'dxd3':
      case 'dxd4':
      case 'dxd5':
      case 'dxd6':
      case 'dxd7':
      case 'dxd8':
      case 'dxd9':
      case 'dxd10':
      case 'dsd1':
      case 'dsd2':
      case 'dsd3':
      case 'dsd4':
      case 'dsd5':
      case 'dsd6':
      case 'dsd7':
      case 'dsd8':
      case 'dsd9':
      case 'dsd10':
      case 'lhd1':
      case 'lhd2':
      case 'lhd3':
      case 'lhd4':
      case 'lhd5':
        return datasel[0].toString().replace(/,/g, '|');
      default:
        break;
    }
  };
  return {
    inputNumbers: _inputNumbers,
    inputFormat: _inputFormat
  }
}();

export const GameUtils = {
    'SSC': SscUtils,
    'X511': X511Utils,
    'K3': K3Utils,
    'D3': D3Utils,
    'Kl8': Kl8Utils,
    'PK10': PK10Utils
};
