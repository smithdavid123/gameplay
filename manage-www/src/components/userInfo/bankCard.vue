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
          @click="checkValidate() && (confirmVisible = true)"
        >
          <svg-icon icon-class="edit" />删除
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
        height="calc(60vh)"
        @selection-change="checked = $event"
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
        确认删除该银行卡吗?
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn"
          @click="sureDelete"
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
          username: this.userItem.username
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '会员名称',
          readonly: true
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
            label: '开户名',
            prop: 'cardholder',
            align: 'center',
            minWidth: '10%',
            visible: true
          }, {
            label: '银行卡号',
            prop: 'bankCardNo',
            align: 'center',
            minWidth: '15%',
            visible: true
          }, {
            label: '银行名称',
            prop: 'bankName',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '省',
            prop: 'bankProvince',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '市',
            prop: 'bankCity',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '支行名称',
            prop: 'bankDeposit',
            align: 'center',
            minWidth: '10%',
            visible: true
          }, {
            label: '创建时间',
            prop: 'createDate',
            align: 'left',
            visible: true,
            minWidth: '10%'
          }],
        data: [],
        // 删除
        checked: [],
        confirmVisible: false,
      };
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
        } = await this.$api.getUserBankcard(this.listQuery);
        this.data = data;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      // 删除银行卡
      async sureDelete() {
        try {
          const { error } = await this.$api.delUserBankcard({id: this.checked[0].bankId, bankCardNo: this.checked[0].bankCardNo});
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