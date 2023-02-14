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
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.map.memberType | formatterMemberTypeTagClass"
          >
            {{ row.map.memberType | formatterMemberType }}
          </div>
        </template>
        <template
          slot="changeType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.changeType | formatterChangeTypeTagClass"
          >
            {{ row.changeType | formatterChangeType }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import { changeType } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          memberName: '',
          beginTime: '',
          endTime: '',
          changeType: '',
          orderCode: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'memberName',
          label: '会员名称'
        }, {
          type: 'date',
          prop: ['beginTime', 'endTime'],
          label: '时间'
        }, {
          type: 'select',
          prop: 'changeType',
          label: '账变类型',
          options: changeType
        }, {
          type: 'input',
          prop: 'orderCode',
          label: '订单编号'
        }],
        changeType,
        tableColumns: [{
            label: '用户',
            prop: 'map.memberName',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '用户类型',
            prop: 'map.memberType',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'memberType-column'
          }, {
            label: '账变类型',
            prop: 'changeType',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'changeType-column'
          }, {
            label: '支出',
            prop: 'map.cutMoney',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '收入',
            prop: 'map.addMoney',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '余额',
            prop: 'accountBalance',
            align: 'center',
            visible: true,
            minWidth: '10%'
          }, {
            label: '订单编号',
            prop: 'orderCode',
            align: 'center',
            visible: true,
            minWidth: '10%',
          }, {
            label: '时间',
            prop: 'changeTime',
            align: 'center',
            minWidth: '10%',
            visible: true,
            render: row=> {
              return this.$format(row.changeTime, 'yyyy-MM-dd HH:mm:ss');
            }
          }, {
            label: '备注',
            prop: 'remark',
            align: 'left',
            visible: true,
            minWidth: '10%'
          }],
        data: [{
            map: {
              memberName: 'your8888',
              memberType: 2,
              cutMoney: -0.21
            },
            changeId: '4b9d3237ac234808a383bbe3451bbd28',
            memberId: 167482,
            groupId: '166575,166969,166983,167013,167025,167482,',
            changeMoney: -0.21,
            changeType: 'a809',
            accountBalance: 135.68694,
            changeTime: 1583671294933,
            sharding: 112,
            lotteryCode: 'ssc_tx',
            lotteryBetCode: 'ssc_tx_h2_zx_fs',
            leagueCode: 'jj138',
            orderCode: '20200308286544795',
            transferFlag: 0
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