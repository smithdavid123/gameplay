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
          @click="handleConfirm('停止销售')"
        >
          <svg-icon icon-class="stop" />停止销售
        </div>
        <div
          class="primary-btn"
          @click="handleConfirm('恢复销售')"
        >
          <svg-icon icon-class="stop" />恢复销售
        </div>
        <div
          class="primary-btn"
          @click="handleConfirm('人工结算')"
        >
          <svg-icon icon-class="edit" />人工结算
        </div>
        <div
          class="primary-btn"
          @click="handleConfirm('取消')"
        >
          <svg-icon icon-class="delete" />取消
        </div>
        <div
          class="primary-btn"
          @click="handleConfirm('跳开')"
        >
          <svg-icon icon-class="delete" />跳开
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
        row-key="issue"
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
    mixins: [resize],
    data() {
      let validateNumber = (rule, value, callback) => {
          if (this.form.checkNumber) {
              this.$refs.jsonForm.$refs.dataForm.validateField('checkNumber');
          }
          callback();
      };
      let validateCheckNumber = (rule, value, callback) => {
          if (value !== this.form.number) {
              callback(new Error('两次输入开奖密码不一致!'));
          }
          callback();
      };
      return {
        loading: true,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          selfOpenEnable:1,
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
          },
          {
            type: 'input',
            prop: 'drawPeriod',
            label: '彩期'
          },
          {
            type: 'date',
            prop: ['beginTime', 'endTime'],
            label: '开奖时间'
          },
          {
            type: 'select',
            prop: 'drawStatus',
            label: '开奖状态',
            options: drawStatus
          },
          {
            type: 'select',
            prop: 'excepitonStatus',
            label: '正常状态',
            options: excepitonStatus
          }
        ],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
          },
          {
            label: '彩种',
            prop: 'name',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '彩期编号',
            prop: 'issue',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '开奖状态',
            prop: 'number',
            align: 'center',
            minWidth: '10%',
            visible: true,
            slotName: 'drawStatus-column'
          },
          {
            label: '开奖时间',
            prop: 'openTime',
            align: 'center',
            minWidth: '10%',
            visible: true
          },
          {
            label: '开奖结果',
            prop: 'number',
            align: 'center',
            minWidth: '10%',
            visible: true
          }
        ],
        data: [],
        // 编辑记录
        checked: [],
        currentLottery: {},
        editVisible: false,
        confirmVisible: false,
        confirmName: '',
        form: {
          lottery: '',
          issue: '',
          name: '',
          openTime: '',
          number: '',
          checkNumber: ''
        },
        formColumns :[{
          type: 'input',
          label: '彩种名称',
          prop: 'name',
          readonly: true
        },{
          type: 'input',
          label: '彩期编号',
          prop: 'issue',
          readonly: true
        },{
          type: 'datetime',
          label: '开奖时间',
          prop: 'openTime',
          readonly: true
        },{
          type: 'input',
          label: '开奖号码',
          prop: 'number',
          placeholder: '输入开奖号码',
          rules: [{
              required: true,
              message: '请输入开奖号码',
              trigger: 'blur'
          },
          {
              validator: validateNumber,
              trigger: 'blur'
          }
          ]
        },{
          type: 'input',
          label: '确认开奖号码',
          prop: 'checkNumber',
          placeholder: '输入开奖号码必须一致',
          rules: [{
              required: true,
              message: '请输入确认开奖号码',
              trigger: 'blur'
          },
          {
              validator: validateCheckNumber,
              trigger: 'blur'
          }
          ]
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
        } = await this.$api.lotteryQueryList();
        this.queryColumns[0].options = data.nav.reduce((total, current) => {
          !this.listQuery.lotteryCode && !current.isParent && (this.listQuery.lotteryCode = current.code, this.getList());
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
            this.form[key] = key === 'lottery' ? row.code : row[key];
          });
        });
      },
      // 确认编辑
      updateData () {
        this.$refs.jsonForm.validate(async _ => {
          const formData = {lottery: this.currentLottery.code,issue: this.currentLottery.issue,number: this.form.number};
          const { error } = await this.$api.setLotteryNumber(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
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
      async confirmData() {
        const ids = this.checked[0].lotteryDrawId;
        await this.$api.leaguedrawList({ ids });
      }
    }
  };
</script>