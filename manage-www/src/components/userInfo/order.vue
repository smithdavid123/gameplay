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
          @click="checkValidate() && (checked[0].status !== -1) && (confirmVisible = true)"
        >
          <svg-icon icon-class="stop" />撤单
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
        :hidden-summary="false"
        :summary="countData"
        height="calc(60vh)"
        :page.sync="listQuery.page"
        @pagination="getList"
        @selection-change="checked = $event"
      >
        <template
          slot="billno-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="handleDetail(row)"
          >{{ row.billno }}</span>
        </template>
        <template
          slot="platformLoss-column"
          slot-scope="{row}"
        >
          <span :class="[(row.winMoney - row.money) < 0 ? 'text-red' : 'text-green']">{{ (row.winMoney - row.money).toFixed(2) }}</span>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatteOrderStatusTagClass"
          >
            {{ row.status | formatteOrderStatus }}
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
      :modal="false"
    >
      <p>
        确认对订单进行撤单吗?
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn"
          @click="systemCancelOrder"
        >
          确认
        </div>
        <div
          class="disabled-btn"
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
  import resize from '../../views/mixins';
  import { orderStatus } from '@/utils/options';
  export default {
    mixins: [resize],
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
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          status: '',
          username: this.userItem.username,
          sTime: '',
          eTime: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '会员名称',
          readonly: true
        }, {
          type: 'date',
          prop: ['sTime', 'eTime'],
          label: '下单时间'
        },{
          type: 'select',
          prop: 'status',
          label: '状态',
          allName: '请选择',
          options: orderStatus
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          label: '订单编号',
          prop: 'billno',
          align: 'center',
          minWidth: '15%',
          visible: true,
          // slotName: 'billno-column'
        }, {
          label: '投注时间',
          prop: 'orderTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row=> {
            return this.$format(row.orderTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '用户',
          prop: 'account',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '彩种',
          prop: 'lottery',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '玩法',
          prop: 'method',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '期号',
          prop: 'issue',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '投注金额',
          prop: 'money',
          align: 'center',
          minWidth: '7%',
          visible: true
        }, {
          label: ' 注数',
          prop: 'nums',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '倍数',
          prop: 'multiple',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '中奖金额',
          prop: 'winMoney',
          align: 'center',
          minWidth: '7%',
          visible: true
        }, {
          label: '盈亏',
          align: 'center',
          minWidth: '7%',
          visible: true,
          slotName: 'platformLoss-column'
        }, {
          label: '投注内容',
          prop: 'content',
          align: 'left',
          minWidth: '14%',
          visible: false
        }, {
          label: '状态',
          prop: 'status',
          align: 'center',
          minWidth: '8%',
          visible: true,
          slotName: 'status-column'
        }],
        data: [],
        countData: {
            map: {},
            betMoney: 3632168.22,
            bingoBonus: 3534443.9
        },
        // 撤单
        checked: [],
        confirmVisible: false,
      };
    },
    mounted() {
      this.getList();
      // this.getCount()
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
        } = await this.$api.searchOrderAll(listQuery);
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
        // this.getCount();
      },
      // 获取统计
      async getCount() {
        const { pageNumber, ...formData} = this.listQuery;
        this.countData = await this.$api.orderTotal(formData);
      },
      // 手动撤单
      async systemCancelOrder() {
        try {
          const formData = {username: this.checked[0].account, billno: this.checked[0].billno};
          const { error } = await this.$api.userCancelOrder(formData);
          error && this.$message.success('提交成功');
          this.getList();
          this.confirmVisible = false;
        } catch (error) {
          this.confirmVisible = false;
        }
        
      }
    }
  };
</script>