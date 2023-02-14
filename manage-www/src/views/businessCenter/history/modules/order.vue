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
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="orderCode-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="handleDetail(row)"
          >{{ row.orderCode }}</span>
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
          slot="orderStatus-column"
          slot-scope="{row}"
        >
          <div
            :class="row.orderStatus | formatteOrderStatusTagClass"
          >
            {{ row.orderStatus | formatteOrderStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      class="tab-dialog"
      :visible.sync="detailVisible"
      width="60%"
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
  import { orderStatus, lotteryCode, lotteryBetName } from '@/utils/options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
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
          options: lotteryCode
        }, {
          type: 'select',
          prop: 'lotteryBetName',
          label: '玩法',
          allName: '请选择',
          options: lotteryBetName
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          label: '订单编号',
          prop: 'orderCode',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'orderCode-column'
        }, {
          label: '投注时间',
          prop: 'betTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row=> {
            return this.$format(row.betTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '用户',
          prop: 'map.memberName',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '用户类型',
          prop: 'map.memberType',
          align: 'center',
          minWidth: '8%',
          visible: false,
          slotName: 'memberType-column'
        }, {
          label: '彩种',
          prop: 'lotteryName',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '玩法',
          prop: 'lotteryBetName',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '期号',
          prop: 'betPeriod',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '投注金额',
          prop: 'betMoney',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '中奖金额',
          prop: 'bingoBonus',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '盈亏',
          prop: 'bingoBonus-betMoney',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '投注内容',
          prop: 'betContent',
          align: 'left',
          minWidth: '14%',
          visible: false
        }, {
          label: '倍数',
          prop: 'betMultiple',
          align: 'center',
          minWidth: '8%',
          visible: false
        }, {
          label: '注数',
          prop: 'betCount',
          align: 'center',
          minWidth: '8%',
          visible: false
        }, {
          label: '状态',
          prop: 'orderStatus',
          align: 'center',
          minWidth: '8%',
          visible: true,
          slotName: 'orderStatus-column'
        }],
        data: [{
            map: {
              memberName: 'ww343434',
              memberType: 2
            },
            orderId: 'ab26a1dfda3c1d27b95b8bc4f43126b8',
            orderCode: '20200306718453208',
            orderType: 0,
            memberId: 207522,
            groupId: '198585,200477,201054,201610,201879,207522,',
            lotteryCode: 'ssc_hn1',
            lotteryName: '河内1分彩',
            lotteryGameCode: 'ssc_hn1_h3',
            lotteryGameName: '后三',
            lotteryBetCode: 'ssc_hn1_h3_zx_fs6',
            lotteryBetName: '后三组六复式',
            betTime: 1583477763000,
            betPeriod: '202003060897',
            betMultiple: 5,
            betModel: 3,
            betCount: 20,
            betDigit: '0,0,0,0,0',
            betContent: '0,5,6,7,8,9',
            betMoney: 1,
            betRebates: 0,
            betBonusExtend: '166.000',
            createDate: 1583477763000,
            orderStatus: 0,
            leagueCode: 'jj138',
            sharding: 111,
            regSource: 4,
            transferFlag: 0
          }
        ],
        countData: {
            map: {},
            betMoney: 3632168.22,
            bingoBonus: 3534443.9
        },
        // 订单详情
        activeName: 'detail',
        detailVisible: false,
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
        }]
      };
    },
    created() {
      // this.getList()
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.leaguelotteryList(this.listQuery);
        const {
          count,
          list
        } = data;
        this.total = count;
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        // to do
      },
      // 系统撤单
      systemCancelOrder() {
        // to do
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