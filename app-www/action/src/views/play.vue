<template>
  <div class="pay"  style="position: relative">
    <mu-appbar class="tc header" title="购彩大厅" color="primary">

    </mu-appbar>
    <div class="content playSlider">
      <div  >
        <div class="play-tab tc">
          <p>
            <span class="choose-play-btn " :class="{'chooseActive':chooseIndex == 1}" @click="chooseFun(1)">官方玩法</span>
          </p>
          <p>
            <span class="choose-play-btn"  :class="{'chooseActive':chooseIndex == 2}"  @click="chooseFun(2)">百家乐</span>

          </p>

        </div>
        <div style="margin-top: 80px;padding: 0 1rem">
          <div v-if="chooseIndex == 1">
            <div v-for="(item, index) in tab"  :key="index" class="choose-li">
              <p style="    margin-bottom: 26px;
    font-weight: 500;
    font-size: 16px;">| {{item.name}}</p>
              <div>
                <mu-row  gutter>
                  <mu-col span="4" v-for="g in item.value" :key="g.lottery" style="text-align: center">
                    <template v-if="filterData(g.lottery)">
                      <router-link :to="{path: 'playItem', query: {name: g.lottery}}">
                        <img :src="g.img"  class="grid-img"/>
                        <span class="play-cell">{{g.name}}</span>

                      </router-link>
                    </template>


                  </mu-col>

                </mu-row>
              </div>
            </div>

          </div>
          <div  v-if="chooseIndex == 2" style="    display: flex;
    flex-flow: wrap;
    justify-content: space-between;">
            <div  v-for="tile, index in listGame" :key="index" class="gridlist-demo">
                <img  :src="objName[tile.code]" style="float: left;width: 44%"/>
              <div style="float: left;width: 56%;text-align: center;">
                <p class="f16">{{tile.name}}</p>
                <p style="color: #fff;padding: 5px;text-align: center;width: 5rem;margin: 0 auto" :style="{'background-color':tile.status==-1?'red':'#2196f3'}">
                {{tile.status==-1?'开通游戏':'进入游戏'}}
                </p>
              </div>

            </div>
          </div>

        </div>

        </div>




    </div>






  </div>
</template>

