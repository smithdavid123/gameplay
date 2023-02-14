<template>
  <div>
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/setting">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">{{titleName}}</p>
      <mu-button slot="right" icon >

      </mu-button>

    </mu-appbar>
    <div class="content">
      <div>
        <div class="date-select " style="padding: 20px" v-if="titleName == '修改昵称'">
          <mu-form ref="form" :model="validateForm" label-position="top" class="mu-demo-form ">


            <mu-form-item prop="nickname" label="昵称" :rules="usernameRules" >
              <mu-text-field v-model="validateForm.nickname"></mu-text-field>
            </mu-form-item>
            <mu-form-item>

              <mu-button color="#7d8eec" @click="setName" style="width: 91%">确认修改</mu-button>
            </mu-form-item>
          </mu-form>
        </div>
        <div class="date-select " v-if="titleName == '修改登录密码'" style="padding: 20px">
          <mu-form ref="form1" :model="passForm"   label-position="top" class="mu-demo-form ">


            <mu-form-item prop="oldPassword" label="请输入旧密码" :rules="passRuless.oldPassword" >
              <mu-text-field v-model="passForm.oldPassword" type="password"></mu-text-field>
            </mu-form-item>

            <mu-form-item prop="newPassword" label="请输入新密码" :rules="passRuless.newPassword">
              <mu-text-field v-model="passForm.newPassword" type="password"></mu-text-field>
            </mu-form-item>

            <mu-form-item prop="againPassword" label="请重复新密码" :rules="passRuless.againPassword" >
              <mu-text-field v-model="passForm.againPassword" type="password"></mu-text-field>
            </mu-form-item>
            <mu-form-item>

              <mu-button color="#7d8eec" @click="setPass" style="width: 91%">确认修改</mu-button>
            </mu-form-item>
          </mu-form>
        </div>
        <div class="date-select " v-if="titleName == '设置资金密码'" style="padding: 20px">
          <mu-form ref="form2" :model="moneyForm"   label-position="top" class="mu-demo-form ">


            <mu-form-item prop="oldPassword" label="请输入旧密码" :rules="passRuless.oldPassword"  v-if="bindCardList.hasWithdrawPwd" >
              <mu-text-field v-model="moneyForm.oldPassword" type="password"></mu-text-field>
            </mu-form-item>

            <mu-form-item prop="newPassword" label="请输入新密码" :rules="passRuless.newPassword">
              <mu-text-field v-model="moneyForm.newPassword" type="password"></mu-text-field>
            </mu-form-item>

            <mu-form-item prop="againPassword" label="请重复新密码" :rules="passRuless.againPassword" >
              <mu-text-field v-model="moneyForm.againPassword" type="password"></mu-text-field>
            </mu-form-item>
            <mu-form-item>

              <mu-button color="#7d8eec" @click="setMoney" style="width: 91%">确认修改</mu-button>
            </mu-form-item>
          </mu-form>
        </div>
        <div class="date-select " v-if="titleName == '设置密保问题'" style="padding: 20px">
          <mu-form  :model="guardForm" ref="form3"  label-position="top" class="mu-demo-form ">


            <mu-form-item prop="question1" label="问题一" :rules="guardRules.question1">
              <mu-select v-model="guardForm.question1">
                <mu-option v-for="option,index in guardOption1.slice(0.8)" :key="option.name" :label="option.name" :value="option.name"></mu-option>
              </mu-select>
            </mu-form-item>
            <mu-form-item prop="answer1" label="回答一" :rules="guardRules.answer1">
              <mu-text-field v-model="guardForm.answer1" ></mu-text-field>
            </mu-form-item>

            <mu-form-item prop="question2" label="问题二" :rules="guardRules.question2">
              <mu-select v-model="guardForm.question2">
                <mu-option v-for="option,index in guardOption1.slice(8.16)" :key="option.name" :label="option.name" :value="option.name"></mu-option>
              </mu-select>
            </mu-form-item>
            <mu-form-item prop="answer2" label="回答二" :rules="guardRules.answer2">
              <mu-text-field v-model="guardForm.answer2" ></mu-text-field >
            </mu-form-item>

            <mu-form-item prop="question3" label="问题三" :rules="guardRules.question3">
              <mu-select v-model="guardForm.question3">
                <mu-option v-for="option,index in guardOption1.slice(16.30)" :key="option.name" :label="option.name" :value="option.name"></mu-option>
              </mu-select>
            </mu-form-item>
            <mu-form-item prop="answer3" label="回答三" :rules="guardRules.answer3">
              <mu-text-field v-model="guardForm.answer3" ></mu-text-field>
            </mu-form-item>
            <mu-form-item>

              <mu-button color="#7d8eec"  @click="bindSecurityFun" style="width: 91%">确认设置</mu-button>
            </mu-form-item>
          </mu-form>
        </div>
        <div class="date-select " v-if="titleName == '绑定取款人'" style="padding: 20px">
          <mu-form  :model="bnameForm"  ref="form5" label-position="top" class="mu-demo-form ">

            <mu-form-item prop="name" label="取款人" :rules="bnameRules.name">
              <mu-text-field v-model="bnameForm.name" placeholder="取款人必须与银行卡姓名相同" ></mu-text-field>
            </mu-form-item>


            <mu-form-item>

              <mu-button color="#7d8eec"  @click="bindsetupWithdrawName" style="width: 91%">确认绑定</mu-button>
            </mu-form-item>
          </mu-form>
        </div>
        <div class="date-select main-panel " v-if="titleName == '银行卡管理'" style="padding: 20px">
          <div  v-for="(item,index) in cardList" style="margin-bottom: 20px">
            <div><span>提现银行卡{{index+1}}：</span>
              <mu-button flat color="warning" v-if="item.isDefault">已设为默认</mu-button>
              <mu-button flat color="#7d8eec"  v-else @click="setDefault(item.id)">设为默认</mu-button>
            </div>
            <div class="bank-model">
              <span class="bank-code" :class="'b'+item.bankId" style="display: inline-block;vertical-align: middle;"></span>
              <span>{{item.bankName}}</span>
              <span>{{item.bankCardId}}</span>
            </div>



          </div>
          <p v-if="cardList.length>0">您已绑定{{cardList.length}}张银行卡，您还可以绑定{{5- parseInt(cardList.length)}}张银行卡.</p>
          <div >
            <p>新增提现银行卡:</p>


            <div class="bank-model">

              <p>没有绑定银行卡，请点击添加按钮添加银行卡</p>
              <mu-button  color="#7d8eec" @click="bindModelCard" >
                +添加银行卡
              </mu-button>
            </div>
            <p>绑定银行卡就可以取款，一张银行卡只能绑定一个账号，一个账号可以绑定5张同姓名银行卡。已绑定的银行卡不能删除。</p>

          </div>


        </div>
        <div class="date-select " style="padding: 20px" v-if="titleName == 'App下载二维码'">
          <div  >
            <p style="text-align: center">{{imgdata[0].title}}</p>
            <p style="text-align: center">{{imgdata[0].url}}</p>
            <p style="text-align: center">

              <canvas id="canvas0"></canvas>
            </p>

          </div>
          <div class="mt1">
            <p style="text-align: center">{{imgdata[1].title}}</p>
            <p style="text-align: center">{{imgdata[1].url}}</p>
            <p style="text-align: center">
            <canvas id="canvas1"></canvas>
            </p>
          </div>


      </div>
        <div class="date-select " style="padding: 20px" v-if="titleName == '软件版本'">
          <p>壹佰娱乐</p>
            最新版本：V{{appVersion}}

        </div>

    </div>
    </div>



  </div>
