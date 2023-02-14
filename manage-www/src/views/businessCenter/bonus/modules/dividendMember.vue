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
          slot="status-column"
          slot-scope="{row}"
        >
          <div :class="row.status | formatterDividendStatusTagClass">
            {{ row.status | formatterDividendStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`契约分红-${handleType?'编辑':'新增'}`"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            v-if="handleType"
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="140px"
          >
            <template slot="add-column">
              <div class="fr mb10">
                <div
                  class="primary-btn"
                  @click="addExtraRulesItem"
                >
                  添加
                </div>
              </div>
            </template>
            <template
              slot="extraRules-column"
              slot-scope="{formData, item}"
            >
              <table-page
                ref="paraentTable"
                :data="formData[item.prop]"
                :columns="formTableColumns"
                :hidden-pagination="true"
              >
                <template
                  slot="totalConsume-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.totalConsume"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="totalLoss-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.totalLoss"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="activeUser-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.activeUser"
                    auto-complete="off"
                  />
                </template>
                <template
                  slot="scalePoint-column"
                  slot-scope="{row}"
                >
                  <el-input
                    v-model.number="row.scalePoint"
                    auto-complete="off"
                  />
                </template>
              </table-page>
            </template>
          </json-form>
          <json-form
            v-else
            ref="jsonForm"
            :form="addForm"
            :columns="addFormColumns"
            label-width="140px"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          v-if="handleType"
          class="primary-btn small-btn"
          @click="sureAdd"
        >
          保存
        </div>
        <div
          v-else
          class="primary-btn small-btn"
          @click="sureSearch"
        >
          确定
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
  import {
    status
  } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        request: false,
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          parent: '',
          limit1: '',
          limit2: '',
          status: '',
          withPlatform: 0
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '契约用户'
        }, {
          type: 'input',
          prop: 'parent',
          label: '契约上级'
        }, {
          type: 'check',
          prop: 'withPlatform',
          label: '只显示平台',
          flag: true
        }, {
          type: 'select',
          prop: 'status',
          label: '状态',
          options: status
        }, {
          type: 'input',
          prop: 'limit1',
          label: '分红比例大于'
        }, {
          type: 'input',
          prop: 'limit2',
          label: '分红比例小于'
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '契约用户',
          prop: 'uSecond',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '契约上级',
          prop: 'parent',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render(row) {
            return row.parent ? row.parent : '平台';
          }
        }, {
          label: '分红比例',
          prop: 'scalePoint',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render(row) {
            return row.scalePoint ? `${row.scalePoint}%` : '-';
          }
        }, {
          label: '活跃用户',
          prop: 'activeUser',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '额外比例',
          prop: 'extraRules',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render(row) {
            const data = JSON.parse(row.extraRules);
            return !data.length ? '-' : data.length === 1 ? `${data[0].scalePoint}%~${data[0].scalePoint}%` : `${data[0].scalePoint}%~${data[data.length - 1].scalePoint}%`;
          }
        }, {
          label: '状态',
          prop: 'status',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'status-column'
        }],
        data: [],
        // 操作
        checked: [],
        step: 1,
        // 新增
        handleType: 0,
        addVisible: false,
        addForm: {
          username: ''
        },
        addFormColumns: [{
          type: 'input',
          label: '会员名称',
          prop: 'username',
          placeholder: '必填',
          rules: [{
            required: true,
            message: '请输入会员名称',
            trigger: 'blur'
          }]
        }],
        form: {
          id: -1,
          username: '',
          parent: '',
          accountFrom: '',
          accountTo: '',
          activeUser: '',
          scalePoint: '',
          extraRules: []
        },
        formColumns: [{
            type: 'input',
            label: '契约用户',
            prop: 'username',
            placeholder: '必填',
            disabled: true
          }, {
            type: 'input',
            label: '契约上级',
            prop: 'parent',
            disabled: true
          }, {
            type: 'input',
            label: '活跃用户',
            prop: 'activeUser'
          }, {
            type: 'input',
            label: '分红比例',
            prop: 'scalePoint'
          },
          {
            type: 'handle',
            label: '添加',
            slotName: 'add-column'
          }, {
            label: '额外配置',
            prop: 'extraRules',
            slotName: 'extraRules-column'
          }
        ],
        formTableColumns: [{
            label: '周期消费(万)',
            prop: 'totalConsume',
            align: 'left',
            minWidth: '25%',
            visible: true,
            slotName: 'totalConsume-column'
          },
          {
            label: '周期亏损(万)',
            prop: 'totalLoss',
            align: 'left',
            minWidth: '25%',
            visible: true,
            slotName: 'totalLoss-column'
          },
          {
            label: '活跃用户',
            prop: 'activeUser',
            align: 'left',
            minWidth: '25%',
            visible: true,
            slotName: 'activeUser-column'
          },
          {
            label: '分红比例(%)',
            prop: 'scalePoint	',
            align: 'left',
            minWidth: '25%',
            visible: true,
            slotName: 'scalePoint-column'
          }
        ],
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
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.getDividendList(listQuery);
        const {
          list,
          totalCount
        } = data;
        this.data = list;
        this.total = totalCount;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.listQuery.page = 1;
        this.getList();
      },
      // 添加一条额外配置
      addExtraRulesItem() {
        this.form.extraRules.push({
          totalConsume: 0,
          scalePoint: 0,
          activeUser: 0,
          totalLoss: 0
        });
      },
      // 新增
      handleAdd() {
        this.step = 1;
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
          this.form = this.$options.data().form;
          this.addForm.username = '';
          this.$refs.jsonForm.clearValidate();
        });
      },
      // 编辑记录
      handleEdit() {
        this.step = 2;
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          this.form.id = this.checked[0].id;
          this.form.username = this.checked[0].uSecond;
          this.form.parent = this.checked[0].parent;
          this.form.accountFrom = this.checked[0].accountFrom;
          this.form.accountTo = this.checked[0].accountTo;
          this.form.activeUser = this.checked[0].activeUser;
          this.form.scalePoint = this.checked[0].scalePoint;
          this.form.extraRules = JSON.parse(this.checked[0].extraRules);
        });
      },
      // 提交
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          const {
            extraRules,
            ...formData
          } = this.form;
          formData.extraRules = JSON.stringify(extraRules);
          const {
            error
          } = await this.$api.setDividend(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 查询用户
      sureSearch() {
        this.$refs.jsonForm.validate(async _ => {
          const data = await this.$api.preAddDividend(this.addForm);
          if (typeof data === 'string') {
            this.$message.error(data);
          } else {
            !data.error && this.$message('提交成功');
            this.getList();
            this.addVisible = false;
          }
        });
      },
      // 删除记录
      async sureRemove() {
        const {
          error
        } = await this.$api.delDividend({
          id: this.checked[0].id
        });
        !error && this.$message.success('删除成功');
        this.getList();
        this.removeVisible = false;
      }
    }
  };
</script>