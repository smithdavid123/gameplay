// extend jQuery functions
$.fn.extend({
    // 動畫效果
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            callback && callback();
        });
    },
    // 加載效果
    ajaxLoading: function (flag) {
        var target = $(this);
        var loadItem = target.find('.ajax-loading');
        if (flag) {
            if (loadItem.length == 0) {
                target.append('<div class="ajax-loading"></div>');
            }
        } else {
            if (loadItem.length != 0) {
                loadItem.remove();
            }
        }
    },
    // 捲動效果
    scrollTo: function (offeset) {
        var el = $(this);
        var pos = (el && el.size() > 0) ? el.offset().top : 0;

        if (el) {
            if ($('body').hasClass('fixed-header')) {
                pos = pos - $('.page-header-wrapper').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        }, 'slow');
    },
    /** 以jQuery fadeIn/Out效果切換文字內容
     * newContent(must): 要替換的內容
     * speed: fade速度
     */
    fadeHtml: function (newContent, speed) {
        var el = $(this);
        var fadeSpeed = speed ? speed : undefined;
        var fadeInTime = speed ? speed : 500;

        el.fadeOut(fadeSpeed);
        setTimeout(() => {
            el.html(newContent);
            el.fadeIn(fadeSpeed);
        }, fadeInTime);
    }
});

var Cookie = {
    setCookie: function (name, value, hour) {
        hour = hour || 2;
        let exp = new Date();
        exp.setTime(exp.getTime() + hour * 3600 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString();
    },
    getCookie: function  (name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
    }
}

// 数字工具类
var NumberUtils = function () {
    var toFixed = function (v, l) {
        v = Number(v);
        if (isNaN(v)) return v;
        if (v.toString().indexOf('.') == -1) return v;
        if (v.toString().split('.')[1].length > l) {
            v = v.toFixed(l);
        }
        return v;
    };
    return {
        toFixed: toFixed
    }
}();
// 随机工具类
var RandomUtils = function () {
    var uuid = function (l) {
        var text = '';
        var arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < l; i++) {
            text += arr.charAt(Math.floor(Math.random() * arr.length));
        }
        return text;
    };
    /** 取得隨機數字陣列
     * limit: 上限，使隨機範圍為0至limit-1
     * count: 取出數量
     * canRepeat: 數字是否可重複
     */
    var randomArrayInLimit = function (limit, count, canRepeat) {
        let randomArr = [];
        let rdm = 0; // 目前隨機數字
        function getOneNum () {
            do {
                rdm = Math.floor(Math.random() * limit);
            } while (!canRepeat && randomArr.indexOf(rdm) > -1) // 若不可重複且目前rdm已存在，就再取一次隨機數字
            return rdm;
        }
        for (let i = 0; i < count; i++) {
            randomArr.push(getOneNum());
        }
        return randomArr.sort(function (a, b) { return a - b; });
    };
    return {
        uuid: uuid,
        randomArrayInLimit: randomArrayInLimit
    }
}();
// 输入框工具类
var InputUtils = function () {
    var integerOnly = function (element, min, max) {
        element.keyup(function () {
            var val = element.val().replace(/[^0-9\.]/g, '');
            if (val) {
                val = parseInt(val);
                if (min && val < min) val = min;
                if (max && val > max) val = max;
            }
            element.val(val);
        });
        element.change(function () {
            var val = element.val();
            if (!val) {
                element.val(min);
                element.trigger('keyup');
            }
        });
    };
    return {
        integerOnly: integerOnly
    }
}();

// 实用工具
var Tools = function () {
    // 获取域名地址
    var getDomain = function () {
        return window.location.protocol + '//' + window.location.host;
    };
    // 获取浏览器请求参数
    var getUrl = function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    // 格式化金额
    var formatMoney = function (amount) {
        return amount.toFixed(3);
        // if (amount < 1) {
        //     return amount.toFixed(5);
        // } else if (amount < 100) {
        //     return amount.toFixed(3);
        // } else {
        //     return amount.toFixed(3);
        // }
    };
    // 构建空的表格内容
    var buildEmptyBody = function (rows, cells) {
        var body = $('<tbody>');
        for (var i = 0; i < rows; i++) {
            var row = $('<tr>');
            row.addClass('empty');
            for (var j = 0; j < cells; j++) {
                row.append('<td>&nbsp;</td>')
            }
            body.append(row);
        }
        return body.html();
    };
    return {
        getDomain: getDomain,
        getUrl: getUrl,
        formatMoney: formatMoney,
        buildEmptyBody: buildEmptyBody
    }
}();

