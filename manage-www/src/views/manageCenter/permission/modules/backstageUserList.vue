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
          <svg-icon icon-class="check-square" />增加
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleEdit()"
        >
          <svg-icon icon-class="check-square" />修改
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && (removeVisible = true)"
        >
          <svg-icon icon-class="check-square" />删除
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleAuth()"
        >
          <svg-icon icon-class="check-square" />权限
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
          slot="level-column"
          slot-scope="{row}"
        >
          <div class="tag-aqua">
            {{ row.level | formatterAccountType }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div :class="[row.status > 0 ? 'tag-red' : 'tag-blue']">
            {{ row.status > 0 ? '禁用' : '启用' }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="后台账户-新增"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="addForm"
            :columns="addFormColumns"
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
      title="后台账户-编辑"
      :visible.sync="editVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="editForm"
            :columns="editFormColumns"
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
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="removeVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="后台账号管理-权限设定"
      :visible.sync="authVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="authForm"
            :columns="authFormColumns"
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
          @click="sureAuth"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="authVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    roleId,
    status
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        listQuery: {
          username: '',
          level: '',
          status: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'username',
            label: '用户名'
          },
          {
            type: 'select',
            prop: 'level',
            label: '权限',
            allName: '请选择',
            options: roleId
          },
          {
            type: 'select',
            prop: 'status',
            label: '状态',
            allName: '请选择',
            options: status
          }
        ],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '用户名',
            prop: 'username',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '角色',
            prop: 'level',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'level-column'
          },
          {
            label: '姓名',
            prop: 'realName',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '联系电话',
            prop: 'tel',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '创建人',
            prop: 'parentName',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '创建时间',
            prop: 'registTime',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '状态',
            prop: 'status',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'status-column'
          }
        ],
        data: [],
        checked: [],
        // 添加
        addVisible: false,
        addForm: {
          username: '',
          pw: '',
          type: 6,
          tel: '',
          status: 0
        },
        addFormColumns: [{
            type: 'input',
            label: '用户名',
            prop: 'username',
            placeholder: '必填'
          },{
            type: 'input',
            label: '登录密码',
            prop: 'pw',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '联系电话',
            prop: 'tel'
          },
          {
            type: 'select',
            label: '状态',
            prop: 'status',
            options: status
          }],
        // 编辑
        editVisible: false,
        editForm: {
          username: '',
          pw: '',
          tel: '',
          rn: '',
          level: 3,
          status: 0,
        },
        editFormColumns: [{
            type: 'input',
            label: '用户名',
            prop: 'username',
            placeholder: '必填',
            readonly: true
          },
          {
            type: 'input',
            label: '密码',
            prop: 'pw',
            attr: 'password'
          },
          {
            type: 'input',
            label: '姓名',
            prop: 'rn'
          },
          {
            type: 'input',
            label: '联系电话',
            prop: 'tel'
          },
          {
            type: 'select',
            label: '状态',
            prop: 'status',
            options: status
          }
        ],
        // 删除
        removeVisible: false,
        // 角色分配
        authVisible: false,
        authForm: {
          username: '',
          level: ''
        },
        authFormColumns: [{
            type: 'input',
            label: '用户名',
            prop: 'username',
            readonly: true
          },
          {
            type: 'select',
            label: '权限',
            prop: 'level',
            options: roleId
          }
        ],
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
        } = await this.$api.listAccountAdm(this.listQuery);
        this.data = data;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      handleAdd() {
        this.addVisible = true;
        this.$nextTick(() => {
            this.addForm = this.$options.data().addForm;
        });
      },
      // 提交
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          const { error } = await this.$api.accountCreate(this.addForm);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 编辑记录
      handleEdit() {
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          const data = this.checked[0];
          this.editForm.username = data.username;
          this.editForm.tel = data.tel;
          this.editForm.rn = data.realName;
          this.editForm.status = data.status;
          this.editForm.level = data.level;
          this.editForm.pw = '';
        });
      },
      // 提交
      sureEdit() {
        this.$refs.jsonForm.validate(async _ => {
          const { error } = await this.$api.accountChange(this.editForm);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
        });
      },
      handleAuth() {
        this.authVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          const data = this.checked[0];
          this.authForm.username = data.username;
          this.authForm.level = data.level;
        });
      },
      // 修改权限
      async sureAuth() {
        const { error } = await this.$api.setAccountPower(this.authForm);
        !error && this.$message.success('提交成功');
          this.getList();
          this.authVisible = false;
      },
      // 删除记录
      async sureRemove() {
        const { error } = await this.$api.accountRemove({ username: this.checked[0].username });
        !error && this.$message.success('删除成功');
          this.getList();
          this.removeVisible = false;
      }
    }
  };
</script>