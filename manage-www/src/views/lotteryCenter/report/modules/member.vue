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
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          lottery: '',
          username: '',
          method: '',
          byDay: 0,
          sDate: '',
          eDate:''
        },
        lotteryList: [],
        methodList: [],
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '用户名'
        },{
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
          options: totalPattern
        }],
        tableColumns: [{
          prop: 'time',
          label: '汇总日期',
          minWidth: '12%',
          visible: true,
          align: 'center'
        },{
          prop: 'account',
          label: '用户名',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'lottery',
          label: '彩种',
          minWidth: '5%',
          visible: true,
          align: 'center'
        },{
          prop: 'method',
          label: '玩法',
          minWidth: '5%',
          visible: true,
          align: 'center'
        }, {
          prop: 'consume',
          label: '投注',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'bonus',
          label: '奖金',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'orderRebate',
          label: '订单返点',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'agentRebate',
          label: '代理返点',
          minWidth: '10%',
          align: 'center',
          visible: true
        }, {
          prop: 'profit',
          label: '平台盈亏',
          minWidth: '10%',
          align: 'center',
          sortable: true,
          visible: true,
          slotName: 'profit-column'
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
          this.queryColumns[2].options = this.methodList[currentlottery].map(method => {
            return {
              label: method.name,
              value: method.methodName
            };
          });
        } else {
          this.listQuery.method = '';
          this.queryColumns[2].options = [];
        }
      }
    },
    mounted() {
      this.getGameList();
      this.getList();
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
        this.queryColumns[1].options = lotterys.map(item => {
          return {
            label: item.showName,
            value: item.lottery,
          };
        });
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.lotteryReportUser(listQuery);
        const {
          totalCount,
          list
        } = data;
        this.total = totalCount;
        this.data = list.map(item=> {
          item.lottery = listQuery.lottery ? this.queryColumns[1].options.filter(item=> item.value === this.listQuery.lottery)[0].label : '全部';
          item.method = listQuery.method ? this.queryColumns[2].options.filter(item=> item.value === this.listQuery.method)[0].label : '全部';
          return item;
        });
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