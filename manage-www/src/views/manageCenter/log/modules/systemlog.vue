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
      <div />
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
      >
        <template
          slot="operateType-column"
          slot-scope="{row}"
        >
          <div class="tag-aqua">
            {{ ['新增', '修改', '删除'][row.operateType - 1] }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import {
    roleName,
    operateType
  } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          userName: '',
          targetMember: '',
          requestIp: '',
          beginTime: '',
          endTime: '',
          roleName: '',
          operateType: '',
          menuCodeValue: '',
          m1_lottery: 0,
          m1_bussiness: 0,
          m1_finance: 0,
          m1_stat_manager: 0,
          m1_league: 0,
          m1_sys_manage: 0,
          menuCodeGroupAll: '',
          menuCodeGroupFirst: '',
          menuCodeGroup: '',
        },
        queryColumns: [{
            type: 'input',
            prop: 'userName',
            label: '变更人'
          },
          {
            type: 'select',
            prop: 'roleName',
            label: '用户组',
            allName: '请选择',
            options: roleName
          },
          {
            type: 'select',
            prop: 'operateType',
            label: '操作',
            options: operateType
          },
          {
            type: 'input',
            prop: 'targetMember',
            label: '变更对象'
          },
          {
            type: 'input',
            prop: 'requestIp',
            label: '登录IP'
          },
          {
            type: 'date',
            prop: ['beginTime', 'endTime'],
            label: '操作时间'
          }
        ],
        tableColumns: [{
            label: '变更时间',
            prop: 'createDate',
            align: 'center',
            minWidth: '10%',
            visible: true,
            render: row => {
              return this.$format(row.createDate, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            label: '菜单编码',
            prop: 'menuCode',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '模块',
            prop: 'pathName',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '操作',
            prop: 'operateType',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'operateType-column'
          },
          {
            label: '操作描述',
            prop: 'reqResult',
            align: 'center',
            minWidth: '20%',
            visible: true
          },
          {
            label: '变更人',
            prop: 'userName',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '用户组',
            prop: 'roleName',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '变更对象',
            prop: 'targetMember',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '变更对象',
            prop: 'map.userMemberName',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '原始值',
            prop: 'oldValue',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '变更值',
            prop: 'newValue',
            align: 'center',
            minWidth: '10%',
            visible: false
          },
          {
            label: '变更值',
            prop: 'map.newValueDesc',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '登录IP',
            prop: 'requestIp',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: 'IP归属',
            prop: 'requestIpAddr',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '参数内容',
            prop: 'paramIn',
            align: 'left',
            minWidth: '10%',
            visible: false,
            render(row) {
              if (row.paramIn && row.paramIn.length > 50) {
                return row.paramIn.substring(0, 50);
              } else {
                return row.paramIn;
              }
            }
          }
        ],
        data: [{
          map: {
            userMemberName: 'wlc888',
            newValueDesc: '状态:充值成功。'
          },
          log_id: '209f208a219e41088cb840512124784e',
          userId: 900900449,
          userName: 'caiwu001',
          roleName: 'caiwu666',
          leagueCode: 'jj138',
          pathUrl: 'com.amoeba.admin.modules.recharge.web.BankCardTransferController.success()',
          menuCode: 'm3_bankCard_transfer',
          pathName: '线下充值订单',
          requestIp: '124.107.235.71',
          logType: 1,
          createDate: 1584078690000,
          createUser: 'caiwu001',
          requestIpAddr: '广东省广州市',
          type: 1,
          operateType: 2,
          oldValue: '|TN:Recharge,CL_finishTime:null,CL_state:0,CL_updateUser:null|TN:MemberAccount,CL_accountBalance:85.703000,CL_addFunds:669002.000000|TN:MemberAccount,CL_updateDate:Fri Mar 13 13:21:07 HKT 2020',
          newValue: '|TN:Recharge,CL_finishTime:Fri Mar 13 13:51:30 HKT 2020,CL_state:1,CL_updateUser:caiwu001|TN:MemberAccount,CL_accountBalance:3785.703000,CL_addFunds:672702.000000|TN:AccountChange,CL_changeId:8f8bd596f462401798c8caffe4c1504a,CL_memberId:188132,CL_groupId:166575,167041,169584,169588,172809,179595,188132,,CL_changeMoney:3700.00000000,CL_changeType:a801|TN:MemberAccount,CL_updateDate:Fri Mar 13 13:51:30 HKT 2020|TN:RechargeHistory,CL_rechargeHistoryId:null,CL_rechargeCode:b9e11bfab4414939a9a3f460a5037038,CL_rechargeTime:Fri Mar 13 13:51:30 HKT 2020,CL_rechargeType:3,CL_rechargeCash:3700.00000000',
          targetMember: 'memberId:188132',
          reqResult: '用户:caiwu001执行:线下充值订单 - 修改成功',
          paramIn: "{'ids':['395702']}"
        }]
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
      }
    }
  };
</script>