$(document).ready(function () {

	var post_flag = false; //设置一个对象来控制是否进入AJAX过程


	var thisPanel = $('.main-panel');
	// 请求数据
	var reqData = {
		page: 0,
		size: 10
	};

	// 接受数据
	var resData = {};

	// 初始化分页
	var easyPage;
	var initPage = function () {
		var element = thisPanel.find('.easy-page');
		if (easyPage) return; // 已经初始化过的不能初始化
		easyPage = element.EasyPage({
			showPage: 6,
			pageSize: reqData.size,
			onPage: function (page) {
				reqData.page = page - 1;
				doSearch(); // 调用搜索
			}
		});
		easyPage.init();
	};

	// 更新分页
	var updatePage = function () {
		easyPage.update(resData.totalCount, reqData.page + 1);
	};

	// 搜索条件
	var initReqData = function () {
		var p = thisPanel.find('.form-search');
		reqData.gameId = p.find('select[name="lottery"]').val();
		reqData.billno = p.find('input[name="billno"]').val();
		reqData.sTime = p.find('input[name="sDate"]').val();
		reqData.eTime = p.find('input[name="eDate"]').val();
	};


	// 查询
	var doSearch = function () {
		initReqData();
		GamesimulationCtrl.request('SEARCH_TRANSFER', {
			data: reqData,
			beforeSend: function () {
				thisPanel.ajaxLoading(true);
			},
			success: function (res) {
				res.error = 0
				if (res.error == 0) {
					resData = res.data;
					buildData();
					updatePage();
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
			complete: function () {
				thisPanel.ajaxLoading(false);
			}
		});
	};

	// 构建空数据
	var buildEmptyData = function () {
		if (resData.list.length > 0) {
			thisPanel.find('.table-responsive').removeClass('hide');
			thisPanel.find('.empty-data').addClass('hide');
		} else {
			thisPanel.find('.table-responsive').addClass('hide');
			thisPanel.find('.empty-data').removeClass('hide');
		}
	};

	// 构建数据
	var buildData = function () {
		var $thisTable = thisPanel.find('table');
		$thisTable.find('tbody').empty();

		if (resData.list.length > 0) {
			$.each(resData.list, function (i, v) {

				if (v.direction == "O") {
					btnInfos = v.platform + '平台-百家乐账户-彩票账户';
				} else {
					btnInfos = '彩票账户-百家乐账户-' + v.platform + '平台';
				}
				var tpl =
					'<tr>\
						<td class="text-center">' + v.platform + '</td>\
                        <td class="text-center">' + v.billno + '</td>\
                        <td class="text-center">' + v.amount.toFixed(2) + '</td>\
                        <td class="text-center">' + v.balanceBefore.toFixed(2) + '</td>\
                        <td class="text-center">' + v.balanceAfter.toFixed(2) + '</td>\
                        <td class="text-center">' + moment(v.time).format('YYYY-MM-DD HH:mm:ss') + '</td>\
						<td class="text-center">' + btnInfos + '</td>\
                        <td class="text-center">' + v.status + '</td>\
                    </tr>';
				var $thisRow = $(tpl);
				$thisTable.find('tbody').append($thisRow);
			});
		}
		buildEmptyData();
	};

	// 搜索按钮
	thisPanel.find('[data-command="search"]').click(function () {
		easyPage.init();
	});

	// 初始化搜索
	var initSearchForm = function () {
		var p = thisPanel.find('.form-search');
		p.find('input[name="sDate"]').val(moment().format('YYYY-MM-DD'));
		p.find('input[name="eDate"]').val(moment().add(1, 'days').format('YYYY-MM-DD'));
		initDatePicker(p);
	};


	// 列出所有游戏
	var listinit = function () {

		GamesimulationCtrl.request('LIST_ALL_GAMES', {
			success: function (res) {
				// var res = { 
				// 	"error": 0, "code": null, "message": "请求成功", 
				// 	"data": { 
				// 		"gameList": [
				// 			{ "id": 1, "code": "AG", "name": "AG视讯", "status": 0, "platformName": "AG视讯" }, 
				// 			{ "id": 2, "code": "PT", "name": "PT视讯", "status": 0, "platformName": "PT视讯" }, 
				// 			{ "id": 3, "code": "KY", "name": "KY开元棋牌", "status": -1, "platformName": "KY开元棋牌" }, 
				// 			{ "id": 3, "code": "DS", "name": "DS棋牌", "status": 0, "platformName": "DS棋牌" }, 
				// 			{ "id": 4, "code": "FT", "name": "CMD368体育", "status": -1, "platformName": "CMD368体育" }, 
				// 			{ "id": 5, "code": "GG", "name": "GG捕鱼", "status": -1, "platformName": "GG捕鱼" },
				// 			{ "id": 6, "code": "TS", "name": "外盤", "status": -1, "platformName": "外盤" },
				// 			{ "id": 7, "code": "DG", "name": "DG视讯", "status": 0, "platformName": "DG视讯" }, 
				// 			{ "id": 8, "code": "AT", "name": "奥丁棋牌", "status": 0, "platformName": "奥丁棋牌" },
				// 		]
				// 	}
				// };
				if (res.error == 0) {
					var data = sortBaccarat(res.data.gameList);
					//$.each(data, function (i, v) {
					for (var i = 0; i < data.length; i++) {
						var search_con = '<option value="' + data[i].id + '">' + data[i].name + '</option>'
						var search_list = $('[name="lottery"]')
						status = data[i].status;

						if (status != 0) {
							Tel = `
							<li class="gameItem" data-id="${data[i].id}" data-name="${data[i].name}" >
								<div class="name">
									<img class="icon" src="./images/${data[i].code}.png" alt="">
								</div>
								<div class="unactive">游戏未开通</div>
								<div class="transfer-money disable" >
									<input onkeyup="value=value.replace(/[^\\d]/g,'')" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\\d]/g,''))"  name="transfermony" type="text" placeholder="转账金额">
									<div>
										<a class="hover" data-command="lotterytogame">转入</a>
										<a class="hover" data-command="gametolottery">转出</a>
									</div>
								</div>
								<a data-result="open" class="play-btn hover">开通游戏 <img src="/member/images/baccarat_arrow_right.png" /></a>
							</li>`;
						} else {

							Tel = `
							<li class="gameItem" data-id="${data[i].id}" data-name="${data[i].name}">
								<div class="name">
									<img class="icon" src="./images/${data[i].code}.png" alt="">
								</div>
								<div class="name-cn">${data[i].name}</div>
								<div class="money">
									<div>余额：<span data-global="queryBalance">0</span> 元</div>
									<a data-command="baccaratrefresh" class="refresh"></a>
								</div>
								<div class="transfer-money" >
									<input onkeyup="value=value.replace(/[^\\d]/g,'')" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\\d]/g,''))"  name="transfermony" type="text" placeholder="转账金额">
									<div>
										<a class="hover" data-command="lotterytogame">转入</a>
										<a class="hover" data-command="gametolottery">转出</a>
									</div>
								</div>
								<a target="_blank" href="#" data-herf="link" class="play-btn hover">进入游戏 <img src="/member/images/baccarat_arrow_right.png" /></a>
							</li> `

						}

						var list = $(".transfer-wallet ul")

						list.append(Tel);
						search_list.append(search_con);
						querybalance(data[i].id);
						gamelink(data[i].id);
					}
					//});
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

		//获取进入游戏url
		var gamelink = function (id) {
			GamesimulationCtrl.request('ENTER_GAME', {
				data: { gameId: id },
				success: function (res) {
					if (res.data && res.data.forwardGameParams) {
						link = res.data.forwardGameParams.game_url;
						$('[data-id="' + id + '"]').find('[data-herf="link"]').attr("href", link)
					};

				}
			})
		};
		//从百家乐账户转入游戏账户
		$(document).on('click', '[data-command="lotterytogame"]', function () {
			var amount = $(this).parents(".gameItem").find("input").val();
			var name = $(this).parents(".gameItem").attr("data-name");
			var gameId = $(this).parents(".gameItem").attr("data-id");
			if (amount == "") {
				AlertUtils.alert({
					time: 3000,
					icon: 'error',
					content: '请输入金额'
				});
			} else {

				AlertUtils.confirm({
					title: '确认转账',
					icon: 'question',
					content: '转入' + amount + '元至' + name + '游戏？',
					confirmFn: function (index) {
						if (post_flag) return;
						lotterytogame(gameId, amount);
						post_flag = true;
					}
				});
			};
		});
		//开通游戏
		$(document).on('click', '[data-result="open"]', function () {
			var gameId = $(this).parents(".gameItem").attr("data-id");
			var name = $(this).parents(".gameItem").attr("data-name");
			AlertUtils.confirm({
				title: '开通游戏',
				icon: 'question',
				content: '确定开通' + name + "吗?",
				confirmFn: function (index) {
					openGame(gameId)
				}
			});
		})
		//刷新按钮
		$(document).on('click', '[data-command="baccaratrefresh"]', function () {
			var gameId = $(this).parents(".gameItem").attr("data-id");
			querybalance(gameId);
		})
		//从游戏账户转入百家乐账户
		$(document).on('click', '[data-command="gametolottery"]', function () {
			var amount = $(this).parents(".gameItem").find("input").val();
			var name = $(this).parents(".gameItem").attr('data-name');
			var gameId = $(this).parents(".gameItem").attr("data-id");
			if (amount == "") {
				AlertUtils.alert({
					time: 3000,
					icon: 'error',
					content: '请输入金额'
				});
			} else {

				AlertUtils.confirm({
					title: '确认转账',
					icon: 'question',
					content: '从' + name + '游戏转出' + amount + '元至彩票账户？',
					confirmFn: function (index) {
						if (post_flag) return;
						gametolottery(gameId, amount);
						post_flag = true;
					}
				});

			};
		});
	};
	//查询账户余额
	var querybalance = function (id) {
		GamesimulationCtrl.request('QUERY_BALANCE', {
			data: { gameId: id },
			success: function (res) {
				// res = {error: 0, data: { account_balance: 3388 }};
				if (res.data && res.data.account_balance) {
					money = res.data.account_balance;
					$('[data-id="' + id + '"]').find('[data-global="queryBalance"]').text(money)
				};

			}
		})
	};
	//彩票账户转账到游戏账户

	var lotterytogame = function (id, amount) {
		GamesimulationCtrl.request('TRANSFER_LOTTERY_TO_GAME', {
			type: "POST",
			data: { gameId: id, amount: amount },
			success: function (res) {
				if (res.error == 0) {
					AlertUtils.alert({
						time: 3000,
						icon: 'success',
						content: '充值成功'
					});
					querybalance(id);
					easyPage.init();
				} else {
					AlertUtils.alert({
						time: 3000,
						icon: 'error',
						content: res.message
					});
				}
				post_flag = false;
			}
		})
	}
	//游戏转账到彩票账户
	var gametolottery = function (id, amount) {
		GamesimulationCtrl.request('TRANSFER_GAME_TO_LOTTERY', {
			type: "POST",
			data: { gameId: id, amount: amount },
			success: function (res) {
				if (res.error == 0) {
					AlertUtils.alert({
						time: 3000,
						icon: 'success',
						content: '转账成功'
					});
					querybalance(id);
					easyPage.init();

				} else {
					AlertUtils.alert({
						time: 3000,
						icon: 'error',
						content: res.message
					});
				}
				post_flag = false;
			}
		})
	}
	//开通游戏
	var openGame = function (id) {
		GamesimulationCtrl.request('REGISTER_GAME', {
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
		})
	}
	// 初始化
	initSearchForm();
	initPage();
	listinit();


});