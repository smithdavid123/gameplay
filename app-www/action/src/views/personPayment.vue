<template>
  <div  >
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/person">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">{{buttonName[buttonIndex]}}</p>
      <mu-button slot="right" icon >

      </mu-button>

    </mu-appbar>
    <div class="content content-model" >

      <div class="date-select " v-if="buttonIndex == 1">

        <mu-form v-if="isOpen == 1" ref="form" :model="dataForm" label-position="left" class="mu-demo-form ">

          <div class="pay-choose-div">
            <p style="border-bottom: 1px solid #ddd;padding-bottom: 10px;
    font-size: 18px;margin-top: 0;">便捷选择充值金额</p>

<div style="width: 90%;margin: 0 auto">
  <mu-row gutter >
    <mu-col span="4"><div class="grid-cell" :class="{activeCell:money == 100}" @touchstart="getMoney(100)">充 ¥100</div></mu-col>
    <mu-col span="4"><div class="grid-cell"  :class="{activeCell:money == 200}"  @touchstart="getMoney(200)">充 ¥200</div></mu-col>
    <mu-col span="4"><div class="grid-cell" :class="{activeCell:money == 500}"  @touchstart="getMoney(500)">充 ¥500</div></mu-col>
  </mu-row>
  <mu-row gutter>
    <mu-col span="4"><div class="grid-cell" :class="{activeCell:money == 1000}"  @touchstart="getMoney(1000)">充 ¥1000</div></mu-col>
    <mu-col span="4"><div class="grid-cell"  :class="{activeCell:money == 3000}" @touchstart="getMoney(3000)">充 ¥3000</div></mu-col>
    <mu-col span="4"><div class="grid-cell"  :class="{activeCell:money == 5000}" @touchstart="getMoney(5000)">充 ¥5000</div></mu-col>
  </mu-row>
</div>

          </div>
          <p class="f12 cr2" style="text-indent: 1rem;">
            便捷快速充值选项，无预期充值金额时可在下列充值金额中输入充值金额。
          </p>

          <mu-form-item label="充值金额:" class="chongzi-input"   prop="amount" :rules="rules">
           <mu-text-field v-model.trim="dataForm.amount" placeholder="请输入充值金额"></mu-text-field>
          </mu-form-item>
          <p style="color: rgba(0,0,0,.54);text-indent: 1rem;">单笔限额为{{tipsMoney}}元</p>

          <mu-form-item label="充值方式:" class="chongzi-input"  >
            <mu-select  v-model="dataForm.pid" @change="changeSelect">
              <mu-option v-for="(option, index) in options" :key="option.name" :label="option.name" :value="option.id"></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item label="充值渠道:" v-if="isTypeChoose == 1"  class="chongzi-input" >
            <mu-select  v-model="dataForm.method">
              <mu-option v-for="(option,index) in optionsMethod" :key="option.method" :label="map[option.method]" :value="option.method"></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item label="转账附言:" v-if="isTypeChoose == 2" >
            <mu-text-field v-model.trim="dataForm.postscript" help-text="请输入转账账号和姓名" ></mu-text-field>
          </mu-form-item>

          <mu-form-item>

            <mu-button v-if="isTypeChoose == 1" color="#7d8eec"  @click="submit" style="width: 91%">确认充值</mu-button>
            <mu-button v-if="isTypeChoose == 2" color="#7d8eec" @click="submit1" style="width: 91%">下一步</mu-button>
          </mu-form-item>
        </mu-form>
        <p v-if="isOpen == 0">充值服务正在维护中...</p>
      </div>
      <div class="date-select " v-if="buttonIndex == 2">
        <div  v-if="cardList.length>0">
          <mu-form ref="form2" :model="dataForm1" label-position="left" class="mu-demo-form ">
            <mu-form-item label="提现银行卡:" >
              <mu-select  v-model="dataForm1.cardId">
                <mu-option v-for="option,index in cardList" :key="option.bankName+option.bankCardId" :label="option.bankName+option.bankCardId" :value="option.id"></mu-option>
              </mu-select>
            </mu-form-item>
            <mu-form-item label="提现金额:"   prop="amount" :rules="amountRules">
              <mu-text-field v-model.trim="dataForm1.amount"></mu-text-field>
            </mu-form-item>
            <mu-row>
              <mu-col span="6">可用余额：{{myAccountStatus.availableBalance}}</mu-col>
              <mu-col v-if="myAccountStatus.availableBalance"  span="6" style="text-align: right" class="cr5" @click="dataForm1.amount = myAccountStatus.availableBalance">全部提现</mu-col>
            </mu-row>
            <p>提现最低{{withdrawConfig.minUnitAmount}}元，最高{{withdrawConfig.maxUnitAmount}}元，今天还可以提现{{withdrawConfig.maxDailyCount-myAccountStatus.dailyCount}}次</p>
            <mu-form-item label="资金密码:"   prop="withdrawPassword" :rules="passwordRules">
              <mu-text-field v-model.trim="dataForm1.withdrawPassword"  type="password"></mu-text-field>
            </mu-form-item>

            <mu-form-item>

              <mu-button color="#7d8eec" @click="submitWithdraw " style="width: 91%">确认提现</mu-button>
            </mu-form-item>
          </mu-form>

        </div>
        <div v-else>

          <p v-if="withdraw.isBindWithdrawPassword==false">您还没有设置提现密码，立即设置请<router-link to="/setting">点击此处</router-link></p>
          <div v-if="withdraw.isBindWithdrawPassword ==true">
            <p v-if="withdraw.isBindWithdrawName==false">您还没有设置提现姓名，立即设置请<router-link to="/setting">点击此处</router-link></p>
            <div v-if="withdraw.isBindWithdrawName==true">

              <p v-if="withdraw.isBindCard==false">您还没有绑定银行卡，立即设置请<router-link to="/setting">点击此处</router-link></p>
              <p v-else>查询失败！</p>
            </div>
          </div>


        </div>

      </div>
      <div class="date-select " v-if="buttonIndex == 3">

      </div>


    </div>
  </div>
