<template>
  <div style="overflow-y: hidden">
  <div style="    padding: 0px 0.75rem;">
   <span style="margin-right: 1rem">{{selectName}}</span>
    <span class="select-span" :class="{chan:cho==30}"  @click="chooseStage('30')">30期</span>
    <span class="select-span" :class="{chan:cho==50}"  @click="chooseStage('50')">50期</span>
    <span class="select-span"  :class="{chan:cho==100}" @click="chooseStage('100')">100期</span>

    <mu-button icon  slot="right" style="padding: 0;width: 30px" @click="openSimple = true"><i class="iconfont">&#xe78a;</i></mu-button>
    <!--<p class="cr7 f12" >注：走势详情请访问PC端网站(请复制到手机浏览器打开)-->
    <!--</p>-->
    <!--<p>http://jinhua101.com/game/lottery/trend.html?{{queryName}}</p>-->
    <!-- <p class="cr7 f12" >注：走势详情请访问PC端网站
      <a :href="'http://xinyong002.com/game/lottery/trend.html?'+queryName" target="_blank" class="cr7" style="text-decoration: underline">立即前往</a>
    </p> -->
  </div>
<div style="padding-bottom: 20px" id="trendTable">
  <mu-data-table border :columns="columns" :height="height" :data="list">
    <template slot="header" slot-scope="scope" style="width:100%">
      <tr>
        <th v-for="(c, i) in columns" :colspan="c.colspan || 1" :key="c.title + i" 
          :style="{width: (c.width * (c.colspan || 1)) + 'px !important'}" class="is-center">{{c.title}}</th>
      </tr>
    </template>

    <template slot-scope="scope" >
      <!-- 走势核心渲染区域 -->
      <td width="55">
        {{scope.row.special ? scope.row.issue : (scope.row.issue.indexOf('-') > -1 ? (scope.row.issue.split('-')[1] + "期") : scope.row.issue)}}
      </td>
      <td class="is-center" v-for="(d, j) in scope.row.item" :key="j + '_' + scope.row.issue" :width="tool.wUnit"
        :class="d.cls || ''"> 
        <span :class="d.high ? 'choose' : ''" style="font-size: 16px">
          {{d.numb}}
          <!-- 右上角出现次数图标 -->
          <i class="high-times" v-if="d.high && d.times > 1">
             {{d.high ? d.times : ''}}
          </i>

        </span>
      </td>
    </template>
  </mu-data-table>
</div>
    <div style="height: 20px"></div>
    <!--<mu-dialog   fullscreen  :open.sync="openSimpleqqq" class="tttt">-->
      <!--<mu-button slot="actions" flat color="primary" @click="openSimpleqqq = false">Close</mu-button>-->

      <!--&lt;!&ndash;http://jinhua101.com/game/lottery/trend.html?qumin&ndash;&gt;-->
      <!--<iframe   frameborder=0  name="showHere" scrolling=auto src="http://jinhua101.com/game/lottery/trend.html?qumin"   width="100%" height="100%"></iframe>-->

    <!--</mu-dialog>-->

    <mu-dialog  max-width='95%' :open.sync="openSimple">
      <mu-list textline="two-line">
        <mu-list-item avatar button :ripple="false" v-for="(item, index) in selectData" :key="index">
          <mu-list-item-action>
            {{item.name}}：
          </mu-list-item-action>
          <mu-list-item-content>
            <span v-for="(a, i) in item.value" class="select-span" :class="{selected:selectName == a.name}" :key="a + i"
                @click="selectFun(item.name, a)">
              {{a.name}}
            </span>
          </mu-list-item-content>
        </mu-list-item>
      
    </mu-list>

      <!-- <div v-for="(item, index) in selectData" :key="index">
        
          <label>{{item.name}}：</label>
          <p>
            <span v-for="(a, i) in item.value" class="select-span" :class="{selected:selectName == a.name}" :key="a + i"
              @click="selectFun(item.name, a)">
            {{a.name}}
            </span>
          </p>


      </div> -->
  </mu-dialog>




</div>


