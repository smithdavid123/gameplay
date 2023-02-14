<template>
  <div>
    <div class="module-query">
      <MapQuery
        :query="listQuery"
        :columns="queryColumns"
      />
      <SearchBtn :query.sync="listQuery" />
    </div>
    <div class="module-handle">
      <div />
      <ColumnBtn :columns.sync="tableColumns" />
    </div>
    <div class="container-wrap">
      <table-page
        ref="paraentTable"
        v-loading.lock="loading"
        :data="data"
        :columns="tableColumns"
        :total="total"
        :hidden-summary="false"
        :summary="countData"
        height="calc(100vh - 342px)"
        :page.sync="listQuery.pageNumber"
        @pagination="getList"
      >
        <template
          slot="appendCode-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="handleDetail(row)"
          >{{ row.appendCode }}</span>
        </template>
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.map.memberType | formatterMemberTypeTagClass"
          >
            {{ row.map.memberType | formatterMemberType }}
          </div>
        </template>
        <template
          slot="appendStatus-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatteAppendStatusTagClass"
          >
            {{ row.status | formatteAppendStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      class="tab-dialog"
      :visible.sync="detailVisible"
      width="80%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="追号详情"
          name="info"
        >
          <div
            class="module-form-scroll"
            style="height:calc(65vh)"
          >
            <el-scrollbar>
              <json-form
                ref="jsonForm"
                class="primary-label-form"
                :form="form"
                :columns="columns"
              />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="追号内容"
          name="content"
        >
          <table-page
            :data="contentData"
            :columns="contentColumns"
            :hidden-pagination="true"
            height="calc(65vh)"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { appendStatus } from '@/utils/options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          appendCode: '',
          memberName: '',
          appendStatus: '',
          beginTime: '',
          endTime:'',
          lotteryCode: '',
          lotteryBetName: ''
        },
        lotteryList: [],
        methodList: [],
        queryColumns: [{
          type: 'input',
          prop: 'appendCode',
          label: '订单编号'
        },{
          type: 'input',
          prop: 'memberName',
          label: '会员名称'
        }, {
          type: 'date',
          prop: ['beginTime', 'endTime'],
          label: '下单时间'
        }, {
          type: 'select',
          prop: 'appendStatus',
          label: '状态',
          allName: '请选择',
          options: appendStatus
        }, {
          type: 'select',
          prop: 'lotteryCode',
          label: '彩种',
          allName: '请选择',
          options: []
        }, {
          type: 'select',
          prop: 'lotteryBetName',
          label: '玩法',
          allName: '请选择',
          options: []
        }],
        tableColumns: [{
          label: '订单编号',
          prop: 'billno',
          align: 'center',
          minWidth: '18%',
          visible: true
        }, {
          label: '投注时间',
          prop: 'orderTime',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '用户',
          prop: 'account',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '彩种',
          prop: 'lottery',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '玩法',
          prop: 'method',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '开始期号',
          prop: 'startIssue',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '投注内容',
          prop: 'content',
          align: 'left',
          minWidth: '15%',
          visible: true
        }, {
          label: '投注类型',
          prop: 'appendType',
          align: 'left',
          minWidth: '10%',
          visible: false,
          filter: 'formatterAppendType'
        }, {
          label: '总金额',
          prop: 'totalMoney',
          align: 'center',
          width: '80px',
          visible: true
        }, {
          label: '中奖金额',
          prop: 'winMoney',
          align: 'center',
          width: '100px',
          visible: true
        }, {
          label: '追号期数',
          prop: 'totalCount',
          align: 'center',
          width: '100px',
          visible: true
        }, {
          label: '追号完成期数',
          prop: 'donePeriodNum',
          align: 'center',
          width: '120px',
          visible: false
        }, {
          label: '注数',
          prop: 'nums',
          align: 'center',
          width: '80px',
          visible: true
        }, {
          label: '状态',
          prop: 'status',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'appendStatus-column'
        }],
        data: [],
        countData: {
            map: {},
            appendTotalMoney: 46455.630000000005,
            doneMoney: 23187.71
        },
        // 订单详情
        detailVisible: false,
        activeName: 'info',
        form: {
          orderMemberName: 'zxc12340',
          lotteryName: '',
          lotteryBetName: '',
          orderCode: '',
          betPeriod: '',
          betModel: '',
          betMoney: '',
          bingoBonus: '',
          betRebates: '',
          drawNumber: '',
          betTime: '',
          orderStatus: '',
          orderType: '',
          regSource: '',
          betCount: '',
          content: ''
        },
        columns: [{
          span: 8,
          type: 'input',
          label: '用户名',
          prop: 'orderMemberName',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '彩种',
          prop: 'lotteryName',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '玩法',
          prop: 'lotteryBetName',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '订单编号',
          prop: 'appendCode',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '开始期号',
          prop: 'startPeriod',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '追号期数',
          prop: 'appendPeriodNum',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '完成期数',
          prop: 'donePeriodNum',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '取消期数',
          prop: 'cancelNum',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '中奖期数',
          prop: 'bingoBonusNum',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '派奖金额',
          prop: 'bingoBonus',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '取消金额',
          prop: 'cancelMoney',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '基本奖金',
          prop: 'betBonusExtend',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '追号金额',
          prop: 'appendTotalMoney',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '完成金额',
          prop: 'doneMoney',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '中奖即停',
          prop: 'stopTrace',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '投注时间',
          prop: 'appendTime',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '投注返点',
          prop: 'betRebates',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '投注注数',
          prop: 'betCount',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '订单类型',
          prop: 'appendType',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '订单来源',
          prop: 'regSource',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '跳开即停',
          prop: 'officialOff',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '模式',
          prop: 'betModel',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '订单状态',
          prop: 'appendStatus',
          readonly: true
        },{
          span: 24,
          type: 'textarea',
          label: '投注内容',
          prop: 'content',
          readonly: true
        }],
        contentData: [{
          orderCode: '20200307065825685',
          lotteryPeriod: '202003070243',
          multipleNum: '5',
          appendStatus: '未中奖'
        }],
        contentColumns: [{
          prop: 'orderCode',
          label: '订单编号',
          minWidth: '30%',
          align: 'center',
          visible: true
        },{
          prop: 'lotteryPeriod',
          label: '期号',
          minWidth: '30%',
          align: 'center',
          visible: true
        },{
          prop: 'multipleNum',
          label: '倍数',
          minWidth: '20%',
          align: 'center',
          visible: true
        },{
          prop: 'appendStatus',
          label: '状态',
          minWidth: '20%',
          align: 'center',
          visible: true
        },]
      };
    },
    watch: {
      'listQuery.lotteryCode'(val) {
        if (val) {
          const currentlottery = this.lotteryList.filter(item => {
            return item.lottery === val;
          })[0].type;
          this.queryColumns[5].options = this.methodList[currentlottery].map(method => {
            return {
              label: method.name,
              value: method.methodName
            };
          });
        } else {
          this.listQuery.lotteryBetName = '';
          this.queryColumns[5].options = [];
        }
      }
    },
    mounted() {
      this.getGameList();
      this.getList();
    },
    methods: {
      // 获取查询条件--彩种和玩法
      async getGameList() {
        const {
          data
        } = await this.$api.listGameMethod();
        const {
          lotterys,
          methods
        } = data;
        this.lotteryList = lotterys;
        this.methodList = methods;
        this.queryColumns[4].options = lotterys.map(item => {
          return {
            label: item.showName,
            value: item.lottery,
          };
        });
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.appendList(this.listQuery);
        const {
          totalCount,
          list
        } = data;
        this.total = totalCount;
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.listQuery.pageNumber = 1;
        this.getList();
      },
      handleDetail(row) {
        this.currentOrder = row;
        this.detailVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          Object.keys(this.form).forEach(key=> {
            this.form[key] = key === 'orderMemberName' ? row.map.memberName : row[key];
          });
        });
      }
    }
  };
</script>