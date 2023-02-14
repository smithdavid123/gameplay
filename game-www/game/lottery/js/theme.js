
// 初始化皮肤
$(document).ready(function () {
    var themeName = localStorage.ThemeName;
    switchs(themeName);

    function switchs(themeName) {
        if (themeName != 'forest') {
            themeName = 'default';
        };
    
        var src = 'themes/' + themeName + '/css/style.css';
        var src2 = 'themes/' + themeName + '/css/two-sided.css';
        $("#themes").attr('href', src);
        $("#themes2").attr('href', src2);
        localStorage.ThemeName = themeName;
    };

    $('.skin').click(function(){
        var themeName = localStorage.ThemeName;
        if(themeName=='forest'){
            themeName = 'default';
        }else{
            themeName = 'forest';
        }
        switchs(themeName);

                //调用子iframe页面里的方法
    });  

});


