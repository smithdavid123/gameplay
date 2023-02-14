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
      <div>
        <div
          class="primary-btn"
          @click="checkValidate() && (confirmVisible = true)"
        >
          <svg-icon icon-class="stop" />系统撤单
        </div>
      </div>
      <ColumnBtn :columns.sync="tableColumns" />
    </div>
    <div class="container-wrap">
      <table-page
        ref="paraentTable"
        v-loading.lock="loading"
        :data="data"
        :columns="tableColumns"
        :total="total"
        :show-summary="true"
        :summary="countData"
        height="calc(100vh - 300px)"
        :page.sync="listQuery.pageNumber"
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="billno-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="handleDetail(row)"
          >{{ row.billno }}</span>
        </template>
        <template
          slot="platformLoss-column"
          slot-scope="{row}"
        >
          <span :class="[(row.winMoney - row.money) < 0 ? 'text-red' : 'text-green']">{{ (row.winMoney - row.money).toFixed(2) }}</span>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatteOrderStatusTagClass"
          >
            {{ row.status | formatteOrderStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      width="300px"
      top="40vh"
    >
      <p>
        确认对订单进行系统撤单吗?
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn"
          @click="systemCancelOrder"
        >
          确认
        </div>
        <div
          class="disabled-btn"
          style="margin-left: 16px;"
          @click="confirmVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      class="tab-dialog"
      :visible.sync="detailVisible"
      width="80%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="订单详情"
          name="detail"
        />
      </el-tabs>
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            class="primary-label-form"
            :form="form"
            :columns="columns"
          />
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import { orderStatus } from '@/utils/options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          orderCode: '',
          memberName: '',
          betPeriod: '',
          orderStatus: '',
          beginTime: '',
          endTime:'',
          lotteryCode: '',
          lotteryBetName: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'orderCode',
          label: '订单编号'
        },{
          type: 'input',
          prop: 'memberName',
          label: '会员名称'
        }, {
          type: 'date',
          prop: ['beginTime', 'endTime'],
          label: '下单时间'
        },{
          type: 'input',
          prop: 'betPeriod',
          label: '投注期号'
        },{
          type: 'select',
          prop: 'orderStatus',
          label: '状态',
          allName: '请选择',
          options: orderStatus
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
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          label: '订单编号',
          prop: 'billno',
          align: 'center',
          minWidth: '15%',
          visible: true,
          // slotName: 'billno-column'
        }, {
          label: '投注时间',
          prop: 'orderTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row=> {
            return this.$format(row.orderTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '用户',
          prop: 'account',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '彩种',
          prop: 'lottery',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '玩法',
          prop: 'method',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '期号',
          prop: 'issue',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '投注金额',
          prop: 'money',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '中奖金额',
          prop: 'winMoney',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '盈亏',
          align: 'center',
          minWidth: '8%',
          visible: true,
          slotName: 'platformLoss-column'
        }, {
          label: '投注内容',
          prop: 'content',
          align: 'left',
          minWidth: '17%',
          visible: false
        }, {
          label: '状态',
          prop: 'status',
          align: 'center',
          minWidth: '8%',
          visible: true,
          slotName: 'status-column'
        }],
        data: [],
        countData: {},
        // 订单详情
        activeName: 'detail',
        detailVisible: false,
        currentOrder: {},
        form: {
          orderMemberName: '',
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
          prop: 'orderCode',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '彩期期号',
          prop: 'betPeriod',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '倍数模式',
          prop: 'betModel',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '投注金额',
          prop: 'betMoney',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '中奖金额',
          prop: 'bingoBonus',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '动态返点',
          prop: 'betRebates',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '开奖号码',
          prop: 'drawNumber',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '投注时间',
          prop: 'betTime',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '订单状态',
          prop: 'orderStatus',
          readonly: true
        },{
          span: 8,
          type: 'input',
          label: '订单类型',
          prop: 'orderType',
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
          label: '投注注数',
          prop: 'betCount',
          readonly: true
        },{
          span: 24,
          type: 'textarea',
          label: '投注内容',
          prop: 'content',
          readonly: true
        }],
        // 撤单
        checked: [],
        confirmVisible: false,
      };
    },
    watch: {
      'listQuery.lotteryCode'(val) {
        if (val) {
          const currentlottery = this.lotteryList.filter(item => {
            return item.lottery === val;
          })[0].type;
          this.queryColumns[6].options = this.methodList[currentlottery].map(method => {
            return {
              label: method.name,
              value: method.methodName
            };
          });
        } else {
          this.listQuery.lotteryBetName = '';
          this.queryColumns[6].options = [];
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
        this.queryColumns[5].options = lotterys.map(item => {
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
        } = await this.$api.orderList(this.listQuery);
        const {
          totalCount,
          winMoneySum,
          moneySum,
          list
        } = data;
        this.total = totalCount;
        this.data = list;
        this.countData = {money:moneySum, winMoney: winMoneySum };
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.listQuery.pageNumber = 1;
        this.getList();
      },
      // 系统撤单
      async systemCancelOrder() {
        const formData = {username: this.checked[0].account, billno: this.checked[0].billno};
        const { error } = await this.$api.systemCancelOrder(formData);
        error && this.$message.success('提交成功');
        this.getList();
        this.confirmVisible = false;
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