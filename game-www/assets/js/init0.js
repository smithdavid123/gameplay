var isLogin = false;
var isLoop = true;
var getCookie = function  (name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
};

(function () {
    var token = getCookie('token'), licence = getCookie('licence');
    $.ajax({
        type: 'post',
        url: '/api/isLogin',
        data: {'tk': token, 'lc': licence},
        timeout: 8000, 
        dataType: 'json',
        async: false,
        success: function (res) {
            isLogin = !res.error;
        }
    });
})();