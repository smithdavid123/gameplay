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
        height="calc(100vh - 342px)"
      >
        <template
          slot="platformLoss-column"
          slot-scope="{row}"
        >
          <span :class="[row.platformLoss < 0 ? 'text-red' : 'text-green']">{{ row.platformLoss }}</span>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
import { thirdParty } from '@/utils/options';
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
          thirdParty: '',
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
          prop: 'balanceThird',
          label: '第三方余额',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'balanceOut',
          label: '额度转出',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'balanceIn',
          label: '额度转入',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'consume',
          label: '总销量',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'actualConsume',
          label: '实际销量',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'bonus',
          label: '派奖',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'rebate',
          label: '返点金额',
          minWidth: '10%',
          visible: false,
          align: 'center'
        }, {
          prop: 'commission',
          label: '活动抽佣',
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
          sortable: true,
          visible: true,
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
        const {
          data
        } = await this.$api.reportThirdUser(this.listQuery);
        const {
          list
        } = data;
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      }
    }
  };
</script>