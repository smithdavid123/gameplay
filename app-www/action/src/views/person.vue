<template>
  <div>
    <mu-appbar class=" header" color="primary">

      <mu-button icon slot="left" to="/service" style="padding: 0;width: 30px"><i class="iconfont ">&#xe62d;</i>
      </mu-button>
      <mu-button icon slot="left" to="/message" style="padding: 0;width: 30px"><i class="iconfont ">&#xe643;</i>
      </mu-button>

      <p class="tc">个人中心</p>

      <mu-button icon slot="right" to="/systemNotice" style="padding: 0;width: 30px"><i
        class="iconfont mr1">&#xe621;</i></mu-button>
      <mu-button icon slot="right" to="/setting" style="padding: 0;width: 30px"><i class="iconfont">&#xe78a;</i>
      </mu-button>


    </mu-appbar>
    <div class="content content-model" style="padding-bottom: 70px;background-color: #fff">
      <mu-container style="padding: 0;">
        <div class="person-first">
          <p class="tc"><img src="../assets/images/me_avatar.png" alt="user" ></p>
          <p class="tc cr2">账号：{{person.username}}  <span>&nbsp;&nbsp;</span> 昵称：{{person.nickname}}</p>
          <p class="zong-btn cr2">余额：<b class="cr6 f16">￥{{parseFloat(yedata).toFixed(3) || ''}}</b></p>
          <mu-row style="margin-top: 1em"  gutter class="cr2">
            <mu-col span="4" >
              <p class="tc "><b>{{today.consume?today.consume.toFixed(3):0}}</b></p>
              <p class="tc ">今日消费(元)</p>

            </mu-col>
            <mu-col span="4" >

                <p class="tc  "><b>{{today.moneyIn?today.moneyIn.toFixed(3):0}}</b></p>
              <p class="tc ">今日充值(元)</p>


            </mu-col>
            <mu-col span="4" >

                <p class="tc "><b>{{today.profit?today.profit.toFixed(3):0}}</b></p>
              <p class="tc ">今日盈利(元)</p>

            </mu-col>
          </mu-row>
        </div>
        <div style="background-color: #f2f5f7;width: 100%;height: 1rem"></div>
        <div class="person-info">
          <!-- 个人信息 -->
          <mu-row inline justify-content="center">
            <mu-col span="3" class="tc">
              <div  @touchstart="buttonDialog(2)" class="person-info-btn">
                <i class="iconfont" style="vertical-align: middle;">&#xe616;</i>
                提现
              </div>
            </mu-col>
            <mu-col span="3" class="tc cr4">
              <div  @touchstart="buttonDialog(1)" class="person-info-btn">
                <i class="iconfont " style="font-size: 2rem;vertical-align: sub;">&#xe63a;</i>
               充值
              </div>
            </mu-col>

            <mu-col span="3" class="tc">
              <router-link to="/personSearch?tabIndex=8">
                <div   class="person-info-btn">
                  <i class="iconfont" style="vertical-align: middle;">&#xef05;</i>
                  转账
                </div>
              </router-link>

            </mu-col>
          </mu-row>




        </div>
        <div style="background-color: #f2f5f7;width: 100%;height: 1rem"></div>

        <div style="  padding: 1em;" class="person-list">
          <mu-row gutter  style="width: 100%">

            <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:1}}">
                <div class="grid-cell">
                  <i class="iconfont  icon-baobiao" style="color:#f5a741;"></i>
                  <p class="cr1 f14" style="margin-top: 0">个人报表</p>
                </div>
              </router-link>

            </mu-col>
    <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:2}}">
                <div class="grid-cell">
                  <i class="iconfont  icon-rili"  style="color:#f5a741;"></i>
                  <p class="cr1 f14" style="margin-top: 0">投注记录</p>
                </div>
              </router-link>

            </mu-col>    <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:3}}">
                <div class="grid-cell">
                  <i class="iconfont  icon-jilu" style="color:#f5a741;"></i>
                  <p class="cr1 f14" style="margin-top: 0">追号记录</p>
                </div>
              </router-link>

            </mu-col>
   <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:4}}">
                <div class="grid-cell">
                  <i class="iconfont  icon-zijin" style="color: #da413e" ></i>
                  <p class="cr1 f14" style="margin-top: 0">资金明细</p>
                </div>
              </router-link>

            </mu-col>
   <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:5}}">
                <div class="grid-cell">
                  <i class="iconfont  icon-liudongzijintubiao22" style="color: #da413e"></i>
                  <p class="cr1 f14" style="margin-top: 0">存取款记录</p>
                </div>
              </router-link>

            </mu-col>
            <template v-if="person.type == 1">
   <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:7}}">
                <div class="grid-cell">
                  <i class="iconfont  icon-jiangli" style="color:#f5a741;" ></i>
                  <p class="cr1 f14" style="margin-top: 0">开户中心</p>
                </div>
              </router-link>

            </mu-col>
            </template>
            <template v-if="person.type == 1">

            <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:8}}">
                <div class="grid-cell">
                  <i class="iconfont cr5 icon-tuandui" ></i>
                  <p class="cr1 f14" style="margin-top: 0">团队管理</p>
                </div>
              </router-link>

            </mu-col>
            </template>
            <template v-if="person.type == 1">

            <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:9}}">
                <div class="grid-cell">
                  <i class="iconfont cr5 icon-tongjibaobiao" ></i>
                  <p class="cr1 f14" style="margin-top: 0">团队报表</p>
                </div>
              </router-link>

            </mu-col>
            </template>
            <template v-if="person.type == 1">

            <mu-col span="4" class="list-col">
              <router-link :to="{path: 'personSearch', query: {tabIndex:10}}">
                <div class="grid-cell">
                  <i class="iconfont cr5 icon-zhuitaojilu" ></i>
                  <p class="cr1 f14" style="margin-top: 0">团队投注记录</p>
                </div>
              </router-link>

            </mu-col>
            </template>
            <template v-if="dividendContract!=null">
              <mu-col span="4" class="list-col">
                <router-link :to="{path: 'personSearch', query: {tabIndex:12}}">
                  <div class="grid-cell">
                    <i class="iconfont cr5 icon-jilu1" ></i>
                    <p class="cr1 f14" style="margin-top: 0">契约中心</p>
                  </div>
                </router-link>

              </mu-col>


            </template>


          </mu-row>

        </div>

      </mu-container>


    </div>

  </div>