// 弹出窗口工具
var ModalBoxUtils = function () {
    var box = null;
    var init = function (opts) {
        if (box != null) {
            return;
        }
        var options = {
            width: opts.width,
            height: opts.height,
            title: opts.title,
            // overlay: false,
            closeOnClick: false,
            blockScroll: false,
            animation: { open: 'zoomIn', close: 'zoomIn' },
            closeButton: 'title',
            draggable: 'title',
            content: opts.content,
            addClass: 'box-modal',
            onInit: function () {
                this.open();
            },
            onCloseComplete: function () {
                this.destroy();
                box = null;
            }
        };
        if (opts.height) {
            options.height = opts.height;
        }
        if (opts.addClass) {
            options.addClass = options.addClass + ' ' + opts.addClass;
        }
        box = new jBox('Modal', options);
    };
    var close = function () {
        if (box != null) {
            box.close();
        }
    };
    return {
        init: init,
        close: close
    }
}();

// 验证表单工具
var ValidateFormUtils = function () {
    var init = function (form, opts) {
        form.validate({
            rules: opts.rules,
            messages: opts.messages,
            errorPlacement: function (error, element) {
                var formGroup = $(element).closest('.form-group');
                if (formGroup.attr('data-validate') === 'false') return;
                formGroup.find('.help-block').html(error.text()).show();
            },
            highlight: function (element) {
                var formGroup = $(element).closest('.form-group');
                if (formGroup.attr('data-validate') === 'false') return;
                formGroup.removeClass('has-success').addClass('has-error');
            },
            unhighlight: function (element) {
                var formGroup = $(element).closest('.form-group');
                if (formGroup.attr('data-validate') === 'false') return;
                formGroup.removeClass('has-error').addClass('has-success');
                formGroup.find('.help-block').empty().hide();
            }
        });
        form.find('.help-block').each(function () {
            var dataDefault = $(this).attr('data-default');
            if (dataDefault) {
                $(this).html(dataDefault).show();
            } else {
                $(this).hide();
            }
        });
    };
    return {
        init: init
    }
}();

// 弹出框
var AlertUtils = function () {
    var getIcon = function (icon) {
        var array = ['success', 'error', 'info', 'question'];
        for (var i = 0; i < array.length; i++) {
            if (array[i] == icon) {
                return i;
            }
        }
    };
    var alert = function (o) {
        var opts = {
            title: '提示',
            btn: ['确定'],
            move: false
        };
        if (o.title) {
            opts.title = o.title;
        }
        if (o.time) {
            opts.time = o.time;
        }
        if (o.icon) {
            opts.icon = getIcon(o.icon);
            opts.skin = o.icon;
        }
        layer.alert(o.content, opts, o.callback);
    };
    var confirm = function (o) {
        var opts = {
            title: '消息确认',
            btn: ['确认', '取消'],
            move: false
        };
        if (o.title) {
            opts.title = o.title;
        }
        if (o.btn) {
            opts.btn = o.btn;
        }
        if (o.time) {
            opts.time = o.time;
        }
        if (o.icon) {
            opts.icon = getIcon(o.icon);
            opts.skin = o.icon;
        }
        if (o.confirmText) {
            opts.btn[0] = o.confirmText;
        }
        if (o.cancelText) {
            opts.btn[1] = o.cancelText;
        }
        layer.confirm(o.content, opts, o.confirmFn, o.cancelFn);
    };
    var msg = function (o) {
        var opts = {};
        if (o.time) {
            opts.time = o.time;
        }
        if (o.icon) {
            opts.icon = getIcon(o.icon);
        }
        layer.msg(o.content, opts);
    };
    return {
        alert: alert,
        confirm: confirm,
        msg: msg
    }
}();

// 匯入檔案工具類
var ImportUtils = function () {
    /** 匯入指定路徑的多個js檔案
     * paths: 路徑字串array
     */
    function importJS(paths) {
        var _arr = $.map(paths, function(path) {
            return $.getScript(path);
        });
        // _arr.push($.Deferred(function( deferred ){
        //     $( deferred.resolve );
        // }));
        return $.when.apply($, _arr);
    }
    return {
        importJS: importJS
    }
}();