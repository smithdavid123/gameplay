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
        @selection-change="checked = $event"
        @pagination="getList"
        @row-click="handleRowClick"
      >
        <template
          slot="drawStatus-column"
          slot-scope="{row}"
        >
          <div
            :class="[row.number !== '' ? 'tag-orange' : 'tag-gray']"
          >
            {{ row.number !== '' ? '已算奖' : '待开奖' }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="彩期管理-编辑"
      :visible.sync="editVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="120px"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="updateData"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="editVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="confirmVisible"
      width="300px"
      top="40vh"
    >
      <p v-if="confirmVisible">
        确认{{ confirmName }} (彩期:{{ checked[0].drawPeriod }})?
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="confirmData"
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
  </div>
</template>
<script>
  import resize from '../../../mixins';
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
    mixins: [resize],
    data() {
      return {
        loading: true,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          selfOpenEnable:2,
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
          options: []
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
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          label: '彩种',
          prop: 'name',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '彩期编号',
          prop: 'issue',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '开奖状态',
          prop: 'number',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'drawStatus-column'
        }, {
          label: '开奖时间',
          prop: 'openTime',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '开奖结果',
          prop: 'number',
          align: 'center',
          minWidth: '10%',
          visible: true
        }],
        data: [],
        // 编辑记录
        checked: [],
        currentLottery: {},
        editVisible: false,
        confirmVisible: false,
        confirmName: '',
        form: {
          LotteryDrawId: '',
          ExcepitonStatus: '',
          lotteryName: '',
          drawPeriod: 1,
          drawStatus: '',
          date: '',
          drawNumber: '',
          checkDrawNumber: ''
        },
        formColumns :[{
          type: 'input',
          label: '彩种名称',
          prop: 'lotteryName',
          readonly: true
        },{
          type: 'input',
          label: '彩期编号',
          prop: 'drawPeriod',
          readonly: true
        },{
          type: 'select',
          label: '彩期状态',
          prop: 'drawStatus',
          options: drawStatus,
          disabled: true
        },{
          type: 'datetime',
          label: '开奖时间',
          prop: 'date',
          readonly: true
        },{
          type: 'input',
          label: '开奖号码',
          prop: 'drawNumber',
          placeholder: '输入开奖号码'
        },{
          type: 'input',
          label: '确认开奖号码',
          prop: 'checkDrawNumber',
          placeholder: '输入开奖号码必须一致'
        }]
      };
    },
    created() {
      this.getLotteryQueryList();
    },
    methods: {
      // 获取彩种查询列表
      async getLotteryQueryList() {
        const {
          data
        } = await this.$api.platLotteryQueryList();
        this.queryColumns[0].options = data.nav.reduce((total, current) => {
          // !this.listQuery.lotteryCode && !current.isParent && (this.listQuery.lotteryCode = current.code, this.getList());
          if (current.isParent) {
            current.children = [];
            total.push({
              label: current.name,
              options: []
            });
          } else {
            total[total.length - 1].options.push({
                value: current.code,
                label: current.name
            });
          }
          return total;
        }, []);
        this.getList();
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.leaguedrawList(this.listQuery);
        const {
          totalCount,
          lottery
        } = data;
        this.total = totalCount;
        this.data = lottery;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.listQuery.pageNumber = 1;
        this.getList();
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
      // 确认编辑
      updateData () {
        this.$refs['dataForm'].validate(async valid => {
          if (valid) {
            await this.$api.editAccount(this.form);
            this.accountVisible = false;
            this.getList();
            this.$refs['dataForm'].resetFields();
          }
        });
      },
      // 确认修改
      async confirmData() {
        const ids = this.checked[0].lotteryDrawId;
        await this.$api.leaguedrawList({ ids });
      }
    }
  };
</script>