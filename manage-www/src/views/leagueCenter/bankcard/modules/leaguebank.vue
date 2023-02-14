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
          <svg-icon icon-class="check-square" />增加
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
          v-permission:3="{ fn: handleRemove, args: 'delBankCard', validate: checkValidate }"
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
        :page.sync="listQuery.pageNumber"
        @pagination="getList"
        @selection-change="checked = $event"
      >
        <template
          slot="platform-column"
          slot-scope="{row}"
        >
          <div :class="[row.platform === 1 ? 'tag-gray' : 'tag-green']">
            {{ row.platform | formatterPlatform }}
          </div>
        </template>
        <template
          slot="isStop-column"
          slot-scope="{row}"
        >
          <div :class="['tag-blue', 'tag-red'][row.isStop]">
            {{ ['启用', '停用'][row.isStop] }}
          </div>
        </template>
        <template
          slot="payType-column"
          slot-scope="{row}"
        >
          <div class="tag-gray">
            {{ row.payType | formatterPayType }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`站点银行账号-${handleType? '编辑' : '新增'}`"
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
    type,
    displayTerminal
  } from './options';
  import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          leagueUserName: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'leagueUserName',
          label: '账户名'
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          }, {
            label: '开户银行',
            prop: 'bankName',
            align: 'left',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '开户行网点',
            prop: 'bankBranch',
            align: 'left',
            valign: 'middle',
            minWidth: '15%',
            visible: true
          },
          {
            label: '银行账号',
            prop: 'bankCardId',
            align: 'center',
            valign: 'middle',
            minWidth: '15%',
            visible: true
          },
          {
            label: '账户名',
            prop: 'bankCardName',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '会员分类',
            prop: 'forUsers',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true
          },
          {
            label: '平台显示',
            prop: 'platform',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'platform-column'
          },
          {
            label: '渠道类型',
            prop: 'payType',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'payType-column'
          },
          {
            label: '状态',
            prop: 'isStop',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
            visible: true,
            slotName: 'isStop-column'
          },
          {
            label: '备注',
            prop: 'mark',
            align: 'center',
            valign: 'middle',
            minWidth: '8%',
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
          isStop: 0,
          bankId: '',
          branch: '',
          cardName: '',
          cardId: '',
          feeRate: '',
          payType: '',
          platform: '',
          forUsers: '',
          mark: ''
        },
        formColumns: [
          {
            type: 'select',
            label: '开户银行',
            prop: 'bankId',
            options: []
          },
          {
            type: 'input',
            label: '开户行网点',
            prop: 'branch',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '银行账号',
            prop: 'cardId',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '账户名',
            prop: 'cardName',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '手续费率',
            prop: 'feeRate',
            placeholder: '必填'
          },
          {
            label: '会员分类',
            prop: 'memberLevel',
            slotName: 'memberLevel-column'
          },
          {
            type: 'select',
            label: '平台显示',
            prop: 'platform',
            options: displayTerminal
          },
          {
            type: 'select',
            label: '渠道类型',
            prop: 'payType',
            options: type
          },
          {
            type: 'textarea',
            label: '备注',
            prop: 'mark'
          }
        ],
        memberLevel: [{
          label: 'A',
          value: 1
        },{
          label: 'B',
          value: 1
        },{
          label: 'C',
          value: 1
        },{
          label: 'D',
          value: 1
        },{
          label: 'E',
          value: 1
        },{
          label: 'F',
          value: 1
        },{
          label: 'G',
          value: 1
        },{
          label: 'H',
          value: 1
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
        const {
          data
        } = await this.$api.bankCardList();
        const {
          banks,
          list
        } = data;
        this.formColumns[0].options = banks.map(item=> {
          return {
            label: item.name,
            value: item.id
          };
        });
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      handleAdd() {
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
            this.form = this.$options.data().form;
            this.memberLevel = this.$options.data().memberLevel;
        });
      },
      // 编辑记录
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          const data = this.checked[0];
          this.form.id = data.id;
          this.form.isStop = data.isStop;
          this.form.bankId = data.bankId;
          this.form.branch = data.bankBranch;
          this.form.cardName = data.bankCardName;
          this.form.cardId = data.bankCardId;
          this.form.feeRate = data.fee;
          this.form.payType = data.payType;
          this.form.platform = data.platform;
          this.form.forUsers = data.forUsers;
          this.form.mark = data.mark;
          this.memberLevel = this.memberLevel.map(item=> {
            item.value = 1;
            data.forUsers.includes(item.label) && (item.value = 0);
            return item;
          });
        });
      },
      // 提交
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          this.form.forUsers = this.memberLevel.filter(item=> !item.value).map(item=> item.label).join(',');
          const { error } = await this.$api.addBankCard(this.form);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 开启与停用
      async upOrDown(flag) {
        if (this.checked[0].isStop === flag) return false;
        const formData = {'id': this.checked[0].id, 'status': 1 - this.checked[0].isStop};
        const { error } = await this.$api.updateBankCardStatus(formData);
        !error && this.$message.success('提交成功');
        this.getList();
      }
    }
  };
</script>