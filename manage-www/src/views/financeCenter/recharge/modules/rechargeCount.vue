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
        height="calc(100vh - 300px)"
        :page.sync="listQuery.pageNumber"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
  import {
    lineType
  } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 0,
          beginTime: '',
          endTime: '',
          payName: '',
          rechargeType: ''
        },
        queryColumns: [{
          type: 'select',
          prop: 'rechargeType',
          label: '线上或线下',
          options: lineType
        }, {
          type: 'date',
          prop: ['beginTime', 'endTime'],
          label: '统计时间'
        }, {
          type: 'input',
          prop: 'payName',
          label: '接口名称'
        }],
        tableColumns: [{
            label: '接口名称',
            prop: 'name',
            align: 'left',
            minWidth: '20%',
            visible: true
          },
          {
            label: '支付平台',
            prop: 'payType',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            render(row) {
              return {'ALIPAY': '支付宝', 'WXPAY': '微信', 'JDPAY': '京东', 'UNIONPAY': '银联扫码', 'QQPAY': 'QQ钱包',
                      'QUICK_PAY': '快捷支付', 'NO_CARD': '无卡支付', 'DCBUY': 'OTC支付', 'ALIPAYH5': '支付宝H5', 'OTHER': '自定义'}[row.method];
            }
          },
          {
            label: '使用笔数',
            prop: 'count',
            align: 'center',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '充值金额(元)',
            prop: 'amount',
            align: 'center',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '实际金额(元)',
            prop: 'actualAmount',
            align: 'center',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '手续费(元)',
            prop: 'feeAmount',
            align: 'center',
            visible: true,
            minWidth: '10%'
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
        } = await this.$api.rechargeCount(this.listQuery);
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
        this.listQuery.pageNumber = 0;
        this.getList();
      }
    }
  };
</script>