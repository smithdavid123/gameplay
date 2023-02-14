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
          @click="checkValidate() && handleConfirm(0)"
        >
          <svg-icon icon-class="stop" />无效处理
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleConfirm(1)"
        >
          <svg-icon icon-class="stop" />撤销未结算订单
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
        :hidden-summary="false"
        :summary="countData"
        height="calc(100vh - 342px)"
        :page.sync="listQuery.pageNumber"
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="playerName-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
            @click="handleDetail(row)"
          >{{ row.playerName }}</span>
        </template>
        <template
          slot="platformType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.platformType | formatterPlatformTypeTagClass"
          >
            {{ row.platformType | formatterPlatformType }}
          </div>
        </template>
        <template
          slot="flag-column"
          slot-scope="{row}"
        >
          <div
            :class="row.flag | formatterFlagTagClass"
          >
            {{ row.flag | formatterFlag }}
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
        {{ confirmStype }}
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="sureConfirm"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="confirmVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import { thirdParty, flag } from '@/utils/options';
  export default {
        mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          billNo: '',
          memberName: '',
          mainbillno: '',
          betAmountFrom: '',
          betAmountTo: '',
          netAmountFrom: '',
          netAmountTo: '',
          gameType: '',
          betContent: '',
          beginBetTime: '',
          endBetTime: '',
          beginDrawTime: '',
          endDrawTime: '',
          agentCode: '',
          flag: '',
          include: 0
        },
        queryColumns: [{
          type: 'select',
          prop: 'agentCode',
          label: '第三方',
          allName: '请选择',
          options: thirdParty
        },{
          type: 'input',
          prop: 'billNo',
          label: '订单编号'
        },{
          type: 'input',
          prop: 'memberName',
          label: '会员名称'
        },{
          type: 'input',
          prop: 'mainbillno',
          label: '期号'
        },{
          type: 'select',
          prop: 'flag',
          label: '状态',
          allName: '请选择',
          options: flag
        },{
          type: 'rangeInput',
          prop: ['betAmountFrom','betAmountTo'],
          label: '下注金额'
        },{
          type: 'rangeInput',
          prop: ['netAmountFrom','netAmountTo'],
          label: '派彩'
        },{
          type: 'input',
          prop: 'gameType',
          label: '游戏类型'
        },{
          type: 'input',
          prop: 'betContent',
          label: '下注记录详情'
        },{
          type: 'check',
          prop: 'include',
          label: '包含下级'
        }, {
          type: 'date',
          prop: ['beginBetTime', 'endBetTime'],
          label: '下单时间'
        },{
          type: 'date',
          prop: ['beginDrawTime', 'endDrawTime'],
          label: '开彩时间'
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center',
          visible:true
        },{
          prop: 'playerName',
          label: '用户名',
          minWidth: '12%',
          align: 'center',
          visible:true,
          slotName: 'playerName-column'
        },{
          prop: 'billNo',
          label: '投注编号',
          minWidth: '12%',
          align: 'center',
          visible:true
        },{
          prop: 'map.thirdName',
          label: '第三方',
          minWidth: '12%',
          align: 'center',
          visible:true
        }, {
          prop: 'gameType',
          label: '游戏类型',
          minWidth: '8%',
          align: 'center',
          visible:true
        }, {
          prop: 'platformType',
          label: '平台类型',
          minWidth: '8%',
          align: 'center',
          visible:true,
          slotName: 'platformType-column'
        }, {
          prop: 'betAmount',
          label: '下注金额',
          minWidth: '8%',
          align: 'center',
          visible:true
        }, {
          prop: 'validBetAmount',
          label: '有效投注额',
          minWidth: '8%',
          align: 'center',
          visible:true
        }, {
          prop: 'netAmount',
          label: '派彩',
          minWidth: '12%',
          align: 'center',
          visible:true
        },{
          prop: 'betTime',
          label: '下注时间',
          minWidth: '12%',
          align: 'center',
          visible:true,
          render: row=> {
            return this.$format(row.betTime, 'yyyy-MM-dd HH:mm:ss');
          }
        },{
          prop: 'drawTime',
          label: '开彩时间',
          minWidth: '12%',
          align: 'center',
          visible:true,
          render: row=> {
            return this.$format(row.drawTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          prop: 'flag',
          label: '结算状态',
          minWidth: '8%',
          align: 'center',
          visible:true,
          slotName: 'flag-column'
        }, {
          prop: 'betContent',
          label: '下注记录详情',
          minWidth: '8%',
          align: 'center',
          visible:true
        }],
        data: [{
            map: {
              thirdName: 'AG视讯'
            },
            agOrderRecordId: 8373111,
            billNo: '200307094489176',
            playerName: 'jie00000',
            agentCode: 'AG',
            netAmount: -1000,
            betTime: 1583586271000,
            drawTime: 1583586296000,
            gameType: '牛牛',
            betAmount: 1000,
            flag: '1',
            platformType: '1',
            round: '1',
            leagueCode: 'jj138',
            memberId: 241567,
            groupId: '166575,166981,167024,167033,167183,172312,172313,241564,241567,',
            sharding: 105,
            createDate: 1583586307000,
            updateDate: 1583586307000,
            validBetAmount: 1000,
            transferFlag: 0
          }
        ],
        countData: {
            map: {},
            netAmount: -6285.13,
            betAmount: 152244.01,
            validBetAmount: 151295.26
        },
        // 操作
        checked: [],
        confirmVisible: false,
        confirmType: 0
      };
    },
    computed: {
      confirmStype: function() {
        return this.confirmType ? '确认进行撤单吗 ?（只针对未结算订单）' : '确认对数据进行无效处理吗?';
      }
    },
    created() {
      // this.getList()
      // this.getCount()
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.agList(this.listQuery);
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
        this.listQuery.pageNumber = 1;
        this.getList();
        this.getCount();
      },
      // 获取统计
      async getCount() {
        const { pageNumber, ...formData} = this.listQuery;
        this.countData = await this.$api.agTotal(formData);
      },
      handleDetail(row) {
        // to do
      },
      // 无效处理 & 撤销未结算订单
      handleConfirm(index) {
        this.confirmType = index;
        this.confirmVisible = true;
      },
      // 确认提交
      async sureConfirm() {
        if (this.confirmType) {
          await this.$api.cancelUnsettleOrder({ids : this.checked[0].agOrderRecordId, shardings:this.checked[0].shardings});
        } else {
          await this.$api.invalid({ids : this.checked[0].agOrderRecordId, shardings:this.checked[0].shardings});
        }
      }
    }
  };
</script>