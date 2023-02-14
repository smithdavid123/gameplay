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
          class="tag-aqua"
          style="height: 36px; line-height: 36px;"
        >
          *平台盈亏正数表示公司盈利，负数表示公司亏损（每天数据只做普通参考，并不做佣金等派发标准）
          <div class="tag-olive">
            统计余额
          </div>
          系统余额: * 第三方余额: *
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
        height="calc(100vh - 300px)"
        :page.sync="listQuery.page"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          sDate: '',
          eDate: ''
        },
        queryColumns: [{
          type: 'date',
          prop: ['sDate','eDate'],
          label: '时间'
        }],
        tableColumns: [{
          label: '日期',
          prop: 'time',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '存款',
          prop: 'recharge',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '取款',
          prop: 'withdraw',
          align: 'center',
          visible: true
        }, {
          label: '充值手续费',
          prop: 'feeAmount',
          align: 'center',
          visible: true
        }, {
          label: '总投注',
          prop: 'consume',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render(row) {
            return Number(row.consume) + Number(row.cancelOrder);
          }
        }, {
          label: '有效金额',
          prop: 'consume',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '会员盈亏',
          prop: 'profitUser',
          align: 'center',
          visible: true,
          sortable: true,
          minWidth: '10%'
        }, {
          label: '返水',
          prop: 'rebate',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '活动抽佣',
          prop: 'commission',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '平台盈亏',
          prop: 'profit',
          align: 'center',
          sortable: true,
          visible: true,
          minWidth: '10%'
        }],
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
        } = await this.$api.summaryReportAll(listQuery);
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