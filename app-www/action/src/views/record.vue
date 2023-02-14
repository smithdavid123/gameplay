<template>
  <div >
  <mu-tabs :value.sync="activeType" inverse color="#952b39" full-width text-color="#fff" indicator-color="#952b39"
           @change="getTab"  center style="background-color: #fff">
    <mu-tab v-for="(item,index) in  tabType" :key="index"  @touchmove.stop.prevent='touchStart'>{{item.label}}</mu-tab>

  </mu-tabs>
    <div v-if="activeType == 0" class="date-select">
      <div class="clearfix select-input-model" style="padding-top: 10px">
        <div style="float: left;width: 70%;">
          <mu-date-input v-model="query0.sTime" :value-format="format"  class="date-input" @change="getList0(1)"></mu-date-input>
          至
          <mu-date-input v-model="query0.eTime" :value-format="format"  class="date-input" @change="getList0(1)"></mu-date-input>
        </div>
        <mu-select style="width: 29%;float: right;font-size: 14px;margin: 0" v-model="selectAllOption0" @change="getList0(1)">
          <mu-option v-for="option,index in options" :key="option.value" :label="option.label" :value="option.value"></mu-option>
        </mu-select>
      </div>
      <div  style="height: calc(100vh  - 120px);overflow-y: auto;padding-bottom: 36px">
      <div  class="demo-loadmore-wrap play-game-nav">

          <mu-container ref="container" class="demo-loadmore-content play-move" >
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
              <div  v-if='list0.length>0' class="new-list">
                <div v-for="(g,index) in list0" :key="index" @click="clickDetail(index,g)"  class="new-list-li">
                  <p>彩种：<span class="cr2" style="text-decoration: underline">{{g.lottery}}</span></p>

                  <mu-row gutter style="width: 100%">
                    <mu-col span="6"  >

                      <p>期数：<span class="cr2">{{g.issue}}</span></p>
                      <p>投注金额：<span class="cr2">{{g.money?g.money.toFixed(3):0}}</span></p>


                    </mu-col>
                    <mu-col span="6" >

                      <p>
                        <template v-if="g.status!==0">
                          中奖金额：<span class="cr2"> {{g.status===-1 ? '已撤单' : (g.winMoney?g.winMoney.toFixed(3):0)}}</span>

                        </template>
                        <template v-else>
                          中奖金额：<a @click.stop="cancelBill(g)" class="cr5" style="    text-decoration: underline;">撤单</a>
                        </template>
                      </p>
                      <p>玩法：<span class="cr2">{{g.method}}</span></p>

                    </mu-col>
                  </mu-row>
                  <div>下单时间：<span class="cr2">{{g.orderTime}}</span></div>

                </div>
              </div>
              <p v-else  class="tc">暂无数据！</p>

            </mu-load-more>
          </mu-container>
        </div>

      </div>
    </div>
    <div v-if="activeType == 1" class="date-select">
      <div class="clearfix select-input-model"  style="padding-top: 10px">
        <div style="float: left;width: 70%;">
          <mu-date-input v-model="query1.sTime" :value-format="format"  class="date-input" @change="getList1(1)"></mu-date-input>
          <span style="font-size: 0.9rem">至</span>
          <mu-date-input v-model="query1.eTime" :value-format="format"  class="date-input" @change="getList1(1)"></mu-date-input>

        </div>
        <mu-select style="width: 29%;float: right;font-size: 14px;margin-bottom: 0" v-model="selectAllOption1" @change="getList1(1)">
          <mu-option v-for="option,index in options1" :key="option.value" :label="option.label" :value="option.value"></mu-option>
        </mu-select>

      </div>

      <div>
        <div  class="demo-loadmore-wrap ">

          <mu-container ref="container" class="demo-loadmore-content" >
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
              <div  v-if='list1.length>0' class="new-list">
                <div v-for="(g,index) in list1" :key="index" @click="clickDetailChase(index,g)"  class="new-list-li">
                  <p>彩种：<span class="cr2 "  style="text-decoration: underline">{{g.lottery}}</span></p>

                  <mu-row gutter style="width: 100%">
                    <mu-col span="7"  >

                      <p>开始期号：<span class="cr2">{{g.startIssue}}</span></p>
                      <p>总金额：<span class="cr2">{{g.totalMoney?g.totalMoney.toFixed(3):0}}</span></p>
                      <p>总奖金：<span class="cr2">{{g.winMoney?g.winMoney.toFixed(3):0}}</span></p>



                    </mu-col>
                    <mu-col span="5" >

                      <p>状态：<span class="cr2"> <template  v-if="g.status==1">追号中</template>
                        <template  v-if="g.status==0">未开始</template>
                        <template  v-if="g.status==2">已完成</template>
                        <template  v-if="g.status==-1">已撤单</template></span></p>
                      <p>玩法：<span class="cr2">{{g.method}}</span></p>
                      <p>操作：<span class="cr2"><template v-if="g.status == 1 || g.status == 0">
                            <a @click.stop="cancelChase(g)" class="cr5" style="    text-decoration: underline;">撤单</a>
                      </template> </span></p>


                    </mu-col>
                  </mu-row>
                  <div>下单时间：<span class="cr2">{{g.orderTime}}</span></div>

                </div>
              </div>
              <p v-else  class="tc">暂无数据！</p>


            </mu-load-more>
          </mu-container>

        </div>
      </div>

    </div>
    <div v-if="activeType == 2" class="date-select">
      <div class="clearfix select-input-model " style="padding-top: 10px">
        <div style="float: left;width: 70%;">
          <mu-date-input v-model="query2.sTime" :value-format="format"  class="date-input" @change="getList2(1)" ></mu-date-input>
          至
          <mu-date-input v-model="query2.eTime" :value-format="format"  class="date-input" @change="getList2(1)"></mu-date-input>

        </div>
        <mu-select style="width: 29%;float: right;font-size: 14px;margin: 0" v-model="selectAllOption2"  @change="getList2(1)">
          <mu-option v-for="option,index in options2" :key="option.value" :label="option.label" :value="option.value"></mu-option>
        </mu-select>
      </div>
      <div style="height: calc(100vh  - 120px);overflow-y: auto;padding-bottom: 36px">
      <div  class="demo-loadmore-wrap play-game-nav">
        <div>
          <mu-container ref="container" class="demo-loadmore-content play-move" >
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
              <div  v-if='list2.length>0' class="new-list">
                <div v-for="(g,index) in list2" :key="index"  class="new-list-li">
                  <p>操作时间：<span class="cr2">{{g.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span></p>

                  <mu-row>

                    <mu-col span="6"  >

                      <p>账单类型：<span class="cr2">{{typeMap[g.type]}}</span></p>
                      <p>操作金额：<span class="cr2">{{g.amount?g.amount.toFixed(3):0}}</span></p>


                    </mu-col>
                    <mu-col span="6" >


                      <p>剩余金额：<span class="cr2">{{g.balanceAfter?g.balanceAfter.toFixed(3):0}}</span></p>

                    </mu-col>
                  </mu-row>



                </div>
              </div>
              <p v-else  class="tc">暂无数据！</p>



            </mu-load-more>
          </mu-container>
        </div>


        </div>

      </div>
    </div>
    <mu-dialog  scrollable  fullscreen :open.sync="detailsDialog">

      <mu-appbar color="primary" >
        <mu-button slot="left" icon @click="detailsDialog = false">
          <i class="iconfont">&#xe604;</i>
        </mu-button>
        注单详情
      </mu-appbar>
      <p style="text-align: center"><span style="margin-right: 1em">{{detail.lottery}}</span><span>{{detail.method}}</span></p>
      <ul   class="details-ul" style="padding-left: 1em">
        <li>注单编号：{{detail.billno}}</li>
        <li>下单时间：{{detail.orderTime}}</li>
        <li>截止时间：{{detail.stopTime}}</li>
        <li>投注期次：{{detail.issue}}</li>
        <li  >投注号码：<span class="cr5">{{detail.content}}</span></li>
        <li>开奖号码：{{detail.openCode}}</li>
        <li>投注金额：1{{models[detail.model]}}*{{detail.nums}}注*{{detail.multiple}}倍 ={{detail.money}} </li>
        <li>奖金模式：{{detail.code}}</li>
        <!-- /{{detail.point}}% -->
        <li>彩票奖金：<span  :class="{cr4:detail.status == 2}" >{{detail.winMoney}}</span></li>
        <li >注单状态：<span class="cr5" :class="{cr4:detail.status == 2}">{{winType[detail.status]}}</span></li>
      </ul>
    </mu-dialog>

    <mu-dialog  scrollable  fullscreen :open.sync="detailsDialogChase">

      <mu-appbar color="primary" >
        <mu-button slot="left" icon @click="detailsDialogChase = false">
          <i class="iconfont">&#xe604;</i>
        </mu-button>
        追单详情
      </mu-appbar>
      <p style="text-align: center"><span style="margin-right: 1em">{{detail2.lottery}}</span><span>{{detail2.method}}</span></p>
      <ul   class="details-ul" style="padding-left: 1em">
        <li>注单编号：{{detail2.billno}}</li>
        <li>下单时间：{{detail2.orderTime}}</li>
        <li>投注期次：{{detail2.issue}}</li>
        <li>总金额：{{detail2.totalMoney}} </li>
        <li>奖金模式：{{detail2.code}}</li>
        <li >彩票奖金：<span  :class="{cr4:detail2.status == 2}" >{{detail2.winMoney}}</span></li>
        <li >注单状态：<span class="cr5" :class="{cr4:detail2.status == 2}">{{chaseType[detail2.status]}}</span></li>
        <li>
          <template v-if="detail2.status == 1 || detail2.status == 0"> <button @click="cancelChase(detail2)">撤单</button>
          </template>
        </li>
      </ul>

    </mu-dialog>

  </div>
</template>
<script>
  import  {searchOrder,searchBill, cancelOrder,loadContractStatus,cancelChase} from '@/api/login'
  export  default {
    name:'record',
    data(){
      return {
        winType:{'0':'未开奖', '1':'未中奖', '2':'已中奖', '-1':'已撤单'},
        models: {'yuan':'元', 'jiao':'角', 'fen': '分','li':'厘'},
        detailsDialog:false,
        detail:'',
        format:'YYYY-MM-DD',
        activeType:0,
        tabType:[
          {
            label:'投注记录',
            value:0

        },
          {
            label:'追号记录',
            value:1

        },
          {
            label:'资金明细',
            value:2

        },
        ],
        selectAllOption0:'',
        options: [
          {label:'全部',value:''},
          {label:'未开奖',value:0},
          {label:'未中奖',value:1},
          {label:'已中奖',value:2},
          {label:'已撤单',value:-1},

        ],
        columns0: [
          { title: '彩种',width:'80'},
          { title: '期数',width:'110'},
          { title: '投注金额', width:'90'},
          { title: '中奖金额', width:'80'},
          { title: '下单时间',width:'140' },
          { title: '玩法'},
        ],
        query0:{
          page: 0,
          size: 10,
          lottery:'',
          status:'',
          issue:'',
          sTime: this.timeNowStart(0),
          eTime:this.timeNowStart(1)
        },
        list0:[],

        query2:{
          page: 0,
          size: 10,
          accountType:'',
          type:'',
          sTime: this.timeNowStart(0),
          eTime: this.timeNowStart(1),
        },
        typeMap:{
        "1000":"存款",
        "1001":"取款",
        "1002":"取款退回",
        "1100":"转入",
        "1101":"转出",
        "1102":"上下级转账",
        "1200":"优惠活动",
        "1300":"消费",
        "1301":"派奖",
        "1302":"消费返点",
        "1400":"代理返点",
        "1303":"取消订单",
        "1900":"分红",
        "1600":"管理员增",
        "1601":"管理员减",
        "1700":"积分兑换",

      },
        selectAllOption2:'',
        options2: [
          {label:'全部',value:''},
          {label:'存款',value:1000},
          {label:'取款',value:1001},
          {label:'取款退回',value:1002},
          {label:'转入',value:1100},
          {label:'转出',value:1101},
          {label:'上下级转账',value:1102},
          {label:'优惠活动',value:1200},
          {label:'消费',value:1300},
          {label:'派奖',value:1301},
          {label:'消费返点',value:1302},
          {label:'代理返点',value:1400},
          {label:'取消订单',value:1303},
          {label:'分红',value:1900},
          {label:'管理员增',value:1600},
          {label:'管理员减',value:1601},
          {label:'积分兑换',value:1700},
          {label:'支付佣金',value:0},
          {label:'获得佣金',value:1},
          {label:'退还佣金',value:2},
          {label:'红包',value:3},


        ],
        columns1: [
          { title: '操作时间',width:'140'},
          { title: '账单类型', },
          { title: '操作金额' },
          { title: '剩余金额'},
        ],
        list2:[],
        refreshing: false,
        loading: false,

        query1:{
          page: 0,
          size: 10,
          lottery:'',
          status: '',
          sTime: this.timeNowStart(0),
          eTime: this.timeNowStart(1),
        },
        chaseType:{
          '0':'未开奖',
          '1':'进行中',
          '2':'已完成',
          '-1':'已撤单',
        },
        list1:[],
        selectAllOption1:'',
        options1: [
          {label:'全部',value:''},
          {label:'未开奖',value:0},
          {label:'进行中',value:1},
          {label:'已完成',value:2},
          {label:'已撤单',value:-1},
        ],
        detailsDialogChase:false,
        detail2:'',
      }
    },
    props : ['nowIndex'],
    filters: {
      formatDate: function (value, fmt) {
        let getDate = new Date(value);
        let o = {
          'M+': getDate.getMonth() + 1,
          'd+': getDate.getDate(),
          'h+': getDate.getHours(),
          'm+': getDate.getMinutes(),
          's+': getDate.getSeconds(),
          'q+': Math.floor((getDate.getMonth() + 3) / 3),
          'S': getDate.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt;

      }
    },

    created(){
      this.getList0();
      this.getList1();
      this.getList2();
    },
    mounted(){

    },
    methods:{
      clickDetail(index,row,e){
        if(e){
          if(e.srcElement.tagName == 'BUTTON'){return;}

        }
        this.detailsDialog =true;
        this.detail =row
      },
      touchStart:function(ev) {
        ev = ev || event;
        ev.preventDefault();
//                      console.log(ev.targetTouches);
//                      console.log(ev.changedTouches);
        if (ev.touches.length == 1) {    //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
          this.startX = ev.touches[0].clientX; // 记录开始位置
        }
      },

        getTab(){
        if(this.activeType == 0 ){
          this.getList0(1)
        }else if(this.activeType == 1){
          this.getList1(1)
        }else if(this.activeType == 2){
          this.getList2(1)
        }
      },
      timeNowStart (str) {
        var date1 = new Date()
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+str);
        var seperator1 = "-";
        var year = date2.getFullYear();
        var month = date2.getMonth() + 1;

        var strDate =date2.getDate()
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },

      //投注记录
      getList0(flag){
        this.query0.lottery = this.selectAllOption0;
        if(flag){this.query0.page = 0;this.list0 = []}
        searchOrder(this.query0).then(res=>{

          this.list0= this.list0.concat(res.data.list)
        })
      },

      //追号记录
      getList1(flag){
        this.query1.status = this.selectAllOption1;
        if(flag){ this.query1.page = 0;this.list1 = []}

        loadContractStatus(this.query1).then(res=>{
          this.list1= this.list1.concat(res.data.list)

        })
      },
      //资金明细
      getList2(flag){
        if(flag){this.query2.page = 0;this.list2 = []}
        this.query2.type = this.selectAllOption2;
        searchBill(this.query2).then(res=>{


          this.list2= this.list2.concat(res.data.list)
        })
      },
      clickDetailChase(index,row,e){
        if(e){
          if(e.srcElement.tagName && e.srcElement.tagName == 'BUTTON'){return;}
        }
        this.detailsDialogChase =true;
        this.detail2 =row

      },
      // 取消追号订单
      cancelChase: function (item) {

        let billno = item.billno;
        cancelChase({billno: item.billno}).then(res => {
          if (res.error === 0) {
            item.status = -1;
            this.$toast.success({
              message: '撤单成功!',
              position: 'center',
              time:800
            });
          } else {
            this.$toast.warning({
              message: res.message,
              position: 'center',               // 弹出的位置

            });
          }
          this.getList1(1)
        });
      },
      refresh () {

        this.refreshing = true;
        this.$refs.container.scrollTop = 0;
        setTimeout(() => {
          this.refreshing = false;
          this['query'+this.activeType].page = 0;
          this['list'+this.activeType] = [];

          this['getList'+this.activeType]()
        }, 2000)
      },
      load () {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this['query'+this.activeType].page+=1;
          this['getList'+this.activeType]()
        }, 2000)
      },
      // 取消下注订单
      cancelBill: function (item) {

        let billno = item.billno;
        cancelOrder({billno: item.billno}).then(res => {
          if (res.error === 0) {
            item.status = -1;
            this.$toast.success({
              message: '撤单成功!',
              position: 'center',
              time:800
            });
          } else {
            this.$toast.warning({
              message: res.message,
              position: 'center',               // 弹出的位置

            });
          }
        });
      }
    },
    watch:{
      nowIndex : function(n){
        if(n===3){
          this.getList0(1);
          this.getList1(1);
          this.getList2(1);
        }
      }
    }
  }
</script>
<style scoped>

  .play-move{
    padding-left: 0;
    padding-right: 0;
  }
  .date-input{
    width: 45%;
    text-align: left;
    margin-bottom: 0;
  }
  .date-input /deep/ input{
    text-align: center;
  }
  .details-ul li{
    list-style: none;
    line-height: 2em;

  }

  .new-list{
    background-color: #fff;
    border-radius: 5px;
    padding: 0px 14px;
  }
  .new-list-li{
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
  .new-list-li p{
    margin: 2px 0;
  }
  .select-input-model{
    width: 96%;
    margin: 3px auto;
  }
  .select-input-model  /deep/ .mu-text-field-input{
    height: 38px;
    font-size: 1.14rem;
  }
  .select-input-model /deep/ .mu-select-input{
    text-align: center;
  }
</style>
