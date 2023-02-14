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
        :hidden-pagination="true"
        height="calc(100vh - 244px)"
      />
    </div>
  </div>
</template>
<script>
  import {
    payType
  } from './options';
  export default {
    data() {
      return {
        loading: false,
        listQuery: {
          payType: '',
          sTime: '',
          eTime: ''
        },
        queryColumns: [{
          type: 'select',
          prop: 'payType',
          label: '接口名称',
          options: payType
        },{
          type: 'date',
          prop: ['sTime', 'eTime'],
          label: '统计时间',
          dateType: ''
        }],
        tableColumns: [{
          label: '接口名称',
          prop: 'type',
          align: 'left',
          minWidth: '10%',
          valign: 'middle',
          visible: true,
          render(row) {
            return ['银行卡出款', '自动出款', '人工出款'][row.type - 1];
          }
        },
        {
          label: '使用笔数',
          prop: 'count',
          align: 'left',
          minWidth: '10%',
          valign: 'middle',
          visible: true
        },
        {
          label: '提现金额(元)',
          prop: 'amount',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '实际金额(元)',
          prop: 'actualAmount',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '手续费(元)',
          prop: 'feeAmount',
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
        const {
          data
        } = await this.$api.summaryMoneyOutType(this.listQuery);
        this.data = data;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      }
    }
  };
</script>