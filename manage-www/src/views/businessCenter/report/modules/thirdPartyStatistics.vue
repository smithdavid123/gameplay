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
          slot="memberName-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
          >{{ row.memberName }}</span>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import { thirdParty } from '@/utils/options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          thirdParty: '',
          isTeam: 0,
          sDate: '',
          eDate: ''
        },
        queryColumns: [{
          type: 'select',
          prop: 'thirdParty',
          label: '第三方',
          allName: '请选择',
          options: thirdParty
        },{
          type: 'input',
          prop: 'username',
          label: '用户名称'
        },{
          type: 'check',
          prop: 'isTeam',
          label: '包含下级',
          flag: true
        },{
          type: 'date',
          prop: ['sDate', 'eDate'],
          label: '时间'
        }],
        tableColumns: [{
          label: '用户名称',
          prop: 'username',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '日期',
          prop: 'time',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render: row=> {
            return row.time === 'None' ? '-' : row.time;
          }
        }, {
          label: '第三方',
          prop: 'thirdParty',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render(row) {
            return thirdParty.filter(item=> item.value === row.thirdParty)[0].label;
          }
        }, {
          label: '第三方余额',
          prop: 'balanceThird',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '额度转出',
          prop: 'balanceOut',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '额度转入',
          prop: 'balanceIn',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '总销量',
          prop: 'balance',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '实际销量',
          prop: 'actualConsume',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '派奖',
          prop: 'bonus',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '返点金额',
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
          label: '用户盈亏',
          prop: 'profitUser',
          align: 'center',
          visible: true,
          sortable: true,
          minWidth: '10%'
        }, {
          label: '平台盈亏',
          prop: 'profit',
          align: 'center',
          visible: true,
          sortable: true,
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
        } = await this.$api.reportThirdUserNew(listQuery);
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