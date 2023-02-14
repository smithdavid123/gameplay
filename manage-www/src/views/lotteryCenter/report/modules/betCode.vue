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
          method: '',
          byDay: 0,
          sDate: '',
          eDate:''
        },
        lotteryList: [],
        methodList: [],
        queryColumns: [{
          type: 'select',
          prop: 'lottery',
          label: '彩种',
          allName: '请选择',
          options: []
        }, {
          type: 'select',
          prop: 'method',
          label: '玩法',
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
          label: '玩法',
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
          align: 'left',
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
    watch: {
      'listQuery.lottery'(val) {
        if (val) {
          const currentlottery = this.lotteryList.filter(item => {
            return item.lottery === val;
          })[0].type;
          this.queryColumns[1].options = this.methodList[currentlottery].map(method => {
            return {
              label: method.name,
              value: method.methodName
            };
          });
        } else {
          this.listQuery.method = '';
          this.queryColumns[1].options = [];
        }
      }
    },
    mounted() {
      this.getGameList();
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
        this.queryColumns[0].options = lotterys.map(item => {
          return {
            label: item.showName,
            value: item.lottery,
          };
        });
        this.getList();
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.methodReportDay(listQuery);
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