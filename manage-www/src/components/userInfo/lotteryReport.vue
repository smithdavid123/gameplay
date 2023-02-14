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
        height="calc(100vh - 342px)"
        :hidden-pagination="true"
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
          <span class="text-red">{{ row.profit }}</span>
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
        loading: true,
        total: 0,
        listQuery: {
          username: this.userItem.username,
          isTeam: 1,
          sDate: '',
          eDate:''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '用户名',
          readonly: true
        }, {
          type: 'date',
          prop: ['sDate', 'eDate'],
          label: '时间'
        }, {
          type: 'check',
          prop: 'isTeam',
          label: '包含下级'
        }],
        tableColumns: [{
          prop: 'username',
          label: '用户名',
          minWidth: '10%',
          visible: true,
          align: 'center',
          render:(row)=> {
            return this.userItem.username;
          }
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
          label: '充值余额',
          minWidth: '10%',
          visible: true,
          align: 'center'
        }, {
          prop: 'withdraw',
          label: '提现余额',
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
          prop: 'activity',
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
          prop: 'profit',
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
        } = await this.$api.reportLotteryUser(listQuery);
        this.data = [data];
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