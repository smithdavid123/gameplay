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
          <svg-icon icon-class="check-square" />添加
        </div>
        <div
          class="primary-btn"
          @click="fastUpdate()"
        >
          <svg-icon icon-class="check-square" />快捷修改
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleStart()"
        >
          <svg-icon icon-class="check-square" />启用
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleStop()"
        >
          <svg-icon icon-class="check-square" />停用
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleRemove()"
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
          slot="enableFlag-column"
          slot-scope="{row}"
        >
          <div :class="[row.enableFlag > 0 ? 'tag-blue' : 'tag-red']">
            {{ row.enableFlag > 0 ? '启用' : '禁用' }}
          </div>
        </template>
        <template
          slot="type-column"
          slot-scope="{row}"
        >
          <div :class="['tag-gray', 'tag-green'][row.type]">
            {{ ['前台用户', '后台用户'][row.type] }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="用户ip列表-添加用户"
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
      title="信息"
      :visible.sync="editVisible"
      width="360px"
      top="40vh"
    >
      <div>
        <el-input
          v-model.trim="ip"
          auto-complete="off"
          placeholder="请输入ip地址"
        />
      </div>
      <div
        slot="footer"
        class="dialog-footer ta"
      >
        <div
          class="primary-btn small-btn"
          @click="sureEdit"
        >
          修改选择的用户
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
  </div>
</template>
<script>
  import {
    enableFlag
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          memberName: '',
          enableFlag: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'memberName',
            label: '用户名'
          },
          {
            type: 'select',
            prop: 'enableFlag',
            label: '状态',
            allName: '请选择',
            options: enableFlag
          }
        ],
        tableColumns: [{
            label: '用户名',
            prop: 'map.memberName',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '加盟商',
            prop: 'map.leagueName',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: 'ip名单',
            prop: 'whiteIps',
            class: 'fineText',
            width: '400px',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '用户类型',
            prop: 'type',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false,
            slotName: 'type-column'
          },
          {
            label: '状态',
            prop: 'enableFlag',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'enableFlag-column'
          }
        ],
        data: [],
        checked: [],
        // 添加
        addVisible: false,
        form: {
          memberName: ''
        },
        formColumns :[{
          type: 'input',
          label: '用户名称',
          prop: 'memberName',
          placeholder: '请输入用户名称'
        }],
        // 编辑
        editVisible: false,
        ip: '',
        // 删除
        removeVisible: false
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
      handleAdd() {
        this.addVisible = true;
      },
      sureAdd() {
        //  to do
      },
      fastUpdate() {
        this.editVisible = true;
      },
      sureEdit() {
        //  to do
      },
      handleStart() {
        // let ids = getGridIds();
        // if (!ids) {
        //   return false;
        // }
        // ajaxPost('start', {ids : ids});
      },
      handleStop() {
        // let ids = getGridIds();
        // if (!ids) {
        //   return false;
        // }
        // ajaxPost('stop', {ids : ids});
      },
      handleRemove() {
        this.removeVisible = true;
      },
      sureRemove() {
        //  to do
      }
    }
  };
</script>