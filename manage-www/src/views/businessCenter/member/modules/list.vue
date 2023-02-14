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
          @click="handleAdd"
        >
          <svg-icon icon-class="stop" />增加
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && openConfirm(0)"
        >
          <svg-icon icon-class="stop" />重置密码
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && openConfirm(1)"
        >
          <svg-icon icon-class="stop" />重置资金密码
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && openConfirm(2)"
        >
          <svg-icon icon-class="stop" />重置密保
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleDraw()"
        >
          <svg-icon icon-class="stop" />提款设置
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && changeGroupId()"
        >
          <svg-icon icon-class="stop" />线路转移
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && addMemberToBlacks()"
        >
          <svg-icon icon-class="stop" />列入黑名单
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
          slot="memberName-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="$root.$children[0].handleDetail(row)"
          >{{ row.username }}</span>
        </template>
        <template
          slot="onlineStatus-column"
          slot-scope="{row}"
        >
          <div
            v-if="row.onlineStatus"
            :class="row.client | formatterLoginStatusTagClass"
          >
            {{ row.client | formatterLoginStatus }}
          </div>
          <div
            v-else
            class="tag-gray"
          >
            离线
          </div>
        </template>
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div :class="row.type | formatterMemberTypeTagClass">
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="allowAgent-column"
          slot-scope="{row}"
        >
          <div :class="['tag-red', 'tag-green'][row.allowAgent]">
            {{ row.allowAgent | formatterAllowAgent }}
          </div>
        </template>
        <template
          slot="moneyIn-column"
          slot-scope="{row}"
        >
          <div :class="[row.moneyIn ? 'tag-green' : 'tag-red' ]">
            {{ row.moneyIn ? '有充值' : '无充值' }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div :class="['tag-red', 'tag-green'][1 -row.status]">
            {{ row.status | formatterMemberStatus }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      width="300px"
      top="40vh"
    >
      <p>
        {{ confirmMessage }}
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="handleConfirm"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="confirmVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="用户列表-新增"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
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
      title="用户列表-个人提款设置"
      :visible.sync="drawVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="drawForm"
            :columns="drawFormColumns"
            label-width="140px"
          >
            <template
              slot="feeRate-column"
              slot-scope="{formData, item}"
            >
              <el-input
                v-model.trim="formData[item.prop]"
                auto-complete="off"
                placeholder="0表示不收取手续费"
                style="width: 200px;"
              />
              <el-select
                v-model="drawForm.feeUnit"
                placeholder="请选择"
                style="width: 200px;"
              >
                <el-option
                  label="元"
                  :value="0"
                />
                <el-option
                  label="%"
                  :value="1"
                />
              </el-select>
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
          @click="sureDraw"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="drawVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="用户列表-线路转移"
      :visible.sync="groupVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="groupForm"
            :columns="groupFormColumns"
            label-width="140px"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn"
          @click="sureChangeGroupId"
        >
          确认
        </div>
        <div
          class="disabled-btn"
          style="margin-left: 16px;"
          @click="groupVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="用户列表-新增黑名单"
      :visible.sync="blackVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="blackForm"
            :columns="blackFormColumns"
            label-width="140px"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn"
          @click="sureAddMemberToBlacks"
        >
          确认
        </div>
        <div
          class="disabled-btn"
          style="margin-left: 16px;"
          @click="blackVisible = false"
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
    memberType,
    rebatesPercent,
    blankType
  } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: true,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          parent: '',
          realName: '',
          cardId: '',
          tel: '',
          email: '',
          type: ''
        },
        queryColumns: [{
            type: 'input',
            prop: 'username',
            label: '用户名称'
          },
          {
            type: 'input',
            prop: 'realName',
            label: '真实姓名'
          },
          {
            type: 'input',
            prop: 'cardId',
            label: '银行卡号'
          },
          {
            type: 'input',
            prop: 'tel',
            label: '手机号'
          },
          {
            type: 'input',
            prop: 'email',
            label: '邮箱'
          },
          // {
          //   type: 'check',
          //   prop: 'includeTop',
          //   label: '包含上级'
          // },
          // {
          //   type: 'check',
          //   prop: 'includeBottom',
          //   label: '包含下级'
          // },
          {
            type: 'select',
            prop: 'type',
            label: '用户类型',
            allName: '请选择',
            options: memberType
          },
          // {
          //   type: 'select',
          //   prop: 'lock',
          //   label: '状态',
          //   options: lock
          // },
          // {
          //   type: 'select',
          //   prop: 'loginStatus',
          //   label: '在线状态',
          //   options: loginStatus
          // },
          // {
          //   type: 'input',
          //   prop: 'regSource',
          //   label: '来源'
          // },
          // {
          //   type: 'select',
          //   prop: 'level',
          //   label: '会员类型',
          //   options: level
          // },
          // {
          //   type: 'date',
          //   prop: ['beginTime', 'endTime'],
          //   label: '注册时间'
          // },
          // {
          //   type: 'select',
          //   prop: 'memberLevel',
          //   label: '用户等级',
          //   options: memberLevel
          // },
          // {
          //   type: 'select',
          //   prop: 'vip',
          //   label: 'VIP等级',
          //   options: vip
          // },
          // {
          //   type: 'select',
          //   prop: 'hasRecharge',
          //   label: '有充值',
          //   options: hasRecharge
          // }
        ],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            label: '在线',
            prop: 'onlineStatus',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'onlineStatus-column'
          },
          {
            label: '用户名',
            prop: 'username',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'memberName-column'
          },
          {
            label: '层级',
            prop: 'parents',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            render(row) {
              return row.parents ? row.parents.split('>').length : '-';
            }
          },
          {
            label: '代理关系',
            prop: 'parents',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '团队人数',
            prop: 'teamCount',
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
            visible: true,
            slotName: 'memberType-column'
          }, {
            label: '注册时间',
            prop: 'registTime',
            align: 'center',
            valign: 'middle',
            width: '180px',
            visible: true
          },
          // {
          //   label: '最后登录时间',
          //   prop: 'lastLoginDate',
          //   align: 'center',
          //   valign: 'middle',
          //   minWidth: '10%',
          //   visible: false
          // }, 
          {
            label: '平台余额(元)',
            prop: 'balanceDeposit',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            render(row) {
              return row.balanceDeposit + row.balance;
            }
          },
          {
            label: '第三方余额(元)',
            prop: 'balanceThird',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            render(row) {
              return row.balanceThird || '0';
            }
          },
          {
            label: '发展下线',
            prop: 'allowAgent',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'allowAgent-column'
          },
          {
            label: '用户等级',
            prop: 'level',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: 'VIP等级',
            prop: 'vipLevel',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true
          },
          {
            label: '有充值',
            prop: 'moneyIn',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'moneyIn-column'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: true,
            slotName: 'status-column'
          },
          {
            label: '分红工资组',
            prop: 'devidendGroup',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '用户备注',
            prop: 'markPerson',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '团队备注',
            prop: 'markTeam',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许提现',
            prop: 'allowWithdraw',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许投注',
            prop: 'allowOrder',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许分红',
            prop: 'allowDividend',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许发展下线',
            prop: 'allowAgent',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否账号异常',
            prop: 'abnormal',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许转账',
            prop: 'allowTransfer',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许团队登陆',
            prop: 'allowTeamLogin',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许团队提现',
            prop: 'allowTeamWithdraw',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
          {
            label: '是否允许团队转账',
            prop: 'allowTeamTransfer',
            align: 'center',
            valign: 'middle',
            minWidth: '10%',
            visible: false
          },
        ],
        data: [],
        // 操作
        checked: [],
        confirmVisible: false,
        confirmType: 0,
        // 新增
        addVisible: false,
        addForm: {
          type: 1,
          username: '',
          pw: '',
          nickname: '',
          tel: '',
          status: 0,
          point: '0.000000'
        },
        addFormColumns: [{
            type: 'radio',
            label: '用户类型',
            prop: 'type',
            options: [{
              label: '代理',
              value: 1
            }, {
              label: '会员',
              value: 0
            }]
          },
          {
            type: 'input',
            label: '用户名',
            prop: 'username',
            placeholder: '用户名为4-16个字符，字母和数字组成'
          },
          {
            type: 'input',
            label: '密码',
            prop: 'pw',
            placeholder: '密码为6-16个字符，字母和数字组成'
          },
          {
            type: 'input',
            label: '用户名称',
            prop: 'nickname',
            placeholder: '由2至6个字符组成，字母和数字组成'
          },
          {
            type: 'input',
            label: '电话',
            prop: 'tel'
          },
          {
            type: 'select',
            label: '设置返点',
            prop: 'point',
            options: rebatesPercent
          }
        ],
        // 个人提款设置
        drawVisible: false,
        drawForm: {
          id: -1,
          maxDailyAmount: '',
          minUnitAmount: '',
          maxUnitAmount: '',
          maxDailyCount: '',
          newCardTime: '',
          feeRate: '',
          feeCalcType: '',
          feeUnit: 0
        },
        drawFormColumns: [{
            type: 'input',
            label: '每日提款限额',
            prop: 'maxDailyAmount',
            placeholder: '保留两位小数'
          },
          {
            type: 'input',
            label: '最小提现金额',
            prop: 'minUnitAmount',
            placeholder: '保留两位小数'
          },
          {
            type: 'input',
            label: '最大提现金额',
            prop: 'maxUnitAmount',
            placeholder: '保留两位小数'
          },
          {
            type: 'input',
            label: '每日提款次数',
            prop: 'maxDailyCount'
          },
          {
            type: 'input',
            label: '新卡提现限制',
            prop: 'newCardTime',
            placeholder: '绑定银行卡后需要经过此时间才能提款到该卡, -1: 表示不限制'
          },
          {
            label: '提现手续费',
            prop: 'feeRate',
            slotName: 'feeRate-column',
          },
          {
            type: 'radio',
            label: '扣取方式',
            prop: 'feeCalcType',
            options: [{
              label: '内扣',
              value: 1
            }, {
              label: '外扣',
              value: 0
            }]
          }
        ],
        // 线路转移
        groupVisible: false,
        groupForm: {
          changeType: 1,
          fromMemberName: '',
          toMemberName: ''
        },
        groupFormColumns: [{
            type: 'radio',
            label: '类型',
            prop: 'changeType',
            options: [{
              label: '转移整个线路',
              value: 1
            }, {
              label: '只转移下级用户',
              value: 2
            }]
          },
          {
            type: 'input',
            label: '线路A',
            prop: 'fromMemberName',
            readonly: true
          },
          {
            type: 'input',
            label: '线路B',
            prop: 'toMemberName'
          }
        ],
        // 新增黑名单
        blackVisible: false,
        blackForm: {
          type: 1,
          remark: ''
        },
        blackFormColumns: [{
            type: 'select',
            label: '黑名单类型',
            prop: 'type',
            options: blankType
          },
          {
            type: 'textarea',
            label: '备注',
            prop: 'remark',
            placeholder: '请输入内容'
          }
        ],
      };
    },
    computed: {
      confirmMessage: function () {
        return ['确认重置该用户的登录密码？重置后密码为888888', '确认重置该用户的资金密码？重置后资金密码为888888', '确认重置该用户的密保？重置后密保为空'][this.confirmType];
      }
    },
    mounted() {
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
        } = await this.$api.memberloginList(listQuery);
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
      // 确认重置密码
      openConfirm(index) {
        this.confirmType = index;
        this.confirmVisible = true;
      },
      // 确认重置
      async handleConfirm() {
        const formData = { username: this.checked[0].username};
        const apiName = ['initUserPasswd', 'initUserWithdrawPasswd', 'initUserSecurity'][this.confirmType];
        const {
          error
        } = await this.$api[apiName](formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.confirmVisible = false;
      },
      // 新增用户
      handleAdd() {
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 确认新增
      sureAdd() {
        this.$refs.jsonForm.validate(async _ => {
          const {point, ...formData } = this.addForm;
          formData.point = (point * 100).toFixed(1);
          const {
            error
          } = await this.$api.accountCreate(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        });
      },
      // 提款设置
      async handleDraw() {
        const {
          data
        } = await this.$api.getMoneyOutLimit({username: this.checked[0].username});
        this.drawVisible = true;
        this.$nextTick( _=> {
          this.drawForm.feeUnit = 0;
          this.$refs.jsonForm.resetValidate();
          data && Object.keys(this.drawForm).forEach(key=> {
            this.drawForm[key] = data[key];
          });
        });
      },
      // 确认提款设置
      sureDraw() {
        this.$refs.jsonForm.validate(async _ => {
          const {id, ...content } = this.drawForm;
          const username = this.checked[0].username;
          content.username = username;
          const formData = {
            id,
            username,
            content: JSON.stringify(content)
          };
          const {
            error
          } = await this.$api.setMoneyOutLimit(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.drawVisible = false;
        });
      },
      // 线路转移
      changeGroupId() {
        this.groupVisible = true;
        this.groupForm.fromMemberName = this.checked[0].username;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 确认转移
      async sureChangeGroupId() {
        let g = this.groupForm;
        if (g.toMemberName.replace(' ', '') === '') return this.$message.error('请输入目标线路名！');
        const formData = {
          from: g.fromMemberName,
          type: g.changeType,
          to: g.toMemberName
        };
        const { error } = await this.$api.changeTeamParent(formData);
        !error && this.$message.success('提交成功');
        this.getList();
        this.groupVisible = false;
      },
      // 新增黑名单
      addMemberToBlacks() {
        this.blackVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 确认新增黑名单
      sureAddMemberToBlacks() {
        //  to do
      }
    }
  };
</script>