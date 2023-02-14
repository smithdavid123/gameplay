<template>
  <div  >
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/personPayment?tabIndex=1">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">充值</p>
      <mu-button slot="right" icon >

      </mu-button>

    </mu-appbar>
    <div class="content content-model">
      <div v-if="type == 2" style="padding: 16px">

        <div>
          <p style="margin-bottom: 0"><span class="bank-pay-title">姓名：</span>{{bankData.bankCardName}}</p>
          <mu-button small color="primary" round   style='min-width: 46px;margin-left: 81px'v-clipboard:copy="bankData.bankCardName"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">复制</mu-button>
        </div>
        <p><span class="bank-pay-title">充值金额：</span>{{bankData.actualAmount}}</p>
        <p><span class="bank-pay-title">银行：</span>{{bankData.bankName}}{{bankData.bankBranch}}</p>
        <div>
          <p style="margin-bottom: 0"><span class="bank-pay-title">账号：</span>{{bankData.bankCardId}}</p>
          <mu-button small color="primary" round   style='min-width: 46px;margin-left: 81px'v-clipboard:copy="bankData.bankCardId"
                                                      v-clipboard:success="onCopy"
                                      v-clipboard:error="onError">复制</mu-button>
        </div>
        <div>
          <p style="margin-bottom: 0"><span class="bank-pay-title">订单编号：</span>{{bankData.billno}}</p>
          <mu-button small color="primary" round   style='min-width: 46px;margin-left: 81px'
                     v-clipboard:copy="bankData.billno"
                                                      v-clipboard:success="onCopy"
                                      v-clipboard:error="onError">复制</mu-button>
        </div>
        <p><span class="bank-pay-title">附言：</span>{{bankData.userInfo||'无'}}</p>



      </div>
      <div v-else style="height: 100%;">
        <iframe   frameborder=0 name="showHere" scrolling=auto :src="data" width="100%" height="100%"></iframe>

      </div>


    </div>
  </div>
</template>
<script>
  import  {requestThridPay} from '@/api/login'

  export default {
    name:'pay',
    data(){
      return{
        data:this.$route.query.h?JSON.parse(this.$route.query.h):'',
        link:'',
        type:this.$route.query.type,
        bankData:this.$route.query.data?JSON.parse(this.$route.query.data):'',
      }
    },
    created(){
      if(this.$route.query.type){

      }
    },
    methods:{
      // 复制成功
      onCopy(e){
        console.log(e);
        try{
          //window.jsbridge.copyFunction(e);
          //window.webkit.messageHandlers.copyFunction.postMessage(e);
        } catch(err) {
          // alert("复制失败：" + e);
          // alert(err);
        }
      },
      // 复制失败
      onError(value){
        try{
          window.jsbridge.copyFunction(value.text);
          //window.webkit.messageHandlers.copyFunction.postMessage(e);
        } catch(err) {
          // alert("复制失败：" + err);
          // alert(err);
        }
      },
    }

  }
</script>

<style scoped>
.bank-pay-title{
  display: inline-block;
  width: 72px;
  text-align: right;
  margin-right: 10px;
}
</style>
