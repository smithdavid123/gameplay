<template>
  <div class="pay">
    <mu-appbar class="tc header" title="开奖中心" color="primary">

    </mu-appbar>
    <div class="content game-con">


      <mu-list v-for="(item, key ) in listData" @click="goRouter(key)">
        <mu-list-item avatar button :ripple="false">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="selectMap[key].img">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content class="clearfix">
            <div >
              <mu-list-item-title>{{  selectMap[key].name}}</mu-list-item-title>
              <mu-list-item-sub-title>第{{item.issue}}期</mu-list-item-sub-title>
            </div>

            <div >
              <div ><span v-for="j in item.code.split(',')" class="code-span">{{j}}</span></div>

            </div>
          </mu-list-item-content>
          <mu-list-item-action>
            <i class="iconfont icon-arrow-right"></i>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>


</div>
    <!-- 开奖记录 -->
    <mu-dialog transition="slide-bottom" fullscreen scrollable :open.sync="openFullscreen" class="open-game"
               >

      <mu-appbar color="#03A9F4" title="开奖中心" style="position: fixed;top: 0;width: 100%;z-index: 9999">
        <mu-button slot="left" icon @touchstart="closeFullscreenDialog">
          <i class="iconfont">&#xe604;</i>
        </mu-button>
      </mu-appbar>
      <div style="margin-top: 60px">
        <keep-alive>
          <lottery-list :titleName='titleName'></lottery-list>
          </keep-alive>
      </div>

    </mu-dialog>


  </div>




