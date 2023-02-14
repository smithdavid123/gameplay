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
          thirdParty: '',
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
          type: 'date',
          prop: ['sDate','eDate'],
          label: '时间'
        }],
        tableColumns: [{
          label: '第三方',
          prop: 'memberName',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render(row) {
            return '彩票中心';
          }
        }, {
          label: '投注人数',
          prop: 'userCount',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '投注次数',
          prop: 'betCount',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '实际投注',
          prop: 'consume',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '人均投注额',
          prop: 'pcMoney',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '人均投注次数',
          prop: 'pcCount',
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
          label: '返水',
          prop: 'rebate',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '公司盈亏',
          prop: 'profit',
          align: 'center',
          visible: true,
          sortable: true,
          minWidth: '10%'
        }, {
          label: '额度转出',
          prop: 'balanceOut',
          align: 'center',
          visible: false,
          minWidth: '10%',
          render(row) {
            return row.balanceOut || 0;
          }
        }, {
          label: '额度转入',
          prop: 'balanceIn',
          align: 'center',
          visible: false,
          minWidth: '10%',
          render(row) {
            return row.balanceOut || 0;
          }
        }, {
          label: '当前余额',
          prop: 'balanceAll',
          align: 'center',
          visible: true,
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
        } = await this.$api.summaryGameReport(listQuery);
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