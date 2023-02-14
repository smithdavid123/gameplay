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
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="row.orderStatus | formatterRechargeStatusTagClass"
          >
            {{ row.orderStatus | formatterRechargeStatus }}
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
          prop: 'billno',
          label: '订单号'
        },{
          type: 'input',
          prop: 'username',
          label: '用户名称',
          readonly: true
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
          align: 'center'
        },
        {
          label: '订单编号',
          prop: 'billno',
          align: 'left',
          valign: 'middle',
          minWidth: '20%',
          visible: true
        },
        {
          label: '用户名称',
          prop: 'account',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '充值金额(元)',
          prop: 'amount',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '实际充值金额(元)',
          prop: 'actualAmount',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '充值后的余额(元)',
          prop: 'balanceAfter',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '充值状态',
          prop: 'orderStatus',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true,
          slotName: 'status-column'
        },
        {
          label: '充值时间',
          prop: 'payTime',
          align: 'center',
          valign: 'middle',
          minWidth: '15%',
          visible: true,
          render: row=> {
            return this.$format(row.payTime, 'yyyy-MM-dd HH:mm:ss');
          }
        },
        {
          label: '附言',
          prop: 'infos',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: false
        }],
        data: [],
        // 对账
        checked: [],
        confirmVisible: false,
        handleType: 1
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
        } = await this.$api.searchRecharge(listQuery);
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