<template>
  <div class="pay play-item-model" style="position: relative">
    <mu-appbar style="width: 100%;" color="primary" class="header">
      <mu-button icon slot="left"  :to="{path: 'play'}">
        <i class="iconfont">&#xe604;</i>
      </mu-button>


      <tab :line-width=2 active-color='#fff' v-model="tabindex" default-color="#d7dce2">
        <tab-item class="vux-center" :selected="tabName === item" v-for="(item, index) in bt" @click="tabName = item"
                  :key="index">{{item}}
        </tab-item>
      </tab>
      <mu-button icon slot="right" >
        <img v-if="name" :src="selectMap[name].img"  style="width: 43px;height: 43px;"/>
      </mu-button>

    </mu-appbar>
    <div class="content playSlider" style="padding-bottom: 0em;background-color: #ffffff">

      <swiper v-model="tabindex" class="swiper-container" ref="ccc"  id="tes" :show-dots="false"  :duration='10' :min-moving-distance='150'>
        <swiper-item>
          <keep-alive>
            <lottery-list></lottery-list>
          </keep-alive>
        </swiper-item>
        <swiper-item>
          <keep-alive>
          <trend-list></trend-list>
          </keep-alive>
        </swiper-item>
        <swiper-item ref="ttt">




          <div v-if="tabindex == 2" style="top:55px;background: #fff;width: 100%" id='heightId1' class="tz-top-model">

            <p class="form-title"><span class="cr2 f12">第</span> {{openTime.issue}} <span class="cr2 f12">期还剩 </span>
              <b class="cr4">{{openTime.hh}}：{{openTime.mm}}：{{openTime.ss}}</b>
              <i class="iconfont" style="float: right;margin-right: 15px;font-size: 20px" @click="helpInfo">&#xe67f;</i>
            </p>
            <!-- <p class="form-title"> 838 期</p> -->
            <mu-expansion-panel :expand="panel" @change="togglePanel" style="margin: 0">
              <div slot="header">  <p style="text-align: center;margin:0;font-size: 16px">
                <span>{{staticOpenCode.issue}}期</span>
                <b v-for="(j, k) in staticOpenCode.code?staticOpenCode.code.split(','):[]" class="code-span" :key="k">{{j}}</b>
              </p></div>
              <mu-load-more @refresh="refresh" :refreshing="refreshing">
                <div v-for="(item,index) in listPanel" v-show="index > 0" :key="index" class="panel-list-li clearfix">
                  <span style="width: 50%;display: inline-block">{{item.issue}}</span> <span >{{item.code}}</span>
                </div>
              </mu-load-more>


            </mu-expansion-panel>



          </div>


          <!-- 已选玩法列表 -->
          <div class="play-game-nav clearfix"   v-if="tabindex == 2"  id='heightId2'
            style="overflow-y: auto; height:80%;z-index: 0; width: 100%; ">
            <div style="position: fixed;width: 100%;background-color: #fafafa;z-index: 999">
              <div style="padding: 0px 10px">
                <mu-tabs :value.sync="currentMethod" inverse color="#03A9F4" text-color="rgba(0, 0, 0, .54)"
                         @change="changeMethod" class="play-game-tab play-move">
                  <mu-tab v-for="(m, idx) in methodSel" :value="m" :key="idx" style="margin-right:12px"
                          class="playgame">{{gameMethods[m].realname}}
                  </mu-tab>
                </mu-tabs>
                <i class="iconfont" @click="openFullscreenDialog(0)"
                   style="cursor: pointer;margin-top: 12px">&#xe601;</i>
              </div>

            </div>

            <div   class="select-solle" style="overflow-y: auto; margin-top: 46px;">

              <!-- 带复选框 -->
              <template v-if="gameMethods[currentMethod].checkbox">
                <mu-list v-for="(l, i) in gameMethods[currentMethod].checkbox.layout" :key="i"
                         style="text-align: center; padding-top: 15px">
                  <mu-checkbox v-model="checkSel[i]" v-for="b in l.value" :value="b" :label="b" @change="changeCheck"
                               :key="b" style="margin-right: 5px"></mu-checkbox>
                  <mu-divider shallow-inset style="margin-top:10px"></mu-divider>
                </mu-list>
              </template>
              <!-- 核心投注区域 -->
              <template v-if="gameMethods[currentMethod].select">
                <pSelect :lottery="lottery" v-model="currentMethod" :method="currentMethod" :numbers="numbers"
                         ref="selects" @changeNumber="changeNumber"></pSelect>
              </template>
              <!-- 文本框输入 -->
              <template v-if="gameMethods[currentMethod].textarea">
                <mu-text-field v-model="numberText" placeholder="每注号码之间请用一个空格或英文逗号或英文分号隔开（输入的号码会自动排序并去除不合格号码）。"
                               color="#ccc" style="padding:15px" multi-line full-width
                               :rows="10"  @click="test" @keyup="changeTextarea" @change="changeTextarea">
                </mu-text-field>
              </template>
            </div>

          </div>


        </swiper-item>
        <swiper-item style="background-color:#f2f5f7">
          <keep-alive>
          <record-list :nowIndex="tabindex"></record-list>
          </keep-alive>
        </swiper-item>

      </swiper>


      <!-- 投注操作结果相关 -->
      <div v-if="tabindex == 2" class="play-game-compute" style="border-top: 1px solid #e1e2e4; z-index: 99">
