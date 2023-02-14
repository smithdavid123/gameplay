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
          v-permission:2="{ fn: handleUpdate, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />审核
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
        :page.sync="listQuery.pageNumber"
        @pagination="getList"
        @selection-change="checked = $event"
      >
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div :class="row.type | formatterMemberTypeTagClass">
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="checkStatus-column"
          slot-scope="{row}"
        >
          <div :class="row.checkStatus | formatterWithdrawFlagTagClass">
            {{ row.checkStatus | formatterWithdrawFlag }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="风控审核"
      :visible.sync="editVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="120px"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="updateData(1)"
        >
          审核通过
        </div>
        <div
          class="primary-btn small-btn ml16"
          @click="updateData(0)"
        >
          审核拒绝
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="editVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    withdrawCashCon,
    withdrawFlag,
    bankName
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          memberName: '',
          withdrawCode: '',
          withdrawCashInput: '',
          beginApplyTime: '',
          endApplyTime: '',
          beginVerifyTime: '',
          endVerifyTime: '',
          beginFinishTime: '',
          endFinishTime: '',
          cardholder: '',
          withdrawCashCon: 1,
          withdrawFlag: 0,
          bankName: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'memberName',
            label: '用户名称'
          },
          {
            type: 'input',
            prop: 'withdrawCode',
            label: '订单编号'
          },
          {
            type: 'select',
            prop: 'withdrawCashCon',
            label: '金额',
            noAll: true,
            options: withdrawCashCon
          },
          {
            type: 'input',
            prop: 'withdrawCashInput',
            label: ''
          },
          {
            type: 'select',
            prop: 'withdrawFlag',
            label: '状态',
            options: withdrawFlag
          },
          {
            type: 'date',
            prop: ['beginApplyTime', 'endApplyTime'],
            label: '申请时间',
            dateType: ''
          },
          {
            type: 'date',
            prop: ['beginVerifyTime', 'endVerifyTime'],
            label: '审核时间',
            dateType: ''
          },
          {
            type: 'date',
            prop: ['beginFinishTime', 'endFinishTime'],
            label: '完成时间',
            dateType: ''
          },
          {
            type: 'input',
            prop: 'cardholder',
            label: '开户名'
          },
          {
            type: 'select',
            prop: 'bankName',
            label: '提现银行',
            allName: '请选择',
            options: bankName
          }
        ],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center',
            Visible: true
          },
          {
            label: '订单编号',
            prop: 'billno',
            align: 'center',
            valign: 'middle',
            minWidth: '25%',
            visible: true
          },
          {
            label: '用户名称',
            prop: 'account',
            align: 'left',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '用户类型',
            prop: 'type',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'memberType-column'
          },
          {
            label: '提现金额（元）',
            prop: 'amount',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '手续费（元）',
            prop: 'feeAmount',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '开户名',
            prop: 'bankCardName',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '提现银行',
            prop: 'bankName',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: false
          },
          {
            label: '银行卡号',
            prop: 'bankCardId',
            align: 'center',
            valign: 'middle',
            minWidth: '15%',
            visible: false
          },
          {
            label: '开户行',
            prop: 'bankBranch',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: false
          },
          {
            label: '状态',
            prop: 'checkStatus',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'checkStatus-column'
          },
          {
            label: '申请时间',
            prop: 'createTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '审核时间',
            prop: 'checkTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '风控审核人',
            prop: 'checkUser',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '完成时间',
            prop: 'confirmTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          }
        ],
        data: [],
        // 编辑记录
        checked: [],
        editVisible: false,
        form: {
          billno: '',
          account: '',
          bankName: '',
          bankCardName: '',
          bankProvince: '',
          bankBranch: '',
          bankCardId: '',
          amount: '',
          feeAmount: '',
          refuseReason: ''
        },
        formColumns: [{
            span: 12,
            type: 'input',
            label: '用户名称',
            prop: 'account',
            readonly: true
          },
          {
            span: 12,
            type: 'input',
            label: '提现银行',
            prop: 'bankName',
            readonly: true
          },
          {
            span: 12,
            type: 'input',
            label: '开户名',
            prop: 'bankCardName',
            readonly: true
          },
          {
            span: 12,
            type: 'input',
            label: '开户地址',
            prop: 'bankProvince',
            readonly: true
          },
          {
            span: 12,
            type: 'input',
            label: '开户行',
            prop: 'bankBranch',
            readonly: true
          }, {
            span: 12,
            type: 'input',
            label: '银行卡号',
            prop: 'bankCardId',
            readonly: true
          },
          {
            span: 12,
            type: 'input',
            label: '提现金额（元）',
            prop: 'amount',
            readonly: true
          }, {
            span: 12,
            type: 'input',
            label: '手续费（元）',
            prop: 'feeAmount',
            readonly: true
          },
          {
            type: 'textarea',
            label: '拒绝理由',
            prop: 'refuseReason'
          },
        ]
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.withdrawaladuitrisk(this.listQuery);
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
      // 风控审核
      handleUpdate() {
        this.editVisible = true;
        this.$nextTick(_ => {
          Object.keys(this.form).forEach(key => {
            this.form[key] = this.checked[0][key];
          });
        });
      },
      async updateData(status) {
        const { billno, refuseReason } = this.form;
        const formData = { billno, status, refuseReason };
        const {
          error
        } = await this.$api.riskMoneyOut(formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.editVisible = false;
      }
    }
  };
</script>