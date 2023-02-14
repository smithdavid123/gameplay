<template>
  <div v-loading="loading">
    <json-form
      ref="jsonForm"
      class="primary-label-form"
      :form="form"
      :columns="columns"
    >
      <template slot="balance-column">
        <el-input
          :value="form.balanceDeposit + form.balance"
          auto-complete="off"
          readonly
        />
      </template>
      <template slot="point-column">
        <el-input-number
          v-model="form.point"
          :precision="1"
          controls-position="right"
          :step="0.1"
          :min="0"
          :max="10"
        />
        %
        <!-- <el-input
          v-model.number="form.point"
          auto-complete="off"
        >
          <i slot="suffix">%</i>
        </el-input> -->
      </template>
      <template slot="type-column">
        <el-input
          :value="form.type | formatterMemberType"
          auto-complete="off"
          readonly
        />
      </template>
      <template slot="level-column">
        <el-input
          :value="form.parents.split('>').length"
          auto-complete="off"
          readonly
        />
      </template>
      <template slot="lockPerson-column">
        <CheckBtn
          name="登录锁定"
          :value.sync="form.status"
          :flag="true"
        />
        <CheckBtn
          name="提款锁定"
          :value.sync="form.allowWithdraw"
        />
        <CheckBtn
          name="投注锁定"
          :value.sync="form.allowOrder"
        />
        <CheckBtn
          name="分红锁定"
          :value.sync="form.allowDividend"
        />
        <CheckBtn
          name="发展下线锁定"
          :value.sync="form.allowAgent"
        />
        <CheckBtn
          name="会员账号锁定"
          :value.sync="form.abnormal"
          :flag="true"
        />
      </template>
      <template slot="lockTeam-column">
        <CheckBtn
          name="上下级转账锁定"
          :value.sync="form.allowTransfer"
        />
        <CheckBtn
          name="团队登录锁定"
          :value.sync="form.allowTeamLogin"
        />
        <CheckBtn
          name="团队提款锁定"
          :value.sync="form.allowTeamWithdraw"
        />
        <CheckBtn
          name="团队转账锁定"
          :value.sync="form.allowTeamTransfer"
        />
      </template>
    </json-form>
    <div
      style="text-align: center;"
    >
      <div
        class="primary-btn"
        style="width: 200px;margin-top:50px;"
        @click="handleUpdate"
      >
        提交
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      userItem: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data() {
      return {
        loading: true,
        form: {...this.userItem},
        columns: [{
          span: 6,
          type: 'input',
          label: '用户名',
          prop: 'username',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '真实姓名',
          prop: 'realName'
        }, {
          span: 6,
          type: 'input',
          label: '昵 称',
          prop: 'nickname',
          readonly: true
        }, {
          span: 6,
          label: '余额',
          slotName: 'balance-column'
        }, {
          span: 6,
          type: 'input',
          label: 'ID',
          prop: 'id',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '父 级',
          prop: 'parentName',
          readonly: true
        }, {
          span: 6,
          label: '返点',
          slotName: 'point-column'
        }, {
          span: 6,
          label: '用户类型',
          slotName: 'type-column'
        }, {
          span: 6,
          type: 'input',
          label: '开户银行',
          prop: 'bankName',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '银行卡号',
          prop: 'bankCardId'
        }, {
          span: 6,
          type: 'input',
          label: '注册来源',
          prop: 'regSource',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '等级',
          prop: 'userLevel'
        }, {
          span: 6,
          label: '层级',
          slotName: 'level-column'
        }, {
          span: 6,
          type: 'input',
          label: 'VIP等级',
          prop: 'vipLevel',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '代理占成比例',
          prop: 'agentPercent'
        }, {
          span: 6,
          type: 'input',
          label: '注册ip',
          prop: 'regIp',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '注册地区',
          prop: 'regAddr',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '注册时间',
          prop: 'registTime',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '最后登录ip',
          prop: 'lastIp',
          readonly: true
        }, {
          span: 6,
          type: 'input',
          label: '最后登录时间',
          prop: 'loginTime',
          readonly: true
        }, {
          span: 6,
          type: 'select',
          label: '分红工资组',
          prop: 'dividendGroup',
          options: []
        }, {
          span: 6,
          type: 'input',
          label: '微信',
          prop: 'weixin'
        }, {
          span: 6,
          type: 'input',
          label: '手机',
          prop: 'tel'
        }, {
          span: 6,
          type: 'input',
          label: '邮箱',
          prop: 'email'
        }, {
          span: 24,
          type: 'input',
          label: '个人备注',
          prop: 'markPerson'
        }, {
          span: 24,
          type: 'input',
          label: '团队备注',
          prop: 'markTeam'
        }, {
          span: 24,
          type: 'input',
          label: '代理关系',
          prop: 'parents',
          readonly: true
        }, {
          span: 24,
          label: '用户锁定',
          slotName: 'lockPerson-column'
        }, {
          span: 24,
          label: '团队锁定',
          slotName: 'lockTeam-column'
        }],
      };
    },
    created() {
      this.getUserGroup();
    },
    methods: {
      // 获取分红工资组
      async getUserGroup() {
        this.loading = true;
        const {
          data
        } = await this.$api.getUserGroup(this.listQuery);
        this.$nextTick(_=> {
          this.columns.filter(column=> column.prop === 'dividendGroup')[0].options = data.map(item=> {
            return {
              label: item.name,
              value: item.code
            };
          });
          this.loading = false;
        });
      },
      // 修改用户信息
      async handleUpdate() {
        const {agentPercent, realName, point, userLevel, bankCardId, cardId, email, weixin, tel, dividendGroup, markPerson, markTeam, status, allowWithdraw,
            allowOrder, allowDividend, allowAgent, abnormal, allowTransfer, allowTeamLogin,
            allowTeamWithdraw, allowTeamTransfer} = this.form;
        const content = {agentPercent, realName, point, userLevel, bankCardId, cardId, email, weixin, tel, dividendGroup, markPerson, markTeam, status, allowWithdraw,
            allowOrder, allowDividend, allowAgent, abnormal, allowTransfer, allowTeamLogin,
            allowTeamWithdraw, allowTeamTransfer};
            const formData = {
              username: this.form.username,
              content: JSON.stringify(content)
            };
          const {
            error
          } = await this.$api.changeUserInfo(formData);
          !error && this.$message.success('提交成功');
      }
    }
  };
</script>