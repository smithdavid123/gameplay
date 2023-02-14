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
          slot="actType-column"
          slot-scope="{row}"
        >
          <div
            class="tag-aqua"
          >
            {{ row.atype | formatterActType }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatterStatusTagClass"
          >
            {{ row.status | formatterStatus }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import { actType, actCompleteStatus } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          name: '',
          username: '',
          type: '',
          status: '',
          sDate: '',
          eDate: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'name',
          label: '活动名称'
        },{
          type: 'input',
          prop: 'username',
          label: '用户名'
        },{
           type: 'select',
          prop: 'type',
          label: '活动类型',
          options: actType
        },{
           type: 'select',
          prop: 'status',
          label: '完成状态',
          options: actCompleteStatus
        },{
          type: 'date',
          prop: ['sDate', 'eDate'],
          label: '发放时间'
        }],
        tableColumns: [{
          label: '活动名称',
          prop: 'name',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '用户名',
          prop: 'username',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '活动类型',
          prop: 'aType',
          align: 'center',
          visible: true,
          minWidth: '10%',
          slotName: 'actType-column'
        }, {
          label: '消费流水',
          prop: 'totalConsume',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '盈亏',
          prop: 'totalLoss',
          align: 'center',
          visible: true,
          sortable: true,
          minWidth: '10%'
        }, {
          label: '充值金额',
          prop: 'totalRecharge',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '活动奖金',
          prop: 'amount',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '申请时间',
          prop: 'applyTime',
          align: 'center',
          visible: true,
          minWidth: '12%'
        }, {
          label: '发放来源',
          prop: 'paySource',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render(row) {
            return row.paySource === 0 ? '平台' : row.paySource;
          }
        }, {
          label: '完成状态',
          prop: 'status',
          align: 'center',
          visible: true,
          minWidth: '10%',
          slotName: 'status-column'
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
        } = await this.$api.listActivityRecords(listQuery);
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