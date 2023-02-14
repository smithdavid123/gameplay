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
          @click="checkValidate() && handleUpdate()"
        >
          <svg-icon icon-class="edit" />编辑
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && upOrDown()"
        >
          <svg-icon icon-class="edit" />上下架
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
        row-key="id"
        :hidden-pagination="true"
        height="calc(100vh - 244px)"
        @selection-change="checked = $event"
      >
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            v-if="row.type"
            :class="['tag-red', 'tag-green', 'tag-orange'][1-row.status]"
          >
            {{ ['维护中', '运行中', '内测中'][1 - row.status] }}
          </div>
          <span v-else>-</span>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="单挑模式-编辑"
      :visible.sync="editVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="100px"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="updateData"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="editVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      width="300px"
      top="40vh"
    >
      <p v-if="confirmVisible">
        确认{{ checked[0].status > 0 ? '上架' : '下架' }}{{ checked[0].name }}吗?
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="updateStatus"
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
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: true,
        listQuery: {
          lotteryCode: ''
        },
        queryColumns: [{
          type: 'select',
          prop: 'lotteryCode',
          label: '彩种分类',
          noAll: true,
          options: []
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '玩法类型',
            prop: 'name',
            align: 'left',
            minWidth: '40%',
            visible: true
          },
          {
            label: '注数（≤）',
            prop: 'maxRecord',
            align: 'center',
            minWidth: '20%',
            visible: true
          },
          {
            label: '编码',
            prop: 'methodName',
            align: 'center',
            minWidth: '20%',
            visible: true
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            minWidth: '20%',
            visible: true,
            slotName: 'status-column'
          }
        ],
        data: [],
        // 编辑记录
        checked: [],
        editVisible: false,
        form: {
          name: '',
          maxRecord: ''
        },
        formColumns: [{
            type: 'input',
            label: '玩法类型',
            prop: 'name',
            readonly: true
          },
          {
            type: 'input',
            label: '注数',
            prop: 'maxRecord',
            placeholder: '必填',
            rules: [{
              required: true,
              message: '请输入注数',
              trigger: 'blur'
            }]
          }
        ],
        // 修改状态
        confirmVisible: false
      };
    },
    created() {
      this.getCategoryList();
    },
    methods: {
      // 获取彩种分类
      async getCategoryList() {
        const {
          data
        } = await this.$api.lotteryCategoryList();
        this.queryColumns[0].options = data.map((item, index)=> {
          !index && (this.listQuery.lotteryCode = item.code, this.getList());
          return {
            label: item.name,
            value: item.code
          };
        });
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.onetooneList(this.listQuery);
        this.data = data.map((item, index)=> {
          return {
            name: item.groupName,
            id: index - 100,
            children: item.data
          };
        });
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      // 编辑记录
      handleUpdate() {
        if (this.checked[0].type) {
          this.editVisible = true;
          this.$nextTick(() => {
            this.$refs.jsonForm.clearValidate();
            this.form.name = this.checked[0].name;
            this.form.maxRecord = this.checked[0].maxRecord;
          });
        }
      },
      // 确认修改全部返点
      updateData() {
        this.$refs.jsonForm.validate(async _ => {
          const formData = {method: this.checked[0].methodName,type: this.checked[0].type,maxRecord: this.form.maxRecord};
          const { error } = await this.$api.setMethodLimit(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
        });
      },
      // 上下架
      upOrDown() {
        this.checked[0].type && (this.confirmVisible = true);
      },
      // 确认上下架
      async updateStatus () {
        const {
          error
        } = await this.$api.setMethodStatus({method: this.checked[0].methodName, type: this.checked[0].type, status: 1 - this.checked[0].status });
        !error && this.$message.success('提交成功');
        this.getList();
        this.confirmVisible = false;
      }
    }
  };
</script>