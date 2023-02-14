<template>
    <div class="pay" style="background-color: #fff">
      <mu-appbar class="tc header"  color="primary">
       <mu-button slot="left" icon to="helloWorld">
          <i class="iconfont">&#xe604;</i>
        </mu-button>

        <p class="tc">添加/删减彩种</p>
        <mu-button slot="right"  flat @click="sureGame" >
          完成
        </mu-button>
      </mu-appbar>

    <div class="content" style="padding-bottom: 0">
      <div>
        <mu-list v-for="item in option" >
          <mu-sub-header class="tc cr1">{{item.name}}</mu-sub-header>
          <mu-list-item button :ripple="false" v-for="(a,i) in item.tab" style="margin-bottom: 20px">
            <mu-list-item-action>
              <mu-avatar>
                <img :src="selectMap[a.name].img">
              </mu-avatar>
            </mu-list-item-action>

            <mu-list-item-content>
              <mu-list-item-title class="cr5"> {{a.name}}</mu-list-item-title>

              <div class="cr1 f12">{{ selectMap[a.name].content}}</div>

            </mu-list-item-content>
            <mu-list-item-action>
                <mu-checkbox  v-model="a.checked" @change="checkedBoxFun(a)" ></mu-checkbox>

            </mu-list-item-action>
          </mu-list-item>

        </mu-list>
      </div>

    </div>

  </div>
</template>
<script>

  import Cookies from 'js-cookie'
  export default {
    name: 'HelloWorld',
    components: {

    },
    data () {
      return {
        oppenDialog:true,
        checkedBox:[],
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
            img: require('../assets/images/qu10fen.png'),
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
          },
          'PC蛋蛋': {
            lottery: 'pcdd',
            img: require('../assets/images/pcdd.png'),
            content: '开奖时间：凌晨0点至24点，开奖频率：1分钟一期，每日期数：1440期。',
          },

        },
        option:[
          {
            name:'时时彩系列：',
            tab:[
              {  name:'奇趣分分彩',checked:false},
              {  name:'幸运十分彩',checked:false},
              {name:'河内分分彩',checked:false},
              {name:'河内5分彩',checked:false},
              {  name:'幸运5分彩',checked:false},
              {  name:'快乐2分彩',checked:false},
              {  name:'幸运分分彩',checked:false},
              {  name:'幸运三分彩',checked:false},

              {  name:'重庆时时彩',checked:false},

              { name:'天津时时彩',checked:false},
              { name:'新疆时时彩',checked:false},

              { name:'北京时时彩',checked:false},
              { name:'台湾时时彩',checked:false},

              { name:'腾讯分分彩',checked:false},
              { name:'奇趣5分彩',checked:false},
              { name:'奇趣十分彩',checked:false},

              ]



          },
          {
            name:'全天彩系列：',
            tab:[{name:'新加坡30秒彩',checked:false},
              {name:'美国一分彩',checked:false},
              {name:'韩国1.5分彩',checked:false},
              {name:'新德里1.5分彩',checked:false},
              {name:'俄罗斯1.5分彩', checked:false},
              {name:'印度1.5分彩',checked:false},
              {name:'东京1.5分彩', checked:false},
              {name:'缅甸3分彩', checked:false},
              {name:'新加坡2分彩', checked:false},
            ],  },
          {
            name:'11选5系列：',
            tab:[
              {name:'纽约11选5',checked:false},
              {name:'加拿大11选5',checked:false},
              {name:'广东11选5',checked:false},
              {name:'江西11选5',checked:false},
              {name:'安徽11选5',checked:false},
              {name:'上海11选5',checked:false},
              {name:'山东11选5',checked:false},
              {name:'辽宁11选5',checked:false},
            ],
          },
          {
            name:'快3系列：',
            tab:[
              {name:'吉隆坡快3',checked:false},
              {name:'新西兰快3',checked:false},
              {name:'江苏快3',checked:false},
              {name:'安徽快3',checked:false},
              {name:'湖北快3',checked:false},
              {name:'吉林快3',checked:false},
            ],
          },
          {
            name:'快乐8系列：',
            tab:[
              {name:'北京快乐8',checked:false},
              {name:'韩国快乐8',checked:false},
              {name:'台湾快乐8',checked:false},
              {name:'东京快乐8',checked:false},
              {name:'新加坡快乐8',checked:false}
            ],
          },
          {
            name:'其它彩种：',
            tab:[
              {name:'福彩3D',checked:false},
              {name:'排列三',checked:false},
              {name:'英国120秒赛车',checked:false},
              {name:'英国180秒赛车',checked:false},
              {name:'168飞艇',checked:false},
              {name:'北京PK拾',checked:false},
              {name:'PC蛋蛋',checked:false},
            ],
          },




        ],
        gameList:[],




      }
    },

    created(){
      var me  = this
      if(localStorage.getItem('appMyGame')){
        let  nam = JSON.parse(localStorage.getItem('initdata')).account.username;
        this.gameList = JSON.parse(localStorage.getItem('appMyGame'));
        this.gameList.map(function (a) {
          if ( a.username === nam)  { me.option=a.options }
        });

      }
    },
    methods:{
      checkedBoxFun(a){

      },
      sureGame(){
        let obj = {username: JSON.parse(localStorage.getItem('initdata')).account.username, options: this.option};
        this.gameList.push(obj);
        localStorage.setItem('appMyGame', JSON.stringify(this.gameList));
        this.$router.push({ path: '/helloWorld' })

      },
    }



  }
</script>