<script>
  import {GameList} from '@/assets/js/game/game'
  import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import  {listAllGames} from  '@/api/login'

  export default {
    name: 'play',
    components: {
      Tab,TabItem,Swiper,SwiperItem
    },
    computed:{
      filterData(){
        return function (type) {
          let flag = true;
            this.storeInitData.forEach(a=>{
              if(a.shortName == type){

                flag = a.isShow == undefined? true:a.isShow;
              }
            });
         return flag;
        }
      }
    },
    data(){
      return{
        chooseIndex:1,
        active:parseInt(this.$route.query.source),
        tabName: '时时彩',
        listTab:['时时彩','全天彩','11选5','快3','快乐8','其它'],
        tab:[
          {name:'时时彩',value:[
              {img:require('../assets/images/qumin.png'), lottery: 'qumin', type: 1, name:'奇趣分分彩'},
              {img:require('../assets/images/qu5fen.png'), lottery: 'qu5fen', type: 1, name: '奇趣5分彩'},
              {img:require('../assets/images/qu10fen.png'), lottery: 'qu10fen', type: 1, name: '奇趣十分彩'},

              {img:require('../assets/images/t1s60h.png'), lottery: 't1s60h', type: 1, name:'河内分分彩'},

              {img:require('../assets/images/t1s300.png'), lottery: 't1s300', type: 1, name: '河内5分彩'},
              {img:require('../assets/images/home_ssc_cq.png'), lottery: 'cqssc', type: 1, name:'重庆时时彩'},
              {img:require('../assets/images/home_ssc_tj.png'), lottery: 'tjssc', type: 1, name: '天津时时彩'},
              {img:require('../assets/images/home_ssc_xj.png'), lottery: 'xjssc', type: 1, name:'新疆时时彩'},
              {img:require('../assets/images/home_ssc_bj.png'), lottery: 'bjssc', type: 1, name: '北京时时彩'},
              {img:require('../assets/images/qqmin.png'), lottery: 'qqmin', type: 1, name: '腾讯分分彩'},
              {img:require('../assets/images/t1s120.png'), lottery: 't1s120', type: 1, name: '快乐2分彩'},
              {img:require('../assets/images/ssc_default.png'), lottery: 't1s60a', type: 1, name: '幸运分分彩'},
              {img:require('../assets/images/t1s180a.png'), lottery: 't1s180a', type: 1, name: '幸运三分彩'},

              {img:require('../assets/images/t1s300a.png'), lottery: 't1s300a', type: 1, name: '幸运5分彩'},

              {img:require('../assets/images/t1s600.png'), lottery: 't1s600', type: 1, name:'幸运十分彩'},


      ]}
      , {name:'全天彩',value:[
              {img:require('../assets/images/home_ssc_tw.png'), lottery: 'twssc', type: 1, name:'台湾时时彩'},

              {img:require('../assets/images/home_qtc_singapore_30s.png'), lottery: 't1s30', type: 2, name: '新加坡30秒彩'},
              {img:require('../assets/images/home_gpc_t1s60.png'), lottery: 't1s60', type: 2, name: '美国一分彩'},
              {img:require('../assets/images/home_qtc_korea1_5m.png'), lottery: 't1s90', type: 2, name: '韩国1.5分彩'},
              {img:require('../assets/images/home_gpc_t1s90a.png'), lottery: 't1s90a', type: 2, name: '新德里1.5分彩'},

              {img:require('../assets/images/home_gpc_t1s90b.png'), lottery: 't1s90b', type: 2, name: '俄罗斯1.5分彩'},
              {img:require('../assets/images/home_qtc_india.png'), lottery: 't1s90c', type: 2, name: '印度1.5分彩'},
              {img:require('../assets/images/home_qtc_tokyo.png'), lottery: 't1s90d', type: 2, name: '东京1.5分彩'},
              {img:require('../assets/images/home_qtc_myanmar.png'), lottery: 't1s180', type: 2, name: '缅甸3分彩'},
              {img:require('../assets/images/home_qtc_singapore_2m.png'), lottery: 'sgssc', type: 2, name: '新加坡2分彩'},
            ]} , {name:'11选5',value:[
              {img:require('../assets/images/home_11x5_newyork.png'), lottery: 't2s30', type: 3, name: '纽约11选5'},
              {img:require('../assets/images/home_11x5_canada.png'), lottery: 't2s90', type: 3, name: '加拿大11选5'},
              {img:require('../assets/images/home_11x5_gd.png'), lottery: 'gd11x5', type: 3, name: '广东11选5'},
              {img:require('../assets/images/home_11x5_jx.png'), lottery: 'jx11x5', type: 3, name: '江西11选5'},
              {img:require('../assets/images/home_11x5_ah.png'), lottery: 'ah11x5', type: 3, name: '安徽11选5'},
              {img:require('../assets/images/home_11x5_sh.png'), lottery: 'sh11x5', type: 3, name: '上海11选5'},
              {img:require('../assets/images/home_11x5_sd.png'), lottery: 'sd11x5', type: 3, name: '山东11选5'},
              {img:require('../assets/images/home_11x5_ln.png'), lottery: 'ln11x5', type: 3, name: '辽宁11选5'},
            ]} , {name:'快3',value:[
              {img:require('../assets/images/home_k3_jlp.png'), lottery: 't3s90', type: 4, name: '吉隆坡快3'},
              {img:require('../assets/images/home_k3_xxl.png'), lottery: 't3s120', type: 4, name: '新西兰快3'},
              {img:require('../assets/images/home_k3_js.png'), lottery: 'jsk3', type: 4, name: '江苏快3'},
              {img:require('../assets/images/home_k3_ah.png'), lottery: 'ahk3', type: 4, name: '安徽快3'},
              {img:require('../assets/images/home_k3_hb.png'), lottery: 'hbk3', type: 4, name: '湖北快3'},
              {img:require('../assets/images/home_k3_jl.png'), lottery: 'jlk3', type: 4, name: '吉林快3'},


            ]}, {name:'快乐8',value:[
              {img:require('../assets/images/home_kl8_bj.png'), lottery: 'bjkl8', type: 5, name: '北京快乐8'},
              {img:require('../assets/images/home_klc_hgkl8.png'), lottery: 'hgkl8', type: 5, name: '韩国快乐8'},
              {img:require('../assets/images/home_klc_twkl8.png'), lottery: 'twkl8', type: 5, name: '台湾快乐8'},
              {img:require('../assets/images/home_klc_jpkl8.png'), lottery: 'jpkl8', type: 5, name: '东京快乐8'},
              {img:require('../assets/images/home_klc_sgkl8.png'), lottery: 'sgkl8', type: 5, name: '新加坡快乐8'}
            ]}, {name:'其它',value:[
              {img:require('../assets/images/home_other_fc3d.png'), lottery: 'fc3d', type: 6, name: '福彩3D'},
              {img:require('../assets/images/home_other_pl3.png'), lottery: 'pl3', type: 6, name: '排列三'},
              {img:require('../assets/images/home_other_sc120s.png'), lottery: 't6s120', type: 6, name: '英国120秒赛车'},
              {img:require('../assets/images/home_other_sc180s.png'), lottery: 't6s180', type: 6, name: '英国180秒赛车'},
              {img:require('../assets/images/t6s300.png'), lottery: 't6s300', type: 6, name: '168飞艇'},
              {img:require('../assets/images/home_other_pk10.png'), lottery: 'bjpk10', type: 6, name: '北京PK拾'},
              {img:require('../assets/images/pcdd.png'), lottery: 'pcdd', type: 4, name:'PC蛋蛋'},
            ]}
        ],
        storeInitData:[],
        listGame:[],
        objName:{
          'AG':require('../assets/images/item_AG.png'),
          'DG':require('../assets/images/item_DG.png'),
          'DS':require('../assets/images/item_DS.png'),
          'FT':require('../assets/images/item_FT.png'),
          'GG':require('../assets/images/item_GG.png'),
          'KY':require('../assets/images/item_KY.png'),
          'PT':require('../assets/images/item_AT.png'),
          'AT':require('../assets/images/item_AT.png'),
        }




      }
    },
    mounted: function () {
      // 返回购彩大厅时清除倍数记忆
      GameList.visitGame = 0;

      this.$vux.loading.hide()
      GameList.cache = GameList.list.reduce((a, b) => {
        a[b.shortName] = b; return a;
      }, {});
    },
    created(){
      this.getList();

      this.storeInitData = JSON.parse(localStorage.getItem('initdata')).gameLotteryInfoList;

      this.$vux.loading.show();
      this.chooseIndex  = this.$route.query.tabIndex?this.$route.query.tabIndex:1;


    },
    methods:{
      getList(){
        listAllGames().then((res)=>{
          this.listGame= res.data.gameList


        });
      },
      chooseFun(index){
        this.chooseIndex = index
        this.$router.push({ path: '/play',query:{tabIndex:index}})


      }

    }


  }
