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
  import { totalPattern } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          sDate: '',
          eDate: '',
          type: 1
        },
        queryColumns: [{
          type: 'date',
          prop: ['sDate','eDate'],
          label: '时间'
        },{
          type: 'select',
          prop: 'type',
          label: '统计类型',
          noAll:true,
          options: totalPattern
        }],
        tableColumns: [{
          label: '统计时间',
          prop: 'time',
          align: 'center',
          visible: true,
          minWidth: '15%'
        }, {
          label: '存款',
          prop: 'recharge',
          align: 'center',
          visible: true,
          minWidth: '10%'
          
        }, {
          label: '取款',
          prop: 'withdraw',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '总投注',
          prop: 'consume',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '有效金额',
          prop: 'consumeReal',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '派彩',
          prop: 'bonus',
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
          label: '系统余额',
          prop: 'balanceAll',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '第三方余额',
          prop: 'balanceThird',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '登录人数',
          prop: 'login',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '活跃人数',
          prop: 'active',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '注册人数',
          prop: 'reg',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '当前在线人数',
          prop: 'online',
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
        } = await this.$api.reportByHour(listQuery);
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