<template>
  <div>
    <div class="module-query pb14">
      <div class="module-query-left" />
      <SearchBtn :query.sync="listQuery" />
    </div>
    <div class="module-handle">
      <div>
        <div
          class="primary-btn"
          @click="handleUpdate"
        >
          <svg-icon icon-class="edit" />更新
        </div>
      </div>
    </div>
    <div
      v-loading="loading"
      class="container-wrap"
    >
      <json-form
        ref="jsonForm"
        :form="form"
        :columns="formColumns"
        label-width="180px"
      >
        <template
          slot="add-column"
        >
          <div class="fr mb10">
            <div
              class="primary-btn"
              @click="addExtraRule"
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
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
        listQuery: {},
        formData: {},
        form: {
          runDate: '',
          userGroup: '',
          consumeDays: '',
          consumeAmount: '',
          scalePoint: '',
          activeUser: '',
          extraRules: []
        },
        memberGroup: [],
        formColumns: [{
            type: 'input',
            label: '分红日期',
            prop: 'runDate',
            placeholder: '必填'
          },
          {
            type: 'select',
            label: '用户类型',
            prop: 'userGroup',
            options: [],
            rules: [{
              required: true,
              message: '请选择用户类型',
              trigger: 'change'
            }]
          },
          {
            type: 'number',
            label: '活跃用户最低达标天数(天)',
            prop: 'consumeDays'
          },
          {
            type: 'number',
            label: '活跃用户最低每日消费(元)',
            prop: 'consumeAmount'
          },
          {
            type: 'input',
            label: '分红比例(%)',
            prop: 'scalePoint',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '活跃用户',
            prop: 'activeUser',
            placeholder: '必填'
          },
          {
            type: 'handle',
            label: '添加',
            slotName: 'add-column'
          },
          {
            label: '额外配置',
            prop: 'extraRules',
            slotName: 'extraRules-column'
          }],
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
          }]
      };
    },
    created() {
      this.getConfig();
      this.getList();
    },
    methods: {
      // 获取列表
      async getConfig() {
        this.loading = true;
        const {
          data
        } = await this.$api.listSystemDividend();
        this.formData = data;
        this.$nextTick(_=> {
          Object.keys(this.form).forEach(key=> {
            if (key === 'extraRules') {
              this.form[key] = JSON.parse(data.rules[key]);
            } else {
              this.form[key] = typeof(data[key]) === 'undefined' ? data.rules[key] : data[key];
            }
          });
        });
        this.loading = false;
      },
      // 获取用户组列表
      async getList() {
        const {
          data
        } = await this.$api.getUserGroup();
        this.memberGroup = data;
        this.formColumns[1].options = data.map(item=> {
          return {
            label: item.name,
            value: item.code
          };
        });
      },
      // 添加一条额外配置
      addExtraRule() {
        this.form.extraRules.push({
          activeUser:'',
          scalePoint:'',
          totalConsume:'',
          totalLoss:''
        });
      },
      // 搜索
      handleSearch() {
        // to do
      },
      // 更新
      handleUpdate() {
        this.$refs.jsonForm.validate(async _ => {
          Object.keys(this.form).forEach(key=> {
            if (typeof(this.formData[key]) === 'undefined') {
              this.formData.rules[key] = this.form[key];
            } else {
              this.formData[key] = this.form[key];
            }
          });
          const pointLimit = this.memberGroup.filter(item=> item.code === this.form.userGroup)[0];
          this.formData.pointLimit1 = pointLimit.pointLimit1;
          this.formData.pointLimit2 = pointLimit.pointLimit2;
          this.formData.pointLimit = [pointLimit.pointLimit1, pointLimit.pointLimit2];
          const { error } = await this.$api.changeConfigDividend({content: JSON.stringify([this.formData])});
          !error && this.$message.success('提交成功');
          this.getConfig();
          this.editVisible = false;
        });
      }
    }
  };
</script>