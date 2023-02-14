/** 固定時間刷新帳戶餘額、私人訊息未讀數量 */
function updateLoopData() {
    // 帳戶餘額
    var GameLotteryAccount = store.get('PRIVATE:GameLotteryAccount');
    $('[data-global="lotteryBalance"]').html(GameLotteryAccount.availableBalance.toFixed(3));
    // 私人信息未讀數量
    var MsgCount = store.get('PRIVATE:MsgCount');
    $('[data-global="msgCount"] > div').html(MsgCount);
};

/** 彩票分類名稱 */
var lotteryCategories = function () {
    return store.get('PUBLIC:GameLotteryShowTypeList'); // 正式版
    // return [ // 固定資料版
    //     { "id": 1, "name": "时时彩", "code": "ssc", "status": 0 },
    //     { "id": 2, "name": "高频彩", "code": "gpc", "status": 0 },
    //     { "id": 3, "name": "11选5", "code": "x511", "status": 0 },
    //     { "id": 4, "name": "快3", "code": "k3", "status": 0 },
    //     { "id": 5, "name": "快乐彩", "code": "klc", "status": 0 },
    //     { "id": 6, "name": "PK10", "code": "pk10", "status": 0 },
    //     { "id": 7, "name": "低频彩", "code": "dpc", "status": 0 }
    // ];
}
/** 彩票遊戲列表 */
var lotteryInfoList = function () {
    return store.get('PUBLIC:GameLotteryInfoList'); // 正式版
}

/** 對後端返回的彩種進行分類與過濾 */
var buildLotteryList = function () {
    var showTypes = lotteryCategories();
    var datas = lotteryInfoList();
    if (!showTypes || !datas) return [];

    var result = [];
    var priorityList = [ // 排序彩種清單
        'qqmin', 'qq5fen', 'qq10fen', 't1s300', 't1s60a', 't1s180a', 't1s300a', 't1s600', 'cqssc', 'tjssc', 'xjssc', 'bjssc', 'twssc', 't1s120',
        't1s30', 't1s60', 't1s90', 't1s90d', 't1s90a', 't1s90b', 't1s90c', 't1s30', 't1s180',
        't6s300', 'bjpk10', 't6s120', 't6s180', 'fc3d', 'pl3'
    ];
    // var excludeList = ['hgssc', 'jpssc', 'llssc']; // 排除彩種清單
    /** 取得狀態文字 */
    var setStatus = function (item) {
        if (item.status == -1) return "hot";
        return "";
    }
    /** 取得排序數字 */
    var setSort = function (item) {
        var index = priorityList.indexOf(item.shortName);
        return index > -1 ? index : 100;
    }
    /** 依序放入各分類彩種列表 */
    $.each(showTypes, function (i, v) {
        result.push(datas
            .filter(x => x.showType == v.code) // 過濾showType
            // .filter(x => excludeList.indexOf(x.shortName) < 0) // 排除清單
            .map(x => { return { name: x.showName, keyword: x.shortName, type: x.type, status: setStatus(x), sort: setSort(x) }; }) // 轉換object
            .sort(function (a, b) { return a.sort - b.sort; }) // 依照sort屬性排序小到大
        );
    });
    return result;

    // return [ // 固定資料版
    //     { name: "腾讯分分彩", keyword: "qqmin", type: 1, showType: "ssc" },
    //     { name: "腾讯5分彩", keyword: "qq5fen", type: 1 },
    //     { name: "腾讯十分彩", keyword: "qq10fen", type: 1 },
    //     { name: "河内5分彩", keyword: "t1s300", type: 1, status: "hot" },
    //     // { name: "幸运分分彩", keyword: "t1s60a", type: 1, status: "hot" },
    //     // { name: "幸运三分彩", keyword: "t1s180a", type: 1, status: "hot" },
    //     // { name: "幸运5分彩", keyword: "t1s300a", type: 1, status: "hot" },
    //     // { name: "幸运十分彩", keyword: "t1s600", type: 1, status: "hot" },
    //     { name: "重庆时时彩", keyword: "cqssc", type: 1, status: "hot" },
    //     // { name: "天津时时彩", keyword: "tjssc", type: 1 },
    //     { name: "新疆时时彩", keyword: "xjssc", type: 1 },
    //     // { name: "北京时时彩", keyword: "bjssc", type: 1 },
    //     // { name: "台湾时时彩", keyword: "twssc", type: 1 },
    //     { name: "快乐2分彩", keyword: "t1s120", type: 1 },
    //     { name: "新加坡30秒彩", keyword: "t1s30", type: 2 },
    //     { name: "美国一分彩", keyword: "t1s60", type: 2 },
    //     { name: "韩国1.5分彩", keyword: "t1s90", type: 2 },
    //     { name: "东京1.5分彩", keyword: "t1s90d", type: 2 },
    //     { name: "新德里1.5分彩", keyword: "t1s90a", type: 2 },
    //     { name: "俄罗斯1.5分彩", keyword: "t1s90b", type: 2 },
    //     { name: "印度1.5分彩", keyword: "t1s90c", type: 2 },
    //     { name: "新加坡2分彩", keyword: "sgssc", type: 2 },
    //     { name: "缅甸3分彩", keyword: "t1s180", type: 2 },
    //     { name: "纽约11选5", keyword: "t2s30", type: 3 },
    //     { name: "加拿大11选5", keyword: "t2s90", type: 3 },
    //     { name: "山东11选5", keyword: "sd11x5", type: 3 },
    //     { name: "广东11选5", keyword: "gd11x5", type: 3 },
    //     { name: "江西11选5", keyword: "jx11x5", type: 3 },
    //     { name: "安徽11选5", keyword: "ah11x5", type: 3 },
    //     { name: "上海11选5", keyword: "sh11x5", type: 3 },
    //     { name: "辽宁11选5", keyword: "ln11x5", type: 3 },

    //     { name: "吉隆坡快3", keyword: "t3s90", type: 4 },
    //     { name: "新西兰快3", keyword: "t3s120", type: 4 },
    //     { name: "江苏快3", keyword: "jsk3", type: 4 },
    //     { name: "安徽快3", keyword: "ahk3", type: 4 },
    //     { name: "湖北快3", keyword: "hbk3", type: 4 },
    //     { name: "吉林快3", keyword: "jlk3", type: 4 },
    //     { name: "北京快乐8", keyword: "bjkl8", type: 5 },
    //     { name: "台湾快乐8", keyword: "twkl8", type: 5 },
    //     { name: "韩国快乐8", keyword: "hgkl8", type: 5 },
    //     { name: "东京快乐8", keyword: "jpkl8", type: 5 },
    //     { name: "新加坡快乐8", keyword: "sgkl8", type: 5 },
    //     { name: "幸运飞艇", keyword: "t6s300", type: 6, status: "hot" },
    //     { name: "北京赛车PK拾", keyword: "bjpk10", type: 6, status: "hot" },
    //     { name: "英国120秒赛车", keyword: "t6s120", type: 6 },
    //     { name: "英国180秒赛车", keyword: "t6s180", type: 6 },
    //     { name: "福彩3D", keyword: "fc3d", type: 7 },
    //     { name: "排列三", keyword: "pl3", type: 7 },
    // ];
};

