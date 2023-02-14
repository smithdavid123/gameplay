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
      />
    </div>
    <el-dialog
      v-drag-dialog
      title="黑名单列表-新增"
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
              slot="ip-column"
              slot-scope="{formData, item}"
            >
              <div class="form-handle-slot">
                <div class="form-handle-slot-title mb4">
                  备注
                </div>
                <el-input
                  v-model.trim="formData[item.prop]"
                  type="textarea"
                  placeholder="IP列表"
                  :rows="6"
                />
              </div>
            </template>
            <template
              slot="remark-column"
              slot-scope="{formData, item}"
            >
              <div class="form-handle-slot">
                <div class="form-handle-slot-title mb4">
                  备注
                </div>
                <el-input
                  v-model.trim="formData[item.prop]"
                  type="textarea"
                  placeholder="备注"
                  :rows="6"
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
    blackType
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
          ip: '',
          memberName: '',
          type: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'ip',
          label: '黑名单IP'
        }, {
          type: 'input',
          prop: 'memberName',
          label: '会员名称',
          placeholder: '会员名称，支持模糊查询'
        }, {
          type: 'select',
          prop: 'type',
          label: '类型',
          allName: '请选择',
          options: blackType
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
            label: '类型',
            prop: 'type',
            align: 'left',
            valign: 'middle',
            minWidth: '20%',
            visible: true,
            filter: 'formatterBlackType'
          },
          {
            label: '备注',
            prop: 'remark',
            align: 'left',
            valign: 'middle',
            minWidth: '20%',
            visible: true
          },
          {
            label: 'IP',
            prop: 'ip',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '会员名称',
            prop: 'memberName',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: 'IP归属地',
            prop: 'ipAddress',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '银行卡号',
            prop: 'bankcardNumber',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '创建者',
            prop: 'createUser',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '创建时间',
            prop: 'createDate',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            render: row => {
              return this.$format(row.createDate, 'yyyy-MM-dd HH:mm:ss');
            }
          }
        ],
        data: [{
          map: {},
          id: 121,
          ip: '',
          ipAddress: '',
          memberName: '谭美',
          bankcardNumber: '6212262408004889054',
          remark: '盗号永久拉黑',
          createDate: 1573089068000,
          createUser: 'jjadmin',
          type: 5,
          leagueCode: 'jj138'
        }],
        checked: [],
        // 添加
        addVisible: false,
        form: {
          type: 1,
          ip: '',
          remark: ''
        },
        formColumns :[{
          type: 'select',
          label: '黑名单类型',
          prop: 'type',
          options: blackType
        }, {
          type: 'handle',
          label: 'IP',
          prop: 'ip',
          slotName: 'ip-column'
        },{
          type: 'handle',
          label: '备注',
          prop: 'remark',
          slotName: 'remark-column'
        },],
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
        // to do
      },
      handleRemove() {
        this.removeVisible = true;
      },
      sureRemove() {
        // to do
      }
    }
  };
</script>