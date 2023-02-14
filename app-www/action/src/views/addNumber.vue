<template>
  <div>
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon :to="{path: 'playItem', query: {name:name,source:source}}">


        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">追号</p>


    </mu-appbar>
    <div class="content add-number">
      <div>
        <mu-tabs :value.sync="active" inverse color="secondary" text-color="rgba(0, 0, 0, .54)" center @change="tabChange">
          <mu-tab>倍数追号</mu-tab>
          <mu-tab>利润追号</mu-tab>
        </mu-tabs>
           <p class="form-title tc">第 {{openTime.issue}} 期还剩 {{openTime.hh}}：{{openTime.mm}}：{{openTime.ss}}</p>
          <div v-if="active== 0">
            <div class="clearfix orderinput-model">
              <div class="fl" style="width: 70%">
                <div>
                  起始
                  <mu-text-field style="width: 50px" v-model.trim="chooseForm.mom" type="number"></mu-text-field>
                  倍
                  连续追
                  <mu-text-field style="width: 50px" v-model.trim='chooseForm.num' type="number"></mu-text-field>
                  期
                </div>
                <div>

                  每隔
                  <mu-text-field style="width: 50px" v-model.trim='chooseForm.splitNum' type="number"></mu-text-field>
                  期
                  倍数
                  <mu-text-field style="width: 50px" v-model.trim='chooseForm.momMore' type="number"></mu-text-field>
                </div>


              </div>
              <mu-button color="primary" @click="gerOrder">生成追单</mu-button>
            </div>

            <mu-list>
              <mu-form class="mu-demo-form" :model="form" label-width="100">

                <mu-list-item v-for="(item,index) in form.dataList" :key="index"
                              style="border-bottom: 1px solid #d0cdd1">
                  <mu-form-item>
                    <mu-list-item-action>
                      {{index+1}}
                    </mu-list-item-action>
                    <mu-list-item-content>
                      <mu-list-item-title>
                        {{item.issue}}
                      </mu-list-item-title>
                  <p>截止时间：{{item.stopTime}}</p>
                <div>
                <mu-text-field style="width: 50px" v-model="item.num" type="number"
                         @input="changeInput(item)"></mu-text-field>
                    倍 {{item.model.money}}元
                   </div>
                </mu-list-item-content>

                   <mu-list-item-action>
                       <mu-checkbox v-model="item.checked"  @change="changeCheck(item)"></mu-checkbox>
                     </mu-list-item-action>
                   </mu-form-item>


                 </mu-list-item>

                </mu-form>

              </mu-list>
          </div>
      <div v-if="active == 1">
        <div class="clearfix orderinput-model" >
          <div class="fl" style="width: 70%">
            <div>
              起始
              <mu-text-field style="width: 50px" v-model.trim="chooseForm1.mom" type="number"></mu-text-field>
              倍
              连续追
              <mu-text-field style="width: 50px" v-model.trim='chooseForm1.num' type="number"></mu-text-field>
              期
            </div>
            <div>

              最大倍投
              <mu-text-field style="width: 50px" v-model.trim='chooseForm1.splitNum' type="number"></mu-text-field>

              最低收益率
              <mu-text-field style="width: 50px" v-model.trim='chooseForm1.momMore' type="number"></mu-text-field>
              %
            </div>


          </div>
          <mu-button color="primary" @click="gerOrderRate">生成追单</mu-button>
        </div>
        <mu-list>
          <mu-form class="mu-demo-form" :model="form" label-width="100">

            <mu-list-item v-for="(item,index) in form.dataList1" :key="index"
                          style="border-bottom: 1px solid #d0cdd1">
              <mu-form-item>
                <mu-list-item-action>
                  {{index+1}}
                </mu-list-item-action>
                <mu-list-item-content>
                  <mu-list-item-title>
                    {{item.issue}}
                  </mu-list-item-title>
                  <p>截止时间：{{item.stopTime}}</p>
                  <div>
                    <mu-text-field style="width: 50px" v-model="item.num" type="number"
                                   @input="changeInput(item)"></mu-text-field>
                    倍 {{item.model.money}}元
                  </div>
                </mu-list-item-content>

                <mu-list-item-action>
                  <mu-checkbox v-model="item.checked" @change="changeCheck1(item)"></mu-checkbox>
                </mu-list-item-action>
              </mu-form-item>


            </mu-list-item>

          </mu-form>

        </mu-list>
      </div>
      <div style="position: fixed;bottom: 0;background-color: #fff;width: 100%;text-align: center;line-height: 30px">
        <div style="border-bottom: 1px solid;padding: 5px 0">
          已选择<span class="cr5">{{formTotal.num}}</span>期，共<span class="cr5">{{formTotal.money.toFixed(3)}}</span>元，总额：<span class="cr5">{{formTotal.balance.toFixed(3)}}</span>元
        </div>
        <div style="padding: 15px 0">
          <mu-checkbox v-model="stopChecked" label="中奖后停止追号" class="mr1"
                       style="vertical-align: middle;"></mu-checkbox>
          <mu-button color="primary" @touchstart="saveFun">确认追号</mu-button>
        </div>

      </div>


    </div>


  </div>

  </div>

