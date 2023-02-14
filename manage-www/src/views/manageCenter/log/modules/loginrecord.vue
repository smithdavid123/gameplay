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
          memberName: '',
          loginIp: '',
          loginAddr: '',
          beginTime: '',
          endTime: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'memberName',
          label: '用户名称'
        },{
          type: 'input',
          prop: 'loginIp',
          label: '登录IP'
        },{
          type: 'input',
          prop: 'loginAddr',
          label: '登录地区'
        },{
          type: 'date',
          prop: ['beginTime','endTime'],
          label: '登录时间'
        }],
        tableColumns: [{
          label: '用户名称',
          prop: 'memberName',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }, {
          label: '登录时间',
          prop: 'loginDate',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true,
          render: row=> {
                return this.$format(row.loginDate, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '登录ip',
          prop: 'loginIp',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }, {
          label: '登录地区',
          prop: 'loginAddr',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }, {
          label: '登录结果',
          prop: 'loginResult',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }
        ],
        data: [{
          map: {},
          record_id: 6118430,
          memberId: 183172,
          memberName: 'zheng6666',
          loginDate: 1584078723000,
          memberType: 2,
          leagueCode: 'jj138',
          loginResult: '登录成功',
          loginIp: '113.250.208.3',
          loginAddr: '重庆市重庆市'
        }]
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