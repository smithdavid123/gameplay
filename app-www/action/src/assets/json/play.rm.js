import $ from 'jquery'
var lottery_data = {}; // 彩种数据
var config_data = {}; // 配置数据
var method_data = {}; // 玩法数据
var account_data = {}; // 用户数据
var cookie_data = {}; // Cookie数据
var order_data = {}; // 投注数据
var order_list = []; // 投注列表

lottery_data.showName = '重庆时时彩'; // 彩种名称
lottery_data.shortName = 'cqssc'; // 缩写名称
lottery_data.type = 1; // 彩种类型
lottery_data.downCode = 0; // 彩种降点
lottery_data.fenDownCode = 20; // 分模式降点
lottery_data.liDownCode = 20; // 厘模式降点

config_data.lotteryCode = 1998; // 最高奖级
config_data.lotteryPoint = 13.0; // 最高返点
config_data.unitMoney = 2; // 单注金额
// 2.这里更新浮动奖金
lottery_data.floatBonus = 0; // 浮动奖金
/*上面的是固定的*/
account_data.lotteryCode = 1998; // 用户奖级
account_data.lotteryPoint = 13.0; // 用户返点

cookie_data.lotteryCode = 1998; // 彩票奖级
cookie_data.lotteryModel = 'yuan'; // 彩票模式

cookie_data.audioOpenStatus = 'on'; // 开奖声音
cookie_data.audioTimeStatus = 'on'; // 时间声音
cookie_data.audioMessageStatus = 'on'; // 消息声音

