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
          v-permission:3="{ fn: handleAudit, args: 0, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />审核
        </div>
        <div
          v-permission:3="{ fn: handleAudit, args: 1, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="up" />拒绝
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
        @pagination="getList"
        @selection-change="checked = $event"
      >
        <template
          slot="transType-column"
          slot-scope="{row}"
        >
          <div :class="row.transType | formatterTransferTypeTagClass">
            {{ row.transType | formatterTransferType }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div :class="row.status | formatterTransferStatusTagClass">
            {{ row.status | formatterTransferStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      width="320px"
      top="40vh"
    >
      <p>
        {{ message }}
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="sureConfirm"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="confirmVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    type,
    detail,
    status
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          userIn: '',
          userOut: '',
          sDate: '',
          eDate: '',
          transType: '',
          remarks: '',
          status: 0
        },
        queryColumns: [{
            type: 'input',
            prop: 'userIn',
            label: '转入账号'
          },
          {
            type: 'input',
            prop: 'userOut',
            label: '转出账号'
          },
          {
            type: 'select',
            prop: 'transType',
            label: '转账类型',
            options: type
          },
          {
            type: 'select',
            prop: 'remarks',
            label: '明细',
            options: detail
          },
          {
            type: 'select',
            prop: 'status',
            label: '状态',
            options: status
          },
          {
            type: 'date',
            prop: ['sDate', 'eDate'],
            label: '创建时间'
          }
        ],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          }, {
            label: '转入账号',
            prop: 'userIn',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '转出账号',
            prop: 'userOut',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '转账金额',
            prop: 'amount',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '转账类型',
            prop: 'transType',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'transType-column'
          },
          {
            label: '明细',
            prop: 'userInfo',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'status-column'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '审核时间',
            prop: 'confirmTime',
            align: 'center',
            minWidth: '10%',
            visible: true,
            render(row) {
              return row.confirmTime === 'None' ? '-' : row.confirmTime;
            }
          },
          {
            label: '审核人',
            prop: 'confirmUser',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '备注',
            prop: 'mark',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          }
        ],
        data: [],
        checked: [],
        // 审核和拒绝
        confirmType: 0,
        confirmVisible: false,
      };
    },
    computed: {
      message: function() {
        return this.confirmType ? '确认拒绝通过该记录吗？确认后将拒绝转账' : '确认审核通过该记录吗？确认后将完成转账';
      }
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
        } = await this.$api.getOperateMoney(listQuery);
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
      handleAudit(index) {
        this.confirmType = index;
        this.confirmVisible = true;
      },
      async sureConfirm() {
        const { account, billno, transType } = this.checked[0];
        const formData = {
          username: account,
          issue: billno,
          transType
        };
        const { error } = this.confirmType ? await this.$api.operateRefuse(formData) : await this.$api.operateConfirm(formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.confirmVisible = false;
      }
    }
  };
</script>