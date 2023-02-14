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
            :class="row.appendStatus | formatteAppendStatusTagClass"
          >
            {{ row.appendStatus | formatteAppendStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="订单详情"
      :visible.sync="detailVisible"
      width="60%"
    >
      <el-tabs v-model="activeDetail">
        <el-tab-pane
          label="追号详情"
          name="info"
        >
          <json-form
            ref="jsonForm"
            class="primary-label-form"
            :form="form"
            :columns="columns"
          />
        </el-tab-pane>
        <el-tab-pane
          label="追号内容"
          name="content"
        >
          <table-page
            ref="paraentTable"
            :data="contentData"
            :columns="contentColumns"
            height="400px"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { appendStatus, lotteryCode, lotteryBetName } from '@/utils/options';
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
          options: lotteryCode
        }, {
          type: 'select',
          prop: 'lotteryBetName',
          label: '玩法',
          allName: '请选择',
          options: lotteryBetName
        }],
        appendStatus,
        lotteryCode,
        lotteryBetName,
        tableColumns: [{
          label: '订单编号',
          prop: 'appendCode',
          align: 'center',
          minWidth: '15%',
          visible: true,
          slotName: 'appendCode-column'
        }, {
          label: '投注时间',
          prop: 'appendTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row=> {
            return this.$format(row.appendTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '用户',
          prop: 'map.memberName',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '用户类型',
          prop: 'map.memberType',
          align: 'center',
          minWidth: '10%',
          visible: false,
          slotName: 'memberType-column'
        }, {
          label: '彩种',
          prop: 'lotteryName',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '玩法',
          prop: 'lotteryBetName',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '开始期号',
          prop: 'startPeriod',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '投注内容',
          prop: 'betContent',
          align: 'left',
          minWidth: '15%',
          visible: true
        }, {
          label: '投注类型',
          prop: 'appendType',
          align: 'left',
          minWidth: '10%',
          visible: true,
          filter: 'formatterAppendType'
        }, {
          label: '总金额',
          prop: 'appendTotalMoney',
          align: 'center',
          width: '80px',
          visible: true
        }, {
          label: '完成金额',
          prop: 'doneMoney',
          align: 'center',
          width: '100px',
          visible: true
        }, {
          label: '追号期数',
          prop: 'appendPeriodNum',
          align: 'center',
          width: '100px',
          visible: false
        }, {
          label: '追号完成期数',
          prop: 'donePeriodNum',
          align: 'center',
          width: '120px',
          visible: false
        }, {
          label: '注数',
          prop: 'betCount',
          align: 'center',
          width: '80px',
          visible: false
        }, {
          label: '状态',
          prop: 'appendStatus',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'appendStatus-column'
        }],
        data: [{
            map: {
              memberName: 'zb666888',
              memberType: 2
            },
            appendId: '9dfea0443c714ea6b9e1dbd2b596c61c',
            appendCode: '20200307587809073',
            appendStatus: 5,
            appendType: 2,
            appendTime: 1583583270000,
            betContent: '十个|和,',
            appendTotalMoney: 50,
            doneMoney: 5,
            startPeriod: '202003070243',
            appendPeriodNum: 10,
            donePeriodNum: 1,
            stopTrace: 1,
            officialOff: 1,
            createDate: 1583583270000,
            memberId: 238942,
            groupId: '166575,166985,167012,167728,167733,211305,238942,',
            lotteryCode: 'ssc_tx5',
            lotteryName: '奇趣腾讯5分彩',
            lotteryGameCode: 'ssc_tx5_lmp',
            lotteryGameName: '两面盘',
            lotteryBetCode: 'ssc_tx5_lmp_lhh_lhh',
            lotteryBetName: '两面盘龙虎和',
            betRebates: 0,
            betBonusExtend: '2.147,2.147,8.825',
            betModel: 1,
            betCount: 1,
            bingoBonus: 0,
            leagueCode: 'jj138',
            sharding: 109,
            regSource: 4
          }
        ],
        countData: {
            map: {},
            appendTotalMoney: 46455.630000000005,
            doneMoney: 23187.71
        },
        // 订单详情
        detailVisible: false,
        activeDetail: 'info',
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
          align: 'center'
        },{
          prop: 'lotteryPeriod',
          label: '期号',
          minWidth: '30%',
          align: 'center'
        },{
          prop: 'multipleNum',
          label: '倍数',
          minWidth: '20%',
          align: 'center'
        },{
          prop: 'appendStatus',
          label: '状态',
          minWidth: '20%',
          align: 'center'
        },]
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