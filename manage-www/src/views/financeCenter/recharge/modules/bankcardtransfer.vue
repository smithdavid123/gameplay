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
          slot="state-column"
          slot-scope="{row}"
        >
          <div
            :class="row.status | formatterRechargeStatusTagClass"
          >
            {{ row.status | formatterRechargeStatus }}
          </div>
        </template>
        <template
          slot="rechargeType-column"
          slot-scope="{row}"
        >
          <div
            class="tag-red"
          >
            {{ row.rechargeType | formatterRechargeWay }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      :width="confirmType === 1 ? '500px' : '300px'"
      top="40vh"
    >
      <p class="mb10">
        {{ message }}
      </p>
      <el-input
        v-if="confirmType === 1"
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
          @click="sureConfirm"
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
  import { onLinestate, rechargeType } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          billno: '',
          username: '',
          mark: '',
          status: 0,
          realName: '',
          payMethod: '',
          bank: '',
          cardId: '',
          beginTime: '',
          endTime: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'billno',
          label: '订单ID'
        },{
          type: 'input',
          prop: 'username',
          label: '用户名称'
        }, {
          type: 'input',
          prop: 'mark',
          label: '校验码'
        }, {
          type: 'select',
          prop: 'status',
          label: '状态',
          options: onLinestate
        }, {
          type: 'input',
          prop: 'realName',
          label: '存款人姓名'
        }, {
          type: 'select',
          prop: 'payMethod',
          label: '存款方式',
          options: rechargeType
        }, {
          type: 'input',
          prop: 'bank',
          label: '存入银行'
        }, {
          type: 'input',
          prop: 'cardId',
          label: '存入帐号'
        },{
          type: 'date',
          prop: ['beginTime', 'endTime'],
          label: '创建时间'
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '订单ID',
            prop: 'billno',
            align: 'left',
            minWidth: '10%',
            visible: false
          },
          {
            label: '提交时间',
            prop: 'createTime',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '用户名称',
            prop: 'account',
            align: 'center',
            minWidth: '6%',
            visible: true
          },
          {
            label: '存款人姓名',
            prop: 'realName',
            align: 'center',
            minWidth: '6%',
            visible: true
          },
          {
            label: '金额（元）',
            prop: 'amount',
            align: 'center',
            minWidth: '6%',
            visible: true
          },
          {
            label: '手续费(元)',
            prop: 'feeRate',
            align: 'center',
            minWidth: '6%',
            visible: true
          },
          {
            label: '用户类型',
            prop: 'type',
            align: 'center',
            minWidth: '6%',
            visible: true,
          slotName: 'memberType-column'
          },
          {
            label: '存入银行',
            prop: 'bankName',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '存入账号',
            prop: 'bankCardId',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '存款方式',
            prop: 'payType',
            align: 'center',
            minWidth: '6%',
            visible: true,
          slotName: 'rechargeType-column'
          },
          {
            label: '校验码',
            prop: 'mark',
            align: 'center',
            minWidth: '6%',
            visible: true
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            minWidth: '6%',
            visible: true,
          slotName: 'state-column'
          },
          {
            label: '完成时间',
            prop: 'confirmTime',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '操作人',
            prop: 'confirmUser',
            align: 'center',
            minWidth: '6%',
            visible: true
          },
          {
            label: '用户附言',
            prop: 'userInfo',
            align: 'center',
            minWidth: '10%',
            visible: true
          }],
        data: [],
        // 对账
        checked: [],
        confirmVisible: false,
        confirmType: 1,
        // 拒绝理由
        refuseReason: ''
      };
    },
    computed: {
      message: function() {
        return this.confirmType === 2 ? '确认转账成功?' : '确认转账失败?';
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
        } = await this.$api.bankcardtransfer(this.listQuery);
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
        this.confirmType = index;
        this.confirmVisible = true;
      },
      // 确认操作
      async sureConfirm() {
        const formData = {username: this.checked[0].account, billno: this.checked[0].billno, status: this.confirmType};
        this.confirmType === 1 && (formData.refuseReason = this.refuseReason);
        const { error } = await this.$api.setMoneyIn(formData);
        error && this.$message.success('提交成功');
        this.getList();
        this.confirmVisible = false;
      }
    }
  };
</script>