</template>
<script>
  import  {queryTrend} from '@/api/login'
  import Tab from "vux/src/components/tab/tab";
  import {GameList} from '@/assets/js/game/game';
  import Trend from '@/assets/js/game/trend';

  let Numbers = [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
    ['1', '2', '3', '4', '5', '6'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    [],
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
  ];
  export default {
    name:'trend',
    components: {Tab},
    data(){
      return {
        openSimple:false,
        tool: null,
        selectName:'单号走势_万位',
        groupName: "单号走势",
        selectData: [],
        selectParams:'',
        height:window.screen.height - 150,
        query:{
          name: this.$route.query.name,
          query: 'latest-30'
        },
        list:[],
        columns: [
          { title: '期数', width: 55, align: 'center', cellAlign:'center'}
        ],
        colNum:1,
        notAppear:'',
        cho:30,
        openSimpleqqq:true,
        queryName:this.$route.query.name,
        lottery: null,
        nums: null
      }
    },

    created(){
      let $this = this;
      this.lottery = GameList.cache[this.queryName];
      // this.nums = Numbers[this.lottery.type - 1];
      this.init();

      if (this.lottery.type == 6) return;
      this.getList();
    },
    methods:{
      chooseStage(num){
        this.cho = num
        this.query.query = 'latest-'+num
        this.getList()
      },
      selectFun(bname, row){
        this.groupName = bname;
        this.selectName = bname + '_' + row.name;
        this.openSimple = false;
        this.columns = this.tool.changeMethod(bname, row);
        this.getList();
      },
      init: function () {
        this.tool = Trend[this.lottery.type - 1];
        this.nums = this.tool.nums;
        this.selectData = this.tool.selectData;
        this.columns = this.tool.changeMethod();
        this.groupName = this.selectData[0].name;
        this.selectName = this.selectData[0].name + '_' + this.selectData[0].value[0].name;
      },
      updateItems: function () {
        this.tool.updateItems(this.list, this.groupName);
      },
      //开奖
      getList(flag){
        let $this = this;
        if(flag){this.list = []}
        queryTrend(this.query).then(res => {
          this.list= res.data.result; // .reverse();
          this.notAppear = res.data.notAppear;
          // 100期未出现该号码
          $this.nums.forEach(d => { if (!(d in this.notAppear)) this.notAppear[d] = 100; });

          this.updateItems();
        })
      },
    }
  }
</script>
<style scoped>
  th, td { padding: 0px 1px; }
  th {white-space:normal; word-break:break-all;overflow:hidden; font-size: 14px;}
  .th0 { background-color: #219c6d; color: #fff }
  .th1 { background-color: #8ea2e8; color: #fff }
  .th2 { background-color: #94e6e3; color: #fff }
  .th3 { background-color: #4cd6bc; color: #fff }
  .th4 { background-color: #a18b4d; color: #fff }
  .th0 { background-color: #5385c7; color: #fff }
  .th5 { background-color: #baca5c; color: #fff }
  .th6 { background-color: #7b4bbb; color: #fff }
  .th7 { background-color: #4c09a3; color: #fff }
  .th8 { background-color: #029e3e; color: #fff }
  .th9 { background-color: #0e84bb; color: #fff }
  .th10 { background-color: #74bae2; color: #fff }
  .tha { background-color: #1c6431; color: #fff }
  .trend-model /deep/ .mu-table th{
    padding: 0;
  }
  .trend-model /deep/ .mu-table td{
    padding: 0;
  }
.mu-item-action { min-width: 71px; }

.select-span{
  display: inline-block;
  padding: 1px 3px;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px solid #6168dd ;
  border-radius: 3px;
  font-size: 14px;
}
  .chan{
    background: #6168dd;
    color: #fff;
  }
  .choose{
    display: inline-block;
    background-color: #cf503a;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    position: relative;
  }
  .selected{
    background-color: #cf503a;
    color: #fff;
  }
  .high-times{
    width: 15px;
    height: 15px;
    text-align: center;
    position: absolute;
    border-radius: 50%;
    font-style: normal;
    top: -8px;
    background: rgb(255, 87, 34);
    line-height: 15px;
    right: -5px;
    font-size: 12px;
  }

  .tttt /deep/ .mu-dialog-body{
    height: 100%;
  }
</style>
