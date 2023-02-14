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
          @click="checkValidate() && handleUpdate()"
        >
          <svg-icon icon-class="edit" />编辑
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
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="frequency-column"
          slot-scope="{row}"
        >
          <div
            :class="[row.frequency === 'high'? 'tag-green': 'tag-orange']"
          >
            {{ row.frequency === 'high'? '是' : '否' }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="热门彩种设置-编辑"
      :visible.sync="editVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="100px"
          >
            <template
              slot="remark-column"
              slot-scope="{formData, item}"
            >
              <div class="tag-gray">
                *用于前台热门彩种推荐介绍，最好8个字，如：玩法简单，中奖率高
              </div>
              <el-input
                v-model.trim="formData[item.prop]"
                type="textarea"
                :rows="8"
                auto-complete="off"
              />
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
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import { hotFlag } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: true,
        total: 0,
        listQuery: {
          pageNumber: 1,
          pageSize: 20,
          name: '',
          hotFlag: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'lotteryName',
          label: '彩种名称'
        }, {
          type: 'select',
          prop: 'hotFlag',
          label: '是否热门',
          options: hotFlag
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center',
          Visible: true
        },{
          prop: 'id',
          label: 'id',
          minWidth: '20%',
          align: 'center',
          visible: false
        },{
          prop: 'showName',
          label: '彩种',
          minWidth: '20%',
          align: 'center',
          visible: true
        },{
          prop: 'lottery',
          label: '编码',
          minWidth: '20%',
          align: 'center',
          visible: false
        },{
          prop: 'sort',
          label: '热门排序',
          minWidth: '20%',
          align: 'center',
          visible: true
        }, {
          prop: 'frequency',
          label: '是否热门',
          minWidth: '20%',
          align: 'center',
          visible: true,
          slotName: 'frequency-column'
        },{
          prop: 'remark',
          label: '描述',
          minWidth: '20%',
          align: 'center',
          visible: true
        }],
        data: [],
        // 编辑记录
        checked: [],
        editVisible: false,
        form: {
          showName: '',
          lottery: '',
          sort: '',
          frequency: '',
          remark: ''
        },
        formColumns :[{
          type: 'input',
          label: '彩种名称',
          prop: 'showName',
          readonly: true
        }, {
          type: 'input',
          label: '热门排序',
          prop: 'sort'
        }, {
          type: 'switch',
          label: '热门开关',
          prop: 'frequency',
          values: ['high', 'low']
        }, {
          label: '备注信息',
          prop: 'remark',
          slotName: 'remark-column',
        }]
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.lotteryhotList(this.listQuery);
        this.total = data[0];
        this.data = data[1];
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.listQuery.pageNumber = 1;
        this.getList();
      },
      // 编辑记录
      handleUpdate() {
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          Object.keys(this.form).forEach(key => {
            this.form[key] = this.checked[0][key];
          });
        });
      },
      // 确认修改
      updateData () {
        this.$refs.jsonForm.validate(async _ => {
          const formData = {lotteryCode: this.form.lottery,sort: this.form.sort,frequency: this.form.frequency};
          const { error } = await this.$api.editLotteryHot(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
        });
      }
    }
  };
</script>