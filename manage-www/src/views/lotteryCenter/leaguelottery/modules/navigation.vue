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
          @click="checkValidate() && upOrDown()"
        >
          <svg-icon icon-class="edit" />上下架
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && topLeagueLottery()"
        >
          <svg-icon icon-class="up" />开奖
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
        height="calc(100vh - 244px)"
        :hidden-pagination="true"
        @selection-change="checked = $event"
      >
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="['tag-red', 'tag-green', 'tag-orange'][1-row.state]"
          >
            {{ ['维护中', '运行中', '内测中'][1-row.state] }}
          </div>
        </template>
        <template
          slot="openMode-column"
          slot-scope="{row}"
        >
          <div
            :class="['tag-green', 'tag-blue'][row.openMode]"
          >
            {{ ['正常开奖', '智能开奖'][row.openMode] }}
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
      <p v-if="confirmVisible">
        确认{{ confirmName }}{{ checked[0].name }}吗?
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="updateData"
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
  export default {
    mixins: [resize],
    data() {
      return {
        loading: true,
        listQuery: {
          lotteryCategoryCode: ''
        },
        queryColumns: [{
          type: 'select',
          prop: 'lotteryCategoryCode',
          label: '彩种分类',
          allName: '请选择',
          options: []
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        },{
          prop: 'name',
          label: '彩种',
          minWidth: '20%',
          align: 'center',
          visible: true
        },{
          prop: 'state',
          label: '状态',
          minWidth: '20%',
          align: 'center',
          visible: true,
          slotName: 'status-column'
        },{
          prop: 'openMode',
          label: '开奖',
          minWidth: '20%',
          align: 'center',
          visible: true,
          slotName: 'openMode-column'
        },{
          prop: 'description',
          label: '描述',
          minWidth: '40%',
          align: 'left',
          visible: true
        }],
        totalData: [],
        data: [],
        // 编辑记录
        checked: [],
        confirmVisible: false,
        confirmName: ''
      };
    },
    created() {
      this.getCategoryList();
    },
    methods: {
      // 获取彩种分类
      async getCategoryList() {
        const {
          data
        } = await this.$api.lotteryCategoryList();
        this.queryColumns[0].options = data.map((item, index)=> {
          !index && (this.listQuery.lotteryCategoryCode = item.code, this.getList());
          return {
            label: item.name,
            value: item.code
          };
        });
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.lotterynavList(this.listQuery);
        this.data = data;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      // 上下架
      upOrDown() {
        this.confirmName = this.checked[0].state > 0 ? '上架' : '下架';
        this.confirmVisible = true;
      },
      // 开奖模式
      topLeagueLottery() {
        this.confirmName = this.checked[0].openMode > 0 ? '正常开奖' : '智能开奖';
        this.confirmVisible = true;
      },
      // 确认修改修改
      async updateData () {
        if (['正常开奖', '智能开奖'].includes(this.confirmName)) {
          const {
            error
          } = await this.$api.setGameMode({lottery: this.checked[0].code, mode: 1 - this.checked[0].openMode });
          !error && this.$message.success('提交成功');
          this.getList();
          this.confirmVisible = false;
        } else {
          const {
            error
          } = await this.$api.saveUpDown({ lottery: this.checked[0].code, status: 1 - this.checked[0].state });
          !error && this.$message.success('提交成功');
          this.getList();
          this.confirmVisible = false;
        }
      }
    }
  };
</script>