</template>
<script>
  import {GameList} from '@/assets/js/game/game'
  import {config_data} from "@/assets/js/game/global"
  import {LotteryOpenTime} from '@/assets/js/game/open'
  import {addChase, loopGameLottery, staticChaseTime} from '@/api/login'
  import {NumberUtils} from '@/assets/js/tools'
  import 'muse-ui-message/dist/muse-ui-message.css';
  import Message from 'muse-ui-message';

  export default {
    name: 'message',
    data() {
      return {
        source: this.$route.query.source,
        name: this.$route.query.name,
        active: 0,
        openTime: {issue: '000', hh: '00', mm: '00', ss: '00'},
        lottery: GameList.cache[this.$route.query.name],
        models: [['yuan', '元'], ['jiao', '角'], ['fen', '分'], ['li', '厘']],

        chooseForm1: {
          mom: 1,
          num: 1,
          splitNum: 100,
          momMore: 30
        },
        chooseForm: {
          mom: 1,
          num: 1,
          splitNum: 1,
          momMore: 1
        },
        form: {
          dataList: [],
          dataList1: []
        },
        queryorderList: JSON.parse(this.$route.query.n),
        rou: JSON.parse(this.$route.query.n)[0],
        allList: [],
        formTotal: {
          num: 0,
          money: 0,
          balance: 0
        },
        queryCode: {
          lottery: this.$route.query.name
        },
        stopChecked: true
      }
    },
    created() {
    this.initData()
      this.loopGameLotteryTimer()
    },
    mounted() {
      LotteryOpenTime.init(this.lottery, this.openTime);
    },
    methods: {
      initData(){
        staticChaseTime({name: this.rou.lottery}).then((response) => {
          response.forEach(a => {
            a['model'] = this.rou.model;
            a['money'] = this.rou.model.money;
            a['num'] = 1;
            a['checked'] = true;
          })
          this.form.dataList = response
          this.form.dataList1 = response
          this.allList = response
          this.getTotalMoney(response)
        })
      },
      loopGameLotteryTimer() {

        loopGameLottery(this.queryCode).then(res => {
          this.formTotal.balance = res.data.balanceAll

        })

      },
      tabChange(val){
        this.initData()

            this.formTotal.num = 0
            this.formTotal.money = 0
      },
      gerOrder() {
        var num = this.chooseForm.num;//期数  起倍数  间隔 倍数
        var multiple = this.chooseForm.mom;
        var interval = this.chooseForm.splitNum;
        var increase = this.chooseForm.momMore;
        let arr = []
        let list = JSON.parse(JSON.stringify(this.allList));
        for (let i = 0; i < num; i++) {
          if (i > list.length - 1) break;
          let v = list[i];
          let finalMultiple = i < interval ? multiple : multiple * Math.pow(increase, Math.floor(i / interval));
          this.getMultipleMoney(finalMultiple, function (res) {
            v.num = finalMultiple;

            v.model.money = res
            arr.push(v)
          });


        }
        this.form.dataList = arr
        this.getTotalMoney(arr)


      },

      // 获取投注金额
      getMultipleMoney(multiple, fun) {

        var total = 0;
        for (var i = 0; i < this.queryorderList.length; i++) {
          var v = this.queryorderList[i];

          total += v.nums * multiple * config_data.unitMoney * v.model.money;
        }
        fun(NumberUtils.toFixed(total, 3))
      },
      // 获取总计金额
      getTotalMoney(arr) {
        let total = 0
        arr.forEach(a => {
          total += a.model.money
        })
        this.formTotal.num = arr.length
        this.formTotal.money = total
      },
      saveFun() {
        let arr = []
        if(this.active == 0){
          this.form.dataList.map(a => {
            arr.push({issue: a.issue, multiple: parseInt(a.num)})
          })
        }else{
          this.form.dataList1.map(a => {
            arr.push({issue: a.issue, multiple: parseInt(a.num)})
          })
        }
        if(arr.length == 0){
          this.$toast.warning({
            message: '您没有勾选任何追号计划!',
            position: 'center',               // 弹出的位置

          });
          return
        }

        var list = [];

        this.queryorderList.forEach(function (v, i) {
          list.push({
            lottery: v.lottery,
            method: v.method,
            content: v.content,
            model: v.model.val,
            multiple: v.multiple,
            code: v.code,
            compress: v.compress,
            nums: v.nums
          });
        });
        let obj = {
          "orderList": list,
          "planList": arr,
          "winStop": this.stopChecked
        }

        Message.confirm('本次追号共需要花费' + this.formTotal.money + '元，确认继续投注？', '提示', {
          type: 'warning'
        }).then(({result}) => {
          if (result) {
            addChase({text: JSON.stringify(obj)}).then(res => {
              this.$toast.success({
                message: '您的追号订单已投注成功!',
                position: 'center',               // 弹出的位置

              });
              this.$router.push({path: '/playItem', query: {name: this.name, source: this.source}})


            }).catch(res=>{
              if(this.active == 0) {
                this.form.dataList.forEach(a => {
                  a.checked = false
                })
              }else{
                this.form.dataList1.forEach(a => {
                  a.checked = false
                })
              }



            })

          }
        });

      },
      /*利率生成单*/
      gerOrderRate() {

        this.getProfitChase(parseInt(this.chooseForm1.num),this.chooseForm1.mom,
          this.chooseForm1.splitNum,this.chooseForm1.momMore,this.rou.total,parseInt(this.$route.query.bonus[0]))

      },

      /**
       * 计算利润率追号算法
       *
       * num 追号期数
       * startMultiple 开始倍数
       * maxMultiple 最大倍投
       * minProfit 最低利润率（百分比）
       * unitMoney 单倍金额
       * bonus 单倍奖金
       */
       getProfitChase (num, startMultiple, maxMultiple, minProfit, money, bonus) {

        var result = []; // 结果
        var totalMoney = 0;
        var multiple = startMultiple;
        for (var i = 0; i < num; i++) {
          var thisMoney = 0;
          var thisBonus = 0;
          var thisProfit = 0;
          while (true) {
            thisMoney = money * multiple;
            thisBonus = bonus * multiple;
            var tempTotal = totalMoney + thisMoney;
            thisProfit = (thisBonus - tempTotal) / tempTotal;
            thisProfit = thisProfit * 100;
            if (thisProfit >= minProfit) break;
            if (multiple > maxMultiple) return result;
            multiple++;
          }
          totalMoney += thisMoney; // 累计投入
          result.push(multiple);
        }

         let g_issue_list = JSON.parse(JSON.stringify(this.allList));
     let arr = [];
     for (var i = 0; i < result.length; i++) {
       if (i > g_issue_list.length - 1) break;
       var v = g_issue_list[i];
       var finalMultiple = result[i];
       this.getMultipleMoney(finalMultiple, function (res) {
         v.num = finalMultiple
         v.model.money = res
         arr.push(v)
       });


     }

     this.form.dataList1 = arr
     this.getTotalMoney(arr)
      },
      changeInput(item) {
        console.log(item)
        if (item.num > 1) {
          if (item.num.indexOf('.') >= 0) {
            item.num = parseInt(item.num);
            item.model.money = parseInt(item.num) * item.money
          } else {
            item.model.money = item.num * item.money
          }

        } else {
          item.num = 1
          item.model.money = item.money
        }


      },
      /*倍数*/
      changeCheck(item) {
       let arr = []
        this.form.dataList.map(a => {
          if (a.checked) {
          arr.push(a)
          }


        })
        this.getTotalMoney(arr)
      },
      /*利润*/
      changeCheck1(item) {
       let arr = []
        this.form.dataList1.map(a => {
          if (a.checked) {
          arr.push(a)
          }


        })
        this.form.dataList =  arr;
        this.form.dataList1 =  arr;
        this.getTotalMoney(arr)
      },
    }
  }
</script>
<style scoped>
.orderinput-model{
  background: #ebecec;
  text-align: center;
  padding-top: 19px;
}
.add-number{padding-bottom: 115px}
.add-number /deep/ .mu-form-item{
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