<div >
  <!-- 奖金调节 -->

  <mu-row v-if="isEvents" style="padding: 3px 5px;text-align: left;height: 28px;border-bottom: 1px solid #e1e2e4;"
          class="other-money-model">
    <mu-col span="3">
      <mu-row>
        <mu-col span="7">
          <div class="word-break f12">奖金调节</div>
        </mu-col>
        <mu-col span="5">
          <mu-button fab small color="" @touchstart="clickPoint(-1)" class="point-button">
            <mu-icon value="-"></mu-icon>
          </mu-button>
        </mu-col>
      </mu-row>
    </mu-col>
    <mu-col span="6" >
      <div class="grid-cell">
        <mu-slider class="demo-slider" :step="pointStep" :min="pointMin"
                   :max="pointMax" v-model="pointSel" @change="changePoint"></mu-slider>
      </div>
    </mu-col>
    <mu-col span="3" >
      <div class="grid-cell">
        <mu-button fab small class="point-button" @touchstart="clickPoint(1)" style="margin-left:10px">
          <mu-icon value="+"></mu-icon>
        </mu-button>
        {{pointSel}}
      </div>
    </mu-col>
  </mu-row>
  <div class="f16 compute-li clearfix" >
    <div  class="fl" style="margin-top: 3px">
      <inline-x-number v-model="multiple" @on-change="changeMulti" :min="minMulti" :fillable="fillable"
                       button-style="square" style="vertical-align: middle;display: inline-block;margin-left: 1rem"  >

      </inline-x-number>
      <span style="margin-right:30px">倍</span>
    </div>
    <!-- 金额刻度 -->
    <div class="fr" style="background: #f0f0f0;
    padding: 4px 3px;
    box-sizing: border-box;
    border-radius: 5px;">
            <span class="money-item" :class="{'currentModel': currentModel === i}" v-for="(item, i) in models"
                  :key="item[0]" @click="changeModel(i)">{{item[1]}}</span>
    </div>


  </div>

