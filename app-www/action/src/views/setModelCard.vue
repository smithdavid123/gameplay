<template>
  <div>
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/setModel?name=银行卡管理">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">添加银行卡</p>
      <mu-button slot="right" icon >

      </mu-button>

    </mu-appbar>
    <div class="content">
 <div>
   <mu-form  :model="bankForm"  ref="formBank"  label-position="top" class="mu-demo-form " style="padding: 20px">


     <mu-form-item prop="bankName" label="选择开户行" :rules="ruless.bankName">
       <mu-select v-model="bankForm.bankName">
         <mu-option v-for="option,index in bindCardList.bankList" :key="option.name" :label="option.name" :value="option.name+'-'+option.id"></mu-option>
       </mu-select>
     </mu-form-item>
     <mu-form-item prop="bankBranch" label="支行名称" :rules="ruless.bankBranch">
       <mu-text-field v-model="bankForm.bankBranch" ></mu-text-field>
     </mu-form-item>
     <mu-form-item prop="answer1" label="持卡人姓名">
       {{bindCardList.withdrawName}}
     </mu-form-item>
     <mu-form-item prop="bankCardId" label="银行卡号" :rules="ruless.bankCardId">
       <mu-text-field v-model="bankForm.bankCardId" ></mu-text-field>
     </mu-form-item>
     <mu-form-item prop="repeatCardId" label="重复银行卡号" :rules="ruless.repeatCardId">
       <mu-text-field v-model="bankForm.repeatCardId" ></mu-text-field>
     </mu-form-item>
     <mu-form-item prop="withdrawPassword" label="输入资金密码" :rules="ruless.withdrawPassword">
       <mu-text-field v-model="bankForm.withdrawPassword" type="password"></mu-text-field>
     </mu-form-item>
   </mu-form>
   <div style="text-align: center;margin-bottom: 30px">
     <mu-button slot="actions"  color="primary" @click="addBind">确认</mu-button>
     <mu-button slot="actions"  color="primary" @click="cancelBind" >取消</mu-button>

   </div>


 </div>

    </div>


  </div>
</template>
<script>
  import  {prepareBindCard,bindCard} from  '@/api/login'
  import  {isPassword,bankNum} from  '@/utils/validate'

  export default {
    name: 'setModel',
    data() {
      var checkRepeat = (rule, value) => {

        var reg =/^([1-9]{1})(\d{14}|\d{18})$/
          // if(!reg.test(value.repeatCardId)){
          if(value.repeatCardId.toString().length <= 10){
            return new Error('正确银行卡号')
          }else{
            if(value.repeatCardId !== this.bankForm.bankCardId){
              return new Error('两次输入不一致')
            }else {
              return  true
            }
          }

      };

      return {
        bindCardList:'',
        bankForm:{
          bankName:'',
          bankId: '',
          bankBranch: '',
          bankCardId: '',
          withdrawPassword: '',
          repeatCardId:'',
        },
       ruless:{
         bankName: [
            { validate: (val) => !!val, message: '必须填写'},
          ],
         bankBranch: [
            { validate: (val) => !!val, message: '必须填写'},
          ],
         bankCardId: [
            { validate: (val) => !!val, message: '必须填写'},
            { validate: bankNum, message: '请输入正确银行卡号'},
          ],
         repeatCardId:[
           { validate: (val) => !!val, message: '必须填写'},
           { validate: checkRepeat, trigger: "blur" }
           ],


        withdrawPassword:[
            { validate: (val) => !!val, message: '必须填写密码'},
          ]

        },

      }
    },
    created(){
      this.getCardList()
    },
    methods:{


      cancelBind(){
        this.$router.push({ path: '/setModel',query:{name:'银行卡管理'}})

      },
      /*添加银行卡*/
      addBind(){
        this.$refs.formBank.validate().then((result) => {
          if (result) {

            let name = this.bankForm.bankName;

            if(name.indexOf('-')>=0){
              this.bankForm.bankName = name.split('-')[0];
              this.bankForm.bankId = name.split('-')[1];
            }

            bindCard(this.bankForm).then((response) => {
              this.$toast.success({
                message: '设置成功！',
                position: 'center',    // 弹出的位置
              });
              this.$router.push({path: '/setModel', query: {name: '银行卡管理'}})
            })
          }
        })

      },


      getCardList(){

        /*开户行列表*/
        prepareBindCard().then((response)=>{
          this.bindCardList = response.data
        })
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
</style>