/** 利用中文名或keyword搜尋彩種，返回一般彩種列表內的一筆資料
 * param: { name: 彩種中文名, keyword: 彩種代號 }
 */
var searchLottery = function (param) {
    const allList = buildLotteryList();
    const paramKeys = Object.keys(param);
    let resultItem;
    for (let i = 0; i < allList.length; i++) {
        for (let j = 0; j < paramKeys.length; j++) {
            resultItem = allList[i].find(x => x[paramKeys[j]] == param[paramKeys[j]]);
            if (resultItem) return resultItem;
        }
    }
    return undefined;
}

/** 自訂產生百家樂列表
 * param: {
 *  targetDom(must): 作用目標,
 *  activeTpl(must): 已開通的遊戲template,
 *  notActiveTpl(must): 未開通的遊戲template,
 *  noGameTpl: 無遊戲時的告知用template
 * }
 */
function buildBaccaratList(param) {
    /** 已開通的百家樂添加連結 */
    var gamelink = function (id) {
        $.ajax('/api/game-simulation/enter-game', {
            data: { gameId: id },
            success: function (res) {
                // res = { "error": 0, "code": null, "message": "请求成功", "data": { "forwardGameParams": { "game_url": "http://em.wfyule1.com/api/forward-simulation/forward-mode-direct?params=CI5hkWWTm4h7VpAlR3Tbab83N5Zvz1czxnxw9KaTP1gcXpl4W%2F5hratzF4pAsmy9RPMZe8oqEcMj%0A8Z4vQVKIIBrkHBnjFeD9LmTaMoaboIKQeZ64HFqhuSI6NhuJpS4rUT1o442DjioUirLIw1tlbz5g%0AzH2qt4p3rNz7miVTo0IB%2FPtMK%2FsMgtL0U%2BSwexcwZ1T6nCl5RJ5ADz0tTOUKPcnABnFu4DTo%2Fnev%0AR7%2FBrj32piMelPVXK9o8B9kHLldfS3Zrd11IF7w3muqhTrPZGsVRvvqZUoH9uV9xIIWbjBLjbWX8%0AhnUHR%2Bzye9qoot%2B27FLWEGf3eunxsRgYvgy%2Fdaj2O%2BMIrCM9k%2F8AaG6lNt42wyGkxtEQPEERFlj3%0AmjUpyE3NzanLAL3pBgqzCI%2Bptwpnvm6VjPAPdm9z2UBraraNNwzQzykfZIMlicklbXRFisRnNfKD%0AGBztc%2B%2BjVIspe1U6xPO8N2I78xHkIJCvj4hLNinR7SZgNcsmVIVpESRcxfMhg8Yd6ymon0m%2Ft2dU%0AbIqocsczCgNDRX6drTPAo7Lp7WuIwU7r1gap7Kufh8xydBExLjM7QeGIQCWD1v1Fpykv21w3ohr8%0Ap8z7WczOIP4obopyS%2FF%2BY08BoFW6Phw0Jngw8oxLPJFZCvMCuTJ%2BERthVdwzr4nnPbDP%2FHSTdV27%0AWmVXj8A5D8zLGriHI%2BC8Zu6UUay98%2BAenM5ZSN%2FhqCQ8BAVc9tR9N35%2FmbpdsaZaKfTiMngvqMtR%0Ak%2BitJKsDpawEztEfn49GcHF0mf3nmaLZzIG8i%2BmhJUxpnjub7dZxgBqQJTa%2FO4D9tVF17CjvsrPQ%0AwID4MOmq%2FR2QasIi3XvLkeUqfu0wxGk2gbW0lqbTZsa1%2FGadB1j7%2FFXdiknMzyfqigem9nS3IrfX%0ACIcixXgu%2FGkmwZdP059JFS9Fhx50q9ravIUjxZ%2FR6pDF2pB%2FFz7LftLDOh%2FpOFBBj9CyVHKUfBFk%0Ak%2FzyRXqgQbqEnsf%2BGSZFrjBN5HqUUY7SN6G%2FY2oHDqKWyubillChFuMXbhRGDmlpZMY9OuMfQ21S%0AojmeByqJYJSWBqmwgl6qAiVCDoQk%2BmjpGCM%2BSOqKEW26qUz1ZCUtYrkh6qrVPPRNjf2QbDwPH9Xq%0AvOIQoCcFGkSvFh8B5z5ms6%2BYt8jpxmVv52o5cuOvMAMKopPTWsKjEqzdYBG0IjOZMxNHEe4KomWL%0A7JMYkvFD0IKBMLs8YUMLCBt1P5p5Mw56HPwGDERtG%2Blk0no14%2BY%2FLWmucL4oXNVXHA3AG5KHv6Uu%0AOULrzPzKWA%3D%3D" } } }
                if (res.data && res.data.forwardGameParams && res.data.forwardGameParams.game_url) {
                    link = res.data.forwardGameParams.game_url;
                    let targetItem = param.targetDom.find(`[data-id="${id}"]`);
                    if (targetItem.attr("href")) {
                        targetItem.attr("href", link);
                    } else {
                        targetItem.find(`[data-href="link"]`).attr("href", link);
                    }
                }
            }
        })
    };
    /** 是否開通遊戲的對話 */
    var gameActiveQuestion = function (id, name) {
        AlertUtils.confirm({
            title: '开通游戏',
            icon: 'question',
            content: '确定开通' + name,
            confirmFn: function (index) {
                gameActive(id)
            }
        });
    }
    /** 對話確認後開通遊戲 */
    var gameActive = function (id) {
        $.ajax('/api/game-simulation/register-game', {
            data: { gameId: id },
            success: function (res) {
                if (res.error == 0) {
                    AlertUtils.alert({
                        time: 3000,
                        icon: 'success',
                        content: res.message
                    });
                    window.top.location.reload();
                } else {
                    AlertUtils.alert({
                        time: 3000,
                        icon: 'error',
                        content: res.message
                    });
                }
            }
        });
    }
    /** 查詢百家樂帳戶餘額 */
    var queryBalance = function (id) {
        GamesimulationCtrl.request('QUERY_BALANCE', {
            data: { gameId: id },
            success: function (res) {
                // res = { error: 0, data: { account_balance: 3388 } };
                if (res.data && res.data.account_balance) {
                    let modifyDom = param.targetDom.find('[data-id="' + id + '"] [data-global="queryBalance"]');
                    modifyDom.text(res.data.account_balance);
                    modifyDom.attr('title', res.data.account_balance);
                };

            }
        })
    };
    var buildTpl = function (dataList) {
        // 無百家樂資料時顯示noGameTpl
        if (dataList.length == 0) {
            if (param.noGameTpl) {
                param.targetDom.append(param.noGameTpl());
            }
            return;
        }
        // 有百家樂資料時依照開通狀況建立Tpl及事件
        $.each(dataList, function (i, v) {
            let $newItem;
            if (v.status == 0) { // 已開通
                $newItem = param.activeTpl(v);
                gamelink(v.id);
                queryBalance(v.id);
                // 加掛事件
                $newItem.find('[data-command="baccaratrefresh"]').click(function () {
                    queryBalance(v.id);
                });
            } else { // 未開通
                $newItem = param.notActiveTpl(v);
                if ($newItem.attr('data-result')) {
                    $newItem.click(function () {
                        gameActiveQuestion(v.id, v.name);
                    });
                } else {
                    $newItem.find('[data-result="open"]').click(function () {
                        gameActiveQuestion(v.id, v.name);
                    });
                }

            }
            param.targetDom.append($newItem);
        });
    }

    var interval = setInterval(checkData, 200);
    function checkData() {
        let baccaratList = store.get("PUBLIC:GameBaccaratList");
        if (baccaratList) {
            clearInterval(interval);
            buildTpl(baccaratList);
        };
    }
}

