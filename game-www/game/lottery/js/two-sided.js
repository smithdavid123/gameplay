var keyword = location.href.split("?")[1]||'cqssc';
var $twoSided = $(".twoSided");
var $title = $(".twoSided").find('.title .list');
var order_list2 = [];
var gameLotteryMethodListSM=[];
function test(){

    var gameLotteryMethodList = JSON.parse( localStorage['PUBLIC:GameLotteryMethodList'] );

    for(var i=0,arr2=[],arr3=[];i<gameLotteryMethodList.length;i++){

        if( gameLotteryMethodList[i].methodType==2&&keyword==gameLotteryMethodList[i].lottery ){

            
            // if( !arr2[gameLotteryMethodList[i].type-1] ){
            //     arr2[gameLotteryMethodList[i].type-1] = [];
            // }
            gameLotteryMethodListSM.push( gameLotteryMethodList[i] );


            if (lottery_data.type == 1 ||lottery_data.type == 2) {
                $.each(SscSMLayout,(j,v)=>{
                    $.each(v.rows,(j1,v1)=>{
                        $.each(v1.contet,(j2,v2)=>{
                            
                            if( v2.playId==gameLotteryMethodList[i].methodName ){
                                var bonus = gameLotteryMethodList[i].bonus;
                                if( v2.playId=='wxhzdxds' ){
                                    v2.odds = [bonus,bonus,bonus,bonus];
                                }else if( v2.playId=='lhwg' ){
                                    v2.odds = bonus.split(',');
                                }else if( v2.playId=='dxds' ){
                                    v2.odds = [bonus,bonus,bonus,bonus];
                                }else if( v2.playId=='dw' ){
                                    v2.odds = [bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus];
                                }else if( v2.playId=='sxtshq'||v2.playId=='sxtshz'||v2.playId=='sxtshh' ){
                                    v2.odds = bonus.split(',');
                                };                         
                            }

                        });
                    });
                });
            }else if( lottery_data.type == 6 ){
                $.each(PK10SMLayout,(j,v)=>{
                    $.each(v.rows,(j1,v1)=>{


                        $.each(v1.contet,(j2,v2)=>{
                            
                            if( v2.playId==gameLotteryMethodList[i].methodName ){
                                var bonus = gameLotteryMethodList[i].bonus;
                                if( v2.playId=='dingweidan' ){
                                    v2.odds = [bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus];
                                }else if( v2.playId=='b2bdxds' ){
                                    v2.odds = [bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus,bonus];
                                }else if( v2.playId=='qianerhzdxds' ){
                                    v2.odds = bonus.split(',');
                                }else if( v2.playId=='b2bqianerhz' ){
                                    var arrs = bonus.split(',')
                                    v2.odds = [ 
                                        arrs[0],
                                        arrs[0],
                                        arrs[1],
                                        arrs[1],
                                        arrs[2],
                                        arrs[2],
                                        arrs[3],
                                        arrs[3],
                                        arrs[4],
                                        arrs[3],
                                        arrs[3],
                                        arrs[2],
                                        arrs[2],
                                        arrs[1],
                                        arrs[1],
                                        arrs[0],
                                        arrs[0],
                                     ];
                                }else if( v2.playId=='qianerzufs' ){
                                    v2.odds = bonus;
                                }else if(v1.playId=='lhd1'){
                                    v2.odds = [bonus,bonus];
                                };                         
                            }

                        });
                    });
                });
            }else if( lottery_data.type == 8 ){
                $.each(LHCSMLayout,(j,v)=>{
                    $.each(v.rows,(j1,v1)=>{
                        $.each(v1.contet,(j2,v2)=>{
                            
                            if( v2.playId==gameLotteryMethodList[i].methodName ){
                                var bonus = gameLotteryMethodList[i].bonus;
                                if( v2.playId=='dmtm'||v2.playId=='dmzhm1'||v2.playId=='dmzhm2'||v2.playId=='dmzhm3'||v2.playId=='dmzhm4'||v2.playId=='dmzhm5'||v2.playId=='dmzhm6' ){
                                    v2.odds = [];
                                    for(var x=0;x<49;x++){
                                        v2.odds[x] = bonus;
                                    };
                                }else if( v2.playId=='dxdstm' ){
                                    var b = bonus.split(',')[0];
                                    v2.odds = [b,b,b,b];
                                }else if( v2.playId=='wshtm' ){
                                    var b1 = bonus.split(',')[0];
                                    var b2 = bonus.split(',')[1];
                                    v2.odds = [b1,b2,b2,b2,b2,b2,b2,b2,b2,b2];
                                }else if( v2.playId=='sebtm' ){
                                    v2.odds = bonus.split(',');
                                }else if( v2.playId=='dxdszgfn' ){
                                    var b1 = bonus.split(',')[0];
                                    var b2 = bonus.split(',')[1];
                                    v2.odds = [b1,b1,b1,b1,b2,b2,b2,b2];
                                }else if( v2.playId=='shxtx'||v2.playId=='shx1x' ){
                                    var shengxiao = localStorage['PRIVATE:shengxiao']&&JSON.parse(localStorage['PRIVATE:shengxiao']);
                                    v2.odds = bonus.split(',');
                                    $.each(v2.name,(i3,v3)=>{//获取当年生肖球号
                                        console.log('哈哈哈哈哈', v2,i3,v3)
                                        v2.ball[i3] = shengxiao[v3].split(',')
                                    });

                                }                          
                            }

                        });
                    });
                });
            }
        }
        if( gameLotteryMethodList[i].type==8&&gameLotteryMethodList[i].methodType==2 ){
            arr3.push( gameLotteryMethodList[i]);
        }
    };
}
test();

