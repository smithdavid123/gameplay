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
          v-permission:3="{ fn: handleRemove, args: 'delForbidUser', validate: checkValidate }"
          class="primary-btn"
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
      />
    </div>
    <el-dialog
      v-drag-dialog
      title="投注会员黑名单列表-新增"
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
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import {
    thirdParty
  } from '@/utils/options';
  export default {
    mixins: [resize],
    data() {
      return {
        lotteryList: [],
        methodList: [],
        loading: true,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          thirdParty: '',
          lottery: '',
          method: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '会员名称'
        }, {
          type: 'select',
          prop: 'thirdParty',
          label: '第三方',
          allName: '请选择',
          options: thirdParty
        }, {
          type: 'select',
          prop: 'lottery',
          label: '彩种',
          allName: '请选择',
          options: []
        }, {
          type: 'select',
          prop: 'method',
          label: '玩法',
          allName: '请选择',
          options: []
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '会员名称',
            prop: 'username',
            align: 'center',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '第三方',
            prop: 'thirdPartyName',
            align: 'center',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '彩种',
            prop: 'lottery',
            align: 'center',
            visible: true,
            minWidth: '10%'
          },
          {
            label: '玩法',
            prop: 'method',
            align: 'center',
            visible: true,
            minWidth: '10%'
          }
        ],
        data: [],
        checked: [],
        addVisible: false,
        form: {
          username: '',
          third: '',
          lottery: '',
          method: '',
          type: ''
        }
      };
    },
    computed: {
      formColumns: function () {
        if (this.form.third === 'CP138_3') {
          return [{
            type: 'input',
            label: '用户名',
            prop: 'username',
            placeholder: '必填'
          }, {
            type: 'select',
            label: '第三方名称',
            prop: 'third',
            options: thirdParty
          }, {
            type: 'select',
            label: '彩种',
            prop: 'lottery',
            options: this.queryColumns[2].options
          }, {
            type: 'select',
            label: '玩法',
            prop: 'method',
            options: []
          }];
        } else {
          return [{
            type: 'input',
            label: '用户名',
            prop: 'username',
            placeholder: '必填'
          }, {
            type: 'select',
            label: '第三方名称',
            prop: 'third',
            options: thirdParty
          }];
        }
      }
    },
    watch: {
      'listQuery.lottery'(val) {
        if (val) {
          const currentlottery = this.lotteryList.filter(item => {
            return item.lottery === val;
          })[0].type;
          this.queryColumns[3].options = this.methodList[currentlottery].map(method => {
            return {
              label: method.name,
              value: method.methodName
            };
          });
        } else {
          this.queryColumns[3].options = [];
        }
      },
      'form.lottery'(val) {
        try {
          if (val) {
            const currentlottery = this.lotteryList.filter(item => {
              return item.lottery === val;
            })[0].type;
            this.form.type = currentlottery;
            this.formColumns[3].options = this.methodList[currentlottery].map(method => {
              return {
                label: method.name,
                value: method.methodName
              };
            });
          } else {
            this.formColumns[3].options = [];
            this.form.type = '';
            this.form.method = '';
          }
        } catch (error) {

        }
      },
      'form.third'(val) {
        if (val !== 'CP138_3') {
          this.form.lottery = '';
          this.form.method = '';
          this.form.type = '';
        }
      }
    },
    created() {
      this.getGameList();
    },
    methods: {
      // 获取查询条件--彩种和玩法
      async getGameList() {
        const {
          data
        } = await this.$api.listGameMethod();
        const {
          lotterys,
          methods
        } = data;
        this.lotteryList = lotterys;
        this.queryColumns[2].options = lotterys.map(item => {
          return {
            label: item.showName,
            value: item.lottery,
          };
        });
        this.methodList = methods;
        this.getList();
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.listForbid(listQuery);
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
        this.addVisible = true;
        this.$nextTick(_ => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 确认新增
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          const thirdName = thirdParty.filter(item => item.value === this.form.third);
          const formData = Object.assign({
            ...this.form
          }, {
            thirdName: thirdName.length ? thirdName[0].label : ''
          });
          const {
            error
          } = await this.$api.addForbidUser(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      }
    }
  };
</script>