/** 自訂產生線路檢測列表
 * param: {
 *  targetDom(must): 作用目標,
 *  itemTpl(must): 檢測路徑template,
 *  repingDom: 重新檢測的按鈕dom
 *  otherTarget: 其他在刷新速度後要一併更新的畫面dom
 * }
 */
function linesBuilder(param) {

    const key = "PUBLIC:LinesPingList";
    let localSaveObj = store.get(key);
    let pingNum = 0;

    /** 獲取資料 */
    var requestData = function () {
        var url = AppRoute.PATH + AppRoute.Utils.PATH + AppRoute.Utils.DOMAIN_URLS;
        HttpRequest({
            url: url,
            async: false,
            success: function (res) {
                // 模擬6個網站資料 TODO
                // res = Array(6).fill('http://111.68.13.18:9134/member/agent-contract-lower-list.html');
                localSaveObj = res.map(function (item, index) {
                    return { index: index, url: item, ping: 999 };
                });
                buildItems(true);
            }
        });
    }

    /** 建立item */
    var buildItems = function (autoPing) {
        $.each(localSaveObj, function (i, v) {
            let $newItem = param.itemTpl(v);
            param.targetDom.append($newItem);
        });
        if (autoPing) {
            doPing();
        }
    }

    /** 刷新 */
    var doPing = function () {
        pingNum = 0;
        $.each(localSaveObj, function (i, v) {
            ping(v.url).then(function (delta) {
                pingNum++;
                delta = parseInt(delta * 0.75);
                localSaveObj[i].ping = delta;

                // ping完所有路徑後更新store資料與畫面
                if (pingNum == localSaveObj.length) {
                    saveToLocalStorage(); // 資料排序存入store
                    updateTarget(param.targetDom); // 主要目標畫面更新
                    if (param.otherTarget) { // 若有設定其他更新目標則一併更新
                        param.otherTarget.forEach(element => {
                            updateTarget(element);
                        });
                    }
                }
            });
        });
    };

    /** 將當前檢測速度後的資料儲存至local */
    var saveToLocalStorage = function () {
        localSaveObj.sort(function (a, b) {
            return a.ping - b.ping;
        });
        store.set(key, localSaveObj);
    }

    /** 指定targetDom更新速度內容 */
    var updateTarget = function (target) {
        var $item = target.find(".item");
        for (let i = 0; i < localSaveObj.length; i++) {
            var current = $item.eq(i);
            current.find('.speed').html(localSaveObj[i].ping + 'ms');
            current.attr('data_time', localSaveObj[i].ping);
        }
        sortUsingNestedText(target);
    }

    /** 畫面物件速度排序 */
    var sortUsingNestedText = function (target) {
        var items = target.find('.item').sort(function (a, b) {
            var vA = parseInt($(a).attr('data_time'));
            var vB = parseInt($(b).attr('data_time'));
            return vA - vB;
        });

        target.append(items);
    };

    /** 主流程 */
    function start() {
        if (localSaveObj) buildItems();
        else requestData();

        // 重新檢測按鈕事件
        if (param.repingDom) {
            param.repingDom.click(function () {
                doPing();
            });
        }
    }

    ImportUtils.importJS(["/assets/plugins/js-ping/ping.js"])
        .done(() => { start(); });
}
/** header常駐登入位置與ip
 * param: {
 *  targetDom(must): 作用目標
 * }
 */