</script>
<style scoped>
  .play-tab{
    position: fixed;
    width: 100%;
    z-index: 999;
    background: #fff;
  }
  .playSlider{
    background-color: #f9fafb;

    padding-bottom: 51px;

  }

  .play-tab p{
    display: inline-block;
    width: 37%;
    text-align: center;
  }
  .choose-play-btn{
    background-color: #fff;
    border: 1px solid #ff8303;
    display: inline-block;
    padding: 6px;
    border-radius: 23px;
    color: #ff8303;
    width: 90%;
    text-align: center;
    font-size: 16px;
  }
  .chooseActive{
    background-color: #ff8303;
    color: #fff;
  }
  .play-cell{
    border: 1px solid #bdbdbd;
    border-radius: 5px;
    padding: 3px 0;
    display: inline-block;
    width: 96%;
    color: #424242;
    margin-bottom: 14px;
    font-size: 12px;
  }
  .choose-li {
    padding-bottom: 16px;
    border-bottom: 1px dashed #ccc;
    margin-bottom: 16px;
  }
  /*.weui-grid{
    text-align:center;
    cursor: pointer;
  }
  .weui-grid:before{
    border: 0;
  }
  .weui-grid:after{
    border: 0;
  }
  a{text-decoration: none}*/
  .gridlist-demo{
    width: 50%;

  }
  .grid-img{
    width: 55%;
    border-radius: 50%;
  }

</style>
