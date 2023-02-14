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
          @click="handleEdit(0)"
        >
          <svg-icon icon-class="edit" />人工存入
        </div>
        <div
          class="primary-btn"
          @click="handleEdit(1)"
        >
          <svg-icon icon-class="edit" />人工提出
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
      >
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.accountType | formatterMemberTypeTagClass"
          >
            {{ row.accountType | formatterMemberType }}
          </div>
        </template>
        <template
          slot="changeType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.type | formatterChangeTypeTagClass"
          >
            {{ row.type | formatterChangeType }}
          </div>
        </template>
        <template
          slot="amount-column"
          slot-scope="{row}"
        >
          <span :class="[row.balanceBefore > row.balanceAfter ? 'text-red' : 'text-green']">{{ row.balanceBefore > row.balanceAfter ? `-${row.amount}` : row.amount }}</span>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="handleType ? '账变记录-人工提出' : '账变记录-人工存入'"
      :visible.sync="editVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="140px"
          />
          <p style="margin-left: 140px; color: rgb(255, 87, 34);">
            * 提交后需要审核才能生效
          </p>
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="creatData"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="editVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import { changeType, rechargeType, withdrawType } from './options';
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
          sTime: '',
          eTime: '',
          type: '',
          issue: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '会员名称'
        }, {
          type: 'date',
          prop: ['sTime', 'eTime'],
          label: '时间'
        }, {
          type: 'select',
          prop: 'type',
          label: '账变类型',
          options: changeType
        }, {
          type: 'input',
          prop: 'issue',
          label: '订单编号'
        }],
        tableColumns: [{
            label: '用户',
            prop: 'account',
            align: 'center',
            visible: true,
            minWidth: '6%',
          }, {
            label: '用户类型',
            prop: 'accountType',
            align: 'center',
            minWidth: '6%',
            visible: true,
            slotName: 'memberType-column'
          }, {
            label: '账变类型',
            prop: 'type',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'changeType-column'
          }, {
            label: '变更前余额',
            prop: 'balanceBefore',
            align: 'center',
            visible: true,
            minWidth: '6%',
          }, {
            label: '变更后余额',
            prop: 'balanceAfter',
            align: 'center',
            visible: true,
            minWidth: '6%',
          }, {
            label: '变更金额',
            prop: 'amount',
            align: 'center',
            visible: true,
            minWidth: '10%',
            slotName: 'amount-column'
          }, {
            label: '订单编号',
            prop: 'billno',
            align: 'center',
            visible: false,
            minWidth: '10%',
          }, {
            label: '时间',
            prop: 'time',
            align: 'center',
            minWidth: '10%',
            visible: true,
            render: row=> {
              return this.$format(row.time, 'yyyy-MM-dd HH:mm:ss');
            }
          }, {
            label: '备注',
            prop: 'remarks',
            align: 'left',
            visible: true,
            minWidth: '10%'
          }],
        data: [],
        // 编辑
        handleType: 0,
        editVisible: false,
        form: {
          username: '',
          value: '',
          remark: '',
          mark: ''
        }
      };
    },
    computed: {
      formColumns: function() {
        return [{
          type: 'input',
          label: '用户名称',
          prop: 'username',
          placeholder: '必填'
        }, {
          type: 'input',
          label: this.handleType ? '调出金额' : '调入金额',
          prop: 'value',
          placeholder: '必填'
        }, {
          type: 'select',
          label: this.handleType ? '调出类型' : '调入类型',
          prop: 'remark',
          options: this.handleType ? withdrawType : rechargeType
        }, {
          type: 'textarea',
          label: '备注',
          prop: 'mark',
        }];
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
        } = await this.$api.accountChangeList(listQuery);
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
      },
      // 编辑
      handleEdit(index) {
        this.handleType = index;
        this.editVisible = true;
        this.$nextTick(_=> {
          this.$refs.jsonForm.resetValidate();
          this.form.remark = index ? 'a811tc' : 'a811cr';
        });
      },
      // 提交
      async creatData() {
        const { remark, ...formData } = this.form;
        formData.transType = this.handleType;
        formData.remark = this.handleType ? withdrawType.filter(item=> item.value === remark)[0].label : rechargeType.filter(item=> item.value === remark)[0].label;
        const {
          error
        } = await this.$api.accountChangeBalance(formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.editVisible = false;
      }
    }
  };
</script>