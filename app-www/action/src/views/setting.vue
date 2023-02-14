<template>
  <div>
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/person">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">设置</p>

      <mu-button slot="right" icon >
        <i class="iconfont" >&#xe629;</i>
      </mu-button>

    </mu-appbar>
    <div class="content">
      <div>
        <mu-list  textline="two-line" dense @change="setFirstModel" >
          <template v-for="item in tab">
            <mu-list-item button  :value="item.name"  >

              <mu-list-item-title><i class="iconfont cr2" v-html="item.icon"></i>{{item.name}}</mu-list-item-title>

              <mu-list-item-action>
                <i class="iconfont cr2">&#xef06;</i>
              </mu-list-item-action>
            </mu-list-item>
            <mu-divider></mu-divider>
          </template>

        </mu-list>
        <mu-list style="margin-top: 20px"  textline="two-line" dense  >

            <mu-list-item button   @click="events = !events">

              <mu-list-item-title><i class="iconfont cr2" >&#xe667;</i>期数截止提示音开关</mu-list-item-title>

              <mu-list-item-action>

                  <mu-switch v-model="events" readonly></mu-switch>


              </mu-list-item-action>
            </mu-list-item>
            <mu-divider></mu-divider>
          <mu-list-item button   @click="tiaojieFun">

              <mu-list-item-title><i class="iconfont cr2" >&#xe649;</i>奖金调节开关</mu-list-item-title>

              <mu-list-item-action>

                  <mu-switch v-model="events1" readonly></mu-switch>


              </mu-list-item-action>
            </mu-list-item>
            <mu-divider></mu-divider>


        </mu-list>
        <mu-list style="margin-top: 20px"  textline="two-line" dense @change="setFirstModel"  >
          <template v-for="item in tab2">
            <mu-list-item button  :value="item.name" >

              <mu-list-item-title><i class="iconfont cr2" v-html="item.icon"></i>{{item.name}}</mu-list-item-title>

              <mu-list-item-action>
                <i class="iconfont cr2">&#xef06;</i>
              </mu-list-item-action>
            </mu-list-item>
            <mu-divider></mu-divider>
          </template>

        </mu-list>
       <p class="tc"> <mu-button color="#7d8eec" style="width: 80%;color: #fff" @click="logout">退出登录</mu-button></p>

      </div>

    </div>



  </div>
</template>
<script>
  import  {modifyNickname,modifyPassword,modifyWithdrawPassword,listCard,setDefaultCard,prepareBindCard,bindCard,logout,getBindStatus} from  '@/api/login'
  import  {isPassword} from  '@/utils/validate'

  export default {
    name: 'setting',
    data() {
      return {

        events: false,
        events1: false,

        prizeList:[],
        tab:[
          {
          name:'修改昵称',
          icon:'&#xe60e;'
        },{
          name:'修改登录密码',
          icon:'&#xe658;'
        },{
          name:'设置资金密码',
          icon:'&#xe6a6;'
        },{
          name:'设置密保问题',
          icon:'&#xe632;'
        },{
          name:'绑定取款人',
          icon:'&#xe955;'
        },{
          name:'银行卡管理',
          icon:'&#xe60f;'
        }],
        tab1:[
       /*   {
          name:'指纹解锁开关',
          icon:'&#xe696;'
        },{
          name:'期数截止手机振动开关',
          icon:'&#xe62f;'
        },*/
          {
          name:'期数截止提示音开关',
            id:'3',
          icon:'&#xe667;'
        },
          {
          name:'奖金调节开关',
            id:'4',
          icon:'&#xe649;'
        }],
        tab2:[{
          name:'App下载二维码',
          icon:'&#xe700;'
        },{
          name:'软件版本',
          icon:'&#xe615;'
        }],

        isBindSecurity:'',
        isBindWithdrawName:'',
        userName:''


      }
    },
    created(){
      getBindStatus().then(res=>{
        this.isBindSecurity= res.data.isBindSecurity
        this.isBindWithdrawName= res.data.isBindWithdrawName
      });
      this.userName = JSON.parse(localStorage.getItem('initdata')).account.username;

      if(localStorage.getItem('isEvents')){
        if(this.userName == JSON.parse(localStorage.getItem('isEvents')).userName){
          this.events1 = JSON.parse(localStorage.getItem('isEvents')).flag

        }else{
          this.events1 =  false

        }

      }else{
        this.events1 =  false
      }

    },
    methods:{
      tiaojieFun(){
        this.events1 = !this.events1;

        localStorage.setItem('isEvents', JSON.stringify( {userName:this.userName,flag:this.events1}));

      },
      /*退出*/
      logout(){
        /*退出*/
        this.$store.dispatch('LogOut').then(()=>{
          this.$router.push({ path: '/login' });

          localStorage.removeItem('initdata')
        }).catch(()=>{

        })

      },
      setFirstModel(even){
       if(even == '设置密保问题' && this.isBindSecurity){

         this.$toast.success({
           message: '密保已设置！',
           position: 'center',               // 弹出的位置

         });
         return;
       }

       if(even == '绑定取款人' && this.isBindWithdrawName){

         this.$toast.success({
           message: '取款人已绑定！',
           position: 'center',               // 弹出的位置

         });
         return;
       }
        this.$router.push({ path: '/setModel',query: {name: even} })
      },





    }
  }
