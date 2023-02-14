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
        @selection-change="checked = $event"
        @row-click="handleRowClick"
      >
        <template
          slot="drawStatus-column"
          slot-scope="{row}"
        >
          <div
            :class="row.drawStatus | formatteStatusTagClass"
          >
            {{ row.drawStatus | formatteStatus }}
          </div>
        </template>
        <template
          slot="excepitonStatus-column"
          slot-scope="{row}"
        >
          <div
            :class="['tag-green', '', 'tag-gray', 'tag-blue', 'tag-aqua'][row.excepitonStatus]"
          >
            {{ ['正常', '', '停售', '取消', '跳开'][row.excepitonStatus] }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import { lotteryCode } from '@/utils/options';
  import { drawStatus, excepitonStatus } from './options';
  export default {
        filters: {
      formatteStatus(val) {
        if (val === 1) {
            return '待开奖';
        } else if (val === 9) {
            return '已开奖';
        } else if (val === 10) {
            return '算奖中';
        } else if (val === 100) {
            return '已算奖';
        } else if (val === 99) {
            return '追号未结算';
        }
      },
      formatteStatusTagClass(val) {
        if (val === 1) {
            return 'tag-gray';
        } else if (val === 9) {
            return 'tag-green';
        } else if (val === 10) {
            return 'tag-aqua';
        } else if (val === 100) {
            return 'tag-orange';
        } else if (val === 99) {
            return 'tag-blue';
        }
      },
    },
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          lotteryCode: '',
          drawPeriod: '',
          drawStatus: '',
          excepitonStatus: '',
          beginTime: '',
          endTime:''
        },
        queryColumns: [{
          type: 'group',
          prop: 'lotteryCode',
          label: '彩种',
          noAll: true,
          options: lotteryCode
        }, {
          type: 'input',
          prop: 'drawPeriod',
          label: '彩期'
        }, {
          type: 'date',
          prop: ['beginTime', 'endTime'],
          label: '开奖时间'
        }, {
          type: 'select',
          prop: 'drawStatus',
          label: '开奖状态',
          options: drawStatus
        }, {
          type: 'select',
          prop: 'excepitonStatus',
          label: '正常状态',
          options: excepitonStatus
        }],
        excepitonStatus,
        lotteryCode,
        drawStatus,
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          label: '彩种',
          prop: 'lotteryName',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '彩期编号',
          prop: 'drawPeriod',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '开奖状态',
          prop: 'drawStatus',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'drawStatus-column'
        }, {
          label: '开奖时间',
          prop: 'openTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row=> {
            return this.$format(row.openTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '拉奖时间',
          prop: 'realOpenTime',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '开奖结果',
          prop: 'drawNumber',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '正常状态',
          prop: 'excepitonStatus',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'excepitonStatus-column'
        }],
        data: [{
            map: {},
            lotteryDrawId: 19131788,
            lotteryName: '腾讯分分彩',
            lotteryCode: 'ssc_mlucky',
            drawPeriod: '202003051439',
            drawNumber: '',
            openTime: 1583423952000,
            localOpenTime: 1583423952000,
            drawStatus: 100,
            orderStatus: 1,
            createDate: 1583252369000,
            createUser: 'job-period',
            excepitonStatus: 0,
            transferFlag: 0,
            leagueCode: 'jj138'
          }
        ]
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
      // 编辑记录
      handleRowClick(row, column, event) {
        this.currentLottery = row;
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          Object.keys(this.form).forEach(key=> {
            this.form[key] = row[key];
          });
        });
      },
      // 按钮操作
      handleConfirm(name) {
        if (this.checkValidate()) {
          this.confirmName = name;
          this.confirmVisible = true;
        }
      },
      // 确认修改
      updateData () {
        this.$refs['dataForm'].validate(async valid => {
          if (valid) {
            await this.$api.editAccount(this.form);
            this.accountVisible = false;
            this.getList();
            this.$refs['dataForm'].resetFields();
          }
        });
      }
    }
  };
</script>