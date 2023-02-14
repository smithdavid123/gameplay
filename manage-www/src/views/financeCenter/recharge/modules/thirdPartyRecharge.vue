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
      <!-- <div>
        <div
          v-permission:3="{ fn: handleConfirm, args: 2, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="stop" />确认入账
        </div>
        <div
          v-permission:3="{ fn: handleConfirm, args: 1, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="stop" />拒绝
        </div>
      </div> -->
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
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.type | formatterMemberTypeTagClass"
          >
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatterRechargeStatusTagClass"
          >
            {{ row.status | formatterRechargeStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      :width="handleType === 1 ? '500px' : '300px'"
      top="40vh"
    >
      <p class="mb10">
        {{ message }}
      </p>
      <el-input
        v-if="handleType === 1"
        v-model="refuseReason"
        type="textarea"
        :rows="4"
        placeholder="请输入拒绝原因"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn"
          @click="surConfirm"
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
  import resize from '../../../mixins';
  import { onLinestate, memberType } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          billno: '',
          username: '',
          pay_name: '',
          followCode: '',
          utype: '',
          beginSubmitTime: '',
          endSubmitTime: '',
          beginFinishTime: '',
          endFinishTime: '',
          status: 0
        },
        queryColumns: [{
          type: 'input',
          prop: 'billno',
          label: '订单号'
        },{
          type: 'input',
          prop: 'username',
          label: '用户名称'
        }, {
          type: 'input',
          prop: 'pay_name',
          label: '支付平台名称'
        }, {
          type: 'select',
          prop: 'status',
          label: '充值状态',
          options: onLinestate
        }, {
          type: 'input',
          prop: 'followCode',
          label: '流水号'
        }, {
          type: 'select',
          prop: 'utype',
          label: '用户类型',
          options: memberType
        },
        {
          type: 'date',
          prop: ['beginSubmitTime', 'endSubmitTime'],
          label: '提交时间',
          dateType: ''
        },{
          type: 'date',
          prop: ['beginFinishTime', 'endFinishTime'],
          label: '完成时间',
          dateType: ''
        }
        ],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },
        {
          label: '订单编号',
          prop: 'billno',
          align: 'left',
          valign: 'middle',
          minWidth: '20%',
          visible: true
        },
        {
          label: '用户名称',
          prop: 'account',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '用户类型',
          prop: 'type',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true,
          slotName: 'memberType-column'
        },
        {
          label: '充值金额(元)',
          prop: 'amount',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '充值状态',
          prop: 'status',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true,
          slotName: 'status-column'
        },
        {
          label: '充值时间',
          prop: 'createTime',
          align: 'center',
          valign: 'middle',
          minWidth: '15%',
          visible: true
        },
        {
          label: '操作时间',
          prop: 'confirmTime',
          align: 'center',
          valign: 'middle',
          minWidth: '15%',
          visible: true
        },
        {
          label: '支付平台',
          prop: 'payType',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true,
          render(row) {
            return {'ALIPAY': '支付宝', 'WXPAY': '微信', 'JDPAY': '京东', 'UNIONPAY': '银联扫码', 'QQPAY': 'QQ钱包',
                    'QUICK_PAY': '快捷支付', 'NO_CARD': '无卡支付', 'DCBUY': 'OTC支付', 'ALIPAYH5': '支付宝H5', 'OTHER': '自定义'}[row.payType];
          }
        },
        {
          label: '支付渠道',
          prop: 'pay_name',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '附言',
          prop: 'userInfo',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: false
        },
        {
          label: '备注信息',
          prop: 'mark',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: false
        }],
        data: [],
        // 对账
        checked: [],
        confirmVisible: false,
        handleType: 1,
        // 拒绝理由
        refuseReason: ''
      };
    },
    computed: {
      message: function() {
        return this.handleType === 2 ? '确认进行充值入账?' : '确认进行拒绝订单?';
      }
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
        } = await this.$api.thirdPartyRecharge(this.listQuery);
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
        this.listQuery.pageNumber = 1;
        this.getList();
      },
      // 操作订单
      handleConfirm(index) {
        this.handleType = index;
        this.refuseReason = '';
        this.confirmVisible = true;
      },
      // 确认操作
      async surConfirm() {
        const formData = {username: this.checked[0].account, billno: this.checked[0].billno, status: this.handleType};
        this.handleType === 1 && (formData.refuseReason = this.refuseReason);
        const { error } = await this.$api.setMoneyIn(formData);
        error && this.$message.success('提交成功');
        this.getList();
        this.confirmVisible = false;
      }
    }
  };
</script>