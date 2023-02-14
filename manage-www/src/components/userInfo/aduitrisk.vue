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
        height="calc(60vh)"
        :page.sync="listQuery.page"
        @pagination="getList"
      >
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div :class="row.type | formatterMemberTypeTagClass">
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div :class="row.status | formatterWithdrawFlagTagClass">
            {{ row.status | formatterWithdrawFlag }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      userItem: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          billno: '',
          username: this.userItem.username,
          sTime: '',
          eTime: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'username',
            label: '用户名称',
            readonly: true
          },
          {
            type: 'input',
            prop: 'billno',
            label: '订单编号'
          },
          {
            type: 'date',
            prop: ['sTime', 'eTime'],
            label: '提交时间'
          }
        ],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center',
            Visible: true
          },
          {
            label: '订单编号',
            prop: 'billno',
            align: 'center',
            valign: 'middle',
            minWidth: '25%',
            visible: true
          },
          {
            label: '用户名称',
            prop: 'account',
            align: 'left',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '用户类型',
            prop: 'type',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'memberType-column'
          },
          {
            label: '提现金额（元）',
            prop: 'amount',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '手续费（元）',
            prop: 'feeAmount',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '开户名',
            prop: 'bankCardName',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '提现银行',
            prop: 'bankName',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: false
          },
          {
            label: '银行卡号',
            prop: 'bankCardId',
            align: 'center',
            valign: 'middle',
            minWidth: '15%',
            visible: false
          },
          {
            label: '开户行',
            prop: 'bankBranch',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: false
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'status-column'
          },
          {
            label: '申请时间',
            prop: 'createTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '审核时间',
            prop: 'checkTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '风控审核人',
            prop: 'checkUser',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '完成时间',
            prop: 'confirmTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          }
        ],
        data: []
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.searchWithdraw(listQuery);
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
        this.listQuery.page = 1;
        this.getList();
      }
    }
  };
</script>