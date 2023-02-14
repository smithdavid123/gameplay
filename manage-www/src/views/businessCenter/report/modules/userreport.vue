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
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div :class="row.type | formatterMemberTypeTagClass">
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="platformLoss-column"
          slot-scope="{row}"
        >
          <span :class="[row.profit < 0 ? 'text-red' : 'text-green']">{{ row.profit }}</span>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import { memberType } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          isTeam: 0,
          type: '',
          sDate: '',
          eDate: ''
        },
        queryColumns: [{
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
          prop: ['sDate','eDate'],
          label: '时间'
        },{
          type: 'select',
          prop: 'type',
          label: '用户类型',
          options: memberType
        }],
        tableColumns: [{
          prop: 'username',
          label: '用户名',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'type',
          label: '用户类型',
          minWidth: '10%',
          visible: true,
          align: 'center',
          slotName: 'memberType-column'
        },{
          prop: 'userLevel',
          label: '等级',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'layer',
          label: '层级',
          minWidth: '10%',
          visible: false,
          align: 'center'
        },{
          prop: 'balanceAll',
          label: '平台余额',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'balanceThird',
          label: '第三方余额',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'recharge',
          label: '充值',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'withdraw',
          label: '提现',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'rebate',
          label: '返水',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'commission',
          label: '活动抽佣',
          minWidth: '10%',
          align: 'center',
          visible: true
        }, {
          prop: 'consume',
          label: '有效投注',
          minWidth: '10%',
          align: 'center',
          visible: true
        }, {
          prop: 'bonus',
          label: '彩派',
          minWidth: '10%',
          align: 'center',
          visible: true
        }, {
          prop: 'profitUser',
          label: '用户盈亏',
          minWidth: '10%',
          align: 'center',
          sortable: true,
          visible: true
        }, {
          prop: 'profit',
          label: '平台盈亏',
          minWidth: '10%',
          align: 'center',
          visible: true,
          sortable: true,
          slotName: 'platformLoss-column'
        }],
        data: []
      };
    },
    created() {
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
        } = await this.$api.reportLotteryUserNew(listQuery);
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