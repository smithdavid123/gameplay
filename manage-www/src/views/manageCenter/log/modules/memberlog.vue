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
          requestIp: '',
          requestIpAddr: '',
          beginTime: '',
          endTime: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'memberName',
          label: '用户名称'
        },{
          type: 'input',
          prop: 'requestIp',
          label: '登录IP'
        },{
          type: 'input',
          prop: 'requestIpAddr',
          label: 'IP地址'
        },{
          type: 'date',
          prop: ['beginTime','endTime'],
          label: '操作时间'
        }],
        tableColumns: [{
          label: '用户名称',
          prop: 'memberName',
          align: 'left',
          valign: 'middle',
          minWidth: '8%',
          visible: true
        }, {
          label: '操作时间',
          prop: 'createDate',
          align: 'center',
          valign: 'middle',
          minWidth: '12%',
          visible: true,
          render: row=> {
                return this.$format(row.createDate, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '登录ip',
          prop: 'requestIp',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }, {
          label: 'ip地址',
          prop: 'requestIpAddr',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }, {
          label: '操作类型',
          prop: 'pathName',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        }, {
          label: '操作内容',
          prop: 'paramInMsg',
          align: 'left',
          valign: 'middle',
          minWidth: '50%',
          visible: true
        }
        ],
        data: [{
          map: {},
          record_id: 5296518,
          memberId: 232448,
          memberName: 'cgsa888',
          pathUrl: '/v1/lottery/cancelBet',
          pathName: '撤单',
          resultStatus: '成功',
          paramIn: "{'orderId':'10aec8c95e56157d03e7c335c486d28f','token':'02d4e433a7a8471496e6bf6041f8981e'}",
          paramInMsg: '取消投注成功',
          paramOut: "{'code':'1','msg':'成功'}",
          requestIp: '223.104.175.159',
          createDate: 1584078692000,
          createUser: 'cgsa888',
          leagueCode: 'jj138',
          requestIpAddr: '辽宁省'
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