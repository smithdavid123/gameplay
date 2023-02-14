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
          @click="handleAdd"
        >
          <svg-icon icon-class="edit" />增加
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleEdit()"
        >
          <svg-icon icon-class="edit" />编辑
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleDel()"
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
        :total="total"
        height="calc(100vh - 300px)"
        :page.sync="listQuery.pageNumber"
        @selection-change="checked = $event"
        @pagination="getList"
      />
    </div>
    <el-dialog
      v-drag-dialog
      :title="`优惠活动-${handleType?'编辑':'新增'}`"
      :visible.sync="addVisible"
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
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="sureEdit"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="addVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        activeTab: 'config',
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          contSignDay: '',
          rewardPoint: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'contSignDay',
          label: '连续签到天数'
        }, {
          type: 'input',
          prop: 'rewardPoint',
          label: '奖励积分'
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '连续签到天数',
          prop: 'contSignDay',
          align: 'left',
          visible: true,
          minWidth: '50%'
        }, {
          label: '奖励积分',
          prop: 'rewardPoint',
          align: 'left',
          visible: true,
          minWidth: '50%'
        }],
        data: [{
          contSignDay: 136541,
          rewardPoint: 227447
        }],
        // 操作
        checked: [],
        addVisible: false,
        handleType: 0,
        form: {
          contSignDay: '',
          rewardPoint: ''
        },
        formColumns: [{
          type: 'input',
          label: '连续签到天数',
          prop: 'contSignDay',
          placeholder: '必填'
        }, {
          type: 'input',
          label: '奖励积分',
          prop: 'rewardPoint',
          placeholder: '必填'
        }]
      };
    },
    created() {
      // this.getList()
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.leaguelotteryList(this.listQuery);
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
        // to do
      },
      // 新增
      handleAdd() {
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 编辑
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 删除
      handleDel() {
        // to do
      },
      // 确认
      sureEdit() {
// to do
      }
    }
  };
</script>