<template>
<div style="position: relative">
  <mu-appbar class=" header cr2"  color="primary" >
    <!--<mu-button slot="left" icon  @click="openFullscreenDialog">-->
      <!--<i class="iconfont " style="font-size: 22px">&#xe61a;</i>-->
    <!--</mu-button>-->
    <p class="tc">      <img src="../assets/images/Image004.png" style="    width: 38%;
    margin-top: 9%;"></p>
    <mu-button slot="right" icon >

    </mu-button>




  </mu-appbar>

<div class="content" style="background-color: #fff">
  <div>
    <div class="carousel-model">
      <mu-carousel hide-controls hide-indicators transition="fade" >
        <mu-carousel-item v-for="item in list">

          <img :src="item.img" @click='carouselFun(item.url)' style="width: 90%;"/>
        </mu-carousel-item>

      </mu-carousel>

    </div>
    <div class="home-notice" v-if="prizeList.length>0">
      <img  src="../assets/images/home_notice_icon.png" style="vertical-align: middle;float: left;margin-top: 8px"/>
      <div class="scroll-wrap">
        <ul class="scroll-content" :style="{ top }">
          <router-link to="systemNotice">
            <li v-for="(item,index) in prizeList" :key="index" class="cr2">{{item.title}}</li >
          </router-link>

        </ul>

      </div>
      <router-link to="/systemNotice">
        <p style="position: absolute;right: 10px;top:0" class="cr2 f14">更多 <i class="iconfont icon-arrow-right f14"></i></p>

      </router-link>

    </div>
    <div style="width: 100%;height: 10px;background-color: #f2f5f7"></div>

    <div style="background-color: #fff">
      <div>
        <div class="clearfix add-lottery-title">
          <p style="float:left;margin: 0"> <img src="../assets/images/turnable_bounus.png" style="width: 15%;
    vertical-align: sub;"> <b class="cr2 f16">百家乐</b></p>
          <router-link to="/play?tabIndex=2">
          <span style="float: right;margin-top: 6px;" class="cr2 f14">更多 <i class="iconfont icon-arrow-right f14"></i></span>
          </router-link>
         </div>

        <ul class="home-item">
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_AG.png"/></router-link> </li>
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_AT.png"/></router-link> </li>
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_FT.png"/></router-link> </li>
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_DG.png"/></router-link> </li>
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_DS.png"/></router-link> </li>
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_GG.png"/></router-link> </li>
          <li><router-link to="/play?tabIndex=2"><img src="../assets/images/item_KY.png"/></router-link> </li>
        </ul>
      </div>



      <div class="add-lottery">
        <div class="clearfix add-lottery-title">
          <p style="float:left;margin: 0"> <i class="iconfont cr5 icon-jiangbei " style="font-size: 19px"></i> <b class="cr2 f16">推荐彩票</b></p>
          <router-link to="/play">
            <span style="float: right;margin-top: 6px;" class="cr2 f14">更多 <i class="iconfont icon-arrow-right f14"></i></span>

          </router-link>


        </div>
        <div>
          <mu-row gutter  style="width: 100%">
            <mu-col span="4" v-for="(item,index) in gameList"  :key="index" style="text-align: center" >
              <router-link :to="{path: 'playItem', query: {name:selectMap[item].lottery}}">
                <div class="grid-cell">
                  <img :src="selectMap[item].img" class="grid-img">
                  <p class="cr1 f14" style="margin-top: 0">{{item}}</p>
                </div>
              </router-link>

            </mu-col>
            <!--<mu-col :span="4" style="text-align: center">-->
              <!--<router-link to="oppenGame">-->
                <!--<mu-button fab color="#fff">-->
                  <!--<b style="font-size: 43px;color: #c5b6b6" >+</b>-->
                <!--</mu-button>-->
              <!--</router-link>-->
            <!--</mu-col>-->

          </mu-row>
        </div>
      </div>
    </div>


  </div>

</div>

  <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
    <mu-appbar color="primary" title="Fullscreen Diaolog">
      <div style="position: relative">
        <mu-auto-complete :data="autoList" placeholder="请输入彩种" class="search-input" @select="searchFun" v-model="searchValue"></mu-auto-complete>

        <i class="iconfont " style="font-size: 22px;position: absolute;right: 12%;color: #bdbdbd">&#xe751;</i>

      </div>
      <mu-button slot="right" icon @click="closeFullscreenDialog">
        <mu-icon value="close"></mu-icon>
      </mu-button>

    </mu-appbar>

  </mu-dialog>
