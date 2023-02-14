<template>
<div>
  <mu-appbar class="tc header"  color="primary">
    <mu-button slot="left" icon :to="{path: '/personSearch?tabIndex=12'}">
      <i class="iconfont">&#xe604;</i>
    </mu-button>
    签订契约分红
    <mu-button slot="right" icon >
      <i class="iconfont" style="display: none">&#xe604;</i>
    </mu-button>
  </mu-appbar>
  <div  class="openprepar content contract-center" >
    <div class="date-select "  style="overflow-y: visible">
      <div >
        <p class="tc"><span>{{preparData.dividendStatus==null?'正在':'已经'}}</span>与下级代理{{preparData.username}}签订契约分红</p>
      </div>

      <div  class="demo-loadmore-wrap">
        <label style="text-indent: 8px;" >基础分红比例</label>
        <table class="contract-table" cellspacing="0" v-if="isFlagprepar==0 || isFlagprepar==1">
          <tr>
            <th>分红比例(%)</th>
            <th>活跃用户(人)</th>
            <th>契约状态</th>
            <th>设置范围(%)</th>
          </tr>
          <tr>
            <td>{{preparData.uGameLotteryDividendContract.scalePoint}}%</td>
            <td>{{preparData.uGameLotteryDividendContract.activeUser}}</td>
            <td >{{preparData.uGameLotteryDividendContract.status==1?'已签订分红':preparData.uGameLotteryDividendContract.status==0?'待确定分红':'未签订分红'}}</td>
            <td >{{preparData.rangeConfig.baseMinPoint}}%-{{preparData.rangeConfig.extraDownPoint}}%</td>
          </tr>
        </table>

        <mu-form :model="beanprepar" class="mu-demo-form"  label-width="50"  v-if="isFlagprepar==null || isFlagprepar==-1">

        <table class="contract-table" cellspacing="0">
          <tr>
            <th>分红比例(%)</th>
            <th>活跃用户(人)</th>
            <th>契约状态</th>
            <th>设置范围(%)</th>
          </tr>
          <tr>
            <td>
              <mu-form-item prop="input" >
              <mu-text-field v-model="beanprepar.scalePoint" style="width: 60px"></mu-text-field>
            </mu-form-item></td>
            <td> <mu-form-item prop="input" >
              <mu-text-field v-model="beanprepar.activeUser" style="width: 60px"></mu-text-field>
            </mu-form-item>
              </td>
            <td >  未签订分红</td>
            <td >{{preparData.rangeConfig.baseMinPoint}}%-{{preparData.rangeConfig.extraDownPoint}}%</td>
          </tr>
        </table>

        </mu-form>
        <div class="contract-table-two">
          <p style="margin-bottom: 10px;margin-top: 20px;text-indent: 8px">附加分红比例</p>
          <mu-data-table :columns="columns124" :data="preparData.extraRules"  v-if="isFlagprepar==0 || isFlagprepar==1">
            <template slot-scope="scope">
              <td>{{scope.row.totalConsume}}</td>
              <td class="is-center">{{scope.row.totalLoss}}</td>
              <td class="is-center">{{scope.row.activeUser}}</td>
              <td class="is-center">{{scope.row.scalePoint}}%</td>

            </template>

          </mu-data-table>

          <div v-if="isFlagprepar==null|| isFlagprepar==-1">
            <mu-data-table :columns="columns1241"   :data="beanprepar.extraRules"  style="width: 100%" >

              <template slot-scope="scope">

                <td> <mu-text-field v-model="scope.row.totalConsume" style="width:60px"></mu-text-field></td>
                <td ><mu-text-field v-model="scope.row.totalLoss" style="width: 60px"></mu-text-field></td>
                <td> <mu-text-field v-model="scope.row.activeUser" style="width: 60px"></mu-text-field></td>
                <td ><mu-text-field v-model="scope.row.scalePoint" style="width: 60px"></mu-text-field></td>
                <td ><mu-button color="primary" small @click="deleteaddprepar(scope.$index)" style="min-width: 50px">删除</mu-button></td>


              </template>
            </mu-data-table>
            <p style="border-bottom: 1px solid rgba(0,0,0,.12);padding-bottom: 10px;text-align: center">  （附加分红比例设置范围：1% ~ 30%）<mu-button @click="addprepar" color="primary" small style="min-width: 70px">增加规则</mu-button></p>
          </div>


        </div>

      </div>
      <div style="text-align: center;width: 150px;margin: 20px auto;" class="clearfix">

        <mu-button  slot="actions" @click="applyEditDividendContractFun(1)" color="primary"  small style="min-width: 60px;float: left">确定</mu-button>
        <mu-button   slot="actions"  :to="{path: '/personSearch?tabIndex=12'}" color="#e46700" small style="min-width: 60px;float: right">取消</mu-button>
      </div>

    </div>

  </div>
</div>


