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
          <svg-icon icon-class="check-square" />编辑
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && upOrDown(0)"
        >
          <svg-icon icon-class="check-square" />发布
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && upOrDown(1)"
        >
          <svg-icon icon-class="check-square" />取消发布
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && (removeVisible = true)"
        >
          <svg-icon icon-class="check-square" />删除
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
        @pagination="getList"
        @selection-change="checked = $event"
      >
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div :class="[row.status > 0 ? 'tag-red' : 'tag-blue']">
            {{ row.status > 0 ? '停用' : '启用' }}
          </div>
        </template>
        <template
          slot="power-column"
          slot-scope="{row}"
        >
          <div class="tag-green">
            {{ row.power | formatterNoticeType }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`系统公告-${handleType? '编辑' : '新增'}`"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="100px"
          >
            <template
              slot="content-column"
              slot-scope="{formData, item}"
            >
              <div class="form-handle-slot">
                <div class="form-handle-slot-title mb4">
                  内容
                </div>
                <VueUeditorWrap
                  v-model="formData[item.prop]"
                  :config="myConfig"
                />
              </div>
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
          class="disabled-btn small-btn ml16"
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
  import {
    publishFlag
  } from './options';
  import VueUeditorWrap from 'vue-ueditor-wrap';
  import resize from '../../../mixins';
  export default {
    components: {
      VueUeditorWrap
    },
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          title: '',
          publishFlag: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'title',
            label: '公告标题'
          },
          {
            type: 'select',
            prop: 'publishFlag',
            label: '发布状态',
            allName: '请选择',
            options: publishFlag
          }],
        myConfig: {
          UEDITOR_HOME_URL: '/UEditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 300,
          // 初始容器宽度
          initialFrameWidth: '100%',
          elementPathEnabled: false,
          wordCount: false,
          zIndex: 3000
        },
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '公告标题',
            prop: 'title',
            align: 'left',
            valign: 'middle',
            minWidth: '20%',
            visible: true
          },
          {
            label: '公告类型',
            prop: 'power',
            align: 'left',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'power-column'
          },
          {
            label: '发布状态',
            prop: 'status',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'status-column'
          },
          {
            label: '显示顺序',
            prop: 'showOrder',
            align: 'center',
            valign: 'middle',
            minWidth: '5%',
            visible: true
          },
          {
            label: '创建用户',
            prop: 'username',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '操作时间',
            prop: 'time',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          }
        ],
        data: [],
        // 新增与编辑
        checked: [],
        handleType: 0,
        addVisible: false,
        form: {
          id: -1,
          title: '',
          power: 0,
          showOrder: '',
          content: '',
          status: 0,
        },
        formColumns: [{
            type: 'input',
            label: '公告标题',
            prop: 'title',
            placeholder: '必填',
            rules: [{
              required: true,
              message: '请填写公告标题',
              trigger: 'blur'
            }]
          },
          {
            type: 'radio',
            label: '通告类型',
            prop: 'power',
            options: [{
              label: '官方公告',
              value: 0
            }, {
              label: '代理公告',
              value: 1
            }, {
              label: '专用代理',
              value: 2
            }, {
              label: '通用公告',
              value: 9
            }]
          },
          {
            type: 'input',
            label: '显示顺序',
            prop: 'showOrder'
          },
          {
            type: 'handle',
            label: '内容',
            prop: 'content',
            slotName: 'content-column'
          }
        ],
        // 删除
        removeVisible: false,
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const data = await this.$api.noticeList(this.listQuery);
        // const {
        //   count,
        //   list
        // } = data;
        this.total = data.length;
        this.data = data;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        // to do
      },
      // 添加公告
      handleAdd() {
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
            this.form = this.$options.data().form;
        });
      },
      // 编辑公告
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          Object.keys(this.form).forEach(item => {
              this.form[item] = this.checked[0][item];
          });
        });
      },
      // 提交
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          const { error } = await this.$api.addNotice(this.form);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 删除公告
      async sureRemove() {
        const { error } = await this.$api.delNotice({ id: this.checked[0].id});
        !error && this.$message.success('删除成功');
          this.getList();
          this.removeVisible = false;
      },
      // 发布与取消
      async upOrDown(flag) {
        if (this.checked[0].status === flag) return false;
        const formData = {'id': this.checked[0].id, key: 'status', 'value': 1 - this.checked[0].status};
        const { error } = await this.$api.updateStatue(formData);
        !error && this.$message.success('提交成功');
        this.getList();
      }
    }
  };
</script>