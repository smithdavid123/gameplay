(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-fa959fc2"],{"125b":function(e,t,a){var n={"./insideletter.vue":"3745"};function r(e){var t=s(e);return a(t)}function s(e){if(!a.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}r.keys=function(){return Object.keys(n)},r.resolve=s,e.exports=r,r.id="125b"},3745:function(e,t,a){"use strict";a.r(t),a("a15b"),a("d81d"),a("d3b7"),a("ac1f"),a("1276");var n=a("dfdf"),r=(a("96cf"),{mixins:[a("2ddf").a],data:function(){return{loading:!1,total:0,listQuery:{page:1,size:20,title:"",fromUser:"",sDate:"",eDate:""},queryColumns:[{type:"input",prop:"title",label:"标题"},{type:"input",prop:"fromUser",label:"创建人"},{type:"date",prop:["sDate","eDate"],label:"发送时间"}],tableColumns:[{type:"selection",width:"55",align:"center"},{label:"标题",prop:"title",align:"center",minWidth:"10%",visible:!0},{label:"内容",prop:"content",align:"center",minWidth:"30%",visible:!0},{label:"发送数量",prop:"userCount",align:"center",minWidth:"6%",visible:!0},{label:"发送人",prop:"fromUser",align:"center",minWidth:"6%",visible:!0},{label:"接受人",prop:"toUser",align:"center",minWidth:"10%",visible:!0,render:function(e){return e.toUser.length>16?e.toUser.substr(0,16)+"...":e.toUser}},{label:"发送时间",prop:"createTime",align:"center",minWidth:"10%",visible:!0}],data:[],checked:[],handleType:0,addVisible:!1,username:"",form:{title:"",content:"",isSys:1,toUser:[]},formColumns:[{type:"input",label:"标题",prop:"title",placeholder:"必填"},{type:"textarea",label:"内容",prop:"content",placeholder:"必填"},{label:"选择用户",prop:"username",slotName:"inputMemberName-column"}],userList:[]}},mounted:function(){this.getList()},methods:{getList:function(){var e,t,a,n,r;return regeneratorRuntime.async((function(s){for(;;)switch(s.prev=s.next){case 0:return this.loading=!0,e=Object.assign({},this.listQuery,{page:this.listQuery.page-1}),s.next=4,regeneratorRuntime.awrap(this.$api.listMessageSys(e));case 4:t=s.sent,a=t.data,n=a.totalCount,r=a.list,this.total=n,this.data=r,this.loading=!1;case 10:case"end":return s.stop()}}),null,this)},handleSearch:function(){this.listQuery.page=1,this.getList()},handleSearchUser:function(){var e,t,a;return regeneratorRuntime.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(!this.username){n.next=9;break}return n.next=3,regeneratorRuntime.awrap(this.$api.memberloginList({username:this.username}));case 3:e=n.sent,t=e.data,a=t.list,this.userList=a.map((function(e){return e.key=e.username,e.label=e.username,e})),n.next=10;break;case 9:this.$message.error("请输入用户名!");case 10:case"end":return n.stop()}}),null,this)},handleAdd:function(){var e=this;this.handleType=0,this.addVisible=!0,this.$nextTick((function(){e.form=e.$options.data().form,e.userList=[],e.username=""}))},sureAdd:function(){var e,t,a,r;return regeneratorRuntime.async((function(s){for(;;)switch(s.prev=s.next){case 0:if(e=this.form,t=e.toUser,a=Object(n.a)(e,["toUser"]),!t.length){s.next=12;break}return a.toUser=t.join(","),s.next=5,regeneratorRuntime.awrap(this.$api.sendMessageSys(a));case 5:r=s.sent,!r.error&&this.$message.success("提交成功"),this.getList(),this.addVisible=!1,s.next=13;break;case 12:this.$message.error("请选择用户!");case 13:case"end":return s.stop()}}),null,this)},handleWatch:function(){var e=this;this.handleType=1,this.addVisible=!0,this.$nextTick((function(){e.$refs.jsonForm.clearValidate();var t=e.checked[0];e.form.title=t.title,e.form.content=t.content,e.form.toUser=t.toUser.split(",")}))}}}),s=a("2877"),i=Object(s.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"module-query"},[a("MapQuery",{attrs:{query:e.listQuery,columns:e.queryColumns}}),a("SearchBtn",{attrs:{query:e.listQuery},on:{"update:query":function(t){e.listQuery=t}}})],1),a("div",{staticClass:"module-handle"},[a("div",[a("div",{staticClass:"primary-btn",on:{click:function(t){return e.handleAdd()}}},[a("svg-icon",{attrs:{"icon-class":"check-square"}}),e._v("增加 ")],1),a("div",{staticClass:"primary-btn",on:{click:function(t){e.checkValidate()&&e.handleWatch()}}},[a("svg-icon",{attrs:{"icon-class":"check-square"}}),e._v("查看 ")],1),a("div",{directives:[{name:"permission",rawName:"v-permission:3",value:{fn:e.handleRemove,args:"delMessage",validate:e.checkValidate},expression:"{ fn: handleRemove, args: 'delMessage', validate: checkValidate }",arg:"3"}],staticClass:"primary-btn"},[a("svg-icon",{attrs:{"icon-class":"check-square"}}),e._v("删除 ")],1)]),a("ColumnBtn",{attrs:{columns:e.tableColumns},on:{"update:columns":function(t){e.tableColumns=t}}})],1),a("div",{staticClass:"container-wrap"},[a("table-page",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.loading,expression:"loading",modifiers:{lock:!0}}],ref:"paraentTable",attrs:{data:e.data,columns:e.tableColumns,total:e.total,height:"calc(100vh - 300px)",page:e.listQuery.page},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},pagination:e.getList,"selection-change":function(t){e.checked=t}}})],1),a("el-dialog",{directives:[{name:"drag-dialog",rawName:"v-drag-dialog"}],attrs:{title:"站内信-"+(e.handleType?"查看":"新增"),visible:e.addVisible,width:"50%"},on:{"update:visible":function(t){e.addVisible=t}}},[a("div",{staticClass:"module-form-scroll"},[a("el-scrollbar",[a("json-form",{ref:"jsonForm",attrs:{form:e.form,columns:e.formColumns,"label-width":"100px"}},[a("template",{slot:"inputMemberName-column"},[e.handleType?e._e():a("el-input",{staticStyle:{width:"200px"},attrs:{"auto-complete":"off",placeholder:"请输入用户名进行查询"},model:{value:e.username,callback:function(t){e.username="string"==typeof t?t.trim():t},expression:"username"}}),e.handleType?e._e():a("div",{staticClass:"primary-btn ml20",on:{click:e.handleSearchUser}},[a("svg-icon",{attrs:{"icon-class":"search"}}),e._v("搜索 ")],1),e._l(e.form.toUser,(function(t){return[e.handleType?a("div",{key:t,staticClass:"tag-aqua"},[e._v(" "+e._s(t)+" ")]):e._e()]}))],2)],2),e.handleType?e._e():a("el-transfer",{attrs:{data:e.userList,titles:["待选用户","已选用户"]},model:{value:e.form.toUser,callback:function(t){e.$set(e.form,"toUser",t)},expression:"form.toUser"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e.handleType?e._e():a("div",{staticClass:"primary-btn small-btn",on:{click:e.sureAdd}},[e._v(" 保存 ")]),a("div",{staticClass:"disabled-btn small-btn",staticStyle:{"margin-left":"16px"},on:{click:function(t){e.addVisible=!1}}},[e._v(" 取消 ")])])])],1)}),[],!1,null,null,null);t.default=i.exports},"46fc":function(e,t,a){"use strict";a.r(t),a("a4d3"),a("4de4"),a("4160"),a("e439"),a("dbb4"),a("b64b"),a("159b");var n=a("2fa7"),r=a("e6b9"),s=(a("13d5"),a("d3b7"),a("ac1f"),a("5319"),a("ddb0"),a("125b")),i=s.keys().reduce((function(e,t){var a=t.replace(/^\.\/(.*)\.\w+$/,"$1"),n=s(t).default;return e[a]=n,e}),{});function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}var o={components:function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(a,!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({moduleTags:r.a},i),data:function(){return{active:"insideletter",tags:[{label:"站内信",value:"insideletter"}]}}},c=a("2877"),u=Object(c.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("moduleTags",{attrs:{tags:e.tags,active:e.active},on:{"update:active":function(t){e.active=t}}}),a(e.active,{tag:"component"})],1)}),[],!1,null,null,null);t.default=u.exports},"866f":function(e,t,a){"use strict";var n=a("be57");a.n(n).a},be57:function(e,t,a){},e6b9:function(e,t,a){"use strict";var n={props:{tags:{type:Array,default:function(e){return[]}},active:{type:String,default:""}},computed:{currentTag:{get:function(){return this.active},set:function(e){this.$emit("update:active",e)}}}},r=(a("866f"),a("2877")),s=Object(r.a)(n,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"tags-view-container",attrs:{id:"tags-view-container"}},e._l(e.tags,(function(t){return a("span",{key:t.value,staticClass:"tags-view-item",class:{active:e.currentTag===t.value},on:{click:function(a){e.currentTag=t.value}}},[e._v(" "+e._s(t.label)+" ")])})),0)}),[],!1,null,"bff73f1c",null);t.a=s.exports}}]);