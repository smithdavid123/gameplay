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
          label: '?????????',
          allName: '?????????',
          options: thirdParty
        },{
          type: 'input',
          prop: 'billNo',
          label: '????????????'
        },{
          type: 'input',
          prop: 'memberName',
          label: '????????????'
        },{
          type: 'check',
          prop: 'include',
          label: '????????????'
        },{
          type: 'select',
          prop: 'flag',
          label: '??????',
          allName: '?????????',
          options: flag
        }, {
          type: 'date',
          prop: ['beginBetTime', 'endBetTime'],
          label: '????????????'
        },{
          type: 'date',
          prop: ['beginDrawTime', 'endDrawTime'],
          label: '????????????'
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center',
          visible:true
        },{
          prop: 'playerName',
          label: '?????????',
          minWidth: '12%',
          align: 'center',
          visible:true,
          slotName: 'playerName-column'
        },{
          prop: 'billNo',
          label: '????????????',
          minWidth: '12%',
          align: 'center',
          visible:true
        },{
          prop: 'map.thirdName',
          label: '?????????',
          minWidth: '12%',
          align: 'center',
          visible:true
        }, {
          prop: 'gameType',
          label: '????????????',
          minWidth: '8%',
          align: 'center',
          visible:true
        }, {
          prop: 'platformType',
          label: '????????????',
          minWidth: '8%',
          align: 'center',
          visible:true,
          slotName: 'platformType-column'
        }, {
          prop: 'betAmount',
          label: '????????????',
          minWidth: '8%',
          align: 'center',
          visible:true
        }, {
          prop: 'validBetAmount',
          label: '???????????????',
          minWidth: '8%',
          align: 'center',
          visible:true
        }, {
          prop: 'netAmount',
          label: '??????',
          minWidth: '12%',
          align: 'center',
          visible:true
        },{
          prop: 'betTime',
          label: '????????????',
          minWidth: '12%',
          align: 'center',
          visible:true,
          render: row=> {
            return this.$format(row.betTime, 'yyyy-MM-dd HH:mm:ss');
          }
        },{
          prop: 'drawTime',
          label: '????????????',
          minWidth: '12%',
          align: 'center',
          visible:true,
          render: row=> {
            return this.$format(row.drawTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          prop: 'flag',
          label: '????????????',
          minWidth: '8%',
          align: 'center',
          visible:true,
          slotName: 'flag-column'
        }, {
          prop: 'betContent',
          label: '??????????????????',
          minWidth: '8%',
          align: 'center',
          visible:true
        }],
        data: [{
            map: {
              thirdName: 'AG??????'
            },
            agOrderRecordId: 8373111,
            billNo: '200307094489176',
            playerName: 'jie00000',
            agentCode: 'AG',
            netAmount: -1000,
            betTime: 1583586271000,
            drawTime: 1583586296000,
            gameType: '??????',
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
        // ??????
        checked: [],
        confirmVisible: false,
        confirmType: 0
      };
    },
    computed: {
      confirmStype: function() {
        return this.confirmType ? '????????????????????? ???????????????????????????????' : '?????????????????????????????????????';
      }
    },
    created() {
      // this.getList()
    },
    methods: {
      // ????????????
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
      // ??????
      handleSearch() {
        // to do
      },
      handleDetail(row) {
        // to do
      },
      // ????????????
      invalid() {
        if (this.checkValidate()) {
          this.confirmType = 0;
          this.confirmVisible = true;
        }
      },
      // ?????????????????????
      cancelUnsettleOrder() {
        if (this.checkValidate()) {
          this.confirmType = 1;
          this.confirmVisible = true;
        }
      },
      // ????????????
      handleConfirm() {
        // to do
      }
    }
  };
</script>