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
          v-permission:3="{ fn: handleAdd }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />新增
        </div>
        <div
          v-permission:3="{ fn: handleEdit, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />编辑
        </div>
        <div
          v-permission:3="{ fn: upOrDown, args: 0, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />开启
        </div>
        <div
          v-permission:3="{ fn: upOrDown, args: 1, validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />停用
        </div>
        <div
          v-permission:3="{ fn: handleRemove, args: 'delPayMethod', validate: checkValidate }"
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
        height="calc(100vh - 244px)"
        :hidden-pagination="true"
        @selection-change="checked = $event"
      >
        <template
          slot="payStatus-column"
          slot-scope="{row}"
        >
          <div :class="[row.status === 0 ? 'tag-green' : 'tag-orange']">
            {{ row.status === 0 ? '启用' : '停用' }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`支付-${handleType? '编辑' : '新增'}`"
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
            <template slot="payName-column">
              <el-select
                v-model="payName"
                placeholder="请选择"
                clearable
                style="width: 100%;"
                :disabled="!!handleType"
                @change="handleChange"
              >
                <el-option
                  v-for="select in paySource"
                  :key="select.value"
                  :label="select.label"
                  :value="select.value"
                />
              </el-select>
            </template>
            <template slot="memberLevel-column">
              <CheckBtn
                v-for="item in memberLevel"
                :key="item.label"
                :name="item.label"
                :value.sync="item.value"
              />
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
  </div>
</template>
<script>
  import {
    platform
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        listQuery: {
          payName: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'payName',
            label: '接口名称'
          }
        ],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '接口名称',
            prop: 'payMethodName',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '商户号',
            prop: 'appId',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '加密秘钥',
            prop: 'secretKey',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '加密公钥',
            prop: 'pubKey',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '绑定域名',
            prop: 'bindHost',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '出款域名',
            prop: 'outMoneyHost',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '会员分类',
            prop: 'forUsers',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '显示别名',
            prop: 'name',
            align: 'center',
            minWidth: '15%',
            visible: true
          },
          {
            label: '手续费率(%)',
            prop: 'feeRate',
            align: 'center',
            minWidth: '10%',
            visible: true,
            render(row) {
              return `${row.feeRate}%` || '-';
            }
          },
          {
            label: '单笔最低(元)',
            prop: 'minUnitRecharge',
            align: 'left',
            minWidth: '10%',
            visible: true
          },
          {
            label: '单笔最高(元)',
            prop: 'maxUnitRecharge',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '每日笔数',
            prop: 'timesDay',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '显示平台',
            prop: 'platform',
            align: 'center',
            minWidth: '10%',
            visible: true,
            filter: 'formatterPlatform'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'payStatus-column'
          },
          {
            label: '备注',
            prop: 'remark',
            align: 'center',
            minWidth: '10%',
            visible: false
          }
        ],
        data: [],
        checked: [],
        // 添加
        handleType: 0,
        addVisible: false,
        form: {
          id: -1,
          status: 0,
          paySource: '',
          method: '',
          payMethod: '',
          payMethodName: '',
          secretKey: '',
          pubKey: '',
          forUsers: '',
          platform: 0,
          appId: '',
          bindHost: '',
          name: '',
          feeRate: '',
          minUnitRecharge: '',
          maxUnitRecharge: '',
          timesDay: '',
          outMoneyHost: '',
          remark: ''
        },
        formColumns: [{
            label: '支付接口',
            slotName: 'payName-column'
          },{
            type: 'input',
            label: '加密秘钥',
            prop: 'secretKey'
          },
          {
            type: 'input',
            label: '加密公钥',
            prop: 'pubKey',
            placeholder: '需要时填写'
          },
          {
            label: '会员分类',
            prop: 'forUsers',
            slotName: 'memberLevel-column'
          },
          {
            type: 'radio',
            label: '显示平台',
            prop: 'platform',
            options: platform
          },
          {
            span: 12,
            type: 'input',
            label: '商户号',
            prop: 'appId'
          },
          {
            span: 12,
            type: 'input',
            label: '绑定域名',
            prop: 'bindHost'
          },
          {
            span: 12,
            type: 'input',
            label: '显示别名',
            prop: 'name'
          },
          {
            span: 12,
            type: 'number',
            label: '手续费率(%)',
            prop: 'feeRate'
          },
          {
            span: 12,
            type: 'number',
            label: '单笔最低(元)',
            prop: 'minUnitRecharge'
          },
          {
            span: 12,
            type: 'number',
            label: '单笔最高(元)',
            prop: 'maxUnitRecharge'
          },
          {
            span: 12,
            type: 'number',
            label: '每日笔数',
            prop: 'timesDay'
          },
          {
            span: 12,
            type: 'input',
            label: '出款域名',
            prop: 'outMoneyHost'
          },
          {
            type: 'textarea',
            label: '备注',
            prop: 'remark'
          },
        ],
        payName: '',
        paySource: [],
        memberLevel: [{
            label: 'A',
            value: 1
          },
          {
            label: 'B',
            value: 1
          },
          {
            label: 'C',
            value: 1
          },
          {
            label: 'D',
            value: 1
          },
          {
            label: 'E',
            value: 1
          },{
            label: 'F',
            value: 1
          },
          {
            label: 'G',
            value: 1
          },
          {
            label: 'H',
            value: 1
          }
        ]
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
        } = await this.$api.managePayMethod(this.listQuery);
        const {
          paySource,
          list
        } = data;
        this.paySource = paySource.map(item=> {
          return {
            label: item.value[0],
            value: JSON.stringify(item)
          };
        });
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        // to do
      },
      handleChange(val) {
        const item = JSON.parse(val);
        this.form.paySource = item.paySource;
        this.form.method = item.value[1];
        this.form.payMethod = item.value.join('-');
        this.form.payMethodName = this.form.name = item.value[0];
      },
      handleAdd() {
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
            this.form = this.$options.data().form;
            this.payName = '';
            this.memberLevel = this.$options.data().memberLevel;
        });
      },
      // 编辑公告
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          this.payName = this.checked[0].payMethodName;
          Object.keys(this.form).forEach(item => {
            if (item === 'forUsers') {
              const forUsersList = this.checked[0][item];
              this.memberLevel = this.memberLevel.map(item=> {
                item.value = 1;
                forUsersList.includes(item.label) && (item.value = 0);
                return item;
              });
            }
            this.form[item] = this.checked[0][item];
          });
        });
      },
      // 提交
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          this.form.forUsers = this.memberLevel.filter(item=> !item.value).map(item=> item.label).join(',');
          const { error } = await this.$api.savePayMethod({content: JSON.stringify(this.form)});
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 开启与停用
      async upOrDown(flag) {
        if (this.checked[0].status === flag) return false;
        const formData = {'id': this.checked[0].id, 'status': 1 - this.checked[0].status};
        const { error } = await this.$api.changePayMethodStatus(formData);
        !error && this.$message.success('提交成功');
        this.getList();
      }
    }
  };
</script>