</template>
<script>
  import  { prepareEditDividendContract ,applyEditDividendContract} from '@/api/login'
    export default {
        name: '',
        data() {
            return {

              isFlagprepar:0,
              openprepar:false,
              beanprepar:{
                username: '',
                scalePoint:'',
                activeUser:'',
                extraRules:[]

              },
              preparData:{
                dividendStatus:'',
                username:'',
                uGameLotteryDividendContract:'',
                extraRules:[{"totalConsume": '', "totalLoss": '', "activeUser": '', "scalePoint":''}],
                rangeConfig:''
              },
              columns124:[
                { title: '周期消费(万)'},
                { title: '周期亏损(万)'},
                { title: '活跃用户', },
                { title: '分红比例(%)', },

              ],
              columns1241:[
                { title: '周期消费(万)',width:'75px',align:'center'},
                { title: '周期亏损(万)',width:'75px'},
                { title: '活跃用户',width:'70px',align:'center'},
                { title: '分红比例(%)'},
                { title: '操作',align:'center'},

              ],
            }
        },
      created(){
          this.prepareEditDividendContractFun(this.$route.query.name)
      },
        methods:{
          prepareEditDividendContractFun(name){




            prepareEditDividendContract({username:name}).then(res=>{
              this.preparData.dividendStatus = res.data.uAccount.dividendStatus
              this.isFlagprepar =res.data.uAccount.dividendStatus
              this.preparData.rangeConfig = res.data.rangeConfig
              this.preparData.username = res.data.uAccount.username
              if(res.data.uAccount.dividendStatus==0 || res.data.uAccount.dividendStatus==1){

                this.preparData.uGameLotteryDividendContract = res.data.uGameLotteryDividendContract
                this.preparData.extraRules = JSON.parse(res.data.uGameLotteryDividendContract.extraRules)

              }else if (res.data.uAccount.dividendStatus==null ){

                this.beanprepar.extraRules.push({"totalConsume": '', "totalLoss": '', "activeUser": '', "scalePoint":''})
              }else if (res.data.uAccount.dividendStatus==-1 ){
                this.beanprepar.username =  res.data.uAccount.username
                this.beanprepar.scalePoint =  res.data.uGameLotteryDividendContract.scalePoint
                this.beanprepar.activeUser =  res.data.uGameLotteryDividendContract.activeUser
                this.beanprepar.extraRules = JSON.parse(res.data.uGameLotteryDividendContract.extraRules)

              }


            })
          },
          /*确定签约分红*/
          applyEditDividendContractFun(type){
            if(type){
              var bean = {
                username: this.preparData.username,
                scalePoint: this.beanprepar.scalePoint,
                activeUser: this.beanprepar.activeUser,
                extraRules: JSON.stringify(this.beanprepar.extraRules)

              }

            }else{
              var bean = {
                username: this.preparData.username,
                scalePoint: this.preparData.uGameLotteryDividendContract.scalePoint,
                activeUser: this.preparData.uGameLotteryDividendContract.activeUser,
                extraRules: JSON.stringify(this.preparData.extraRules)

              }
            }

            applyEditDividendContract(bean).then(res=>{
              this.openprepar =  false
              window.location.href='/#/personSearch?tabIndex=12'

              this.$toast.success({
                message:'成功！',
                position: 'center',               // 弹出的位置

              });
            })
          },
          /*增加规则*/
          addprepar(){


            this.beanprepar.extraRules.push({"totalConsume": '', "totalLoss": '', "activeUser": '', "scalePoint":''})
          },
          /*删除规则*/
          deleteaddprepar(index){
            let  arr = []
            this.beanprepar.extraRules.forEach(function (a,b) {
              if(b != index){
                arr.push(a)
              }
            });
            this.beanprepar.extraRules = [];
            this.beanprepar.extraRules=arr

          },
        }
    }
</script>
<style lang="less" type="text/less" scoped>
  .date-select{
    width: 96%;
    margin: 0 auto;
    border-radius: 3px;
    overflow-y: hidden;
  }
  .demo-loadmore-wrap {
    width: 100%;

    display: flex;
    flex-direction: column;

  }
  .contract-center{
    border: 1px solid #b8bbbd;
  }
  .contract-table{
    margin-top: 10px;
    width: 100%;
  }
  .contract-table th{
    color: #545151;
    background-color: #e4e4e4;
    padding: 8px 5px;
    vertical-align: top;
    text-align: center;
    font-size: 12px;
    font-weight: normal;
  }
  .contract-table td{
    color: #545151;
    padding: 8px 5px;
    vertical-align: top;
    text-align: center;
    font-weight: normal;
    border-bottom: 1px solid #c8c9ca;
  }
  .contract-center /deep/ .mu-table th{
    background-color: #e4e4e4;
    color: #545151;
    font-size: 12px;
    padding: 0 2px;
  }
  .contract-table /deep/ .mu-form-item{
    margin-bottom: 0;
    min-height: 30px;
    padding-bottom: 0px;
  }
  .contract-table-two{
    width: 100%;
  }
  .contract-table-two /deep/ .mu-input{
    margin-bottom: 0;
    padding-top: 10px;

  } .contract-table /deep/ .mu-text-field-input{
    margin-bottom: 0;
    padding-bottom: 6px;
        height: 28px;
  }
  .contract-table-two  /deep/ .mu-table table{
    width: 100%;
  }
</style>
