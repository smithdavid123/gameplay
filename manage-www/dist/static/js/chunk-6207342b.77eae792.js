(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6207342b"],{"01e7":function(e,t,a){"use strict";a.r(t),a("a4d3"),a("4de4"),a("4160"),a("e439"),a("dbb4"),a("b64b"),a("159b");var n=a("2fa7"),r=a("e6b9"),i=(a("13d5"),a("d3b7"),a("ac1f"),a("5319"),a("ddb0"),a("533a")),l=i.keys().reduce((function(e,t){var a=t.replace(/^\.\/(.*)\.\w+$/,"$1"),n=i(t).default;return e[a]=n,e}),{});function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}var s={components:function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(a,!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({moduleTags:r.a},l),data:function(){return{active:"order",tags:[{label:"订单查询",value:"order"},{label:"追号查询",value:"append"},{label:"第三方记录",value:"record"}]}}},p=a("2877"),u=Object(p.a)(s,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("moduleTags",{attrs:{tags:e.tags,active:e.active},on:{"update:active":function(t){e.active=t}}}),a(e.active,{tag:"component"})],1)}),[],!1,null,null,null);t.default=u.exports},"01f8":function(e,t,a){"use strict";a.r(t),a("4de4"),a("4160"),a("d81d"),a("b0c0"),a("b64b"),a("d3b7"),a("159b"),a("96cf");var n=a("2ddf"),r=a("3620"),i={mixins:[n.a],data:function(){var e=this;return{loading:!1,total:0,listQuery:{pageNumber:1,pageSize:20,orderCode:"",memberName:"",betPeriod:"",orderStatus:"",beginTime:"",endTime:"",lotteryCode:"",lotteryBetName:""},queryColumns:[{type:"input",prop:"orderCode",label:"订单编号"},{type:"input",prop:"memberName",label:"会员名称"},{type:"date",prop:["beginTime","endTime"],label:"下单时间"},{type:"input",prop:"betPeriod",label:"投注期号"},{type:"select",prop:"orderStatus",label:"状态",allName:"请选择",options:r.d},{type:"select",prop:"lotteryCode",label:"彩种",allName:"请选择",options:[]},{type:"select",prop:"lotteryBetName",label:"玩法",allName:"请选择",options:[]}],tableColumns:[{type:"selection",width:"55",align:"center"},{label:"订单编号",prop:"billno",align:"center",minWidth:"15%",visible:!0},{label:"投注时间",prop:"orderTime",align:"center",minWidth:"10%",visible:!0,render:function(t){return e.$format(t.orderTime,"yyyy-MM-dd HH:mm:ss")}},{label:"用户",prop:"account",align:"center",minWidth:"8%",visible:!0},{label:"彩种",prop:"lottery",align:"center",minWidth:"8%",visible:!0},{label:"玩法",prop:"method",align:"center",minWidth:"8%",visible:!0},{label:"期号",prop:"issue",align:"center",minWidth:"8%",visible:!0},{label:"投注金额",prop:"money",align:"center",minWidth:"8%",visible:!0},{label:"中奖金额",prop:"winMoney",align:"center",minWidth:"8%",visible:!0},{label:"盈亏",align:"center",minWidth:"8%",visible:!0,slotName:"platformLoss-column"},{label:"投注内容",prop:"content",align:"left",minWidth:"17%",visible:!1},{label:"状态",prop:"status",align:"center",minWidth:"8%",visible:!0,slotName:"status-column"}],data:[],countData:{},activeName:"detail",detailVisible:!1,currentOrder:{},form:{orderMemberName:"",lotteryName:"",lotteryBetName:"",orderCode:"",betPeriod:"",betModel:"",betMoney:"",bingoBonus:"",betRebates:"",drawNumber:"",betTime:"",orderStatus:"",orderType:"",regSource:"",betCount:"",content:""},columns:[{span:8,type:"input",label:"用户名",prop:"orderMemberName",readonly:!0},{span:8,type:"input",label:"彩种",prop:"lotteryName",readonly:!0},{span:8,type:"input",label:"玩法",prop:"lotteryBetName",readonly:!0},{span:8,type:"input",label:"订单编号",prop:"orderCode",readonly:!0},{span:8,type:"input",label:"彩期期号",prop:"betPeriod",readonly:!0},{span:8,type:"input",label:"倍数模式",prop:"betModel",readonly:!0},{span:8,type:"input",label:"投注金额",prop:"betMoney",readonly:!0},{span:8,type:"input",label:"中奖金额",prop:"bingoBonus",readonly:!0},{span:8,type:"input",label:"动态返点",prop:"betRebates",readonly:!0},{span:8,type:"input",label:"开奖号码",prop:"drawNumber",readonly:!0},{span:8,type:"input",label:"投注时间",prop:"betTime",readonly:!0},{span:8,type:"input",label:"订单状态",prop:"orderStatus",readonly:!0},{span:8,type:"input",label:"订单类型",prop:"orderType",readonly:!0},{span:8,type:"input",label:"订单来源",prop:"regSource",readonly:!0},{span:8,type:"input",label:"投注注数",prop:"betCount",readonly:!0},{span:24,type:"textarea",label:"投注内容",prop:"content",readonly:!0}],checked:[],confirmVisible:!1}},watch:{"listQuery.lotteryCode":function(e){if(e){var t=this.lotteryList.filter((function(t){return t.lottery===e}))[0].type;this.queryColumns[6].options=this.methodList[t].map((function(e){return{label:e.name,value:e.methodName}}))}else this.listQuery.lotteryBetName="",this.queryColumns[6].options=[]}},mounted:function(){this.getGameList(),this.getList()},methods:{getGameList:function(){var e,t,a,n;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,regeneratorRuntime.awrap(this.$api.listGameMethod());case 2:e=r.sent,t=e.data,a=t.lotterys,n=t.methods,this.lotteryList=a,this.methodList=n,this.queryColumns[5].options=a.map((function(e){return{label:e.showName,value:e.lottery}}));case 8:case"end":return r.stop()}}),null,this)},getList:function(){var e,t,a,n,r,i;return regeneratorRuntime.async((function(l){for(;;)switch(l.prev=l.next){case 0:return this.loading=!0,l.next=3,regeneratorRuntime.awrap(this.$api.orderList(this.listQuery));case 3:e=l.sent,t=e.data,a=t.totalCount,n=t.winMoneySum,r=t.moneySum,i=t.list,this.total=a,this.data=i,this.countData={money:r,winMoney:n},this.loading=!1;case 10:case"end":return l.stop()}}),null,this)},handleSearch:function(){this.listQuery.pageNumber=1,this.getList()},systemCancelOrder:function(){var e,t;return regeneratorRuntime.async((function(a){for(;;)switch(a.prev=a.next){case 0:return e={username:this.checked[0].account,billno:this.checked[0].billno},a.next=3,regeneratorRuntime.awrap(this.$api.systemCancelOrder(e));case 3:t=a.sent,t.error&&this.$message.success("提交成功"),this.getList(),this.confirmVisible=!1;case 8:case"end":return a.stop()}}),null,this)},handleDetail:function(e){var t=this;this.currentOrder=e,this.detailVisible=!0,this.$nextTick((function(){t.$refs.jsonForm.clearValidate(),Object.keys(t.form).forEach((function(a){t.form[a]="orderMemberName"===a?e.map.memberName:e[a]}))}))}}},l=a("2877"),o=Object(l.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div",[a("div",{staticClass:"primary-btn",on:{click:function(t){e.checkValidate()&&(e.confirmVisible=!0)}}},[a("svg-icon",{attrs:{"icon-class":"stop"}}),e._v("系统撤单 ")],1)]),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,"show-summary":!0,summary:e.countData,height:"calc(100vh - 300px)",page:e.listQuery.pageNumber},on:{"update:page":function(t){return e.$set(e.listQuery,"pageNumber",t)},"selection-change":function(t){e.checked=t},pagination:e.getList},scopedSlots:e._u([{key:"billno-column",fn:function(t){var n=t.row;return[a("span",{staticClass:"link-type",on:{click:function(t){return e.handleDetail(n)}}},[e._v(e._s(n.billno))])]}},{key:"platformLoss-column",fn:function(t){var n=t.row;return[a("span",{class:[n.winMoney-n.money<0?"text-red":"text-green"]},[e._v(e._s((n.winMoney-n.money).toFixed(2)))])]}},{key:"status-column",fn:function(t){var n=t.row;return[a("div",{class:e._f("formatteOrderStatusTagClass")(n.status)},[e._v(" "+e._s(e._f("formatteOrderStatus")(n.status))+" ")])]}}])})],1),a("el-dialog",{directives:[{name:"drag-dialog",rawName:"v-drag-dialog"}],attrs:{title:"信息",visible:e.confirmVisible,width:"300px",top:"40vh"},on:{"update:visible":function(t){e.confirmVisible=t}}},[a("p",[e._v(" 确认对订单进行系统撤单吗? ")]),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("div",{staticClass:"primary-btn",on:{click:e.systemCancelOrder}},[e._v(" 确认 ")]),a("div",{staticClass:"disabled-btn",staticStyle:{"margin-left":"16px"},on:{click:function(t){e.confirmVisible=!1}}},[e._v(" 取消 ")])])]),a("el-dialog",{directives:[{name:"drag-dialog",rawName:"v-drag-dialog"}],staticClass:"tab-dialog",attrs:{visible:e.detailVisible,width:"80%"},on:{"update:visible":function(t){e.detailVisible=t}}},[a("el-tabs",{model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"订单详情",name:"detail"}})],1),a("div",{staticClass:"module-form-scroll"},[a("el-scrollbar",[a("json-form",{ref:"jsonForm",staticClass:"primary-label-form",attrs:{form:e.form,columns:e.columns}})],1)],1)],1)],1)}),[],!1,null,null,null);t.default=o.exports},"533a":function(e,t,a){var n={"./append.vue":"9c2a","./order.vue":"01f8","./record.vue":"7950"};function r(e){var t=i(e);return a(t)}function i(e){if(!a.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}r.keys=function(){return Object.keys(n)},r.resolve=i,e.exports=r,r.id="533a"},7950:function(e,t,a){"use strict";a.r(t),a("d3b7");var n=a("dfdf"),r=(a("96cf"),a("2ddf")),i=a("3620"),l={mixins:[r.a],data:function(){var e=this;return{loading:!1,total:0,listQuery:{pageNumber:1,billNo:"",memberName:"",mainbillno:"",betAmountFrom:"",betAmountTo:"",netAmountFrom:"",netAmountTo:"",gameType:"",betContent:"",beginBetTime:"",endBetTime:"",beginDrawTime:"",endDrawTime:"",agentCode:"",flag:"",include:0},queryColumns:[{type:"select",prop:"agentCode",label:"第三方",allName:"请选择",options:i.e},{type:"input",prop:"billNo",label:"订单编号"},{type:"input",prop:"memberName",label:"会员名称"},{type:"input",prop:"mainbillno",label:"期号"},{type:"select",prop:"flag",label:"状态",allName:"请选择",options:i.b},{type:"rangeInput",prop:["betAmountFrom","betAmountTo"],label:"下注金额"},{type:"rangeInput",prop:["netAmountFrom","netAmountTo"],label:"派彩"},{type:"input",prop:"gameType",label:"游戏类型"},{type:"input",prop:"betContent",label:"下注记录详情"},{type:"check",prop:"include",label:"包含下级"},{type:"date",prop:["beginBetTime","endBetTime"],label:"下单时间"},{type:"date",prop:["beginDrawTime","endDrawTime"],label:"开彩时间"}],tableColumns:[{type:"selection",width:"55",align:"center",visible:!0},{prop:"playerName",label:"用户名",minWidth:"12%",align:"center",visible:!0,slotName:"playerName-column"},{prop:"billNo",label:"投注编号",minWidth:"12%",align:"center",visible:!0},{prop:"map.thirdName",label:"第三方",minWidth:"12%",align:"center",visible:!0},{prop:"gameType",label:"游戏类型",minWidth:"8%",align:"center",visible:!0},{prop:"platformType",label:"平台类型",minWidth:"8%",align:"center",visible:!0,slotName:"platformType-column"},{prop:"betAmount",label:"下注金额",minWidth:"8%",align:"center",visible:!0},{prop:"validBetAmount",label:"有效投注额",minWidth:"8%",align:"center",visible:!0},{prop:"netAmount",label:"派彩",minWidth:"12%",align:"center",visible:!0},{prop:"betTime",label:"下注时间",minWidth:"12%",align:"center",visible:!0,render:function(t){return e.$format(t.betTime,"yyyy-MM-dd HH:mm:ss")}},{prop:"drawTime",label:"开彩时间",minWidth:"12%",align:"center",visible:!0,render:function(t){return e.$format(t.drawTime,"yyyy-MM-dd HH:mm:ss")}},{prop:"flag",label:"结算状态",minWidth:"8%",align:"center",visible:!0,slotName:"flag-column"},{prop:"betContent",label:"下注记录详情",minWidth:"8%",align:"center",visible:!0}],data:[{map:{thirdName:"AG视讯"},agOrderRecordId:8373111,billNo:"200307094489176",playerName:"jie00000",agentCode:"AG",netAmount:-1e3,betTime:1583586271e3,drawTime:1583586296e3,gameType:"牛牛",betAmount:1e3,flag:"1",platformType:"1",round:"1",leagueCode:"jj138",memberId:241567,groupId:"166575,166981,167024,167033,167183,172312,172313,241564,241567,",sharding:105,createDate:1583586307e3,updateDate:1583586307e3,validBetAmount:1e3,transferFlag:0}],countData:{map:{},netAmount:-6285.13,betAmount:152244.01,validBetAmount:151295.26},checked:[],confirmVisible:!1,confirmType:0}},computed:{confirmStype:function(){return this.confirmType?"确认进行撤单吗 ?（只针对未结算订单）":"确认对数据进行无效处理吗?"}},created:function(){},methods:{getList:function(){var e,t,a,n;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return this.loading=!0,r.next=3,regeneratorRuntime.awrap(this.$api.agList(this.listQuery));case 3:e=r.sent,t=e.data,a=t.count,n=t.list,this.total=a,this.data=n,this.loading=!1;case 9:case"end":return r.stop()}}),null,this)},handleSearch:function(){this.listQuery.pageNumber=1,this.getList(),this.getCount()},getCount:function(){var e,t;return regeneratorRuntime.async((function(a){for(;;)switch(a.prev=a.next){case 0:return e=this.listQuery,e.pageNumber,t=Object(n.a)(e,["pageNumber"]),a.next=3,regeneratorRuntime.awrap(this.$api.agTotal(t));case 3:this.countData=a.sent;case 4:case"end":return a.stop()}}),null,this)},handleDetail:function(e){},handleConfirm:function(e){this.confirmType=e,this.confirmVisible=!0},sureConfirm:function(){return regeneratorRuntime.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.confirmType){e.next=5;break}return e.next=3,regeneratorRuntime.awrap(this.$api.cancelUnsettleOrder({ids:this.checked[0].agOrderRecordId,shardings:this.checked[0].shardings}));case 3:e.next=7;break;case 5:return e.next=7,regeneratorRuntime.awrap(this.$api.invalid({ids:this.checked[0].agOrderRecordId,shardings:this.checked[0].shardings}));case 7:case"end":return e.stop()}}),null,this)}}},o=a("2877"),s=Object(o.a)(l,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div",[a("div",{staticClass:"primary-btn",on:{click:function(t){e.checkValidate()&&e.handleConfirm(0)}}},[a("svg-icon",{attrs:{"icon-class":"stop"}}),e._v("无效处理 ")],1),a("div",{staticClass:"primary-btn",on:{click:function(t){e.checkValidate()&&e.handleConfirm(1)}}},[a("svg-icon",{attrs:{"icon-class":"stop"}}),e._v("撤销未结算订单 ")],1)]),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,"hidden-summary":!1,summary:e.countData,height:"calc(100vh - 342px)",page:e.listQuery.pageNumber},on:{"update:page":function(t){return e.$set(e.listQuery,"pageNumber",t)},"selection-change":function(t){e.checked=t},pagination:e.getList},scopedSlots:e._u([{key:"playerName-column",fn:function(t){var n=t.row;return[a("span",{staticClass:"link-type",on:{click:function(t){return e.handleDetail(n)}}},[e._v(e._s(n.playerName))])]}},{key:"platformType-column",fn:function(t){var n=t.row;return[a("div",{class:e._f("formatterPlatformTypeTagClass")(n.platformType)},[e._v(" "+e._s(e._f("formatterPlatformType")(n.platformType))+" ")])]}},{key:"flag-column",fn:function(t){var n=t.row;return[a("div",{class:e._f("formatterFlagTagClass")(n.flag)},[e._v(" "+e._s(e._f("formatterFlag")(n.flag))+" ")])]}}])})],1),a("el-dialog",{directives:[{name:"drag-dialog",rawName:"v-drag-dialog"}],attrs:{title:"信息",visible:e.confirmVisible,width:"300px",top:"40vh"},on:{"update:visible":function(t){e.confirmVisible=t}}},[a("p",[e._v(" "+e._s(e.confirmStype)+" ")]),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("div",{staticClass:"primary-btn small-btn",on:{click:e.sureConfirm}},[e._v(" 确认 ")]),a("div",{staticClass:"disabled-btn small-btn ml16",on:{click:function(t){e.confirmVisible=!1}}},[e._v(" 取消 ")])])])],1)}),[],!1,null,null,null);t.default=s.exports},"866f":function(e,t,a){"use strict";var n=a("be57");a.n(n).a},"9c2a":function(e,t,a){"use strict";a.r(t),a("4de4"),a("4160"),a("d81d"),a("b0c0"),a("b64b"),a("d3b7"),a("159b"),a("96cf");var n=a("3620"),r={data:function(){return{loading:!1,total:0,listQuery:{pageNumber:1,appendCode:"",memberName:"",appendStatus:"",beginTime:"",endTime:"",lotteryCode:"",lotteryBetName:""},lotteryList:[],methodList:[],queryColumns:[{type:"input",prop:"appendCode",label:"订单编号"},{type:"input",prop:"memberName",label:"会员名称"},{type:"date",prop:["beginTime","endTime"],label:"下单时间"},{type:"select",prop:"appendStatus",label:"状态",allName:"请选择",options:n.a},{type:"select",prop:"lotteryCode",label:"彩种",allName:"请选择",options:[]},{type:"select",prop:"lotteryBetName",label:"玩法",allName:"请选择",options:[]}],tableColumns:[{label:"订单编号",prop:"billno",align:"center",minWidth:"18%",visible:!0},{label:"投注时间",prop:"orderTime",align:"center",minWidth:"10%",visible:!0},{label:"用户",prop:"account",align:"center",minWidth:"10%",visible:!0},{label:"彩种",prop:"lottery",align:"center",minWidth:"10%",visible:!0},{label:"玩法",prop:"method",align:"center",minWidth:"10%",visible:!0},{label:"开始期号",prop:"startIssue",align:"center",minWidth:"10%",visible:!0},{label:"投注内容",prop:"content",align:"left",minWidth:"15%",visible:!0},{label:"投注类型",prop:"appendType",align:"left",minWidth:"10%",visible:!1,filter:"formatterAppendType"},{label:"总金额",prop:"totalMoney",align:"center",width:"80px",visible:!0},{label:"中奖金额",prop:"winMoney",align:"center",width:"100px",visible:!0},{label:"追号期数",prop:"totalCount",align:"center",width:"100px",visible:!0},{label:"追号完成期数",prop:"donePeriodNum",align:"center",width:"120px",visible:!1},{label:"注数",prop:"nums",align:"center",width:"80px",visible:!0},{label:"状态",prop:"status",align:"center",minWidth:"10%",visible:!0,slotName:"appendStatus-column"}],data:[],countData:{map:{},appendTotalMoney:46455.630000000005,doneMoney:23187.71},detailVisible:!1,activeName:"info",form:{orderMemberName:"zxc12340",lotteryName:"",lotteryBetName:"",orderCode:"",betPeriod:"",betModel:"",betMoney:"",bingoBonus:"",betRebates:"",drawNumber:"",betTime:"",orderStatus:"",orderType:"",regSource:"",betCount:"",content:""},columns:[{span:8,type:"input",label:"用户名",prop:"orderMemberName",readonly:!0},{span:8,type:"input",label:"彩种",prop:"lotteryName",readonly:!0},{span:8,type:"input",label:"玩法",prop:"lotteryBetName",readonly:!0},{span:8,type:"input",label:"订单编号",prop:"appendCode",readonly:!0},{span:8,type:"input",label:"开始期号",prop:"startPeriod",readonly:!0},{span:8,type:"input",label:"追号期数",prop:"appendPeriodNum",readonly:!0},{span:8,type:"input",label:"完成期数",prop:"donePeriodNum",readonly:!0},{span:8,type:"input",label:"取消期数",prop:"cancelNum",readonly:!0},{span:8,type:"input",label:"中奖期数",prop:"bingoBonusNum",readonly:!0},{span:8,type:"input",label:"派奖金额",prop:"bingoBonus",readonly:!0},{span:8,type:"input",label:"取消金额",prop:"cancelMoney",readonly:!0},{span:8,type:"input",label:"基本奖金",prop:"betBonusExtend",readonly:!0},{span:8,type:"input",label:"追号金额",prop:"appendTotalMoney",readonly:!0},{span:8,type:"input",label:"完成金额",prop:"doneMoney",readonly:!0},{span:8,type:"input",label:"中奖即停",prop:"stopTrace",readonly:!0},{span:8,type:"input",label:"投注时间",prop:"appendTime",readonly:!0},{span:8,type:"input",label:"投注返点",prop:"betRebates",readonly:!0},{span:8,type:"input",label:"投注注数",prop:"betCount",readonly:!0},{span:8,type:"input",label:"订单类型",prop:"appendType",readonly:!0},{span:8,type:"input",label:"订单来源",prop:"regSource",readonly:!0},{span:8,type:"input",label:"跳开即停",prop:"officialOff",readonly:!0},{span:8,type:"input",label:"模式",prop:"betModel",readonly:!0},{span:8,type:"input",label:"订单状态",prop:"appendStatus",readonly:!0},{span:24,type:"textarea",label:"投注内容",prop:"content",readonly:!0}],contentData:[{orderCode:"20200307065825685",lotteryPeriod:"202003070243",multipleNum:"5",appendStatus:"未中奖"}],contentColumns:[{prop:"orderCode",label:"订单编号",minWidth:"30%",align:"center",visible:!0},{prop:"lotteryPeriod",label:"期号",minWidth:"30%",align:"center",visible:!0},{prop:"multipleNum",label:"倍数",minWidth:"20%",align:"center",visible:!0},{prop:"appendStatus",label:"状态",minWidth:"20%",align:"center",visible:!0}]}},watch:{"listQuery.lotteryCode":function(e){if(e){var t=this.lotteryList.filter((function(t){return t.lottery===e}))[0].type;this.queryColumns[5].options=this.methodList[t].map((function(e){return{label:e.name,value:e.methodName}}))}else this.listQuery.lotteryBetName="",this.queryColumns[5].options=[]}},mounted:function(){this.getGameList(),this.getList()},methods:{getGameList:function(){var e,t,a,n;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,regeneratorRuntime.awrap(this.$api.listGameMethod());case 2:e=r.sent,t=e.data,a=t.lotterys,n=t.methods,this.lotteryList=a,this.methodList=n,this.queryColumns[4].options=a.map((function(e){return{label:e.showName,value:e.lottery}}));case 8:case"end":return r.stop()}}),null,this)},getList:function(){var e,t,a,n;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return this.loading=!0,r.next=3,regeneratorRuntime.awrap(this.$api.appendList(this.listQuery));case 3:e=r.sent,t=e.data,a=t.totalCount,n=t.list,this.total=a,this.data=n,this.loading=!1;case 9:case"end":return r.stop()}}),null,this)},handleSearch:function(){this.listQuery.pageNumber=1,this.getList()},handleDetail:function(e){var t=this;this.currentOrder=e,this.detailVisible=!0,this.$nextTick((function(){t.$refs.jsonForm.clearValidate(),Object.keys(t.form).forEach((function(a){t.form[a]="orderMemberName"===a?e.map.memberName:e[a]}))}))}}},i=a("2877"),l=Object(i.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div"),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,"hidden-summary":!1,summary:e.countData,height:"calc(100vh - 342px)",page:e.listQuery.pageNumber},on:{"update:page":function(t){return e.$set(e.listQuery,"pageNumber",t)},pagination:e.getList},scopedSlots:e._u([{key:"appendCode-column",fn:function(t){var n=t.row;return[a("span",{staticClass:"link-type",on:{click:function(t){return e.handleDetail(n)}}},[e._v(e._s(n.appendCode))])]}},{key:"memberType-column",fn:function(t){var n=t.row;return[a("div",{class:e._f("formatterMemberTypeTagClass")(n.map.memberType)},[e._v(" "+e._s(e._f("formatterMemberType")(n.map.memberType))+" ")])]}},{key:"appendStatus-column",fn:function(t){var n=t.row;return[a("div",{class:e._f("formatteAppendStatusTagClass")(n.status)},[e._v(" "+e._s(e._f("formatteAppendStatus")(n.status))+" ")])]}}])})],1),a("el-dialog",{directives:[{name:"drag-dialog",rawName:"v-drag-dialog"}],staticClass:"tab-dialog",attrs:{visible:e.detailVisible,width:"80%"},on:{"update:visible":function(t){e.detailVisible=t}}},[a("el-tabs",{model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"追号详情",name:"info"}},[a("div",{staticClass:"module-form-scroll",staticStyle:{height:"calc(65vh)"}},[a("el-scrollbar",[a("json-form",{ref:"jsonForm",staticClass:"primary-label-form",attrs:{form:e.form,columns:e.columns}})],1)],1)]),a("el-tab-pane",{attrs:{label:"追号内容",name:"content"}},[a("table-page",{attrs:{data:e.contentData,columns:e.contentColumns,"hidden-pagination":!0,height:"calc(65vh)"}})],1)],1)],1)],1)}),[],!1,null,null,null);t.default=l.exports},be57:function(e,t,a){},e6b9:function(e,t,a){"use strict";var n={props:{tags:{type:Array,default:function(e){return[]}},active:{type:String,default:""}},computed:{currentTag:{get:function(){return this.active},set:function(e){this.$emit("update:active",e)}}}},r=(a("866f"),a("2877")),i=Object(r.a)(n,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tags-view-container",attrs:{id:"tags-view-container"}},e._l(e.tags,(function(t){return a("span",{key:t.value,staticClass:"tags-view-item",class:{active:e.currentTag===t.value},on:{click:function(a){e.currentTag=t.value}}},[e._v(" "+e._s(t.label)+" ")])})),0)}),[],!1,null,"bff73f1c",null);t.a=i.exports}}]);