var modelUnit = function(){

    var model = $twoSided.find('[data-type="unit"]').attr('data-val');
    if( model=='yuan' ){
        var unit = {
            money: 1,
            name: "元",
            val: "yuan" 
        };
    }else if( model=='jiao' ){
        var unit = {
            money: 0.1,
            name: "角",
            val: "jiao" 
        };
    }else if( model=='fen' ){
        var unit = {
            money: 0.01,
            name: "分",
            val: "fen" 
        };
    }else if( model=='li' ){
        var unit = {
            money: 0.001,
            name: "厘",
            val: "li" 
        };
    }; 

    return unit;
};

var bonus = function(bonus){

    var bonus = bonus.toString();
    var unitMoney = config_data.unitMoney;
    var model = modelUnit().money || 1;
    
    var code = parseInt( $twoSided.find('[data-field="code"]').text() ) || order_data.maxCode;
    // 3.这里更新浮动奖金

    if (lottery_data.floatBonus) {
        code += lottery_data.floatBonus;
    }

    var bonusArray = LotteryUtils.getBonus({
        bonus: bonus,
        unitMoney: unitMoney,
        modelMoney: model,
        code: code
        
    });

    var minBonus = bonusArray[0].toFixed(3);

    return minBonus
};

//生肖球号
var initShengXiaoBall = function(){
    var shengxiao = localStorage['PRIVATE:shengxiao']&&JSON.parse(localStorage['PRIVATE:shengxiao']);
    var Rgb = {
        '红':'01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46,红',
        '绿':'05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49,绿',
        '蓝':'03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48,蓝',
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

var smHTML = function(){
    var twoSidedTitle = $('.twoSided>.title>.list');
    var $betting = $('.twoSided .betting');
    var $help = $(".twoSided .prompt .exp .textBox .text.help");
    var $explae = $(".twoSided .prompt .exp .textBox .text.explae")
    var callback = {}; // 回调函数

    var initPlay = function(data){
        var  list = '';
        list += `<div class="b-item lf" play-type="1">`;
        list += `<div class="b-title lf">
                    <div class="text">${data.title}</div>
                </div>`
        list += `<div class="list lf"><div>`;

        $.each(data.contet,(i,v)=>{               
            var hasRGBball = v.hasRGBball;

            $.each(v.name,(i2,v2)=>{

                if(hasRGBball ){
                    var cls = initShengXiaoBall.init(v2).cls
                    var tel = `<span class="ball ${cls}">${v2}</span>`;
                }else{
                    var tel = v2;
                };

                list += `<div class="l-item-box lf">
                            <div playid="${v.playId}" name="${v2}" class="l-item lf">
                                <div class="name">${tel}</div> 
                                <div class="odds" bonus="${v.odds[i2]}">${bonus(v.odds[i2])}</div> 
                                <div class="num">
                                    <input type="number" min='1'>
                                </div>
                            </div>
                        </div>`;
            });

            initHelp(v.help,v.explae,v.headline);
            
        });
        list += `</div></div></div>`;

        return list;
    };
    var initPlay2 = function(data){
        var list = '';
        list += `<div class="b-item lf" play-type="2">`;

        $.each(data.title,(i,v)=>{

            list += `<div class="list lf" style="width:20%">`;
            list += `<div class="text">${v}</div>`;
            list += `<div class="l-item lf stopPropagation">
                        <div>号码</div> 
                        <div>奖金</div> 
                        <div class="num">金额</div>
                    </div>`;

            $.each(data.contet,(i2,v2)=>{               

                $.each(v2.name,(i3,v3)=>{
                    list += `<div playid="${v2.playId}" name="${v3}" class="l-item lf">
                                <div class="name">${v3}</div> 
                                <div class="odds" bonus="${v2.odds[i3]}">${bonus(v2.odds[i3])}</div> 
                                <div class="num">
                                    <input type="number" min='1'>
                                </div>
                            </div>`;
                });
                if( i==0 ){
                    initHelp(v2.help,v2.explae,v2.headline);
                };
                
            });
            list += `</div>`;

        });


        list += `</div>`;
        return list;
    };
    var initPlay3 = function(data){
        var list = '';
        list += `<div class="b-item lf" play-type="2">`;

        $.each(data.title,(i,v)=>{

            list += `<div class="list lf" style="width:20%">`;
            list += `<div class="text">${v}</div>`;
            list += `<div class="l-item lf stopPropagation">
                        <div>号码</div> 
                        <div>奖金</div> 
                        <div class="num">金额</div>
                    </div>`;

            $.each(data.contet,(i2,v2)=>{               

                $.each(v2.name,(i3,v3)=>{
                    list += `<div playid="${v2.playId}" name="${v3}" class="l-item lf">
                                <div class="name"><span class="n n${v3}">${v3}</span></div> 
                                <div class="odds" bonus="${v2.odds[i3]}">${bonus(v2.odds[i3])}</div> 
                                <div class="num">
                                    <input type="number" min='1'>
                                </div>
                            </div>`;
                });

                if( i==0 ){
                    initHelp(v2.help,v2.explae,v2.headline);
                };
                
            });
            list += `</div>`;

        });


        list += `</div>`;
        return list;
    };
    var initPlay4 = function(data){
        var list = '';
        list += `<div class="b-item lf" play-type="1">`;

        $.each(data.title,(i,v)=>{

            list += `<div class="list lf" style="width:20%">`;
            list += `<div class="text">${v}</div>`;
            list += `<div class="l-item lf stopPropagation">
                        <div>号码</div> 
                        <div>奖金</div> 
                        <div class="num">金额</div>
                    </div>`;

            $.each(data.contet,(i2,v2)=>{               

                $.each(v2.name,(i3,v3)=>{
                    list += `<div playid="${data.playId[i]}" name="${v3}" class="l-item lf">
                                <div class="name">${v3}</div> 
                                <div class="odds" bonus="${v2.odds[i3]}">${bonus(v2.odds[i3])}</div> 
                                <div class="num">
                                    <input type="number" min='1'>
                                </div>
                            </div>`;
                });

                if( i==0 ){
                    initHelp(v2.help,v2.explae,v2.headline);
                };
                
            });
            list += `</div>`;

        });


        list += `</div>`;
        return list;
    };
    var initPlay5 = function(data){
        var  list = '';
        list += `<div class="b-item lf" play-type="1">`;
        list += `<div class="b-title lf">
                    <div class="text">${data.title}</div>
                </div>`
        list += `<div class="list lf"><div>`;

        $.each(data.contet,(i,v)=>{               

            $.each(v.name,(i2,v2)=>{
                list += `<div class="l-item-box lf">
                            <div playid="${v.playId}" name="${v2}" class="l-item lf">
                                <div class="name">
                                    <span class='n n${v2[0]}'>${v2[0]}</span>
                                    <span class='n n${v2[1]}'>${v2[1]}</span>
                                </div> 
                                <div class="odds" bonus="${v.odds}">${bonus(v.odds)}</div> 
                                <div class="num">
                                    <input type="number" min='1'>
                                </div>
                            </div>
                        </div>`;
            });

            initHelp(v.help,v.explae,v.headline);

        });
        list += `</div></div></div>`;

        return list;
    };
    var initPlay6 = function(data){
        var  list = '';
        list += `<div class="b-item lf" play-type="1">`;
        list += `<div class="b-title lf">
                    <div class="text">${data.title}</div>
                </div>`
        list += `<div class="list lf"><div>`;

        $.each(data.contet,(i,v)=>{               
            var hasRGBball = v.hasRGBball;
            $.each(v.name,(i2,v2)=>{

                for(var j = 0,tel='';j<v.ball[i2].length;j++){
                    if( hasRGBball ){
                        var cls = initShengXiaoBall.init(v.ball[i2][j]).cls
                        tel += `<span class="ball ${cls}">${v.ball[i2][j]}</span>`;
                    };
                
                };
                if( ((new Date().getFullYear() + 8)%12) == i2 ){
                    var odds = v.odds[1]
                }else{
                    var odds = v.odds[0]
                }

                list += `<div class="l-item-box lf" style="width:50%">
                            <div playid="${v.playId}" name="${v2}" class="l-item lf four">
                                <div class="name">${v2}</div> 
                                <div class="ballBox">${tel}</div>
                                <div class="odds" bonus="${odds}">${bonus(odds)}</div> 
                                <div class="num">
                                    <input type="number" min='1'>
                                </div>
                            </div>
                        </div>`;
            });

            initHelp(v.help,v.explae,v.headline);
            
        });
        list += `</div></div></div>`;

        return list;



    };
    // 获取投注数据
    var getPlayAreaData = function (list) {

    };
    var getInputNumbers = function (list) {
        var method = list.method;
        var datasel = [list.content.split('-')]; // 获取投注内容
        if (lottery_data.type == 1 ||lottery_data.type == 2) {
            return SscUtils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 3) {
            return X511Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 4) {
            return K3Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 5) {
            return Kl8Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 6) {
            return PK10Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 7) {
            return D3Utils.inputNumbers(method, datasel);
        }
        if (lottery_data.type == 8) {
            return LHCUtils.inputNumbers(method, datasel);
        }
        
        return 0;
    };
    var clear = function(){
        $('.twoSided').find('.l-item').removeClass('active');
        $('.twoSided').find('.l-item input').val('');
    };

    var submitSM = function(data){
        GameLotteryCtrl.request('ADD_ORDER', {
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    clear();
                    AlertUtils.alert({
                        time: 3000,
                        icon: 'success',
                        content: '您的订单已投注成功，请耐心等待开奖结果'
                    });
                    //RecordOrderSM.reload();
                    callback.submit && callback.submit();
                }
                if (res.error == 1) {
                    clear();
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
            }
        });
    };

    var regValue = function(v){
        var r = /^[1-9]\d*$/;
        return r.test(v);
    };

    var bindEvent = function(){
        /*** 选号 ***/
        $('.twoSided').delegate('.l-item','click',function(){
            if( !$(this).hasClass('stopPropagation')  ){
                $(this).toggleClass('active');
                if( $(this).hasClass('active') ){
                    $(this).find('input').val( $("[data-val='moneyTel']").val() );
                }else{
                    $(this).find('input').val('');
                }                  
            };
         
        })

        /*** 阻止输入框选号 ***/
        $('.twoSided').delegate('.l-item input','click',function(event){
            event.stopPropagation();    //  阻止事件冒泡
        })

        $('.twoSided').delegate('.l-item input','focus',function(event){
            var node = $(this).parents('.l-item');
            if( !node.hasClass('active') ){
                node.addClass('active');
                node.find('input').val( $("[data-val='moneyTel']").val() );
            };
        })

        
        /*** 快速改变投注金额 ***/
        $("[data-val='moneyTel").bind("input propertychange",function(event){
            $('.twoSided .l-item.active input').val( $(this).val() );
        });

        $("[data='submit']").click(function(){
            var node = $('.twoSided [play-type="1"]').find('.l-item.active');
            var node2 = $('.twoSided [play-type="2"]');  
            var arr = [];
            var model = $twoSided.find('[data-type="unit"]').attr('data-val');
            var code = $twoSided.find('.sliderBOX').attr('data-code')
            
            for(var i=0;i<node.length;i++){
                var multiple = node.eq(i).find('input').val();
                if( !regValue(multiple) ){
                    AlertUtils.alert({
                        icon: 'info',
                        content: '请输入正确的投注倍数'
                    }); 
                    return;
                };
                arr.push({
                    "lottery": keyword,
                    "issue": "",
                    "method": node.eq(i).attr('playid'),
                    "content": node.eq(i).attr('name'),
                    "model": model,
                    "multiple":multiple,
                    "code": code,
                    "compress": false,
                    "methodType":2
                });
            };


            for( var x=0;x<node2.length;x++  ){

                var len = node2.eq(x).find('.list').length;

                for( var y=0;y<len;y++  ){

                    var list = node2.eq(x).find('.list').eq(y).find('.l-item.active');
                    
                    for( var z=0;z<list.length;z++  ){
                        var codes =  ( new Array(len) ).fill('-');
                        var money = list.eq(z).find('input').val();
                        codes[y] = list.eq(z).attr('name');
                        var multiple = list.eq(z).find('input').val();
                        if( !regValue(multiple) ){
                            AlertUtils.alert({
                                icon: 'info',
                                content: '请输入正确的投注倍数'
                            }); 
                            return false;
                        };
                        if( money>0 ){
                            arr.push({
                                "lottery": keyword,
                                "issue": "",
                                "method": list.eq(z).attr('playid'),
                                "content": codes.join(','),
                                "model": model,
                                "multiple": multiple,
                                "code": code,
                                "compress": false,
                                "methodType":2
                            });                      
                         };
                    }
                };

            };

            if( arr.length==0 ){
                AlertUtils.alert({
                    icon: 'info',
                    content: '请选择号码！'
                });  
                return;          
            };

            for(var i=0,total=0;i<arr.length;i++){
                
                if( arr[i].method=='qianerhz' ){
                    var m = getInputNumbers(arr[i]);
                    total += m;
                }else{
                    total += parseInt(arr[i].multiple)
                }   
                
            };

            total = (modelUnit().money*total).toFixed(3);      

            var data = {text: $.toJSON(arr)};

            AlertUtils.confirm({
                title: '投注确认',
                icon: 'question',
                content: '本次投注共需要花费' + total + '元，确认继续投注？',
                confirmFn: function (index) {
                    layer.close(index);
                    submitSM(data);
                }
            });


        });     

    };

    var initSSCSM = function(){
        var titleTel = '';
        $.each(SscSMLayout,(i,v)=>{
            titleTel += `<div class="item lf">${v.title}</div>`;
        });
        $title.html(titleTel);

        $title.find('.item').click(function(){
            var index = $(this).index();
            checkItem(index);
            renderBonus();
        });

        var checkItem = function(index){
            var index = index||0;
            var list = SscSMLayout[index];
            $betting.empty();
            $help.empty();
            $explae.empty();
            $title.find('.item').eq(index).addClass('active').siblings().removeClass('active');

            $.each(list.rows,(i2,v2)=>{

                if( v2.direction=='row' ){
                    $betting.append(initPlay(v2) );
                }else if( v2.direction=='col' ){
                    $betting.append( initPlay2(v2) );
                };
            });    
            
            if( $('[data="switchIcon"]').hasClass('active') ){
                $('.twoSided').find('.l-item').addClass('quick');
            }else{
                $('.twoSided').find('.l-item').removeClass('quick'); 
            }; 
        };

        checkItem();
    };

    var initLHCSM = function(){
        var titleTel = '';
        $.each(LHCSMLayout,(i,v)=>{
            titleTel += `<div class="item lf">${v.title}</div>`;
        });
        $title.html(titleTel);

        $title.find('.item').click(function(){
            var index = $(this).index();
            checkItem(index);
            renderBonus();
        });

        var checkItem = function(index){
            var index = index||0;
            var list = LHCSMLayout[index];
            $betting.empty();
            $help.empty();
            $explae.empty();
            $title.find('.item').eq(index).addClass('active').siblings().removeClass('active');

            $.each(list.rows,(i2,v2)=>{

                if( v2.direction=='row' ){
                    $betting.append(initPlay(v2) );
                }else if( v2.direction=='col' ){
                    $betting.append( initPlay2(v2) );
                }else if( v2.direction=='row3' ){
                    $betting.append( initPlay6(v2) );
                };
            });    
            
            if( $('[data="switchIcon"]').hasClass('active') ){
                $('.twoSided').find('.l-item').addClass('quick');
            }else{
                $('.twoSided').find('.l-item').removeClass('quick'); 
            }; 
        };

        checkItem();
    };

    var initHelp = function(help,explae,headline){

        var promptTxt = `<div class="item">
                            <div class="tit">${headline}</div> 
                            <div class="cont">${help}</div>
                        </div>`; 
        var promptTxt2 = `<div class="item">
                            <div class="tit">${headline}</div> 
                            <div class="cont">${explae}</div>
                        </div>`;

        $help.append(promptTxt);   
        $explae.append(promptTxt2);
    };

    var initPK10SM = function(){
        var titleTel = '';
        $.each(PK10SMLayout,(i,v)=>{
            titleTel += `<div class="item lf">${v.title}</div>`;
        });

        $title.html(titleTel);
        
        $title.find('.item').click(function(){
            var index = $(this).index();
            checkItem(index);
            renderBonus();
        });

        var checkItem = function(index){
            var index = index||0;
            var list = PK10SMLayout[index];
            var promptTxt = '';
            $betting.empty();
            $help.empty();
            $explae.empty();
            $title.find('.item').eq(index).addClass('active').siblings().removeClass('active');

            $.each(list.rows,(i2,v2)=>{

                if( v2.direction=='row' ){
                    $betting.append(initPlay(v2) );
                }else if( v2.direction=='col' ){
                    $betting.append( initPlay3(v2) );
                }else if( v2.direction=='col2' ){
                    $betting.append( initPlay4(v2) );
                }else if( v2.direction=='row2' ){
                    $betting.append( initPlay5(v2) );
                }else if( v2.direction=='col3' ){
                    $betting.append( initPlay2(v2) );
                };
            });   

            if( $('[data="switchIcon"]').hasClass('active') ){
                $('.twoSided').find('.l-item').addClass('quick');
            }else{
                $('.twoSided').find('.l-item').removeClass('quick'); 
            };           
        };

        checkItem();

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
        var model = modelUnit().money;
        if (model == 0.01) {
            if (fenDownCode != 0 && lotteryMaxCode > fenDownCode) {
                lotteryMaxCode = fenDownCode;
                lotteryMaxPoint = getLotteryPoint(lotteryMaxCode);
            }
        }
        if (model == 0.001) {
            if (liDownCode != 0 && lotteryMaxCode > liDownCode) {
                lotteryMaxCode = liDownCode;
                lotteryMaxPoint = getLotteryPoint(lotteryMaxCode);
            }
        }
        order_data.minCode = lotteryMinCode;
        order_data.maxCode = lotteryMaxCode;
        order_data.maxPoint = lotteryMaxPoint;
        if (init == false) { 
            if( lotteryMinCode < lotteryMaxCode ){
                var slider = $twoSided.find('.slider');
                slider[0].noUiSlider.updateOptions({
                    range: {min: lotteryMinCode, max: lotteryMaxCode}
                });
            }
            // AdjustBonus.slider(lotteryMinCode, lotteryMaxCode);
        }
    };
    // 获取彩票奖级
    var getLotteryCode = function (point) {
        return parseInt(config_data.lotteryCode - (config_data.lotteryPoint - point) * 20);
    };
    // 获取彩票返点
    var getLotteryPoint = function (code) {
        return parseFloat(config_data.lotteryPoint - (config_data.lotteryCode - code) / 20).toFixed(1);
    };
    var update = function (code) {
        var $codeText = $twoSided.find('[data-field="code"]');
        var $codePoint = $twoSided.find('[data-field="point"]');
        var $code = $twoSided.find('.sliderBOX');
        var point = parseFloat(order_data.maxPoint - getLotteryPoint(code)).toFixed(1);
        $codeText.html(code);
        $codePoint.html(point);
        $code.attr('data-code',code);
    };
    var rander = function(){

        $('.main-box .play_type').add('.twoSided').show();
        
        if( localStorage['PUBLIC:playType'] =='sm' ){
            $(".main-box .lottery-play").add(".main-box .lottery-record-box").hide();
            $('.main-box .twoSided').show();
            $(".main-box .play_type .item").eq(1).addClass('active').siblings().removeClass('active');
        }else{
            $(".main-box .lottery-play").add(".main-box .lottery-record-box").show();
            $('.main-box .twoSided').hide();
            $(".main-box .play_type .item").eq(0).addClass('active').siblings().removeClass('active');
        };

        /*** 切换玩法 ***/
        $(".main-box .play_type .item").click(function(){

            var type = $(this).attr('data-type');
            $(this).addClass('active').siblings().removeClass('active');
            
            if( type=='standard' ){
                $(".main-box .lottery-play").add(".main-box .lottery-record-box").show();
                $('.main-box .twoSided').hide();
                $('.lottery-record-box').show();

                // TODO 壹佰因為把開獎放在 lottery-play-box 內, 所以要加這行
                $(".lottery-play-box .lottery-open-list").show();

                localStorage.removeItem('PUBLIC:playType');
                
            }else if( type=='twoSided' ){
                $(".main-box .lottery-play").add(".main-box .lottery-record-box").hide();
                $('.main-box .twoSided').show();
                $('.lottery-record-box').hide();

                // TODO 壹佰因為把開獎放在 lottery-play-box 內, 所以要加這行
                $(".lottery-play-box .lottery-open-list").hide();

                localStorage['PUBLIC:playType'] ='sm';
            };
            RecordOrderSM.reload();
            RecordOrder.reload();
            
        });

        /*** 快速、勾选 ***/
        $('[data="switchIcon"]').click(function(){
            if( $(this).hasClass('active') ){
                $(this).removeClass('active');
                $('.twoSided').find('.l-item').removeClass('quick');
            }else{
                $(this).addClass('active');
                $('.twoSided').find('.l-item').addClass('quick');
            };
        });

        /*** 重置选号 ***/
        $("[data='reset']").click(function(){
            $('.twoSided').find('.l-item').removeClass('active');
            $('.twoSided').find('.l-item input').val('');
        });   
        
        /*** 选择投注单位 元、角、分、厘 ***/
        $('[data-type="unit"] .item').click(function(){
            var v = $(this).attr('data-val');
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parents('[data-type="unit"]').attr('data-val',v);
            renderBonus();
        });

        /*** 调节奖金 ***/
        (function(){
            var slider = $twoSided.find('.slider');
            var min = order_data.minCode;
            var max = order_data.maxCode;
            var $code = $twoSided.find('.sliderBOX');
            var $codeText = $twoSided.find('[data-field="code"]');
            var $codePoint = $twoSided.find('[data-field="point"]');
            // 初始化滑块
            if( min == max ){
                slider.hide();
            }
            if( min < max ){
                noUiSlider.create(slider[0], {
                    connect: 'lower',
                    behaviour: 'snap',
                    step: 2,
                    start: max,
                    range: {min: min, max: max}
                });

            // 滑块滑动的时候
            slider[0].noUiSlider.on('update', function (values, handle) {
                var code = parseInt(values[handle]);
                var codeMin = store.get('PRIVATE:codeMin');
                var codeMax = store.get('PRIVATE:codeMax');
                if(code>codeMax){
                    update(codeMax)
                }else if(code<codeMin){
                    update(codeMin)
                }else{
                    update(code)
                };
                renderBonus();
            });
            }

            refreshCode(false);
        })();


    };

    var init = function(){
        if (lottery_data.type == 1 ||lottery_data.type == 2) {
            initSSCSM();
            rander();
        }else if(lottery_data.type == 6){
            initPK10SM();
            rander();
        }else if(lottery_data.type == 8){
            initLHCSM();
            rander();
        };
        
        bindEvent();
        renderBonus();
    };

    var renderBonus = function(){

        var node = $twoSided.find('.l-item .odds');
        $.each(node,(i,v)=>{
            var b = $(v).attr('bonus');
            var ss = bonus(b);
            $(v).text(ss);

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
    // 设置追号按钮
    $twoSided.find('[data="chase"]').click(function () {
        var node = $('.twoSided [play-type="1"]').find('.l-item.active');
        var node2 = $('.twoSided [play-type="2"]');  
        var arr = [];
        var model = $twoSided.find('[data-type="unit"]').attr('data-val');
        var code = $twoSided.find('.sliderBOX').attr('data-code')
        for(var i=0;i<node.length;i++){
            var multiple = node.eq(i).find('input').val();
            if( !regValue(multiple) ){
                AlertUtils.alert({
                    icon: 'info',
                    content: '请输入正确的投注倍数'
                }); 
                return;
            };
            arr.push({
                "lottery": keyword,
                "issue": "",
                "method": node.eq(i).attr('playid'),
                "content": node.eq(i).attr('name'),
                "model": {
                    money: modelUnit().money,
                    name:  modelUnit().name,
                    val:  modelUnit().val,
                },
                "multiple":multiple,
                "code": code,
                "compress": false,
                "point": 0,
                "nums": 1,
            });
        };


        for( var x=0;x<node2.length;x++  ){

            var len = node2.eq(x).find('.list').length;

            for( var y=0;y<len;y++  ){

                var list = node2.eq(x).find('.list').eq(y).find('.l-item.active');
                
                for( var z=0;z<list.length;z++  ){
                    var codes =  ( new Array(len) ).fill('-');
                    var money = list.eq(z).find('input').val();
                    codes[y] = list.eq(z).attr('name');
                    var multiple = list.eq(z).find('input').val();
                    if( !regValue(multiple) ){
                        AlertUtils.alert({
                            icon: 'info',
                            content: '请输入正确的投注倍数'
                        }); 
                        return false;
                    };
                    if( money>0 ){
                        arr.push({
                            "lottery": keyword,
                            "issue": "",
                            "method": list.eq(z).attr('playid'),
                            "content": codes.join(','),
                            "model": {
                                money: modelUnit().money,
                                name:  modelUnit().name,
                                val:  modelUnit().val,
                            },
                            "multiple": multiple,
                            "code": code,
                            "compress": false,
                            "point": 0,
                            "nums": 1,
                        });                      
                     };
                }
            };

        };

        order_list2 = arr;
        callback.chase && callback.chase();
        clear();
    });

    
    return {
        init:init,
        addCallback: addCallback,
    };
}();


smHTML.init();


