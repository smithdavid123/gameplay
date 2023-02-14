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
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          memberName: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'memberName',
          label: '用户名称'
        }],
        tableColumns: [{
          label: '用户名称',
          prop: 'memberName',
          align: 'left',
visible: true,
          minWidth: '10%'
        }, {
          label: '连续签到天数',
          prop: 'contSignDay',
          align: 'left',
visible: true,
          minWidth: '10%'
        }, {
          label: '奖励积分',
          prop: 'rewardPoint',
          align: 'left',
visible: true,
          minWidth: '10%'
        }, {
          label: '签到时间',
          prop: 'lastSignInDate',
          align: 'left',
          minWidth: '10%',
visible: true,
          render: row=> {
            return this.$format(row.lastSignInDate, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '抽奖时间',
          prop: 'lastSignDrawDate',
          align: 'left',
          minWidth: '10%',
visible: true,
          render: row=> {
            return this.$format(row.lastSignDrawDate, 'yyyy-MM-dd HH:mm:ss');
          }
        }],
        data: []
      };
    },
    created() {
      // this.getList()
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.leaguelotteryList(this.listQuery);
        const {
          count,
          list
        } = data;
        this.total = count;
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        // to do
      }
    }
  };
</script>