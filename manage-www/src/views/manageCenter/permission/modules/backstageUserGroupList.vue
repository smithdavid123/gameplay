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
          @click="checkValidate() && handleAdd()"
        >
          <svg-icon icon-class="check-square" />修改
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
      title="后台用户组管理-分配角色"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <el-radio-group
            v-model="checkAll"
            class="mb16 ml10"
            @change="changeAuthChecked"
          >
            <el-radio :label="1">
              全选中
            </el-radio>
            <el-radio :label="0">
              全取消
            </el-radio>
          </el-radio-group>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="100px"
          />
          <tree
            :setting="setting"
            :nodes="zNodes"
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
import resize from '../../../mixins';
import tree from 'vue-giant-tree';
  export default {
    components: {
      tree
    },
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          roleName: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'roleName',
          label: '用户组名称'
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          }, {
          label: '用户组名称',
          prop: 'roleName',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '用户组描述',
          prop: 'remark',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '创建人',
          prop: 'createUser',
          align: 'left',
          valign: 'middle',
          minWidth: '10%',
          visible: true
        },
        {
          label: '创建时间',
          prop: 'createDate',
          align: 'center',
          valign: 'middle',
          minWidth: '10%',
          visible: true,
          render: row=> {
              return this.$format(row.createDate, 'yyyy-MM-dd HH:mm:ss');
          }
        }
        ],
        data: [{
          map: {
            uesrNames: 'jjadmin,caiwu666,pangzi666,caimi8889,jiujiu01,jiujiu123'
          },
          roleId: 900900105,
          roleName: '久久管理员',
          createDate: 1572950612000,
          updateDate: 1572950612000,
          createUser: 'billypro',
          updateUser: 'billypro',
          remark: 'kefu11',
          leagueCode: 'jj138',
          superFlag: 0,
          enableFlag: 1
        }],
        checked: [],
        // 添加
        addVisible: false,
        form: {
          roleName: '',
          remark: ''
        },
        formColumns: [{
            type: 'input',
            label: '用户组名称',
            prop: 'roleName',
            placeholder: '必填'
          },
          {
            type: 'input',
            label: '用户组描述',
            prop: 'remark',
            placeholder: '必填'
          }
        ],
        checkAll: '',
        setting: {
          view : {
            selectedMulti : false,
          },
          check : {
            enable: true,
            autoCheckTrigger: true,
            chkStyle: 'checkbox',
            nocheckInherit: false,
            chkDisabledInherit: false,
            radioType: 'level',
            chkboxType: {
            'Y': 'ps',
            'N': 'ps'
            }
          },
          data : {
            simpleData : {
              enable : true,
              idKey : 'code',
              pIdKey : 'parentCode',
              rootPId : '0'
            }
          }
        },
        zNodes: [{'code':'m1_league','parentCode':'0','name':'站点管理','checked':false,'nocheck':false,'map':{}},{'code':'m1_finance','parentCode':'0','name':'财务管理','checked':false,'nocheck':false,'map':{}},{'code':'m1_lottery','parentCode':'0','name':'彩票管理','checked':false,'nocheck':false,'map':{}},{'code':'m1_bussiness','parentCode':'0','name':'业务管理','checked':false,'nocheck':false,'map':{}},{'code':'m1_sys_manage','parentCode':'0','name':'系统管理','checked':false,'nocheck':false,'map':{}},{'code':'m1_stat_manager','parentCode':'0','name':'统计管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_log','parentCode':'m1_sys_manage','name':'日志','checked':false,'nocheck':false,'map':{}},{'code':'m2_manual','parentCode':'m1_finance','name':'人工转账','checked':false,'nocheck':false,'map':{}},{'code':'m2_notice','parentCode':'m1_league','name':'公告管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_report','parentCode':'m1_bussiness','name':'报表管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_message','parentCode':'m1_league','name':'消息管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_dividend','parentCode':'m1_bussiness','name':'契约分红','checked':false,'nocheck':false,'map':{}},{'code':'m2_recharge','parentCode':'m1_finance','name':'充值管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_bank_card','parentCode':'m1_league','name':'站点银行管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_ip_config','parentCode':'m1_sys_manage','name':'IP管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_stat_list','parentCode':'m1_stat_manager','name':'统计管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_withdrawal','parentCode':'m1_finance','name':'提现管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_host_config','parentCode':'m1_league','name':'站点配置','checked':false,'nocheck':false,'map':{}},{'code':'m2_lottery_con','parentCode':'m1_lottery','name':'加盟商彩票管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_order_record','parentCode':'m1_bussiness','name':'投注记录','checked':false,'nocheck':false,'map':{}},{'code':'m2_user_manager','parentCode':'m1_bussiness','name':'用户管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_bussiness_act','parentCode':'m1_bussiness','name':'活动管理','checked':false,'nocheck':false,'map':{}},{'code':'m2_history_mongo','parentCode':'m1_bussiness','name':'历史数据','checked':false,'nocheck':false,'map':{}},{'code':'m2_lottery_report','parentCode':'m1_lottery','name':'彩种报表','checked':false,'nocheck':false,'map':{}},{'code':'m2_sys_permission','parentCode':'m1_sys_manage','name':'权限管理','checked':false,'nocheck':false,'map':{}},{'code':'m3_home','parentCode':'m2_stat_list','name':'首页','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery','parentCode':'m2_lottery_con','name':'彩票赔率','checked':false,'nocheck':false,'map':{}},{'code':'m3_user_ips','parentCode':'m2_ip_config','name':'用户IP设置','checked':false,'nocheck':false,'map':{}},{'code':'m3_memberlog','parentCode':'m2_log','name':'前台日志','checked':false,'nocheck':false,'map':{}},{'code':'m3_stat_user','parentCode':'m2_stat_list','name':'用户统计','checked':false,'nocheck':false,'map':{}},{'code':'m3_systemlog','parentCode':'m2_log','name':'后台日志','checked':false,'nocheck':false,'map':{}},{'code':'m3_black_list','parentCode':'m2_ip_config','name':'黑名单管理','checked':false,'nocheck':false,'map':{}},{'code':'m3_log_record','parentCode':'m2_report','name':'账变记录','checked':false,'nocheck':false,'map':{}},{'code':'m3_order_list','parentCode':'m2_order_record','name':'订单查询','checked':false,'nocheck':false,'map':{}},{'code':'m3_append_list','parentCode':'m2_order_record','name':'追号查询','checked':false,'nocheck':false,'map':{}},{'code':'m3_bank_config','parentCode':'m2_bank_card','name':'用户转账银行','checked':false,'nocheck':false,'map':{}},{'code':'m3_league_bank','parentCode':'m2_bank_card','name':'平台收款银行','checked':false,'nocheck':false,'map':{}},{'code':'m3_league_draw','parentCode':'m2_lottery_con','name':'自营彩期管理','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery_hot','parentCode':'m2_lottery_con','name':'热门彩种','checked':false,'nocheck':false,'map':{}},{'code':'m3_member_sign','parentCode':'m2_bussiness_act','name':'客户签到设置','checked':false,'nocheck':false,'map':{}},{'code':'m3_salary_base','parentCode':'m2_lottery_con','name':'彩票配置','checked':false,'nocheck':false,'map':{}},{'code':'m3_activity_pre','parentCode':'m2_bussiness_act','name':'优惠活动','checked':false,'nocheck':false,'map':{}},{'code':'m3_ag_pl_report','parentCode':'m2_report','name':'第三方报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_bonus_config','parentCode':'m2_host_config','name':'奖金返点配置','checked':false,'nocheck':false,'map':{}},{'code':'m3_dividend_log','parentCode':'m2_dividend','name':'契约分红记录','checked':false,'nocheck':false,'map':{}},{'code':'m3_login_record','parentCode':'m2_log','name':'登录日志','checked':false,'nocheck':false,'map':{}},{'code':'m3_ag_order_list','parentCode':'m2_order_record','name':'第三方记录','checked':false,'nocheck':false,'map':{}},{'code':'m3_notice_system','parentCode':'m2_notice','name':'系统公告','checked':false,'nocheck':false,'map':{}},{'code':'m3_dividend_group','parentCode':'m2_dividend','name':'契约分红用户组','checked':false,'nocheck':false,'map':{}},{'code':'m3_recharge_count','parentCode':'m2_recharge','name':'充值接口统计','checked':false,'nocheck':false,'map':{}},{'code':'m3_third_recharge','parentCode':'m2_recharge','name':'线上充值订单','checked':false,'nocheck':false,'map':{}},{'code':'m3_withdraw_count','parentCode':'m2_withdrawal','name':'提现接口统计','checked':false,'nocheck':false,'map':{}},{'code':'m3_activity_config','parentCode':'m2_bussiness_act','name':'活动设置','checked':false,'nocheck':false,'map':{}},{'code':'m3_activity_record','parentCode':'m2_bussiness_act','name':'活动奖金记录','checked':false,'nocheck':false,'map':{}},{'code':'m3_apayinfo-config','parentCode':'m2_host_config','name':'充提接口配置','checked':false,'nocheck':false,'map':{}},{'code':'m3_dividend_config','parentCode':'m2_dividend','name':'契约配置','checked':false,'nocheck':false,'map':{}},{'code':'m3_dividend_member','parentCode':'m2_dividend','name':'契约分红列表','checked':false,'nocheck':false,'map':{}},{'code':'m3_manual_transfer','parentCode':'m2_manual','name':'人工转账记录','checked':false,'nocheck':false,'map':{}},{'code':'m3_member_agreport','parentCode':'m2_lottery_report','name':'个人游戏分析','checked':false,'nocheck':false,'map':{}},{'code':'m3_recharge_config','parentCode':'m2_host_config','name':'充值设置','checked':false,'nocheck':false,'map':{}},{'code':'m3_repeatinfo_list','parentCode':'m2_user_manager','name':'套利查询','checked':false,'nocheck':false,'map':{}},{'code':'m3_withdrawal_risk','parentCode':'m2_withdrawal','name':'风控审核','checked':false,'nocheck':false,'map':{}},{'code':'m3_ac_history_mongo','parentCode':'m2_history_mongo','name':'历史账变','checked':false,'nocheck':false,'map':{}},{'code':'m3_ag_history_mongo','parentCode':'m2_history_mongo','name':'历史第三方','checked':false,'nocheck':false,'map':{}},{'code':'m3_ld_history_mongo','parentCode':'m2_history_mongo','name':'历史彩期','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery_onetoone','parentCode':'m2_lottery_con','name':'单挑模式配置','checked':false,'nocheck':false,'map':{}},{'code':'m3_memberlogin_list','parentCode':'m2_user_manager','name':'用户列表','checked':false,'nocheck':false,'map':{}},{'code':'m3_withdrawal_check','parentCode':'m2_withdrawal','name':'出款审核','checked':false,'nocheck':false,'map':{}},{'code':'m3_bankCard_transfer','parentCode':'m2_recharge','name':'线下充值订单','checked':false,'nocheck':false,'map':{}},{'code':'m3_drawinglimit_list','parentCode':'m2_user_manager','name':'流水限制','checked':false,'nocheck':false,'map':{}},{'code':'m3_memberInfo_config','parentCode':'m2_host_config','name':'会员信息配置','checked':false,'nocheck':false,'map':{}},{'code':'m3_memberresume_list','parentCode':'m2_user_manager','name':'当日会员概要','checked':false,'nocheck':false,'map':{}},{'code':'m3_report_teamreport','parentCode':'m2_report','name':'团队报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_report_userreport','parentCode':'m2_report','name':'用户输赢报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_report_wholepoint','parentCode':'m2_report','name':'整点统计报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_withdrawal_config','parentCode':'m2_host_config','name':'提现设置','checked':false,'nocheck':false,'map':{}},{'code':'m3_league_notselfdraw','parentCode':'m2_lottery_con','name':'平台彩期查询','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery_navigation','parentCode':'m2_lottery_con','name':'彩种导航','checked':false,'nocheck':false,'map':{}},{'code':'m3_lotteryspread_list','parentCode':'m2_user_manager','name':'推广链接','checked':false,'nocheck':false,'map':{}},{'code':'m3_report_totalreport','parentCode':'m2_report','name':'总报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_backstage_user_list','parentCode':'m2_sys_permission','name':'后台用户管理','checked':false,'nocheck':false,'map':{}},{'code':'m3_order_history_mongo','parentCode':'m2_history_mongo','name':'历史订单','checked':false,'nocheck':false,'map':{}},{'code':'m3_append_history_mongo','parentCode':'m2_history_mongo','name':'历史追号','checked':false,'nocheck':false,'map':{}},{'code':'m3_message_insideletter','parentCode':'m2_message','name':'站内信','checked':false,'nocheck':false,'map':{}},{'code':'m3_thirdPartyStatistics','parentCode':'m2_report','name':'游戏输赢报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery_betcodereport','parentCode':'m2_lottery_report','name':'玩法日分析报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery_lotteryreport','parentCode':'m2_lottery_report','name':'彩种日分析报表','checked':false,'nocheck':false,'map':{}},{'code':'m3_memberbetblacklist_list','parentCode':'m2_user_manager','name':'投注会员黑名单','checked':false,'nocheck':false,'map':{}},{'code':'m3_backstage_userGroup_list','parentCode':'m2_sys_permission','name':'后台用户组管理','checked':false,'nocheck':false,'map':{}},{'code':'m3_lottery_memberlotteryreport','parentCode':'m2_lottery_report','name':'个人彩种分析','checked':false,'nocheck':false,'map':{}},{'code':'m4_order_normal','parentCode':'m3_order_list','name':'一般订单查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_reg','parentCode':'m3_home','name':'今日注册','checked':false,'nocheck':false,'map':{}},{'code':'m4_lock_authority','parentCode':'m3_memberlogin_list','name':'用户锁定','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_login','parentCode':'m3_home','name':'今日登录','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_active','parentCode':'m3_home','name':'今日活跃人数','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_online','parentCode':'m3_home','name':'当前在线','checked':false,'nocheck':false,'map':{}},{'code':'m4_league_bank_list','parentCode':'m3_league_bank','name':'收款银行列表','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_alldata','parentCode':'m3_home','name':'全量统计','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_balance','parentCode':'m3_home','name':'账户余额统计','checked':false,'nocheck':false,'map':{}},{'code':'m4_repeatinfo_normal','parentCode':'m3_repeatinfo_list','name':'一般套利查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_third_part_search','parentCode':'m3_third_recharge','name':'线上充值查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_third_part_update','parentCode':'m3_third_recharge','name':'线上充值修改','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_manual','parentCode':'m3_withdrawal_check','name':'人工和自动出款','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_refund','parentCode':'m3_withdrawal_check','name':'出款退款操作','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_search','parentCode':'m3_withdrawal_check','name':'出款审核查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_accountchange_list','parentCode':'m3_log_record','name':'账变查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_recharge','parentCode':'m3_home','name':'用户充值审核','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_withdraw','parentCode':'m3_home','name':'用户提现审核','checked':false,'nocheck':false,'map':{}},{'code':'m4_league_bank_search','parentCode':'m3_league_bank','name':'收款银行查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_league_bank_update','parentCode':'m3_league_bank','name':'收款银行修改','checked':false,'nocheck':false,'map':{}},{'code':'m4_third_part_account','parentCode':'m3_third_recharge','name':'线上充值对账','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_account','parentCode':'m3_withdrawal_check','name':'出款对账操作','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_examine','parentCode':'m3_withdrawal_check','name':'出款审核操作','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_todaydata','parentCode':'m3_home','name':'今日数据','checked':false,'nocheck':false,'map':{}},{'code':'m4_manualtransfer_list','parentCode':'m3_manual_transfer','name':'人工转账查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_repeatinfo_password','parentCode':'m3_repeatinfo_list','name':'密码套利查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_system_cancel_order','parentCode':'m3_order_list','name':'订单系统撤单','checked':false,'nocheck':false,'map':{}},{'code':'m4_user_read_authority','parentCode':'m3_memberlogin_list','name':'用户查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_bankcard','parentCode':'m3_withdrawal_check','name':'银行卡出款','checked':false,'nocheck':false,'map':{}},{'code':'m4_apayinfo_config_list','parentCode':'m3_apayinfo-config','name':'充提接口列表','checked':false,'nocheck':false,'map':{}},{'code':'m4_manualtransfer_audit','parentCode':'m3_manual_transfer','name':'人工转账审核','checked':false,'nocheck':false,'map':{}},{'code':'m4_user_write_authority','parentCode':'m3_memberlogin_list','name':'重要信息修改','checked':false,'nocheck':false,'map':{}},{'code':'m4_manualtransfer_refuse','parentCode':'m3_manual_transfer','name':'人工转账拒绝','checked':false,'nocheck':false,'map':{}},{'code':'m4_accountchange_recharge','parentCode':'m3_log_record','name':'人工存入','checked':false,'nocheck':false,'map':{}},{'code':'m4_accountchange_withdraw','parentCode':'m3_log_record','name':'人工提出','checked':false,'nocheck':false,'map':{}},{'code':'m4_apayinfo_config_search','parentCode':'m3_apayinfo-config','name':'充提接口查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_apayinfo_config_update','parentCode':'m3_apayinfo-config','name':'充提接口修改','checked':false,'nocheck':false,'map':{}},{'code':'m4_bankCard_transfer_fail','parentCode':'m3_bankCard_transfer','name':'线下充值操作失败','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_risk_search','parentCode':'m3_withdrawal_risk','name':'风控审核查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_home_stat_webcharalipay','parentCode':'m3_home','name':'微信支付宝审核','checked':false,'nocheck':false,'map':{}},{'code':'m4_withdrawal_risk_examine','parentCode':'m3_withdrawal_risk','name':'风控审核操作','checked':false,'nocheck':false,'map':{}},{'code':'m4_bankCard_transfer_search','parentCode':'m3_bankCard_transfer','name':'线下充值查询','checked':false,'nocheck':false,'map':{}},{'code':'m4_bankCard_transfer_success','parentCode':'m3_bankCard_transfer','name':'线下充值操作成功','checked':false,'nocheck':false,'map':{}}],
        // 删除
        removeVisible: false,
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
      handleRemove() {
        this.removeVisible = true;
      },
      sureRemove() {
        // to do
      }
    }
  };
</script>