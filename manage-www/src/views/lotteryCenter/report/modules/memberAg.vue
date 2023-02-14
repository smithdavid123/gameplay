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
        :page.sync="listQuery.page"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { thirdParty, totalPattern } from '@/utils/options';
  export default {
    data() {
      return {
        loading: true,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          thirdParty: '',
          username: '',
          team: 0,
          byDay: 0,
          sDate: '',
          eDate:''
        },
        queryColumns: [{
          type: 'select',
          prop: 'thirdParty',
          label: '第三方',
          options: thirdParty
        },{
          type: 'input',
          prop: 'username',
          label: '用户名称'
        }, {
          type: 'check',
          prop: 'team',
          label: '包含下级',
          flag: true
        }, {
          type: 'date',
          prop: ['sDate', 'eDate'],
          label: '统计时间'
        }, {
          type: 'select',
          prop: 'byDay',
          label: '统计方式',
          noAll: true,
          options: totalPattern
        }],
        tableColumns: [{
          prop: 'time',
          label: '汇总日期',
          minWidth: '12%',
          visible: true,
          align: 'center'
        },{
          prop: 'username',
          label: '用户名',
          minWidth: '8%',
          visible: true,
          align: 'center'
        },{
          prop: 'thirdParty',
          label: '第三方',
          minWidth: '8%',
          visible: true,
          align: 'center',
          render(row) {
            return thirdParty.filter(item=> item.value === row.thirdParty)[0].label;
          }
        },{
          prop: 'balanceOut',
          label: '额度转出',
          minWidth: '8%',
          visible: true,
          align: 'center'
        },{
          prop: 'balanceIn',
          label: '额度转入',
          minWidth: '8%',
          visible: true,
          align: 'center'
        }, {
          prop: 'consume',
          label: '总销量',
          minWidth: '8%',
          visible: true,
          align: 'center'
        }, {
          prop: 'actualConsume',
          label: '实际销量',
          minWidth: '8%',
          visible: true,
          align: 'center'
        }, {
          prop: 'bonus',
          label: '派奖',
          minWidth: '8%',
          visible: true,
          align: 'center'
        }, {
          prop: 'rebate',
          label: '返点金额',
          minWidth: '8%',
          visible: true,
          align: 'center'
        }, {
          prop: 'commission',
          label: '活动抽佣',
          minWidth: '8%',
          visible: true,
          align: 'center'
        }, {
          prop: 'profitUser',
          label: '用户盈亏',
          minWidth: '8%',
          sortable: true,
          visible: true,
          align: 'center'
        }, {
          prop: 'profit',
          label: '平台盈亏',
          minWidth: '8%',
          visible: true,
          sortable: true,
          align: 'center'
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
        } = await this.$api.summaryGameUser(listQuery);
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