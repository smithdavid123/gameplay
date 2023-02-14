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
      >
        <template
          slot="profit-column"
          slot-scope="{row}"
        >
          <span :class="[row.profit < 0 ? 'text-red' : 'text-green']">{{ row.profit }}</span>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
import { totalPattern } from '@/utils/options';
  export default {
    data() {
      return {
        loading: true,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          lottery: '',
          byDay: 0,
          sDate: '',
          eDate:''
        },
        queryColumns: [{
          type: 'group',
          prop: 'lottery',
          label: '彩种',
          allName: '请选择',
          options: []
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
          label: '汇总日期',
          prop: 'time',
          align: 'center',
          minWidth: '12%',
          visible: true
        }, {
          label: '彩种',
          prop: 'category',
          align: 'center',
          minWidth: '12%',
          visible: true
        }, {
          label: '投注',
          prop: 'consume',
          align: 'center',
          minWidth: '12%',
          visible: true
        }, {
          label: '奖金',
          prop: 'bonus',
          align: 'center',
          minWidth: '12%',
          visible: true
        }, {
          label: '订单返点',
          prop: 'orderRebate',
          align: 'center',
          minWidth: '12%',
          visible: true
        }, {
          label: '代理返点',
          prop: 'agentRebate',
          align: 'center',
          minWidth: '12%',
          visible: true
        }, {
          label: '平台盈亏',
          prop: 'profit',
          align: 'center',
          minWidth: '12%',
          visible: true,
          sortable: true,
          slotName: 'profit-column'
        }, {
          label: '投注人数',
          prop: 'betCount',
          align: 'center',
          width: '150',
          visible: true
        }],
        data: []
      };
    },
    mounted() {
      this.getLotteryList();
      this.getList();
    },
    methods: {
      // 获取彩种
      async getLotteryList() {
        const {
          data
        } = await this.$api.lotteryList();
        this.queryColumns[0].options = data.reduce((total, current, index) => {
          if (!current.parentCode) {
            total.push({
              label: current.name,
              options: []
            });
          } else {
            total[total.length - 1].options.push({
              value: current.code,
              label: current.name
            });
          }
          return total;
        }, []);
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.lotteryReportList(listQuery);
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