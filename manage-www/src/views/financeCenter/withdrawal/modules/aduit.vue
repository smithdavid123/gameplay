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
          v-permission:2="{ fn: handleConfirm, args: 2, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />锁定/解锁
        </div>
        <div
          v-permission:2="{ fn: handleUpdate, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />审核
        </div>
        <div
          v-permission:2="{ fn: handleConfirm, args: 1, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />对账
        </div>
        <div
          v-permission:2="{ fn: handleConfirm, args: 0, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />退款
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
          <div :class="row.checkStatus | formatterWithdrawFlagTagClass2">
            {{ row.checkStatus | formatterWithdrawFlag2 }}
          </div>
        </template>
        <template
          slot="lockUser-column"
          slot-scope="{row}"
        >
          <div :class="[row.lockUser ? 'tag-red' : 'tag-gray']">
            {{ row.lockUser ? row.lockUser : '未锁定' }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="lockVisible"
      width="360px"
      top="40vh"
    >
      <p>{{ confirmMessage }}</p>
      <div
        slot="footer"
        class="dialog-footer ta"
      >
        <div
          class="primary-btn small-btn"
          @click="sureConfirm"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="lockVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="提现审核"
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
          银行卡出款
        </div>
        <div
          class="primary-btn small-btn ml16"
          @click="updateData(2)"
        >
          自动出款
        </div>
        <div
          class="primary-btn small-btn ml16"
          @click="updateData(3)"
        >
          人工出款
        </div>
        <div
          class="primary-btn small-btn ml16"
          @click="updateData(0)"
        >
          提现拒绝
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
    withdrawFlag2,
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
          beginVerifyTime: '',
          endVerifyTime: '',
          beginFinishTime: '',
          endFinishTime: '',
          beginSendTime: '',
          endSendTime: '',
          cardholder: '',
          withdrawCashCon: 1,
          withdrawFlag: 1,
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
            options: withdrawFlag2
          },
          {
            type: 'date',
            prop: ['beginVerifyTime', 'endVerifyTime'],
            label: '风控审核时间',
            dateType: ''
          },
          {
            type: 'date',
            prop: ['beginFinishTime', 'endFinishTime'],
            label: '完成时间',
            dateType: ''
          },
          {
            type: 'date',
            prop: ['beginSendTime', 'endSendTime'],
            label: '放款时间',
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
            label: '锁定',
            prop: 'lockUser',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'lockUser-column'
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
            label: '风控审核时间',
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
            label: '放款时间',
            prop: 'confirmTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '完成时间',
            prop: 'finishTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          }
        ],
        data: [],
        // 操作
        checked: [],
        confirmType: 0,
        lockVisible: false,
        editVisible: false,
        form: {
          billno: '',
          bankName: '',
          bankCardName: '',
          bankBranch: '',
          bankCardId: '',
          amount: '',
          feeAmount: '',
          lockUser: '',
          refuseReason: ''
        },
        formColumns: [{
            span: 12,
            type: 'input',
            label: '开户名',
            prop: 'bankCardName',
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
          }, {
            span: 12,
            type: 'input',
            label: '锁定状态',
            prop: 'lockUser',
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
    computed: {
      confirmMessage: function() {
        if (this.confirmType === 2) {
          return this.checked.length && `确定${this.checked[0].lockUser ? '解锁' : '锁定'}?`;
        } else {
          return this.confirmType ? '确认对账?' : '确认退款?';
        }
      }
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
        } = await this.$api.withdrawaladuit(this.listQuery);
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
      handleConfirm(type) {
        this.confirmType = type;
        this.lockVisible = true;
      },
      sureConfirm() {
        this.confirmType === 2 ? this.sureLock() : this.sureWithDrawal();
      },
      // 锁定与解锁
      async sureLock(flag) {
        const billno = this.checked[0].billno;
        const status = this.checked[0].lockUser ? 0 : 1;
        const formData = { billno, status };
        const {
          error
        } = await this.$api.lockMoneyOut(formData);
        this.lockVisible = false;
        this.getList();
        !flag && !error && this.$message.success('提交成功');
      },
      // 对账与提款
      async sureWithDrawal() {
        const billno = this.checked[0].billno;
        const status = this.confirmType;
        const username = this.checked[0].account;
        const formData = { billno, status, username };
        const {
          error
        } = await this.$api.setMoneyOut(formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.lockVisible = false;
      },
      // 提款审核
      async handleUpdate() {
        !this.checked[0].lockUser && this.sureLock(true);
        this.editVisible = true;
        this.$nextTick(_ => {
          Object.keys(this.form).forEach(key => {
            if (key === 'lockUser') {
              this.form.lockUser = `已锁定(锁定人:${this.checked[0].lockUser || this.$store.getters.username})` ;
            } else {
              this.form[key] = this.checked[0][key];
            }
          });
        });
      },
      // 确认审核
      async updateData(type) {
        const { billno, refuseReason } = this.form;
        const formData = { billno, refuseReason };
        type > 0 ? (formData.payType = type, formData.status = 1) : (formData.status = 0);
        const {
          error
        } = await this.$api.financeMoneyOut(formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.editVisible = false;
      }
    }
  };
</script>