</template>
<script>
  import  {openCode} from  '@/api/login'
  import lotteryList from './lottery'

  export default {
    name: 'pay',
    components: {

      lotteryList,
    },
    data(){
      return{
        openFullscreen:false,
        listData:{},
        titleName:'',
        selectMap: {
          'qumin': {
            name: '奇趣分分彩',
            img: require('../assets/images/qumin.png'),
          },
          't1s600': {
            name:'幸运十分彩',
            img: require('../assets/images/t1s600.png'),
          },
          't1s60h': {
            name:'河内分分彩',
            img: require('../assets/images/t1s60h.png'),
          },
          't1s300': {
            name:'河内5分彩',
            img: require('../assets/images/t1s300.png'),
          },
          't1s300a': {
            name:'幸运5分彩',
            img: require('../assets/images/t1s300a.png'),
          },
          't1s120': {
            name:'快乐2分彩',
            img: require('../assets/images/t1s120.png'),
          },
          't1s60a': {
            name:'幸运分分彩',
            img: require('../assets/images/ssc_default.png'),
          },
          't1s180a': {
            name:'幸运三分彩',
            img: require('../assets/images/t1s180a.png'),
          },
          'cqssc': {
            name:'重庆时时彩',
            img: require('../assets/images/home_ssc_cq.png'),
          },
          'tjssc': {
            name:'天津时时彩',
            img: require('../assets/images/home_ssc_tj.png'),
          },
          'xjssc': {
            name:'新疆时时彩',
            img: require('../assets/images/home_ssc_xj.png'),
          },
          'bjssc': {
            name:'北京时时彩',
            img: require('../assets/images/home_ssc_bj.png'),
          },
          'twssc': {
            name:'台湾时时彩',
            img: require('../assets/images/home_ssc_tw.png'),
          },
          'qqmin': {
            name:'腾讯分分彩',
            img: require('../assets/images/qqmin.png'),
          },
          'qu5fen': {
            name:'奇趣5分彩',
            img: require('../assets/images/qu5fen.png'),
          },
          'qu10fen': {
            name:'奇趣十分彩',
            img: require('../assets/images/qu10fen.png'),
          },



          't1s30': {
            name:'新加坡30秒彩',
            img: require('../assets/images/home_qtc_singapore_30s.png'),
          },
          't1s60': {
            name:'美国一分彩',
            img: require('../assets/images/home_gpc_t1s60.png'),
          },
          't1s90': {
            name:'韩国1.5分彩',
            img: require('../assets/images/home_qtc_korea1_5m.png'),
          },
          't1s90a': {
            name:'新德里1.5分彩',
            img: require('../assets/images/home_gpc_t1s90a.png'),
          },
          't1s90b': {
            name:'俄罗斯1.5分彩',
            img: require('../assets/images/home_gpc_t1s90b.png'),
          },
          't1s90c': {
            name:'印度1.5分彩',
            img: require('../assets/images/home_qtc_india.png'),
          },
          't1s90d': {
            name:'东京1.5分彩',
            img: require('../assets/images/home_qtc_tokyo.png'),
          },
          't1s180': {
            name:'缅甸3分彩',
            img: require('../assets/images/home_qtc_myanmar.png'),
          },
          'sgssc': {
            name:'新加坡2分彩',
            img: require('../assets/images/home_qtc_singapore_2m.png'),
          },
          't2s30': {
            name:'纽约11选5',
            img: require('../assets/images/home_11x5_newyork.png'),

          },
          't2s90': {
            name:'加拿大11选5',
            img: require('../assets/images/home_11x5_canada.png'),

          },
          'gd11x5': {
            name:'广东11选5',
            img: require('../assets/images/home_11x5_gd.png'),

          },
          'jx11x5': {
            name:'江西11选5',
            img: require('../assets/images/home_11x5_jx.png'),

          },
          'ah11x5': {
            name:'安徽11选5',
            img: require('../assets/images/home_11x5_ah.png'),

          },
          'sh11x5': {
            name:'上海11选5',
            img: require('../assets/images/home_11x5_sh.png'),

          },
          'sd11x5': {
            name:'山东11选5',
            img: require('../assets/images/home_11x5_sd.png'),

          },
          'ln11x5': {
            name:'辽宁11选5',
            img: require('../assets/images/home_11x5_ln.png'),

          },

          't3s90': {
            name:'吉隆坡快3',
            img: require('../assets/images/home_k3_jlp.png'),

          },
          't3s120': {
            name:'新西兰快3',
            img: require('../assets/images/home_k3_xxl.png'),

          },
          'jsk3': {
            name:'江苏快3',
            img: require('../assets/images/home_k3_js.png'),

          },
          'ahk3': {
            name:'安徽快3',
            img: require('../assets/images/home_k3_ah.png'),

          },
          'hbk3': {
            name:'湖北快3',
            img: require('../assets/images/home_k3_hb.png'),
          },
          'jlk3': {
            name:'吉林快3',
            img: require('../assets/images/home_k3_jl.png'),

          },

          'bjkl8': {
            name:'北京快乐8',
            img: require('../assets/images/home_kl8_bj.png'),

          },
          'hgkl8': {
            name:'韩国快乐8',
            img: require('../assets/images/home_klc_hgkl8.png'),

          },
          'twkl8': {
            name:'台湾快乐8',
            img: require('../assets/images/home_klc_twkl8.png'),

          },
          'jpkl8': {
            name:'东京快乐8',
            img: require('../assets/images/home_klc_jpkl8.png'),

          },
          'sgkl8': {
            name:'新加坡快乐8',
            img: require('../assets/images/home_klc_sgkl8.png'),

          },

          'fc3d': {
            name:'福彩3D',
            img: require('../assets/images/home_other_fc3d.png'),

          },
          'pl3': {
            name:'排列三',
            img: require('../assets/images/home_other_pl3.png'),

          },
          't6s120': {
            name:'英国120秒赛车',
            img: require('../assets/images/home_other_sc120s.png'),

          },
          't6s180': {
            name:'英国180秒赛车',
            img: require('../assets/images/home_other_sc180s.png'),

          },
          't6s300': {
            name:'168飞艇',
            img: require('../assets/images/t6s300.png'),

          },
          'bjpk10': {
            name:'北京PK拾',
            img: require('../assets/images/home_other_pk10.png'),
          },
          'pcdd': {
            name:'PC蛋蛋',
            img: require('../assets/images/pcdd.png'),
          },

        },

      }
    },

    created(){
      this.$nextTick(()=>{
        this.getList()
      })

    },

    methods:{

      getList(){
        this.listData = JSON.parse(localStorage.getItem('listDataGame')) ;
        //   openCode().then((res)=>{
        //
        //     this.listData = res
        //
        // });


      },
      goRouter(key){
          this.titleName = key
        this.openFullscreen = true;

      },


      closeFullscreenDialog(){
        this.openFullscreen = false
      }

    },

  }
</script>
<style scoped>

  .game-con .code-span{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    /*! autoprefixer: off */
    background: linear-gradient(top left, #e8bb66, #d47705);/*渐变从左上角到右下角*/
    background: -ms-linear-gradient(top left, #e8bb66, #d47705);
    background: -webkit-linear-gradient(top left, #e8bb66, #d47705);
    /* autoprefixer: on */
    background: -moz-linear-gradient(top left, #e8bb66, #d47705);
    background-color: #d47705;
    color: #fff;
    text-align: center;
    line-height: 2rem;
    margin-right: 10px;
    border-radius: 50%;
    margin-bottom: 8px;
  }
  .game-con /deep/ .mu-list{
    background-color: #fff;
    margin-bottom: 1rem;
    overflow-x: visible;
  }.game-con /deep/ .mu-item.has-avatar{
    height: auto;
  }
  .open-game /deep/ .mu-dialog-body{
    max-height: 100%!important;
  }

</style>
