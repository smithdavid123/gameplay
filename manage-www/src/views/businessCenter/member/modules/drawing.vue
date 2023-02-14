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
          @click="handleAdd()"
        >
          <svg-icon icon-class="edit" />增加
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleEdit()"
        >
          <svg-icon icon-class="edit" />编辑
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
        @selection-change="checked = $event"
        @pagination="getList"
      />
    </div>
    <el-dialog
      v-drag-dialog
      :title="`流水限制-${handleType?'编辑':'新增'}`"
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
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '用户名称'
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          prop: 'username',
          label: '用户名称',
          minWidth: '33%',
          align: 'center',
          visible: true
        },{
          prop: 'amount',
          label: '所需流水金额(元)',
          minWidth: '33%',
          visible: true,
          align: 'center'
        },{
          prop: 'beginTime',
          label: '报表开始查询时间',
          minWidth: '33%',
          align: 'center',
          visible: true
        }],
        data: [],
        checked: [],
        handleType: 0,
        editVisible: false,
        form: {
          id: -1,
          username: '',
          amount: '',
          beginTime: '',
          mark: ''
        },
        formColumns: [{
          type: 'input',
          label: '用户名称',
          prop: 'username',
          placeholder: '必填'
        }, {
          type: 'input',
          label: '所需流水金额',
          prop: 'amount',
          placeholder: '必填'
        },{
          type: 'datetime',
          label: '报表开始查询时间',
          prop: 'beginTime',
          placeholder: '必填'
        },{
          type: 'textarea',
          label: '备注',
          prop: 'mark'
        }]
      };
    },
    created() {
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
        } = await this.$api.listListConsume(listQuery);
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
      // 新增
      handleAdd() {
        this.handleType = 0;
        this.editVisible = true;
        this.$nextTick(() => {
          this.form = this.$options.data().form;
          this.$refs.jsonForm.clearValidate();
        });
      },
      // 编辑
      handleEdit() {
        this.handleType = 1;
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
          Object.keys(this.form).forEach(key=> {
            this.form[key] = this.checked[0][key];
          });
        });
      },
      // 确认编辑
      sureEdit() {
        this.$refs.jsonForm.validate(async _ => {
          const {
            error
          } = await this.$api.setListConsume(this.form);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
        });
      }
    }
  };
</script>