function buildPositionInfo(param) {
    const key = 'PUBLIC:loginPositionInfo';
    let localStoreData = store.get(key);

    function updateData(data) {
        param.targetDom.find('[data-field="ip"]').html(data.cip);
        param.targetDom.find('[data-field="country"]').html(data.cname);
    }

    if (!localStoreData) {
        ImportUtils.importJS(["https://pv.sohu.com/cityjson"])
            .done(() => {
                localStoreData = returnCitySN;
                store.set(key, localStoreData);
                updateData(returnCitySN);
            });
    } else {
        updateData(localStoreData);
    }
}
/** header常駐安全指數
 * param: {
 *  targetDom(must): 作用目標,
 *  hideDom: 當安全指數最高時要隱藏的畫面dom
 * }
 */
function buildSafetyInfo(param) {
    AccountCtrl.request('GET_BIND_STATUS', {
        success: function (res) {
            if (res.error == 0) {
                var level = 0;
                var text = ['无', '危险', '低', '中', '高'];
                var data = res.data;

                if (data.isBindWithdrawName) { // 綁定取款人
                    level++
                }
                if (data.isBindWithdrawPassword) { // 資金密碼
                    level++
                }
                if (data.isBindCard) { // 銀行卡
                    level++
                }
                if (data.isBindSecurity) { // 密保問題
                    level++
                }

                // 改變星星與安全指數文字
                const stars = param.targetDom.find('.star-row .star');
                stars.siblings().removeClass('active');
                for (let i = 0; i <= level; i++) { stars.eq(i).addClass('active'); }
                param.targetDom.find('.safetyLevel').html(text[level]); // 安全指數文字
                param.targetDom.find('.safetyImg').addClass('safety_' + level); // 安全指數圖片

                if (level == 4 && param.hideDom) {
                    param.hideDom.addClass('hide');
                }
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
}
/** 選單常駐QRCode */
function buildQRCodeList() {
    const setting = [
        {
            url: "GRT_DOWNLOAD_URLS_TITLE",
            key: "PUBLIC:QRCodeNormalUrls",
            sets: [
                { main: "header-code", sub: ["home-code", "right-code"], defaultText: 'Android' }, // main是常駐選單及登入前畫面內的code id(必要), sub是其他頁面需顯示的code id(非必要)
                { main: "header-code2", sub: ["home-code2", "right-code2"], defaultText: 'iOS' },
            ]
        }, {
            url: "GET_VARIABLE_URL",
            key: "PUBLIC:QRCodeVariableUrls",
            sets: [{ main: "header-code3", sub: ["right-code3"], defaultText: '' }]
        }
    ];

    /** 獲取QRCode連結 */
    function requestUrl(settingObj) {
        SystemCtrl.request(settingObj.url, {
            success: function (res) {
                let resData;
                if (settingObj.url == setting[0].url) {
                    // res = [
                    // 	{ title: 'Android', url: 'https://play.google.com/store' },
                    // 	{ title: 'iOS', url: 'https://www.apple.com/' }
                    // ];
                    resData = res;
                }
                if (settingObj.url == setting[1].url) {
                    // res = {
                    //     "error": 0,
                    //     "code": null,
                    //     "message": "请求成功",
                    //     "data": {
                    //         "title": "APP下载地址",
                    //         "url": "http://appdown.1vdmq4.com/shengren_download/"
                    //     }
                    // };
                    resData = [res.data];
                }

                const saveObj = [];
                $.each(resData, function (i, v) {
                    $("#" + settingObj.sets[i].main).qrcode(v.url); // 在畫面上產生QR瑪
                    let newObj = {
                        sets: settingObj.sets[i],
                        title: v.title || settingObj.sets[i].defaultText,
                        url: document.getElementById(settingObj.sets[i].main).getElementsByTagName("canvas")[0].toDataURL('image/png')
                    };
                    saveObj.push(newObj); // 將QR碼的資訊及base64存在local
                    reloadImage(newObj); // 執行圖片與資訊載入步驟
                });
                store.set(settingObj.key, saveObj);
            }
        });
    }

    /** 已有base64時重載圖片 */
    function reloadImage(v) {
        if (!v.url) return;
        function setupImg(id) {
            const target = $("#" + id);
            if (target.children().length == 0) {
                target.html('<canvas width="256" height="256"></canvas>');
                let newImg = new Image();
                let targetCode = document.getElementById(id);
                if (!targetCode) return;
                let ctx = targetCode.getElementsByTagName("canvas")[0].getContext("2d");
                newImg.onload = function () {
                    ctx.drawImage(newImg, 0, 0);
                };
                newImg.src = v.url;
            }
            qrcodeOtherSetup(id, v.title);
        }
        setupImg(v.sets.main);
        if (v.sets.sub) {
            for (let i = 0; i < v.sets.sub.length; i++) { setupImg(v.sets.sub[i]); }
        }
    }

    /** 設定平展標題或Switch型態Tab */
    function qrcodeOtherSetup(id, title) {
        const target = $("#" + id);

        // 平展型態的title文字
        target.parent().find('.title').html(title);
        target.parent().removeClass("hide");

        // switch型態的app download
        const switchLinks = target.parent().parent().find('.qrcode-switch-box');
        if (switchLinks.length > 0) {
            // if (switchLinks.find('.qrcode-switch-link').length > 0) { // 若已有任一tab就放個分隔線
            //     switchLinks.append('<div class="divider"></div>')
            // }
            // let $newLink = $(`<a class="qrcode-switch-link" data-switch="${id}">${title}</a>`);
            // 用圖片
            let $newLink = $(`<a class="qrcode-switch-link" data-switch="${id}">
                    <img src="/assets/images/index/${id}.png">
                </a>`);
            $newLink.click(function () {
                $(this).addClass("active").siblings().removeClass("active");
                $(`#${id}`).addClass("active").siblings().removeClass("active");
            });
            switchLinks.append($newLink)
            if (switchLinks.find('.qrcode-switch-link').length == 1) { // 放入第一個tab後自動點擊觸發
                $newLink.trigger("click");
            }
        }
    }

    /** 主流程 */
    function start() {
        // 嘗試取出不同key的local資料
        const localStoreData = [];
        const len = isLogin ? 2 : 1;
        for (let i = 0; i < len; i++) {
            localStoreData.push(store.get(setting[i].key));
        }

        // 判斷每個key的資料是否存在，並執行對應流程
        for (let i = 0; i < localStoreData.length; i++) {
            if ($.fn.qrcode == undefined && localStoreData[i] == undefined) continue; // 未引用qrcode程式時、或無暫存檔時退出
            if (localStoreData[i] == undefined) { // 無暫存檔時擷取網址轉qrcode
                requestUrl(setting[i]);
            } else { // 有暫存檔時將base64轉為canvas圖片
                localStoreData[i].forEach(v => { reloadImage(v); });
            }
        }
    }

    ImportUtils.importJS(["/assets/js/jquery.qrcode.min.js"])
        .done(() => { start(); });
}
/** 選單常駐熱門彩種
 * param: {
 *  targetDom(must): 作用目標, 
 *  tpl(must): 熱門彩種顯示的template,
 *  limitNum: 上限顯示數字
 * }
 */
function buildHotLotteryList(param) {
    const data = store.get("PUBLIC:GameLotteryConfig").sysLotteryRecomand;
    let limit = data.length;
    if (param.limitNum) {
        limit = (limit > param.limitNum) ? param.limitNum : limit;
    }
    for (let i = 0; i < limit; i++) {
        if (i > 0) {
            param.targetDom.append($(`<div class="divider"></div>`));
        }
        param.targetDom.append($(param.tpl(data[i])));
    }
}
/** 產生指定彩種清單的現在開獎號碼 
 * param: {
    * lotteryList(must): 彩種列表，每項物件須包含{keyword, name}
    * targetDom(must): 容器
    * tpl(must): 各項物件的樣板
    * forceReload: 是否重新獲取資料
 * }
*/
function buildLotteryOpenInfo(param) {
    const key = "PUBLIC:GameLotteryStaticOpenCode";
    let interval;

    /** 獲取所有彩種開獎號 */
    function loadData() {
        GameLotteryCtrl.request('STATIC_OPEN_CODE', {
            data: { history: false },
            success: function (res) {
                store.set(key, res);
                buildList();
            }
        });
    };

    /** 將開獎返回內容與彩種列表資料合併後建立Tpl */
    function buildList() {
        const saveData = store.get(key);
        if (!saveData) return;
        clearInterval(interval);
        Object.keys(saveData).forEach(function (k) {
            const item = param.lotteryList.find(x => x.keyword == k);
            if (item) {
                Object.assign(saveData[k], item);
                buildTpl(saveData[k]);
            }
        });
    }

    /** 建立單一彩種的開獎內容畫面 */
    function buildTpl(data) {
        let result = param.tpl(data);
        let codes = data.code.split(','); // 開獎號碼字串轉為彩球
        let ballAddClass = '';
        switch (codes.length) {
            case 10: ballAddClass = 'size2'; break;
            case 20: ballAddClass = 'size3'; break;
            default: break;
        }
        for (let i = 0; i < codes.length; i++) {
            result.find('.open-code').append($(`<div class="ball ${ballAddClass}">${codes[i]}</div>`));
        }
        param.targetDom.append(result);
        sortUsingNestedText();
    }

    /** 依照data-sort排序 */
    function sortUsingNestedText() {
        var items = param.targetDom.find('.item').sort(function (a, b) {
            var vA = parseInt($(a).attr('data-sort'));
            var vB = parseInt($(b).attr('data-sort'));
            return vA - vB;
        });

        param.targetDom.append(items);
    };

    param.targetDom.empty();
    if (param.forceReload) {
        loadData();
    } else {
        interval = setInterval(buildList, 200);
    }
}

/** 強制排序百家樂(2019/11/13:奧丁排最前) */
function sortBaccarat(data) {
    const priorityList = ['AT'];
    data.forEach(function (x) {
        let index = priorityList.indexOf(x.code);
        x.sort = index > -1 ? index : 100;
    });
    data.sort(function (a, b) { return a.sort - b.sort; }) // 依照sort屬性排序小到大
    return data;
}

(function () {
    /** 刷新百家樂錢包 */
    function listallgames() {
        var requestData = function (cb) {
            GamesimulationCtrl.request('LIST_ALL_GAMES', {
                success: function (res) {
                    // var res = {
                    //     "error": 0, "code": null, "message": "请求成功", "data": {
                    //         "gameList": [
                    //             { "id": 1, "code": "AG", "name": "AG视讯", "status": 0, "platformName": "AG视讯" },
                    //             { "id": 2, "code": "PT", "name": "PT视讯", "status": 0, "platformName": "PT视讯" },
                    //             { "id": 3, "code": "KY", "name": "KY开元棋牌", "status": 0, "platformName": "KY开元棋牌" },
                    //             { "id": 4, "code": "FT", "name": "CMD368体育", "status": -1, "platformName": "CMD368体育" },
                    //             { "id": 5, "code": "GG", "name": "GG捕鱼", "status": -1, "platformName": "GG捕鱼" },
                    //             { "id": 6, "code": "DG", "name": "DG视讯", "status": -1, "platformName": "DG视讯" },
                    //             { "id": 7, "code": "DS", "name": "DS棋牌", "status": -1, "platformName": "DS棋牌" },
                    //             { "id": 8, "code": "AT", "name": "奥丁棋牌", "status": -1, "platformName": "奥丁棋牌" },
                    //         ]
                    //     }
                    // }
                    if (res.error == 0) {
                        store.set('PUBLIC:GameBaccaratList', sortBaccarat(res.data.gameList));
                        cb && cb(sortBaccarat(res.data.gameList));
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
            });
        };
        var updateData = function (data) {
            var account_balance = 0;
            var $monyboxul = $(".moneyBox .wallet");
            var $personalInfoWallets = $(".personal-wallets"); // 個人中心的wallet
            $monyboxul.empty();
            $monyboxul.append('<li>总余额：<span class="rt" data-global="TotalBalance">加载中</span></li>');
            $personalInfoWallets.empty();
            $personalInfoWallets.append(`<img src="/member/images/wallet_title.png">`); // 加上 title
            $.each(data, function (i, v) {
                HttpRequest({
                    url: '/api/game/queryBalance',
                    data: {
                        gameId: v.id
                    },
                    success: function (res) {
                        // res = {error: 0, data: { account_balance: 3388 }};
                        if (res.error == 1) {
                            var mony = '<li>' + v.name + '钱包：<a class="rt">未开通</a><span class="rt">**</span></li>'
                            var piw = `<div class="item">${v.name} <span>未开通</span></div>`;
                        } else {
                            account_balance = Number(account_balance) + Number(res.data.account_balance.toFixed(3));
                            var mony = '<li>' + v.name + '钱包：<a class="rt" href="/member/funds-transfer-wallet.html">转入<a><span class="rt">' + res.data.account_balance.toFixed(3) + '</span></li>'
                            var piw = `<div class="item">${v.name}:<span class="textAuto" title="${res.data.account_balance.toFixed(3)}">${res.data.account_balance.toFixed(3)}</<span></div>`;
                            var lotteryBalance = +$('[data-global="lotteryBalance"]').html();
                            $('[data-global="TotalBalance"]').html(Number(account_balance) + Number(lotteryBalance));
                        }
                        $monyboxul.append(mony);
                        $personalInfoWallets.append(piw);
                    },
                });
            });
            if (!data || data.length == 0) { // 無任何百家樂遊戲
                $personalInfoWallets.append(`<div class="none">目前无任何百家乐账户</div>`);
            }
        };
        requestData(updateData);
    };

    /** 固定時間刷新資料 */
    function loopRequest() {
        HttpRequest({
            url: '/api/loopPage',
            success: function (res) {
                if (res.error == 0) {
                    store.set('PRIVATE:MsgCount', res.data.msgCount);
                    store.transact('PRIVATE:GameLotteryAccount', function (value) {
                        value.availableBalance = res.data.lotteryBalance + res.data.balanceDeposit;
                    });
                    updateLoopData();
                }
            }
        });
    }

    /** Header點擊事件 */
    function headerEvents() {
        const header = $('#toolbar');
        // 登出
        header.find('[data-command="logout"]').click(function () {
            MainCtrl.logout({
                success: function (res) {
                    if (res.error == 0) {
                        store.clear(); // 清空数据
                        window.location.href = '/login.html';
                    }
                },
                complete: function () {
                    window.location.href = '/login.html';
                }
            });
        });
        // 刷新
        // const refreshBtn = header.find('[data-command="refresh"]');
        const refreshBtn = $('[data-command="refresh"]'); // 此專案的home也有refresh, 故改全域搜尋
        refreshBtn.click(function () {
            loopRequest();
            listallgames();
        });

        // 設置時間
        // var getTime = function () {
        //     header.find('.date-time').html(moment().format('YYYY年M月D日 HH:mm:ss dddd'));
        // };
        // getTime();
        // setInterval(getTime, 1000);
    };

    /** 處理global header與member personal-info顯示頭像、登錄訊息 */
    function initPage() {
        AccountCtrl.request('LIST_FULL_INFO', {
            data: {
                showLottery: true,
                showBaccarat: true,
                showInfo: true,
                showLoginLog: true
            },
            success: function (res) {
                if (res.error == 0) {
                    buildAccountInfo(res.data);
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
        });

        /** 設置資料 */
        function buildAccountInfo(data) {
            const targetDoms = ['.personal-info', '.user_data_box', '.member-home-login-info', '.personal-info-baccarat'];
            let setting = [
                { tagName: 'data-field', tagValue: 'username', type: 'html', content: data.account.username },
                { tagName: 'data-field', tagValue: 'nickname', type: 'html', content: data.account.nickname },
                { tagName: 'data-field', tagValue: 'registTime', type: 'html', content: moment(data.account.registTime).format('YYYY-MM-DD HH:mm:ss') },
                { tagName: 'data-field', tagValue: 'lotteryBalance', type: 'html', content: data.accountLottery.availableBalance.toFixed(2) },
            ];
            // 设置头像
            if (data.accountInfo) {
                // 恆心專案特殊需求：用固定頭像
                // setting.push({ tagName: 'data-field', tagValue: 'userImg', type: 'src', content: `/member/images/avatar/${data.accountInfo.avatar}.jpg` });
            }
            // 账户类型
            if (data.accountType) {
                var accountType = data.accountLottery.code + (data.accountLottery.extraPoint > 0 ? ('+' + data.accountLottery.extraPoint + '% ') : ' ') + data.accountType.name;
                setting.push({ tagName: 'data-field', tagValue: 'accountType', type: 'html', content: accountType });
            }
            // 登錄時間與IP
            if (data.accountLoginLog) {
                setting.push({ tagName: 'data-field', tagValue: 'lastLoginTime', type: 'html', content: moment(data.accountLoginLog.loginTime).format('YYYY-MM-DD HH:mm:ss') });
                setting.push({ tagName: 'data-field', tagValue: 'lastLoginIp', type: 'html', content: data.accountLoginLog.ip });
            }
            // 在每個targetDom中填入指定欄位
            targetDoms.forEach(tgd => {
                if ($(tgd).length == 0) {
                    // console.log('Has no targetDom: ', tgd);
                    return;
                }
                setting.forEach(set => {
                    let $thisTarget = $(tgd).find(`[${set.tagName}="${set.tagValue}"]`);
                    if ($thisTarget.length == 0) {
                        // console.log('targetDom:', tgd, ' has no item:', set.tagValue);
                        return;
                    }
                    if (set.type == 'html') $thisTarget.html(set.content);
                    else if (set.type == 'src') $thisTarget.attr('src', set.content);
                });
            });
        };
    };

    //获取契约类型
    if (isLogin) {
        listallgames();
        headerEvents();
        initPage();
        ContractCtrl.request('LOAD_CONTRACT_TYPE', {
            success: function (res) {
                store.set('PRIVATE:salaryType', res.data.salaryType);
                store.set('PRIVATE:dividendType', res.data.dividendType);
            }
        });

        if (isLoop) {
            loopRequest();
            setInterval(loopRequest, 10000);
        }

        /** 個人中心選單顯示 */
        function contractDisplay() {
            if ($('.header .header_list .item.member .sub_menu_area a').length == 0) {
                return;
            } else {
                clearInterval(headerMenuInterval);
            }

            // 帳戶狀態
            var Account = store.get('PRIVATE:Account');
            $('[data-global="username"]').html(Account.username);
            if (Account.type == 1) {
                $('[data-visible="agent"]').removeClass('hide'); // 顯示會員>代理中心
            }
            // 啟用私人信息
            var MsgEnabled = store.get('PRIVATE:MessageEnabled');
            if (MsgEnabled == true) {
                $('[data-global="msgCount"]').removeClass('hide'); // 顯示Header上的Msg數字
                $('[data-visible="message"]').removeClass('hide'); // 顯示會員中心選單的消息中心
            }

            if (Account.type == 1) {
                // 個人中心-契約選單的顯示
                (function () {
                    ContractCtrl.request('LOAD_CONTRACT_STATUS', {
                        success: function (res) {
                            // var res = {"error":0,"code":null,"message":"请求成功","data":{"dividendStatus":1,"salaryStatus":1}}
                            if (res.error == 0) {
                                buildData(res.data);
                            }
                        }
                    });

                    var buildData = function (data) {
                        if (!data) return;
                        if (data && data.salaryStatus != undefined) {
                            var status = data.salaryStatus;
                            $('[data-visible="contract"]').removeClass('hide'); // 主menu 契約中心
                            if (status == 0) {
                                if (!localStorage.isShowContractAlert) {
                                    AlertUtils.confirm({
                                        icon: 'question',
                                        content: '您有新的契约需要同意，是否立即处理？',
                                        confirmFn: function () {
                                            window.location.href = '/member/agent-contract-mime-list.html';
                                        }
                                    });
                                    localStorage.isShowContractAlert = true;
                                }
                            }

                            if (status == 1) {
                                $('[data-visible="contract-lower"]').removeClass('hide'); // 顯示契約下級
                                $('[data-visible="salary-contract"]').removeClass('hide'); // 顯示契約工資
                            }
                        }
                        if (data && data.dividendStatus != undefined) {
                            var status = data.dividendStatus;
                            $('[data-visible="contract"]').removeClass('hide'); // 主menu 棋牌契約
                            if (status == 0) {
                                if (!localStorage.isShowContractAlert) {
                                    AlertUtils.confirm({
                                        icon: 'question',
                                        content: '您有新的契约需要同意，是否立即处理？',
                                        confirmFn: function () {
                                            window.location.href = '/member/agent-contract-mime-list.html';
                                        }
                                    });
                                    localStorage.isShowContractAlert = true;
                                }
                            }
                            if (status == 1) {
                                $('[data-visible="contract-lower"]').removeClass('hide'); // 顯示契約下級
                                $('[data-visible="dividend-contract"]').removeClass('hide'); // 顯示契約分紅
                            }
                        }
                    };
                })();

                // 個人中心-棋牌契約選單的顯示
                (function () {
                    SimulationCtrl.request('LOAD_CONTRACT_STATUS', {
                        success: function (res) {
                            if (res.error == 0) {
                                buildData(res.data);
                            }
                        }
                    });

                    var buildData = function (data) {
                        if (data.salaryStatus != undefined) {
                            var status = data.salaryStatus;
                            $('[data-visible="simulation"]').removeClass('hide');
                            if (status == 0) {
                                if (!localStorage.isShowContractAlert) {
                                    AlertUtils.confirm({
                                        icon: 'question',
                                        content: '您有新的棋牌契约需要同意，是否立即处理？',
                                        confirmFn: function () {
                                            window.location.href = '/member/simulation-contract-mime-list.html';
                                        }
                                    });
                                    localStorage.isShowContractAlert = true;
                                };
                            };

                            if (status == 1) {
                                $('[data-visible="simulation-lower"]').removeClass('hide'); // 顯示工資契約下級
                                $('[data-visible="salary-simulation"]').removeClass('hide'); // 顯示棋牌契約工資
                            };
                        };
                    };
                })();
            };
        }
        var headerMenuInterval = setInterval(contractDisplay, 200);

        /** 今日充值、提現、轉帳等數字 */
        function walletToday() {
            targetDom = $('.wallet-today')
            AccountCtrl.request('REPORT_GAME_LOTTERY', {
                data: {
                    sDate: moment().format('YYYY-MM-DD'),
                    eDate: moment().add(1, 'days').format('YYYY-MM-DD'),
                },
                success: function (res) {
                    if (res.error == 0) {
                        function setNum(numDom, numData) {
                            numDom.html(numData);
                            numDom.attr('title', numData);
                        }
                        setNum(targetDom.find('[data-wallet="rechargeToday"]'), res.data[0].recharge.toFixed(3));
                        setNum(targetDom.find('[data-wallet="withdrawToday"]'), res.data[0].withdraw.toFixed(3));
                        setNum(targetDom.find('[data-wallet="profitToday"]'), res.data[0].profit.toFixed(3));
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
            });
        }
        walletToday();
    }
})();
