<template>
  <div>
    <div class="module-query">
      <div />
      <SearchBtn
        class="mb10"
        :query.sync="listQuery"
      />
    </div>
    <div class="module-handle">
      <div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleUpdate()"
        >
          <svg-icon icon-class="check-square" />编辑
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
        height="calc(100vh - 230px)"
        :hidden-pagination="true"
        @selection-change="checked = $event"
      />
    </div>
    <el-dialog
      v-drag-dialog
      title="充值配置-编辑"
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
        loading: true,
        listQuery: {
          page: 1
        },
        keyList: 'RECHARGE_CASH_MIN,RECHARGE_TIME,RECHARGE_CASH_MAX',
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '配置项',
          prop: 'name',
          align: 'left',
          minWidth: '10%',
          visible: true
        }, {
          label: '配置值',
          prop: 'value',
          align: 'left',
          minWidth: '10%',
          visible: true
        }, {
          label: '说明',
          prop: 'mask',
          align: 'left',
          minWidth: '10%',
          visible: true
        }],
        data: [],
        // 编辑记录
        checked: [],
        editVisible: false,
        form: {
          name: '',
          value: ''
        },
        formColumns :[{
          type: 'input',
          label: '配置项',
          prop: 'name',
          readonly: true
        }, {
          type: 'input',
          label: '配置值',
          prop: 'value'
        }]
      };
    },
    created() {
      this.getKeyList();
    },
    methods: {
      // 获取变量列表
      async getKeyList() {
        try {
          const {
          data
        } = await this.$api.getSystemValueList({index: 0});
          this.keyList = data.join(',');
        } catch (error) {
          // to do
        }
        this.getList();
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.getSysConfig({name: this.keyList});
        this.data = Object.keys(data).map(key=> {
          return {
            name: key,
            value: data[key].value,
            mask: data[key].mark
          };
        });
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      handleUpdate() {
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
          Object.keys(this.form).forEach(key=> {
            this.form[key] = this.checked[0][key];
          });
        });
      },
      updateData() {
       this.$refs.jsonForm.validate(async _ => {
          const {
            error
          } = await this.$api.changeSysConfig(this.form);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
        });
      }
    }
  };
</script>