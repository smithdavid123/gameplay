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
          @click="handleConfirm(0)"
        >
          <svg-icon icon-class="edit" />计算分红
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleConfirm(1)"
        >
          <svg-icon icon-class="edit" />批量发放
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleConfirm(2)"
        >
          <svg-icon icon-class="edit" />批量拒绝
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
        :page.sync="listQuery.page"
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatterDividendStatusTagClass"
          >
            {{ row.status | formatterDividendStatus2 }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      width="300px"
      top="40vh"
    >
      {{ message }}
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="sureConfirm"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="confirmVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import { status2 } from './options';
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
          parent: '',
          bTime: '',
          sTime: '',
          consume1: '',
          consume2: '',
          amount1: '',
          amount2: '',
          status: 0
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '契约用户'
        },{
          type: 'input',
          prop: 'parent',
          label: '契约上级'
        },{
          type: 'date',
          prop: ['bTime', 'sTime'],
          label: '分红期'
        },{
          type: 'select',
          prop: 'status',
          label: '状态',
          options: status2
        },{
          type: 'input',
          prop: 'consume1',
          label: '消费金额大于'
        },{
          type: 'input',
          prop: 'consume2',
          label: '消费金额小于'
        },{
          type: 'input',
          prop: 'amount1',
          label: '分红金额大于'
        },{
          type: 'input',
          prop: 'amount2',
          label: '分红金额小于'
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '分红期',
          prop: 'issue',
          align: 'left',
          visible: true,
          minWidth: '15%'
        }, {
          label: '契约用户',
          prop: 'username',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '契约上级',
          prop: 'parent',
          align: 'left',
          visible: true,
          minWidth: '10%',
          render(row) {
            return row.parent ? row.parent : '平台';
          }
        }, {
          label: '消费量',
          prop: 'totalConsume',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '亏损量',
          prop: 'totalLoss',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '活跃用户',
          prop: 'activeUser',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '分红比例',
          prop: 'scalePoint',
          align: 'left',
          visible: true,
          minWidth: '10%',
          render(row) {
            return row.scalePoint ? `${row.scalePoint}%` : '-';
          }
        }, {
          label: '分红金额',
          prop: 'amount',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '发放时间',
          prop: 'drawTime',
          align: 'left',
          visible: true,
          minWidth: '15%'
        }, {
          label: '状态',
          prop: 'status',
          align: 'left',
          visible: true,
          minWidth: '10%',
          slotName: 'status-column'
        }, {
          label: '创建时间',
          prop: 'createTime',
          align: 'left',
          visible: false,
          minWidth: '10%'
        }],
        data: [],
        // 操作
        checked: [],
        confirmVisible: false,
        handleType: 0,
      };
    },
    computed: {
      message: function() {
        return ['确定要计算上一周期的分红吗？？已经发放的不再生成', '确认发放已选中的记录？', '确认拒绝已选中的记录？'][this.handleType];
      }
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
        } = await this.$api.getIssueRecord(listQuery);
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
        this.listQuery.page = 1;
        this.getList();
      },
      // 计算分红
      handleConfirm(index) {
        this.handleType = index;
        this.confirmVisible = true;
      },
      // 确认
      sureConfirm() {
// to do
      }
    }
  };
</script>