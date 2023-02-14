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
      <div>
        <div
          class="primary-btn"
          @click="handleBack"
        >
          <svg-icon icon-class="edit" />返回上一级
        </div>
      </div>
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
      >
        <template
          slot="username-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="handleDown(row)"
          >{{ row.username }}</span>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          sDate: '',
          eDate:''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '用户名称'
        },{
          type: 'date',
          prop: ['sDate', 'eDate'],
          label: '时间'
        }],
        tableColumns: [{
          prop: 'username',
          label: '用户名',
          minWidth: '10%',
          visible: true,
          align: 'center',
          slotName: 'username-column'
        },{
          prop: 'level',
          label: '等级',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'layer',
          label: '层级',
          minWidth: '10%',
          visible: true,
          align: 'center'
        },{
          prop: 'group',
          label: '用户组',
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
          sortable: true,
          visible: true
        }],
        preUser: [''],
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
        } = await this.$api.summaryReportTeam(listQuery);
        const {
          totalCount,
          list
        } = data;
        this.data = list.sort((a,b)=> {
          return a.username === this.listQuery.username ? -1 : 1;
        });
        this.total = totalCount;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.preUser = ['', this.listQuery.username];
        this.listQuery.page = 1;
        this.getList();
      },
      // 下砖
      handleDown({username}) {
        if (username === this.listQuery.username) return false;
        this.preUser.push(username);
        this.listQuery.username = username;
        this.listQuery.page = 1;
        this.getList();
      },
      // 返回上一级
      handleBack(index) {
        this.listQuery.username = this.preUser[this.preUser.length - 2];
        this.preUser.pop();
        this.listQuery.page = 1;
        this.getList();
      }
    }
  };
</script>