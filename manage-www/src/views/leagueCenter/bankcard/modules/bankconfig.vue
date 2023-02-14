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
          v-permission:3="{ fn: upOrDown, args: 0, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />开启
        </div>
        <div
          v-permission:3="{ fn: upOrDown, args: 1, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />停用
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
        height="calc(100vh - 244px)"
        :hidden-pagination="true"
        @selection-change="checked = $event"
      >
        <template
          slot="state-column"
          slot-scope="{row}"
        >
          <div :class="[row.withdrawStatus > 0 ? 'tag-orange' : 'tag-green']">
            {{ row.withdrawStatus > 0 ? '停用' : '启用' }}
          </div>
        </template>
        <!-- <template
          slot="url-column"
          slot-scope="{row}"
        >
          <a
            class="link-type"
            :href="row.url"
            target="_blank"
          >{{ row.url }}</a>
        </template> -->
      </table-page>
    </div>
    <!-- <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="statusVisible"
      width="360px"
      top="40vh"
    >
      <p>{{ message }}</p>
      <div
        slot="footer"
        class="dialog-footer ta"
      >
        <div
          class="primary-btn small-btn"
          @click="sureUpdate"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="statusVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
  import {
    state
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        listQuery: {
          name: '',
          withdrawStatus: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'name',
          label: '银行名称'
        }, {
          type: 'select',
          prop: 'withdrawStatus',
          label: '状态',
          options: state
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '银行名称',
            prop: 'name',
            align: 'left',
            valign: 'middle',
            minWidth: '20%',
            visible: true
          },
          {
            label: '银行url',
            prop: 'url',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '应用位置',
            prop: 'bindCard',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            render() {
              return '充值/提现';
            }
          },
          {
            label: '状态',
            prop: 'withdrawStatus',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'state-column'
          }
        ],
        data: [],
        checked: [],
        // 更改状态
        statusVisible: false,
        handleType: 0
      };
    },
    computed: {
      message: function() {
        return this.handleType ? '确定停用该银行?' : '确定启用该银行?';
      }
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取银行列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.userBankCardList({isAll: 1});
        this.data = data.filter(item=> {
          return (this.listQuery.name === '' || item.name === this.listQuery.name) &&
            (this.listQuery.withdrawStatus === '' || item.withdrawStatus === this.listQuery.withdrawStatus);
        });
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      // 开启与停用
      async upOrDown(flag) {
        if (this.checked[0].withdrawStatus === flag) return false;
        const { withdrawStatus, ...formData } = this.checked[0];
        formData.withdrawStatus = 1 - this.checked[0].withdrawStatus;
        const { error } = await this.$api.updateUserBankCardStatus({content: JSON.stringify(formData)});
        !error && this.$message.success('提交成功');
        this.getList();
      }
    }
  };
</script>