</div>



        <!-- 结果显示 -->
        <div  style="    background: #fafafa;">

          <div class="compute-li" >

            <mu-row>
              <mu-col style="text-align: left">
                <p style="display:inline-block;margin: 0">共计:<b class="cr5">{{nums}}</b>注</p>
                <b class="cr5">{{total}}</b><span style="font-size: 12px">元</span>
              </mu-col>
              <mu-col >
                奖金:<b class="cr5 dib">{{bonus[0] + (bonus.length > 1 ? " ~ " + bonus[1] : "")}}</b> <span style="font-size: 12px">元</span>
              </mu-col>
              <mu-col  style="text-align: right">
                总额:<b class="cr5 dib">{{ parseFloat(person).toFixed(3)}}</b> <span style="font-size: 12px">元</span>
              </mu-col>
            </mu-row>



          </div>

          <div class="compute-li clearfix">
            <!--<mu-button @click="openFullscreenDialog(1)" color="primary">购物车 {{order_list.length}}</mu-button>-->
            <!--<mu-button @click="addToList(0)" color="primary">添加号码</mu-button>-->
            <mu-row>
              <mu-col span="3">
                <mu-button  color="#03A9F4"   @click="addNumber" small style="    min-width: 100%;">追号</mu-button>
              </mu-col>
              <mu-col span="6">

              </mu-col>
              <mu-col span="3">
                <mu-button color="#03A9F4"   @click="quickBet" small style="    min-width: 100%;">立即投注</mu-button>

              </mu-col>
            </mu-row>

          </div>

        </div>

      </div>
    </div>


    <!-- 全部玩法选择 -->
    <mu-dialog transition="slide-bottom" fullscreen scrollable :open.sync="openFullscreen" class="play-game"
               :padding="ne">

      <mu-appbar color="#03A9F4" title="玩法选择" style="position: fixed;top: 0;width: 100%;z-index: 9999">
        <mu-button slot="left" icon @click="closeFullscreenDialog(0)">
          <i class="iconfont">&#xe604;</i>
        </mu-button>
      </mu-appbar>

      <div style="margin-top:59px " class="dialog-choose-game">
        <div v-for="(item, i) in gameLayouts" :key="i">

          <template v-for="row in item.rows">
            <div v-for="(line, j) in row" >
              <p  style="background: #e4ebef;
    color: #82a2ec;
    height: 36px;
    line-height: 36px;text-indent: 1rem">
              {{line.title}}
              </p>
              <div style="padding-left: 1.5rem">
                <span :key="index" v-for="(b, index) in line.columns" @click="chooseGameFun(b)" class="game-choose-span"
                      :class="{'active':methodSel.indexOf(b)>=0}">
                    {{gameMethods[b].showname}}
                  </span>
              </div>

            </div>
          </template>

        </div>
      </div>
    </mu-dialog>

    <!-- 购物车·已选择 -->
    <mu-dialog transition="slide-bottom" fullscreen scrollable :open.sync="openShopCar" class="play-game" :padding="ne">
      <mu-appbar color="primary" title="购物车" style="position: absolute;top: 0;width: 100%">
        <mu-button slot="left" icon @click="closeFullscreenDialog(1)">
          <i class="iconfont">&#xe604;</i>
        </mu-button>
      </mu-appbar>

      <div style="margin-top:70px ">
        <mu-list textline="three-line">
          <mu-list-item avatar button :ripple="false" v-for="d in order_list" :key="d.id">
            <mu-list-item-action>
              <mu-avatar>
                <mu-icon value="folder"></mu-icon>
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{methods[d.type - 1][d.method].name + "(" + d.model.name + ")"}}</mu-list-item-title>
              <mu-list-item-sub-title>
                <span style="color: rgba(0, 0, 0, .87)">
                  {{d.content.length < 16 ? d.content : (d.content.substring(0, 16) + '..')}}
                </span><br/>
                共{{d.nums}}注
              </mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-list-item-title>
              </mu-list-item-title>
              <mu-list-item-sub-title>
                删除
              </mu-list-item-sub-title>
              <mu-list-item-sub-title>
                {{d.total}}元
              </mu-list-item-sub-title>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
        <p style="text-align: right;padding: 0px 16px">
          <mu-button @click="clickSubmit" color="primary">确认投注</mu-button>
        </p>


      </div>
    </mu-dialog>

  </div>