</template>
<script>
  import {searchOrder, accountToday, teamloadContractStatus,loopGameLottery} from '@/api/login'
  import store from '@/store'
  import {mapGetters} from 'vuex'

  export default {
    name: 'person',
    components: {},
    data() {
      return {
        today: '',
        startTime: '2023-02-01',
        endTime: '2023-02-02',
        options: [],

        person: '',
        usernameRules: [
          {validate: (val) => !!val, message: '必须填写用户名'},
          {validate: (val) => val.length >= 3, message: '用户名长度大于3'}
        ],
        passwordRules: [
          {validate: (val) => !!val, message: '必须填写密码'},
          {validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
        ],
        validateForm: {
          username: '',
          password: '',
        },
        dividendContract: null,
        yedata:'',
        yedata2:'',
        timer2:null,


      }
    },
    computed: {},
    mounted() {
      this.$nextTick(function () {
        this.timer2=setInterval(this.loopGameLotteryTimer, 5000);
      })
    },
    created() {
      teamloadContractStatus().then(res => {
        try {
          console.log(this.dividendContract);
          if (res.data) this.dividendContract = res.data.dividendContract.status;
        } catch (err) {
          console.log(err);
          this.dividendContract = null;
        }
      });

      this.person = JSON.parse(localStorage.getItem('initdata')).account;
      this.loopGameLotteryTimer();
      accountToday().then((res) => {
        this.today = res.data
      })
    },
    methods: {
      loopGameLotteryTimer(){
        // console.log(new Date());
        loopGameLottery().then(res=>{
          this.yedata = res.data.balanceAll;
          //this.yedata2 = res.data.balanceDeposit;

        })

      },

      buttonDialog(index) {

        this.$router.push({path: '/personPayment', query: {tabIndex: index}})
      },
      submit() {
        this.$refs.form.validate().then((result) => {
          console.log('form valid: ', result)
        });
      },



    },
    destroyed(){
      if(this.timer2) { //如果定时器在运行则关闭
        clearInterval(this.timer2);
      }
    }
  }
</script>
<style scoped>
  .person-info {
    border-radius: 5px;
    padding: 0.7em 0.25em;
    background-color: #fff;
  }
  .person-info .person-info-btn{
    font-size: 1.1rem;
  }
   .person-info .iconfont{
     font-size: 2.3rem;
     text-align: center;

   }
  .date-input {
    width: 35%;
    text-align: center;
  }

  .mu-demo-form {
    padding: 2em;
  }

  .demo-loadmore-wrap {
    width: 100%;
    max-width: 360px;
    height: 420px;
    display: flex;
    flex-direction: column;

  }

  .mu-appbar {
    width: 100%;
  }

  .demo-loadmore-content {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .person-list .iconfont {
    font-size: 21px;
  }
.person-list .list-col{
  text-align: center;
  margin-bottom: 1.5rem;
}
  .more-text {
    display: inline-block;
    width: 45%;
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }
  .person-first{
    padding: 1em;
    background-color: #fff;
  }
  .person-first img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .person-first .zong-btn{
    text-align: center;
    border: 1px solid #cacaca;
    border-radius: 20px;
    line-height: 33px;
    width: 82%;
    margin: 0 auto;
    margin-top: 16px;
  }
  .person-first .tc{
    margin: 0;
  }
  .container /deep/ .mu-list-two-line .mu-item{
     height: 36px;
    color: #606266;
    margin-bottom: 6px;
  }
</style>
