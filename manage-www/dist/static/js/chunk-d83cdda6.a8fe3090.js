(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-d83cdda6"],{3533:function(e,t,a){"use strict";a.r(t),a("a4d3"),a("4de4"),a("4160"),a("e439"),a("dbb4"),a("b64b"),a("159b");var n=a("2fa7"),i=a("e6b9"),r=(a("13d5"),a("d3b7"),a("ac1f"),a("5319"),a("ddb0"),a("e611")),l=r.keys().reduce((function(e,t){var a=t.replace(/^\.\/(.*)\.\w+$/,"$1"),n=r(t).default;return e[a]=n,e}),{});function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}var o={components:function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(a,!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({moduleTags:i.a},l),data:function(){return{active:"lottery",tags:[{label:"彩种日分析报表",value:"lottery"},{label:"玩法日分析报表",value:"betCode"},{label:"个人彩种分析",value:"member"},{label:"个人游戏分析",value:"memberAg"}]}}},u=a("2877"),c=Object(u.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("moduleTags",{attrs:{tags:e.tags,active:e.active},on:{"update:active":function(t){e.active=t}}}),a(e.active,{tag:"component"})],1)}),[],!1,null,null,null);t.default=c.exports},"866f":function(e,t,a){"use strict";var n=a("be57");a.n(n).a},9661:function(e,t,a){"use strict";a.r(t),a("13d5"),a("b0c0"),a("d3b7"),a("96cf");var n=a("3620"),i={data:function(){return{loading:!0,total:0,listQuery:{page:1,size:20,lottery:"",byDay:0,sDate:"",eDate:""},queryColumns:[{type:"group",prop:"lottery",label:"彩种",allName:"请选择",options:[]},{type:"date",prop:["sDate","eDate"],label:"统计时间"},{type:"select",prop:"byDay",label:"统计方式",noAll:!0,options:n.f}],tableColumns:[{label:"汇总日期",prop:"time",align:"center",minWidth:"12%",visible:!0},{label:"彩种",prop:"category",align:"center",minWidth:"12%",visible:!0},{label:"投注",prop:"consume",align:"center",minWidth:"12%",visible:!0},{label:"奖金",prop:"bonus",align:"center",minWidth:"12%",visible:!0},{label:"订单返点",prop:"orderRebate",align:"center",minWidth:"12%",visible:!0},{label:"代理返点",prop:"agentRebate",align:"center",minWidth:"12%",visible:!0},{label:"平台盈亏",prop:"profit",align:"center",minWidth:"12%",visible:!0,sortable:!0,slotName:"profit-column"},{label:"投注人数",prop:"betCount",align:"center",width:"150",visible:!0}],data:[]}},mounted:function(){this.getLotteryList(),this.getList()},methods:{getLotteryList:function(){var e,t;return regeneratorRuntime.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,regeneratorRuntime.awrap(this.$api.lotteryList());case 2:e=a.sent,t=e.data,this.queryColumns[0].options=t.reduce((function(e,t,a){return t.parentCode?e[e.length-1].options.push({value:t.code,label:t.name}):e.push({label:t.name,options:[]}),e}),[]);case 5:case"end":return a.stop()}}),null,this)},getList:function(){var e,t,a,n,i;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return this.loading=!0,e=Object.assign({},this.listQuery,{page:this.listQuery.page-1}),r.next=4,regeneratorRuntime.awrap(this.$api.lotteryReportList(e));case 4:t=r.sent,a=t.data,n=a.totalCount,i=a.list,this.total=n,this.data=i,this.loading=!1;case 10:case"end":return r.stop()}}),null,this)},handleSearch:function(){this.listQuery.page=1,this.getList()}}},r=a("2877"),l=Object(r.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div"),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,height:"calc(100vh - 300px)",page:e.listQuery.page},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},pagination:e.getList},scopedSlots:e._u([{key:"profit-column",fn:function(t){var n=t.row;return[a("span",{class:[n.profit<0?"text-red":"text-green"]},[e._v(e._s(n.profit))])]}}])})],1)])}),[],!1,null,null,null);t.default=l.exports},"97a2":function(e,t,a){"use strict";a.r(t),a("4de4"),a("d81d"),a("b0c0"),a("d3b7"),a("96cf");var n=a("3620"),i={data:function(){return{loading:!0,total:0,listQuery:{page:1,size:20,lottery:"",method:"",byDay:0,sDate:"",eDate:""},lotteryList:[],methodList:[],queryColumns:[{type:"select",prop:"lottery",label:"彩种",allName:"请选择",options:[]},{type:"select",prop:"method",label:"玩法",allName:"请选择",options:[]},{type:"date",prop:["sDate","eDate"],label:"统计时间"},{type:"select",prop:"byDay",label:"统计方式",noAll:!0,options:n.f}],tableColumns:[{label:"汇总日期",prop:"time",align:"center",minWidth:"12%",visible:!0},{label:"玩法",prop:"category",align:"center",minWidth:"12%",visible:!0},{label:"投注",prop:"consume",align:"center",minWidth:"12%",visible:!0},{label:"奖金",prop:"bonus",align:"center",minWidth:"12%",visible:!0},{label:"订单返点",prop:"orderRebate",align:"center",minWidth:"12%",visible:!0},{label:"代理返点",prop:"agentRebate",align:"center",minWidth:"12%",visible:!0},{label:"平台盈亏",prop:"profit",align:"left",minWidth:"12%",visible:!0,sortable:!0,slotName:"profit-column"},{label:"投注人数",prop:"betCount",align:"center",width:"150",visible:!0}],data:[]}},watch:{"listQuery.lottery":function(e){if(e){var t=this.lotteryList.filter((function(t){return t.lottery===e}))[0].type;this.queryColumns[1].options=this.methodList[t].map((function(e){return{label:e.name,value:e.methodName}}))}else this.listQuery.method="",this.queryColumns[1].options=[]}},mounted:function(){this.getGameList()},methods:{getGameList:function(){var e,t,a,n;return regeneratorRuntime.async((function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,regeneratorRuntime.awrap(this.$api.listGameMethod());case 2:e=i.sent,t=e.data,a=t.lotterys,n=t.methods,this.lotteryList=a,this.methodList=n,this.queryColumns[0].options=a.map((function(e){return{label:e.showName,value:e.lottery}})),this.getList();case 9:case"end":return i.stop()}}),null,this)},getList:function(){var e,t,a,n,i;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return this.loading=!0,e=Object.assign({},this.listQuery,{page:this.listQuery.page-1}),r.next=4,regeneratorRuntime.awrap(this.$api.methodReportDay(e));case 4:t=r.sent,a=t.data,n=a.totalCount,i=a.list,this.total=n,this.data=i,this.loading=!1;case 10:case"end":return r.stop()}}),null,this)},handleSearch:function(){this.listQuery.page=1,this.getList()}}},r=a("2877"),l=Object(r.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div"),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,height:"calc(100vh - 300px)",page:e.listQuery.page},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},pagination:e.getList},scopedSlots:e._u([{key:"profit-column",fn:function(t){var n=t.row;return[a("span",{class:[n.profit<0?"text-red":"text-green"]},[e._v(e._s(n.profit))])]}}])})],1)])}),[],!1,null,null,null);t.default=l.exports},be57:function(e,t,a){},d988:function(e,t,a){"use strict";a.r(t),a("4de4"),a("d81d"),a("b0c0"),a("d3b7"),a("96cf");var n=a("3620"),i={data:function(){return{loading:!1,total:0,listQuery:{page:1,size:20,lottery:"",username:"",method:"",byDay:0,sDate:"",eDate:""},lotteryList:[],methodList:[],queryColumns:[{type:"input",prop:"username",label:"用户名"},{type:"select",prop:"lottery",label:"彩种",allName:"请选择",options:[]},{type:"select",prop:"method",label:"玩法",allName:"请选择",options:[]},{type:"date",prop:["sDate","eDate"],label:"统计时间"},{type:"select",prop:"byDay",label:"统计方式",options:n.f}],tableColumns:[{prop:"time",label:"汇总日期",minWidth:"12%",visible:!0,align:"center"},{prop:"account",label:"用户名",minWidth:"10%",visible:!0,align:"center"},{prop:"lottery",label:"彩种",minWidth:"5%",visible:!0,align:"center"},{prop:"method",label:"玩法",minWidth:"5%",visible:!0,align:"center"},{prop:"consume",label:"投注",minWidth:"10%",visible:!0,align:"center"},{prop:"bonus",label:"奖金",minWidth:"10%",visible:!0,align:"center"},{prop:"orderRebate",label:"订单返点",minWidth:"10%",visible:!0,align:"center"},{prop:"agentRebate",label:"代理返点",minWidth:"10%",align:"center",visible:!0},{prop:"profit",label:"平台盈亏",minWidth:"10%",align:"center",sortable:!0,visible:!0,slotName:"profit-column"}],data:[]}},watch:{"listQuery.lottery":function(e){if(e){var t=this.lotteryList.filter((function(t){return t.lottery===e}))[0].type;this.queryColumns[2].options=this.methodList[t].map((function(e){return{label:e.name,value:e.methodName}}))}else this.listQuery.method="",this.queryColumns[2].options=[]}},mounted:function(){this.getGameList(),this.getList()},methods:{getGameList:function(){var e,t,a,n;return regeneratorRuntime.async((function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,regeneratorRuntime.awrap(this.$api.listGameMethod());case 2:e=i.sent,t=e.data,a=t.lotterys,n=t.methods,this.lotteryList=a,this.methodList=n,this.queryColumns[1].options=a.map((function(e){return{label:e.showName,value:e.lottery}}));case 8:case"end":return i.stop()}}),null,this)},getList:function(){var e,t,a,n,i,r=this;return regeneratorRuntime.async((function(l){for(;;)switch(l.prev=l.next){case 0:return this.loading=!0,e=Object.assign({},this.listQuery,{page:this.listQuery.page-1}),l.next=4,regeneratorRuntime.awrap(this.$api.lotteryReportUser(e));case 4:t=l.sent,a=t.data,n=a.totalCount,i=a.list,this.total=n,this.data=i.map((function(t){return t.lottery=e.lottery?r.queryColumns[1].options.filter((function(e){return e.value===r.listQuery.lottery}))[0].label:"全部",t.method=e.method?r.queryColumns[2].options.filter((function(e){return e.value===r.listQuery.method}))[0].label:"全部",t})),this.loading=!1;case 10:case"end":return l.stop()}}),null,this)},handleSearch:function(){this.listQuery.page=1,this.getList()}}},r=a("2877"),l=Object(r.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div"),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,height:"calc(100vh - 300px)",page:e.listQuery.page},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},pagination:e.getList},scopedSlots:e._u([{key:"profit-column",fn:function(t){var n=t.row;return[a("span",{class:[n.profit<0?"text-red":"text-green"]},[e._v(e._s(n.profit))])]}}])})],1)])}),[],!1,null,null,null);t.default=l.exports},e611:function(e,t,a){var n={"./betCode.vue":"97a2","./lottery.vue":"9661","./member.vue":"d988","./memberAg.vue":"fdee"};function i(e){var t=r(e);return a(t)}function r(e){if(!a.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}i.keys=function(){return Object.keys(n)},i.resolve=r,e.exports=i,i.id="e611"},e6b9:function(e,t,a){"use strict";var n={props:{tags:{type:Array,default:function(e){return[]}},active:{type:String,default:""}},computed:{currentTag:{get:function(){return this.active},set:function(e){this.$emit("update:active",e)}}}},i=(a("866f"),a("2877")),r=Object(i.a)(n,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tags-view-container",attrs:{id:"tags-view-container"}},e._l(e.tags,(function(t){return a("span",{key:t.value,staticClass:"tags-view-item",class:{active:e.currentTag===t.value},on:{click:function(a){e.currentTag=t.value}}},[e._v(" "+e._s(t.label)+" ")])})),0)}),[],!1,null,"bff73f1c",null);t.a=r.exports},fdee:function(e,t,a){"use strict";a.r(t),a("4de4"),a("d3b7"),a("96cf");var n=a("3620"),i={data:function(){return{loading:!0,total:0,listQuery:{page:1,size:20,thirdParty:"",username:"",team:0,byDay:0,sDate:"",eDate:""},queryColumns:[{type:"select",prop:"thirdParty",label:"第三方",options:n.e},{type:"input",prop:"username",label:"用户名称"},{type:"check",prop:"team",label:"包含下级",flag:!0},{type:"date",prop:["sDate","eDate"],label:"统计时间"},{type:"select",prop:"byDay",label:"统计方式",noAll:!0,options:n.f}],tableColumns:[{prop:"time",label:"汇总日期",minWidth:"12%",visible:!0,align:"center"},{prop:"username",label:"用户名",minWidth:"8%",visible:!0,align:"center"},{prop:"thirdParty",label:"第三方",minWidth:"8%",visible:!0,align:"center",render:function(e){return n.e.filter((function(t){return t.value===e.thirdParty}))[0].label}},{prop:"balanceOut",label:"额度转出",minWidth:"8%",visible:!0,align:"center"},{prop:"balanceIn",label:"额度转入",minWidth:"8%",visible:!0,align:"center"},{prop:"consume",label:"总销量",minWidth:"8%",visible:!0,align:"center"},{prop:"actualConsume",label:"实际销量",minWidth:"8%",visible:!0,align:"center"},{prop:"bonus",label:"派奖",minWidth:"8%",visible:!0,align:"center"},{prop:"rebate",label:"返点金额",minWidth:"8%",visible:!0,align:"center"},{prop:"commission",label:"活动抽佣",minWidth:"8%",visible:!0,align:"center"},{prop:"profitUser",label:"用户盈亏",minWidth:"8%",sortable:!0,visible:!0,align:"center"},{prop:"profit",label:"平台盈亏",minWidth:"8%",visible:!0,sortable:!0,align:"center"}],data:[]}},mounted:function(){this.getList()},methods:{getList:function(){var e,t,a,n,i;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return this.loading=!0,e=Object.assign({},this.listQuery,{page:this.listQuery.page-1}),r.next=4,regeneratorRuntime.awrap(this.$api.summaryGameUser(e));case 4:t=r.sent,a=t.data,n=a.totalCount,i=a.list,this.total=n,this.data=i,this.loading=!1;case 10:case"end":return r.stop()}}),null,this)},handleSearch:function(){this.listQuery.page=1,this.getList()}}},r=a("2877"),l=Object(r.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div"),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,height:"calc(100vh - 300px)",page:e.listQuery.page},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},pagination:e.getList}})],1)])}),[],!1,null,null,null);t.default=l.exports}}]);