</script>
<style scoped>
  /*银行代码*/
  .bank-model{
    border: 1px solid #d7ddeb;
    border-radius: 3px;
    text-align: center;
    padding: 10px 0px;

  }
  .main-panel .bank-code {
    width: 154px;
    height: 40px;
    margin: 0 auto;
    background: url("../assets/images/bank_list.png");
  }

  .main-panel .bank-code.b1 {
    background-position: 0 0;
  }

  .main-panel .bank-code.b2 {
    background-position: 0 -48px;
  }

  .main-panel .bank-code.b3 {
    background-position: 0 -96px;
  }

  .main-panel .bank-code.b4 {
    background-position: 0 -144px;
  }

  .main-panel .bank-code.b5 {
    background-position: 0 -192px;
  }

  .main-panel .bank-code.b6 {
    background-position: 0 -240px;
  }

  .main-panel .bank-code.b7 {
    background-position: 0 -288px;
  }

  .main-panel .bank-code.b8 {
    background-position: 0 -336px;
  }

  .main-panel .bank-code.b9 {
    background-position: 0 -384px;
  }

  .main-panel .bank-code.b10 {
    background-position: 0 -432px;
  }

  .main-panel .bank-code.b11 {
    background-position: 0 -480px;
  }

  .main-panel .bank-code.b12 {
    background-position: 0 -528px;
  }

  .main-panel .bank-code.b13 {
    background-position: 0 -576px;
  }

  .main-panel .bank-code.b14 {
    background-position: 0 -624px;
  }

  .main-panel .bank-code.b15 {
    background-position: 0 -672px;
  }

  .main-panel .bank-code.b16 {
    background-position: 0 -720px;
  }

  .main-panel .bank-code.b17 {
    background-position: 0 -768px;
  }

  .main-panel .bank-code.b18 {
    background-position: 0 -816px;
  }

  .main-panel .bank-code.b19 {
    background-position: 0 -864px;
  }

  .main-panel .bank-code.b20 {
    background-position: 0 -912px;
  }

  .main-panel .bank-code.b21 {
    background-position: 0 -960px;
  }

  .main-panel .bank-code.b22 {
    background-position: 0 -1008px;
  }

  .main-panel .bank-code.b23 {
    background-position: 0 -1056px;
  }

  .main-panel .bank-code.b24 {
    background-position: 0 -1104px;
  }

  .main-panel .bank-code.wxpay {
    background-position: 0 -1152px;
  }

  .main-panel .bank-code.alipay {
    background-position: 0 -1200px;
  }

  .main-panel .bank-code.nocard {
    background-position: 0 -1248px;
  }

  .main-panel .bank-code.qqpay {
    background-position: 0 -1296px;
  }

  .main-panel .bank-code.jdpay {
    background-position: 0 -1344px;
  }
  .main-panel .bank-code.unionpay {
    background-position: 0 -1392px;
  }
  .main-panel .bank-code.dcbuy {
    background-position: 0 -1488px;
  }
  .content /deep/ .mu-list-two-line .mu-item{
    height: 36px;
    color: #606266;
    margin-bottom: 6px;
  }
</style>