</div>





</template>

<script>
  import  {listNotice,teamloadContractStatus,openCode,initData, initDataAll} from  '@/api/login'
  import Cookies from 'js-cookie'
  import 'muse-ui-message/dist/muse-ui-message.css';
  import Message from 'muse-ui-message';
  export default {
  name: 'HelloWorld',
    components: {

    },
  data () {
    return {
      openFullscreen:false,
      selectMap: {
        '奇趣分分彩': {
          lottery: 'qumin',
          img: require('../assets/images/qumin.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '幸运十分彩': {
          lottery: 't1s600',
          img: require('../assets/images/t1s600.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '河内分分彩': {
          lottery: 't1s60h',
          img: require('../assets/images/t1s60h.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },'河内5分彩': {
          lottery: 't1s300',
          img: require('../assets/images/t1s300.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '幸运5分彩': {
          lottery: 't1s300a',
          img: require('../assets/images/t1s300a.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '快乐2分彩': {
          lottery: 't1s120',
          img: require('../assets/images/t1s120.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '幸运分分彩': {
          lottery: 't1s60a',
          img: require('../assets/images/ssc_default.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '幸运三分彩': {
          lottery: 't1s180a',
          img: require('../assets/images/t1s180a.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '重庆时时彩': {
          img: require('../assets/images/home_ssc_cq.png'),
          lottery: 'cqssc',
          content: '开奖时间：7点10分至凌晨3点10分，开奖频率：20分钟一期，每日期数：59期。',
        },
        '天津时时彩': {
          lottery: 'tjssc',
          img: require('../assets/images/home_ssc_tj.png'),
          content: '开奖时间：9点至23点，开奖频率：10分钟一期，每日期数：84期。',
        },

        '新疆时时彩': {
          lottery: 'xjssc',
          img: require('../assets/images/home_ssc_xj.png'),
          content: '开奖时间：10点至凌晨2点，开奖频率：10分钟一期，每日期数：96期。',
        },
        '北京时时彩': {
          lottery: 'bjssc',
          img: require('../assets/images/home_ssc_bj.png'),
          content: '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。',
        },
        '台湾时时彩': {
          lottery: 'twssc',
          img: require('../assets/images/home_ssc_tw.png'),
          content: '开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。',
        },
        '腾讯分分彩': {
          lottery: 'qqmin',
          img: require('../assets/images/qqmin.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '奇趣5分彩': {
          lottery: 'qu5fen',
          img: require('../assets/images/qu5fen.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期',
        },
        '奇趣十分彩': {
          lottery: 'qu10fen',
          img: require('../assets/images/qq10fen.png'),
          content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期',
        },



        '新加坡30秒彩': {
          lottery: 't1s30',
          img: require('../assets/images/home_qtc_singapore_30s.png'),
          content: '开奖时间：0点至24点，开奖频率：30秒一期，每日期数：2880期。',
        },
        '美国一分彩': {
          lottery: 't1s60',
          img: require('../assets/images/home_gpc_t1s60.png'),
          content: '开奖时间：0点至24点，开奖频率：60秒一期，每日期数：1440期。',
        },
        '韩国1.5分彩': {
          lottery: 't1s90',
          img: require('../assets/images/home_qtc_korea1_5m.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。',
        },

        '新德里1.5分彩': {
          lottery: 't1s90a',
          img: require('../assets/images/home_gpc_t1s90a.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期.',
        },
        '俄罗斯1.5分彩': {
          lottery: 't1s90b',
          img: require('../assets/images/home_gpc_t1s90b.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。',
        },
        '印度1.5分彩': {
          lottery: 't1s90c',
          img: require('../assets/images/home_qtc_india.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。',
        },
        '东京1.5分彩': {
          lottery: 't1s90d',
          img: require('../assets/images/home_qtc_tokyo.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。',
        },
        '缅甸3分彩': {
          lottery: 't1s180',
          img: require('../assets/images/home_qtc_myanmar.png'),
          content: '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。',
        },
        '新加坡2分彩': {
          lottery: 'sgssc',
          img: require('../assets/images/home_qtc_singapore_2m.png'),
          content: '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
        },
        '纽约11选5': {
          img: require('../assets/images/home_11x5_newyork.png'),
          content: '开奖时间：0点至24点，开奖频率：30秒一期，每日期数：2880期。',
          lottery: 't2s30'
        },
        '加拿大11选5': {
          img: require('../assets/images/home_11x5_canada.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。',
          lottery: 't2s90'
        },
        '广东11选5': {
          img: require('../assets/images/home_11x5_gd.png'),
          content: '开奖时间：9点至23点，开奖频率：10分钟一期，每日期数：84期。',
          lottery: 'gd11x5'
        },
        '江西11选5': {
          img: require('../assets/images/home_11x5_jx.png'),
          content: '开奖时间：9点至23点，开奖频率：10分钟一期，每日期数：84期。',
          lottery: 'jx11x5'
        },
        '安徽11选5': {
          img: require('../assets/images/home_11x5_ah.png'),
          content: '开奖时间：8点30分至22点，开奖频率：10分钟一期，每日期数：81期。',
          lottery: 'ah11x5'
        },
        '上海11选5': {
          img: require('../assets/images/home_11x5_sh.png'),
          content: '开奖时间：9点至23点，开奖频率：10分钟一期，每日期数：84期。',
          lottery: 'sh11x5'
        },

        '山东11选5': {
          img: require('../assets/images/home_11x5_sd.png'),
          content: '开奖时间：9点至22点，开奖频率：五分钟一期，每日期数：78期。',
          lottery: 'sd11x5'
        },
        '辽宁11选5': {
          img: require('../assets/images/home_11x5_ln.png'),
          content: '开奖时间：8点至22点，开奖频率：十分钟一期，每日期数：83期。',
          lottery: 'ln11x5'
        },

        '吉隆坡快3': {
          img: require('../assets/images/home_k3_jlp.png'),
          content: '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。',
          lottery: 't3s90'
        },
        '新西兰快3': {
          img: require('../assets/images/home_k3_xxl.png'),
          content: '开奖时间：0点至24点，开奖频率：120秒一期，每日期数：720期。',
          lottery: 't3s120'
        },
        '江苏快3': {
          img: require('../assets/images/home_k3_js.png'),
          content: '开奖时间：8点40分至22点，开奖频率：10分钟一期，每日期数：82期。',
          lottery: 'jsk3'
        },
        '安徽快3': {
          img: require('../assets/images/home_k3_ah.png'),
          content: '开奖时间：8点50分至22点，开奖频率：10分钟一期，每日期数：80期。',
          lottery: 'ahk3'
        },
        '湖北快3': {
          img: require('../assets/images/home_k3_hb.png'),
          content: '开奖时间：9点10分至22点，开奖频率：10分钟一期，每日期数：78期。',
          lottery: 'hbk3'
        },
        '吉林快3': {
          img: require('../assets/images/home_k3_jl.png'),
          content: '开奖时间：8点30分至21点，开奖频率：10分钟一期，每日期数：79期。',
          lottery: 'jlk3'
        },

        '北京快乐8': {
          img: require('../assets/images/home_kl8_bj.png'),
          content: '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。',
          lottery: 'bjkl8'
        },
        '韩国快乐8': {
          img: require('../assets/images/home_klc_hgkl8.png'),
          content: '开奖时间：凌晨0点至5点，7点至24点，开奖频率：90秒一期，凌晨200期，7点后680期，每日期数：880期。',
          lottery: 'hgkl8'
        },
        '台湾快乐8': {
          img: require('../assets/images/home_klc_twkl8.png'),
          content: '开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。',
          lottery: 'twkl8'
        },
        '东京快乐8': {
          img: require('../assets/images/home_klc_jpkl8.png'),
          content: '开奖时间：凌晨0点到7点，8点至24点，开奖频率：90秒一期，凌晨320期，8点后600期，每日期数：920期。',
          lottery: 'jpkl8'
        },
        '新加坡快乐8': {
          img: require('../assets/images/home_klc_sgkl8.png'),
          content: '开奖时间：凌晨0点到6点，8点至24点，开奖频率：2分钟一期，凌晨180期，8点后480期，每日期数：660期。',
          lottery: 'sgkl8'
        },

        '福彩3D': {
          img: require('../assets/images/home_other_fc3d.png'),
          content: '开奖时间：20点30分，开奖频率：一天一期，每日期数：1期。',
          lottery: 'fc3d'
        },
        '排列三': {
          img: require('../assets/images/home_other_pl3.png'),
          content: '开奖时间：20点30分，开奖频率：一天一期，每日期数：1期。',
          lottery: 'pl3'
        },
        '英国120秒赛车': {
          img: require('../assets/images/home_other_sc120s.png'),
          content: '开奖时间：0点至24点，开奖频率：120秒一期，每日期数：720期。',
          lottery: 't6s120'
        },
        '英国180秒赛车': {
          img: require('../assets/images/home_other_sc180s.png'),
          content: '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。',
          lottery: 't6s180'
        },
        '168飞艇': {
          img: require('../assets/images/t6s300.png'),
          content: '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。',
          lottery: 't6s300'
        },
        '北京PK拾': {
          img: require('../assets/images/home_other_pk10.png'),
          content: '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期',
          lottery: 'bjpk10'
        },'PC蛋蛋': {
          img: require('../assets/images/pcdd.png'),
          content: '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期',
          lottery: 'pcdd'
        },


      },
      autoList:['奇趣分分彩','幸运十分彩','河内分分彩','河内5分彩','幸运5分彩','快乐2分彩','幸运分分彩',
        '幸运三分彩','重庆时时彩','天津时时彩','新疆时时彩','北京时时彩','台湾时时彩','腾讯分分彩','奇趣5分彩',
        '奇趣十分彩','新加坡30秒彩','美国一分彩','韩国1.5分彩','新德里1.5分彩','俄罗斯1.5分彩','印度1.5分彩',
        '东京1.5分彩','缅甸3分彩','新加坡2分彩','纽约11选5','加拿大11选5','广东11选5','江西11选5','安徽11选5',
        '上海11选5','山东11选5','辽宁11选5','吉隆坡快3','新西兰快3','江苏快3','安徽快3','湖北快3',
        '吉林快3','北京快乐8','韩国快乐8','台湾快乐8','东京快乐8','新加坡快乐8','福彩3D','排列三','英国120秒赛车',
        '英国180秒赛车','168飞艇','北京PK拾','PC蛋蛋'],
      searchValue:'',
      gameList: ['奇趣分分彩','奇趣5分彩','河内分分彩','河内5分彩','168飞艇','重庆时时彩'],
      prizeList: [
        {name: 1},
        {name: 2},
      ],
      activeIndex: 0,
      list: [{
        img: require('../assets/images/home_banner.png'),
        url:'play'
      },{
        img: require('../assets/images/home_banner_1.png'),
      }, {
        img: require('../assets/images/home_banner_2.png'),
      }, {
        img: require('../assets/images/home_banner_3.png'),
      }
      ]
    }
  },

    computed: {
      top() {
        return - this.activeIndex * 40 + 'px';
      }
    },

    mounted() {
      /*
      const loading = this.$loading({
        overlayColor: 'hsla(0,0%,100%,.6)',        // 背景色
        size: 40,
        color: 'primary',                           // color
        text: '加载中'
      });
      // --------------------------------加载重要初始化数据·改为分片加载----------------------------
      if (this.needUpdateInit()) {
        let finished = false;
        setTimeout(()=>{
          if (!finished) {
            alert("检测到您的设备网络不畅或遇到系统故障，您可以关闭APP后重试。 若多次失败请联系客服，感谢您的支持！！");
            loading.close();
          }
        }, 15000);
        initDataAll(res => {
          let data = res[0];
          // 使用本地信息
          data['gameLotteryInfoList'] = GameList.list;
          data['gameLotteryMethodList'] = [];
          res[1].forEach(d => {
            data['gameLotteryMethodList'].push({'lottery': d[0], 'methodName': d[1], 'bonus': d[2]});
          });
          // 原全数据传输方式
          // let keys = res[1].keys;
          // [1, 2, 3].forEach(idx => {
          //   res[idx].methods.forEach(d => {
          //     let item = keys.reduce((a, b, i) => {
          //       a[b] = d[i];
          //       return a;
          //     }, {});
          //     data['gameLotteryMethodList'].push(item);
          //   });
          // });

          localStorage.setItem('initdata', JSON.stringify(data));
          localStorage.setItem('initdataTime', (new Date()).getTime());
          finished = true;
          setTimeout(() => {
            loading.close();
          }, 50);
          // console.log(data);
        });
        // initData().then(res=>{
        //   localStorage.setItem('initdata', JSON.stringify(res.data));
        //   localStorage.setItem('initdataTime', (new Date()).getTime());
        //   setTimeout(() => {
        //     loading.close();
        //   }, 150);
        // });
    } else {
      loading.close();
    }
    */
    this.$vux.loading.hide();
    //-------------------------------------------------------------------------------------------------

    setInterval(_ => {
      if(this.activeIndex < this.prizeList.length-1) {
        this.activeIndex += 1;
      } else {
        this.activeIndex = 0;
      }
    }, 3000);
    listNotice({content:true}).then((response)=>{

      this.prizeList=response;
    }).catch((response)=>{
      console.log(response);
    })


    },
    created(){

      this.$vux.loading.show()

      teamloadContractStatus().then((res)=>{
        if(res.data.dividendContract.status == 0){
          Message.confirm('您有新的契约需要同意，是否立即处理？', '提示', {
            type: 'warning'
          }).then(({ result }) => {
            if (result) {

              this.$router.push({ path: '/personSearch?tabIndex=12' })

            }
          });

        }
      }).catch((response)=>{
        console.log(response);
      });
      let arr =[];
      if(localStorage.getItem('appMyGame')){
        console.log(JSON.parse(localStorage.getItem('initdata')));
        console.log(JSON.parse(localStorage.getItem('appMyGame')));
        let  nam = JSON.parse(localStorage.getItem('initdata')).account.username;
        let list = JSON.parse(localStorage.getItem('appMyGame'));
        list.map(function (a) {
          if ( a.username === nam)  { arr=a.options }
        });

      }
      // var me  = this
      // arr.forEach(function (a) {
      //   a.tab.forEach(function (b) {
      //     me.gameList.push(b)
      //   })
      //
      // })
      openCode().then((res)=>{
        localStorage.setItem('listDataGame', JSON.stringify(res));

      });

    },
    methods:{
      needUpdateInit() {
        let _initdata = localStorage.getItem('initdata');
        if (!_initdata) return true;
        try {
          let _username = localStorage.getItem('currentUser');
          let ds = JSON.parse(_initdata);
          if (ds.account.username !== _username) return true;
          let _inittime = localStorage.getItem('initdataTime');
          let tms = ((new Date()).getTime() - _inittime) / 1000;
          return tms > 86400;
        } catch (e) {
          console.log(e)
          return true;
        }
      },
      carouselFun(url){
        if(url){
          this.$router.push({path:'/play'})

        }else{
          this.$toast.message({
            message: '暂未开放！',
            position: 'bottom-end',               // 弹出的位置
            close: false,
          });
        }

      },
      openFullscreenDialog () {
        this.openFullscreen = true;
      },
      closeFullscreenDialog () {
        this.openFullscreen = false;
      },
      searchFun(){

        this.$router.push({ path: '/playItem',query:{name:this.selectMap[this.searchValue].lottery}})
      }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carousel-model{
  position: relative;
  padding: 1rem 0rem;
  background:#f2f5f7;
}
  .home-item{
    overflow-x: auto;
    white-space: nowrap;
    width: auto;
    padding: 0;
  }


  .home-item li {
    margin-left: 10px;
  display: inline-block;
    width: 22%;
  }
  .home-item li img{
    display: inline-block;
    width: 100%;
  }
  .home-notice{
    height: 40px;
    background:   #fff;
    box-sizing: border-box;
    width: 100%;
    bottom: 0;
    padding: 0px 1rem;
    position: relative;
  }
  .home-notice-img{
    float: left;
    width: 10%;

  }

  .scroll-wrap{
    width: 80%;
    height: 40px;

    overflow: hidden;
  }

  .scroll-content {
    position: relative;
    transition: top 0.5s;
    margin: 0;
    padding-left: 10px;
  }

.scroll-content li{
  line-height: 40px;
  list-style: none;
}
.add-lottery{
  color: #424242;
}
  .add-lottery-title{
    padding: 6px 10px;

    margin-bottom: 10px;
  }


  .search-input{
    width: 90%;
    margin: 0 auto;
    border-radius: 15px;
    height: 30px;
    border: 0;
    line-height: 28px;
    text-indent: 1em;
    outline: none;
    font-size: 14px;
  }
  .search-input /deep/ .mu-input-content{
    background-color: #fff;
    border-radius: 18px;
  }  .search-input /deep/ .mu-text-field-input{
   border: 0;
  text-indent: 18px;
  }
.search-input ::-webkit-input-placeholder { /* WebKit browsers */
  color: #4d4d4d;
  font-size: 14px;
}

.search-input ::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #4d4d4d;
  font-size: 14px;
}

.search-input :-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #4d4d4d;
  font-size: 14px;
}
.grid-img{
  width: 50%;
  border-radius: 50%;
}
.add-lottery /deep/ .material-icons{
  font-size: 48px!important;
  color: #7d8eec;
}
</style>