var LotteryPlay = function () {
  // 主要的画布
  var mainPanel = $('.lottery-play');
  var playGroups = mainPanel.find('.play-groups');
  var playList = mainPanel.find('.play-list');
  var playHelp = mainPanel.find('.play-help');
  var playArea = mainPanel.find('.play-area');
  var playOptions = mainPanel.find('.play-options');
  var adjustBonus = mainPanel.find('.adjust-bonus');
  // 初始化玩法组
  var initPlayGroup = function (layout, method, index) {
    playGroups.empty(); // 清空
    var thisList = $('<div class="list">');
    $.each(layout, function (i, group) {
      var thisItem = $('<div class="item">');
      thisItem.html(group.title);
      // 点击效果
      thisItem.click(function () {
        if (!$(this).hasClass('selected')) {
          playGroups.find('.list > .item').removeClass('selected');
          $(this).addClass('selected');
          initPlayList(group.rows, method);
        }
      });
      thisList.append(thisItem);
    });
    playGroups.append(thisList);
    playGroups.find('.list > .item').eq(index).trigger('click');
  };
  // 初始化玩法列表
  var initPlayList = function (list, method) {
    playList.empty(); // 清空
    $.each(list, function (i, rows) {
      var thisRow = $('<div class="row">');
      $.each(rows, function (j, row) {
        thisRow.append('<div class="label">' + row.title + '</div>');
        $.each(row.columns, function (k, c) {
          var column = method[c]; // 获取具体玩法
          var thisColumn = $('<div class="column">');
          thisColumn.attr('data-method', column.shortname);
          thisColumn.html(column.showname);
          if (column.css) {
            thisColumn.css(column.css);
          }
          // 点击效果
          thisColumn.click(function () {
            if (!$(this).hasClass('selected')) {
              playList.find('.row > .column').removeClass('selected');
              $(this).addClass('selected');
            }
            // 默认位置勾选
            if (column.checkbox) {
              if (order_data.method != column.shortname) {
                order_data.defCheck = column.checkbox.defCheck;
              }
            } else {
              order_data.defCheck = [];
            }
            order_data.method = column.shortname; // 用户选中的玩法
            order_data.compress = column.compress; // 是否加密传输
            buildPlayHelp(column);
            buildPlayArea(column);
            updateBonus(); // 更新玩法奖金
            mainPanel.trigger('resize');
            PlayOptions.update();
          });
          thisRow.append(thisColumn);
        });
      });
      playList.append(thisRow);
    });
    playList.find('.row > .column').eq(0).trigger('click');
  };
  // 初始化帮助信息
  var buildPlayHelp = function (column) {
    playHelp.empty();
    playHelp.append('<div class="tips">玩法提示：' + column.tips + '</div>');
    playHelp.find('.tips').append('<a data-hover="help">[帮助]</a>'); // 帮助
    playHelp.find('.tips').append('<a data-hover="example">[案例]</a>'); // 案例
    playHelp.append('<div class="bonus">玩法奖金<span data-field="bonus">0.00</span>元</div>');
    playHelp.append('<div class="help"><i class="arrow"></i>' + column.help + '</div>');
    playHelp.append('<div class="example"><i class="arrow"></i>' + column.example + '</div>');
    // 显示
    var show = function () {
      var thisHover = $(this).attr('data-hover');
      var target = playHelp.find('.' + thisHover);
      var top = $(this).position().top - (target.height() / 2);
      var left = $(this).position().left + $(this).width() + 8;
      target.css({top: top, left: left}).fadeIn();
    };
    // 隐藏
    var hide = function () {
      var thisHover = $(this).attr('data-hover');
      playHelp.find('.' + thisHover).hide();
    };
    playHelp.find('[data-hover="help"]').hover(show, hide);
    playHelp.find('[data-hover="example"]').hover(show, hide);
  };
  // 构造选号区域
  var buildSelectPlace = function (select) {
    $.each(select.layout, function (i, val) {
      var row = $('<div class="row">');
      if (val.title) {
        row.append('<div class="label">' + val.title + '</div>');
      }
      if (val.cls) {
        row.addClass(val.cls);
      }
      // 球
      var balls = $('<div class="balls">');
      $.each(val.balls, function (j, ball) {
        balls.append('<div data-val="' + ball + '" class="item">' + ball + '</div>');
      });
      // 值
      if (val.values) {
        $.each(val.values, function (j, value) {
          balls.find('.item').eq(j).attr('data-val', value);
        });
      }
      balls.find('.item').click(function () {
        if ($(this).hasClass('selected')) {
          // 关联事件
          if (val.trigger == 'all') {
            balls.find('.item').removeClass('selected');
          }
          $(this).removeClass('selected');
        } else {
          // 关联事件all
          if (val.trigger == 'all') {
            balls.find('.item').addClass('selected');
          }
          // 关联事件only
          if (val.trigger == 'only') {
            balls.find('.item').removeClass('selected');
          }
          $(this).addClass('selected');
        }
        PlayOptions.update();
      });
      row.append(balls);
      // 工具
      if (val.tools) {
        var type = val.tools;
        buildBallTools(row, balls, type);
      }
      playArea.append(row);
    });
  };
  // 得到选号区域数据
  var getSelectData = function () {
    var datasel = [];
    var sb = playArea.find('.balls');
    if (sb && sb.length > 0) {
      $.each(sb, function () {
        var ball = [];
        var as = $(this).find('.item.selected');
        $.each(as, function () {
          var val = $(this).attr('data-val');
          ball.push(val);
        });
        datasel.push(ball);
      });
    }
    return datasel;
  };
  // 构造选号工具
  var buildBallTools = function (row, balls, type) {
    var items = balls.find('.item');
    var tools = $('<div class="tools">');
    tools.addClass(type);
    tools.append('<div data-command="all" class="item">全</div>');
    if (type == 'full') {
      tools.append('<div data-command="big" class="item">大</div>');
      tools.append('<div data-command="small" class="item">小</div>');
    }
    if (type != 'min') {
      tools.append('<div data-command="single" class="item">单</div>');
      tools.append('<div data-command="double" class="item">双</div>');
    }
    tools.append('<div data-command="clean" class="item">清</div>');
    var setSelected = function (els, selected) {
      if (selected) {
        if (!els.hasClass('selected')) {
          els.trigger('click');
        }
      } else {
        if (els.hasClass('selected')) {
          els.trigger('click');
        }
      }
    };
    tools.find('[data-command="all"]').click(function () {
      $.each(items, function () {
        setSelected($(this), true);
      });
    });
    tools.find('[data-command="big"]').click(function () {
      $.each(items, function (idx) {
        if (idx < Math.round(items.length / 2)) {
          setSelected($(this), false);
        } else {
          setSelected($(this), true);
        }
      });
    });
    tools.find('[data-command="small"]').click(function () {
      $.each(items, function (idx) {
        if (idx < Math.round(items.length / 2)) {
          setSelected($(this), true);
        } else {
          setSelected($(this), false);
        }
      });
    });
    tools.find('[data-command="single"]').click(function () {
      var arr = [1, 3, 5, 7, 9, 11];
      $.each(items, function () {
        var val = parseInt($(this).attr('data-val'));
        if ($.inArray(val, arr) != -1) {
          setSelected($(this), true);
        } else {
          setSelected($(this), false);
        }
      });
    });
    tools.find('[data-command="double"]').click(function () {
      var arr = [0, 2, 4, 6, 8, 10];
      $.each(items, function () {
        var val = parseInt($(this).attr('data-val'));
        if ($.inArray(val, arr) != -1) {
          setSelected($(this), true);
        } else {
          setSelected($(this), false);
        }
      });
    });
    tools.find('[data-command="clean"]').click(function () {
      $.each(items, function () {
        setSelected($(this), false);
      });
    });
    row.append(tools);
  };
  // 构造位置
  var buildCheckboxPlace = function (checkbox) {
    var hasDefault = function (val) {
      var array = order_data.defCheck;
      for (var i = 0; i < array.length; i++) {
        if (array[i] == val) {
          return true;
        }
      }
      return false;
    };
    $.each(checkbox.layout, function (i, val) {
      var row = $('<div class="row">');
      if (val.title) {
        row.append('<div class="label">' + val.title + '</div>');
      }
      // 位置
      var places = $('<div class="places">');
      var message = $('<div class="message">');
      $.each(val.value, function (j, value) {
        var thisItem = $('<label>');
        thisItem.append('<input value="' + value + '" type="checkbox">' + value + '</label>');
        if (hasDefault(value)) {
          thisItem.find('input').attr('checked', true);
        }
        places.append(thisItem);
      });
      var updatePlaceOnChange = function () {
        var array = [];
        places.find('input[type="checkbox"]:checked').each(function () {
          array.push($(this).val());
        });
        order_data.defCheck = array;
        if (checkbox.message) {
          message.html(checkbox.message[array.length]);
        }
      };
      places.find('input[type="checkbox"]').change(function () {
        updatePlaceOnChange();
        PlayOptions.update();
      }).trigger('change');
      row.append(places);
      if (checkbox.message) {
        row.append(message);
      }
      playArea.append(row);
    });
  };
  // 获得选择位置数据
  var getCheckboxData = function () {
    var places = [];
    var sp = playArea.find('.places');
    if (sp && sp.length > 0) {
      $.each(sp, function () {
        var place = [];
        var as = $(this).find('input[type="checkbox"]');
        $.each(as, function () {
          if ($(this).is(':checked')) {
            place.push('√');
          } else {
            place.push('-');
          }
        });
        places.push(place);
      });
    }
    return places;
  };
  // 构造输入框
  var buildTextareaPlace = function () {
    var textarea = $('<div class="textarea">');
    textarea.append('<textarea>');
    var help = $('<div class="help">').html('每注号码之间请用一个空格或英文逗号或英文分号隔开（输入的号码会自动排序并去除不合格号码）。');
    textarea.find('textarea').bind('input propertychange', function() {
      var val = $(this).val();
      switch (lottery_data.type) {
        case 1:
        case 3:
        case 4:
        case 5:
          val = val.replace(/,|;|\n|\t/g, ' ');
          break;
        case 2:
        case 6:
          val = val.replace(/,|\n/g, ';');
          break;
      }
      val = val.replace(/[\s]{2,}/, ' '); // 替换空格
      $(this).val(val);
      PlayOptions.update();
    });
    playArea.append(textarea);
    playArea.append(help);
  };
  // 得到输入的数据
  var getTextareaData = function () {
    var datasel = [];
    var textarea = playArea.find('textarea');
    if (textarea && textarea.length > 0) {
      var val = textarea.val();
      var separator = ' ';
      switch (lottery_data.type) {
        case 1:
        case 3:
        case 4:
        case 5:
          separator = ' ';
          break;
        case 2:
        case 6:
          separator = ';';
          break;
      }
      var as = val.split(separator);
      $.each(as, function (idx, val) {
        datasel.push(val);
      });
    }
    return datasel;
  };
  // 初始化玩法区域
  var buildPlayArea = function (column) {
    playArea.empty();
    if (column.checkbox) {
      buildCheckboxPlace(column.checkbox);
    }
    if (column.select) {
      buildSelectPlace(column.select);
    }
    if (column.textarea) {
      buildTextareaPlace(column.textarea);
    }
  };
  // 获取投注数据
  var getPlayAreaData = function () {
    var datasel = [];
    var places = getCheckboxData();
    var balls = getSelectData();
    var textarea = getTextareaData();
    return datasel.concat(places).concat(balls).concat(textarea);
  };
  // 重置投注数据
  var resetPlayAreaData = function () {
    playList.find('[data-method="' + order_data.method + '"]').trigger('click');
  };
  // 获取注数
  var getInputNumbers = function () {
    var method = order_data.method;
    var datasel = getPlayAreaData(); // 获取投注内容
    if (lottery_data.type == 1) {
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
      let flag = PK10Utils.inputNumbers(method, datasel);
      if (flag > 0) console.log([flag, method, JSON.stringify(datasel)]);
      return flag;
      // return PK10Utils.inputNumbers(method, datasel);
    }
    return 0;
  };
  // 获取内容
  var getInputContent = function () {
    var method = order_data.method;
    var datasel = getPlayAreaData(); // 获取投注内容
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
  var refreshCode = function (init) {
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
    var model = PlayOptions.model().val;
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
    if (init == false) {
      AdjustBonus.slider(lotteryMinCode, lotteryMaxCode);
    }
  };
  // 更新奖金
  var updateBonus = function () {
    if (method_data && order_data.method) {
      if (method_data[order_data.method]) {
        var bonus = method_data[order_data.method].bonus;
        var unitMoney = config_data.unitMoney;
        var modelMoney = PlayOptions.model().money;
        var code = AdjustBonus.code();
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
        var bonusSpan = playHelp.find('[data-field="bonus"]');
        var minBonus = bonusArray[0].toFixed(3);
        bonusSpan.html(minBonus);
        if (bonusArray.length > 1) {
          var maxBonus = bonusArray[bonusArray.length - 1].toFixed(3);
          bonusSpan.append('~');
          bonusSpan.append(maxBonus);
        }
      }
    }
  };
  // 游戏选项
  var PlayOptions = function () {
    // 倍数
    var multiple = function () {
      var val = playOptions.find('.multiple > input').val();
      if (val == '') val = 0;
      return parseInt(val);
    };
    // 模式
    var model = function () {
      var item = playOptions.find('.model > .item.selected');
      var val = item.attr('data-val');
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
    var update = function () {
      var nums = getInputNumbers();
      var total = nums * multiple() * config_data.unitMoney * model().money;
      total = NumberUtils.toFixed(total, 3);
      playOptions.find('[data-field="nums"]').html(nums);
      playOptions.find('[data-field="total"]').html(total);
    };
    // 初始化
    var init = function () {
      // playOptions.append('<div class="text">已选<span class="highlight" data-field="nums">0</span>注，</div>');
      // playOptions.append('<div class="multiple"></div>');

      playOptions.append('<div class="lf option_1"><div class="text">已选<span class="highlight" data-field="nums">0</span>注</div><div class="multiple"></div></div>');
      playOptions.find('.multiple').append('<div class="sub">-</div>');
      playOptions.find('.multiple').append('<input type="text" value="1">');
      playOptions.find('.multiple').append('<div class="add">+</div>');
      // playOptions.append('<div class="text">模式</div>');
      // playOptions.append('<div class="model"></div>');
      playOptions.append('<div class="lf option_2"> <div class="text">模式</div><div class="model"></div>  </div>');


      playOptions.find('.model').append('<div class="item" data-val="yuan">元</div>');
      playOptions.find('.model').append('<div class="item" data-val="jiao">角</div>');
      playOptions.find('.model').append('<div class="item" data-val="fen">分</div>');
      playOptions.find('.model').append('<div class="item" data-val="li">厘</div>');
      var defaultModel = 'yuan';
      if (cookie_data.lotteryModel) {
        defaultModel = cookie_data.lotteryModel;
      }
      playOptions.find('.model').find('[data-val=' + defaultModel + ']').addClass('selected');
      playOptions.append('<div class="lf option_3"><div class="text">总金额</div><div class="money_num"><span class="highlight" data-field="total">0</span>元</div><div>');
      playOptions.append('<div class="btn-gp"></div>');
      playOptions.find('.btn-gp').append('<div data-command="quick-bet" class="button">一键投注</div>');
      // 倍数按钮
      var multiple = playOptions.find('.multiple');
      // 只允许输入整数
      // InputUtils.integerOnly(multiple.find('input'), 1);
      multiple.find('input').keyup(function () {
        update();
      });
      multiple.find('.sub').click(function () {
        var val = parseInt(multiple.find('input').val());
        if (val > 1) val--;
        multiple.find('input').val(val);
        update();
      });
      multiple.find('.add').click(function () {
        var val = parseInt(multiple.find('input').val());
        multiple.find('input').val(val + 1);
        update();
      });
      // 模式按钮
      var modelItems = playOptions.find('.model > .item');
      modelItems.click(function () {
        if (!$(this).hasClass('selected')) {
          modelItems.removeClass('selected');
          $(this).addClass('selected');
          var val = $(this).attr('data-val');
          refreshCode(false);
          update();
        }
      });
      // 快速投注
      var quickBet = playOptions.find('[data-command="quick-bet"]');
      quickBet.click(function () {
        LotteryRecord.quickBet();
      });
    };
    return {
      multiple: multiple,
      model: model,
      update: update,
      init: init
    }
  }();
  // 调节奖金
  var AdjustBonus = function () {
    // 奖级
    var code = function () {
      var code = adjustBonus.find('[data-field="code"]').html();
      return parseInt(code);
    };
    // 返点
    var point = function () {
      var point = adjustBonus.find('[data-field="point"]').html();
      return parseFloat(point);
    };
    // 更新
    var update = function (code) {
      var point = parseFloat(order_data.maxPoint - getLotteryPoint(code)).toFixed(1);
      adjustBonus.find('[data-field="code"]').html(code);
      adjustBonus.find('[data-field="point"]').html(point);
      updateBonus(); // 更新玩法奖金
    };
    // 滑动条
    var slider = function (min, max) {
      var slider = adjustBonus.find('.slider');
      slider[0].noUiSlider.updateOptions({
        range: {min: min, max: max}
      });
    };
    // 初始化
    var init = function () {
      adjustBonus.empty();
      adjustBonus.append('<div class="text">奖金调节</div>');
      adjustBonus.append('<div class="slider-wrapper"><div class="slider"></div></div>');
      adjustBonus.append('<div class="text2"><span data-field="code">0</span>/<span data-field="point">0.0</span>%</div>');
      var slider = adjustBonus.find('.slider');
      refreshCode(true); // 刷新奖级
      var min = order_data.minCode;
      var max = order_data.maxCode;
      var start = max; // 默认为最高返点
      // 判断Cookie取值范围
      if (cookie_data.lotteryCode) {
        if (cookie_data.lotteryCode >= min && cookie_data.lotteryCode <= max) {
          start = cookie_data.lotteryCode;
        }
      }
      if (min == max) {
        update(start);
        adjustBonus.hide();
      }
      if (min < max) {
        // 初始化滑块
        noUiSlider.create(slider[0], {
          connect: 'lower',
          behaviour: 'snap',
          step: 2,
          start: start,
          range: {min: min, max: max}
        });
        // 滑块滑动的时候
        slider[0].noUiSlider.on('update', function (values, handle) {
          var code = parseInt(values[handle]);
          if (code > 2020) {
            update(2020);
          } else {
            update(code);
          };
        });
      }
    };
    return {
      init: init,
      code: code,
      point: point,
      update: update,
      slider: slider
    }
  }();
  PlayOptions.init();
  // 初始化
  var init = function () {
    var line = "/game/lottery/play.html?"+lottery_data.shortName;
    $(".lottery-menu .list a").each(function(){
      var href = $(this).attr("href");
      if(href == line){

        $(this).addClass("active");
        $(this).parent(".list").css("display","block");
        $(this).parent(".list").siblings(".title").addClass("selected")
      }
    });

    if (lottery_data.type == 1) {
      initPlayGroup(SscLayout, SscMethod, 3);
    }
    if (lottery_data.type == 2) {
      initPlayGroup(X511Layout, X511Method, 0);
    }
    if (lottery_data.type == 3) {
      initPlayGroup(K3Layout, K3Method, 0);
    }
    if (lottery_data.type == 4) {
      initPlayGroup(D3Layout, D3Method, 0);
    }
    if (lottery_data.type == 5) {
      initPlayGroup(Kl8Layout, Kl8Method, 0);
    }
    if (lottery_data.type == 6) {
      initPlayGroup(PK10Layout, PK10Method, 0);
    }
    AdjustBonus.init();
  };
  // 获取数据
  var getData = function () {
    var id = RandomUtils.uuid(24);
    var lottery = lottery_data.shortName;

    var issue = ''; // 暂时没有期号
    var method = order_data.method;
    var compress = order_data.compress ? true : false;
    var nums = getInputNumbers();
    var content = getInputContent();
    var code = AdjustBonus.code();
    var point = AdjustBonus.point();
    var multiple = PlayOptions.multiple();
    var model = PlayOptions.model();
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
      model: model
    }
  };
  // 重置
  var reset = function () {
    resetPlayAreaData();
  };
  return {
    init: init,
    getData: getData,
    reset: reset
  }
}();

// 游戏投注列表
var LotteryRecord = function () {

  var lotteryPlay = $('.lottery-play');
  var lotteryRecord = $('.lottery-record');
  var btnAdd = lotteryRecord.find('[data-command="add"]');
  var btnSubmit = lotteryRecord.find('[data-command="submit"]');
  var btnClear = lotteryRecord.find('[data-command="clear"]');
  var btnChase = lotteryRecord.find('[data-command="chase"]');
  var btnOrder = lotteryRecord.find('[data-command="order"]');
  var callback = {}; // 回调函数
  // 格式化玩法
  var formatMethod = function (method) {
    return '[' + method_data[method].name + ']';
  };
  // 格式化内容
  var formatContent = function (content) {
    if (content.length > 16) {
      content = content.substring(0, 16) + '<a data-command="details">[详情]</a>';
    }
    return content;
  };
  // 获取金额
  var getMoney = function (data) {
    var total = data.nums * data.multiple * config_data.unitMoney * data.model.money;
    total = NumberUtils.toFixed(total, 3);
    return total;
  };
  // 获取总计
  var getTotal = function () {
    var total = 0;
    var l = order_list.length;
    for (var i = 0; i < l; i++) {
      total += getMoney(order_list[i]);
    }
    return total;
  };
  // 删除记录
  var removeRecord = function (id) {
    var l = order_list.length;
    for (var i = 0; i < l; i++) {
      if (order_list[i].id == id) {
        order_list.splice(i, 1);
        break;
      }
    }
  };
  // 更新
  var update = function () {

    var sum = lotteryRecord.find('.sum');
    sum.find('[data-field="count"]').html(order_list.length);
    sum.find('[data-field="total"]').html(getTotal());
  };
  // 清空
  var clear = function () {
    order_list = []; // 清空内存
    lotteryRecord.find('.list').empty(); // 清空文档
    update(); // 更新金额
  };
  // 添加到列表
  var addToList = function (cb) {
    var data = LotteryPlay.getData();
    if (data.nums == 0) {
      AlertUtils.alert({
        time: 3000,
        icon: 'info',
        content: '您还没有选择号码或所选号码不全'
      });
      return;
    }
    var addItem = function (data) {
      var tpl =
        '<div class="item">\
            <div class="text">' + formatMethod(data.method) + formatContent(data.content) + '</div>\
                <div class="nums">' + data.nums + '注</div>\
                <div class="multiple">' + data.multiple + '倍</div>\
                <div class="model">' + data.model.name + '</div>\
                <div class="code">' + data.code + '</div>\
                <div class="point">' + data.point + '%</div>\
                <div class="money">' + getMoney(data) + '元</div>\
                <div class="remove"><a data-command="remove">×</a></div>\
            </div>';
      var thisRow = $(tpl);
      thisRow.find('[data-command="remove"]').click(function () {
        removeRecord(data.id);
        thisRow.remove();
        update();
      });
      lotteryRecord.find('.list').append(thisRow);
      LotteryPlay.reset();
      update();
      if (data.zipContent) {
        data.content = data.zipContent;
      }
      order_list.push(data);
      cb && cb();
    };
    if (data.compress == true) {
      lotteryPlay.ajaxLoading(true);
      LZMA.compress(data.content, 3, function (result) {
        lotteryPlay.ajaxLoading(false);
        if (result === false) {
          console.log('Compress Fail');
          return;
        }
        data.zipContent = LZMAUtils.toHex(result);
        addItem(data);
      });
    } else {
      addItem(data);
    }
  };
  // 提交投注
  var submit = function () {
    var list = [];
    $.each(order_list, function (i, v) {
      list.push({
        lottery: v.lottery,
        issue: v.issue,
        method: v.method,
        content: v.content,
        model: v.model.val,
        multiple: v.multiple,
        code: v.code,
        compress: v.compress
      });
    });
    console.log(list[list.length - 1]['content']);
    return;
    var data = {text: $.toJSON(list)};
    GameLotteryCtrl.request('ADD_ORDER', {
      data: data,
      beforeSend: function () {
        lotteryRecord.ajaxLoading(true);
      },
      success: function (res) {
        if (res.error == 0) {
          clear();
          AlertUtils.alert({
            time: 3000,
            icon: 'success',
            content: '您的订单已投注成功，请耐心等待开奖结果'
          });
          callback.submit && callback.submit();
        }
        if (res.error == 1) {
          if (res.code == '116-05') {
            setTimeout(function () {
              AlertUtils.alert({
                time: 3000,
                icon: 'error',
                content: '投注超时，请检查网路情况后重新重试'
              });
            }, 10000);
          } else if (res.code == '116-06') {
            window.location.href = '/';
          } else {
            AlertUtils.alert({
              time: 3000,
              icon: 'error',
              content: res.message
            });
          }
        }
      },
      complete: function () {
        lotteryRecord.ajaxLoading(false);
      }
    });
  };
  // 快速投注功能
  var quickBet = function () {
    addToList(function () {
      submit();
    });
  };
  // 添加回调函数
  var addCallback = function (opts) {
    if (opts.submit) {
      callback.submit = opts.submit;
    }
    if (opts.chase) {
      callback.chase = opts.chase;
    }
  };
  // 添加号码按钮
  btnAdd.click(function () {
    addToList();
  });
  // 确认投注按钮
  btnSubmit.click(function () {
    if (order_list.length == 0) {
      AlertUtils.alert({
        time: 3000,
        icon: 'info',
        content: '请先添加投注号码'
      });
      return;
    }
    var total = getTotal();
    AlertUtils.confirm({
      title: '投注确认',
      icon: 'question',
      content: '本次投注共需要花费' + total + '元，确认继续投注？',
      confirmFn: function (index) {
        layer.close(index);
        submit();
      }
    });
  });

  // 清空列表按钮
  btnClear.click(function () {
    clear();
  });
  // 设置追号按钮
  btnChase.click(function () {
    callback.chase && callback.chase();
  });
  // 订单记录按钮
  btnOrder.click(function () {
    window.location.href = '/member/member-order.html';
  });
  return {
    update: update,
    addToList: addToList,
    submit: submit,
    clear: clear,
    addCallback: addCallback,
    quickBet: quickBet
  }
}();
$(".toolbar-state").click(function(){
  var text = $(this).text();
  if( text == "收起" ){
    $("#header").animate({height:"0px"});
    $(this).text("展开").addClass("toolbar-hide").removeClass("toolbar-show");
    $("body.fixed-page-header").css("padding-top","45px");
  }
  else{
    $("#header").animate({height:"96px"});
    $(this).text("收起").addClass("toolbar-show").removeClass("toolbar-hide");
    $("body.fixed-page-header").css("padding-top","140px");
  }

});

export { LotteryPlay };