</template>
<script>
  import $ from 'jquery'
  import {addOrder,loopGameLottery,staticOpenCode} from '@/api/login'
  //import {SscLayout, SscMethod} from '@/assets/json/layout'
  import {LotteryPlay} from '@/assets/js/game/play'
  import {LotteryOpenTime} from '@/assets/js/game/open'
  // import {SscUtils} from '../assets/json/utils'
  import {GameUtils} from '@/assets/js/game/utils'
  import {GAMES} from '@/assets/js/game/method'
  import {GameList} from '@/assets/js/game/game'

  import pSelect from './pSelect'

  import {account_data, config_data, lotterys, methods, updateCache} from "@/assets/js/game/global"
  import {InlineXNumber} from 'vux'
  import recordList from './record'
  import lotteryList from './lottery'
  import trendList from './trend'

  const SscUtils = GameUtils.SSC;
  const X511Utils = GameUtils.X511;
  const K3Utils = GameUtils.K3;
  const D3Utils = GameUtils.D3;
  const Kl8Utils = GameUtils.Kl8;
  const PK10Utils = GameUtils.PK10;
  import 'muse-ui-message/dist/muse-ui-message.css';
  import Message from 'muse-ui-message';
  import {mapGetters} from 'vuex';
  import {Tab, TabItem, Swiper, SwiperItem} from 'vux';
  import Cookies from 'js-cookie';
  export default {
    name: 'playItem',
    components: {
      InlineXNumber,
      pSelect,
      recordList,
      lotteryList,
      trendList,
      Tab, TabItem, Swiper, SwiperItem

    },
    data() {
      return {
        panel:false,
        listPanel:[],
        source:this.$route.query.source,
        name: this.$route.query.name,
        // method: this.$route.query.method,
        // method: 'rx3z3',
        lottery: GameList.cache[this.$route.query.name],
        type: 1,
        layout: [],
        methods: methods,
        // playActive: 0,
        tabindex: 2,
        tabName: '投注',
        bt: ['开奖', '走势', '投注', '记录'],
        show1: false,
        popupValue: '',
        ne: 0,
        items1: [{
          key: '1',
          value: 'A'
        }, {
          key: '2',
          value: 'B'
        }, {
          key: '3',
          value: 'C'
        }],
        currentList: [],
        checkSel: [],
        numberText: "",
        methodSel: [],
        fillable: true,
        pointStep: 1,
        pointMin: 1800,
        pointMax: account_data.lotteryCode,
        pointSel: account_data.lotteryCode,
        gameLayouts: {},
        gameMethods: {},
        openFullscreen: false,
        openShopCar: false,
        // type: ['全','大','小','单','双','清'],
        currentIndexName: [],
        currentIndex: '',
        currentName: '',
        currentMethod: '',
        currentModel: 0,
        multiple: 1,
        minMulti: 1,
        total: 0,
        nums: 0,
        models: [['yuan', '元'], ['jiao', '角'], ['fen', '分'], ['li', '厘']],
        isShow: false,
        numbers: [],
        order_data: {},
        order_list: [],
        bonus: [0.0],
        openTime: {issue: '000', hh: '00', mm: '00', ss: '00'},
        initdata: '',
        userMethodsel: [] ,
        queryCode:{
          lottery:this.$route.query.name
        },
        staticOpenCode:'',
        person:'',
        timer1:null,
        sollheight:'400px',
        selectMap: {
          'qumin': {
            img: require('../assets/images/qumin.png'),
          },
          't1s600': {
            img: require('../assets/images/t1s600.png'),
          },
          't1s60h': {
            img: require('../assets/images/t1s60h.png'),
          },
          't1s300': {
            img: require('../assets/images/t1s300.png'),
          },
          't1s300a': {
            img: require('../assets/images/t1s300a.png'),
          },
          't1s120': {
            img: require('../assets/images/t1s120.png'),
          },
          't1s60a': {
            img: require('../assets/images/t1s60a.png'),
          },
          't1s180a': {
            img: require('../assets/images/t1s180a.png'),
          },
          'cqssc': {
            img: require('../assets/images/home_ssc_cq.png'),
          },
          'tjssc': {
            img: require('../assets/images/home_ssc_tj.png'),
          },
          'xjssc': {
            img: require('../assets/images/home_ssc_xj.png'),
          },
          'bjssc': {
            img: require('../assets/images/home_ssc_bj.png'),
          },
          'twssc': {
            img: require('../assets/images/home_ssc_tw.png'),
          },
          'qqmin': {
            img: require('../assets/images/qqmin.png'),
          },
          'qu5fen': {
            img: require('../assets/images/qu5fen.png'),
          },
          'qu10fen': {
            img: require('../assets/images/qu10fen.png'),
          },



          't1s30': {
            img: require('../assets/images/home_qtc_singapore_30s.png'),
          },
          't1s60': {
            img: require('../assets/images/home_gpc_t1s60.png'),
          },
          't1s90': {
            img: require('../assets/images/home_qtc_korea1_5m.png'),
          },
          't1s90a': {
            img: require('../assets/images/home_gpc_t1s90a.png'),
          },
          't1s90b': {
            img: require('../assets/images/home_gpc_t1s90b.png'),
          },
          't1s90c': {
            img: require('../assets/images/home_qtc_india.png'),
          },
          't1s90d': {
            img: require('../assets/images/home_qtc_tokyo.png'),
          },
          't1s180': {
            img: require('../assets/images/home_qtc_myanmar.png'),
          },
          'sgssc': {
            img: require('../assets/images/home_qtc_singapore_2m.png'),
          },
          't2s30': {
            img: require('../assets/images/home_11x5_newyork.png'),

          },
          't2s90': {
            img: require('../assets/images/home_11x5_canada.png'),

          },
          'gd11x5': {
            img: require('../assets/images/home_11x5_gd.png'),

          },
          'jx11x5': {
            img: require('../assets/images/home_11x5_jx.png'),

          },
          'ah11x5': {
            img: require('../assets/images/home_11x5_ah.png'),

          },
          'sh11x5': {
            img: require('../assets/images/home_11x5_sh.png'),

          },
          'sd11x5': {
            img: require('../assets/images/home_11x5_sd.png'),

          },
          'ln11x5': {
            img: require('../assets/images/home_11x5_ln.png'),

          },

          't3s90': {
            img: require('../assets/images/home_k3_jlp.png'),

          },
          't3s120': {
            img: require('../assets/images/home_k3_xxl.png'),

          },
          'jsk3': {
            img: require('../assets/images/home_k3_js.png'),

          },
          'ahk3': {
            img: require('../assets/images/home_k3_ah.png'),

          },
          'hbk3': {
            img: require('../assets/images/home_k3_hb.png'),
          },
          'jlk3': {
            img: require('../assets/images/home_k3_jl.png'),

          },

          'bjkl8': {
            img: require('../assets/images/home_kl8_bj.png'),

          },
          'hgkl8': {
            img: require('../assets/images/home_klc_hgkl8.png'),

          },
          'twkl8': {
            img: require('../assets/images/home_klc_twkl8.png'),

          },
          'jpkl8': {
            img: require('../assets/images/home_klc_jpkl8.png'),

          },
          'sgkl8': {
            img: require('../assets/images/home_klc_sgkl8.png'),

          },

          'fc3d': {
            img: require('../assets/images/home_other_fc3d.png'),

          },
          'pl3': {
            img: require('../assets/images/home_other_pl3.png'),

          },
          't6s120': {
            img: require('../assets/images/home_other_sc120s.png'),

          },
          't6s180': {
            img: require('../assets/images/home_other_sc180s.png'),

          },
          't6s300': {
            img: require('../assets/images/t6s300.png'),

          },
          'bjpk10': {
            img: require('../assets/images/home_other_pk10.png'),
          },
          'pcdd': {
            img: require('../assets/images/pcdd.png'),
          },

        },
        gameListNum:[],
        isEvents:false,
        // 开奖号码 刷新
        refreshing: false,
      }
    },

    created() {
      // debugger
      window.scrollTo(0,0);
      updateCache()
      let $this = this
      this.initdata = JSON.parse(localStorage.getItem('initdata'))

      this.userMethodsel = localStorage.getItem('userMethodsel') ? JSON.parse(localStorage.getItem('userMethodsel')) : []

      this.userMethodsel ? this.userMethodsel.map((n) => {
        if (n.username == $this.initdata.account.username && n.name == $this.name) {
          $this.methodSel = n.method
        }
      }) : []

      let type = parseInt(GameList.cache[this.$route.query.name].type) - 1;
      let Layout = GAMES[type].layout;

      let Method = GAMES[type].method;
      let defaultMethod  = Layout[0].rows[0][0].columns[0];

      this.gameLayouts = Layout;

      this.gameMethods = Method;
      // this.methodSel = [defaultMethod];
      this.type = type;
      if (this.methodSel.length == 0) {
        if (type === 0) {
          defaultMethod = 'sxzuxzsh';
          this.methodSel.push('exzuxfsh');
        }
        this.methodSel.push(defaultMethod)

      }
      this.changeMethod(this.methodSel[0]);
      LotteryPlay.refreshCode(this.name, this.model, this.order_data);
      this.loopGameLotteryTimer();
      staticOpenCode({ name:this.$route.query.name,
        history:true}).then(res => {
        this.listPanel = res.slice(0,9);
      });
      this.getCookieNum();
        if(JSON.parse(localStorage.getItem('isEvents'))){
          if($this.initdata.account.username == JSON.parse(localStorage.getItem('isEvents')).userName){
            this.isEvents = JSON.parse(localStorage.getItem('isEvents')).flag

          }else{
            this.isEvents =  false

          }
        }else{
          this.isEvents = false
        }


    },
    mounted() {
      this.tabindex = this.$route.query.playItemTab == 0?this.$route.query.playItemTab:2

      this.$nextTick(function () {
        // this.sollheight = document.body.clientHeight - (document.getElementById('heightId1').offsetHeight+document.getElementById('heightId2').offsetHeight)+'px'

        this.timer1 = setInterval(this.loopGameLotteryTimer, 5000);
      });
      let type = parseInt(GameList.cache[this.$route.query.name].type) - 1;
      this.layout = GAMES[type].method[this.method || 'rx3z3'];
      this.type = type;

      LotteryOpenTime.init(this.lottery, this.openTime);
    },
    computed: {
      model: function () {
        return this.models[this.currentModel][0];
      },
      pointPer: function () {
        let p = LotteryPlay.getLotteryPoint(this.pointSel);
        return parseFloat(this.order_data.maxPoint - parseFloat(p)).toFixed(1);
      }
    },
      methods: {
        refresh () {
          staticOpenCode({ name:this.$route.query.name, history:true }).then(res => {
            this.listPanel = res.slice(0, 9);
          });
        },
        togglePanel(){
          this.panel =  !this.panel

        },
        chooseGameFun(item){
          if(this.methodSel.indexOf(item)>=0){
            this.methodSel = this.methodSel.filter(t => t != item)
          }else{
            this.methodSel.push(item)

          }
        },
      loopGameLotteryTimer(){

        loopGameLottery(this.queryCode).then(res=>{
          this.staticOpenCode= res.data.gameOpenCode;
          this.person = res.data.balanceAll

        })

      },
      test: function () {
        // let ttt = this.gameMethods[this.currentMethod].checkbox;
        // let ary = this.checkSel;
        this.getPlayAreaData();
      },
      changeMethod: function (m) {
        this.currentMethod = m;
        this.order_data['defCheck'] = [];
        let checkbox = this.gameMethods[this.currentMethod].checkbox;
        if (checkbox && checkbox.defCheck) {
          this.checkSel = checkbox.layout.map(d => checkbox.defCheck);
          this.order_data['defCheck'] = checkbox.defCheck;
        }
        this.order_data['method'] = m;
        this.order_data['compress'] = false;

        this.updateBonus();
        this.getCookieNum()


      },
      // 玩法帮助信息
      // TODO: 优化样式
      helpInfo: function () {
        let m = this.gameMethods[this.currentMethod];
        Message.alert("玩法：" + m.help + '示例：' + m.example, '提示');
        /*  this.$toast.info({
            message:"玩法：" + this.gameMethods[this.currentMethod].help + '示例：' + this.gameMethods[this.currentMethod].example,
            position: 'top-end',               // 弹出的位置

          });*/
      },
      changeCheck: function () {
        this.update();
      },
      // 投注模式
      changeModel: function (i) {
        this.currentModel = i;
        LotteryPlay.refreshCode(this.name, this.model, this.order_data);
        this.updateBonus();
        this.update();
      },
      // 奖金调节
      changePoint: function () {
        this.updateBonus();
      },
        getCookieNum(){
          let me =  this;
          // 返回购彩时清除记忆
          if (GameList.visitGame == 0) return;
          let str =  this.$route.query.name+'-'+this.currentMethod;
          this.gameListNum = JSON.parse(localStorage.getItem('appMyGameNum'));
          if(this.gameListNum ){
            if( JSON.stringify(this.gameListNum).indexOf(str)>=0 ) {

              this.gameListNum.map(function (a) {
                if (a.lottry === str) {
                  me.multiple = a.num
                }
              });
            }else{
              me.multiple = 1
            }

          }else{
            this.gameListNum = []
          }

        },
      // 增加倍数
      changeMulti: function () {
        this.update();
        let me  =  this;
        let str =  this.$route.query.name+'-'+this.currentMethod;
        if( JSON.stringify(this.gameListNum).indexOf(str)>=0 ){
          this.gameListNum.map(function (a) {
            if ( a.lottry === str)  {
              a.num = me.multiple
            }
          });

        }else{
          let obj = {lottry:str,num:this.multiple};
          this.gameListNum.push(obj)
        };
        localStorage.setItem('appMyGameNum', JSON.stringify(this.gameListNum));
        GameList.visitGame++;
      },

      // 调整奖金比例
      clickPoint: function (step) {
        let p = this.pointSel + step;
        if (p > this.pointMax || p < this.pointMin) return;
        this.pointSel = p;

        this.updateBonus();
      },
      updateBonus: function () {
        this.bonus = LotteryPlay.updateBonus(this.name, this.lottery.type, this.currentMethod, this.pointSel, this.model);
      },
      // ----------------------------------------Inputs ------------------------------------
      getCheckboxData: function () {
        let $this = this;
        let lines = [];
        let checkbox = this.gameMethods[this.currentMethod].checkbox;
        if (!checkbox || !checkbox.layout) return lines;
        checkbox.layout.forEach((item, i) => {
          lines.push(item.value.map(d => $this.checkSel[i].indexOf(d) === -1 ? '-' : '√'));
        });
        return lines;
      },
      getSelectData: function () {
        let select = this.gameMethods[this.currentMethod].select;
        if (select && select.layout) {
          if (this.numbers.length === 0) return select.layout.map(d => []);
        }

        return this.numbers.map(line => {
          return Object.keys(line).filter(d => line[d] === 1);
        });
      },
      getTextareaData: function () {
        let datasel = [];
        let textarea = this.numberText;
        if (textarea && textarea.length > 0) {
          var separator = ' ';
          switch (this.lottery.type) {
            case 1:
            case 3:
            case 4:
            case 5:
              separator = ' ';
              break;
            case 2:
            case 6:
              separator = ';';
              break;
          }
          var as = textarea.split(separator);
          as.forEach((val, idx) => {
            datasel.push(val);
          });
        }
        return datasel;
      },
      // 文本框更改事件
      changeTextarea: function () {
        let val = this.numberText;
        switch (this.lottery.type) {
          case 1:
          case 3:
          case 4:
          case 5:
            val = val.replace(/,|;|\n|\t/g, ' ');
            break;
          case 2:
          case 6:
            val = val.replace(/,|\n/g, ';');
            break;
        }
        val = val.replace(/[\s]{2,}/, ' '); // 替换空格
        this.numberText = val;
        // 更新计算
        this.update();
      },
      getPlayAreaData: function () {
        var datasel = [];
        var places = this.getCheckboxData();
        var balls = this.getSelectData();
        var textarea = this.getTextareaData();
        return datasel.concat(places).concat(balls).concat(textarea);
      },
      // ---------------------------------End Inputs-------------------------------------
      // 核心·注数和金额计算
      update: function () {
        let type = this.lottery.type;
        let method = this.currentMethod;
        let datasel = this.getPlayAreaData(); // 获取投注内容
        let res = LotteryPlay.PlayOptions.update(method, datasel, type, this.model, this.multiple);
        this.nums = res.nums;
        this.total = res.total;
      },

      // 获取投注数据
      getData: function () {
        let datasel = this.getPlayAreaData(); // 获取投注内容
        return LotteryPlay.getData(this.name, this.pointSel, this.pointPer, this.order_data, datasel, this.model, this.multiple);
      },
      addToList: function (cb) {
        var data = this.getData();
        if (data.nums == 0) {
          this.$toast.warning({
            message: '您还没有选择号码或所选号码不全！',
            position: 'center',               // 弹出的位置

          });
          return;
        }
        data['total'] = LotteryPlay.getMoney(data);

        this.order_list.push(data);
        // 清除
        if (this.$refs.selects) this.$refs.selects.init();
        this.numberText = "";
        this.numbers = [];
        this.update();
        if (cb) cb();
      },
      // 监听子组件
      changeNumber: function (numbers) {
        if (numbers) this.numbers = numbers;
        this.update();
      },
      clickSubmit: function () {
        // TODO：弹框样式
        if (this.order_list.length == 0) {

          this.$toast.warning({
            message: '请先添加投注号码！',
            position: 'center',               // 弹出的位置

          });
          return;
        }
        let total = LotteryPlay.getTotal(this.order_list);
        this.submit();
        this.closeFullscreenDialog(1)
        // Message.confirm("本次投注共需要花费" + total + "元，确认继续投注？", '提示', {
        //   type: 'warning'
        // }).then(({result}) => {
        //   if (result) {
        //     this.submit();
        //     this.closeFullscreenDialog(1)
        //   }else {
        //      this.order_list = []
        //   }
        // });


      },
      // 快速投注功能
      quickBet: function () {
        let $this = this;
        this.addToList(function () {
          $this.clickSubmit($this.order_list);
        });
      },
      /*追号*/
      addNumber(){
        let $this = this;
        this.addToList(function () {
          $this.$router.push({ path: '/addNumber',query:{bonus: $this.bonus, n:JSON.stringify($this.order_list),name:$this.name}})

        });
      },
      // ++++++++++++++++++TODO: 接口对接+++++++++++++++++++++++
      // 提交投注
      submit: function () {
        var list = [];

        this.order_list.forEach(function (v, i) {
          list.push({
            lottery: v.lottery,
            issue: v.issue,
            method: v.method,
            content: v.content,
            model: v.model.val,
            multiple: v.multiple,
            code: v.code,
            compress: v.compress,
            nums: v.nums
          });
        });
        var data = {text: JSON.stringify(list)};
        // TODO: ajax提交逻辑

        this.order_list = []

        addOrder(data).then(res => {
          if (res.error == 0) {
            /*   clear();*/

            this.$toast.success({
              message: '您的订单已投注成功，请耐心等待开奖结果！',
              position: 'center',               // 弹出的位置
            });
          }
          if (res.error == 1) {
            if (res.code == '116-05') {
              setTimeout(function () {
                this.$toast.error({
                  message: '投注超时，请检查网路情况后重新重试',
                  position: 'center',               // 弹出的位置

                });
              }, 10000);
            } else if (res.code == '116-06') {
              window.location.href = '/';
            } else {
              this.$toast.info({
                message: res.message,
                position: 'center',               // 弹出的位置
              });

            }
          }
        })

      },
      openFullscreenDialog(style) {
        if (style == 0) {
          this.openFullscreen = true;
        } else {

          if (this.order_list.length > 0) {
            this.openShopCar = true;
          } else {
            this.$toast.warning({
              message: '购物车暂为空',
              position: 'center',               // 弹出的位置

            });
          }

        }
      },
      closeFullscreenDialog(style) {
        let obj = {username: this.initdata.account.username, name: this.$route.query.name, method: this.methodSel}
        this.userMethodsel.push(obj), JSON.stringify(this.userMethodsel)
        localStorage.setItem('userMethodsel', JSON.stringify(this.userMethodsel));
        if (style == 0) {
          this.openFullscreen = false;
        } else {
          this.openShopCar = false;
        }
      }
    },
    watch:{
      tabindex:function () {
        document.body.scrollTop = 0
      }
    },
    destroyed(){
      if(this.timer1) { //如果定时器在运行则关闭
        clearInterval(this.timer1);
      }
    }

  }