</template>
<script>
  import  {requestAllMethod,requestThridPay,getBindStatus,prepareWithdraw,applyWithdraw,requestTransferPay} from '@/api/login'

  export default {
    name: 'setModel',
    data() {
      return {
        minMoney:'',
        maxMoney:'',
        rules: [
          { validate: (val) => !!val, message: '必须填写充值金额'},
          { validate: (val) => val >= this.minMoney && val <= this.maxMoney, 
            message: "充值金额必须满足单笔限额"
          }
        ],
        options:[],
        buttonIndex: this.$route.query.tabIndex,

        buttonName:{
          '1':'充值',
          '2':'提款',
          '3':'转账',
        },
        optionsMethod:[],
        dataForm:{
          pid:'',
          method:'',
          amount:'',
          postscript:'',
        },
        map:{
          'WXPAY':'微信',
          'ALIPAY':'支付宝',
          'OTHER':'其它',
          'QQPAY':'QQ钱包',
          'JDPAY':'京东钱包',
          'UNIONPAY':'银联钱包',
        },
        cardList:[],
        dataForm1:{
          amount: '',
          cardId: '',
          withdrawPassword: ''
        },
        rechargeMethod: {},
        amountRules: [
          { validate: (val) => !!val, message: '必须填写提现金额'},
        ],
        passwordRules: [
          { validate: (val) => !!val, message: '必须填写密码'},
        ],
        withdraw:'',
        balance:'',
        isOpen:1,
        withdrawConfig:'',
        myAccountStatus:'',
        money:'',
        tipsMoney:'',
        isTypeChoose:1

      }
    },
    created(){
      this.getData()
      this.balance =JSON.parse(localStorage.getItem('initdata')).account.balance
    },
    methods:{
      /*获取充值方式*/
      getData(){
        let $this = this;
        if($this.buttonIndex == 1){
          requestAllMethod().then((res) => {
            $this.isOpen = res.data.rechargeConfig.isOpen;
            $this.options = res.data.thridList.filter(d => d.name != "请选择");

            if (res.data.transferList.length > 0) {            
              $this.options.push(res.data.transferList[0]);
            } 
            $this.dataForm.pid = $this.options[0].id;
            $this.dataForm.method = $this.options[0].methodList[0].method;
            $this.optionsMethod = $this.options[0].methodList;
            $this.tipsMoney = $this.options[0].minUnitRecharge + '~'+ $this.options[0].maxUnitRecharge;
            $this.minMoney = $this.options[0].minUnitRecharge;
            $this.maxMoney = $this.options[0].maxUnitRecharge;
            $this.rechargeMethod = $this.options[0];
            if ($this.options.length > 0 && $this.options[0].type == 2) $this.isTypeChoose = 2;
          })
        }else if(this.buttonIndex == 2){
          getBindStatus().then((res)=>{
            this.withdraw= res.data


          })
          prepareWithdraw().then((res)=>{
            this.cardList = res.data.accountCardList;
            this.withdrawConfig = res.data.withdrawConfig;
            this.myAccountStatus = res.data.myAccountStatus;
            this.dataForm1.cardId = this.cardList.length>0? this.cardList[0].id:''


          })
        }

      },

      changeSelect(){
        let $this = this

        this.options.forEach(function (a) {
          $this.rechargeMethod = a;
          if(a.id == $this.dataForm.pid){
            if(a.type == 2){
              $this.isTypeChoose = 2;
            }else{
              $this.isTypeChoose = 1;
              $this.optionsMethod = a.methodList;
              $this.dataForm.method = a.methodList[0].method;
            }
            $this.tipsMoney = a.minUnitRecharge+'-'+a.maxUnitRecharge;
            $this.minMoney = a.minUnitRecharge;
            $this.maxMoney = a.maxUnitRecharge;

          }
        })

      },
      getMoney(money){
        if(money  ==   this.money){
          this.dataForm.amount = '';
          this.money = ''
        }else{
          this.dataForm.amount = money;
          this.money = money
        }


      },
      // 没必要，已经使用了表单验证
      checkRecharge () {
        return true;
        let money = parseFloat(this.dataForm.amount);
        let [minM, maxU] = [this.rechargeMethod.minUnitRecharge, this.rechargeMethod.maxUnitRecharge];
        let [flag, msg] = [true, ""];
        if (money < parseFloat(minM)) [false, "单笔充值金额不能低于" + minM];
        if (money > parseFloat(maxM)) [false, "单笔充值金额不能高于" + minM];
        if (!flag) this.$toast.warning({ message: msg + '！', position: 'center' });
        return flag;
      },
      submit () {
        if (!this.checkRecharge()) return;
        this.$refs.form.validate().then((result) => {
          if (result) {
            requestThridPay(this.dataForm).then((res)=>{
              this.$router.push({ path: '/pay',query: {h: JSON.stringify(res.data.link)} });
            })
          }
        })

      }, 
      submit1 () {
        if (!this.checkRecharge()) return;
        this.$refs.form.validate().then((result) => {
          if (result) {
            this.dataForm.method = ''
            requestTransferPay(this.dataForm).then((res)=>{
              this.$router.push({ path: '/pay',query: {data:JSON.stringify(res.data),type:2} });

            })
          }
        })

      },
      submitWithdraw () {
        this.$refs.form2.validate().then((result) => {
          if (result) {
            if(this.dataForm1.amount <=this.myAccountStatus.availableBalance && this.myAccountStatus.dailyCount< this.withdrawConfig.maxDailyCount){
              applyWithdraw(this.dataForm1).then((res)=>{
                this.$router.push({ path: '/person' })

              })
            }else{
              this.$toast.warning({
                message: '余额不足或者提现次数不足！',
                position: 'center',               // 弹出的位置

              });

            }

          }
        })
      },
    }
  }
</script>
<style scoped>
  .grid-cell {
    border-radius: 4px;
    height: 3em;
    border: 1px solid #7d8eec;
    text-align: center;
    margin-bottom: 0.7em;
    font-weight: 600;
    line-height: 3em;
    background-color: #f6f8f9;

  }

  .activeCell{
    background-color: #7d8eec;
    color: #fff;
  }
  .pay-choose-div{
    background-color: #fff;
    padding: 0.5rem 1rem;
  }
  .chongzi-input{
    background-color: #fff;
    padding-top: 0px;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 0;
  }
  .chongzi-input /deep/ .mu-text-field-input{
    height: 46px;
    border: 0;
    font-size: 16px;
  }
.chongzi-input /deep/ .mu-form-item-label{
  line-height: 46px;
  font-size: 16px;

}.chongzi-input /deep/ .mu-form-item-help{
  bottom: -17px;
}.chongzi-input /deep/ .mu-select{
  height: 48px;
    border: 0;
}
</style>
