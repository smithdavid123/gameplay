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
        <div
          class="primary-btn"
          @click="checkValidate() && (removeVisible = true)"
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
        :page.sync="listQuery.page"
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="allowEqualCode-column"
          slot-scope="{row}"
        >
          <div
            :class="[row.allowEqualCode ? 'tag-green' : 'tag-red' ]"
          >
            {{ row.allowEqualCode ? '允许' : '不允许' }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`契约分红用户组-${handleType?'编辑':'新增'}`"
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
          >
            <template
              slot="actRules-column"
              slot-scope="{formData, item}"
            >
              <table-page
                ref="paraentTable"
                :data="formData[item.prop]"
                :columns="formTableColumns"
                :hidden-pagination="true"
              >
                <template
                  slot="depositMoney-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.depositMoney"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="proportionDiscount-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.proportionDiscount"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="singleDiscountMax-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.singleDiscountMax"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="fixedDiscount-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.fixedDiscount"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="flowMultiple-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.flowMultiple"
                    auto-complete="off"
                  />
                </template>
              </table-page>
            </template>
          </json-form>
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="sureAdd"
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
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="removeVisible"
      width="360px"
      top="40vh"
    >
      <p>确认删除此数据?</p>
      <div
        slot="footer"
        class="dialog-footer ta"
      >
        <div
          class="primary-btn small-btn"
          @click="sureRemove"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="removeVisible = false"
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
        total: 0,
        listQuery: {
          page: 1,
          groupName: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'groupName',
          label: '用户组名称'
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '唯一编码',
            prop: 'code',
            align: 'left',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '用户组名称',
            prop: 'name',
            align: 'left',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '级别',
            prop: 'level',
            align: 'left',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '最低奖级',
            prop: 'pointLimit1',
            align: 'left',
            visible: true,
            minWidth: '10%',
          },
          {
            label: '最高奖级',
            prop: 'pointLimit2',
            align: 'left',
            visible: true,
            minWidth: '10%',
          },
          {
            label: '下级配额',
            prop: 'agent',
            align: 'left',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '允许平级开号',
            prop: 'allowEqualCode',
            align: 'left',
            visible: true,
            minWidth: '10%',
            slotName: 'allowEqualCode-column'
          }],
        data: [],
        // 操作
        checked: [],
        addVisible: false,
        handleType: 0,
        form: {
          id: -1,
          code: '',
          name: '',
          level: '',
          pointLimit1: '',
          pointLimit2: '',
          agent: '',
          allowEqualCode: 1
        },
        formColumns: [{
            type: 'input',
            label: '唯一编码',
            prop: 'code',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '用户组名称',
            prop: 'name',
            placeholder: '必填'
          },
          {
            type: 'number',
            label: '级别',
            prop: 'level',
            placeholder: '必填'
          },
          {
            type: 'number',
            label: '最低奖级',
            prop: 'pointLimit1',
            placeholder: '必填'
          },
          {
            type: 'number',
            label: '最高奖级',
            prop: 'pointLimit2',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '下级配额 ',
            prop: 'agent',
            placeholder: '必填'
          },
          {
            type: 'radio',
            label: '允许平级开号 ',
            prop: 'allowEqualCode',
            options: [{
              label: '允许',
              value: 1
            },{
              label: '不允许',
              value: 0
            }]
          }],
        // 删除
        removeVisible: false
      };
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
        } = await this.$api.getUserGroup();
        this.data = data;
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
            this.form = this.$options.data().form;
        });
      },
      // 编辑记录
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          this.form = {...this.checked[0]};
        });
      },
      // 提交
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          const { error } = await this.$api.addUserGroup(this.form);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 删除记录
      async sureRemove() {
        const { error } = await this.$api.delUserGroup({ id: this.checked[0].id});
        !error && this.$message.success('删除成功');
          this.getList();
          this.removeVisible = false;
      }
    }
  };
</script>