</script>
<style scoped>
  .form-title {
    margin: 0;
    text-align: center;
    border-top: 1px solid #b2b2b2;
    padding: 7px 0px;
    background: #fff;
    font-size: 16px;
  }

  .play-title {
    background: #7d8eec;
    color: #fff;
    padding: 10px;
  }

  .vux-x-icon {
    fill: #fff;
  }

  .mu-dialog {
    font-size: 14px;
  }

  .play-game-tab {
    overflow-x: auto;
    width: 80%;
    float: left;
  }

  .play-game-nav .iconfont {
    float: right;
  }

  .type-nav {
    border: 1px solid #4cab7f;
    display: inline-block;
    padding: 0px 8px;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .type-nav-number {
    border: 1px solid #8c9dab;
    display: inline-block;
    border-radius: 50%;
    margin-right: 5px;
    margin-bottom: 10px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 29px;
  }

  .currentType {
    background-color: #2196f3;
    color: #fff;
  }



  .money-item {
    padding: 1px 8px;
    text-align: center;
    border-radius: 4px;
    color: #bdbdbd;
  }
  @media screen and (max-width: 330px) {

    .money-item{
      padding: 1px 7px;
    }
  }
  .currentModel {
    color: #2196f3;
    background-color: #fff;
    color: #333;

  }
  .other-money-model .point-button {
    width: 20px;
    height: 20px;
    margin: 2px 6px;
    /* float: right */
  }

  .word-break {
    margin-top: 5px;
  }

  .play-game-nav {
    background-color: #fff;
  }

  .compute-li {
    text-align: center;
    padding: 8px;
    border-bottom: 1px solid #e1e2e4;
  }

  .mu-demo-form {
    width: 100%;
    max-width: 460px;
  }

  /*.play-game-nav .mu-tab{
    min-width: auto;
  }*/
  .playSlider .vux-slider {
    height: 100%;

  }

  .playSlider /deep/ .vux-swiper {
    height: 100% !important;
    overflow-y: hidden;

  }

  .play-item-model /deep/ .vux-tab {
    background-color: transparent;
  }

  .play-item-model /deep/ .vux-center {
    background-size: 100% 0;
  }

  .playgame /deep/.mu-tab {
    white-space: nowrap;
    min-width: auto;
  }
  .code-span {

    display: inline-block;
    /* width: 23px; */
    /* height: 23px; */
    /* background-color: red; */
    text-align: center;
    color: #3895d3;
    /* line-height: 23px; */
    border-radius: 50%;
    margin-right: 5px;
    font-size: 16px


  }
  .play-game-compute{
    /*position: fixed;*/
    /*bottom: 0;*/
    background: #fff;
  }
  .play-game-compute /deep/ .vux-number-selector{
    background-color: #fff!important;
    border-radius: 50%;
    padding: 4px;
    border: 1px solid #2196f3;
  }
  .play-game-compute /deep/ .vux-number-input{
    margin: 0px 6px;
    border-radius: 3px;
  }
  .play-game-compute /deep/ .mu-fab-button{
    background-color: #fff!important;
    color: #03A9F4;
    border: 1px solid #03A9F4;
    box-shadow: none;

  }
  .play-game-compute /deep/ .material-icons{
    margin-top: -7px;
  }
  .play-game-compute /deep/ .mu-slider{
    color: #03A9F4!important;

  }
  .play-game /deep/ .mu-checkbox-icon{
    color: #615e5e;
  }
  .play-game-tab /deep/ .mu-tab-link-highlight{
    background-color: transparent;
  }
  .game-choose-span{
    display: inline-block;
    min-width: 7rem;
    height: 2.5rem;
    background-color: #fff;
    text-align: center;
    /* color: #fff; */
    border: 1px solid #9dc5b6;
     line-height:  2.5rem;
    border-radius: 3.5rem;
    margin-right: 5px;
    font-size: 1.14rem;
    padding: 0 1rem;
    margin-bottom: 6px;

  }
  .game-choose-span.active{
    background-color: #03A9F4;
    color: #fff;
  }
  .dialog-choose-game /deep/ .mu-item{
    padding: 0;
  }
  .compute-li /deep/ .vux-number-input {

    color: #03A9F4;

  }
  .panel-list-li{
    padding: 3px 1rem;
  }
  .panel-list-li:nth-child(odd){
    background-color: #e2e1e1;
  }
  .tz-top-model /deep/ .mu-expansion-panel-content{
    padding: 0px;
  }
  .tz-top-model /deep/ .mu-expansion-panel-header{
    min-height: 39px;
  }   .tz-top-model /deep/ .mu-icon-button{
   width: 39px;
          height: 39px;
  }
  .tz-top-model /deep/ .mu-expansion-panel__expand .mu-expansion-panel-header {
    min-height: 49x;
  }
  </style>
