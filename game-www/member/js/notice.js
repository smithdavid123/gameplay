$(document).ready(function () {
    var content = $('.main-container .notice-container');

    // 列出公告
    var doListNotice = function (data) {
        SystemCtrl.request('LIST_NOTICE', {
            data: {
                content: true
            },
            beforeSend: function () {
                content.ajaxLoading(true);
            },
            success: function (res) {
                buildData(res);
            },
            complete: function() {
                content.ajaxLoading(false);
            }
        });
    };

    // 展示公告
    // 左側列表, 右側內容
    var buildData = function (data) {
        var target = $('.notice-content');
        var titleList = target.find('.title-list');
        var title = target.find('.title');
        var time = target.find('.time');
        var content = target.find('.content');
        $.each(data, function (i, v) {
            var $thisItem = $(
                `<div class="item">
                    <div class="title textAuto"> ${v.title}</div>
                    <div class="time">${v.time}</div>
                    <!--<i class="icon"></i>-->
                </div>`
            );
            $thisItem.click(function () {
                if ($thisItem.hasClass('active')) {
                    return false;
                }
                titleList.find('.item').removeClass('active');
                $thisItem.addClass('active');
                title.html(v.title);
                time.html(`<div class="time">发布时间：${v.time}</div>`);
                content.html(v.content);
            });
            titleList.append($thisItem);
        });

        content.perfectScrollbar();
        titleList.find('.item').eq(0).trigger('click');

        var defaultIndex = location.href.split("?")[1] || '0';
        $('.title-list').animate({ scrollTop: 61 * defaultIndex }, 'slow'); // 自動scroll
        titleList.find('.item').eq(defaultIndex).trigger('click');
    };

    // 只有列表
    // var buildData = function (data) {
    //     for (var i = 0, html = ''; i < data.length; i++) {
    //         html += `<div class="item">
    //                     <div class="item_title">
    //                         <span class="title">
    //                             ${data[i].title}
    //                             <img src="/member/images/new.png" style="display:none;">
    //                         </span>
    //                         <span class="time">发布时间：${data[i].time}</span>
    //                     </div>
    //                     <div class="item_content">
    //                         ${data[i].content}
    //                     </div>
    //                 </div>`;

    //     };
    //     content.html(html);
    //     var toggleOn = function ($item) {
    //         $item.find(".item_content").slideDown();
    //         $item.addClass("active");
    //     };
    //     var toggleOff = function ($item) {
    //         $item.find(".item_content").slideUp();
    //         $item.removeClass("active");
    //     };
    //     $(".main-container .notice-container .item .item_title").click(function () {
    //         var target = $(this).parent();
    //         toggleOff(target.siblings()); // 所有公告slideUp
    //         var m = target.find(".item_content").css("display");
    //         if (m == "none") {
    //             toggleOn(target);
    //         } else {
    //             toggleOff(target);
    //         };
    //     });

    //     var defaultIndex = location.href.split("?")[1] || '0';
    //     $('html').animate({ scrollTop: 42 * defaultIndex }, 'slow'); // 自動scroll
    //     content.find('.item').eq(defaultIndex).find(".item_title").trigger('click');
    // };

    doListNotice();
});