</template>
<script>
  import  {getBindStatus,nitData,modifyNickname,modifyPassword,modifyWithdrawPassword,setupWithdrawPassword,setupWithdrawName,
    listCard,setDefaultCard,prepareBindCard,bindCard,getdownloadurlstitle,bindSecurity} from  '@/api/login'
  import  {isPassword} from  '@/utils/validate'
  import QRCode from 'qrcode'
  import Version from  '@/utils/version'
  let vps = Version.toString().split("");

  export default {
    name: 'setModel',
    data() {
      return {
        titleName:this.$route.query.name,
        appVersion: vps.join("."),
        validateForm: {
          nickname: '',
        },
        usernameRules: [
          { validate: (val) => !!val, message: '必须填写昵称'},
        ],
        passForm:{
          oldPassword:'',
          newPassword:'',
        },
        passRuless:{
          oldPassword: [
            { validate: (val) => !!val, message: '必须填写旧密码'},
          ],
          newPassword: [
            { validate: (val) => !!val, message: '必须填写新密码'},
            { validate: isPassword, message: '请输入字母与数字组合且为6-20位数'},
          ],
          againPassword:[
            { validate: (val) => !!val, message: '必须填写密码'},
            { validate: isPassword, message: '请输入字母与数字组合且为6-20位数'},
          ]

        },
        moneyForm:{
          oldPassword:'',
          newPassword:'',
        },
        bnameRules:{
          name:[  { validate: (val) => !!val, message: '必须填写名字'},]
        },
        bnameForm:{
          name:'',
        },

        guardOption1:[
          {name:'我最爱看哪部美剧?'},
          {name:'我最喜欢吃的美食是?'},
          {name:'我最喜欢哪个球队?'},
          {name:'我最喜欢玩的游戏是?'},
          {name:'我最喜欢的颜色是?'},
          {name:'我最爱看的电影是?'},
          {name:'我的座右铭是?'},
          {name:'我的幸运数字是?'},
          {name:'我父亲的姓名是?'},
          {name:'我母亲的姓名是?'},
          {name:'我配偶的名字是?'},
          {name:'我的出生地是?'},
          {name:'我毕业的学校是?'},
          {name:'我父亲的生日是?'},
          {name:'我母亲的生日是?'},
          {name:'我配偶的生日是?'},
          {name:'你的初中班主任名字是什么?'},
          {name:'你的初恋叫什么名字?'},
          {name:'你小时候最喜欢哪一本书?'},
          {name:'你的理想工作是什么?'},
          {name:'你童年时代的绰号是什么?'},
          {name:'你拥有的第一辆车是什么型号?'},
          {name:'你最喜欢哪个歌手或乐队?'},
          {name:'你最喜欢哪个电影明星或角色?'},
          {name:'你的第一个上司叫什么名字?'},
          {name:'你的父母是在哪里认识的?'},
          {name:'你的第一个宠物叫什么名字?'},
          {name:'你最好的朋友叫什么名字?'},
          {name:'你学会做的第一道菜是什么?'},
          {name:'你上小学时最喜欢的老师姓什么?'},
          {name:'你第一次坐飞机是去哪里?'},
          {name:'您从小长大的那条街叫什么?'},
          {name:'你去过的第一个海滨浴场是哪一个?'},
          {name:'你购买的第一张专辑是什么?'},
        ],
        guardForm:{
          question1:'',
          answer1:'',
          question2:'',
          answer2:'',
          question3:'',
          answer3:'',
        },
        guardRules:{
          question1:[  { validate: (val) => !!val, message: '必须选择'}],
          answer1:[  { validate: (val) => !!val, message: '必须填写'}],
          question2:[  { validate: (val) => !!val, message: '必须选择'}],
          answer2:[  { validate: (val) => !!val, message: '必须填写'}],
          question3:[  { validate: (val) => !!val, message: '必须选择'}],
          answer3:[  { validate: (val) => !!val, message: '必须填写'}],
        },
        cardList:[],
        bindCardList:'',
        bankForm:{
          bankName:'',
          bankId: '',
          bankBranch: '',
          bankCardId: '',
          withdrawPassword: ''
        },
        imgdata:[{"url": "http://a.layl666.com", "title": "APP\u4e0b\u8f7d\u5730\u5740"}, {"url": "http://a.layl666.com", "title": "APP\u4e0b\u8f7d\u5730\u5740"}]

      }
    },
    created(){

      this.validateForm.nickname =JSON.parse(localStorage.getItem('initdata')).account.nickname;
      this.getCardList()
      this.getlist()
      if(this.titleName == 'App下载二维码'){
        this.getImg()
      }

    },

    methods: {
      bindModelCard(){
        getBindStatus().then(res=>{
          if(res.data.isBindWithdrawName){
            this.$router.push({path: '/setModelCard'})

          }else{
            this.$toast.info({
              message: '您还没有绑定取款人！',
              position: 'center',    // 弹出的位置
            });
            this.$router.push({path: '/setting'})

          }
        });


      },
      bindSecurityFun(){
        this.$refs.form3.validate().then((result) => {
          if (result) {

            bindSecurity(this.guardForm).then((response) => {

              this.$toast.success({
                message: '设置成功！',
                position: 'center',               // 弹出的位置

              });

              this.$router.push({path: '/setting'})

            })
          }
        })
      },
      //动态生成二维码
      useqrcode(data) {
        var canvas = document.getElementById('canvas0')

        QRCode.toCanvas(canvas, data[0].url, function (error) {
          console.log('success!');
        })

        var canvas1 = document.getElementById('canvas1')

        QRCode.toCanvas(canvas1, data[1].url, function (error) {
          console.log('success!');
        })


      },
      getImg() {
        getdownloadurlstitle().then((res) => {
          this.imgdata = res
          this.useqrcode(res)
        })
      },
      getlist(){
        listCard().then(res=>{
          this.cardList = res.data
        })
      },

      /*设置默认银行卡*/
      setDefault(id) {
        setDefaultCard({id: id}).then((response) => {
          this.$toast.success({
            message: '设置成功！',
            position: 'center',    // 弹出的位置
          });
          this.getlist()
        })
      },

      getCardList() {
        /*开户行列表*/
        prepareBindCard().then((response) => {
          this.bindCardList = response.data
        })
      },
      /*修改资金密码*/
      setMoney() {
        this.$refs.form2.validate().then((result) => {
          if (result) {

            if (this.bindCardList.hasWithdrawPwd) {
              modifyWithdrawPassword(this.moneyForm).then((response) => {
                this.$toast.success({
                  message: '修改成功！',
                  position: 'center',    // 弹出的位置
                });
                this.$router.push({path: '/setting'})
              });
            } else {
              setupWithdrawPassword({password: this.moneyForm.newPassword}).then((response) => {
                this.$toast.success({
                  message: '修改成功！',
                  position: 'center',    // 弹出的位置
                });
                this.$router.push({path: '/setting'})
              })
            }

          }
        })
      },
      /*修改密码*/
      setPass() {
        this.$refs.form1.validate().then((result) => {
          if (result) {
            modifyPassword(this.passForm).then((response) => {
              this.$toast.success({
                message: '修改成功！',
                position: 'center',    // 弹出的位置
              });
              this.$router.push({path: '/setting'})
            })
          }
        })
      },
      /*修改昵称*/
      setName() {
        this.$refs.form.validate().then((result) => {
          if (result) {

            modifyNickname(this.validateForm).then((response) => {

              this.$toast.success({
                message: '修改成功！',
                position: 'center',               // 弹出的位置

              });
              initData().then(res => {
                localStorage.setItem('initdata', JSON.stringify(res.data));
              })
              this.$router.push({path: '/setting'})

            })
          }
        })
      },
      bindsetupWithdrawName() {
        this.$refs.form5.validate().then((result) => {
          if (result) {

            setupWithdrawName(this.bnameForm).then((response) => {

              this.$toast.success({
                message: '修改成功！',
                position: 'center',               // 弹出的位置

              });
              this.$router.push({path: '/setting'})
            })
          }
        })

      }
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
</style>

