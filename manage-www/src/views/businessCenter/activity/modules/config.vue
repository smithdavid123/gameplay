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
          @click="checkValidate() && handleRun(0)"
        >
          <svg-icon icon-class="edit" />启用
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleRun(1)"
        >
          <svg-icon icon-class="edit" />停用
        </div>
        <div
          v-permission:3="{ fn: handleRemove, args: 'delActivity', validate: checkValidate }"
          class="primary-btn"
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
        :page.sync="listQuery.page"
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="actType-column"
          slot-scope="{row}"
        >
          <div
            class="tag-aqua"
          >
            {{ row.aType | formatterActType }}
          </div>
        </template>
        <template
          slot="actStatus-column"
          slot-scope="{row}"
        >
          <div
            class="tag-aqua"
          >
            {{ row.status | formatterPlushType }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`活动配置-${handleType?'编辑':'新增'}`"
      :visible.sync="addVisible"
      width="66%"
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
              slot="add-column"
            >
              <div class="fr mb10">
                <div
                  class="primary-btn"
                  @click="addItem"
                >
                  添加
                </div>
              </div>
            </template>
            <template
              slot="actRules-column"
              slot-scope="{formData, item}"
            >
              <table-page
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
                    v-model="row.proportionDiscount"
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
  import { actType, actStatus } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          name: '',
          type: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'name',
          label: '活动名称'
        },{
          type: 'select',
          prop: 'type',
          label: '活动类型',
          options: actType
        }],
        actType,
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '活动名称',
          prop: 'name',
          align: 'left',
          minWidth: '10%',
          visible: true
        }, {
          label: '类型',
          prop: 'aType',
          align: 'center',
          visible: true,
          minWidth: '6%',
          slotName: 'actType-column'
        }, {
          label: '活动规则',
          prop: 'content',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render(row) {
            return JSON.parse(row.content).map(item=> {
              return item.join();
            }).join(' | ');
          }
        }, {
          label: '状态',
          prop: 'status',
          align: 'center',
          visible: true,
          minWidth: '6%',
          slotName: 'actStatus-column'
        }, {
          label: '开始时间',
          prop: 'beginTime',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '结束时间',
          prop: 'endTime',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }],
        data: [],
        // 操作
        checked: [],
        addVisible: false,
        handleType: 0,
        form: {
          id: -1,
          name: '',
          aType: 'a9',
          status: 0,
          beginTime: [],
          actRules: [{
            depositMoney: '',
            proportionDiscount: '',
            singleDiscountMax: '',
            fixedDiscount: '',
            flowMultiple: ''
          }]
        },
        formColumns: [{
          type: 'input',
          label: '活动名称',
          prop: 'name',
          placeholder: '必填'
        }, {
          type: 'select',
          label: '类型',
          prop: 'aType',
          options: actType
        }, {
          type: 'select',
          label: '是否发布',
          prop: 'status',
          options: actStatus
        }, {
          type: 'daterange',
          label: '时间周期',
          prop: 'beginTime'
        }, {
            type: 'handle',
            label: '添加',
            slotName: 'add-column'
          }, {
          label: '活动规则',
          prop: 'actRules',
          slotName: 'actRules-column'
        }],
        formTableColumns: [{
          label: '存款金额',
          prop: 'depositMoney',
          align: 'left',
          minWidth: '20%',
          visible: true,
          slotName: 'depositMoney-column'
        }, {
          label: '比例优惠(10%请输0.1)',
          prop: 'proportionDiscount',
          align: 'left',
          minWidth: '20%',
          visible: true,
          slotName: 'proportionDiscount-column'
        }, {
          label: '单笔优惠上限',
          prop: 'singleDiscountMax',
          align: 'left',
          minWidth: '20%',
          visible: true,
          slotName: 'singleDiscountMax-column'
        }, {
          label: '固定优惠',
          prop: 'fixedDiscount',
          align: 'left',
          minWidth: '20%',
          visible: true,
          slotName: 'fixedDiscount-column'
        }, {
          label: '流水倍数(不含彩票)',
          prop: 'flowMultiple',
          align: 'left',
          minWidth: '20%',
          visible: true,
          slotName: 'flowMultiple-column'
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
        } = await this.$api.listActivityConf(listQuery);
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
        this.addVisible = true;
        this.$nextTick(() => {
          this.form = this.$options.data().form;
        });
      },
      // 编辑
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          this.form.id = this.checked[0].id;
          this.form.name = this.checked[0].name;
          this.form.aType = this.checked[0].aType;
          this.form.status = this.checked[0].status;
          this.form.beginTime = [this.checked[0].beginTime, this.checked[0].endTime];
          this.form.actRules = JSON.parse(this.checked[0].content).map(item=> {
            return {
              depositMoney: item[0],
              proportionDiscount:  item[1],
              singleDiscountMax:  item[2],
              fixedDiscount:  item[3],
              flowMultiple:  item[4]
            };
          });
        });
      },
      // 启用
      async handleRun(flag) {
        if (this.checked[0].status === flag) return false;
        const { status, content, ...formData } = this.checked[0];
        formData.status = 1 - this.checked[0].status;
        formData.content = JSON.parse(content);
        const { error } = await this.$api.saveActivity({content: JSON.stringify(formData)});
        !error && this.$message.success('提交成功');
        this.getList();
      },
      // 确认
      async sureEdit() {
        const { beginTime, actRules, ...formData} = this.form;
        formData.beginTime = beginTime[0];
        formData.endTime = beginTime[1];
        formData.content = actRules.map(item=> {
          return [item.depositMoney, item.proportionDiscount - 0, item.singleDiscountMax, item.fixedDiscount, item.flowMultiple];
        });
        const { error } = await this.$api.saveActivity({content: JSON.stringify(formData)});
        !error && this.$message.success('提交成功');
        this.getList();
        this.addVisible = false;
      },
      addItem() {
        this.form.actRules.push({
            depositMoney: '',
            proportionDiscount: '',
            singleDiscountMax: '',
            fixedDiscount: '',
            flowMultiple: ''
          });
      }
    }
  };
</script>